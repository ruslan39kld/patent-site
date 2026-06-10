import { Link } from 'react-router-dom';
import { ArrowRight, Calculator } from 'lucide-react';

export default function PricingHomeBlock() {
  const prices = [
    { title: 'Регистрация ТЗ (Россия)', price: 'от 30 000 руб.', time: '12-18 мес.' },
    { title: 'Международная регистрация', price: 'от 50 000 руб.', time: '18-24 мес.' },
    { title: 'Патент на изобретение', price: 'от 65 000 руб.', time: '18-36 мес.' },
    { title: 'Патент на полезную модель', price: 'от 55 000 руб.', time: '6-12 мес.' },
    { title: 'Промышленный образец', price: 'от 45 000 руб.', time: '8-18 мес.' },
    { title: 'Регистрация программы ЭВМ', price: 'от 20 000 руб.', time: '1-3 мес.' },
    { title: 'Аудит прав и договоры', price: 'от 25 000 руб.', time: 'по согл.' },
    { title: 'Оспаривание / защита (ФАС, Суд)', price: 'от 40 000 руб.', time: 'по согл.' },
  ];

  return (
    <section id="pricing" className="py-20 bg-primary/5 border-y border-gray/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray/5 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          <div className="flex-1">
            <div className="inline-flex items-center space-x-2 text-accent font-bold tracking-widest uppercase text-xs mb-6">
               <Calculator className="w-4 h-4" />
               <span>Прозрачные условия</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 tracking-tight">Сколько стоят услуги?</h2>
            <p className="text-lg text-ink/80 mb-6 leading-relaxed">
              Мои гонорары фиксируются прозрачно до начала работ. Итоговая сумма зависит от:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
               <li className="flex items-center font-medium"><div className="w-2 h-2 rounded-full bg-accent mr-3"></div>Сложности объекта</li>
               <li className="flex items-center font-medium"><div className="w-2 h-2 rounded-full bg-accent mr-3"></div>Количества классов (МКТУ)</li>
               <li className="flex items-center font-medium"><div className="w-2 h-2 rounded-full bg-accent mr-3"></div>Региона регистрации</li>
               <li className="flex items-center font-medium"><div className="w-2 h-2 rounded-full bg-accent mr-3"></div>Наличия препятствий</li>
            </ul>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link 
              to="/pricing"
              className="inline-flex items-center justify-center w-full md:w-auto bg-primary hover:bg-secondary text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 focus:outline-none"
            >
              Подробнее о стоимости <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
