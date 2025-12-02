'use client';

import { GradientButton } from '@/components/ui/gradient-button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function OpensoxHero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Purple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-purple-800/80 to-black">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Backed by Users Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-white/80 text-sm">Backed by</span>
            <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">U</span>
            </div>
            <span className="text-white/80 text-sm">sers</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
            Find your perfect
            <br />
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Open-Source
            </span>
            <br />
            Repo
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Find top open-source repos in seconds. Filter by your language, framework, or niche. Start contributing in seconds, not hours.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Link href="/">
              <GradientButton
                variant="primary"
                size="lg"
                className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 border-purple-500/50 shadow-lg shadow-purple-500/25"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </GradientButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom separator line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

