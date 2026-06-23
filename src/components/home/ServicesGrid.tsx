import { Link } from 'react-router-dom';
import { Copyright, Lightbulb, Cog, Frame, Code, FileText, Globe, Handshake, ShieldAlert, ArrowRight } from 'lucide-react';
import { useData } from '../../store/DataContext';
import { cn } from '../../lib/utils';
import React, { ReactNode } from 'react';

export default function ServicesGrid() {
  const { state } = useData();

  const getIcon = (iconName: string): ReactNode => {
    switch(iconName) {
      case 'Copyright': return <Copyright className="w-5 h-5" />;
      case 'Lightbulb': return <Lightbulb className="w-5 h-5" />;
      case 'Cog': return <Cog className="w-5 h-5" />;
      case 'Frame': return <Frame className="w-5 h-5" />;
      case 'Code': return <Code className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      case 'Handshake': return <Handshake className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      default: return <Copyright className="w-5 h-5" />;
    }
  };

  const images = [
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", // Регистрация товарных знаков
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", // Патентование изобретений
    "https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?auto=format&fit=crop&q=80&w=800", // Полезные модели 
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800", // Дизайн/пром. образцы
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800", // ПО/Код
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800"  // Авторские права
  ];

  const scrollToContact = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('fill-contact-form', { detail: { task: `Интересует услуга: ${title}` } }));
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="services" className="py-24 bg-white relative">
      {/* Tech background elements */}
      <div className="absolute inset-0 bg-[#F8F9FA] opacity-50 z-0 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1B3F7A]/10 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-6">
              {state.content?.servicesTitle || 'Комплексные решения'}
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto font-medium">
              {state.content?.servicesSubtitle || 'Надежный инструмент защиты от конкурентов и безопасного масштабирования вашего бизнеса.'}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {state.services.slice(0, 6).map((svc, i) => (
            <div key={svc.id} className={cn(
              "flex flex-col bg-white overflow-hidden relative transition-all duration-500 group rounded-2xl border border-[#1B3F7A]/20 shadow-[0_0_15px_rgba(27,63,122,0.15)] hover:shadow-[0_0_30px_rgba(27,63,122,0.4)] hover:border-[#1B3F7A]/60 hover:-translate-y-1",
              `stagger-${Math.min(i + 1, 6)}`
            )}>
              {/* Image Section */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#1B3F7A]">
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-70 group-hover:scale-125 transition-transform duration-700"
                  style={{ backgroundImage: `url("${svc.image || images[i] || images[0]}")` }}
                />
                <img 
                  src={svc.image || images[i] || images[0]} 
                  alt={svc.title}
                  className="relative z-10 w-full h-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B3F7A]/90 via-[#1B3F7A]/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-75"></div>
                
                {/* Icon badge over image */}
                <div className="absolute bottom-4 left-6 flex items-center z-10">
                  <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mr-4 shadow-lg">
                    {getIcon(svc.icon)}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-tight drop-shadow-md">
                    {svc.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 pb-5 flex-grow flex flex-col relative bg-white">
                <p className="text-[14px] text-[#4B5563] mb-6 flex-grow leading-relaxed">
                  {svc.shortDesc}
                </p>
                 
                {/* Tech specifications area */}
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#9CA3AF] mb-1">Сроки</span>
                    <span className="text-[13px] font-medium text-[#1F2937]">от {Math.max(2, (i%3)*3 + 2)} мес.</span>
                  </div>
                  
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#9CA3AF] mb-1">Инвестиции</span>
                    <span className="text-[13px] font-bold text-[#1B3F7A]">от {(i%3)*15 + 15} 000 руб.</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={(e) => scrollToContact(e, svc.title)}
                className="w-full relative overflow-hidden group/btn bg-[#F8F9FA] hover:bg-[#1B3F7A] text-[#1B3F7A] hover:text-white transition-all duration-300 py-4 flex items-center justify-center text-[14px] font-bold focus:outline-none"
              >
                <span className="relative z-10 flex items-center">
                  Узнать подробнее
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </span>
                {/* Sweep animation background */}
                <div className="absolute inset-0 bg-[#1B3F7A] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
