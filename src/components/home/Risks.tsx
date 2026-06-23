import { ShieldAlert, AlertOctagon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useData } from '../../store/DataContext';

export default function Risks() {
  const { state } = useData();
  const risks = state.content?.risks?.filter((r: any) => r.active !== false) || [];

  if (risks.length === 0) return null;

  return (
    <section id="risks" className="py-24 bg-white relative overflow-hidden animate-on-scroll">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[600px] h-[600px] rounded-full bg-[#F0F4FF] opacity-50 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
          <div className="flex flex-col space-y-8 lg:pr-8">
            <div>
              <div className="text-[12px] text-[#FF4444] uppercase tracking-widest font-bold mb-4 flex items-center">
                <AlertOctagon className="w-4 h-4 mr-2" />
                Зоны риска
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-6 leading-tight">
                Что будет, <span className="text-[#1F2937] font-medium">если права не оформить вовремя</span>
              </h2>
              <p className="text-[#6B7280] text-lg leading-relaxed">
                Запоздалые действия всегда стоят дороже, чем своевременная профилактика. Отсутствие юридической защиты бьет по самому ценному — выручке и доле рынка.
              </p>
            </div>

            {/* Photo Placeholder / Image */}
            <div className="relative rounded-[20px] overflow-hidden bg-gradient-to-br from-[#EEF3FB] to-[#E2EAF8] aspect-[4/3] flex items-center justify-center shadow-inner border border-gray-100 group animate-on-scroll stagger-2 group/img">
              {state.content?.risksImage ? (
                <>
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-70 transition-transform duration-700 group-hover/img:scale-125"
                    style={{ backgroundImage: `url("${state.content.risksImage}")` }}
                  />
                  <img 
                    src={state.content.risksImage} 
                    alt="Риски" 
                    className="relative z-10 w-full h-full object-contain transition-transform duration-700 group-hover/img:scale-105"
                  />
                </>
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shimmer_5s_infinite] transition-all"></div>
              )}
              
              {!state.content?.risksImage && (
                <div className="text-center relative z-10 p-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_8px_30px_rgba(27,63,122,0.08)] border border-gray-50 transition-transform group-hover:scale-110 duration-500">
                    <ShieldAlert className="w-10 h-10 text-[#FF4444]" />
                  </div>
                  <span className="block text-[#1B3F7A] font-bold tracking-widest uppercase text-sm mb-1">
                    Место для иллюстрации
                  </span>
                  <span className="block text-[#6B7280] text-[12px]">
                    Избегайте абстракций, покажите суть проблемы
                  </span>
                  <div className="inline-block mt-4 bg-white/60 px-3 py-1.5 rounded-md text-[#1B3F7A]/80 text-[11px] font-bold border border-white">
                    Размер: 800 × 600 px
                  </div>
                </div>
              )}

              {/* Decorative elements in placeholder */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#1B3F7A]/20"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#1B3F7A]/20"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#1B3F7A]/20"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#1B3F7A]/20"></div>
            </div>
          </div>

          <div className="flex flex-col space-y-4 relative">
             
            {risks.map((risk: any, i: number) => (
              <div 
                key={i} 
                className={cn(
                  "bg-white border border-[#FF4444]/20 p-5 rounded-2xl shadow-[0_0_15px_rgba(255,68,68,0.15)] hover:shadow-[0_0_25px_rgba(255,68,68,0.4)] hover:border-[#FF4444]/50 transition-all duration-300 group flex items-start relative z-10 hover:-translate-y-1",
                  `stagger-${Math.min(i + 1, 6)} animate-on-scroll`
                )}
              >
                <div className="shrink-0 mr-5 mt-0.5 relative bg-white">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0F0] flex items-center justify-center group-hover:bg-[#FF4444] transition-colors duration-300">
                    <span className="w-2 h-2 rounded-full bg-[#FF4444] group-hover:bg-white transition-colors duration-300"></span>
                  </div>
                  {/* Ping effect on hover */}
                  <div className="absolute inset-0 rounded-full border border-[#FF4444] opacity-0 scale-100 group-hover:animate-ping"></div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-[16px] text-[#1F2937] font-medium leading-snug group-hover:text-[#1B3F7A] transition-colors">{risk.title || risk.text}</h3>
                  {risk.desc && <p className="text-gray-500 text-sm mt-1">{risk.desc}</p>}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
