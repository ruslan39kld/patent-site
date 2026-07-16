import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useData } from '../../store/DataContext';
import React, { useEffect, useState } from 'react';
import CanvasParticles from './CanvasParticles';

export default function Hero() {
  const { state } = useData();
  const [years, setYears] = useState(0);
  const [isHeroImageLoaded, setIsHeroImageLoaded] = useState(false);

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
    const el = (sessionStorage.setItem('returnPos', window.scrollY.toString()), document.getElementById('contact'));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const defaultStats = [
    { value: '20+', label: 'лет практики' },
    { value: '300+', label: 'зарегистрировано знаков' },
    { value: '500+', label: 'выигранных дел' },
    { value: '1558', label: 'номер в реестре' },
  ];
  
  const statsData = state.content?.badges?.filter((b: any) => b.active !== false).map((b: any) => ({
    value: b.title,
    label: b.desc
  }));
  
  const stats = statsData && statsData.length > 0 ? statsData : defaultStats;

  return (
    <section  id="hero" className="animate-on-scroll relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-[linear-gradient(135deg,#F0F4FF_0%,#F8F9FA_60%,#FFF8E8_100%)]">
      {/* Background Particles specific to Hero block */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <CanvasParticles />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start mb-24">
          
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8 relative z-10 animate-on-scroll">
              <div className="bg-white text-[#1B3F7A] px-6 py-3 sm:py-4 rounded-xl text-[16px] sm:text-[18px] font-black border border-gray/10 flex items-center shadow-sm text-left">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8A028] mr-3 shrink-0" />
                Защита Вашего интеллектуального труда
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1B3F7A] leading-[1.1] mb-6 tracking-tight relative z-10 animate-on-scroll stagger-1 mx-auto lg:mx-0">
              {state.content?.heroTitle || "Защитите бренд, продукт и разработки вашего бизнеса"}
            </h1>
            
            <p className="text-lg sm:text-xl text-[#1F2937] font-medium mb-10 max-w-2xl leading-relaxed relative z-10 animate-on-scroll stagger-2 mx-auto lg:mx-0">
              {state.content?.heroSubtitle || "Регистрация товарных знаков, защита дизайна, программного обеспечения и технических решений с патентным поверенным РФ №1558 Викторией Тарасовой"}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 relative z-10 animate-on-scroll stagger-3 w-full lg:w-auto">
              <button 
                onClick={scrollToContact}
                className="btn-pulse inline-flex items-center justify-center w-full sm:w-auto bg-[#C8A028] hover:bg-[#E8C050] text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-[0_4px_15px_rgba(200,160,40,0.3)] hover:shadow-[0_4px_25px_rgba(200,160,40,0.5)] hover:-translate-y-1 group border-none outline-none"
              >
                Обсудить задачу
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative flex flex-col animate-on-scroll stagger-2 order-first lg:order-none mb-12 lg:mb-0">
            <div className="w-full relative rounded-2xl max-w-[340px] md:max-w-[440px] lg:max-w-[440px] mx-auto lg:ml-auto lg:mr-0 h-[450px] md:h-[600px] flex items-center justify-center transition-transform duration-500 hover:-translate-y-2 group shadow-[0_0_60px_rgba(59,130,246,0.25)] hover:shadow-[0_0_80px_rgba(59,130,246,0.4)]">
              <div className="absolute -inset-0 bg-gradient-to-br from-[#3B82F6]/50 via-[#2563EB]/40 to-[#1B3F7A]/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#1B3F7A]/5 z-10 border border-[#3B82F6]/30">
                {state.content?.heroMediaType === 'video' && state.content?.heroImage ? (
                  <video
                    src={state.content.heroImage}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="relative z-10 w-full h-full object-contain rounded-2xl"
                  />
                ) : state.content?.heroImage ? (
                  <>
                    {!isHeroImageLoaded && (
                      <div className="absolute inset-0 bg-slate-200 animate-pulse z-20 rounded-2xl" />
                    )}
                    <div
                      className={`absolute inset-0 bg-cover bg-center blur-md scale-110 transition-opacity duration-500 ${isHeroImageLoaded ? 'opacity-70' : 'opacity-0'}`}
                      style={{ backgroundImage: `url("${state.content.heroImage}")` }}
                    />
                    <img
                        src={state.content.heroImage}
                        alt="Виктория Тарасова"
                        onLoad={() => setIsHeroImageLoaded(true)}
                        className={`relative z-10 w-full h-full object-contain rounded-2xl transition-all duration-500 ${isHeroImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    />
                  </>
                ) : (
                  // No photo uploaded yet (HomeAdmin → "1. Hero-блок") — a
                  // branded placeholder, not a stock photo of an unrelated
                  // person standing in for the site owner.
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1B3F7A] to-[#3B82F6]">
                    <ShieldCheck className="w-20 h-20 md:w-28 md:h-28 text-white/40" />
                  </div>
                )}
              </div>
              <div className="absolute -top-10 -right-10 w-[160px] h-[160px] rounded-full bg-[#C8A028]/15 z-0 mix-blend-multiply blur-2xl"></div>
              <div className="absolute -bottom-16 -left-16 w-[240px] h-[240px] rounded-full bg-[#1B3F7A]/10 z-10 mix-blend-multiply blur-[120px]"></div>
            </div>
          </div>
          
        </div>

        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-x-6 sm:gap-x-10 gap-y-4 text-[14px] sm:text-[15px] font-bold text-[#6B7280] uppercase tracking-widest relative z-10 animate-on-scroll stagger-4 w-full mb-16">
           {['Бренды', 'Маркетплейсы', 'IT-продукты', 'Патенты', 'Дизайн', 'Авторские права'].map((item, index) => (
             <div key={index} className="flex items-center whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-[#1B3F7A] mr-3 shrink-0"></div>
                {item}
             </div>
           ))}
        </div>

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
