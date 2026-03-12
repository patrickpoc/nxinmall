'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import WizardProgress from './WizardProgress';
import { useOnboardingStore } from '@/lib/store';
import { LANG_OPTIONS } from '@/data/landing-content';

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
  nextLabel,
  backLabel,
  nextDisabled = false,
  isLoading = false,
  hideNav = false,
}: WizardShellProps) {
  const { idioma, setIdioma } = useOnboardingStore();
  const [langOpen, setLangOpen] = useState(false);

  const defaultNext = idioma === 'en' ? 'Next' : idioma === 'pt' ? 'Próximo' : 'Siguiente';
  const defaultBack = idioma === 'en' ? 'Back' : idioma === 'pt' ? 'Voltar' : 'Atrás';
  const nextLabelResolved = nextLabel ?? defaultNext;
  const backLabelResolved = backLabel ?? defaultBack;

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <img src="/visuals/logo.png" alt="NxinMall" className="h-9 w-auto" />
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((prev) => !prev)}
                className="text-brand-900 hover:text-brand-700 hover:bg-brand-50 rounded-full p-2 transition-all flex items-center justify-center"
                aria-label="Change language"
                aria-expanded={langOpen}
              >
                <Globe className="w-6 h-6" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-brand-100 bg-white shadow-xl text-xs font-bold uppercase tracking-widest overflow-hidden z-[60] animate-fade-in">
                  {LANG_OPTIONS.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      className={`w-full px-4 py-3 ${
                        option.code === idioma
                          ? 'bg-brand-50 text-brand-900'
                          : 'text-gray-500 hover:bg-brand-50 hover:text-brand-900'
                      } transition-colors`}
                      onClick={() => {
                        setIdioma(option.code as 'en' | 'es' | 'pt');
                        setLangOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-gray-100 mx-1" />

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-900/40 leading-none mb-1">Onboarding</span>
              <span className="text-xs font-bold text-gray-400 text-right">{idioma === 'en' ? 'Step' : 'Paso'} {currentStep} {idioma === 'en' ? 'of' : 'de'} 5</span>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-2">
          <WizardProgress currentStep={currentStep} />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-black text-ink font-display leading-[1.1] mb-3">{title}</h1>
          {subtitle && <p className="text-gray-500 text-base sm:text-lg leading-relaxed">{subtitle}</p>}
        </div>

        <div key={currentStep} className="bg-white rounded-[32px] border border-gray-100 p-6 sm:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] animate-fade-in">
          {children}
        </div>

        {!hideNav && (
          <div className="flex items-center justify-between mt-8 gap-4">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-ink transition-all duration-300"
              >
                {backLabelResolved}
              </button>
            ) : (
              <div />
            )}
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled || isLoading}
                className="px-8 py-3 rounded-full bg-brand-900 text-white text-sm font-bold hover:bg-brand-900/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300 shadow-lg shadow-brand-900/20"
              >
                {isLoading ? (idioma === 'en' ? 'Processing...' : idioma === 'pt' ? 'Processando...' : 'Procesando...') : nextLabelResolved}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
