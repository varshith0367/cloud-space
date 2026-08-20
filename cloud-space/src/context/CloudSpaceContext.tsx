import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  CloudFile,
  CloudFolder,
  PersonaRole,
  StoragePlan,
  StoragePlanId,
  WorkflowRule,
  AuditLog,
  SemanticSearchResult,
  UserProfile,
} from '../types/cloudSpace';
import {
  INITIAL_FILES,
  INITIAL_FOLDERS,
  INITIAL_WORKFLOWS,
  INITIAL_AUDIT_LOGS,
  STORAGE_PLANS,
} from '../data/seedData';
import { summarizeFileWithAI } from '../services/apiService';

interface CloudSpaceContextType {
  // Auth & Session
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string, password?: string) => Promise<boolean>;
  register: (email: string, name: string, password?: string) => Promise<boolean>;
  logout: () => void;

  // Navigation & Persona
  currentView: string;
  setCurrentView: (view: string) => void;
  activePersona: PersonaRole;
  setActivePersona: (role: PersonaRole) => void;
  activeFolderId: string | null;
  setActiveFolderId: (folderId: string | null) => void;

  // Data
  files: CloudFile[];
  folders: CloudFolder[];
  workflows: WorkflowRule[];
  auditLogs: AuditLog[];
  currentPlan: StoragePlan;

  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  semanticResults: SemanticSearchResult[] | null;
  setSemanticResults: (results: SemanticSearchResult[] | null) => void;
  isSearchingAI: boolean;
  setIsSearchingAI: (val: boolean) => void;
  activeCategoryFilter: string | null;
  setActiveCategoryFilter: (cat: string | null) => void;

  // Selection
  selectedFileIds: string[];
  setSelectedFileIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelectFile: (id: string) => void;
  selectAllFiles: () => void;
  clearSelection: () => void;

  // Modals & Drawers
  previewFile: CloudFile | null;
  setPreviewFile: (file: CloudFile | null) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  shareModalFile: CloudFile | null;
  setShareModalFile: (file: CloudFile | null) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  isAutoOrganizeModalOpen: boolean;
  setIsAutoOrganizeModalOpen: (open: boolean) => void;

  // Admin Access Control
  isAdminAuthenticated: boolean;
  loginAsAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;

  // File Operations
  uploadFiles: (filesToAdd: Array<Partial<CloudFile> & { name: string; sizeBytes: number }>, autoAI?: boolean) => Promise<void>;
  trashFile: (id: string) => void;
  restoreFile: (id: string) => void;
  deletePermanently: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  moveFileToFolder: (fileId: string, folderId: string | null) => void;
  toggleStar: (id: string) => void;
  updateFileTags: (id: string, tags: string[]) => void;
  updateFileShareSettings: (id: string, settings: any) => void;
  triggerAIAnalysis: (fileId: string) => Promise<void>;

  // Folder Operations
  createFolder: (name: string, color?: string, description?: string) => void;
  deleteFolder: (id: string) => void;

  // Plan & Telemetry
  upgradePlan: (planId: StoragePlanId) => void;
  toggleWorkflow: (id: string) => void;
  addAuditLogEntry: (action: string, target: string, status?: AuditLog['status'], details?: string) => void;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonData: string) => boolean;

  // Storage Stats
  totalUsedBytes: number;
  totalPlanBytes: number;
  remainingBytes: number;
  storageUsagePercent: number;
  isFreePlan: boolean;
  categoryBytesBreakdown: Record<string, number>;
}

const CloudSpaceContext = createContext<CloudSpaceContextType | undefined>(undefined);

