-- Digital Memory Vault Supabase schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.identities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  email text not null,
  username text,
  phone text,
  recovery_email text,
  purpose text,
  notes text,
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  identity_id uuid references public.identities(id) on delete set null,
  service_name text not null,
  website_url text,
  username text,
  category text,
  status text default 'active',
  revisit_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.revisit_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  due_date date,
  priority text default 'medium',
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  platform text,
  url text,
  progress int default 0 check (progress >= 0 and progress <= 100),
  notes text,
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  repo_url text,
  live_url text,
  tech_stack text,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text default '#6ea8fe',
  description text,
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  file_name text not null,
  file_path text not null,
  file_url text,
  mime_type text,
  size_bytes bigint,
  description text,
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  action text not null,
  entity_type text,
  entity_id uuid,
  title text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.archives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entity_type text not null,
  entity_id uuid,
  title text,
  item_data jsonb,
  created_at timestamp with time zone default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.identities enable row level security;
alter table public.accounts enable row level security;
alter table public.revisit_items enable row level security;
alter table public.courses enable row level security;
alter table public.projects enable row level security;
alter table public.tags enable row level security;
alter table public.attachments enable row level security;
alter table public.activity_logs enable row level security;
alter table public.archives enable row level security;

do $$
declare t text;
begin
  foreach t in array array['profiles','identities','accounts','revisit_items','courses','projects','tags','attachments','activity_logs','archives'] loop
    execute format('drop policy if exists "Users can read own %1$s" on public.%1$I', t);
    execute format('drop policy if exists "Users can insert own %1$s" on public.%1$I', t);
    execute format('drop policy if exists "Users can update own %1$s" on public.%1$I', t);
    execute format('drop policy if exists "Users can delete own %1$s" on public.%1$I', t);
    execute format('create policy "Users can read own %1$s" on public.%1$I for select using (auth.uid() = user_id)', t);
    execute format('create policy "Users can insert own %1$s" on public.%1$I for insert with check (auth.uid() = user_id)', t);
    execute format('create policy "Users can update own %1$s" on public.%1$I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format('create policy "Users can delete own %1$s" on public.%1$I for delete using (auth.uid() = user_id)', t);
  end loop;
end $$;

create index if not exists idx_identities_user on public.identities(user_id);
create index if not exists idx_accounts_user on public.accounts(user_id);
create index if not exists idx_revisit_user on public.revisit_items(user_id);
create index if not exists idx_courses_user on public.courses(user_id);
create index if not exists idx_projects_user on public.projects(user_id);
create index if not exists idx_attachments_user on public.attachments(user_id);
create index if not exists idx_activity_user on public.activity_logs(user_id, created_at desc);

-- Create a public storage bucket named: vault-attachments
-- Then add these storage policies from Supabase SQL editor if needed:
insert into storage.buckets (id, name, public) values ('vault-attachments', 'vault-attachments', true)
on conflict (id) do nothing;

create policy "Users upload own vault files" on storage.objects for insert to authenticated
with check (bucket_id = 'vault-attachments' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users read own vault files" on storage.objects for select to authenticated
using (bucket_id = 'vault-attachments' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users delete own vault files" on storage.objects for delete to authenticated
using (bucket_id = 'vault-attachments' and (storage.foldername(name))[1] = auth.uid()::text);

-- Optional but recommended for attachment edits/deletes from UI
create policy if not exists "Users update own vault files" on storage.objects for update to authenticated
using (bucket_id = 'vault-attachments' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'vault-attachments' and (storage.foldername(name))[1] = auth.uid()::text);
