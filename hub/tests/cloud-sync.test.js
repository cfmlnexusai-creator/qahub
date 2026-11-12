import test from 'node:test';
import assert from 'node:assert/strict';
import { createCloudStore } from '../js/cloud.js';
import { createStore } from '../js/store.js';
import { createMemoryPersistence } from '../js/db.js';

const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
async function fixture() {
  const memory = createMemoryPersistence();
  const store = createStore(memory);
  await store.init();
  const snapshot = await memory.load();
  return { ...snapshot, actorId: store.data.members.find(m => m.role === 'Admin').id, revision: 1 };
}
test('save waits for an active refresh, then queued saves use the latest revision', async () => {
  const originalFetch = globalThis.fetch;
  let snapshot = await fixture();
  const refreshStarted = deferred(), releaseRefresh = deferred();
  const actionStarted = deferred(), releaseAction = deferred();
  const actions = [];
  let polls = 0;
  globalThis.fetch = async (url, options) => {
    if (url === '/api/state') return Response.json(snapshot);
    if (url.startsWith('/api/state?revision=')) {
      polls++;
      refreshStarted.resolve();
      await releaseRefresh.promise;
      snapshot = { ...snapshot, revision: 2 };
      return Response.json(snapshot);
    }
    const body = JSON.parse(options.body);
    actions.push(body);
    assert.equal(body.revision, snapshot.revision);
    if (actions.length === 1) { actionStarted.resolve(); await releaseAction.promise; }
    snapshot = { ...snapshot, revision: snapshot.revision + 1 };
    return Response.json({ ...snapshot, result: body.args[0] });
  };
  try {
    const store = await createCloudStore();
    const refresh = store.reload();
    await refreshStarted.promise;
    const first = store.bulkUpdateCases(['case-1'], { completionStatus: 'Completed' });
    const second = store.bulkUpdateCases(['case-2'], { completionStatus: 'Completed' });
    assert.equal(actions.length, 0, 'Saves wait instead of being rejected during sync');
    releaseRefresh.resolve();
    await refresh;
    await actionStarted.promise;
    const redundantPoll = store.reload();
    releaseAction.resolve();
    assert.deepEqual(await first, ['case-1']);
    assert.deepEqual(await second, ['case-2']);
    await redundantPoll;
    assert.equal(polls, 1, 'Polling does not delay queued saves');
    assert.deepEqual(actions.map(a => a.revision), [2, 3]);
  } finally { globalThis.fetch = originalFetch; }
});
test('a failed refresh does not block a later save; unchanged polls do not reload pages', async () => {
  const originalFetch = globalThis.fetch;
  let snapshot = await fixture();
  let fail = true;
  globalThis.fetch = async (url, options) => {
    if (url === '/api/state') return Response.json(snapshot);
    if (url.startsWith('/api/state?revision=')) {
      if (fail) { fail = false; return Response.json({ error: 'Temporary refresh failure' }, { status: 503 }); }
      return Response.json({ unchanged: true, revision: snapshot.revision });
    }
    const body = JSON.parse(options.body);
    assert.equal(body.revision, 1);
    snapshot = { ...snapshot, revision: 2 };
    return Response.json({ ...snapshot, result: 'saved' });
  };
  try {
    const store = await createCloudStore();
    await assert.rejects(store.reload(), /Temporary refresh failure/);
    assert.equal(await store.bulkUpdateCases([], {}), 'saved');
    let reloads = 0;
    store.subscribe(event => { if (event.type === 'reload') reloads++; });
    await store.reload();
    assert.equal(reloads, 0);
  } finally { globalThis.fetch = originalFetch; }
});
