import { ArrowUpRight, Scale, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../store/DataContext';

export default function Footer() {
  const { state } = useData();

  const scrollTo = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="bg-[#1F2937] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Scale className="h-8 w-8 text-[#C8A028]" />
              <span className="font-bold text-xl uppercase tracking-wider text-white">Виктория<span className="text-[#6B7280]"> Тарасова</span></span>
            </div>
            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
              Патентный поверенный РФ №1558.<br/>
              Надежная защита интеллектуальной собственности и IT-продуктов для бизнеса.
            </p>
            <div className="flex space-x-4">
               {/* Social placeholders */}
               <a href={state.content.telegram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#374151] flex items-center justify-center hover:bg-[#C8A028] transition-colors">
                 <span className="text-xs font-bold">TG</span>
               </a>
               <a href={state.content.whatsapp} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#374151] flex items-center justify-center hover:bg-[#C8A028] transition-colors">
                 <span className="text-xs font-bold">WA</span>
               </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Навигация</h4>
            <ul className="space-y-3 pb-2">
              <li><a href="#hero" onClick={(e) => scrollTo('hero', e)} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors inline-block">Главная</a></li>
              <li><a href="#services" onClick={(e) => scrollTo('services', e)} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors inline-block">Услуги</a></li>
              <li><a href="#cases" onClick={(e) => scrollTo('cases', e)} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors inline-block">Практика</a></li>
              <li><a href="#about" onClick={(e) => scrollTo('about', e)} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors inline-block">Об эксперте</a></li>
              <li><a href="#blog" onClick={(e) => scrollTo('blog', e)} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors inline-block">Блог</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Услуги</h4>
            <ul className="space-y-3 pb-2">
              <li><a href="#services" onClick={(e) => scrollTo('services', e)} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors inline-block">Регистрация товарного знака</a></li>
              <li><a href="#services" onClick={(e) => scrollTo('services', e)} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors inline-block">Защита IT-продуктов</a></li>
              <li><a href="#services" onClick={(e) => scrollTo('services', e)} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors inline-block">Патентование решений</a></li>
              <li><a href="#services" onClick={(e) => scrollTo('services', e)} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors inline-block">Международная защита</a></li>
              <li><a href="#services" onClick={(e) => scrollTo('services', e)} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors inline-block">Представительство в суде</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Контакты</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-[#C8A028] mr-3 mt-0.5 shrink-0" />
                <a href={`tel:${state.content.phone.replace(/[^+\d]/g, '')}`} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors font-bold">{state.content.phone}</a>
              </li>
              <li className="flex items-start">
                 <Mail className="w-5 h-5 text-[#C8A028] mr-3 mt-0.5 shrink-0" />
                 <a href={`mailto:${state.content.email}`} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors">{state.content.email}</a>
              </li>
              <li className="flex items-start">
                 <MapPin className="w-5 h-5 text-[#C8A028] mr-3 mt-0.5 shrink-0" />
                 <span className="text-[#D1D5DB]">Работаем дистанционно по всей России и СНГ</span>
              </li>
            </ul>
            <button 
              onClick={(e) => scrollTo('contact', e)}
              className="mt-8 flex items-center text-[#C8A028] font-bold hover:text-white transition-colors group"
            >
              Обсудить задачу
              <ArrowUpRight className="ml-1 w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="border-t border-[#374151] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#9CA3AF]">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Виктория Тарасова. Все права защищены.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-[#C8A028] transition-colors">Политика конфиденциальности</Link>
            <Link to="/admin" className="hover:text-[#C8A028] transition-colors opacity-50">Панель управления</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
