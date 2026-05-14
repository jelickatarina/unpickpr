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
