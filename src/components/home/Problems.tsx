import React, { useState, useEffect } from 'react';
import { Store, ShoppingBag, Box, Terminal, Palette, ShieldAlert, Globe, ArrowRight } from 'lucide-react';
import Modal from '../Modal';
import { useData } from '../../store/DataContext';

interface Situation {
  id: number;
  text: string;
  desc: string;
  icon: React.ReactNode;
  modalText: string;
  recommendation: string;
  spanClass: string;
}

export default function Problems() {
  const [selectedTask, setSelectedTask] = useState<Situation | null>(null);
  const { state } = useData();

  const handleDiscuss = () => {
    setSelectedTask(null);
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const icons = [
    <Store className="w-5 h-5 text-[#1B3F7A]" />,
    <ShoppingBag className="w-5 h-5 text-[#1B3F7A]" />,
    <Box className="w-5 h-5 text-[#1B3F7A]" />,
    <Terminal className="w-5 h-5 text-[#1B3F7A]" />,
    <Palette className="w-5 h-5 text-[#1B3F7A]" />,
    <ShieldAlert className="w-5 h-5 text-[#1B3F7A]" />,
    <Globe className="w-5 h-5 text-[#1B3F7A]" />,
  ];

  const defaultSpanClasses = [
    'col-span-1 md:col-span-1 lg:col-span-3',
    'col-span-1 md:col-span-2 lg:col-span-3',
    'col-span-1 md:col-span-1 lg:col-span-2',
    'col-span-1 md:col-span-1 lg:col-span-2',
    'col-span-1 md:col-span-1 lg:col-span-2',
    'col-span-1 md:col-span-2 lg:col-span-3',
    'col-span-1 md:col-span-1 lg:col-span-3'
  ];

  const cards = state.content?.cards?.filter((c: any) => c.active !== false) || [];
  
  if (cards.length === 0) return null;

  const situations: Situation[] = cards.map((card: any, i: number) => ({
    id: i + 1,
    text: card.title,
    desc: card.desc,
    icon: icons[i % icons.length],
    modalText: card.desc,
    recommendation: card.service || card.linkTitle || 'Оставить заявку на консультацию',
    spanClass: defaultSpanClasses[i % defaultSpanClasses.length],
  }));

  return (
    <section id="tasks" className="py-24 bg-[#F8F9FA] border-t border-[#F3F4F6] relative overflow-hidden animate-on-scroll">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">Навигация по задачам</div>
          <h2 className="text-3xl md:text-4xl font-black text-[#1B3F7A] mb-0">С какой задачей вы пришли?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {situations.map((sit) => (
             <div 
              key={sit.id}
              onClick={() => setSelectedTask(sit)}
              className={`group cursor-pointer rounded-2xl p-6 bg-white transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${sit.spanClass}`}
              style={{
                border: '1px solid #E5E7EB',
                minHeight: '160px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1B3F7A';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(27,63,122,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
              }}
             >
               {/* Tech subtle background element */}
               <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#F0F4FF] rounded-full opacity-50 transition-transform duration-500 group-hover:scale-150"></div>
               
               <div className="relative z-10 flex items-center justify-between mb-4">
                 <div className="w-10 h-10 rounded-xl bg-[#EEF3FB] flex items-center justify-center transition-transform group-hover:-translate-y-1">
                   {sit.icon}
                 </div>
                 <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-[#1B3F7A] group-hover:border-[#1B3F7A]">
                   <ArrowRight className="w-4 h-4 text-white" />
                 </div>
               </div>
               
               <div className="relative z-10 mt-auto">
                 <h3 className="text-[17px] font-bold text-[#1F2937] leading-tight mb-2 group-hover:text-[#1B3F7A] transition-colors">{sit.text}</h3>
                 <p className="text-[13px] text-[#6B7280] leading-snug">{sit.desc}</p>
               </div>
             </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)}>
        {selectedTask && (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF3FB] flex items-center justify-center mb-6">
              {selectedTask.icon}
            </div>
            <h3 className="text-2xl font-black text-[#1B3F7A]">{selectedTask.text}</h3>
            <p className="text-gray-700 leading-relaxed text-[16px]">{selectedTask.modalText}</p>
            <div className="bg-[#1B3F7A]/5 p-5 rounded-xl border border-[#1B3F7A]/10 mt-6">
              <p className="text-[#1B3F7A] text-sm"><span className="font-bold uppercase tracking-wider text-xs block mb-1">Рекомендация эксперта</span> {selectedTask.recommendation}</p>
            </div>
            <button
              onClick={handleDiscuss}
              className="mt-8 w-full py-4 bg-[#1B3F7A] text-white rounded-xl font-bold text-base transition-all hover:bg-[#2960B0] hover:shadow-lg inline-flex items-center justify-center gap-2 group"
            >
              Обсудить задачу
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
}
