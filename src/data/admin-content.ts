export type AdminLang = 'es' | 'en' | 'pt';

export const ADMIN_LANG_OPTIONS = [
  { code: 'es' as AdminLang, label: 'Español' },
  { code: 'en' as AdminLang, label: 'English' },
  { code: 'pt' as AdminLang, label: 'Português' },
];

export const ADMIN_COPY: Record<AdminLang, {
  nav: { leads: string; onboardings: string; logout: string };
  leads: {
    section: string; title: string;
    stats: { total: string; new: string; onboarding: string };
    search: string; all: string; empty: string; copied: string;
    waMessage: string;
    cols: { company: string; contact: string; country: string; status: string; date: string; actions: string };
    footer: string;
  };
  onboardings: {
    section: string; title: string;
    stats: { total: string; pending: string; approved: string };
    search: string; all: string; empty: string;
    cols: { company: string; contact: string; category: string; products: string; status: string; date: string; actions: string };
    footer: string;
  };
  leadStatuses: Record<string, string>;
  onboardingStatuses: Record<string, string>;
  countries: { all: string };
}> = {
  es: {
    nav: { leads: 'Leads', onboardings: 'Onboardings', logout: 'Salir' },
    leads: {
      section: 'Pipeline Admin', title: 'Leads',
      stats: { total: 'total', new: 'nuevos', onboarding: 'en onboarding' },
      search: 'Buscar empresa, nombre, email...',
      all: 'Todos', empty: 'Sin resultados para los filtros actuales.', copied: 'Copiado',
      waMessage: 'Hola {nombre}, te compartimos tu enlace de onboarding en NxinMall:',
      cols: { company: 'Empresa', contact: 'Contacto', country: 'País', status: 'Estado', date: 'Fecha', actions: 'Acciones' },
      footer: 'de',
    },
    onboardings: {
      section: 'Pipeline Admin', title: 'Onboardings',
      stats: { total: 'total', pending: 'pendientes KYB', approved: 'aprobados' },
      search: 'Buscar empresa, RUC, email...',
      all: 'Todos', empty: 'Sin resultados para los filtros actuales.',
      cols: { company: 'Empresa', contact: 'Contacto', category: 'Categoría', products: 'Productos', status: 'Estado', date: 'Fecha', actions: 'Acciones' },
      footer: 'de',
    },
    leadStatuses: { nuevo: 'nuevo', contactado: 'contactado', onboarding: 'onboarding', descartado: 'descartado' },
    onboardingStatuses: { kyb_pendiente: 'KYB Pendiente', en_revision: 'En revisión', aprobado: 'Aprobado', rechazado: 'Rechazado' },
    countries: { all: 'Todos' },
  },
  en: {
    nav: { leads: 'Leads', onboardings: 'Onboardings', logout: 'Sign out' },
    leads: {
      section: 'Admin Pipeline', title: 'Leads',
      stats: { total: 'total', new: 'new', onboarding: 'in onboarding' },
      search: 'Search company, name, email...',
      all: 'All', empty: 'No results for the current filters.', copied: 'Copied',
      waMessage: 'Hi {nombre}, here is your onboarding link for NxinMall:',
      cols: { company: 'Company', contact: 'Contact', country: 'Country', status: 'Status', date: 'Date', actions: 'Actions' },
      footer: 'of',
    },
    onboardings: {
      section: 'Admin Pipeline', title: 'Onboardings',
      stats: { total: 'total', pending: 'KYB pending', approved: 'approved' },
      search: 'Search company, RUC, email...',
      all: 'All', empty: 'No results for the current filters.',
      cols: { company: 'Company', contact: 'Contact', category: 'Category', products: 'Products', status: 'Status', date: 'Date', actions: 'Actions' },
      footer: 'of',
    },
    leadStatuses: { nuevo: 'new', contactado: 'contacted', onboarding: 'onboarding', descartado: 'discarded' },
    onboardingStatuses: { kyb_pendiente: 'KYB Pending', en_revision: 'Under review', aprobado: 'Approved', rechazado: 'Rejected' },
    countries: { all: 'All' },
  },
  pt: {
    nav: { leads: 'Leads', onboardings: 'Onboardings', logout: 'Sair' },
    leads: {
      section: 'Pipeline Admin', title: 'Leads',
      stats: { total: 'total', new: 'novos', onboarding: 'em onboarding' },
      search: 'Buscar empresa, nome, email...',
      all: 'Todos', empty: 'Sem resultados para os filtros atuais.', copied: 'Copiado',
      waMessage: 'Olá {nombre}, compartilhamos seu link de onboarding na NxinMall:',
      cols: { company: 'Empresa', contact: 'Contato', country: 'País', status: 'Status', date: 'Data', actions: 'Ações' },
      footer: 'de',
    },
    onboardings: {
      section: 'Pipeline Admin', title: 'Onboardings',
      stats: { total: 'total', pending: 'KYB pendentes', approved: 'aprovados' },
      search: 'Buscar empresa, RUC, email...',
      all: 'Todos', empty: 'Sem resultados para os filtros atuais.',
      cols: { company: 'Empresa', contact: 'Contato', category: 'Categoria', products: 'Produtos', status: 'Status', date: 'Data', actions: 'Ações' },
      footer: 'de',
    },
    leadStatuses: { nuevo: 'novo', contactado: 'contactado', onboarding: 'onboarding', descartado: 'descartado' },
    onboardingStatuses: { kyb_pendiente: 'KYB Pendente', en_revision: 'Em revisão', aprobado: 'Aprovado', rechazado: 'Rejeitado' },
    countries: { all: 'Todos' },
  },
};
