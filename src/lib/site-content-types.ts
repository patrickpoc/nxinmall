/**
 * Block IDs for editable site content. Stored in Supabase site_content(block_id, lang, content).
 * Content is merged with default COPY when serving the landing.
 */
export type SiteContentBlockId =
  | 'hero'
  | 'nav'
  | 'benefits'
  | 'logistics'
  | 'process'
  | 'buyers'
  | 'form'
  | 'faq'
  | 'footer';

export const SITE_CONTENT_BLOCK_IDS: SiteContentBlockId[] = [
  'hero',
  'nav',
  'benefits',
  'logistics',
  'process',
  'buyers',
  'form',
  'faq',
  'footer',
];

export type Lang = 'es' | 'en' | 'pt';

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  imageUrl?: string;
}

export interface NavContent {
  suppliers: string;
  process: string;
  faq: string;
  cta: string;
  adminLogin: string;
}

export interface BenefitPillar {
  pillar: string;
  title: string;
  desc: string;
}

export interface BenefitsContent {
  benefitsTitle: string;
  benefitsSubtitle: string;
  benefits: BenefitPillar[];
}

export interface ProcessStep {
  youDo: string;
  weDo: string;
}

export interface ProcessContent {
  title: string;
  subtitle: string;
  averageTime: string;
  steps: ProcessStep[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export type SiteContentPayload =
  | HeroContent
  | NavContent
  | BenefitsContent
  | { kicker: string; title: string; body: string }
  | ProcessContent
  | { kicker: string; title: string; body: string }
  | Record<string, unknown>
  | { title: string; subtitle: string; items: FaqItem[] }
  | { tagline: string; cta: string; adminLogin: string };
