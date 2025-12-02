import { 
  GitHubCommit, 
  GitHubFileChange, 
  GitHubRepoInfo, 
  CommitItem, 
  FileChange,
  GitHubConfig 
} from '@devstory/shared';

export interface GitHubApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface GitHubApiError {
  message: string;
  status?: number;
  rateLimitReset?: string;
  response?: {
    status: number;
    statusText: string;
    data: any;
  };
}

export interface ListCommitsParams {
  owner: string;
  repo: string;
  token?: string;
  maxCommits?: number;
}

export interface GetCommitDetailsParams {
  owner: string;
  repo: string;
  sha: string;
  token?: string;
}

export interface AnalyzeRepositoryParams {
  repoUrl: string;
  config?: GitHubConfig;
}

export interface GitHubApiHeaders {
  'Accept': string;
  'Authorization'?: string;
  'User-Agent'?: string;
  [key: string]: string | undefined;
}

// Developer Tools Types
export interface PackageJsonAnalysis {
  name: string;
  version: string;
  description?: string;
  main?: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies?: Record<string, string>;
  engines?: Record<string, string>;
  keywords?: string[];
  author?: string | { name: string; email?: string; url?: string };
  license?: string;
  repository?: string | { type: string; url: string };
  homepage?: string;
  bugs?: string | { url: string; email?: string };
  packageManager?: string;
}

export interface ProjectStructure {
  files: string[];
  directories: string[];
  configFiles: string[];
  testFiles: string[];
  documentationFiles: string[];
  buildFiles: string[];
  ciFiles: string[];
}

export interface CommandAnalysis {
  script: string;
  command: string;
  description?: string;
  category: 'build' | 'test' | 'dev' | 'deploy' | 'lint' | 'format' | 'other';
  frequency: number;
  lastUsed?: string;
}

export interface DependencyAnalysis {
  name: string;
  version: string;
  type: 'dependency' | 'devDependency' | 'peerDependency';
  purpose?: string;
  security?: {
    vulnerabilities: number;
    lastAudit?: string;
  };
  popularity?: {
    downloads: number;
    stars: number;
  };
}

export interface CiCdAnalysis {
  platforms: string[];
  workflows: Array<{
    name: string;
    file: string;
    triggers: string[];
    jobs: string[];
    status?: 'active' | 'disabled';
  }>;
  deployments: Array<{
    platform: string;
    environment: string;
    branch?: string;
  }>;
}

export interface CodebaseInsights {
  languages: Record<string, number>;
  frameworks: string[];
  architecture: string[];
  patterns: string[];
  complexity: {
    cyclomatic: number;
    cognitive: number;
    maintainability: number;
  };
  quality: {
    testCoverage?: number;
    lintingErrors: number;
    securityIssues: number;
  };
}

export interface DeveloperToolsResponse {
  packageJson?: PackageJsonAnalysis;
  projectStructure?: ProjectStructure;
  commands: CommandAnalysis[];
  dependencies: DependencyAnalysis[];
  ciCd?: CiCdAnalysis;
  insights: CodebaseInsights;
  recommendations: string[];
}

export type {
  GitHubCommit,
  GitHubFileChange,
  GitHubRepoInfo,
  CommitItem,
  FileChange,
  GitHubConfig
};
