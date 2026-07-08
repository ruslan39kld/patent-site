import { useState } from 'react';
import { useData } from '../store/DataContext';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function Cases() {
  const { state } = useData();
  const [filter, setFilter] = useState('All');

  const categories: string[] = ['All', ...Array.from(new Set(state.cases.map(c => c.category)) as Set<string>)];

  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return 'Все кейсы';
    const caseItem = state.cases.find(c => c.category === cat);
    return caseItem?.categoryLabel || cat;
  };

  const filteredCases = filter === 'All' 
    ? state.cases 
    : state.cases.filter(c => c.category === filter);

  const getCategoryColor = (cat: string, defaultColor?: string) => {
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
    <div className="pt-24 pb-24 bg-[#F8F9FA] min-h-screen relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[600px] h-[600px] rounded-full bg-[#1B3F7A]/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-12">
          <Link to="/#cases" className="inline-flex items-center text-[#1B3F7A] font-medium hover:text-[#C8A028] transition-colors mb-6 group bg-white px-4 py-2 rounded-lg border border-[#1B3F7A]/10 shadow-[0_4px_10px_rgba(27,63,122,0.05)]">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Назад на главную
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-black text-[#1B3F7A] mb-6 tracking-tight">Все кейсы и результаты</h1>
          <p className="text-xl font-medium text-[#6B7280] max-w-3xl leading-relaxed mb-8">
            Подтвержденный опыт защиты брендов, IT-продуктов и патентования для бизнеса из разных сфер.
          </p>
          
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-bold transition-all border outline-none",
                  filter === cat 
                    ? "bg-[#1B3F7A] text-white border-[#1B3F7A] shadow-sm" 
                    : "bg-white text-[#1B3F7A] border-[#E5E7EB] hover:border-[#1B3F7A]/30 hover:-translate-y-0.5 hover:shadow-sm"
                )}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {filteredCases.map((c, i) => (
             <div key={c.id} className={cn(
              "bg-white rounded-[24px] p-8 border border-[#1B3F7A]/20 shadow-[0_0_15px_rgba(27,63,122,0.15)] hover:shadow-[0_0_30px_rgba(27,63,122,0.4)] hover:border-[#1B3F7A]/60 transition-all duration-300 flex flex-col group relative overflow-hidden hover:-translate-y-1"
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
                    <div className="text-[#1F2937] font-medium leading-relaxed prose prose-sm max-w-none text-inherit prose-p:my-1" dangerouslySetInnerHTML={{ __html: c.situation }} />
                  </div>
                )}
                <div className="relative pl-4 border-l-2 border-[#E5E7EB]">
                  <div className="text-[#6B7280] leading-relaxed prose prose-sm max-w-none text-inherit prose-p:my-1" dangerouslySetInnerHTML={{ __html: c.task }} />
                </div>
                <div className="p-5 bg-[#FFFBF0] border-l-[4px] border-[#C8A028] rounded-r-xl mt-4">
                  <div className="text-[#1F2937] font-medium leading-relaxed mb-3 prose prose-sm max-w-none text-inherit prose-p:my-1" dangerouslySetInnerHTML={{ __html: c.solution }} />
                  <div className="flex items-start text-ink">
                     <CheckCircle2 className="w-5 h-5 text-[#C8A028] shrink-0 mr-3 mt-0.5" />
                     <div className="font-bold text-[#1B3F7A] prose prose-sm max-w-none text-inherit prose-p:my-1" dangerouslySetInnerHTML={{ __html: c.result }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredCases.length === 0 && (
           <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E7EB]">
              <p className="text-gray text-lg">В данной категории пока нет опубликованных кейсов.</p>
              <button onClick={() => setFilter('All')} className="mt-4 text-[#1B3F7A] font-bold hover:underline">Смотреть все</button>
           </div>
        )}
      </div>
    </div>
  );
}
