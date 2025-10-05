// GitHub API Types
export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
  files: GitHubFileChange[];
}

export interface GitHubFileChange {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed' | 'copied' | 'changed';
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

export interface GitHubRepoInfo {
  owner: string;
  repo: string;
}

// Application Types
export type FileChangeStatus = 'A' | 'M' | 'D' | 'R' | 'C';

export interface FileChange {
  status: FileChangeStatus;
  file: string;
  additions?: number;
  deletions?: number;
  changes?: number;
  patch?: string;
  content?: string;
  size?: number;
}

export interface CommitItem {
  commit: string;
  author: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  message: string;
  changes: FileChange[];
}

export interface AnalyzeRequest {
  url: string;
  maxCommits?: number;
}

export interface AnalyzeResponse {
  repoUrl: string;
  count: number;
  commits: CommitItem[];
  codebaseStats?: CodebaseStats;
}

export interface CodebaseStats {
  totalFiles: number;
  totalLines: number;
  languages: LanguageStats[];
  fileTypes: FileTypeStats[];
  contributors: ContributorStats[];
  commitFrequency: CommitFrequency;
  averageCommitSize: number;
  largestCommit: { sha: string; files: number; lines: number };
  mostActiveDay: string;
  mostActiveHour: number;
}

export interface LanguageStats {
  language: string;
  files: number;
  lines: number;
  percentage: number;
}

export interface FileTypeStats {
  type: FileType;
  count: number;
  percentage: number;
}

export interface ContributorStats {
  author: string;
  commits: number;
  linesAdded: number;
  linesDeleted: number;
  percentage: number;
}

export interface CommitFrequency {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface ApiError {
  error: string;
  status?: number;
}

// Configuration Types
export interface GitHubConfig {
  token?: string;
  maxCommits?: number;
}

export interface ServerConfig {
  port: number;
  githubToken?: string;
  corsOrigin?: string;
}

// Component Props Types
export interface TimelineTableProps {
  commits: CommitItem[];
  isLoading?: boolean;
}

export interface RepositoryFormProps {
  onSubmit: (url: string, maxCommits?: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Utility Types
export type FileType = 'Backend' | 'Frontend' | 'Schema' | 'Infra' | 'Other';

export interface FileTypeMapping {
  [key: string]: FileType;
}
