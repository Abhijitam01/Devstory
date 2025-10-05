import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { analyzeRepository } from './services/github';
import { AnalyzeRequest, AnalyzeResponse, ApiError, ServerConfig } from '@devstory/shared';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

// Server configuration
const config: ServerConfig = {
  port: PORT,
  githubToken: process.env.GITHUB_TOKEN,
  corsOrigin: process.env.CORS_ORIGIN
};

// Middleware
app.use(cors({
  origin: config.corsOrigin || true,
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
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
      info: 'GET /api/info'
    }
  });
});

// Main analysis endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { url, maxCommits }: AnalyzeRequest = req.body || {};
    
    // Validate input
    if (!url || typeof url !== 'string') {
      const error: ApiError = { 
        error: 'Missing or invalid "url" in request body' 
      };
      return res.status(400).json(error);
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      const error: ApiError = { 
        error: 'Invalid URL format' 
      };
      return res.status(400).json(error);
    }

    // Validate maxCommits if provided
    if (maxCommits !== undefined) {
      if (typeof maxCommits !== 'number' || maxCommits < 1 || maxCommits > 1000) {
        const error: ApiError = { 
          error: 'maxCommits must be a number between 1 and 1000' 
        };
        return res.status(400).json(error);
      }
    }

    // Analyze repository
    const commits = await analyzeRepository(url, { 
      token: config.githubToken, 
      maxCommits 
    });

    const response: AnalyzeResponse = {
      repoUrl: url,
      count: commits.length,
      commits
    };

    res.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    
    let status = 500;
    let message = 'Internal server error';
    
    if (error && typeof error === 'object' && 'status' in error) {
      status = error.status as number;
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      message = error.message as string;
    }
    
    // Handle specific GitHub API errors
    if (status === 404) {
      message = 'Repository not found or is private';
    } else if (status === 403) {
      message = 'Rate limit exceeded or access forbidden';
    } else if (status === 401) {
      message = 'Invalid GitHub token';
    }
    
    const apiError: ApiError = { error: message };
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
app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', error);
  const apiError: ApiError = { 
    error: 'Internal server error' 
  };
  res.status(500).json(apiError);
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 DevStory backend server listening on port ${config.port}`);
  console.log(`📊 Health check: http://localhost:${config.port}/health`);
  console.log(`📖 API info: http://localhost:${config.port}/api/info`);
  console.log(`🔍 Analysis endpoint: http://localhost:${config.port}/api/analyze`);
});

export default app;
