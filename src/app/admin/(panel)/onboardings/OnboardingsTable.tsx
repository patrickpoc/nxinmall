'use client';

import { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, MessageCircle, Download } from 'lucide-react';
import clsx from 'clsx';
import { useAdminLang } from '@/lib/admin-lang-context';

export type Onboarding = {
  id: string;
  created_at: string;
  nombre: string;
  empresa: string;
  ruc: string | null;
  email: string;
  whatsapp: string | null;
  pais: string | null;
  categoria: string | null;
  num_productos: number | null;
  productos: string | null;
  estado: string;
  duracion_seg: number | null;
};

const ESTADOS = ['kyb_pendiente', 'en_revision', 'aprobado', 'rechazado'] as const;
type Estado = typeof ESTADOS[number];

const ESTADO_STYLES: Record<Estado, string> = {
  kyb_pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  en_revision:   'bg-blue-50 text-blue-700 border-blue-200',
  aprobado:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  rechazado:     'bg-gray-100 text-gray-500 border-gray-200',
};

function EstadoSelect({ onboarding }: { onboarding: Onboarding }) {
  const { t } = useAdminLang();
  const [value, setValue] = useState(onboarding.estado as Estado);
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nuevo = e.target.value as Estado;
    setValue(nuevo);
    setSaving(true);
    await fetch(`/api/admin/onboardings/${onboarding.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevo }),
    });
    setSaving(false);
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={saving}
      className={clsx(
        'text-[11px] font-semibold border rounded-md px-2 py-1 pr-5 cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors',
        'disabled:opacity-60 appearance-none bg-no-repeat',
        ESTADO_STYLES[value as Estado] ?? ESTADO_STYLES.kyb_pendiente
      )}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundPosition: 'right 4px center', backgroundSize: '12px' }}
    >
      {ESTADOS.map((s) => (
        <option key={s} value={s}>{t.onboardingStatuses[s] ?? s}</option>
      ))}
    </select>
  );
}

type SortKey = 'empresa' | 'categoria' | 'estado' | 'created_at' | 'num_productos';
type SortDir = 'asc' | 'desc';

function SortIcon({ field, sortKey, sortDir }: { field: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== field) return <ChevronsUpDown className="w-3 h-3 text-gray-300 ml-1 inline" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-brand-500 ml-1 inline" />
    : <ChevronDown className="w-3 h-3 text-brand-500 ml-1 inline" />;
}

function duracionLabel(seg: number | null) {
  if (!seg) return '—';
  if (seg < 60) return `${seg}s`;
  return `${Math.round(seg / 60)}min`;
}

export default function OnboardingsTable({ onboardings }: { onboardings: Onboarding[] }) {
  const { t } = useAdminLang();
  const [query, setQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<Estado | 'todos'>('todos');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return onboardings
      .filter((o) => {
        const matchQ = !q || [o.empresa, o.nombre, o.email, o.ruc, o.categoria].some((v) => v?.toLowerCase().includes(q));
        const matchE = estadoFilter === 'todos' || o.estado === estadoFilter;
        return matchQ && matchE;
      })
      .sort((a, b) => {
        const va = String(a[sortKey] ?? '');
        const vb = String(b[sortKey] ?? '');
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });
  }, [onboardings, query, estadoFilter, sortKey, sortDir]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: onboardings.length };
    ESTADOS.forEach((s) => { c[s] = onboardings.filter((o) => o.estado === s).length; });
    return c;
  }, [onboardings]);

  const total = onboardings.length;
  const pendientes = counts['kyb_pendiente'] ?? 0;
  const aprobados = counts['aprobado'] ?? 0;

  const thClass = 'px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap select-none cursor-pointer hover:text-gray-800 transition-colors';
  const tdClass = 'px-4 py-3 text-sm text-gray-700 align-top';

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t.onboardings.section}</p>
          <h1 className="text-xl font-bold text-gray-900">{t.onboardings.title}</h1>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span><span className="font-bold text-gray-800">{total}</span> {t.onboardings.stats.total}</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><span className="font-bold text-amber-700">{pendientes}</span> {t.onboardings.stats.pending}</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><span className="font-bold text-emerald-700">{aprobados}</span> {t.onboardings.stats.approved}</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.onboardings.search}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['todos', ...ESTADOS] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setEstadoFilter(s)}
              className={clsx(
                'px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all whitespace-nowrap',
                estadoFilter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {s === 'todos' ? t.onboardings.all : (t.onboardingStatuses[s] ?? s)}
              <span className={clsx('ml-1.5 text-[10px] font-bold', estadoFilter === s ? 'text-brand-500' : 'text-gray-400')}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">{t.onboardings.empty}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className={thClass} onClick={() => toggleSort('empresa')}>
                    {t.onboardings.cols.company} <SortIcon field="empresa" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className={clsx(thClass, 'cursor-default hover:text-gray-500')}>{t.onboardings.cols.contact}</th>
                  <th className={thClass} onClick={() => toggleSort('categoria')}>
                    {t.onboardings.cols.category} <SortIcon field="categoria" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className={thClass} onClick={() => toggleSort('num_productos')}>
                    {t.onboardings.cols.products} <SortIcon field="num_productos" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className={thClass} onClick={() => toggleSort('estado')}>
                    {t.onboardings.cols.status} <SortIcon field="estado" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className={thClass} onClick={() => toggleSort('created_at')}>
                    {t.onboardings.cols.date} <SortIcon field="created_at" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className={clsx(thClass, 'cursor-default hover:text-gray-500')}>{t.onboardings.cols.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((o) => {
                  const phoneClean = o.whatsapp?.replace(/[^0-9]/g, '') ?? '';
                  const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(`Hola ${o.nombre}, tu tienda en NxinMall está siendo configurada.`)}`;

                  return (
                    <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className={tdClass}>
                        <span className="font-semibold text-gray-900">{o.empresa}</span>
                        {o.ruc && <p className="text-[11px] text-gray-400 mt-0.5">RUC: {o.ruc}</p>}
                      </td>
                      <td className={tdClass}>
                        <p className="text-xs font-medium text-gray-800">{o.nombre}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{o.email}</p>
                        {o.whatsapp && <p className="text-[11px] text-gray-400">{o.whatsapp}</p>}
                      </td>
                      <td className={tdClass}>
                        <span className="text-xs text-gray-600">{o.categoria ?? '—'}</span>
                      </td>
                      <td className={tdClass}>
                        <span className="text-xs font-semibold text-gray-800">{o.num_productos ?? 0}</span>
                        {o.productos && (
                          <p className="text-[11px] text-gray-400 mt-0.5 max-w-[180px] truncate" title={o.productos}>
                            {o.productos}
                          </p>
                        )}
                      </td>
                      <td className={tdClass}>
                        <EstadoSelect onboarding={o} />
                      </td>
                      <td className={tdClass}>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap">
                          {new Date(o.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </span>
                        <p className="text-[10px] text-gray-300 mt-0.5">{duracionLabel(o.duracion_seg)}</p>
                      </td>
                      <td className={tdClass}>
                        <div className="flex items-center gap-1.5">
                          {o.whatsapp && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                            >
                              <MessageCircle className="w-3 h-3" />
                              WA
                            </a>
                          )}
                          <a
                            href={`/api/admin/onboardings/${o.id}/download`}
                            title="Descargar JSON"
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-brand-900 transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            JSON
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-400 font-medium">
            {filtered.length} {t.onboardings.footer} {onboardings.length} onboardings
          </div>
        )}
      </div>
    </div>
  );
}
