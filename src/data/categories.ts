import type { Categoria } from '@/types/onboarding';

/** Categoría unificada para el formulario de la landing */
export interface CategoriaForm {
  id: string;
  es: string;
  en: string;
  pt: string;
}

/**
 * Lista completa: 8 categorías de la plataforma NXIN + nuestras adicionales.
 * Se usa en el <select> del landing form.
 */
export const CATEGORIAS_FORM: CategoriaForm[] = [
  { id: 'frutas',      es: 'Frutas y Verduras',         en: 'Fruits & Vegetables',       pt: 'Frutas e Verduras'         },
  { id: 'flores',      es: 'Flores de Exportación',     en: 'Export Flowers',             pt: 'Flores de Exportação'      },
  { id: 'viveros',     es: 'Viveros y Plantas',         en: 'Nurseries & Plants',         pt: 'Viveiros e Plantas'        },
  { id: 'envase',      es: 'Envase y Embalaje',         en: 'Packaging & Containers',     pt: 'Embalagens'                },
  { id: 'siembra',     es: 'Siembra y Riego',           en: 'Planting & Irrigation',      pt: 'Plantio e Irrigação'       },
  { id: 'insumos',     es: 'Insumos y Agroquímicos',    en: 'Inputs & Agrochemicals',     pt: 'Insumos e Agroquímicos'    },
  { id: 'cosecha',     es: 'Cosecha',                   en: 'Harvest',                    pt: 'Colheita'                  },
  { id: 'plantin',     es: 'Plantines',                 en: 'Seedlings',                  pt: 'Mudas'                     },
  { id: 'accesorios',  es: 'Accesorios para Frutas',    en: 'Fruit Accessories',          pt: 'Acessórios para Frutas'    },
  { id: 'exhibicion',  es: 'Exhibición',                en: 'Display & Retail',           pt: 'Exposição e Varejo'        },
  { id: 'dispositivo', es: 'Dispositivos Inteligentes', en: 'Smart Devices',              pt: 'Dispositivos Inteligentes' },
  { id: 'otros',       es: 'Otros',                     en: 'Other',                      pt: 'Outros'                    },
];

/**
 * Mapeo de categoría del formulario → categoría interna del onboarding.
 * Los IDs sin match directo quedan como '' (el usuario elige en Step 2).
 */
export const CATEGORIA_FORM_MAP: Record<string, Categoria | ''> = {
  frutas:      'frutas',
  flores:      'flores',
  viveros:     'viveros',
  plantin:     'viveros',
  envase:      'empacadoras',
  empacadoras: 'empacadoras',
  siembra:     'plasticos',
  plasticos:   'plasticos',
  insumos:     'insumos',
  agroquimicos:'insumos',
  // Sin match directo → el proveedor elige en Step 2
  cosecha:     '',
  accesorios:  '',
  exhibicion:  '',
  dispositivo: '',
  otros:       '',
};
