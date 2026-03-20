'use client';

import { useState, useEffect } from 'react';
import { FaqItem } from './LandingComponents';
import type { Lang } from '@/data/landing-content';
import { getCountryPrefix } from '@/data/countries';
import CountryCombobox from '@/components/ui/CountryCombobox';
import { CATEGORIAS_FORM } from '@/data/categories';

const PLACEHOLDERS: Record<Lang, { name: string; company: string; email: string; phone: string }> = {
  es: { name: 'Tu nombre completo', company: 'Tu empresa', email: 'tu@empresa.com', phone: '999 000 000' },
  en: { name: 'Your full name', company: 'Your company', email: 'you@company.com', phone: '555 000 000' },
  pt: { name: 'Seu nome completo', company: 'Sua empresa', email: 'voce@empresa.com', phone: '11 99000 0000' },
};

interface SectionProps {
  content: any;
  lang: Lang;
  handleSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  submitted?: boolean;
  submitError?: string | null;
  selectedLeadType?: 'supplier' | 'buyer';
  onLeadTypeChange?: (leadType: 'supplier' | 'buyer') => void;
}

export function ContactForm({ content, lang, handleSubmit, submitted, submitError, selectedLeadType = 'supplier', onLeadTypeChange }: SectionProps) {
  const [selectedCountry, setSelectedCountry] = useState(() => lang === 'pt' ? 'Brasil' : '');
  const [documentType, setDocumentType] = useState('');
  const [documentDeferred, setDocumentDeferred] = useState(false);

  // When language changes externally, auto-select country
  useEffect(() => {
    if (lang === 'pt') setSelectedCountry('Brasil');
  }, [lang]);

  const prefix = selectedCountry ? getCountryPrefix(selectedCountry) : '';
  const ph = PLACEHOLDERS[lang];
  const inputClasses = "mt-2 w-full rounded-2xl border-none bg-white px-4 py-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:shadow-md transition-all duration-300 placeholder:text-gray-400";
  const labelClasses = "text-[11px] font-black text-brand-900/50 uppercase tracking-[0.2em] ml-1 mb-1";

  return (
    <section className="py-24 bg-gray-50/50" id="request">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center reveal mb-16" data-animate="fade-up">
          <p className="text-xs font-bold text-brand-700 mb-4 uppercase tracking-[0.3em]">{content.form.kicker}</p>
          <h2 className="text-[2.25rem] sm:text-[2.75rem] font-black text-ink font-display leading-[1.05] mb-6">
            {content.form.title}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">{content.form.subtitle}</p>
        </div>

        {submitted ? (
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-900/10 mb-6">
              <svg className="w-8 h-8 text-brand-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-ink font-display mb-3">{content.form.success.title}</h3>
            <p className="text-gray-600 text-lg">{content.form.success.desc}</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto reveal"
            data-animate="fade-up"
          >
            <input type="hidden" name="lead_type" value={selectedLeadType} />
            {submitError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}
            <div className="mb-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onLeadTypeChange?.('supplier')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedLeadType === 'supplier' ? 'bg-brand-900 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
              >
                {lang === 'pt' ? 'Cadastro de vendedor' : lang === 'es' ? 'Registro de vendedor' : 'Supplier registration'}
              </button>
              <button
                type="button"
                onClick={() => onLeadTypeChange?.('buyer')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedLeadType === 'buyer' ? 'bg-brand-900 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
              >
                {lang === 'pt' ? 'Cadastro de comprador' : lang === 'es' ? 'Registro de comprador' : 'Buyer registration'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {/* Nombre + Empresa */}
              <div className="flex flex-col">
                <label className={labelClasses}>{content.form.fields.name}</label>
                <input
                  name="nombre"
                  required
                  className={inputClasses}
                  placeholder={ph.name}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>{content.form.fields.company}</label>
                <input
                  name="empresa"
                  required
                  className={inputClasses}
                  placeholder={ph.company}
                />
              </div>
              {/* País — antes de contacto para fijar el prefijo */}
              <div className="flex flex-col sm:col-span-2">
                <label className={labelClasses}>{content.form.fields.country}</label>
                <CountryCombobox
                  name="pais"
                  required
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  placeholder={content.form.fields.countryPlaceholder}
                  inputClassName={inputClasses}
                />
              </div>
              {/* Categoría de producto */}
              <div className="flex flex-col sm:col-span-2">
                <label className={labelClasses}>{content.form.fields.categoria}</label>
                <select
                  name="categoria"
                  required
                  defaultValue=""
                  className={inputClasses + ' cursor-pointer'}
                >
                  <option value="" disabled>{content.form.fields.categoriaPlaceholder}</option>
                  {CATEGORIAS_FORM.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat[lang]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>{lang === 'pt' ? 'Pessoa' : lang === 'es' ? 'Persona' : 'Person type'}</label>
                <select name="document_person_type" defaultValue="" className={inputClasses + ' cursor-pointer'}>
                  <option value="">{lang === 'pt' ? 'Selecione' : lang === 'es' ? 'Seleccione' : 'Select'}</option>
                  <option value="individual">{lang === 'pt' ? 'Pessoa física' : lang === 'es' ? 'Persona natural' : 'Individual'}</option>
                  <option value="company">{lang === 'pt' ? 'Pessoa jurídica' : lang === 'es' ? 'Persona jurídica' : 'Company'}</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>{lang === 'pt' ? 'Tipo de documento' : lang === 'es' ? 'Tipo de documento' : 'Document type'}</label>
                <select
                  name="document_type"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className={inputClasses + ' cursor-pointer'}
                >
                  <option value="">{lang === 'pt' ? 'Selecione' : lang === 'es' ? 'Seleccione' : 'Select'}</option>
                  {selectedCountry === 'Brasil' ? (
                    <>
                      <option value="cpf">CPF</option>
                      <option value="cnpj">CNPJ</option>
                    </>
                  ) : selectedCountry === 'Peru' ? (
                    <option value="ruc">RUC</option>
                  ) : (
                    <option value="tax_id">{lang === 'pt' ? 'Documento fiscal' : lang === 'es' ? 'Documento fiscal' : 'Tax ID'}</option>
                  )}
                </select>
              </div>
              <div className="flex flex-col sm:col-span-2">
                <label className={labelClasses}>{documentType === 'cpf' ? 'CPF' : documentType === 'cnpj' ? 'CNPJ' : documentType === 'ruc' ? 'RUC' : (lang === 'pt' ? 'Documento fiscal' : lang === 'es' ? 'Documento fiscal' : 'Tax ID')}</label>
                <input
                  name="document_number"
                  disabled={documentDeferred}
                  className={inputClasses}
                  placeholder={documentType === 'cpf' ? '000.000.000-00' : documentType === 'cnpj' ? '00.000.000/0000-00' : documentType === 'ruc' ? '20123456789' : (lang === 'pt' ? 'Opcional' : lang === 'es' ? 'Opcional' : 'Optional')}
                />
                <label className="mt-2 inline-flex items-center gap-2 text-xs text-gray-500">
                  <input type="checkbox" name="document_deferred" checked={documentDeferred} onChange={(e) => setDocumentDeferred(e.target.checked)} />
                  {lang === 'pt' ? 'Prefiro não informar agora' : lang === 'es' ? 'Prefiero no informar ahora' : 'I prefer not to inform now'}
                </label>
              </div>
              {/* Email + WhatsApp — prefijo ya fijado por país */}
              <div className="flex flex-col">
                <label className={labelClasses}>{content.form.fields.email}</label>
                <input
                  name="email"
                  type="email"
                  required
                  className={inputClasses}
                  placeholder={ph.email}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>{content.form.fields.whatsapp}</label>
                <div className="mt-2 flex rounded-2xl overflow-hidden shadow-sm">
                  <span className="inline-flex items-center px-4 bg-gray-100 text-sm text-gray-500 font-black tracking-tight min-w-[52px] justify-center">
                    {prefix || '+'}
                  </span>
                  <input
                    name="whatsapp"
                    type="tel"
                    required
                    className="flex-1 px-4 py-4 text-sm bg-white border-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all duration-300 placeholder:text-gray-400"
                    placeholder={ph.phone}
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-auto px-12 py-4 rounded-full bg-brand-900 text-white text-lg font-bold hover:bg-brand-900/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-brand-900/25"
              >
                {content.form.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export function FaqSection({ content }: { content: any }) {
  return (
    <section className="py-24 bg-gray-50/50" id="faq">
      <div className="max-w-4xl mx-auto px-6 border-t border-gray-100 pt-24">
        <div className="text-center mb-10 reveal" data-animate="fade-up">
          <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05] mb-3">
            {content.faq.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{content.faq.subtitle}</p>
        </div>
        <div className="flex flex-col gap-6">
          {content.faq.items.map((faq: any, index: number) => (
            <div 
              key={faq.q} 
              className="reveal" 
              data-animate="fade-up"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <FaqItem q={faq.q} a={faq.a} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
