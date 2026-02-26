import { NextRequest, NextResponse } from 'next/server';
import { generateStoreJson } from '@/lib/generate-json';
import { submitToGoogleSheets } from '@/lib/sheets';
import { OnboardingState } from '@/types/onboarding';

export async function POST(req: NextRequest) {
  try {
    const state: OnboardingState = await req.json();
    const storeJson = generateStoreJson(state);

    const sheetsPayload = {
      timestamp: new Date().toISOString(),
      sessionId: state.meta.sessionId,
      nombre: state.registro.nombre,
      empresa: state.registro.empresa,
      ruc: state.registro.ruc,
      email: state.registro.email,
      whatsapp: state.registro.whatsapp,
      cargo: state.registro.cargo,
      pais: state.registro.pais,
      departamento: state.ubicacion.departamento,
      provincia: state.ubicacion.provincia,
      distrito: state.ubicacion.distrito,
      categoria: state.perfil.categoria,
      tagline: state.perfil.tagline,
      certificaciones: state.perfil.certificaciones.join(', '),
      capacidadMensual: state.perfil.capacidadMensual,
      tieneLogo: !!state.perfil.logo,
      tieneBanner: !!state.perfil.banner,
      numProductos: state.catalogo.productosSeleccionados.length,
      productosNombres: state.catalogo.productosSeleccionados.map((p) => p.nombre).join(' | '),
      numImagenesSubidas: state.catalogo.productosSeleccionados.filter((p) => p.imagen?.fuente === 'upload').length,
      duracionSeg: Math.round((Date.now() - new Date(state.meta.startedAt).getTime()) / 1000),
      fuente: 'Wizard Onboarding',
      etapa: 'KYB_PENDIENTE',
    };

    await submitToGoogleSheets(sheetsPayload);

    return NextResponse.json({ success: true, sessionId: state.meta.sessionId });
  } catch (error) {
    console.error('Error en /api/submit:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
