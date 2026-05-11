-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)

-- Profiles table (stores name + onboarding state)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  onboarding_done boolean default false,
  onboarding_answers jsonb,
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
