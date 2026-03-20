'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/lib/store';
import { t } from '@/lib/i18n';

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

const DEFAULT_INTERVIEW = {
  produtosPrincipais: [],
  produtoAncora: '',
  sazonalidade: '' as '' | 'yes' | 'no',
  janelaSazonal: '',
  moqTipico: '',
  faixaPreco: '',
  unidadeVenda: '',
  formatos: '',
  tipoOperacao: '',
  origemProduto: '',
  capacidadeMensalLinha: '',
  mercadosAtendidos: '',
  incoterms: '',
  leadTime: '',
  docsCertsVenda: '',
  condicoesMinimas: '',
  diferenciais: '',
  riscosRestricoes: '',
  onboardingSummary: '',
};

export default function Step4Catalogo({ onNext, onBack }: Step4Props) {
  const { catalogo: catalog, idioma: language, setCurrentStep } = useOnboardingStore();
  const [interview, setInterview] = useState(catalog.entrevista ?? DEFAULT_INTERVIEW);

  const setInterviewField = (field: keyof typeof interview, value: string | string[]) => {
    const next = { ...interview, [field]: value };
    setInterview(next);
    setCurrentStep(useOnboardingStore.getState().meta.currentStep);
    useOnboardingStore.setState((state) => ({
      catalogo: { ...state.catalogo, entrevista: next },
    }));
  };

  const buildSummary = () => {
    const none = language === 'en' ? 'Not provided' : language === 'pt' ? 'Nao informado' : 'No informado';
    return [
      `${language === 'en' ? 'Additional onboarding notes' : language === 'pt' ? 'Notas adicionais do onboarding' : 'Notas adicionales de onboarding'}.`,
      `${language === 'en' ? 'Formats' : language === 'pt' ? 'Formatos' : 'Formatos'}: ${interview.formatos || none}.`,
      `${language === 'en' ? 'Certifications / documents' : language === 'pt' ? 'Certificacoes / documentos' : 'Certificaciones / documentos'}: ${interview.docsCertsVenda || none}.`,
      `${language === 'en' ? 'Minimum commercial terms' : language === 'pt' ? 'Condicoes comerciais minimas' : 'Condiciones comerciales minimas'}: ${interview.condicoesMinimas || none}.`,
      `${language === 'en' ? 'Key differentiators' : language === 'pt' ? 'Diferenciais principais' : 'Diferenciales principales'}: ${interview.diferenciais || none}.`,
      `${language === 'en' ? 'Risks or restrictions' : language === 'pt' ? 'Riscos ou restricoes' : 'Riesgos o restricciones'}: ${interview.riscosRestricoes || none}.`,
    ].join('\n');
  };

  const handleNext = () => {
    const onboardingSummary = buildSummary();
    setInterviewField('onboardingSummary', onboardingSummary);
    onNext();
  };

  const labelClass = "text-[11px] font-black text-brand-900/50 uppercase tracking-[0.2em] ml-1 mb-1";
  const inputClass = "w-full px-4 py-3 text-sm rounded-2xl bg-gray-50 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:shadow-md transition-all duration-300";

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-gray-100 bg-gray-50/40 p-4">
        <p className="text-sm font-black text-ink uppercase tracking-tight">{t('paso4Subtitulo', language)}</p>
        <p className="text-xs text-gray-500 mt-1 font-medium">{t('paso4InterviewHint', language)}</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div className="sm:col-span-2">
          <label className={labelClass}>{t('paso4CommercialTermsLabel', language)}</label>
          <textarea
            value={interview.condicoesMinimas}
            onChange={(e) => setInterviewField('condicoesMinimas', e.target.value)}
            className={`${inputClass} h-20 resize-none`}
            placeholder={t('paso4CommercialTermsPlaceholder', language)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{t('paso4DifferentialsLabel', language)}</label>
          <textarea
            value={interview.diferenciais}
            onChange={(e) => setInterviewField('diferenciais', e.target.value)}
            className={`${inputClass} h-20 resize-none`}
            placeholder={t('paso4DifferentialsPlaceholder', language)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{t('paso4RisksLabel', language)}</label>
          <textarea
            value={interview.riscosRestricoes}
            onChange={(e) => setInterviewField('riscosRestricoes', e.target.value)}
            className={`${inputClass} h-20 resize-none`}
            placeholder={t('paso4RisksPlaceholder', language)}
          />
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-ink transition-all duration-300"
        >
          {t('btnAtras', language)}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 rounded-full bg-brand-900 text-white text-sm font-bold hover:bg-brand-900/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-brand-900/20"
        >
          {t('btnSiguiente', language)}
        </button>
      </div>
    </div>
  );
}
