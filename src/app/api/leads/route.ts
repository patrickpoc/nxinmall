import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`api:leads:${ip}`, 12, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again soon.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  try {
    const {
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
      document_deferred,
    } = await req.json();

    const invite_token = crypto.randomUUID();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const leadType = lead_type === 'buyer' ? 'buyer' : 'supplier';
    const onboardingPath = leadType === 'buyer' ? '/onboarding-buyer' : '/onboarding';
    const onboarding_url = `${baseUrl}${onboardingPath}?token=${invite_token}`;

    const fullPayload = {
      nombre,
      empresa,
      email,
      whatsapp,
      pais,
      categoria,
      lead_type: leadType,
      document_person_type: document_person_type ?? null,
      document_type: document_type ?? null,
      document_number: document_number ?? null,
      document_deferred: Boolean(document_deferred),
      onboarding_url,
      invite_token,
    };

    let { error: dbError } = await getSupabaseAdmin()
      .from('leads')
      .upsert(fullPayload, { onConflict: 'email' });

    if (dbError && /column .* does not exist/i.test(dbError.message)) {
      const legacyPayload = {
        nombre,
        empresa,
        email,
        whatsapp,
        pais,
        categoria,
        onboarding_url,
        invite_token,
      };
      const legacyResult = await getSupabaseAdmin()
        .from('leads')
        .upsert(legacyPayload, { onConflict: 'email' });
      dbError = legacyResult.error ?? null;
    }

    if (dbError) {
      console.error('[leads] Supabase error:', dbError.message, dbError.details);
      return NextResponse.json(
        { success: false, error: 'Could not save lead.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en /api/leads:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
