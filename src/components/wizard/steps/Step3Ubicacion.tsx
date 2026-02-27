'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { useOnboardingStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { DEPARTAMENTOS, PROVINCIAS, DISTRITOS } from '@/data/peru-ubigeo';
import { ESTADOS_BRASIL, MUNICIPIOS_BRASIL } from '@/data/ubigeo-brasil';
import { DEPARTAMENTOS_COLOMBIA, MUNICIPIOS_COLOMBIA } from '@/data/ubigeo-colombia';
import { PROVINCIAS_ECUADOR, CANTONES_ECUADOR } from '@/data/ubigeo-ecuador';
import { COUNTRIES, REGIONS, REGION_LABELS, hasUbigeo } from '@/data/countries';

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Ubicacion({ onNext, onBack }: Step3Props) {
  const { ubicacion, registro, idioma, setUbicacion, setRegistro, setIdioma } = useOnboardingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pais = registro.pais || 'Peru';

  // Derive level 1 options by country
  const nivel1Options = (() => {
    if (pais === 'Brasil') return ESTADOS_BRASIL;
    if (pais === 'Colombia') return DEPARTAMENTOS_COLOMBIA;
    if (pais === 'Ecuador') return PROVINCIAS_ECUADOR;
    return DEPARTAMENTOS; // Peru
  })();

  // Derive level 2 options by country + selected level 1
  const nivel2Options = (() => {
    if (!ubicacion.departamento) return [];
    if (pais === 'Brasil') return MUNICIPIOS_BRASIL[ubicacion.departamento] ?? [];
    if (pais === 'Colombia') return MUNICIPIOS_COLOMBIA[ubicacion.departamento] ?? [];
    if (pais === 'Ecuador') return CANTONES_ECUADOR[ubicacion.departamento] ?? [];
    return PROVINCIAS[ubicacion.departamento] ?? []; // Peru
  })();

  // Derive level 3 options (Peru only)
  const nivel3Options = pais === 'Peru' && ubicacion.departamento && ubicacion.provincia
    ? (DISTRITOS[`${ubicacion.departamento}|${ubicacion.provincia}`] ?? [])
    : [];

  const handlePaisChange = (nuevoPais: string) => {
    setRegistro({ pais: nuevoPais });
    // idioma auto-set in store via setRegistro
    setUbicacion({ departamento: '', provincia: '', distrito: '' });
    setErrors({});
  };

  const handleNivel1Change = (val: string) => {
    setUbicacion({ departamento: val, provincia: '', distrito: '' });
  };

  const handleNivel2Change = (val: string) => {
    if (pais === 'Peru') {
      setUbicacion({ provincia: val, distrito: '' });
    } else {
      // For non-Peru countries, store in "provincia" field (level 2)
      setUbicacion({ provincia: val });
    }
  };

  // Labels helpers
  const nivel1Label = (() => {
    if (pais === 'Brasil') return t('nivel1LabelBrasil', idioma);
    if (pais === 'Ecuador') return t('nivel1LabelEcuador', idioma);
    return t('nivel1LabelPeru', idioma); // Peru & Colombia share same label
  })();

  const nivel1Placeholder = (() => {
    if (pais === 'Brasil') return t('nivel1PlaceholderBrasil', idioma);
    if (pais === 'Colombia') return t('nivel1PlaceholderColombia', idioma);
    if (pais === 'Ecuador') return t('nivel1PlaceholderEcuador', idioma);
    return t('nivel1PlaceholderPeru', idioma);
  })();

  const nivel2Label = (() => {
    if (pais === 'Brasil') return t('nivel2LabelBrasil', idioma);
    if (pais === 'Colombia') return t('nivel2LabelColombia', idioma);
    if (pais === 'Ecuador') return t('nivel2LabelEcuador', idioma);
    return t('nivel2LabelPeru', idioma);
  })();

  const nivel2Placeholder = (() => {
    if (!ubicacion.departamento) {
      if (pais === 'Brasil') return t('nivel2PlaceholderPrimeiroBrasil', idioma);
      if (pais === 'Colombia') return t('nivel2PlaceholderPrimeroColombia', idioma);
      if (pais === 'Ecuador') return t('nivel2PlaceholderPrimeroEcuador', idioma);
      return t('nivel2PlaceholderPrimero', idioma);
    }
    if (pais === 'Brasil') return t('nivel2PlaceholderBrasil', idioma);
    if (pais === 'Colombia') return t('nivel2PlaceholderColombia', idioma);
    if (pais === 'Ecuador') return t('nivel2PlaceholderEcuador', idioma);
    return t('nivel2PlaceholderPeru', idioma);
  })();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!pais) newErrors.pais = t('errPais', idioma);
    if (!ubicacion.departamento) newErrors.departamento = t('errNivel1', idioma);
    if (!ubicacion.provincia) newErrors.provincia = t('errNivel2', idioma);
    if (hasUbigeo(pais) && pais === 'Peru' && !ubicacion.distrito) newErrors.distrito = t('errNivel3', idioma);
    if (!ubicacion.direccion || ubicacion.direccion.length < 5) newErrors.direccion = t('errDireccion', idioma);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const labelClass = "text-[11px] font-black text-brand-900/50 uppercase tracking-[0.2em] ml-1 mb-1";
  
  const selectClass = (error?: string) =>
    clsx(
      'w-full px-4 py-3.5 text-sm rounded-2xl bg-gray-50 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:shadow-md transition-all duration-300',
      error ? 'ring-2 ring-red-400/20 bg-red-50/30' : ''
    );

  const inputClass = (error?: string) =>
    clsx(
      'w-full px-4 py-3.5 text-sm rounded-2xl bg-gray-50 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:shadow-md transition-all duration-300',
      error ? 'ring-2 ring-red-400/20 bg-red-50/30' : ''
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center sm:text-left">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t('paso3Titulo', idioma)}</p>
      </div>

      {/* País */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('paisLabel', idioma)}</label>
        <select
          value={pais}
          onChange={(e) => handlePaisChange(e.target.value)}
          className={selectClass(errors.pais)}
        >
          <option value="">{t('paisPlaceholder', idioma)}</option>
          {REGIONS.map((region) => (
            <optgroup key={region} label={REGION_LABELS[region]}>
              {COUNTRIES.filter((c) => c.region === region).map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
        {errors.pais && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.pais}</p>}
      </div>

      {hasUbigeo(pais) ? (
        <>
          {/* Nivel 1: Departamento / Estado / Provincia */}
          <div className="flex flex-col">
            <label className={labelClass}>{nivel1Label}</label>
            <select
              value={ubicacion.departamento}
              onChange={(e) => handleNivel1Change(e.target.value)}
              className={selectClass(errors.departamento)}
            >
              <option value="">{nivel1Placeholder}</option>
              {nivel1Options.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.departamento && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.departamento}</p>}
          </div>

          {/* Nivel 2: Provincia / Município / Municipio / Cantón */}
          <div className="flex flex-col">
            <label className={labelClass}>{nivel2Label}</label>
            <select
              value={ubicacion.provincia}
              onChange={(e) => handleNivel2Change(e.target.value)}
              className={selectClass(errors.provincia)}
              disabled={!ubicacion.departamento}
            >
              <option value="">{nivel2Placeholder}</option>
              {nivel2Options.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.provincia && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.provincia}</p>}
          </div>

          {/* Nivel 3: Distrito (Peru only) */}
          {pais === 'Peru' && (
            <div className="flex flex-col">
              <label className={labelClass}>{t('nivel3LabelPeru', idioma)}</label>
              <select
                value={ubicacion.distrito}
                onChange={(e) => setUbicacion({ distrito: e.target.value })}
                className={selectClass(errors.distrito)}
                disabled={!ubicacion.provincia}
              >
                <option value="">
                  {ubicacion.provincia
                    ? nivel3Options.length > 0
                      ? t('nivel3PlaceholderPeru', idioma)
                      : t('nivel3PlaceholderVacio', idioma)
                    : t('nivel2PlaceholderPrimero', idioma)}
                </option>
                {nivel3Options.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.distrito && (
                <div className="mt-2">
                  <p className="ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">{errors.distrito}</p>
                  <input
                    type="text"
                    placeholder={t('nivel3EscribePeru', idioma)}
                    value={ubicacion.distrito}
                    onChange={(e) => setUbicacion({ distrito: e.target.value })}
                    className={inputClass(errors.distrito)}
                  />
                </div>
              )}
              {!errors.distrito && nivel3Options.length === 0 && ubicacion.provincia && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder={t('nivel3EscribePeru', idioma)}
                    value={ubicacion.distrito}
                    onChange={(e) => setUbicacion({ distrito: e.target.value })}
                    className={inputClass(undefined)}
                  />
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Fallback para países sin datos de ubigeo: campos de texto libre */}
          <div className="flex flex-col">
            <label className={labelClass}>
              {idioma === 'pt' ? 'Estado / Região *' : 'Región / Estado *'}
            </label>
            <input
              type="text"
              value={ubicacion.departamento}
              onChange={(e) => setUbicacion({ departamento: e.target.value, provincia: '', distrito: '' })}
              className={inputClass(errors.departamento)}
              placeholder={idioma === 'pt' ? 'Ex: São Paulo' : 'Ej: Bavaria'}
            />
            {errors.departamento && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.departamento}</p>}
          </div>
          <div className="flex flex-col">
            <label className={labelClass}>
              {idioma === 'pt' ? 'Cidade *' : 'Ciudad *'}
            </label>
            <input
              type="text"
              value={ubicacion.provincia}
              onChange={(e) => setUbicacion({ provincia: e.target.value })}
              className={inputClass(errors.provincia)}
              placeholder={idioma === 'pt' ? 'Ex: Campinas' : 'Ej: Múnich'}
            />
            {errors.provincia && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.provincia}</p>}
          </div>
        </>
      )}

      {/* Dirección */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('direccionLabel', idioma)}</label>
        <input
          type="text"
          value={ubicacion.direccion}
          onChange={(e) => setUbicacion({ direccion: e.target.value })}
          className={inputClass(errors.direccion)}
          placeholder={t('direccionPlaceholder', idioma)}
        />
        {errors.direccion && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.direccion}</p>}
      </div>

      {/* Referencia */}
      <div className="flex flex-col">
        <label className={labelClass}>
          {t('referenciaLabel', idioma)} <span className="opacity-50 font-normal lowercase tracking-normal">({t('referenciaOpcional', idioma)})</span>
        </label>
        <input
          type="text"
          value={ubicacion.referencia}
          onChange={(e) => setUbicacion({ referencia: e.target.value })}
          className={inputClass(undefined)}
          placeholder={t('referenciaPlaceholder', idioma)}
        />
      </div>

      {/* Código postal */}
      <div className="flex flex-col">
        <label className={labelClass}>
          {t('codigoPostalLabel', idioma)} <span className="opacity-50 font-normal lowercase tracking-normal">({t('referenciaOpcional', idioma)})</span>
        </label>
        <input
          type="text"
          value={ubicacion.codigoPostal}
          onChange={(e) => setUbicacion({ codigoPostal: e.target.value })}
          className={inputClass(undefined)}
          placeholder={t('codigoPostalPlaceholder', idioma)}
        />
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-ink transition-all duration-300"
        >
          {t('btnAtras', idioma)}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 rounded-full bg-brand-900 text-white text-sm font-bold hover:bg-brand-900/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-brand-900/20"
        >
          {t('btnSiguiente', idioma)}
        </button>
      </div>
    </div>
  );
}
