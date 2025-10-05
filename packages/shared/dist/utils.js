/**
 * Converts GitHub file status to short format
 */
export function statusToShort(status) {
    switch (status) {
        case 'added': return 'A';
        case 'modified': return 'M';
        case 'removed': return 'D';
        case 'renamed': return 'R';
        case 'copied': return 'C';
        case 'changed': return 'M';
        default:
            return (status && status[0] ? status[0].toUpperCase() : 'M');
    }
}
/**
 * Determines file type based on filename and path
 */
export function getFileType(file) {
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
export function formatDate(dateString) {
    return dateString.slice(0, 10);
}
/**
 * Truncates commit hash to short format
 */
export function truncateCommitHash(sha) {
    return sha.slice(0, 7);
}
/**
 * Extracts first line from commit message
 */
export function getFirstLine(message) {
    return message.split('\n')[0] || '';
}
/**
 * Validates GitHub repository URL
 */
export function isValidGitHubUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.hostname === 'github.com' &&
            parsed.pathname.split('/').length >= 3;
    }
    catch {
        return false;
    }
}
/**
 * Debounce function for input handling
 */
export function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
/**
 * Formats file size in human readable format
 */
export function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
/**
 * Gets relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60)
        return 'just now';
    if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000)
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}
//# sourceMappingURL=utils.js.map