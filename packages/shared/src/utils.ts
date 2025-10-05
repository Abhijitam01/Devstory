import { FileType, FileChangeStatus } from './types';

/**
 * Converts GitHub file status to short format
 */
export function statusToShort(status: string): FileChangeStatus {
  switch (status) {
    case 'added': return 'A';
    case 'modified': return 'M';
    case 'removed': return 'D';
    case 'renamed': return 'R';
    case 'copied': return 'C';
    case 'changed': return 'M';
    default:
      return (status && status[0] ? status[0].toUpperCase() : 'M') as FileChangeStatus;
  }
}

/**
 * Determines file type based on filename and path
 */
export function getFileType(file: string): FileType {
  const lower = file.toLowerCase();
  
  if (lower.includes('/api/') || 
      lower.includes('/routes/') || 
      lower.includes('/controllers/') ||
      lower.includes('/services/') ||
      (lower.endsWith('.ts') && (lower.includes('server') || lower.includes('api'))) ||
      lower.endsWith('.js') && !lower.includes('component')) {
    return 'Backend';
  }
  
  if (lower.includes('/app/') || 
      lower.includes('/pages/') || 
      lower.includes('/components/') ||
      lower.includes('/ui/') ||
      lower.endsWith('.tsx') || 
      lower.endsWith('.jsx') ||
      lower.endsWith('.vue') ||
      lower.endsWith('.svelte')) {
    return 'Frontend';
  }
  
  if (lower.includes('prisma/') || 
      lower.endsWith('schema.prisma') || 
      lower.endsWith('.sql') ||
      lower.includes('/migrations/') ||
      lower.includes('/database/')) {
    return 'Schema';
  }
  
  if (lower.includes('dockerfile') || 
      lower.endsWith('.yml') || 
      lower.endsWith('.yaml') ||
      lower.includes('/infra/') ||
      lower.includes('/deploy/') ||
      lower.endsWith('.tf') ||
      lower.endsWith('.tfvars')) {
    return 'Infra';
  }
  
  return 'Other';
}

/**
 * Formats date to YYYY-MM-DD format
 */
export function formatDate(dateString: string): string {
  return dateString.slice(0, 10);
}

/**
 * Truncates commit hash to short format
 */
export function truncateCommitHash(sha: string): string {
  return sha.slice(0, 7);
}

/**
 * Extracts first line from commit message
 */
export function getFirstLine(message: string): string {
  return message.split('\n')[0] || '';
}

/**
 * Validates GitHub repository URL
 */
export function isValidGitHubUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'github.com' && 
           parsed.pathname.split('/').length >= 3;
  } catch {
    return false;
  }
}


/**
 * Gets relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}
