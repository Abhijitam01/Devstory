import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  private getKey(req: Request): string {
    // Use IP address as the key
    return req.ip || req.socket.remoteAddress || 'unknown';
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.getKey(req);
      const now = Date.now();

      // Get or create entry
      let entry = this.store[key];
      
      if (!entry || entry.resetTime < now) {
        // Create new window
        entry = {
          count: 1,
          resetTime: now + this.windowMs,
        };
        this.store[key] = entry;
      } else {
        entry.count++;
      }

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - entry.count).toString());
      res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());

      // Check if limit exceeded
      if (entry.count > this.maxRequests) {
        return res.status(429).json({
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        });
      }

      next();
    };
  }
}

// Create rate limiter instances
export const apiRateLimiter = new RateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
export const analyzeRateLimiter = new RateLimiter(60 * 60 * 1000, 10); // 10 requests per hour for analyze endpoint

