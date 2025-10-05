import axios, { AxiosResponse } from 'axios';
import pLimit from 'p-limit';
import { 
  GitHubRepoInfo, 
  GitHubCommit, 
  CommitItem, 
  GitHubConfig,
  statusToShort,
  formatDate,
  truncateCommitHash,
  getFirstLine
} from '@devstory/shared';
import {
  ListCommitsParams,
  GetCommitDetailsParams,
  AnalyzeRepositoryParams,
  GitHubApiHeaders,
  GitHubApiError
} from '../types/github';

/**
 * Parses GitHub repository URL to extract owner and repo
 */
export function parseGithubRepoUrl(inputUrl: string): GitHubRepoInfo {
  try {
    const url = new URL(inputUrl);
    if (url.hostname !== 'github.com') {
      throw new Error('Only github.com URLs are supported');
    }
    
    const parts = url.pathname
      .replace(/\.git$/, '')
      .replace(/^\/+|\/+$/g, '')
      .split('/');
      
    if (parts.length < 2) {
      throw new Error('Invalid GitHub repo URL');
    }
    
    const [owner, repo] = parts;
    return { owner, repo };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid GitHub URL: ${error.message}`);
    }
    throw new Error('Invalid GitHub URL');
  }
}

/**
 * Creates headers for GitHub API requests
 */
function getAxiosHeaders(token?: string): GitHubApiHeaders {
  const headers: GitHubApiHeaders = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'DevStory/1.0.0'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Lists commits from a GitHub repository with pagination
 */
export async function listCommits({ 
  owner, 
  repo, 
  token, 
  maxCommits 
}: ListCommitsParams): Promise<GitHubCommit[]> {
  const perPage = 100;
  const headers = getAxiosHeaders(token);
  const commits: GitHubCommit[] = [];
  let page = 1;

  while (true) {
    try {
      const response: AxiosResponse<GitHubCommit[]> = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits`,
        { 
          params: { per_page: perPage, page }, 
          headers,
          timeout: 30000 // 30 second timeout
        }
      );

      const data = response.data;
      if (!Array.isArray(data) || data.length === 0) {
        break;
      }

      commits.push(...data);

      if (maxCommits && commits.length >= maxCommits) {
        return commits.slice(0, maxCommits);
      }

      if (data.length < perPage) {
        break;
      }
      
      page += 1;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError: GitHubApiError = {
          message: error.message,
          status: error.response?.status,
          response: error.response ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          } : undefined
        };
        throw apiError;
      }
      throw error;
    }
  }

  return commits;
}

/**
 * Gets detailed information about a specific commit
 */
export async function getCommitDetails({ 
  owner, 
  repo, 
  sha, 
  token 
}: GetCommitDetailsParams): Promise<GitHubCommit> {
  const headers = getAxiosHeaders(token);
  
  try {
    const response: AxiosResponse<GitHubCommit> = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
      { 
        headers,
        timeout: 30000 // 30 second timeout
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError: GitHubApiError = {
        message: error.message,
        status: error.response?.status,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : undefined
      };
      throw apiError;
    }
    throw error;
  }
}

/**
 * Analyzes a GitHub repository and returns commit timeline
 */
export async function analyzeRepository(
  repoUrl: string, 
  config: GitHubConfig = {}
): Promise<CommitItem[]> {
  const { owner, repo } = parseGithubRepoUrl(repoUrl);
  const { token, maxCommits } = config;
  
  // Get list of commits
  const commits = await listCommits({ owner, repo, token, maxCommits });
  
  if (commits.length === 0) {
    return [];
  }

  // Get detailed commit information with rate limiting
  const limit = pLimit(6); // Limit concurrent requests to avoid rate limits
  const detailPromises = commits.map((commit) => 
    limit(() => getCommitDetails({ owner, repo, sha: commit.sha, token }))
  );
  
  const details = await Promise.all(detailPromises);

  // Map to our internal format
  const mapped: CommitItem[] = details.map((detail) => {
    const dateIso = detail.commit?.author?.date || 
                   detail.commit?.committer?.date || 
                   new Date().toISOString();
    const date = formatDate(dateIso);
    const message = getFirstLine(detail.commit?.message || '');
    const authorName = detail.commit?.author?.name || 
                      detail.author?.login || 
                      'Unknown';
    const files = Array.isArray(detail.files) ? detail.files : [];
    
    return {
      commit: truncateCommitHash(detail.sha || ''),
      author: authorName,
      date,
      timestamp: dateIso,
      message,
      changes: files.map((file) => ({ 
        status: statusToShort(file.status), 
        file: file.filename 
      })),
    };
  });

  // Sort by timestamp (oldest first)
  mapped.sort((a, b) => {
    if (a.timestamp < b.timestamp) return -1;
    if (a.timestamp > b.timestamp) return 1;
    return 0;
  });

  return mapped;
}
