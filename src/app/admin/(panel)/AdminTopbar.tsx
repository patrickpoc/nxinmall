'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, LogOut, Settings, UserCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useAdminLang } from '@/lib/admin-lang-context';
import { ADMIN_LANG_OPTIONS, AdminLang } from '@/data/admin-content';
import clsx from 'clsx';

export default function AdminTopbar() {
  const { lang, setLang, t } = useAdminLang();
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  function handleLang(code: AdminLang) {
    setLang(code);
    setLangOpen(false);
    setMenuOpen(false);
  }

  function closeMenu() { setMenuOpen(false); }

  const navItemClass = (href: string) => clsx(
    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
    pathname.startsWith(href) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  );

  const iconBtnClass = (href: string) => clsx(
    'flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
    pathname.startsWith(href) ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Barra principal */}
      <div className="max-w-screen-xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img src="/visuals/logo.png" alt="NxinMall" className="h-6 w-auto" />
        </Link>

        {/* Nav desktop */}
        <div className="hidden sm:flex items-center gap-5 flex-1">
          <div className="h-4 w-px bg-gray-200" />
          <nav className="flex items-center gap-1">
            <Link href="/admin/leads" className={navItemClass('/admin/leads')}>{t.nav.leads}</Link>
            <Link href="/admin/onboardings" className={navItemClass('/admin/onboardings')}>{t.nav.onboardings}</Link>
          </nav>
        </div>

        {/* Acciones desktop */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Globe */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((p) => !p)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              aria-label="Change language"
            >
              <Globe className="w-4 h-4" />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-40 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-10 animate-fade-in">
                {ADMIN_LANG_OPTIONS.map((o) => (
                  <button
                    key={o.code}
                    type="button"
                    onClick={() => handleLang(o.code)}
                    className={clsx(
                      'w-full px-3 py-2 text-xs font-medium transition-colors',
                      lang === o.code
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link href="/admin/account" className={iconBtnClass('/admin/account')} aria-label="Mi cuenta">
            <UserCircle className="w-4 h-4" />
          </Link>
          <Link href="/admin/settings" className={iconBtnClass('/admin/settings')} aria-label="Gestores">
            <Settings className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t.nav.logout}
          </button>
        </div>

        {/* Hamburguesa mobile */}
        <button
          type="button"
          onClick={() => { setMenuOpen((p) => !p); setLangOpen(false); }}
          className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Menú"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menú mobile desplegable */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {/* Nav */}
          <Link href="/admin/leads" onClick={closeMenu} className={clsx(navItemClass('/admin/leads'), 'block py-2.5')}>
            {t.nav.leads}
          </Link>
          <Link href="/admin/onboardings" onClick={closeMenu} className={clsx(navItemClass('/admin/onboardings'), 'block py-2.5')}>
            {t.nav.onboardings}
          </Link>

          <div className="my-1 border-t border-gray-100" />

          {/* Cuenta y gestores */}
          <Link href="/admin/account" onClick={closeMenu} className={clsx(navItemClass('/admin/account'), 'flex items-center gap-2 py-2.5')}>
            <UserCircle className="w-4 h-4" /> Mi cuenta
          </Link>
          <Link href="/admin/settings" onClick={closeMenu} className={clsx(navItemClass('/admin/settings'), 'flex items-center gap-2 py-2.5')}>
            <Settings className="w-4 h-4" /> {t.settings.title}
          </Link>

          <div className="my-1 border-t border-gray-100" />

          {/* Idioma */}
          <div className="flex items-center gap-2 px-3 py-2">
            <Globe className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="flex gap-2">
              {ADMIN_LANG_OPTIONS.map((o) => (
                <button
                  key={o.code}
                  type="button"
                  onClick={() => handleLang(o.code)}
                  className={clsx(
                    'text-xs font-semibold px-2 py-1 rounded-md transition-colors',
                    lang === o.code ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button type="button" onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            {t.nav.logout}
          </button>
        </div>
      )}
    </header>
  );
}
