import React, { useState } from 'react';
import {
  Cloud,
  Search,
  Sparkles,
  UploadCloud,
  Sliders,
  GraduationCap,
  Video,
  Rocket,
  Building2,
  Terminal,
  HardDrive,
  Check,
  ChevronDown,
  Bell,
  Layers,
  Zap,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  User as UserIcon,
  Mail,
} from 'lucide-react';
import { useCloudSpace } from '../context/CloudSpaceContext';
import { PersonaRole } from '../types/cloudSpace';
import { formatBytes } from '../utils/formatters';
import { searchFilesSemantically } from '../services/apiService';

export const Navbar: React.FC = () => {
  const {
    user,
    logout,
    activePersona,
    setActivePersona,
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    setSemanticResults,
    setIsSearchingAI,
    isSearchingAI,
    files,
    setIsUploadModalOpen,
    isAssistantOpen,
    setIsAssistantOpen,
    setIsUpgradeModalOpen,
    setIsAutoOrganizeModalOpen,
    totalUsedBytes,
    totalPlanBytes,
    isFreePlan,
    currentPlan,
    isAdminAuthenticated,
    setIsAdminModalOpen,
  } = useCloudSpace();

  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const personas: Array<{ id: PersonaRole; label: string; icon: any; color: string; desc: string }> = [
    {
      id: 'student',
      label: 'Student',
      icon: GraduationCap,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
      desc: 'Study guides, flashcards & notes',
    },
    {
      id: 'creator',
      label: 'Creator',
      icon: Video,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
      desc: '4K footage, captions & transcripts',
    },
    {
      id: 'startup',
      label: 'Startup',
      icon: Rocket,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
      desc: 'Pitch decks, burn rates & data room',
    },
    {
      id: 'business',
      label: 'Business',
      icon: Building2,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
      desc: 'MSAs, invoices & SOC2 compliance',
    },
    {
      id: 'developer',
      label: 'Developer',
      icon: Terminal,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      desc: 'Telemetry, API keys & audit logs',
    },
  ];

  const currentPersonaObj = personas.find((p) => p.id === activePersona) || personas[0];
  const PersonaIcon = currentPersonaObj.icon;

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSemanticResults(null);
      return;
    }
    setIsSearchingAI(true);
    try {
      const res = await searchFilesSemantically(searchQuery, files);
      setSemanticResults(res.results);
      if (currentView !== 'files') {
        setCurrentView('files');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSemanticResults(null);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 lg:px-6">
      {/* Brand & Workspace Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setCurrentView('files');
            clearSearch();
          }}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Cloud className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-slate-900 dark:text-white">
              <span>Cloud Space</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                50 GB Free
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">
              Secure Cloud Storage & Workspace
            </p>
          </div>
        </button>
      </div>

      {/* Semantic AI Search Bar */}
      <div className="mx-4 max-w-xl flex-1">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search files or ask AI (e.g., "Find Q3 financial models" or "Biology notes")...'
            className="w-full rounded-xl border border-slate-200 bg-slate-50/90 py-2 pl-9 pr-24 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-800"
          />
          <div className="absolute inset-y-0 right-1 flex items-center gap-1 pr-1">
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-1.5 py-0.5 text-[10px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={isSearchingAI || !searchQuery.trim()}
              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2 py-1 text-[11px] font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSearchingAI ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              <span>AI Search</span>
            </button>
          </div>
        </form>
      </div>

      {/* Action Controls & Persona Selector */}
      <div className="flex items-center gap-2.5">
        {/* Persona Mode Switcher */}
        <div className="relative">
          <button
            onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            title="Switch Workspace Persona"
          >
            <div className={`flex h-5 w-5 items-center justify-center rounded-md ${currentPersonaObj.color}`}>
              <PersonaIcon className="h-3.5 w-3.5" />
            </div>
            <span className="hidden sm:inline">{currentPersonaObj.label} Mode</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {personaDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800">
              <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select Workspace Persona
              </div>
              <div className="space-y-1">
                {personas.map((p) => {
                  const Icon = p.icon;
                  const isActive = activePersona === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        if (p.id === 'developer' && !isAdminAuthenticated) {
                          setPersonaDropdownOpen(false);
                          setIsAdminModalOpen(true);
                          return;
                        }
                        setActivePersona(p.id);
                        setPersonaDropdownOpen(false);
                        if (p.id === 'developer') {
                          setCurrentView('dev-console');
                        }
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-colors ${
                        isActive
                          ? 'bg-indigo-50 font-semibold text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${p.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold">
                            <span>{p.label} Space</span>
                            {p.id === 'developer' && !isAdminAuthenticated && (
                              <Lock className="h-3 w-3 text-amber-500" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">{p.desc}</div>
                        </div>
                      </div>
                      {isActive && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Admin Access Status Button */}
        <button
          onClick={() => setIsAdminModalOpen(true)}
          className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-all ${
            isAdminAuthenticated
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
          title={isAdminAuthenticated ? 'Admin Mode Unlocked' : 'Restricted: Click for Admin Login'}
        >
          {isAdminAuthenticated ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Admin Mode</span>
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Admin Login</span>
            </>
          )}
        </button>

        {/* AI Organizer Trigger */}
        <button
          onClick={() => setIsAutoOrganizeModalOpen(true)}
          className="hidden items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 md:flex"
          title="Auto-organize workspace with AI"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Auto-Organize</span>
        </button>

        {/* AI Assistant Co-pilot Toggle */}
        <button
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold shadow-xs transition-all ${
            isAssistantOpen
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/20'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
          }`}
          title="Toggle Cloud Space AI Co-pilot"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span className="hidden sm:inline">AI Co-pilot</span>
        </button>

        {/* Upload Button */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {/* Storage Quick Info */}
        <button
          onClick={() => setIsUpgradeModalOpen(true)}
          className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 lg:flex"
        >
          <HardDrive className="h-3.5 w-3.5 text-slate-400" />
          <span>{formatBytes(totalUsedBytes)} used</span>
          <span className="rounded bg-slate-200 px-1 py-0.2 text-[9px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
            {currentPlan.storageGB >= 1024 ? `${currentPlan.storageGB / 1024}TB` : `${currentPlan.storageGB}GB`}
          </span>
        </button>

        {/* User Account Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 rounded-full ring-2 ring-transparent transition-all hover:ring-indigo-500/50"
            title="User Profile & Settings"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-xs dark:bg-indigo-600">
              {user?.initials || user?.name?.[0] || 'U'}
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              {/* User Header */}
              <div className="flex items-start gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-xs">
                  {user?.initials || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold text-slate-900 dark:text-white">
                    {user?.name || 'Cloud Space User'}
                  </div>
                  <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                    {user?.email || 'Logged in user'}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    <HardDrive className="h-2.5 w-2.5" />
                    <span>{currentPlan.name} ({currentPlan.storageGB} GB {isFreePlan ? 'Free' : 'Pro'})</span>
                  </div>
                </div>
              </div>

              {/* Storage Mini Bar */}
              <div className="my-2.5 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Storage Used</span>
                  <span>{formatBytes(totalUsedBytes)} / {currentPlan.storageGB} GB</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full bg-indigo-600 transition-all"
                    style={{
                      width: `${Math.min(100, (totalUsedBytes / totalPlanBytes) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setIsUpgradeModalOpen(true);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-indigo-500" />
                    <span>Storage Subscription</span>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {isFreePlan ? 'Upgrade' : 'Manage'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out / Switch Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
