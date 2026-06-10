import { ShieldAlert, AlertOctagon } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Risks() {
  const risks = [
    { text: "Конкурент зарегистрировал ваше название — и вы не можете им пользоваться", delay: "delay-100" },
    { text: "Карточки товаров заблокированы на маркетплейсе по жалобе", delay: "delay-200" },
    { text: "Дизайнер сохранил права на логотип, который вы оплатили", delay: "delay-300" },
    { text: "Разработчик оспаривает права на ваш продукт", delay: "delay-400" },
    { text: "Дизайн упаковки скопировали конкуренты", delay: "delay-500" },
  ];

  return (
    <section id="risks" className="py-24 bg-[#1B3F7A] text-white relative overflow-hidden animate-on-scroll">
      {/* Structural background lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-[20%] w-px h-full bg-white"></div>
        <div className="absolute top-0 right-[40%] w-px h-full bg-white"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-white"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-5">
            <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">Зоны риска</div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              <span className="text-[#C8A028]">Что будет</span>, если права не оформить вовремя
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Запоздалые действия всегда стоят дороже, чем своевременная профилактика. Отсутствие юридической защиты бьет по самому ценному — выручке и доле рынка.
            </p>
          </div>
          
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {risks.map((risk, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex flex-row items-center p-4 md:p-5 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:translate-x-2 cursor-default",
                    `stagger-${Math.min(i + 1, 6)} animate-on-scroll`
                  )}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <div className="shrink-0 mr-4 relative flex items-center justify-center" style={{ width: '10px', height: '10px' }}>
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: '#FF4444' }}></div>
                    <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: '#FF4444' }}></div>
                  </div>
                  <span className="text-[16px] font-medium leading-tight text-white">{risk.text}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
