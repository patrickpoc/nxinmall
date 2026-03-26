import { JSX } from 'react';

export type Lang = 'es' | 'en' | 'pt';

const DEFAULT_HERO_IMAGE = '/visuals/hero_nxinmall.jpg';

export const COPY: Record<Lang, {
  nav: { suppliers: string; process: string; faq: string; cta: string; languagesHint: string; adminLogin: string };
  hero: { badge: string; title: string; subtitle: string; cta: string };
  hero_images: { items: { url: string; enabled: boolean }[] };
  benefitsTitle: string;
  benefitsSubtitle: string;
  benefits: { pillar: string; title: string; desc: string }[];
  logistics: { kicker: string; title: string; body: string };
  process: { title: string; subtitle: string; averageTime: string; steps: { youDo: string; weDo: string }[] };
  buyers: { kicker: string; title: string; body: string };
  trust: { kicker: string; title: string; body: string; points: string[] };
  form: { kicker: string; title: string; subtitle: string; fields: Record<string, string>; submit: string; success: { title: string; desc: string } };
  faq: { title: string; subtitle: string; items: { q: string; a: string }[] };
  footer: { tagline: string; cta: string; adminLogin: string };
}> = {
  es: {
    nav: {
      suppliers: '¿Por qué NxinMall?',
      process: 'Cómo funciona',
      faq: 'Preguntas',
      cta: 'Evaluar mi operación',
      languagesHint: 'Disponible en',
      adminLogin: 'Acceso admin',
    },
    hero: {
      badge: 'Proveedores exportadores',
      title: 'Tu producción frente a compradores internacionales.',
      subtitle: 'Calificamos tu operación para iniciar ventas desde Brasil y preparar expansión internacional.',
      cta: 'Recibir diagnóstico comercial',
    },
    hero_images: { items: [{ url: DEFAULT_HERO_IMAGE, enabled: true }, { url: DEFAULT_HERO_IMAGE, enabled: true }, { url: DEFAULT_HERO_IMAGE, enabled: true }] },
    benefitsTitle: '¿Por qué NxinMall?',
    benefitsSubtitle: 'Acceso, confianza y operación en una sola plataforma.',
    benefits: [
      { pillar: 'Acceso', title: 'Demanda profesional', desc: 'Conecta con compradores calificados desde una operación inicial enfocada en Brasil.' },
      { pillar: 'Confianza', title: 'Transacciones seguras', desc: 'Contratos claros, trazabilidad y soporte en cada etapa comercial.' },
      { pillar: 'Operación', title: 'Documentos y pagos', desc: 'Gestiona documentos, pagos y seguimiento de carga desde una sola plataforma.' },
    ],
    logistics: {
      kicker: 'Logística y cumplimiento',
      title: 'Control sobre cada etapa del embarque.',
      body: 'Coordinamos documentos, pagos y trazabilidad para que tu carga viaje con visibilidad total.',
    },
    process: {
      title: 'Un flujo simple para empezar',
      subtitle: 'Velocidad y claridad comercial para llegar a compradores sin fricción.',
      averageTime: 'Tiempo habitual: 24–48 h.',
      steps: [
        { youDo: 'Envías tu solicitud', weDo: 'Completa el formulario con tus datos comerciales.' },
        { youDo: 'Revisión del ejecutivo', weDo: 'Confirmamos capacidad, categorías y preparación comercial para operar desde Brasil.' },
        { youDo: 'Recibes tu enlace', weDo: 'Inicias el onboarding con un link único para tu empresa.' },
      ],
    },
    buyers: {
      kicker: 'Compradores globales',
      title: 'Tu catálogo frente a demanda activa.',
      body: 'Activamos tu oferta desde Brasil con foco en compradores profesionales y acuerdos claros.',
    },
    trust: {
      kicker: 'Infraestructura B2B confiable',
      title: 'Marketplace abierto y neutral, respaldado por operadores globales.',
      body: 'Nxin Mall es una plataforma independiente para comercio agrícola B2B: no compite con tu marca y comienza su operación comercial en Brasil con estándares globales.',
      points: [
        'Plataforma independiente (no cerrada a un grupo)',
        'Respaldo estratégico: NXin + Oboya',
        'Diseñada para logística, pagos y cumplimiento cross-border',
      ],
    },
    form: {
      kicker: 'Solicitud de proveedor',
      title: 'Hablemos de tu operación.',
      subtitle: 'Deja tus datos básicos para una evaluación enfocada en operación comercial en Brasil.',
      fields: {
        name: 'Nombre completo',
        company: 'Empresa',
        email: 'Email',
        whatsapp: 'WhatsApp',
        country: 'País de operación',
        countryPlaceholder: 'Brasil',
        categoria: '¿Qué tipo de productos ofreces?',
        categoriaPlaceholder: 'Selecciona una categoría',
      },
      submit: 'Recibir diagnóstico inicial',
      success: {
        title: '¡Solicitud enviada!',
        desc: 'Un ejecutivo te contactará en las próximas 24–48 horas.',
      },
    },
    faq: {
      title: 'Preguntas frecuentes',
      subtitle: 'Todo lo que debes saber antes de postular.',
      items: [
        { q: '¿Nxin Mall compite con mi empresa?', a: 'No. Nxin Mall es infraestructura comercial B2B; los proveedores compiten entre sí por calidad, precio y confiabilidad.' },
        { q: '¿La plataforma es cerrada o exclusiva de Oboya?', a: 'No. Es un marketplace independiente y abierto, con respaldo de NXin y Oboya como socios estratégicos.' },
        { q: '¿Por qué usar la plataforma en vez de vender directo?', a: 'Porque agregamos demanda, estandarizamos procesos y reducimos costo operativo en logística, pagos y cumplimiento, comenzando por Brasil.' },
        { q: '¿Cuánto tarda la respuesta inicial?', a: 'Nuestro equipo comercial responde en hasta 24 a 48 horas hábiles.' },
      ],
    },
    footer: {
      tagline: 'Plataforma B2B agrícola con operación inicial en Brasil.',
      cta: 'Solicitar acceso',
      adminLogin: 'Acceso admin',
    },
  },
  en: {
    nav: {
      suppliers: 'Why NxinMall',
      process: 'How it works',
      faq: 'Questions',
      cta: 'Evaluate my operation',
      languagesHint: 'Available in',
      adminLogin: 'Admin login',
    },
    hero: {
      badge: 'Export suppliers',
      title: 'Get your agricultural products in front of global buyers.',
      subtitle: 'We qualify your operation to start from Brazil and prepare your international expansion.',
      cta: 'Get my commercial diagnosis',
    },
    hero_images: { items: [{ url: DEFAULT_HERO_IMAGE, enabled: true }, { url: DEFAULT_HERO_IMAGE, enabled: true }, { url: DEFAULT_HERO_IMAGE, enabled: true }] },
    benefitsTitle: 'Why NxinMall?',
    benefitsSubtitle: 'Access, trust, and operations in one platform.',
    benefits: [
      { pillar: 'Access', title: 'Qualified demand', desc: 'Connect with professional buyers from an initial operation focused on Brazil.' },
      { pillar: 'Trust', title: 'Secure transactions', desc: 'Clear contracts, traceability, and support at every commercial stage.' },
      { pillar: 'Operations', title: 'Documents and payments', desc: 'Manage documents, payments, and cargo tracking from one platform.' },
    ],
    logistics: {
      kicker: 'Logistics and compliance',
      title: 'Control every step of the shipment.',
      body: 'We coordinate documents, payments, and traceability for full visibility.',
    },
    process: {
      title: 'A simple way to start',
      subtitle: 'Speed and commercial clarity so you reach buyers without friction.',
      averageTime: 'Average time: 24–48 hours.',
      steps: [
        { youDo: 'Submit your request', weDo: 'Complete the form with your business details.' },
        { youDo: 'Executive review', weDo: 'We confirm your capacity, categories, and commercial readiness to operate from Brazil.' },
        { youDo: 'Receive your link', weDo: 'Start onboarding with a unique link for your company.' },
      ],
    },
    buyers: {
      kicker: 'Global buyers',
      title: 'Your catalog in front of active demand.',
      body: 'We activate your offer from Brazil, targeting professional buyers and clear agreements.',
    },
    trust: {
      kicker: 'Trusted B2B infrastructure',
      title: 'An open and neutral marketplace backed by global operators.',
      body: 'Nxin Mall is an independent B2B agricultural trade platform. We do not compete with your brand and we are launching with a Brazil-first commercial operation.',
      points: [
        'Independent platform (not a closed ecosystem)',
        'Strategic backing from NXin + Oboya',
        'Built for cross-border logistics, payments, and compliance',
      ],
    },
    form: {
      kicker: 'Supplier request',
      title: 'Tell us about your operation.',
      subtitle: 'Share your basic details for an evaluation focused on your commercial operation in Brazil.',
      fields: {
        name: 'Full name',
        company: 'Company',
        email: 'Email',
        whatsapp: 'WhatsApp',
        country: 'Operating country',
        countryPlaceholder: 'Brazil',
        categoria: 'What type of products do you offer?',
        categoriaPlaceholder: 'Select a category',
      },
      submit: 'Get initial diagnosis',
      success: {
        title: 'Request submitted!',
        desc: 'An executive will contact you within 24–48 business hours.',
      },
    },
    faq: {
      title: 'Frequently asked questions',
      subtitle: 'Everything you need before applying.',
      items: [
        { q: 'Will Nxin Mall compete with my company?', a: 'No. Nxin Mall is B2B trade infrastructure; suppliers compete with each other, not against the platform.' },
        { q: 'Is this a closed marketplace owned by Oboya?', a: 'No. Nxin Mall is an independent open platform, backed by NXin and Oboya as strategic investors.' },
        { q: 'Why use a platform instead of selling directly?', a: 'Because we aggregate demand and reduce complexity in logistics, payments, and standardized operations, starting in Brazil.' },
        { q: 'How fast do I get an initial response?', a: 'Our commercial team replies within 24 to 48 business hours.' },
      ],
    },
    footer: {
      tagline: 'B2B agricultural platform with Brazil-first operation.',
      cta: 'Request access',
      adminLogin: 'Admin login',
    },
  },
  pt: {
    nav: {
      suppliers: 'Por que NxinMall',
      process: 'Como funciona',
      faq: 'Perguntas',
      cta: 'Avaliar minha operação',
      languagesHint: 'Disponível em',
      adminLogin: 'Acesso admin',
    },
    hero: {
      badge: 'Fornecedores exportadores',
      title: 'Sua produção na frente de compradores internacionais.',
      subtitle: 'Qualificamos sua operação para iniciar vendas no Brasil e preparar expansão internacional.',
      cta: 'Receber diagnóstico comercial',
    },
    hero_images: { items: [{ url: DEFAULT_HERO_IMAGE, enabled: true }, { url: DEFAULT_HERO_IMAGE, enabled: true }, { url: DEFAULT_HERO_IMAGE, enabled: true }] },
    benefitsTitle: 'Por que NxinMall?',
    benefitsSubtitle: 'Acesso, confiança e operação em uma única plataforma.',
    benefits: [
      { pillar: 'Acesso', title: 'Demanda qualificada', desc: 'Conecte-se com compradores profissionais a partir de uma operação inicial focada no Brasil.' },
      { pillar: 'Confiança', title: 'Transações seguras', desc: 'Contratos claros, rastreabilidade e suporte em cada etapa comercial.' },
      { pillar: 'Operação', title: 'Documentos e pagamentos', desc: 'Gerencie documentos, pagamentos e acompanhamento de carga em uma única plataforma.' },
    ],
    logistics: {
      kicker: 'Logística e compliance',
      title: 'Controle cada etapa do embarque.',
      body: 'Coordenamos documentos, pagamentos e rastreabilidade com visibilidade total.',
    },
    process: {
      title: 'Um fluxo simples para começar',
      subtitle: 'Velocidade e clareza comercial para chegar a compradores sem fricção.',
      averageTime: 'Tempo médio: 24–48 horas.',
      steps: [
        { youDo: 'Envie sua solicitação', weDo: 'Preencha o formulário com seus dados comerciais.' },
        { youDo: 'Contato do executivo', weDo: 'Confirmamos capacidade, categorias e prontidão comercial para operar a partir do Brasil.' },
        { youDo: 'Receba seu link', weDo: 'Inicie o onboarding com um link único para sua empresa.' },
      ],
    },
    buyers: {
      kicker: 'Compradores globais',
      title: 'Seu catálogo diante de demanda ativa.',
      body: 'Ativamos sua oferta a partir do Brasil com foco em compradores profissionais e acordos claros.',
    },
    trust: {
      kicker: 'Infraestrutura B2B confiável',
      title: 'Marketplace aberto e neutro, com respaldo de operadores globais.',
      body: 'A Nxin Mall é uma plataforma agrícola B2B independente: não compete com sua marca e inicia a operação comercial com foco no Brasil.',
      points: [
        'Plataforma independente (não é ecossistema fechado)',
        'Respaldo estratégico: NXin + Oboya',
        'Estruturada para logística, pagamentos e compliance cross-border',
      ],
    },
    form: {
      kicker: 'Solicitação de fornecedor',
      title: 'Vamos falar da sua operação.',
      subtitle: 'Deixe seus dados iniciais para uma avaliação focada na operação comercial no Brasil.',
      fields: {
        name: 'Nome completo',
        company: 'Empresa',
        email: 'Email',
        whatsapp: 'WhatsApp',
        country: 'País de operação',
        countryPlaceholder: 'Brasil',
        categoria: 'Que tipo de produtos você oferece?',
        categoriaPlaceholder: 'Selecione uma categoria',
      },
      submit: 'Receber diagnóstico inicial',
      success: {
        title: 'Solicitação enviada!',
        desc: 'Um executivo entrará em contato nas próximas 24–48 horas.',
      },
    },
    faq: {
      title: 'Perguntas frequentes',
      subtitle: 'Tudo o que você precisa antes de aplicar.',
      items: [
        { q: 'A Nxin Mall compete com a minha empresa?', a: 'Não. A Nxin Mall é infraestrutura de trade B2B; os fornecedores competem entre si por preço, qualidade e confiabilidade.' },
        { q: 'A plataforma é fechada ou exclusiva da Oboya?', a: 'Não. É um marketplace independente e aberto, com NXin e Oboya como investidores estratégicos.' },
        { q: 'Por que usar a plataforma em vez de vender direto?', a: 'Porque agregamos demanda, padronizamos processos e reduzimos complexidade em logística, pagamentos e operação comercial, começando pelo Brasil.' },
        { q: 'Quanto tempo para resposta inicial?', a: 'Nosso time comercial responde em até 24 a 48 horas úteis.' },
      ],
    },
    footer: {
      tagline: 'Plataforma agrícola B2B com operação inicial no Brasil.',
      cta: 'Solicitar acesso',
      adminLogin: 'Acesso admin',
    },
  },
};

