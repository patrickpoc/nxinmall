import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const ip = getClientIp(_req.headers);
  const rl = checkRateLimit(`api:onboarding-invite:${ip}`, 30, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again soon.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  const { token } = await params;

  let query = await getSupabaseAdmin()
    .from('leads')
    .select('nombre, empresa, email, whatsapp, pais, categoria, lead_type, document_person_type, document_type, document_number, document_deferred')
    .eq('invite_token', token)
    .single();

  if (query.error && /column .* does not exist/i.test(query.error.message)) {
    query = await getSupabaseAdmin()
      .from('leads')
      .select('nombre, empresa, email, whatsapp, pais, categoria')
      .eq('invite_token', token)
      .single();
  }

  const { data, error } = query;
  if (error || !data) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 404 });
  }

  return NextResponse.json({
    ...data,
    lead_type: (data as any).lead_type ?? 'supplier',
    document_person_type: (data as any).document_person_type ?? null,
    document_type: (data as any).document_type ?? null,
    document_number: (data as any).document_number ?? null,
    document_deferred: (data as any).document_deferred ?? false,
  });
}
