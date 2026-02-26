/**
 * Taxonomía oficial de categorías de la plataforma NXIN Mall.
 * esNueva: true  → categoría/subcategoría que no existe aún en NXIN;
 *                  el equipo de operaciones debe solicitarla antes de subir.
 * esNueva: false → ya existe en la plataforma.
 */

export interface NxinSubcategoria {
  id: string;
  nombre_es: string;
  nombre_en: string;
  esNueva: boolean;
}

export interface NxinCategoria {
  id: string;
  nombre_es: string;
  nombre_en: string;
  esNueva: boolean;
  subcategorias: NxinSubcategoria[];
}

export const NXIN_CATEGORIAS: NxinCategoria[] = [
  // ─── CATEGORÍAS EXISTENTES EN LA PLATAFORMA ──────────────────────────────
  {
    id: 'envase',
    nombre_es: 'Envase',
    nombre_en: 'Packaging',
    esNueva: false,
    subcategorias: [
      { id: 'bolsas',            nombre_es: 'Bolsas de Envase',              nombre_en: 'Packaging Bags',          esNueva: false },
      { id: 'cajas-blister',     nombre_es: 'Cajas de Blister PET',          nombre_en: 'PET Blister Boxes',       esNueva: false },
      { id: 'peliculas',         nombre_es: 'Películas Elásticas',            nombre_en: 'Stretch Films',           esNueva: false },
      { id: 'cintas',            nombre_es: 'Cintas Adhesivas',               nombre_en: 'Adhesive Tapes',          esNueva: false },
      { id: 'herramientas-env',  nombre_es: 'Herramientas de Envase',         nombre_en: 'Packaging Tools',         esNueva: false },
      { id: 'pelicula-enrollada',nombre_es: 'Película Enrollada de Envase',   nombre_en: 'Rolled Packaging Film',   esNueva: false },
      // Subcategorías nuevas sugeridas bajo Envase
      { id: 'cajas-exportacion', nombre_es: 'Cajas de Exportación',           nombre_en: 'Export Cardboard Boxes',  esNueva: true  },
      { id: 'bandejas-eps',      nombre_es: 'Bandejas EPS',                   nombre_en: 'EPS Trays',               esNueva: true  },
      { id: 'etiquetas',         nombre_es: 'Etiquetas y Rótulos',            nombre_en: 'Labels & Tags',           esNueva: true  },
    ],
  },
  {
    id: 'dispositivo',
    nombre_es: 'Dispositivo',
    nombre_en: 'Device',
    esNueva: false,
    subcategorias: [
      { id: 'dispositivo-int',   nombre_es: 'Dispositivo Inteligente',        nombre_en: 'Smart Device',            esNueva: false },
    ],
  },
  {
    id: 'siembra',
    nombre_es: 'Siembra',
    nombre_en: 'Planting',
    esNueva: false,
    subcategorias: [
      { id: 'sustrato',          nombre_es: 'Sustrato',                       nombre_en: 'Substrate',               esNueva: false },
      { id: 'macetas',           nombre_es: 'Macetas',                        nombre_en: 'Pots & Trays',            esNueva: false },
      { id: 'riego-goteo',       nombre_es: 'Sistemas de Riego por Goteo',    nombre_en: 'Drip Irrigation Systems', esNueva: false },
      { id: 'herr-auxiliares',   nombre_es: 'Herramientas Auxiliares',         nombre_en: 'Auxiliary Tools',         esNueva: false },
      // Subcategorías nuevas bajo Siembra
      { id: 'semillas',          nombre_es: 'Semillas Certificadas',          nombre_en: 'Certified Seeds',         esNueva: true  },
      { id: 'plasticos-agric',   nombre_es: 'Plásticos Agrícolas',            nombre_en: 'Agricultural Plastics',   esNueva: true  },
    ],
  },
  {
    id: 'accesorios-frutas',
    nombre_es: 'Accesorios Relacionados con Frutas',
    nombre_en: 'Fruit Related Accessories',
    esNueva: false,
    subcategorias: [
      { id: 'accesorios-fruta',  nombre_es: 'Accesorios con Frutas',          nombre_en: 'Fruit Accessories',       esNueva: false },
      { id: 'flower-trolley',    nombre_es: 'Flower Transport Trolley',       nombre_en: 'Flower Transport Trolley',esNueva: false },
      { id: 'transport-trolley', nombre_es: 'Transport Trolley',              nombre_en: 'Transport Trolley',       esNueva: false },
      { id: 'robotic',           nombre_es: 'Robotic Automation',             nombre_en: 'Robotic Automation',      esNueva: false },
      { id: 'retail-display',    nombre_es: 'Retail Display',                 nombre_en: 'Retail Display',          esNueva: false },
      // Nueva subcategoría sugerida
      { id: 'proteccion-campo',  nombre_es: 'Protección de Fruta en Campo',   nombre_en: 'Field Fruit Protection',  esNueva: true  },
    ],
  },
  {
    id: 'plantin',
    nombre_es: 'Plantín',
    nombre_en: 'Seedling',
    esNueva: false,
    subcategorias: [
      { id: 'suelo-plantin',     nombre_es: 'Suelo para Plantines',           nombre_en: 'Seedling Soil',           esNueva: false },
      { id: 'contenedor-plant',  nombre_es: 'Contenedor para Plantines',      nombre_en: 'Seedling Container',      esNueva: false },
      // Nueva subcategoría sugerida
      { id: 'planton-injertado', nombre_es: 'Plantón Injertado Certificado',  nombre_en: 'Certified Grafted Seedling', esNueva: true },
    ],
  },
  {
    id: 'cosecha',
    nombre_es: 'Cosecha',
    nombre_en: 'Harvest',
    esNueva: false,
    subcategorias: [
      { id: 'cesta-caja',        nombre_es: 'Cesta / Caja de Cosecha',        nombre_en: 'Harvest Basket / Box',    esNueva: false },
      { id: 'herr-espinas',      nombre_es: 'Herramienta para Quitar Espinas',nombre_en: 'Thorn Removal Tool',      esNueva: false },
      { id: 'herr-atar',         nombre_es: 'Herramienta para Atar',          nombre_en: 'Tying Tool',              esNueva: false },
    ],
  },
  {
    id: 'exhibicion',
    nombre_es: 'Exhibición',
    nombre_en: 'Exhibition / Display',
    esNueva: false,
    subcategorias: [
      { id: 'suelo-exhib',       nombre_es: 'Suelo para Plantines',           nombre_en: 'Seedling Soil',           esNueva: false },
      { id: 'contenedor-exhib',  nombre_es: 'Contenedor para Plantines',      nombre_en: 'Seedling Container',      esNueva: false },
    ],
  },
  {
    id: 'otros',
    nombre_es: 'Otros',
    nombre_en: 'Others',
    esNueva: false,
    subcategorias: [
      { id: 'goma-elastica',     nombre_es: 'Goma Elástica',                  nombre_en: 'Rubber Band',             esNueva: false },
      { id: 'art-proteccion',    nombre_es: 'Artículos de Protección',        nombre_en: 'Protection Articles',     esNueva: false },
      // Nueva subcategoría sugerida
      { id: 'servicios-post',    nombre_es: 'Servicios de Poscosecha',        nombre_en: 'Post-harvest Services',   esNueva: true  },
    ],
  },

  // ─── CATEGORÍAS NUEVAS — SUGERIR A NXIN ──────────────────────────────────
  {
    id: 'produce-fresco',
    nombre_es: 'Produce Fresco',
    nombre_en: 'Fresh Produce',
    esNueva: true,
    subcategorias: [
      { id: 'fruta-fresca',      nombre_es: 'Fruta Fresca de Mesa',           nombre_en: 'Fresh Table Fruit',              esNueva: true },
      { id: 'verdura-fresca',    nombre_es: 'Verdura Fresca de Exportación',  nombre_en: 'Fresh Export Vegetable',         esNueva: true },
      { id: 'flor-cortada',      nombre_es: 'Flor Cortada de Exportación',    nombre_en: 'Export Cut Flower',              esNueva: true },
      { id: 'fruta-tropical',    nombre_es: 'Fruta Tropical',                 nombre_en: 'Tropical Fruit',                 esNueva: true },
    ],
  },
  {
    id: 'produce-procesado',
    nombre_es: 'Produce Procesado',
    nombre_en: 'Processed Produce',
    esNueva: true,
    subcategorias: [
      { id: 'fruta-congelada',   nombre_es: 'Fruta Congelada IQF',            nombre_en: 'IQF Frozen Fruit',               esNueva: true },
      { id: 'fruta-deshid',      nombre_es: 'Fruta Deshidratada',             nombre_en: 'Dried Fruit',                    esNueva: true },
      { id: 'superalimentos',    nombre_es: 'Superalimentos',                 nombre_en: 'Superfoods',                     esNueva: true },
      { id: 'especias',          nombre_es: 'Especias y Condimentos',         nombre_en: 'Spices & Condiments',            esNueva: true },
    ],
  },
  {
    id: 'agroquimicos',
    nombre_es: 'Agroquímicos',
    nombre_en: 'Agrochemicals',
    esNueva: true,
    subcategorias: [
      { id: 'fertilizantes',     nombre_es: 'Fertilizantes',                  nombre_en: 'Fertilizers',                    esNueva: true },
      { id: 'fungicidas',        nombre_es: 'Fungicidas e Insecticidas',      nombre_en: 'Fungicides & Insecticides',      esNueva: true },
      { id: 'bioestimulantes',   nombre_es: 'Bioestimulantes',               nombre_en: 'Biostimulants',                  esNueva: true },
      { id: 'herbicidas',        nombre_es: 'Herbicidas',                     nombre_en: 'Herbicides',                     esNueva: true },
      { id: 'coadyuvantes',      nombre_es: 'Coadyuvantes Agrícolas',         nombre_en: 'Agricultural Adjuvants',         esNueva: true },
    ],
  },
  {
    id: 'vivero-ornamental',
    nombre_es: 'Vivero Ornamental',
    nombre_en: 'Ornamental Nursery',
    esNueva: true,
    subcategorias: [
      { id: 'plantas-ornament',  nombre_es: 'Plantas Ornamentales',           nombre_en: 'Ornamental Plants',              esNueva: true },
      { id: 'cesped-follaje',    nombre_es: 'Césped y Follaje',               nombre_en: 'Grass & Foliage',                esNueva: true },
    ],
  },
];

/** Helper: obtiene subcategoría por id de categoría + id de subcategoría */
export function getNxinSubcat(catId: string, subcatId: string) {
  const cat = NXIN_CATEGORIAS.find((c) => c.id === catId);
  return cat?.subcategorias.find((s) => s.id === subcatId) ?? null;
}
