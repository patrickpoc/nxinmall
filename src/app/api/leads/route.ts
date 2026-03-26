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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const step = body?.step === 'step2' ? 'step2' : 'step1';
    const leadId = typeof body?.lead_id === 'string' ? body.lead_id : null;
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
      cargo,
      export_experience,
      primary_challenge,
      cta_source,
      utm_source,
      utm_medium,
      utm_campaign,
      lang,
    } = body as Record<string, unknown>;

    const leadType = lead_type === 'buyer' ? 'buyer' : 'supplier';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    let dbError: { message?: string; details?: string } | null = null;
    let resolvedLeadId = leadId;

    if (step === 'step1') {
      const inviteToken = crypto.randomUUID();
      const onboardingPath = leadType === 'buyer' ? '/onboarding-buyer' : '/onboarding';
      const onboardingUrl = `${baseUrl}${onboardingPath}?token=${inviteToken}`;
      const step1Payload = {
        nombre,
        empresa,
        email,
        whatsapp,
        pais,
        categoria,
        lead_type: leadType,
        estado: 'nuevo',
        funnel_stage: 'step1_completed',
        step1_completed_at: new Date().toISOString(),
        source_channel: cta_source ?? 'landing-main',
        lang: lang ?? 'en',
        utm_source: utm_source ?? null,
        utm_medium: utm_medium ?? null,
        utm_campaign: utm_campaign ?? null,
        onboarding_url: onboardingUrl,
        invite_token: inviteToken,
      };

      const upsertResult = await getSupabaseAdmin()
        .from('leads')
        .upsert(step1Payload, { onConflict: 'email' })
        .select('id')
        .single();
      dbError = upsertResult.error ?? null;
      resolvedLeadId = upsertResult.data?.id ?? resolvedLeadId;
    } else {
      const step2Payload = {
        document_person_type: document_person_type ?? null,
        document_type: document_type ?? null,
        document_number: document_number ?? null,
        document_deferred: Boolean(document_deferred),
        cargo: cargo ?? null,
        export_experience: export_experience ?? null,
        primary_challenge: primary_challenge ?? null,
        funnel_stage: 'step2_completed',
        step2_completed_at: new Date().toISOString(),
      };

      if (!resolvedLeadId && typeof email === 'string') {
        const existing = await getSupabaseAdmin()
          .from('leads')
          .select('id')
          .eq('email', email)
          .maybeSingle();
        resolvedLeadId = existing.data?.id ?? null;
      }

      if (!resolvedLeadId) {
        return NextResponse.json({ success: false, error: 'Lead not found for step 2.' }, { status: 404 });
      }

      const updateResult = await getSupabaseAdmin()
        .from('leads')
        .update(step2Payload)
        .eq('id', resolvedLeadId);
      dbError = updateResult.error ?? null;
    }

    if (dbError && /column .* does not exist/i.test(dbError.message ?? '')) {
      if (step === 'step1') {
        const inviteToken = crypto.randomUUID();
        const onboardingPath = leadType === 'buyer' ? '/onboarding-buyer' : '/onboarding';
        const onboardingUrl = `${baseUrl}${onboardingPath}?token=${inviteToken}`;
        const legacyPayload = {
          nombre,
          empresa,
          email,
          whatsapp,
          pais,
          categoria,
          onboarding_url: onboardingUrl,
          invite_token: inviteToken,
        };
        const legacyResult = await getSupabaseAdmin()
          .from('leads')
          .upsert(legacyPayload, { onConflict: 'email' })
          .select('id')
          .single();
        dbError = legacyResult.error ?? null;
        resolvedLeadId = legacyResult.data?.id ?? resolvedLeadId;
      } else {
        dbError = null;
      }
    }

    if (dbError) {
      console.error('[leads] Supabase error:', dbError.message, dbError.details);
      return NextResponse.json(
        { success: false, error: 'Could not save lead.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, lead_id: resolvedLeadId, stage: step === 'step1' ? 'step1_completed' : 'step2_completed' });
  } catch (error) {
    console.error('Error en /api/leads:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
