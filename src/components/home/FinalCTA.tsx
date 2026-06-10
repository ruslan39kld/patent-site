import { useData } from '../../store/DataContext';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FinalCTA() {
  const { addLead } = useData();
  const [formData, setFormData] = useState({ name: '', contact: '', task: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleFillForm = (e: CustomEvent) => {
      if (e.detail && e.detail.task) {
        setFormData(prev => ({ ...prev, task: e.detail.task }));
      }
    };
    window.addEventListener('fill-contact-form', handleFillForm as EventListener);
    return () => window.removeEventListener('fill-contact-form', handleFillForm as EventListener);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({ ...formData, source: 'Главная страница', status: 'new', comment: '' });
    setIsSubmitted(true);
    setFormData({ name: '', contact: '', task: '' });
  };

  return (
    <section id="contact" className="py-24 bg-[#1B3F7A] relative overflow-hidden">
      {/* Abstract dark blue patterns for background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#153265] rounded-l-[100px] opacity-50 transform translate-x-1/3"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#2960B0] rounded-full opacity-20 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2 text-white animate-on-scroll">
            <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-4">Начать работу</div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Готовы обсудить вашу задачу?</h2>
            <p className="text-xl text-[#9CA3AF] mb-10 leading-relaxed max-w-lg">
              Оставьте заявку. Мы свяжемся с вами в течение рабочего дня, проведем первичный анализ и предложим варианты действий.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#153265] flex items-center justify-center mr-4">
                  <ShieldCheck className="w-6 h-6 text-[#C8A028]" />
                </div>
                <div>
                  <div className="font-bold">Персональный разбор</div>
                  <div className="text-sm text-[#9CA3AF]">Анализируем риски именно вашего проекта</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#153265] flex items-center justify-center mr-4">
                  <Lock className="w-6 h-6 text-[#C8A028]" />
                </div>
                <div>
                  <div className="font-bold">Строгая конфиденциальность</div>
                  <div className="text-sm text-[#9CA3AF]">Гарантируем неразглашение коммерческой тайны</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full animate-on-scroll stagger-2">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              {isSubmitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-[#EEF3FB] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-[#0F6E56]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1B3F7A] mb-2">Заявка принята</h3>
                  <p className="text-[#6B7280]">Мы свяжемся с вами в ближайшее время!</p>
                  <button onClick={() => setIsSubmitted(false)} className="mt-8 text-[#1B3F7A] hover:text-[#C8A028] font-bold underline">
                    Отправить еще одну
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-bold text-[#1B3F7A] mb-8">Свяжитесь со мной</h3>
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-[#1F2937] mb-2">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#1B3F7A] focus:border-transparent outline-none transition-all placeholder:text-[#9CA3AF]"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contact_field" className="block text-sm font-bold text-[#1F2937] mb-2">
                      Телефон или мессенджер
                    </label>
                    <input
                      type="text"
                      id="contact_field"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#1B3F7A] focus:border-transparent outline-none transition-all placeholder:text-[#9CA3AF]"
                      placeholder="+7 (999) 000-00-00"
                    />
                  </div>

                  <div>
                    <label htmlFor="task" className="block text-sm font-bold text-[#1F2937] mb-2">
                      Коротко о задаче
                    </label>
                    <textarea
                      id="task"
                      rows={3}
                      required
                      value={formData.task}
                      onChange={(e) => setFormData({...formData, task: e.target.value})}
                      className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#1B3F7A] focus:border-transparent outline-none transition-all resize-none placeholder:text-[#9CA3AF]"
                      placeholder="Например: нужно зарегистрировать товарный знак..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#C8A028] text-white font-bold py-4 rounded-xl hover:bg-[#b08d23] transition-colors shadow-lg flex justify-center items-center group cursor-pointer"
                  >
                    Получить консультацию
                    <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                  
                  <div className="flex items-start mt-4">
                    <input id="privacy" type="checkbox" required className="mt-1 bg-white border-[#E5E7EB] text-[#1B3F7A] focus:ring-[#1B3F7A] w-4 h-4 rounded shrink-0 cursor-pointer" />
                    <label htmlFor="privacy" className="ml-2 block text-xs text-[#9CA3AF] leading-relaxed cursor-pointer">
                      Нажимая кнопку, вы даете согласие на обработку персональных данных в соответствии с <Link to="/privacy" className="underline hover:text-[#1B3F7A]">Политикой конфиденциальности</Link>.
                    </label>
                  </div>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
