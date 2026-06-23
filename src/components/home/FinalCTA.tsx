import { useData } from '../../store/DataContext';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FinalCTA() {
  const { state, addLead } = useData();
  const [taskType, setTaskType] = useState('universal');
  const [formData, setFormData] = useState({ 
    name: '', 
    contact: '', 
    task: '',
    brandName: '',
    businessType: '',
    hasSales: 'Нет продаж',
    registrationRegion: 'В России',
    productName: '',
    developers: 'Штатные сотрудники',
    hasContracts: 'Да, все оформлены',
    requiredService: 'Регистрация ПО',
    disputeEssence: '',
    deadline: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleFillForm = (e: CustomEvent) => {
      if (e.detail && e.detail.task) {
        setTaskType('universal');
        setFormData(prev => ({ ...prev, task: e.detail.task }));
      }
    };
    window.addEventListener('fill-contact-form', handleFillForm as EventListener);
    return () => window.removeEventListener('fill-contact-form', handleFillForm as EventListener);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let constructedTask = formData.task;
    if (taskType === 'tm') {
      constructedTask = `[Товарный знак] Бренд: ${formData.brandName}. Деятельность: ${formData.businessType}. Продажи: ${formData.hasSales}. Регион: ${formData.registrationRegion}. ${formData.task}`;
    } else if (taskType === 'it') {
      constructedTask = `[IT/ПО] Продукт: ${formData.productName}. Разработчики: ${formData.developers}. Договоры: ${formData.hasContracts}. Требуется: ${formData.requiredService}. ${formData.task}`;
    } else if (taskType === 'dispute') {
      constructedTask = `[Споры] Ситуация: ${formData.disputeEssence}. Дедлайн: ${formData.deadline}. ${formData.task}`;
    }

    const typeMap: Record<string, string> = {
      'tm': 'Товарные знаки',
      'it': 'IT и ПО',
      'dispute': 'Споры',
      'universal': 'Консультация'
    };

    addLead({ 
      name: formData.name, 
      contact: formData.contact, 
      task: constructedTask, 
      type: typeMap[taskType] || 'Консультация',
      source: 'Главная страница', 
      status: 'new', 
      comment: '' 
    });
    
    setIsSubmitted(true);
    setFormData({ 
      name: '', 
      contact: '', 
      task: '',
      brandName: '',
      businessType: '',
      hasSales: 'Нет продаж',
      registrationRegion: 'В России',
      productName: '',
      developers: 'Штатные сотрудники',
      hasContracts: 'Да, все оформлены',
      requiredService: 'Регистрация ПО',
      disputeEssence: '',
      deadline: ''
    });
  };

  return (
    <section id="contact" className="py-24 bg-[#FFF8E8] relative overflow-hidden border-t border-[#F3F4F6]">
      {/* Abstract dark blue & neon patterns for background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3B82F6]/15 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2 text-[#1F2937] animate-on-scroll">
            <div className="inline-flex items-center space-x-2 text-[#3B82F6] font-bold tracking-widest uppercase text-xs mb-6 bg-[#3B82F6]/5 px-4 py-2 rounded-xl border border-[#3B82F6]/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <span>Начать работу</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight text-[#1B3F7A]">
              {state.content?.ctaTitle || "Готовы обсудить вашу задачу?"}
            </h2>
            <p className="text-xl text-[#6B7280] mb-10 leading-relaxed max-w-lg">
              {state.content?.ctaSubtitle || "Оставьте заявку. Мы свяжемся с вами в течение рабочего дня, проведем первичный анализ и предложим варианты действий."}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#3B82F6]/20 shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center justify-center mr-5 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all">
                  <ShieldCheck className="w-7 h-7 text-[#3B82F6]" />
                </div>
                <div>
                  <div className="font-bold text-lg text-[#1B3F7A]">Персональный разбор</div>
                  <div className="text-sm text-[#6B7280]">Анализируем риски именно вашего проекта</div>
                </div>
              </div>
              <div className="flex items-center group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#3B82F6]/20 shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center justify-center mr-5 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all">
                  <Lock className="w-7 h-7 text-[#3B82F6]" />
                </div>
                <div>
                  <div className="font-bold text-lg text-[#1B3F7A]">Строгая конфиденциальность</div>
                  <div className="text-sm text-[#6B7280]">Гарантируем неразглашение коммерческой тайны</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full animate-on-scroll stagger-2">
            <div className="bg-white/80 border border-[#3B82F6]/30 rounded-[32px] shadow-[0_0_50px_rgba(59,130,246,0.15),inset_0_0_20px_rgba(59,130,246,0.05)] p-8 md:p-10 relative overflow-hidden backdrop-blur-xl">
               {/* Tech Neon Inner Glow */}
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1)_0%,transparent_60%)] pointer-events-none"></div>
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-50"></div>

              {isSubmitted ? (
                <div className="text-center py-16 relative z-10">
                  <div className="w-24 h-24 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <CheckCircle2 className="w-12 h-12 text-[#3B82F6]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#1B3F7A] mb-3">Заявка принята</h3>
                  <p className="text-[#6B7280] font-medium">Мы свяжемся с вами в ближайшее время!</p>
                  <button onClick={() => setIsSubmitted(false)} className="mt-8 text-[#3B82F6] hover:text-[#1B3F7A] hover:bg-[#3B82F6]/5 px-6 py-3 rounded-full font-bold transition-all border border-[#3B82F6]/20">
                    Отправить еще одну
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <h3 className="text-2xl font-black text-[#1B3F7A] mb-8">Свяжитесь со мной</h3>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#1F2937] mb-2">
                      Тип обращения
                    </label>
                    <select
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value)}
                      className="w-full px-5 py-4 bg-white/50 border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50 outline-none transition-all shadow-inner text-[#1F2937] font-medium"
                    >
                      <option value="tm">Регистрация товарного знака</option>
                      <option value="it">Защита IT-решений и ПО</option>
                      <option value="dispute">Претензии и споры</option>
                      <option value="universal">Другой вопрос / Консультация</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full px-5 py-4 bg-white/50 border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50 outline-none transition-all placeholder:text-[#9CA3AF] shadow-inner"
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
                        className="w-full px-5 py-4 bg-white/50 border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50 outline-none transition-all placeholder:text-[#9CA3AF] shadow-inner"
                        placeholder="+7 (999) 000-00-00"
                      />
                    </div>
                  </div>

                  {taskType === 'tm' && (
                    <div className="space-y-6 bg-white/40 p-5 rounded-2xl border border-[#3B82F6]/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-[#1F2937] mb-2">Название бренда</label>
                          <input type="text" required value={formData.brandName} onChange={(e) => setFormData({...formData, brandName: e.target.value})} className="w-full px-5 py-3 bg-white border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 outline-none shadow-inner" placeholder="Мой Бренд" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#1F2937] mb-2">Чем занимается бизнес</label>
                          <input type="text" required value={formData.businessType} onChange={(e) => setFormData({...formData, businessType: e.target.value})} className="w-full px-5 py-3 bg-white border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 outline-none shadow-inner" placeholder="Производство одежды" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-[#1F2937] mb-2">Есть ли уже продажи?</label>
                          <select value={formData.hasSales} onChange={(e) => setFormData({...formData, hasSales: e.target.value})} className="w-full px-5 py-3 bg-white border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 outline-none shadow-inner text-[#1F2937]">
                            <option value="Нет продаж">Пока только планируем</option>
                            <option value="Да, недавно начали">Да, недавно начали</option>
                            <option value="Да, давно на рынке">Да, давно на рынке</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#1F2937] mb-2">Регион регистрации</label>
                          <select value={formData.registrationRegion} onChange={(e) => setFormData({...formData, registrationRegion: e.target.value})} className="w-full px-5 py-3 bg-white border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 outline-none shadow-inner text-[#1F2937]">
                            <option value="В России">Только в России</option>
                            <option value="Выход за рубеж">Планируем выход за рубеж</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {taskType === 'it' && (
                    <div className="space-y-6 bg-white/40 p-5 rounded-2xl border border-[#3B82F6]/10">
                      <div>
                        <label className="block text-sm font-bold text-[#1F2937] mb-2">Название продукта / сервиса</label>
                        <input type="text" required value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} className="w-full px-5 py-3 bg-white border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 outline-none shadow-inner" placeholder="Мобильное приложение / CRM" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-[#1F2937] mb-2">Кто разрабатывал?</label>
                          <select value={formData.developers} onChange={(e) => setFormData({...formData, developers: e.target.value})} className="w-full px-5 py-3 bg-white border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 outline-none shadow-inner text-[#1F2937]">
                            <option value="Штатные сотрудники">Штатные сотрудники</option>
                            <option value="Фрилансеры / Подрядчики">Фрилансеры / Подрядчики</option>
                            <option value="Сам руководитель">Сам руководитель</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#1F2937] mb-2">Есть ли договоры?</label>
                          <select value={formData.hasContracts} onChange={(e) => setFormData({...formData, hasContracts: e.target.value})} className="w-full px-5 py-3 bg-white border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 outline-none shadow-inner text-[#1F2937]">
                            <option value="Да, все оформлены">Да, всё оформлено</option>
                            <option value="Частично">Частично</option>
                            <option value="Нет договоров">Нет, работали на доверии</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#1F2937] mb-2">Что требуется?</label>
                        <select value={formData.requiredService} onChange={(e) => setFormData({...formData, requiredService: e.target.value})} className="w-full px-5 py-3 bg-white border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 outline-none shadow-inner text-[#1F2937]">
                          <option value="Регистрация ПО">Зарегистрировать программу (получить свидетельство)</option>
                          <option value="Аудит прав">Аудит договоров и передача прав</option>
                          <option value="Все вместе">И то, и другое</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {taskType === 'dispute' && (
                    <div className="space-y-6 bg-white/40 p-5 rounded-2xl border border-[#3B82F6]/10">
                      <div>
                        <label className="block text-sm font-bold text-[#1F2937] mb-2">Суть ситуации</label>
                        <textarea required value={formData.disputeEssence} onChange={(e) => setFormData({...formData, disputeEssence: e.target.value})} rows={2} className="w-full px-5 py-3 bg-white border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 outline-none resize-none shadow-inner" placeholder="Например: Получили претензию на 1 млн рублей от конкурента..."></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#1F2937] mb-2">Сроки (горят ли дедлайны?)</label>
                        <input type="text" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full px-5 py-3 bg-white border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 outline-none shadow-inner" placeholder="Например: Суд назначен на 15 октября / 10 дней на ответ" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="task" className="block text-sm font-bold text-[#1F2937] mb-2">
                       {taskType === 'universal' ? 'Коротко о задаче' : 'Дополнительные комментарии (опционально)'}
                    </label>
                    <textarea
                      id="task"
                      rows={taskType === 'universal' ? 3 : 2}
                      required={taskType === 'universal'}
                      value={formData.task}
                      onChange={(e) => setFormData({...formData, task: e.target.value})}
                      className="w-full px-5 py-4 bg-white/50 border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50 outline-none transition-all resize-none placeholder:text-[#9CA3AF] shadow-inner"
                      placeholder="Любые другие детали..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#3B82F6] text-white font-bold py-4 rounded-xl hover:bg-[#2563EB] transition-all shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.6)] flex justify-center items-center group cursor-pointer hover:-translate-y-1"
                  >
                    <span>Получить консультацию</span>
                    <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform drop-shadow-sm" />
                  </button>
                  
                  <div className="flex items-start mt-6 bg-[#3B82F6]/5 p-4 rounded-xl border border-[#3B82F6]/10">
                    <input id="privacy" type="checkbox" required className="mt-1 flex-shrink-0 bg-white border-[#3B82F6]/30 text-[#3B82F6] focus:ring-[#3B82F6]/50 w-4 h-4 rounded cursor-pointer" />
                    <label htmlFor="privacy" className="ml-3 block text-xs text-[#6B7280] leading-relaxed cursor-pointer font-medium">
                      Нажимая кнопку, вы даете согласие на обработку персональных данных в соответствии с <Link to="/privacy" className="text-[#3B82F6] hover:text-[#1B3F7A] underline transition-colors">Политикой безопасности</Link>.
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
