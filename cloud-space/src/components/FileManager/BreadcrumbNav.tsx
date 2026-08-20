import React, { useState } from 'react';
import {
  ChevronRight,
  FolderPlus,
  Upload,
  LayoutGrid,
  List,
  Filter,
  Sparkles,
  Layers,
  ArrowUpDown,
  Home,
  Check,
} from 'lucide-react';
import { useCloudSpace } from '../../context/CloudSpaceContext';

interface BreadcrumbNavProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortBy: 'name' | 'date' | 'size' | 'type';
  setSortBy: (sort: 'name' | 'date' | 'size' | 'type') => void;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
}) => {
  const {
    activeFolderId,
    setActiveFolderId,
    folders,
    createFolder,
    setIsUploadModalOpen,
    setIsAutoOrganizeModalOpen,
    activeCategoryFilter,
    setActiveCategoryFilter,
    currentView,
  } = useCloudSpace();

  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#6366f1');

  const activeFolder = folders.find((f) => f.id === activeFolderId);

  const categories = [
    { id: null, label: 'All Files' },
    { id: 'doc', label: 'Documents' },
    { id: 'image', label: 'Media' },
    { id: 'code', label: 'Code' },
    { id: 'sheet', label: 'Sheets' },
    { id: 'presentation', label: 'Decks' },
  ];

  const colors = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim(), newFolderColor);
    setNewFolderName('');
    setIsNewFolderOpen(false);
  };

  return (
    <div className="space-y-3 pb-2">
      {/* Top row: Path Breadcrumbs and Primary Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Breadcrumb path */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveFolderId(null)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Home className="h-3.5 w-3.5" />
            <span>My Cloud Space</span>
          </button>

          {activeFolder && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-1 text-slate-900 dark:bg-slate-800 dark:text-white">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeFolder.color }} />
                <span>{activeFolder.name}</span>
              </div>
            </>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* New Folder trigger */}
          <div className="relative">
            <button
              onClick={() => setIsNewFolderOpen(!isNewFolderOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <FolderPlus className="h-3.5 w-3.5 text-indigo-500" />
              <span>New Folder</span>
            </button>

            {isNewFolderOpen && (
              <form
                onSubmit={handleCreateFolderSubmit}
                className="absolute right-0 top-9 z-20 w-72 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-white">Create New Folder</div>
                <input
                  type="text"
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder Name (e.g. Research Papers)..."
                  className="mt-2.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewFolderColor(c)}
                        style={{ backgroundColor: c }}
                        className={`h-4 w-4 rounded-full transition-transform ${
                          newFolderColor === c ? 'scale-125 ring-2 ring-indigo-500 ring-offset-1' : 'opacity-80'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsNewFolderOpen(false)}
                      className="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newFolderName.trim()}
                      className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Quick Upload */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Upload className="h-3.5 w-3.5 text-indigo-500" />
            <span>Upload</span>
          </button>

          {/* View mode toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs dark:border-slate-700 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-100 text-indigo-600 dark:bg-slate-700 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-100 text-indigo-600 dark:bg-slate-700 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="List View"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Category Chips & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const isSelected = activeCategoryFilter === cat.id;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <ArrowUpDown className="h-3 w-3 text-slate-400" />
          <span className="text-[11px]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="date">Last Modified</option>
            <option value="name">Name</option>
            <option value="size">File Size</option>
            <option value="type">File Type</option>
          </select>
        </div>
      </div>
    </div>
  );
};
