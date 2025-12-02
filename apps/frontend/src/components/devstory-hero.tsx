'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Code2, GitBranch, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function DevStoryHero() {
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Welcome animation sequence
    const timer1 = setTimeout(() => setShowWelcome(true), 300);
    const timer2 = setTimeout(() => setShowTitle(true), 800);
    const timer3 = setTimeout(() => setShowSubtitle(true), 1500);
    const timer4 = setTimeout(() => setShowButton(true), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-purple-800/80 to-black">
        {/* Animated Pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0 animate-pulse-slow"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-purple-400/20 animate-float"
              style={{
                width: `${Math.random() * 100 + 20}px`,
                height: `${Math.random() * 100 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Welcome Animation */}
          <div
            className={cn(
              'transition-all duration-1000 ease-out',
              showWelcome
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-10'
            )}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <Sparkles className="w-5 h-5 text-purple-300 animate-spin-slow" />
              <span className="text-white/90 text-sm font-medium tracking-wide">
                Welcome to
              </span>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-xs">D</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                DevStory
              </span>
            </div>
          </div>

          {/* Main Headline with Typewriter Effect */}
          <div
            className={cn(
              'transition-all duration-1000 ease-out delay-300',
              showTitle
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            )}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
              <span className="inline-block animate-slide-in-left">
                Visualize
              </span>
              <br />
              <span className="inline-block bg-gradient-to-r from-purple-300 via-purple-200 to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Your Code
              </span>
              <br />
              <span className="inline-block animate-slide-in-right">
                Evolution
              </span>
            </h1>
          </div>

          {/* Description */}
          <div
            className={cn(
              'transition-all duration-1000 ease-out delay-500',
              showSubtitle
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            )}
          >
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Analyze GitHub repositories. Understand how projects evolve. Discover development patterns with beautiful timeline visualizations.
            </p>
          </div>

          {/* CTA Button with Hover Effects */}
          <div
            className={cn(
              'pt-4 transition-all duration-1000 ease-out delay-700',
              showButton
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            )}
          >
            <Link
              href="/analyze"
              className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 border border-purple-500/50 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Button content */}
              <span className="relative z-10 flex items-center gap-2">
                <Code2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Analyze Repository
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>

              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>
          </div>

          {/* Feature Icons */}
          <div
            className={cn(
              'pt-8 flex justify-center gap-8 transition-all duration-1000 ease-out delay-1000',
              showButton
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            )}
          >
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-500/30 transition-all group-hover:scale-110 group-hover:rotate-6">
                <GitBranch className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-white/70 text-xs font-medium">Git Timeline</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-500/30 transition-all group-hover:scale-110 group-hover:-rotate-6">
                <Code2 className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-white/70 text-xs font-medium">Code Analysis</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-500/30 transition-all group-hover:scale-110 group-hover:rotate-6">
                <Sparkles className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-white/70 text-xs font-medium">Insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom separator line with animation */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

