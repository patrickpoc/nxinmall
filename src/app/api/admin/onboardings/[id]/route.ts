import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const ESTADOS_VALIDOS = ['kyb_pendiente', 'en_revision', 'aprobado', 'rechazado'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { estado, nombre, empresa, ruc, email, whatsapp, pais, categoria, num_productos, productos } = body as Record<string, string | number | null | undefined>;

  if (typeof estado === 'string' && !ESTADOS_VALIDOS.includes(estado)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
  }

  const updates: Record<string, string | number | null> = {};
  if (estado !== undefined) updates.estado = estado;
  if (nombre !== undefined) updates.nombre = nombre;
  if (empresa !== undefined) updates.empresa = empresa;
  if (ruc !== undefined) updates.ruc = ruc;
  if (email !== undefined) updates.email = email;
  if (whatsapp !== undefined) updates.whatsapp = whatsapp;
  if (pais !== undefined) updates.pais = pais;
  if (categoria !== undefined) updates.categoria = categoria;
  if (num_productos !== undefined) updates.num_productos = num_productos;
  if (productos !== undefined) updates.productos = productos;

  const { error } = await getSupabaseAdmin()
    .from('onboardings')
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
    .from('onboardings')
    .select('id, created_at, nombre, empresa, ruc, email, whatsapp, pais, categoria, num_productos, productos, estado, duracion_seg, raw_data')
    .eq('id', id)
    .single();
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

  const { error } = await supabase.from('onboardings').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, deleted: existing });
}
