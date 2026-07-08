import { useData } from '../../store/DataContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function CasesHomeBlock() {
  const { state } = useData();

  const getCategoryColor = (cat: string, defaultColor: string) => {
    if (defaultColor) return defaultColor;
    const isMatched = (keyword: string) => cat.toLowerCase().includes(keyword);
    if (isMatched('маркетплейс') || isMatched('marketplace')) return '#C8A028';
    if (isMatched('it') || isMatched('по') || isMatched('software')) return '#2960B0';
    if (isMatched('дизайн') || isMatched('бренд') || isMatched('brand') || isMatched('design')) return '#1B3F7A';
    if (isMatched('международн') || isMatched('international')) return '#0F6E56';
    return '#1B3F7A';
  };

  const getCategoryEmoji = (cat: string) => {
    const isMatched = (keyword: string) => cat.toLowerCase().includes(keyword);
    if (isMatched('маркетплейс') || isMatched('marketplace')) return '🛍️ ';
    if (isMatched('it') || isMatched('по') || isMatched('software')) return '💻 ';
    if (isMatched('дизайн') || isMatched('бренд') || isMatched('brand') || isMatched('design')) return '🎨 ';
    if (isMatched('международн') || isMatched('international')) return '🌍 ';
    return '📄 ';
  };

  return (
    <section  id="cases" className="animate-on-scroll py-24 bg-white overflow-hidden relative rounded-[40px] mx-4 my-12 shadow-sm">
      {/* Decorative background circle */}
      <div className="absolute top-0 left-0 -mt-32 -ml-32 w-[600px] h-[600px] rounded-full bg-[#1B3F7A]/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="text-[11px] text-[#1B3F7A] uppercase tracking-[2px] font-bold mb-3 flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-[#1B3F7A]/30"></div>
            Практика
            <div className="w-8 h-px bg-[#1B3F7A]/30"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-6 tracking-tight">Реальные результаты для бизнеса</h2>
          <p className="text-xl font-medium text-[#6B7280] max-w-3xl mx-auto leading-relaxed mb-4">
            Подтвержденный опыт защиты брендов, IT-продуктов и патентования.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {state.cases.slice(0, 4).map((c, i) => (
            <div key={c.id} className={cn(
              "bg-[#F8F9FA] rounded-[24px] p-8 border border-[#1B3F7A]/20 shadow-[0_0_15px_rgba(27,63,122,0.15)] hover:shadow-[0_0_30px_rgba(27,63,122,0.4)] hover:border-[#1B3F7A]/60 transition-all duration-300 flex flex-col group relative overflow-hidden hover:-translate-y-1",
              `stagger-${Math.min(i + 1, 6)} animate-on-scroll`
            )}>
              <div 
                className="absolute top-0 left-0 w-full h-[4px] transition-opacity"
                style={{ backgroundColor: getCategoryColor(c.category, c.categoryColor) }}
              ></div>
              
              <div 
                className="inline-flex items-center px-4 py-1.5 text-xs font-bold rounded-md uppercase tracking-wider mb-6 self-start border"
                style={{ 
                  color: getCategoryColor(c.category, c.categoryColor), 
                  borderColor: `${getCategoryColor(c.category, c.categoryColor)}40`,
                  backgroundColor: `${getCategoryColor(c.category, c.categoryColor)}10` 
                 }}
              >
                <span className="mr-2">{getCategoryEmoji(c.category)}</span>
                {c.categoryLabel || c.category}
              </div>
              
              <h3 className="text-2xl font-bold text-[#1B3F7A] mb-6 leading-tight group-hover:text-[#C8A028] transition-colors">{c.title}</h3>
              
              <div className="space-y-6 mb-8 flex-grow">
                {c.situation && (
                  <div className="relative pl-4 border-l-2 border-[#E5E7EB]">
                    <p className="text-[#1F2937] font-medium leading-relaxed whitespace-pre-wrap">{c.situation}</p>
                  </div>
                )}
                <div className="relative pl-4 border-l-2 border-[#E5E7EB]">
                  <p className="text-[#6B7280] leading-relaxed whitespace-pre-wrap">Задача: {c.task}</p>
                </div>
                <div className="p-5 bg-[#FFFBF0] border-l-[4px] border-[#C8A028] rounded-r-xl mt-4">
                  <p className="text-[#1F2937] font-medium leading-relaxed mb-3 whitespace-pre-wrap">{c.solution}</p>
                  <div className="flex items-start text-ink">
                     <CheckCircle2 className="w-5 h-5 text-[#C8A028] shrink-0 mr-3 mt-0.5" />
                     <span className="font-bold text-[#1B3F7A] whitespace-pre-wrap">{c.result}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center animate-on-scroll stagger-4">
           <Link to="/cases" className="inline-flex items-center justify-center border border-[#1B3F7A]/20 hover:border-[#1B3F7A] text-[#1B3F7A] font-bold px-8 py-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
             Смотреть все кейсы
             <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      </div>
    </section>
  );
}
