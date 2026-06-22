import { useEffect, useRef, useState } from 'react';
import { Star, Image as ImageIcon, FileText, X, FileBadge, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../store/DataContext';

export default function ReviewsBlock() {
  const { state } = useData();
  const rawReviews = state.reviews || [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'pdf', url: string, name: string } | null>(null);

  // Map image field to media array if present
  const reviews = rawReviews.map((r, idx) => {
    let media = r.media || [];
    if (r.image) {
       media = [...media, { type: 'image' as const, url: r.image, name: 'Фото отзыва' }];
    }
    return { ...r, media };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && !selectedMedia) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // scroll by one card width approx
          scrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedMedia]);

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-24 bg-[#F8F9FA] relative overflow-hidden animate-on-scroll">
      {/* Tech Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 text-[#3B82F6] font-bold tracking-widest uppercase text-xs mb-6 bg-[#3B82F6]/10 px-4 py-2 rounded-lg border border-[#3B82F6]/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
             <FileBadge className="w-4 h-4" />
             <span>Подтвержденные отзывы</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1B3F7A] tracking-tight relative inline-block mx-auto">
             Клиенты о работе
             <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3B82F6]/50 to-transparent"></div>
          </h2>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-16 pt-4 px-4 -mx-4 snap-x hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, i) => (
            <div key={i} className="flex-none w-[350px] md:w-[400px] bg-white p-8 rounded-[24px] shadow-[0_10px_30px_rgba(27,63,122,0.06)] border border-[#E5E7EB] hover:border-[#3B82F6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col snap-start h-auto min-h-[420px] transition-all duration-500 group relative">
              
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
                          Увеличить скриншот
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
                <div className="flex gap-3 mb-6 relative z-10 overflow-x-auto pb-2 hide-scrollbar">
                  {review.media.map((m, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedMedia(m)}
                      className="flex items-center gap-2 bg-[#EEF3FB] border border-[#3B82F6]/20 px-4 py-2.5 rounded-xl hover:bg-[#3B82F6] hover:text-white text-[#1B3F7A] transition-all duration-300 font-bold text-sm shrink-0 group/btn"
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

        <div className="flex justify-end mt-4 animate-on-scroll">
          <Link to="/reviews" className="inline-flex items-center text-[#1B3F7A] font-bold text-lg hover:text-[#3B82F6] transition-colors group">
            Все отзывы <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
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
            <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-[#E5E7EB] mx-auto">
            {/* Tech Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] bg-gradient-to-r from-[#F8FAFC] to-white relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]"></div>
               <div className="flex items-center gap-3 relative z-10 text-[#1B3F7A]">
                 {selectedMedia.type === 'image' ? <ImageIcon className="w-6 h-6 text-[#3B82F6]" /> : <FileText className="w-6 h-6 text-[#3B82F6]" />}
                 <span className="font-bold text-xl">{selectedMedia.name}</span>
               </div>
               <button 
                 onClick={() => setSelectedMedia(null)}
                 className="p-2 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all relative z-10 group shadow-sm"
               >
                 <X className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
               </button>
            </div>
            
            {/* Media Content */}
            <div className="p-6 overflow-y-auto bg-[#F8F9FA] flex-grow flex items-center justify-center min-h-[50vh] relative">
               <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-[100px] pointer-events-none"></div>
               {selectedMedia.type === 'image' ? (
                 <img 
                   src={selectedMedia.url} 
                   alt={selectedMedia.name} 
                   className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-[#E5E7EB] relative z-10 bg-white"
                 />
               ) : (
                 <div className="flex flex-col items-center justify-center text-center p-12 bg-white/80 backdrop-blur border border-[#E5E7EB] rounded-2xl shadow-[0_10px_30px_rgba(27,63,122,0.05)] w-full max-w-2xl relative z-10">
                   <div className="w-24 h-24 bg-[#EEF3FB] border border-[#E5E7EB] rounded-full flex items-center justify-center mb-6 shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
                     <FileText className="w-12 h-12 text-[#3B82F6]" />
                   </div>
                   <h3 className="text-2xl font-black text-[#1B3F7A] mb-4 tracking-tight">Просмотр PDF документа</h3>
                   <p className="text-[#6B7280] font-medium mb-8 max-w-lg mx-auto">
                     Открытие документа в защищенном режиме. В рабочей версии здесь будет встроенный PDF-вьювер.
                   </p>
                   <a 
                     href={selectedMedia.url} 
                     download
                     className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-4 rounded-xl font-bold shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(59,130,246,0.4)] transition-all flex items-center gap-3"
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
    </section>
  );
}
