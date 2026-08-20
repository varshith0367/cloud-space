import React, { useState, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  Sparkles,
  Trash2,
  Share2,
  FolderInput,
  Tag,
  CheckSquare,
  X,
  UploadCloud,
  FileQuestion,
  Search,
  ArrowRight,
  MoreVertical,
  Plus,
} from 'lucide-react';
import { useCloudSpace } from '../../context/CloudSpaceContext';
import { FileItem } from './FileItem';
import { BreadcrumbNav } from './BreadcrumbNav';
import { CloudFile, CloudFolder, SemanticSearchResult } from '../../types/cloudSpace';

export const FileGrid: React.FC = () => {
  const {
    files,
    folders,
    activeFolderId,
    setActiveFolderId,
    currentView,
    selectedFileIds,
    toggleSelectFile,
    selectAllFiles,
    clearSelection,
    trashFile,
    triggerAIAnalysis,
    semanticResults,
    setSemanticResults,
    searchQuery,
    setSearchQuery,
    activeCategoryFilter,
    setIsUploadModalOpen,
    moveFileToFolder,
    deleteFolder,
    setPreviewFile,
  } = useCloudSpace();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [batchMoveOpen, setBatchMoveOpen] = useState(false);

  // Filter & Sort Logic
  const filteredFiles = useMemo(() => {
    let result = files;

    // View specific filtering
    if (currentView === 'trash') {
      return result.filter((f) => f.trashed);
    } else {
      result = result.filter((f) => !f.trashed);
    }

    if (currentView === 'starred') {
      result = result.filter((f) => f.starred);
    } else if (currentView === 'shared') {
      result = result.filter((f) => f.shareSettings?.isPublic);
    } else if (currentView === 'recent') {
      // Sort by updatedAt descending
      return [...result].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else {
      // Normal 'files' or folder view
      if (activeFolderId !== null) {
        result = result.filter((f) => f.folderId === activeFolderId);
      }
    }

    // Category filter
    if (activeCategoryFilter) {
      result = result.filter((f) => f.type === activeCategoryFilter);
    }

    // Semantic search active filter
    if (semanticResults && semanticResults.length > 0) {
      const matchMap = new Map<string, SemanticSearchResult>(semanticResults.map((r) => [r.id, r]));
      result = result.filter((f) => matchMap.has(f.id));
      return result.sort((a, b) => {
        const scoreA = matchMap.get(a.id)?.relevanceScore || 0;
        const scoreB = matchMap.get(b.id)?.relevanceScore || 0;
        return scoreB - scoreA;
      });
    }

    // Standard sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return b.sizeBytes - a.sizeBytes;
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [files, currentView, activeFolderId, activeCategoryFilter, semanticResults, sortBy]);

  // Folders to show (only when in root or folder tree)
  const visibleFolders = useMemo(() => {
    if (currentView === 'trash' || currentView === 'starred' || currentView === 'shared' || semanticResults) {
      return [];
    }
    if (activeFolderId === null) {
      return folders.filter((f) => f.parentId === null);
    }
    return folders.filter((f) => f.parentId === activeFolderId);
  }, [folders, activeFolderId, currentView, semanticResults]);

  // Batch actions
  const handleBatchAIAnalysis = async () => {
    for (const id of selectedFileIds) {
      await triggerAIAnalysis(id);
    }
    clearSelection();
  };

  const handleBatchTrash = () => {
    selectedFileIds.forEach((id) => trashFile(id));
    clearSelection();
  };

  const handleBatchMove = (targetFolderId: string | null) => {
    selectedFileIds.forEach((id) => moveFileToFolder(id, targetFolderId));
    setBatchMoveOpen(false);
    clearSelection();
  };

  return (
    <div className="space-y-4">
      {/* Header controls & Breadcrumbs */}
      <BreadcrumbNav
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Semantic Search Match Banner */}
      {semanticResults && semanticResults.length > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-3.5 dark:border-indigo-800 dark:bg-indigo-950/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                AI Semantic Search: "{searchQuery}"
              </div>
              <div className="text-[11px] text-indigo-700 dark:text-indigo-300">
                Found {semanticResults.length} relevant files ranked by contextual meaning and concept similarity.
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setSemanticResults(null);
              setSearchQuery('');
            }}
            className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
          >
            <X className="h-3 w-3" /> Reset View
          </button>
        </div>
      )}

      {/* Batch Operations Floating Bar */}
      {selectedFileIds.length > 0 && (
        <div className="sticky top-20 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-900 p-3 text-white shadow-xl dark:border-indigo-700">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckSquare className="h-4 w-4 text-indigo-300" />
            <span>{selectedFileIds.length} file(s) selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchAIAnalysis}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Batch AI Analysis</span>
            </button>

            {/* Move to folder */}
            <div className="relative">
              <button
                onClick={() => setBatchMoveOpen(!batchMoveOpen)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                <FolderInput className="h-3.5 w-3.5" />
                <span>Move to...</span>
              </button>

              {batchMoveOpen && (
                <div className="absolute right-0 top-9 z-30 w-52 rounded-xl border border-slate-700 bg-slate-800 p-1.5 shadow-2xl">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">Select Target</div>
                  <button
                    onClick={() => handleBatchMove(null)}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
                  >
                    <Folder className="h-3.5 w-3.5 text-slate-400" /> My Cloud Space (Root)
                  </button>
                  {folders.map((fol) => (
                    <button
                      key={fol.id}
                      onClick={() => handleBatchMove(fol.id)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: fol.color }} />
                      <span className="truncate">{fol.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleBatchTrash}
              className="flex items-center gap-1.5 rounded-xl bg-red-600/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Trash</span>
            </button>

            <button
              onClick={clearSelection}
              className="rounded-lg p-1 text-slate-300 hover:text-white"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Folders Section (if any visible) */}
      {visibleFolders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Folders ({visibleFolders.length})</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {visibleFolders.map((fol) => (
              <div
                key={fol.id}
                onClick={() => setActiveFolderId(fol.id)}
                className="group relative flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/80 dark:hover:border-slate-700"
              >
                <div className="flex items-center gap-2.5 truncate min-w-0">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-2xs"
                    style={{ backgroundColor: fol.color }}
                  >
                    <Folder className="h-5 w-5 fill-white/20" />
                  </div>
                  <div className="truncate">
                    <div className="truncate text-xs font-semibold text-slate-800 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">
                      {fol.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {files.filter((f) => f.folderId === fol.id && !f.trashed).length} files
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>
            {currentView === 'trash'
              ? 'Trashed Files'
              : currentView === 'starred'
              ? 'Starred Files'
              : currentView === 'shared'
              ? 'Shared Links'
              : 'Files'}{' '}
            ({filteredFiles.length})
          </span>
          {filteredFiles.length > 0 && (
            <button
              onClick={selectAllFiles}
              className="text-[11px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Select All
            </button>
          )}
        </div>

        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 py-12 px-4 text-center dark:border-slate-700 dark:bg-slate-900/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <FileQuestion className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">No files found</h3>
            <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              {currentView === 'trash'
                ? 'Trash bin is empty.'
                : currentView === 'starred'
                ? 'No starred assets yet. Star files to find them quickly.'
                : 'Upload documents, code, or media files to activate AI semantic search and automated workflows.'}
            </p>
            {currentView !== 'trash' && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-4 flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload to Cloud Space</span>
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredFiles.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                viewMode="grid"
                isSelected={selectedFileIds.includes(file.id)}
                onToggleSelect={() => toggleSelectFile(file.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                viewMode="list"
                isSelected={selectedFileIds.includes(file.id)}
                onToggleSelect={() => toggleSelectFile(file.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
