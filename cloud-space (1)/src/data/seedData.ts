import { CloudFile, CloudFolder, PersonaConfig, StoragePlan, WorkflowRule, AuditLog } from '../types/cloudSpace';

export const STORAGE_PLANS: StoragePlan[] = [
  {
    id: 'free',
    name: 'Free Space',
    badge: 'Free Tier',
    tagline: '50 GB free cloud storage for all users',
    storageGB: 50,
    priceMonthly: 0,
    features: [
      '50 GB Free Secure Cloud Storage',
      'Universal Gemini 3.7 Flash AI Copilot',
      'AI Document Summaries & Flashcards',
      'Full-Text & Semantic File Search',
      'Standard Sharing & Public Links',
      'Upgrade to Subscription for 2TB+ Storage',
    ],
    recommendedFor: 'student',
  },
  {
    id: 'pro',
    name: 'Creator & Pro',
    badge: 'Popular Subscription',
    tagline: 'For content creators, developers, and power users needing 2TB+',
    storageGB: 2048,
    priceMonthly: 9.99,
    features: [
      '2 TB (2,048 GB) High-Speed NVMe Storage',
      'Unlimited AI Copilot & Cross-File Reasoning',
      'Auto-Tagging & Smart Categorization',
      'Media Transcoding & 4K Preview',
      'Password Protected Sharing & Custom Expiration',
      'Automated Workflows Studio (10 Active)',
    ],
    recommendedFor: 'creator',
  },
  {
    id: 'business',
    name: 'Startup & Growth',
    badge: 'Team Subscription',
    tagline: 'For fast-growing startups and agile teams needing 10TB+',
    storageGB: 10240,
    priceMonthly: 29.99,
    features: [
      '10 TB (10,240 GB) Replicated Storage Cluster',
      'Full Multi-File Cross-Workspace AI Reasoning',
      'Team Shared Drives & Role Access Controls (RBAC)',
      'SOC2 Audit Logs & Real-Time Security Alerts',
      'Automated Workflows with Webhook Integrations',
      'Dedicated API Tokens & Developer Console Access',
    ],
    recommendedFor: 'startup',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Cloud',
    tagline: 'Custom petabyte infrastructure for corporations',
    storageGB: 100000,
    priceMonthly: 199.99,
    features: [
      '100 TB+ Custom Petabyte Scale Storage',
      'Private Custom Gemini AI Fine-Tuned Enclaves',
      'Single Sign-On (SAML / Okta / Azure AD)',
      'Multi-Region Zero-Latency Geographic Sync',
      '24/7 Dedicated Cloud Architect Support & 99.999% SLA',
      'Custom Compliance Encryption (HIPAA, GDPR, ISO 27001)',
    ],
    recommendedFor: 'business',
  },
];