export type IconNode = [keyof JSX.IntrinsicElements, Record<string, string>][];

export const ICON_NODES: IconNode[] = [
  [
    ['path', { d: 'M21.54 15H17a2 2 0 0 0-2 2v4.54', key: '1djwo0' }],
    [
      'path',
      {
        d: 'M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17',
        key: '1tzkfa',
      },
    ],
    [
      'path',
      {
        d: 'M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05',
        key: '14pb5j',
      },
    ],
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ],
  [
    [
      'path',
      {
        d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
        key: 'oel41y',
      },
    ],
    ['path', { d: 'm9 12 2 2 4-4', key: 'dzmm74' }],
  ],
  [
    [
      'path',
      {
        d: 'M10.5 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v6',
        key: 'g5mvt7',
      },
    ],
    ['path', { d: 'M14 2v5a1 1 0 0 0 1 1h5', key: 'wfsgrz' }],
    ['path', { d: 'm14 20 2 2 4-4', key: '15kota' }],
  ],
  [
    [
      'path',
      {
        d: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2',
        key: 'wrbu53',
      },
    ],
    ['path', { d: 'M15 18H9', key: '1lyqi6' }],
    [
      'path',
      {
        d: 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14',
        key: 'lysw3i',
      },
    ],
    ['circle', { cx: '17', cy: '18', r: '2', key: '332jqn' }],
    ['circle', { cx: '7', cy: '18', r: '2', key: '19iecd' }],
  ],
];

export const LANG_OPTIONS: { code: Lang; label: string; flag: string }[] = [
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Portuguese', flag: '🇧🇷' },
];
