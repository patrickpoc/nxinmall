'use client';

import Link from 'next/link';
import { CheckCircle, Mail } from 'lucide-react';

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="absolute top-0 left-0 right-0 py-4 px-6 bg-white border-b border-gray-200">
        <Link href="/" className="text-lg font-bold text-ink">
          Nxin<span className="text-brand-900">Mall</span>
        </Link>
      </div>

      <div className="mt-16 w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-sm p-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          ¡Perfil enviado!
        </h1>

        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          El equipo de NxinMall revisará tu información y configurará tu tienda.
          Te contactaremos por WhatsApp en las próximas <strong className="text-gray-700">24 horas</strong>.
        </p>

        <a
          href="mailto:peru@nxinmall.com"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-900 transition-colors"
        >
          <Mail className="w-4 h-4" />
          peru@nxinmall.com
        </a>
      </div>
    </div>
  );
}
