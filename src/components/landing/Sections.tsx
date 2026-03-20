'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GradientIcon } from './LandingComponents';
import { ICON_NODES } from '@/data/landing-content';

const SLIDER_INTERVAL_MS = 5000;
const DEFAULT_HERO_IMAGE = '/visuals/hero_nxinmall.jpg';

interface SectionProps {
  content: any;
  scrollToId?: (id: string) => (event: React.MouseEvent<HTMLElement>) => void;
}

export function Hero({ content, scrollToId }: SectionProps) {
  const items = Array.isArray(content?.hero_images?.items) ? content.hero_images.items : [];
  const images: string[] = items
    .filter((it: { url?: string; enabled?: boolean }) => it?.enabled !== false && typeof it?.url === 'string' && (it.url as string).trim())
    .map((it: { url: string }) => it.url);
  const displayImages = images.length > 0 ? images : [DEFAULT_HERO_IMAGE, DEFAULT_HERO_IMAGE, DEFAULT_HERO_IMAGE];
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index % Math.max(1, displayImages.length));
  }, [displayImages.length]);

  useEffect(() => {
    if (displayImages.length < 2) return;
    const t = setInterval(() => setActiveIndex((i) => (i + 1) % displayImages.length), SLIDER_INTERVAL_MS);
    return () => clearInterval(t);
  }, [displayImages.length]);

  return (
    <section className="pt-28 bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_55%,#f3f7ff_100%)]" id="home">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto reveal" data-animate="fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-700 font-semibold mb-4">
            {content.hero.badge}
          </p>
          <h1 className="text-[2.6rem] sm:text-[4rem] font-black text-ink leading-[1.05] mb-4 font-display">
            {content.hero.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">{content.hero.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a
              href="#request"
              onClick={scrollToId?.('request')}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-900 text-white font-black text-[16px] hover:bg-brand-900/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-brand-900/20"
            >
              {content.hero.cta} <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </a>
          </div>
        </div>
      </div>
      {displayImages.length > 0 && (
        <div className="relative mt-10">
          <div className="relative mx-auto max-w-6xl px-6">
            <div
              className="relative overflow-hidden rounded-[28px] bg-white aspect-[16/7] reveal-zoom"
              data-animate="soft-zoom"
            >
              {displayImages.length === 1 ? (
                <>
                  <img
                    src={displayImages[0]}
                    alt="NxinMall Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,99,214,0.18),transparent_55%)]" />
                </>
              ) : (
                <>
                  {displayImages.map((src, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                      style={{ opacity: i === activeIndex ? 1 : 0 }}
                      aria-hidden={i !== activeIndex}
                    >
                      <img
                        src={src}
                        alt={`NxinMall Banner ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,99,214,0.18),transparent_55%)]" />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {displayImages.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        className={i === activeIndex ? 'w-2.5 h-2.5 rounded-full bg-white shadow' : 'w-2 h-2 rounded-full bg-white/60 hover:bg-white/80'}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function Benefits({ content }: SectionProps) {
  return (
    <section className="py-20 bg-brand-50" id="benefits">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 reveal" data-animate="fade-up">
          <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05]">
            {content.benefitsTitle}
          </h2>
          {content.benefitsSubtitle && (
            <p className="text-gray-600 mt-2 text-lg">{content.benefitsSubtitle}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.benefits.map((benefit: { pillar: string; title: string; desc: string }, index: number) => {
            const iconNode = ICON_NODES[index];
            return (
              <div
                key={benefit.pillar}
                className="p-6 rounded-2xl bg-white border border-brand-100 reveal"
                data-animate="fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-3">
                  <GradientIcon node={iconNode} id={`benefit-grad-${index}`} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">{benefit.pillar}</p>
                <h3 className="font-semibold text-lg text-ink mb-2">{benefit.title}</h3>
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
  const steps = content.process.steps as { youDo: string; weDo: string }[];
  return (
    <section className="py-12 bg-white" id="process">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gray-50/80 rounded-[40px] border border-gray-100 p-8 sm:p-16">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal" data-animate="fade-up">
            <h2 className="text-[2.25rem] font-black text-ink font-display leading-[1.05]">
              {content.process.title}
            </h2>
            <p className="text-gray-600 mt-4 text-lg">{content.process.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm reveal"
                data-animate="fade-up"
                style={{ animationDelay: `${index * 180}ms` }}
              >
                <div className="flex flex-col gap-4">
                  <span className="w-10 h-10 rounded-full bg-brand-900 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-ink text-lg mb-1">{step.youDo}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.weDo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {content.process.averageTime && (
            <p className="text-center text-sm text-gray-500 mt-8 reveal" data-animate="fade-up">
              {content.process.averageTime}
            </p>
          )}
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
