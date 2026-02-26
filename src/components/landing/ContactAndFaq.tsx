'use client';

import { FaqItem } from './LandingComponents';

interface SectionProps {
  content: any;
  handleSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  submitted?: boolean;
}

export function ContactForm({ content, handleSubmit, submitted }: SectionProps) {
  const inputClasses = "mt-2 w-full rounded-2xl border-none bg-white px-4 py-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:shadow-md transition-all duration-300 placeholder:text-gray-400";
  const labelClasses = "text-[11px] font-black text-brand-900/50 uppercase tracking-[0.2em] ml-1 mb-1";

  return (
    <section className="py-24 bg-gray-50/50" id="solicitud">
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
            <h3 className="text-2xl font-black text-ink font-display mb-3">¡Solicitud enviada!</h3>
            <p className="text-gray-600 text-lg">Un ejecutivo te contactará en las próximas 24–48 horas.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto reveal"
            data-animate="fade-up"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col">
                <label className={labelClasses}>{content.form.fields.name}</label>
                <input
                  name="nombre"
                  required
                  className={inputClasses}
                  placeholder="Maria Perez"
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>{content.form.fields.company}</label>
                <input
                  name="empresa"
                  required
                  className={inputClasses}
                  placeholder="Agroexportadora Andina"
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>{content.form.fields.email}</label>
                <input
                  name="email"
                  type="email"
                  required
                  className={inputClasses}
                  placeholder="maria@empresa.com"
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>{content.form.fields.whatsapp}</label>
                <input
                  name="whatsapp"
                  required
                  className={inputClasses}
                  placeholder="+51 999 000 000"
                />
              </div>
              <div className="flex flex-col sm:col-span-2">
                <label className={labelClasses}>{content.form.fields.country}</label>
                <select
                  name="pais"
                  required
                  className={inputClasses}
                  defaultValue=""
                >
                  <option value="" disabled>
                    {content.form.fields.countryPlaceholder}
                  </option>
                  <option value="Peru">Peru</option>
                  <option value="Brasil">Brasil</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Ecuador">Ecuador</option>
                </select>
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
