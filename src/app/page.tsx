'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowUpRight, FileCheck2, Globe, Globe2, ShieldCheck, Truck } from 'lucide-react';

type Lang = 'es' | 'en' | 'pt';

const COPY: Record<Lang, {
  nav: { suppliers: string; process: string; faq: string; cta: string };
  hero: { badge: string; title: string; subtitle: string; primary: string; secondary: string };
  benefitsTitle: string;
  benefits: { title: string; desc: string }[];
  logistics: { kicker: string; title: string; body: string };
  process: { title: string; subtitle: string; steps: { title: string; desc: string }[] };
  buyers: { kicker: string; title: string; body: string };
  form: { kicker: string; title: string; subtitle: string; fields: Record<string, string>; submit: string };
  faq: { title: string; subtitle: string; items: { q: string; a: string }[] };
  footer: { tagline: string; cta: string };
}> = {
  es: {
    nav: { suppliers: 'Soy proveedor', process: 'Proceso', faq: 'Preguntas', cta: 'Solicitar acceso' },
    hero: {
      badge: 'Proveedores exportadores',
      title: 'Tu produccion lista para compradores internacionales.',
      subtitle: 'NxinMall conecta oferta agricola con demanda global mediante un flujo comercial simple y acompanado.',
      primary: 'Quiero ser proveedor',
      secondary: 'Ver beneficios',
    },
    benefitsTitle: 'Por que con NxinMall',
    benefits: [
      {
        title: 'Acceso a nuevos mercados',
        desc: 'Conecta con compradores internacionales que buscan oferta confiable y continua.',
      },
      {
        title: 'Transacciones seguras',
        desc: 'Contratos claros, trazabilidad y soporte en cada etapa comercial.',
      },
      {
        title: 'Documentos y pagos en linea',
        desc: 'Gestiona documentos y estados de pago desde una sola plataforma.',
      },
      {
        title: 'Seguimiento de carga',
        desc: 'Monitorea el avance logistico y mejora tu cumplimiento.',
      },
    ],
    logistics: {
      kicker: 'Logistica y cumplimiento',
      title: 'Control sobre cada etapa del embarque.',
      body: 'Coordinamos documentos, pagos y trazabilidad para que tu carga viaje con visibilidad total.',
    },
    process: {
      title: 'Un flujo simple para empezar',
      subtitle: 'Priorizamos velocidad y claridad comercial para que llegues a compradores internacionales sin friccion.',
      steps: [
        { title: 'Envias tu solicitud', desc: 'Completa el formulario con tus datos comerciales.' },
        { title: 'Te contacta un ejecutivo', desc: 'Confirmamos capacidad, categorias y paises objetivo.' },
        { title: 'Recibes tu enlace', desc: 'Inicias el onboarding con un link unico para tu empresa.' },
      ],
    },
    buyers: {
      kicker: 'Compradores globales',
      title: 'Tu catalogo frente a demanda activa.',
      body: 'Te ayudamos a posicionar tu oferta con compradores recurrentes y acuerdos claros.',
    },
    form: {
      kicker: 'Solicitud de proveedor',
      title: 'Hablemos de tu operacion.',
      subtitle: 'Completa tus datos y un ejecutivo te contactara para activar el siguiente paso.',
      fields: {
        name: 'Nombre completo',
        company: 'Empresa',
        email: 'Email',
        whatsapp: 'WhatsApp',
        country: 'Pais',
        message: 'Mensaje',
        countryPlaceholder: 'Selecciona un pais',
        messagePlaceholder: 'Categorias, volumen, certificaciones.',
      },
      submit: 'Enviar solicitud',
    },
    faq: {
      title: 'Preguntas frecuentes',
      subtitle: 'Todo lo que debes saber antes de postular.',
      items: [
        { q: 'Cuanto tarda la respuesta?', a: 'Nuestro equipo responde en 24 a 48 horas habiles.' },
        { q: 'Con que paises trabajan?', a: 'Peru, Brasil, Colombia y Ecuador. Evaluamos otros mercados.' },
        { q: 'Que productos aceptan?', a: 'Frutas, verduras, flores y agroindustria con volumen de exportacion.' },
      ],
    },
    footer: {
      tagline: 'Plataforma global B2B para exportadores.',
      cta: 'Solicitar acceso',
    },
  },
  en: {
    nav: { suppliers: 'Suppliers', process: 'Process', faq: 'FAQ', cta: 'Request access' },
    hero: {
      badge: 'Export suppliers',
      title: 'Your production ready for international buyers.',
      subtitle: 'NxinMall connects agricultural supply with global demand through a simple, guided flow.',
      primary: 'Become a supplier',
      secondary: 'See benefits',
    },
    benefitsTitle: 'Why NxinMall',
    benefits: [
      {
        title: 'Access to new markets',
        desc: 'Connect with international buyers looking for reliable, consistent supply.',
      },
      {
        title: 'Secure transactions',
        desc: 'Clear contracts, traceability, and support at every commercial stage.',
      },
      {
        title: 'Documents and payments',
        desc: 'Manage documents and payment status from one platform.',
      },
      {
        title: 'Cargo tracking',
        desc: 'Monitor logistics progress and improve fulfillment.',
      },
    ],
    logistics: {
      kicker: 'Logistics and compliance',
      title: 'Control every step of the shipment.',
      body: 'We coordinate documents, payments, and traceability for full visibility.',
    },
    process: {
      title: 'A simple way to start',
      subtitle: 'Speed and commercial clarity so you reach buyers without friction.',
      steps: [
        { title: 'Submit your request', desc: 'Complete the form with your business details.' },
        { title: 'Executive review', desc: 'We confirm capacity, categories, and target countries.' },
        { title: 'Receive your link', desc: 'Start onboarding with a unique link for your company.' },
      ],
    },
    buyers: {
      kicker: 'Global buyers',
      title: 'Your catalog in front of active demand.',
      body: 'We help position your offer with recurring buyers and clear agreements.',
    },
    form: {
      kicker: 'Supplier request',
      title: 'Tell us about your operation.',
      subtitle: 'Share your details and an executive will contact you to activate the next step.',
      fields: {
        name: 'Full name',
        company: 'Company',
        email: 'Email',
        whatsapp: 'WhatsApp',
        country: 'Country',
        message: 'Message',
        countryPlaceholder: 'Select a country',
        messagePlaceholder: 'Categories, volume, certifications.',
      },
      submit: 'Send request',
    },
    faq: {
      title: 'Frequently asked questions',
      subtitle: 'Everything you need before applying.',
      items: [
        { q: 'How fast is the response?', a: 'Our team responds within 24 to 48 business hours.' },
        { q: 'Which countries do you serve?', a: 'Peru, Brazil, Colombia, and Ecuador. We evaluate others.' },
        { q: 'Which products are accepted?', a: 'Fruits, vegetables, flowers, and agroindustry at export scale.' },
      ],
    },
    footer: {
      tagline: 'Global B2B platform for exporters.',
      cta: 'Request access',
    },
  },
  pt: {
    nav: { suppliers: 'Sou fornecedor', process: 'Processo', faq: 'Perguntas', cta: 'Solicitar acesso' },
    hero: {
      badge: 'Fornecedores exportadores',
      title: 'Sua producao pronta para compradores internacionais.',
      subtitle: 'A NxinMall conecta oferta agricola com demanda global por um fluxo simples e acompanhado.',
      primary: 'Quero ser fornecedor',
      secondary: 'Ver beneficios',
    },
    benefitsTitle: 'Por que NxinMall',
    benefits: [
      {
        title: 'Acesso a novos mercados',
        desc: 'Conecte-se com compradores internacionais que buscam oferta confiavel e constante.',
      },
      {
        title: 'Transacoes seguras',
        desc: 'Contratos claros, rastreabilidade e suporte em cada etapa comercial.',
      },
      {
        title: 'Documentos e pagamentos',
        desc: 'Gerencie documentos e status de pagamento em uma unica plataforma.',
      },
      {
        title: 'Acompanhamento de carga',
        desc: 'Monitore a logistica e melhore o cumprimento.',
      },
    ],
    logistics: {
      kicker: 'Logistica e compliance',
      title: 'Controle cada etapa do embarque.',
      body: 'Coordenamos documentos, pagamentos e rastreabilidade com visibilidade total.',
    },
    process: {
      title: 'Um fluxo simples para comecar',
      subtitle: 'Velocidade e clareza comercial para chegar a compradores sem friccao.',
      steps: [
        { title: 'Envie sua solicitacao', desc: 'Complete o formulario com dados comerciais.' },
        { title: 'Contato do executivo', desc: 'Confirmamos capacidade, categorias e paises alvo.' },
        { title: 'Receba seu link', desc: 'Inicie o onboarding com um link unico para sua empresa.' },
      ],
    },
    buyers: {
      kicker: 'Compradores globais',
      title: 'Seu catalogo diante de demanda ativa.',
      body: 'Ajudamos a posicionar sua oferta com compradores recorrentes e acordos claros.',
    },
    form: {
      kicker: 'Solicitacao de fornecedor',
      title: 'Vamos falar da sua operacao.',
      subtitle: 'Envie seus dados e um executivo entra em contato para ativar o proximo passo.',
      fields: {
        name: 'Nome completo',
        company: 'Empresa',
        email: 'Email',
        whatsapp: 'WhatsApp',
        country: 'Pais',
        message: 'Mensagem',
        countryPlaceholder: 'Selecione um pais',
        messagePlaceholder: 'Categorias, volume, certificacoes.',
      },
      submit: 'Enviar solicitacao',
    },
    faq: {
      title: 'Perguntas frequentes',
      subtitle: 'Tudo o que voce precisa antes de aplicar.',
      items: [
        { q: 'Quanto tempo leva a resposta?', a: 'Nossa equipe responde em 24 a 48 horas uteis.' },
        { q: 'Com quais paises trabalham?', a: 'Peru, Brasil, Colombia e Ecuador. Avaliamos outros.' },
        { q: 'Quais produtos aceitam?', a: 'Frutas, vegetais, flores e agroindustria em escala exportadora.' },
      ],
    },
    footer: {
      tagline: 'Plataforma global B2B para exportadores.',
      cta: 'Solicitar acesso',
    },
  },
};

