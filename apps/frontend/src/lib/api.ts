import { AnalyzeRequest, AnalyzeResponse, ApiError } from '@devstory/shared';
import { getCached, setCached } from './cache';

const DEFAULT_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on client errors (4xx) except rate limits
      if (error instanceof Error && error.message.includes('Rate limit')) {
        if (attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      // Don't retry on 4xx errors (except rate limits)
      if (error instanceof Error && 
          (error.message.includes('not found') || 
           error.message.includes('forbidden') && !error.message.includes('Rate limit'))) {
        throw error;
      }
      
      // Retry on network errors or 5xx errors
      if (attempt < maxRetries && (
        error instanceof Error && (
          error.message.includes('Failed to fetch') ||
          error.message.includes('Network') ||
          error.message.includes('timeout')
        )
      )) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError || new Error('Unknown error');
}

export async function analyzeRepo(
  repoUrl: string, 
  maxCommits?: number,
  page?: number,
  pageSize?: number
): Promise<AnalyzeResponse> {
  // Check cache first (only for first page to avoid cache issues)
  if (!page || page === 1) {
    const cached = getCached<AnalyzeResponse>(repoUrl, maxCommits);
    if (cached) {
      return cached;
    }
  }

  const requestBody: AnalyzeRequest = { 
    url: repoUrl, 
    maxCommits,
    page,
    pageSize: pageSize || 50
  };
  
  const result = await retryWithBackoff(async () => {
    const response = await fetch(`${DEFAULT_BACKEND_URL}/api/analyze`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });

    if (!response.ok) {
      let errorMessage = `Request failed: ${response.status}`;
      
      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If we can't parse the error response, provide helpful default messages
        if (response.status === 404) {
          errorMessage = 'Repository not found. Please check the URL.';
        } else if (response.status === 403) {
          errorMessage = 'Rate limit exceeded or access forbidden. Please try again later.';
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (response.status === 0 || response.status >= 500) {
          errorMessage = 'Unable to connect to server. Please check if the backend is running.';
        }
      }
      
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    return response.json();
  });

  // Cache the result
  setCached(repoUrl, result, 5 * 60 * 1000);
  
  return result;
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${DEFAULT_BACKEND_URL}/health`, {
      method: 'GET',
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getApiInfo() {
  try {
    const response = await fetch(`${DEFAULT_BACKEND_URL}/api/info`, {
      method: 'GET',
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch API info');
    }
    
    return response.json();
  } catch (error) {
    console.error('Failed to get API info:', error);
    return null;
  }
}
