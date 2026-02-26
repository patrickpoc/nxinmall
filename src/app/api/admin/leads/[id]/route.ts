import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const ESTADOS_VALIDOS = ['nuevo', 'contactado', 'onboarding', 'descartado'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { estado } = await req.json();

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from('leads')
    .update({ estado })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
