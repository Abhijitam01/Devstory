'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { FloatingInput } from '@/components/ui/floating-input';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { 
  Github, 
  Search, 
  Zap, 
  Code, 
  Users, 
  TrendingUp,
  Sparkles,
  ArrowRight,
  Play
} from 'lucide-react';

interface ModernHeroProps {
  onAnalyze: (url: string, maxCommits?: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  apiStatus: 'checking' | 'online' | 'offline';
}

export function ModernHero({ onAnalyze, isLoading, error, apiStatus }: ModernHeroProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [maxCommits, setMaxCommits] = useState<number | undefined>(50);
  const [isValidUrl, setIsValidUrl] = useState(true);

  const validateUrl = (url: string) => {
    if (!url || url.trim().length === 0) {
      setIsValidUrl(true); // Don't show error for empty input
      return true;
    }
    
    try {
      const parsed = new URL(url);
      const isValid = !!(parsed.hostname === 'github.com' && 
                     parsed.pathname.split('/').length >= 3 &&
                     parsed.pathname.split('/')[1] && // owner exists
                     parsed.pathname.split('/')[2]); // repo exists
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

  // Realistic stats - removed fake numbers, will show actual data when available
  const stats = [
    { label: 'Open Source', value: '100%', icon: Github, description: 'Free & open source' },
    { label: 'Fast Analysis', value: '< 5s', icon: Zap, description: 'Quick repository insights' },
    { label: 'GitHub API', value: 'Powered', icon: Code, description: 'Direct GitHub integration' },
    { label: 'Real-time', value: 'Live', icon: TrendingUp, description: 'Up-to-date data' },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-12">
          {/* Main Heading */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-foreground/20 text-foreground text-xs font-medium uppercase tracking-wide">
              <Code className="w-3.5 h-3.5" />
              GitHub Repository Analysis
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground modern-heading">
              DevStory
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Analyze GitHub repositories. Understand code evolution. Discover development patterns.
            </p>
          </div>

          {/* Repository Form */}
          <GlassCard className="max-w-2xl mx-auto p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <FloatingInput
                  label="GitHub Repository URL"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => {
                    setRepoUrl(e.target.value);
                    validateUrl(e.target.value);
                  }}
                  icon={<Github className="w-5 h-5" />}
                  error={repoUrl && !isValidUrl ? 'Please enter a valid GitHub repository URL' : undefined}
                  required
                />
                
                <FloatingInput
                  label="Maximum Commits (optional)"
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
                  icon={<Code className="w-5 h-5" />}
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive space-y-2">
                  <div className="font-semibold">Error</div>
                  <div>{error}</div>
                  {error.toLowerCase().includes('rate limit') && (
                    <div className="text-sm text-destructive/80 mt-2 space-y-1">
                      <div>💡 Tip: Add a GitHub Personal Access Token to your backend .env file for higher rate limits (5000/hour vs 60/hour).</div>
                      <div>⏰ The request will automatically retry with exponential backoff.</div>
                    </div>
                  )}
                  {error.includes('not found') && (
                    <div className="text-sm text-destructive/80 mt-2">
                      💡 Tip: Make sure the repository URL is correct and the repository is public.
                    </div>
                  )}
                  {error.includes('connect to server') && (
                    <div className="text-sm text-destructive/80 mt-2">
                      💡 Tip: Make sure the backend server is running on port 4000.
                    </div>
                  )}
                </div>
              )}

              <GradientButton
                type="submit"
                size="lg"
                loading={isLoading}
                disabled={!repoUrl.trim() || !isValidUrl}
                className="w-full"
                aria-label="Analyze GitHub repository"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Analyzing Repository...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyze Repository
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </GradientButton>
            </form>
          </GlassCard>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 text-center modern-card">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-foreground/20">
                    <stat.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {stat.label}
                    </div>
                    {stat.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-6 modern-card">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md border border-foreground/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  Fast Analysis
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Quick repository insights with optimized GitHub API integration.
                </p>
              </div>
            </div>

            <div className="p-6 modern-card">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md border border-foreground/20 flex items-center justify-center">
                  <Code className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  Code Insights
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Understand code patterns, contributors, and development trends.
                </p>
              </div>
            </div>

            <div className="p-6 modern-card">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md border border-foreground/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  Team Activity
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track contributions and understand team collaboration patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
