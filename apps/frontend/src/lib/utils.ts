import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDate as sharedFormatDate, getRelativeTime } from '@devstory/shared';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export shared utilities with frontend-specific formatting
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeTime(dateString: string): string {
  const relative = getRelativeTime(dateString);
  // Convert to shorter format for UI
  return relative
    .replace(' minutes ago', 'm ago')
    .replace(' hours ago', 'h ago')
    .replace(' days ago', 'd ago')
    .replace(' months ago', 'mo ago')
    .replace(' years ago', 'y ago');
}


export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function getFileIcon(filename: string): string {
  const ext = getFileExtension(filename);
  const iconMap: Record<string, string> = {
    'js': '📄',
    'ts': '📘',
    'jsx': '⚛️',
    'tsx': '⚛️',
    'html': '🌐',
    'css': '🎨',
    'scss': '🎨',
    'sass': '🎨',
    'json': '📋',
    'md': '📝',
    'py': '🐍',
    'java': '☕',
    'cpp': '⚙️',
    'c': '⚙️',
    'php': '🐘',
    'rb': '💎',
    'go': '🐹',
    'rs': '🦀',
    'sql': '🗄️',
    'yml': '⚙️',
    'yaml': '⚙️',
    'xml': '📄',
    'svg': '🖼️',
    'png': '🖼️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'gif': '🖼️',
    'pdf': '📄',
    'txt': '📄',
    'log': '📋',
    'dockerfile': '🐳',
    'gitignore': '🚫',
    'env': '⚙️',
  };
  
  return iconMap[ext] || '📄';
}
