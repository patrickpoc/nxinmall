import { getSupabaseAdmin } from '@/lib/supabase';
import LeadsTable, { type Lead } from './LeadsTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LeadsPage() {
  const supabase = getSupabaseAdmin();
  const primaryQuery = await supabase
    .from('leads')
    .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token, lead_type, document_person_type, document_type, document_number, document_deferred')
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