export const PERSONA_CONFIGS: Record<string, PersonaConfig> = {
  student: {
    role: 'student',
    title: 'Student & Academic Space',
    subtitle: 'Organize lecture notes, research papers, study guides, and instant AI flashcards.',
    icon: 'GraduationCap',
    colorScheme: {
      primary: 'indigo',
      bgAccent: 'bg-indigo-50/70 dark:bg-indigo-950/30',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
    recommendedTools: [
      {
        id: 'study-flashcards',
        title: 'Generate Flashcards',
        description: 'Convert lecture notes or PDFs into question/answer decks.',
        icon: 'Sparkles',
        actionType: 'flashcards',
      },
      {
        id: 'paper-summarizer',
        title: 'Research Paper Explainer',
        description: 'Extract methodology, findings, and citations instantly.',
        icon: 'BookOpen',
        actionType: 'summarize',
      },
      {
        id: 'exam-prep-quiz',
        title: 'Practice Exam Builder',
        description: 'Auto-generate multiple choice quizzes from study materials.',
        icon: 'CheckSquare',
        actionType: 'quiz',
      },
    ],
  },
  creator: {
    role: 'creator',
    title: 'Creator & Media Space',
    subtitle: 'Store 4K footage, soundscapes, scripts, LUTs, and auto-generate viral captions.',
    icon: 'Video',
    colorScheme: {
      primary: 'rose',
      bgAccent: 'bg-rose-50/70 dark:bg-rose-950/30',
      border: 'border-rose-200 dark:border-rose-800',
    },
    recommendedTools: [
      {
        id: 'creator-captions',
        title: 'Social Captions & Hooks',
        description: 'Generate multi-platform hooks, descriptions, and hashtags.',
        icon: 'Megaphone',
        actionType: 'captions',
      },
      {
        id: 'transcription-sync',
        title: 'Audio/Video Transcription',
        description: 'Extract timecoded transcript from media and podcasts.',
        icon: 'FileText',
        actionType: 'transcribe',
      },
      {
        id: 'asset-tagger',
        title: 'AI Smart Media Tagger',
        description: 'Detect visual moods, lighting styles, and color palettes.',
        icon: 'Tag',
        actionType: 'tag_media',
      },
    ],
  },
  startup: {
    role: 'startup',
    title: 'Startup & Venture Space',
    subtitle: 'Secure pitch decks, financial models, cap tables, and generate investor updates.',
    icon: 'Rocket',
    colorScheme: {
      primary: 'amber',
      bgAccent: 'bg-amber-50/70 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800',
    },
    recommendedTools: [
      {
        id: 'investor-update',
        title: 'Monthly Investor Update',
        description: 'Synthesize product metrics and financial sheets into email briefs.',
        icon: 'TrendingUp',
        actionType: 'investor_update',
      },
      {
        id: 'deck-review',
        title: 'Pitch Deck AI Roast & Fix',
        description: 'Evaluate narrative flow, TAM sizing, and slide clarity.',
        icon: 'Presentation',
        actionType: 'pitch_roast',
      },
      {
        id: 'runway-calc',
        title: 'Financial Runway Analyzer',
        description: 'Extract monthly burn rate and forecast runway months.',
        icon: 'DollarSign',
        actionType: 'financial_eval',
      },
    ],
  },
  business: {
    role: 'business',
    title: 'Enterprise & Operations Space',
    subtitle: 'Manage master service agreements, vendor invoices, SOC2 reports, and compliance.',
    icon: 'Building2',
    colorScheme: {
      primary: 'blue',
      bgAccent: 'bg-blue-50/70 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800',
    },
    recommendedTools: [
      {
        id: 'contract-analyzer',
        title: 'Contract Risk & Clauses',
        description: 'Highlight liability caps, indemnification, and SLA penalties.',
        icon: 'ShieldCheck',
        actionType: 'contract_audit',
      },
      {
        id: 'invoice-extract',
        title: 'Invoice Line Item Parser',
        description: 'Extract vendor names, tax ID, totals, and line breakdown.',
        icon: 'Receipt',
        actionType: 'invoice_parse',
      },
      {
        id: 'compliance-audit',
        title: 'SOC2 & GDPR Compliance Check',
        description: 'Audit document sensitivity against privacy guidelines.',
        icon: 'Lock',
        actionType: 'compliance_audit',
      },
    ],
  },
  developer: {
    role: 'developer',
    title: 'Developer Cloud Console',
    subtitle: 'Monitor system telemetry, Gemini API quotas, storage replication nodes, and audit logs.',
    icon: 'Terminal',
    colorScheme: {
      primary: 'emerald',
      bgAccent: 'bg-emerald-50/70 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    recommendedTools: [
      {
        id: 'code-doc-gen',
        title: 'API Documentation Generator',
        description: 'Generate OpenAPI / Swagger docs from backend code files.',
        icon: 'Code',
        actionType: 'code_docs',
      },
      {
        id: 'webhook-sim',
        title: 'Test Webhook Payload',
        description: 'Simulate file events and test API endpoint subscriptions.',
        icon: 'Webhook',
        actionType: 'webhook_test',
      },
      {
        id: 'snapshot-backup',
        title: 'Create State Snapshot',
        description: 'Export workspace schema & metadata for disaster recovery.',
        icon: 'Database',
        actionType: 'backup',
      },
    ],
  },
};

export const INITIAL_FOLDERS: CloudFolder[] = [
  {
    id: 'folder-academics',
    name: 'Academics & Research',
    parentId: null,
    color: '#6366f1',
    iconName: 'GraduationCap',
    createdAt: '2026-08-10T14:30:00Z',
    updatedAt: '2026-08-18T09:15:00Z',
    starred: true,
    description: 'Course lecture notes, research papers, and assignments.',
  },
  {
    id: 'folder-media',
    name: 'Media & Creative Vault',
    parentId: null,
    color: '#f43f5e',
    iconName: 'Film',
    createdAt: '2026-08-11T16:00:00Z',
    updatedAt: '2026-08-19T08:00:00Z',
    starred: true,
    description: 'High-res photos, podcasts, 4K video cuts, and branding assets.',
  },
  {
    id: 'folder-startup',
    name: 'Pitch & Financials',
    parentId: null,
    color: '#f59e0b',
    iconName: 'Rocket',
    createdAt: '2026-08-12T11:20:00Z',
    updatedAt: '2026-08-19T10:45:00Z',
    starred: true,
    description: 'Series A pitch deck, Q3 burn rate models, and investor updates.',
  },
  {
    id: 'folder-legal',
    name: 'Legal & Enterprise Contracts',
    parentId: null,
    color: '#3b82f6',
    iconName: 'ShieldCheck',
    createdAt: '2026-08-14T08:00:00Z',
    updatedAt: '2026-08-17T18:20:00Z',
    starred: false,
    description: 'MSAs, SOC2 compliance reports, and vendor invoices.',
  },
  {
    id: 'folder-code',
    name: 'Engineering & Microservices',
    parentId: null,
    color: '#10b981',
    iconName: 'Code',
    createdAt: '2026-08-15T12:00:00Z',
    updatedAt: '2026-08-19T14:00:00Z',
    starred: false,
    description: 'Backend routing, authentication configs, and deployment scripts.',
  },
];

export const INITIAL_FILES: CloudFile[] = [
  {
    id: 'file-1',
    name: 'Biology_101_Cellular_Respiration_Notes.md',
    sizeBytes: 1024 * 48, // 48 KB
    type: 'doc',
    mimeType: 'text/markdown',
    folderId: 'folder-academics',
    createdAt: '2026-08-14T10:30:00Z',
    updatedAt: '2026-08-18T16:20:00Z',
    starred: true,
    trashed: false,
    tags: ['Biology', 'Lecture', 'Exam-Prep', 'Mitochondria'],
    aiCategory: 'Academics & Research',
    aiSensitivity: 'Public',
    aiSummary: 'Comprehensive lecture notes covering Glycolysis, the Krebs Cycle, and Oxidative Phosphorylation. Includes ATP yield calculations, chemiosmosis diagrams, and review questions for the midterm examination.',
    aiTakeaways: [
      'Net ATP yield per glucose molecule is approximately 30-32 ATP.',
      'Glycolysis occurs in the cytoplasm and requires no oxygen.',
      'The electron transport chain creates a proton gradient across the inner mitochondrial membrane.',
    ],
    aiTags: ['Biology', 'ATP', 'CellularRespiration', 'ExamReview'],
    contentPreview: `# Cellular Respiration & Metabolic Pathways (BIO 101)

## 1. Overview of ATP Generation
Cellular respiration is the biochemical process by which organic molecules (primarily glucose) are oxidized to produce ATP, releasing carbon dioxide and water as byproducts.

\`\`\`
C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O + ~32 ATP
\`\`\`

## 2. Key Stages
1. **Glycolysis**: Cytosol. Glucose is cleaved into 2 Pyruvate molecules. Net yield: 2 ATP + 2 NADH.
2. **Pyruvate Decarboxylation**: Mitochondrial Matrix. Produces Acetyl-CoA + NADH + CO2.
3. **Citric Acid Cycle (Krebs Cycle)**: Yields 2 ATP, 6 NADH, 2 FADH2 per glucose.
4. **Oxidative Phosphorylation & Chemiosmosis**: Inner membrane. Powered by ATP Synthase.

## 3. Midterm Review Concepts
- Chemiosmotic coupling mechanism discovered by Peter Mitchell.
- High electrochemical proton motive force across cristae.
- Uncoupling proteins (UCP-1 / Thermogenin) in brown adipose tissue generate heat instead of ATP.`,
    shareSettings: {
      isPublic: true,
      shareId: 'bio101_share_77x',
      accessLevel: 'viewer',
      downloadCount: 14,
      viewCount: 48,
    },
    version: 3,
    metadata: {
      pageCount: 4,
      author: 'Academic Scholar',
      checksum: 'sha256-a9b2c3d4e5f6',
    },
  },
  {
    id: 'file-2',
    name: 'CS301_Distributed_Systems_Midterm_Study_Guide.pdf',
    sizeBytes: 1024 * 1024 * 1.8, // 1.8 MB
    type: 'doc',
    mimeType: 'application/pdf',
    folderId: 'folder-academics',
    createdAt: '2026-08-16T14:15:00Z',
    updatedAt: '2026-08-19T09:30:00Z',
    starred: true,
    trashed: false,
    tags: ['ComputerScience', 'Raft', 'Consensus', 'CAPTheorem'],
    aiCategory: 'Academics & Research',
    aiSensitivity: 'Internal',
    aiSummary: 'In-depth study guide on modern distributed consensus algorithms, Vector Clocks, Byzantine Fault Tolerance, and partition tolerance tradeoffs under the CAP theorem.',
    aiTakeaways: [
      'Raft divides consensus into Leader Election, Log Replication, and Safety.',
      'Vector clocks provide causal consistency without requiring synchronized wall-clock hardware.',
      'Under network partitioning (P), systems must choose between Consistency (C) and Availability (A).',
    ],
    aiTags: ['DistributedSystems', 'RaftConsensus', 'CAPTheorem', 'StudyGuide'],
    contentPreview: `Distributed Systems CS301 - Midterm Study Guide

Topics Covered:
- Linearizability vs Sequential Consistency
- Leader-based Consensus: Raft vs Multi-Paxos
- 2-Phase Commit (2PC) vs 3-Phase Commit (3PC)
- Gossip Protocols and Anti-Entropy Dissemination
- Dynamo-style Quorum Systems: R + W > N guarantees strong read consistency.

Key Exam Tip: Remember that split-brain is prevented by requiring a strict majority quorum (N/2 + 1) for leader heartbeat acknowledgment.`,
    shareSettings: {
      isPublic: false,
      shareId: 'cs301_midterm_vault',
      accessLevel: 'viewer',
      downloadCount: 6,
      viewCount: 22,
    },
    version: 2,
    metadata: {
      pageCount: 18,
      author: 'Prof. Anderson Lab',
    },
  },
  {
    id: 'file-3',
    name: 'CloudSpace_Series_A_Pitch_Deck_2026.pdf',
    sizeBytes: 1024 * 1024 * 4.2, // 4.2 MB
    type: 'presentation',
    mimeType: 'application/pdf',
    folderId: 'folder-startup',
    createdAt: '2026-08-15T08:00:00Z',
    updatedAt: '2026-08-19T11:00:00Z',
    starred: true,
    trashed: false,
    tags: ['PitchDeck', 'SeriesA', 'Investors', 'TAM', 'Traction'],
    aiCategory: 'Finance & Pitch',
    aiSensitivity: 'Confidential',
    aiSummary: 'Series A pitch deck for Cloud Space: An AI-first intelligent cloud platform unifying storage, automated workflows, and multi-persona generative intelligence. Highlights $1.2M ARR, 180% net revenue retention, and $65B TAM.',
    aiTakeaways: [
      'Seeking $8M Series A investment for global edge expansion & enterprise sales.',
      'Customer acquisition cost (CAC) payback period is 4.2 months with 62% organic growth.',
      'Unifies fragmented tools: Google Drive, Notion AI, Zapier, and Enterprise Search into one unified space.',
    ],
    aiTags: ['PitchDeck', 'VentureCapital', 'SaaS', 'SeriesA', 'TAM'],
    contentPreview: `# Cloud Space - Series A Investor Presentation (August 2026)

## Slide 1: The Problem
Traditional cloud storage (Dropbox, Drive, Box) is a passive, dumb repository of dead files. Knowledge workers spend 20% of their week searching, organizing, and re-reading static documents.

## Slide 2: The Solution - Cloud Space
An active AI operating system for your files:
- Real-time semantic index across text, audio, video, and code
- In-place conversational Q&A without downloading
- Automated intelligent workflows (OCR, tag, summarize on ingestion)
- Multi-persona specialized workspaces

## Slide 3: Traction & Unit Economics
- ARR: $1.2M ARR (+340% YoY)
- Active Users: 140,000+ Students, Creators, and Startups
- NRR: 182%
- Gross Margin: 84% on storage & compute`,
    shareSettings: {
      isPublic: true,
      shareId: 'deck_series_a_investor',
      accessLevel: 'viewer',
      passwordProtected: true,
      expiresAt: '2026-09-30T00:00:00Z',
      downloadCount: 38,
      viewCount: 194,
    },
    version: 4,
    metadata: {
      pageCount: 14,
      author: 'Founding Team',
    },
  },
  {
    id: 'file-4',
    name: 'Financial_Model_Q3_Q4_Runway_Forecast.xlsx',
    sizeBytes: 1024 * 180, // 180 KB
    type: 'sheet',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    folderId: 'folder-startup',
    createdAt: '2026-08-12T09:30:00Z',
    updatedAt: '2026-08-18T19:00:00Z',
    starred: false,
    trashed: false,
    tags: ['Finance', 'Runway', 'BurnRate', 'Headcount', 'Revenue'],
    aiCategory: 'Finance & Pitch',
    aiSensitivity: 'Confidential',
    aiSummary: 'Quarterly financial forecast through Q4 2027. Models headcount expansion, cloud compute scaling costs, gross margin sensitivity, and current runway of 18.4 months with $3.1M cash in bank.',
    aiTakeaways: [
      'Current monthly net burn is $68,000, projected to peak at $110,000 in Q1 2027.',
      'Gross margin on storage tiers improves from 78% to 86% with reserved instance pricing.',
      'Runway extends beyond 22 months if Series A closes by November 2026.',
    ],
    aiTags: ['Financials', 'Runway', 'CapTable', 'Forecast', 'Excel'],
    contentPreview: `Q3-Q4 Financial Runway & Burn Model
Cash Balance as of Aug 2026: $3,140,000
Monthly Gross Revenue: $108,000
Monthly Cost of Goods (Cloud Storage & AI API): $16,400
Monthly Operating Expenses (Salaries, Tooling, Marketing): $159,600
Net Monthly Burn: -$68,000
Runway Remaining: 18.4 Months (Zero Growth Baseline) / 24+ Months with 15% MoM ARR Growth.`,
    shareSettings: {
      isPublic: false,
      shareId: 'fin_model_secure_09',
      accessLevel: 'viewer',
      downloadCount: 4,
      viewCount: 16,
    },
    version: 5,
    metadata: {
      author: 'CFO Office',
    },
  },
  {
    id: 'file-5',
    name: 'Cinematic_Hero_Shot_4K_Volcanic_Sunrise.jpg',
    sizeBytes: 1024 * 1024 * 12.4, // 12.4 MB
    type: 'image',
    mimeType: 'image/jpeg',
    folderId: 'folder-media',
    createdAt: '2026-08-17T17:40:00Z',
    updatedAt: '2026-08-17T17:40:00Z',
    starred: true,
    trashed: false,
    tags: ['Photography', '4K', 'Nature', 'Sunrise', 'RAW'],
    aiCategory: 'Media & Creative',
    aiSensitivity: 'Public',
    aiSummary: 'Ultra high-resolution landscape photograph captured during sunrise over a volcanic caldera with dramatic golden hour backlighting, fog layers, and high dynamic range color grading.',
    aiTakeaways: [
      'Resolution: 3840 x 2160 (4K UHD), 300 DPI.',
      'Optimal for hero banner website headers, marketing collateral, and digital signage.',
      'Exif data indicates ISO 100, f/4.0, 1/320s on Sony Alpha 7R V.',
    ],
    aiTags: ['Landscape', 'Sunrise', 'GoldenHour', 'Photography', 'Volcano'],
    contentPreview: 'Visual image asset: 4K UHD landscape capture of sunrise over volcanic ridge with amber mist and violet skies.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    shareSettings: {
      isPublic: true,
      shareId: 'hero_volcano_photo_4k',
      accessLevel: 'downloader',
      downloadCount: 88,
      viewCount: 340,
    },
    version: 1,
    metadata: {
      dimensions: '3840 x 2160',
      author: 'Creative Studio',
    },
  },
  {
    id: 'file-6',
    name: 'Podcast_Episode_48_AI_Future_Transcription.md',
    sizeBytes: 1024 * 72, // 72 KB
    type: 'doc',
    mimeType: 'text/markdown',
    folderId: 'folder-media',
    createdAt: '2026-08-18T13:00:00Z',
    updatedAt: '2026-08-19T06:20:00Z',
    starred: false,
    trashed: false,
    tags: ['Podcast', 'Transcription', 'Interview', 'AI', 'Content'],
    aiCategory: 'Media & Creative',
    aiSensitivity: 'Public',
    aiSummary: 'Full audio transcript and show notes for Podcast Episode #48 featuring guest Dr. Elena Vance on autonomous agentic systems, real-time multimodal reasoning, and next-gen cloud compute.',
    aiTakeaways: [
      'Guest argues that storage and compute will fuse into continuous contextual memory.',
      'Includes 5 timestamped viral clip opportunities for YouTube Shorts and TikTok.',
      'Key quote: "Files shouldn\'t be static bytes; files should be proactive agents that answer your questions."',
    ],
    aiTags: ['Podcast', 'Transcription', 'AI-Future', 'ShowNotes'],
    contentPreview: `# Future Tech Daily - Episode #48: The Autonomous Cloud
Guest: Dr. Elena Vance (Head of Applied AI, OpenHorizon)
Host: Alex Sterling

[00:00:15] Alex: Welcome back everyone. Today we are exploring why traditional cloud storage is about to undergo its biggest paradigm shift in thirty years.
[00:01:45] Dr. Vance: Think about it: why do we still store documents in folders like filing cabinets from 1985? When you save a contract or research paper today, your cloud space should immediately read it, understand its implications, and alert you if an SLA is breached or if an exam question aligns with it.
[00:12:30] Alex: That is exactly what autonomous data indexing promises...`,
    shareSettings: {
      isPublic: true,
      shareId: 'podcast_ep48_transcript',
      accessLevel: 'viewer',
      downloadCount: 19,
      viewCount: 65,
    },
    version: 1,
    metadata: {
      durationSeconds: 2740,
      author: 'Podcast Media Team',
    },
  },
  {
    id: 'file-7',
    name: 'Master_Services_Agreement_Enterprise_v3.pdf',
    sizeBytes: 1024 * 1024 * 1.2, // 1.2 MB
    type: 'doc',
    mimeType: 'application/pdf',
    folderId: 'folder-legal',
    createdAt: '2026-08-11T15:00:00Z',
    updatedAt: '2026-08-16T12:00:00Z',
    starred: true,
    trashed: false,
    tags: ['Legal', 'MSA', 'Enterprise', 'Compliance', 'Contract'],
    aiCategory: 'Legal & Compliance',
    aiSensitivity: 'Restricted',
    aiSummary: 'Standard Enterprise Master Services Agreement covering software licensing terms, 99.95% uptime SLA, data governance, intellectual property indemnification, and mutual confidentiality provisions.',
    aiTakeaways: [
      'Standard liability capped at 12 months fees paid, with uncapped indemnification for IP infringement.',
      'Data sovereignty clause guarantees storage in customer-designated AWS/GCP regions (EU or US).',
      'Net 30 payment terms with 1.5% late payment monthly penalty.',
    ],
    aiTags: ['MSA', 'Contract', 'Legal', 'EnterpriseSLA', 'Indemnity'],
    contentPreview: `MASTER SERVICES AGREEMENT (MSA) - VERSION 3.2
PARTIES:
1. Cloud Space Technologies Inc. ("Provider")
2. Enterprise Customer Corp. ("Customer")

SECTION 4: SERVICE LEVEL AGREEMENTS (SLA)
Provider shall maintain a monthly system availability of at least 99.95%. For any downtime exceeding 0.05%, Customer is entitled to service credits calculated as 10% credit for each full hour of unscheduled outage.

SECTION 9: INTELLECTUAL PROPERTY & DATA PRIVACY
All Customer Content uploaded to Cloud Space remains the exclusive property of Customer. Provider shall not use Customer Content to train public foundation models without explicit written opt-in consent.`,
    shareSettings: {
      isPublic: false,
      shareId: 'legal_msa_v3_secure',
      accessLevel: 'viewer',
      downloadCount: 2,
      viewCount: 9,
    },
    version: 3,
    metadata: {
      pageCount: 24,
      author: 'Legal Counsel',
    },
  },
  {
    id: 'file-8',
    name: 'Vendor_Invoice_Infrastructure_GCP_Aug2026.pdf',
    sizeBytes: 1024 * 310, // 310 KB
    type: 'doc',
    mimeType: 'application/pdf',
    folderId: 'folder-legal',
    createdAt: '2026-08-18T08:00:00Z',
    updatedAt: '2026-08-18T08:00:00Z',
    starred: false,
    trashed: false,
    tags: ['Invoice', 'Infrastructure', 'Billing', 'GCP', 'Expenses'],
    aiCategory: 'Legal & Compliance',
    aiSensitivity: 'Internal',
    aiSummary: 'Monthly cloud infrastructure invoice from Google Cloud Platform for August 2026. Total amount due: $14,820.40 covering Cloud Run containers, Cloud Storage buckets, and Gemini API token throughput.',
    aiTakeaways: [
      'Invoice #GCP-INV-2026-08-8849. Due date: September 15, 2026.',
      'Storage costs accounted for $6,120, Compute for $5,400, and Gemini AI Inference for $3,300.40.',
      'Eligible for 5% early payment discount if paid before Sept 1.',
    ],
    aiTags: ['Invoice', 'Billing', 'GCP', 'Finance', 'AccountsPayable'],
    contentPreview: `INVOICE: GCP-INV-2026-08-8849
Account ID: CS-PROD-9941
Billing Period: Aug 1, 2026 - Aug 31, 2026
Total Amount Due: $14,820.40 USD

Line Items:
1. Google Cloud Storage (Multi-Region Buckets - 480TB/mo): $6,120.00
2. Cloud Run Serverless Execution (4.2M invocations): $5,400.00
3. Gemini 3.7 Flash API Token Consumption (380M tokens): $3,300.40
Payment Terms: Net 30 days`,
    shareSettings: {
      isPublic: false,
      shareId: 'inv_gcp_aug2026',
      accessLevel: 'viewer',
      downloadCount: 1,
      viewCount: 4,
    },
    version: 1,
    metadata: {
      author: 'Google Cloud Billing',
    },
  },
  {
    id: 'file-9',
    name: 'server_api_router.ts',
    sizeBytes: 1024 * 16, // 16 KB
    type: 'code',
    mimeType: 'text/typescript',
    folderId: 'folder-code',
    createdAt: '2026-08-16T11:00:00Z',
    updatedAt: '2026-08-19T14:30:00Z',
    starred: true,
    trashed: false,
    tags: ['TypeScript', 'Express', 'Backend', 'API', 'Gemini'],
    aiCategory: 'Engineering & Code',
    aiSensitivity: 'Internal',
    aiSummary: 'Main backend Express API router for Cloud Space. Implements endpoints for streaming Gemini completions, multi-part chunk uploads, semantic file retrieval, and developer telemetry collection.',
    aiTakeaways: [
      'Implements rate limiting and token budget throttling per client IP.',
      'Supports Server-Sent Events (SSE) for low-latency streaming AI chat responses.',
      'Includes health check and live Prometheus-compatible telemetry metrics.',
    ],
    aiTags: ['TypeScript', 'API', 'Express', 'Backend', 'GeminiSDK'],
    contentPreview: `import express, { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const cloudSpaceRouter = Router();

// Streaming AI File Chat Handler
cloudSpaceRouter.post('/api/ai/stream-chat', async (req: Request, res: Response) => {
  const { prompt, fileContext } = req.body;
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const stream = await ai.models.generateContentStream({
    model: 'gemini-3.7-flash',
    contents: prompt,
  });

  for await (const chunk of stream) {
    res.write(\`data: \${JSON.stringify({ text: chunk.text })}\\n\\n\`);
  }
  res.write('data: [DONE]\\n\\n');
  res.end();
});`,
    shareSettings: {
      isPublic: false,
      shareId: 'code_server_router_ts',
      accessLevel: 'editor',
      downloadCount: 8,
      viewCount: 31,
    },
    version: 8,
    metadata: {
      linesOfCode: 340,
      author: 'Lead Backend Engineer',
    },
  },
  {
    id: 'file-10',
    name: 'docker-compose.production.yml',
    sizeBytes: 1024 * 4, // 4 KB
    type: 'code',
    mimeType: 'text/yaml',
    folderId: 'folder-code',
    createdAt: '2026-08-17T09:00:00Z',
    updatedAt: '2026-08-17T09:00:00Z',
    starred: false,
    trashed: false,
    tags: ['DevOps', 'Docker', 'Kubernetes', 'Microservices', 'Redis'],
    aiCategory: 'Engineering & Code',
    aiSensitivity: 'Internal',
    aiSummary: 'Production multi-container orchestration specification defining Cloud Space backend API, Redis cache cluster, MinIO S3-compatible storage tier, and Nginx reverse proxy.',
    aiTakeaways: [
      'Configures automatic restart policies and container health checks.',
      'Binds internal network isolation between storage volume and public ingress.',
      'Defines CPU and memory resource limits to prevent noisy neighbor starvation.',
    ],
    aiTags: ['Docker', 'DevOps', 'Infrastructure', 'YAML'],
    contentPreview: `version: '3.9'
services:
  cloudspace-api:
    image: cloudspace/engine:v2.4.0
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - STORAGE_REGION=us-east1
    deploy:
      resources:
        limits:
          cpus: '4.0'
          memory: 4096M

  redis-cache:
    image: redis:7.2-alpine
    command: redis-server --save 60 1 --loglevel notice
    volumes:
      - redis-data:/data

volumes:
  redis-data:`,
    shareSettings: {
      isPublic: false,
      shareId: 'docker_compose_prod_yml',
      accessLevel: 'viewer',
      downloadCount: 3,
      viewCount: 12,
    },
    version: 1,
    metadata: {
      linesOfCode: 84,
      author: 'DevOps Lead',
    },
  },
];

