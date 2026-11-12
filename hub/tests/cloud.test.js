import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import handler from '../api/index.js';
import { createStore } from '../js/store.js';
import { createMemoryPersistence } from '../js/db.js';
import { executeAction, visibleSnapshot } from '../server/actions.js';
import { appPath } from '../scripts/paths.js';

async function fixture() {
  const persistence = createMemoryPersistence();
  const store = createStore(persistence);
  await store.init();
  const admin = store.data.members.find(m => m.role === 'Admin');
  const contributor = store.data.members.find(m => m.role === 'Contributor');
  const viewer = store.data.members.find(m => m.role === 'Viewer');
  store.setActor(admin.id);
  const foreign = store.activeCases()[0];
  await store.bulkUpdateCases([foreign.id], { assignedTo: contributor.id });
  store.setActor(contributor.id);
  const tc = await executeAction(store, 'createCase', [{ ...foreign, caseKey: '', status: 'Draft', title: 'Contributor-created test case', createdBy: admin.id, assignedTo: admin.id }]);
  assert.equal(tc.createdBy, contributor.id, 'Client cannot forge the creator');
  assert.equal(tc.assignedTo, contributor.id, 'Contributor cannot assign to another user');
  return { store, persistence, admin, contributor, viewer, tc, foreign };
}
test('server checks assignments, roles and authenticated activity actors', async () => {
  const { store, contributor, admin, viewer, tc, foreign } = await fixture();
  store.setActor(contributor.id);
  const state = visibleSnapshot(store);
  assert.equal(state.collections.testCases.length, 2);
  assert.deepEqual(state.collections.members.map(m => m.id), [contributor.id]);
  assert.ok(state.collections.activity.every(e => [tc.id, foreign.id].includes(e.entityId)));
  await assert.rejects(executeAction(store, 'saveMember', [{ displayName: 'Attacker', role: 'Admin' }, { selfService: true }]), /Administrator/);
  await assert.rejects(executeAction(store, 'setActor', [admin.id]), /Unsupported/);
  await assert.rejects(executeAction(store, 'bulkUpdateCases', [[tc.id, foreign.id], { completionStatus: 'Completed' }]), /you created/);
  await assert.rejects(executeAction(store, 'updateCase', [foreign.id, { createdBy: contributor.id, title: 'Spoofed ownership' }]), /you created/);
  await assert.rejects(executeAction(store, 'softDeleteCases', [[foreign.id]]), /you created/);
  await executeAction(store, 'bulkUpdateCases', [[tc.id], { completionStatus: 'Completed' }]);
  assert.equal(store.get('testCases', tc.id).completionStatus, 'Completed');
  assert.equal(store.data.activity.at(-1).actorId, contributor.id);
  await executeAction(store, 'softDeleteCases', [[tc.id], 'Own case deletion']);
  assert.ok(store.get('testCases', tc.id).deletedAt);
  await executeAction(store, 'restoreCase', [tc.id]);
  assert.equal(store.get('testCases', tc.id).deletedAt, null);
  await assert.rejects(executeAction(store, 'purgeCase', [tc.id, tc.caseKey]), /Administrator/);
  await assert.rejects(executeAction(store, 'bulkUpdateCases', [[tc.id], { assignedTo: admin.id }]), /Admin/);
  store.setActor(viewer.id);
  await assert.rejects(executeAction(store, 'bulkUpdateCases', [[], { completionStatus: 'Completed' }]), /cannot do this/);
});

test('HTTP API authenticates, persists, rejects stale saves and compresses large data', async () => {
  const { persistence, contributor, tc } = await fixture();
  let snapshot = await persistence.load();
  let revision = 1;
  let commits = 0;
  const originalFetch = globalThis.fetch;
  process.env.SUPABASE_URL = 'https://supabase.test';
  process.env.SUPABASE_ANON_KEY = 'test-anon';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-server-secret';
  globalThis.fetch = async (url, options = {}) => {
    if (!String(url).startsWith('https://supabase.test')) return originalFetch(url, options);
    const path = new URL(url).pathname;
    if (path === '/auth/v1/user') return Response.json({ id: 'auth-user' });
    if (path === '/rest/v1/qa_identities') return Response.json([{ member_id: contributor.id }]);
    if (path === '/rest/v1/qa_workspace') {
      if (new URL(url).searchParams.get('select').includes('members:')) return Response.json([{ revision, members: snapshot.collections.members }]);
      return Response.json([{ snapshot, revision }]);
    }
    if (path === '/rest/v1/rpc/qa_commit_workspace') {
      const { p_expected_revision, p_changes } = JSON.parse(options.body);
      if (p_expected_revision !== revision) return Response.json(false);
      const memory = createMemoryPersistence(snapshot);
      for (const change of p_changes) await memory.commit(change);
      snapshot = await memory.load();
      revision++;
      commits++;
      assert.equal('snapshot' in JSON.parse(options.body), false, 'Only record changes are sent');
      return Response.json(true);
    }
    throw new Error('Unexpected upstream request: ' + url);
  };
  const server = createServer(handler);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await originalFetch(base + '/api/state')).status, 401);
    const headers = { Authorization: 'Bearer verified-token', 'Content-Type': 'application/json' };
    const response = await originalFetch(base + '/api/state', { headers });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-encoding'), 'gzip');
    const state = await response.json();
    assert.equal(state.collections.testCases.length, 2);
    const unchanged = await originalFetch(base + '/api/state?revision=' + state.revision, { headers });
    assert.deepEqual(await unchanged.json(), { unchanged: true, revision });
    const body = { revision: state.revision, action: 'bulkUpdateCases', args: [[tc.id], { completionStatus: 'Completed' }] };
    const saved = await originalFetch(base + '/api/action', { method: 'POST', headers, body: JSON.stringify(body) });
    assert.equal(saved.status, 200);
    assert.equal(snapshot.collections.testCases.find(c => c.id === tc.id).completionStatus, 'Completed');
    assert.equal((await originalFetch(base + '/api/action', { method: 'POST', headers, body: JSON.stringify(body) })).status, 409);
    assert.equal((await originalFetch(base + '/api/action', { method: 'POST', headers: { ...headers, Origin: 'https://other.example' }, body: JSON.stringify(body) })).status, 403);
    assert.equal((await originalFetch(base + '/api/action', { method: 'POST', headers, body: JSON.stringify({ revision, action: 'saveMember', args: [{ role: 'Admin' }] }) })).status, 403);
    const compressedSave = await originalFetch(base + '/api/action', {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/octet-stream', 'Content-Encoding': 'gzip' },
      body: gzipSync(JSON.stringify({ revision, action: 'bulkUpdateCases', args: [[tc.id], { completionStatus: 'Pending' }] })),
    });
    assert.equal(compressedSave.status, 200);
    assert.equal(snapshot.collections.testCases.find(c => c.id === tc.id).completionStatus, 'Pending');
    assert.equal(commits, 2);
    const member = snapshot.collections.members.find(m => m.id === contributor.id);
    member.active = false;
    assert.equal((await originalFetch(base + '/api/state?revision=' + revision, { headers })).status, 403, 'Lightweight polls still check active membership');
    const library = readFileSync(appPath('data/library.json'));
    assert.ok(library.length > 4_500_000);
    assert.ok(gzipSync(library).length < 4_500_000);
  } finally {
    globalThis.fetch = originalFetch;
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
