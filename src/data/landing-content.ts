import { JSX } from 'react';

export type Lang = 'es' | 'en' | 'pt';

export const COPY: Record<Lang, {
  nav: { suppliers: string; process: string; faq: string; cta: string };
  hero: { badge: string; title: string; subtitle: string; primary: string; secondary: string };
  benefitsTitle: string;
  benefits: { title: string; desc: string }[];
  logistics: { kicker: string; title: string; body: string };
  process: { title: string; subtitle: string; steps: { title: string; desc: string }[] };
  buyers: { kicker: string; title: string; body: string };
  form: { kicker: string; title: string; subtitle: string; fields: Record<string, string>; submit: string };
  faq: { title: string; subtitle: string; items: { q: string; a: string }[] };
  footer: { tagline: string; cta: string };
}> = {
  es: {
    nav: { suppliers: '¿Por qué?', process: 'Proceso', faq: 'Preguntas', cta: 'Solicitar acceso' },
    hero: {
      badge: 'Proveedores exportadores',
      title: 'Tu produccion lista para compradores internacionales.',
      subtitle: 'NxinMall conecta oferta agricola con demanda global mediante un flujo comercial simple y acompanado.',
      primary: 'Quiero ser proveedor',
      secondary: 'Ver beneficios',
    },
    benefitsTitle: '¿Por qué con NxinMall?',
    benefits: [
      {
        title: 'Acceso a nuevos mercados',
        desc: 'Conecta con compradores internacionales que buscan oferta confiable y continua.',
      },
      {
        title: 'Transacciones seguras',
        desc: 'Contratos claros, trazabilidad y soporte en cada etapa comercial.',
      },
      {
        title: 'Documentos y pagos en linea',
        desc: 'Gestiona documentos y estados de pago desde una sola plataforma.',
      },
      {
        title: 'Seguimiento de carga',
        desc: 'Monitorea el avance logistico y mejora tu cumplimiento.',
      },
    ],
    logistics: {
      kicker: 'Logistica y cumplimiento',
      title: 'Control sobre cada etapa del embarque.',
      body: 'Coordinamos documentos, pagos y trazabilidad para que tu carga viaje con visibilidad total.',
    },
    process: {
      title: 'Un flujo simple para empezar',
      subtitle: 'Priorizamos velocidad y claridad comercial para que llegues a compradores internacionales sin friccion.',
      steps: [
        { title: 'Envias tu solicitud', desc: 'Completa el formulario con tus datos comerciales.' },
        { title: 'Te contacta un ejecutivo', desc: 'Confirmamos capacidad, categorias y paises objetivo.' },
        { title: 'Recibes tu enlace', desc: 'Inicias el onboarding con un link unico para tu empresa.' },
      ],
    },
    buyers: {
      kicker: 'Compradores globales',
      title: 'Tu catalogo frente a demanda activa.',
      body: 'Te ayudamos a posicionar tu oferta con compradores recurrentes y acuerdos claros.',
    },
    form: {
      kicker: 'Solicitud de proveedor',
      title: 'Hablemos de tu operacion.',
      subtitle: 'Completa tus datos y un ejecutivo te contactara para activar el siguiente paso.',
      fields: {
        name: 'Nombre completo',
        company: 'Empresa',
        email: 'Email',
        whatsapp: 'WhatsApp',
        country: 'Pais',
        countryPlaceholder: 'Selecciona un pais',
      },
      submit: 'Solicitar acceso',
    },
    faq: {
      title: 'Preguntas frecuentes',
      subtitle: 'Todo lo que debes saber antes de postular.',
      items: [
        { q: 'Cuanto tarda la respuesta?', a: 'Nuestro equipo responde en 24 a 48 horas habiles.' },
        { q: 'Con que paises trabajan?', a: 'Peru, Brasil, Colombia y Ecuador. Evaluamos otros mercados.' },
        { q: 'Que productos aceptan?', a: 'Frutas, verduras, flores y agroindustria con volumen de exportacion.' },
      ],
    },
    footer: {
      tagline: 'Plataforma global B2B para exportadores.',
      cta: 'Solicitar acceso',
    },
  },
  en: {
    nav: { suppliers: 'Why?', process: 'Process', faq: 'FAQ', cta: 'Request access' },
    hero: {
      badge: 'Export suppliers',
      title: 'Your production ready for international buyers.',
      subtitle: 'NxinMall connects agricultural supply with global demand through a simple, guided flow.',
      primary: 'Become a supplier',
      secondary: 'See benefits',
    },
    benefitsTitle: 'Why NxinMall?',
    benefits: [
      {
        title: 'Access to new markets',
        desc: 'Connect with international buyers looking for reliable, consistent supply.',
      },
      {
        title: 'Secure transactions',
        desc: 'Clear contracts, traceability, and support at every commercial stage.',
      },
      {
        title: 'Documents and payments',
        desc: 'Manage documents and payment status from one platform.',
      },
      {
        title: 'Cargo tracking',
        desc: 'Monitor logistics progress and improve fulfillment.',
      },
    ],
    logistics: {
      kicker: 'Logistics and compliance',
      title: 'Control every step of the shipment.',
      body: 'We coordinate documents, payments, and traceability for full visibility.',
    },
    process: {
      title: 'A simple way to start',
      subtitle: 'Speed and commercial clarity so you reach buyers without friction.',
      steps: [
        { title: 'Submit your request', desc: 'Complete the form with your business details.' },
        { title: 'Executive review', desc: 'We confirm capacity, categories, and target countries.' },
        { title: 'Receive your link', desc: 'Start onboarding with a unique link for your company.' },
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
      },
      submit: 'Request access',
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
    },
  },
  pt: {
    nav: { suppliers: 'Por quê?', process: 'Processo', faq: 'Perguntas', cta: 'Solicitar acesso' },
    hero: {
      badge: 'Fornecedores exportadores',
      title: 'Sua producao pronta para compradores internacionales.',
      subtitle: 'A NxinMall conecta oferta agricola con demanda global por um fluxo simples e acompanhado.',
      primary: 'Quero ser fornecedor',
      secondary: 'Ver beneficios',
    },
    benefitsTitle: 'Por que NxinMall?',
    benefits: [
      {
        title: 'Acesso a novos mercados',
        desc: 'Conecte-se com compradores internacionais que buscam oferta confiavel e constante.',
      },
      {
        title: 'Transacoes seguras',
        desc: 'Contratos claros, rastreabilidade e suporte em cada etapa comercial.',
      },
      {
        title: 'Documentos e pagamentos',
        desc: 'Gerencie documentos e status de pagamento em uma unica plataforma.',
      },
      {
        title: 'Acompanhamento de carga',
        desc: 'Monitore a logistica e melhore o cumprimento.',
      },
    ],
    logistics: {
      kicker: 'Logistica e compliance',
      title: 'Controle cada etapa do embarque.',
      body: 'Coordenamos documentos, pagamentos e rastreabilidade com visibilidade total.',
    },
    process: {
      title: 'Um fluxo simples para comecar',
      subtitle: 'Velocidade e clareza comercial para chegar a compradores sem friccao.',
      steps: [
        { title: 'Envie sua solicitacao', desc: 'Complete o formulario com dados comerciais.' },
        { title: 'Contato do executivo', desc: 'Confirmamos capacidad, categorias e paises alvo.' },
        { title: 'Receba seu link', desc: 'Inicie o onboarding con um link unico para sua empresa.' },
      ],
    },
    buyers: {
      kicker: 'Compradores globais',
      title: 'Seu catalogo diante de demanda activa.',
      body: 'Ajudamos a posicionar sua oferta com compradores recorrentes e acordos claros.',
    },
    form: {
      kicker: 'Solicitacao de fornecedor',
      title: 'Vamos falar da sua operacao.',
      subtitle: 'Envie seus dados e um executivo entra em contato para ativar o proximo passo.',
      fields: {
        name: 'Nome completo',
        company: 'Empresa',
        email: 'Email',
        whatsapp: 'WhatsApp',
        country: 'Pais',
        countryPlaceholder: 'Selecione um pais',
      },
      submit: 'Solicitar acesso',
    },
    faq: {
      title: 'Perguntas frequentes',
      subtitle: 'Tudo o que voce precisa antes de aplicar.',
      items: [
        { q: 'Quanto tempo leva a respuesta?', a: 'Nossa equipe responde em 24 a 48 horas uteis.' },
        { q: 'Com quais paises trabalham?', a: 'Peru, Brasil, Colombia e Ecuador. Avaliamos outros.' },
        { q: 'Quais produtos aceitam?', a: 'Frutas, vegetais, flores e agroindustria em escala exportadora.' },
      ],
    },
    footer: {
      tagline: 'Plataforma global B2B para exportadores.',
      cta: 'Solicitar acesso',
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

export const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
];
