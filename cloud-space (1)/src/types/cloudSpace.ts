export type FileCategory = 'doc' | 'image' | 'video' | 'audio' | 'code' | 'archive' | 'sheet' | 'presentation' | 'other';

export type PersonaRole = 'student' | 'creator' | 'startup' | 'business' | 'developer';

export type StoragePlanId = 'free' | 'pro' | 'business' | 'enterprise';

export interface UserProfile {
  email: string;
  name: string;
  avatar?: string;
  initials: string;
  planId: StoragePlanId;
  joinedAt: string;
  lastLoginAt: string;
}

export interface StoragePlan {
  id: StoragePlanId;
  name: string;
  badge?: string;
  tagline: string;
  storageGB: number;
  priceMonthly: number;
  features: string[];
  recommendedFor: PersonaRole;
}

export interface ShareSettings {
  isPublic: boolean;
  shareId: string;
  accessLevel: 'viewer' | 'editor' | 'downloader';
  allowDownload?: boolean;
  passwordProtected?: boolean;
  password?: string;
  expiresAt?: string;
  downloadCount: number;
  viewCount: number;
}

export interface CloudFile {
  id: string;
  name: string;
  sizeBytes: number;
  type: FileCategory;
  mimeType: string;
  folderId: string | null; // null for root
  createdAt: string;
  updatedAt: string;
  starred: boolean;
  trashed: boolean;
  tags: string[];
  contentPreview?: string;
  thumbnailUrl?: string;
  aiSummary?: string;
  aiTakeaways?: string[];
  aiTags?: string[];
  aiCategory?: string;
  aiSensitivity?: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  shareSettings: ShareSettings;
  version: number;
  metadata?: {
    pageCount?: number;
    linesOfCode?: number;
    dimensions?: string;
    durationSeconds?: number;
    author?: string;
    checksum?: string;
  };
}

export interface CloudFolder {
  id: string;
  name: string;
  parentId: string | null;
  color: string;
  iconName?: string;
  createdAt: string;
  updatedAt: string;
  starred?: boolean;
  trashed?: boolean;
  description?: string;
}

export interface WorkflowRule {
  id: string;
  title: string;
  description: string;
  triggerEvent: 'on_upload' | 'on_share' | 'on_edit' | 'schedule_daily';
  actionType: 'auto_summarize' | 'auto_tag' | 'extract_metadata' | 'notify_webhook' | 'compress_archive';
  fileFilterType: FileCategory | 'all';
  active: boolean;
  runCount: number;
  lastRun?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED' | 'AI_PROCESSED';
  details?: string;
}

export interface DeveloperTelemetry {
  uptimeSeconds: number;
  requestsTotal: number;
  geminiCallsCount: number;
  geminiTokensUsed: number;
  memory: {
    rssMB: string;
    heapUsedMB: string;
    heapTotalMB: string;
  };
  activeNodes: Array<{
    region: string;
    status: string;
    latencyMs: number;
    syncStatus: string;
  }>;
  lastCalls: Array<{
    timestamp: string;
    endpoint: string;
    status: string;
    latencyMs: number;
    promptTokens?: number;
  }>;
  cacheHitRate: string;
  aiModel: string;
}

export interface SemanticSearchResult {
  id: string;
  relevanceScore: number;
  matchReason: string;
  highlightExcerpt: string;
}

export interface PersonaConfig {
  role: PersonaRole;
  title: string;
  subtitle: string;
  icon: string;
  colorScheme: {
    primary: string;
    bgAccent: string;
    border: string;
  };
  recommendedTools: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    actionType: string;
  }>;
}
