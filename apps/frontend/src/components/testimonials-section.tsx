'use client';

export function TestimonialsSection() {
  const testimonials = [
    {
      author: 'Utkarsh Rajvanshi',
      handle: '@utkersh01',
      text: 'Great work @ajeetunc 💯 Any plans to support mobile dimensions?',
      avatar: 'U',
    },
    {
      author: 'coder',
      handle: '@ar7_code',
      text: 'I think you made something that would be a great leap in the learning community',
      avatar: 'C',
    },
    {
      author: 'Ayush Chugh',
      handle: '@aayushchugh_x',
      text: 'Interesting project, how can we register our org on it?',
      avatar: 'A',
    },
    {
      author: 'Salym.eth -- e/acc',
      handle: '@ruud_awakening',
      text: 'What is your criteria for choosing what projects appear on this?',
      avatar: 'S',
    },
    {
      author: 'Aryan Dixit',
      handle: '@aryandixit4U7',
      text: 'Sounds great 👍',
      avatar: 'A',
    },
    {
      author: 'Ranit Mukherjee',
      handle: '@RanitMukherjee_',
      text: 'So you plan on manually updating & maintaining it...appreciate the effort!',
      avatar: 'R',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          Testimonials
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-semibold">{testimonial.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-white/60 text-sm">{testimonial.handle}</div>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

