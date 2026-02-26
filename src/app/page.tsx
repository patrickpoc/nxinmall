'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BadgeCheck, ClipboardCheck, Globe2, LineChart, ShieldCheck } from 'lucide-react';

const BENEFITS = [
  {
    icon: Globe2,
    title: 'Acceso internacional validado',
    desc: 'Conecta con compradores globales con procesos de compliance y trazabilidad desde el primer contacto.',
  },
  {
    icon: ShieldCheck,
    title: 'Operación segura y documentada',
    desc: 'Contratos, documentos y pagos bajo un flujo KYB que prioriza seguridad y claridad comercial.',
  },
  {
    icon: LineChart,
    title: 'Datos para negociar mejor',
    desc: 'Tendencias y visibilidad de demanda para que cotices con más confianza.',
  },
];

const PROCESS = [
  {
    icon: ClipboardCheck,
    title: 'Solicitud de acceso',
    desc: 'Completa el formulario con la información de tu empresa y productos.',
  },
  {
    icon: ShieldCheck,
    title: 'Validación ejecutiva',
    desc: 'Nuestro equipo revisa tu operación, certificados y capacidad exportadora.',
  },
  {
    icon: BadgeCheck,
    title: 'Onboarding con enlace único',
    desc: 'Te enviamos un link personalizado para activar tu tienda B2B.',
  },
];

const FAQS = [
  {
    q: '¿Por qué no hay onboarding directo?',
    a: 'El acceso es por invitación para garantizar la calidad de la oferta y cumplir con requisitos comerciales y regulatorios.',
  },
  {
    q: '¿Cuánto demora la validación?',
    a: 'El equipo responde en menos de 48 horas hábiles con el estado de tu solicitud.',
  },
  {
    q: '¿Qué información debo tener a la mano?',
    a: 'RUC o equivalente, líneas de producto, capacidad mensual, certificaciones y contacto comercial.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-brand-100 rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-semibold text-brand-900"
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
      `Cargo: ${data.cargo || ''}`,
      `Email: ${data.email || ''}`,
      `WhatsApp: ${data.whatsapp || ''}`,
      `País: ${data.pais || ''}`,
      `Categoría principal: ${data.categoria || ''}`,
      `Capacidad mensual: ${data.capacidad || ''}`,
      `Mensaje: ${data.mensaje || ''}`,
    ].join('\n');

    const mailto = `mailto:peru@nxinmall.com?subject=${encodeURIComponent(
      'Solicitud de acceso NxinMall',
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    form.reset();
  };

  return (
    <div className="min-h-screen text-ink">
      <header className="fixed top-0 left-0 right-0 bg-brand-50/90 backdrop-blur border-b border-brand-100 z-50 py-3">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="text-lg font-semibold text-ink">
            Nxin<span className="text-brand-900">Mall</span>
          </div>
          <Link
            href="#solicitud"
            className="px-4 py-2 rounded-full bg-brand-900 text-white text-sm font-semibold hover:bg-brand-900/90 transition-colors"
          >
            Solicitar acceso
          </Link>
        </div>
      </header>

      <main>
        <section className="pt-28 pb-14" id="inicio">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div className="animate-float-up">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-brand-700 rounded-full text-xs font-semibold border border-brand-100 mb-4">
                Acceso por invitación · Exportadores B2B
              </span>
              <h1 className="text-4xl sm:text-5xl font-semibold text-ink leading-tight mb-4 font-display">
                Tu canal directo a compradores internacionales.
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Primero recibimos tu solicitud y validamos tu operación. Luego un ejecutivo te envía un enlace único de
                onboarding.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#solicitud"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-900 text-white font-semibold text-sm hover:bg-brand-900/90 transition-colors"
                >
                  Iniciar solicitud <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#proceso"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-100 text-ink font-semibold text-sm hover:bg-white/70 transition-colors"
                >
                  Ver proceso
                </Link>
              </div>
            </div>

            <div className="animate-fade-up">
              <div className="bg-white rounded-3xl border border-brand-100 p-6 shadow-[0_24px_60px_-40px_rgba(15,63,56,0.6)]">
                <p className="text-xs font-semibold text-brand-700 mb-4">Ruta de activación</p>
                <div className="flex flex-col gap-4">
                  {PROCESS.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700">
                        <Icon className="w-4.5 h-4.5" strokeWidth={1.6} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-ink">{title}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-brand-50 border border-brand-100 px-4 py-3 text-xs text-brand-700">
                  El onboarding no está habilitado de forma pública.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white" id="proceso">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-semibold text-ink font-display">Qué gana tu operación</h2>
              <p className="text-gray-500 mt-3">
                Diseñado para exportadores agrícolas que necesitan velocidad, compliance y acceso a demanda real.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 rounded-2xl bg-brand-50 border border-brand-100">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-brand-100 flex items-center justify-center text-brand-700 mb-3">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-base text-ink mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16" id="solicitud">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
            <div>
              <p className="text-sm font-semibold text-brand-700 mb-3">Solicitud de acceso</p>
              <h2 className="text-3xl font-semibold text-ink font-display mb-3">
                Primero conocemos tu operación. Luego te habilitamos.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Completa este formulario y un ejecutivo te contactará para validar requisitos y enviarte un enlace de
                onboarding personalizado.
              </p>
              <div className="space-y-3">
                {[
                  'RUC o identificación tributaria vigente',
                  'Certificaciones fitosanitarias o de calidad',
                  'Volumen mensual de exportación',
                  'Contacto comercial con WhatsApp',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-brand-700" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl border border-brand-100 p-7 shadow-[0_24px_60px_-40px_rgba(15,63,56,0.6)]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500">Nombre completo</label>
                  <input
                    name="nombre"
                    required
                    className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                    placeholder="María Pérez"
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
                  <label className="text-xs font-semibold text-gray-500">Cargo</label>
                  <input
                    name="cargo"
                    className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                    placeholder="Gerente Comercial"
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
                  <label className="text-xs font-semibold text-gray-500">País</label>
                  <input
                    name="pais"
                    required
                    className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                    placeholder="Perú"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Categoría principal</label>
                  <input
                    name="categoria"
                    className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                    placeholder="Uvas, arándanos, espárragos"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Capacidad mensual</label>
                  <input
                    name="capacidad"
                    className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                    placeholder="120 toneladas"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-xs font-semibold text-gray-500">Mensaje</label>
                <textarea
                  name="mensaje"
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-sm"
                  placeholder="Certificaciones, experiencia exportadora o destinos actuales."
                />
              </div>
              <button
                type="submit"
                className="mt-5 w-full rounded-full bg-brand-900 text-white py-3 text-sm font-semibold hover:bg-brand-900/90 transition-colors"
              >
                Enviar solicitud
              </button>
              <p className="text-xs text-center text-gray-400 mt-3">
                Un ejecutivo valida tu operación y te envía un link de onboarding personalizado.
              </p>
            </form>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-ink font-display mb-2">Preguntas frecuentes</h2>
              <p className="text-gray-500">Todo lo que debes saber antes de solicitar acceso.</p>
            </div>
            <div className="flex flex-col gap-4">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-900 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-7 border-b border-white/20 mb-7">
            <div>
              <div className="text-lg font-semibold text-white mb-1">
                Nxin<span className="text-brand-100">Mall</span>
              </div>
              <p className="text-white/70 text-sm">Plataforma global B2B para exportadores agrícolas.</p>
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
