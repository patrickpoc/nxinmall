'use client';

import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { LogOut } from 'lucide-react';
import { useAdminLang } from '@/lib/admin-lang-context';

export default function LogoutButton() {
  const router = useRouter();
  const { t } = useAdminLang();

  async function handleLogout() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
    >
      <LogOut className="w-3.5 h-3.5" />
      {t.nav.logout}
    </button>
  );
}
