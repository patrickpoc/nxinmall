import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const { data, error } = await getSupabaseAdmin()
    .from('leads')
    .select('nombre, empresa, email, whatsapp, pais, categoria')
    .eq('invite_token', token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 404 });
  }

  return NextResponse.json(data);
}
