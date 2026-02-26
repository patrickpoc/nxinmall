'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Email o contraseña incorrectos.');
      setLoading(false);
      return;
    }
    router.push('/admin/leads');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <img src="/visuals/logo.png" alt="NxinMall" className="h-9 w-auto mb-5" />
            <h1 className="text-lg font-bold text-gray-900">Acceso al panel</h1>
            <p className="text-xs text-gray-400 mt-1">Solo para el equipo NxinMall</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 focus:bg-white transition-all"
                placeholder="ops@nxinmall.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-600 mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 focus:bg-white transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-brand-900 text-white text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
