// Pure import/export helpers: build export documents, CSV, and merge plans.

import { SCHEMA_VERSION, COLLECTIONS, ENTITY_TYPE, CASE_CONTENT_FIELDS, idOf, normalizeCase } from './schema.js';
import { isEqual, csvCell, clone, nowIso } from './utils.js';
import { validateCase, validateDocument } from './validation.js';

/** Build a portable JSON document. With `moduleId`, only that module's slice is exported. */
export function buildExport(collections, meta, { moduleId = null } = {}) {
  const doc = {
    schemaVersion: SCHEMA_VERSION,
    project: clone(meta.project),
    scope: moduleId ? { type: 'module', moduleId } : { type: 'full' },
  };
  if (!moduleId) {
    for (const c of COLLECTIONS) doc[c] = clone(collections[c] || []);
  } else {
    const cases = collections.testCases.filter((tc) => tc.moduleId === moduleId);
    const caseIds = new Set(cases.map((tc) => tc.id));
    const features = collections.features.filter((f) => f.moduleId === moduleId);
    const featureIds = new Set(features.map((f) => f.id));
    doc.members = clone(collections.members);
    doc.accounts = clone(collections.accounts);
    doc.testSuites = clone(collections.testSuites);
    doc.modules = clone(collections.modules.filter((m) => m.id === moduleId));
    doc.features = clone(features);
    doc.testCases = clone(cases);
    doc.testRuns = clone(collections.testRuns.filter((r) => caseIds.has(r.caseId)));
    doc.activity = clone(collections.activity.filter((e) => e.moduleId === moduleId || caseIds.has(e.entityId) || featureIds.has(e.entityId) || e.entityId === moduleId));
    doc.deletedItems = clone(collections.deletedItems.filter((d) => d.moduleId === moduleId));
  }
  // Sort for stable, reviewable Git diffs.
  if (doc.testCases) doc.testCases.sort((a, b) => a.caseKey.localeCompare(b.caseKey, undefined, { numeric: true }));
  if (doc.activity) doc.activity.sort((a, b) => a.timestamp.localeCompare(b.timestamp) || a.eventId.localeCompare(b.eventId));
  doc.exportedAt = nowIso();
  return doc;
}

export const CSV_COLUMNS = [
  ['caseKey', 'Case key'], ['title', 'Title'], ['module', 'Module'], ['feature', 'Feature'], ['priority', 'Priority'],
  ['completionStatus', 'Completion'], ['status', 'Status'], ['testLevel', 'Test level'], ['suites', 'Suites'], ['automationStatus', 'Automation'],
  ['automationPath', 'Automation path'], ['assignee', 'Assignee'], ['tags', 'Tags'], ['accounts', 'Accounts'],
  ['objective', 'Objective'], ['preconditions', 'Preconditions'], ['steps', 'Steps'], ['expectedResult', 'Expected result'],
  ['requirementRef', 'Requirement ref'], ['bugRefs', 'Bug refs'], ['risk', 'Risk'], ['version', 'Version'],
  ['createdBy', 'Created by'], ['createdAt', 'Created at'], ['updatedBy', 'Updated by'], ['updatedAt', 'Updated at'],
];

export function casesToCsv(cases, lookup) {
  const rows = [CSV_COLUMNS.map(([, label]) => csvCell(label)).join(',')];
  for (const tc of cases) {
    const v = {
      ...tc,
      module: lookup.moduleName(tc.moduleId),
      feature: lookup.featureName(tc.featureId),
      suites: (tc.suites || []).map(lookup.suiteName),
      assignee: lookup.memberName(tc.assignedTo),
      accounts: (tc.accountIds || []).map(lookup.accountName),
      steps: (tc.steps || []).map((s, i) => `${i + 1}. ${s.action}${s.expected ? ` => ${s.expected}` : ''}`).join('\n'),
      createdBy: lookup.memberName(tc.createdBy),
      updatedBy: lookup.memberName(tc.updatedBy),
    };
    rows.push(CSV_COLUMNS.map(([key]) => csvCell(v[key])).join(','));
  }
  return `﻿${rows.join('\r\n')}\r\n`;
}

export function parseJson(text) {
  try {
    return { doc: JSON.parse(text) };
  } catch (e) {
    return { error: `File is not valid JSON: ${e.message}` };
  }
}

const CASE_IMPORT_LIMIT = 1000;
const LIST_FIELDS = ['tags', 'bugRefs', 'suites', 'accountIds'];
const heading = value => value.trim().toLowerCase().replace(/[ _-]/g, '');
const csvFields = new Map([...CSV_COLUMNS.flatMap(([key, label]) => [[heading(key), key], [heading(label), key]]),
  ...CASE_CONTENT_FIELDS.map(key => [heading(key), key])]);

