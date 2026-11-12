import { gzipSync, gunzipSync } from 'node:zlib';
import { supabase, readWorkspace, saveWorkspace } from '../server/supabase.js';
import { createStagedPersistence } from '../server/workspace.js';
import { createStore } from '../js/store.js';
import { executeAction, visibleSnapshot } from '../server/actions.js';

async function readBody(req) {
  if (req.headers['content-encoding'] === 'gzip') {
    const chunks = [];
    let size = 0;
    if (Buffer.isBuffer(req.body)) chunks.push(req.body);
    else for await (const chunk of req) {
      size += chunk.length;
      if (size > 3_500_000) throw Object.assign(new Error('Request is too large.'), { status: 413 });
      chunks.push(chunk);
    }
    try { return JSON.parse(gunzipSync(Buffer.concat(chunks), { maxOutputLength: 30_000_000 }).toString('utf8')); }
    catch { throw Object.assign(new Error('Invalid or oversized compressed request.'), { status: 400 }); }
  }
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body) > 3_500_000) throw Object.assign(new Error('Request is too large.'), { status: 413 });
  }
  return body ? JSON.parse(body) : {};
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  const send = (status, body) => {
    res.statusCode = status;
    const json = JSON.stringify(body);
    if (Buffer.byteLength(json) > 1024 && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Vary', 'Accept-Encoding');
      res.end(gzipSync(json));
    } else res.end(json);
  };
  try {
    const url = new URL(req.url, 'http://localhost');
    const path = url.pathname;
    if (req.method === 'POST') {
      const origin = req.headers.origin;
      if (origin && new URL(origin).host !== req.headers.host) return send(403, { error: 'Cross-origin writes are not allowed.' });
    }
    if (path === '/api/login' && req.method === 'POST') {
      const { email, password } = await readBody(req);
      if (typeof email !== 'string' || typeof password !== 'string') return send(400, { error: 'Email and password are required.' });
      const session = await supabase('/auth/v1/token?grant_type=password', { method: 'POST', publicKey: true, body: { email, password } });
      return send(200, { access_token: session.access_token, expires_in: session.expires_in });
    }
    if (!['/api/state', '/api/action'].includes(path)) return send(404, { error: 'Not found.' });
    if ((path === '/api/state' && req.method !== 'GET') || (path === '/api/action' && req.method !== 'POST')) return send(405, { error: 'Method not allowed.' });
    const token = /^Bearer (.+)$/.exec(req.headers.authorization || '')?.[1];
    if (!token) return send(401, { error: 'Sign in to continue.' });
    const user = await supabase('/auth/v1/user', { token, publicKey: true });
    const identities = await supabase(`/rest/v1/qa_identities?user_id=eq.${encodeURIComponent(user.id)}&select=member_id`);
    const memberId = identities?.[0]?.member_id;
    if (!memberId) return send(403, { error: 'Your account is not linked to a QA Hub team member. Contact an Admin.' });
    const knownRevision = url.searchParams.get('revision');
    if (path === '/api/state' && knownRevision !== null) {
      const summary = await readWorkspace({ summary: true });
      const member = summary.members.find(m => m.id === memberId);
      if (!member || member.active === false) return send(403, { error: 'Your team membership is inactive.' });
      if (String(summary.revision) === knownRevision) return send(200, { unchanged: true, revision: summary.revision });
    }
    const { revision, snapshot } = await readWorkspace();
    const persistence = createStagedPersistence(snapshot);
    const store = createStore(persistence);
    await store.init({ seed: false });
    if (!store.get('members', memberId) || store.get('members', memberId).active === false) return send(403, { error: 'Your team membership is inactive.' });
    store.setActor(memberId);
    let result;
    if (path === '/api/action') {
      const body = await readBody(req);
      if (body.revision !== revision) return send(409, { error: 'Shared data changed. Refresh and retry your change.' });
      result = await executeAction(store, body.action, body.args);
      await saveWorkspace(revision, persistence.changes);
    }
    return send(200, { ...visibleSnapshot(store), revision: revision + (path === '/api/action' ? 1 : 0), result });
  } catch (error) {
    const status = error.status || ({ ValidationError: 400, PermissionError: 403, ConflictError: 409, SyntaxError: 400 }[error.name]) || 500;
    send(status, { error: status === 500 ? 'The server could not complete this request.' : error.message, ...(error.errors ? { errors: error.errors } : {}) });
  }
}
