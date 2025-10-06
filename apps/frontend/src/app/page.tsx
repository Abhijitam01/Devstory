'use client';

import { useState, useEffect } from 'react';
import { ModernHero } from '@/components/modern-hero';
import { ModernTimeline } from '@/components/modern-timeline';
import { CodebaseInsights } from '@/components/codebase-insights';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { analyzeRepo, checkApiHealth } from '@/lib/api';
import { AnalyzeResponse, FileChange } from '@devstory/shared';
import { BarChart3, ArrowLeft } from 'lucide-react';

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
      // Extract owner and repo from URL with proper validation
      const urlParts = data.repoUrl.replace('https://github.com/', '').split('/');
      if (urlParts.length < 2) {
        throw new Error('Invalid repository URL format');
      }
      
      const [owner, repo] = urlParts;
      if (!owner || !repo) {
        throw new Error('Missing owner or repository name');
      }
      
      // Find the commit that contains this file
      const commit = data.commits.find(c => 
        c.changes.some(change => change.file === file.file)
      );
      
      if (!commit) {
        throw new Error('Commit not found for this file');
      }
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(
        `${backendUrl}/api/commit/${owner}/${repo}/${commit.commit}?includeContent=true`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(30000) // 30 second timeout
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch file content: ${response.status} ${errorText}`);
      }
      
      const commitDetails = await response.json();
      
      // Validate response structure
      if (!commitDetails.files || !Array.isArray(commitDetails.files)) {
        throw new Error('Invalid response format from server');
      }
      
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
                  ? { 
                      ...change, 
                      content: fileWithContent.content, 
                      size: fileWithContent.size || 0 
                    }
                  : change
              )
            }))
          };
        });
      } else {
        throw new Error('File content not found in response');
      }
    } catch (error) {
      // Set user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch file content';
      setError(`Error loading file content: ${errorMessage}`);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
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

  if (!data) {
    return (
      <ModernHero 
        onAnalyze={handleAnalyze}
        isLoading={loading}
        error={error}
        apiStatus={apiStatus}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Back Button */}
        <GradientButton
          variant="ghost"
          onClick={() => {
            setData(null);
            setError(null);
            setShowInsights(false);
          }}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Analyze Another Repository
        </GradientButton>

        {/* Codebase Insights Toggle */}
        <div className="flex justify-center">
          <GradientButton
            variant={showInsights ? "primary" : "secondary"}
            onClick={() => setShowInsights(!showInsights)}
            className="mb-8"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showInsights ? 'Hide' : 'Show'} Codebase Insights
          </GradientButton>
        </div>

        {/* Codebase Insights */}
        {showInsights && data.codebaseStats && (
          <CodebaseInsights 
            stats={data.codebaseStats} 
            repoUrl={data.repoUrl}
          />
        )}

        {/* Timeline */}
        <ModernTimeline 
          commits={data.commits} 
          repoUrl={data.repoUrl}
          isLoading={loading}
          onGetFileContent={handleGetFileContent}
        />
      </div>
    </div>
  );
}
