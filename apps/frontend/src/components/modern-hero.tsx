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
    try {
      const parsed = new URL(url);
      const isValid = parsed.hostname === 'github.com' && parsed.pathname.split('/').length >= 3;
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
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-12">
          {/* Main Heading */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Repository Analysis
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                DevStory
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the story behind every codebase. Analyze GitHub repositories with 
              <span className="font-semibold text-blue-600 dark:text-blue-400"> AI-powered insights</span> and 
              <span className="font-semibold text-purple-600 dark:text-purple-400"> beautiful visualizations</span>.
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
                  onChange={(e) => setMaxCommits(e.target.value ? Number(e.target.value) : undefined)}
                  icon={<Code className="w-5 h-5" />}
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
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
              <GlassCard key={index} variant="subtle" className="p-6 text-center">
                <div className="space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <GlassCard variant="subtle" className="p-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Analyze repositories in seconds with our optimized GitHub API integration.
                </p>
              </div>
            </GlassCard>

            <GlassCard variant="subtle" className="p-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Deep Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get insights into code patterns, contributor activity, and development trends.
                </p>
              </div>
            </GlassCard>

            <GlassCard variant="subtle" className="p-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Team Insights
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Understand team dynamics and individual contributions to the project.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
