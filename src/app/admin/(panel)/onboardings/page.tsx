import { getSupabaseAdmin } from '@/lib/supabase';
import OnboardingsTable, { type Onboarding } from './OnboardingsTable';

export default async function OnboardingsPage() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('onboardings')
    .select('id, created_at, nombre, empresa, ruc, email, whatsapp, pais, categoria, num_productos, productos, estado, duracion_seg, raw_data')
    .order('created_at', { ascending: false });

  const onboardings: Onboarding[] = data ?? [];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <OnboardingsTable onboardings={onboardings} />
    </div>
  );
}
