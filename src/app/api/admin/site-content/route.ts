import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { SITE_CONTENT_BLOCK_IDS } from '@/lib/site-content-types';
import type { Lang } from '@/lib/site-content-types';

const TABLE = 'site_content';

/**
 * GET - returns all stored site content (for admin editor).
 * Returns Record<block_id, Record<lang, content>>.
 */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data: rows, error } = await supabase.from(TABLE).select('block_id, lang, content');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const byBlock: Record<string, Record<string, unknown>> = {};
    for (const row of rows || []) {
      const bid = row.block_id as string;
      const lang = row.lang as string;
      if (!byBlock[bid]) byBlock[bid] = {};
      byBlock[bid][lang] = row.content;
    }
    return NextResponse.json(byBlock, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * PUT - upsert one block content for one language.
 * Body: { block_id: string, lang: 'es'|'en'|'pt', content: object }
 */
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { block_id, lang, content } = body as { block_id: string; lang: Lang; content: Record<string, unknown> };

  if (!block_id || !lang || !['es', 'en', 'pt'].includes(lang)) {
    return NextResponse.json({ error: 'block_id and lang (es|en|pt) required' }, { status: 400 });
  }
  if (!SITE_CONTENT_BLOCK_IDS.includes(block_id as any)) {
    return NextResponse.json({ error: 'Invalid block_id' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from(TABLE).upsert(
      {
        block_id,
        lang,
        content: content ?? {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'block_id,lang' }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
