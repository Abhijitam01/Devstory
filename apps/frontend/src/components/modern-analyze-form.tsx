'use client';

import { useState } from 'react';
import { Github, Sparkles, ArrowRight, Loader2, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernAnalyzeFormProps {
  onAnalyze: (url: string, maxCommits?: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  apiStatus: 'checking' | 'online' | 'offline';
}

export function ModernAnalyzeForm({ onAnalyze, isLoading, error, apiStatus }: ModernAnalyzeFormProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [maxCommits, setMaxCommits] = useState<number | undefined>(50);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [focused, setFocused] = useState(false);

  const validateUrl = (url: string) => {
    if (!url || url.trim().length === 0) {
      setIsValidUrl(true);
      return true;
    }
    
    try {
      const parsed = new URL(url);
      const isValid = !!(parsed.hostname === 'github.com' && 
                     parsed.pathname.split('/').length >= 3 &&
                     parsed.pathname.split('/')[1] &&
                     parsed.pathname.split('/')[2]);
      setIsValidUrl(isValid);
      return isValid;
    } catch {
      setIsValidUrl(false);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim() || !isValidUrl) return;
    await onAnalyze(repoUrl.trim(), maxCommits);
  };

  const exampleRepos = [
    'facebook/react',
    'vercel/next.js',
    'microsoft/vscode',
    't3-oss/create-t3-app',
  ];

  const handleExampleClick = (owner: string, repo: string) => {
    const url = `https://github.com/${owner}/${repo}`;
    setRepoUrl(url);
    validateUrl(url);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black">
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139,92,246,0.3) 1px, transparent 0)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Analyze any GitHub repository</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              Visualize Your
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                Code Evolution
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Enter a GitHub repository URL to see how it evolved over time with beautiful timeline visualizations
            </p>
          </div>

          {/* Main Form Card */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition duration-1000" />
            
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Repository URL Input */}
                <div className="space-y-2">
                  <label htmlFor="repo-url" className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <Github className="w-4 h-4 text-purple-400" />
                    Repository URL
                  </label>
                  
                  <div className="relative group">
                    <div
                      className={cn(
                        'absolute inset-0 rounded-xl transition-all duration-300',
                        focused
                          ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 opacity-100'
                          : 'bg-white/5 opacity-0 group-hover:opacity-100'
                      )}
                    />
                    
                    <input
                      id="repo-url"
                      type="text"
                      value={repoUrl}
                      onChange={(e) => {
                        setRepoUrl(e.target.value);
                        validateUrl(e.target.value);
                      }}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="https://github.com/username/repository"
                      className={cn(
                        'relative w-full px-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/40',
                        'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50',
                        'transition-all duration-300',
                        !isValidUrl && repoUrl
                          ? 'border-red-500/50 focus:ring-red-500/50'
                          : 'border-white/10 hover:border-white/20',
                        isLoading && 'opacity-50 cursor-not-allowed'
                      )}
                      disabled={isLoading}
                      required
                    />
                    
                    {repoUrl && isValidUrl && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      </div>
                    )}
                    
                    {repoUrl && !isValidUrl && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      </div>
                    )}
                  </div>

                  {repoUrl && !isValidUrl && (
                    <p className="text-sm text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Please enter a valid GitHub repository URL
                    </p>
                  )}

                  {/* Example Repositories */}
                  <div className="pt-2">
                    <p className="text-xs text-white/50 mb-2">Try these examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {exampleRepos.map((repo) => {
                        const [owner, repoName] = repo.split('/');
                        return (
                          <button
                            key={repo}
                            type="button"
                            onClick={() => handleExampleClick(owner, repoName)}
                            disabled={isLoading}
                            className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-50"
                          >
                            {repo}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Max Commits Input */}
                <div className="space-y-2">
                  <label htmlFor="max-commits" className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    Max Commits <span className="text-xs text-white/50 font-normal">(optional)</span>
                  </label>
                  
                  <input
                    id="max-commits"
                    type="number"
                    min={1}
                    max={1000}
                    value={maxCommits ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setMaxCommits(undefined);
                      } else {
                        const numValue = Number(value);
                        if (!isNaN(numValue) && numValue >= 1 && numValue <= 1000) {
                          setMaxCommits(numValue);
                        }
                      }
                    }}
                    placeholder="50 (default)"
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-white/20 disabled:opacity-50"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-white/50">Limit the number of commits to analyze (1-1000)</p>
                </div>

                {/* API Status */}
                {apiStatus !== 'checking' && (
                  <div className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm',
                    apiStatus === 'online'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  )}>
                    {apiStatus === 'online' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>API is online and ready</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span>API is offline. Please check your backend connection.</span>
                      </>
                    )}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 space-y-2">
                    <div className="font-semibold flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Error
                    </div>
                    <div className="text-sm">{error}</div>
                    {error.toLowerCase().includes('rate limit') && (
                      <div className="text-xs text-red-400/80 mt-2 space-y-1 pt-2 border-t border-red-500/20">
                        <div>💡 Tip: Add a GitHub Personal Access Token for higher rate limits</div>
                        <div>⏰ Request will automatically retry with exponential backoff</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!repoUrl.trim() || !isValidUrl || isLoading}
                  className={cn(
                    'w-full px-6 py-4 rounded-xl font-semibold text-white transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-black',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                    'group relative overflow-hidden',
                    isValidUrl && repoUrl.trim()
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-white/10 border border-white/20 cursor-not-allowed'
                  )}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing Repository...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Analyze Repository</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">100%</div>
              <div className="text-xs text-white/60">Open Source</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">&lt; 5s</div>
              <div className="text-xs text-white/60">Fast Analysis</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">Free</div>
              <div className="text-xs text-white/60">Forever</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

