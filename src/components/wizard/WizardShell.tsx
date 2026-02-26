'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import WizardProgress from './WizardProgress';

interface WizardShellProps {
  currentStep: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
  hideNav?: boolean;
}

export default function WizardShell({
  currentStep,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = 'Siguiente',
  backLabel = 'Atrás',
  nextDisabled = false,
  isLoading = false,
  hideNav = false,
}: WizardShellProps) {
  return (
    <div className="min-h-screen bg-brand-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-ink">
            Nxin<span className="text-brand-900">Mall</span>
          </Link>
          <span className="text-xs text-gray-400">Paso {currentStep} de 5</span>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-3">
          <WizardProgress currentStep={currentStep} />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-gray-500 text-sm">{subtitle}</p>}
        </div>

        <div key={currentStep} className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-sm animate-fade-in">
          {children}
        </div>

        {!hideNav && (
          <div className="flex items-center justify-between mt-6 gap-4">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ← {backLabel}
              </button>
            ) : (
              <div />
            )}
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled || isLoading}
                className="px-6 py-2.5 rounded-full bg-brand-900 text-white text-sm font-semibold hover:bg-brand-900/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Procesando...' : `${nextLabel} →`}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
