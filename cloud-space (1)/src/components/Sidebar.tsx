import React from 'react';
import {
  FolderOpen,
  FolderTree,
  Share2,
  Star,
  Clock,
  Trash2,
  Sparkles,
  Layers,
  Workflow,
  Terminal,
  Server,
  ShieldCheck,
  HardDrive,
  ArrowUpRight,
  GraduationCap,
  Video,
  Rocket,
  Building2,
  Plus,
  Lock,
  Unlock,
  ShieldAlert,
  LogOut,
} from 'lucide-react';
import { useCloudSpace } from '../context/CloudSpaceContext';
import { formatBytes } from '../utils/formatters';

export const Sidebar: React.FC = () => {
  const {
    user,
    logout,
    currentView,
    setCurrentView,
    activePersona,
    setActivePersona,
    activeFolderId,
    setActiveFolderId,
    folders,
    totalUsedBytes,
    totalPlanBytes,
    remainingBytes,
    currentPlan,
    isFreePlan,
    storageUsagePercent,
    categoryBytesBreakdown,
    setIsUpgradeModalOpen,
    setIsUploadModalOpen,
    setIsAutoOrganizeModalOpen,
    clearSelection,
    setSemanticResults,
    setSearchQuery,
    isAdminAuthenticated,
    setIsAdminModalOpen,
  } = useCloudSpace();

  const handleNav = (view: string, folderId: string | null = null) => {
    setCurrentView(view);
    setActiveFolderId(folderId);
    clearSelection();
    setSemanticResults(null);
    setSearchQuery('');
  };

  const handleDevNav = (view: string) => {
    if (!isAdminAuthenticated) {
      setIsAdminModalOpen(true);
    } else {
      handleNav(view);
    }
  };

  const navItems = [
    { id: 'files', label: 'All Files', icon: FolderOpen },
    { id: 'folders', label: 'Folders Tree', icon: FolderTree },
    { id: 'shared', label: 'Shared Links', icon: Share2 },
    { id: 'starred', label: 'Starred Assets', icon: Star },
    { id: 'recent', label: 'Recent Activity', icon: Clock },
    { id: 'trash', label: 'Trash Bin', icon: Trash2 },
  ];

  const aiItems = [
    { id: 'assistant', label: 'AI Co-pilot Studio', icon: Sparkles, badge: 'Live' },
    { id: 'workflows', label: 'Automated Workflows', icon: Workflow, count: '4 Active' },
    { id: 'persona-hub', label: `${activePersona.toUpperCase()} Studio`, icon: getPersonaIcon(activePersona) },
  ];

  const devItems = [
    { id: 'dev-console', label: 'Developer Telemetry', icon: Terminal },
    { id: 'dev-nodes', label: 'Multi-Region Replicas', icon: Server },
    { id: 'audit-logs', label: 'Audit Trail & Logs', icon: ShieldCheck },
  ];

  function getPersonaIcon(role: string) {
    switch (role) {
      case 'student':
        return GraduationCap;
      case 'creator':
        return Video;
      case 'startup':
        return Rocket;
      case 'business':
        return Building2;
      default:
        return Terminal;
    }
  }

  const planMaxBytes = currentPlan.storageGB * 1024 * 1024 * 1024;

  return (
    <aside className="flex h-[calc(100vh-4rem)] w-64 flex-col justify-between border-r border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="space-y-6 overflow-y-auto pr-1">
        {/* Quick New Upload button */}
        <div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Upload or Create</span>
          </button>
        </div>

        {/* Core Storage Nav */}
        <div>
          <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Storage Vault
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id && activeFolderId === null;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Starred Folders Shortcut */}
        <div>
          <div className="flex items-center justify-between px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            <span>Folders</span>
            <span className="text-[10px] text-slate-400 font-normal">{folders.length} Total</span>
          </div>
          <div className="space-y-0.5">
            {folders.slice(0, 4).map((f) => {
              const isFolderActive = activeFolderId === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => handleNav('files', f.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs transition-colors ${
                    isFolderActive
                      ? 'bg-indigo-50 font-semibold text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200'
                      : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: f.color }} />
                    <span className="truncate">{f.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI & Automation Studio */}
        <div>
          <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Intelligent AI
          </div>
          <nav className="space-y-0.5">
            {aiItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-indigo-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-[10px] font-normal text-slate-400">{item.count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Developer Operations - Restricted to Admins */}
        <div>
          <div className="flex items-center justify-between px-3 pb-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Developer Ops
            </span>
            {isAdminAuthenticated ? (
              <span className="flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Unlock className="h-2.5 w-2.5" />
                Admin
              </span>
            ) : (
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 transition-colors hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300"
                title="Click to unlock Admin Access"
              >
                <Lock className="h-2.5 w-2.5" />
                Restricted
              </button>
            )}
          </div>
          <nav className="space-y-0.5">
            {devItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleDevNav(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-white text-emerald-600 shadow-xs dark:bg-slate-800 dark:text-emerald-400'
                      : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {!isAdminAuthenticated && (
                    <Lock className="h-3 w-3 text-slate-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Storage Quota Breakdown Card */}
      <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <HardDrive className="h-3.5 w-3.5 text-indigo-500" />
            <span>Storage Plan</span>
          </div>
          <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {currentPlan.name} {isFreePlan ? '(50 GB Free)' : ''}
          </span>
        </div>

        {/* Multi-category Progress Bar */}
        <div className="mt-2.5 flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            style={{ width: `${Math.min(100, (categoryBytesBreakdown.doc / totalPlanBytes) * 100)}%` }}
            className="bg-blue-500"
            title="Documents"
          />
          <div
            style={{ width: `${Math.min(100, (categoryBytesBreakdown.image / totalPlanBytes) * 100)}%` }}
            className="bg-rose-500"
            title="Media"
          />
          <div
            style={{ width: `${Math.min(100, (categoryBytesBreakdown.code / totalPlanBytes) * 100)}%` }}
            className="bg-emerald-500"
            title="Code & Projects"
          />
          <div
            style={{ width: `${Math.min(100, (categoryBytesBreakdown.sheet / totalPlanBytes) * 100)}%` }}
            className="bg-amber-500"
            title="Sheets & Financials"
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>{formatBytes(totalUsedBytes)} used</span>
          <span>
            {currentPlan.storageGB >= 1024 ? `${currentPlan.storageGB / 1024} TB` : `${currentPlan.storageGB} GB`} Limit
          </span>
        </div>

        <button
          onClick={() => setIsUpgradeModalOpen(true)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50/50 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
        >
          <span>{isFreePlan ? 'Upgrade from 50GB Free' : 'Upgrade Capacity'}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* User Session & Sign Out Bar */}
      {user && (
        <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center gap-2 truncate">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-[10px] font-bold text-white">
              {user.initials || user.name[0] || 'U'}
            </div>
            <div className="truncate">
              <div className="truncate font-semibold text-slate-800 dark:text-slate-200">{user.name}</div>
              <div className="truncate text-[10px] text-slate-400">{user.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out / Switch Account"
            className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
