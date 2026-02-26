import { Categoria } from '@/types/onboarding';

export interface NxinMapping {
  /** ID de la categoría en NXIN (ver nxin-categories.ts) */
  categoria: string;
  /** ID de la subcategoría en NXIN */
  subcategoria: string;
  /** true = hay que pedirle a NXIN que cree esta categoría/subcategoría */
  esNueva: boolean;
}

export interface ProductoCatalogo {
  id: string;
  nombre: string;
  nombre_en: string;
  unidad: string;
  precioRef: { min: number; max: number };
  moqRef: number;
  imagenStock: string;
  descripcion_es: string;
  descripcion_en: string;
  /** Mapeo directo a la taxonomía de la plataforma NXIN Mall */
  nxin: NxinMapping;
}

export interface CategoriaCatalogo {
  id: Categoria;
  nombre: string;
  emoji: string;
  colorPrimario: string;
  ejemplos: string[];
  subtitulo: string;
  taglineSugerido: string;
  productos: ProductoCatalogo[];
}

// ─── Atajos NXIN reutilizables ──────────────────────────────────────────────
// Productos existentes
export const N = {
  // Envase — existentes
  bolsas:          { categoria: 'envase',           subcategoria: 'bolsas',            esNueva: false },
  cajasBlister:    { categoria: 'envase',           subcategoria: 'cajas-blister',     esNueva: false },
  peliculas:       { categoria: 'envase',           subcategoria: 'peliculas',         esNueva: false },
  cintas:          { categoria: 'envase',           subcategoria: 'cintas',            esNueva: false },
  herramientasEnv: { categoria: 'envase',           subcategoria: 'herramientas-env',  esNueva: false },
  peliculaEnroll:  { categoria: 'envase',           subcategoria: 'pelicula-enrollada',esNueva: false },
  // Envase — nuevas
  cajasExport:     { categoria: 'envase',           subcategoria: 'cajas-exportacion', esNueva: true  },
  bandejasEps:     { categoria: 'envase',           subcategoria: 'bandejas-eps',      esNueva: true  },
  etiquetas:       { categoria: 'envase',           subcategoria: 'etiquetas',         esNueva: true  },
  // Siembra — existentes
  sustrato:        { categoria: 'siembra',          subcategoria: 'sustrato',          esNueva: false },
  macetas:         { categoria: 'siembra',          subcategoria: 'macetas',           esNueva: false },
  riegoGoteo:      { categoria: 'siembra',          subcategoria: 'riego-goteo',       esNueva: false },
  herrAuxiliares:  { categoria: 'siembra',          subcategoria: 'herr-auxiliares',   esNueva: false },
  // Siembra — nuevas
  semillas:        { categoria: 'siembra',          subcategoria: 'semillas',          esNueva: true  },
  plasticosAgric:  { categoria: 'siembra',          subcategoria: 'plasticos-agric',   esNueva: true  },
  // Plantín — existentes
  sueloPlantin:    { categoria: 'plantin',          subcategoria: 'suelo-plantin',     esNueva: false },
  contenedorPlant: { categoria: 'plantin',          subcategoria: 'contenedor-plant',  esNueva: false },
  // Plantín — nuevas
  plantonInjert:   { categoria: 'plantin',          subcategoria: 'planton-injertado', esNueva: true  },
  // Cosecha — existentes
  cestaCaja:       { categoria: 'cosecha',          subcategoria: 'cesta-caja',        esNueva: false },
  // Accesorios Frutas — nuevas
  proteccionCampo: { categoria: 'accesorios-frutas',subcategoria: 'proteccion-campo',  esNueva: true  },
  // Otros — existentes
  artProteccion:   { categoria: 'otros',            subcategoria: 'art-proteccion',    esNueva: false },
  // Otros — nuevas
  serviciosPost:   { categoria: 'otros',            subcategoria: 'servicios-post',    esNueva: true  },
  // Produce Fresco — nuevas
  frutaFresca:     { categoria: 'produce-fresco',   subcategoria: 'fruta-fresca',      esNueva: true  },
  verduraFresca:   { categoria: 'produce-fresco',   subcategoria: 'verdura-fresca',    esNueva: true  },
  florCortada:     { categoria: 'produce-fresco',   subcategoria: 'flor-cortada',      esNueva: true  },
  frutaTropical:   { categoria: 'produce-fresco',   subcategoria: 'fruta-tropical',    esNueva: true  },
  // Produce Procesado — nuevas
  frutaCongelada:  { categoria: 'produce-procesado',subcategoria: 'fruta-congelada',   esNueva: true  },
  frutaDeshid:     { categoria: 'produce-procesado',subcategoria: 'fruta-deshid',      esNueva: true  },
  superalimentos:  { categoria: 'produce-procesado',subcategoria: 'superalimentos',    esNueva: true  },
  especias:        { categoria: 'produce-procesado',subcategoria: 'especias',          esNueva: true  },
  // Agroquímicos — nuevas
  fertilizantes:   { categoria: 'agroquimicos',     subcategoria: 'fertilizantes',     esNueva: true  },
  fungicidas:      { categoria: 'agroquimicos',     subcategoria: 'fungicidas',        esNueva: true  },
  bioestimulantes: { categoria: 'agroquimicos',     subcategoria: 'bioestimulantes',   esNueva: true  },
  herbicidas:      { categoria: 'agroquimicos',     subcategoria: 'herbicidas',        esNueva: true  },
  coadyuvantes:    { categoria: 'agroquimicos',     subcategoria: 'coadyuvantes',      esNueva: true  },
  // Vivero Ornamental — nuevas
  plantasOrnament: { categoria: 'vivero-ornamental',subcategoria: 'plantas-ornament',  esNueva: true  },
  cespedFollaje:   { categoria: 'vivero-ornamental',subcategoria: 'cesped-follaje',    esNueva: true  },
} satisfies Record<string, NxinMapping>;
