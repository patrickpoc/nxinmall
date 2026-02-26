import { Categoria } from '@/types/onboarding';

export interface ProductoCatalogo {
  id: string;
  nombre: string;
  unidad: string;
  precioRef: { min: number; max: number };
  moqRef: number;
  imagenStock: string;
}

export interface CategoriaCatalogo {
  id: Categoria;
  nombre: string;
  emoji: string;
  colorPrimario: string;
  ejemplos: string[];
  taglineSugerido: string;
  productos: ProductoCatalogo[];
}

export const CATEGORIAS: Record<Categoria, CategoriaCatalogo> = {
  frutas: {
    id: 'frutas',
    nombre: 'Frutas y Verduras',
    emoji: '🍇',
    colorPrimario: '#2d8a4e',
    ejemplos: ['Uvas de exportación', 'Arándanos frescos', 'Palta Hass'],
    taglineSugerido: 'Exportamos frutas peruanas de calidad premium al mundo',
    productos: [
      { id: 'f01', nombre: 'Uva Red Globe', unidad: 'kg', precioRef: { min: 1.2, max: 2.5 }, moqRef: 1000, imagenStock: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400' },
      { id: 'f02', nombre: 'Uva Thompson Seedless', unidad: 'kg', precioRef: { min: 1.5, max: 3.0 }, moqRef: 1000, imagenStock: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400' },
      { id: 'f03', nombre: 'Uva Sweet Globe', unidad: 'kg', precioRef: { min: 2.0, max: 4.0 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400' },
      { id: 'f04', nombre: 'Arándano fresco', unidad: 'kg', precioRef: { min: 3.5, max: 7.0 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400' },
      { id: 'f05', nombre: 'Arándano IQF', unidad: 'kg', precioRef: { min: 2.8, max: 5.5 }, moqRef: 1000, imagenStock: 'https://images.unsplash.com/photo-1425946004896-cf52b7a9ae46?w=400' },
      { id: 'f06', nombre: 'Palta Hass', unidad: 'kg', precioRef: { min: 1.0, max: 2.8 }, moqRef: 2000, imagenStock: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400' },
      { id: 'f07', nombre: 'Mango Kent', unidad: 'kg', precioRef: { min: 0.8, max: 1.8 }, moqRef: 2000, imagenStock: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400' },
      { id: 'f08', nombre: 'Mandarina W. Murcott', unidad: 'kg', precioRef: { min: 0.9, max: 2.0 }, moqRef: 1500, imagenStock: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400' },
      { id: 'f09', nombre: 'Espárrago fresco', unidad: 'kg', precioRef: { min: 2.5, max: 5.0 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400' },
      { id: 'f10', nombre: 'Granada Wonderful', unidad: 'kg', precioRef: { min: 1.5, max: 3.5 }, moqRef: 1000, imagenStock: 'https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=400' },
      { id: 'f11', nombre: 'Pimiento Páprika', unidad: 'kg', precioRef: { min: 1.2, max: 2.5 }, moqRef: 1000, imagenStock: 'https://images.unsplash.com/photo-1599598425947-5202edd56bdb?w=400' },
      { id: 'f12', nombre: 'Limón Tahití', unidad: 'kg', precioRef: { min: 0.7, max: 1.5 }, moqRef: 2000, imagenStock: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400' },
      { id: 'f13', nombre: 'Maracuyá', unidad: 'kg', precioRef: { min: 1.0, max: 2.2 }, moqRef: 1000, imagenStock: 'https://images.unsplash.com/photo-1622597467836-f3e72b68e3bd?w=400' },
      { id: 'f14', nombre: 'Quinua orgánica', unidad: 'kg', precioRef: { min: 3.0, max: 6.0 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
      { id: 'f15', nombre: 'Arándano deshidratado', unidad: 'kg', precioRef: { min: 8.0, max: 15.0 }, moqRef: 200, imagenStock: 'https://images.unsplash.com/photo-1425946004896-cf52b7a9ae46?w=400' },
    ],
  },
  flores: {
    id: 'flores',
    nombre: 'Flores de Exportación',
    emoji: '🌹',
    colorPrimario: '#b5446e',
    ejemplos: ['Rosas premium', 'Claveles', 'Crisantemos'],
    taglineSugerido: 'Flores peruanas frescas con la mejor vida en florero',
    productos: [
      { id: 'fl01', nombre: 'Rosa Red Naomi', unidad: 'tallo', precioRef: { min: 0.25, max: 0.55 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1562609952-44e35eb06af6?w=400' },
      { id: 'fl02', nombre: 'Rosa Mondial', unidad: 'tallo', precioRef: { min: 0.20, max: 0.50 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400' },
      { id: 'fl03', nombre: 'Clavel Standard', unidad: 'tallo', precioRef: { min: 0.12, max: 0.28 }, moqRef: 1000, imagenStock: 'https://images.unsplash.com/photo-1490750967868-88df5691cc56?w=400' },
      { id: 'fl04', nombre: 'Clavel Mini', unidad: 'tallo', precioRef: { min: 0.15, max: 0.32 }, moqRef: 1000, imagenStock: 'https://images.unsplash.com/photo-1490750967868-88df5691cc56?w=400' },
      { id: 'fl05', nombre: 'Crisantemo Santini', unidad: 'tallo', precioRef: { min: 0.18, max: 0.40 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1631260290822-9e15b3ad3cba?w=400' },
      { id: 'fl06', nombre: 'Gypsophila', unidad: 'manojo', precioRef: { min: 0.80, max: 1.80 }, moqRef: 200, imagenStock: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400' },
      { id: 'fl07', nombre: 'Statice', unidad: 'manojo', precioRef: { min: 0.60, max: 1.40 }, moqRef: 200, imagenStock: 'https://images.unsplash.com/photo-1587306112571-5d6e1a8b7c39?w=400' },
      { id: 'fl08', nombre: 'Follaje Ruscus', unidad: 'manojo', precioRef: { min: 0.50, max: 1.20 }, moqRef: 300, imagenStock: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=400' },
      { id: 'fl09', nombre: 'Gerbera Daisy', unidad: 'tallo', precioRef: { min: 0.22, max: 0.48 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1490750967868-88df5691cc56?w=400' },
      { id: 'fl10', nombre: 'Alstroemeria', unidad: 'tallo', precioRef: { min: 0.18, max: 0.38 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1490750967868-88df5691cc56?w=400' },
      { id: 'fl11', nombre: 'Lisianthus', unidad: 'tallo', precioRef: { min: 0.35, max: 0.75 }, moqRef: 300, imagenStock: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400' },
      { id: 'fl12', nombre: 'Heliconia', unidad: 'tallo', precioRef: { min: 1.20, max: 2.80 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=400' },
      { id: 'fl13', nombre: 'Orquídea Cymbidium', unidad: 'tallo', precioRef: { min: 2.50, max: 5.50 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1566907225472-514215e4fb53?w=400' },
      { id: 'fl14', nombre: 'Girasol', unidad: 'tallo', precioRef: { min: 0.30, max: 0.65 }, moqRef: 300, imagenStock: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=400' },
      { id: 'fl15', nombre: 'Lilium Oriental', unidad: 'tallo', precioRef: { min: 0.45, max: 1.00 }, moqRef: 200, imagenStock: 'https://images.unsplash.com/photo-1490750967868-88df5691cc56?w=400' },
    ],
  },
  viveros: {
    id: 'viveros',
    nombre: 'Viveros y Plantas',
    emoji: '🌱',
    colorPrimario: '#3a7d44',
    ejemplos: ['Plantones injertados', 'Ornamentales', 'Grass americano'],
    taglineSugerido: 'Plantones certificados y ornamentales de alta calidad',
    productos: [
      { id: 'v01', nombre: 'Plantón Palta Hass injertado', unidad: 'unidad', precioRef: { min: 3.5, max: 8.0 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'v02', nombre: 'Plantón Arándano Biloxi', unidad: 'unidad', precioRef: { min: 4.0, max: 9.0 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400' },
      { id: 'v03', nombre: 'Plantón Vid Red Globe', unidad: 'unidad', precioRef: { min: 3.0, max: 7.0 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
      { id: 'v04', nombre: 'Plantón Mango Kent', unidad: 'unidad', precioRef: { min: 3.5, max: 7.5 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1591053906172-6c3af1e89f48?w=400' },
      { id: 'v05', nombre: 'Plantón Limón Tahití', unidad: 'unidad', precioRef: { min: 2.5, max: 6.0 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400' },
      { id: 'v06', nombre: 'Plantón Rosal', unidad: 'unidad', precioRef: { min: 2.0, max: 5.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=400' },
      { id: 'v07', nombre: 'Cactus ornamental', unidad: 'unidad', precioRef: { min: 1.5, max: 12.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400' },
      { id: 'v08', nombre: 'Suculentas mix', unidad: 'unidad', precioRef: { min: 1.0, max: 5.0 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1463936575829-25148e1db1d8?w=400' },
      { id: 'v09', nombre: 'Orquídea en maceta', unidad: 'unidad', precioRef: { min: 8.0, max: 25.0 }, moqRef: 30, imagenStock: 'https://images.unsplash.com/photo-1566907225472-514215e4fb53?w=400' },
      { id: 'v10', nombre: 'Helecho Boston', unidad: 'unidad', precioRef: { min: 2.0, max: 8.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=400' },
      { id: 'v11', nombre: 'Grass americano rollo', unidad: 'm2', precioRef: { min: 3.0, max: 7.0 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'v12', nombre: 'Bromelia', unidad: 'unidad', precioRef: { min: 4.0, max: 15.0 }, moqRef: 30, imagenStock: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=400' },
      { id: 'v13', nombre: 'Plantón forestal', unidad: 'unidad', precioRef: { min: 1.5, max: 4.0 }, moqRef: 200, imagenStock: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
      { id: 'v14', nombre: 'Plantón cítrico variado', unidad: 'unidad', precioRef: { min: 3.0, max: 7.0 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400' },
      { id: 'v15', nombre: 'Plantón Granada', unidad: 'unidad', precioRef: { min: 3.5, max: 8.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=400' },
    ],
  },
  empacadoras: {
    id: 'empacadoras',
    nombre: 'Materiales de Empaque',
    emoji: '📦',
    colorPrimario: '#c47d2e',
    ejemplos: ['Cajas de exportación', 'Clamshells', 'Servicio de empacado'],
    taglineSugerido: 'Soluciones de empaque para exportación agrícola de primer nivel',
    productos: [
      { id: 'e01', nombre: 'Caja cartón 5kg uva', unidad: 'unidad', precioRef: { min: 0.80, max: 1.60 }, moqRef: 1000, imagenStock: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400' },
      { id: 'e02', nombre: 'Caja cartón 8.2kg espárragos', unidad: 'unidad', precioRef: { min: 0.90, max: 1.80 }, moqRef: 1000, imagenStock: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400' },
      { id: 'e03', nombre: 'Clamshell 250g berries', unidad: 'unidad', precioRef: { min: 0.12, max: 0.28 }, moqRef: 5000, imagenStock: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400' },
      { id: 'e04', nombre: 'Clamshell 500g berries', unidad: 'unidad', precioRef: { min: 0.18, max: 0.38 }, moqRef: 3000, imagenStock: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400' },
      { id: 'e05', nombre: 'Bolsa malla frutas 1kg', unidad: 'unidad', precioRef: { min: 0.08, max: 0.18 }, moqRef: 5000, imagenStock: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
      { id: 'e06', nombre: 'Pallet madera', unidad: 'unidad', precioRef: { min: 12.0, max: 25.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1586528116022-e7c9f1047d4a?w=400' },
      { id: 'e07', nombre: 'Stretch film rollo', unidad: 'rollo', precioRef: { min: 8.0, max: 16.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1586528116022-e7c9f1047d4a?w=400' },
      { id: 'e08', nombre: 'Etiquetas térmicas rollo 1000u', unidad: 'rollo', precioRef: { min: 5.0, max: 12.0 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400' },
      { id: 'e09', nombre: 'Foam protección m2', unidad: 'm2', precioRef: { min: 0.50, max: 1.20 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1586528116022-e7c9f1047d4a?w=400' },
      { id: 'e10', nombre: 'Servicio empacado/kg', unidad: 'kg', precioRef: { min: 0.15, max: 0.35 }, moqRef: 1000, imagenStock: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400' },
      { id: 'e11', nombre: 'Cámara frío alquiler día-pallet', unidad: 'día-pallet', precioRef: { min: 0.80, max: 2.00 }, moqRef: 10, imagenStock: 'https://images.unsplash.com/photo-1586528116022-e7c9f1047d4a?w=400' },
      { id: 'e12', nombre: 'Bandeja EPS', unidad: 'unidad', precioRef: { min: 0.10, max: 0.25 }, moqRef: 2000, imagenStock: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400' },
      { id: 'e13', nombre: 'Cinta embalaje', unidad: 'rollo', precioRef: { min: 1.50, max: 3.50 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1586528116022-e7c9f1047d4a?w=400' },
      { id: 'e14', nombre: 'Papel seda para fruta', unidad: 'resma', precioRef: { min: 4.0, max: 9.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400' },
      { id: 'e15', nombre: 'Bolsa zip-lock hermética', unidad: 'paquete x100', precioRef: { min: 2.0, max: 5.0 }, moqRef: 200, imagenStock: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400' },
    ],
  },
  plasticos: {
    id: 'plasticos',
    nombre: 'Plásticos Agrícolas',
    emoji: '🧴',
    colorPrimario: '#1a6b8a',
    ejemplos: ['Manga polietileno', 'Mallas Raschel', 'Agrofilm'],
    taglineSugerido: 'Insumos plásticos agrícolas de alta resistencia UV',
    productos: [
      { id: 'p01', nombre: 'Manga polietileno uva', unidad: 'rollo', precioRef: { min: 18.0, max: 40.0 }, moqRef: 20, imagenStock: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
      { id: 'p02', nombre: 'Malla Raschel 35%', unidad: 'm2', precioRef: { min: 0.40, max: 0.90 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'p03', nombre: 'Malla Raschel 50%', unidad: 'm2', precioRef: { min: 0.50, max: 1.10 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'p04', nombre: 'Agrofilm mulching negro', unidad: 'rollo', precioRef: { min: 25.0, max: 55.0 }, moqRef: 10, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'p05', nombre: 'Microtunel agrofilm', unidad: 'rollo', precioRef: { min: 30.0, max: 65.0 }, moqRef: 10, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'p06', nombre: 'Manga cosechera', unidad: 'unidad', precioRef: { min: 0.50, max: 1.20 }, moqRef: 200, imagenStock: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
      { id: 'p07', nombre: 'Malla antipájaro', unidad: 'm2', precioRef: { min: 0.35, max: 0.80 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'p08', nombre: 'Malla antigranizo', unidad: 'm2', precioRef: { min: 0.60, max: 1.40 }, moqRef: 300, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'p09', nombre: 'Invernadero plástico kit', unidad: 'kit', precioRef: { min: 800.0, max: 2500.0 }, moqRef: 1, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'p10', nombre: 'Tubería goteo rollo 500m', unidad: 'rollo', precioRef: { min: 40.0, max: 90.0 }, moqRef: 10, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'p11', nombre: 'Conectores riego pack', unidad: 'pack x50', precioRef: { min: 8.0, max: 18.0 }, moqRef: 20, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'p12', nombre: 'Semillero 128 celdas', unidad: 'unidad', precioRef: { min: 0.80, max: 1.80 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'p13', nombre: 'Tarro plástico 1L', unidad: 'unidad', precioRef: { min: 0.30, max: 0.70 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
      { id: 'p14', nombre: 'Bidón 20L', unidad: 'unidad', precioRef: { min: 3.0, max: 7.0 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
      { id: 'p15', nombre: 'Saco polipropileno 50kg', unidad: 'unidad', precioRef: { min: 0.40, max: 0.90 }, moqRef: 500, imagenStock: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    ],
  },
  insumos: {
    id: 'insumos',
    nombre: 'Insumos Agrícolas',
    emoji: '🌾',
    colorPrimario: '#7a5c2e',
    ejemplos: ['Fertilizantes NPK', 'Fungicidas', 'Bioestimulantes'],
    taglineSugerido: 'Insumos agrícolas certificados para producción de exportación',
    productos: [
      { id: 'i01', nombre: 'Fertilizante NPK 20-20-20', unidad: 'saco 25kg', precioRef: { min: 22.0, max: 45.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'i02', nombre: 'Urea 46%', unidad: 'saco 50kg', precioRef: { min: 28.0, max: 55.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
      { id: 'i03', nombre: 'Ácido húmico líquido', unidad: 'litro', precioRef: { min: 8.0, max: 18.0 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'i04', nombre: 'Sulfato de potasio', unidad: 'saco 25kg', precioRef: { min: 30.0, max: 65.0 }, moqRef: 30, imagenStock: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
      { id: 'i05', nombre: 'Calcio-Boro líquido', unidad: 'litro', precioRef: { min: 6.0, max: 14.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'i06', nombre: 'Fungicida Mancozeb', unidad: 'kg', precioRef: { min: 4.0, max: 9.0 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
      { id: 'i07', nombre: 'Insecticida Clorpirifos', unidad: 'litro', precioRef: { min: 12.0, max: 25.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'i08', nombre: 'Herbicida Glifosato', unidad: 'litro', precioRef: { min: 5.0, max: 12.0 }, moqRef: 100, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'i09', nombre: 'Bioestimulante Algasol', unidad: 'litro', precioRef: { min: 10.0, max: 22.0 }, moqRef: 30, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'i10', nombre: 'Semillas certificadas', unidad: 'sobre', precioRef: { min: 3.0, max: 20.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
      { id: 'i11', nombre: 'Cobre bactericida', unidad: 'kg', precioRef: { min: 5.0, max: 12.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'i12', nombre: 'Macro-elementos foliares', unidad: 'litro', precioRef: { min: 8.0, max: 18.0 }, moqRef: 30, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'i13', nombre: 'Sustrato turba perlite', unidad: 'saco 50L', precioRef: { min: 15.0, max: 32.0 }, moqRef: 20, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
      { id: 'i14', nombre: 'Nitrato de calcio', unidad: 'saco 25kg', precioRef: { min: 28.0, max: 58.0 }, moqRef: 30, imagenStock: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
      { id: 'i15', nombre: 'Surfactante mojador', unidad: 'litro', precioRef: { min: 5.0, max: 12.0 }, moqRef: 50, imagenStock: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
    ],
  },
};

export const CATEGORIAS_LIST = Object.values(CATEGORIAS);
