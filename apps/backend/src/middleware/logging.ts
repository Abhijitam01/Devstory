import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Request logging middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  // Log request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('user-agent'),
  });

  // Override res.end to log response
  const originalEnd = res.end.bind(res);
  res.end = function (chunk?: any, encoding?: any, cb?: any): Response {
    const duration = Date.now() - startTime;
    
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });

    return originalEnd(chunk, encoding, cb);
  };

  next();
}

/**
 * Error logging middleware
 */
export function errorLogger(error: Error, req: Request, res: Response, next: NextFunction): void {
  logger.error('Request error', error, {
    method: req.method,
    path: req.path,
    ip: req.ip || req.socket.remoteAddress,
  });

  next(error);
}

