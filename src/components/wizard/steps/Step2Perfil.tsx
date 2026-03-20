'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { CircleHelp } from 'lucide-react';
import { useOnboardingStore } from '@/lib/store';
import { CATEGORIAS_LIST } from '@/data/catalog';
import { CATEGORIAS_FORM, CATEGORIA_FORM_MAP } from '@/data/categories';
import { Categoria } from '@/types/onboarding';
import { t } from '@/lib/i18n';
import { Idioma } from '@/lib/i18n';
import CategoryCard from '@/components/ui/CategoryCard';
import ImageUploadBox from '@/components/ui/ImageUploadBox';

const CERTIFICACIONES_POR_IDIOMA: Record<Idioma, string[]> = {
  // Brazil-focused operations
  pt: [
    'GLOBALG.A.P.',
    'GRASP',
    'HACCP',
    'BRCGS Food',
    'FSSC 22000 (ISO 22000)',
    'Orgânico Brasil',
    'SISBOV (beef)',
  ],
  // Latin America focus (Peru and Colombia)
  es: [
    'GLOBALG.A.P.',
    'GRASP',
    'HACCP',
    'BRCGS Food',
    'FSSC 22000 (ISO 22000)',
    'USDA/EU Organic',
    'SMETA/SEDEX',
  ],
  // Global operations
  en: [
    'GLOBALG.A.P.',
    'GRASP',
    'HACCP',
    'BRCGS Food',
    'IFS Food',
    'FSSC 22000 (ISO 22000)',
    'SMETA/SEDEX',
    'Rainforest Alliance',
    'USDA/EU Organic',
  ],
};

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Perfil({ onNext, onBack }: Step2Props) {
  const { perfil: profile, registro: registration, idioma: language, setPerfil: setProfile } = useOnboardingStore();
  const suggestedCertifications = CERTIFICACIONES_POR_IDIOMA[language];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otherActivityInput, setOtherActivityInput] = useState('');
  const [otherCertInput, setOtherCertInput] = useState('');
  const selectedCategories = (profile.categoriasSelecionadas ?? []).length
    ? profile.categoriasSelecionadas
    : (profile.categoria ? [profile.categoria] : []);
  const otherActivities = profile.outrasAtividades ?? [];
  const otherCertifications = profile.outrasCertificacoes ?? [];

  const selectedInterestCategory = registration.categoriaInteres;
  const hasNoCategoryMatch = !!(selectedInterestCategory && CATEGORIA_FORM_MAP[selectedInterestCategory] === '');
  const selectedInterestLabel = hasNoCategoryMatch
    ? (CATEGORIAS_FORM.find((c) => c.id === selectedInterestCategory)?.[language] ?? selectedInterestCategory)
    : '';

  const handleCategoriaSelect = (cat: Categoria) => {
    const current = selectedCategories;
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    const primary = next[0] ?? '';
    const primaryData = primary ? CATEGORIAS_LIST.find((c) => c.id === primary) : null;
    setProfile({
      categoria: primary as Categoria | '',
      categoriasSelecionadas: next,
      // Keep current tagline unless empty, then suggest from primary category.
      tagline: profile.tagline || primaryData?.taglineSugerido || '',
    });
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--store-color', primaryData?.colorPrimario ?? '#0a63d6');
    }
  };

  const addOtherActivity = () => {
    const keyword = otherActivityInput.trim();
    if (!keyword) return;
    if (otherActivities.some((k) => k.toLowerCase() === keyword.toLowerCase())) {
      setOtherActivityInput('');
      return;
    }
    setProfile({ outrasAtividades: [...otherActivities, keyword] });
    setOtherActivityInput('');
  };

  const removeOtherActivity = (keyword: string) => {
    setProfile({ outrasAtividades: otherActivities.filter((k) => k !== keyword) });
  };

  const handleCertificacion = (cert: string) => {
    const certs = profile.certificaciones;
    if (certs.includes(cert)) {
      setProfile({ certificaciones: certs.filter((c) => c !== cert) });
    } else {
      setProfile({ certificaciones: [...certs, cert] });
    }
  };

  const addOtherCert = () => {
    const keyword = otherCertInput.trim();
    if (!keyword) return;
    if (otherCertifications.some((k) => k.toLowerCase() === keyword.toLowerCase())) {
      setOtherCertInput('');
      return;
    }
    setProfile({ outrasCertificacoes: [...otherCertifications, keyword] });
    setOtherCertInput('');
  };

  const removeOtherCert = (keyword: string) => {
    setProfile({ outrasCertificacoes: otherCertifications.filter((k) => k !== keyword) });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (selectedCategories.length === 0) newErrors.categoria = t('errCategoria', language);
    if (!profile.tagline || profile.tagline.length < 10) newErrors.tagline = t('errTagline', language);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const labelClass = "text-[11px] font-black text-brand-900/50 uppercase tracking-[0.2em] ml-1 mb-1";
  const inputClass = "w-full px-4 py-3.5 text-sm rounded-2xl bg-gray-50 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:shadow-md transition-all duration-300";
  const optionalMark = <span className="text-[10px] text-gray-400 italic normal-case tracking-normal font-semibold whitespace-nowrap leading-none relative -top-px">* {t('opcional', language).replace(/[()]/g, '')}</span>;
  const keywordHelpText = language === 'pt'
    ? 'Digite uma palavra-chave e pressione + para adicionar. Use x para remover.'
    : language === 'es'
      ? 'Escribe una palabra clave y presiona + para agregar. Usa x para eliminar.'
      : 'Type a keyword and press + to add. Use x to remove.';

  return (
    <div className="flex flex-col gap-8">
      {/* Categories (multiple) */}
      <div>
        <p className={labelClass}>{t('paso2Titulo', language)} *</p>
        {hasNoCategoryMatch && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-[13px] text-amber-800 font-medium">
            {language === 'en'
              ? `You selected "${selectedInterestLabel}" — choose the closest category for now`
              : language === 'pt'
                ? `Você selecionou "${selectedInterestLabel}" — escolha a categoria mais próxima por enquanto`
                : `Seleccionaste "${selectedInterestLabel}" — por ahora elige la categoría más cercana`}
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CATEGORIAS_LIST.map((cat) => (
            <CategoryCard
              key={cat.id}
              categoria={cat}
              selected={selectedCategories.includes(cat.id as Categoria)}
              onClick={() => handleCategoriaSelect(cat.id as Categoria)}
            />
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
          <div className="mb-2 inline-flex items-center gap-1 text-[11px] text-gray-500">
            <CircleHelp className="w-3.5 h-3.5" />
            <span>{keywordHelpText}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={otherActivityInput}
              onChange={(e) => setOtherActivityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addOtherActivity();
                }
              }}
              className={clsx(inputClass, 'sm:flex-1')}
              placeholder={language === 'es' ? 'Otros (escribe una palabra clave)' : language === 'pt' ? 'Outros (escreva uma palavra-chave)' : 'Others (type a keyword)'}
            />
            <button
              type="button"
              onClick={addOtherActivity}
              className="h-[50px] min-w-[50px] inline-flex items-center justify-center rounded-2xl bg-brand-900 text-white text-2xl leading-none font-semibold hover:bg-brand-900/90 transition-colors"
            >
              +
            </button>
          </div>
          {otherActivities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {otherActivities.map((k) => (
                <span key={k} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  <span>{k}</span>
                  <button
                    type="button"
                    onClick={() => removeOtherActivity(k)}
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[11px] leading-none text-brand-700 hover:bg-red-100 hover:text-red-600 transition-colors"
                    aria-label={`Remove ${k}`}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        {errors.categoria && <p className="mt-2 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.categoria}</p>}
      </div>

      {/* Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-1">
          <label className={labelClass}>{t('taglineLabel', language)}</label>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{profile.tagline.length}/120</span>
        </div>
        <input
          type="text"
          value={profile.tagline}
          onChange={(e) => setProfile({ tagline: e.target.value.slice(0, 120) })}
          className={inputClass}
          placeholder={t('taglinePlaceholder', language)}
        />
        <p className="mt-1.5 ml-1 text-[10px] text-gray-400 font-medium">{t('taglineHint', language)}</p>
        {errors.tagline && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.tagline}</p>}
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-1">
          <label className={clsx(labelClass, 'inline-flex items-baseline gap-1')}><span>{t('descripcionLabel', language).replace(/\s*\(.*?\)\s*/g, ' ')}</span>{optionalMark}</label>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{profile.descripcion.length}/400</span>
        </div>
        <textarea
          value={profile.descripcion}
          onChange={(e) => setProfile({ descripcion: e.target.value.slice(0, 400) })}
          className={clsx(inputClass, "resize-none h-32")}
          placeholder={t('descripcionPlaceholder', language)}
        />
      </div>

      {/* Years and monthly capacity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className={clsx(labelClass, 'inline-flex items-baseline gap-1')}><span>{t('anosFundacionLabel', language).replace(/\s*\(.*?\)\s*/g, ' ')}</span>{optionalMark}</label>
          <input
            type="text"
            value={profile.anosFundacion}
            onChange={(e) => setProfile({ anosFundacion: e.target.value })}
            className={inputClass}
            placeholder={t('anosFundacionPlaceholder', language)}
          />
        </div>
        <div className="flex flex-col">
          <label className={clsx(labelClass, 'inline-flex items-baseline gap-1')}><span>{t('capacidadMensualLabel', language).replace(/\s*\(.*?\)\s*/g, ' ')}</span>{optionalMark}</label>
          <input
            type="text"
            value={profile.capacidadMensual}
            onChange={(e) => setProfile({ capacidadMensual: e.target.value })}
            className={inputClass}
            placeholder={t('capacidadMensualPlaceholder', language)}
          />
        </div>
      </div>

      {/* Certifications (optional) */}
      <div>
        <p className={clsx(labelClass, 'inline-flex items-baseline gap-1')}>
          <span>{t('certificacionesLabel', language)}</span>{optionalMark}
        </p>
        <div className="flex flex-wrap gap-2.5 mt-1">
          {suggestedCertifications.map((cert) => (
            <button
              key={cert}
              type="button"
              onClick={() => handleCertificacion(cert)}
              className={clsx(
                "px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border",
                profile.certificaciones.includes(cert)
                  ? 'bg-brand-900 text-white border-brand-900 shadow-md shadow-brand-900/20'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-brand-500/30 hover:bg-brand-50/50'
              )}
            >
              {cert}
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
          <div className="mb-2 inline-flex items-center gap-1 text-[11px] text-gray-500">
            <CircleHelp className="w-3.5 h-3.5" />
            <span>{keywordHelpText}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={otherCertInput}
              onChange={(e) => setOtherCertInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addOtherCert();
                }
              }}
              className={clsx(inputClass, 'sm:flex-1')}
              placeholder={language === 'es' ? 'Otros (escribe una certificación)' : language === 'pt' ? 'Outros (escreva uma certificação)' : 'Others (type a certification)'}
            />
            <button
              type="button"
              onClick={addOtherCert}
              className="h-[50px] min-w-[50px] inline-flex items-center justify-center rounded-2xl bg-brand-900 text-white text-2xl leading-none font-semibold hover:bg-brand-900/90 transition-colors"
            >
              +
            </button>
          </div>
          {otherCertifications.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {otherCertifications.map((k) => (
                <span key={k} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  <span>{k}</span>
                  <button
                    type="button"
                    onClick={() => removeOtherCert(k)}
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[11px] leading-none text-brand-700 hover:bg-red-100 hover:text-red-600 transition-colors"
                    aria-label={`Remove ${k}`}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logo only (banner removed) */}
      <div className="max-w-xs">
        <label className={labelClass}>{t('logoLabel', language)}</label>
        <div className="mt-1">
          <ImageUploadBox
            hint={t('logoHint', language)}
            value={profile.logo}
            onChange={(val) => setProfile({ logo: val })}
            previewVariant="circle"
            locale={language}
          />
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between pt-4">
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
