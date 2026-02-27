import { getSupabaseAdmin } from '@/lib/supabase';
import LeadsTable, { type Lead } from './LeadsTable';

export default async function LeadsPage() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('leads')
    .select('id, created_at, nombre, empresa, email, whatsapp, pais, estado, onboarding_url')
    .order('created_at', { ascending: false });

  const leads: Lead[] = data ?? [];

  const total = leads.length;
  const nuevos = leads.filter((l) => l.estado === 'nuevo').length;
  const onboarding = leads.filter((l) => l.estado === 'onboarding').length;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pipeline Admin</p>
          <h1 className="text-xl font-bold text-gray-900">Leads</h1>
        </div>
        {/* Stats rápidas */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span><span className="font-bold text-gray-800">{total}</span> total</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><span className="font-bold text-blue-700">{nuevos}</span> nuevos</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><span className="font-bold text-emerald-700">{onboarding}</span> en onboarding</span>
        </div>
      </div>

      <LeadsTable leads={leads} />
    </div>
  );
}
