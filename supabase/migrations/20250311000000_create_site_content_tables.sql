-- Creates site_content and site_content_changelog for admin Content and change history.
-- If you don't use Supabase CLI, run this script in Supabase Dashboard → SQL Editor.

-- Editable landing content (block_id + lang + content)
create table if not exists public.site_content (
  block_id text not null,
  lang text not null,
  content jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (block_id, lang)
);

alter table public.site_content enable row level security;
create policy "Public read" on public.site_content for select using (true);
create policy "No direct insert/update from client" on public.site_content for all using (false);

-- Last 10 changes for audit and restore
create table if not exists public.site_content_changelog (
  id uuid primary key default gen_random_uuid(),
  block_id text not null,
  lang text not null,
  content_before jsonb not null default '{}',
  content_after jsonb not null default '{}',
  changed_by text,
  changed_at timestamptz not null default now()
);

create index if not exists idx_site_content_changelog_changed_at
  on public.site_content_changelog (changed_at desc);

alter table public.site_content_changelog enable row level security;
create policy "No client access" on public.site_content_changelog for all using (false);
