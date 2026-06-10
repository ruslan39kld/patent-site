import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useData } from '../../store/DataContext';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const { state } = useData();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  // Take only first 5 for home page
  const homeFaqs = state.faqItems.slice(0, 5);

  return (
    <section id="faq" className="py-24 bg-white border-t border-[#F3F4F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">Ответы на вопросы</div>
          <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-6">Частые вопросы</h2>
        </div>
        
        <div className="space-y-4 mb-12 animate-on-scroll">
          {homeFaqs.map((faq, i) => (
            <div 
              key={faq.id} 
              className={cn(
                  "border-b border-[#E5E7EB] transition-all",
                  openIndex === i ? "bg-[#FFFBF0] border-l-[4px] border-l-[#C8A028] border-b-transparent shadow-sm" : "border-l-[4px] border-l-transparent hover:bg-[#F8F9FA]"
              )}
            >
              <button
                className="w-full px-6 py-6 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className={cn("font-bold text-lg pr-8 transition-colors", openIndex === i ? "text-[#1B3F7A]" : "text-[#1F2937]")}>
                  {faq.q}
                </span>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300",
                  openIndex === i ? "bg-[#C8A028] text-white rotate-180" : "bg-[#F8F9FA] text-[#1B3F7A]"
                )}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              
              <div 
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-6 pb-6 text-[#6B7280] leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Link 
            to="/faq"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-block bg-white border border-[#E5E7EB] text-[#1B3F7A] px-8 py-3 rounded-lg font-bold transition-colors hover:border-[#1B3F7A] hover:bg-[#F8F9FA]"
          >
            Все вопросы и ответы
          </Link>
        </div>
      </div>
    </section>
  );
}