const BENEFIT_ICONS = [Globe2, ShieldCheck, FileCheck2, Truck];

const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-brand-100 rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-medium text-brand-900"
      >
        <span>{q}</span>
        <span className="text-brand-500">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-4 pb-3 text-sm text-gray-600 leading-relaxed">{a}</div>}
    </div>
  );
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const langParam = (searchParams.get('lang') || '') as Lang;
  const initialLang: Lang = ['es', 'en', 'pt'].includes(langParam) ? langParam : 'es';
  const [lang, setLang] = useState<Lang>(initialLang);
  const [langOpen, setLangOpen] = useState(false);
  const content = COPY[lang];

  useEffect(() => {
    if (langParam && ['es', 'en', 'pt'].includes(langParam)) {
      setLang(langParam);
      localStorage.setItem('nxin-lang', langParam);
      return;
    }

    const stored = localStorage.getItem('nxin-lang') as Lang | null;
    if (stored && ['es', 'en', 'pt'].includes(stored)) {
      setLang(stored);
    }
  }, [langParam]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const body = [
      `Nombre: ${data.nombre || ''}`,
      `Empresa: ${data.empresa || ''}`,
      `Email: ${data.email || ''}`,
      `WhatsApp: ${data.whatsapp || ''}`,
      `Pais: ${data.pais || ''}`,
      `Mensaje: ${data.mensaje || ''}`,
    ].join('\n');

    const mailto = `mailto:peru@nxinmall.com?subject=${encodeURIComponent(
      'Solicitud de proveedor NxinMall',
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    form.reset();
  };

  return (
    <div className="min-h-screen text-ink bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur border-b border-brand-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <img src="/visuals/logo.png" alt="NxinMall" className="h-10 w-auto" />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="#beneficios" className="hover:text-brand-900 transition-colors">
              {content.nav.suppliers}
            </Link>
            <Link href="#proceso" className="hover:text-brand-900 transition-colors">
              {content.nav.process}
            </Link>
            <Link href="#faq" className="hover:text-brand-900 transition-colors">
              {content.nav.faq}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((prev) => !prev)}
                className="text-brand-900 hover:text-brand-700 transition-colors flex items-center justify-center"
                aria-label="Cambiar idioma"
                aria-expanded={langOpen}
              >
                <Globe className="w-7 h-7" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-brand-100 bg-white shadow-lg text-sm overflow-hidden z-10">
                  {LANG_OPTIONS.filter((option) => option.code !== lang).map((option) => (
                    <Link
                      key={option.code}
                      href={`/?lang=${option.code}`}
                      className="block px-4 py-2 hover:bg-brand-50 text-gray-700"
                      onClick={() => {
                        localStorage.setItem('nxin-lang', option.code);
                        setLang(option.code);
                        setLangOpen(false);
                      }}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="#solicitud"
              className="px-4 py-2 rounded-full bg-brand-900 text-white text-sm font-semibold hover:bg-brand-900/90 transition-colors"
            >
              {content.nav.cta}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-24" id="inicio">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto animate-fade-up">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-700 font-semibold mb-4">
                {content.hero.badge}
              </p>
              <h1 className="text-[2.6rem] sm:text-[4rem] font-black text-ink leading-[1.05] mb-4 font-display">
                {content.hero.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">{content.hero.subtitle}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="#solicitud"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-900 text-white font-semibold text-sm hover:bg-brand-900/90 transition-colors"
                >
                  {content.hero.primary} <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#beneficios"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-100 text-ink font-semibold text-sm hover:bg-white/70 transition-colors"
                >
                  {content.hero.secondary}
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <div className="mx-auto max-w-6xl px-6">
              <div className="relative overflow-hidden rounded-[28px] border border-brand-100 bg-white aspect-[16/7] animate-soft-zoom">
                <img
                  src="/visuals/hero.jpg"
                  alt="Cadena de suministro agricola"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,99,214,0.18),transparent_55%)]" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-brand-50" id="beneficios">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-up">
              <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05]">
                {content.benefitsTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {content.benefits.map((benefit, index) => {
                const Icon = BENEFIT_ICONS[index];
                return (
                  <div
                    key={benefit.title}
                    className="p-5 rounded-2xl bg-white border border-brand-100 animate-fade-up"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-3">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-medium text-base text-ink mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            <div className="animate-fade-up">
              <p className="text-sm font-semibold text-brand-700 mb-3">{content.logistics.kicker}</p>
              <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05] mb-3">
                {content.logistics.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">{content.logistics.body}</p>
            </div>
            <div className="animate-fade-up">
              <div className="rounded-[26px] border border-brand-100 overflow-hidden bg-white shadow-[0_24px_60px_-40px_rgba(10,99,214,0.35)] animate-soft-zoom">
                <img src="/visuals/logistics.jpg" alt="Logistica y exportacion" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white" id="proceso">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-up">
              <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05]">
                {content.process.title}
              </h2>
              <p className="text-gray-600 mt-3">{content.process.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.process.steps.map((step, index) => (
                <div
                  key={step.title}
                  className="bg-white rounded-2xl border border-brand-100 p-4 animate-fade-up"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-brand-900 text-white text-xs font-semibold flex items-center justify-center">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-ink">{step.title}</p>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
            <div className="order-2 lg:order-1 animate-fade-up">
              <div className="rounded-[26px] border border-brand-100 overflow-hidden bg-white shadow-[0_24px_60px_-40px_rgba(10,99,214,0.35)] animate-soft-zoom">
                <img src="/visuals/buyers.jpg" alt="Compradores globales" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="order-1 lg:order-2 animate-fade-up">
              <p className="text-sm font-semibold text-brand-700 mb-3">{content.buyers.kicker}</p>
              <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05] mb-3">
                {content.buyers.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">{content.buyers.body}</p>
            </div>
          </div>
        </section>

        <section className="py-20" id="solicitud">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center animate-fade-up">
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

        <section className="py-20 bg-brand-50" id="faq">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-8 animate-fade-up">
              <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05] mb-2">
                {content.faq.title}
              </h2>
              <p className="text-gray-500">{content.faq.subtitle}</p>
            </div>
            <div className="flex flex-col gap-4">
              {content.faq.items.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ink py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-white/20 mb-6">
            <div>
              <img
                src="/visuals/logo.png"
                alt="NxinMall"
                className="h-9 w-auto mb-2"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <p className="text-white/70 text-sm">{content.footer.tagline}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <Link href="#solicitud" className="text-white/80 text-sm hover:text-white transition-colors">
                {content.footer.cta}
              </Link>
              <a href="mailto:peru@nxinmall.com" className="text-white/80 text-sm hover:text-white transition-colors">
                peru@nxinmall.com
              </a>
            </div>
          </div>
          <p className="text-center text-white/60 text-xs">&copy; 2026 NxinMall. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
