'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { AdminLang, ADMIN_COPY } from '@/data/admin-content';

const STORAGE_KEY = 'nxin-admin-lang';

const AdminLangContext = createContext<{
  lang: AdminLang;
  setLang: (l: AdminLang) => void;
  t: typeof ADMIN_COPY['es'];
}>({
  lang: 'es',
  setLang: () => {},
  t: ADMIN_COPY['es'],
});

export function AdminLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>('es');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as AdminLang | null;
    if (stored && ['es', 'en', 'pt'].includes(stored)) setLangState(stored);
  }, []);

  function setLang(l: AdminLang) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  return (
    <AdminLangContext.Provider value={{ lang, setLang, t: ADMIN_COPY[lang] }}>
      {children}
    </AdminLangContext.Provider>
  );
}

export function useAdminLang() {
  return useContext(AdminLangContext);
}
