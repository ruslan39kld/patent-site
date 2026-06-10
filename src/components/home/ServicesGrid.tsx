import { Link } from 'react-router-dom';
import { Copyright, Lightbulb, Cog, Frame, Code, FileText, Globe, Handshake, ShieldAlert, ArrowRight } from 'lucide-react';
import { useData } from '../../store/DataContext';
import { cn } from '../../lib/utils';
import { ReactNode } from 'react';

export default function ServicesGrid() {
  const { state } = useData();

  const getIcon = (iconName: string): ReactNode => {
    switch(iconName) {
      case 'Copyright': return <Copyright className="w-6 h-6" />;
      case 'Lightbulb': return <Lightbulb className="w-6 h-6" />;
      case 'Cog': return <Cog className="w-6 h-6" />;
      case 'Frame': return <Frame className="w-6 h-6" />;
      case 'Code': return <Code className="w-6 h-6" />;
      case 'FileText': return <FileText className="w-6 h-6" />;
      case 'Globe': return <Globe className="w-6 h-6" />;
      case 'Handshake': return <Handshake className="w-6 h-6" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6" />;
      default: return <Copyright className="w-6 h-6" />;
    }
  };

  const getBorderColor = (index: number) => {
    const colors = ['#C8A028', '#2960B0', '#0F6E56', '#9B51E0', '#E25E3E', '#1B3F7A'];
    return colors[index % colors.length];
  };

  const scrollToContact = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('fill-contact-form', { detail: { task: `Интересует услуга: ${title}` } }));
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="services" className="py-24 bg-white border-t border-[#F3F4F6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-on-scroll">
            <div className="text-[11px] text-[#C8A028] uppercase tracking-[2px] font-bold mb-2">НАШИ ВОЗМОЖНОСТИ</div>
            <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-6">
              Комплексные решения для вашего бизнеса
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              Вы получаете не просто свидетельство, а надежный инструмент, который защищает от конкурентов и позволяет безопасно масштабироваться.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {state.services.slice(0, 6).map((svc, i) => (
            <div key={svc.id} className={cn(
              "flex flex-col bg-white overflow-hidden relative transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(27,63,122,0.12)] border border-[#E5E7EB] rounded-[16px]",
              `stagger-${Math.min(i + 1, 6)}`
            )}>
              {/* Top Colored Stripe */}
              <div className="absolute top-0 left-0 w-full h-[4px]" style={{ backgroundColor: getBorderColor(i) }}></div>

              <div className="p-8 pb-6 flex-grow flex flex-col">
                 <div className="w-12 h-12 rounded-full bg-[#EEF3FB] flex items-center justify-center mb-6 shrink-0 text-[#1B3F7A]">
                   {getIcon(svc.icon)}
                 </div>
                 
                 <h3 className="text-2xl font-bold text-[#1B3F7A] mb-3 leading-tight group-hover:text-[#C8A028] transition-colors">{svc.title}</h3>
                 <p className="text-[#6B7280] mb-4 flex-grow">{svc.shortDesc}</p>
              </div>
              
              <div className="bg-[#F8F9FA] p-6 mt-auto flex flex-col text-[14px]">
                <div className="flex justify-between items-center text-[#6B7280] font-medium mb-3">
                  <span>Срок: от {Math.max(2, (i%3)*3 + 2)} мес.</span>
                  <span>от {(i%3)*15 + 15} 000 руб.</span>
                </div>
                <button 
                  onClick={(e) => scrollToContact(e, svc.title)}
                  className="flex items-center justify-center bg-white border border-[#E5E7EB] hover:border-[#1B3F7A] text-[#1B3F7A] font-bold w-full py-3 rounded-lg transition-colors focus:outline-none"
                >
                  Узнать подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
