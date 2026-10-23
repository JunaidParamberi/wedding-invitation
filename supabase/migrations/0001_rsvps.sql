-- RSVPs from the invitation page.
-- Guests can only add a reply; nobody can read replies through the public key.
-- Read them in the Supabase dashboard (Table editor → rsvps, or the rsvp_summary view).

create table if not exists public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 60),
  attending   boolean not null,
  guests      smallint not null default 1 check (guests between 0 and 20),
  from_where  text check (char_length(from_where) <= 80),
  message     text check (char_length(message) <= 300)
);

alter table public.rsvps enable row level security;

create policy "guests can add an rsvp"
  on public.rsvps for insert
  to anon, authenticated
  with check (true);

-- Totals at a glance (owner only; no public access)
create or replace view public.rsvp_summary
with (security_invoker = true) as
select
  count(*) filter (where attending)                       as families_coming,
  coalesce(sum(guests) filter (where attending), 0)       as total_guests,
  count(*) filter (where not attending)                   as declined,
  max(created_at)                                         as last_reply
from public.rsvps;

revoke all on public.rsvp_summary from anon, authenticated;
