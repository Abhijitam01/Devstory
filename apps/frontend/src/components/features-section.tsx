'use client';

import { Search, Filter, Sparkles } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      title: 'Personalized Recommendations',
      description: 'Get personalized repos you can contribute to.',
      icon: Sparkles,
    },
    {
      title: 'Seamless Search',
      description: 'Search thousands of open-source repos instantly.',
      icon: Search,
    },
    {
      title: 'Precision Filters',
      description: 'Zero in on projects by language, stack and activity level.',
      icon: Filter,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          Supercharge Your Open Source Journey
        </h2>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

