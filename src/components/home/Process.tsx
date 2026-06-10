import { CheckCircle2 } from 'lucide-react';
import { useData } from '../../store/DataContext';
import { cn } from '../../lib/utils';

export default function Process() {
  const processSteps = [
    { title: 'Описываете задачу', desc: 'удобным способом: форма, Telegram, WhatsApp' },
    { title: 'Оцениваем объект и риски', desc: 'Виктория анализирует ситуацию' },
    { title: 'Получаете стратегию', desc: 'сроки, стоимость, план действий' },
    { title: 'Подготовка документов', desc: 'все материалы для подачи в Роспатент' },
    { title: 'Сопровождение до результата', desc: 'до получения свидетельства' }
  ];

  return (
    <section id="process" className="py-24 bg-[#F8F9FA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-on-scroll">
          <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">КАК МЫ РАБОТАЕМ</div>
          <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-6">5 шагов к защите вашего актива</h2>
          <p className="text-xl text-[#6B7280]">
            Каждый этап регламентирован и понятен. Вы всегда знаете, что происходит с вашей задачей.
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical timeline line background */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 bg-[#E5E7EB] -translate-x-1/2 rounded-full z-0"></div>
          
          <div className="flex flex-col space-y-16 relative z-10">
            {processSteps.map((step: any, i: number) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className={cn("relative flex flex-col md:flex-row items-center w-full animate-on-scroll group", `stagger-${Math.min(i + 1, 6)}`, isEven ? "md:flex-row" : "md:flex-row-reverse")}>
                  
                  {/* Content Card */}
                  <div className={cn("w-full md:w-5/12 text-left relative z-10", isEven ? "md:pr-12 md:text-right" : "md:pl-12")}>
                    <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#E5E7EB] hover:border-[#1B3F7A] transition-colors">
                      <h3 className="text-2xl font-bold text-[#1B3F7A] mb-3">{step.title}</h3>
                      {step.desc && <p className="text-[#6B7280] leading-relaxed">{step.desc}</p>}
                    </div>
                  </div>

                  {/* Node */}
                  <div className="w-full md:w-2/12 flex justify-center py-6 md:py-0 relative z-10 hidden md:flex">
                    <div className="w-14 h-14 rounded-full bg-white shadow-[0_0_0_8px_#F8F9FA] border-4 border-[#1B3F7A] flex items-center justify-center text-[#1B3F7A] font-bold text-xl">
                      {(i + 1).toString().padStart(2, '0')}
                    </div>
                  </div>

                  {/* Image Placeholder */}
                  <div className={cn("w-full md:w-5/12 mt-6 md:mt-0 relative z-10", isEven ? "md:pl-12" : "md:pr-12")}>
                     <div className="w-full h-[200px] bg-[#E8EEF8] border border-[#E5E7EB] rounded-2xl flex flex-col items-center justify-center text-[#6B7280]">
                        <div className="text-3xl mb-2">🖼️</div>
                        <div className="text-sm font-bold uppercase tracking-widest text-[#1B3F7A]">Иллюстрация шага {i + 1}</div>
                        <div className="text-xs mt-1 text-[#9CA3AF]">300 × 200 px</div>
                     </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-24 flex justify-center animate-on-scroll stagger-3">
            <div className="inline-flex items-center space-x-3 bg-white border border-[#E5E7EB] px-8 py-5 rounded-xl text-[#1F2937] font-bold shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-[#C8A028]" />
                <span className="text-lg">Все процессы можно вести полностью дистанционно (онлайн)</span>
            </div>
        </div>
      </div>
    </section>
  );
}
