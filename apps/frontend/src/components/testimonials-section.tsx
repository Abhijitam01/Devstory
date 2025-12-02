'use client';

import { useEffect, useRef, useState } from 'react';

export function TestimonialsSection() {
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

  const testimonials = [
    {
      author: 'Alex Chen',
      handle: '@alexchen',
      text: 'DevStory helped me understand how our codebase evolved. The timeline visualization is absolutely stunning!',
      avatar: 'A',
      delay: '0ms',
    },
    {
      author: 'Sarah Johnson',
      handle: '@sarahdev',
      text: 'I think you made something that would be a great leap in understanding code evolution. Love it!',
      avatar: 'S',
      delay: '100ms',
    },
    {
      author: 'Mike Rodriguez',
      handle: '@mikerod',
      text: 'The insights into commit patterns are incredibly useful for project planning. This tool is a game-changer!',
      avatar: 'M',
      delay: '200ms',
    },
    {
      author: 'Emma Wilson',
      handle: '@emmaw',
      text: 'Great work! The code analysis features help me track changes across our large repository with ease.',
      avatar: 'E',
      delay: '300ms',
    },
    {
      author: 'David Kim',
      handle: '@davidk',
      text: 'The visualization is so clean and intuitive. Perfect for onboarding new team members!',
      avatar: 'D',
      delay: '400ms',
    },
    {
      author: 'Lisa Anderson',
      handle: '@lisadev',
      text: 'DevStory makes it easy to understand development patterns. Really appreciate the detailed timeline!',
      avatar: 'L',
      delay: '500ms',
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
          Testimonials
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-purple-500/30 group animate-on-scroll ${
                visible ? 'visible' : ''
              }`}
              style={{ transitionDelay: visible ? testimonial.delay : '0ms' }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-600/30 flex items-center justify-center flex-shrink-0 border border-purple-500/30 group-hover:scale-110 transition-transform">
                  <span className="text-purple-300 font-semibold">{testimonial.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white group-hover:text-purple-200 transition-colors">
                    {testimonial.author}
                  </div>
                  <div className="text-white/60 text-sm">{testimonial.handle}</div>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
