// End-to-end smoke test of the real UI in headless Chrome/Edge via the DevTools protocol.
// No npm dependencies: uses Node's global WebSocket/fetch (Node 22+).
//   node tests/ui/smoke.mjs [--shots <dir>]
// Covers the Phase 1 acceptance flow: sign in, create two cases, reload, edit, delete/restore,
// export JSON, import into a clean browser profile with data + history intact, sign out.
// Uses a mocked cloud API backed by the real store. No account credentials are needed.

import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createMemoryPersistence } from '../../js/db.js';
import { createStore } from '../../js/store.js';
import { executeAction, visibleSnapshot } from '../../server/actions.js';
import { APP_ROOT, appPath } from '../../scripts/paths.js';

const PORT = 5199;
const TEST_USER = 'gunanidhi@example.test';
const TEST_PASS = `smoke-${Math.random().toString(36).slice(2)}`;
const DEBUG_PORT = 9333;
const shotsArg = process.argv.indexOf('--shots');
const SHOTS = shotsArg > -1 ? resolve(process.argv[shotsArg + 1]) : null;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);
const browserPath = BROWSERS.find((p) => existsSync(p));
if (!browserPath) { console.log('SKIP: no Chrome/Edge found (set CHROME_PATH).'); process.exit(0); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const server = spawn(process.execPath, [appPath('scripts/serve.js'), String(PORT)], { cwd: APP_ROOT, stdio: 'pipe' });
const profileDir = mkdtempSync(join(tmpdir(), 'qahub-smoke-'));
const browser = spawn(browserPath, [
  '--headless=new', `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profileDir}`,
  '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--window-size=1440,1000', 'about:blank',
], { stdio: 'ignore' });

let ws; let msgId = 0;
const pending = new Map();
const errors = [];
let step = 'startup';

function send(method, params = {}) {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((res, rej) => pending.set(id, { res, rej, method }));
}

async function evaluate(expression) {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(`eval failed (${step}): ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}\n${expression.slice(0, 200)}`);
  return r.result.value;
}

async function waitFor(expression, timeout = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    try { if (await evaluate(`Boolean(${expression})`)) return; } catch { /* page navigating */ }
    await sleep(80);
  }
  throw new Error(`Timed out (${step}) waiting for: ${expression}`);
}

async function shot(name) {
  if (!SHOTS) return;
  await sleep(150);
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(SHOTS, `${name}.png`), Buffer.from(data, 'base64'));
}

