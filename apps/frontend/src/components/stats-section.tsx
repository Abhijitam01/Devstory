'use client';

import { AnimatedCounter } from './ui/animated-counter';

export function StatsSection() {
  const stats = [
    { value: 26974, suffix: '+', label: 'Queries' },
    { value: 10847, suffix: '+', label: 'Users' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          Statistics
        </h2>

        <div className="flex flex-wrap justify-center gap-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-white/70 text-lg font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

