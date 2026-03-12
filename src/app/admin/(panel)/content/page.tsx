'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAdminLang } from '@/lib/admin-lang-context';
import { COPY } from '@/data/landing-content';
import type { Lang } from '@/data/landing-content';
import { SITE_CONTENT_BLOCK_IDS } from '@/lib/site-content-types';
import { ChevronDown, ChevronRight, Image as ImageIcon, History, RotateCcw, Check, X } from 'lucide-react';
import clsx from 'clsx';
import type { ChangelogEntry } from '@/app/api/admin/site-content/changelog/route';

type BlockId = (typeof SITE_CONTENT_BLOCK_IDS)[number];
const LANGS: Lang[] = ['en', 'es', 'pt'];
const LABELS: Record<Lang, string> = { en: 'English', es: 'Español', pt: 'Português' };

function contentEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function ContentPage() {
  const { t } = useAdminLang();
  const c = t.content;
  const [overrides, setOverrides] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<BlockId | null>('hero');
  const [activeLang, setActiveLang] = useState<Lang>('en');
  const [draft, setDraft] = useState<Record<string, Record<string, Record<string, unknown>>>>({});
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'save' | 'restore'; ok: boolean } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [errorToastFade, setErrorToastFade] = useState(false);

  function loadOverrides() {
    return fetch('/api/admin/site-content').then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setOverrides(data);
      }
    });
  }

  function loadChangelog() {
    return fetch('/api/admin/site-content/changelog').then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setChangelog(data);
      }
    });
  }

  useEffect(() => {
    Promise.all([loadOverrides(), loadChangelog()]).finally(() => setLoading(false));
  }, []);

  function showErrorToast(message: string) {
    setErrorToast(message);
    setErrorToastFade(false);
    setTimeout(() => setErrorToastFade(true), 2000);
    setTimeout(() => {
      setErrorToast(null);
      setErrorToastFade(false);
    }, 2300);
  }

  function getMerged(blockId: string, lang: Lang): Record<string, unknown> {
    const def = (COPY[lang] as Record<string, unknown>)[blockId];
    const ov = overrides[blockId]?.[lang];
    return { ...(def && typeof def === 'object' ? def : {}), ...(ov && typeof ov === 'object' ? ov : {}) };
  }

  function getDraft(blockId: string, lang: Lang): Record<string, unknown> {
    if (draft[blockId]?.[lang]) return draft[blockId][lang];
    return getMerged(blockId, lang);
  }

  function setDraftField(blockId: string, lang: Lang, field: string, value: unknown) {
    setDraft((prev) => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        [lang]: { ...getDraft(blockId, lang), [field]: value },
      },
    }));
  }

  const dirtyBlocks = useMemo(() => {
    return SITE_CONTENT_BLOCK_IDS.filter((blockId) => {
      for (const lang of LANGS) {
        if (!contentEqual(getDraft(blockId, lang), getMerged(blockId, lang))) return true;
      }
      return false;
    });
  }, [overrides, draft]);

  async function saveAllDirty() {
    if (dirtyBlocks.length === 0) return;
    setConfirmOpen(false);
    setSaving(true);
    setFeedback(null);
    let ok = true;
    let lastError: string | null = null;
    for (const blockId of dirtyBlocks) {
      for (const lang of LANGS) {
        const body = getDraft(blockId, lang);
        const res = await fetch('/api/admin/site-content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ block_id: blockId, lang, content: body }),
        });
        if (!res.ok) {
          ok = false;
          try {
            const data = await res.json();
            lastError = typeof data?.error === 'string' ? data.error : res.statusText;
          } catch {
            lastError = res.statusText || 'Error saving';
          }
        }
      }
    }
    setSaving(false);
    setFeedback({ type: 'save', ok });
    if (ok) {
      setDraft({});
      await loadOverrides();
      await loadChangelog();
      setTimeout(() => setFeedback(null), 2500);
    } else {
      showErrorToast(lastError || c.errSave);
      setTimeout(() => setFeedback(null), 2500);
    }
  }

  function cancelDraft() {
    setDraft({});
  }

  async function restoreEntry(id: string) {
    setRestoringId(id);
    const res = await fetch('/api/admin/site-content/changelog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setRestoringId(null);
    if (res.ok) {
      await loadOverrides();
      await loadChangelog();
      setFeedback({ type: 'restore', ok: true });
      setTimeout(() => setFeedback(null), 2500);
    } else {
      setFeedback({ type: 'restore', ok: false });
      try {
        const data = await res.json();
        showErrorToast(typeof data?.error === 'string' ? data.error : res.statusText || c.errSave);
      } catch {
        showErrorToast(res.statusText || c.errSave);
      }
      setTimeout(() => setFeedback(null), 2500);
    }
  }

  function summaryContent(obj: Record<string, unknown>, maxLen = 50): string {
    const str = typeof obj === 'object' && obj !== null
      ? Object.entries(obj).map(([k, v]) => `${k}: ${String(v).slice(0, 30)}`).join(', ')
      : '';
    return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 flex justify-center">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-28">
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Admin</p>
        <h1 className="text-xl font-bold text-gray-900">{c.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{c.subtitle}</p>
        <p className="text-sm text-gray-600 mt-2 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
          {c.infoText}
        </p>
        {feedback && (
          <p className={clsx('text-sm mt-2 font-medium', feedback.ok ? 'text-green-600' : 'text-red-600')}>
            {feedback.type === 'save' && (feedback.ok ? c.saved : c.errSave)}
            {feedback.type === 'restore' && (feedback.ok ? c.restored : c.errSave)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {SITE_CONTENT_BLOCK_IDS.map((blockId) => (
          <div
            key={blockId}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpanded(expanded === blockId ? null : blockId)}
              className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              {expanded === blockId ? (
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              )}
              <span className="font-semibold text-gray-900 capitalize">{c.blocks[blockId] || blockId}</span>
            </button>

            {expanded === blockId && (
              <div className="border-t border-gray-100 p-4">
                <div className="flex gap-1 mb-4 border-b border-gray-100 pb-2">
                  {LANGS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setActiveLang(l)}
                      className={clsx(
                        'text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
                        activeLang === l ? 'bg-brand-100 text-brand-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {LABELS[l]}
                    </button>
                  ))}
                </div>
                <BlockFields
                  blockId={blockId}
                  lang={activeLang}
                  langLabel={LABELS[activeLang]}
                  getDraft={getDraft}
                  setDraftField={setDraftField}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Changelog section */}
      <div className="mt-10 rounded-xl border border-gray-200 bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setChangelogOpen(!changelogOpen)}
          className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
        >
          {changelogOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
          )}
          <History className="w-4 h-4 text-gray-500 shrink-0" />
          <span className="font-semibold text-gray-900">{c.changelogTitle}</span>
        </button>
        {changelogOpen && (
          <div className="border-t border-gray-100 p-4">
            {changelog.length === 0 ? (
              <p className="text-sm text-gray-500">{c.changelogEmpty}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-2 pr-2">{c.who}</th>
                      <th className="pb-2 pr-2">Block</th>
                      <th className="pb-2 pr-2">Lang</th>
                      <th className="pb-2 pr-2 max-w-[120px]">{c.before}</th>
                      <th className="pb-2 pr-2 max-w-[120px]">{c.after}</th>
                      <th className="pb-2">Data</th>
                      <th className="pb-2 w-24"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {changelog.map((entry) => (
                      <tr key={entry.id} className="border-b border-gray-50">
                        <td className="py-2 pr-2 text-gray-700">{entry.changed_by ?? '—'}</td>
                        <td className="py-2 pr-2 font-medium">{entry.block_id}</td>
                        <td className="py-2 pr-2">{entry.lang}</td>
                        <td className="py-2 pr-2 max-w-[120px] truncate text-gray-600" title={summaryContent(entry.content_before, 200)}>
                          {summaryContent(entry.content_before)}
                        </td>
                        <td className="py-2 pr-2 max-w-[120px] truncate text-gray-600" title={summaryContent(entry.content_after, 200)}>
                          {summaryContent(entry.content_after)}
                        </td>
                        <td className="py-2 pr-2 text-gray-500">{new Date(entry.changed_at).toLocaleString()}</td>
                        <td className="py-2">
                          <button
                            type="button"
                            onClick={() => restoreEntry(entry.id)}
                            disabled={restoringId === entry.id}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 disabled:opacity-50"
                          >
                            <RotateCcw className="w-3 h-3" />
                            {c.restore}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating confirm / cancel bar */}
      {dirtyBlocks.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-4 bg-white border-t border-gray-200 shadow-lg px-4 py-3 safe-area-pb">
          <p className="text-sm text-gray-600">
            {c.unsavedChanges}: {dirtyBlocks.map((b) => c.blocks[b] || b).join(', ')}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancelDraft}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
              {c.cancel}
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-900 text-white text-sm font-semibold border-2 border-brand-900 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {saving ? c.saving : c.confirm}
            </button>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={() => setConfirmOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-gray-700">{c.confirmSummary}</p>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              {dirtyBlocks.map((blockId) => (
                <li key={blockId}>{c.blocks[blockId] || blockId} (EN, ES, PT)</li>
              ))}
            </ul>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                {c.cancel}
              </button>
              <button
                type="button"
                onClick={saveAllDirty}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50"
              >
                {saving ? c.saving : c.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error toast: appears on save/restore error, fades out after 2s */}
      {errorToast && (
        <div
          role="alert"
          className={clsx(
            'fixed left-1/2 top-6 z-[70] -translate-x-1/2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 shadow-lg transition-opacity duration-300 max-w-[90vw]',
            errorToastFade ? 'opacity-0' : 'opacity-100'
          )}
        >
          {errorToast}
        </div>
      )}
    </div>
  );
}

function BlockFields({
  blockId,
  lang,
  langLabel,
  getDraft,
  setDraftField,
}: {
  blockId: string;
  lang: Lang;
  langLabel: string;
  getDraft: (b: string, l: Lang) => Record<string, unknown>;
  setDraftField: (b: string, l: Lang, f: string, v: unknown) => void;
}) {
  const data = getDraft(blockId, lang);
  const labelClass = 'block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1';
  const inputClass = 'w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500';

  if (blockId === 'hero') {
    return (
      <div className="rounded-lg bg-gray-50 p-4 space-y-3">
        <p className="text-xs font-bold text-gray-400 mb-2">({langLabel})</p>
        <div>
          <label className={labelClass}>Badge</label>
          <input
            type="text"
            value={(data.badge as string) ?? ''}
            onChange={(e) => setDraftField(blockId, lang, 'badge', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            value={(data.title as string) ?? ''}
            onChange={(e) => setDraftField(blockId, lang, 'title', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Subtitle</label>
          <textarea
            value={(data.subtitle as string) ?? ''}
            onChange={(e) => setDraftField(blockId, lang, 'subtitle', e.target.value)}
            className={inputClass}
            rows={2}
          />
        </div>
        <div>
          <label className={labelClass}>CTA button</label>
          <input
            type="text"
            value={(data.cta as string) ?? ''}
            onChange={(e) => setDraftField(blockId, lang, 'cta', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            <ImageIcon className="w-3.5 h-3.5 inline mr-1" />
            Hero image URL
          </label>
          <input
            type="text"
            placeholder="/visuals/hero_nxinmall.jpg"
            value={(data.imageUrl as string) ?? ''}
            onChange={(e) => setDraftField(blockId, lang, 'imageUrl', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    );
  }

  if (blockId === 'footer') {
    return (
      <div className="rounded-lg bg-gray-50 p-4 space-y-3">
        <p className="text-xs font-bold text-gray-400 mb-2">({langLabel})</p>
        <div>
          <label className={labelClass}>Tagline</label>
          <input
            type="text"
            value={(data.tagline as string) ?? ''}
            onChange={(e) => setDraftField(blockId, lang, 'tagline', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>CTA</label>
          <input
            type="text"
            value={(data.cta as string) ?? ''}
            onChange={(e) => setDraftField(blockId, lang, 'cta', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Admin login link text</label>
          <input
            type="text"
            value={(data.adminLogin as string) ?? ''}
            onChange={(e) => setDraftField(blockId, lang, 'adminLogin', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    );
  }

  if (blockId === 'nav') {
    const nav = data as Record<string, string>;
    return (
      <div className="rounded-lg bg-gray-50 p-4 space-y-3">
        <p className="text-xs font-bold text-gray-400 mb-2">({langLabel})</p>
        {['suppliers', 'process', 'faq', 'cta', 'adminLogin'].map((field) => (
          <div key={field}>
            <label className={labelClass}>{field}</label>
            <input
              type="text"
              value={nav[field] ?? ''}
              onChange={(e) => setDraftField(blockId, lang, field, e.target.value)}
              className={inputClass}
            />
          </div>
        ))}
      </div>
    );
  }

  // Generic: show key-value for object or textarea for complex
  const keys = typeof data === 'object' && data !== null ? Object.keys(data) : [];
  if (keys.length <= 6 && keys.every((k) => typeof (data as Record<string, unknown>)[k] !== 'object')) {
    return (
      <div className="rounded-lg bg-gray-50 p-4 space-y-3">
        <p className="text-xs font-bold text-gray-400 mb-2">({langLabel})</p>
        {keys.map((field) => {
          const val = (data as Record<string, unknown>)[field];
          const str = typeof val === 'string' ? val : JSON.stringify(val ?? '');
          return (
            <div key={field}>
              <label className={labelClass}>{field}</label>
              <input
                type="text"
                value={str}
                onChange={(e) => setDraftField(blockId, lang, field, e.target.value)}
                className={inputClass}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs font-bold text-gray-400 mb-2">({langLabel})</p>
      <textarea
        value={JSON.stringify(data, null, 2)}
        onChange={(e) => {
          try {
            const next = JSON.parse(e.target.value);
            if (typeof next === 'object' && next !== null) {
              Object.keys(next).forEach((k) => setDraftField(blockId, lang, k, next[k]));
            }
          } catch {
            // ignore invalid json while typing
          }
        }}
        className={clsx(inputClass, 'font-mono text-xs min-h-[120px]')}
        rows={8}
      />
    </div>
  );
}
