import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const ESTADOS_VALIDOS = ['nuevo', 'contactado', 'onboarding', 'descartado'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { estado, nombre, empresa, email, whatsapp, pais, categoria } = body as Record<string, string | null | undefined>;

  if (estado && !ESTADOS_VALIDOS.includes(estado)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
  }

  const updates: Record<string, string | null> = {};
  if (estado !== undefined) updates.estado = estado;
  if (nombre !== undefined) updates.nombre = nombre;
  if (empresa !== undefined) updates.empresa = empresa;
  if (email !== undefined) updates.email = email;
  if (whatsapp !== undefined) updates.whatsapp = whatsapp;
  if (pais !== undefined) updates.pais = pais;
  if (categoria !== undefined) updates.categoria = categoria;

  const { error } = await getSupabaseAdmin()
    .from('leads')
    .update(updates)
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: existing, error: fetchError } = await supabase
    .from('leads')
    .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token')
    .eq('id', id)
    .single();
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, deleted: existing });
}
