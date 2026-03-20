import { getSupabaseAdmin } from '@/lib/supabase';
import LeadsTable, { type Lead } from './LeadsTable';

export default async function LeadsPage() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('leads')
    .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token')
    .order('created_at', { ascending: false });

  const leads: Lead[] = data ?? [];

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
