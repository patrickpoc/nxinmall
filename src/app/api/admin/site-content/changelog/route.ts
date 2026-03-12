import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getSupabaseServer } from '@/lib/supabase-server';
import { SITE_CONTENT_BLOCK_IDS } from '@/lib/site-content-types';
import type { Lang } from '@/lib/site-content-types';

const CHANGELOG_TABLE = 'site_content_changelog';
const SITE_CONTENT_TABLE = 'site_content';
const MAX_LOG_ENTRIES = 10;

export type ChangelogEntry = {
  id: string;
  block_id: string;
  lang: string;
  content_before: Record<string, unknown>;
  content_after: Record<string, unknown>;
  changed_by: string | null;
  changed_at: string;
};

/**
 * GET - returns last 10 changelog entries (for admin UI).
 */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data: rows, error } = await supabase
      .from(CHANGELOG_TABLE)
      .select('id, block_id, lang, content_before, content_after, changed_by, changed_at')
      .order('changed_at', { ascending: false })
      .limit(MAX_LOG_ENTRIES);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = (rows || []).map((r) => ({
      id: r.id,
      block_id: r.block_id,
      lang: r.lang,
      content_before: (r.content_before as Record<string, unknown>) ?? {},
      content_after: (r.content_after as Record<string, unknown>) ?? {},
      changed_by: r.changed_by as string | null,
      changed_at: r.changed_at as string,
    }));
    return NextResponse.json(list, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * POST - restore content from a changelog entry (revert to content_before).
 * Body: { id: string } (changelog row id).
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const id = body.id as string | undefined;
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: row, error: fetchError } = await supabaseAdmin
      .from(CHANGELOG_TABLE)
      .select('block_id, lang, content_before')
      .eq('id', id)
      .single();

    if (fetchError || !row) {
      return NextResponse.json({ error: 'Changelog entry not found' }, { status: 404 });
    }

    const block_id = row.block_id as string;
    const lang = row.lang as string;
    const content = (row.content_before as Record<string, unknown>) ?? {};

    if (!SITE_CONTENT_BLOCK_IDS.includes(block_id as any) || !['es', 'en', 'pt'].includes(lang)) {
      return NextResponse.json({ error: 'Invalid block_id or lang' }, { status: 400 });
    }

    const serverSupabase = await getSupabaseServer();
    const { data: { user } } = await serverSupabase.auth.getUser();
    const changed_by = user?.email ?? null;

    const { error: upsertError } = await supabaseAdmin.from(SITE_CONTENT_TABLE).upsert(
      {
        block_id,
        lang,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'block_id,lang' }
    );

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, block_id, lang }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
