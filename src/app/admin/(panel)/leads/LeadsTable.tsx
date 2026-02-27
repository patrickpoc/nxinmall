'use client';

import { useMemo, useState } from 'react';
import { MessageCircle, ExternalLink, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import clsx from 'clsx';
import { useAdminLang } from '@/lib/admin-lang-context';

export type Lead = {
  id: string;
  created_at: string;
  nombre: string;
  empresa: string;
  email: string;
  whatsapp: string;
  pais: string;
  estado: string;
  onboarding_url: string | null;
};

const ESTADOS = ['nuevo', 'contactado', 'onboarding', 'descartado'] as const;
type Estado = typeof ESTADOS[number];

const ESTADO_STYLES: Record<Estado, string> = {
  nuevo:       'bg-blue-50 text-blue-700 border-blue-200',
  contactado:  'bg-amber-50 text-amber-700 border-amber-200',
  onboarding:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  descartado:  'bg-gray-100 text-gray-500 border-gray-200',
};

const PAISES = ['Peru', 'Brasil', 'Colombia', 'Ecuador', 'Chile', 'Argentina'];

function EstadoSelect({ lead }: { lead: Lead }) {
  const { t } = useAdminLang();
  const [value, setValue] = useState(lead.estado as Estado);
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nuevo = e.target.value as Estado;
    setValue(nuevo);
    setSaving(true);
    await fetch(`/api/admin/leads/${lead.id}`, {
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
        ESTADO_STYLES[value as Estado] ?? ESTADO_STYLES.nuevo
      )}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundPosition: 'right 4px center', backgroundSize: '12px' }}
    >
      {ESTADOS.map((s) => (
        <option key={s} value={s}>{t.leadStatuses[s] ?? s}</option>
      ))}
    </select>
  );
}

function getFullUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${window.location.origin}${url}`;
}

type SortKey = 'empresa' | 'pais' | 'estado' | 'created_at';
type SortDir = 'asc' | 'desc';

function SortIcon({ field, sortKey, sortDir }: { field: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== field) return <ChevronsUpDown className="w-3 h-3 text-gray-300 ml-1 inline" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-brand-500 ml-1 inline" />
    : <ChevronDown className="w-3 h-3 text-brand-500 ml-1 inline" />;
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const { t } = useAdminLang();
  const [query, setQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<Estado | 'todos'>('todos');
  const [paisFilter, setPaisFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads
      .filter((l) => {
        const matchQ = !q || [l.empresa, l.nombre, l.email, l.whatsapp].some((v) => v?.toLowerCase().includes(q));
        const matchE = estadoFilter === 'todos' || l.estado === estadoFilter;
        const matchP = !paisFilter || l.pais === paisFilter;
        return matchQ && matchE && matchP;
      })
      .sort((a, b) => {
        const va = a[sortKey] ?? '';
        const vb = b[sortKey] ?? '';
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });
  }, [leads, query, estadoFilter, paisFilter, sortKey, sortDir]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: leads.length };
    ESTADOS.forEach((s) => { c[s] = leads.filter((l) => l.estado === s).length; });
    return c;
  }, [leads]);

  const total = leads.length;
  const nuevos = counts['nuevo'] ?? 0;
  const onboarding = counts['onboarding'] ?? 0;

  const thClass = 'px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap select-none cursor-pointer hover:text-gray-800 transition-colors';
  const tdClass = 'px-4 py-3 text-sm text-gray-700 align-top';

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t.leads.section}</p>
          <h1 className="text-xl font-bold text-gray-900">{t.leads.title}</h1>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span><span className="font-bold text-gray-800">{total}</span> {t.leads.stats.total}</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><span className="font-bold text-blue-700">{nuevos}</span> {t.leads.stats.new}</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><span className="font-bold text-emerald-700">{onboarding}</span> {t.leads.stats.onboarding}</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.leads.search}
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
              {s === 'todos' ? t.leads.all : (t.leadStatuses[s] ?? s)}
              <span className={clsx('ml-1.5 text-[10px] font-bold', estadoFilter === s ? 'text-brand-500' : 'text-gray-400')}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>

        <select
          value={paisFilter}
          onChange={(e) => setPaisFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        >
          <option value="">{t.countries.all}</option>
          {PAISES.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">{t.leads.empty}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className={thClass} onClick={() => toggleSort('empresa')}>
                    {t.leads.cols.company} <SortIcon field="empresa" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className={clsx(thClass, 'cursor-default hover:text-gray-500')}>{t.leads.cols.contact}</th>
                  <th className={thClass} onClick={() => toggleSort('pais')}>
                    {t.leads.cols.country} <SortIcon field="pais" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className={thClass} onClick={() => toggleSort('estado')}>
                    {t.leads.cols.status} <SortIcon field="estado" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className={thClass} onClick={() => toggleSort('created_at')}>
                    {t.leads.cols.date} <SortIcon field="created_at" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className={clsx(thClass, 'cursor-default hover:text-gray-500')}>{t.leads.cols.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((lead) => {
                  const phoneClean = lead.whatsapp?.replace(/[^0-9]/g, '') ?? '';
                  const fullOnboardingUrl = getFullUrl(lead.onboarding_url);
                  const msg = encodeURIComponent(
                    `Hola ${lead.nombre}, te compartimos tu enlace de onboarding en NxinMall:\n${fullOnboardingUrl ?? ''}`
                  );
                  const waUrl = `https://wa.me/${phoneClean}?text=${msg}`;

                  return (
                    <tr key={lead.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className={tdClass}>
                        <span className="font-semibold text-gray-900">{lead.empresa}</span>
                      </td>
                      <td className={tdClass}>
                        <p className="text-xs font-medium text-gray-800">{lead.nombre}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{lead.email}</p>
                        <p className="text-[11px] text-gray-400">{lead.whatsapp}</p>
                      </td>
                      <td className={tdClass}>
                        <span className="text-xs text-gray-600">{lead.pais}</span>
                      </td>
                      <td className={tdClass}>
                        <EstadoSelect lead={lead} />
                      </td>
                      <td className={tdClass}>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </span>
                      </td>
                      <td className={tdClass}>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Enviar link de onboarding por WhatsApp"
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" />
                            Onboarding
                          </a>
                          {lead.onboarding_url && (
                            <a
                              href={getFullUrl(lead.onboarding_url)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Abrir link de onboarding"
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
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
            {filtered.length} {t.leads.footer} {leads.length} leads
          </div>
        )}
      </div>
    </div>
  );
}
