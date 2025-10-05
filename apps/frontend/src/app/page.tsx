'use client';

import { useState, useEffect } from 'react';
import { RepositoryForm } from '@/components/repository-form';
import { TimelineTable } from '@/components/timeline-table';
import { CodebaseInsights } from '@/components/codebase-insights';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { analyzeRepo, checkApiHealth } from '@/lib/api';
import { AnalyzeResponse, FileChange } from '@devstory/shared';
import { AlertCircle, CheckCircle, Github, TrendingUp, Clock, Users, BarChart3 } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    // Check API health on mount
    const checkHealth = async () => {
      try {
        const isHealthy = await checkApiHealth();
        setApiStatus(isHealthy ? 'online' : 'offline');
      } catch {
        setApiStatus('offline');
      }
    };

    checkHealth();
  }, []);

  const handleAnalyze = async (repoUrl: string, maxCommits?: number) => {
    setLoading(true);
    setError(null);
    setData(null);
    setShowInsights(false);

    try {
      const result = await analyzeRepo(repoUrl, maxCommits);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  };

  const handleGetFileContent = async (file: FileChange) => {
    if (!data) return;
    
    try {
      // Extract owner and repo from URL
      const urlParts = data.repoUrl.replace('https://github.com/', '').split('/');
      const [owner, repo] = urlParts;
      
      // Find the commit that contains this file
      const commit = data.commits.find(c => 
        c.changes.some(change => change.file === file.file)
      );
      
      if (!commit) return;
      
      const response = await fetch(
        `http://localhost:4000/api/commit/${owner}/${repo}/${commit.commit}?includeContent=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }
      
      const commitDetails = await response.json();
      const fileWithContent = commitDetails.files.find((f: any) => f.filename === file.file);
      
      if (fileWithContent && fileWithContent.content) {
        // Update the file in the data
        setData(prevData => {
          if (!prevData) return prevData;
          
          return {
            ...prevData,
            commits: prevData.commits.map(c => ({
              ...c,
              changes: c.changes.map(change => 
                change.file === file.file 
                  ? { ...change, content: fileWithContent.content, size: fileWithContent.size }
                  : change
              )
            }))
          };
        });
      }
    } catch (error) {
      console.error('Failed to fetch file content:', error);
    }
  };

  const stats = data ? [
    {
      label: 'Total Commits',
      value: data.count,
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Repository',
      value: data.repoUrl.replace('https://github.com/', '').split('/')[1] || 'Unknown',
      icon: Github,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Analysis Time',
      value: 'Just now',
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Contributors',
      value: new Set(data.commits.map(c => c.author)).size,
      icon: Users,
      color: 'text-orange-600 dark:text-orange-400',
    },
  ] : [];

  return (
    <div className="min-h-screen space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DevStory
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visualize how a GitHub repository was built — step by step. 
            Discover the development timeline, commit patterns, and file evolution.
          </p>
        </div>

        {/* API Status */}
        <div className="flex items-center justify-center gap-2">
          {apiStatus === 'checking' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Checking API status...
            </div>
          )}
          {apiStatus === 'online' && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              API Online
            </div>
          )}
          {apiStatus === 'offline' && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              API Offline
            </div>
          )}
        </div>
      </div>

      {/* Repository Form */}
      <RepositoryForm 
        onSubmit={handleAnalyze}
        isLoading={loading}
        error={error}
      />

      {/* Stats Cards */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Timeline */}
      {data && (
        <TimelineTable 
          commits={data.commits} 
          repoUrl={data.repoUrl}
          isLoading={loading}
        />
      )}

      {/* Features Section */}
      {!data && (
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="hover-lift">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Timeline Visualization</h3>
              <p className="text-sm text-muted-foreground">
                See how your repository evolved over time with detailed commit history and file changes.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Contributor Insights</h3>
              <p className="text-sm text-muted-foreground">
                Understand who contributed what and when, with author information for each commit.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Github className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">File Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Categorize changes by type (Frontend, Backend, Infrastructure) and track file evolution.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
