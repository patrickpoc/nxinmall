export type AdminLang = 'es' | 'en' | 'pt';

export const ADMIN_LANG_OPTIONS: { code: AdminLang; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

export const ADMIN_COPY: Record<AdminLang, {
  nav: { leads: string; onboardings: string; content: string; logout: string };
  content: {
    title: string;
    subtitle: string;
    save: string;
    saving: string;
    saved: string;
    errSave: string;
    blocks: Record<string, string>;
  };
  leads: {
    section: string; title: string;
    stats: { total: string; new: string; onboarding: string };
    search: string; all: string; empty: string; copied: string;
    waMessage: string;
    cols: { company: string; contact: string; country: string; category: string; status: string; date: string; actions: string };
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
  countries: { all: string; others: string };
  account: {
    title: string; nameLabel: string; namePlaceholder: string;
    passLabel: string; newPassPlaceholder: string; confirmPassPlaceholder: string;
    saveBtn: string; saving: string; changePassBtn: string;
    nameUpdated: string; passUpdated: string; errMinChars: string; errNoMatch: string;
  };
  settings: {
    title: string; usersLabel: string; userSingular: string; userPlural: string;
    noAccess: string; levelLabel: string; adminRole: string; advisorRole: string;
    newPassLabel: string; newPassHint: string; newPassPlaceholder: string;
    saveBtn: string; saving: string; updated: string; errSave: string; errMinChars: string;
    deleteBtn: string; deleteConfirm: string; deleting: string; errDelete: string;
    createLabel: string; namePlaceholder: string; emailPlaceholder: string;
    passPlaceholder: string; createBtn: string; creating: string; errCreate: string;
    created: string;
  };
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    placeholderEmail: string;
    placeholderPassword: string;
    errorAuth: string;
    submitting: string;
    submit: string;
  };
}> = {
  es: {
    nav: { leads: 'Leads', onboardings: 'Onboardings', content: 'Contenido', logout: 'Salir' },
    content: {
      title: 'Contenido del sitio',
      subtitle: 'Edita textos e imágenes de la landing por idioma. Los cambios se reflejan en vivo.',
      save: 'Guardar',
      saving: 'Guardando…',
      saved: 'Guardado',
      errSave: 'Error al guardar',
      blocks: {
        hero: 'Hero',
        nav: 'Navegación',
        benefits: 'Beneficios',
        logistics: 'Logística',
        process: 'Proceso',
        buyers: 'Compradores',
        form: 'Formulario',
        faq: 'Preguntas frecuentes',
        footer: 'Pie de página',
      },
    },
    leads: {
      section: 'Pipeline Admin', title: 'Leads',
      stats: { total: 'total', new: 'nuevos', onboarding: 'en onboarding' },
      search: 'Buscar empresa, nombre, email...',
      all: 'Todos', empty: 'Sin resultados para los filtros actuales.', copied: 'Copiado',
      waMessage: 'Hola {nombre}, te compartimos tu enlace de onboarding en NxinMall:',
      cols: { company: 'Empresa', contact: 'Contacto', country: 'País', category: 'Categoría', status: 'Estado', date: 'Fecha', actions: 'Acciones' },
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
    leadStatuses: { nuevo: 'nuevo', contactado: 'contactado', onboarding: 'onboarding', completado: 'completado', descartado: 'descartado' },
    onboardingStatuses: { en_revision: 'En revisión', aprobado: 'Aprobado', rechazado: 'Rechazado' },
    countries: { all: 'Todos', others: 'Otros' },
    account: {
      title: 'Mi cuenta', nameLabel: 'Nombre para mostrar', namePlaceholder: 'Tu nombre',
      passLabel: 'Cambiar contraseña', newPassPlaceholder: 'Nueva contraseña (mín. 8 caracteres)', confirmPassPlaceholder: 'Confirmar contraseña',
      saveBtn: 'Guardar', saving: 'Guardando...', changePassBtn: 'Cambiar contraseña',
      nameUpdated: 'Nombre actualizado', passUpdated: 'Contraseña actualizada', errMinChars: 'Mínimo 8 caracteres', errNoMatch: 'Las contraseñas no coinciden',
    },
    settings: {
      title: 'Gestores', usersLabel: 'Usuarios', userSingular: 'usuario', userPlural: 'usuarios',
      noAccess: 'Sin acceso', levelLabel: 'Nivel', adminRole: 'Admin', advisorRole: 'Asesor',
      newPassLabel: 'Nueva contraseña', newPassHint: 'vacío = no cambiar', newPassPlaceholder: 'Nueva contraseña',
      saveBtn: 'Guardar', saving: 'Guardando...', updated: 'Usuario actualizado', errSave: 'Error al guardar', errMinChars: 'Mínimo 8 caracteres',
      deleteBtn: 'Eliminar', deleteConfirm: '¿Confirmar?', deleting: 'Eliminando...', errDelete: 'Error al eliminar',
      createLabel: 'Crear usuario', namePlaceholder: 'Nombre (opcional)', emailPlaceholder: 'Email *',
      passPlaceholder: 'Contraseña (mín. 8 caracteres) *', createBtn: 'Crear usuario', creating: 'Creando...', errCreate: 'Error al crear',
      created: 'Usuario {email} creado',
    },
    login: {
      title: 'Acceso admin',
      subtitle: 'Solo para el equipo NxinMall',
      emailLabel: 'Email',
      passwordLabel: 'Contraseña',
      placeholderEmail: 'ops@nxinmall.com',
      placeholderPassword: '••••••••',
      errorAuth: 'Email o contraseña incorrectos.',
      submitting: 'Ingresando...',
      submit: 'Ingresar',
    },
  },
  en: {
    nav: { leads: 'Leads', onboardings: 'Onboardings', content: 'Content', logout: 'Sign out' },
    content: {
      title: 'Site content',
      subtitle: 'Edit landing copy and images per language. Changes go live immediately.',
      save: 'Save',
      saving: 'Saving…',
      saved: 'Saved',
      errSave: 'Error saving',
      blocks: {
        hero: 'Hero',
        nav: 'Navigation',
        benefits: 'Benefits',
        logistics: 'Logistics',
        process: 'Process',
        buyers: 'Buyers',
        form: 'Form',
        faq: 'FAQ',
        footer: 'Footer',
      },
    },
    leads: {
      section: 'Admin Pipeline', title: 'Leads',
      stats: { total: 'total', new: 'new', onboarding: 'in onboarding' },
      search: 'Search company, name, email...',
      all: 'All', empty: 'No results for the current filters.', copied: 'Copied',
      waMessage: 'Hi {nombre}, here is your onboarding link for NxinMall:',
      cols: { company: 'Company', contact: 'Contact', country: 'Country', category: 'Category', status: 'Status', date: 'Date', actions: 'Actions' },
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
    leadStatuses: { nuevo: 'new', contactado: 'contacted', onboarding: 'onboarding', completado: 'completed', descartado: 'discarded' },
    onboardingStatuses: { en_revision: 'Under review', aprobado: 'Approved', rechazado: 'Rejected' },
    countries: { all: 'All', others: 'Others' },
    account: {
      title: 'My account', nameLabel: 'Display name', namePlaceholder: 'Your name',
      passLabel: 'Change password', newPassPlaceholder: 'New password (min. 8 characters)', confirmPassPlaceholder: 'Confirm password',
      saveBtn: 'Save', saving: 'Saving...', changePassBtn: 'Change password',
      nameUpdated: 'Name updated', passUpdated: 'Password updated', errMinChars: 'At least 8 characters', errNoMatch: 'Passwords do not match',
    },
    settings: {
      title: 'Team', usersLabel: 'Users', userSingular: 'user', userPlural: 'users',
      noAccess: 'No access', levelLabel: 'Role', adminRole: 'Admin', advisorRole: 'Advisor',
      newPassLabel: 'New password', newPassHint: 'leave blank to keep', newPassPlaceholder: 'New password',
      saveBtn: 'Save', saving: 'Saving...', updated: 'User updated', errSave: 'Error saving', errMinChars: 'At least 8 characters',
      deleteBtn: 'Delete', deleteConfirm: 'Confirm?', deleting: 'Deleting...', errDelete: 'Error deleting',
      createLabel: 'Create user', namePlaceholder: 'Name (optional)', emailPlaceholder: 'Email *',
      passPlaceholder: 'Password (min. 8 characters) *', createBtn: 'Create user', creating: 'Creating...', errCreate: 'Error creating',
      created: 'User {email} created',
    },
    login: {
      title: 'Admin Access',
      subtitle: 'NxinMall team only',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      placeholderEmail: 'ops@nxinmall.com',
      placeholderPassword: '••••••••',
      errorAuth: 'Invalid email or password.',
      submitting: 'Signing in...',
      submit: 'Sign in',
    },
  },
  pt: {
    nav: { leads: 'Leads', onboardings: 'Onboardings', content: 'Conteúdo', logout: 'Sair' },
    content: {
      title: 'Conteúdo do site',
      subtitle: 'Edite textos e imagens da landing por idioma. As alterações entram em vigor ao vivo.',
      save: 'Salvar',
      saving: 'Salvando…',
      saved: 'Salvo',
      errSave: 'Erro ao salvar',
      blocks: {
        hero: 'Hero',
        nav: 'Navegação',
        benefits: 'Benefícios',
        logistics: 'Logística',
        process: 'Processo',
        buyers: 'Compradores',
        form: 'Formulário',
        faq: 'Perguntas frequentes',
        footer: 'Rodapé',
      },
    },
    leads: {
      section: 'Pipeline Admin', title: 'Leads',
      stats: { total: 'total', new: 'novos', onboarding: 'em onboarding' },
      search: 'Buscar empresa, nome, email...',
      all: 'Todos', empty: 'Sem resultados para os filtros atuais.', copied: 'Copiado',
      waMessage: 'Olá {nombre}, compartilhamos seu link de onboarding na NxinMall:',
      cols: { company: 'Empresa', contact: 'Contato', country: 'País', category: 'Categoria', status: 'Status', date: 'Data', actions: 'Ações' },
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
    leadStatuses: { nuevo: 'novo', contactado: 'contactado', onboarding: 'onboarding', completado: 'concluído', descartado: 'descartado' },
    onboardingStatuses: { en_revision: 'Em revisão', aprobado: 'Aprovado', rechazado: 'Rejeitado' },
    countries: { all: 'Todos', others: 'Outros' },
    account: {
      title: 'Minha conta', nameLabel: 'Nome para exibir', namePlaceholder: 'Seu nome',
      passLabel: 'Alterar senha', newPassPlaceholder: 'Nova senha (mín. 8 caracteres)', confirmPassPlaceholder: 'Confirmar senha',
      saveBtn: 'Salvar', saving: 'Salvando...', changePassBtn: 'Alterar senha',
      nameUpdated: 'Nome atualizado', passUpdated: 'Senha atualizada', errMinChars: 'Mínimo 8 caracteres', errNoMatch: 'As senhas não coincidem',
    },
    settings: {
      title: 'Gestores', usersLabel: 'Usuários', userSingular: 'usuário', userPlural: 'usuários',
      noAccess: 'Sem acesso', levelLabel: 'Nível', adminRole: 'Admin', advisorRole: 'Assessor',
      newPassLabel: 'Nova senha', newPassHint: 'vazio = não alterar', newPassPlaceholder: 'Nova senha',
      saveBtn: 'Salvar', saving: 'Salvando...', updated: 'Usuário atualizado', errSave: 'Erro ao salvar', errMinChars: 'Mínimo 8 caracteres',
      deleteBtn: 'Excluir', deleteConfirm: 'Confirmar?', deleting: 'Excluindo...', errDelete: 'Erro ao excluir',
      createLabel: 'Criar usuário', namePlaceholder: 'Nome (opcional)', emailPlaceholder: 'Email *',
      passPlaceholder: 'Senha (mín. 8 caracteres) *', createBtn: 'Criar usuário', creating: 'Criando...', errCreate: 'Erro ao criar',
      created: 'Usuário {email} criado',
    },
    login: {
      title: 'Acesso admin',
      subtitle: 'Apenas para a equipe NxinMall',
      emailLabel: 'Email',
      passwordLabel: 'Senha',
      placeholderEmail: 'ops@nxinmall.com',
      placeholderPassword: '••••••••',
      errorAuth: 'Email ou senha incorretos.',
      submitting: 'Entrando...',
      submit: 'Entrar',
    },
  },
};
