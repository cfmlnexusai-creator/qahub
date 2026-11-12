import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateDocument } from '../js/validation.js';
import { createStore } from '../js/store.js';
import { createMemoryPersistence } from '../js/db.js';
import { executeAction } from '../server/actions.js';

const read = async path => JSON.parse(await readFile(new URL('../' + path, import.meta.url), 'utf8'));
test('100 navigation checks are portable, unique, pending and cover ten feature groups', async () => {
  const doc = await read('data/modules/navigation-page-checks.json');
  const spec = await read('data/navigation-checks.spec.json');
  assert.deepEqual(validateDocument(doc).errors, []);
  assert.equal(doc.testCases.length, 100);
  assert.equal(new Set(doc.testCases.map(c => c.caseKey)).size, 100);
  assert.equal(new Set(doc.testCases.map(c => c.title)).size, 100);
  assert.equal(doc.features.length, 10);
  for (const feature of doc.features) assert.equal(doc.testCases.filter(c => c.featureId === feature.id).length, 10);
  doc.testCases.forEach((tc, i) => {
    assert.equal(tc.caseKey, `NAV-${String(i + 1).padStart(3, '0')}`);
    assert.equal(tc.completionStatus, 'Pending');
    assert.equal(tc.steps.length, 4);
    assert.match(tc.requirementRef, /^development_patientmanager\/views\/.+\.cfm#L\d+$/);
    assert.equal(tc.objective, spec.checks[i].expected);
  });
});
test('a Contributor with no assigned cases can create in the navigation module and manage only their own cases', async () => {
  const library = await read('data/library.json');
  const doc = await read('data/modules/navigation-page-checks.json');
  const collections = { ...library };
  for (const name of ['modules', 'features', 'testCases']) collections[name] = [...library[name], ...doc[name]];
  const store = createStore(createMemoryPersistence({ collections, meta: { project: library.project } }));
  await store.init({ seed: false });
  store.setActor('mbr-selshiya');
  const template = doc.testCases[0];
  const own = await executeAction(store, 'createCase', [{ ...template, caseKey: '', title: 'Contributor new navigation case', status: 'Draft' }]);
  assert.equal(own.createdBy, 'mbr-selshiya');
  assert.equal(own.assignedTo, 'mbr-selshiya');
  await executeAction(store, 'updateCase', [own.id, { title: 'Contributor updated navigation case' }, { expectedVersion: 1 }]);
  assert.equal(store.get('testCases', own.id).version, 2);
  await executeAction(store, 'softDeleteCases', [[own.id], 'Own case only']);
  assert.ok(store.get('testCases', own.id).deletedAt);
  await assert.rejects(executeAction(store, 'updateCase', [template.id, { title: 'Attempt to edit Admin-created case' }]), /you created/);
  await assert.rejects(executeAction(store, 'softDeleteCases', [[template.id]]), /you created/);
});
