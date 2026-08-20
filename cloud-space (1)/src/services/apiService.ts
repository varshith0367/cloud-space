import { CloudFile, DeveloperTelemetry, SemanticSearchResult } from '../types/cloudSpace';

export async function searchFilesSemantically(query: string, files: CloudFile[]): Promise<{ results: SemanticSearchResult[]; modelUsed: string }> {
  try {
    const res = await fetch('/api/ai/semantic-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, files }),
    });
    if (!res.ok) throw new Error('Search request failed');
    return await res.json();
  } catch (err: any) {
    console.warn('Semantic search fallback:', err);
    // Client fallback
    const lowerQ = query.toLowerCase();
    const results = files
      .filter((f) => !f.trashed)
      .map((f) => {
        let score = 0;
        let matchReason = '';
        if (f.name.toLowerCase().includes(lowerQ)) {
          score += 50;
          matchReason = 'Filename keywords match';
        }
        if (f.tags.some((t) => t.toLowerCase().includes(lowerQ))) {
          score += 40;
          matchReason = (matchReason ? matchReason + ', ' : '') + 'Tagged topic match';
        }
        if ((f.contentPreview || '').toLowerCase().includes(lowerQ)) {
          score += 40;
          matchReason = (matchReason ? matchReason + ', ' : '') + 'Content match';
        }
        if ((f.aiSummary || '').toLowerCase().includes(lowerQ)) {
          score += 35;
          matchReason = (matchReason ? matchReason + ', ' : '') + 'AI conceptual match';
        }
        return {
          id: f.id,
          relevanceScore: Math.min(98, score || 20),
          matchReason: matchReason || 'Related context',
          highlightExcerpt: (f.contentPreview || f.aiSummary || f.name).slice(0, 140) + '...',
        };
      })
      .filter((r) => r.relevanceScore >= 25)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    return { results, modelUsed: 'client-heuristic' };
  }
}

export async function summarizeFileWithAI(file: CloudFile, persona?: string) {
  const res = await fetch('/api/ai/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      content: file.contentPreview || file.aiSummary,
      persona,
    }),
  });
  if (!res.ok) throw new Error('Summarization failed');
  return await res.json();
}

export async function chatWithFilesAI(params: {
  message: string;
  history?: Array<{ role: 'user' | 'model'; content: string }>;
  activeFile?: CloudFile | null;
  allFiles?: CloudFile[];
  persona?: string;
}): Promise<{ reply: string; citations?: string[] }> {
  const res = await fetch('/api/ai/chat-with-file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Chat failed');
  return await res.json();
}

export async function generateContentFromAI(params: {
  generatorType: string;
  fileData?: CloudFile | null;
  customInstructions?: string;
  persona?: string;
}) {
  const res = await fetch('/api/ai/content-generator', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Generation failed');
  return await res.json();
}

export async function autoOrganizeFilesAI(files: CloudFile[]) {
  const res = await fetch('/api/ai/auto-organize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files }),
  });
  if (!res.ok) throw new Error('Auto organize failed');
  return await res.json();
}

export async function fetchDeveloperMetrics(): Promise<DeveloperTelemetry> {
  const res = await fetch('/api/dev/metrics');
  if (!res.ok) throw new Error('Failed to fetch telemetry');
  return await res.json();
}

export async function testDeveloperWebhook(eventType: string, payload: any) {
  const res = await fetch('/api/dev/webhook-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventType, payload }),
  });
  if (!res.ok) throw new Error('Webhook test failed');
  return await res.json();
}

export async function testDeveloperCommand(command: string) {
  const res = await fetch('/api/dev/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command }),
  });
  if (!res.ok) throw new Error('Command failed');
  return await res.json();
}

