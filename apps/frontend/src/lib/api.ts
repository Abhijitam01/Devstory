import { AnalyzeRequest, AnalyzeResponse, ApiError } from '@devstory/shared';

const DEFAULT_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function analyzeRepo(
  repoUrl: string, 
  maxCommits?: number
): Promise<AnalyzeResponse> {
  const requestBody: AnalyzeRequest = { url: repoUrl, maxCommits };
  
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
      // If we can't parse the error response, use the default message
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
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
