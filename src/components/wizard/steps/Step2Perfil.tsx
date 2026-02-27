'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { useOnboardingStore } from '@/lib/store';
import { CATEGORIAS_LIST } from '@/data/catalog';
import { CATEGORIAS_FORM, CATEGORIA_FORM_MAP } from '@/data/categories';
import { Categoria } from '@/types/onboarding';
import { t } from '@/lib/i18n';
import CategoryCard from '@/components/ui/CategoryCard';
import ImageUploadBox from '@/components/ui/ImageUploadBox';

const CERTIFICACIONES = ['SENASA', 'GlobalGAP', 'Orgánico', 'HACCP', 'BASC', 'Kosher', 'Halal', 'Ninguna'];

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Perfil({ onNext, onBack }: Step2Props) {
  const { perfil, registro, idioma, setPerfil } = useOnboardingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const catInteres = registro.categoriaInteres;
  const sinMatch = !!(catInteres && CATEGORIA_FORM_MAP[catInteres] === '');
  const catInteresLabel = sinMatch
    ? (CATEGORIAS_FORM.find((c) => c.id === catInteres)?.[idioma] ?? catInteres)
    : '';

  const handleCategoriaSelect = (cat: Categoria) => {
    const catData = CATEGORIAS_LIST.find((c) => c.id === cat);
    // Always overwrite tagline with the suggested one when category changes
    setPerfil({
      categoria: cat,
      tagline: catData?.taglineSugerido || '',
    });
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--store-color', catData?.colorPrimario ?? '#0a63d6');
    }
  };

  const handleCertificacion = (cert: string) => {
    const certs = perfil.certificaciones;
    if (cert === 'Ninguna') {
      setPerfil({ certificaciones: certs.includes('Ninguna') ? [] : ['Ninguna'] });
      return;
    }
    const withoutNinguna = certs.filter((c) => c !== 'Ninguna');
    if (withoutNinguna.includes(cert)) {
      setPerfil({ certificaciones: withoutNinguna.filter((c) => c !== cert) });
    } else {
      setPerfil({ certificaciones: [...withoutNinguna, cert] });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!perfil.categoria) newErrors.categoria = t('errCategoria', idioma);
    if (!perfil.tagline || perfil.tagline.length < 10) newErrors.tagline = t('errTagline', idioma);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const labelClass = "text-[11px] font-black text-brand-900/50 uppercase tracking-[0.2em] ml-1 mb-1";
  const inputClass = "w-full px-4 py-3.5 text-sm rounded-2xl bg-gray-50 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:shadow-md transition-all duration-300";

  return (
    <div className="flex flex-col gap-8">
      {/* Categoría */}
      <div>
        <p className={labelClass}>{t('paso2Titulo', idioma)} *</p>
        {sinMatch && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-[13px] text-amber-800 font-medium">
            {idioma === 'pt'
              ? `Você selecionou "${catInteresLabel}" — escolha a categoria mais próxima por enquanto`
              : `Seleccionaste "${catInteresLabel}" — por ahora elige la categoría más cercana`}
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CATEGORIAS_LIST.map((cat) => (
            <CategoryCard
              key={cat.id}
              categoria={cat}
              selected={perfil.categoria === cat.id}
              onClick={() => handleCategoriaSelect(cat.id as Categoria)}
            />
          ))}
        </div>
        {errors.categoria && <p className="mt-2 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.categoria}</p>}
      </div>

      {/* Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-1">
          <label className={labelClass}>{t('taglineLabel', idioma)}</label>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{perfil.tagline.length}/120</span>
        </div>
        <input
          type="text"
          value={perfil.tagline}
          onChange={(e) => setPerfil({ tagline: e.target.value.slice(0, 120) })}
          className={inputClass}
          placeholder={t('taglinePlaceholder', idioma)}
        />
        <p className="mt-1.5 ml-1 text-[10px] text-gray-400 font-medium">{t('taglineHint', idioma)}</p>
        {errors.tagline && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.tagline}</p>}
      </div>

      {/* Descripción (opcional) */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-1">
          <label className={labelClass}>{t('descripcionLabel', idioma)}</label>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{perfil.descripcion.length}/400</span>
        </div>
        <textarea
          value={perfil.descripcion}
          onChange={(e) => setPerfil({ descripcion: e.target.value.slice(0, 400) })}
          className={clsx(inputClass, "resize-none h-32")}
          placeholder={t('descripcionPlaceholder', idioma)}
        />
      </div>

      {/* Años y capacidad (opcionales) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className={labelClass}>{t('anosFundacionLabel', idioma)}</label>
          <input
            type="text"
            value={perfil.anosFundacion}
            onChange={(e) => setPerfil({ anosFundacion: e.target.value })}
            className={inputClass}
            placeholder={t('anosFundacionPlaceholder', idioma)}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClass}>{t('capacidadMensualLabel', idioma)}</label>
          <input
            type="text"
            value={perfil.capacidadMensual}
            onChange={(e) => setPerfil({ capacidadMensual: e.target.value })}
            className={inputClass}
            placeholder={t('capacidadMensualPlaceholder', idioma)}
          />
        </div>
      </div>

      {/* Certificaciones */}
      <div>
        <p className={labelClass}>{t('certificacionesLabel', idioma)}</p>
        <div className="flex flex-wrap gap-2.5 mt-1">
          {CERTIFICACIONES.map((cert) => (
            <button
              key={cert}
              type="button"
              onClick={() => handleCertificacion(cert)}
              className={clsx(
                "px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border",
                perfil.certificaciones.includes(cert)
                  ? 'bg-brand-900 text-white border-brand-900 shadow-md shadow-brand-900/20'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-brand-500/30 hover:bg-brand-50/50'
              )}
            >
              {cert}
            </button>
          ))}
        </div>
      </div>

      {/* Logo only (banner removed) */}
      <div className="max-w-xs">
        <label className={labelClass}>{t('logoLabel', idioma)}</label>
        <div className="mt-1">
          <ImageUploadBox
            hint={t('logoHint', idioma)}
            value={perfil.logo}
            onChange={(val) => setPerfil({ logo: val })}
            previewVariant="circle"
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
