'use client';

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useOnboardingStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { DEPARTAMENTOS, PROVINCIAS, DISTRITOS } from '@/data/peru-ubigeo';
import { ESTADOS_BRASIL, MUNICIPIOS_BRASIL } from '@/data/ubigeo-brasil';
import { DEPARTAMENTOS_COLOMBIA, MUNICIPIOS_COLOMBIA } from '@/data/ubigeo-colombia';
import { PROVINCIAS_ECUADOR, CANTONES_ECUADOR } from '@/data/ubigeo-ecuador';
import { hasUbigeo } from '@/data/countries';
import CountryCombobox from '@/components/ui/CountryCombobox';

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Ubicacion({ onNext, onBack }: Step3Props) {
  const { ubicacion: location, registro: registration, idioma: language, setUbicacion: setLocation, setRegistro: setRegistration } = useOnboardingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [remoteMunicipalities, setRemoteMunicipalities] = useState<string[]>([]);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);

  const country = registration.pais || 'Peru';
  const BRAZIL_UF_BY_STATE: Record<string, string> = {
    Acre: 'AC',
    Alagoas: 'AL',
    Amapa: 'AP',
    Amapá: 'AP',
    Amazonas: 'AM',
    Bahia: 'BA',
    Ceara: 'CE',
    Ceará: 'CE',
    'Distrito Federal': 'DF',
    'Espirito Santo': 'ES',
    'Espírito Santo': 'ES',
    Goias: 'GO',
    Goiás: 'GO',
    Maranhao: 'MA',
    Maranhão: 'MA',
    'Mato Grosso': 'MT',
    'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG',
    Para: 'PA',
    Pará: 'PA',
    Paraiba: 'PB',
    Paraíba: 'PB',
    Parana: 'PR',
    Paraná: 'PR',
    Pernambuco: 'PE',
    Piaui: 'PI',
    Piauí: 'PI',
    'Rio de Janeiro': 'RJ',
    'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS',
    Rondonia: 'RO',
    Rondônia: 'RO',
    Roraima: 'RR',
    'Santa Catarina': 'SC',
    'Sao Paulo': 'SP',
    'São Paulo': 'SP',
    Sergipe: 'SE',
    Tocantins: 'TO',
  };

  // Derive level 1 options by country
  const nivel1Options = (() => {
    if (country === 'Brasil') return ESTADOS_BRASIL;
    if (country === 'Colombia') return DEPARTAMENTOS_COLOMBIA;
    if (country === 'Ecuador') return PROVINCIAS_ECUADOR;
    return DEPARTAMENTOS; // Peru
  })();

  // Derive level 2 options by country + selected level 1
  const nivel2Options = (() => {
    if (!location.departamento) return [];
    if (country === 'Brasil') {
      return remoteMunicipalities.length > 0
        ? remoteMunicipalities
        : (MUNICIPIOS_BRASIL[location.departamento] ?? []);
    }
    if (country === 'Colombia') return MUNICIPIOS_COLOMBIA[location.departamento] ?? [];
    if (country === 'Ecuador') return CANTONES_ECUADOR[location.departamento] ?? [];
    return PROVINCIAS[location.departamento] ?? []; // Peru
  })();

  useEffect(() => {
    async function loadBrazilMunicipalities() {
      if (country !== 'Brasil' || !location.departamento) {
        setRemoteMunicipalities([]);
        return;
      }
      const uf = BRAZIL_UF_BY_STATE[location.departamento];
      if (!uf) {
        setRemoteMunicipalities([]);
        return;
      }
      setLoadingMunicipalities(true);
      try {
        const res = await fetch(`/api/geo/br-municipios/${uf}`);
        if (!res.ok) {
          setRemoteMunicipalities([]);
          return;
        }
        const payload = (await res.json()) as { municipalities?: string[] };
        setRemoteMunicipalities(Array.isArray(payload.municipalities) ? payload.municipalities : []);
      } catch {
        setRemoteMunicipalities([]);
      } finally {
        setLoadingMunicipalities(false);
      }
    }
    void loadBrazilMunicipalities();
  }, [country, location.departamento]);

  const filteredMunicipalityOptions = useMemo(() => {
    if (country !== 'Brasil') return nivel2Options;
    const term = location.provincia.trim().toLowerCase();
    if (!term) return nivel2Options.slice(0, 80);
    return nivel2Options.filter((item) => item.toLowerCase().includes(term)).slice(0, 80);
  }, [country, nivel2Options, location.provincia]);

  // Derive level 3 options (Peru only)
  const nivel3Options = country === 'Peru' && location.departamento && location.provincia
    ? (DISTRITOS[`${location.departamento}|${location.provincia}`] ?? [])
    : [];

  const handleCountryChange = (newCountry: string) => {
    setRegistration({ pais: newCountry });
    // idioma auto-set in store via setRegistro
    setLocation({ departamento: '', provincia: '', distrito: '' });
    setErrors({});
  };

  const handleNivel1Change = (val: string) => {
    setLocation({ departamento: val, provincia: '', distrito: '' });
  };

  const handleNivel2Change = (val: string) => {
    if (country === 'Peru') {
      setLocation({ provincia: val, distrito: '' });
    } else {
      // For non-Peru countries, store in "provincia" field (level 2)
      setLocation({ provincia: val });
    }
  };

  // Labels helpers
  const nivel1Label = (() => {
    if (country === 'Brasil') return t('nivel1LabelBrasil', language);
    if (country === 'Ecuador') return t('nivel1LabelEcuador', language);
    return t('nivel1LabelPeru', language); // Peru & Colombia share same label
  })();

  const nivel1Placeholder = (() => {
    if (country === 'Brasil') return t('nivel1PlaceholderBrasil', language);
    if (country === 'Colombia') return t('nivel1PlaceholderColombia', language);
    if (country === 'Ecuador') return t('nivel1PlaceholderEcuador', language);
    return t('nivel1PlaceholderPeru', language);
  })();

  const nivel2Label = (() => {
    if (country === 'Brasil') return t('nivel2LabelBrasil', language);
    if (country === 'Colombia') return t('nivel2LabelColombia', language);
    if (country === 'Ecuador') return t('nivel2LabelEcuador', language);
    return t('nivel2LabelPeru', language);
  })();

  const nivel2Placeholder = (() => {
    if (!location.departamento) {
      if (country === 'Brasil') return t('nivel2PlaceholderPrimeiroBrasil', language);
      if (country === 'Colombia') return t('nivel2PlaceholderPrimeroColombia', language);
      if (country === 'Ecuador') return t('nivel2PlaceholderPrimeroEcuador', language);
      return t('nivel2PlaceholderPrimero', language);
    }
    if (country === 'Brasil') return t('nivel2PlaceholderBrasil', language);
    if (country === 'Colombia') return t('nivel2PlaceholderColombia', language);
    if (country === 'Ecuador') return t('nivel2PlaceholderEcuador', language);
    return t('nivel2PlaceholderPeru', language);
  })();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!country) newErrors.pais = t('errPais', language);
    if (!location.departamento) newErrors.departamento = t('errNivel1', language);
    if (!location.provincia) newErrors.provincia = t('errNivel2', language);
    if (hasUbigeo(country) && country === 'Peru' && !location.distrito) newErrors.distrito = t('errNivel3', language);
    if (!location.direccion || location.direccion.length < 5) newErrors.direccion = t('errDireccion', language);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const labelClass = "text-[11px] font-black text-brand-900/50 uppercase tracking-[0.2em] ml-1 mb-1";
  const optionalMark = (
    <span className="text-[10px] text-gray-400 italic normal-case tracking-normal font-semibold whitespace-nowrap leading-none relative -top-px">
      * {t('opcional', language).replace(/[()]/g, '')}
    </span>
  );
  
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
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t('paso3Titulo', language)}</p>
      </div>

      {/* País */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('paisLabel', language)}</label>
        <CountryCombobox
          value={country}
          onChange={handleCountryChange}
          placeholder={t('paisPlaceholder', language)}
          error={!!errors.pais}
        />
        {errors.pais && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.pais}</p>}
      </div>

      {hasUbigeo(country) ? (
        <>
          {/* Nivel 1: Departamento / Estado / Provincia */}
          <div className="flex flex-col">
            <label className={labelClass}>{nivel1Label}</label>
            <select
              value={location.departamento}
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
            {country === 'Brasil' ? (
              <>
                <input
                  list="municipality-options-br"
                  value={location.provincia}
                  onChange={(e) => handleNivel2Change(e.target.value)}
                  className={inputClass(errors.provincia)}
                  disabled={!location.departamento}
                  placeholder={loadingMunicipalities ? 'Loading municipalities...' : nivel2Placeholder}
                />
                <datalist id="municipality-options-br">
                  {filteredMunicipalityOptions.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </>
            ) : (
              <select
                value={location.provincia}
                onChange={(e) => handleNivel2Change(e.target.value)}
                className={selectClass(errors.provincia)}
                disabled={!location.departamento}
              >
                <option value="">{nivel2Placeholder}</option>
                {nivel2Options.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            )}
            {errors.provincia && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.provincia}</p>}
          </div>

          {/* Nivel 3: Distrito (Peru only) */}
          {country === 'Peru' && (
            <div className="flex flex-col">
              <label className={labelClass}>{t('nivel3LabelPeru', language)}</label>
              <select
                value={location.distrito}
                onChange={(e) => setLocation({ distrito: e.target.value })}
                className={selectClass(errors.distrito)}
                disabled={!location.provincia}
              >
                <option value="">
                  {location.provincia
                    ? nivel3Options.length > 0
                      ? t('nivel3PlaceholderPeru', language)
                      : t('nivel3PlaceholderVacio', language)
                    : t('nivel2PlaceholderPrimero', language)}
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
                    placeholder={t('nivel3EscribePeru', language)}
                    value={location.distrito}
                    onChange={(e) => setLocation({ distrito: e.target.value })}
                    className={inputClass(errors.distrito)}
                  />
                </div>
              )}
              {!errors.distrito && nivel3Options.length === 0 && location.provincia && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder={t('nivel3EscribePeru', language)}
                    value={location.distrito}
                    onChange={(e) => setLocation({ distrito: e.target.value })}
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
              {language === 'en' ? 'State / Region *' : language === 'pt' ? 'Estado / Região *' : 'Región / Estado *'}
            </label>
            <input
              type="text"
              value={location.departamento}
              onChange={(e) => setLocation({ departamento: e.target.value, provincia: '', distrito: '' })}
              className={inputClass(errors.departamento)}
              placeholder={language === 'en' ? 'E.g.: California' : language === 'pt' ? 'Ex: São Paulo' : 'Ej: Bavaria'}
            />
            {errors.departamento && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.departamento}</p>}
          </div>
          <div className="flex flex-col">
            <label className={labelClass}>
              {language === 'en' ? 'City *' : language === 'pt' ? 'Cidade *' : 'Ciudad *'}
            </label>
            <input
              type="text"
              value={location.provincia}
              onChange={(e) => setLocation({ provincia: e.target.value })}
              className={inputClass(errors.provincia)}
              placeholder={language === 'en' ? 'E.g.: Los Angeles' : language === 'pt' ? 'Ex: Campinas' : 'Ej: Múnich'}
            />
            {errors.provincia && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.provincia}</p>}
          </div>
        </>
      )}

      {/* Dirección */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('direccionLabel', language)}</label>
        <input
          type="text"
          value={location.direccion}
          onChange={(e) => setLocation({ direccion: e.target.value })}
          className={inputClass(errors.direccion)}
          placeholder={t('direccionPlaceholder', language)}
        />
        {errors.direccion && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.direccion}</p>}
      </div>

      {/* Referencia */}
      <div className="flex flex-col">
        <label className={clsx(labelClass, 'inline-flex items-baseline gap-1')}>
          <span>{t('referenciaLabel', language)}</span>{optionalMark}
        </label>
        <input
          type="text"
          value={location.referencia}
          onChange={(e) => setLocation({ referencia: e.target.value })}
          className={inputClass(undefined)}
          placeholder={t('referenciaPlaceholder', language)}
        />
      </div>

      {/* Código postal */}
      <div className="flex flex-col">
        <label className={clsx(labelClass, 'inline-flex items-baseline gap-1')}>
          <span>{t('codigoPostalLabel', language)}</span>{optionalMark}
        </label>
        <input
          type="text"
          value={location.codigoPostal}
          onChange={(e) => setLocation({ codigoPostal: e.target.value })}
          className={inputClass(undefined)}
          placeholder={t('codigoPostalPlaceholder', language)}
        />
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-ink transition-all duration-300"
        >
          {t('btnAtras', language)}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 rounded-full bg-brand-900 text-white text-sm font-bold hover:bg-brand-900/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-brand-900/20"
        >
          {t('btnSiguiente', language)}
        </button>
      </div>
    </div>
  );
}
