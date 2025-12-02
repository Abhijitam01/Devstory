'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Copy, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Minus,
  GitCommit
} from 'lucide-react';
import { cn, getFileIcon } from '@/lib/utils';
import { FileChange } from '@devstory/shared';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FileViewerProps {
  file: FileChange;
  commitSha: string;
  onGetContent?: (file: FileChange) => Promise<void>;
}

const statusColors: Record<string, string> = {
  A: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
  M: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
  D: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
  R: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
  C: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
};

const statusLabels: Record<string, string> = {
  A: 'Added',
  M: 'Modified',
  D: 'Deleted',
  R: 'Renamed',
  C: 'Copied',
};

export function FileViewer({ file, commitSha, onGetContent }: FileViewerProps) {
  const [showContent, setShowContent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggleContent = async () => {
    if (!showContent && onGetContent && !file.content) {
      setIsLoading(true);
      try {
        await onGetContent(file);
      } catch (error) {
        // Error is already handled in the parent component
        // Just reset loading state
      } finally {
        setIsLoading(false);
      }
    }
    setShowContent(!showContent);
  };

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (copied) {
        setCopied(false);
      }
    };
  }, [copied]);

  const handleCopyContent = async () => {
    if (!file.content) return;
    
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = file.content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } else {
        await navigator.clipboard.writeText(file.content);
      }
      
      setCopied(true);
      const timeoutId = setTimeout(() => setCopied(false), 2000);
      
      // Cleanup timeout on component unmount
      return () => clearTimeout(timeoutId);
    } catch (error) {
      // Silently fail - user will see the copy button didn't work
      // Could add a toast notification here in the future
    }
  };

  const handleDownload = () => {
    if (file.content) {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file.split('/').pop() || 'file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const getLanguageFromExtension = (ext: string): string => {
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'sql': 'sql',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'json': 'json',
      'xml': 'xml',
      'yml': 'yaml',
      'yaml': 'yaml',
      'md': 'markdown',
      'sh': 'bash',
      'bash': 'bash',
      'zsh': 'bash',
      'fish': 'bash',
    };
    return languageMap[ext] || 'text';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileContent = (content: string, filename: string) => {
    const lines = content.split('\n');
    const ext = getFileExtension(filename);
    const language = getLanguageFromExtension(ext);
    // Check for dark mode
    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

    return (
      <div className="relative">
        <div className="flex items-center justify-between p-2 bg-muted border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{language}</span>
            <span className="text-xs text-muted-foreground">
              {lines.length} lines
            </span>
            {file.size && (
              <span className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyContent}
              className="h-6 px-2"
            >
              {copied ? 'Copied!' : <Copy className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-6 px-2"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="max-h-96 overflow-auto">
          <SyntaxHighlighter
            language={language}
            style={isDark ? oneDark : oneLight}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              fontSize: '0.875rem',
            }}
            showLineNumbers
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              color: 'var(--muted-foreground)',
              userSelect: 'none',
            }}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">{getFileIcon(file.file)}</span>
            <div>
              <CardTitle className="text-base font-medium">
                {file.file}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={cn('text-xs', statusColors[file.status])}
                >
                  {statusLabels[file.status] || file.status}
                </Badge>
                {file.additions && (
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Plus className="h-3 w-3" />
                    {file.additions}
                  </span>
                )}
                {file.deletions && (
                  <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <Minus className="h-3 w-3" />
                    {file.deletions}
                  </span>
                )}
                {file.changes && (
                  <span className="text-xs text-muted-foreground">
                    {file.changes} changes
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleContent}
            disabled={isLoading}
            className="h-8 px-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            ) : showContent ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                View
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      {showContent && (
        <CardContent className="pt-0">
          {file.content ? (
            renderFileContent(file.content, file.file)
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>File content not available</p>
              <p className="text-xs">This file may be too large or binary</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
