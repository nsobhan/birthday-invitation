-- Run once in Supabase Dashboard > SQL Editor to enable admin.html.
-- Replace YOUR-EMAIL@example.com with the email you will sign in with (keep the quotes).
-- Only that signed-in email can read RSVPs; guests still cannot.
grant select on table public.rsvps to authenticated;
drop policy if exists "Host may read RSVPs" on public.rsvps;
create policy "Host may read RSVPs" on public.rsvps for select to authenticated
  using (lower(auth.jwt() ->> 'email') = lower('YOUR-EMAIL@example.com'));
