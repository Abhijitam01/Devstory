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
      const isValid = parsed.hostname === 'github.com' && 
                     parsed.pathname.split('/').length >= 3 &&
                     parsed.pathname.split('/')[1] && // owner exists
                     parsed.pathname.split('/')[2]; // repo exists
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

  const stats = [
    { label: 'Repositories Analyzed', value: 12547, icon: Github },
    { label: 'Commits Processed', value: 2847392, icon: Code },
    { label: 'Active Users', value: 8943, icon: Users },
    { label: 'Lines of Code', value: 156789432, icon: TrendingUp },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-12">
          {/* Main Heading */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Repository Analysis
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              DevStory
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover the story behind every codebase. Analyze GitHub repositories with 
              <span className="font-semibold text-primary"> AI-powered insights</span> and 
              <span className="font-semibold text-primary"> beautiful visualizations</span>.
            </p>
          </div>

          {/* Repository Form */}
          <div className="max-w-2xl mx-auto p-8 simple-card">
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
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
                  {error}
                </div>
              )}

              <GradientButton
                type="submit"
                size="lg"
                loading={isLoading}
                disabled={!repoUrl.trim() || !isValidUrl}
                className="w-full"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 text-center simple-card">
                <div className="space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 simple-card">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Lightning Fast
                </h3>
                <p className="text-muted-foreground">
                  Analyze repositories in seconds with our optimized GitHub API integration.
                </p>
              </div>
            </div>

            <div className="p-6 simple-card">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Code className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Deep Analysis
                </h3>
                <p className="text-muted-foreground">
                  Get insights into code patterns, contributor activity, and development trends.
                </p>
              </div>
            </div>

            <div className="p-6 simple-card">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Team Insights
                </h3>
                <p className="text-muted-foreground">
                  Understand team dynamics and individual contributions to the project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
