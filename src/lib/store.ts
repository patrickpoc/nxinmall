'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OnboardingState, ProductoSeleccionado } from '@/types/onboarding';
import { generateId } from './utils';

interface OnboardingStore extends OnboardingState {
  setCurrentStep: (step: number) => void;
  setRegistro: (data: Partial<OnboardingState['registro']>) => void;
  setPerfil: (data: Partial<OnboardingState['perfil']>) => void;
  setUbicacion: (data: Partial<OnboardingState['ubicacion']>) => void;
  addProducto: (producto: ProductoSeleccionado) => void;
  removeProducto: (id: string) => void;
  updateProducto: (id: string, data: Partial<ProductoSeleccionado>) => void;
  setActivacion: (data: Partial<OnboardingState['activacion']>) => void;
  setIdioma: (idioma: 'es' | 'pt') => void;
  clearState: () => void;
}

const initialState: OnboardingState = {
  idioma: 'es',
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
    (set) => ({
      ...initialState,

      setCurrentStep: (step) =>
        set((state) => ({ meta: { ...state.meta, currentStep: step } })),

      setRegistro: (data) =>
        set((state) => {
          const newRegistro = { ...state.registro, ...data };
          const newIdioma = newRegistro.pais === 'Brasil' ? 'pt' : 'es';
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

      setIdioma: (idioma) => set({ idioma }),

      clearState: () =>
        set({
          ...initialState,
          meta: {
            sessionId: generateId(),
            startedAt: new Date().toISOString(),
            currentStep: 1,
          },
        }),
    }),
    {
      name: 'nxin_onboarding',
      partialize: (state) => ({
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
