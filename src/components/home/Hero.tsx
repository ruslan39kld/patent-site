import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useData } from '../../store/DataContext';
import { useEffect, useState } from 'react';
import CanvasParticles from './CanvasParticles';

export default function Hero() {
  const { state } = useData();
  const [years, setYears] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setYears(Math.floor(easeOut * 20));
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setYears(20);
      }
    }, stepTime);
    
    return () => clearInterval(interval);
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const stats = [
    { value: '20+', label: 'лет практики' },
    { value: '300+', label: 'зарегистрировано знаков' },
    { value: '500+', label: 'выигранных дел' },
    { value: '1558', label: 'номер в реестре' },
  ];

  return (
    <section id="hero" className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-white">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(135deg,#F0F4FF_0%,#F8F9FA_60%,#FFF8E8_100%)]">
        <CanvasParticles />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-24">
          
          <div className="lg:col-span-7">
            <div className="flex flex-wrap gap-3 mb-8 relative z-10 animate-on-scroll">
              <div className="bg-white text-[#1B3F7A] px-4 py-2 rounded-lg text-[13px] font-bold border border-gray/10 flex items-center shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#C8A028] mr-2" />
                Государственная защита интеллектуальной собственности
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1B3F7A] leading-[1.1] mb-4 tracking-tight relative z-10 animate-on-scroll stagger-1">
              Защитите бренд, продукт и разработки вашего бизнеса
            </h1>
            
            <div className="text-[#1F2937] font-bold tracking-wide mb-6 text-sm sm:text-base relative z-10 animate-on-scroll stagger-1 flex items-center gap-2">
              <span className="text-[#C8A028] text-xl leading-none">•</span>
              {state.content.heroStatus}
            </div>
            
            <p className="text-lg sm:text-xl text-[#1F2937] font-medium mb-10 max-w-2xl leading-relaxed relative z-10 animate-on-scroll stagger-2">
              {state.content.heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12 relative z-10 animate-on-scroll stagger-3">
              <button 
                onClick={scrollToContact}
                className="btn-pulse inline-flex items-center justify-center bg-[#1B3F7A] hover:bg-[#2960B0] text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:-translate-y-1 group border-none outline-none"
              >
                Обсудить задачу
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[13px] font-bold text-[#6B7280] uppercase tracking-widest relative z-10 animate-on-scroll stagger-4">
               {['Бренды', 'Маркетплейсы', 'IT-продукты', 'Патенты', 'Дизайн', 'Авторские права'].map((item, index) => (
                 <div key={index} className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1B3F7A] mr-2"></div>
                    {item}
                 </div>
               ))}
            </div>
          </div>
          
          <div className="lg:col-span-5 relative hidden lg:block animate-on-scroll stagger-2">
            <div 
              className="photo-placeholder relative rounded-[20px] overflow-hidden max-w-[400px] mx-auto lg:ml-auto h-[500px] flex items-center justify-center shadow-[0_20px_40px_rgba(27,63,122,0.1)] transition-transform duration-500 hover:-translate-y-2"
              style={{ background: 'linear-gradient(135deg, #E8EEF8 0%, #D0DDF5 100%)' }}
            >
              <div className="text-center text-[#6B7280] relative z-20">
                <div className="text-[64px] mb-2 drop-shadow-md">📷</div>
                <div className="text-[14px] font-bold uppercase tracking-widest text-[#1B3F7A]">Фото специалиста</div>
                <div className="text-[12px] text-[#2960B0] font-medium mt-1">400 × 500 px</div>
              </div>
              <div className="absolute -top-10 -right-10 w-[160px] h-[160px] rounded-full bg-[#C8A028]/15 z-10 mix-blend-multiply blur-sm"></div>
              <div className="absolute -bottom-16 -left-16 w-[240px] h-[240px] rounded-full bg-[#1B3F7A]/10 z-10 mix-blend-multiply blur-sm"></div>
            </div>
          </div>
          
        </div>

        {/* Statistics Block */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10 animate-on-scroll stagger-4">
           {stats.map((stat, i) => (
             <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-6 text-center hover:border-[#1B3F7A]/30 transition-colors shadow-sm">
               <div className="text-[36px] font-bold text-[#1B3F7A] mb-1">{i === 0 ? years + '+' : stat.value}</div>
               <div className="text-[12px] text-[#6B7280] font-medium uppercase tracking-wider">{stat.label}</div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
