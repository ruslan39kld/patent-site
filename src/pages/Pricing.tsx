import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowLeft, Search, FileText, Scale, Globe, FileBadge, BookOpen, MessageSquare, Anchor, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../store/DataContext';

export const categories = [
  { id: 'trademarks', title: 'Товарные знаки и НМПТ', icon: FileBadge },
  { id: 'patents', title: 'Изобретения и патенты', icon: FileText },
  { id: 'copyright', title: 'Авторское право', icon: BookOpen },
  { id: 'disputes', title: 'Споры и защита', icon: Scale },
  { id: 'consulting', title: 'Консультации и аудит', icon: MessageSquare },
];

const faqs = [
  {
    q: 'Почему нет фиксированного прайса?',
    a: 'Стоимость зависит от сложности объекта и количества классов МКТУ. Называю цену после бесплатной предварительной оценки.'
  },
  {
    q: 'Что входит в гонорар, а что нет?',
    a: 'Гонорар включает все работы специалиста: поиск, подготовку документов, подачу, переписку с Роспатентом. Госпошлины — отдельная статья расходов.'
  },
  {
    q: 'Как узнать точную стоимость для моей ситуации?',
    a: 'Опишите задачу в форме ниже или напишите в Telegram.'
  },
  {
    q: 'Что если в процессе возникнут дополнительные работы?',
    a: 'Любые дополнительные действия согласовываются и оплачиваются отдельно, клиент уведомляется заранее.'
  },
  {
    q: 'Принимаете ли оплату от юрлиц?',
    a: 'Да, возможна оплата на расчётный счёт по договору с предоставлением всех закрывающих документов.'
  }
];

