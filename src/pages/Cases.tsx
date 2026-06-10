import { useState } from 'react';
import { useData } from '../store/DataContext';
import { Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import FinalCTA from '../components/home/FinalCTA';
import { cn } from '../lib/utils';

export default function Cases() {
  const { state } = useData();
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(state.cases.map(c => c.category)))];

  const filteredCases = filter === 'All' 
    ? state.cases 
    : state.cases.filter(c => c.category === filter);

  return (
    <div className="bg-cream min-h-screen">
      <section className="pt-20 pb-16 bg-white border-b border-gray/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Кейсы из практики</h1>
                <p className="text-xl text-ink/80 leading-relaxed mb-10">
                  Реальные истории того, как своевременная правовая защита помогла бизнесу сохранить деньги, отбить атаки конкурентов и масштабироваться.
                </p>
                <div className="flex flex-wrap gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={cn(
                        "px-5 py-2.5 rounded-full text-sm font-bold transition-all border",
                        filter === cat 
                          ? "bg-primary text-white border-primary shadow-sm" 
                          : "bg-white text-primary border-gray/20 hover:border-accent hover:text-primary hover:bg-gold-bg/30"
                      )}
                    >
                      {cat === 'All' ? 'Все кейсы' : cat}
                    </button>
                  ))}
                </div>
             </div>
             <div className="hidden lg:flex justify-end opacity-20">
                <Briefcase className="w-64 h-64 text-primary" />
             </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCases.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-8 lg:p-10 border border-gray/10 shadow-sm hover:shadow-xl transition-all flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="inline-block px-3 py-1 bg-blue-bg text-primary text-xs font-bold rounded uppercase tracking-wider mb-6 self-start border border-primary/10">
                  {c.category}
                </div>
                
                <h3 className="text-2xl font-bold text-primary mb-6 leading-tight group-hover:text-accent transition-colors">{c.title}</h3>
                
                <div className="space-y-6 mb-8 flex-grow">
                  <div className="relative pl-4 border-l-2 border-gray/20">
                    <strong className="text-sm uppercase tracking-widest text-gray mb-2 block">Ситуация клиента</strong>
                    <p className="text-ink/90 font-medium leading-relaxed">{c.situation}</p>
                  </div>
                  
                  <div className="relative pl-4 border-l-2 border-gray/20">
                    <strong className="text-sm uppercase tracking-widest text-gray mb-2 block">Задача</strong>
                    <p className="text-ink/90 leading-relaxed">{c.task}</p>
                  </div>
                  
                  <div className="relative pl-4 border-l-2 border-accent">
                    <strong className="text-sm uppercase tracking-widest text-primary mb-2 block">Решение и Итог</strong>
                    <p className="text-primary font-medium leading-relaxed mb-3">{c.solution}</p>
                    <div className="flex items-start text-ink">
                       <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mr-3 mt-0.5" />
                       <span className="font-bold">{c.result}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray/10 mt-auto flex justify-end">
                  <Link to="/contacts" className="inline-flex items-center text-primary font-bold group-hover:text-accent transition-colors border border-primary/20 px-4 py-2 rounded-lg hover:border-accent">
                    Моя ситуация похожа <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {filteredCases.length === 0 && (
             <div className="text-center py-20">
                <p className="text-gray text-lg">В данной категории пока нет опубликованных кейсов.</p>
                <button onClick={() => setFilter('All')} className="mt-4 text-primary font-bold hover:underline">Смотреть все</button>
             </div>
          )}
        </div>
      </section>
      
      <FinalCTA />
    </div>
  );
}