export const CloudSpaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or seeds
  const [files, setFiles] = useState<CloudFile[]>(() => {
    const saved = localStorage.getItem('cloudspace_files_v2');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const [folders, setFolders] = useState<CloudFolder[]>(() => {
    const saved = localStorage.getItem('cloudspace_folders_v2');
    return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
  });

  const [workflows, setWorkflows] = useState<WorkflowRule[]>(() => {
    const saved = localStorage.getItem('cloudspace_workflows_v2');
    return saved ? JSON.parse(saved) : INITIAL_WORKFLOWS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('cloudspace_logs_v2');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [currentPlanId, setCurrentPlanId] = useState<StoragePlanId>(() => {
    const saved = localStorage.getItem('cloudspace_plan_v2');
    return (saved as StoragePlanId) || 'free';
  });

  const [activePersona, setActivePersona] = useState<PersonaRole>('student');
  const [currentView, setCurrentView] = useState<string>('files');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [semanticResults, setSemanticResults] = useState<SemanticSearchResult[] | null>(null);
  const [isSearchingAI, setIsSearchingAI] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  // Selection
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  // User Auth & Session
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('cloudspace_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const isAuthenticated = user !== null;

  const login = async (email: string, name?: string, _password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return false;

    const fallbackName = cleanEmail.split('@')[0];
    const formattedName = name?.trim() || fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
    const initials = formattedName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || formattedName.slice(0, 2).toUpperCase();

    const loggedUser: UserProfile = {
      email: cleanEmail,
      name: formattedName,
      initials,
      planId: currentPlanId || 'free',
      joinedAt: user?.joinedAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    setUser(loggedUser);
    localStorage.setItem('cloudspace_auth_user', JSON.stringify(loggedUser));
    addAuditLogEntry('USER_LOGIN', cleanEmail, 'SUCCESS', 'Authenticated via Email Sign-In');
    return true;
  };

  const register = async (email: string, name: string, _password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return false;

    const formattedName = name.trim() || cleanEmail.split('@')[0];
    const initials = formattedName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || formattedName.slice(0, 2).toUpperCase();

    const newUser: UserProfile = {
      email: cleanEmail,
      name: formattedName,
      initials,
      planId: 'free',
      joinedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem('cloudspace_auth_user', JSON.stringify(newUser));
    addAuditLogEntry('USER_REGISTER', cleanEmail, 'SUCCESS', 'New account created with 50 GB Free Tier');
    return true;
  };

  const logout = () => {
    if (user) {
      addAuditLogEntry('USER_LOGOUT', user.email, 'SUCCESS', 'User signed out of Cloud Space');
    }
    setUser(null);
    localStorage.removeItem('cloudspace_auth_user');
    setIsAdminAuthenticated(false);
    localStorage.removeItem('cloudspace_admin_auth');
  };

  // Modals & Panels
  const [previewFile, setPreviewFile] = useState<CloudFile | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [shareModalFile, setShareModalFile] = useState<CloudFile | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAutoOrganizeModalOpen, setIsAutoOrganizeModalOpen] = useState(false);

  // Admin Access Control
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cloudspace_admin_auth') === 'true';
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  const loginAsAdmin = (passcode: string): boolean => {
    const validKeys = ['admin', 'admin2026', 'admin123', 'cloudspace_admin', 'root', '0000'];
    const trimmed = passcode.trim().toLowerCase();
    if (validKeys.includes(trimmed)) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('cloudspace_admin_auth', 'true');
      addAuditLogEntry('ADMIN_LOGIN', 'Administrator Console Unlocked', 'SUCCESS', 'Elevated system root privileges granted');
      return true;
    }
    addAuditLogEntry('ADMIN_LOGIN_FAILED', 'Unauthorized Access Attempt', 'WARNING', 'Invalid administrative passkey');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('cloudspace_admin_auth');
    addAuditLogEntry('ADMIN_LOGOUT', 'Administrator Session Closed', 'SUCCESS', 'Reverted to standard user privileges');
    if (['dev-console', 'dev-nodes', 'audit-logs'].includes(currentView)) {
      setCurrentView('files');
    }
  };

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('cloudspace_files_v2', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('cloudspace_folders_v2', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('cloudspace_workflows_v2', JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem('cloudspace_logs_v2', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('cloudspace_plan_v2', currentPlanId);
  }, [currentPlanId]);

  const currentPlan = useMemo(() => {
    return STORAGE_PLANS.find((p) => p.id === currentPlanId) || STORAGE_PLANS[0];
  }, [currentPlanId]);

  const totalUsedBytes = useMemo(() => {
    return files.filter((f) => !f.trashed).reduce((acc, f) => acc + f.sizeBytes, 0);
  }, [files]);

  const totalPlanBytes = currentPlan.storageGB * 1024 * 1024 * 1024;
  const remainingBytes = Math.max(0, totalPlanBytes - totalUsedBytes);
  const storageUsagePercent = Math.min(100, Math.max(1, (totalUsedBytes / totalPlanBytes) * 100));
  const isFreePlan = currentPlan.id === 'free';

  const categoryBytesBreakdown = useMemo(() => {
    const acc: Record<string, number> = {
      doc: 0,
      image: 0,
      video: 0,
      audio: 0,
      code: 0,
      sheet: 0,
      presentation: 0,
      archive: 0,
      other: 0,
    };
    files.filter((f) => !f.trashed).forEach((f) => {
      acc[f.type] = (acc[f.type] || 0) + f.sizeBytes;
    });
    return acc;
  }, [files]);

  const addAuditLogEntry = (
    action: string,
    target: string,
    status: AuditLog['status'] = 'SUCCESS',
    details?: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user?.email || 'user@cloudspace.io',
      action,
      target,
      ipAddress: '198.51.100.42',
      status,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const toggleSelectFile = (id: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllFiles = () => {
    const currentFiles = files.filter(
      (f) => !f.trashed && (activeFolderId ? f.folderId === activeFolderId : true)
    );
    setSelectedFileIds(currentFiles.map((f) => f.id));
  };

  const clearSelection = () => setSelectedFileIds([]);

  const trashFile = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, trashed: true, updatedAt: new Date().toISOString() } : f))
    );
    const targetFile = files.find((f) => f.id === id);
    addAuditLogEntry('MOVE_TO_TRASH', targetFile?.name || id, 'WARNING', 'Moved to workspace trash');
    setSelectedFileIds((prev) => prev.filter((item) => item !== id));
  };

  const restoreFile = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, trashed: false, updatedAt: new Date().toISOString() } : f))
    );
    const targetFile = files.find((f) => f.id === id);
    addAuditLogEntry('RESTORE_FROM_TRASH', targetFile?.name || id, 'SUCCESS');
  };

  const deletePermanently = (id: string) => {
    const targetFile = files.find((f) => f.id === id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    addAuditLogEntry('PERMANENT_DELETE', targetFile?.name || id, 'WARNING', 'Permanently purged from storage');
    setSelectedFileIds((prev) => prev.filter((item) => item !== id));
  };

  const renameFile = (id: string, newName: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName, updatedAt: new Date().toISOString() } : f))
    );
    addAuditLogEntry('RENAME_FILE', newName, 'SUCCESS', `File ID: ${id}`);
  };

  const moveFileToFolder = (fileId: string, folderId: string | null) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, folderId, updatedAt: new Date().toISOString() } : f))
    );
    const targetFile = files.find((f) => f.id === fileId);
    const targetFolder = folders.find((fol) => fol.id === folderId);
    addAuditLogEntry(
      'MOVE_FILE',
      targetFile?.name || fileId,
      'SUCCESS',
      `Moved to ${targetFolder ? targetFolder.name : 'Root'}`
    );
  };

  const toggleStar = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, starred: !f.starred, updatedAt: new Date().toISOString() } : f))
    );
  };

  const updateFileTags = (id: string, tags: string[]) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, tags, updatedAt: new Date().toISOString() } : f))
    );
  };

  const updateFileShareSettings = (id: string, settings: any) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              shareSettings: { ...f.shareSettings, ...settings },
              updatedAt: new Date().toISOString(),
            }
          : f
      )
    );
    addAuditLogEntry('UPDATE_SHARE_SETTINGS', id, 'SUCCESS', `Public: ${settings.isPublic}`);
  };

  const triggerAIAnalysis = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    try {
      addAuditLogEntry('AI_ANALYSIS_STARTED', file.name, 'AI_PROCESSED', 'Invoking Gemini 3.7 Flash');
      const aiData = await summarizeFileWithAI(file, activePersona);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                aiSummary: aiData.summary,
                aiTakeaways: aiData.keyTakeaways,
                aiTags: aiData.suggestedTags,
                aiCategory: aiData.suggestedCategory || f.aiCategory,
                aiSensitivity: aiData.securitySensitivity || f.aiSensitivity,
                tags: Array.from(new Set([...f.tags, ...(aiData.suggestedTags || [])])),
              }
            : f
        )
      );
      addAuditLogEntry('AI_ANALYSIS_COMPLETED', file.name, 'SUCCESS', 'Auto-tagged and summarized');
    } catch (err: any) {
      console.error('Trigger AI error:', err);
    }
  };

  const uploadFiles = async (
    filesToAdd: Array<Partial<CloudFile> & { name: string; sizeBytes: number }>,
    autoAI = true
  ) => {
    const incomingBytes = filesToAdd.reduce((acc, f) => acc + (f.sizeBytes || 0), 0);
    if (totalUsedBytes + incomingBytes > totalPlanBytes) {
      addAuditLogEntry(
        'UPLOAD_BLOCKED_QUOTA',
        `${filesToAdd.length} files (${Math.round(incomingBytes / (1024 * 1024))} MB)`,
        'WARNING',
        `Exceeded ${currentPlan.name} limit (${currentPlan.storageGB} GB). Subscription upgrade required.`
      );
      setIsUpgradeModalOpen(true);
      return;
    }

    const newFiles: CloudFile[] = filesToAdd.map((raw, idx) => {
      const ext = raw.name.split('.').pop()?.toLowerCase() || '';
      let type: CloudFile['type'] = 'doc';
      let mimeType = 'text/plain';

      if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
        type = 'image';
        mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      } else if (['mp4', 'mov', 'webm', 'mkv', 'avi'].includes(ext)) {
        type = 'video';
        mimeType = `video/${ext}`;
      } else if (['mp3', 'wav', 'aac', 'ogg', 'm4a'].includes(ext)) {
        type = 'audio';
        mimeType = `audio/${ext}`;
      } else if (['ts', 'tsx', 'js', 'jsx', 'json', 'py', 'go', 'rs', 'html', 'css', 'yml', 'yaml'].includes(ext)) {
        type = 'code';
        mimeType = 'text/plain';
      } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
        type = 'sheet';
        mimeType = 'application/vnd.ms-excel';
      } else if (['pptx', 'ppt', 'key'].includes(ext)) {
        type = 'presentation';
        mimeType = 'application/vnd.ms-powerpoint';
      } else if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext)) {
        type = 'archive';
        mimeType = 'application/zip';
      } else if (ext === 'pdf') {
        type = 'doc';
        mimeType = 'application/pdf';
      }

      return {
        id: `file-${Date.now()}-${idx}`,
        name: raw.name,
        sizeBytes: raw.sizeBytes,
        type,
        mimeType,
        folderId: activeFolderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        starred: false,
        trashed: false,
        tags: [type.toUpperCase(), 'CloudUpload'],
        contentPreview: raw.contentPreview || `File content placeholder for ${raw.name}`,
        thumbnailUrl: raw.thumbnailUrl,
        aiSummary: raw.aiSummary || `Uploaded ${raw.name} to Cloud Space. Ready for AI search & workflows.`,
        aiTakeaways: ['Securely uploaded to replicated NVMe cluster'],
        aiCategory: 'Personal & Notes',
        aiSensitivity: 'Internal',
        version: 1,
        shareSettings: {
          isPublic: false,
          shareId: `share_${Math.random().toString(36).substring(2, 9)}`,
          accessLevel: 'viewer',
          downloadCount: 0,
          viewCount: 0,
        },
      };
    });

    setFiles((prev) => [...newFiles, ...prev]);
    newFiles.forEach((nf) => {
      addAuditLogEntry('FILE_UPLOADED', nf.name, 'SUCCESS', `${nf.type.toUpperCase()} file added`);
      if (autoAI) {
        triggerAIAnalysis(nf.id);
      }
    });
  };

  const createFolder = (name: string, color = '#6366f1', description = '') => {
    const newFolder: CloudFolder = {
      id: `folder-${Date.now()}`,
      name,
      parentId: activeFolderId,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description,
    };
    setFolders((prev) => [...prev, newFolder]);
    addAuditLogEntry('CREATE_FOLDER', name, 'SUCCESS', `Color: ${color}`);
  };

  const deleteFolder = (id: string) => {
    const target = folders.find((f) => f.id === id);
    setFolders((prev) => prev.filter((f) => f.id !== id));
    // Move contained files to root or trash
    setFiles((prev) => prev.map((f) => (f.folderId === id ? { ...f, folderId: null } : f)));
    addAuditLogEntry('DELETE_FOLDER', target?.name || id, 'WARNING', 'Contained files moved to Root');
    if (activeFolderId === id) setActiveFolderId(null);
  };

  const upgradePlan = (planId: StoragePlanId) => {
    setCurrentPlanId(planId);
    const plan = STORAGE_PLANS.find((p) => p.id === planId);
    addAuditLogEntry('STORAGE_PLAN_CHANGED', plan?.name || planId, 'SUCCESS', `Upgraded to ${plan?.storageGB}GB`);
  };

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  };

  const exportBackupJSON = () => {
    const backup = {
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      account: 'varshith0367@gmail.com',
      files,
      folders,
      workflows,
      auditLogs,
      plan: currentPlanId,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CloudSpace_Snapshot_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addAuditLogEntry('DISASTER_RECOVERY_SNAPSHOT_EXPORTED', 'Full Workspace JSON', 'SUCCESS');
  };

  const importBackupJSON = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.files && Array.isArray(parsed.files)) {
        setFiles(parsed.files);
        if (parsed.folders) setFolders(parsed.folders);
        if (parsed.workflows) setWorkflows(parsed.workflows);
        if (parsed.plan) setCurrentPlanId(parsed.plan);
        addAuditLogEntry('DISASTER_RECOVERY_RESTORE', 'Snapshot Restored', 'SUCCESS');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <CloudSpaceContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        currentView,
        setCurrentView,
        activePersona,
        setActivePersona,
        activeFolderId,
        setActiveFolderId,
        files,
        folders,
        workflows,
        auditLogs,
        currentPlan,
        searchQuery,
        setSearchQuery,
        semanticResults,
        setSemanticResults,
        isSearchingAI,
        setIsSearchingAI,
        activeCategoryFilter,
        setActiveCategoryFilter,
        selectedFileIds,
        setSelectedFileIds,
        toggleSelectFile,
        selectAllFiles,
        clearSelection,
        previewFile,
        setPreviewFile,
        isUploadModalOpen,
        setIsUploadModalOpen,
        shareModalFile,
        setShareModalFile,
        isAssistantOpen,
        setIsAssistantOpen,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        isAutoOrganizeModalOpen,
        setIsAutoOrganizeModalOpen,
        isAdminAuthenticated,
        loginAsAdmin,
        logoutAdmin,
        isAdminModalOpen,
        setIsAdminModalOpen,
        uploadFiles,
        trashFile,
        restoreFile,
        deletePermanently,
        renameFile,
        moveFileToFolder,
        toggleStar,
        updateFileTags,
        updateFileShareSettings,
        triggerAIAnalysis,
        createFolder,
        deleteFolder,
        upgradePlan,
        toggleWorkflow,
        addAuditLogEntry,
        exportBackupJSON,
        importBackupJSON,
        totalUsedBytes,
        totalPlanBytes,
        remainingBytes,
        storageUsagePercent,
        isFreePlan,
        categoryBytesBreakdown,
      }}
    >
      {children}
    </CloudSpaceContext.Provider>
  );
};

export function useCloudSpace() {
  const context = useContext(CloudSpaceContext);
  if (!context) {
    throw new Error('useCloudSpace must be used within a CloudSpaceProvider');
  }
  return context;
}
