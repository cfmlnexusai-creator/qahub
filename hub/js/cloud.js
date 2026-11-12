import { createStore } from './store.js';
import { createMemoryPersistence } from './db.js';
const SESSION = 'qa-hub-cloud-session';
export function cloudSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION) || localStorage.getItem(SESSION) || 'null');
    return session?.expiresAt > Date.now() ? session : null;
  } catch { return null; }
}
export function cloudSignOut() {
  sessionStorage.removeItem(SESSION);
  localStorage.removeItem(SESSION);
}
async function request(path, body) {
  const session = cloudSession();
  let encoded = body ? JSON.stringify(body) : undefined;
  let compressed = false;
  if (encoded?.length > 500000 && globalThis.CompressionStream) {
    const stream = new Blob([encoded]).stream().pipeThrough(new CompressionStream('gzip'));
    encoded = new Uint8Array(await new Response(stream).arrayBuffer());
    compressed = true;
  }
  const response = await fetch('/api/' + path, {
    method: body ? 'POST' : 'GET', headers: { 'Content-Type': compressed ? 'application/octet-stream' : 'application/json',
      ...(compressed ? { 'Content-Encoding': 'gzip' } : {}),
      ...(session ? { Authorization: `Bearer ${session.token}` } : {}) },
    ...(body ? { body: encoded } : {}),
  });
  const value = await response.json();
  if (!response.ok) {
    if (response.status === 401 && path !== 'login') { cloudSignOut(); location.reload(); }
    throw Object.assign(new Error(value.error || 'Request failed.'), { errors: value.errors, status: response.status });
  }
  return value;
}
export async function cloudLogin({ username, password, remember }) {
  const result = await request('login', { email: username.trim(), password });
  cloudSignOut();
  const session = { token: result.access_token, expiresAt: Date.now() + Math.min(result.expires_in, 43200) * 1000 };
  (remember ? localStorage : sessionStorage).setItem(SESSION, JSON.stringify(session));
}
const MUTATIONS = new Set(['createCase', 'updateCase', 'softDeleteCases', 'restoreCase', 'purgeCase', 'reviewCase',
  'bulkUpdateCases', 'saveModule', 'saveFeature', 'setArchived', 'saveMember', 'saveLabel', 'deleteLabel',
  'updateProject', 'markExported', 'clearDemoData', 'applyImport', 'setModuleShared', 'claimCase']);
export async function createCloudStore() {
  let snapshot = await request('state');
  const drafts = new Map();
  const persistence = {
    kind: 'supabase', load: async () => snapshot,
    commit: async () => { throw new Error('Shared changes must be saved through the server.'); },
    getDraft: async key => drafts.get(key) ?? null,
    putDraft: async (key, value) => { drafts.set(key, value); },
    deleteDraft: async key => { drafts.delete(key); },
  };
  const local = createStore(persistence);
  await local.init({ seed: false });
  local.setActor(snapshot.actorId);
  // Keep saves in order, including when a background refresh is already running.
  // A failed request must not prevent later queued work from running.
  let tail = Promise.resolve();
  let pendingWrites = 0;
  let refreshing = null;
  function enqueue(work) {
    const result = tail.then(work);
    tail = result.catch(() => {});
    return result;
  }
  async function applySnapshot(incoming) {
    if (incoming.unchanged) return;
    snapshot = incoming;
    await local.reload();
    local.setActor(snapshot.actorId);
  }
  function reload() {
    if (refreshing) return refreshing;
    if (pendingWrites) return tail;
    refreshing = enqueue(async () => {
      const incoming = await request(`state?revision=${snapshot.revision}`);
      if (incoming.revision !== snapshot.revision) await applySnapshot(incoming);
    }).finally(() => { refreshing = null; });
    return refreshing;
  }
  return new Proxy(local, {
    get(target, key) {
      if (key === 'reload') return reload;
      if (key === 'setActor') return () => {};
      if (key === 'hasUnexportedChanges') return () => false;
      if (key === 'resetAll') return async () => { throw new Error('Cloud workspace deletion is disabled.'); };
      if (MUTATIONS.has(key)) return (...args) => {
        const input = structuredClone(args);
        pendingWrites++;
        return enqueue(async () => {
          try {
            const incoming = await request('action', { action: key, args: input, revision: snapshot.revision });
            await applySnapshot(incoming);
            return incoming.result;
          } catch (error) {
            if (error.status === 409) await applySnapshot(await request('state'));
            throw error;
          }
        }).finally(() => { pendingWrites--; });
      };
      return target[key];
    },
  });
}
export async function emptyLoginStore() {
  const store = createStore(createMemoryPersistence());
  await store.init({ seed: false });
  return store;
}
