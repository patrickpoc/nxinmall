import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email ?? '',
    full_name: (u.user_metadata?.full_name as string) ?? '',
    role: (u.user_metadata?.role as string) ?? 'asesor',
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
  }));

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const { email, password, full_name, role } = await req.json();

  if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
  if (!password) return NextResponse.json({ error: 'Contraseña requerida' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: 'Mínimo 8 caracteres' }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: full_name ?? '', role: role ?? 'asesor' },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, user: data.user });
}
