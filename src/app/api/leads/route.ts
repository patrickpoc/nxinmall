import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { submitToGoogleSheets } from '@/lib/sheets';

export async function POST(req: NextRequest) {
  try {
    const { nombre, empresa, email, whatsapp, pais } = await req.json();

    const params = new URLSearchParams({ nombre, empresa, email, whatsapp, pais });
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
    const onboarding_url = `${baseUrl}/onboarding?${params.toString()}`;

    const { error: dbError } = await getSupabaseAdmin().from('leads').upsert(
      { nombre, empresa, email, whatsapp, pais, onboarding_url },
      { onConflict: 'email' }
    );
    if (dbError) console.error('[leads] Supabase error:', dbError.message, dbError.details);

    await submitToGoogleSheets({
      timestamp: new Date().toISOString(),
      sessionId: '',
      nombre,
      empresa,
      ruc: '',
      email,
      whatsapp,
      cargo: '',
      pais,
      departamento: '',
      provincia: '',
      distrito: '',
      categoria: '',
      tagline: '',
      certificaciones: '',
      capacidadMensual: '',
      tieneLogo: false,
      tieneBanner: false,
      numProductos: 0,
      productosNombres: '',
      numImagenesSubidas: 0,
      duracionSeg: 0,
      fuente: 'Landing Lead',
      etapa: 'LEAD',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en /api/leads:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