function csvCaseRows(text) {
  const rows = [];
  let row = [];
  const cell = /(?:"((?:[^"]|"")*)"|([^",\r\n]*))(,|\r\n|\r|\n|$)/y;
  while (cell.lastIndex < text.length) {
    const match = cell.exec(text);
    if (!match) throw new Error(`Invalid CSV quoting in record ${rows.length + 1}.`);
    row.push(match[1] === undefined ? match[2] : match[1].replace(/""/g, '"'));
    if (match[3] === ',') {
      if (cell.lastIndex < text.length) continue;
      row.push('');
    }
    if (row.some(value => value.trim())) rows.push(row);
    row = [];
  }
  const headers = rows.shift() || [];
  const fields = headers.map(value => csvFields.get(heading(value)));
  const known = fields.filter(Boolean);
  if (!known.includes('title') || !known.some(key => key === 'module' || key === 'moduleId')) {
    throw new Error('CSV needs Title and Module (or Module ID) headers.');
  }
  if (new Set(known).size !== known.length) throw new Error('CSV contains duplicate column headings.');
  return rows.map((values, i) => {
    if (values.length !== headers.length) throw new Error(`CSV record ${i + 2} has the wrong number of columns.`);
    return Object.fromEntries(fields.flatMap((key, column) => {
      const value = values[column].trim();
      if (!key || !value) return [];
      if (key === 'steps') {
        return [[key, value.split(/\r\n|\r|\n/).filter(line => line.trim()).map(line => {
          const [action, ...expected] = line.replace(/^\s*\d+\.\s+/, '').split(' => ');
          return { action: action.trim(), expected: expected.join(' => ').trim() };
        })]];
      }
      if ([...LIST_FIELDS, 'accounts'].includes(key)) return [[key, value.split(';').map(item => item.trim()).filter(Boolean)]];
      return [[key, value]];
    }));
  });
}

export function parseCaseImport(text, format) {
  const source = text.replace(/^\uFEFF/, '');
  const value = format === 'csv' ? csvCaseRows(source) : JSON.parse(source);
  return Array.isArray(value) ? value : value?.testCases;
}

export function planCaseImport(collections, rows) {
  if (!Array.isArray(rows) || !rows.length || rows.length > CASE_IMPORT_LIMIT) {
    return { cases: [], errors: [`Provide between 1 and ${CASE_IMPORT_LIMIT} test cases.`] };
  }
  const cases = [];
  const errors = [];
  const used = new Set();
  const ctx = { ...collections, reservedKeys: new Set(collections.deletedItems.map(item => item.caseKey)) };
  function resolve(records, value, label, name = 'name') {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`Choose an existing ${label}.`);
    const ref = value.trim();
    const found = records.find(record => record.id === ref)
      || records.find(record => record[name]?.toLowerCase() === ref.toLowerCase());
    if (!found) throw new Error(`Unknown ${label}: ${ref}.`);
    return found;
  }

  rows.forEach((row, index) => {
    try {
      if (!row || typeof row !== 'object' || Array.isArray(row)) throw new Error('Expected a test case object.');
      const content = {};
      for (const key of [...CASE_CONTENT_FIELDS, 'caseKey']) {
        const value = row[key];
        if (value == null) continue;
        if (key === 'steps') {
          if (!Array.isArray(value) || value.some(step => !step || typeof step.action !== 'string'
            || (step.expected != null && typeof step.expected !== 'string'))) throw new Error('Steps must contain action and optional expected text.');
          content.steps = value.map(step => ({ action: step.action.trim(), expected: (step.expected || '').trim() }));
        } else if (LIST_FIELDS.includes(key)) {
          if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) throw new Error(`${key} must be a list of text values.`);
          content[key] = [...new Set(value.map(item => item.trim()).filter(Boolean))];
        } else {
          if (typeof value !== 'string') throw new Error(`${key} must be text.`);
          if (value.trim()) content[key] = value.trim();
        }
      }
      const module = resolve(collections.modules, content.moduleId || row.module, 'module');
      if (module.archived) throw new Error(`Module “${module.name}” is archived.`);
      content.moduleId = module.id;
      if (content.featureId || row.feature) content.featureId = resolve(
        collections.features.filter(feature => feature.moduleId === module.id), content.featureId || row.feature, 'feature in this module').id;
      if (content.assignedTo || row.assignee) content.assignedTo = resolve(
        collections.members.filter(member => member.active !== false), content.assignedTo || row.assignee, 'active assignee', 'displayName').id;
      content.suites = (content.suites || []).map(value => resolve(collections.testSuites, value, 'suite').id);
      content.accountIds = (content.accountIds || row.accounts || []).map(value => resolve(collections.accounts, value, 'account').id);
      const draft = normalizeCase({ ...content, caseKey: (content.caseKey || '').toUpperCase() });
      const problems = Object.values(validateCase(draft, ctx));
      if (draft.caseKey && used.has(draft.caseKey)) problems.push(`${draft.caseKey} occurs more than once in this file.`);
      if (problems.length) throw new Error(problems.join(' '));
      if (draft.caseKey) used.add(draft.caseKey);
      cases.push(draft);
    } catch (error) {
      errors.push(`Case ${index + 1}: ${error.message}`);
    }
  });
  return { cases, errors };
}

const versionOf = (r) => (Number.isInteger(r?.version) ? r.version : 0);

