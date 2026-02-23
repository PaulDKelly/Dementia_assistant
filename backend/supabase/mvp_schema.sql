create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null check (role in ('elder', 'caregiver', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  notes text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  dosage text,
  schedule text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.medication_logs (
  id uuid primary key default gen_random_uuid(),
  medication_id uuid not null references public.medications(id) on delete cascade,
  elder_id uuid not null references public.profiles(id) on delete cascade,
  logged_by uuid references public.profiles(id),
  taken_at timestamptz not null default now(),
  note text
);

create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles(id) on delete cascade,
  mood text,
  content text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.family_feed (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles(id) on delete cascade,
  author_id uuid references public.profiles(id),
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved')),
  details text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.password_entries (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  username text not null,
  secret text not null,
  note text,
  created_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.family_moments (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles(id) on delete cascade,
  author_id uuid references public.profiles(id),
  media_type text not null check (media_type in ('photo', 'video')),
  media_url text not null,
  caption text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.calendar_events enable row level security;
alter table public.medications enable row level security;
alter table public.medication_logs enable row level security;
alter table public.diary_entries enable row level security;
alter table public.family_feed enable row level security;
alter table public.alerts enable row level security;
alter table public.password_entries enable row level security;
alter table public.family_moments enable row level security;

-- RLS stubs for MVP. Tighten with role-aware policies before production.
drop policy if exists "profiles_authenticated_read" on public.profiles;
create policy "profiles_authenticated_read"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_self_insert" on public.profiles;
create policy "profiles_self_insert"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "calendar_authenticated_all" on public.calendar_events;
create policy "calendar_authenticated_all"
  on public.calendar_events for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "medications_authenticated_all" on public.medications;
create policy "medications_authenticated_all"
  on public.medications for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "medication_logs_authenticated_all" on public.medication_logs;
create policy "medication_logs_authenticated_all"
  on public.medication_logs for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "diary_authenticated_all" on public.diary_entries;
create policy "diary_authenticated_all"
  on public.diary_entries for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "family_feed_authenticated_all" on public.family_feed;
create policy "family_feed_authenticated_all"
  on public.family_feed for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "alerts_authenticated_all" on public.alerts;
create policy "alerts_authenticated_all"
  on public.alerts for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "password_entries_authenticated_all" on public.password_entries;
create policy "password_entries_authenticated_all"
  on public.password_entries for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "family_moments_authenticated_all" on public.family_moments;
create policy "family_moments_authenticated_all"
  on public.family_moments for all
  to authenticated
  using (true)
  with check (true);
