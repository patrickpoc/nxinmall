'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { ADMIN_COPY, ADMIN_LANG_OPTIONS, type AdminLang } from '@/data/admin-content';

const STORAGE_KEY = 'nxin-admin-lang';

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<AdminLang>('en');
  const [langOpen, setLangOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as AdminLang | null;
    if (stored && ['es', 'en', 'pt'].includes(stored)) setLang(stored);
    else localStorage.setItem(STORAGE_KEY, 'en');
  }, []);

  const t = ADMIN_COPY[lang].login;

  function handleLangChange(l: AdminLang) {
    setLang(l);
    localStorage.setItem(STORAGE_KEY, l);
    setLangOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(t.errorAuth);
      setLoading(false);
      return;
    }
    router.push('/admin/leads');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 relative">
      {/* Language selector – same style as main page, all languages always visible */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangOpen((prev) => !prev)}
            className="text-brand-900 hover:text-brand-700 hover:bg-brand-50 rounded-full p-2 transition-all flex items-center justify-center"
            aria-label="Change language"
            aria-expanded={langOpen}
          >
            <Globe className="w-5 h-5" />
          </button>
          {langOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-brand-100 bg-white shadow-lg text-sm overflow-hidden z-10 animate-fade-in">
              {ADMIN_LANG_OPTIONS.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => handleLangChange(option.code)}
                  className={`block w-full text-left px-4 py-2 ${
                    option.code === lang ? 'bg-brand-50 text-brand-900 font-semibold' : 'hover:bg-brand-50 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <Link href="/">
              <img src="/visuals/logo.png" alt="NxinMall" className="h-9 w-auto mb-5" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">{t.title}</h1>
            <p className="text-xs text-gray-400 mt-1">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5">
                {t.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 focus:bg-white transition-all"
                placeholder={t.placeholderEmail}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-600 mb-1.5">
                {t.passwordLabel}
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 focus:bg-white transition-all"
                placeholder={t.placeholderPassword}
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-brand-900 text-white text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? t.submitting : t.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
