'use client';

import { ArrowUpRight } from 'lucide-react';
import { GradientIcon } from './LandingComponents';
import { ICON_NODES } from '@/data/landing-content';

interface SectionProps {
  content: any;
  scrollToId?: (id: string) => (event: React.MouseEvent<HTMLElement>) => void;
}

export function Hero({ content, scrollToId }: SectionProps) {
  return (
    <section className="pt-28 bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_55%,#f3f7ff_100%)]" id="inicio">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto reveal" data-animate="fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-700 font-semibold mb-4">
            {content.hero.badge}
          </p>
          <h1 className="text-[2.6rem] sm:text-[4rem] font-black text-ink leading-[1.05] mb-4 font-display">
            {content.hero.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">{content.hero.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#solicitud"
              onClick={scrollToId?.('solicitud')}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-900 text-white font-semibold text-[16px] hover:bg-brand-900/90 transition-colors"
            >
              {content.hero.primary} <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="#beneficios"
              onClick={scrollToId?.('beneficios')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-100 text-ink font-semibold text-[16px] hover:bg-white/70 transition-colors"
            >
              {content.hero.secondary}
            </a>
          </div>
        </div>
      </div>
      <div className="relative mt-10">
        <div className="relative mx-auto max-w-6xl px-6">
          <div
            className="relative overflow-hidden rounded-[28px] bg-white aspect-[16/7] reveal-zoom"
            data-animate="soft-zoom"
          >
            <img src="/visuals/hero_nxinmall.jpg" alt="NxinMall Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,99,214,0.18),transparent_55%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Benefits({ content }: SectionProps) {
  return (
    <section className="py-20 bg-brand-50" id="beneficios">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 reveal" data-animate="fade-up">
          <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05]">
            {content.benefitsTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.benefits.map((benefit: any, index: number) => {
            const iconNode = ICON_NODES[index];
            return (
              <div
                key={benefit.title}
                className="p-5 rounded-2xl bg-white border border-brand-100 reveal"
                data-animate="fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-3">
                  <GradientIcon node={iconNode} id={`benefit-grad-${index}`} />
                </div>
                <h3 className="font-medium text-base text-ink mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Logistics({ content }: SectionProps) {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
        <div className="reveal" data-animate="fade-up">
          <p className="text-sm font-semibold text-brand-700 mb-3">{content.logistics.kicker}</p>
          <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05] mb-3">
            {content.logistics.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">{content.logistics.body}</p>
        </div>
        <div className="reveal" data-animate="fade-up">
          <div
            className="rounded-[26px] overflow-hidden bg-white shadow-[0_24px_60px_-40px_rgba(10,99,214,0.35)] reveal-zoom"
            data-animate="soft-zoom"
          >
            <img src="/visuals/control.png" alt="Control sobre cada etapa" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Process({ content }: SectionProps) {
  return (
    <section className="py-12 bg-white" id="proceso">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gray-50/80 rounded-[40px] border border-gray-100 p-8 sm:p-16">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal" data-animate="fade-up">
            <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05]">
              {content.process.title}
            </h2>
            <p className="text-gray-600 mt-4 text-lg">{content.process.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.process.steps.map((step: any, index: number) => (
              <div
                key={step.title}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm reveal"
                data-animate="fade-up"
                style={{ animationDelay: `${index * 180}ms` }}
              >
                <div className="flex flex-col gap-4">
                  <span className="w-10 h-10 rounded-full bg-brand-900 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-ink text-lg mb-1">{step.title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Buyers({ content }: SectionProps) {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
        <div className="order-2 lg:order-1 reveal" data-animate="fade-up">
          <div
            className="rounded-[26px] overflow-hidden bg-white shadow-[0_24px_60px_-40px_rgba(10,99,214,0.35)] reveal-zoom"
            data-animate="soft-zoom"
          >
            <img src="/visuals/buyers.png" alt="Catalogo y demanda activa" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="order-1 lg:order-2 reveal" data-animate="fade-up">
          <p className="text-sm font-semibold text-brand-700 mb-3">{content.buyers.kicker}</p>
          <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05] mb-3">
            {content.buyers.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">{content.buyers.body}</p>
        </div>
      </div>
    </section>
  );
}
