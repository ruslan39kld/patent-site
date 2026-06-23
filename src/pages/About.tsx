import { useData } from '../store/DataContext';
import { ShieldCheck, BookOpen, GraduationCap, MapPin, Briefcase } from 'lucide-react';
import FinalCTA from '../components/home/FinalCTA';

export default function About() {
  const { state } = useData();

  return (
    <div className="bg-cream min-h-screen">
      <section className="pt-20 pb-16 bg-white border-b border-gray/10 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-bg/30 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/2"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Профиль специалиста</h1>
         </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-4">
              <div className="sticky top-28">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 border border-white/50 bg-gradient-to-br from-primary to-secondary aspect-[3/4] flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-50 z-0"></div>
                  
                  <div className="relative z-10 text-center flex-grow flex items-center justify-center flex-col">
                    <div className="inline-block w-28 h-28 rounded-full border-4 border-white/20 bg-white/5 backdrop-blur-md mb-6 relative">
                       <div className="absolute inset-0 flex items-center justify-center text-white/50 text-5xl font-bold font-serif tracking-tighter">VT</div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0B112B] to-transparent p-6 pt-20 z-10 text-center">
                     <h2 className="text-white text-2xl font-bold tracking-tight mb-1">Виктория Тарасова</h2>
                     <p className="text-accent font-medium text-sm tracking-wider uppercase">Патентный поверенный РФ №1558</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-gray/10 shadow-sm space-y-4">
                   <div className="flex items-center text-primary font-medium">
                      <Briefcase className="w-5 h-5 text-accent mr-4 shrink-0" />
                      <span>&gt; 20 лет юридической практики</span>
                   </div>
                   <div className="flex items-center text-primary font-medium">
                      <ShieldCheck className="w-5 h-5 text-accent mr-4 shrink-0" />
                      <span>Специализация: Интеллектуальная собственность</span>
                   </div>
                   <div className="flex items-center text-primary font-medium">
                      <MapPin className="w-5 h-5 text-accent mr-4 shrink-0" />
                      <span>Работа по всей РФ и миру</span>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl p-8 lg:p-12 border border-gray/10 shadow-sm mb-12">
                 <h2 className="text-3xl font-bold text-primary mb-6">Подход к работе</h2>
                 <div className="prose prose-lg max-w-none text-ink/80 leading-relaxed">
                   <p className="font-medium text-xl text-primary mb-6">{state.content.aboutText}</p>
                   <p>Мой путь в профессии начался более 20 лет назад. За это время я прошла путь от инхаус-юриста в крупных корпорациях до независимого патентного поверенного, защищающего интересы как стартапов, так и предприятий федерального уровня.</p>
                   <p>Я не просто оформляю заявки. Моя задача как поверенного — встроить юридическую защиту в вашу бизнес-модель так, чтобы она работала на вас: увеличивала капитализацию, защищала от рейдерских захватов и патентных троллей, помогала развивать франчайзинговые сети без страха потерять бренд.</p>
                 </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 lg:p-12 border border-gray/10 shadow-sm mb-12">
                 <h2 className="text-3xl font-bold text-primary mb-8 flex items-center">
                    <GraduationCap className="w-8 h-8 text-accent mr-4" /> Образование и квалификация
                 </h2>
                 <ul className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray/20 before:to-transparent">
                    <li className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-accent bg-white text-accent group-[.is-active]:bg-accent group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-4 bg-cream rounded shadow-sm">
                         <div className="font-bold text-primary">Статус патентного поверенного</div>
                         <div className="text-sm text-gray mt-1">Регистрационный номер №1558 в реестре Роспатента. Специализация: Товарные знаки, Промышленные образцы, Изобретения.</div>
                      </div>
                    </li>
                    <li className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-accent bg-white text-accent shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-4 bg-cream rounded shadow-sm">
                         <div className="font-bold text-primary">Высшее юридическое образование</div>
                         <div className="text-sm text-gray mt-1">Специализация: Гражданское право.</div>
                      </div>
                    </li>
                 </ul>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <a href="https://rospatent.gov.ru/ru/svedeniya-o-patentnyh-poverennyh" target="_blank" rel="noopener noreferrer" className="bg-blue-bg hover:bg-gold-bg/50 p-6 rounded-xl text-center border border-primary/10 transition-colors group">
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-primary">Реестр Роспатента</h3>
                    <p className="text-sm text-gray mt-2">Проверить официальный статус поверенного на государственном портале</p>
                 </a>
                 <div className="bg-blue-bg p-6 rounded-xl text-center border border-primary/10">
                    <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-primary">Полная конфиденциальность</h3>
                    <p className="text-sm text-gray mt-2">По закону патентный поверенный не вправе разглашать сведения доверителя</p>
                 </div>
              </div>
              
            </div>
            
          </div>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
