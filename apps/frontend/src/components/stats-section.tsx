'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatedCounter } from './ui/animated-counter';
import { GitBranch, Users, Code2, TrendingUp } from 'lucide-react';

export function StatsSection() {
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

  const stats = [
    { 
      value: 12650, 
      suffix: '+', 
      label: 'Repositories Analyzed',
      icon: GitBranch,
      delay: '0ms',
    },
    { 
      value: 8520, 
      suffix: '+', 
      label: 'Active Users',
      icon: Users,
      delay: '200ms',
    },
    { 
      value: 1250000, 
      suffix: '+', 
      label: 'Commits Processed',
      icon: Code2,
      delay: '400ms',
    },
    { 
      value: 98, 
      suffix: '%', 
      label: 'Accuracy Rate',
      icon: TrendingUp,
      delay: '600ms',
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139,92,246,0.4) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <h2 
          className={`text-4xl md:text-5xl font-bold text-white text-center mb-16 transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Statistics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-purple-500/30 group animate-on-scroll ${
                visible ? 'visible' : ''
              }`}
              style={{ transitionDelay: visible ? stat.delay : '0ms' }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-500/30 group-hover:scale-110 transition-all">
                  <stat.icon className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-white/70 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
