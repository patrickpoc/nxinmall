import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { nombre, empresa, email, whatsapp, pais, categoria } = await req.json();

    const invite_token = crypto.randomUUID();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const onboarding_url = `${baseUrl}/onboarding?token=${invite_token}`;

    const { error: dbError } = await getSupabaseAdmin().from('leads').upsert(
      { nombre, empresa, email, whatsapp, pais, categoria, onboarding_url, invite_token },
      { onConflict: 'email' }
    );
    if (dbError) console.error('[leads] Supabase error:', dbError.message, dbError.details);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en /api/leads:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
