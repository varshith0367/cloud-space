import React, { useState } from 'react';
import {
  FileText,
  Image,
  Video,
  Music,
  Code2,
  Table,
  Presentation,
  Archive,
  File,
  Star,
  MoreVertical,
  Sparkles,
  Share2,
  Trash2,
  Download,
  Eye,
  Edit2,
  FolderInput,
  Lock,
  Globe,
  Tag,
} from 'lucide-react';
import { CloudFile } from '../../types/cloudSpace';
import { formatBytes, formatRelativeTime, getCategoryBadgeColor } from '../../utils/formatters';
import { useCloudSpace } from '../../context/CloudSpaceContext';

interface FileItemProps {
  file: CloudFile;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onToggleSelect: () => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  viewMode,
  isSelected,
  onToggleSelect,
}) => {
  const {
    setPreviewFile,
    setShareModalFile,
    trashFile,
    toggleStar,
    renameFile,
    triggerAIAnalysis,
    folders,
    moveFileToFolder,
  } = useCloudSpace();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(file.name);
  const [isMoving, setIsMoving] = useState(false);

  const getFileIcon = () => {
    switch (file.type) {
      case 'doc':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'image':
        return <Image className="h-6 w-6 text-purple-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-rose-500" />;
      case 'audio':
        return <Music className="h-6 w-6 text-amber-500" />;
      case 'code':
        return <Code2 className="h-6 w-6 text-emerald-500" />;
      case 'sheet':
        return <Table className="h-6 w-6 text-green-500" />;
      case 'presentation':
        return <Presentation className="h-6 w-6 text-orange-500" />;
      case 'archive':
        return <Archive className="h-6 w-6 text-slate-500" />;
      default:
        return <File className="h-6 w-6 text-slate-400" />;
    }
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameVal.trim()) {
      renameFile(file.id, renameVal.trim());
      setIsRenaming(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        className={`group relative flex items-center justify-between rounded-xl border px-3 py-2.5 transition-all ${
          isSelected
            ? 'border-indigo-500 bg-indigo-50/70 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/40'
            : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-2xs dark:border-slate-800 dark:bg-slate-800/80 dark:hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
          />

          {/* Star action */}
          <button
            onClick={() => toggleStar(file.id)}
            className="text-slate-400 hover:text-amber-400 transition-colors"
            title={file.starred ? 'Unstar' : 'Star'}
          >
            <Star className={`h-4 w-4 ${file.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          {/* File Icon */}
          <div
            onClick={() => setPreviewFile(file)}
            className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700"
          >
            {getFileIcon()}
          </div>

          {/* Name & Rename */}
          <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setPreviewFile(file)}>
            {isRenaming ? (
              <form onSubmit={handleRenameSubmit} className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={renameVal}
                  autoFocus
                  onChange={(e) => setRenameVal(e.target.value)}
                  className="rounded border border-indigo-400 bg-white px-2 py-0.5 text-xs text-slate-800 focus:outline-none dark:bg-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white"
                >
                  Save
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 truncate">
                <span className="truncate text-xs font-semibold text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400">
                  {file.name}
                </span>
                {file.shareSettings?.isPublic && (
                  <span className="flex items-center gap-0.5 rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <Globe className="h-2.5 w-2.5" /> Shared
                  </span>
                )}
                {file.aiSensitivity === 'Confidential' && (
                  <span className="flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <Lock className="h-2.5 w-2.5" /> Confidential
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{formatBytes(file.sizeBytes)}</span>
              <span>•</span>
              <span>{formatRelativeTime(file.updatedAt)}</span>
              {file.tags && file.tags.length > 0 && (
                <>
                  <span>•</span>
                  <span className="truncate">{file.tags.slice(0, 3).join(', ')}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 pl-2">
          {file.aiSummary && (
            <button
              onClick={() => setPreviewFile(file)}
              className="hidden md:flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
              title={file.aiSummary}
            >
              <Sparkles className="h-3 w-3 text-indigo-500" />
              <span>AI Insights</span>
            </button>
          )}

          <button
            onClick={() => setShareModalFile(file)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            title="Share File"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setPreviewFile(file)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            title="Preview"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-7 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    setPreviewFile(file);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview & AI Chat
                </button>
                <button
                  onClick={() => {
                    triggerAIAnalysis(file.id);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Re-Analyze with AI
                </button>
                <button
                  onClick={() => {
                    setIsRenaming(true);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Rename
                </button>
                <button
                  onClick={() => {
                    setShareModalFile(file);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share Link
                </button>
                <hr className="my-1 border-slate-100 dark:border-slate-700" />
                <button
                  onClick={() => {
                    trashFile(file.id);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Move to Trash
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View Card
  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50/70 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/40'
          : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/90 dark:hover:border-slate-700'
      }`}
    >
      {/* Top row: Checkbox, type badge & actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
          />
          <span
            className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getCategoryBadgeColor(
              file.type
            )}`}
          >
            {file.type}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleStar(file.id)}
            className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
            title={file.starred ? 'Unstar' : 'Star'}
          >
            <Star className={`h-4 w-4 ${file.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-6 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    setPreviewFile(file);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview & Q&A
                </button>
                <button
                  onClick={() => {
                    triggerAIAnalysis(file.id);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                >
                  <Sparkles className="h-3.5 w-3.5" /> AI Analysis
                </button>
                <button
                  onClick={() => {
                    setIsRenaming(true);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Rename
                </button>
                <button
                  onClick={() => {
                    setShareModalFile(file);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
                <hr className="my-1 border-slate-100 dark:border-slate-700" />
                <button
                  onClick={() => {
                    trashFile(file.id);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Trash
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Thumbnail or Icon Area */}
      <div
        onClick={() => setPreviewFile(file)}
        className="my-3 flex h-24 cursor-pointer items-center justify-center rounded-xl bg-slate-50 overflow-hidden transition-colors hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900"
      >
        {file.thumbnailUrl ? (
          <img
            src={file.thumbnailUrl}
            alt={file.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-400">
            {getFileIcon()}
            <span className="text-[10px] font-medium text-slate-400">{file.mimeType.split('/')[1] || file.type}</span>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="space-y-1">
        {isRenaming ? (
          <form onSubmit={handleRenameSubmit} onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={renameVal}
              autoFocus
              onChange={(e) => setRenameVal(e.target.value)}
              className="w-full rounded border border-indigo-400 bg-white px-2 py-0.5 text-xs text-slate-800 focus:outline-none dark:bg-slate-900 dark:text-white"
            />
          </form>
        ) : (
          <div
            onClick={() => setPreviewFile(file)}
            className="cursor-pointer truncate text-xs font-semibold text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
            title={file.name}
          >
            {file.name}
          </div>
        )}

        {/* AI summary teaser */}
        {file.aiSummary ? (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            {file.aiSummary}
          </p>
        ) : (
          <p className="text-[11px] text-slate-400 italic">No AI summary generated yet.</p>
        )}
      </div>

      {/* Footer info & tags */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-400">
        <span>{formatBytes(file.sizeBytes)}</span>
        <span>{formatRelativeTime(file.updatedAt)}</span>
      </div>
    </div>
  );
};
