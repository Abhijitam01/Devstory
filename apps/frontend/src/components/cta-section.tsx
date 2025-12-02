'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="relative p-12 rounded-3xl bg-gradient-to-r from-purple-900/50 to-purple-800/50 border border-purple-500/30 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          <div className="relative z-10 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Find Your Perfect Repo?
            </h2>
            <p className="text-lg text-white/80">
              Join 8,500+ engineers accelerating in open-source.
            </p>
            <div className="pt-4">
              <Link
                href="/analyze"
                className="relative overflow-hidden rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 border border-purple-500/50 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 inline-flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