function compareRecords(local, incoming) {
  if (isEqual(local, incoming)) return 'same';
  const lv = versionOf(local);
  const iv = versionOf(incoming);
  if (iv > lv) return 'incomingNewer';
  if (iv < lv) return 'localNewer';
  const lt = local.updatedAt || '';
  const it = incoming.updatedAt || '';
  // Same version but different content: genuinely concurrent edits → manual decision.
  if (lv === iv && lv > 0) return 'conflict';
  if (it > lt) return 'incomingNewer';
  if (it < lt) return 'localNewer';
  return 'conflict';
}

const KIND_DEFAULT_TAKE = {
  new: true, same: false, incomingNewer: true, localNewer: false, conflict: false,
  keyClash: true, memberClash: false, skippedDeleted: false, remoteDeleted: true,
};

export const KIND_LABEL = {
  new: 'New',
  same: 'Identical (skip)',
  incomingNewer: 'Incoming is newer',
  localNewer: 'Local is newer (keep local)',
  conflict: 'Conflict — choose',
  keyClash: 'Case key clash',
  memberClash: 'Member ID clash',
  skippedDeleted: 'Permanently deleted locally',
  remoteDeleted: 'Deleted in incoming file',
};

function labelFor(c, r) {
  if (!r) return '';
  if (c === 'testCases') return `${r.caseKey} · ${r.title}`;
  if (c === 'members') return `${r.displayName} (${r.memberId})`;
  return r.name || r.id;
}

/**
 * Compare an incoming document with local data and produce a reviewable plan.
 * Nothing is changed here; the store applies the plan after the user confirms.
 */
export function planImport(local, incoming) {
  const { errors, warnings } = validateDocument(incoming, local);
  const plan = { errors, warnings, items: [], newActivity: [], newTombstones: [], counts: {}, scope: incoming?.scope || { type: 'full' }, project: incoming?.project || null };
  if (errors.length) return plan;

  const tombstoned = new Set(local.deletedItems.map((d) => d.id));
  const localKeys = new Map(local.testCases.map((tc) => [tc.caseKey, tc.id]));
  const localMemberIds = new Map(local.members.map((m) => [m.memberId, m.id]));

  for (const c of COLLECTIONS) {
    if (c === 'activity' || c === 'deletedItems') continue;
    const localById = new Map(local[c].map((r) => [idOf(c, r), r]));
    for (const raw of incoming[c] || []) {
      const rec = c === 'testCases' ? normalizeCase(raw) : clone(raw);
      const id = idOf(c, rec);
      const loc = localById.get(id);
      let kind;
      if (tombstoned.has(id)) kind = 'skippedDeleted';
      else if (!loc) {
        kind = 'new';
        if (c === 'testCases' && localKeys.has(rec.caseKey) && localKeys.get(rec.caseKey) !== id) kind = 'keyClash';
        if (c === 'members' && localMemberIds.has(rec.memberId) && localMemberIds.get(rec.memberId) !== id) kind = 'memberClash';
      } else {
        kind = compareRecords(c === 'testCases' ? normalizeCase(loc) : loc, rec);
        if (c === 'testCases' && kind !== 'same' && kind !== 'localNewer') {
          const owner = localKeys.get(rec.caseKey);
          if (owner && owner !== id) kind = 'keyClash';
        }
      }
      plan.items.push({
        collection: c, entityType: ENTITY_TYPE[c], id, kind, label: labelFor(c, rec), localLabel: labelFor(c, loc),
        incoming: rec, local: loc ? clone(loc) : null, take: KIND_DEFAULT_TAKE[kind],
      });
    }
  }

  // Tombstones from the incoming file that still exist locally.
  for (const t of incoming.deletedItems || []) {
    if (tombstoned.has(t.id)) continue;
    plan.newTombstones.push(clone(t));
    const c = Object.keys(ENTITY_TYPE).find((k) => ENTITY_TYPE[k] === t.entityType) || 'testCases';
    const loc = local[c]?.find((r) => r.id === t.id);
    if (loc) {
      plan.items.push({
        collection: c, entityType: t.entityType, id: t.id, kind: 'remoteDeleted', label: labelFor(c, loc), localLabel: labelFor(c, loc),
        incoming: null, local: clone(loc), tombstone: clone(t), take: KIND_DEFAULT_TAKE.remoteDeleted,
      });
    }
  }

  const localEvents = new Set(local.activity.map((e) => e.eventId));
  plan.newActivity = (incoming.activity || []).filter((e) => !localEvents.has(e.eventId)).map(clone);

  for (const item of plan.items) plan.counts[item.kind] = (plan.counts[item.kind] || 0) + 1;
  return plan;
}

/** Highest numeric suffix per key prefix across live cases and permanently deleted keys. */
export function computeKeyCounters(testCases, deletedItems, existing = {}) {
  const counters = { ...existing };
  const bump = (key) => {
    const m = /^([A-Z][A-Z0-9]*)-(\d+)$/.exec(key || '');
    if (!m) return;
    counters[m[1]] = Math.max(counters[m[1]] || 0, Number(m[2]));
  };
  testCases.forEach((tc) => bump(tc.caseKey));
  deletedItems.forEach((d) => bump(d.caseKey));
  return counters;
}
