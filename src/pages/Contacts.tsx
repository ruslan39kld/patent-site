import { useData } from '../store/DataContext';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn, formatPhone } from '../lib/utils';

export default function Contacts() {
  const { state, addLead } = useData();
  const [activeForm, setActiveForm] = useState<'general' | 'tm' | 'it' | 'dispute'>('general');
  const [formData, setFormData] = useState({ 
     name: '', 
     contact: '', 
     task: '', 
     brand: '', 
     business: '', 
     sales: '', 
     geo: '', 
     product: '', 
     dev: '', 
     contracts: '', 
     disputeType: '', 
     deadline: '' 
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let taskDesc = formData.task;
    
    if (activeForm === 'tm') {
       taskDesc = `ТЗ: Бренд "${formData.brand}", Бизнес: ${formData.business}, Продажи: ${formData.sales}, Гео: ${formData.geo}`;
    } else if (activeForm === 'it') {
       taskDesc = `IT: Продукт "${formData.product}", Разработчик: ${formData.dev}, Договоры: ${formData.contracts}, Задача: ${formData.task}`;
    } else if (activeForm === 'dispute') {
       taskDesc = `Спор: Ситуация "${formData.disputeType}", Дедлайн: ${formData.deadline}`;
    }

    addLead({
       name: formData.name || 'Без имени',
       contact: formData.contact,
       task: taskDesc,
       source: `Страница контактов / Форма: ${activeForm}`,
       status: 'new',
       comment: ''
    });
    
    setIsSubmitted(true);
  };

  const formTypes = [
     { id: 'general', label: 'Общий вопрос' },
     { id: 'tm', label: 'Защита бренда' },
     { id: 'it', label: 'IT и программы' },
     { id: 'dispute', label: 'Спор / Претензия' }
  ];

  return (
    <div className="bg-cream min-h-screen">
      <section className="pt-20 pb-16 bg-white border-b border-gray/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/10 -skew-x-12 transform translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Контакты</h1>
          <p className="text-xl text-ink/80 leading-relaxed max-w-2xl">
            Свяжитесь со мной напрямую удобным для вас способом или оставьте заявку через форму — я отвечу в течение рабочего дня.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-8">
               <div className="bg-primary text-white rounded-2xl p-8 lg:p-10 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-bl-full opacity-50"></div>
                  
                  <div className="space-y-8 relative z-10">
                     <div className="flex items-start">
                        <Phone className="w-6 h-6 text-accent mt-1 mr-4 shrink-0" />
                        <div>
                           <div className="text-sm text-white/70 mb-1">Телефон</div>
                           <a href={`tel:${state.content.phone.replace(/[^+\d]/g, '')}`} className="text-2xl font-bold hover:text-accent transition-colors block">{formatPhone(state.content.phone)}</a>
                        </div>
                     </div>
                     
                     <div className="flex items-start">
                        <Mail className="w-6 h-6 text-accent mt-1 mr-4 shrink-0" />
                        <div>
                           <div className="text-sm text-white/70 mb-1">Email</div>
                           <a href={`mailto:${state.content.email}`} className="text-xl font-bold hover:text-accent transition-colors">{state.content.email}</a>
                        </div>
                     </div>
                     
                     <div className="flex items-start">
                        <Clock className="w-6 h-6 text-accent mt-1 mr-4 shrink-0" />
                        <div>
                           <div className="text-sm text-white/70 mb-1">Время ответа</div>
                           <div className="text-lg font-bold">Пн-Пт: 10:00 - 19:00 (МСК)</div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-white/10 flex gap-4 relative z-10">
                     <a href={state.content.whatsapp} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-opacity">
                        <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                     </a>
                     <a href={state.content.telegram} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#2AABEE] hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-opacity">
                        <Send className="w-5 h-5 mr-2" /> Telegram
                     </a>
                  </div>
               </div>
               
               <div className="bg-white rounded-2xl p-8 border border-gray/10 shadow-sm">
                  <div className="flex items-start mb-4">
                     <MapPin className="w-6 h-6 text-primary mt-1 mr-4 shrink-0" />
                     <div>
                        <h3 className="font-bold text-primary text-xl mb-2">Работаю по всей РФ</h3>
                        <p className="text-ink/80 leading-relaxed">
                          Для оказания услуг патентного поверенного личная встреча не требуется. Всё взаимодействие с клиентами и Роспатентом происходит через защищенные электронные каналы связи.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Forms */}
            <div className="lg:col-span-7">
               <div className="bg-white rounded-2xl p-8 lg:p-12 border border-gray/10 shadow-lg">
                 {isSubmitted ? (
                    <div className="text-center py-16">
                       <div className="w-24 h-24 bg-gold-bg rounded-full flex items-center justify-center mx-auto mb-6">
                         <Send className="w-10 h-10 text-accent" />
                       </div>
                       <h3 className="text-3xl font-bold text-primary mb-4">Заявка успешно отправлена</h3>
                       <p className="text-ink/80 text-lg mb-8 max-w-md mx-auto">
                         Спасибо за обращение. Я внимательно изучу вашу задачу и свяжусь с вами в ближайшее время по указанным контактам.
                       </p>
                       <button 
                         onClick={() => { setIsSubmitted(false); setFormData({name:'', contact:'', task:'', brand:'', business:'', sales:'', geo:'', product:'', dev:'', contracts:'', disputeType:'', deadline:''}); }}
                         className="text-primary font-bold hover:text-accent underline underline-offset-4 transition-colors"
                       >
                         Отправить еще одно сообщение
                       </button>
                    </div>
                 ) : (
                    <>
                       <h2 className="text-2xl font-bold text-primary mb-6">Описать задачу подробно</h2>
                       
                       <div className="flex flex-wrap gap-2 mb-8 bg-cream p-1 rounded-xl w-fit">
                         {formTypes.map(t => (
                           <button
                             key={t.id}
                             type="button"
                             onClick={() => setActiveForm(t.id as any)}
                             className={cn(
                               "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                               activeForm === t.id ? "bg-white text-primary shadow-sm" : "text-gray hover:text-primary"
                             )}
                           >
                             {t.label}
                           </button>
                         ))}
                       </div>
                       
                       <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                               <label className="block text-sm font-bold text-ink mb-1">Ваше имя</label>
                               <input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all" />
                             </div>
                             <div>
                               <label className="block text-sm font-bold text-ink mb-1">Телефон / Telegram</label>
                               <input type="text" required value={formData.contact} onChange={e=>setFormData({...formData, contact: e.target.value})} className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all" />
                             </div>
                          </div>
                          
                          {/* General Form */}
                          {activeForm === 'general' && (
                             <div>
                               <label className="block text-sm font-bold text-ink mb-1">Описание задачи</label>
                               <textarea required rows={4} value={formData.task} onChange={e=>setFormData({...formData, task: e.target.value})} className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all resize-none"></textarea>
                             </div>
                          )}
                          
                          {/* Trademark Form */}
                          {activeForm === 'tm' && (
                             <>
                               <div>
                                 <label className="block text-sm font-bold text-ink mb-1">Название бренда / Логотип</label>
                                 <input type="text" required value={formData.brand} onChange={e=>setFormData({...formData, brand: e.target.value})} className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all" />
                               </div>
                               <div>
                                 <label className="block text-sm font-bold text-ink mb-1">Чем занимается бизнес (что продаете)?</label>
                                 <input type="text" required value={formData.business} onChange={e=>setFormData({...formData, business: e.target.value})} className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all" />
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                   <label className="block text-sm font-bold text-ink mb-1">Продажи уже идут?</label>
                                   <select required value={formData.sales} onChange={e=>setFormData({...formData, sales: e.target.value})} className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all">
                                      <option value="">Выберите...</option>
                                      <option value="Да">Да</option>
                                      <option value="Выходим на маркетплейс">Выходим на маркетплейс</option>
                                      <option value="Только планируем">Только планируем</option>
                                   </select>
                                 </div>
                                 <div>
                                   <label className="block text-sm font-bold text-ink mb-1">Где планируется регистрация?</label>
                                   <select required value={formData.geo} onChange={e=>setFormData({...formData, geo: e.target.value})} className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all">
                                      <option value="">Выберите...</option>
                                      <option value="Только РФ">Только РФ</option>
                                      <option value="РФ + СНГ (экспорт)">РФ + СНГ (экспорт)</option>
                                      <option value="Международная">Международная</option>
                                   </select>
                                 </div>
                               </div>
                             </>
                          )}
                          
                          {/* IT Form */}
                          {activeForm === 'it' && (
                             <>
                               <div>
                                 <label className="block text-sm font-bold text-ink mb-1">Название продукта / программы</label>
                                 <input type="text" required value={formData.product} onChange={e=>setFormData({...formData, product: e.target.value})} className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all" />
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                   <label className="block text-sm font-bold text-ink mb-1">Кто разрабатывал?</label>
                                   <select required value={formData.dev} onChange={e=>setFormData({...formData, dev: e.target.value})} className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all">
                                      <option value="">Выберите...</option>
                                      <option value="Штатные сотрудники">Штатные сотрудники</option>
                                      <option value="Фрилансеры / Подрядчики">Фрилансеры / Подрядчики</option>
                                      <option value="Сам написал">Сам написал</option>
                                   </select>
                                 </div>
                                 <div>
                                   <label className="block text-sm font-bold text-ink mb-1">Есть ли договоры?</label>
                                   <select required value={formData.contracts} onChange={e=>setFormData({...formData, contracts: e.target.value})} className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all">
                                      <option value="">Выберите...</option>
                                      <option value="Да, всё оформлено">Да, всё оформлено</option>
                                      <option value="Частично">Частично</option>
                                      <option value="Нет / Не знаю">Нет / Не знаю</option>
                                   </select>
                                 </div>
                               </div>
                               <div>
                                 <label className="block text-sm font-bold text-ink mb-1">Что требуется в итоге?</label>
                                 <textarea required rows={2} value={formData.task} onChange={e=>setFormData({...formData, task: e.target.value})} className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all resize-none"></textarea>
                               </div>
                             </>
                          )}
                          
                          {/* Dispute Form */}
                          {activeForm === 'dispute' && (
                             <>
                               <div>
                                 <label className="block text-sm font-bold text-ink mb-1">Что случилось (суть претензии)?</label>
                                 <textarea required rows={3} value={formData.disputeType} onChange={e=>setFormData({...formData, disputeType: e.target.value})} className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all resize-none" placeholder="Укажите, кто кому предъявляет претензию..."></textarea>
                               </div>
                               <div>
                                 <label className="block text-sm font-bold text-ink mb-1">Когда дедлайн по ответу?</label>
                                 <input type="text" required value={formData.deadline} onChange={e=>setFormData({...formData, deadline: e.target.value})} className="w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="Например: до 15 мая или 'срочно'" />
                               </div>
                             </>
                          )}
                          
                          <div className="pt-4">
                             <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl transition-all text-lg shadow-[0_4px_14px_0_rgba(27,63,122,0.39)] hover:shadow-[0_6px_20px_rgba(27,63,122,0.23)] hover:-translate-y-0.5 mt-2 flex justify-center items-center">
                               Отправить запрос
                             </button>
                             <div className="flex items-start mt-4">
                               <input id="privacy2" type="checkbox" required className="mt-1 bg-white border-gray text-accent focus:ring-accent w-4 h-4 rounded shrink-0 cursor-pointer" />
                               <label htmlFor="privacy2" className="ml-2 block text-xs text-gray/80 leading-relaxed cursor-pointer">
                                 Нажимая кнопку, вы даете согласие на обработку персональных данных в соответствии с <Link to="/privacy" className="underline hover:text-primary">Политикой безопасности</Link>.
                               </label>
                             </div>
                          </div>
                       </form>
                    </>
                 )}
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
