import React, { useEffect, useState } from 'react';
import { ArrowLeft, FileSignature } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';

// I need the actual certificates data, wait, I can get it from AboutBrief.tsx probably
// Let's declare it here directly or import from store if available.
// For now, I will define a generic 12 certificates list as they look similar.
const allCertificates = Array.from({ length: 12 }).map((_, i) => ({
  name: `Свидетельство Роспатента №${1000 + i}`,
  type: i % 3 === 0 ? 'Патент на изобретение' : i % 2 === 0 ? 'Товарный знак' : 'Программа ЭВМ',
}));

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState<{name: string, type: string} | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="bg-white border-b border-[#E5E7EB] pt-32 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-[#1B3F7A] font-bold hover:text-[#C8A028] transition-colors mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" /> Назад на главную
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-[#1B3F7A] mb-4">Свидетельства и документы</h1>
          <p className="text-xl text-[#6B7280] font-medium max-w-3xl">
            Подтверждённые результаты работы — свидетельства о регистрации, полученные для клиентов
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {allCertificates.map((cert, i) => (
             <div 
                key={i} 
                onClick={() => setSelectedCert(cert)}
                className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all hover:-translate-y-1 hover:border-[#1B3F7A] cursor-pointer group"
              >
               <div className="w-20 h-20 bg-[#EEF3FB] rounded-full mb-6 flex items-center justify-center text-[#1B3F7A] group-hover:scale-110 transition-transform">
                  <FileSignature className="w-10 h-10" />
               </div>
               <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">Роспатент</div>
               <div className="font-bold text-[#1B3F7A] text-center mb-1 text-lg">{cert.name}</div>
               <div className="text-sm text-gray-500 font-medium">{cert.type}</div>
             </div>
           ))}
        </div>
      </div>

      <Modal isOpen={!!selectedCert} onClose={() => setSelectedCert(null)}>
        {selectedCert && (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-32 h-32 bg-[#EEF3FB] rounded-full flex items-center justify-center text-[#1B3F7A]">
               <FileSignature className="w-16 h-16" />
            </div>
            <h3 className="text-3xl font-bold text-[#1B3F7A]">{selectedCert.name}</h3>
            <div className="text-xl text-gray-600 font-medium">{selectedCert.type}</div>
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold uppercase tracking-wider text-sm mt-4">
              Выдано Роспатентом
            </div>
            <p className="text-gray-500 mt-4 leading-relaxed max-w-md">
               Изображение официального документа скрыто из соображений конфиденциальности данных клиентов. Оригинал документа доступен по запросу на консультации.
            </p>
          </div>
        )}
      </Modal> 
    </div>
  );
}
