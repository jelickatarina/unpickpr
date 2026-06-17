-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)

-- Profiles table (stores name + onboarding state)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  ime text,
  onboarding_done boolean default false,
  onboarding_answers jsonb,
  chat_history jsonb,
  created_at timestamptz default now()
);

-- Journal entries table
create table if not exists journal_entries (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  intensity int,
  trigger text,
  location text,
  emotion_before text,
  emotion_after text,
  outcome text,
  note text,
  images text[],
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table journal_entries enable row level security;

-- Profiles: users can only access their own row
create policy "Own profile select" on profiles for select using (auth.uid() = id);
create policy "Own profile insert" on profiles for insert with check (auth.uid() = id);
create policy "Own profile update" on profiles for update using (auth.uid() = id);

-- Journal entries: users can only access their own entries
create policy "Own entries select" on journal_entries for select using (auth.uid() = user_id);
create policy "Own entries insert" on journal_entries for insert with check (auth.uid() = user_id);
create policy "Own entries delete" on journal_entries for delete using (auth.uid() = user_id);

-- Function to auto-create a profile row when a new auth user signs up.
-- Must run as security definer so it can write to public.profiles bypassing RLS.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, ime)
  values (new.id, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: fires handle_new_user after every new row in auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ===== Kozmetičarka panel =====
-- Povezivanje korisnika sa kozmetičarkom je potpuno opciono. kozmeticarka_id
-- je null po default-u i ostaje null ako korisnik nikad ne unese kod — ništa
-- se ne menja za korisnike koji žele da samostalno prate sebe.
alter table profiles add column if not exists role text default 'user';
alter table profiles add column if not exists kod text unique;
alter table profiles add column if not exists kozmeticarka_id uuid references profiles(id) on delete set null;

-- Korisnik se sam povezuje unosom koda kozmetičarke (jednokratno, opciono).
-- security definer da klijent ne mora imati SELECT pravo na tuđe profile.
create or replace function public.link_to_kozmeticarka(p_kod text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  select id into v_id from profiles where kod = p_kod and role = 'kozmeticarka';
  if v_id is null then
    raise exception 'Kod nije pronađen.';
  end if;
  update profiles set kozmeticarka_id = v_id where id = auth.uid();
end;
$$;
grant execute on function public.link_to_kozmeticarka(text) to authenticated;

-- Kozmetičarka vidi samo broj dana (streak) svojih povezanih klijenata,
-- ne dnevničke unose ni druge lične podatke. security definer da ne mora
-- da se širi profiles/journal_entries SELECT RLS na tuđe redove.
create or replace function public.get_kozmeticarka_clients()
returns table(id uuid, ime text, registered_at timestamptz, last_bad_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select p.id, p.ime, u.created_at as registered_at,
    (select max(j.created_at) from journal_entries j where j.user_id = p.id and j.outcome in ('try','ep')) as last_bad_at
  from profiles p
  join auth.users u on u.id = p.id
  where p.kozmeticarka_id = auth.uid();
$$;
grant execute on function public.get_kozmeticarka_clients() to authenticated;

-- Da napraviš kozmetičarku: nek se registruje kroz app kao običan korisnik,
-- pa pokreni (sa pravim emailom i željenim kodom za deljenje s klijentima):
-- update profiles set role='kozmeticarka', kod='ABC123'
-- where id=(select id from auth.users where email='kozmeticarka@mail.com');
