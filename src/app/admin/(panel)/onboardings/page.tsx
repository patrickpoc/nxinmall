import { getSupabaseAdmin } from '@/lib/supabase';
import OnboardingsTable, { type Onboarding } from './OnboardingsTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OnboardingsPage() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('onboardings')
    .select('id, created_at, nombre, empresa, ruc, email, whatsapp, pais, categoria, num_productos, productos, estado, duracion_seg, raw_data')
    .order('created_at', { ascending: false });

  const onboardings: Onboarding[] = data ?? [];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load onboardings from Supabase: {error.message}
        </div>
      )}
      <OnboardingsTable onboardings={onboardings} />
    </div>
  );
}
