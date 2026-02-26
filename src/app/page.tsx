'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, FileCheck2, Globe2, ShieldCheck, Truck } from 'lucide-react';

const BENEFITS = [
  {
    icon: Globe2,
    title: 'Acceso a nuevos mercados',
    desc: 'Conecta con compradores internacionales que buscan oferta confiable y continua.',
  },
  {
    icon: ShieldCheck,
    title: 'Transacciones seguras',
    desc: 'Contratos claros, trazabilidad y soporte en cada etapa comercial.',
  },
  {
    icon: FileCheck2,
    title: 'Documentos y pagos en linea',
    desc: 'Gestiona documentos y estados de pago desde una sola plataforma.',
  },
  {
    icon: Truck,
    title: 'Seguimiento de carga',
    desc: 'Monitorea el avance logistico y mejora tu cumplimiento.',
  },
];

const STEPS = [
  {
    title: 'Envias tu solicitud',
    desc: 'Completa el formulario con tus datos comerciales.',
  },
  {
    title: 'Te contacta un ejecutivo',
    desc: 'Confirmamos capacidad, categorias y paises objetivo.',
  },
  {
    title: 'Recibes tu enlace',
    desc: 'Inicias el onboarding con un link unico para tu empresa.',
  },
];

const FAQS = [
  {
    q: 'Cuanto tarda la respuesta?',
    a: 'Nuestro equipo responde en 24 a 48 horas habiles.',
  },
  {
    q: 'Con que paises trabajan?',
    a: 'Peru, Brasil, Colombia y Ecuador. Evaluamos otros mercados.',
  },
  {
    q: 'Que productos aceptan?',
    a: 'Frutas, verduras, flores y agroindustria con volumen de exportacion.',
  },
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
    <div className="min-h-screen text-ink bg-brand-50">
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur border-b border-brand-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="text-lg font-semibold text-ink">
            Nxin<span className="text-brand-900">Mall</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="#beneficios" className="hover:text-brand-900 transition-colors">
              Soy proveedor
            </Link>
            <Link href="#proceso" className="hover:text-brand-900 transition-colors">
              Proceso
            </Link>
            <Link href="#faq" className="hover:text-brand-900 transition-colors">
              Preguntas
            </Link>
          </nav>
          <Link
            href="#solicitud"
            className="px-4 py-2 rounded-full bg-brand-900 text-white text-sm font-semibold hover:bg-brand-900/90 transition-colors"
          >
            Solicitar acceso
          </Link>
        </div>
      </header>

      <main>
        <section className="pt-24" id="inicio">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-700 font-semibold mb-4">
                Proveedores exportadores
              </p>
              <h1 className="text-4xl sm:text-5xl font-medium text-ink leading-tight mb-4 font-display">
                Tu produccion lista para compradores internacionales.
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                NxinMall conecta oferta agricola con demanda global mediante un flujo comercial simple y acompanado.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="#solicitud"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-900 text-white font-semibold text-sm hover:bg-brand-900/90 transition-colors"
                >
                  Quiero ser proveedor <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#beneficios"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-100 text-ink font-semibold text-sm hover:bg-white/70 transition-colors"
                >
                  Ver beneficios
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <div className="mx-auto max-w-6xl px-6">
              <div className="relative overflow-hidden rounded-[28px] border border-brand-100 bg-gradient-to-br from-brand-100 via-white to-brand-50">
                <div className="aspect-[16/7] w-full" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(15,63,56,0.18),transparent_55%)]" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur rounded-2xl border border-brand-100 px-5 py-4 text-sm text-gray-600">
                  Operacion B2B con demanda real y soporte comercial.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14" id="beneficios">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-medium text-ink font-display">Por que con NxinMall</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 rounded-2xl bg-white border border-brand-100">
                  <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-3">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-medium text-base text-ink mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14" id="proceso">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-medium text-ink font-display">Un flujo simple para empezar</h2>
              <p className="text-gray-600 mt-3">
                Priorizamos velocidad y claridad comercial para que llegues a compradores internacionales sin friccion.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STEPS.map((step, index) => (
                <div key={step.title} className="bg-white rounded-2xl border border-brand-100 p-4">
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

        <section className="py-14" id="solicitud">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-sm font-semibold text-brand-700 mb-3">Solicitud de proveedor</p>
              <h2 className="text-3xl font-medium text-ink font-display mb-3">Hablemos de tu operacion.</h2>
              <p className="text-gray-600 leading-relaxed">
                Completa tus datos y un ejecutivo te contactara para activar el siguiente paso.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 bg-white rounded-3xl border border-brand-100 p-7 shadow-[0_24px_60px_-40px_rgba(15,63,56,0.6)]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500">Nombre completo</label>
                  <input
                    name="nombre"
                    required
                    className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                    placeholder="Maria Perez"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Empresa</label>
                  <input
                    name="empresa"
                    required
                    className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                    placeholder="Agroexportadora Andina"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                    placeholder="maria@empresa.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">WhatsApp</label>
                  <input
                    name="whatsapp"
                    required
                    className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                    placeholder="+51 999 000 000"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Pais</label>
                  <select
                    name="pais"
                    required
                    className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm bg-white"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecciona un pais
                    </option>
                    <option value="Peru">Peru</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Ecuador">Ecuador</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-xs font-semibold text-gray-500">Mensaje</label>
                <textarea
                  name="mensaje"
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                  placeholder="Categorias, volumen, certificaciones."
                />
              </div>
              <button
                type="submit"
                className="mt-5 w-full rounded-full bg-brand-900 text-white py-3 text-sm font-semibold hover:bg-brand-900/90 transition-colors"
              >
                Enviar solicitud
              </button>
            </form>
          </div>
        </section>

        <section className="py-14 bg-white" id="faq">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-medium text-ink font-display mb-2">Preguntas frecuentes</h2>
              <p className="text-gray-500">Todo lo que debes saber antes de postular.</p>
            </div>
            <div className="flex flex-col gap-4">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-900 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-white/20 mb-6">
            <div>
              <div className="text-lg font-semibold text-white mb-1">
                Nxin<span className="text-brand-100">Mall</span>
              </div>
              <p className="text-white/70 text-sm">Plataforma global B2B para exportadores.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <Link href="#solicitud" className="text-white/80 text-sm hover:text-white transition-colors">
                Solicitar acceso
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
