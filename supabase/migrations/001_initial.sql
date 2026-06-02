-- Today Planner: initial schema with invite-only allowlist

-- Invite allowlist (manage via Supabase Table Editor)
create table if not exists public.allowed_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.allowed_emails enable row level security;

-- Authenticated users can check if their email is allowed (read-only)
create policy "Users can read allowlist for self-check"
  on public.allowed_emails
  for select
  to authenticated
  using (true);

-- User profile (settings + category lists + sort orders)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  user_mode text not null default 'teacher' check (user_mode in ('teacher', 'parent')),
  categories jsonb not null default '{"teacher":[],"parent":[]}'::jsonb,
  today_order text[] not null default '{}',
  upcoming_order text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users manage own profile"
  on public.profiles
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  category text not null default '',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists tasks_user_due_date_idx on public.tasks (user_id, due_date);

alter table public.tasks enable row level security;

create policy "Users manage own tasks"
  on public.tasks
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, categories)
  values (
    new.id,
    '{"teacher":["수업 준비","평가 계획","생활기록부","학부모 상담","업무 처리"],"parent":["아이와 독서","숙제 확인","놀이 활동","가족 일정","건강 관리"]}'::jsonb
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
