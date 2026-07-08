import { CheckCircle2 } from 'lucide-react';
import { useData } from '../../store/DataContext';
import { cn } from '../../lib/utils';

export default function Process() {
  const { state } = useData();
  const processSteps = state.content?.process?.filter((p: any) => p.active !== false) || [];

  if (processSteps.length === 0) return null;

  return (
    <section  id="process" className="animate-on-scroll py-24 bg-[#EEF3FB] overflow-hidden relative rounded-[40px] mx-4 my-12 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-on-scroll">
          <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">КАК МЫ РАБОТАЕМ</div>
          <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-6">5 шагов к защите вашего актива</h2>
          <p className="text-xl text-[#6B7280]">
            Каждый этап регламентирован и понятен. Вы всегда знаете, что происходит с вашей задачей.
          </p>
        </div>

        
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical timeline line background */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 bg-[#1B3F7A]/10 -translate-x-1/2 rounded-full z-0"></div>
          
          <div className="flex flex-col space-y-16 relative z-10">
            {processSteps.map((step: any, i: number) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className={cn("relative flex flex-col md:flex-row items-center w-full animate-on-scroll group", `stagger-${Math.min(i + 1, 6)}`, isEven ? "md:flex-row" : "md:flex-row-reverse")}>
                  
                  {/* Content Card */}
                  <div className={cn("w-full md:w-5/12 text-left relative z-10", isEven ? "md:pr-12 md:text-right" : "md:pl-12")}>
                    <div className="bg-white p-8 rounded-2xl border border-[#1B3F7A]/20 shadow-[0_0_15px_rgba(27,63,122,0.15)] group-hover:shadow-[0_0_30px_rgba(27,63,122,0.4)] group-hover:border-[#1B3F7A]/60 transition-all duration-300 group-hover:-translate-y-1 relative z-10">
                      <h3 className="text-2xl font-bold text-[#1B3F7A] mb-3">{step.title}</h3>
                      {step.desc && <p className="text-[#6B7280] leading-relaxed">{step.desc}</p>}
                    </div>
                  </div>

                  {/* Node */}
                  <div className="w-full md:w-2/12 flex justify-center py-6 md:py-0 relative z-10 hidden md:flex">
                    <div className="bg-white w-14 h-14 rounded-full shadow-[0_0_0_8px_#ffffff] border-4 border-[#1B3F7A]/30 group-hover:border-[#1B3F7A] flex items-center justify-center text-[#1B3F7A] font-bold text-xl transition-colors duration-300">
                      {(i + 1).toString().padStart(2, '0')}
                    </div>
                  </div>

                  {/* Image Placeholder / Image */}
                  <div className={cn("w-full md:w-5/12 mt-6 md:mt-0 relative z-10", isEven ? "md:pl-12" : "md:pr-12")}>
                     {step.image ? (
                        <div className="w-full h-[200px] border border-[#1B3F7A]/20 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(27,63,122,0.1)] group-hover:shadow-[0_0_30px_rgba(27,63,122,0.3)] group-hover:border-[#1B3F7A]/40 group-hover:-translate-y-1 relative overflow-hidden group/img">
                           <div 
                             className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-70 transition-transform duration-700 group-hover/img:scale-125"
                             style={{ backgroundImage: `url("${step.image}")` }}
                           />
                           <img src={step.image} alt={step.title} className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" />
                        </div>
                     ) : (
                       <div className="w-full h-[200px] bg-gradient-to-br from-[#EEF3FB] to-[#E2EAF8] border border-[#1B3F7A]/20 rounded-2xl flex flex-col items-center justify-center text-[#6B7280] transition-all duration-300 shadow-[0_0_15px_rgba(27,63,122,0.1)] group-hover:shadow-[0_0_30px_rgba(27,63,122,0.3)] group-hover:border-[#1B3F7A]/40 group-hover:-translate-y-1 relative overflow-hidden">
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_3s_infinite] transition-opacity"></div>
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-[0_4px_10px_rgba(27,63,122,0.1)] transition-transform group-hover:scale-110 duration-500">
                              <span className="text-2xl">⚡</span>
                            </div>
                            <div className="text-sm font-bold uppercase tracking-widest text-[#1B3F7A]">Иллюстрация</div>
                            <div className="text-xs mt-1 text-[#2960B0] font-medium bg-[#EEF3FB]/50 px-2 py-1 rounded">300 × 200 px</div>
                          </div>
                       </div>
                     )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-24 flex justify-center animate-on-scroll stagger-3">
            <div className="bg-white inline-flex items-center space-x-3 border border-[#1B3F7A]/20 px-8 py-5 rounded-xl text-[#1F2937] font-bold shadow-[0_0_20px_rgba(27,63,122,0.1)] hover:shadow-[0_0_30px_rgba(27,63,122,0.2)] hover:border-[#1B3F7A]/40 transition-all duration-300 cursor-default hover:-translate-y-1">
                <CheckCircle2 className="w-6 h-6 text-[#1B3F7A]" />
                <span className="text-lg">Все процессы можно вести полностью дистанционно (онлайн)</span>
            </div>
        </div>
      </div>
    </section>
  );
}
