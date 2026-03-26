alter table if exists public.leads
  add column if not exists funnel_stage text not null default 'started',
  add column if not exists source_channel text null,
  add column if not exists lang text null,
  add column if not exists utm_source text null,
  add column if not exists utm_medium text null,
  add column if not exists utm_campaign text null,
  add column if not exists step1_completed_at timestamptz null,
  add column if not exists step2_completed_at timestamptz null,
  add column if not exists first_contact_at timestamptz null,
  add column if not exists follow_up_notes text null,
  add column if not exists cargo text null,
  add column if not exists export_experience text null,
  add column if not exists primary_challenge text null;

create index if not exists idx_leads_funnel_stage on public.leads (funnel_stage);
create index if not exists idx_leads_source_channel on public.leads (source_channel);
create index if not exists idx_leads_step2_completed_at on public.leads (step2_completed_at);
