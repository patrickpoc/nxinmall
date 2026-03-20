'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Trash2, RotateCcw, X } from 'lucide-react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
import clsx from 'clsx';
import { useAdminLang } from '@/lib/admin-lang-context';
import { UBIGEO_COUNTRIES } from '@/data/countries';

export type Lead = {
  id: string;
  created_at: string;
  nombre: string;
  empresa: string;
  email: string;
  whatsapp: string;
  pais: string;
  categoria?: string;
  lead_type?: 'supplier' | 'buyer';
  document_person_type?: string | null;
  document_type?: string | null;
  document_number?: string | null;
  document_deferred?: boolean | null;
  estado: string;
  invite_token: string | null;
};

const ESTADOS = ['nuevo', 'contactado', 'onboarding', 'completado', 'descartado'] as const;
type Estado = typeof ESTADOS[number];

const ESTADO_STYLES: Record<Estado, string> = {
  nuevo:       'bg-blue-50 text-blue-700 border-blue-200',
  contactado:  'bg-amber-50 text-amber-700 border-amber-200',
  onboarding:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  completado:  'bg-teal-50 text-teal-700 border-teal-200',
  descartado:  'bg-gray-100 text-gray-500 border-gray-200',
};

const PAISES_PRINCIPALES = UBIGEO_COUNTRIES;

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

