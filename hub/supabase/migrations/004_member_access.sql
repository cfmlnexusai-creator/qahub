create table public.qa_member_access (
  member_id text not null,
  user_id uuid not null,
  email text not null,
  access_day date not null,
  first_seen timestamptz not null,
  last_seen timestamptz not null,
  login_count integer not null,
  open_count integer not null,
  page_count integer not null,
  interaction_count integer not null,
  last_interaction timestamptz,
  last_login timestamptz,
  primary key (member_id, access_day, user_id)
);

alter table public.qa_member_access enable row level security;
revoke all on public.qa_member_access from public, anon, authenticated;
grant select, insert, update on public.qa_member_access to service_role;

create function public.qa_record_access(p_member text, p_user uuid, p_email text, p_event text)
returns void language sql set search_path = '' as $$
  insert into public.qa_member_access as a
    (member_id, user_id, email, access_day, first_seen, last_seen, login_count, last_login,
      open_count, page_count, interaction_count, last_interaction)
  values (p_member, p_user, coalesce(p_email, ''), (now() at time zone 'Asia/Kolkata')::date,
    now(), now(), (p_event = 'login')::integer, case when p_event = 'login' then now() end,
    (p_event = 'open')::integer, (p_event in ('open', 'page'))::integer,
    (p_event = 'interaction')::integer, case when p_event = 'interaction' then now() end)
  on conflict (member_id, access_day, user_id) do update set
    email = case when excluded.last_seen >= a.last_seen then excluded.email else a.email end,
    first_seen = least(a.first_seen, excluded.first_seen),
    last_seen = greatest(a.last_seen, excluded.last_seen),
    login_count = a.login_count + excluded.login_count,
    open_count = a.open_count + excluded.open_count,
    page_count = a.page_count + excluded.page_count,
    interaction_count = a.interaction_count + excluded.interaction_count,
    last_interaction = greatest(a.last_interaction, excluded.last_interaction),
    last_login = greatest(a.last_login, excluded.last_login);
$$;

create function public.qa_access_report(p_member text, p_before date)
returns jsonb language sql stable set search_path = '' as $$
  with history as (
    select access_day, jsonb_agg(jsonb_build_object(
      'email', email, 'logins', login_count, 'firstSeen', first_seen,
      'lastSeen', last_seen, 'lastLogin', last_login, 'opens', open_count,
      'pages', page_count, 'interactions', interaction_count, 'lastInteraction', last_interaction
    ) order by email, user_id) as accounts
    from public.qa_member_access
    where member_id = p_member and (p_before is null or access_day < p_before)
    group by access_day order by access_day desc limit 31
  ), totals as (
    select *, access_day = (now() at time zone 'Asia/Kolkata')::date as today
    from public.qa_member_access where member_id = p_member
  )
  select jsonb_build_object(
    'logins', coalesce(sum(login_count), 0),
    'opens', coalesce(sum(open_count), 0),
    'pages', coalesce(sum(page_count), 0),
    'interactions', coalesce(sum(interaction_count), 0),
    'activeDays', count(distinct access_day) filter (where page_count > 0 or interaction_count > 0),
    'today', jsonb_build_object(
      'logins', coalesce(sum(login_count) filter (where today), 0),
      'opens', coalesce(sum(open_count) filter (where today), 0),
      'pages', coalesce(sum(page_count) filter (where today), 0),
      'interactions', coalesce(sum(interaction_count) filter (where today), 0)
    ),
    'lastSeen', max(last_seen), 'lastLogin', max(last_login),
    'lastInteraction', max(last_interaction),
    'days', (select coalesce(jsonb_agg(history order by access_day desc), '[]'::jsonb) from history)
  )
  from totals;
$$;

revoke all on function public.qa_record_access(text, uuid, text, text) from public, anon, authenticated;
revoke all on function public.qa_access_report(text, date) from public, anon, authenticated;
grant execute on function public.qa_record_access(text, uuid, text, text) to service_role;
grant execute on function public.qa_access_report(text, date) to service_role;
