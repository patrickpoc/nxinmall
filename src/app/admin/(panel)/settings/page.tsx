'use client';

import { useEffect, useState } from 'react';
import { Shield, Check, AlertCircle, Pencil, X, Globe } from 'lucide-react';
import clsx from 'clsx';
import { useAdminLang } from '@/lib/admin-lang-context';

type Role = 'admin' | 'asesor';

type AdminUser = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  last_sign_in_at: string | null;
};

type Feedback = { type: 'success' | 'error'; msg: string } | null;

function FeedbackMsg({ state }: { state: Feedback }) {
  if (!state) return null;
  return (
    <div className={`flex items-center gap-2 text-xs font-medium mt-2 ${state.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
      {state.type === 'success' ? <Check className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
      {state.msg}
    </div>
  );
}

const labelClass = 'text-[11px] font-black text-brand-900/50 uppercase tracking-[0.15em] mb-1.5 block';
const inputClass = 'w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all';
const btnPrimary = 'px-5 py-2.5 rounded-xl bg-brand-900 text-white text-xs font-bold hover:bg-brand-900/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';

export default function SettingsPage() {
  const { t } = useAdminLang();
  const s = t.settings;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPass, setEditPass] = useState('');
  const [editRole, setEditRole] = useState<Role>('asesor');
  const [editSaving, setEditSaving] = useState(false);
  const [editFeedback, setEditFeedback] = useState<Feedback>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<Role>('asesor');
  const [creating, setCreating] = useState(false);
  const [createFeedback, setCreateFeedback] = useState<Feedback>(null);

  // Language availability config (global, stored in Supabase)
  const [enabledLanguages, setEnabledLanguages] = useState<{ en: boolean; es: boolean; pt: boolean }>({
    en: true,
    es: true,
    pt: true,
  });
  const [defaultLanguage, setDefaultLanguage] = useState<'en' | 'es' | 'pt'>('en');
  const [languagesSaving, setLanguagesSaving] = useState(false);
  const [languagesFeedback, setLanguagesFeedback] = useState<Feedback>(null);

  useEffect(() => {
    loadUsers();
    loadLanguages();
  }, []);

  async function loadUsers() {
    const res = await fetch('/api/admin/users');
    if (res.ok) { const { users } = await res.json(); setUsers(users); }
  }

  async function loadLanguages() {
    try {
      const res = await fetch('/api/settings/languages');
      if (!res.ok) return;
      const data = (await res.json()) as Partial<{ en: boolean; es: boolean; pt: boolean; defaultLanguage: 'en' | 'es' | 'pt' }>;
      setEnabledLanguages((prev) => ({
        en: data.en ?? prev.en,
        es: data.es ?? prev.es,
        pt: data.pt ?? prev.pt,
      }));
      if (data.defaultLanguage && ['en', 'es', 'pt'].includes(data.defaultLanguage)) {
        setDefaultLanguage(data.defaultLanguage);
      }
    } catch {
      // keep defaults on error
    }
  }

  function openEdit(u: AdminUser) {
    setEditingId(u.id); setEditPass(''); setEditRole(u.role); setEditFeedback(null); setConfirmDeleteId(null);
  }

  function closeEdit() {
    setEditingId(null); setEditPass(''); setEditFeedback(null); setConfirmDeleteId(null);
  }

  function roleLabel(r: Role) {
    return r === 'admin' ? s.adminRole : s.advisorRole;
  }

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    if (editPass && editPass.length < 8) { setEditFeedback({ type: 'error', msg: s.errMinChars }); return; }
    setEditSaving(true); setEditFeedback(null);
    const body: Record<string, string> = { role: editRole };
    if (editPass) body.password = editPass;
    const res = await fetch(`/api/admin/users/${editingId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    setEditSaving(false);
    if (!res.ok) {
      setEditFeedback({ type: 'error', msg: data.error ?? s.errSave });
    } else {
      setEditFeedback({ type: 'success', msg: s.updated });
      loadUsers(); setTimeout(closeEdit, 1000);
    }
  }

  async function handleDelete(id: string) {
    if (confirmDeleteId !== id) { setConfirmDeleteId(id); return; }
    setDeleting(true);
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    setDeleting(false);
    if (res.ok) { closeEdit(); loadUsers(); }
    else { const d = await res.json(); setEditFeedback({ type: 'error', msg: d.error ?? s.errDelete }); setConfirmDeleteId(null); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateFeedback(null);
    if (newPassword.length < 8) { setCreateFeedback({ type: 'error', msg: s.errMinChars }); return; }
    setCreating(true);
    const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: newEmail, password: newPassword, full_name: newName, role: newRole }) });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setCreateFeedback({ type: 'error', msg: data.error ?? s.errCreate });
    } else {
      setCreateFeedback({ type: 'success', msg: s.created.replace('{email}', newEmail) });
      setNewName(''); setNewEmail(''); setNewPassword(''); setNewRole('asesor');
      loadUsers();
    }
  }

  function toggleLanguage(code: 'en' | 'es' | 'pt') {
    setEnabledLanguages((prev) => {
      const next = { ...prev, [code]: !prev[code] };
      // Prevent disabling all languages – always keep at least one enabled
      if (!next.en && !next.es && !next.pt) {
        return prev;
      }
      return next;
    });
  }

  async function handleSaveLanguages(e: React.FormEvent) {
    e.preventDefault();
    setLanguagesSaving(true);
    setLanguagesFeedback(null);
    try {
      const res = await fetch('/api/settings/languages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...enabledLanguages, defaultLanguage }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLanguagesFeedback({ type: 'error', msg: data.error ?? 'Could not save language settings.' });
      } else {
        setEnabledLanguages({
          en: data.en ?? true,
          es: data.es ?? true,
          pt: data.pt ?? true,
        });
        if (data.defaultLanguage && ['en', 'es', 'pt'].includes(data.defaultLanguage)) {
          setDefaultLanguage(data.defaultLanguage);
        }
        setLanguagesFeedback({ type: 'success', msg: 'Language availability updated for all visitors.' });
      }
    } catch (err) {
      setLanguagesFeedback({ type: 'error', msg: 'Could not save language settings.' });
    } finally {
      setLanguagesSaving(false);
    }
  }

  const userCount = `${users.length} ${users.length === 1 ? s.userSingular : s.userPlural}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Admin</p>
        <h1 className="text-xl font-bold text-gray-900">{s.title}</h1>
      </div>

      {/* Users card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
          <Shield className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">{s.usersLabel}</h2>
          <span className="ml-auto text-xs text-gray-400">{userCount}</span>
        </div>

        <div className="divide-y divide-gray-50">
          {users.map((u) => (
            <div key={u.id}>
              <div className="flex items-center gap-3 px-5 py-3">
                <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 text-[11px] font-bold shrink-0 uppercase">
                  {(u.full_name || u.email).charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  {u.full_name && <p className="text-xs font-semibold text-gray-900 truncate">{u.full_name}</p>}
                  <p className="text-[11px] text-gray-400 truncate">{u.email}</p>
                </div>
                <span
                  className={clsx(
                    'text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border shrink-0',
                    u.role === 'admin'
                      ? 'bg-brand-50 text-brand-700 border-brand-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  )}
                >
                  {roleLabel(u.role)}
                </span>
                <span
                  className="text-[10px] text-gray-300 whitespace-nowrap hidden sm:block"
                  suppressHydrationWarning
                >
                  {u.last_sign_in_at
                    ? new Date(u.last_sign_in_at).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      })
                    : s.noAccess}
                </span>
                <button
                  type="button"
                  onClick={() => editingId === u.id ? closeEdit() : openEdit(u)}
                  className="ml-1 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  {editingId === u.id ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                </button>
              </div>

              {editingId === u.id && (
                <form onSubmit={handleEditSave} className="mx-4 mb-3 p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col gap-3">
                  <div>
                    <label className={labelClass}>{s.levelLabel}</label>
                    <div className="flex gap-2">
                      {(['admin', 'asesor'] as Role[]).map((r) => (
                        <button key={r} type="button" onClick={() => setEditRole(r)} className={clsx(
                          'flex-1 py-2 rounded-xl text-xs font-bold border transition-all',
                          editRole === r
                            ? r === 'admin' ? 'bg-brand-900 text-white border-brand-900' : 'bg-gray-800 text-white border-gray-800'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                        )}>
                          {roleLabel(r)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      {s.newPassLabel}{' '}
                      <span className="normal-case font-normal text-gray-400">({s.newPassHint})</span>
                    </label>
                    <input type="password" value={editPass} onChange={(e) => setEditPass(e.target.value)} placeholder={s.newPassPlaceholder} className={inputClass} autoComplete="new-password" />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleDelete(u.id)}
                      disabled={deleting}
                      className={clsx(
                        'px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50',
                        confirmDeleteId === u.id ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                      )}
                    >
                      {deleting ? s.deleting : confirmDeleteId === u.id ? s.deleteConfirm : s.deleteBtn}
                    </button>
                    <button type="submit" disabled={editSaving} className={btnPrimary}>
                      {editSaving ? s.saving : s.saveBtn}
                    </button>
                  </div>
                  <FeedbackMsg state={editFeedback} />
                </form>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleCreate} className="p-5 border-t border-gray-100 flex flex-col gap-3">
          <label className={labelClass}>{s.createLabel}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={s.namePlaceholder} className={inputClass} />
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder={s.emailPlaceholder} className={inputClass} required />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={s.passPlaceholder} className={inputClass} autoComplete="new-password" required />
            <div className="flex flex-col gap-1.5">
              <span className={labelClass}>{s.levelLabel}</span>
              <div className="flex gap-2">
                {(['admin', 'asesor'] as Role[]).map((r) => (
                  <button key={r} type="button" onClick={() => setNewRole(r)} className={clsx(
                    'flex-1 py-2 rounded-xl text-xs font-bold border transition-all',
                    newRole === r
                      ? r === 'admin' ? 'bg-brand-900 text-white border-brand-900' : 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  )}>
                    {roleLabel(r)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={creating || !newEmail || !newPassword} className={btnPrimary}>
              {creating ? s.creating : s.createBtn}
            </button>
          </div>
          <FeedbackMsg state={createFeedback} />
        </form>
      </div>

      {/* Languages availability card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
          <Globe className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">Languages</h2>
          <span className="ml-auto text-xs text-gray-400">Landing & onboarding</span>
        </div>

        <form onSubmit={handleSaveLanguages} className="p-5 flex flex-col gap-4">
          <p className="text-xs text-gray-500">
            Choose which languages are available on the public pages. At least one language must remain enabled.
          </p>

          <div className="space-y-3">
            {([
              { code: 'en', label: 'English', description: 'Default language when visitors open the site.' },
              { code: 'es', label: 'Spanish', description: 'Spanish copy for landing and onboarding.' },
              { code: 'pt', label: 'Portuguese', description: 'Portuguese copy for Brazilian suppliers.' },
            ] as const).map((lang) => (
              <label
                key={lang.code}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{lang.label}</p>
                  <p className="text-[11px] text-gray-500">{lang.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleLanguage(lang.code)}
                  className={clsx(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    enabledLanguages[lang.code]
                      ? 'bg-emerald-500'
                      : 'bg-red-500'
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
                      enabledLanguages[lang.code] ? 'translate-x-5' : 'translate-x-1'
                    )}
                  />
                </button>
              </label>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2">
            <span className={labelClass}>Default language</span>
            <p className="text-[11px] text-gray-500 mb-2">
              Visitors without a preferred language will see the site in this language.
            </p>
            <div className="flex flex-wrap gap-2">
              {(['en', 'es', 'pt'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    if (!enabledLanguages[code]) return;
                    setDefaultLanguage(code);
                  }}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                    !enabledLanguages[code]
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : defaultLanguage === code
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400',
                  )}
                >
                  {code === 'en' ? 'English' : code === 'es' ? 'Spanish' : 'Portuguese'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={languagesSaving} className={btnPrimary}>
              {languagesSaving ? 'Saving…' : 'Save languages'}
            </button>
          </div>

          <FeedbackMsg state={languagesFeedback} />
        </form>
      </div>
    </div>
  );
}
