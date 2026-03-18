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
  form: { kicker: string; title: string; subtitle: string; fields: Record<string, string>; submit: string; success: { title: string; desc: string } };
  faq: { title: string; subtitle: string; items: { q: string; a: string }[] };
  footer: { tagline: string; cta: string; adminLogin: string };
}> = {
  es: {
    nav: {
      suppliers: '¿Por qué NxinMall?',
      process: 'Cómo funciona',
      faq: 'Preguntas',
      cta: 'Solicitar acceso',
      languagesHint: 'Disponible en',
      adminLogin: 'Acceso admin',
    },
    hero: {
      badge: 'Proveedores exportadores',
      title: 'Tu producción frente a compradores internacionales.',
      subtitle: 'Calificamos tu operación y publicamos un catálogo listo para vender en NxinMall.',
      cta: 'Solicitar acceso',
    },
    hero_images: { items: [{ url: DEFAULT_HERO_IMAGE, enabled: true }, { url: DEFAULT_HERO_IMAGE, enabled: true }, { url: DEFAULT_HERO_IMAGE, enabled: true }] },
    benefitsTitle: '¿Por qué NxinMall?',
    benefitsSubtitle: 'Acceso, confianza y operación en una sola plataforma.',
    benefits: [
      { pillar: 'Acceso', title: 'Nuevos mercados', desc: 'Conecta con compradores internacionales que buscan oferta confiable y continua.' },
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
        { youDo: 'Revisión del ejecutivo', weDo: 'Confirmamos capacidad, categorías y países objetivo.' },
        { youDo: 'Recibes tu enlace', weDo: 'Inicias el onboarding con un link único para tu empresa.' },
      ],
    },
    buyers: {
      kicker: 'Compradores globales',
      title: 'Tu catálogo frente a demanda activa.',
      body: 'Te ayudamos a posicionar tu oferta con compradores recurrentes y acuerdos claros.',
    },
    form: {
      kicker: 'Solicitud de proveedor',
      title: 'Hablemos de tu operación.',
      subtitle: 'Completa tus datos y un ejecutivo te contactará para activar el siguiente paso.',
      fields: {
        name: 'Nombre completo',
        company: 'Empresa',
        email: 'Email',
        whatsapp: 'WhatsApp',
        country: 'País',
        countryPlaceholder: 'Selecciona un país',
        categoria: '¿Qué tipo de productos ofreces?',
        categoriaPlaceholder: 'Selecciona una categoría',
      },
      submit: 'Solicitar acceso',
      success: {
        title: '¡Solicitud enviada!',
        desc: 'Un ejecutivo te contactará en las próximas 24–48 horas.',
      },
    },
    faq: {
      title: 'Preguntas frecuentes',
      subtitle: 'Todo lo que debes saber antes de postular.',
      items: [
        { q: '¿Cuánto tarda la respuesta?', a: 'Nuestro equipo responde en 24 a 48 horas hábiles.' },
        { q: '¿Con qué países trabajan?', a: 'Perú, Brasil, Colombia y Ecuador. Evaluamos otros mercados.' },
        { q: '¿Qué productos aceptan?', a: 'Frutas, verduras, flores y agroindustria con volumen de exportación.' },
      ],
    },
    footer: {
      tagline: 'Plataforma global B2B para exportadores.',
      cta: 'Solicitar acceso',
      adminLogin: 'Acceso admin',
    },
  },
  en: {
    nav: {
      suppliers: 'Why NxinMall',
      process: 'How it works',
      faq: 'Questions',
      cta: 'Request access',
      languagesHint: 'Available in',
      adminLogin: 'Admin login',
    },
    hero: {
      badge: 'Export suppliers',
      title: 'Get your agricultural products in front of global buyers.',
      subtitle: 'We qualify your operation and publish a ready-to-sell catalog on NxinMall.',
      cta: 'Request access',
    },
    hero_images: { items: [{ url: DEFAULT_HERO_IMAGE, enabled: true }, { url: DEFAULT_HERO_IMAGE, enabled: true }, { url: DEFAULT_HERO_IMAGE, enabled: true }] },
    benefitsTitle: 'Why NxinMall?',
    benefitsSubtitle: 'Access, trust, and operations in one platform.',
    benefits: [
      { pillar: 'Access', title: 'New markets', desc: 'Connect with international buyers looking for reliable, consistent supply.' },
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
        { youDo: 'Executive review', weDo: 'We confirm capacity, categories, and target countries.' },
        { youDo: 'Receive your link', weDo: 'Start onboarding with a unique link for your company.' },
      ],
    },
    buyers: {
      kicker: 'Global buyers',
      title: 'Your catalog in front of active demand.',
      body: 'We help position your offer with recurring buyers and clear agreements.',
    },
    form: {
      kicker: 'Supplier request',
      title: 'Tell us about your operation.',
      subtitle: 'Share your details and an executive will contact you to activate the next step.',
      fields: {
        name: 'Full name',
        company: 'Company',
        email: 'Email',
        whatsapp: 'WhatsApp',
        country: 'Country',
        countryPlaceholder: 'Select a country',
        categoria: 'What type of products do you offer?',
        categoriaPlaceholder: 'Select a category',
      },
      submit: 'Request access',
      success: {
        title: 'Request submitted!',
        desc: 'An executive will contact you within 24–48 business hours.',
      },
    },
    faq: {
      title: 'Frequently asked questions',
      subtitle: 'Everything you need before applying.',
      items: [
        { q: 'How fast is the response?', a: 'Our team responds within 24 to 48 business hours.' },
        { q: 'Which countries do you serve?', a: 'Peru, Brazil, Colombia, and Ecuador. We evaluate others.' },
        { q: 'Which products are accepted?', a: 'Fruits, vegetables, flowers, and agroindustry at export scale.' },
      ],
    },
    footer: {
      tagline: 'Global B2B platform for exporters.',
      cta: 'Request access',
      adminLogin: 'Admin login',
    },
  },
  pt: {
    nav: {
      suppliers: 'Por que NxinMall',
      process: 'Como funciona',
      faq: 'Perguntas',
      cta: 'Solicitar acesso',
      languagesHint: 'Disponível em',
      adminLogin: 'Acesso admin',
    },
    hero: {
      badge: 'Fornecedores exportadores',
      title: 'Sua produção na frente de compradores internacionais.',
      subtitle: 'Qualificamos sua operação e publicamos um catálogo pronto para vender na NxinMall.',
      cta: 'Solicitar acesso',
    },
    hero_images: { items: [{ url: DEFAULT_HERO_IMAGE, enabled: true }, { url: DEFAULT_HERO_IMAGE, enabled: true }, { url: DEFAULT_HERO_IMAGE, enabled: true }] },
    benefitsTitle: 'Por que NxinMall?',
    benefitsSubtitle: 'Acesso, confiança e operação em uma única plataforma.',
    benefits: [
      { pillar: 'Acesso', title: 'Novos mercados', desc: 'Conecte-se com compradores internacionais que buscam oferta confiável e constante.' },
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
        { youDo: 'Contato do executivo', weDo: 'Confirmamos capacidade, categorias e países alvo.' },
        { youDo: 'Receba seu link', weDo: 'Inicie o onboarding com um link único para sua empresa.' },
      ],
    },
    buyers: {
      kicker: 'Compradores globais',
      title: 'Seu catálogo diante de demanda ativa.',
      body: 'Ajudamos a posicionar sua oferta com compradores recorrentes e acordos claros.',
    },
    form: {
      kicker: 'Solicitação de fornecedor',
      title: 'Vamos falar da sua operação.',
      subtitle: 'Envie seus dados e um executivo entra em contato para ativar o próximo passo.',
      fields: {
        name: 'Nome completo',
        company: 'Empresa',
        email: 'Email',
        whatsapp: 'WhatsApp',
        country: 'País',
        countryPlaceholder: 'Selecione um país',
        categoria: 'Que tipo de produtos você oferece?',
        categoriaPlaceholder: 'Selecione uma categoria',
      },
      submit: 'Solicitar acesso',
      success: {
        title: 'Solicitação enviada!',
        desc: 'Um executivo entrará em contato nas próximas 24–48 horas.',
      },
    },
    faq: {
      title: 'Perguntas frequentes',
      subtitle: 'Tudo o que você precisa antes de aplicar.',
      items: [
        { q: 'Quanto tempo leva a resposta?', a: 'Nossa equipe responde em 24 a 48 horas úteis.' },
        { q: 'Com quais países trabalham?', a: 'Peru, Brasil, Colômbia e Equador. Avaliamos outros.' },
        { q: 'Quais produtos aceitam?', a: 'Frutas, vegetais, flores e agroindústria em escala exportadora.' },
      ],
    },
    footer: {
      tagline: 'Plataforma global B2B para exportadores.',
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