export const INITIAL_WORKFLOWS: WorkflowRule[] = [
  {
    id: 'wf-1',
    title: 'Auto-Summarize & Tag on Upload',
    description: 'When any PDF or Markdown document is added, invoke Gemini 3.7 Flash to extract key takeaways and tags automatically.',
    triggerEvent: 'on_upload',
    actionType: 'auto_summarize',
    fileFilterType: 'doc',
    active: true,
    runCount: 42,
    lastRun: '2026-08-19T21:40:00Z',
  },
  {
    id: 'wf-2',
    title: 'Media Asset Smart Tagging',
    description: 'Detect visual attributes, scene composition, and color grading metadata on uploaded images and video clips.',
    triggerEvent: 'on_upload',
    actionType: 'auto_tag',
    fileFilterType: 'image',
    active: true,
    runCount: 28,
    lastRun: '2026-08-19T18:15:00Z',
  },
  {
    id: 'wf-3',
    title: 'Security & Compliance Webhook Dispatch',
    description: 'Post an event payload to enterprise Slack and audit logging webhook whenever a confidential contract is shared publicly.',
    triggerEvent: 'on_share',
    actionType: 'notify_webhook',
    fileFilterType: 'all',
    active: true,
    runCount: 14,
    lastRun: '2026-08-18T14:22:00Z',
  },
  {
    id: 'wf-4',
    title: 'Nightly Space Backup & Snapshot',
    description: 'Generate point-in-time snapshot of file metadata and generate cold-storage disaster recovery bundle.',
    triggerEvent: 'schedule_daily',
    actionType: 'extract_metadata',
    fileFilterType: 'all',
    active: true,
    runCount: 112,
    lastRun: '2026-08-19T00:00:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-08-19T22:15:20Z',
    user: 'varshith0367@gmail.com',
    action: 'AI_SEMANTIC_SEARCH',
    target: 'Query: "Q3 financial runway & burn rate"',
    ipAddress: '198.51.100.42',
    status: 'AI_PROCESSED',
    details: 'Matched 2 files via Gemini semantic index in 240ms',
  },
  {
    id: 'log-102',
    timestamp: '2026-08-19T21:40:11Z',
    user: 'varshith0367@gmail.com',
    action: 'FILE_UPLOAD',
    target: 'Biology_101_Cellular_Respiration_Notes.md',
    ipAddress: '198.51.100.42',
    status: 'SUCCESS',
    details: 'Uploaded 48 KB -> Auto-summarization workflow triggered',
  },
  {
    id: 'log-103',
    timestamp: '2026-08-19T20:10:04Z',
    user: 'varshith0367@gmail.com',
    action: 'SHARE_LINK_GENERATED',
    target: 'CloudSpace_Series_A_Pitch_Deck_2026.pdf',
    ipAddress: '198.51.100.42',
    status: 'SUCCESS',
    details: 'Password protection enabled, expires in 42 days',
  },
  {
    id: 'log-104',
    timestamp: '2026-08-19T18:04:45Z',
    user: 'system_daemon',
    action: 'STORAGE_NODE_SYNC',
    target: 'Region: europe-west1 <-> us-east1',
    ipAddress: '10.0.4.12',
    status: 'SUCCESS',
    details: 'Multi-region replication health check: 100% synchronized',
  },
  {
    id: 'log-105',
    timestamp: '2026-08-19T16:30:19Z',
    user: 'varshith0367@gmail.com',
    action: 'AI_CONTENT_STUDIO',
    target: 'Generator: Flashcard Deck (12 cards generated)',
    ipAddress: '198.51.100.42',
    status: 'AI_PROCESSED',
    details: 'Gemini 3.7 Flash token usage: 820 tokens',
  },
];
