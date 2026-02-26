'use client';

import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/lib/store';
import { CATEGORIAS_LIST } from '@/data/catalog';
import { Categoria } from '@/types/onboarding';
import CategoryCard from '@/components/ui/CategoryCard';
import ImageUploadBox from '@/components/ui/ImageUploadBox';

const CERTIFICACIONES = ['SENASA', 'GlobalGAP', 'Orgánico', 'HACCP', 'BASC', 'Kosher', 'Halal', 'Ninguna'];

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Perfil({ onNext, onBack }: Step2Props) {
  const { perfil, setPerfil } = useOnboardingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCategoriaSelect = (cat: Categoria) => {
    const catData = CATEGORIAS_LIST.find((c) => c.id === cat);
    setPerfil({
      categoria: cat,
      tagline: perfil.tagline || catData?.taglineSugerido || '',
    });
    // Apply CSS custom property
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
    if (!perfil.categoria) newErrors.categoria = 'Selecciona una categoría';
    if (!perfil.tagline || perfil.tagline.length < 10) newErrors.tagline = 'El tagline debe tener al menos 10 caracteres';
    if (!perfil.descripcion || perfil.descripcion.length < 20) newErrors.descripcion = 'La descripción debe tener al menos 20 caracteres';
    if (!perfil.anosFundacion) newErrors.anosFundacion = 'Requerido';
    if (!perfil.capacidadMensual) newErrors.capacidadMensual = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Categoría */}
      <div>
        <p className="text-sm font-semibold text-ink mb-3">¿Qué tipo de productos ofreces? *</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIAS_LIST.map((cat) => (
            <CategoryCard
              key={cat.id}
              categoria={cat}
              selected={perfil.categoria === cat.id}
              onClick={() => handleCategoriaSelect(cat.id as Categoria)}
            />
          ))}
        </div>
        {errors.categoria && <p className="text-xs text-red-500 mt-1.5">{errors.categoria}</p>}
      </div>

      {/* Tagline */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-ink">Tagline de tu empresa *</label>
          <span className="text-xs text-gray-400">{perfil.tagline.length}/120</span>
        </div>
        <input
          type="text"
          value={perfil.tagline}
          onChange={(e) => setPerfil({ tagline: e.target.value.slice(0, 120) })}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-900"
          placeholder="Ej: Exportamos uvas premium de Ica al mundo"
        />
        {errors.tagline && <p className="text-xs text-red-500">{errors.tagline}</p>}
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-ink">Descripción de tu empresa *</label>
          <span className="text-xs text-gray-400">{perfil.descripcion.length}/400</span>
        </div>
        <textarea
          value={perfil.descripcion}
          onChange={(e) => setPerfil({ descripcion: e.target.value.slice(0, 400) })}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-900 resize-none"
          rows={4}
          placeholder="Describe tu empresa, experiencia, mercados actuales..."
        />
        {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion}</p>}
      </div>

      {/* Años y capacidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">¿Desde qué año operan? *</label>
          <input
            type="text"
            value={perfil.anosFundacion}
            onChange={(e) => setPerfil({ anosFundacion: e.target.value })}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-900"
            placeholder="Ej: Desde 2010"
          />
          {errors.anosFundacion && <p className="text-xs text-red-500">{errors.anosFundacion}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Capacidad mensual *</label>
          <input
            type="text"
            value={perfil.capacidadMensual}
            onChange={(e) => setPerfil({ capacidadMensual: e.target.value })}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-900"
            placeholder="Ej: 50 toneladas/mes"
          />
          {errors.capacidadMensual && <p className="text-xs text-red-500">{errors.capacidadMensual}</p>}
        </div>
      </div>

      {/* Certificaciones */}
      <div>
        <p className="text-sm font-medium text-ink mb-2">Certificaciones</p>
        <div className="flex flex-wrap gap-2">
          {CERTIFICACIONES.map((cert) => (
            <button
              key={cert}
              type="button"
              onClick={() => handleCertificacion(cert)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                perfil.certificaciones.includes(cert)
                  ? 'bg-brand-900 text-white border-brand-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-500'
              }`}
            >
              {cert}
            </button>
          ))}
        </div>
      </div>

      {/* Media */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ImageUploadBox
          label="Logo de tu empresa"
          hint="PNG, JPG hasta 5MB — cuadrado ideal"
          value={perfil.logo}
          onChange={(val) => setPerfil({ logo: val })}
          previewVariant="circle"
        />
        <ImageUploadBox
          label="Banner (portada de tienda)"
          hint="PNG, JPG hasta 5MB — horizontal ideal"
          value={perfil.banner}
          onChange={(val) => setPerfil({ banner: val })}
          previewVariant="banner"
        />
      </div>

      {/* Nav buttons */}
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
