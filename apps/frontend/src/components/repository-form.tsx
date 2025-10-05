'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Github, Search, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RepositoryFormProps } from '@devstory/shared';

export function RepositoryForm({ onSubmit, isLoading, error }: RepositoryFormProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [maxCommits, setMaxCommits] = useState<number | undefined>(50);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    await onSubmit(repoUrl.trim(), maxCommits);
  };

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname === 'github.com' && parsed.pathname.split('/').length >= 3;
    } catch {
      return false;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto hover-lift">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Github className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Analyze Repository</CardTitle>
        <CardDescription>
          Enter a GitHub repository URL to visualize its development timeline
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="repo-url" className="text-sm font-medium">
              GitHub Repository URL
            </label>
            <div className="relative">
              <Input
                id="repo-url"
                type="url"
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className={cn(
                  'pr-10',
                  repoUrl && !isValidUrl(repoUrl) && 'border-destructive focus-visible:ring-destructive'
                )}
                disabled={isLoading}
                required
              />
              {repoUrl && !isValidUrl(repoUrl) && (
                <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
              )}
            </div>
            {repoUrl && !isValidUrl(repoUrl) && (
              <p className="text-sm text-destructive">
                Please enter a valid GitHub repository URL
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="max-commits" className="text-sm font-medium">
              Maximum Commits (optional)
            </label>
            <Input
              id="max-commits"
              type="number"
              min={1}
              max={1000}
              placeholder="50"
              value={maxCommits ?? ''}
              onChange={(e) => setMaxCommits(e.target.value ? Number(e.target.value) : undefined)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Limit the number of commits to analyze (1-1000)
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !repoUrl.trim() || !isValidUrl(repoUrl)}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Analyzing Repository...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Repository
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
