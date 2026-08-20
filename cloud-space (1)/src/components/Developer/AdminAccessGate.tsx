import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Terminal,
  ArrowLeft,
} from 'lucide-react';
import { useCloudSpace } from '../../context/CloudSpaceContext';

export const AdminAccessGate: React.FC<{ targetViewName?: string }> = ({ targetViewName = 'Developer Area' }) => {
  const { loginAsAdmin, setCurrentView } = useCloudSpace();
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!passcode.trim()) {
      setErrorMsg('Please provide the administrator passkey.');
      return;
    }

    const success = loginAsAdmin(passcode);
    if (!success) {
      setErrorMsg('Access Denied: Invalid administrator passkey. Please check credentials.');
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
        {/* Security Shield Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Restricted Access: Administrator Privileges Required
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Access to <span className="font-semibold text-slate-700 dark:text-slate-200">{targetViewName}</span> is restricted exclusively to authorized Cloud Space system administrators.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Administrator Master Passkey
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <KeyRound className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter admin passkey (e.g. admin or admin2026)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Demo Administrator passkey: <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">admin</code></span>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentView('files')}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Vault</span>
            </button>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700"
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>Verify & Unlock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
