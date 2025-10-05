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
}

export type {
  GitHubCommit,
  GitHubFileChange,
  GitHubRepoInfo,
  CommitItem,
  FileChange,
  GitHubConfig
};
