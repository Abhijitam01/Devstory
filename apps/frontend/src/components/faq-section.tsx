'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'What is DevStory?',
    answer: 'DevStory is a platform that visualizes how GitHub repositories were built step by step. It analyzes commit history, code changes, and development patterns to create beautiful timeline visualizations.',
  },
  {
    question: 'How do I analyze a repository?',
    answer: 'Simply paste your GitHub repository URL on the analyze page. Our system will process the commits, analyze changes, and generate a comprehensive timeline visualization.',
  },
  {
    question: 'Is DevStory free to use?',
    answer: 'Yes, DevStory is completely free to use. We believe in making code visualization and analysis accessible to all developers.',
  },
  {
    question: 'What information does DevStory analyze?',
    answer: 'DevStory analyzes commit history, file changes, code modifications, contributor activity, and development patterns to provide insights into how your repository evolved over time.',
  },
  {
    question: 'How long does analysis take?',
    answer: 'Analysis typically takes a few seconds to a minute, depending on the repository size and number of commits. We process data efficiently to provide fast results.',
  },
  {
    question: 'Can I analyze private repositories?',
    answer: 'Currently, DevStory supports public GitHub repositories. Private repository support may be available in the future.',
  },
  {
    question: 'How accurate is the timeline visualization?',
    answer: 'DevStory uses GitHub\'s official API to fetch accurate commit data. The timeline visualization reflects the actual commit history and file changes from your repository.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto">
        <h2 
          className={`text-4xl md:text-5xl font-bold text-white text-center mb-16 transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                'border border-white/10 rounded-lg overflow-hidden transition-all duration-500 animate-on-scroll',
                openIndex === index ? 'bg-white/5 shadow-lg shadow-purple-500/10' : 'bg-white/5',
                visible ? 'visible' : ''
              )}
              style={{ transitionDelay: visible ? `${index * 100}ms` : '0ms' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={cn(
                  'w-full px-6 py-4 flex items-center justify-between text-left transition-all duration-300',
                  'hover:bg-white/10',
                  openIndex === index && 'bg-white/5'
                )}
              >
                <span className="font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 transition-all duration-300 flex-shrink-0 text-white/70',
                    openIndex === index && 'transform rotate-180 text-purple-400'
                  )}
                />
              </button>
              <div
                className={cn(
                  'transition-all duration-300 overflow-hidden',
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="px-6 pb-4 text-white/70 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
