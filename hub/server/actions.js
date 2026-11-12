import { assignedStore, isAdmin } from '../js/visibility.js';
export const ACTIONS = new Set([
  'createCase', 'updateCase', 'softDeleteCases', 'restoreCase', 'purgeCase', 'reviewCase', 'bulkUpdateCases',
  'saveModule', 'saveFeature', 'setArchived', 'saveMember', 'saveLabel', 'deleteLabel', 'updateProject',
  'markExported', 'clearDemoData', 'applyImport',
]);
const CONTRIBUTOR_ACTIONS = new Set(['updateCase', 'softDeleteCases', 'bulkUpdateCases']);
export async function executeAction(store, action, args) {
  if (!ACTIONS.has(action) || !Array.isArray(args)) throw Object.assign(new Error('Unsupported action.'), { status: 400 });
  if (!isAdmin(store) && !CONTRIBUTOR_ACTIONS.has(action)) throw Object.assign(new Error('Administrator access required.'), { status: 403 });
  if (!isAdmin(store)) {
    const ids = action === 'updateCase' ? [args[0]] : args[0];
    if (!Array.isArray(ids)) throw Object.assign(new Error('Case IDs are required.'), { status: 400 });
    if (!ids.every(id => store.get('testCases', id)?.assignedTo === store.actor().id)) {
      throw Object.assign(new Error('You can only change cases assigned to you.'), { status: 403 });
    }
  }
  // No client-controlled self-service profile creation or identity switching.
  if (action === 'saveMember') args = [args[0]];
  return assignedStore(store)[action](...args);
}
export function visibleSnapshot(store) {
  const scoped = assignedStore(store);
  const collections = structuredClone(scoped.data);
  if (!isAdmin(store)) collections.members = collections.members.filter(m => m.id === store.actor().id);
  return { collections, meta: structuredClone(store.meta), actorId: store.actor().id };
}
