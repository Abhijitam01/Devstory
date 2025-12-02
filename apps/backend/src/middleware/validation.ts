import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@devstory/shared';

/**
 * Validates GitHub repository URL
 */
export function validateGitHubUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    // Must be github.com
    if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') {
      return false;
    }
    
    // Must have owner and repo in path
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      return false;
    }
    
    // Check for valid characters (alphanumeric, hyphens, underscores, dots)
    const owner = pathParts[0];
    const repo = pathParts[1].replace(/\.git$/, '');
    
    if (!/^[a-zA-Z0-9._-]+$/.test(owner) || !/^[a-zA-Z0-9._-]+$/.test(repo)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates analyze request
 */
export function validateAnalyzeRequest(req: Request, res: Response, next: NextFunction): void | Response {
  const { url, maxCommits } = req.body || {};

  // Check if URL is provided
  if (!url || typeof url !== 'string') {
    const error: ApiError = {
      error: 'Missing or invalid "url" in request body',
      status: 400,
    };
    return res.status(400).json(error);
  }

  // Validate URL format
  if (!validateGitHubUrl(url)) {
    const error: ApiError = {
      error: 'Invalid GitHub repository URL. Must be in format: https://github.com/owner/repo',
      status: 400,
    };
    return res.status(400).json(error);
  }

  // Validate maxCommits if provided
  if (maxCommits !== undefined) {
    if (typeof maxCommits !== 'number' || !Number.isInteger(maxCommits)) {
      const error: ApiError = {
        error: 'maxCommits must be an integer',
        status: 400,
      };
      return res.status(400).json(error);
    }

    if (maxCommits < 1 || maxCommits > 1000) {
      const error: ApiError = {
        error: 'maxCommits must be between 1 and 1000',
        status: 400,
      };
      return res.status(400).json(error);
    }
  }

  // Sanitize URL (remove trailing slashes, .git extension)
  req.body.url = url.trim().replace(/\/$/, '').replace(/\.git$/, '');

  next();
}

/**
 * Validates commit endpoint parameters
 */
export function validateCommitParams(req: Request, res: Response, next: NextFunction): void | Response {
  const { owner, repo, sha } = req.params;

  if (!owner || !repo || !sha) {
    const error: ApiError = {
      error: 'Missing required parameters: owner, repo, sha',
      status: 400,
    };
    return res.status(400).json(error);
  }

  // Validate format
  if (!/^[a-zA-Z0-9._-]+$/.test(owner) || !/^[a-zA-Z0-9._-]+$/.test(repo)) {
    const error: ApiError = {
      error: 'Invalid owner or repository name format',
      status: 400,
    };
    return res.status(400).json(error);
  }

  // Validate SHA (should be 40 char hex or 7 char short)
  if (!/^[a-f0-9]{7,40}$/i.test(sha)) {
    const error: ApiError = {
      error: 'Invalid commit SHA format',
      status: 400,
    };
    return res.status(400).json(error);
  }

  next();
}

