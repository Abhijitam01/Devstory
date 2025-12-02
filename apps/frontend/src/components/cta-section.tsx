'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Code2 } from 'lucide-react';

export function CTASection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div 
          className={`relative p-12 rounded-3xl bg-gradient-to-r from-purple-900/50 to-purple-800/50 border border-purple-500/30 overflow-hidden transition-all duration-1000 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0 animate-pulse-slow"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* Gradient orbs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

          <div className="relative z-10 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Visualize Your{' '}
              <span className="bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent">
                Code Story?
              </span>
            </h2>
            <p className="text-lg text-white/80">
              Join thousands of developers discovering how their repositories evolved.
            </p>
            <div className="pt-4">
              <Link
                href="/analyze"
                className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 border border-purple-500/50 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Button content */}
                <span className="relative z-10 flex items-center gap-2">
                  <Code2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Start Analyzing
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>

                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
