import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { COPY } from '@/data/landing-content';
import type { Lang } from '@/data/landing-content';
import { SITE_CONTENT_BLOCK_IDS } from '@/lib/site-content-types';

const TABLE = 'site_content';

/**
 * GET ?lang=en - returns merged site content for the given language.
 * Merges stored content (site_content) over default COPY. If table missing/empty, returns COPY only.
 */
export async function GET(req: NextRequest) {
  const lang = (req.nextUrl.searchParams.get('lang') || 'en') as Lang;
  if (!['es', 'en', 'pt'].includes(lang)) {
    return NextResponse.json(COPY.en, { status: 200 });
  }

  const defaultContent = COPY[lang];
  const merged = JSON.parse(JSON.stringify(defaultContent)) as typeof defaultContent;

  try {
    const supabase = getSupabaseAdmin();
    const { data: rows, error } = await supabase
      .from(TABLE)
      .select('block_id, content')
      .eq('lang', lang);

    if (error) {
      return NextResponse.json(merged, { status: 200 });
    }

    for (const row of rows || []) {
      const blockId = row.block_id as string;
      const content = row.content as Record<string, unknown>;
      if (blockId && content && SITE_CONTENT_BLOCK_IDS.includes(blockId as any)) {
        (merged as Record<string, unknown>)[blockId] = { ...(merged as Record<string, unknown>)[blockId], ...content };
      }
    }
  } catch {
    // table may not exist
  }

  return NextResponse.json(merged, { status: 200 });
}
