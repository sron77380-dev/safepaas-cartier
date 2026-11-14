-- SafePass schema — Fondation Cartier
-- Run in Supabase SQL Editor

create extension if not exists "pgcrypto";

create type public.user_role as enum ('agent', 'manager', 'admin');
create type public.theme_slug as enum ('SSIAP', 'TFP', 'APS', 'SST', 'CARTIER');
create type public.answer_letter as enum ('A', 'B', 'C', 'D');
create type public.notification_audience as enum ('all', 'agents', 'managers');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'agent',
  avatar_url text,
  site text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  theme public.theme_slug not null,
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer public.answer_letter not null,
  explanation text,
  difficulty smallint not null default 1 check (difficulty between 1 and 3),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  theme text not null,
  score integer not null default 0,
  total_questions integer not null default 0,
  duration_seconds integer,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.game_answers (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  selected_answer public.answer_letter,
  is_correct boolean not null default false,
  time_spent_seconds integer
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  badge_key text not null,
  label text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_key)
);

create table public.themes_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  theme public.theme_slug not null,
  games_played integer not null default 0,
  correct_answers integer not null default 0,
  total_answers integer not null default 0,
  best_score integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, theme)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_by uuid not null references public.profiles (id) on delete cascade,
  audience public.notification_audience not null default 'all',
  created_at timestamptz not null default now()
);

create table public.notification_reads (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  read_at timestamptz not null default now(),
  unique (notification_id, user_id)
);

create index questions_theme_idx on public.questions (theme) where active = true;
create index games_user_id_idx on public.games (user_id, created_at desc);
create index game_answers_game_id_idx on public.game_answers (game_id);
create index notifications_created_at_idx on public.notifications (created_at desc);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'agent'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.games enable row level security;
alter table public.game_answers enable row level security;
alter table public.badges enable row level security;
alter table public.themes_stats enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_reads enable row level security;

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Profiles
create policy "Profiles are readable by authenticated users"
  on public.profiles for select to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for update to authenticated
  using (public.current_role() = 'admin');

-- Questions
create policy "Active questions readable by authenticated users"
  on public.questions for select to authenticated
  using (active = true or public.current_role() = 'admin');

create policy "Admins manage questions"
  on public.questions for all to authenticated
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- Games
create policy "Users read own games; managers/admins read all"
  on public.games for select to authenticated
  using (
    user_id = auth.uid()
    or public.current_role() in ('manager', 'admin')
  );

create policy "Users insert own games"
  on public.games for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users update own games"
  on public.games for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Game answers
create policy "Users read own game answers"
  on public.game_answers for select to authenticated
  using (
    exists (
      select 1 from public.games g
      where g.id = game_id
        and (g.user_id = auth.uid() or public.current_role() in ('manager', 'admin'))
    )
  );

create policy "Users insert answers for own games"
  on public.game_answers for insert to authenticated
  with check (
    exists (
      select 1 from public.games g
      where g.id = game_id and g.user_id = auth.uid()
    )
  );

-- Badges
create policy "Users read own badges; managers/admins read all"
  on public.badges for select to authenticated
  using (
    user_id = auth.uid()
    or public.current_role() in ('manager', 'admin')
  );

create policy "Users insert own badges"
  on public.badges for insert to authenticated
  with check (user_id = auth.uid());

-- Theme stats
create policy "Users read own theme stats; managers/admins read all"
  on public.themes_stats for select to authenticated
  using (
    user_id = auth.uid()
    or public.current_role() in ('manager', 'admin')
  );

create policy "Users upsert own theme stats"
  on public.themes_stats for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users update own theme stats"
  on public.themes_stats for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Notifications
create policy "Authenticated users read notifications"
  on public.notifications for select to authenticated
  using (true);

create policy "Managers and admins create notifications"
  on public.notifications for insert to authenticated
  with check (public.current_role() in ('manager', 'admin'));

create policy "Managers and admins delete notifications"
  on public.notifications for delete to authenticated
  using (public.current_role() in ('manager', 'admin'));

-- Notification reads
create policy "Users manage own notification reads"
  on public.notification_reads for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
