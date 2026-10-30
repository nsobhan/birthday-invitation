-- Run once in Supabase Dashboard > SQL Editor.
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  family_name text not null check (char_length(trim(family_name)) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  attending boolean not null,
  adults integer not null default 0 check (adults between 0 and 30),
  kids integer not null default 0 check (kids between 0 and 30),
  note text not null default '' check (char_length(note) <= 500),
  constraint headcount_valid check ((attending and adults + kids >= 1) or (not attending and adults = 0 and kids = 0))
);
alter table public.rsvps enable row level security;
-- Revoke all privileges from browser roles; only allow new submissions.
revoke all on table public.rsvps from anon, authenticated;
grant insert on table public.rsvps to anon;
drop policy if exists "Public may submit RSVP" on public.rsvps;
create policy "Public may submit RSVP" on public.rsvps for insert to anon with check (true);
-- No public select, update or delete policies: guests cannot see other responses.
-- Review private responses in Supabase > Table Editor > rsvps.
-- Host-only aggregate query (SQL Editor):
-- select count(*) filter (where attending) as yes_families,
--        coalesce(sum(adults) filter (where attending),0) as adults,
--        coalesce(sum(kids) filter (where attending),0) as kids
-- from public.rsvps;
