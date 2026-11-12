-- Apply validated record changes inside Postgres instead of sending the full
-- library back over the network for every edit. The revision check is atomic.
create or replace function public.qa_commit_workspace(p_expected_revision bigint, p_changes jsonb)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare
  doc jsonb;
  current_revision bigint;
  change jsonb;
  collection_name text;
  id_key text;
  records jsonb;
  puts jsonb;
  removes jsonb;
  put_map jsonb;
  remove_map jsonb;
  existing_map jsonb;
  updated_records jsonb;
  added_records jsonb;
begin
  select snapshot, revision into doc, current_revision
  from public.qa_workspace where id = 'default' for update;
  if not found or current_revision <> p_expected_revision then return false; end if;
  if jsonb_typeof(p_changes) <> 'array' then raise exception 'Expected changes array'; end if;

  for change in select value from jsonb_array_elements(p_changes) loop
    for collection_name in
      select key from jsonb_object_keys(coalesce(change->'put', '{}'::jsonb)) as p(key)
      union select key from jsonb_object_keys(coalesce(change->'del', '{}'::jsonb)) as d(key)
    loop
      if collection_name not in ('members','accounts','modules','features','testCases','testSuites','testRuns','activity','deletedItems') then
        raise exception 'Unknown collection';
      end if;
      id_key := case when collection_name = 'activity' then 'eventId' else 'id' end;
      records := coalesce(doc->'collections'->collection_name, '[]'::jsonb);
      puts := coalesce(change->'put'->collection_name, '[]'::jsonb);
      removes := coalesce(change->'del'->collection_name, '[]'::jsonb);
      select coalesce(jsonb_object_agg(item->>id_key, item), '{}'::jsonb)
        into put_map from jsonb_array_elements(puts) as r(item);
      select coalesce(jsonb_object_agg(item #>> '{}', true), '{}'::jsonb)
        into remove_map from jsonb_array_elements(removes) as r(item);
      select coalesce(jsonb_object_agg(item->>id_key, true), '{}'::jsonb)
        into existing_map from jsonb_array_elements(records) as r(item);
      -- Preserve record order and allow a put to replace a simultaneous delete.
      select coalesce(jsonb_agg(coalesce(put_map->(item->>id_key), item) order by position), '[]'::jsonb)
        into updated_records from jsonb_array_elements(records) with ordinality as r(item, position)
        where not (remove_map ? (item->>id_key)) or put_map ? (item->>id_key);
      select coalesce(jsonb_agg(item order by position), '[]'::jsonb)
        into added_records from jsonb_array_elements(puts) with ordinality as r(item, position)
        where not (existing_map ? (item->>id_key));
      doc := jsonb_set(doc, array['collections', collection_name], updated_records || added_records);
    end loop;
    doc := jsonb_set(doc, '{meta}', coalesce(doc->'meta', '{}'::jsonb) || coalesce(change->'meta', '{}'::jsonb));
  end loop;
  update public.qa_workspace set snapshot = doc, revision = current_revision + 1 where id = 'default';
  return true;
end;
$$;
revoke all on function public.qa_commit_workspace(bigint, jsonb) from public, anon, authenticated;
grant execute on function public.qa_commit_workspace(bigint, jsonb) to service_role;
