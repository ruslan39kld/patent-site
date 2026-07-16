import { useData } from '../../store/DataContext';
import { Link } from 'react-router-dom';
import { Award, Briefcase, FileSignature, Shield, Lock, ExternalLink, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import DocumentViewerModal, { DocumentPreview } from '../DocumentViewerModal';

export default function AboutBrief() {
  const { state } = useData();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<DocumentPreview | null>(null);
  const [isAboutImageLoaded, setIsAboutImageLoaded] = useState(false);

  const certificates = state.content?.certificates || [
    { name: 'Патент на изобретение №2770988', type: 'Изобретение' },
    { name: 'Свидетельство на ТЗ №1103965', type: 'Товарный знак' },
    { name: 'Промышленный образец №135489', type: 'Пром. образец' },
    { name: 'Программа ЭВМ №2024611599', type: 'Программа ЭВМ' }
  ];

  const patents = state.content?.patents || [
    { name: 'Патент на изобретение №2770988', type: 'Изобретение' },
    { name: 'Патент на изобретение №2856753', type: 'Изобретение' },
    { name: 'Патент на изобретение №210294', type: 'Изобретение' },
    { name: 'Патент на изобретение №2808928', type: 'Изобретение' },
    { name: 'Патент на изобретение №2769621', type: 'Изобретение' }
  ];

  const aboutCards = state.content?.aboutCards?.filter((c: any) => c.active !== false) || [
    { title: 'Официальный статус', desc: 'Действующий патентный поверенный РФ (рег. №1558). Несу ответственность за результат.' },
    { title: 'Бизнес-подход', desc: 'Подбираю инструменты защиты, которые сохранят долю рынка и защитят от судов.' },
    { title: 'Опыт защиты', desc: 'Широкая практика в палате по спорам и судах по интеллектуальным правам.' },
    { title: 'Конфиденциальность', desc: 'Строгое соблюдение коммерческой тайны и безопасное обращение с данными.' }
  ];

  const getIconForCard = (index: number) => {
    switch(index % 4) {
      case 0: return <Award className="w-7 h-7" />;
      case 1: return <Briefcase className="w-7 h-7" />;
      case 2: return <Shield className="w-7 h-7" />;
      case 3: return <Lock className="w-7 h-7" />;
      default: return <Award className="w-7 h-7" />;
    }
  };

  return (
    <section  id="about" className="animate-on-scroll py-24 bg-[#EEF3FB] relative overflow-hidden rounded-[40px] mx-4 my-12 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse gap-16 items-stretch">
          
          <div className="lg:w-7/12 animate-on-scroll stagger-2 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 text-[#3B82F6] font-bold tracking-widest uppercase text-xs mb-4 bg-[#3B82F6]/5 px-4 py-2 rounded-xl border border-[#3B82F6]/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] w-fit mx-auto lg:mx-0">
               <span>Об эксперте</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-8 leading-tight text-center">
               {state.content?.aboutTitle || 'Защищаю то, на чём строится ваш бизнес'}
            </h2>
            
            <div className="text-xl text-[#1F2937] font-medium mb-12 leading-relaxed border-l-4 border-[#3B82F6] pl-6 py-2 bg-gradient-to-r from-[#3B82F6]/5 to-transparent rounded-r-xl text-center lg:text-left">
              {state.content?.aboutText || 'Виктория Тарасова помогает предпринимателям защитить то, на чём строится их бизнес: название, бренд, продукт, дизайн, технологии и права на созданные разработки.'}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
               {aboutCards.map((card: any, i: number) => (
                 <div key={i} className="relative group p-8 rounded-[24px] border border-[#E5E7EB] shadow-[0_0_20px_rgba(59,130,246,0.08)] hover:border-[#3B82F6]/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.25)] hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-[#EEF3FB] border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] mb-6 group-hover:scale-110 transition-transform duration-300">
                       {getIconForCard(i)}
                    </div>
                    <h4 className="font-black text-[#1B3F7A] mb-3 text-xl group-hover:text-[#3B82F6] transition-colors duration-300">{card.title}</h4>
                    <p className="text-[#4B5563] text-base leading-relaxed font-medium">
                      {card.desc}
                    </p>
                 </div>
               ))}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-6 mt-auto pb-4">
               <button 
                 type="button"
                 onClick={(e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                 }}
                 className="w-full sm:w-auto bg-[#C8A028] hover:bg-[#E8C050] text-white text-center px-10 py-5 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(200,160,40,0.3)] hover:-translate-y-1 hover:shadow-[0_4px_25px_rgba(200,160,40,0.5)] text-lg relative overflow-hidden group outline-none"
               >
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_3s_infinite] transition-opacity"></div>
                 <span className="relative z-10">Подробнее обо мне</span>
               </button>
               <a 
                 href="https://rospatent.gov.ru/ru/patent-attorneys/1558" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-full sm:w-auto bg-[#1B3F7A]/5 border border-[#1B3F7A]/10 text-[#1B3F7A] hover:bg-[#1B3F7A]/10 text-center px-8 py-5 font-bold transition-colors flex items-center justify-center gap-3 rounded-xl text-lg outline-none hover:-translate-y-1"
               >
                 Проверить в реестре <ExternalLink className="w-5 h-5" />
               </a>
            </div>
          </div>

          <div className="lg:w-5/12 w-full animate-on-scroll shrink-0 relative mt-8 lg:mt-0 lg:pt-16 lg:pb-[104px]">
            {/* Tech glowing background */}
            <div className="absolute inset-0 bg-[#3B82F6]/10 rounded-full blur-[120px] pointer-events-none"></div>
            
            {/* Full Height Wrapper - Aligned with Title and Buttons */}
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-full rounded-2xl border border-[#E5E7EB] shadow-[0_20px_50px_rgba(27,63,122,0.08)] group overflow-visible">
               
               {/* Inner Image Wrapper */}
               <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-inner bg-slate-200">
                 {!isAboutImageLoaded && (
                   <div className="absolute inset-0 bg-slate-200 animate-pulse z-20" />
                 )}
                 <img 
                   src={state.content?.aboutImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"} 
                   alt="Виктория Тарасова" 
                   onLoad={() => setIsAboutImageLoaded(true)}
                   className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105 ${isAboutImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                 />
                 
                 {/* Internal Edge light Blur */}
                 <div className="absolute inset-0 shadow-[inset_0_0_30px_10px_rgba(255,255,255,0.4)] pointer-events-none z-10 transition-all duration-500"></div>
                 
                 {/* Bottom gradient fade for text contrast */}
                 <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#1B3F7A]/80 via-[#1B3F7A]/30 to-transparent pointer-events-none z-20"></div>
                 
                 {/* Corner Tech Accents */}
                 <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-white/60 rounded-tl-2xl z-20 m-3 pointer-events-none"></div>
                 <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-white/60 rounded-br-2xl z-20 m-3 pointer-events-none"></div>
               </div>

               {/* Modern Overlay Label */}
               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="bg-[#F8F9FA]/95 backdrop-blur-md px-8 py-3 rounded-xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex flex-col items-center">
                    <span className="font-black text-lg sm:text-xl uppercase tracking-widest text-[#1B3F7A] whitespace-nowrap">Виктория Тарасова</span>
                  </div>
               </div>
              
               {/* Tech Badge - Half in/Half out, Left, above name */}
               <div className="absolute top-12 -left-6 sm:-left-10 bg-[#F8F9FA]/95 backdrop-blur-xl px-5 py-4 rounded-xl border border-[#E5E7EB] shadow-[0_15px_35px_rgba(27,63,122,0.15)] z-30 flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform duration-300 pointer-events-auto group-hover:scale-105 group-hover:border-[#3B82F6]/30">
                  <div className="w-16 h-16 rounded-[14px] bg-gradient-to-br from-[#1B3F7A] to-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center text-white ring-[3px] ring-white">
                     <div className="font-black text-2xl flex items-start">
                       20<span className="text-[#93C5FD] text-lg mt-0.5">+</span>
                     </div>
                  </div>
                  <div className="text-[11px] sm:text-xs font-black text-[#1B3F7A] uppercase tracking-wider leading-tight text-center mt-1">
                     лет<br/>
                     <span className="text-[#3B82F6] font-bold">успешной</span><br/>
                     <span className="text-[#3B82F6]">практики</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-16 animate-on-scroll stagger-3">
          <div className="text-[12px] text-[#3B82F6] uppercase tracking-widest font-bold mb-2">Квалификация</div>
          <h3 className="text-3xl md:text-4xl font-black text-[#1B3F7A] mb-6">
            Официальный статус
          </h3>
          <p className="text-lg text-[#475569] mb-6 max-w-none lg:whitespace-nowrap text-balance">
            Я являюсь действующим патентным поверенным РФ. Мой регистрационный номер&nbsp;&mdash;&nbsp;№1558.
          </p>
          <a
            href="https://rospatent.gov.ru/ru/patent-attorneys/1558"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#F8F9FA] border border-[#E5E7EB] text-[#1B3F7A] hover:bg-white hover:border-[#3B82F6]/50 hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)] px-8 py-4 font-bold transition-all rounded-xl text-lg hover:-translate-y-1 mb-16 group"
          >
            Проверить в реестре Роспатента 
            <ExternalLink className="w-5 h-5 ml-3 text-[#3B82F6] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div id="certificates-section" className="animate-on-scroll stagger-4 scroll-mt-32">
          <div className="text-[12px] text-[#3B82F6] uppercase tracking-widest font-bold mb-2">Портфолио</div>
          <h3 className="text-3xl md:text-4xl font-black text-[#1B3F7A] mb-10">
            Примеры моей работы
          </h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
             {certificates.map((cert, i) => (
               <div 
                  key={i} 
                  onClick={() => setSelectedCert(cert)}
                  className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] md:w-[calc(25%-1.125rem)] lg:flex-1 lg:min-w-[200px] lg:max-w-[280px] relative group border border-[#E5E7EB] shadow-[0_0_20px_rgba(59,130,246,0.05)] rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col items-center hover:border-[#3B82F6]/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:-translate-y-1 cursor-pointer overflow-hidden"
                >
                 <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
                 
                 {/* Document Thumbnail */}
                 <div className="w-full aspect-[1/1.4] bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg mb-4 md:mb-5 relative overflow-hidden shadow-sm flex flex-col items-center justify-center p-2 group-hover:border-[#3B82F6]/30 transition-colors z-10 mxauto max-w-[140px]">
                   {(cert as any).image ? (
                     <>
                       <div
                         className="absolute inset-0 bg-cover bg-center blur-sm scale-110 opacity-60"
                         style={{ backgroundImage: `url("${(cert as any).image}")` }}
                       />
                       <img src={(cert as any).image} alt={cert.name} className="relative z-10 w-full h-full object-contain drop-shadow-sm" />
                     </>
                   ) : (
                     <React.Fragment>
                       <div className="absolute top-2 right-2 flex flex-col gap-[2px]">
                         <div className="w-4 h-[2px] bg-[#3B82F6]/30"></div>
                         <div className="w-3 h-[2px] bg-[#3B82F6]/30"></div>
                       </div>
                       <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#1B3F7A]/5 flex items-center justify-center mb-2 group-hover:bg-[#3B82F6] transition-colors duration-300">
                         <FileSignature className="w-4 h-4 md:w-5 md:h-5 text-[#1B3F7A]/50 group-hover:text-white transition-colors duration-300" />
                       </div>
                       <div className="space-y-1 w-full px-2 opacity-50">
                         <div className="h-1 w-full bg-gray-200 rounded"></div>
                         <div className="h-1 w-5/6 bg-gray-200 rounded"></div>
                         <div className="h-1 w-4/6 bg-gray-200 rounded"></div>
                       </div>
                     </React.Fragment>
                   )}
                 </div>

                 <div className="relative text-[9px] md:text-[10px] text-[#3B82F6] uppercase tracking-widest font-bold mb-1 md:mb-2 z-10 text-center">Роспатент</div>
                 <div className="relative font-bold text-[#1B3F7A] text-center text-xs md:text-sm group-hover:text-[#3B82F6] transition-colors duration-300 z-10 leading-tight md:leading-normal">{cert.name}</div>
               </div>
             ))}
          </div>
          <div className="flex justify-end mt-8">
            <Link 
              to="/certificates" 
              className="inline-flex items-center text-[#1B3F7A] font-bold hover:text-[#C8A028] transition-colors group pb-2 shrink-0 md:text-lg"
            >
              Смотреть все свидетельства
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        <div id="patents-section" className="mt-16 animate-on-scroll stagger-4 scroll-mt-32">
          <div className="text-[12px] text-[#3B82F6] uppercase tracking-widest font-bold mb-2">Практика</div>
          <h3 className="text-3xl md:text-4xl font-black text-[#1B3F7A] mb-10">
            Патенты на изобретения
          </h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
             {patents.map((patent, i) => (
               <div 
                  key={i} 
                  onClick={() => setSelectedCert(patent)}
                  className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] md:w-[calc(25%-1.125rem)] lg:flex-1 lg:min-w-[200px] lg:max-w-[280px] relative group border border-[#E5E7EB] shadow-[0_0_20px_rgba(59,130,246,0.05)] rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col items-center hover:border-[#3B82F6]/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:-translate-y-1 cursor-pointer overflow-hidden"
                >
                 <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
                 
                 {/* Document Thumbnail */}
                 <div className="w-full aspect-[1/1.4] bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg mb-4 md:mb-5 relative overflow-hidden shadow-sm flex flex-col items-center justify-center p-2 group-hover:border-[#3B82F6]/30 transition-colors z-10 mx-auto max-w-[140px]">
                   {(patent as any).image ? (
                     <>
                       <div
                         className="absolute inset-0 bg-cover bg-center blur-sm scale-110 opacity-60"
                         style={{ backgroundImage: `url("${(patent as any).image}")` }}
                       />
                       <img src={(patent as any).image} alt={patent.name} className="relative z-10 w-full h-full object-contain drop-shadow-sm" />
                     </>
                   ) : (
                     <React.Fragment>
                       <div className="absolute top-2 right-2 flex flex-col gap-[2px]">
                         <div className="w-4 h-[2px] bg-[#3B82F6]/30"></div>
                         <div className="w-3 h-[2px] bg-[#3B82F6]/30"></div>
                       </div>
                       <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#1B3F7A]/5 flex items-center justify-center mb-2 group-hover:bg-[#3B82F6] transition-colors duration-300">
                         <FileSignature className="w-4 h-4 md:w-5 md:h-5 text-[#1B3F7A]/50 group-hover:text-white transition-colors duration-300" />
                       </div>
                       <div className="space-y-1 w-full px-2 opacity-50">
                         <div className="h-1 w-full bg-gray-200 rounded"></div>
                         <div className="h-1 w-5/6 bg-gray-200 rounded"></div>
                         <div className="h-1 w-4/6 bg-gray-200 rounded"></div>
                       </div>
                     </React.Fragment>
                   )}
                 </div>

                 <div className="relative text-[9px] md:text-[10px] text-[#3B82F6] uppercase tracking-widest font-bold mb-1 md:mb-2 z-10 text-center">Роспатент</div>
                 <div className="relative font-bold text-[#1B3F7A] text-center text-xs md:text-sm group-hover:text-[#3B82F6] transition-colors duration-300 z-10 leading-tight md:leading-normal">{patent.name}</div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} className="max-w-[800px]">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black text-[#1B3F7A] mb-2 leading-tight">Виктория Тарасова <br className="hidden lg:block"/>— патентный поверенный РФ №1558</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 leading-relaxed text-lg">
            
            <div>
              <h3 className="text-xl font-bold text-[#1B3F7A] border-b-2 border-[#C8A028] pb-2 mb-4 inline-block">Образование и статус</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#C8A028] mr-2 text-xl leading-none">•</span>
                  <span>Московская государственная юридическая академия им. О.Е. Кутафина</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C8A028] mr-2 text-xl leading-none">•</span>
                  <span>Патентный поверенный РФ, регистрационный номер 1558</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C8A028] mr-2 text-xl leading-none">•</span>
                  <span>Членство: Палата патентных поверенных, Союз юристов РФ</span>
                </li>
              </ul>
              <a 
                 href="https://rospatent.gov.ru/ru/patent-attorneys/1558" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 font-bold text-[#1B3F7A] hover:text-[#C8A028] transition-colors mt-4"
               >
                 Проверить в реестре Роспатента <ExternalLink className="w-5 h-5" />
               </a>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#1B3F7A] border-b-2 border-[#C8A028] pb-2 mb-4 inline-block">Опыт и специализация</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#C8A028] mr-2 text-xl leading-none">•</span>
                  <span>Более 20 лет практики в области интеллектуальной собственности</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C8A028] mr-2 text-xl leading-none">•</span>
                  <span>Специализация: товарные знаки, изобретения, полезные модели, промышленные образцы, программы ЭВМ и базы данных, авторские права</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#C8A028] mr-2 text-xl leading-none">•</span>
                  <span>Опыт сопровождения российских и международных регистраций (Мадридская система, Гаагская система, PCT)</span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-[#1B3F7A] border-b-2 border-[#C8A028] pb-2 mb-4 inline-block">Подход к работе</h3>
              <p className="p-6 rounded-xl border-l-4 border-[#C8A028] italic">
                «Я помогаю предпринимателям защитить то, на чём строится их бизнес: название, бренд, продукт, дизайн, технологии и права на созданные разработки. Мой подход — говорить с клиентом на языке бизнес-задач, а не юридических терминов. Каждая ситуация уникальна, поэтому я начинаю с бесплатной оценки и только потом предлагаю конкретные инструменты защиты.»
              </p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-[#1B3F7A] border-b-2 border-[#C8A028] pb-2 mb-4 inline-block">Направления работы</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-center"><Award className="w-5 h-5 text-[#C8A028] mr-3 shrink-0"/> Регистрация и защита товарных знаков</li>
                <li className="flex items-center"><Award className="w-5 h-5 text-[#C8A028] mr-3 shrink-0"/> Патентование изобретений и полезных моделей</li>
                <li className="flex items-center"><Award className="w-5 h-5 text-[#C8A028] mr-3 shrink-0"/> Регистрация промышленных образцов</li>
                <li className="flex items-center"><Award className="w-5 h-5 text-[#C8A028] mr-3 shrink-0"/> Регистрация программ ЭВМ и баз данных</li>
                <li className="flex items-center"><Award className="w-5 h-5 text-[#C8A028] mr-3 shrink-0"/> Защита авторских прав</li>
                <li className="flex items-center"><Award className="w-5 h-5 text-[#C8A028] mr-3 shrink-0"/> Международная регистрация (Мадридская система)</li>
                <li className="flex items-center"><Award className="w-5 h-5 text-[#C8A028] mr-3 shrink-0"/> Договоры об интеллектуальных правах</li>
                <li className="flex items-center"><Award className="w-5 h-5 text-[#C8A028] mr-3 shrink-0"/> Оспаривание и защита при нарушениях</li>
              </ul>
            </div>
            
          </div>
          
          <div className="pt-4 text-center">
            <button 
              onClick={() => {
                setIsAboutModalOpen(false);
                setTimeout(() => {
                  (sessionStorage.setItem('returnPos', window.scrollY.toString()), document.getElementById('contact'))?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="w-full md:w-auto bg-[#C8A028] hover:bg-[#E8C050] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_4px_15px_rgba(200,160,40,0.3)] hover:-translate-y-1 hover:shadow-[0_4px_25px_rgba(200,160,40,0.5)] inline-block"
            >
              Обсудить мою задачу
            </button>
          </div>
        </div>
      </Modal>

      <DocumentViewerModal document={selectedCert} onClose={() => setSelectedCert(null)} />
    </section>
  );
}
