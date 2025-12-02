/**
 * Client-side cache for API responses using localStorage
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const CACHE_PREFIX = 'devstory_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Generate cache key from repository URL and maxCommits
 */
function getCacheKey(repoUrl: string, maxCommits?: number): string {
  return `${CACHE_PREFIX}${btoa(repoUrl)}:${maxCommits || 'all'}`;
}

/**
 * Get cached data if it exists and hasn't expired
 */
export function getCached<T>(repoUrl: string, maxCommits?: number): T | null {
  try {
    const key = getCacheKey(repoUrl, maxCommits);
    const cached = localStorage.getItem(key);
    
    if (!cached) {
      return null;
    }

    const entry: CacheEntry<T> = JSON.parse(cached);
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

/**
 * Store data in cache
 */
export function setCached<T>(repoUrl: string, data: T, ttl: number = DEFAULT_TTL): void {
  try {
    const key = getCacheKey(repoUrl);
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };

    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.error('Error writing to cache:', error);
    // If storage is full, try to clean up old entries
    cleanupCache();
  }
}

/**
 * Clear cache entry
 */
export function clearCached(repoUrl: string, maxCommits?: number): void {
  try {
    const key = getCacheKey(repoUrl, maxCommits);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
}

/**
 * Clean up expired cache entries
 */
export function cleanupCache(): void {
  try {
    const now = Date.now();
    const keys = Object.keys(localStorage);
    const keysToDelete: string[] = [];

    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const entry: CacheEntry<any> = JSON.parse(cached);
            if (now > entry.expiresAt) {
              keysToDelete.push(key);
            }
          }
        } catch {
          // Invalid entry, delete it
          keysToDelete.push(key);
        }
      }
    });

    keysToDelete.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error cleaning up cache:', error);
  }
}

// Cleanup on page load
if (typeof window !== 'undefined') {
  cleanupCache();
  
  // Cleanup every 10 minutes
  setInterval(cleanupCache, 10 * 60 * 1000);
}

