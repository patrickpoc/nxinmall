import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateStoreJson } from '@/lib/generate-json';
import { submitToGoogleSheets } from '@/lib/sheets';
import { OnboardingState } from '@/types/onboarding';

export async function POST(req: NextRequest) {
  try {
    const state: OnboardingState = await req.json();
    const storeJson = generateStoreJson(state);

    const duracionSeg = Math.round((Date.now() - new Date(state.meta.startedAt).getTime()) / 1000);

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
      duracionSeg,
      fuente: 'Wizard Onboarding',
      etapa: 'KYB_PENDIENTE',
    };

    // Guardar en Supabase (no bloquea si falla)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabase.from('onboardings').upsert({
        session_id:   state.meta.sessionId,
        nombre:       state.registro.nombre,
        empresa:      state.registro.empresa,
        ruc:          state.registro.ruc,
        email:        state.registro.email,
        whatsapp:     state.registro.whatsapp,
        cargo:        state.registro.cargo,
        pais:         state.registro.pais,
        departamento: state.ubicacion.departamento,
        provincia:    state.ubicacion.provincia,
        distrito:     state.ubicacion.distrito,
        categoria:    state.perfil.categoria,
        tagline:      state.perfil.tagline,
        num_productos: state.catalogo.productosSeleccionados.length,
        productos:    state.catalogo.productosSeleccionados.map((p) => p.nombre).join(' | '),
        duracion_seg: duracionSeg,
        estado:       'kyb_pendiente',
        raw_data:     storeJson,
      }, { onConflict: 'session_id' });
    } catch (dbErr) {
      console.error('Supabase insert error (no crítico):', dbErr);
    }

    await submitToGoogleSheets(sheetsPayload);

    return NextResponse.json({ success: true, sessionId: state.meta.sessionId });
  } catch (error) {
    console.error('Error en /api/submit:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
