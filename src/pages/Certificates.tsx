import React, { useEffect, useState } from 'react';
import { ArrowLeft, FileSignature, Shield, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useData } from '../store/DataContext';
import Modal from '../components/Modal';

export default function Certificates() {
  const { state } = useData();
  const [selectedCert, setSelectedCert] = useState<{name: string, type: string} | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const location = useLocation();

  const extraCerts = Array.from({ length: 4 }).map((_, i) => ({
    name: `Свидетельство Роспатента №${1000 + i}`,
    type: i % 3 === 0 ? 'Патент на изобретение' : i % 2 === 0 ? 'Товарный знак' : 'Программа ЭВМ',
  }));
  
  const allCertificates = state.content?.certificates && state.content.certificates.length > 0 
    ? [...state.content.certificates, ...state.content?.patents || [], ...extraCerts]
    : extraCerts;

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
                   <img src={(cert as any).image} alt={cert.name} className="absolute inset-0 w-full h-full object-cover" />
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

      <Modal isOpen={!!selectedCert} onClose={() => { setSelectedCert(null); setIsZoomed(false); }} className="p-0 bg-transparent border-none shadow-none md:shadow-none w-full max-w-5xl max-h-[900px] overflow-hidden" hideCloseButton>
        {selectedCert && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div 
              className="w-full h-full max-w-5xl bg-white rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#3B82F6]/20 relative mx-auto"
              style={{ height: '85vh', maxHeight: '800px', minHeight: '300px' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header portion */}
              <div className="w-full h-[80px] bg-[#1B3F7A] flex items-center px-4 md:px-8 shrink-0 relative overflow-hidden text-left shadow-md z-10">
                 <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#3B82F6]/30 blur-[120px] rounded-full pointer-events-none"></div>
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] relative z-10 shrink-0">
                    <FileSignature className="w-5 h-5 md:w-6 md:h-6" />
                 </div>
                 <div className="flex flex-col ml-3 md:ml-4 relative z-10 flex-1 min-w-0 pr-28">
                   <h3 className="text-white font-black text-sm md:text-lg tracking-wide uppercase truncate block">{selectedCert.name}</h3>
                   <div className="flex items-center gap-2 mt-0.5">
                     <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60A5FA', display: 'inline-block', boxShadow: '0 0 8px #60A5FA' }}/>
                     <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70">
                       Официальный документ
                     </span>
                   </div>
                 </div>
                 
                 {/* Controls */}
                 <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
                   <button 
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all font-medium"
                    title={isZoomed ? "Уменьшить" : "Увеличить"}
                    aria-label="Zoom toggle"
                   >
                     {isZoomed ? <ZoomOut className="w-4 h-4 md:w-5 md:h-5" /> : <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />}
                   </button>
                   <button 
                    onClick={() => { setSelectedCert(null); setIsZoomed(false); }}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-[#1B3F7A] hover:bg-gray-100 flex items-center justify-center transition-all"
                    title="Закрыть"
                    aria-label="Close modal"
                   >
                     <X className="w-4 h-4 md:w-5 md:h-5" />
                   </button>
                 </div>
              </div>
              {/* Document placeholder portion */}
              <div className="w-full p-4 md:p-8 bg-[#E2E8F0] flex-1 overflow-auto min-h-0 relative">
                 <div className={`bg-white shadow-2xl overflow-hidden flex flex-col mx-auto relative border border-[#CBD5E1] transition-all duration-300 ${isZoomed ? 'w-[200%] md:w-[150%] xl:w-[200%] max-w-none origin-top-left' : 'w-full max-w-xl md:max-w-3xl origin-top'}`}>
                    <img 
                      src={(selectedCert as any).image || "https://images.unsplash.com/photo-1590402237433-286eeacb5387?q=80&w=1400&auto=format&fit=crop"}
                      alt={selectedCert.name} 
                      className={`w-full h-auto object-cover opacity-[0.98] transition-all duration-500 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                      onClick={() => setIsZoomed(!isZoomed)}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-blue-900/5 mix-blend-multiply pointer-events-none"></div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </Modal> 
    </div>
  );
}
