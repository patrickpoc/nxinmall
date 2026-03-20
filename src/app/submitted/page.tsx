'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Mail } from 'lucide-react';
import { useOnboardingStore } from '@/lib/store';
import { t } from '@/lib/i18n';

export default function SubmittedPage() {
  const { idioma: language, registro: registration } = useOnboardingStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="absolute top-0 left-0 right-0 py-3 px-6 bg-white border-b border-gray-200 flex items-center">
        <Link href="/">
          <Image
            src="/visuals/logo.png"
            alt="NxinMall"
            width={120}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      <div className="mt-16 w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-sm p-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {t('submittedTitle', language)}
        </h1>

        {registration.nombre && (
          <p className="text-base font-semibold text-brand-900 mb-2">
            {registration.nombre}
          </p>
        )}

        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          {t('submittedSubtitle', language)}{' '}
          <strong className="text-gray-700">{t('submittedHours', language)}</strong>.
        </p>

        <a
          href="mailto:support@nxinmall.com"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-900 transition-colors mb-6"
        >
          <Mail className="w-4 h-4" />
          support@nxinmall.com
        </a>

        <div className="mt-2">
          <Link
            href="/"
            className="text-xs font-bold text-gray-300 hover:text-gray-500 uppercase tracking-widest transition-colors"
          >
            {t('submittedBackHome', language)}
          </Link>
        </div>
      </div>
    </div>
  );
}
