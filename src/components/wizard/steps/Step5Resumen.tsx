'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Package, Award } from 'lucide-react';
import { useOnboardingStore } from '@/lib/store';
import { CATEGORIAS } from '@/data/catalog';
import { Categoria } from '@/types/onboarding';
import { t } from '@/lib/i18n';

interface Step5Props {
  onBack: () => void;
}

export default function Step5Resumen({ onBack }: Step5Props) {
  const store = useOnboardingStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { registro, perfil, ubicacion, catalogo, setActivacion, idioma } = store;
  const catData = perfil.categoria ? CATEGORIAS[perfil.categoria as Categoria] : null;

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(store),
      });

      if (!res.ok) throw new Error('Error al enviar');

      setActivacion({ enviado: true });
      router.push('/gracias');
    } catch (err) {
      const genericErr =
        idioma === 'en'
          ? 'Error submitting. Please try again.'
          : idioma === 'es'
            ? 'Error al enviar. Por favor intenta de nuevo.'
            : 'Erro ao enviar. Por favor tente novamente.';
      setError(genericErr);
    } finally {
      setIsLoading(false);
    }
  };

  const initials = registro.empresa
    ? registro.empresa
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const labelClass = "text-[10px] font-black text-brand-900/50 uppercase tracking-[0.2em] mb-1";

  return (
    <div className="flex flex-col gap-8">
      {/* Company summary card */}
      <div
        className="rounded-[32px] p-8 text-white shadow-xl shadow-brand-900/20 animate-fade-in"
        style={{ backgroundColor: catData?.colorPrimario ?? '#0a63d6' }}
      >
        <div className="flex items-center gap-6">
          {perfil.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={perfil.logo.dataUrl}
              alt="Logo"
              className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-inner"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black">
              {initials}
            </div>
          )}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">{registro.empresa}</h2>
            <p className="text-white/80 text-base sm:text-lg font-medium leading-tight mt-1">{perfil.tagline}</p>
            {catData && (
              <span className="inline-block mt-3 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                {catData.emoji} {catData.nombre}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Location */}
        <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-gray-100/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-brand-900" />
          </div>
          <div>
            <p className={labelClass}>{t('resumenUbicacionLabel', idioma)}</p>
            <p className="text-sm font-bold text-ink leading-tight">
              {[ubicacion.distrito, ubicacion.provincia, ubicacion.departamento].filter(Boolean).join(', ')}
            </p>
            {ubicacion.direccion && (
              <p className="text-xs text-gray-500 mt-1 font-medium">{ubicacion.direccion}</p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-gray-100/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-brand-900" />
          </div>
          <div>
            <p className={labelClass}>{t('resumenContactoLabel', idioma)}</p>
            <p className="text-sm font-bold text-ink leading-tight">{registro.nombre}</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">{registro.cargo}</p>
            <p className="text-xs text-gray-400 font-medium">{registro.email}</p>
          </div>
        </div>

        {/* Products */}
        <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-gray-100/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-brand-900" />
          </div>
          <div>
            <p className={labelClass}>{t('resumenCatalogoLabel', idioma)}</p>
            <p className="text-sm font-bold text-ink leading-tight">
              {catalogo.productosSeleccionados.length} {catalogo.productosSeleccionados.length !== 1 ? t('paso4SeleccionadosBadge', idioma) : t('paso4SeleccionadoBadge', idioma)}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-medium italic">
              {catalogo.productosSeleccionados.slice(0, 3).map((p) => p.nombre).join(', ')}
              {catalogo.productosSeleccionados.length > 3 && ` +${catalogo.productosSeleccionados.length - 3} ${idioma === 'en' ? 'more' : idioma === 'es' ? 'más' : 'mais'}`}
            </p>
          </div>
        </div>

        {/* Certs */}
        <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100/50 hover:bg-gray-100/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-brand-900" />
          </div>
          <div>
            <p className={labelClass}>{t('resumenCertificacionesLabel', idioma)}</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {perfil.certificaciones.length > 0 ? (
                perfil.certificaciones.map((c) => (
                  <span key={c} className="text-[9px] font-black uppercase tracking-widest bg-brand-900/10 text-brand-900 px-2.5 py-1 rounded-full border border-brand-900/10">
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400 font-medium">{t('resumenSinCertificaciones', idioma)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products list detail */}
      <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100/50">
        <h3 className="text-xs font-black text-brand-900/40 uppercase tracking-[0.2em] mb-4 ml-1">{t('resumenProductosTitulo', idioma)}</h3>
        <div className="flex flex-col gap-3">
          {catalogo.productosSeleccionados.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100/50 group hover:border-brand-500/20 transition-all">
              <span className="text-sm font-bold text-ink">{p.nombre}</span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full group-hover:bg-brand-50 group-hover:text-brand-900 transition-colors">
                  MOQ {p.moq.valor} {p.moq.unidad}
                </span>
                <span className="text-xs font-black text-brand-900">
                  USD {p.precio.min}–{p.precio.max}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs font-bold text-red-500 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100 uppercase tracking-wider text-center">{error}</p>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-4 mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center justify-center py-4 rounded-full bg-brand-900 text-white font-semibold text-base hover:bg-brand-900/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-brand-900/25"
        >
          {isLoading ? t('procesando', idioma) : t('btnEnviar', idioma)}
        </button>

        <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest px-8 leading-relaxed">
          {t('resumenFooterLeyenda', idioma)}
        </p>
      </div>

      {/* Back */}
      <div className="flex justify-center sm:justify-start">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2.5 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-ink transition-colors"
        >
          {t('btnRegresar', idioma)}
        </button>
      </div>
    </div>
  );
}
