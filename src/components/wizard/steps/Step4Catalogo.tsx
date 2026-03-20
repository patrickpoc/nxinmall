'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
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
  const [error, setError] = useState('');
  const [productInput, setProductInput] = useState('');
  const [interview, setInterview] = useState(catalog.entrevista ?? DEFAULT_INTERVIEW);

  const setInterviewField = (field: keyof typeof interview, value: string | string[]) => {
    const next = { ...interview, [field]: value };
    setInterview(next);
    setCurrentStep(useOnboardingStore.getState().meta.currentStep);
    useOnboardingStore.setState((state) => ({
      catalogo: { ...state.catalogo, entrevista: next },
    }));
  };

  const addMainProduct = () => {
    const value = productInput.trim();
    if (!value) return;
    if (interview.produtosPrincipais.some((p) => p.toLowerCase() === value.toLowerCase())) {
      setProductInput('');
      return;
    }
    setInterviewField('produtosPrincipais', [...interview.produtosPrincipais, value]);
    setProductInput('');
  };

  const removeMainProduct = (value: string) => {
    setInterviewField('produtosPrincipais', interview.produtosPrincipais.filter((p) => p !== value));
  };

  const buildSummary = () => {
    const yes = language === 'en' ? 'Yes' : language === 'pt' ? 'Sim' : 'Sí';
    const no = language === 'en' ? 'No' : language === 'pt' ? 'Não' : 'No';
    const seasonText = interview.sazonalidade === 'yes' ? `${yes}${interview.janelaSazonal ? ` (${interview.janelaSazonal})` : ''}` : no;
    return [
      `${language === 'en' ? 'Portfolio focus' : language === 'pt' ? 'Foco do portfólio' : 'Foco del portafolio'}: ${interview.produtosPrincipais.join(', ') || '-'}. ${language === 'en' ? 'Anchor product' : language === 'pt' ? 'Produto âncora' : 'Producto ancla'}: ${interview.produtoAncora || '-'}.`,
      `${language === 'en' ? 'Operation model' : language === 'pt' ? 'Modelo de operação' : 'Modelo de operación'}: ${interview.tipoOperacao || '-'}. ${language === 'en' ? 'Origin' : language === 'pt' ? 'Origem' : 'Origen'}: ${interview.origemProduto || '-'}. ${language === 'en' ? 'Seasonality' : language === 'pt' ? 'Sazonalidade' : 'Estacionalidad'}: ${seasonText}.`,
      `${language === 'en' ? 'Capacity' : language === 'pt' ? 'Capacidade' : 'Capacidad'}: ${interview.capacidadeMensalLinha || '-'}. MOQ: ${interview.moqTipico || '-'}. ${language === 'en' ? 'Price range' : language === 'pt' ? 'Faixa de preço' : 'Rango de precio'}: ${interview.faixaPreco || '-'}.`,
      `${language === 'en' ? 'Markets' : language === 'pt' ? 'Mercados' : 'Mercados'}: ${interview.mercadosAtendidos || '-'}. Incoterms: ${interview.incoterms || '-'}. Lead time: ${interview.leadTime || '-'}.`,
      `${language === 'en' ? 'Certifications/docs' : language === 'pt' ? 'Certificações/docs' : 'Certificaciones/docs'}: ${interview.docsCertsVenda || '-'}.`,
      `${language === 'en' ? 'Commercial terms' : language === 'pt' ? 'Condições comerciais' : 'Condiciones comerciales'}: ${interview.condicoesMinimas || '-'}. ${language === 'en' ? 'Differentials' : language === 'pt' ? 'Diferenciais' : 'Diferenciales'}: ${interview.diferenciais || '-'}. ${language === 'en' ? 'Risks' : language === 'pt' ? 'Riscos' : 'Riesgos'}: ${interview.riscosRestricoes || '-'}.`,
    ].join('\n');
  };

  const handleNext = () => {
    if (interview.produtosPrincipais.length === 0) {
      setError(t('errPaso4Products', language));
      return;
    }
    if (!interview.produtoAncora.trim()) {
      setError(t('errPaso4Anchor', language));
      return;
    }
    if (!interview.tipoOperacao.trim()) {
      setError(t('errPaso4Operation', language));
      return;
    }
    if (!interview.capacidadeMensalLinha.trim()) {
      setError(t('errPaso4Capacity', language));
      return;
    }
    if (!interview.mercadosAtendidos.trim()) {
      setError(t('errPaso4Markets', language));
      return;
    }
    setError('');
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

      {error && (
        <p className="text-[11px] font-bold text-red-500 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100/50 uppercase tracking-wider text-center">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className={labelClass}>{t('paso4MainProductsLabel', language)}</label>
          <div className="flex gap-2">
            <input
              value={productInput}
              onChange={(e) => setProductInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addMainProduct();
                }
              }}
              className={inputClass}
              placeholder={t('paso4MainProductsPlaceholder', language)}
            />
            <button type="button" onClick={addMainProduct} className="h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-2xl bg-brand-900 text-white text-2xl leading-none font-semibold hover:bg-brand-900/90 transition-colors">+</button>
          </div>
          {interview.produtosPrincipais.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {interview.produtosPrincipais.map((p) => (
                <span key={p} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  <span>{p}</span>
                  <button type="button" onClick={() => removeMainProduct(p)} className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[11px] leading-none text-brand-700 hover:bg-red-100 hover:text-red-600 transition-colors" aria-label={`Remove ${p}`}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className={labelClass}>{t('paso4AnchorProductLabel', language)}</label>
          <input value={interview.produtoAncora} onChange={(e) => setInterviewField('produtoAncora', e.target.value)} className={inputClass} placeholder={t('paso4AnchorProductPlaceholder', language)} />
        </div>
        <div>
          <label className={labelClass}>{t('paso4SeasonalityLabel', language)}</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setInterviewField('sazonalidade', 'yes')} className={`px-4 py-3 rounded-2xl text-sm font-bold border ${interview.sazonalidade === 'yes' ? 'bg-brand-900 text-white border-brand-900' : 'bg-white border-gray-200 text-gray-500'}`}>{t('paso4SeasonalityYes', language)}</button>
            <button type="button" onClick={() => setInterviewField('sazonalidade', 'no')} className={`px-4 py-3 rounded-2xl text-sm font-bold border ${interview.sazonalidade === 'no' ? 'bg-brand-900 text-white border-brand-900' : 'bg-white border-gray-200 text-gray-500'}`}>{t('paso4SeasonalityNo', language)}</button>
          </div>
        </div>
        {interview.sazonalidade === 'yes' && (
          <div>
            <label className={labelClass}>{t('paso4SeasonWindowLabel', language)}</label>
            <input value={interview.janelaSazonal} onChange={(e) => setInterviewField('janelaSazonal', e.target.value)} className={inputClass} placeholder={t('paso4SeasonWindowPlaceholder', language)} />
          </div>
        )}
        <div>
          <label className={labelClass}>{t('paso4MoqTipicoLabel', language)}</label>
          <input value={interview.moqTipico} onChange={(e) => setInterviewField('moqTipico', e.target.value)} className={inputClass} placeholder={t('paso4MoqTipicoPlaceholder', language)} />
        </div>
        <div>
          <label className={labelClass}>{t('paso4PriceRangeLabel', language)}</label>
          <input value={interview.faixaPreco} onChange={(e) => setInterviewField('faixaPreco', e.target.value)} className={inputClass} placeholder={t('paso4PriceRangePlaceholder', language)} />
        </div>
        <div>
          <label className={labelClass}>{t('paso4SalesUnitLabel', language)}</label>
          <input value={interview.unidadeVenda} onChange={(e) => setInterviewField('unidadeVenda', e.target.value)} className={inputClass} placeholder={t('paso4SalesUnitPlaceholder', language)} />
        </div>
        <div>
          <label className={labelClass}>{t('paso4FormatsLabel', language)}</label>
          <input value={interview.formatos} onChange={(e) => setInterviewField('formatos', e.target.value)} className={inputClass} placeholder={t('paso4FormatsPlaceholder', language)} />
        </div>
        <div>
          <label className={labelClass}>{t('paso4OperationTypeLabel', language)}</label>
          <input value={interview.tipoOperacao} onChange={(e) => setInterviewField('tipoOperacao', e.target.value)} className={inputClass} placeholder={t('paso4OperationTypePlaceholder', language)} />
        </div>
        <div>
          <label className={labelClass}>{t('paso4ProductOriginLabel', language)}</label>
          <input value={interview.origemProduto} onChange={(e) => setInterviewField('origemProduto', e.target.value)} className={inputClass} placeholder={t('paso4ProductOriginPlaceholder', language)} />
        </div>
        <div>
          <label className={labelClass}>{t('paso4LineCapacityLabel', language)}</label>
          <input value={interview.capacidadeMensalLinha} onChange={(e) => setInterviewField('capacidadeMensalLinha', e.target.value)} className={inputClass} placeholder={t('paso4LineCapacityPlaceholder', language)} />
        </div>
        <div>
          <label className={labelClass}>{t('paso4MarketsLabel', language)}</label>
          <input value={interview.mercadosAtendidos} onChange={(e) => setInterviewField('mercadosAtendidos', e.target.value)} className={inputClass} placeholder={t('paso4MarketsPlaceholder', language)} />
        </div>
        <div>
          <label className={labelClass}>{t('paso4IncotermsLabel', language)}</label>
          <input value={interview.incoterms} onChange={(e) => setInterviewField('incoterms', e.target.value)} className={inputClass} placeholder={t('paso4IncotermsPlaceholder', language)} />
        </div>
        <div>
          <label className={labelClass}>{t('paso4LeadTimeLabel', language)}</label>
          <input value={interview.leadTime} onChange={(e) => setInterviewField('leadTime', e.target.value)} className={inputClass} placeholder={t('paso4LeadTimePlaceholder', language)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{t('paso4DocsLabel', language)}</label>
          <textarea value={interview.docsCertsVenda} onChange={(e) => setInterviewField('docsCertsVenda', e.target.value)} className={`${inputClass} h-24 resize-none`} placeholder={t('paso4DocsPlaceholder', language)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{t('paso4CommercialTermsLabel', language)}</label>
          <textarea value={interview.condicoesMinimas} onChange={(e) => setInterviewField('condicoesMinimas', e.target.value)} className={`${inputClass} h-20 resize-none`} placeholder={t('paso4CommercialTermsPlaceholder', language)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{t('paso4DifferentialsLabel', language)}</label>
          <textarea value={interview.diferenciais} onChange={(e) => setInterviewField('diferenciais', e.target.value)} className={`${inputClass} h-20 resize-none`} placeholder={t('paso4DifferentialsPlaceholder', language)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{t('paso4RisksLabel', language)}</label>
          <textarea value={interview.riscosRestricoes} onChange={(e) => setInterviewField('riscosRestricoes', e.target.value)} className={`${inputClass} h-20 resize-none`} placeholder={t('paso4RisksPlaceholder', language)} />
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
