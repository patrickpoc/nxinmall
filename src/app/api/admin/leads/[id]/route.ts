import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const ESTADOS_VALIDOS = ['nuevo', 'contactado', 'onboarding', 'descartado'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const {
    estado,
    nombre,
    empresa,
    email,
    whatsapp,
    pais,
    categoria,
    lead_type,
    document_person_type,
    document_type,
    document_number,
    funnel_stage,
    source_channel,
    follow_up_notes,
  } = body as Record<string, string | null | undefined>;

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
  if (funnel_stage !== undefined) updates.funnel_stage = funnel_stage;
  if (source_channel !== undefined) updates.source_channel = source_channel;
  if (follow_up_notes !== undefined) updates.follow_up_notes = follow_up_notes;
  if (estado === 'contactado') updates.first_contact_at = new Date().toISOString();

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
  // Prefer deleting with returning payload in one DB roundtrip.
  // Fallback to legacy select list if new columns are unavailable.
  let deleteResult = await supabase
    .from('leads')
    .delete()
    .eq('id', id)
    .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token, lead_type, document_person_type, document_type, document_number, document_deferred, funnel_stage, source_channel, first_contact_at, step1_completed_at, step2_completed_at, follow_up_notes')
    .maybeSingle();

  if (deleteResult.error && /column .* does not exist/i.test(deleteResult.error.message)) {
    deleteResult = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
      .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token')
      .maybeSingle();
  }

  const { data: deleted, error } = deleteResult;
  if (error) {
    // If physical delete is blocked (e.g., FK dependencies), fallback to soft-delete.
    if ((error as { code?: string }).code === '23503') {
      const soft = await supabase
        .from('leads')
        .update({ estado: 'descartado' })
        .eq('id', id)
        .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token')
        .maybeSingle();

      if (soft.error) {
        return NextResponse.json({ error: soft.error.message }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        deleted: soft.data,
        softDeleted: true,
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!deleted) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, deleted });
}
