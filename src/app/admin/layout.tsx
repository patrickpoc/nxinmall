import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link href="/" className="shrink-0">
              <img src="/visuals/logo.png" alt="NxinMall" className="h-6 w-auto" />
            </Link>
            <div className="h-4 w-px bg-gray-200" />
            <nav className="flex items-center gap-1">
              <Link
                href="/admin/leads"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                Leads
              </Link>
              <Link
                href="/admin/onboardings"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                Onboardings
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
