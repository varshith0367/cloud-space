import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Share2,
  Download,
  Trash2,
  Star,
  Send,
  Lock,
  Tag,
  Copy,
  Check,
  FileText,
  Code2,
  Image as ImageIcon,
  Clock,
  Shield,
  Bot,
  RotateCw,
  Plus,
} from 'lucide-react';
import { useCloudSpace } from '../../context/CloudSpaceContext';
import { formatBytes, formatDate } from '../../utils/formatters';
import { chatWithFilesAI } from '../../services/apiService';

export const FilePreviewModal: React.FC = () => {
  const {
    previewFile,
    setPreviewFile,
    setShareModalFile,
    trashFile,
    toggleStar,
    triggerAIAnalysis,
    updateFileTags,
    activePersona,
  } = useCloudSpace();

  const [aiTab, setAiTab] = useState<'summary' | 'chat' | 'tags'>('summary');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'model'; content: string }>>([
    {
      role: 'model',
      content: `Hello! I'm Cloud Space AI. You can ask me anything about "${previewFile?.name}". I can summarize sections, write code, extract metrics, or answer detailed questions.`,
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  if (!previewFile) return null;

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || isChatLoading) return;

    const userText = chatMessage.trim();
    setChatMessage('');
    setChatHistory((prev) => [...prev, { role: 'user', content: userText }]);
    setIsChatLoading(true);

    try {
      const res = await chatWithFilesAI({
        message: userText,
        history: chatHistory,
        activeFile: previewFile,
        persona: activePersona,
      });

      setChatHistory((prev) => [...prev, { role: 'model', content: res.reply }]);
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'model', content: 'Sorry, I encountered an issue analyzing the document context.' },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.trim().replace(/^#/, '');
    if (!previewFile.tags.includes(cleanTag)) {
      updateFileTags(previewFile.id, [...previewFile.tags, cleanTag]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateFileTags(
      previewFile.id,
      previewFile.tags.filter((t) => t !== tagToRemove)
    );
  };

  const copyContent = () => {
    if (previewFile.contentPreview) {
      navigator.clipboard.writeText(previewFile.contentPreview);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/80">
          <div className="flex items-center gap-3 truncate">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <FileText className="h-5 w-5" />
            </div>
            <div className="truncate">
              <h2 className="truncate text-sm font-bold text-slate-900 dark:text-white" title={previewFile.name}>
                {previewFile.name}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span>{formatBytes(previewFile.sizeBytes)}</span>
                <span>•</span>
                <span>Version {previewFile.version}</span>
                <span>•</span>
                <span>Updated {formatDate(previewFile.updatedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleStar(previewFile.id)}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-amber-400 dark:hover:bg-slate-700"
              title={previewFile.starred ? 'Starred' : 'Star'}
            >
              <Star className={`h-4 w-4 ${previewFile.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => {
                setShareModalFile(previewFile);
              }}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Share2 className="h-3.5 w-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={copyContent}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              title="Copy Content"
            >
              {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={() => setPreviewFile(null)}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body (Split: Content Viewer + AI Inspector) */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">
          {/* Left / Main: File Content Display */}
          <div className="flex flex-col border-b border-slate-200 bg-slate-50/50 p-5 overflow-y-auto dark:border-slate-800 dark:bg-slate-950/50 lg:col-span-7 lg:border-b-0 lg:border-r">
            {previewFile.thumbnailUrl ? (
              <div className="flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-black/10 p-2 dark:bg-black/40">
                <img
                  src={previewFile.thumbnailUrl}
                  alt={previewFile.name}
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] rounded-xl object-contain shadow-lg"
                />
              </div>
            ) : previewFile.type === 'code' ? (
              <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-slate-100 dark:border-slate-800 overflow-x-auto">
                <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{previewFile.name}</span>
                  </div>
                  <span>{previewFile.metadata?.linesOfCode || 45} lines</span>
                </div>
                <pre className="whitespace-pre font-mono leading-relaxed">
                  {previewFile.contentPreview || '// No source code available'}
                </pre>
              </div>
            ) : (
              <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-800">
                <article className="prose prose-slate max-w-none text-xs leading-relaxed dark:prose-invert">
                  <div className="whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200">
                    {previewFile.contentPreview || 'No content preview available for this binary file format.'}
                  </div>
                </article>
              </div>
            )}
          </div>

          {/* Right: AI Intelligence Panel & Q&A */}
          <div className="flex flex-col bg-white overflow-hidden dark:bg-slate-900 lg:col-span-5">
            {/* Panel Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 dark:border-slate-800 dark:bg-slate-800/50">
              <button
                onClick={() => setAiTab('summary')}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold transition-colors ${
                  aiTab === 'summary'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Summary</span>
              </button>

              <button
                onClick={() => setAiTab('chat')}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold transition-colors ${
                  aiTab === 'chat'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Bot className="h-3.5 w-3.5" />
                <span>Chat with File</span>
              </button>

              <button
                onClick={() => setAiTab('tags')}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold transition-colors ${
                  aiTab === 'tags'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Tag className="h-3.5 w-3.5" />
                <span>Tags & Meta</span>
              </button>
            </div>

            {/* Tab: AI Summary */}
            {aiTab === 'summary' && (
              <div className="flex-1 space-y-4 p-4 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    Gemini 3.7 Intelligence
                  </span>
                  <button
                    onClick={() => triggerAIAnalysis(previewFile.id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    <RotateCw className="h-3 w-3" /> Re-generate
                  </button>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3.5 text-xs text-indigo-950 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-200">
                  <p className="leading-relaxed">
                    {previewFile.aiSummary || 'Click Re-generate to extract instant summary with Gemini 3.7 Flash.'}
                  </p>
                </div>

                {previewFile.aiTakeaways && previewFile.aiTakeaways.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Key Takeaways & Insights</div>
                    <ul className="space-y-1.5">
                      {previewFile.aiTakeaways.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick Persona Action */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/60">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Recommended Persona Action ({activePersona})
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Switch to Chat tab to ask specific questions, generate flashcards, or convert to business summaries.
                  </p>
                  <button
                    onClick={() => setAiTab('chat')}
                    className="mt-2 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Start File Chat →
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Chat with File */}
            {aiTab === 'chat' && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 space-y-3 p-4 overflow-y-auto">
                  {chatHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2.5 ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {item.role === 'model' && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          item.role === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {item.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                      </div>
                      <span>Cloud Space AI is analyzing document...</span>
                    </div>
                  )}
                </div>

                {/* Chat Input form */}
                <form onSubmit={handleSendChat} className="border-t border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder={`Ask questions about ${previewFile.name}...`}
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={!chatMessage.trim() || isChatLoading}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab: Tags & Meta */}
            {aiTab === 'tags' && (
              <div className="flex-1 space-y-4 p-4 overflow-y-auto">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Associated Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {previewFile.tags.map((t) => (
                      <span
                        key={t}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <span>#{t}</span>
                        <button
                          onClick={() => handleRemoveTag(t)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddTag} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Add tag (e.g. Research, Q3)..."
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={!newTagInput.trim()}
                      className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </button>
                  </form>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Metadata details */}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">Storage Information</div>
                  <div className="space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>MIME Type:</span>
                      <span className="font-mono">{previewFile.mimeType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File Size:</span>
                      <span>{formatBytes(previewFile.sizeBytes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span>{previewFile.aiCategory || previewFile.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sensitivity:</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {previewFile.aiSensitivity || 'Internal'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