function getOnboardingUrl(token: string | null, leadType?: 'supplier' | 'buyer'): string | null {
  if (!token) return null;
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? '';
  const path = leadType === 'buyer' ? '/onboarding-buyer' : '/onboarding';
  return base ? `${base}${path}?token=${token}` : `${path}?token=${token}`;
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
  const { t, lang } = useAdminLang();
  const [rows, setRows] = useState<Lead[]>(leads);
  const [deletedHistory, setDeletedHistory] = useState<Lead[]>([]);
  const [pendingDelete, setPendingDelete] = useState<Lead | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
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
    return rows
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
  }, [rows, query, estadoFilter, paisFilter, sortKey, sortDir]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: rows.length };
    ESTADOS.forEach((s) => { c[s] = rows.filter((l) => l.estado === s).length; });
    return c;
  }, [rows]);

  const total = rows.length;
  const nuevos = counts['nuevo'] ?? 0;
  const onboarding = counts['onboarding'] ?? 0;
  const locale = lang === 'es' ? 'es-PE' : lang === 'pt' ? 'pt-BR' : 'en-US';
  const waTitle = lang === 'es'
    ? 'Enviar enlace de onboarding por WhatsApp'
    : lang === 'pt'
      ? 'Enviar link de onboarding por WhatsApp'
      : 'Send onboarding link via WhatsApp';
  const openTitle = lang === 'es'
    ? 'Abrir enlace de onboarding'
    : lang === 'pt'
      ? 'Abrir link de onboarding'
      : 'Open onboarding link';

  const thClass = 'px-3 sm:px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap select-none cursor-pointer hover:text-gray-800 transition-colors';
  const tdClass = 'px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-700 align-top';

  async function handleDelete(lead: Lead) {
    const res = await fetch(`/api/admin/leads/${lead.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({} as { error?: string }));
      const fallback = lang === 'pt' ? 'Não foi possível excluir o lead.' : lang === 'es' ? 'No se pudo eliminar el lead.' : 'Could not delete lead.';
      setActionFeedback({ type: 'error', text: typeof payload?.error === 'string' ? payload.error : fallback });
      return;
    }
    const data = await res.json();
    const deleted = (data?.deleted as Lead | undefined) ?? lead;
    setRows((prev) => prev.filter((l) => l.id !== lead.id));
    setDeletedHistory((prev) => [deleted, ...prev].slice(0, 10));
    setPendingDelete(null);
    const successText = data?.softDeleted
      ? (lang === 'pt' ? 'Lead marcado como descartado (não pôde ser excluído fisicamente).' : lang === 'es' ? 'Lead marcado como descartado (no se pudo eliminar físicamente).' : 'Lead marked as discarded (physical delete blocked).')
      : (lang === 'pt' ? 'Lead excluído com sucesso.' : lang === 'es' ? 'Lead eliminado con éxito.' : 'Lead deleted successfully.');
    setActionFeedback({ type: 'success', text: successText });
  }

  async function handleRestore(lead: Lead) {
    const res = await fetch('/api/admin/leads/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead }),
    });
    if (!res.ok) {
      setActionFeedback({ type: 'error', text: lang === 'pt' ? 'Não foi possível restaurar o lead.' : lang === 'es' ? 'No se pudo restaurar el lead.' : 'Could not restore lead.' });
      return;
    }
    const data = await res.json();
    const restored = (data?.restored as Lead | undefined) ?? lead;
    setRows((prev) => [restored, ...prev]);
    setDeletedHistory((prev) => prev.filter((l) => l.id !== lead.id));
    setActionFeedback({ type: 'success', text: lang === 'pt' ? 'Lead restaurado com sucesso.' : lang === 'es' ? 'Lead restaurado con éxito.' : 'Lead restored successfully.' });
  }

  function handlePurgeHistoryItem(lead: Lead) {
    const msg = lang === 'pt'
      ? 'Deseja remover este item do histórico de excluídos?'
      : lang === 'es'
        ? '¿Deseas eliminar este elemento del historial de eliminados?'
        : 'Do you want to remove this item from deleted history?';
    if (!window.confirm(msg)) return;
    setDeletedHistory((prev) => prev.filter((l) => l.id !== lead.id));
    setActionFeedback({ type: 'success', text: lang === 'pt' ? 'Item removido do histórico.' : lang === 'es' ? 'Elemento removido del historial.' : 'Item removed from history.' });
  }

  async function handleSaveEdit(next: Lead) {
    setSavingEdit(true);
    const res = await fetch(`/api/admin/leads/${next.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: next.nombre,
        empresa: next.empresa,
        email: next.email,
        whatsapp: next.whatsapp,
        pais: next.pais,
        categoria: next.categoria ?? null,
        lead_type: next.lead_type ?? 'supplier',
        document_person_type: next.document_person_type ?? null,
        document_type: next.document_type ?? null,
        document_number: next.document_number ?? null,
      }),
    });
    setSavingEdit(false);
    if (!res.ok) {
      setActionFeedback({ type: 'error', text: lang === 'pt' ? 'Não foi possível salvar o lead.' : lang === 'es' ? 'No se pudo guardar el lead.' : 'Could not save lead.' });
      return;
    }
    setRows((prev) => prev.map((l) => (l.id === next.id ? next : l)));
    setEditingLead(null);
    setActionFeedback({ type: 'success', text: lang === 'pt' ? 'Lead atualizado com sucesso.' : lang === 'es' ? 'Lead actualizado con éxito.' : 'Lead updated successfully.' });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t.leads.section}</p>
          <h1 className="text-xl font-bold text-gray-900">{t.leads.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
          <span><span className="font-bold text-gray-800">{total}</span> {t.leads.stats.total}</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><span className="font-bold text-blue-700">{nuevos}</span> {t.leads.stats.new}</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><span className="font-bold text-emerald-700">{onboarding}</span> {t.leads.stats.onboarding}</span>
        </div>
      </div>
      {actionFeedback && (
        <div className={clsx('rounded-lg border px-3 py-2 text-xs font-medium', actionFeedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700')}>
          {actionFeedback.text}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative w-full sm:flex-1 sm:max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.leads.search}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        <div className="-mx-1 px-1 overflow-x-auto">
          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-lg p-1 min-w-max">
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
        </div>

        <select
          value={paisFilter}
          onChange={(e) => setPaisFilter(e.target.value as typeof paisFilter)}
          className="w-full sm:w-auto rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
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
            <table className="w-full min-w-[980px] border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className={thClass} onClick={() => toggleSort('empresa')}>
                    {t.leads.cols.company} <SortIcon field="empresa" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className={clsx(thClass, 'cursor-default hover:text-gray-500')}>{t.leads.cols.contact}</th>
                  <th className={thClass} onClick={() => toggleSort('pais')}>
                    {t.leads.cols.country} <SortIcon field="pais" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className={clsx(thClass, 'cursor-default hover:text-gray-500')}>Type</th>
                  <th className={clsx(thClass, 'cursor-default hover:text-gray-500')}>{t.leads.cols.category}</th>
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
                  const onboardingUrl = getOnboardingUrl(lead.invite_token, lead.lead_type);
                  const waText = (lead.lead_type === 'buyer'
                    ? (lang === 'pt' ? 'Olá {nombre}, aqui está seu link de onboarding de comprador na NxinMall:' : lang === 'es' ? 'Hola {nombre}, aquí está tu enlace de onboarding de comprador en NxinMall:' : 'Hi {nombre}, here is your NxinMall buyer onboarding link:')
                    : t.leads.waMessage).replace('{nombre}', lead.nombre);
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
                        <span className={clsx('inline-block px-2 py-0.5 rounded-md border text-[11px] font-semibold capitalize', lead.lead_type === 'buyer' ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-blue-50 text-blue-700 border-blue-200')}>
                          {lead.lead_type === 'buyer' ? 'buyer' : 'supplier'}
                        </span>
                      </td>
                      <td className={tdClass}>
                        {lead.categoria
                          ? <span className="inline-block px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200 text-[11px] font-semibold capitalize">{lead.categoria}</span>
                          : <span className="text-[11px] text-gray-300">—</span>
                        }
                      </td>
                      <td className={tdClass}>
                        <EstadoSelect lead={lead} />
                      </td>
                      <td className={tdClass}>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: '2-digit' })}
                        </span>
                      </td>
                      <td className={tdClass}>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={waTitle}
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
                              title={openTitle}
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setEditingLead(lead)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                            title={lang === 'pt' ? 'Editar lead' : lang === 'es' ? 'Editar lead' : 'Edit lead'}
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(lead)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                            title={lang === 'pt' ? 'Excluir lead' : lang === 'es' ? 'Eliminar lead' : 'Delete lead'}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
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
            {filtered.length} {t.leads.footer} {rows.length} {t.leads.title.toLowerCase()}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            {lang === 'pt' ? 'Histórico de excluídos (últimos 10)' : lang === 'es' ? 'Historial de eliminados (últimos 10)' : 'Deleted history (last 10)'}
          </h3>
          <span className="text-xs text-gray-400">{deletedHistory.length}/10</span>
        </div>
        {deletedHistory.length === 0 ? (
          <p className="text-xs text-gray-400 mt-2">{lang === 'pt' ? 'Nenhum lead excluído recentemente.' : lang === 'es' ? 'No hay leads eliminados recientemente.' : 'No recently deleted leads.'}</p>
        ) : (
          <div className="mt-3 space-y-2">
            {deletedHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <div>
                  <p className="text-xs font-semibold text-gray-800">{item.empresa}</p>
                  <p className="text-[11px] text-gray-400">{item.email}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleRestore(item)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-brand-900 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {lang === 'pt' ? 'Desfazer' : lang === 'es' ? 'Deshacer' : 'Undo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePurgeHistoryItem(item)}
                    title={lang === 'pt' ? 'Excluir de vez do histórico' : lang === 'es' ? 'Eliminar definitivamente del historial' : 'Delete permanently from history'}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md text-gray-400 border border-gray-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingLead && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setEditingLead(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white border-l border-gray-200 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">{lang === 'pt' ? 'Editar lead' : lang === 'es' ? 'Editar lead' : 'Edit lead'}</h3>
              <button type="button" onClick={() => setEditingLead(null)} className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {(['nombre', 'empresa', 'email', 'whatsapp', 'pais', 'categoria', 'lead_type', 'document_person_type', 'document_type', 'document_number'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">{field}</label>
                  <input
                    value={(editingLead[field] ?? '') as string}
                    onChange={(e) => setEditingLead((prev) => (prev ? { ...prev, [field]: e.target.value } : prev))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              ))}
              <button
                type="button"
                disabled={savingEdit}
                onClick={() => handleSaveEdit(editingLead)}
                className="w-full py-2.5 rounded-lg bg-brand-900 text-white text-sm font-semibold hover:bg-brand-900/90 disabled:opacity-60"
              >
                {savingEdit ? (lang === 'pt' ? 'Salvando...' : lang === 'es' ? 'Guardando...' : 'Saving...') : (lang === 'pt' ? 'Salvar alterações' : lang === 'es' ? 'Guardar cambios' : 'Save changes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPendingDelete(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-xl bg-white border border-gray-200 shadow-2xl p-5">
              <h4 className="text-base font-bold text-gray-900">
                {lang === 'pt' ? 'Excluir lead' : lang === 'es' ? 'Eliminar lead' : 'Delete lead'}
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                {lang === 'pt'
                  ? 'Esta ação não pode ser desfeita. Deseja excluir este lead?'
                  : lang === 'es'
                    ? 'Esta acción no se puede deshacer. ¿Deseas eliminar este lead?'
                    : 'This action cannot be undone. Do you want to delete this lead?'}
              </p>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPendingDelete(null)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
                >
                  {lang === 'pt' ? 'Cancelar' : lang === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(pendingDelete)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-red-600 hover:bg-red-700"
                >
                  {lang === 'pt' ? 'Desejo excluir' : lang === 'es' ? 'Deseo eliminar' : 'Yes, delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
