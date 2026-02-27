'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
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
  invite_token: string | null;
};

const ESTADOS = ['nuevo', 'contactado', 'onboarding', 'descartado'] as const;
type Estado = typeof ESTADOS[number];

const ESTADO_STYLES: Record<Estado, string> = {
  nuevo:       'bg-blue-50 text-blue-700 border-blue-200',
  contactado:  'bg-amber-50 text-amber-700 border-amber-200',
  onboarding:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  descartado:  'bg-gray-100 text-gray-500 border-gray-200',
};

const PAISES_PRINCIPALES = ['Peru', 'Brasil', 'Colombia', 'Ecuador'] as const;

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

function getOnboardingUrl(token: string | null): string | null {
  if (!token) return null;
  const base = process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/onboarding?token=${token}`;
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
  const [paisFilter, setPaisFilter] = useState<'' | typeof PAISES_PRINCIPALES[number] | 'otros'>('');
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
        const matchP = !paisFilter
          || (paisFilter === 'otros'
            ? !(PAISES_PRINCIPALES as readonly string[]).includes(l.pais)
            : l.pais === paisFilter);
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
          {PAISES_PRINCIPALES.map((p) => <option key={p} value={p}>{p}</option>)}
          <option value="otros">{t.countries.others}</option>
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
                  const onboardingUrl = getOnboardingUrl(lead.invite_token);
                  const waText = t.leads.waMessage.replace('{nombre}', lead.nombre);
                  const msg = encodeURIComponent(`${waText}\n${onboardingUrl ?? ''}`);
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
                            <WhatsAppIcon className="w-3 h-3" />
                            Onboarding
                          </a>
                          {onboardingUrl && (
                            <a
                              href={onboardingUrl}
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
