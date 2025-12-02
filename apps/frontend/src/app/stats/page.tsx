import { StatsSection } from '@/components/stats-section';
import { TestimonialsSection } from '@/components/testimonials-section';

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <StatsSection />
      <TestimonialsSection />
    </div>
  );
}

