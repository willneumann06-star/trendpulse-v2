-- Run this in your Supabase SQL editor

-- Profiles: tracks usage per user
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  generations_used int not null default 0,
  usage_reset_at timestamptz not null default (date_trunc('month', now()) + interval '1 month')
);

-- Bookmarks: stores saved trend IDs per user
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  trend_id int not null,
  created_at timestamptz default now(),
  unique(user_id, trend_id)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.bookmarks enable row level security;

-- Profile policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Bookmark policies
create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
