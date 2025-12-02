import { parseGithubRepoUrl } from '../../services/github';

describe('GitHub Service', () => {
  describe('parseGithubRepoUrl', () => {
    it('should parse valid GitHub URL', () => {
      const result = parseGithubRepoUrl('https://github.com/owner/repo');
      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    it('should handle URL with .git extension', () => {
      const result = parseGithubRepoUrl('https://github.com/owner/repo.git');
      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    it('should throw error for invalid URL', () => {
      expect(() => parseGithubRepoUrl('not-a-url')).toThrow();
    });

    it('should throw error for non-GitHub URL', () => {
      expect(() => parseGithubRepoUrl('https://gitlab.com/owner/repo')).toThrow();
    });
  });
});

