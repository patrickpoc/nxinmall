'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OnboardingState, ProductoSeleccionado, Categoria } from '@/types/onboarding';
import { CATEGORIA_FORM_MAP } from '@/data/categories';
import { generateId } from './utils';

interface OnboardingStore extends OnboardingState {
  inviteToken: string | null;
  setCurrentStep: (step: number) => void;
  setRegistro: (data: Partial<OnboardingState['registro']>) => void;
  setPerfil: (data: Partial<OnboardingState['perfil']>) => void;
  setUbicacion: (data: Partial<OnboardingState['ubicacion']>) => void;
  addProducto: (producto: ProductoSeleccionado) => void;
  removeProducto: (id: string) => void;
  updateProducto: (id: string, data: Partial<ProductoSeleccionado>) => void;
  setActivacion: (data: Partial<OnboardingState['activacion']>) => void;
  setIdioma: (idioma: 'en' | 'es' | 'pt') => void;
  clearState: () => void;
  initSession: (token: string, leadData: Partial<OnboardingState['registro']>) => void;
}

const initialState: OnboardingState = {
  idioma: 'en',
  meta: {
    sessionId: generateId(),
    startedAt: new Date().toISOString(),
    currentStep: 1,
  },
  registro: {
    nombre: '',
    empresa: '',
    ruc: '',
    email: '',
    whatsapp: '',
    cargo: '',
    pais: 'Peru',
  },
  perfil: {
    categoria: '',
    tagline: '',
    descripcion: '',
    anosFundacion: '',
    capacidadMensual: '',
    certificaciones: [],
    logo: null,
    banner: null,
  },
  ubicacion: {
    departamento: '',
    provincia: '',
    distrito: '',
    direccion: '',
    referencia: '',
    codigoPostal: '',
  },
  catalogo: {
    productosSeleccionados: [],
    productosPersonalizados: [],
  },
  activacion: {
    enviado: false,
    jsonGenerado: false,
  },
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      inviteToken: null,

      setCurrentStep: (step) =>
        set((state) => ({ meta: { ...state.meta, currentStep: step } })),

      setRegistro: (data) =>
        set((state) => {
          const newRegistro = { ...state.registro, ...data };
          const newIdioma =
            newRegistro.pais === 'Brasil'
              ? 'pt'
              : ['Peru', 'Colombia', 'Ecuador'].includes(newRegistro.pais || '')
                ? 'es'
                : state.idioma;
          return { registro: newRegistro, idioma: newIdioma };
        }),

      setPerfil: (data) =>
        set((state) => ({ perfil: { ...state.perfil, ...data } })),

      setUbicacion: (data) =>
        set((state) => ({ ubicacion: { ...state.ubicacion, ...data } })),

      addProducto: (producto) =>
        set((state) => ({
          catalogo: {
            ...state.catalogo,
            productosSeleccionados: [...state.catalogo.productosSeleccionados, producto],
          },
        })),

      removeProducto: (id) =>
        set((state) => ({
          catalogo: {
            ...state.catalogo,
            productosSeleccionados: state.catalogo.productosSeleccionados.filter((p) => p.id !== id),
          },
        })),

      updateProducto: (id, data) =>
        set((state) => ({
          catalogo: {
            ...state.catalogo,
            productosSeleccionados: state.catalogo.productosSeleccionados.map((p) =>
              p.id === id ? { ...p, ...data } : p
            ),
          },
        })),

      setActivacion: (data) =>
        set((state) => ({ activacion: { ...state.activacion, ...data } })),

      setIdioma: (idioma) =>
        set((state) => ({
          idioma,
          registro:
            idioma === 'pt'
              ? { ...state.registro, pais: 'Brasil' }
              : idioma === 'es'
                ? { ...state.registro, pais: state.registro.pais || 'Peru' }
                : state.registro,
        })),

      clearState: () =>
        set({
          ...initialState,
          inviteToken: null,
          meta: {
            sessionId: generateId(),
            startedAt: new Date().toISOString(),
            currentStep: 1,
          },
        }),

      initSession: (token, leadData) => {
        const stored = get().inviteToken;
        if (stored === token) return; // same token → resume progress
        // different or new token → full reset + load lead data
        const newRegistro = { ...initialState.registro, ...leadData };
        // Pre-rellenar categoría si el lead eligió una en el formulario
        const categoriaInterna = newRegistro.categoriaInteres
          ? (CATEGORIA_FORM_MAP[newRegistro.categoriaInteres] ?? '')
          : '';
        set({
          ...initialState,
          inviteToken: token,
          meta: {
            sessionId: generateId(),
            startedAt: new Date().toISOString(),
            currentStep: 1,
          },
          registro: newRegistro,
          perfil: { ...initialState.perfil, categoria: categoriaInterna as Categoria | '' },
          idioma:
            newRegistro.pais === 'Brasil'
              ? 'pt'
              : ['Peru', 'Colombia', 'Ecuador'].includes(newRegistro.pais || '')
                ? 'es'
                : 'en',
        });
      },
    }),
    {
      name: 'nxin_onboarding',
      partialize: (state) => ({
        inviteToken: state.inviteToken,
        idioma: state.idioma,
        meta: state.meta,
        registro: state.registro,
        perfil: state.perfil,
        ubicacion: state.ubicacion,
        catalogo: state.catalogo,
        activacion: state.activacion,
      }),
    }
  )
);
