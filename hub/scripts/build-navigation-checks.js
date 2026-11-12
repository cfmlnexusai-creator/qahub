import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { emptyDocument, normalizeCase } from '../js/schema.js';
import { validateDocument } from '../js/validation.js';

const root = new URL('../', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const spec = await read('data/navigation-checks.spec.json');
const library = await read('data/library.json');
if (spec.checks.length !== 100) throw new Error('Expected exactly 100 authored cases.');
const stamp = '2026-11-12T00:00:00.000Z';
const author = 'mbr-dossmk';
const moduleId = 'mod-navigation-page-checks';
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const record = values => ({ ...values, version: 1, createdAt: stamp, updatedAt: stamp, createdBy: author, updatedBy: author });
const doc = emptyDocument(library.project.name);
doc.project = library.project;
doc.scope = { type: 'module', moduleId };
doc.members = library.members.filter(m => m.id === author);
doc.modules = [record({ id: moduleId, name: 'Navigation & Page Checks', keyPrefix: 'NAV',
  description: '100 Patient Manager page/link smoke checks based on its ColdBox routes and views. Check page sections and controls without saving business data.',
  ownerId: author, targetCases: 100, archived: false })];
doc.features = [...new Set(spec.checks.map(c => c.group))].map(name => record({ id: `feat-nav-${slug(name)}`, moduleId, name, description: `Patient Manager navigation and page-visibility checks: ${name}.`, archived: false }));
doc.testSuites = library.testSuites.filter(s => ['Smoke', 'Sanity', 'Regression'].includes(s.name));
doc.testCases = spec.checks.map((check, i) => record(normalizeCase({
  id: `case-navigation-page-checks-${String(i + 1).padStart(4, '0')}`, caseKey: check.key,
  title: check.title, moduleId, featureId: `feat-nav-${slug(check.group)}`,
  objective: check.expected,
  description: `Target: Patient Manager. Route: ${check.route}. Source control/section: ${check.marker}. This is a manual navigation/visibility definition, not a recorded pass result.`,
  preconditions: 'Use a synthetic-data test company and a permitted Patient Manager account. Enable the required sidebar modules and dashboard widgets. Seed a synthetic patient, appointment, invoice, transaction or referral when the case follows a record link. Use existing UI-generated links to supply identifiers; never enter placeholder IDs literally. Do not use production patient or payment data.',
  steps: check.route === '/login' ? [
    { action: 'Sign out or open a private browser in the Patient Manager test environment.', expected: 'No authenticated patient/company page is displayed.' },
    { action: 'Open the application Login link or /login in this signed-out browser.', expected: 'The Login form loads without 404, blank content or a server error.' },
    { action: check.action, expected: check.expected },
    { action: 'Refresh the Login page once without submitting credentials.', expected: 'The Login page and its input controls remain visible and usable.' },
  ] : [
    { action: 'Sign in to the Patient Manager test environment and select the test company with the required page access.', expected: 'The authenticated application shell and permitted navigation are visible.' },
    { action: `Follow the relevant sidebar, patient-menu or record link to ${check.route}; use the seeded record where identifiers are required.`, expected: 'The correct page and record context load without 404, blank content, access denial for the permitted account, or a server error.' },
    { action: check.action, expected: check.expected },
    { action: 'Close any unsaved dialog and return through the page navigation or browser Back. Do not submit business-data, payment, notification or message actions.', expected: 'The originating list/dashboard remains reachable; page navigation works and no business record or outbound message is created.' },
  ],
  expectedResult: check.expected, priority: 'High', status: 'Ready for Review', completionStatus: 'Pending',
  testLevel: 'UI', suites: doc.testSuites.map(s => s.id), automationStatus: 'Not Planned',
  tags: ['navigation', 'page-visibility', 'patient-manager', 'manual-smoke'],
  assignedTo: '', requirementRef: `development_patientmanager/${check.source}#L${check.sourceLine}`, risk: 'Medium',
  testDataNotes: 'Use synthetic fixtures only. No patient identifiers, credentials or card data are embedded in these cases.',
})));
const validation = validateDocument(doc, library);
if (validation.errors.length) throw new Error(JSON.stringify(validation.errors));
await writeFile(new URL('data/modules/navigation-page-checks.json', root), JSON.stringify(doc, null, 2) + '\n');
await mkdir(new URL('docs/', root), { recursive: true });
const lines = ['# Patient Manager: Navigation & Page Checks', '',
  '100 manual test definitions grounded in the source routes and views of `development_patientmanager`. Execution status: **Pending**; these cases have not been run against Patient Manager.', '',
  'Use a synthetic-data company and a permitted account with the relevant menus/widgets enabled. Seed records for record-specific links. Do not literally enter placeholder identifiers. Do not save, charge, send, delete or publish business data while running these visibility checks.', ''];
for (const feature of doc.features) {
  lines.push(`## ${feature.name}`, '');
  for (const tc of doc.testCases.filter(c => c.featureId === feature.id)) {
    lines.push(`### ${tc.caseKey}: ${tc.title}`, '', tc.description, '', `Source: \`${tc.requirementRef}\``, '');
    tc.steps.forEach((step, i) => lines.push(`${i + 1}. ${step.action}`, `   Expected: ${step.expected}`, ''));
  }
}
await writeFile(new URL('docs/navigation-page-checks.md', root), lines.join('\n').trimEnd() + '\n');
console.log('Built NAV-001 through NAV-100, 10 feature groups, portable JSON and Markdown.');
