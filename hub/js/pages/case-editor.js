import { h, icon, clone, isEqual, debounce, fmtRelative } from '../utils.js';
import { COMPLETION_STATUSES, CASE_CONTENT_FIELDS, blankCase, normalizeCase, LIMITS } from '../schema.js';
import { card, field, fieldError, select, showErrors, banner, emptyState } from '../components/ui.js';
import { toast, toastError } from '../components/toast.js';
import { canEditCase } from '../visibility.js';

// The editor manages its own state; a store change from another tab must not wipe inputs.
export const keepAliveOnChange = true;

const FORM_FIELDS = ['title', 'moduleId', 'completionStatus', 'steps', 'assignedTo'];
const formValues = (record) => Object.fromEntries(FORM_FIELDS
  .filter((field) => record[field] !== undefined)
  .map((field) => [field, clone(record[field])]));

export function render(ctx) {
  const { store, root, params, query, setCrumbs, router } = ctx;
  const isEdit = Boolean(params.id);
  const existing = isEdit ? store.get('testCases', params.id) : null;
  const source = !isEdit && query.from ? store.get('testCases', query.from) : null;

  if (!store.can('case.edit')) {
    setCrumbs([{ label: 'Test Cases', href: '#/cases' }, { label: isEdit ? 'Edit' : 'New case' }]);
    root.append(card({ body: emptyState({ iconName: 'user', title: 'Your profile cannot edit cases', text: `Role: ${store.actor()?.role || 'none'}. Roles are a convenience setting; switch profile if you should be editing.`, action: h('button', { type: 'button', class: 'btn', onClick: () => ctx.profilePicker({ switching: true }) }, 'Switch profile') }) }));
    return;
  }
  if (isEdit && (!existing || existing.deletedAt)) {
    setCrumbs([{ label: 'Test Cases', href: '#/cases' }, { label: 'Edit' }]);
    root.append(card({ body: emptyState({ iconName: 'alert', title: existing ? 'This case is in the trash' : 'Case not found', text: existing ? 'Restore it before editing.' : '', action: h('a', { class: 'btn', href: existing ? `#/cases/${existing.id}` : '#/cases' }, 'Back') }) }));
    return;
  }
  if (existing && !canEditCase(store, existing)) {
    setCrumbs([{ label: 'Test Cases', href: '#/cases' }, { label: existing.caseKey }]);
    root.append(banner('warn', 'You can edit only test cases assigned to you. Ask an Admin to assign this case, or claim it from a shared module.'));
    return;
  }

  if (query.from && !isEdit && (!source || source.deletedAt)) {
    setCrumbs([{ label: 'Test Cases', href: '#/cases' }, { label: 'Duplicate' }]);
    root.append(card({ body: emptyState({ iconName: 'alert', title: 'Case unavailable for duplication', action: h('a', { class: 'btn', href: '#/cases' }, 'Back') }) }));
    return;
  }

  const template = normalizeCase(existing || source || blankCase());
  let initial = formValues(template);
  if (source) {
    initial.title = `Copy of ${source.title}`.slice(0, LIMITS.titleMax);
    initial.completionStatus = 'Pending';
  }
  const activeModules = store.data.modules.filter((m) => !m.archived);
  if (!existing && !source) {
    initial.moduleId = activeModules.find((m) => m.id === query.module)?.id
      || (activeModules.length === 1 ? activeModules[0].id : '');
  }
  const initialModuleId = initial.moduleId;
  const featureId = template.featureId || (!existing && !source ? query.feature : '');
  const feature = featureId ? store.get('features', featureId) : null;
  if (!existing && !store.can('case.assign')) initial.assignedTo = store.actor().id;
  if (!initial.steps.length) initial.steps = [{ action: '', expected: '' }];
  let model = clone(initial);
  const draftKey = existing ? `case:${existing.id}` : source ? `case:new:from:${source.id}` : 'case:new';
  let saving = false;
  let draftPending = false;

  const mod = () => store.get('modules', model.moduleId);
  setCrumbs([
    { label: 'Test Cases', href: '#/cases' },
    ...(existing ? [{ label: mod()?.name || 'Module', href: `#/cases?module=${existing.moduleId}` }, { label: existing.caseKey, href: `#/cases/${existing.id}` }, { label: 'Edit' }] : [{ label: source ? `Duplicate ${source.caseKey}` : 'New case' }]),
  ]);

  const isDirty = () => !isEqual(normalizeForCompare(model), normalizeForCompare(initial));
  const dirtyIndicator = h('span', { class: 'row small muted', hidden: true }, h('span', { class: 'dirty-dot', 'aria-hidden': 'true' }), 'Unsaved changes');
  const saveDraft = debounce(() => {
    draftPending = false;
    if (isDirty()) store.drafts.put(draftKey, { values: model, savedAt: new Date().toISOString(), baseVersion: existing?.version ?? null });
    else store.drafts.remove(draftKey);
  }, 500);
  const changed = () => {
    dirtyIndicator.hidden = !isDirty();
    draftPending = true;
    saveDraft();
  };

  // ---- inputs ----
  const form = h('form', { novalidate: true, class: 'stack', 'aria-label': existing ? `Edit ${existing.caseKey}` : 'New test case' });
  const bindText = (name, el) => {
    el.name = name;
    el.value = model[name] ?? '';
    el.addEventListener('input', () => { model[name] = el.value; changed(); });
    return el;
  };
  const text = (name, attrs = {}) => bindText(name, h('input', { type: 'text', autocomplete: 'off', ...attrs }));
  const pick = (name, options) => {
    const el = select(options, model[name], { name });
    el.addEventListener('change', () => { model[name] = el.value; changed(); });
    return el;
  };
  const titleIn = text('title', { maxlength: LIMITS.titleMax, placeholder: 'e.g. Front desk can reschedule an appointment to another provider' });
  const modules = store.data.modules.filter((m) => !m.archived || m.id === initialModuleId);
  const moduleSel = pick('moduleId', [{ value: '', label: 'Choose module' }, ...modules.map((m) => ({ value: m.id, label: m.name }))]);
  const members = store.data.members.filter((m) => m.active !== false || m.id === model.assignedTo);
  const assigneeField = field({
    label: 'Assignee',
    input: Object.assign(pick('assignedTo', [{ value: '', label: 'Unassigned' }, ...members.map((m) => ({ value: m.id, label: `${m.displayName} (${m.role})` }))]), { disabled: !store.can('case.assign') }),
    name: 'assignedTo',
  });

  // ---- steps editor ----
  const stepsWrap = h('div', { class: 'steps-edit' });
  const renderSteps = (focusIndex = null, focusField = 'action') => {
    stepsWrap.replaceChildren(...model.steps.map((s, i) => {
      const a = h('textarea', { rows: 2, placeholder: 'Action — what the tester does', 'aria-label': `Step ${i + 1} action`, value: s.action });
      const e = h('textarea', { rows: 2, placeholder: 'Expected result for this step', 'aria-label': `Step ${i + 1} expected result`, value: s.expected });
      a.addEventListener('input', () => { model.steps[i].action = a.value; changed(); });
      e.addEventListener('input', () => { model.steps[i].expected = e.value; changed(); });
      e.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey) === false && ev.altKey) { ev.preventDefault(); addStep(i + 1); }
      });
      const move = (d) => {
        const j = i + d;
        if (j < 0 || j >= model.steps.length) return;
        [model.steps[i], model.steps[j]] = [model.steps[j], model.steps[i]];
        changed();
        renderSteps(j);
      };
      const tool = (label, ic, fn, disabled = false) => h('button', { type: 'button', class: 'btn btn-ghost btn-icon btn-sm', 'aria-label': `${label} step ${i + 1}`, title: label, disabled, onClick: fn }, icon(ic, 15));
      const row = h('div', { class: 'step-edit' },
        h('span', { class: 'step-num', 'aria-hidden': 'true' }, String(i + 1)), a, e,
        h('div', { class: 'step-tools' },
          tool('Move up', 'up', () => move(-1), i === 0),
          tool('Move down', 'down', () => move(1), i === model.steps.length - 1),
          tool('Remove', 'x', () => { model.steps.splice(i, 1); if (!model.steps.length) model.steps.push({ action: '', expected: '' }); changed(); renderSteps(Math.max(0, i - 1)); })));
      if (focusIndex === i) requestAnimationFrame(() => (focusField === 'expected' ? e : a).focus());
      return row;
    }));
  };
  const addStep = (at = model.steps.length) => {
    if (model.steps.length >= LIMITS.stepsMax) return toast(`Maximum ${LIMITS.stepsMax} steps`, { type: 'error' });
    model.steps.splice(at, 0, { action: '', expected: '' });
    changed();
    renderSteps(at);
  };
  renderSteps();

  // ---- layout ----
  const stepsFields = [
    stepsWrap,
    fieldError('steps'),
    h('button', { type: 'button', class: 'btn btn-sm', onClick: () => addStep() }, icon('plus', 15), 'Add step'),
  ];
  form.append(card({ body: h('div', { class: 'form-grid' },
    field({ label: 'Title', input: titleIn, name: 'title', required: true, full: true }),
    field({ label: 'Module', input: moduleSel, name: 'moduleId', required: true }),
    field({ label: 'Completion', input: pick('completionStatus', COMPLETION_STATUSES), name: 'completionStatus' }),
    h('fieldset', { class: 'field full' }, h('legend', null, 'Steps'), ...stepsFields),
    assigneeField,
  ) }));
  const formError = h('div', { dataset: { error: '_form' }, hidden: true, class: 'banner banner-danger', role: 'alert' });
  const draftBanner = h('div');
  const saveBtn = h('button', { type: 'submit', class: 'btn btn-primary' }, icon('check', 16), existing ? 'Save changes' : 'Create case');
  const saveNewBtn = !existing ? h('button', { type: 'button', class: 'btn', onClick: () => save({ andNew: true }) }, 'Create & add another') : null;
  const cancelBtn = h('a', { class: 'btn btn-ghost', href: existing ? `#/cases/${existing.id}` : '#/cases' }, 'Cancel');
  form.append(h('div', { class: 'editor-actions' }, saveBtn, saveNewBtn, cancelBtn, h('span', { class: 'spacer' }), dirtyIndicator, h('span', { class: 'muted small hide-sm' }, h('kbd', null, 'Ctrl'), ' + ', h('kbd', null, 'S'), ' to save')));
  form.addEventListener('submit', (e) => { e.preventDefault(); save(); });

  root.append(
    h('div', { class: 'page-head' }, h('div', null,
      h('h1', null, existing ? `Edit ${existing.caseKey}` : source ? `Duplicate ${source.caseKey}` : 'New test case'),
      existing && h('p', null, `Version ${existing.version}. Changes are recorded field by field in the case history.`))),
    draftBanner, formError, form,
  );

  async function save({ andNew = false } = {}) {
    if (saving) return;
    saving = true;
    saveBtn.disabled = true;
    showErrors(form.parentElement, {});
    try {
      const payload = formValues(model);
      if (model.moduleId !== initialModuleId || !existing) {
        payload.featureId = feature?.moduleId === initialModuleId && model.moduleId === initialModuleId ? feature.id : '';
      }
      if (source) {
        // Carry over the source metadata and let creation allocate a fresh key.
        const metadata = Object.fromEntries(CASE_CONTENT_FIELDS.map((field) => [field, template[field]]));
        Object.assign(payload, { ...metadata, ...payload, status: 'Draft' });
      }
      const rec = existing
        ? await store.updateCase(existing.id, payload, { expectedVersion: existing.version })
        : await store.createCase(payload, { duplicatedFrom: source?.id || null });
      saveDraft.cancel();
      draftPending = false;
      await store.drafts.remove(draftKey);
      initial = clone(model);
      dirtyIndicator.hidden = true;
      if (existing && rec.version === existing.version) toast('No changes to save');
      else toast(existing ? `${rec.caseKey} saved` : `${rec.caseKey} created`);
      if (andNew) router.go('/cases/new', { module: rec.moduleId, feature: rec.featureId }, { replace: true });
      else router.go(`/cases/${rec.id}`);
    } catch (e) {
      if (e.errors) {
        showErrors(form.parentElement, Object.keys(e.errors).length ? e.errors : { _form: e.message });
        if (Object.keys(e.errors).length) {
          formError.hidden = false;
          formError.textContent = Object.values(e.errors).join(' ');
        }
      } else if (e.status === 409 || e.name === 'ConflictError') {
        formError.hidden = false;
        formError.textContent = `${e.message} Your edits are kept as a draft in this session.`;
        formError.scrollIntoView({ block: 'center' });
        saveDraft.flush();
      } else toastError(e);
    } finally {
      saving = false;
      saveBtn.disabled = false;
    }
  }

  ctx.registerEditor({ isDirty, save: () => save() });

  // ---- draft recovery ----
  store.drafts.get(draftKey).then((draft) => {
    if (!draft?.values) return;
    const restored = { ...clone(initial), ...formValues(draft.values) };
    if (restored.moduleId && !modules.some((m) => m.id === restored.moduleId)) restored.moduleId = initial.moduleId;
    if (!store.can('case.assign')) restored.assignedTo = initial.assignedTo;
    if (!restored.steps.length) restored.steps = [{ action: '', expected: '' }];
    if (isEqual(normalizeForCompare(restored), normalizeForCompare(initial))) return;
    const stale = existing && draft.baseVersion !== null && draft.baseVersion !== existing.version;
    draftBanner.replaceChildren(h('div', { style: { marginBottom: '16px' } }, banner(stale ? 'warn' : 'info', [
      h('strong', null, `Unsaved draft from ${fmtRelative(draft.savedAt)} found.`),
      stale ? h('span', null, `It was started from version ${draft.baseVersion}; the case is now version ${existing.version}. Restoring may overwrite newer changes.`) : null,
      h('div', { class: 'row', style: { marginTop: '6px' } },
        h('button', { type: 'button', class: 'btn btn-sm btn-primary', onClick: () => { model = restored; draftBanner.replaceChildren(); rerenderForm(); } }, 'Restore draft'),
        h('button', { type: 'button', class: 'btn btn-sm', onClick: () => { store.drafts.remove(draftKey); draftBanner.replaceChildren(); } }, 'Discard draft')),
    ])));
  });

  function rerenderForm() {
    for (const el of form.querySelectorAll('input[name], select[name]')) {
      el.value = model[el.name] ?? '';
    }
    renderSteps();
    changed();
  }

  if (!existing) requestAnimationFrame(() => titleIn.focus());
  return () => { if (draftPending) saveDraft.flush(); };
}

function normalizeForCompare(m) {
  const x = clone(m);
  x.steps = (x.steps || []).filter((s) => (s.action || '').trim() || (s.expected || '').trim());
  for (const k of Object.keys(x)) if (typeof x[k] === 'string') x[k] = x[k].trim();
  return x;
}
