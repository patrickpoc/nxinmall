'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, LogOut, Settings, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useAdminLang } from '@/lib/admin-lang-context';
import { ADMIN_LANG_OPTIONS, AdminLang } from '@/data/admin-content';
import clsx from 'clsx';

export default function AdminTopbar() {
  const { lang, setLang, t } = useAdminLang();
  const [langOpen, setLangOpen] = useState(false);
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
  }

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={clsx(
        'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
        pathname.startsWith(href)
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <Link href="/" className="shrink-0">
            <img src="/visuals/logo.png" alt="NxinMall" className="h-6 w-auto" />
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <nav className="flex items-center gap-1">
            {navLink('/admin/leads', t.nav.leads)}
            {navLink('/admin/onboardings', t.nav.onboardings)}
          </nav>
        </div>

        <div className="flex items-center gap-2">
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
              <div className="absolute right-0 mt-1.5 w-32 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-10">
                {ADMIN_LANG_OPTIONS.filter((o) => o.code !== lang).map((o) => (
                  <button
                    key={o.code}
                    type="button"
                    onClick={() => handleLang(o.code)}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mi cuenta */}
          <Link
            href="/admin/account"
            className={clsx(
              'flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
              pathname.startsWith('/admin/account')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            )}
            aria-label="Mi cuenta"
          >
            <UserCircle className="w-4 h-4" />
          </Link>

          {/* Gestores */}
          <Link
            href="/admin/settings"
            className={clsx(
              'flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
              pathname.startsWith('/admin/settings')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            )}
            aria-label="Gestores"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t.nav.logout}
          </button>
        </div>
      </div>
    </header>
  );
}
