import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { analyzeRepository, getCommitDetails, getFileContents, parseGithubRepoUrl, generateCodebaseStats } from './services/github';
import { cache } from './services/cache';
import { AnalyzeRequest, AnalyzeResponse, ApiError, ServerConfig } from '@devstory/shared';
import { securityHeaders } from './middleware/security';
import { apiRateLimiter, analyzeRateLimiter } from './middleware/rate-limit';
import { validateAnalyzeRequest, validateCommitParams } from './middleware/validation';
import { requestLogger, errorLogger } from './middleware/logging';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

// Server configuration
const config: ServerConfig = {
  port: PORT,
  githubToken: process.env.GITHUB_TOKEN,
  corsOrigin: process.env.CORS_ORIGIN
};

// Middleware
app.use(securityHeaders);
app.use(cors({
  origin: config.corsOrigin || true,
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(apiRateLimiter.middleware());

// Request logging middleware
app.use(requestLogger);

// Health check endpoint
app.get('/health', async (_req: Request, res: Response) => {
  const health: Record<string, any> = {
    ok: true,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
    cache: cache.getStats(),
  };

  // Check GitHub API connectivity
  try {
    const testResponse = await fetch('https://api.github.com', {
      method: 'HEAD',
      headers: {
        'User-Agent': 'DevStory/1.0.0',
      },
    });
    health.githubApi = {
      status: testResponse.status,
      accessible: testResponse.ok,
    };
  } catch (error) {
    health.githubApi = {
      accessible: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  res.json(health);
});

// API info endpoint
app.get('/api/info', (_req: Request, res: Response) => {
  res.json({
    name: 'DevStory API',
    version: '1.0.0',
    description: 'GitHub repository analysis API',
    endpoints: {
      health: 'GET /health',
      analyze: 'POST /api/analyze',
      commit: 'GET /api/commit/:owner/:repo/:sha?includeContent=true',
      info: 'GET /api/info'
    }
  });
});

// Get detailed commit information with file contents
app.get('/api/commit/:owner/:repo/:sha', validateCommitParams, async (req: Request, res: Response) => {
  try {
    const { owner, repo, sha } = req.params;
    const { includeContent } = req.query;
    
    if (!owner || !repo || !sha) {
      const error: ApiError = { 
        error: 'Missing required parameters: owner, repo, sha' 
      };
      return res.status(400).json(error);
    }

    // Get commit details
    const commitDetails = await getCommitDetails({ 
      owner, 
      repo, 
      sha, 
      token: config.githubToken 
    });

    // If includeContent is true, fetch file contents
    if (includeContent === 'true' && commitDetails.files) {
      const MAX_FILE_SIZE = 1024 * 1024; // 1MB limit
      const MAX_FILE_SIZE_DISPLAY = 500 * 1024; // 500KB for display
      
      const filesWithContent = await Promise.all(
        commitDetails.files.map(async (file) => {
          try {
            if (file.status !== 'removed') {
              const content = await getFileContents({
                owner,
                repo,
                path: file.filename,
                ref: sha,
                token: config.githubToken
              });
              
              // Check file size
              if (content.size > MAX_FILE_SIZE) {
                return {
                  ...file,
                  size: content.size,
                  content: undefined,
                  error: `File too large (${(content.size / 1024).toFixed(0)}KB). Maximum size is ${(MAX_FILE_SIZE / 1024).toFixed(0)}KB.`
                };
              }
              
              // Check if file is binary (common binary extensions)
              const binaryExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.pdf', 
                                       '.zip', '.tar', '.gz', '.exe', '.dll', '.so', '.dylib',
                                       '.woff', '.woff2', '.ttf', '.eot', '.otf', '.mp4', '.mp3',
                                       '.mov', '.avi', '.webm', '.bin', '.dat'];
              const isBinary = binaryExtensions.some(ext => 
                file.filename.toLowerCase().endsWith(ext)
              );
              
              if (isBinary) {
                return {
                  ...file,
                  size: content.size,
                  content: undefined,
                  error: 'Binary file content cannot be displayed.'
                };
              }
              
              // Decode base64 content
              let decodedContent: string;
              try {
                decodedContent = Buffer.from(content.content, 'base64').toString('utf-8');
                
                // Check if decoded content is valid UTF-8 (basic check)
                if (decodedContent.includes('\0') || decodedContent.length === 0) {
                  return {
                    ...file,
                    size: content.size,
                    content: undefined,
                    error: 'File appears to be binary or invalid text format.'
                  };
                }
                
                // Limit content size for display
                if (decodedContent.length > MAX_FILE_SIZE_DISPLAY) {
                  decodedContent = decodedContent.substring(0, MAX_FILE_SIZE_DISPLAY) + 
                    `\n\n... (File truncated. Total size: ${(content.size / 1024).toFixed(0)}KB)`;
                }
              } catch (decodeError) {
                return {
                  ...file,
                  size: content.size,
                  content: undefined,
                  error: 'Failed to decode file content. File may be binary or corrupted.'
                };
              }
              
              return {
                ...file,
                content: decodedContent,
                size: content.size
              };
            }
            return file;
          } catch (error) {
            // If we can't get content, return file without content
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
              ...file,
              content: undefined,
              error: `Failed to fetch file content: ${errorMessage}`
            };
          }
        })
      );
      
      commitDetails.files = filesWithContent;
    }

    res.json(commitDetails);
  } catch (error) {
    logger.error('Commit details error', error instanceof Error ? error : new Error(String(error)), {
      owner: req.params.owner,
      repo: req.params.repo,
      sha: req.params.sha,
    });
    
    let status = 500;
    let message = 'Internal server error';
    
    if (error && typeof error === 'object' && 'status' in error) {
      status = error.status as number;
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      message = error.message as string;
    }
    
    const apiError: ApiError = { error: message };
    res.status(status).json(apiError);
  }
});

// Main analysis endpoint
app.post('/api/analyze', analyzeRateLimiter.middleware(), validateAnalyzeRequest, async (req: Request, res: Response) => {
  try {
    const { url, maxCommits, page, pageSize }: AnalyzeRequest & { page?: number; pageSize?: number } = req.body;

    // Check cache first
    const cacheKey = `${url}:${maxCommits || 'all'}`;
    const cached = cache.get<AnalyzeResponse>(url, maxCommits);
    
    if (cached) {
      // Add cache headers
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    // Analyze repository
    const allCommits = await analyzeRepository(url, { 
      token: config.githubToken, 
      maxCommits 
    });

    // Generate codebase statistics (from all commits, not just current page)
    const codebaseStats = generateCodebaseStats(allCommits);

    // Apply pagination if requested
    const pageNum = page && page > 0 ? page : 1;
    const size = pageSize && pageSize > 0 && pageSize <= 100 ? pageSize : 50;
    const totalCommits = allCommits.length;
    const totalPages = Math.ceil(totalCommits / size);
    const startIndex = (pageNum - 1) * size;
    const endIndex = startIndex + size;
    const paginatedCommits = allCommits.slice(startIndex, endIndex);

    const response: AnalyzeResponse = {
      repoUrl: url,
      count: paginatedCommits.length,
      commits: paginatedCommits,
      codebaseStats,
      pagination: {
        page: pageNum,
        pageSize: size,
        totalPages,
        totalCommits,
      }
    };

    // Cache the response (cache for 5 minutes)
    cache.set(url, response, 5 * 60 * 1000);

    // Add cache headers
    res.setHeader('X-Cache', 'MISS');
    res.json(response);
  } catch (error) {
    // Better error logging and extraction
    let status = 500;
    let message = 'Internal server error';
    
    // Handle GitHubApiError objects
    if (error && typeof error === 'object' && 'status' in error) {
      status = Number(error.status) || 500;
    }
    
    // Extract message from various error types
    if (error instanceof Error) {
      message = error.message;
    } else if (error && typeof error === 'object') {
      if ('message' in error && typeof error.message === 'string') {
        message = error.message;
      } else if ('response' in error && error.response && typeof error.response === 'object') {
        const response = error.response as any;
        if (response.data && typeof response.data === 'object') {
          if ('message' in response.data) {
            message = String(response.data.message);
          }
        }
        if (response.status) {
          status = Number(response.status);
        }
      }
    }
    
    // Log the full error for debugging
    const errorObj = error instanceof Error ? error : new Error(message);
    logger.error('Analysis error', errorObj, {
      status,
      errorType: error?.constructor?.name,
      errorDetails: error instanceof Error ? error.stack : JSON.stringify(error, null, 2),
      url: req.body?.url,
      maxCommits: req.body?.maxCommits,
    });
    
    // Handle specific GitHub API errors with user-friendly messages
    if (status === 404) {
      message = 'Repository not found or is private. Please check the URL and ensure the repository is public.';
    } else if (status === 403) {
      // Check for rate limit in error response
      let rateLimitRemaining: string | null = null;
      let rateLimitReset: string | null = null;
      
      if (error && typeof error === 'object') {
        // Check in response headers
        if ('response' in error && error.response && typeof error.response === 'object') {
          const response = error.response as any;
          if (response.headers) {
            rateLimitRemaining = response.headers['x-ratelimit-remaining'] || 
                                 response.headers['X-RateLimit-Remaining'];
            rateLimitReset = response.headers['x-ratelimit-reset'] || 
                            response.headers['X-RateLimit-Reset'];
          }
        }
        // Check if it's a GitHubApiError with rateLimitReset
        if ('rateLimitReset' in error && error.rateLimitReset) {
          rateLimitReset = error.rateLimitReset as string;
        }
      }
      
      const remaining = rateLimitRemaining ? Number(rateLimitRemaining) : null;
      if (remaining !== null && remaining === 0) {
        if (rateLimitReset) {
          const resetTime = new Date(rateLimitReset);
          const minutesUntilReset = Math.ceil((resetTime.getTime() - Date.now()) / 60000);
          message = `GitHub API rate limit exceeded. Rate limit resets in ${minutesUntilReset} minutes. Add a GitHub Personal Access Token to your .env file (GITHUB_TOKEN) for 5000 requests/hour instead of 60.`;
        } else {
          message = 'GitHub API rate limit exceeded. Please wait a few minutes and try again. Add a GitHub Personal Access Token to your .env file (GITHUB_TOKEN) for higher limits.';
        }
      } else {
        message = 'Access forbidden. The repository may be private or you may not have permission to access it. If this is a public repository, you may have hit the rate limit.';
      }
    } else if (status === 401) {
      message = 'Invalid GitHub token. Please check your GITHUB_TOKEN environment variable.';
    } else if (status === 422) {
      message = 'Invalid repository URL or repository is empty. Please check the URL format.';
    } else if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
      message = 'Request timed out. The repository may be too large. Try reducing maxCommits or try again later.';
    } else if (message.includes('ENOTFOUND') || message.includes('ECONNREFUSED')) {
      message = 'Network error. Please check your internet connection and try again.';
    }
    
    const apiError: ApiError = { error: message, status };
    res.status(status).json(apiError);
  }
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  const error: ApiError = { 
    error: `Route ${req.method} ${req.originalUrl} not found` 
  };
  res.status(404).json(error);
});

// Global error handler
app.use(errorLogger);
app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
  const apiError: ApiError = { 
    error: 'Internal server error' 
  };
  res.status(500).json(apiError);
});

// Start server
app.listen(config.port, () => {
  logger.info('Server started', {
    port: config.port,
    environment: process.env.NODE_ENV || 'development',
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🚀 DevStory backend server listening on port ${config.port}`);
    console.log(`📊 Health check: http://localhost:${config.port}/health`);
    console.log(`📖 API info: http://localhost:${config.port}/api/info`);
    console.log(`🔍 Analysis endpoint: http://localhost:${config.port}/api/analyze`);
  }
});

export default app;
