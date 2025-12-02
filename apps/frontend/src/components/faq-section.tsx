'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'What is Opensox AI?',
    answer: 'Opensox AI is a platform that helps developers find the perfect open-source repositories to contribute to, filtered by language, framework, and activity level.',
  },
  {
    question: 'How can I find a project to contribute to?',
    answer: 'Simply use our search filters to specify your preferred languages, tech stack, and activity level. Our platform will show you matching repositories that align with your interests.',
  },
  {
    question: 'Is Opensox AI free to use?',
    answer: 'Yes, Opensox AI is completely free to use. We believe in making open-source contribution accessible to everyone.',
  },
  {
    question: 'How are projects ranked?',
    answer: 'Projects are ranked based on various factors including activity level, community engagement, issue count, and how well they match your specified filters.',
  },
  {
    question: 'How do I get started contributing?',
    answer: 'After finding a project you like, explore its repository, check for open issues, and start contributing! Our platform provides all the information you need to begin.',
  },
  {
    question: 'Can I suggest new features?',
    answer: 'Absolutely! We welcome feature suggestions. Please reach out to us through our contact page or contribute directly to our open-source project.',
  },
  {
    question: 'What is Opensox Pro?',
    answer: 'Opensox Pro is our premium tier offering advanced features like personalized recommendations, priority support, and detailed analytics for your contributions.',
    isPro: true,
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                'border border-white/10 rounded-lg overflow-hidden transition-all',
                openIndex === index ? 'bg-white/5' : 'bg-white/5'
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={cn(
                  'w-full px-6 py-4 flex items-center justify-between text-left transition-colors',
                  'hover:bg-white/10',
                  faq.isPro && 'text-purple-400'
                )}
              >
                <span className={cn('font-semibold', faq.isPro ? 'text-purple-400' : 'text-white')}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 transition-transform flex-shrink-0 ml-4',
                    openIndex === index && 'transform rotate-180',
                    faq.isPro ? 'text-purple-400' : 'text-white/70'
                  )}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-white/70 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

