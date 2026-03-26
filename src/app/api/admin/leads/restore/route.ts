import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lead = body?.lead as Record<string, unknown> | undefined;
    if (!lead || !lead.email) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const payload = {
      id: lead.id as string | undefined,
      nombre: (lead.nombre as string | undefined) ?? '',
      empresa: (lead.empresa as string | undefined) ?? '',
      email: (lead.email as string | undefined) ?? '',
      whatsapp: (lead.whatsapp as string | undefined) ?? '',
      pais: (lead.pais as string | undefined) ?? '',
      categoria: (lead.categoria as string | undefined) ?? null,
      estado: (lead.estado as string | undefined) ?? 'nuevo',
      invite_token: (lead.invite_token as string | undefined) ?? null,
      lead_type: (lead.lead_type as string | undefined) ?? 'supplier',
      document_person_type: (lead.document_person_type as string | undefined) ?? null,
      document_type: (lead.document_type as string | undefined) ?? null,
      document_number: (lead.document_number as string | undefined) ?? null,
      document_deferred: Boolean(lead.document_deferred),
      funnel_stage: (lead.funnel_stage as string | undefined) ?? 'started',
      source_channel: (lead.source_channel as string | undefined) ?? null,
      first_contact_at: (lead.first_contact_at as string | undefined) ?? null,
      step1_completed_at: (lead.step1_completed_at as string | undefined) ?? null,
      step2_completed_at: (lead.step2_completed_at as string | undefined) ?? null,
      follow_up_notes: (lead.follow_up_notes as string | undefined) ?? null,
    };

    let upsertResult = await getSupabaseAdmin()
      .from('leads')
      .upsert(payload, { onConflict: 'id' })
      .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token, lead_type, document_person_type, document_type, document_number, document_deferred, funnel_stage, source_channel, first_contact_at, step1_completed_at, step2_completed_at, follow_up_notes')
      .single();

    if (upsertResult.error && /column .* does not exist/i.test(upsertResult.error.message)) {
      const legacyPayload = {
        id: payload.id,
        nombre: payload.nombre,
        empresa: payload.empresa,
        email: payload.email,
        whatsapp: payload.whatsapp,
        pais: payload.pais,
        categoria: payload.categoria,
        estado: payload.estado,
        invite_token: payload.invite_token,
      };
      upsertResult = await getSupabaseAdmin()
        .from('leads')
        .upsert(legacyPayload, { onConflict: 'id' })
        .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token')
        .single();
    }

    const { data, error } = upsertResult;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, restored: data });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
