'use client';

import Link from 'next/link';
import { CheckCircle, Download, Mail } from 'lucide-react';
import { useOnboardingStore } from '@/lib/store';
import { downloadStoreJson } from '@/lib/generate-json';

export default function GraciasPage() {
  const store = useOnboardingStore();

  const handleDownload = () => {
    downloadStoreJson(store);
  };

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 py-4 px-6 flex justify-between items-center bg-white border-b border-gray-200">
        <Link href="/" className="text-lg font-bold text-ink">
          Nxin<span className="text-brand-900">Mall</span>
        </Link>
      </div>

      <div className="mt-20 w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center">
        {/* Animated check */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-3">
          ¡Tu perfil fue enviado exitosamente!
        </h1>

        <p className="text-gray-500 mb-8 leading-relaxed">
          El equipo de NxinMall revisará tu información y configurará tu tienda en la plataforma.
          Te contactaremos por WhatsApp y email en las próximas <strong className="text-ink">24 horas</strong>.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-full border-2 border-brand-900 text-brand-900 font-semibold text-sm hover:bg-brand-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Descargar copia de tu perfil (.json)
          </button>

          <a
            href="mailto:peru@nxinmall.com"
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            <Mail className="w-4 h-4" />
            peru@nxinmall.com
          </a>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          ¿Tienes preguntas? Escríbenos a{' '}
          <a href="mailto:peru@nxinmall.com" className="text-brand-900 underline">
            peru@nxinmall.com
          </a>
        </p>
      </div>
    </div>
  );
}
