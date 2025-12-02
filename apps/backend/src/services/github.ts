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
  getFirstLine,
  CodebaseStats,
  LanguageStats,
  FileTypeStats,
  ContributorStats,
  CommitFrequency,
  FileType,
  getFileType
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
        
        // Check for rate limit headers
        if (error.response?.status === 403) {
          const rateLimitRemaining = error.response.headers['x-ratelimit-remaining'];
          const rateLimitReset = error.response.headers['x-ratelimit-reset'];
          if (rateLimitRemaining === '0' && rateLimitReset) {
            const resetTime = new Date(parseInt(rateLimitReset) * 1000);
            apiError.message = `Rate limit exceeded. Resets at ${resetTime.toISOString()}`;
            apiError.rateLimitReset = resetTime.toISOString();
          }
        }
        
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
 * Gets file contents from GitHub
 */
export async function getFileContents({
  owner,
  repo,
  path,
  ref = 'HEAD',
  token
}: {
  owner: string;
  repo: string;
  path: string;
  ref?: string;
  token?: string;
}): Promise<{ content: string; encoding: string; size: number }> {
  const headers = getAxiosHeaders(token);
  
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { 
        params: { ref },
        headers,
        timeout: 30000
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
      authorAvatar: detail.author?.avatar_url,
      date,
      timestamp: dateIso,
      message,
      changes: files.map((file) => ({ 
        status: statusToShort(file.status), 
        file: file.filename,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes
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

/**
 * Gets language name from file extension
 */
function getLanguageFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const languageMap: Record<string, string> = {
    'js': 'JavaScript',
    'jsx': 'JavaScript',
    'ts': 'TypeScript',
    'tsx': 'TypeScript',
    'py': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'cs': 'C#',
    'php': 'PHP',
    'rb': 'Ruby',
    'go': 'Go',
    'rs': 'Rust',
    'swift': 'Swift',
    'kt': 'Kotlin',
    'scala': 'Scala',
    'clj': 'Clojure',
    'hs': 'Haskell',
    'ml': 'OCaml',
    'sql': 'SQL',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'sass': 'SASS',
    'less': 'Less',
    'json': 'JSON',
    'xml': 'XML',
    'yaml': 'YAML',
    'yml': 'YAML',
    'toml': 'TOML',
    'md': 'Markdown',
    'sh': 'Shell',
    'bash': 'Bash',
    'zsh': 'Zsh',
    'fish': 'Fish',
    'ps1': 'PowerShell',
    'r': 'R',
    'm': 'MATLAB',
    'dart': 'Dart',
    'lua': 'Lua',
    'pl': 'Perl',
    'vim': 'Vim Script',
    'dockerfile': 'Dockerfile',
    'makefile': 'Makefile',
    'cmake': 'CMake',
  };
  return languageMap[ext] || 'Other';
}

/**
 * Generates codebase statistics from commit data
 */
export function generateCodebaseStats(commits: CommitItem[]): CodebaseStats {
  if (commits.length === 0) {
    return {
      totalFiles: 0,
      totalLines: 0,
      languages: [],
      fileTypes: [],
      contributors: [],
      commitFrequency: { daily: 0, weekly: 0, monthly: 0 },
      averageCommitSize: 0,
      largestCommit: { sha: '', files: 0, lines: 0 },
      mostActiveDay: '0',
      mostActiveHour: 0,
    };
  }

  // Collect all unique files
  const uniqueFiles = new Set<string>();
  const languageMap = new Map<string, { files: Set<string>; lines: number }>();
  const fileTypeMap = new Map<FileType, number>();
  const contributorMap = new Map<string, { commits: number; linesAdded: number; linesDeleted: number }>();
  const dayCounts = new Map<number, number>(); // 0-6 (Sunday-Saturday)
  const hourCounts = new Map<number, number>(); // 0-23
  let totalLines = 0;
  let largestCommit: { sha: string; files: number; lines: number } = { sha: '', files: 0, lines: 0 };

  commits.forEach((commit) => {
    // Track unique files
    commit.changes.forEach((change) => {
      uniqueFiles.add(change.file);
      
      // Track language statistics
      const language = getLanguageFromExtension(change.file);
      if (!languageMap.has(language)) {
        languageMap.set(language, { files: new Set(), lines: 0 });
      }
      const langData = languageMap.get(language)!;
      langData.files.add(change.file);
      langData.lines += (change.additions || 0) + (change.deletions || 0);
      
      // Track file type statistics
      const fileType = getFileType(change.file);
      fileTypeMap.set(fileType, (fileTypeMap.get(fileType) || 0) + 1);
      
      // Track lines
      const additions = change.additions || 0;
      const deletions = change.deletions || 0;
      totalLines += additions + deletions;
    });

    // Track contributor statistics
    const author = commit.author;
    if (!contributorMap.has(author)) {
      contributorMap.set(author, { commits: 0, linesAdded: 0, linesDeleted: 0 });
    }
    const contribData = contributorMap.get(author)!;
    contribData.commits += 1;
    commit.changes.forEach((change) => {
      contribData.linesAdded += change.additions || 0;
      contribData.linesDeleted += change.deletions || 0;
    });

    // Track commit frequency by day and hour
    const commitDate = new Date(commit.timestamp);
    const day = commitDate.getDay();
    const hour = commitDate.getHours();
    dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);

    // Track largest commit
    const commitFiles = commit.changes.length;
    const commitLines = commit.changes.reduce((sum, change) => 
      sum + (change.additions || 0) + (change.deletions || 0), 0
    );
    if (commitFiles > largestCommit.files || 
        (commitFiles === largestCommit.files && commitLines > largestCommit.lines)) {
      largestCommit = {
        sha: commit.commit,
        files: commitFiles,
        lines: commitLines,
      };
    }
  });

  // Calculate language statistics
  const languages: LanguageStats[] = Array.from(languageMap.entries())
    .map(([language, data]) => ({
      language,
      files: data.files.size,
      lines: data.lines,
      percentage: totalLines > 0 ? (data.lines / totalLines) * 100 : 0,
    }))
    .sort((a, b) => b.lines - a.lines);

  // Calculate file type statistics
  const totalFileChanges = Array.from(fileTypeMap.values()).reduce((sum, count) => sum + count, 0);
  const fileTypes: FileTypeStats[] = Array.from(fileTypeMap.entries())
    .map(([type, count]) => ({
      type,
      count,
      percentage: totalFileChanges > 0 ? (count / totalFileChanges) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate contributor statistics
  const totalCommits = commits.length;
  const contributors: ContributorStats[] = Array.from(contributorMap.entries())
    .map(([author, data]) => ({
      author,
      commits: data.commits,
      linesAdded: data.linesAdded,
      linesDeleted: data.linesDeleted,
      percentage: totalCommits > 0 ? (data.commits / totalCommits) * 100 : 0,
    }))
    .sort((a, b) => b.commits - a.commits);

  // Calculate commit frequency
  const firstCommit = new Date(commits[0].timestamp);
  const lastCommit = new Date(commits[commits.length - 1].timestamp);
  const daysDiff = Math.max(1, Math.ceil((lastCommit.getTime() - firstCommit.getTime()) / (1000 * 60 * 60 * 24)));
  const weeksDiff = Math.max(1, daysDiff / 7);
  const monthsDiff = Math.max(1, daysDiff / 30);

  const commitFrequency: CommitFrequency = {
    daily: totalCommits / daysDiff,
    weekly: totalCommits / weeksDiff,
    monthly: totalCommits / monthsDiff,
  };

  // Find most active day
  const mostActiveDay = Array.from(dayCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0]?.toString() || '0';

  // Find most active hour
  const mostActiveHour = Array.from(hourCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 0;

  // Calculate average commit size
  const averageCommitSize = commits.length > 0
    ? commits.reduce((sum, commit) => sum + commit.changes.length, 0) / commits.length
    : 0;

  return {
    totalFiles: uniqueFiles.size,
    totalLines,
    languages,
    fileTypes,
    contributors,
    commitFrequency,
    averageCommitSize,
    largestCommit,
    mostActiveDay,
    mostActiveHour,
  };
}
