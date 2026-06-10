import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const pricingData = [
  { service: 'Регистрация товарного знака (Россия)', price: 'от 30 000 руб.', tax: 'по тарифу Роспатента', time: '12–18 мес.' },
  { service: 'Международная регистрация (Мадридская система)', price: 'от 50 000 руб.', tax: 'по тарифу ВОИС', time: '18–24 мес.' },
  { service: 'Патент на изобретение', price: 'от 65 000 руб.', tax: 'по тарифу Роспатента', time: '18–36 мес.' },
  { service: 'Патент на полезную модель', price: 'от 55 000 руб.', tax: 'по тарифу Роспатента', time: '6–12 мес.' },
  { service: 'Регистрация промышленного образца', price: 'от 45 000 руб.', tax: 'по тарифу Роспатента', time: '8–18 мес.' },
  { service: 'Регистрация программы ЭВМ / базы данных', price: 'от 20 000 руб.', tax: 'по тарифу Роспатента', time: '1–3 мес.' },
  { service: 'Аудит прав на ПО и договоры с разработчиками', price: 'от 25 000 руб.', tax: '—', time: 'по согласованию' },
  { service: 'Оспаривание товарного знака / защита при претензии', price: 'от 40 000 руб.', tax: '—', time: 'по согласованию' }
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
    a: 'Да, возможна оплата на расчетный счет по договору с предоставлением всех закрывающих документов.'
  }
];

export default function Pricing() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-[#1B3F7A] font-medium hover:text-[#C8A028] transition-colors mb-10">
          <ArrowLeft className="w-5 h-5 mr-2" /> Назад
        </Link>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-[#1B3F7A] mb-4">Стоимость услуг патентного поверенного</h1>
          <p className="text-2xl text-[#C8A028] font-bold mb-8">Первичная оценка — бесплатно</p>
          
          <p className="text-lg text-[#1F2937] leading-relaxed mb-12">
            Итоговая стоимость зависит от сложности объекта, количества классов МКТУ, региона регистрации и наличия препятствий при экспертизе. Я называю цену после бесплатной предварительной оценки.
          </p>

          <div className="bg-[#EEF3FB] rounded-2xl p-6 md:p-8 mb-6 overflow-x-auto shadow-sm">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-[#1B3F7A]/20">
                  <th className="py-4 px-4 font-bold text-[#1B3F7A] text-lg">Услуга</th>
                  <th className="py-4 px-4 font-bold text-[#1B3F7A] text-lg">Гонорар специалиста</th>
                  <th className="py-4 px-4 font-bold text-[#1B3F7A] text-lg">Госпошлины</th>
                  <th className="py-4 px-4 font-bold text-[#1B3F7A] text-lg">Срок</th>
                </tr>
              </thead>
              <tbody>
                {pricingData.map((item, idx) => (
                  <tr key={idx} className="border-b border-[#1B3F7A]/10 last:border-0 hover:bg-white/50 transition-colors">
                    <td className="py-5 px-4 font-medium text-[#1F2937] text-lg leading-tight">{item.service}</td>
                    <td className="py-5 px-4 font-bold text-[#1B3F7A] text-lg whitespace-nowrap">{item.price}</td>
                    <td className="py-5 px-4 text-[#4A5568]">{item.tax}</td>
                    <td className="py-5 px-4 text-[#1F2937] whitespace-nowrap">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="text-sm text-[#4A5568] mb-16 italic">
            * Государственные пошлины оплачиваются заявителем отдельно. Актуальные тарифы — на официальном сайте Роспатента: <a href="https://rospatent.gov.ru" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1B3F7A]">rospatent.gov.ru</a>
          </p>

          <h2 className="text-3xl font-black text-[#1B3F7A] mb-8">Частые вопросы по стоимости</h2>
          <div className="space-y-4 mb-20">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className={`rounded-xl border transition-all ${openFaqIndex === i ? 'bg-white shadow-md border-[#1B3F7A]/20' : 'bg-[#F8F9FA] border-transparent hover:border-[#1B3F7A]/10'}`}
              >
                <button 
                   className="w-full text-left px-6 py-5 flex items-start justify-between outline-none focus:outline-none"
                   onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                >
                  <span className="font-bold text-lg text-[#1B3F7A] pr-4">{faq.q}</span>
                  <ChevronDown className={`w-6 h-6 text-[#C8A028] shrink-0 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaqIndex === i && (
                  <div className="px-6 pb-6 text-[#4A5568] leading-relaxed text-lg">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-[#EEF3FB] rounded-2xl p-8 md:p-12 shadow-sm border border-[#1B3F7A]/10">
             <h2 className="text-3xl font-black text-[#1B3F7A] mb-4 text-center">Узнать стоимость для вашей задачи</h2>
             <p className="text-center text-[#4A5568] mb-8 text-lg">Оставьте контакты и вкратце опишите объект — я проведу предварительную оценку бесплатно.</p>
             
             <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Имя" 
                    required 
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C8A028]"
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Телефон / Telegram" 
                    required 
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C8A028]"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Краткое описание объекта (название бренда, вид продукта и т.п.)" 
                    rows={4}
                    required
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C8A028] resize-none"
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-[#1B3F7A] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#2960B0] transition-colors shadow-lg">
                  Узнать стоимость для вашей задачи
                </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
}
