'use client';

import { FaqItem } from './LandingComponents';

interface SectionProps {
  content: any;
  handleSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ContactForm({ content, handleSubmit }: SectionProps) {
  return (
    <section className="py-20" id="solicitud">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center reveal" data-animate="fade-up">
          <p className="text-sm font-semibold text-brand-700 mb-3">{content.form.kicker}</p>
          <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05] mb-3">
            {content.form.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">{content.form.subtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-white rounded-3xl border border-brand-100 p-7 shadow-[0_24px_60px_-40px_rgba(10,99,214,0.35)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500">{content.form.fields.name}</label>
              <input
                name="nombre"
                required
                className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                placeholder="Maria Perez"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">{content.form.fields.company}</label>
              <input
                name="empresa"
                required
                className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                placeholder="Agroexportadora Andina"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">{content.form.fields.email}</label>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                placeholder="maria@empresa.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">{content.form.fields.whatsapp}</label>
              <input
                name="whatsapp"
                required
                className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                placeholder="+51 999 000 000"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">{content.form.fields.country}</label>
              <select
                name="pais"
                required
                className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm bg-white"
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
          <div className="mt-4">
            <label className="text-xs font-semibold text-gray-500">{content.form.fields.message}</label>
            <textarea
              name="mensaje"
              rows={4}
              className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
              placeholder={content.form.fields.messagePlaceholder}
            />
          </div>
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-brand-900 text-white py-3 text-sm font-semibold hover:bg-brand-900/90 transition-colors"
          >
            {content.form.submit}
          </button>
        </form>
      </div>
    </section>
  );
}

export function FaqSection({ content }: { content: any }) {
  return (
    <section className="py-20 bg-brand-50" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-8 reveal" data-animate="fade-up">
          <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05] mb-2">
            {content.faq.title}
          </h2>
          <p className="text-gray-500">{content.faq.subtitle}</p>
        </div>
        <div className="flex flex-col gap-4">
          {content.faq.items.map((faq: any) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
