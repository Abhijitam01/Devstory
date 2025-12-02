/**
 * Structured logger for the application
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatLog(level: string, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (context) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return entry;
  }

  private log(level: LogLevel, levelName: string, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.formatLog(levelName, message, context, error);
    const logString = JSON.stringify(entry);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logString);
        break;
      case LogLevel.INFO:
        console.info(logString);
        break;
      case LogLevel.WARN:
        console.warn(logString);
        break;
      case LogLevel.ERROR:
        console.error(logString);
        break;
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, 'INFO', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, 'WARN', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, 'ERROR', message, context, error);
  }
}

// Create logger instance
const minLevel = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO;
export const logger = new Logger(minLevel);

