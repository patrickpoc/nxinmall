alter table if exists public.leads
  add column if not exists lead_type text not null default 'supplier',
  add column if not exists document_person_type text null,
  add column if not exists document_type text null,
  add column if not exists document_number text null,
  add column if not exists document_deferred boolean not null default false;

create index if not exists idx_leads_lead_type on public.leads (lead_type);
