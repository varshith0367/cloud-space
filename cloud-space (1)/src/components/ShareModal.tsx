import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Globe,
  Lock,
  Calendar,
  Shield,
  Send,
  Eye,
  Download,
} from 'lucide-react';
import { useCloudSpace } from '../context/CloudSpaceContext';

export const ShareModal: React.FC = () => {
  const { shareModalFile, setShareModalFile, updateFileShareSettings } = useCloudSpace();

  const [isPublic, setIsPublic] = useState(shareModalFile?.shareSettings?.isPublic || false);
  const [allowDownload, setAllowDownload] = useState(shareModalFile?.shareSettings?.allowDownload ?? true);
  const [password, setPassword] = useState(shareModalFile?.shareSettings?.password || '');
  const [isCopied, setIsCopied] = useState(false);

  if (!shareModalFile) return null;

  const shareUrl = `https://cloudspace.app/share/${shareModalFile.id}?token=${Math.random().toString(36).substr(2, 8)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    updateFileShareSettings(shareModalFile.id, {
      isPublic,
      allowDownload,
      password: password.trim() ? password.trim() : undefined,
    });
    setShareModalFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Share File</h2>
              <p className="max-w-[240px] truncate text-[11px] text-slate-500 dark:text-slate-400">
                {shareModalFile.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShareModalFile(null)}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Share Link Copy Box */}
        <div className="mt-4 space-y-3">
          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            Shareable Secure Link:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700"
            >
              {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Access Settings */}
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-500" />
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">Public Link Access</div>
                <div className="text-[10px] text-slate-400">Anyone with the link can view</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-blue-500" />
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">Allow Direct Download</div>
                <div className="text-[10px] text-slate-400">Allow viewers to export original binary</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={allowDownload}
              onChange={(e) => setAllowDownload(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-semibold">Password Protection (Optional):</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set access passcode..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <button
            onClick={() => setShareModalFile(null)}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
