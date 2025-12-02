'use client';

import { useEffect, useRef, useState } from 'react';
import { Filter, Search, Code } from 'lucide-react';

export function HowItWorks() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: 1,
      title: 'Enter Repository URL',
      description: 'Simply paste your GitHub repository URL to get started with the analysis.',
      icon: Filter,
      delay: '0ms',
    },
    {
      number: 2,
      title: 'Analyze Instantly',
      description: 'Our system processes commits, analyzes changes, and builds a comprehensive timeline.',
      icon: Search,
      delay: '200ms',
    },
    {
      number: 3,
      title: 'Explore & Discover',
      description: 'Explore the timeline, view code changes, and discover development patterns and insights.',
      icon: Code,
      delay: '400ms',
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139,92,246,0.3) 1px, transparent 0)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <h2 
          className={`text-4xl md:text-5xl font-bold text-white text-center mb-16 transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          How it Works
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="space-y-8 relative">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div
                  className={`flex gap-6 transition-all duration-700 relative ${
                    visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`}
                  style={{ transitionDelay: visible ? step.delay : '0ms' }}
                >
                  <div className="flex-shrink-0 relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-600/30 flex items-center justify-center border-2 border-purple-500/50 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                      <span className="text-purple-300 font-bold text-xl">{step.number}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute left-1/2 top-full w-0.5 h-8 bg-gradient-to-b from-purple-500/50 to-transparent transform -translate-x-1/2" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 group">
                      <step.icon className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform" />
                      {step.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual */}
          <div 
            className={`relative transition-all duration-1000 ${
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: visible ? '600ms' : '0ms' }}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-purple-800/30 rounded-3xl blur-3xl animate-pulse-slow" />
              <div className="relative h-full bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-3xl border border-purple-500/30 flex items-center justify-center p-8 backdrop-blur-sm">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/40 to-purple-600/40 flex items-center justify-center border-2 border-purple-400/50 shadow-xl shadow-purple-500/30 animate-pulse">
                    <Code className="w-10 h-10 text-purple-200" />
                  </div>
                  <div className="text-white text-2xl font-bold">DevStory</div>
                  <div className="text-purple-300/80 text-sm">Timeline Analysis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
