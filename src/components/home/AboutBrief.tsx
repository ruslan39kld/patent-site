import { useData } from '../../store/DataContext';
import { Link } from 'react-router-dom';
import { Award, Briefcase, FileSignature, Shield, Lock, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from '../Modal';

export default function AboutBrief() {
  const { state } = useData();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<{name: string, type: string} | null>(null);

  const certificates = [
    { name: 'Патент на изобретение №2770988', type: 'Изобретение' },
    { name: 'Свидетельство на ТЗ №1103965', type: 'Товарный знак' },
    { name: 'Промышленный образец №135489', type: 'Пром. образец' },
    { name: 'Программа ЭВМ №2024611599', type: 'Программа ЭВМ' }
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden border-t border-[#F3F4F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-5/12 w-full animate-on-scroll shrink-0">
            <div className="relative mx-auto" style={{ maxWidth: '400px' }}>
              <div 
                className="relative aspect-[4/5] bg-[#E8EEF8]"
                style={{ clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)' }}
              >
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1B3F7A] p-8">
                    <div className="text-[64px] mb-2">📸</div>
                    <span className="font-bold text-sm uppercase tracking-widest bg-white/50 px-4 py-2 rounded-lg">Фото специалиста 380x480</span>
                 </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white px-8 py-6 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-20 border-l-4 border-[#C8A028] hidden md:block">
                 <div className="text-4xl font-black text-[#1B3F7A] mb-1">20+</div>
                 <div className="text-sm font-bold text-[#6B7280] uppercase tracking-wider leading-tight">лет успешной<br/>практики</div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-7/12 animate-on-scroll stagger-2">
            <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">Об эксперте</div>
            <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-8">Защищаю то, на чём строится ваш бизнес</h2>
            
            <div className="text-xl text-[#1F2937] font-medium mb-12 leading-relaxed border-l-4 border-[#C8A028] pl-6 py-2 bg-[#F8F9FA]">
              Виктория Тарасова помогает предпринимателям защитить то, на чём строится их бизнес: название, бренд, продукт, дизайн, технологии и права на созданные разработки.
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
               <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:border-[#1B3F7A] transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#EEF3FB] flex items-center justify-center text-[#1B3F7A] mb-4">
                     <Award className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#1F2937] mb-2 text-lg">Официальный статус</h4>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    Действующий патентный поверенный РФ (рег. №1558). Несу ответственность за результат.
                  </p>
               </div>
               
               <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:border-[#1B3F7A] transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#EEF3FB] flex items-center justify-center text-[#1B3F7A] mb-4">
                     <Briefcase className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#1F2937] mb-2 text-lg">Бизнес-подход</h4>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    Подбираю инструменты защиты, которые сохранят долю рынка и защитят от судов.
                  </p>
               </div>
               
               <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:border-[#1B3F7A] transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#EEF3FB] flex items-center justify-center text-[#1B3F7A] mb-4">
                     <Shield className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#1F2937] mb-2 text-lg">Опыт защиты</h4>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    Широкая практика в палате по патентным спорам и судах по интеллектуальным правам.
                  </p>
               </div>
               
               <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:border-[#1B3F7A] transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#EEF3FB] flex items-center justify-center text-[#1B3F7A] mb-4">
                     <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#1F2937] mb-2 text-lg">Конфиденциальность</h4>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    Строгое соблюдение коммерческой тайны и безопасное обращение с вашими данными.
                  </p>
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
               <button 
                 onClick={() => setIsAboutModalOpen(true)}
                 className="w-full sm:w-auto bg-[#1B3F7A] text-white text-center px-8 py-4 rounded-xl font-bold hover:bg-[#2960B0] transition-colors shadow-lg"
               >
                 Подробнее обо мне
               </button>
               <a 
                 href="https://new.fips.ru/registers-doc-view/fips_servlet" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-full sm:w-auto text-[#1B3F7A] text-center px-4 py-4 font-bold hover:text-[#C8A028] transition-colors flex items-center justify-center gap-2"
               >
                 Проверить в реестре <ExternalLink className="w-4 h-4" />
               </a>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-16 border-t border-[#F3F4F6] animate-on-scroll stagger-3">
          <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">Квалификация</div>
          <h3 className="text-3xl md:text-4xl font-black text-[#1B3F7A] mb-10">
            Свидетельства и документы
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
             {certificates.map((cert, i) => (
               <div 
                  key={i} 
                  onClick={() => setSelectedCert(cert)}
                  className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all hover:-translate-y-1 hover:border-[#1B3F7A] cursor-pointer group"
                >
                 <div className="w-16 h-16 bg-[#EEF3FB] rounded-full mb-6 flex items-center justify-center text-[#1B3F7A] group-hover:scale-110 transition-transform">
                    <FileSignature className="w-8 h-8" />
                 </div>
                 <div className="text-[10px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">Роспатент</div>
                 <div className="font-bold text-[#1F2937] text-center text-sm">{cert.name}</div>
               </div>
             ))}
          </div>
          <div className="text-center md:text-left">
            <Link 
              to="/certificates" 
              className="inline-flex items-center justify-center bg-white border-2 border-[#1B3F7A] text-[#1B3F7A] hover:bg-[#1B3F7A] hover:text-white px-8 py-4 rounded-xl font-bold transition-all"
            >
              Смотреть все свидетельства <ExternalLink className="w-5 h-5 ml-2" />
            </Link>
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
                 href="https://new.fips.ru/registers-doc-view/fips_servlet" 
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
              <p className="bg-[#F8F9FA] p-6 rounded-xl border-l-4 border-[#C8A028] italic">
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
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="w-full md:w-auto bg-[#1B3F7A] hover:bg-[#2960B0] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-block"
            >
              Обсудить мою задачу
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!selectedCert} onClose={() => setSelectedCert(null)}>
        {selectedCert && (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-32 h-32 bg-[#EEF3FB] rounded-full flex items-center justify-center text-[#1B3F7A]">
               <FileSignature className="w-16 h-16" />
            </div>
            <h3 className="text-3xl font-bold text-[#1B3F7A]">{selectedCert.name}</h3>
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold">
              Выдано Роспатентом
            </div>
            <p className="text-gray-500 font-medium">
              Оригинал документа доступен по запросу
            </p>
          </div>
        )}
      </Modal>                     
    </section>
  );
}
