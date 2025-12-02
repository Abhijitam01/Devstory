'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { ModernAnalyzeForm } from '@/components/modern-analyze-form';
import { ModernTimeline } from '@/components/modern-timeline';
const CodebaseInsights = lazy(() => import('@/components/codebase-insights').then(m => ({ default: m.CodebaseInsights })));
import { analyzeRepo, checkApiHealth } from '@/lib/api';
import { AnalyzeResponse, FileChange } from '@devstory/shared';
import { BarChart3, ArrowLeft, Share2, X, Sparkles, GitBranch } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AnalyzePage() {
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showInsights, setShowInsights] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();

  useEffect(() => {
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

  const handleAnalyze = async (repoUrl: string, maxCommits?: number, page: number = 1) => {
    setLoading(true);
    setError(null);
    setShowInsights(false);
    setCurrentPage(page);

    try {
      const result = await analyzeRepo(repoUrl, maxCommits, page);
      setData(result);
      if (page === 1) {
        toast.success(`Successfully analyzed ${result.pagination?.totalCommits || result.count} commits from ${result.repoUrl.replace('https://github.com/', '')}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze repository';
      setError(errorMessage);
      toast.error(errorMessage, 7000);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (!data) return;
    await handleAnalyze(data.repoUrl, undefined, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    if (!data) return;
    
    const shareData = {
      title: `DevStory Analysis: ${data.repoUrl.replace('https://github.com/', '')}`,
      text: `Check out the development timeline for ${data.repoUrl}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(() => {
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (!data) return;
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleGetFileContent = async (file: FileChange) => {
    if (!data) return;
    
    try {
      const urlParts = data.repoUrl.replace('https://github.com/', '').split('/');
      if (urlParts.length < 2) {
        throw new Error('Invalid repository URL format');
      }
      
      const [owner, repo] = urlParts;
      if (!owner || !repo) {
        throw new Error('Missing owner or repository name');
      }
      
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
          signal: AbortSignal.timeout(30000)
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch file content: ${response.status} ${errorText}`);
      }
      
      const commitDetails = await response.json();
      
      if (!commitDetails.files || !Array.isArray(commitDetails.files)) {
        throw new Error('Invalid response format from server');
      }
      
      const fileWithContent = commitDetails.files.find((f: any) => f.filename === file.file);
      
      if (fileWithContent) {
        if (fileWithContent.error) {
          throw new Error(fileWithContent.error);
        }
        
        if (fileWithContent.content) {
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
          throw new Error('File content not available. File may be too large or binary.');
        }
      } else {
        throw new Error('File not found in commit');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch file content';
      setError(`Error loading file content: ${errorMessage}`);
      setTimeout(() => setError(null), 5000);
    }
  };

  if (!data) {
    return (
      <ModernAnalyzeForm 
        onAnalyze={handleAnalyze}
        isLoading={loading}
        error={error}
        apiStatus={apiStatus}
      />
    );
  }

  const repoName = data.repoUrl.replace('https://github.com/', '');

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar */}
      <div className="sticky top-16 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Repository Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Link
                href="/analyze"
                className="p-2 rounded-lg hover:bg-white/5 transition-colors group"
                onClick={(e) => {
                  e.preventDefault();
                  setData(null);
                  setError(null);
                  setShowInsights(false);
                }}
                title="Analyze another repository"
              >
                <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
              </Link>
              
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <a
                    href={data.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-white hover:text-purple-400 transition-colors truncate block"
                  >
                    {repoName}
                  </a>
                  <div className="text-xs text-white/50">
                    {data.count} {data.count === 1 ? 'commit' : 'commits'} analyzed
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInsights(!showInsights)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  'flex items-center gap-2',
                  showInsights
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                )}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">{showInsights ? 'Hide' : 'Show'} Insights</span>
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 transition-all duration-200 flex items-center gap-2"
                aria-label="Share analysis results"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Codebase Insights */}
        {showInsights && data.codebaseStats && (
          <Suspense fallback={
            <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
              <p className="mt-4 text-white/70">Loading insights...</p>
            </div>
          }>
            <CodebaseInsights 
              stats={data.codebaseStats} 
              repoUrl={data.repoUrl}
            />
          </Suspense>
        )}

        {/* Timeline */}
        <ModernTimeline 
          commits={data.commits} 
          repoUrl={data.repoUrl}
          isLoading={loading}
          onGetFileContent={handleGetFileContent}
          analysisData={data}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
