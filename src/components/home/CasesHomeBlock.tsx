import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function CasesHomeBlock() {
  const { state } = useData();
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(state.cases.map(c => c.category)))];

  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return 'Все';
    const caseItem = state.cases.find(c => c.category === cat);
    return caseItem?.categoryLabel || cat;
  };

  const filteredCases = filter === 'All' 
    ? state.cases 
    : state.cases.filter(c => c.category === filter);

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
    <section id="cases" className="py-24 bg-white overflow-hidden border-t border-[#F3F4F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">Практика</div>
          <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-6">Реальные результаты для бизнеса</h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto leading-relaxed mb-8">
            Подтвержденный опыт защиты брендов, IT-продуктов и патентования
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-bold transition-all border outline-none",
                  filter === cat 
                    ? "bg-[#1B3F7A] text-white border-[#1B3F7A] shadow-sm" 
                    : "bg-white text-[#1B3F7A] border-[#E5E7EB] hover:border-[#C8A028] hover:text-[#1B3F7A] hover:bg-[#F8F9FA]"
                )}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {filteredCases.map((c, i) => (
            <div key={c.id} className="bg-white rounded-[24px] p-8 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_rgba(27,63,122,0.1)] transition-all flex flex-col group relative overflow-hidden animate-in fade-in duration-500">
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
              
              <h3 className="text-2xl font-bold text-[#1B3F7A] mb-6 leading-tight hover:text-[#C8A028] transition-colors">{c.title}</h3>
              
              <div className="space-y-6 mb-8 flex-grow">
                {c.situation && (
                  <div className="relative pl-4 border-l-2 border-[#E5E7EB]">
                    <p className="text-[#1F2937] font-medium leading-relaxed">{c.situation}</p>
                  </div>
                )}
                <div className="relative pl-4 border-l-2 border-[#E5E7EB]">
                  <p className="text-[#6B7280] leading-relaxed">{c.task}</p>
                </div>
                <div className="p-5 bg-[#FFFBF0] border-l-[4px] border-[#C8A028] rounded-r-xl mt-4">
                  <p className="text-[#1F2937] font-medium leading-relaxed mb-3">{c.solution}</p>
                  <div className="flex items-start text-ink">
                     <CheckCircle2 className="w-5 h-5 text-[#C8A028] shrink-0 mr-3 mt-0.5" />
                     <span className="font-bold text-[#1B3F7A]">{c.result}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
