// Add this module only. Existing cases, assignments, completion and roles stay intact.
import { readFile } from 'node:fs/promises';
import { readWorkspace, saveWorkspace } from '../server/supabase.js';
import { createStagedPersistence } from '../server/workspace.js';
import { createStore } from '../js/store.js';
import { planImport } from '../js/import-export.js';

const incoming = JSON.parse(await readFile(new URL('../data/modules/navigation-page-checks.json', import.meta.url), 'utf8'));
const { revision, snapshot } = await readWorkspace();
const persistence = createStagedPersistence(snapshot);
const store = createStore(persistence);
await store.init({ seed: false });
store.setActor('mbr-dossmk');
const plan = planImport(store.data, incoming);
if (plan.errors.length) throw new Error(JSON.stringify(plan.errors));
for (const item of plan.items) {
  // Once published, never overwrite someone's edited or executed copy on rerun.
  item.take = item.kind === 'new' && ['modules', 'features', 'testCases'].includes(item.collection);
}
const additions = plan.items.filter(item => item.take);
console.log(`Navigation section: ${additions.filter(i => i.collection === 'modules').length} new module, ${additions.filter(i => i.collection === 'features').length} features, ${additions.filter(i => i.collection === 'testCases').length} cases.`);
if (!process.argv.includes('--apply')) {
  console.log('Preview only. Pass --apply to publish new records to Supabase.');
} else if (additions.length) {
  await store.applyImport(plan, { mode: 'merge', incoming, sourceName: 'Patient Manager navigation checks NAV-001 through NAV-100' });
  await saveWorkspace(revision, persistence.changes);
  console.log('Published new records atomically. Existing records were preserved.');
} else console.log('Already published; no changes needed.');
