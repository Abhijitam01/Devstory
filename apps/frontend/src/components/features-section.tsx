'use client';

import { useEffect, useRef, useState } from 'react';
import { GitBranch, Code2, BarChart3, TrendingUp } from 'lucide-react';

export function FeaturesSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: 'Timeline Visualization',
      description: 'See how your repository evolved step by step with beautiful timeline visualizations.',
      icon: GitBranch,
      delay: '0ms',
    },
    {
      title: 'Code Analysis',
      description: 'Analyze code changes, file modifications, and development patterns over time.',
      icon: Code2,
      delay: '200ms',
    },
    {
      title: 'Insights & Stats',
      description: 'Get detailed insights into commits, contributors, and codebase statistics.',
      icon: BarChart3,
      delay: '400ms',
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Title with animation */}
        <h2 
          className={`text-4xl md:text-5xl font-bold text-white text-center mb-16 transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Supercharge Your{' '}
          <span className="bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
            Development
          </span>{' '}
          Journey
        </h2>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group hover:scale-105 hover:border-purple-500/30 animate-on-scroll ${
                visible ? 'visible' : ''
              }`}
              style={{ transitionDelay: visible ? feature.delay : '0ms' }}
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all group-hover:rotate-6 group-hover:scale-110 border border-purple-500/20">
                  <feature.icon className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors">
                  {feature.description}
                </p>
              </div>
              
              {/* Hover effect gradient */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/10 group-hover:to-purple-600/10 transition-all duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
