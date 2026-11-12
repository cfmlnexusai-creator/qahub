-- Run as the database owner. Every test mutation is rolled back.
begin;
do $$
declare
  initial_revision bigint;
  before_doc jsonb;
  after_doc jsonb;
  after_revision bigint;
  saved boolean;
begin
  select snapshot, revision into before_doc, initial_revision
    from public.qa_workspace where id = 'default' for update;
  assert before_doc is not null, 'Workspace must be seeded';
  saved := public.qa_commit_workspace(initial_revision, '[
    {"put":{"modules":[{"id":"__sync_test_module__","name":"first"}],"accounts":[{"id":"__sync_test_account__"}],"activity":[{"eventId":"__sync_test_event__","note":"first"}]},"meta":{"syncTest":1}},
    {"put":{"modules":[{"id":"__sync_test_module__","name":"replaced"}],"activity":[{"eventId":"__sync_test_event__","note":"updated"}]},"del":{"modules":["__sync_test_module__"],"accounts":["__sync_test_account__"]},"meta":{"syncTest":2}}
  ]'::jsonb);
  assert saved, 'Expected atomic save';
  select snapshot, revision into after_doc, after_revision from public.qa_workspace where id = 'default';
  assert after_revision = initial_revision + 1, 'Exactly one revision increment';
  assert after_doc->'collections'->'testCases' = before_doc->'collections'->'testCases', 'Unrelated case data and order must be preserved';
  assert after_doc->'collections'->'members' = before_doc->'collections'->'members', 'Roles must be preserved';
  assert after_doc->'collections'->'accounts' = before_doc->'collections'->'accounts', 'Delete removes only the test account';
  assert (select count(*) from jsonb_array_elements(after_doc->'collections'->'modules') r where r->>'id' = '__sync_test_module__' and r->>'name' = 'replaced') = 1, 'Put wins over delete without duplicate IDs';
  assert (select count(*) from jsonb_array_elements(after_doc->'collections'->'activity') r where r->>'eventId' = '__sync_test_event__' and r->>'note' = 'updated') = 1, 'Activity uses eventId';
  assert after_doc->'meta'->>'syncTest' = '2', 'Metadata merges in order';
  assert not public.qa_commit_workspace(initial_revision, '[]'::jsonb), 'Stale write must fail';
  assert (select snapshot from public.qa_workspace where id = 'default') = after_doc, 'Stale write cannot change data';
  assert not has_function_privilege('anon', 'public.qa_commit_workspace(bigint,jsonb)', 'execute'), 'No anonymous RPC access';
  assert not has_function_privilege('authenticated', 'public.qa_commit_workspace(bigint,jsonb)', 'execute'), 'No direct browser RPC access';
end;
$$;
rollback;
