import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await getSupabaseAdmin()
    .from('onboardings')
    .select('empresa, session_id, raw_data')
    .eq('id', id)
    .single();

  if (error || !data?.raw_data) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  const slug = (data.empresa ?? 'empresa')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

  const filename = `nxinmall_${slug}_${data.session_id ?? id}.json`;

  return new NextResponse(JSON.stringify(data.raw_data, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
