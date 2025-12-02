/**
 * Utility to guess Git commands based on commit message and file changes
 */

export interface GitCommandGuess {
  command: string;
  confidence: 'high' | 'medium' | 'low';
  description: string;
}

/**
 * Patterns to detect common Git commands from commit messages
 */
const commandPatterns: Array<{
  pattern: RegExp;
  command: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
}> = [
  // Initial commit
  { pattern: /^(initial|init|first commit|setup|project setup)/i, command: 'git init && git add . && git commit -m', description: 'Initialize repository and make first commit', confidence: 'high' },
  
  // Add files
  { pattern: /^(add|create|new).*(file|component|feature|page)/i, command: 'git add', description: 'Stage new files', confidence: 'high' },
  
  // Update/Modify
  { pattern: /^(update|modify|change|fix|improve|refactor|optimize)/i, command: 'git add', description: 'Stage modified files', confidence: 'high' },
  
  // Delete
  { pattern: /^(remove|delete|drop|cleanup).*(file|component|feature)/i, command: 'git rm', description: 'Remove files from repository', confidence: 'high' },
  
  // Rename
  { pattern: /^(rename|move|refactor).*(file|component|directory)/i, command: 'git mv', description: 'Rename or move files', confidence: 'high' },
  
  // Merge
  { pattern: /^(merge|integrate).*(branch|feature|pr|pull request)/i, command: 'git merge', description: 'Merge branches', confidence: 'high' },
  
  // Rebase
  { pattern: /^(rebase|squash)/i, command: 'git rebase', description: 'Rebase commits', confidence: 'high' },
  
  // Commit
  { pattern: /.*/, command: 'git commit -m', description: 'Commit changes', confidence: 'medium' },
];

/**
 * Detect file operations from file changes
 */
function detectFileOperations(files: Array<{ status: string; file: string }>): string[] {
  const operations: string[] = [];
  
  const hasAdded = files.some(f => f.status === 'A' || f.status === 'added');
  const hasModified = files.some(f => f.status === 'M' || f.status === 'modified');
  const hasDeleted = files.some(f => f.status === 'D' || f.status === 'deleted');
  const hasRenamed = files.some(f => f.status === 'R' || f.status === 'renamed');
  
  if (hasAdded) operations.push('git add');
  if (hasModified) operations.push('git add');
  if (hasDeleted) operations.push('git rm');
  if (hasRenamed) operations.push('git mv');
  
  return [...new Set(operations)];
}

/**
 * Guess the Git command(s) used in a commit
 */
export function guessGitCommand(
  commitMessage: string,
  files: Array<{ status: string; file: string }>,
  additions?: number,
  deletions?: number
): GitCommandGuess {
  // First, try to match commit message patterns
  for (const { pattern, command, description, confidence } of commandPatterns) {
    if (pattern.test(commitMessage)) {
      return {
        command: `${command} "${commitMessage}"`,
        confidence,
        description,
      };
    }
  }
  
  // If no pattern matches, infer from file operations
  const fileOps = detectFileOperations(files);
  
  if (fileOps.length > 0) {
    const primaryOp = fileOps[0];
    let description = 'Stage and commit changes';
    
    if (primaryOp === 'git add' && files.length === 1 && files[0].status === 'A') {
      description = 'Add new file and commit';
    } else if (primaryOp === 'git rm') {
      description = 'Remove files and commit';
    } else if (primaryOp === 'git mv') {
      description = 'Rename files and commit';
    }
    
    return {
      command: `${primaryOp} <files> && git commit -m "${commitMessage}"`,
      confidence: 'medium',
      description,
    };
  }
  
  // Default fallback
  return {
    command: `git add . && git commit -m "${commitMessage}"`,
    confidence: 'low',
    description: 'Stage all changes and commit',
  };
}

/**
 * Format command for display
 */
export function formatCommand(command: string, maxLength: number = 60): string {
  if (command.length <= maxLength) return command;
  return command.substring(0, maxLength - 3) + '...';
}

