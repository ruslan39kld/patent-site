import { Link } from 'react-router-dom';
import { Copyright, Lightbulb, Cog, Frame, Code, FileText, Globe, Handshake, ShieldAlert, ArrowRight } from 'lucide-react';
import { useData } from '../store/DataContext';
import { ReactNode } from 'react';

export default function Services() {
  const { state } = useData();

  const getIcon = (iconName: string): ReactNode => {
    switch(iconName) {
      case 'Copyright': return <Copyright className="w-6 h-6" />;
      case 'Lightbulb': return <Lightbulb className="w-6 h-6" />;
      case 'Cog': return <Cog className="w-6 h-6" />;
      case 'Frame': return <Frame className="w-6 h-6" />;
      case 'Code': return <Code className="w-6 h-6" />;
      case 'FileText': return <FileText className="w-6 h-6" />;
      case 'Globe': return <Globe className="w-6 h-6" />;
      case 'Handshake': return <Handshake className="w-6 h-6" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6" />;
      default: return <Copyright className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-cream">
      <section className="pt-20 pb-16 bg-white border-b border-gray/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-bg/50 skew-x-12 transform translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Услуги патентного поверенного</h1>
            <p className="text-xl text-ink/80 leading-relaxed">
              Комплексные юридические решения для защиты вашего бренда, технологий и разработок. Выберите нужную услугу, чтобы узнать подробности, или опишите задачу — и я подберу подходящий инструмент.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {state.services.map((svc) => (
              <div key={svc.id} className="bg-white rounded-2xl p-8 border border-gray/10 hover:border-accent/30 hover:shadow-xl transition-all group flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                   <div className="w-14 h-14 rounded-xl bg-blue-bg flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-primary transition-colors">
                     {getIcon(svc.icon)}
                   </div>
                </div>
                
                <h3 className="text-2xl font-bold text-primary mb-4 leading-tight">{svc.title}</h3>
                <p className="text-ink/80 mb-8 flex-grow">{svc.fullDesc}</p>
                
                <div className="pt-6 border-t border-gray/10 mt-auto flex flex-col space-y-4">
                  <div className="text-sm font-medium text-gray mb-2">
                     <span className="block mb-1 text-primary">Срок: {svc.duration}</span>
                     <span className="block text-primary">Стоимость: {svc.price}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                     <Link 
                       to={`/services/${svc.slug}`} 
                       className="flex-1 bg-blue-bg hover:bg-primary text-primary hover:text-white text-center py-3 rounded-lg font-bold transition-colors text-sm"
                     >
                       Узнать подробнее
                     </Link>
                     <Link 
                       to="/contacts"
                       className="flex-shrink-0 bg-transparent text-primary hover:text-accent flex items-center justify-center w-12 h-12 rounded-lg border border-primary/10 hover:border-accent transition-colors"
                     >
                       <ArrowRight className="w-5 h-5" />
                     </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-primary text-white text-center">
         <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Не знаете, что именно вам нужно?</h2>
            <p className="text-xl text-white/80 mb-10">
               Юридические термины могут быть сложными. Опишите вашу бизнес-задачу (что продаете, что придумали, где планируете запускаться), и я предложу вам конкретный план действий.
            </p>
            <Link to="/contacts" className="inline-block bg-accent hover:bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl">
               Подобрать решение бесплатно
            </Link>
         </div>
      </section>
    </div>
  );
}
