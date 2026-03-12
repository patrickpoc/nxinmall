'use client';

import { useEffect, useState } from 'react';
import { useAdminLang } from '@/lib/admin-lang-context';
import { COPY } from '@/data/landing-content';
import type { Lang } from '@/data/landing-content';
import { SITE_CONTENT_BLOCK_IDS } from '@/lib/site-content-types';
import { ChevronDown, ChevronRight, Save, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';

type BlockId = (typeof SITE_CONTENT_BLOCK_IDS)[number];
const LANGS: Lang[] = ['en', 'es', 'pt'];
const LABELS: Record<Lang, string> = { en: 'English', es: 'Español', pt: 'Português' };

export default function ContentPage() {
  const { t } = useAdminLang();
  const c = t.content;
  const [overrides, setOverrides] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<BlockId | null>('hero');
  const [activeLang, setActiveLang] = useState<Lang>('en');
  const [draft, setDraft] = useState<Record<string, Record<string, Record<string, unknown>>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ block: string; ok: boolean } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/site-content');
        if (res.ok) {
          const data = await res.json();
          setOverrides(data);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Build merged content per block per lang (COPY + overrides), and init draft from it
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

  async function saveBlock(blockId: string) {
    setSaving(blockId);
    setFeedback(null);
    let ok = true;
    for (const lang of LANGS) {
      const body = getDraft(blockId, lang);
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block_id: blockId, lang, content: body }),
      });
      if (!res.ok) ok = false;
    }
    setSaving(null);
    setFeedback({ block: blockId, ok });
    if (ok) setTimeout(() => setFeedback(null), 2500);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 flex justify-center">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Admin</p>
        <h1 className="text-xl font-bold text-gray-900">{c.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{c.subtitle}</p>
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
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {feedback?.block === blockId && (feedback.ok ? c.saved : c.errSave)}
                  </span>
                  <button
                    type="button"
                    onClick={() => saveBlock(blockId)}
                    disabled={saving === blockId}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving === blockId ? c.saving : c.save}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
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
