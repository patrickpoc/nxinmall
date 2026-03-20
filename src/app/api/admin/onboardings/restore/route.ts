import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const onboarding = body?.onboarding as Record<string, unknown> | undefined;
    if (!onboarding || !onboarding.id) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const payload = {
      id: onboarding.id as string,
      nombre: (onboarding.nombre as string | undefined) ?? '',
      empresa: (onboarding.empresa as string | undefined) ?? '',
      ruc: (onboarding.ruc as string | null | undefined) ?? null,
      email: (onboarding.email as string | undefined) ?? '',
      whatsapp: (onboarding.whatsapp as string | null | undefined) ?? null,
      pais: (onboarding.pais as string | null | undefined) ?? null,
      categoria: (onboarding.categoria as string | null | undefined) ?? null,
      num_productos: (onboarding.num_productos as number | null | undefined) ?? null,
      productos: (onboarding.productos as string | null | undefined) ?? null,
      estado: (onboarding.estado as string | undefined) ?? 'en_revision',
      duracion_seg: (onboarding.duracion_seg as number | null | undefined) ?? null,
      raw_data: (onboarding.raw_data as Record<string, unknown> | null | undefined) ?? null,
    };

    const { data, error } = await getSupabaseAdmin()
      .from('onboardings')
      .upsert(payload, { onConflict: 'id' })
      .select('id, created_at, nombre, empresa, ruc, email, whatsapp, pais, categoria, num_productos, productos, estado, duracion_seg, raw_data')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, restored: data });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
