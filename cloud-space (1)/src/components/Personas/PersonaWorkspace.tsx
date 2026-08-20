import React, { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  Video,
  Rocket,
  Building2,
  Terminal,
  FileText,
  Copy,
  Check,
  Send,
  HelpCircle,
  Play,
  RotateCw,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useCloudSpace } from '../../context/CloudSpaceContext';
import { PERSONA_CONFIGS } from '../../data/seedData';
import { generateContentFromAI } from '../../services/apiService';

export const PersonaWorkspace: React.FC = () => {
  const { activePersona, setActivePersona, files, setPreviewFile } = useCloudSpace();

  const config = PERSONA_CONFIGS[activePersona] || PERSONA_CONFIGS.student;

  const [selectedToolId, setSelectedToolId] = useState<string>(config.recommendedTools[0]?.id || 'study-flashcards');
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const selectedFile = files.find((f) => f.id === selectedFileId) || null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const activeTool = config.recommendedTools.find((t) => t.id === selectedToolId);
      const res = await generateContentFromAI({
        generatorType: activeTool ? activeTool.title : 'Content Generator',
        fileData: selectedFile || files[0],
        customInstructions: customPrompt,
        persona: activePersona,
      });

      setGeneratedOutput(res.result);
    } catch (err: any) {
      setGeneratedOutput('Failed to generate output. Please check connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyResult = () => {
    if (generatedOutput) {
      navigator.clipboard.writeText(generatedOutput);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Persona Hero Banner */}
      <div className={`rounded-3xl border ${config.colorScheme.border} ${config.colorScheme.bgAccent} p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
              <span>Tailored AI Workspace</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
              {config.title}
            </h1>
            <p className="max-w-2xl text-xs text-slate-600 dark:text-slate-300">
              {config.subtitle}
            </p>
          </div>

          {/* Persona Switch Pills */}
          <div className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white/80 p-1.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/80">
            {(['student', 'creator', 'startup', 'business'] as const).map((role) => (
              <button
                key={role}
                onClick={() => {
                  setActivePersona(role);
                  setSelectedToolId(PERSONA_CONFIGS[role].recommendedTools[0].id);
                  setGeneratedOutput(null);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  activePersona === role
                    ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left: Tool Selector & Configuration; Right: Live AI Output Canvas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Config Panel */}
        <div className="space-y-4 lg:col-span-5">
          {/* Tool Cards */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              1. Select Intelligence Engine
            </div>
            <div className="space-y-2">
              {config.recommendedTools.map((tool) => {
                const isSelected = selectedToolId === tool.id;
                return (
                  <div
                    key={tool.id}
                    onClick={() => setSelectedToolId(tool.id)}
                    className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-white shadow-md ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-slate-800'
                        : 'border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-xs text-slate-900 dark:text-white">
                      <span>{tool.title}</span>
                      {isSelected && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{tool.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Source Document Selection */}
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/80">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              2. Source File Grounding
            </div>
            <select
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="">Select a stored file (or all workspace context)</option>
              {files
                .filter((f) => !f.trashed)
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    [{f.type.toUpperCase()}] {f.name}
                  </option>
                ))}
            </select>

            {/* Custom Instructions */}
            <div className="pt-2">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Custom Instructions / Focus Areas (Optional):
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Focus on mitochondrial ATP calculations, or target Series A investors in FinTech..."
                rows={3}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Run Generation'}</span>
            </button>
          </div>
        </div>

        {/* Right Live AI Canvas */}
        <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-800 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Generated Studio Output
              </span>
            </div>

            {generatedOutput && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyResult}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-xs text-slate-400">
                <Sparkles className="h-8 w-8 animate-spin text-indigo-500" />
                <div className="mt-3 font-semibold text-slate-700 dark:text-slate-300">
                  Gemini 3.7 Flash is synthesizing your request...
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Formatting flashcards, executive briefs, or captions directly from document context.
                </p>
              </div>
            ) : generatedOutput ? (
              <div className="prose prose-slate max-w-none text-xs leading-relaxed dark:prose-invert">
                <div className="whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200">
                  {generatedOutput}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-xs text-slate-400">
                <FileText className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                <h3 className="mt-3 font-bold text-slate-700 dark:text-slate-300">Studio Output Canvas</h3>
                <p className="mt-1 max-w-xs text-[11px] text-slate-400">
                  Select a tool on the left and click "Run Generation" to create study flashcards, investor updates, captions, or legal audits.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
