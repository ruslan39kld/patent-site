import { useState } from 'react';
import { Star, Image as ImageIcon, FileText, X, ZoomIn } from 'lucide-react';
import { ReviewItem } from '../types';
import { cn } from '../lib/utils';
import Modal from './Modal';

// Long reviews get clipped to a few lines instead of stretching the card;
// this is a character-count heuristic (not measured overflow) so the button
// shows consistently regardless of font-load timing.
const TEXT_TRUNCATE_THRESHOLD = 200;

interface ReviewCardProps {
  review: ReviewItem;
  className?: string;
}

function ReviewAvatar({ review, size }: { review: ReviewItem; size: number }) {
  return review.image ? (
    <img
      src={review.image}
      alt={review.name}
      loading="lazy"
      style={{ width: size, height: size }}
      className="rounded-2xl object-cover mr-5 shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-[#E5E7EB]"
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className="rounded-2xl bg-gradient-to-br from-[#1B3F7A] to-[#3B82F6] text-white flex items-center justify-center font-black text-xl mr-5 shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
    >
      {review.initials || review.name.charAt(0)}
    </div>
  );
}

export default function ReviewCard({ review, className }: ReviewCardProps) {
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'pdf'; url: string; name: string } | null>(null);
  const [showFullText, setShowFullText] = useState(false);

  // Explicit attachments only — the client's avatar (`image`) and the
  // review's scan/photo (`reviewImage`) are both already shown directly in
  // the card (header avatar, 800x600 frame below), so neither belongs here
  // too as a redundant "Фото отзыва"-style button.
  const media = review.media || [];

  // image (avatar), reviewImage (attached scan/screenshot) and text are all
  // independent now — `reviewType` used to make them mutually exclusive but
  // no longer gates anything here, only whether each field is actually set.
  const hasReviewImage = !!review.reviewImage;
  const hasText = !!(review.text && review.text.trim());
  const textIsLong = hasText && review.text.length > TEXT_TRUNCATE_THRESHOLD;

  return (
    <div
      className={cn(
        'bg-white flex flex-col p-8 rounded-[24px] shadow-[0_10px_30px_rgba(27,63,122,0.06)] border border-[#E5E7EB] hover:border-[#3B82F6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500 group relative',
        className
      )}
    >
      <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[#3B82F6]/0 to-[#3B82F6]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="flex items-center mb-8 relative z-10">
        <ReviewAvatar review={review} size={56} />
        <div>
          <div className="font-bold text-[#1F2937] text-lg">{review.name}</div>
          <div className="flex text-[#3B82F6] mt-1.5 space-x-1">
            {[...Array(review.rating || 5)].map((_, j) => (
              <Star key={j} className="w-[14px] h-[14px] fill-current drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
            ))}
          </div>
        </div>
      </div>

      {hasReviewImage && (
        <div className="mb-6 relative z-10">
          {/* Fixed 800x600 (4:3) frame — object-contain so any scan/photo
              (portrait, A4, square) fits whole, never cropped. */}
          <div
            className="relative w-full aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-[#E5E7EB] group/img"
            onClick={() => setSelectedMedia({ type: 'image', url: review.reviewImage!, name: `Отзыв от ${review.name}` })}
          >
            <img
              src={review.reviewImage}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain p-2"
              alt="Скан/фото отзыва"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors z-20 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-white/90 shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="w-5 h-5 text-[#1B3F7A]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {hasText && (
        <div className={cn(
          'text-[#4A5568] mb-8 leading-relaxed italic relative z-10 font-medium',
          !hasReviewImage && 'flex-grow'
        )}>
          <span className="text-[#3B82F6] text-2xl absolute -top-3 -left-3 opacity-30">"</span>
          <p className="line-clamp-4">{review.text}</p>
          {textIsLong && (
            <button
              onClick={() => setShowFullText(true)}
              className="not-italic text-[#3B82F6] font-bold text-sm mt-2 hover:underline relative z-10 block"
            >
              Читать полностью
            </button>
          )}
        </div>
      )}

      {!hasReviewImage && !hasText && <div className="flex-grow" />}

      {media.length > 0 && (
        <div className="flex gap-3 mb-6 relative z-10 overflow-x-auto pb-2 hide-scrollbar">
          {media.map((m, idx) => (
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

      {/* Full-text popup, opened from "Читать полностью" instead of letting the card stretch */}
      <Modal isOpen={showFullText} onClose={() => setShowFullText(false)} className="max-w-2xl">
        <div className="flex items-center mb-6">
          <ReviewAvatar review={review} size={56} />
          <div>
            <div className="font-bold text-[#1F2937] text-lg">{review.name}</div>
            <div className="flex text-[#3B82F6] mt-1.5 space-x-1">
              {[...Array(review.rating || 5)].map((_, j) => (
                <Star key={j} className="w-[14px] h-[14px] fill-current" />
              ))}
            </div>
          </div>
        </div>
        <p className="text-[#374151] leading-relaxed whitespace-pre-line">{review.text}</p>
      </Modal>

      {/* Media (screenshot / attachment) viewer */}
      <Modal isOpen={!!selectedMedia} onClose={() => setSelectedMedia(null)} className="max-w-4xl p-0 overflow-hidden" hideCloseButton>
        {selectedMedia && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] bg-gradient-to-r from-[#F8FAFC] to-white">
              <div className="flex items-center gap-3 text-[#1B3F7A]">
                {selectedMedia.type === 'image' ? <ImageIcon className="w-6 h-6 text-[#3B82F6]" /> : <FileText className="w-6 h-6 text-[#3B82F6]" />}
                <span className="font-bold text-xl">{selectedMedia.name}</span>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-2 border border-[#E5E7EB] text-[#6B7280] rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 flex items-center justify-center min-h-[50vh] bg-[#F8FAFC]">
              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-[#E5E7EB] bg-white"
                />
              ) : (
                <div className="flex flex-col items-center text-center p-12 bg-white border border-[#E5E7EB] rounded-2xl w-full max-w-2xl">
                  <div className="w-24 h-24 bg-[#EEF3FB] border border-[#E5E7EB] rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-12 h-12 text-[#3B82F6]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#1B3F7A] mb-4">Просмотр документа</h3>
                  <a
                    href={selectedMedia.url}
                    download
                    className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-3"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Скачать <b>{selectedMedia.name}</b></span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
