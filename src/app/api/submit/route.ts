import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateStoreJson } from '@/lib/generate-json';
import { OnboardingState } from '@/types/onboarding';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const state: OnboardingState = body;
    const inviteToken: string | null = body.inviteToken ?? null;
    const storeJson = generateStoreJson(state);

    const duracionSeg = Math.round((Date.now() - new Date(state.meta.startedAt).getTime()) / 1000);

    // Guardar en Supabase (no bloquea si falla)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      // Marcar lead como completado (wizard enviado)
      const leadQuery = supabase.from('leads').update({ estado: 'completado' });
      if (inviteToken) {
        await leadQuery.eq('invite_token', inviteToken);
      } else {
        await leadQuery.eq('email', state.registro.email);
      }

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
        estado:       'en_revision',
        raw_data:     storeJson,
      }, { onConflict: 'session_id' });
    } catch (dbErr) {
      console.error('Supabase insert error (no crítico):', dbErr);
    }

    return NextResponse.json({ success: true, sessionId: state.meta.sessionId });
  } catch (error) {
    console.error('Error en /api/submit:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
