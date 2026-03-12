-- Run this in Supabase SQL Editor to create the site_content table for editable landing content.
create table if not exists public.site_content (
  block_id text not null,
  lang text not null,
  content jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (block_id, lang)
);

-- Optional: RLS (allow read for anon, write only for service role / backend)
alter table public.site_content enable row level security;

create policy "Public read" on public.site_content for select using (true);
create policy "No direct insert/update from client" on public.site_content for all using (false);
