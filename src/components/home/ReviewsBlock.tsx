import { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { useData } from '../../store/DataContext';

export default function ReviewsBlock() {
  const { state } = useData();
  const reviews = state.reviews || [];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // scroll by approximately one card width + gap (340 + 24 = 364)
          scrollRef.current.scrollBy({ left: 364, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-24 bg-[#F8F9FA] border-t border-[#F3F4F6] overflow-hidden animate-on-scroll">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">Отзывы</div>
          <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A]">Клиенты о работе с Викторией</h2>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-12 pt-4 px-4 -mx-4 snap-x hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, i) => (
            <div key={i} className="flex-none w-[340px] md:w-[calc(33.333%-16px)] bg-white p-8 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-transparent flex flex-col snap-start h-[380px]">
              <div className="flex items-center mb-6">
                <div className="w-[48px] h-[48px] rounded-full bg-[#1B3F7A] text-white flex items-center justify-center font-bold text-xl mr-4 shrink-0">
                  {review.initials || review.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[#1F2937]">{review.name}</div>
                  <div className="flex text-[#C8A028] mt-1 space-x-0.5">
                    {[...Array(review.rating || 5)].map((_, j) => (
                      <Star key={j} className="w-[16px] h-[16px] fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-[#6B7280] mb-6 flex-grow leading-relaxed italic">"{review.text}"</p>
              
              <div className="inline-block px-3 py-1.5 bg-[#EEF3FB] text-[#1B3F7A] text-[11px] font-bold rounded uppercase tracking-wider self-start mr-auto">
                {review.tag || review.service}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
