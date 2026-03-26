import { getSupabaseAdmin } from '@/lib/supabase';
import LeadsTable, { type Lead } from './LeadsTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LeadsPage() {
  const supabase = getSupabaseAdmin();
  const primaryQuery = await supabase
    .from('leads')
    .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token, lead_type, document_person_type, document_type, document_number, document_deferred, funnel_stage, source_channel, first_contact_at, step1_completed_at, step2_completed_at, follow_up_notes')
    .order('created_at', { ascending: false });
  const fallbackQuery = primaryQuery.error && /column .* does not exist/i.test(primaryQuery.error.message)
    ? await supabase
        .from('leads')
        .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token')
        .order('created_at', { ascending: false })
    : null;
  const data = fallbackQuery?.data ?? primaryQuery.data;
  const error = fallbackQuery?.error ?? primaryQuery.error;
  const leads: Lead[] = (data ?? []).map((row: any) => ({
    ...row,
    lead_type: row.lead_type ?? 'supplier',
    document_person_type: row.document_person_type ?? null,
    document_type: row.document_type ?? null,
    document_number: row.document_number ?? null,
    document_deferred: row.document_deferred ?? false,
    funnel_stage: row.funnel_stage ?? 'started',
    source_channel: row.source_channel ?? null,
    first_contact_at: row.first_contact_at ?? null,
    step1_completed_at: row.step1_completed_at ?? null,
    step2_completed_at: row.step2_completed_at ?? null,
    follow_up_notes: row.follow_up_notes ?? null,
  }));

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load leads from Supabase: {error.message}
        </div>
      )}
      <LeadsTable leads={leads} />
    </div>
  );
}
