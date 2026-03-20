import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const ESTADOS_VALIDOS = ['nuevo', 'contactado', 'onboarding', 'descartado'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { estado, nombre, empresa, email, whatsapp, pais, categoria, lead_type, document_person_type, document_type, document_number } = body as Record<string, string | null | undefined>;

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
  if (lead_type !== undefined) updates.lead_type = lead_type;
  if (document_person_type !== undefined) updates.document_person_type = document_person_type;
  if (document_type !== undefined) updates.document_type = document_type;
  if (document_number !== undefined) updates.document_number = document_number;

  let { error } = await getSupabaseAdmin()
    .from('leads')
    .update(updates)
    .eq('id', id);

  if (error && /column .* does not exist/i.test(error.message)) {
    const legacyUpdates: Record<string, string | null> = {};
    if (estado !== undefined) legacyUpdates.estado = estado;
    if (nombre !== undefined) legacyUpdates.nombre = nombre;
    if (empresa !== undefined) legacyUpdates.empresa = empresa;
    if (email !== undefined) legacyUpdates.email = email;
    if (whatsapp !== undefined) legacyUpdates.whatsapp = whatsapp;
    if (pais !== undefined) legacyUpdates.pais = pais;
    if (categoria !== undefined) legacyUpdates.categoria = categoria;

    const fallback = await getSupabaseAdmin()
      .from('leads')
      .update(legacyUpdates)
      .eq('id', id);
    error = fallback.error ?? null;
  }

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

  let fetchResult = await supabase
    .from('leads')
    .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token, lead_type, document_person_type, document_type, document_number, document_deferred')
    .eq('id', id)
    .single();
  if (fetchResult.error && /column .* does not exist/i.test(fetchResult.error.message)) {
    fetchResult = await supabase
      .from('leads')
      .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token')
      .eq('id', id)
      .single();
  }
  const { data: existing, error: fetchError } = fetchResult;
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, deleted: existing });
}
