import { getSupabaseAdmin } from '@/lib/supabase';
import LeadsTable, { type Lead } from './LeadsTable';

export default async function LeadsPage() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('leads')
    .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token')
    .order('created_at', { ascending: false });

  const leads: Lead[] = data ?? [];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <LeadsTable leads={leads} />
    </div>
  );
}
