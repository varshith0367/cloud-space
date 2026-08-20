import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Zap,
  BookOpen,
  GraduationCap,
  Video,
  Rocket,
  Building2,
  FileCheck,
  ChevronRight,
  Code,
  Globe,
  PenTool,
  ThumbsUp,
  ThumbsDown,
  Download,
  Mic,
  MicOff,
  CornerDownLeft,
  Layers,
  HelpCircle,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { useCloudSpace } from '../../context/CloudSpaceContext';
import { chatWithFilesAI } from '../../services/apiService';

type CopilotMode = 'general' | 'files' | 'code' | 'writer';

export const AIAssistantDrawer: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    files,
    activePersona,
    setPreviewFile,
    currentPlan,
  } = useCloudSpace();

  const [copilotMode, setCopilotMode] = useState<CopilotMode>('general');
  const [inputMessage, setInputMessage] = useState('');
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [ratings, setRatings] = useState<Record<number, 'up' | 'down'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<
    Array<{
      role: 'user' | 'model';
      content: string;
      citations?: string[];
      timestamp: string;
      modelUsed?: string;
    }>
  >([
    {
      role: 'model',
      content: `### Cloud Space Assistant

Connected to your cloud library and Google Gemini 3.7 Flash engine. Available capabilities:

- **Document Analysis**: Query, summarize, and cross-reference documents in your cloud vault.
- **Code & Architecture**: Generate, review, or debug TypeScript, Python, SQL, and infrastructure code.
- **Content & Drafting**: Formulate executive summaries, project proposals, and technical specifications.
- **System Search**: Retrieve files and concepts using natural language semantic queries.

Type a query or select a file to begin analysis.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.7-flash',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isAssistantOpen) return null;

  const activeFile = files.find((f) => f.id === activeFileId) || null;

  const promptSuggestions: Record<CopilotMode, string[]> = {
    general: [
      'Explain how quantum computing differs from classical computers',
      'What are 5 essential principles for effective time management?',
      'How does photosynthesis work step by step?',
      'Give me a 7-day workout and meal prep routine',
    ],
    files: [
      activeFile ? `Summarize key insights and takeaways from "${activeFile.name}"` : 'Summarize all active documents in my cloud library',
      'Extract action items and deadlines from my recent files',
      'Compare our startup pitch deck with the market research notes',
      'Find any security risks or sensitive data in my stored files',
    ],
    code: [
      'Write a TypeScript rate limiter using token bucket algorithm',
      'How do I implement infinite scroll in React with IntersectionObserver?',
      'Write a Python script to parse CSV files and compute aggregates',
      'Explain the difference between SQL transactions and ACID properties',
    ],
    writer: [
      'Draft a professional follow-up email after a client presentation',
      'Write an engaging LinkedIn post about AI and cloud productivity',
      'Create 5 viral video hooks for a product launch',
      'Draft a structured resume executive summary for a lead engineer',
    ],
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInputMessage('');
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: textToSend, timestamp: timeStr },
    ]);
    setIsLoading(true);

    try {
      const res = await chatWithFilesAI({
        message: textToSend,
        history: messages.map((m) => ({ role: m.role, content: m.content })),
        activeFile: copilotMode === 'general' && !activeFileId ? null : activeFile,
        allFiles: files.filter((f) => !f.trashed),
        persona: activePersona,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: res.reply,
          citations: res.citations || (activeFile ? [activeFile.name] : []),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: `### 💡 Cloud Space AI Response\n\nI processed your request regarding **"${textToSend}"**.\n\n- **Comprehensive Answer**: You can ask any question on coding, research, writing, and cloud files.\n- **Status**: Systems operating normally. Feel free to ask more specific questions or upload documents for in-depth analysis!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'model',
        content: `### 🔄 Chat Reset\n\nCloud Space AI Copilot is ready. Ask any general question, request code, or choose a file to analyze.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.7-flash',
      },
    ]);
  };

  const exportChat = () => {
    const chatExport = messages
      .map((m) => `[${m.timestamp}] ${m.role === 'user' ? 'User' : 'Cloud Space AI'}:\n${m.content}\n\n`)
      .join('---\n');
    const blob = new Blob([chatExport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudspace-ai-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setInputMessage((prev) => (prev ? prev + ' ' : '') + 'Explain cloud distributed storage architectures');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      if (!isRecording) {
        setIsRecording(true);
        recognition.start();

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };
      } else {
        setIsRecording(false);
      }
    } catch {
      setIsRecording(false);
    }
  };

  const handleRate = (idx: number, rating: 'up' | 'down') => {
    setRatings((prev) => ({ ...prev, [idx]: rating }));
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-violet-50/90 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/90">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/25">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
              <span>Cloud Space AI Copilot</span>
              <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Universal AI Assistant • Code • Writing • Cloud Files
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={exportChat}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            title="Export Conversation"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={clearChat}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            title="Reset Conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsAssistantOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            title="Close Assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex w-full gap-1 rounded-xl bg-slate-200/60 p-1 dark:bg-slate-800/80">
          <button
            onClick={() => setCopilotMode('general')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1 text-[11px] font-semibold transition-colors ${
              copilotMode === 'general'
                ? 'bg-white text-indigo-600 shadow-2xs dark:bg-slate-700 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Globe className="h-3 w-3" />
            <span>General AI</span>
          </button>
          <button
            onClick={() => setCopilotMode('files')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1 text-[11px] font-semibold transition-colors ${
              copilotMode === 'files'
                ? 'bg-white text-indigo-600 shadow-2xs dark:bg-slate-700 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <FileText className="h-3 w-3" />
            <span>Cloud Files</span>
          </button>
          <button
            onClick={() => setCopilotMode('code')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1 text-[11px] font-semibold transition-colors ${
              copilotMode === 'code'
                ? 'bg-white text-emerald-600 shadow-2xs dark:bg-slate-700 dark:text-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Code className="h-3 w-3" />
            <span>Coding</span>
          </button>
          <button
            onClick={() => setCopilotMode('writer')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1 text-[11px] font-semibold transition-colors ${
              copilotMode === 'writer'
                ? 'bg-white text-rose-600 shadow-2xs dark:bg-slate-700 dark:text-rose-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <PenTool className="h-3 w-3" />
            <span>Writing</span>
          </button>
        </div>
      </div>

      {/* Focus File Selector (Contextual) */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-2 text-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <FileText className="h-3.5 w-3.5 text-indigo-500" />
          <span>Active Context:</span>
        </div>
        <select
          value={activeFileId || ''}
          onChange={(e) => setActiveFileId(e.target.value || null)}
          className="max-w-[260px] truncate rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="">🌐 Universal Mode (All Files & General Intelligence)</option>
          {files
            .filter((f) => !f.trashed)
            .map((f) => (
              <option key={f.id} value={f.id}>
                📄 {f.name} ({f.type})
              </option>
            ))}
        </select>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div className="max-w-[88%] space-y-1.5">
              <div
                className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-800 shadow-2xs dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                ) : (
                  <div className="markdown-body space-y-2 text-xs leading-relaxed [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_h3]:text-sm [&_h4]:font-semibold [&_h4]:text-slate-800 dark:[&_h4]:text-slate-200 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono dark:[&_code]:bg-slate-900 [&_pre]:rounded-xl [&_pre]:bg-slate-950 [&_pre]:p-3 [&_pre]:text-slate-100 [&_pre]:overflow-x-auto">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                )}
              </div>

              {msg.role === 'model' && (
                <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    {msg.citations && msg.citations.length > 0 && (
                      <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                        <FileCheck className="h-3 w-3" /> {msg.citations[0]}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRate(idx, 'up')}
                      className={`hover:text-slate-600 dark:hover:text-slate-200 ${
                        ratings[idx] === 'up' ? 'text-emerald-500 font-bold' : ''
                      }`}
                      title="Good response"
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleRate(idx, 'down')}
                      className={`hover:text-slate-600 dark:hover:text-slate-200 ${
                        ratings[idx] === 'down' ? 'text-rose-500 font-bold' : ''
                      }`}
                      title="Poor response"
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(msg.content, idx)}
                      className="flex items-center gap-0.5 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {copiedIdx === idx ? (
                        <span className="flex items-center gap-0.5 text-emerald-500">
                          <Check className="h-3 w-3" /> Copied
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5">
                          <Copy className="h-3 w-3" /> Copy
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              <Sparkles className="h-4 w-4 animate-spin" />
            </div>
            <span className="font-medium">Gemini 3.7 Flash is analyzing and writing answer...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="border-t border-slate-100 bg-slate-50/80 p-2.5 dark:border-slate-800/80 dark:bg-slate-800/40">
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          <span>Suggested {copilotMode.toUpperCase()} Prompts:</span>
        </div>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {promptSuggestions[copilotMode].slice(0, 4).map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left text-[11px] font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <span className="truncate">{p}</span>
              <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
            title="Voice Input (Speech recognition)"
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              copilotMode === 'code'
                ? 'Ask to write, fix, or explain any code...'
                : copilotMode === 'writer'
                ? 'Ask to draft emails, resumes, blogs, or essays...'
                : copilotMode === 'files'
                ? 'Ask questions about your documents & files...'
                : 'Ask anything (science, coding, math, advice, trivia)...'
            }
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs transition-all hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40"
            title="Send Message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
