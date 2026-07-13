import { useEffect, useRef } from 'react';
import { FileBadge, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../store/DataContext';
import ReviewCard from '../ReviewCard';

export default function ReviewsBlock() {
  const { state } = useData();
  const rawReviews = state.reviews || [];
  const scrollRef = useRef<HTMLDivElement>(null);

  // Only reviews explicitly marked for the homepage (matches the "На главной"
  // toggle in the admin panel — it used to have no effect here at all).
  const reviews = rawReviews.filter(r => r.published !== false && r.onHome !== false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // scroll by one card width approx
          scrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section  id="reviews" className="animate-on-scroll py-24 bg-white relative overflow-hidden rounded-[40px] mx-4 my-12 shadow-sm">
      {/* Tech Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 relative z-10 flex flex-col items-center animate-on-scroll stagger-1">
          <div className="inline-flex items-center space-x-2 text-[#3B82F6] font-bold tracking-widest uppercase text-xs mb-6 bg-[#3B82F6]/10 px-4 py-2 rounded-lg border border-[#3B82F6]/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
             <FileBadge className="w-4 h-4" />
             <span>Подтвержденные отзывы</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1B3F7A] tracking-tight relative inline-block mx-auto">
             Клиенты о работе
             <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3B82F6]/50 to-transparent"></div>
          </h2>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-16 pt-4 px-4 -mx-4 snap-x hide-scrollbar animate-on-scroll stagger-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, i) => (
            <ReviewCard key={review.id ?? i} review={review} className="flex-none w-[350px] md:w-[400px] snap-start h-auto min-h-[420px]" />
          ))}
        </div>

        <div className="flex justify-end mt-4 ">
          <Link to="/reviews" className="inline-flex items-center text-[#1B3F7A] font-bold text-lg hover:text-[#3B82F6] transition-colors group">
            Все отзывы <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
