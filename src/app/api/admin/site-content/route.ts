import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getSupabaseServer } from '@/lib/supabase-server';
import { SITE_CONTENT_BLOCK_IDS } from '@/lib/site-content-types';
import type { Lang } from '@/lib/site-content-types';

const TABLE = 'site_content';
const CHANGELOG_TABLE = 'site_content_changelog';
const MAX_LOG_ENTRIES = 10;

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
 * PUT - upsert one block content for one language. Optionally logs to changelog (last 10).
 * If changelog table is missing or fails, save still succeeds.
 * Body: { block_id: string, lang: 'es'|'en'|'pt', content: object }
 */
export async function PUT(req: NextRequest) {
  let body: { block_id?: string; lang?: string; content?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { block_id, lang, content } = body;
  if (!block_id || !lang || !['es', 'en', 'pt'].includes(lang)) {
    return NextResponse.json({ error: 'block_id and lang (es|en|pt) required' }, { status: 400 });
  }
  if (!SITE_CONTENT_BLOCK_IDS.includes(block_id as any)) {
    return NextResponse.json({ error: 'Invalid block_id' }, { status: 400 });
  }

  const contentAfter = (content && typeof content === 'object') ? content : {};

  try {
  const supabase = getSupabaseAdmin();

  const { data: existing, error: fetchError } = await supabase
    .from(TABLE)
    .select('content')
    .eq('block_id', block_id)
    .eq('lang', lang)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const contentBefore = (existing?.content && typeof existing.content === 'object')
    ? (existing.content as Record<string, unknown>)
    : {};

  const { error: upsertError } = await supabase.from(TABLE).upsert(
    {
      block_id,
      lang,
      content: contentAfter,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'block_id,lang' }
  );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  try {
    const serverSupabase = await getSupabaseServer();
    const { data: { user } } = await serverSupabase.auth.getUser();
    const changed_by = user?.email ?? null;

    const { error: insertLogError } = await supabase.from(CHANGELOG_TABLE).insert({
      block_id,
      lang,
      content_before: contentBefore,
      content_after: contentAfter,
      changed_by,
    });

    if (!insertLogError) {
      const { data: allRows } = await supabase
        .from(CHANGELOG_TABLE)
        .select('id')
        .order('changed_at', { ascending: false });
      const toRemove = (allRows ?? []).slice(MAX_LOG_ENTRIES).map((r) => r.id);
      if (toRemove.length > 0) {
        await supabase.from(CHANGELOG_TABLE).delete().in('id', toRemove);
      }
    }
  } catch {
    // Changelog optional (e.g. table not created); save already succeeded
  }

  return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
