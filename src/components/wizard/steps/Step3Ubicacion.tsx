'use client';

import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/lib/store';
import { DEPARTAMENTOS, PROVINCIAS, DISTRITOS } from '@/data/peru-ubigeo';

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Ubicacion({ onNext, onBack }: Step3Props) {
  const { ubicacion, setUbicacion } = useOnboardingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const provincias = ubicacion.departamento ? (PROVINCIAS[ubicacion.departamento] ?? []) : [];
  const distritos = ubicacion.departamento && ubicacion.provincia
    ? (DISTRITOS[`${ubicacion.departamento}|${ubicacion.provincia}`] ?? [])
    : [];

  const handleDepChange = (dep: string) => {
    setUbicacion({ departamento: dep, provincia: '', distrito: '' });
  };

  const handleProvChange = (prov: string) => {
    setUbicacion({ provincia: prov, distrito: '' });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!ubicacion.departamento) newErrors.departamento = 'Selecciona un departamento';
    if (!ubicacion.provincia) newErrors.provincia = 'Selecciona una provincia';
    if (!ubicacion.distrito) newErrors.distrito = 'Selecciona un distrito';
    if (!ubicacion.direccion || ubicacion.direccion.length < 5) newErrors.direccion = 'La dirección es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const selectClass = (error?: string) =>
    `w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-brand-900 bg-white transition-colors ${
      error ? 'border-red-400' : 'border-gray-200'
    }`;

  const inputClass = (error?: string) =>
    `w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-brand-900 transition-colors ${
      error ? 'border-red-400' : 'border-gray-200'
    }`;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-gray-500">
        Indica la ubicación de tu empresa o punto de operación principal.
      </p>

      {/* Departamento */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Departamento *</label>
        <select
          value={ubicacion.departamento}
          onChange={(e) => handleDepChange(e.target.value)}
          className={selectClass(errors.departamento)}
        >
          <option value="">Selecciona un departamento</option>
          {DEPARTAMENTOS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {errors.departamento && <p className="text-xs text-red-500">{errors.departamento}</p>}
      </div>

      {/* Provincia */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Provincia *</label>
        <select
          value={ubicacion.provincia}
          onChange={(e) => handleProvChange(e.target.value)}
          className={selectClass(errors.provincia)}
          disabled={!ubicacion.departamento}
        >
          <option value="">
            {ubicacion.departamento ? 'Selecciona una provincia' : 'Primero selecciona un departamento'}
          </option>
          {provincias.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.provincia && <p className="text-xs text-red-500">{errors.provincia}</p>}
      </div>

      {/* Distrito */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Distrito *</label>
        <select
          value={ubicacion.distrito}
          onChange={(e) => setUbicacion({ distrito: e.target.value })}
          className={selectClass(errors.distrito)}
          disabled={!ubicacion.provincia}
        >
          <option value="">
            {ubicacion.provincia
              ? distritos.length > 0
                ? 'Selecciona un distrito'
                : 'No hay distritos disponibles — escribe abajo'
              : 'Primero selecciona una provincia'}
          </option>
          {distritos.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {errors.distrito && (
          <div>
            <p className="text-xs text-red-500">{errors.distrito}</p>
            <input
              type="text"
              placeholder="Escribe tu distrito"
              value={ubicacion.distrito}
              onChange={(e) => setUbicacion({ distrito: e.target.value })}
              className={`mt-1.5 ${inputClass(errors.distrito)}`}
            />
          </div>
        )}
        {!errors.distrito && distritos.length === 0 && ubicacion.provincia && (
          <input
            type="text"
            placeholder="Escribe tu distrito"
            value={ubicacion.distrito}
            onChange={(e) => setUbicacion({ distrito: e.target.value })}
            className={inputClass(undefined)}
          />
        )}
      </div>

      {/* Dirección */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Dirección (calle y número) *</label>
        <input
          type="text"
          value={ubicacion.direccion}
          onChange={(e) => setUbicacion({ direccion: e.target.value })}
          className={inputClass(errors.direccion)}
          placeholder="Av. Los Viñedos 123"
        />
        {errors.direccion && <p className="text-xs text-red-500">{errors.direccion}</p>}
      </div>

      {/* Referencia */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">
          Referencia <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          value={ubicacion.referencia}
          onChange={(e) => setUbicacion({ referencia: e.target.value })}
          className={inputClass(undefined)}
          placeholder="Frente al mercado central"
        />
      </div>

      {/* Código postal */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">
          Código postal <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          value={ubicacion.codigoPostal}
          onChange={(e) => setUbicacion({ codigoPostal: e.target.value })}
          className={inputClass(undefined)}
          placeholder="11001"
        />
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← Atrás
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 rounded-full bg-brand-900 text-white text-sm font-semibold hover:bg-brand-900/90 transition-colors"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
