-- HotFeet — Supabase schema
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).

-- One row per (user, calendar date, feature area). `data` holds whatever shape
-- that area already uses client-side (see src/hooks/useCloudLog.js).
create table if not exists public.daily_logs (
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  domain text not null check (domain in ('workout', 'nutrition', 'water', 'care', 'steps', 'progress')),
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, date, domain)
);

create index if not exists daily_logs_user_domain_idx on public.daily_logs (user_id, domain);

alter table public.daily_logs enable row level security;

create policy "Users manage their own daily_logs"
  on public.daily_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Per-user settings that aren't tied to a specific date.
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  start_date date not null default current_date,
  rest_seconds integer not null default 45,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "Users manage their own settings"
  on public.user_settings
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
