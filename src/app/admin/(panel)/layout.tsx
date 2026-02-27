import { AdminLangProvider } from '@/lib/admin-lang-context';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLangProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminTopbar />
        <main>{children}</main>
      </div>
    </AdminLangProvider>
  );
}
