import { useState } from 'react';
import { Store, ShoppingBag, Box, Terminal, Palette, ShieldAlert, Globe } from 'lucide-react';
import Modal from '../Modal';

interface Situation {
  id: number;
  text: string;
  desc: string;
  icon: JSX.Element;
  modalText: string;
  recommendation: string;
}

export default function Problems() {
  const [selectedTask, setSelectedTask] = useState<Situation | null>(null);

  const situations: Situation[] = [
    { 
      id: 1,
      text: 'Запускаю бренд', 
      desc: 'Проверим и зарегистрируем товарный знак',
      icon: <Store className="w-6 h-6 text-[#1B3F7A]" />,
      modalText: 'Проверим название на уникальность и зарегистрируем товарный знак в Роспатенте. Без регистрации конкурент может занять ваше название первым.',
      recommendation: 'Регистрация товарного знака — от 2 мес.',
    },
    { 
      id: 2,
      text: 'Продаю на маркетплейсе', 
      desc: 'Защитим от блокировок и конкурентов на WB и Ozon',
      icon: <ShoppingBag className="w-6 h-6 text-[#1B3F7A]" />,
      modalText: 'Защитим от блокировок карточек и жалоб конкурентов на WB и Ozon. Товарный знак даёт право подавать жалобы на нарушителей.',
      recommendation: 'Регистрация ТЗ + Brand Protection.',
    },
    { 
      id: 3,
      text: 'Разработал продукт или упаковку', 
      desc: 'Оформим патент или промышленный образец',
      icon: <Box className="w-6 h-6 text-[#1B3F7A]" />,
      modalText: 'Оформим патент на изобретение или промышленный образец на дизайн. Защита действует 20 лет для патента и 25 лет для образца.',
      recommendation: 'Патент или промышленный образец.',
    },
    { 
      id: 4,
      text: 'Создал приложение или IT-сервис', 
      desc: 'Зарегистрируем ПО и защитим права на код',
      icon: <Terminal className="w-6 h-6 text-[#1B3F7A]" />,
      modalText: 'Зарегистрируем программу ЭВМ в Роспатенте, проведём аудит договоров с разработчиками. Без регистрации права на код могут остаться у фрилансера.',
      recommendation: 'Регистрация программы ЭВМ.',
    },
    { 
      id: 5,
      text: 'Хочу оформить права на дизайн', 
      desc: 'Депонируем и защитим авторские права',
      icon: <Palette className="w-6 h-6 text-[#1B3F7A]" />,
      modalText: 'Депонируем и защитим авторские права на логотип, сайт, контент. Оплата дизайнеру НЕ означает передачу прав — нужен договор.',
      recommendation: 'Защита авторских прав.',
    },
    { 
      id: 6,
      text: 'Получил претензию', 
      desc: 'Проанализируем и подготовим ответ на претензию',
      icon: <ShieldAlert className="w-6 h-6 text-[#1B3F7A]" />,
      modalText: 'Проверим основания претензии и подготовим профессиональный ответ. В 40% случаев претензии можно оспорить.',
      recommendation: 'Оспаривание и защита при нарушениях.',
    },
    { 
      id: 7,
      text: 'Планирую выход за рубеж', 
      desc: 'Международная регистрация по Мадридской системе',
      icon: <Globe className="w-6 h-6 text-[#1B3F7A]" />,
      modalText: 'Зарегистрируем бренд в нужных странах по Мадридской системе — одна заявка для 130 стран. Срок: 18-24 мес.',
      recommendation: 'Международная регистрация.',
    },
  ];

  const handleDiscuss = () => {
    setSelectedTask(null);
    document.getElementById('task-input')?.setAttribute('value', `Интересует: ${selectedTask?.text}`);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="tasks" className="py-24 bg-[#F8F9FA] border-t border-[#F3F4F6] relative overflow-hidden animate-on-scroll">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">Навигация по задачам</div>
          <h2 className="text-3xl md:text-4xl font-black text-[#1B3F7A] mb-0">С какой задачей вы пришли?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {situations.map((sit) => (
             <div 
              key={sit.id}
              onClick={() => setSelectedTask(sit)}
              className="group cursor-pointer rounded-2xl p-6 bg-white transition-all flex flex-col justify-between"
              style={{
                border: '1.5px solid #E5E7EB',
                minHeight: '180px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C8A028';
                e.currentTarget.style.backgroundColor = '#FFFBF0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
             >
               <div className="w-10 h-10 rounded-full bg-[#EEF3FB] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                 {sit.icon}
               </div>
               
               <div className="mt-auto">
                 <h3 className="text-lg font-bold text-[#1F2937] leading-tight mb-2">{sit.text}</h3>
                 <p className="text-sm text-[#6B7280] leading-snug">{sit.desc}</p>
               </div>
             </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)}>
        {selectedTask && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#1B3F7A]">{selectedTask.text}</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{selectedTask.modalText}</p>
            <div className="bg-[#FFFBF0] p-4 rounded-xl border border-[#C8A028]/20">
              <p className="text-[#8A6D16] font-medium"><span className="font-bold">Рекомендация:</span> {selectedTask.recommendation}</p>
            </div>
            <button
              onClick={handleDiscuss}
              className="w-full py-4 bg-[#1B3F7A] text-white rounded-xl font-bold text-lg hover:bg-[#153260] transition-colors"
            >
              Обсудить задачу
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
}
