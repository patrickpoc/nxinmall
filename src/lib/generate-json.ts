import { OnboardingState, StoreConfig } from '@/types/onboarding';
import { CATEGORIAS } from '@/data/catalog';
import { slugify } from './utils';

export function generateStoreJson(state: OnboardingState): StoreConfig {
  const cat = state.perfil.categoria;
  const colorPrimario = cat && CATEGORIAS[cat] ? CATEGORIAS[cat].colorPrimario : '#0a63d6';

  return {
    metadata: {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      sessionId: state.meta.sessionId,
      status: 'PENDING_UPLOAD',
      fuente: 'Wizard Onboarding NxinMall Peru',
    },
    proveedor: {
      nombre: state.registro.nombre,
      cargo: state.registro.cargo,
      empresa: state.registro.empresa,
      ruc: state.registro.ruc,
      email: state.registro.email,
      whatsapp: state.registro.whatsapp,
      pais: state.registro.pais,
    },
    ubicacion: {
      departamento: state.ubicacion.departamento,
      provincia: state.ubicacion.provincia,
      distrito: state.ubicacion.distrito,
      direccion: state.ubicacion.direccion,
      referencia: state.ubicacion.referencia,
      codigoPostal: state.ubicacion.codigoPostal,
    },
    tienda: {
      categoria: state.perfil.categoria,
      tagline: state.perfil.tagline,
      descripcion: state.perfil.descripcion,
      anosFundacion: state.perfil.anosFundacion,
      capacidadMensual: state.perfil.capacidadMensual,
      certificaciones: state.perfil.certificaciones,
      colorPrimario,
      logo: state.perfil.logo,
      banner: state.perfil.banner,
    },
    catalogo: {
      totalProductos: state.catalogo.productosSeleccionados.length,
      productos: state.catalogo.productosSeleccionados.map(p => ({
        id: p.id,
        nombre: p.nombre,
        esPersonalizado: p.esPersonalizado,
        moq: p.moq,
        precio: p.precio,
        imagen: p.imagen,
      })),
    },
  };
}

export function downloadStoreJson(state: OnboardingState): void {
  const storeJson = generateStoreJson(state);
  const empresaSlug = slugify(state.registro.empresa || 'empresa');
  const filename = `nxinmall_${empresaSlug}_${state.meta.sessionId}.json`;

  const blob = new Blob([JSON.stringify(storeJson, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
