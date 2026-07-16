import React, { useEffect, useState } from 'react';
import { ArrowLeft, FileSignature } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useData } from '../store/DataContext';
import DocumentViewerModal, { DocumentPreview } from '../components/DocumentViewerModal';

export default function Certificates() {
  const { state } = useData();
  const [selectedCert, setSelectedCert] = useState<DocumentPreview | null>(null);
  const location = useLocation();

  const allCertificates = [...(state.content?.certificates || []), ...(state.content?.patents || [])];

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="bg-white border-b border-[#E5E7EB] pt-32 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/#certificates-section" className="inline-flex items-center text-[#1B3F7A] font-bold hover:text-[#3B82F6] transition-colors mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" /> Назад к квалификации
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-[#1B3F7A] mb-4">Свидетельства и документы</h1>
          <p className="text-xl text-[#6B7280] font-medium max-w-3xl">
            Подтверждённые результаты работы — свидетельства о регистрации, полученные для клиентов
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pt-12">
        {allCertificates.length === 0 && (
          <div className="text-center py-16 text-[#6B7280] border border-[#E5E7EB] border-dashed rounded-2xl">
            Свидетельства и документы пока не добавлены
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
           {allCertificates.map((cert, i) => (
             <div 
                key={i} 
                onClick={() => setSelectedCert(cert)}
                className="relative group bg-white border border-[#E5E7EB] shadow-[0_0_20px_rgba(59,130,246,0.05)] rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col items-center hover:border-[#3B82F6]/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
               <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
               
               {/* Document Thumbnail */}
               <div className="w-full aspect-[1/1.4] bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg mb-4 md:mb-5 relative overflow-hidden shadow-sm flex flex-col items-center justify-center p-2 group-hover:border-[#3B82F6]/30 transition-colors z-10 mx-auto max-w-[140px]">
                 {(cert as any).image ? (
                   <img src={(cert as any).image} alt={cert.name} loading="lazy" className="absolute inset-0 w-full h-full object-contain p-1" />
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
               <div className="relative font-bold text-[#1B3F7A] text-center text-xs md:text-sm group-hover:text-[#3B82F6] transition-colors duration-300 z-10 leading-tight md:leading-normal mb-1">{cert.name}</div>
               <div className="relative text-[10px] text-gray-500 font-medium z-10 text-center">{cert.type}</div>
             </div>
           ))}
        </div>
      </div>

      <DocumentViewerModal document={selectedCert} onClose={() => setSelectedCert(null)} />
    </div>
  );
}
