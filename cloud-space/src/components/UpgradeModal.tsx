import React from 'react';
import {
  X,
  Check,
  Zap,
  Sparkles,
  HardDrive,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useCloudSpace } from '../context/CloudSpaceContext';
import { STORAGE_PLANS } from '../data/seedData';

export const UpgradeModal: React.FC = () => {
  const {
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    currentPlan,
    upgradePlan,
    addAuditLogEntry,
  } = useCloudSpace();

  if (!isUpgradeModalOpen) return null;

  const handleSelectPlan = (plan: typeof currentPlan) => {
    upgradePlan(plan.id);
    setIsUpgradeModalOpen(false);
    addAuditLogEntry('PLAN_UPGRADED', `Switched tier to ${plan.name} (${plan.storageGB} GB)`, 'SUCCESS');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
              <span>Scalable Storage & AI Tiers</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Upgrade Your Cloud Space
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Pick the right capacity for students, creators, startups, and growing enterprises.
            </p>
          </div>
          <button
            onClick={() => setIsUpgradeModalOpen(false)}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Plans Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STORAGE_PLANS.map((plan) => {
            const isCurrent = currentPlan.id === plan.id;
            return (
              <div
                key={plan.id}
                className={`flex flex-col justify-between rounded-3xl border p-5 transition-all ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                    {plan.badge && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                        {plan.badge}
                      </span>
                    )}
                    {isCurrent && !plan.badge && (
                      <span className="rounded bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      ${plan.priceMonthly}
                    </span>
                    <span className="text-xs text-slate-500">
                      {plan.priceMonthly === 0 ? 'Forever Free' : '/month'}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <HardDrive className="h-3.5 w-3.5" />
                    <span>
                      {plan.storageGB >= 1024 ? `${plan.storageGB / 1024} TB` : `${plan.storageGB} GB`} Storage
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-tight">
                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent}
                  className={`mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400 cursor-default'
                      : 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700'
                  }`}
                >
                  <span>{isCurrent ? 'Current Plan' : 'Select Plan'}</span>
                  {!isCurrent && <ArrowRight className="h-3.5 w-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
