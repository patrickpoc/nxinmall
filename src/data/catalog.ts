import { Categoria } from '@/types/onboarding';
import { CategoriaCatalogo } from './catalog/types';
import { FRUTAS } from './catalog/frutas';
import { FLORES } from './catalog/flores';
import { VIVEROS } from './catalog/viveros';
import { EMPACADORAS } from './catalog/empacadoras';
import { PLASTICOS } from './catalog/plasticos';
import { INSUMOS } from './catalog/insumos';

export * from './catalog/types';

export const CATEGORIAS: Record<Categoria, CategoriaCatalogo> = {
  frutas: FRUTAS,
  flores: FLORES,
  viveros: VIVEROS,
  empacadoras: EMPACADORAS,
  plasticos: PLASTICOS,
  insumos: INSUMOS,
};

export const CATEGORIAS_LIST = Object.values(CATEGORIAS);
