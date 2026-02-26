'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { DEPARTAMENTOS, PROVINCIAS, DISTRITOS } from '@/data/peru-ubigeo';
import { ESTADOS_BRASIL, MUNICIPIOS_BRASIL } from '@/data/ubigeo-brasil';
import { DEPARTAMENTOS_COLOMBIA, MUNICIPIOS_COLOMBIA } from '@/data/ubigeo-colombia';
import { PROVINCIAS_ECUADOR, CANTONES_ECUADOR } from '@/data/ubigeo-ecuador';

const PAISES = ['Peru', 'Brasil', 'Colombia', 'Ecuador'];

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
    if (pais === 'Peru' && !ubicacion.distrito) newErrors.distrito = t('errNivel3', idioma);
    if (!ubicacion.direccion || ubicacion.direccion.length < 5) newErrors.direccion = t('errDireccion', idioma);
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
      <p className="text-sm text-gray-500">{t('paso3Titulo', idioma)}</p>

      {/* País */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">{t('paisLabel', idioma)}</label>
        <select
          value={pais}
          onChange={(e) => handlePaisChange(e.target.value)}
          className={selectClass(errors.pais)}
        >
          <option value="">{t('paisPlaceholder', idioma)}</option>
          {PAISES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.pais && <p className="text-xs text-red-500">{errors.pais}</p>}
      </div>

      {/* Nivel 1: Departamento / Estado / Provincia */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">{nivel1Label}</label>
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
        {errors.departamento && <p className="text-xs text-red-500">{errors.departamento}</p>}
      </div>

      {/* Nivel 2: Provincia / Município / Municipio / Cantón */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">{nivel2Label}</label>
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
        {errors.provincia && <p className="text-xs text-red-500">{errors.provincia}</p>}
      </div>

      {/* Nivel 3: Distrito (Peru only) */}
      {pais === 'Peru' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">{t('nivel3LabelPeru', idioma)}</label>
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
            <div>
              <p className="text-xs text-red-500">{errors.distrito}</p>
              <input
                type="text"
                placeholder={t('nivel3EscribePeru', idioma)}
                value={ubicacion.distrito}
                onChange={(e) => setUbicacion({ distrito: e.target.value })}
                className={`mt-1.5 ${inputClass(errors.distrito)}`}
              />
            </div>
          )}
          {!errors.distrito && nivel3Options.length === 0 && ubicacion.provincia && (
            <input
              type="text"
              placeholder={t('nivel3EscribePeru', idioma)}
              value={ubicacion.distrito}
              onChange={(e) => setUbicacion({ distrito: e.target.value })}
              className={inputClass(undefined)}
            />
          )}
        </div>
      )}

      {/* Dirección */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">{t('direccionLabel', idioma)}</label>
        <input
          type="text"
          value={ubicacion.direccion}
          onChange={(e) => setUbicacion({ direccion: e.target.value })}
          className={inputClass(errors.direccion)}
          placeholder={t('direccionPlaceholder', idioma)}
        />
        {errors.direccion && <p className="text-xs text-red-500">{errors.direccion}</p>}
      </div>

      {/* Referencia */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">
          {t('referenciaLabel', idioma)} <span className="text-gray-400 font-normal">{t('referenciaOpcional', idioma)}</span>
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
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">
          {t('codigoPostalLabel', idioma)} <span className="text-gray-400 font-normal">{t('referenciaOpcional', idioma)}</span>
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
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {t('btnAtras', idioma)}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 rounded-full bg-brand-900 text-white text-sm font-semibold hover:bg-brand-900/90 transition-colors"
        >
          {t('btnSiguiente', idioma)}
        </button>
      </div>
    </div>
  );
}