export default function Pricing() {
  const { state } = useData();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Technological Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#3B82F6]/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1B3F7A]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <Link to="/#pricing" className="inline-flex items-center text-[#1B3F7A] font-bold hover:text-[#3B82F6] transition-colors mb-8 group bg-white px-5 py-2.5 rounded-xl border border-[#3B82F6]/20 shadow-[0_4px_15px_rgba(59,130,246,0.1)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.2)]">
          <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" /> Вернуться на главную
        </Link>
        
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16 relative">
             <div className="inline-flex items-center space-x-2 text-[#3B82F6] font-bold tracking-widest uppercase text-xs mb-6 bg-[#3B82F6]/10 px-4 py-2 rounded-lg border border-[#3B82F6]/20">
               <Info className="w-4 h-4" />
               <span>Официальные тарифы (по сост. на 2024 г.)</span>
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1B3F7A] mb-6 tracking-tight">Виды и стоимость услуг</h1>
             <p className="text-2xl text-[#C8A028] font-bold mb-8">Патентный поверенный РФ №1588</p>
             <p className="text-xl text-[#6B7280] font-medium max-w-3xl mx-auto leading-relaxed">
               Детальный прайс-лист в области интеллектуальной собственности. Итоговая стоимость зависит от задачи. <br/> <strong className="text-[#3B82F6]">Первичная оценка — бесплатно.</strong>
             </p>
          </div>

          {/* Sticky Navigation */}
          <div className="sticky top-4 z-50 mb-16 bg-white/80 backdrop-blur-xl border border-[#E5E7EB] rounded-3xl p-3 shadow-[0_10px_30px_rgba(27,63,122,0.08)] hidden md:block">
            <div className="flex justify-between items-center space-x-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => scrollToSection(cat.id)}
                    className="flex items-center flex-1 justify-center space-x-2 px-4 py-3 rounded-2xl hover:bg-[#EEF3FB] text-[#1F2937] hover:text-[#3B82F6] transition-all font-bold text-sm tracking-wide"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 md:hidden">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollToSection(cat.id)}
                  className="flex items-center justify-between px-6 py-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm hover:border-[#3B82F6]/50 text-[#1F2937] hover:text-[#3B82F6] font-bold transition-all"
                >
                  <span className="flex items-center space-x-3"><Icon className="w-5 h-5" /> <span>{cat.title}</span></span>
                  <ChevronDown className="w-5 h-5 -rotate-90" />
                </button>
              )
            })}
          </div>

          <div className="space-y-16 mb-24">
            {categories.map((category) => {
               const items = state.prices.filter(p => p.categoryId === category.id);
               if (items.length === 0) return null;
               
               return (
                 <div key={category.id} id={`section-${category.id}`} className="scroll-mt-28 group/section">
                    <div className="flex items-center space-x-4 mb-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1B3F7A] shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center shrink-0">
                         <category.icon className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-[#1B3F7A]">{category.title}</h2>
                    </div>

                    <div className="bg-white rounded-[32px] overflow-hidden border border-[#1B3F7A]/10 shadow-[0_10px_40px_rgba(27,63,122,0.04)] relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/0 to-[#3B82F6]/5 pointer-events-none opacity-0 group-hover/section:opacity-100 transition-opacity duration-700"></div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                          <thead>
                            <tr className="bg-[#EEF3FB]/50 border-b border-[#E5E7EB]">
                              <th className="py-6 px-8 font-bold text-[#1B3F7A] text-[15px] uppercase tracking-wider w-3/5">Вид услуги</th>
                              <th className="py-6 px-8 font-bold text-[#1B3F7A] text-[15px] uppercase tracking-wider w-1/5">Гонорар</th>
                              <th className="py-6 px-8 font-bold text-[#1B3F7A] text-[15px] uppercase tracking-wider w-1/5">Госпошлина</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item, idx) => (
                              <tr key={idx} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#EEF3FB]/30 transition-colors group/row">
                                <td className="py-6 px-8 font-bold text-[#1F2937] text-lg leading-snug group-hover/row:text-[#3B82F6] transition-colors">{item.name}</td>
                                <td className="py-6 px-8 font-black text-[#1B3F7A] text-lg whitespace-nowrap">{item.price}</td>
                                <td className="py-6 px-8 text-[#6B7280] font-medium">{item.tax}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                 </div>
               )
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-24">
             <div>
                <h2 className="text-3xl font-black text-[#1B3F7A] mb-8">Частые вопросы</h2>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <div 
                      key={i} 
                      className={`rounded-2xl border transition-all duration-300 ${openFaqIndex === i ? 'bg-white shadow-[0_10px_30px_rgba(59,130,246,0.1)] border-[#3B82F6]/40' : 'bg-white border-[#E5E7EB] hover:border-[#3B82F6]/20 shadow-sm'}`}
                    >
                      <button 
                         className="w-full text-left px-8 py-6 flex items-start justify-between outline-none focus:outline-none"
                         onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                      >
                        <span className="font-bold text-lg text-[#1B3F7A] pr-4 leading-snug">{faq.q}</span>
                        <ChevronDown className={`w-6 h-6 text-[#3B82F6] shrink-0 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                      </button>
                      {openFaqIndex === i && (
                        <div 
                          className="px-8 pb-8 text-[#6B7280] font-medium leading-relaxed text-base border-t border-gray-100 mt-2 pt-6 prose prose-sm max-w-none text-inherit prose-p:my-1" 
                          dangerouslySetInnerHTML={{ __html: faq.a }} 
                        />
                      )}
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-gradient-to-br from-[#1B3F7A] to-[#0A1A3A] rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_rgba(27,63,122,0.4)] relative overflow-hidden text-white">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 p-32 bg-[#3B82F6] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-4">Предварительная оценка</h2>
                  <p className="text-[#93C5FD] mb-10 text-lg font-medium leading-relaxed">Оставьте контакты и вкратце опишите объект — я проведу индивидуальный расчет стоимости без обязательств.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Ваше имя" 
                        required 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-[#C8A028] text-white placeholder-white/50 backdrop-blur-sm font-medium"
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Телефон / Telegram" 
                        required 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-[#C8A028] text-white placeholder-white/50 backdrop-blur-sm font-medium"
                      />
                    </div>
                    <div>
                      <textarea 
                        placeholder="Краткое описание задачи..." 
                        rows={3}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-[#C8A028] resize-none text-white placeholder-white/50 backdrop-blur-sm font-medium"
                      ></textarea>
                    </div>
                    <button type="submit" className="w-full bg-[#C8A028] text-[#1B3F7A] font-bold text-lg py-5 rounded-xl hover:bg-white transition-colors shadow-[0_0_20px_rgba(200,160,40,0.4)]">
                      Получить расчет стоимости
                    </button>
                  </form>
                </div>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

