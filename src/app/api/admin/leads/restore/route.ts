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
    };

    const { data, error } = await getSupabaseAdmin()
      .from('leads')
      .upsert(payload, { onConflict: 'id' })
      .select('id, created_at, nombre, empresa, email, whatsapp, pais, categoria, estado, invite_token')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, restored: data });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
