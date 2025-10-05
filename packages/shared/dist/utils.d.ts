import { FileType, FileChangeStatus } from './types';
/**
 * Converts GitHub file status to short format
 */
export declare function statusToShort(status: string): FileChangeStatus;
/**
 * Determines file type based on filename and path
 */
export declare function getFileType(file: string): FileType;
/**
 * Formats date to YYYY-MM-DD format
 */
export declare function formatDate(dateString: string): string;
/**
 * Truncates commit hash to short format
 */
export declare function truncateCommitHash(sha: string): string;
/**
 * Extracts first line from commit message
 */
export declare function getFirstLine(message: string): string;
/**
 * Validates GitHub repository URL
 */
export declare function isValidGitHubUrl(url: string): boolean;
/**
 * Gets relative time string (e.g., "2 hours ago")
 */
export declare function getRelativeTime(dateString: string): string;
