import { getSupabaseAdmin } from '@/lib/supabase';
import OnboardingsTable, { type Onboarding } from './OnboardingsTable';

export default async function OnboardingsPage() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('onboardings')
    .select('id, created_at, nombre, empresa, ruc, email, whatsapp, pais, categoria, num_productos, productos, estado, duracion_seg')
    .order('created_at', { ascending: false });

  const onboardings: Onboarding[] = data ?? [];

  const total = onboardings.length;
  const pendientes = onboardings.filter((o) => o.estado === 'kyb_pendiente').length;
  const aprobados = onboardings.filter((o) => o.estado === 'aprobado').length;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pipeline Admin</p>
          <h1 className="text-xl font-bold text-gray-900">Onboardings</h1>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span><span className="font-bold text-gray-800">{total}</span> total</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><span className="font-bold text-amber-700">{pendientes}</span> pendientes KYB</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><span className="font-bold text-emerald-700">{aprobados}</span> aprobados</span>
        </div>
      </div>

      <OnboardingsTable onboardings={onboardings} />
    </div>
  );
}
