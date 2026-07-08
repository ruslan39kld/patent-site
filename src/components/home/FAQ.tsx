import { ChevronRight } from 'lucide-react';
import { useData } from '../../store/DataContext';
import { cn } from '../../lib/utils';
import { useNavigate, Link } from 'react-router-dom';

export default function FAQ() {
  const { state } = useData();
  const navigate = useNavigate();
  
  // Take only first 5 for home page
  const homeFaqs = state.faqItems.slice(0, 5);

  const handleFaqClick = (question: string) => {
    navigate('/faq', { state: { question } });
    window.scrollTo(0, 0);
  };

  return (
    <section  id="faq" className="animate-on-scroll py-24 bg-[#FBF3DC] relative overflow-hidden rounded-[40px] mx-4 my-12 shadow-sm">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-[#3B82F6]/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="text-[12px] text-[#3B82F6] uppercase tracking-widest font-bold mb-2 shadow-[#3B82F6]/20 drop-shadow-md">Ответы на вопросы</div>
          <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-6">Частые вопросы</h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto text-lg">
            Нажмите на вопрос, чтобы получить развернутый ответ от нашего AI-ассистента и задать уточняющие вопросы
          </p>
        </div>
        
        <div className="space-y-4 mb-12 animate-on-scroll">
          {homeFaqs.map((faq, i) => (
            <div 
              key={faq.id} 
              className={cn(
                  "bg-white border border-[#3B82F6]/20 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.25)] hover:-translate-y-1 hover:border-[#3B82F6]/50 transition-all duration-300 group relative",
                  `stagger-${Math.min(i + 1, 5)}`
              )}
            >
              <button
                className="w-full px-6 py-6 text-left flex justify-between items-center focus:outline-none relative"
                onClick={() => handleFaqClick(faq.q)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
                
                <span className="font-bold text-lg pr-8 text-[#1F2937] group-hover:text-[#1B3F7A] transition-colors relative z-10">
                  {faq.q}
                </span>
                <div className="w-10 h-10 rounded-full bg-[#f8fafc] group-hover:bg-[#3B82F6]/10 flex items-center justify-center shrink-0 transition-colors duration-300 relative z-10 border border-transparent group-hover:border-[#3B82F6]/20">
                  <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" />
                </div>
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Link 
            to="/faq"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center justify-center bg-[#C8A028] hover:bg-[#E8C050] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(200,160,40,0.3)] hover:shadow-[0_4px_25px_rgba(200,160,40,0.5)]"
          >
            Задать вопрос AI-боту
          </Link>
        </div>
      </div>
    </section>
  );
}
