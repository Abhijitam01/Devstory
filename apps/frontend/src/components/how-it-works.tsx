'use client';

import { Filter, Search, Code } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Set Your Filters',
      description: 'Choose the languages, stack, activity level, and other preferences that matter to you.',
      icon: Filter,
    },
    {
      number: 2,
      title: 'Search Instantly',
      description: 'Hit search and explore thousands of open-source repositories matched to your criteria.',
      icon: Search,
    },
    {
      number: 3,
      title: 'Discover & Contribute',
      description: 'Find the perfect project for your stack, start exploring the code, and make meaningful contributions.',
      icon: Code,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          How it Works
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <span className="text-purple-400 font-bold text-lg">{step.number}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <step.icon className="w-5 h-5 text-purple-400" />
                    {step.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-3xl blur-3xl" />
              <div className="relative h-full bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-3xl border border-purple-500/30 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/30 flex items-center justify-center border border-purple-400/50">
                    <Filter className="w-8 h-8 text-purple-300" />
                  </div>
                  <div className="text-white text-xl font-bold">Filters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

