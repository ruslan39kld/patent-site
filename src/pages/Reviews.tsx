import { useState, useEffect } from 'react';
import { useData } from '../store/DataContext';
import { Star, ArrowLeft, Image as ImageIcon, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Reviews() {
  const { state } = useData();
  const rawReviews = state.reviews || [];
  const navigate = useNavigate();
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'pdf', url: string, name: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const publishedReviews = rawReviews.filter(r => r.published !== false);

  const reviews = publishedReviews.map((r) => {
    let media = r.media || [];
    if (r.image) {
       media = [...media, { type: 'image' as const, url: r.image, name: 'Фото отзыва' }];
    }
    return { ...r, media };
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative overflow-hidden text-[#1F2937] pt-24 pb-20">
      {/* Light tech backgrounds */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[50%] h-[500px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-12">
          {/* Back button */}
          <button 
            onClick={() => {
              navigate('/#reviews');
              setTimeout(() => {
                const element = document.getElementById('reviews');
                if (element) {
                   element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }} 
            className="inline-flex items-center text-[#1B3F7A] hover:text-[#3B82F6] font-bold transition-colors group mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Назад к главной
          </button>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1B3F7A] tracking-tight mb-4">
             Все <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B3F7A] to-[#3B82F6]">отзывы</span>
          </h1>
          <p className="text-xl text-[#6B7280] font-medium">Что говорят клиенты о нашей работе</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white p-8 rounded-[24px] border border-[#E5E7EB] shadow-[0_4px_20px_rgba(27,63,122,0.05)] hover:border-[#3B82F6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col transition-all duration-500 group relative">
              
              {/* Card Tech Glow */}
              <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[#3B82F6]/0 to-[#3B82F6]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="flex items-center mb-8 relative z-10">
                <div className="w-[56px] h-[56px] rounded-2xl bg-gradient-to-br from-[#1B3F7A] to-[#3B82F6] text-white flex items-center justify-center font-black text-xl mr-5 shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform">
                  {review.initials || review.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[#1F2937] text-lg">{review.name}</div>
                  <div className="flex text-[#3B82F6] mt-1.5 space-x-1">
                    {[...Array(review.rating || 5)].map((_, j) => (
                      <Star key={j} className="w-[14px] h-[14px] fill-current drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
                    ))}
                  </div>
                </div>
              </div>
              
              {review.reviewType === 'image' && review.reviewImage ? (
                <div className="mb-8 flex-grow relative z-10 flex items-center justify-center">
                  <div 
                    className="relative w-full h-48 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-[#E5E7EB] group/img"
                    onClick={() => setSelectedMedia({ type: 'image', url: review.reviewImage!, name: `Отзыв от ${review.name}` })}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors z-10 flex items-center justify-center">
                       <span className="opacity-0 group-hover/img:opacity-100 bg-white/90 text-[#1B3F7A] text-sm font-bold px-3 py-1.5 rounded-full shadow-sm transition-opacity">
                          Увеличить фото
                       </span>
                    </div>
                    <img src={review.reviewImage} className="w-full h-full object-cover opacity-90 group-hover/img:opacity-100 transition-opacity" alt="Скриншот отзыва" />
                  </div>
                </div>
              ) : (
                <div className="text-[#4A5568] mb-8 flex-grow leading-relaxed italic relative z-10 font-medium">
                  <span className="text-[#3B82F6] text-2xl absolute -top-3 -left-3 opacity-30">"</span>
                  {review.text}
                  <span className="text-[#3B82F6] text-2xl absolute -bottom-4 right-0 opacity-30">"</span>
                </div>
              )}
              
              {review.media && review.media.length > 0 && (
                <div className="flex gap-3 mb-6 relative z-10 flex-wrap">
                  {review.media.map((m, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedMedia(m)}
                      className="flex items-center gap-2 bg-[#EEF3FB] border border-[#3B82F6]/20 px-4 py-2 rounded-xl hover:bg-[#3B82F6] hover:text-white text-[#1B3F7A] transition-all duration-300 font-bold text-sm shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] group/btn"
                    >
                      {m.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      <span className="truncate max-w-[150px]">{m.name}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#1B3F7A]/5 to-transparent border-l-2 border-[#3B82F6] text-[#1B3F7A] text-xs font-bold uppercase tracking-wider self-start relative z-10 mt-auto">
                {review.tag || review.service}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[100] p-4 sm:p-6 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-[#0A1A3A]/60 backdrop-blur-sm cursor-pointer transition-opacity"
            onClick={() => setSelectedMedia(null)}
          ></div>
          
          <div className="min-h-full flex items-center justify-center">
            <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-[#E5E7EB] mx-auto animate-in fade-in zoom-in-95 duration-300">
            {/* Tech Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] bg-gradient-to-r from-[#F8F9FA] to-white relative overflow-hidden">
               <div className="flex items-center gap-3 relative z-10 text-[#1B3F7A]">
                 {selectedMedia.type === 'image' ? <ImageIcon className="w-6 h-6 text-[#3B82F6]" /> : <FileText className="w-6 h-6 text-[#3B82F6]" />}
                 <span className="font-bold text-xl">{selectedMedia.name}</span>
               </div>
               <button 
                 onClick={() => setSelectedMedia(null)}
                 className="p-2 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all relative z-10 group shadow-sm"
               >
                 <X className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
               </button>
            </div>
            
            {/* Media Content */}
            <div className="p-6 overflow-y-auto bg-[#F8F9FA] flex-grow flex items-center justify-center min-h-[50vh] relative">
               <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>
               {selectedMedia.type === 'image' ? (
                 <img 
                   src={selectedMedia.url} 
                   alt={selectedMedia.name} 
                   className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-md border border-[#E5E7EB] relative z-10 bg-white"
                 />
               ) : (
                 <div className="flex flex-col items-center justify-center text-center p-12 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm w-full max-w-2xl relative z-10">
                   <div className="w-24 h-24 bg-[#EEF3FB] border border-[#3B82F6]/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
                     <FileText className="w-12 h-12 text-[#3B82F6]" />
                   </div>
                   <h3 className="text-2xl font-black text-[#1B3F7A] mb-4 tracking-tight">Просмотр PDF документа</h3>
                   <p className="text-[#6B7280] font-medium mb-8 max-w-lg mx-auto">
                     Открытие документа в защищенном режиме.
                   </p>
                   <a 
                     href={selectedMedia.url} 
                     download
                     className="bg-gradient-to-r from-[#1B3F7A] to-[#3B82F6] hover:from-[#2563EB] hover:to-[#60A5FA] text-white px-8 py-4 rounded-xl font-bold shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] transition-all flex items-center gap-3"
                   >
                     <FileText className="w-5 h-5" />
                     <span>Скачать <b>{selectedMedia.name}</b></span>
                   </a>
                 </div>
               )}
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
