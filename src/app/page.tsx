'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Globe, Shield, FileText, Truck, ChevronDown, ChevronUp } from 'lucide-react';

const BENEFITS = [
  {
    icon: Globe,
    title: 'Acceso a nuevos mercados',
    desc: 'Tendrás oportunidades para que tus productos lleguen a nuevos destinos internacionales.',
  },
  {
    icon: Shield,
    title: 'Transacciones seguras',
    desc: 'Olvídate de las preocupaciones por los pagos. Operamos con verificación KYB y trazabilidad.',
  },
  {
    icon: FileText,
    title: 'Documentos y pagos en línea',
    desc: 'Revisa el estado de los pagos y sube o descarga documentos en cualquier momento.',
  },
  {
    icon: Truck,
    title: 'Seguimiento de carga',
    desc: 'Coordina la logística con COSCO o tu proveedor y haz seguimiento del envío.',
  },
];

const FAQS = [
  {
    q: '¿NxinMall tiene costo adicional?',
    a: 'Las tarifas se muestran automáticamente según el método de pago seleccionado. El onboarding es gratuito.',
  },
  {
    q: '¿Cómo obtengo acceso?',
    a: 'Completa el formulario de onboarding y nuestro equipo configurará tu tienda en la plataforma en menos de 24 horas.',
  },
  {
    q: '¿Qué monedas manejan?',
    a: 'Precios en USD y liquidación en USD o moneda local según el acuerdo comercial.',
  },
  {
    q: '¿Quién coordina la logística?',
    a: 'Puede ser COSCO o el proveedor logístico del vendedor según el acuerdo establecido.',
  },
  {
    q: '¿Necesito experiencia previa en exportación?',
    a: 'No es indispensable. Nuestro equipo te guía en cada etapa del proceso desde el KYB hasta tu primera venta.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-brand-50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 text-left text-sm font-semibold text-brand-900"
      >
        <span>{q}</span>
        {open ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-ink leading-relaxed">{a}</div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-brand-50 border-b border-gray-200 z-50 py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl font-bold text-ink">
            Nxin<span className="text-brand-900">Mall</span>
          </div>
          <Link
            href="/onboarding"
            className="px-5 py-2 rounded-full bg-brand-900 text-white text-sm font-semibold hover:bg-brand-900/90 transition-colors"
          >
            Solicitar demo
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-36 pb-24 bg-brand-50" id="inicio">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            {/* Left */}
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-100 text-brand-900 rounded-full text-xs font-medium mb-5">
                Exportadores B2B
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-brand-700 leading-tight mb-5">
                ¿Eres exportador agrícola?
              </h1>
              <p className="text-lg text-ink mb-3 leading-relaxed">
                NxinMall es una plataforma global B2B para exportadores agrícolas. Operamos hoy en Brasil y Perú con alcance internacional.
              </p>
              <p className="text-base text-gray-500 mb-8 leading-relaxed">
                Intermediario neutral que conecta compradores y proveedores internacionales mediante servicios digitales.
              </p>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-900 text-white font-semibold text-base hover:bg-brand-900/90 transition-colors shadow-sm"
              >
                Activar mi tienda →
              </Link>
            </div>

            {/* Right — quick info card */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm max-w-md ml-auto animate-fade-up">
                <p className="text-xs font-medium text-brand-900 mb-2">Solicita onboarding</p>
                <h3 className="text-xl font-semibold text-ink mb-5">Acceso para exportadores</h3>

                <div className="flex flex-col gap-2.5 mb-6">
                  {[
                    { emoji: '🍇', label: 'Frutas y verduras de exportación' },
                    { emoji: '🌹', label: 'Flores premium' },
                    { emoji: '🌱', label: 'Viveros y ornamentales' },
                    { emoji: '📦', label: 'Materiales de empaque' },
                    { emoji: '🧴', label: 'Plásticos agrícolas' },
                    { emoji: '🌾', label: 'Insumos agroquímicos' },
                  ].map(({ emoji, label }) => (
                    <div key={label} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <span>{emoji}</span>
                      {label}
                    </div>
                  ))}
                </div>

                <Link
                  href="/onboarding"
                  className="block w-full py-3 rounded-full bg-brand-900 text-white font-semibold text-sm text-center hover:bg-brand-900/90 transition-colors"
                >
                  Comenzar onboarding gratuito
                </Link>
                <p className="text-xs text-center text-gray-400 mt-3">
                  Tu tienda configurada en menos de 24 horas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24 bg-brand-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-3xl font-bold text-ink">Por qué con NxinMall</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 rounded-2xl bg-white border border-gray-200">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-gray-200 flex items-center justify-center text-brand-900 mb-3">
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-base text-ink mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-ink">Plataforma</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="flex justify-center">
                <div className="w-full max-w-md p-6 rounded-2xl bg-brand-50 border border-gray-200">
                  <div className="inline-block px-3 py-1.5 rounded-full bg-white text-brand-900 font-semibold text-sm mb-4 border border-gray-200">
                    Dashboard B2B
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-200 mb-3" />
                  <div className="h-2.5 rounded-full bg-gray-200 mb-5 w-3/4" />
                  {[['RFQ activos', '12'], ['Órdenes en proceso', '5'], ['Documentos', 'OK']].map(([label, val]) => (
                    <div key={label} className="flex justify-between font-semibold text-brand-900 py-2.5 border-b border-gray-200 last:border-0 text-sm">
                      <span>{label}</span>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-500 mb-4 leading-relaxed">
                  Como exportador, tendrás acceso a una cuenta empresarial para gestionar tus productos, RFQs y operaciones de manera simple y transparente.
                </p>
                <h3 className="text-xl font-semibold text-ink mb-3 leading-snug">
                  Acceso a mercados, trazabilidad en vivo, información comercial y productos financieros.
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Incluye contratos, firma electrónica y gestión de roles internos.
                </p>
                <h4 className="text-sm font-semibold text-brand-900 mb-1">Guía de uso</h4>
                <p className="text-sm text-gray-500">
                  Onboarding guiado por nuestro equipo para activar tu cuenta y tu primer flujo de venta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">
                ¿Te gustaría exportar con NxinMall? ¡Contáctanos!
              </h2>
              <p className="text-gray-500 mb-6">
                Agenda una llamada corta para validar tu operación y activar tu cuenta B2B.
              </p>
              <Link
                href="/onboarding"
                className="inline-flex px-8 py-3.5 rounded-full bg-brand-900 text-white font-semibold text-sm hover:bg-brand-900/90 transition-colors"
              >
                Solicitar onboarding
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-ink mb-2">Preguntas frecuentes</h2>
              <p className="text-gray-500">Resuelve tus dudas sobre NxinMall Exportadores</p>
            </div>
            <div className="flex flex-col gap-4">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-900 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-white/20 mb-8">
            <div>
              <div className="text-xl font-bold text-white mb-1">
                Nxin<span className="text-brand-100">Mall</span>
              </div>
              <p className="text-white/70 text-sm">Plataforma global de transacciones B2B agrícolas</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <Link href="/onboarding" className="text-white/80 text-sm hover:text-white transition-colors">
                Solicitar demo
              </Link>
              <a href="mailto:peru@nxinmall.com" className="text-white/80 text-sm hover:text-white transition-colors">
                peru@nxinmall.com
              </a>
            </div>
          </div>
          <p className="text-center text-white/60 text-xs">
            &copy; 2026 NxinMall. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
