import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Server,
  ArrowRight,
} from 'lucide-react';
import { useCloudSpace } from '../../context/CloudSpaceContext';

export const AdminAccessModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    isAdminAuthenticated,
    loginAsAdmin,
    logoutAdmin,
    setCurrentView,
  } = useCloudSpace();

  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAdminModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!passcode.trim()) {
      setErrorMsg('Please enter your administrator passkey.');
      return;
    }

    const success = loginAsAdmin(passcode);
    if (success) {
      setSuccessMsg('Administrator privileges unlocked successfully.');
      setPasscode('');
      setTimeout(() => {
        setIsAdminModalOpen(false);
        setSuccessMsg('');
      }, 1000);
    } else {
      setErrorMsg('Incorrect passkey. Default admin passkey is "admin" or "admin2026".');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAdminModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              isAdminAuthenticated 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {isAdminAuthenticated ? <ShieldCheck className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isAdminAuthenticated ? 'Administrator Controls' : 'Admin Security Verification'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isAdminAuthenticated ? 'Elevated privileges active' : 'Restricted infrastructure access'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAdminModalOpen(false);
              setErrorMsg('');
            }}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isAdminAuthenticated ? (
          /* Already Authenticated State */
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <span>You are currently authenticated as Administrator</span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                You have full access to developer telemetry, geo-cluster replicas, audit trails, and CLI diagnostics.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setCurrentView('dev-console');
                  setIsAdminModalOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-indigo-500" />
                  <span>Open Developer Telemetry & CLI</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('dev-nodes');
                  setIsAdminModalOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-emerald-500" />
                  <span>Manage Multi-Region Replicas</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Lock & Sign Out Admin</span>
              </button>
            </div>
          </div>
        ) : (
          /* Enter Passcode State */
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs dark:border-amber-900/50 dark:bg-amber-950/30">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Restricted Access Notice</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-400">
                Developer operations, cluster telemetry, and audit logs are restricted exclusively to verified administrators.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Administrator Passkey:
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  autoFocus
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Hint for demo review: Passkey is <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">admin</code> or <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">admin2026</code>
              </p>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
              >
                <Unlock className="h-3.5 w-3.5" />
                <span>Unlock Developer Option</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
