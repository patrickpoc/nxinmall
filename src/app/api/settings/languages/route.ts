import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

type LanguageCode = 'en' | 'es' | 'pt';

type LanguageConfig = {
  en: boolean;
  es: boolean;
  pt: boolean;
  defaultLanguage: LanguageCode;
};

const DEFAULT_CONFIG: LanguageConfig = {
  en: true,
  es: true,
  pt: true,
  defaultLanguage: 'en',
};

const SETTINGS_TABLE = 'app_settings';
const SETTINGS_KEY = 'languages';

async function readConfig(): Promise<LanguageConfig> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(SETTINGS_TABLE)
    .select('value')
    .eq('key', SETTINGS_KEY)
    .maybeSingle();

  if (error || !data || !data.value) {
    return DEFAULT_CONFIG;
  }

  const value = data.value as Partial<LanguageConfig>;

  const base: LanguageConfig = {
    en: value.en ?? true,
    es: value.es ?? true,
    pt: value.pt ?? true,
    defaultLanguage: (value.defaultLanguage as LanguageCode) ?? 'en',
  };

  // Ensure defaultLanguage is one of the enabled languages
  const enabled: LanguageCode[] = (['en', 'es', 'pt'] as LanguageCode[]).filter(
    (code) => base[code],
  );
  if (!enabled.includes(base.defaultLanguage)) {
    base.defaultLanguage = enabled[0] ?? 'en';
  }

  return base;
}

export async function GET() {
  try {
    const config = await readConfig();
    return NextResponse.json(config, { status: 200 });
  } catch {
    return NextResponse.json(DEFAULT_CONFIG, { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as Partial<LanguageConfig>;

  const nextConfig: LanguageConfig = {
    en: body.en ?? true,
    es: body.es ?? true,
    pt: body.pt ?? true,
    defaultLanguage: (body.defaultLanguage as LanguageCode) ?? 'en',
  };

  // Ensure at least one language remains enabled
  const enabled: LanguageCode[] = (['en', 'es', 'pt'] as LanguageCode[]).filter(
    (code) => nextConfig[code],
  );
  if (enabled.length === 0) {
    return NextResponse.json(
      { error: 'At least one language must be enabled.' },
      { status: 400 },
    );
  }

  // Ensure defaultLanguage is one of the enabled ones
  if (!enabled.includes(nextConfig.defaultLanguage)) {
    nextConfig.defaultLanguage = enabled[0];
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from(SETTINGS_TABLE).upsert(
    {
      key: SETTINGS_KEY,
      value: nextConfig,
    },
    { onConflict: 'key' },
  );

  if (error) {
    return NextResponse.json(
      { error: error.message ?? 'Could not save language settings.' },
      { status: 500 },
    );
  }

  return NextResponse.json(nextConfig, { status: 200 });
}


