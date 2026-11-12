// Shared by the UI and authenticated Node API.
export const isAdmin = (store) => store.actor()?.active !== false && store.actor()?.role === 'Admin';
export const canEditCase = (store, record) => Boolean(record && store.can('case.edit') && (isAdmin(store) || record.assignedTo === store.actor()?.id));
export const canDeleteCase = (store, record) => Boolean(record && store.can('case.edit') && (isAdmin(store) || record.createdBy === store.actor()?.id));
export const canClaimCase = (store, record) => {
  const module = record && store.get('modules', record.moduleId);
  return Boolean(record && store.can('case.claim') && !record.assignedTo && !record.deletedAt && record.status !== 'Deprecated' && module?.sharedWithTeam && !module.archived);
};

export function assignedStore(store) {
  const visible = (c) => !!c && !!store.actor() && store.actor().active !== false && (isAdmin(store) || c.assignedTo === store.actor().id || c.createdBy === store.actor().id || (!c.deletedAt && targetModuleShared(c)));
  const targetModuleShared = c => { const module = store.get('modules', c.moduleId); return module?.sharedWithTeam && !module.archived; };
  return new Proxy(store, {
    get(target, key) {
      if (key === 'data') {
        if (isAdmin(store)) return target.data;
        const testCases = target.data.testCases.filter(visible);
        const ids = new Set(testCases.map((c) => c.id));
        return { ...target.data, testCases,
          activity: target.data.activity.filter((e) => ids.has(e.entityId)),
          deletedItems: [], testRuns: [] };
      }
      if (key === 'get') return (collection, id) => {
        const record = target.get(collection, id);
        return collection === 'testCases' && !visible(record) ? null : record;
      };
      if (key === 'activeCases') return () => target.activeCases().filter(visible);
      if (key === 'can') return (permission) => {
        if (permission === 'case.create') return target.can('case.edit');
        if (!isAdmin(store) && !['case.edit', 'case.bulk', 'case.claim'].includes(permission)) return false;
        return target.can(permission);
      };
      if (['updateCase', 'softDeleteCases', 'bulkUpdateCases', 'reviewCase', 'restoreCase', 'purgeCase'].includes(key)) {
        return async (idOrIds, ...args) => {
          const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
          const deleting = ['softDeleteCases', 'restoreCase', 'purgeCase'].includes(key);
          const allowed = deleting ? canDeleteCase : canEditCase;
          if (!ids.every((id) => allowed(target, target.get('testCases', id)))) throw Object.assign(new Error(deleting ? 'You can only delete or restore test cases you created.' : 'You can only edit test cases assigned to you.'), { status: 403 });
          return target[key](idOrIds, ...args);
        };
      }
      return target[key];
    },
  });
}

export function developerProgress(store) {
  const cases = store.activeCases();
  const rows = store.data.members.filter((m) => m.active !== false || cases.some((c) => c.assignedTo === m.id))
    .map((m) => ({ id: m.id, name: m.displayName, active: m.active !== false }));
  rows.push({ id: '', name: 'Unassigned', active: true });
  return rows.map((row) => {
    const assigned = cases.filter((c) => (c.assignedTo || '') === row.id);
    const completed = assigned.filter((c) => c.completionStatus === 'Completed').length;
    return { ...row, total: assigned.length, completed, pending: assigned.length - completed,
      percent: assigned.length ? Math.round(completed / assigned.length * 100) : 0 };
  });
}
