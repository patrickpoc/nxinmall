'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Globe } from 'lucide-react';
import { COPY, LANG_OPTIONS, Lang } from '@/data/landing-content';
import { useScrollReveal, useActiveSection } from '@/lib/hooks';
import { Hero, Benefits, Logistics, Process, Buyers } from '@/components/landing/Sections';
import { ContactForm, FaqSection } from '@/components/landing/ContactAndFaq';

function HomeContent() {
  const searchParams = useSearchParams();
  const langParam = (searchParams.get('lang') || '') as Lang;
  const initialLang: Lang = ['es', 'en', 'pt'].includes(langParam) ? langParam : 'es';
  
  const [lang, setLang] = useState<Lang>(initialLang);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const sectionIds = useMemo(() => ['inicio', 'beneficios', 'proceso', 'faq'], []);
  const activeSection = useActiveSection(sectionIds);
  const content = COPY[lang];

  // Initialize language from local storage if not in URL
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

  // Handle header scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Initialize animations
  useScrollReveal([lang]);

  const scrollToId = (id: string) => (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) setSubmitted(true);
  };

  return (
    <div className="min-h-screen text-ink bg-white landing">
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center">
          <div className="flex-1">
            <img src="/visuals/logo.png" alt="NxinMall" className="h-10 w-auto" />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-[16px] font-bold text-gray-600 justify-center">
            <a
              href="#beneficios"
              onClick={scrollToId('beneficios')}
              className={`transition-colors ${
                activeSection === 'beneficios' ? 'text-brand-900' : 'hover:text-brand-900'
              }`}
            >
              {content.nav.suppliers}
            </a>
            <a
              href="#proceso"
              onClick={scrollToId('proceso')}
              className={`transition-colors ${activeSection === 'proceso' ? 'text-brand-900' : 'hover:text-brand-900'}`}
            >
              {content.nav.process}
            </a>
            <a
              href="#faq"
              onClick={scrollToId('faq')}
              className={`transition-colors ${activeSection === 'faq' ? 'text-brand-900' : 'hover:text-brand-900'}`}
            >
              {content.nav.faq}
            </a>
          </nav>
          <div className="flex-1 flex items-center justify-end gap-3">
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
            <a
              href="#solicitud"
              onClick={scrollToId('solicitud')}
              className="whitespace-nowrap px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border-2 border-brand-900 text-brand-900 text-[13px] sm:text-[15px] font-black hover:bg-brand-900 hover:text-white transition-all duration-300"
            >
              {content.nav.cta}
            </a>
          </div>
        </div>
        {!scrolled && <div className="h-px w-full bg-transparent" />}
      </header>

      <main>
        <Hero content={content} scrollToId={scrollToId} />
        <Benefits content={content} />
        <Logistics content={content} />
        <Process content={content} />
        <Buyers content={content} />
        <ContactForm content={content} handleSubmit={handleSubmit} submitted={submitted} />
        <FaqSection content={content} />
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

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
