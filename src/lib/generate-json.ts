import { OnboardingState, StoreConfig } from '@/types/onboarding';
import { CATEGORIAS } from '@/data/catalog';
import { slugify } from './utils';

export function generateStoreJson(state: OnboardingState): StoreConfig {
  const cat = state.perfil.categoria;
  const colorPrimario = cat && CATEGORIAS[cat] ? CATEGORIAS[cat].colorPrimario : '#0a63d6';
  const entrevista = state.catalogo.entrevista ?? {
    produtosPrincipais: [],
    produtoAncora: '',
    sazonalidade: '',
    janelaSazonal: '',
    moqTipico: '',
    faixaPreco: '',
    unidadeVenda: '',
    formatos: '',
    tipoOperacao: '',
    origemProduto: '',
    capacidadeMensalLinha: '',
    mercadosAtendidos: '',
    incoterms: '',
    leadTime: '',
    docsCertsVenda: '',
    condicoesMinimas: '',
    diferenciais: '',
    riscosRestricoes: '',
    onboardingSummary: '',
  };

  return {
    metadata: {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      sessionId: state.meta.sessionId,
      status: 'PENDING_UPLOAD',
      fuente: 'Wizard Onboarding NxinMall Peru',
      idioma: state.idioma,
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
      categoriasSelecionadas: state.perfil.categoriasSelecionadas,
      outrasAtividades: state.perfil.outrasAtividades,
      tagline: state.perfil.tagline,
      descripcion: state.perfil.descripcion,
      anosFundacion: state.perfil.anosFundacion,
      capacidadMensual: state.perfil.capacidadMensual,
      certificaciones: state.perfil.certificaciones,
      outrasCertificacoes: state.perfil.outrasCertificacoes,
      colorPrimario,
      logo: state.perfil.logo,
      banner: state.perfil.banner,
    },
    catalogo: {
      totalProductos: state.catalogo.productosSeleccionados.length,
      entrevista,
      productos: state.catalogo.productosSeleccionados.map(p => ({
        id: p.id,
        nombre: p.nombre,
        nombre_en: p.nombre_en,
        descripcion_en: p.descripcion_en,
        esPersonalizado: p.esPersonalizado,
        moq: p.moq,
        precio: p.precio,
        imagen: p.imagen,
        nxin: p.nxin,
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
