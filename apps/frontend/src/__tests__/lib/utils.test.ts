import { formatDate, formatRelativeTime, getFileIcon } from '@/lib/utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jan.*15.*2024/);
    });
  });

  describe('formatRelativeTime', () => {
    it('should format relative time correctly', () => {
      const now = new Date().toISOString();
      const formatted = formatRelativeTime(now);
      expect(formatted).toBeTruthy();
    });
  });

  describe('getFileIcon', () => {
    it('should return icon for TypeScript file', () => {
      const icon = getFileIcon('file.ts');
      expect(icon).toBeTruthy();
    });

    it('should return default icon for unknown file', () => {
      const icon = getFileIcon('file.unknown');
      expect(icon).toBe('📄');
    });
  });
});

