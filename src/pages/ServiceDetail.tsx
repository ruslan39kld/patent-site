import { useParams, Navigate, Link } from 'react-router-dom';
import { useData } from '../store/DataContext';
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, CreditCard, Landmark, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn, formatPhone } from '../lib/utils';
import FinalCTA from '../components/home/FinalCTA';

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { state, addLead } = useData();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const service = state.services.find(s => s.slug === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-white border-b border-gray/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-bg/30 rounded-bl-[100px] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center text-gray hover:text-primary font-medium mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Все услуги
          </Link>
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight max-w-3xl">{service.title}</h1>
            <p className="text-xl text-ink/80 leading-relaxed mb-8 border-l-4 border-accent pl-6 whitespace-pre-wrap">{service.fullDesc}</p>
            
            <div className="flex flex-wrap gap-4">
               <div className="flex items-center bg-blue-bg px-4 py-2 rounded-lg text-primary font-bold">
                  <Clock className="w-4 h-4 text-accent mr-2" /> Срок: {service.duration}
               </div>
               <div className="flex items-center bg-blue-bg px-4 py-2 rounded-lg text-primary font-bold">
                  <CreditCard className="w-4 h-4 text-accent mr-2" /> Стоимость: {service.price}
               </div>
               {service.duty !== '—' && (
                 <div className="flex items-center bg-blue-bg px-4 py-2 rounded-lg text-primary font-bold">
                    <Landmark className="w-4 h-4 text-accent mr-2" /> Пошлины: {service.duty}
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Situations */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-8">С какой ситуацией вы пришли?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.situations.map((sit, i) => (
                  <div key={i} className="bg-white border border-gray/10 p-6 rounded-xl flex items-start shadow-sm">
                    <AlertCircle className="w-6 h-6 text-accent shrink-0 mr-4" />
                    <span className="text-ink font-medium leading-relaxed">{sit}</span>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Includes */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-8">Что входит в услугу "под ключ"</h2>
              <div className="bg-white rounded-2xl p-8 border border-gray/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-[120px] transform translate-x-1/2 -translate-y-1/2"></div>
                
                <ul className="space-y-5 relative z-10">
                  {service.includes.map((inc, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-blue-bg flex items-center justify-center shrink-0 mr-4 mt-0.5">
                         <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-ink/90 text-lg">{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            
            {/* Target Audience */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-primary text-white p-8 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-accent rounded-bl-full opacity-20"></div>
                  <h3 className="text-xl font-bold text-accent mb-4">Кому точно подходит</h3>
                  <p className="text-white/90 leading-relaxed relative z-10">{service.forWhom}</p>
               </div>
               <div className="bg-gold-bg text-ink p-8 rounded-2xl relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-white rounded-tl-full opacity-50"></div>
                  <h3 className="text-xl font-bold text-primary mb-4">Когда пора обратиться</h3>
                  <p className="text-ink/80 leading-relaxed relative z-10">{service.whenToApply}</p>
               </div>
            </section>
            
            {/* FAQ specific to service */}
            {service.faq && service.faq.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-primary mb-8">Частые вопросы об услуге</h2>
                <div className="space-y-4">
                  {service.faq.map((f, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray/10 overflow-hidden text-left">
                      <button 
                        className="w-full px-6 py-5 flex items-center justify-between"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      >
                        <span className="font-bold text-primary pr-4 text-left">{f.q}</span>
                        {openFaq === i ? <ChevronUp className="w-5 h-5 text-accent shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray/40 shrink-0" />}
                      </button>
                      <div className={cn("px-6 overflow-hidden transition-all", openFaq === i ? "pb-5 opacity-100 h-auto" : "h-0 opacity-0")}>
                        <p className="text-ink/80 leading-relaxed border-t border-gray/10 pt-4">{f.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
          </div>
          
          {/* Sidebar CTA */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white border border-gray/10 rounded-2xl p-8 shadow-xl">
               <h3 className="text-2xl font-bold text-primary mb-6">Получить оценку задачи</h3>
               <p className="text-gray text-sm mb-6">Оставьте контакты, и я свяжусь с вами для бесплатной предварительной оценки перспектив и рисков.</p>
               
               <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  addLead({
                    name: target[0].value,
                    contact: target[1].value,
                    task: `Заявка со страницы: ${service.title}`,
                    type: service.category === 'it' ? 'IT и ПО' : service.category === 'ip' ? 'Товарные знаки' : 'Консультация',
                    status: 'new',
                    source: 'Услуги',
                    comment: ''
                  });
                  alert("Заявка отправлена. Я свяжусь с вами в ближайшее время.");
                  target.reset();
               }}>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">Имя</label>
                    <input type="text" className="w-full px-4 py-3 bg-cream border border-gray/10 rounded-lg focus:ring-2 focus:ring-accent outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink mb-1">Телефон / TG</label>
                    <input type="text" className="w-full px-4 py-3 bg-cream border border-gray/10 rounded-lg focus:ring-2 focus:ring-accent outline-none" required />
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-lg mt-2 transition-all shadow-md">
                    Обсудить задачу
                  </button>
               </form>
               <div className="mt-6 pt-6 border-t border-gray/10">
                  <p className="text-xs text-center text-gray">
                    Не хотите заполнять форму?<br/>
                    <a href={`tel:${state.content.phone.replace(/[^+\d]/g, '')}`} className="text-primary font-bold hover:text-accent mt-1 inline-block whitespace-nowrap">{formatPhone(state.content.phone)}</a>
                  </p>
               </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <FinalCTA />
    </div>
  );
}
