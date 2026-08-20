import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  File as FileIcon,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Folder,
  FileText,
  Image,
  Code2,
  Layers,
  HardDrive,
  Zap,
} from 'lucide-react';
import { useCloudSpace } from '../../context/CloudSpaceContext';
import { formatBytes } from '../../utils/formatters';

export const UploadModal: React.FC = () => {
  const {
    isUploadModalOpen,
    setIsUploadModalOpen,
    uploadFiles,
    folders,
    activeFolderId,
    currentPlan,
    totalUsedBytes,
    totalPlanBytes,
    remainingBytes,
    isFreePlan,
    setIsUpgradeModalOpen,
  } = useCloudSpace();

  const [selectedFiles, setSelectedFiles] = useState<Array<{ name: string; size: number; content?: string }>>([]);
  const [targetFolder, setTargetFolder] = useState<string | null>(activeFolderId);
  const [autoAI, setAutoAI] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isUploadModalOpen) return null;

  const totalSelectedBytes = selectedFiles.reduce((acc, f) => acc + f.size, 0);
  const exceedsQuota = totalUsedBytes + totalSelectedBytes > totalPlanBytes;

  const processUploadedFiles = async (files: File[]) => {
    const filePromises = files.map((file) => {
      return new Promise<{ name: string; size: number; content?: string }>((resolve) => {
        const isTextLike =
          file.type.startsWith('text/') ||
          file.name.endsWith('.md') ||
          file.name.endsWith('.txt') ||
          file.name.endsWith('.json') ||
          file.name.endsWith('.js') ||
          file.name.endsWith('.ts') ||
          file.name.endsWith('.tsx') ||
          file.name.endsWith('.jsx') ||
          file.name.endsWith('.py') ||
          file.name.endsWith('.html') ||
          file.name.endsWith('.css') ||
          file.name.endsWith('.csv');

        if (isTextLike && file.size < 2 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              name: file.name,
              size: file.size,
              content: typeof reader.result === 'string' ? reader.result : undefined,
            });
          };
          reader.onerror = () => {
            resolve({ name: file.name, size: file.size });
          };
          reader.readAsText(file);
        } else {
          resolve({
            name: file.name,
            size: file.size,
            content: `Binary asset (${file.type || 'unknown type'}, ${formatBytes(file.size)}) stored securely in Cloud Space.`,
          });
        }
      });
    });

    const parsed = await Promise.all(filePromises);
    setSelectedFiles((prev) => [...prev, ...parsed]);
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processUploadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const loadSamplePreset = (presetType: 'student' | 'creator' | 'startup' | 'business') => {
    switch (presetType) {
      case 'student':
        setSelectedFiles([
          {
            name: 'Neuroscience_301_Synaptic_Plasticity_Lecture.md',
            size: 1024 * 34,
            content: `# Synaptic Plasticity & Long-Term Potentiation (LTP)

## Introduction
Synaptic plasticity refers to the biological process by which specific patterns of synaptic activity result in changes in synaptic strength. It is widely considered the cellular basis of learning and memory.

### Key Mechanisms:
1. NMDA receptor activation upon postsynaptic depolarization.
2. Calcium influx triggering CaMKII and PKC pathways.
3. Retrograde messengers (Nitric Oxide) signaling presynaptic glutamate release.`,
          },
        ]);
        break;
      case 'creator':
        setSelectedFiles([
          {
            name: 'YouTube_Series_Episode_12_Soundtrack_Cues.md',
            size: 1024 * 28,
            content: `# Episode 12 Audio & Sound Design Log
- 00:00 - 01:15: Ambient synth rise (Key: D Minor, 110 BPM)
- 02:40: Foley swoosh transition into product showcase
- 08:30: Emotional piano chord progression under closing monologue
- Sound Assets: Mastered in 48kHz / 24-bit PCM.`,
          },
        ]);
        break;
      case 'startup':
        setSelectedFiles([
          {
            name: 'Investor_Update_July_2026_Key_Metrics.md',
            size: 1024 * 42,
            content: `# Cloud Space Monthly Investor Update - July 2026

## 1. High-Level Highlights
- Monthly Recurring Revenue (MRR): $108,000 (+18% MoM)
- Active Paid Workspaces: 1,420
- Net Revenue Retention (NRR): 182%
- Burn Rate: $68,000 / month (18.4 months runway)

## 2. Product Milestones
- Launched real-time Gemini 3.7 Flash semantic indexing
- Deployed European multi-region cold storage replica`,
          },
        ]);
        break;
      case 'business':
        setSelectedFiles([
          {
            name: 'Data_Processing_Addendum_GDPR_Standard.pdf',
            size: 1024 * 512,
            content: `DATA PROCESSING ADDENDUM (DPA) UNDER EU REGULATION 2016/679
1. SCOPE AND APPLICABILITY
This Data Processing Addendum supplements the Cloud Space Master Services Agreement.
Provider acts as a Data Processor under Article 28 of GDPR.

2. SUB-PROCESSORS
Provider maintains technical and organizational measures (TOMs) including AES-256 encryption at rest and TLS 1.3 in transit.`,
          },
        ]);
        break;
    }
  };

  const handleStartUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    const payload = selectedFiles.map((f) => ({
      name: f.name,
      sizeBytes: f.size,
      contentPreview: f.content,
      folderId: targetFolder,
    }));

    await uploadFiles(payload, autoAI);

    clearInterval(interval);
    setUploadProgress(100);
    setTimeout(() => {
      setIsUploading(false);
      setIsUploadModalOpen(false);
      setSelectedFiles([]);
      setUploadProgress(0);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-xl flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Upload to Cloud Space</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Securely store documents, code, images, and video assets.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-8 text-center transition-colors hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-200">
            Drag & drop files here or browse your system
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Supports PDF, DOCX, MD, TXT, JPG, PNG, MP4, Code, ZIP up to 5GB</p>

          <label className="mt-4 cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700">
            <span>Browse Local Files</span>
            <input type="file" multiple onChange={handleFileInputChange} className="hidden" />
          </label>
        </div>

        {/* One-Click Presets for Easy Exploration */}
        <div className="mt-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Quick Add Sample Files:
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <button
              onClick={() => loadSamplePreset('student')}
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300"
            >
              🎓 Student Lecture Note
            </button>
            <button
              onClick={() => loadSamplePreset('creator')}
              className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
            >
              🎨 Creator Audio Cue
            </button>
            <button
              onClick={() => loadSamplePreset('startup')}
              className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
            >
              🚀 Startup Metrics
            </button>
            <button
              onClick={() => loadSamplePreset('business')}
              className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
            >
              🏢 Enterprise DPA
            </button>
          </div>
        </div>

        {/* Selected files queue */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 max-h-36 space-y-1.5 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="text-[10px] font-bold text-slate-400 uppercase">
              Ready to Upload ({selectedFiles.length})
            </div>
            {selectedFiles.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="truncate">{f.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span>{formatBytes(f.size)}</span>
                  <button
                    onClick={() => setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Options: AI Auto Analysis & Target Folder */}
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
          {/* Storage Quota Bar */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-1.5">
                <HardDrive className="h-3.5 w-3.5 text-indigo-500" />
                <span>
                  {currentPlan.name} ({currentPlan.storageGB} GB {isFreePlan ? 'Free Tier' : 'Subscription'})
                </span>
              </div>
              <span>
                {formatBytes(totalUsedBytes + totalSelectedBytes)} / {currentPlan.storageGB} GB
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full transition-all duration-300 ${
                  exceedsQuota ? 'bg-rose-500' : 'bg-indigo-600'
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    ((totalUsedBytes + totalSelectedBytes) / totalPlanBytes) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Quota Exceeded Alert */}
          {exceedsQuota && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="font-bold">50 GB Free Storage Quota Exceeded</div>
                <div className="text-[11px] leading-relaxed text-rose-700 dark:text-rose-300">
                  {isFreePlan
                    ? 'Free user accounts include 50 GB of complimentary cloud storage. To store more files, please subscribe to our Creator (2 TB) or Startup (10 TB) plan.'
                    : 'Your selected files exceed your current storage subscription quota. Please upgrade to a higher tier.'}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setIsUpgradeModalOpen(true);
                  }}
                  className="mt-1 inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-rose-700"
                >
                  <Zap className="h-3 w-3" />
                  <span>Upgrade Subscription for More Storage</span>
                </button>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={autoAI}
              onChange={(e) => setAutoAI(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>Enable Gemini 3.7 Flash Auto-Summarization & Tagging on ingestion</span>
            </div>
          </label>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-500 dark:text-slate-400">Target Folder:</span>
            <select
              value={targetFolder || ''}
              onChange={(e) => setTargetFolder(e.target.value || null)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">My Cloud Space (Root)</option>
              {folders.map((fol) => (
                <option key={fol.id} value={fol.id}>
                  {fol.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload Progress bar if active */}
        {isUploading && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-indigo-600">
              <span>Uploading to NVMe storage cluster...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleStartUpload}
            disabled={selectedFiles.length === 0 || isUploading || exceedsQuota}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
