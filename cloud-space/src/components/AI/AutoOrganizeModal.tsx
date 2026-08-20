import React, { useState } from 'react';
import {
  X,
  Layers,
  Sparkles,
  FolderPlus,
  ArrowRight,
  Check,
  CheckCircle2,
  AlertTriangle,
  Folder,
  FileText,
  RotateCw,
} from 'lucide-react';
import { useCloudSpace } from '../../context/CloudSpaceContext';
import { autoOrganizeFilesAI } from '../../services/apiService';

export const AutoOrganizeModal: React.FC = () => {
  const {
    isAutoOrganizeModalOpen,
    setIsAutoOrganizeModalOpen,
    files,
    folders,
    createFolder,
    moveFileToFolder,
    renameFile,
    addAuditLogEntry,
  } = useCloudSpace();

  const [isLoading, setIsLoading] = useState(false);
  const [organizeData, setOrganizeData] = useState<{
    recommendedFolders?: Array<{ name: string; reason: string; fileIds: string[] }>;
    namingSuggestions?: Array<{ fileId: string; currentName: string; suggestedName: string; reason: string }>;
    storageOptimizationTips?: string[];
  } | null>(null);

  const [applied, setApplied] = useState(false);

  if (!isAutoOrganizeModalOpen) return null;

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setApplied(false);
    try {
      const data = await autoOrganizeFilesAI(files.filter((f) => !f.trashed));
      setOrganizeData(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyChanges = () => {
    if (!organizeData) return;

    // 1. Create recommended folders and move files
    if (organizeData.recommendedFolders) {
      organizeData.recommendedFolders.forEach((rec) => {
        // Create folder
        const folderId = `folder-auto-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        createFolder(rec.name, '#6366f1', rec.reason);

        // Move files
        if (rec.fileIds && Array.isArray(rec.fileIds)) {
          rec.fileIds.forEach((fId) => {
            // Find existing or newly created folder
            const existingFolder = folders.find((fol) => fol.name.toLowerCase() === rec.name.toLowerCase());
            moveFileToFolder(fId, existingFolder ? existingFolder.id : null);
          });
        }
      });
    }

    // 2. Apply naming suggestions
    if (organizeData.namingSuggestions) {
      organizeData.namingSuggestions.forEach((sugg) => {
        renameFile(sugg.fileId, sugg.suggestedName);
      });
    }

    setApplied(true);
    addAuditLogEntry('AI_AUTO_ORGANIZE_APPLIED', 'Workspace Structure Updated', 'SUCCESS');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                AI Workspace Auto-Organizer
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Gemini analyzes file semantics, dates, and topics to structure your cloud space.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAutoOrganizeModalOpen(false)}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 max-h-[60vh] space-y-4 overflow-y-auto pr-1">
          {!organizeData && !isLoading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/40">
              <Sparkles className="h-8 w-8 text-indigo-500" />
              <h3 className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                Analyze your {files.length} files with Gemini AI
              </h3>
              <p className="mt-1 max-w-sm text-[11px] text-slate-500 dark:text-slate-400">
                Our model will group related lecture notes, pitch assets, media files, and code into clean, coherent folder structures.
              </p>
              <button
                onClick={handleRunAnalysis}
                className="mt-4 flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
              >
                <Sparkles className="h-4 w-4" />
                <span>Run Intelligent Organization Analysis</span>
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-slate-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950">
                <RotateCw className="h-5 w-5 animate-spin" />
              </div>
              <div className="mt-3 font-semibold text-slate-800 dark:text-slate-200">
                Gemini 3.7 Flash is analyzing workspace file taxonomy...
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Evaluating semantic clusters, file relations, and version schemes.</p>
            </div>
          )}

          {organizeData && (
            <div className="space-y-4">
              {/* Folder Recommendations */}
              {organizeData.recommendedFolders && organizeData.recommendedFolders.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Recommended Folder Taxonomy
                  </div>
                  <div className="space-y-2">
                    {organizeData.recommendedFolders.map((rec, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/60"
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                          <div className="flex items-center gap-2">
                            <Folder className="h-4 w-4 text-indigo-500" />
                            <span>{rec.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {rec.fileIds?.length || 0} suggested files
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Naming suggestions */}
              {organizeData.namingSuggestions && organizeData.namingSuggestions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Standardized File Naming Suggestions
                  </div>
                  <div className="space-y-1.5">
                    {organizeData.namingSuggestions.map((sugg, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-slate-800"
                      >
                        <div className="truncate">
                          <div className="text-slate-400 line-through text-[11px] truncate">{sugg.currentName}</div>
                          <div className="font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                            {sugg.suggestedName}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">{sugg.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optimization Tips */}
              {organizeData.storageOptimizationTips && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    <span>Storage Optimization Tips</span>
                  </div>
                  <ul className="mt-1.5 space-y-1 text-[11px]">
                    {organizeData.storageOptimizationTips.map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <div>
            {organizeData && (
              <button
                onClick={handleRunAnalysis}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <RotateCw className="h-3 w-3" /> Re-scan
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoOrganizeModalOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Close
            </button>
            {organizeData && (
              <button
                onClick={handleApplyChanges}
                disabled={applied}
                className={`flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-xs transition-all ${
                  applied
                    ? 'bg-emerald-600'
                    : 'bg-indigo-600 shadow-indigo-500/20 hover:bg-indigo-700'
                }`}
              >
                {applied ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                <span>{applied ? 'Applied Successfully!' : 'Apply AI Organization'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
