-- Multiple authenticated emails may represent the same existing team profile.
-- Auth UUIDs remain unique; only the server can create identity mappings.
alter table public.qa_identities drop constraint if exists qa_identities_member_id_key;
create index if not exists qa_identities_member_id_idx on public.qa_identities(member_id);
