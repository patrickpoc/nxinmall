import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { password, role, full_name } = await req.json();

  const updates: Record<string, unknown> = {};
  const metaUpdates: Record<string, string> = {};

  if (password) {
    if (password.length < 8) {
      return NextResponse.json({ error: 'Mínimo 8 caracteres' }, { status: 400 });
    }
    updates.password = password;
  }
  if (role) metaUpdates.role = role;
  if (full_name !== undefined) metaUpdates.full_name = full_name;

  if (Object.keys(metaUpdates).length > 0) {
    updates.user_metadata = metaUpdates;
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.auth.admin.updateUserById(id, updates);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
