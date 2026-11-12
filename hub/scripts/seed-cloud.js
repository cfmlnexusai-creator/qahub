import { readFile } from 'node:fs/promises';
import { supabase } from '../server/supabase.js';
import { COLLECTIONS } from '../js/schema.js';
import { computeKeyCounters } from '../js/import-export.js';
const file = process.argv[2] || new URL('../data/library.json', import.meta.url);
const doc = JSON.parse(await readFile(file, 'utf8'));
if (!process.argv[2]) {
  const navigation = JSON.parse(await readFile(new URL('../data/modules/navigation-page-checks.json', import.meta.url), 'utf8'));
  for (const name of ['modules', 'features', 'testCases']) doc[name].push(...navigation[name]);
}
if (!Array.isArray(doc.members) || !Array.isArray(doc.testCases) || doc.schemaVersion !== 1) throw new Error('Expected a QA Hub version 1 JSON export.');
const existing = await supabase('/rest/v1/qa_workspace?id=eq.default&select=id');
if (existing.length) throw new Error('Workspace already exists. Seeding refuses to overwrite shared work.');
await supabase('/rest/v1/qa_workspace', { method: 'POST', body: {
  id: 'default', revision: 1, snapshot: {
    collections: Object.fromEntries(COLLECTIONS.map(c => [c, doc[c] || []])),
    meta: { schemaVersion: 1, project: doc.project, seededAt: new Date().toISOString(),
      keyCounters: computeKeyCounters(doc.testCases, doc.deletedItems || []), settings: { backupReminderHours: 0 } },
  },
} });
console.log(`Seeded ${doc.testCases.length} cases. Link Supabase Auth users to existing member IDs before sign-in.`);
for (const member of doc.members) console.log(`${member.memberId}: ${member.id} (${member.role})`);
