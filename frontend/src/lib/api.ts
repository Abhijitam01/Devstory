export type FileChange = { status: string; file: string };
export type CommitItem = {
  commit: string;
  author: string;
  date: string; // YYYY-MM-DD
  message: string;
  changes: FileChange[];
};

export type AnalyzeResponse = {
  repoUrl: string;
  count: number;
  commits: CommitItem[];
};

const DEFAULT_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function analyzeRepo(repoUrl: string, maxCommits?: number): Promise<AnalyzeResponse> {
  const res = await fetch(`${DEFAULT_BACKEND_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: repoUrl, maxCommits }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed: ${res.status}`);
  }
  return res.json();
}