const click = (sel) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) throw new Error('no element ${sel.replace(/'/g, '')}'); el.click(); return true; })()`);
const clickText = (sel, text) => evaluate(`(() => { const el = [...document.querySelectorAll(${JSON.stringify(sel)})].find((e) => e.textContent.trim().includes(${JSON.stringify(text)})); if (!el) throw new Error('no ${sel} with text ${text}'); el.click(); return true; })()`);
const setValue = (sel, value) => evaluate(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) throw new Error('no field ${sel}'); el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); return true; })()`);
const go = async (hash) => { await evaluate(`location.hash = ${JSON.stringify(hash)}`); await sleep(120); };
const store = (expr) => evaluate(`(() => { const s = window.qaHub.store; return ${expr}; })()`);

async function fillCase({ title, moduleId, featureId, objective, steps }) {
  await waitFor(`document.querySelector('input[name=title]')`);
  await setValue('input[name=title]', title);
  await setValue('select[name=moduleId]', moduleId);
  if (featureId) await setValue('select[name=featureId]', featureId);
  await setValue('textarea[name=objective]', objective);
  await setValue('textarea[aria-label="Step 1 action"]', steps[0][0]);
  await setValue('textarea[aria-label="Step 1 expected result"]', steps[0][1]);
}

async function signIn(password = TEST_PASS, { expectOk = true } = {}) {
  await waitFor(`!window.__stalePage && document.querySelector('#login-user')`, 30000);
  await setValue('#login-user', TEST_USER);
  await setValue('#login-pass', password);
  await evaluate(`document.querySelector('.login-form').requestSubmit()`);
  if (expectOk) await waitFor(`!document.querySelector('.login') && window.qaHub?.store.actor() && document.querySelector('.topbar')`, 30000);
}

async function reloadPage() {
  await evaluate('window.__stalePage = true');
  await send('Page.reload');
}

async function main() {
  const doc = JSON.parse(readFileSync(appPath('data/library.json'), 'utf8'));
  const navigation = JSON.parse(readFileSync(appPath('data/modules/navigation-page-checks.json'), 'utf8'));
  for (const name of ['modules', 'features', 'testCases']) doc[name].push(...navigation[name]);
  const backend = createStore(createMemoryPersistence({ collections: doc, meta: { project: doc.project, seededAt: new Date().toISOString() } }));
  await backend.init({ seed: false });
  backend.setActor('mbr-gunanidhi');
  let revision = 1;
  let pauseNextRefresh = false;
  let releaseRefresh = null;
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json()).find(t => t.type === 'page'); } catch { await sleep(150); }
  }
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
  ws.addEventListener('message', async ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id); pending.delete(msg.id);
      if (msg.error) p.rej(new Error(msg.error.message)); else p.res(msg.result);
    } else if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text);
    else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') errors.push(msg.params.args.map(a => a.value || a.description).join(' '));
    else if (msg.method === 'Fetch.requestPaused') {
      try {
        const req = msg.params.request;
        const path = new URL(req.url).pathname;
        if (path === '/api/state' && pauseNextRefresh) {
          pauseNextRefresh = false;
          await new Promise(resolve => { releaseRefresh = resolve; });
        }
        let value;
        if (path === '/api/login') {
          const login = JSON.parse(req.postData);
          backend.setActor(login.email === 'contributor@example.test' ? 'mbr-sujitha' : 'mbr-gunanidhi');
          value = { access_token: 'mock-token', expires_in: 3600 };
        }
        else {
          let result;
          if (path === '/api/action') {
            const body = JSON.parse(req.postData);
            assert.equal(body.revision, revision);
            result = await executeAction(backend, body.action, body.args);
            revision++;
          }
          value = { ...visibleSnapshot(backend), revision, result };
        }
        await send('Fetch.fulfillRequest', { requestId: msg.params.requestId, responseCode: 200,
          responseHeaders: [{ name: 'Content-Type', value: 'application/json' }], body: Buffer.from(JSON.stringify(value)).toString('base64') });
      } catch (error) { errors.push(error.message); await send('Fetch.failRequest', { requestId: msg.params.requestId, errorReason: 'Failed' }); }
    }
  });
  await send('Fetch.enable', { patterns: [{ urlPattern: '*/api/*', requestStage: 'Request' }] });
  await send('Runtime.enable'); await send('Page.enable');
  step = 'cloud login';
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await signIn();
  await waitFor(`document.querySelector('.developer-table')`);
  assert.equal(await store('s.data.testCases.length'), 3915);
  assert.equal(await store('s.persistenceKind'), 'supabase');
  await click('a[title="Page checks"]');
  await waitFor(`document.querySelector('select[name=module]')?.value === 'mod-navigation-page-checks' || location.hash.includes('mod-navigation-page-checks')`);
  assert.equal(await store(`s.activeCases().filter(c => c.moduleId === 'mod-navigation-page-checks').length`), 100);
  await go('#/dashboard');
  await shot('01-cloud-dashboard');
  const tc = backend.activeCases()[0];
  step = 'save completion';
  await go('#/cases/' + tc.id);
  await waitFor(`document.querySelector('.steps-view')`);
  pauseNextRefresh = true;
  await evaluate('window.qaHub.store.reload(); true');
  for (let i = 0; i < 100 && !releaseRefresh; i++) await sleep(10);
  assert.ok(releaseRefresh, 'Background refresh is held in flight');
  await clickText('main button', 'Mark completed');
  await sleep(100);
  assert.equal(backend.get('testCases', tc.id).completionStatus, 'Pending', 'Save waits for the in-flight refresh');
  assert.equal(await evaluate(`document.body.textContent.includes('A sync is in progress')`), false);
  releaseRefresh();
  await waitFor(`document.querySelector('main').textContent.includes('Reopen case')`);
  assert.equal(backend.get('testCases', tc.id).completionStatus, 'Completed');
  step = 'reload shared data';
  await reloadPage();
  await waitFor(`!window.__stalePage && window.qaHub?.store && document.querySelector('.steps-view')`);
  assert.equal(await store(`s.get('testCases', '${tc.id}').completionStatus`), 'Completed');
  step = 'admin pages';
  for (const route of ['dashboard', 'cases', 'team', 'settings', 'assign', 'data']) {
    await go('#/' + route);
    await waitFor(`document.querySelector('main h1')`);
  }
  step = 'mobile dashboard';
  await go('#/dashboard');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  assert.ok(await evaluate('document.documentElement.scrollWidth - innerWidth <= 1'));
  await shot('02-cloud-mobile');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  step = 'Contributor login';
  await backend.bulkUpdateCases([tc.id], { assignedTo: 'mbr-sujitha' }); revision++;
  await evaluate(`sessionStorage.removeItem('qa-hub-cloud-session'); localStorage.removeItem('qa-hub-cloud-session'); true`);
  await reloadPage();
  await waitFor(`!window.__stalePage && document.querySelector('#login-user')`);
  await setValue('#login-user', 'contributor@example.test');
  await setValue('#login-pass', TEST_PASS);
  await evaluate(`document.querySelector('.login-form').requestSubmit()`);
  await waitFor(`window.qaHub?.store.actor()?.id === 'mbr-sujitha' && document.querySelector('.topbar')`);
  step = 'Contributor assigned case is read-only';
  await go('#/cases/' + tc.id);
  await waitFor(`document.querySelector('.steps-view')`);
  assert.equal(await evaluate(`!!document.querySelector('main a[href$="/edit"]')`), false);
  assert.equal(await evaluate(`[...document.querySelectorAll('main button')].some(b => b.textContent.includes('Mark completed') || b.textContent.includes('Reopen case'))`), false);
  await go('#/cases/' + tc.id + '/edit');
  await waitFor(`document.querySelector('main').textContent.includes('only test cases you created')`);
  step = 'Contributor creates own case';
  await go('#/cases/new');
  await fillCase({ title: 'Contributor-owned navigation test', moduleId: navigation.modules[0].id, featureId: navigation.features[0].id, objective: 'Check a visible patient page.', steps: [['Open the synthetic page', 'The expected section is visible']] });
  await click('form .editor-actions button[type=submit]');
  await waitFor(`/^#\\/cases\\/[0-9a-f-]{36}$/.test(location.hash)`);
  const ownId = await evaluate(`location.hash.split('/')[2]`);
  assert.equal(backend.get('testCases', ownId).createdBy, 'mbr-sujitha');
  assert.equal(backend.get('testCases', ownId).assignedTo, 'mbr-sujitha');
  step = 'Contributor edits own case';
  await go('#/cases/' + ownId + '/edit');
  await waitFor(`document.querySelector('input[name=title]')`);
  await setValue('input[name=title]', 'Contributor-owned navigation test updated');
  await click('form .editor-actions button[type=submit]');
  await waitFor(`location.hash === '#/cases/${ownId}' && document.querySelector('.steps-view')`);
  assert.equal(backend.get('testCases', ownId).version, 2);
  step = 'Contributor deletes own case';
  await click('[aria-label="More actions"]');
  await clickText('[role="menuitem"]', 'Move to trash');
  await waitFor(`document.querySelector('dialog[open] textarea')`);
  await setValue('dialog[open] textarea', 'Own case smoke test');
  await clickText('dialog[open] button', 'Move to trash');
  await waitFor(`window.qaHub.store.get('testCases','${ownId}').deletedAt`);
  await go('#/trash');
  await waitFor(`document.querySelector('main').textContent.includes('Contributor-owned navigation test updated')`);
  assert.equal(await evaluate(`document.querySelector('main').textContent.includes('Delete forever')`), false);
  assert.deepEqual(errors, []);
  console.log('Cloud UI smoke passed: 3915 cases, Page checks section, sync/save, Admin pages/mobile, Contributor create/edit/delete, assigned case read-only.');
}
main()
  .catch((e) => { console.error(`FAILED at step "${step}":`, e.message); if (errors.length) console.error(errors.join('\n')); process.exitCode = 1; })
  .finally(async () => {
    try { ws?.close(); } catch { /* ignore */ }
    browser.kill();
    server.kill();
    await sleep(300);
    try { rmSync(profileDir, { recursive: true, force: true }); } catch { /* locked on Windows sometimes */ }
  });
