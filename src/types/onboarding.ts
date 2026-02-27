export type Categoria = 'frutas' | 'flores' | 'viveros' | 'empacadoras' | 'plasticos' | 'insumos';

export interface ProductoSeleccionado {
  id: string;
  nombre: string;
  nombre_en: string;
  categoria: Categoria;
  esPersonalizado: boolean;
  moq: { valor: number; unidad: string };
  precio: { min: number; max: number; moneda: 'USD' | 'PEN' };
  imagen: { dataUrl: string; fuente: 'upload' | 'stock' } | null;
  descripcion_en: string;
  /** Mapeo directo a la taxonomía de la plataforma NXIN Mall */
  nxin?: {
    categoria: string;
    subcategoria: string;
    esNueva: boolean;
  };
}

export interface OnboardingState {
  idioma: 'es' | 'pt';
  meta: {
    sessionId: string;
    startedAt: string;
    currentStep: number;
  };
  registro: {
    nombre: string;
    empresa: string;
    ruc: string;
    email: string;
    whatsapp: string;
    cargo: string;
    pais: string;
    /** Categoría seleccionada en el formulario de la landing (raw, antes del mapping) */
    categoriaInteres?: string;
  };
  perfil: {
    categoria: Categoria | '';
    tagline: string;
    descripcion: string;
    anosFundacion: string;
    capacidadMensual: string;
    certificaciones: string[];
    logo: { dataUrl: string; name: string } | null;
    banner: { dataUrl: string; name: string } | null;
  };
  ubicacion: {
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    referencia: string;
    codigoPostal: string;
  };
  catalogo: {
    productosSeleccionados: ProductoSeleccionado[];
    productosPersonalizados: ProductoSeleccionado[];
  };
  activacion: {
    enviado: boolean;
    jsonGenerado: boolean;
  };
}

export interface StoreConfig {
  metadata: {
    version: string;
    generatedAt: string;
    sessionId: string;
    status: string;
    fuente: string;
    idioma: 'es' | 'pt';
  };
  proveedor: {
    nombre: string;
    cargo: string;
    empresa: string;
    ruc: string;
    email: string;
    whatsapp: string;
    pais: string;
  };
  ubicacion: {
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    referencia: string;
    codigoPostal: string;
  };
  tienda: {
    categoria: Categoria | '';
    tagline: string;
    descripcion: string;
    anosFundacion: string;
    capacidadMensual: string;
    certificaciones: string[];
    colorPrimario: string;
    logo: { dataUrl: string; name: string } | null;
    banner: { dataUrl: string; name: string } | null;
  };
  catalogo: {
    totalProductos: number;
    productos: Array<{
      id: string;
      nombre: string;
      nombre_en: string;
      descripcion_en: string;
      esPersonalizado: boolean;
      moq: { valor: number; unidad: string };
      precio: { min: number; max: number; moneda: 'USD' | 'PEN' };
      imagen: { dataUrl: string; fuente: 'upload' | 'stock' } | null;
      nxin?: {
        categoria: string;
        subcategoria: string;
        esNueva: boolean;
      };
    }>;
  };
}
