'use client';

import { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, MessageCircle, Download, Eye, FileText, X, Pencil, Trash2, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { useAdminLang } from '@/lib/admin-lang-context';
import { UBIGEO_COUNTRIES } from '@/data/countries';

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
  raw_data?: Record<string, unknown> | null;
};

const ESTADOS = ['en_revision', 'aprobado', 'rechazado'] as const;
type Estado = typeof ESTADOS[number];

const ESTADO_STYLES: Record<Estado, string> = {
  en_revision: 'bg-amber-50 text-amber-700 border-amber-200',
  aprobado:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  rechazado:   'bg-gray-100 text-gray-500 border-gray-200',
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
        ESTADO_STYLES[value as Estado] ?? ESTADO_STYLES.en_revision
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

function valueOrDash(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value.trim() || '—';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '—';
}

export default function OnboardingsTable({ onboardings }: { onboardings: Onboarding[] }) {
  const { t, lang } = useAdminLang();
  const [rows, setRows] = useState<Onboarding[]>(onboardings);
  const [deletedHistory, setDeletedHistory] = useState<Onboarding[]>([]);
  const [pendingDelete, setPendingDelete] = useState<Onboarding | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editing, setEditing] = useState<Onboarding | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [query, setQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<Estado | 'todos'>('todos');
  const [paisFilter, setPaisFilter] = useState<'' | typeof UBIGEO_COUNTRIES[number] | 'otros'>('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selected, setSelected] = useState<Onboarding | null>(null);
  const [drawerMode, setDrawerMode] = useState<'profile' | 'summary' | null>(null);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((o) => {
        const matchQ = !q || [o.empresa, o.nombre, o.email, o.ruc, o.categoria].some((v) => v?.toLowerCase().includes(q));
        const matchE = estadoFilter === 'todos' || o.estado === estadoFilter;
        const matchP = !paisFilter
          || (paisFilter === 'otros'
            ? !(UBIGEO_COUNTRIES as readonly string[]).includes(o.pais ?? '')
            : o.pais === paisFilter);
        return matchQ && matchE && matchP;
      })
      .sort((a, b) => {
        const va = String(a[sortKey] ?? '');
        const vb = String(b[sortKey] ?? '');
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });
  }, [rows, query, estadoFilter, sortKey, sortDir]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: rows.length };
    ESTADOS.forEach((s) => { c[s] = rows.filter((o) => o.estado === s).length; });
    return c;
  }, [rows]);

  const total = rows.length;
  const pendientes = counts['en_revision'] ?? 0;
  const aprobados = counts['aprobado'] ?? 0;
  const locale = lang === 'es' ? 'es-PE' : lang === 'pt' ? 'pt-BR' : 'en-US';
  const waTemplate = lang === 'es'
    ? 'Hi {name}, your NxinMall store is being set up.'
    : lang === 'pt'
      ? 'Hi {name}, your NxinMall store is being set up.'
      : 'Hi {name}, your NxinMall store is being set up.';
  const downloadTitle = lang === 'es'
    ? 'Descargar JSON'
    : lang === 'pt'
      ? 'Baixar JSON'
      : 'Download JSON';

  const thClass = 'px-3 sm:px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap select-none cursor-pointer hover:text-gray-800 transition-colors';
  const tdClass = 'px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-700 align-top';
  const raw = (selected?.raw_data ?? {}) as Record<string, unknown>;
  const proveedor = ((raw.proveedor ?? {}) as Record<string, unknown>);
  const ubicacion = ((raw.ubicacion ?? {}) as Record<string, unknown>);
  const tienda = ((raw.tienda ?? {}) as Record<string, unknown>);
  const catalogo = ((raw.catalogo ?? {}) as Record<string, unknown>);
  const entrevista = ((catalogo.entrevista ?? {}) as Record<string, unknown>);
  const summary = typeof entrevista.onboardingSummary === 'string' ? entrevista.onboardingSummary : '';
  const mainProducts = Array.isArray(entrevista.produtosPrincipais) ? entrevista.produtosPrincipais : [];
  const openProfile = (o: Onboarding) => { setSelected(o); setDrawerMode('profile'); };
  const openSummary = (o: Onboarding) => { setSelected(o); setDrawerMode('summary'); };
  const closeDrawer = () => { setDrawerMode(null); setSelected(null); };

  async function handleDelete(item: Onboarding) {
    const res = await fetch(`/api/admin/onboardings/${item.id}`, { method: 'DELETE' });
    if (!res.ok) {
      setActionFeedback({ type: 'error', text: lang === 'pt' ? 'Não foi possível excluir o onboarding.' : lang === 'es' ? 'No se pudo eliminar el onboarding.' : 'Could not delete onboarding.' });
      return;
    }
    const data = await res.json();
    const deleted = (data?.deleted as Onboarding | undefined) ?? item;
    setRows((prev) => prev.filter((o) => o.id !== item.id));
    setDeletedHistory((prev) => [deleted, ...prev].slice(0, 10));
    setPendingDelete(null);
    setActionFeedback({ type: 'success', text: lang === 'pt' ? 'Onboarding excluído com sucesso.' : lang === 'es' ? 'Onboarding eliminado con éxito.' : 'Onboarding deleted successfully.' });
  }

  async function handleRestore(item: Onboarding) {
    const res = await fetch('/api/admin/onboardings/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onboarding: item }),
    });
    if (!res.ok) {
      setActionFeedback({ type: 'error', text: lang === 'pt' ? 'Não foi possível restaurar o onboarding.' : lang === 'es' ? 'No se pudo restaurar el onboarding.' : 'Could not restore onboarding.' });
      return;
    }
    const data = await res.json();
    const restored = (data?.restored as Onboarding | undefined) ?? item;
    setRows((prev) => [restored, ...prev]);
    setDeletedHistory((prev) => prev.filter((o) => o.id !== item.id));
    setActionFeedback({ type: 'success', text: lang === 'pt' ? 'Onboarding restaurado com sucesso.' : lang === 'es' ? 'Onboarding restaurado con éxito.' : 'Onboarding restored successfully.' });
  }

  function handlePurgeHistoryItem(item: Onboarding) {
    const msg = lang === 'pt'
      ? 'Deseja remover este item do histórico de excluídos?'
      : lang === 'es'
        ? '¿Deseas eliminar este elemento del historial de eliminados?'
        : 'Do you want to remove this item from deleted history?';
    if (!window.confirm(msg)) return;
    setDeletedHistory((prev) => prev.filter((o) => o.id !== item.id));
    setActionFeedback({ type: 'success', text: lang === 'pt' ? 'Item removido do histórico.' : lang === 'es' ? 'Elemento removido del historial.' : 'Item removed from history.' });
  }

  async function handleSaveEdit(next: Onboarding) {
    setSavingEdit(true);
    const res = await fetch(`/api/admin/onboardings/${next.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: next.nombre,
        empresa: next.empresa,
        ruc: next.ruc,
        email: next.email,
        whatsapp: next.whatsapp,
        pais: next.pais,
        categoria: next.categoria,
        num_productos: next.num_productos,
        productos: next.productos,
      }),
    });
    setSavingEdit(false);
    if (!res.ok) {
      setActionFeedback({ type: 'error', text: lang === 'pt' ? 'Não foi possível salvar o onboarding.' : lang === 'es' ? 'No se pudo guardar el onboarding.' : 'Could not save onboarding.' });
      return;
    }
    setRows((prev) => prev.map((o) => (o.id === next.id ? next : o)));
    setEditing(null);
    setActionFeedback({ type: 'success', text: lang === 'pt' ? 'Onboarding atualizado com sucesso.' : lang === 'es' ? 'Onboarding actualizado con éxito.' : 'Onboarding updated successfully.' });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t.onboardings.section}</p>
          <h1 className="text-xl font-bold text-gray-900">{t.onboardings.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
          <span><span className="font-bold text-gray-800">{total}</span> {t.onboardings.stats.total}</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><span className="font-bold text-amber-700">{pendientes}</span> {t.onboardings.stats.pending}</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><span className="font-bold text-emerald-700">{aprobados}</span> {t.onboardings.stats.approved}</span>
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
            placeholder={t.onboardings.search}
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
              {s === 'todos' ? t.onboardings.all : (t.onboardingStatuses[s] ?? s)}
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
          {UBIGEO_COUNTRIES.map((p) => <option key={p} value={p}>{p}</option>)}
          <option value="otros">{t.countries.others}</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">{t.onboardings.empty}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse">
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
                  const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(waTemplate.replace('{name}', o.nombre))}`;

                  return (
                    <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className={tdClass}>
                        <span className="font-semibold text-gray-900">{o.empresa}</span>
                        {o.pais && <p className="text-[11px] text-gray-400 mt-0.5">{o.pais}</p>}
                        {o.ruc && <p className="text-[11px] text-gray-400">RUC: {o.ruc}</p>}
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
                          {new Date(o.created_at).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: '2-digit' })}
                        </span>
                        <p className="text-[10px] text-gray-300 mt-0.5">{duracionLabel(o.duracion_seg)}</p>
                      </td>
                      <td className={tdClass}>
                        <div className="flex flex-wrap items-center gap-1.5">
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
                            title={downloadTitle}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-brand-900 transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            JSON
                          </a>
                          <button
                            type="button"
                            onClick={() => openProfile(o)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-brand-900 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            {t.onboardings.viewProfile}
                          </button>
                          <button
                            type="button"
                            onClick={() => openSummary(o)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-brand-900 transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            {t.onboardings.viewSummary}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditing(o)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-brand-900 transition-colors"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(o)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
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
            {filtered.length} {t.onboardings.footer} {rows.length} {t.onboardings.title.toLowerCase()}
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
          <p className="text-xs text-gray-400 mt-2">{lang === 'pt' ? 'Nenhum onboarding excluído recentemente.' : lang === 'es' ? 'No hay onboardings eliminados recientemente.' : 'No recently deleted onboardings.'}</p>
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

      {drawerMode && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={closeDrawer} />
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl border-l border-gray-200 flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {drawerMode === 'profile' ? t.onboardings.profileDetailsTitle : t.onboardings.internalSummaryTitle}
                </h3>
                {selected && <p className="text-xs text-gray-400 mt-0.5">{selected.empresa}</p>}
              </div>
              <button type="button" onClick={closeDrawer} className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {drawerMode === 'summary' ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{t.onboardings.internalSummaryTitle}</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{summary || t.onboardings.noData}</p>
                </div>
              ) : (
                <>
                  <section className="rounded-lg border border-gray-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{t.onboardings.sectionCompany}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <p><span className="text-gray-400">Company:</span> {valueOrDash(proveedor.empresa ?? selected?.empresa)}</p>
                      <p><span className="text-gray-400">Contact:</span> {valueOrDash(proveedor.nombre ?? selected?.nombre)}</p>
                      <p><span className="text-gray-400">Email:</span> {valueOrDash(proveedor.email ?? selected?.email)}</p>
                      <p><span className="text-gray-400">WhatsApp:</span> {valueOrDash(proveedor.whatsapp ?? selected?.whatsapp)}</p>
                      <p><span className="text-gray-400">RUC:</span> {valueOrDash(proveedor.ruc ?? selected?.ruc)}</p>
                      <p><span className="text-gray-400">Country:</span> {valueOrDash(proveedor.pais ?? selected?.pais)}</p>
                    </div>
                  </section>

                  <section className="rounded-lg border border-gray-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{t.onboardings.sectionLocation}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <p><span className="text-gray-400">Department:</span> {valueOrDash(ubicacion.departamento)}</p>
                      <p><span className="text-gray-400">Province:</span> {valueOrDash(ubicacion.provincia)}</p>
                      <p><span className="text-gray-400">District:</span> {valueOrDash(ubicacion.distrito)}</p>
                      <p><span className="text-gray-400">Postal code:</span> {valueOrDash(ubicacion.codigoPostal)}</p>
                      <p className="col-span-2"><span className="text-gray-400">Address:</span> {valueOrDash(ubicacion.direccion)}</p>
                      <p className="col-span-2"><span className="text-gray-400">Reference:</span> {valueOrDash(ubicacion.referencia)}</p>
                    </div>
                  </section>

                  <section className="rounded-lg border border-gray-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{t.onboardings.sectionStore}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <p><span className="text-gray-400">Category:</span> {valueOrDash(tienda.categoria ?? selected?.categoria)}</p>
                      <p><span className="text-gray-400">Tagline:</span> {valueOrDash(tienda.tagline)}</p>
                      <p><span className="text-gray-400">Main products:</span> {Array.isArray(mainProducts) && mainProducts.length > 0 ? mainProducts.join(', ') : valueOrDash(selected?.productos)}</p>
                      <p><span className="text-gray-400">Anchor product:</span> {valueOrDash(entrevista.produtoAncora)}</p>
                      <p><span className="text-gray-400">Operation model:</span> {valueOrDash(entrevista.tipoOperacao)}</p>
                      <p><span className="text-gray-400">Monthly capacity:</span> {valueOrDash(entrevista.capacidadeMensalLinha)}</p>
                      <p><span className="text-gray-400">Markets:</span> {valueOrDash(entrevista.mercadosAtendidos)}</p>
                      <p><span className="text-gray-400">Incoterms:</span> {valueOrDash(entrevista.incoterms)}</p>
                      <p className="col-span-2"><span className="text-gray-400">Docs/Certs:</span> {valueOrDash(entrevista.docsCertsVenda)}</p>
                      <p className="col-span-2"><span className="text-gray-400">Differentials:</span> {valueOrDash(entrevista.diferenciais)}</p>
                      <p className="col-span-2"><span className="text-gray-400">Risks:</span> {valueOrDash(entrevista.riscosRestricoes)}</p>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setEditing(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white border-l border-gray-200 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">{lang === 'pt' ? 'Editar onboarding' : lang === 'es' ? 'Editar onboarding' : 'Edit onboarding'}</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {(['nombre', 'empresa', 'ruc', 'email', 'whatsapp', 'pais', 'categoria'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">{field}</label>
                  <input
                    value={(editing[field] ?? '') as string}
                    onChange={(e) => setEditing((prev) => (prev ? { ...prev, [field]: e.target.value } : prev))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              ))}
              {(['num_productos', 'productos'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">{field}</label>
                  <input
                    value={(editing[field] ?? '') as string | number}
                    onChange={(e) => setEditing((prev) => (prev ? { ...prev, [field]: field === 'num_productos' ? Number(e.target.value) || 0 : e.target.value } : prev))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              ))}
              <button
                type="button"
                disabled={savingEdit}
                onClick={() => handleSaveEdit(editing)}
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
                {lang === 'pt' ? 'Excluir onboarding' : lang === 'es' ? 'Eliminar onboarding' : 'Delete onboarding'}
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                {lang === 'pt'
                  ? 'Esta ação não pode ser desfeita. Deseja excluir este onboarding?'
                  : lang === 'es'
                    ? 'Esta acción no se puede deshacer. ¿Deseas eliminar este onboarding?'
                    : 'This action cannot be undone. Do you want to delete this onboarding?'}
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
