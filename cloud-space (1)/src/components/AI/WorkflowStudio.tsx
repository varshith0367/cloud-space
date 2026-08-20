import React, { useState } from 'react';
import {
  Workflow,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Shield,
  Server,
  FileText,
  AlertCircle,
  Plus,
  RotateCw,
  Zap,
} from 'lucide-react';
import { useCloudSpace } from '../../context/CloudSpaceContext';

export const WorkflowStudio: React.FC = () => {
  const { files, addAuditLogEntry } = useCloudSpace();

  const [workflows, setWorkflows] = useState([
    {
      id: 'wf-1',
      name: 'Real-Time Gemini 3.7 Semantic Vector Indexing',
      description: 'Automatically creates contextual embeddings and indexes new documents for instant natural language queries.',
      trigger: 'On Every File Upload',
      status: 'Active',
      lastRun: '2 minutes ago',
      runsCount: 142,
      category: 'AI Pipeline',
      icon: Sparkles,
      color: 'bg-indigo-500',
    },
    {
      id: 'wf-2',
      name: 'Automated Academic Flashcard & Study Digest Generation',
      description: 'Extracts core definitions, formulas, and test questions from lecture markdown files into flashcard sets.',
      trigger: 'On Study Note Added',
      status: 'Active',
      lastRun: '15 minutes ago',
      runsCount: 38,
      category: 'Student Hub',
      icon: FileText,
      color: 'bg-emerald-500',
    },
    {
      id: 'wf-3',
      name: 'Multi-Region Geo-Replication & AES-256 Encryption',
      description: 'Replicates files across US-East-1, EU-Central-1, and AP-South-1 with end-to-end encrypted zero-knowledge keys.',
      trigger: 'Hourly Synchronous Sync',
      status: 'Active',
      lastRun: '5 minutes ago',
      runsCount: 720,
      category: 'Infrastructure',
      icon: Server,
      color: 'bg-blue-500',
    },
    {
      id: 'wf-4',
      name: 'Contract Liability & SOC2 Sensitivity Scanner',
      description: 'Scans uploaded PDFs for PII, high financial liability caps, and confidentiality classification.',
      trigger: 'On Legal/Financial Upload',
      status: 'Active',
      lastRun: '1 hour ago',
      runsCount: 19,
      category: 'Compliance',
      icon: Shield,
      color: 'bg-amber-500',
    },
  ]);

  const [runningId, setRunningId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleTriggerWorkflow = (id: string, name: string) => {
    setRunningId(id);
    setTimeout(() => {
      setRunningId(null);
      setSuccessId(id);
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, runsCount: w.runsCount + 1, lastRun: 'Just now' } : w
        )
      );
      addAuditLogEntry('WORKFLOW_TRIGGERED', `Workflow "${name}" executed successfully`, 'SUCCESS');
      setTimeout(() => setSuccessId(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 p-6 dark:border-indigo-900/50 dark:bg-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Zap className="h-4 w-4" />
              <span>Intelligent Automation</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
              Automated Cloud Workflows
            </h1>
            <p className="mt-1 max-w-xl text-xs text-slate-600 dark:text-slate-300">
              Configure event-driven AI pipelines, multi-region backups, and compliance scans that trigger automatically on your files.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              4 Active Workflows
            </span>
          </div>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {workflows.map((wf) => {
          const Icon = wf.icon;
          const isRunning = runningId === wf.id;
          const isSuccess = successId === wf.id;

          return (
            <div
              key={wf.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-800/90"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${wf.color} text-white shadow-sm`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        {wf.category}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">{wf.name}</h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {wf.status}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {wf.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Trigger: </span>
                    <span>{wf.trigger}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Last Run: </span>
                    <span>{wf.lastRun}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Total Executions: </span>
                    <span>{wf.runsCount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700/60">
                <div className="text-[11px] text-slate-400">
                  Automatic execution upon trigger condition
                </div>

                <button
                  onClick={() => handleTriggerWorkflow(wf.id, wf.name)}
                  disabled={isRunning}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    isSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <RotateCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-white" />
                      <span>Trigger Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
