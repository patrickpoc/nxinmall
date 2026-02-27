'use client';

import { useEffect, useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useAdminLang } from '@/lib/admin-lang-context';
import type { User } from '@supabase/supabase-js';

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

export default function AccountPage() {
  const { t } = useAdminLang();
  const a = t.account;

  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState('');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameFeedback, setNameFeedback] = useState<Feedback>(null);

  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passSaving, setPassSaving] = useState(false);
  const [passFeedback, setPassFeedback] = useState<Feedback>(null);

  useEffect(() => {
    getSupabaseBrowser().auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setFullName((data.user.user_metadata?.full_name as string) ?? '');
      }
    });
  }, []);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setNameSaving(true);
    setNameFeedback(null);
    const { error } = await getSupabaseBrowser().auth.updateUser({ data: { full_name: fullName } });
    setNameSaving(false);
    setNameFeedback(error ? { type: 'error', msg: error.message } : { type: 'success', msg: a.nameUpdated });
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassFeedback(null);
    if (newPass.length < 8) { setPassFeedback({ type: 'error', msg: a.errMinChars }); return; }
    if (newPass !== confirmPass) { setPassFeedback({ type: 'error', msg: a.errNoMatch }); return; }
    setPassSaving(true);
    const { error } = await getSupabaseBrowser().auth.updateUser({ password: newPass });
    setPassSaving(false);
    if (error) {
      setPassFeedback({ type: 'error', msg: error.message });
    } else {
      setPassFeedback({ type: 'success', msg: a.passUpdated });
      setNewPass('');
      setConfirmPass('');
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Admin</p>
        <h1 className="text-xl font-bold text-gray-900">{a.title}</h1>
        {user?.email && <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-6">
        <form onSubmit={handleSaveName} className="flex flex-col gap-2">
          <label className={labelClass}>{a.nameLabel}</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={a.namePlaceholder}
              className={`${inputClass} flex-1`}
            />
            <button type="submit" disabled={nameSaving} className={btnPrimary}>
              {nameSaving ? a.saving : a.saveBtn}
            </button>
          </div>
          <FeedbackMsg state={nameFeedback} />
        </form>

        <div className="border-t border-gray-100" />

        <form onSubmit={handleChangePassword} className="flex flex-col gap-2">
          <label className={labelClass}>{a.passLabel}</label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder={a.newPassPlaceholder}
            className={inputClass}
            autoComplete="new-password"
          />
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder={a.confirmPassPlaceholder}
            className={inputClass}
            autoComplete="new-password"
          />
          <div className="flex justify-end mt-1">
            <button type="submit" disabled={passSaving || !newPass} className={btnPrimary}>
              {passSaving ? a.saving : a.changePassBtn}
            </button>
          </div>
          <FeedbackMsg state={passFeedback} />
        </form>
      </div>
    </div>
  );
}
