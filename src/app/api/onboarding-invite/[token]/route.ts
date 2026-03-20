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

  const { data, error } = await getSupabaseAdmin()
    .from('leads')
    .select('nombre, empresa, email, whatsapp, pais, categoria')
    .eq('invite_token', token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 404 });
  }

  return NextResponse.json(data);
}
