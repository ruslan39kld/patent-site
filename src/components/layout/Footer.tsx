import React from 'react';
import { ArrowUpRight, Scale, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../store/DataContext';
import { formatPhone } from '../../lib/utils';

export default function Footer() {
  const { state } = useData();

  const scrollTo = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const contactItems = state.content.contactItems?.length ? state.content.contactItems : [
      { id: '1', type: 'phone', label: 'Телефон', shortLabel: '', value: state.content.phone ?? '+7 (915) 130-85-63', isActive: !!state.content.phone },
      { id: '2', type: 'email', label: 'Email (для иностранных заявителей)', shortLabel: '', value: state.content.emailForeign ?? 'tarasovapatentright@yahoo.com', isActive: !!state.content.emailForeign },
      { id: '3', type: 'email', label: 'Email (для РФ)', shortLabel: '', value: state.content.emailRF ?? 'tarasovapatentright@yandex.ru', isActive: !!state.content.emailRF },
      { id: '4', type: 'social', label: 'Telegram', shortLabel: 'TG', value: state.content.telegram ?? 'https://t.me/patent_1558', isActive: !!state.content.telegram },
      { id: '5', type: 'social', label: 'VK', shortLabel: 'VK', value: state.content.vk ?? 'https://vk.com/attorney1558', isActive: !!state.content.vk },
      { id: '6', type: 'social', label: 'MAX', shortLabel: 'MAX', value: state.content.max ?? 'https://max.ru/u/f9LHodD0cOLqx_jhf9LjNAuXN_XcS2_2UCmuGrb33IO7jd_h2nQSnGIPW3E', isActive: !!state.content.max },
      { id: '7', type: 'social', label: 'ST (Stimit)', shortLabel: 'ST', value: state.content.stimit ?? 'https://stimit.ru/', isActive: !!state.content.stimit },
      { id: '8', type: 'social', label: 'WhatsApp', shortLabel: 'WA', value: state.content.whatsapp ? (state.content.whatsapp.startsWith('http') ? state.content.whatsapp : `https://wa.me/${state.content.whatsapp.replace(/[^\d]/g, '')}`) : '', isActive: !!state.content.whatsapp }
  ];

  const activeSocials = contactItems.filter(c => c.type === 'social' && c.isActive);
  const activePhones = contactItems.filter(c => c.type === 'phone' && c.isActive);
  const activeEmails = contactItems.filter(c => c.type === 'email' && c.isActive);

  return (
    <footer className="bg-[#1B3F7A] text-white relative overflow-hidden w-full">
      {/* Neon Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3B82F6]/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              {state.content?.headerLogoImage ? (
                <img src={state.content.headerLogoImage} alt="Logo" className="w-8 h-8 object-contain rounded-md" />
              ) : (
                <Scale className="h-8 w-8 text-[#C8A028]" />
              )}
              <span className="font-bold text-xl uppercase tracking-wider text-white">{state.content?.headerLogoText || 'Виктория Тарасова'}</span>
            </div>
            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
              {state.content?.headerLogoSubtitle || 'Патентный поверенный РФ №1558'}.<br/>
              Надежная защита интеллектуальной собственности и IT-продуктов для бизнеса.
            </p>
            <div className="flex flex-wrap gap-3">
               {activeSocials.map(social => (
                 <a key={social.id} href={social.value} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] flex items-center justify-center hover:bg-[#3B82F6] hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                   <span className="text-[10px] font-bold tracking-wider">{social.shortLabel || social.label.substring(0, 2).toUpperCase()}</span>
                 </a>
               ))}
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
              {activePhones.map(phone => (
                <li key={phone.id} className="flex items-start">
                  <Phone className="w-5 h-5 text-[#C8A028] mr-3 mt-0.5 shrink-0" />
                  <a href={`tel:${phone.value.replace(/[^\d+]/g, '')}`} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors font-bold whitespace-nowrap">{formatPhone(phone.value)}</a>
                </li>
              ))}
              
              {activeEmails.length > 0 && (
                <li className="flex items-start">
                   <Mail className="w-5 h-5 text-[#C8A028] mr-3 mt-0.5 shrink-0" />
                   <div className="flex flex-col gap-2 text-sm">
                     {activeEmails.map(email => (
                       <a key={email.id} href={`mailto:${email.value}`} className="text-[#D1D5DB] hover:text-[#C8A028] transition-colors leading-tight">
                         {email.value}
                         {email.label && email.label !== 'Email' && (
                           <>
                             <br/>
                             <span className="text-[#9CA3AF] text-xs">({email.label.replace(/^Email\s*(?:\()?/, '').replace(/\)$/, '')})</span>
                           </>
                         )}
                       </a>
                     ))}
                   </div>
                </li>
              )}
              
              <li className="flex items-start mt-2">
                 <MapPin className="w-5 h-5 text-[#C8A028] mr-3 mt-0.5 shrink-0" />
                 <span className="text-[#D1D5DB]">Работаем дистанционно по всей России и СНГ</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#9CA3AF]">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {state.content?.headerLogoText || 'Виктория Тарасова'}. Все права защищены.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-white hover:text-[#C8A028] transition-colors">Политика безопасности</Link>
            <Link to="/admin" className="text-white hover:text-[#C8A028] transition-colors">Панель управления</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
