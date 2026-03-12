-- Run in Supabase SQL Editor after site_content. Stores last 10 content changes for audit and restore.
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

-- No direct client access; backend (service role) only.
create policy "No client access" on public.site_content_changelog for all using (false);
