'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Send, Building2, MapPin, Package, Award } from 'lucide-react';
import { useOnboardingStore } from '@/lib/store';
import { generateStoreJson, downloadStoreJson } from '@/lib/generate-json';
import { CATEGORIAS } from '@/data/catalog';
import { Categoria } from '@/types/onboarding';

interface Step5Props {
  onBack: () => void;
}

export default function Step5Resumen({ onBack }: Step5Props) {
  const store = useOnboardingStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { registro, perfil, ubicacion, catalogo, setActivacion } = store;
  const catData = perfil.categoria ? CATEGORIAS[perfil.categoria as Categoria] : null;

  const handleDownload = () => {
    downloadStoreJson(store);
    setActivacion({ jsonGenerado: true });
  };

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
      setError('Error al enviar. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const initials = registro.empresa
    ? registro.empresa.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="flex flex-col gap-6">
      {/* Company summary card */}
      <div
        className="rounded-2xl p-5 text-white"
        style={{ backgroundColor: catData?.colorPrimario ?? '#0a63d6' }}
      >
        <div className="flex items-center gap-4">
          {perfil.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={perfil.logo.dataUrl}
              alt="Logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {initials}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">{registro.empresa}</h2>
            <p className="text-white/80 text-sm">{perfil.tagline}</p>
            {catData && (
              <span className="inline-block mt-1.5 bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                {catData.emoji} {catData.nombre}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Location */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <MapPin className="w-5 h-5 text-brand-900 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Ubicación</p>
            <p className="text-sm font-medium text-ink">
              {[ubicacion.distrito, ubicacion.provincia, ubicacion.departamento].filter(Boolean).join(', ')}
            </p>
            {ubicacion.direccion && (
              <p className="text-xs text-gray-500 mt-0.5">{ubicacion.direccion}</p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <Building2 className="w-5 h-5 text-brand-900 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Contacto</p>
            <p className="text-sm font-medium text-ink">{registro.nombre}</p>
            <p className="text-xs text-gray-500">{registro.cargo}</p>
            <p className="text-xs text-gray-500">{registro.email}</p>
          </div>
        </div>

        {/* Products */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <Package className="w-5 h-5 text-brand-900 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Catálogo</p>
            <p className="text-sm font-medium text-ink">
              {catalogo.productosSeleccionados.length} producto{catalogo.productosSeleccionados.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {catalogo.productosSeleccionados.slice(0, 4).map((p) => p.nombre).join(', ')}
              {catalogo.productosSeleccionados.length > 4 && ` +${catalogo.productosSeleccionados.length - 4} más`}
            </p>
          </div>
        </div>

        {/* Certs */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <Award className="w-5 h-5 text-brand-900 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Certificaciones</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {perfil.certificaciones.length > 0 ? (
                perfil.certificaciones.map((c) => (
                  <span key={c} className="text-xs bg-brand-100 text-brand-900 px-2 py-0.5 rounded-full font-medium">
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">Sin certificaciones</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products list */}
      <div>
        <h3 className="text-sm font-semibold text-ink mb-2">Lista de productos</h3>
        <div className="flex flex-col gap-1">
          {catalogo.productosSeleccionados.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-ink">{p.nombre}</span>
              <span className="text-xs text-gray-500">
                MOQ {p.moq.valor} {p.moq.unidad} · USD {p.precio.min}–{p.precio.max}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 py-3 rounded-full border-2 border-brand-900 text-brand-900 font-semibold text-sm hover:bg-brand-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Descargar mi perfil (.json)
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-3 rounded-full bg-brand-900 text-white font-semibold text-sm hover:bg-brand-900/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
          {isLoading ? 'Enviando...' : 'Enviar al equipo NxinMall'}
        </button>

        <p className="text-xs text-center text-gray-400">
          Al enviar, aceptas que NxinMall contacte a tu empresa para configurar tu tienda.
        </p>
      </div>

      {/* Back */}
      <div className="flex">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← Atrás
        </button>
      </div>
    </div>
  );
}
