-- Run once in the Supabase SQL editor. Only the Node server can access these tables.
create table if not exists public.qa_workspace (
  id text primary key check (id = 'default'),
  revision bigint not null default 1,
  snapshot jsonb not null
);
create table if not exists public.qa_identities (
  user_id uuid primary key references auth.users(id) on delete cascade,
  member_id text unique not null
);
alter table public.qa_workspace enable row level security;
alter table public.qa_identities enable row level security;
revoke all on public.qa_workspace, public.qa_identities from anon, authenticated;
grant all on public.qa_workspace, public.qa_identities to service_role;
-- Deliberately no public policies: all operations pass through authenticated Node API.
