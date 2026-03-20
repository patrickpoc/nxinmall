'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin } from 'lucide-react';
import { useOnboardingStore } from '@/lib/store';
import { t } from '@/lib/i18n';

interface Step5BuyerProps {
  onBack: () => void;
}

export default function Step5BuyerResumen({ onBack }: Step5BuyerProps) {
  const store = useOnboardingStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { registro, ubicacion, idioma, setActivacion } = store;

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(store),
      });
      if (!res.ok) throw new Error('submit');
      setActivacion({ enviado: true });
      router.push('/submitted');
    } catch {
      setError(
        idioma === 'pt'
          ? 'Erro ao enviar. Por favor tente novamente.'
          : idioma === 'es'
            ? 'Error al enviar. Por favor intenta de nuevo.'
            : 'Error submitting. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const labelClass = 'text-[10px] font-black text-brand-900/50 uppercase tracking-[0.2em] mb-1';

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-3xl border border-gray-100 bg-gray-50/70 p-6">
        <h3 className="text-lg font-black text-ink">
          {idioma === 'pt' ? 'Resumo do comprador' : idioma === 'es' ? 'Resumen del comprador' : 'Buyer summary'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {idioma === 'pt'
            ? 'Confirme seus dados para finalizar seu onboarding de comprador.'
            : idioma === 'es'
              ? 'Confirma tus datos para finalizar tu onboarding de comprador.'
              : 'Confirm your details to finish your buyer onboarding.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100/50">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-brand-900" />
          </div>
          <div>
            <p className={labelClass}>{t('resumenContactoLabel', idioma)}</p>
            <p className="text-sm font-bold text-ink leading-tight">{registro.nombre}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{registro.empresa}</p>
            <p className="text-xs text-gray-400">{registro.email}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100/50">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-brand-900" />
          </div>
          <div>
            <p className={labelClass}>{t('resumenUbicacionLabel', idioma)}</p>
            <p className="text-sm font-bold text-ink leading-tight">
              {[ubicacion.distrito, ubicacion.provincia, ubicacion.departamento].filter(Boolean).join(', ') || '-'}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{ubicacion.direccion || '-'}</p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs font-bold text-red-500 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100 uppercase tracking-wider text-center">{error}</p>
      )}

      <div className="flex flex-col gap-4 mt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center justify-center py-4 rounded-full bg-brand-900 text-white font-semibold text-base hover:bg-brand-900/90 disabled:opacity-50 transition-all duration-300 shadow-xl shadow-brand-900/25"
        >
          {isLoading ? t('procesando', idioma) : t('btnEnviar', idioma)}
        </button>
      </div>

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
