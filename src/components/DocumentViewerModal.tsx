import { useEffect, useState } from 'react';
import { FileSignature, ZoomIn, ZoomOut, X } from 'lucide-react';
import Modal from './Modal';

export interface DocumentPreview {
  name: string;
  type?: string;
  image?: string;
}

interface DocumentViewerModalProps {
  document: DocumentPreview | null;
  onClose: () => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1590402237433-286eeacb5387?q=80&w=1400&auto=format&fit=crop';

// Shared lightbox for certificate/patent scans, used by both the homepage
// "Обо мне" section and the standalone /certificates page so they can't
// drift out of sync again. Images render with object-contain (not
// object-cover) inside a fixed-height container so they scale to fit
// instead of stretching/cropping, and zoom is a CSS transform on the image
// itself rather than resizing its container to 200% width.
export default function DocumentViewerModal({ document, onClose }: DocumentViewerModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!document) setIsZoomed(false);
  }, [document]);

  return (
    <Modal
      isOpen={!!document}
      onClose={() => { onClose(); setIsZoomed(false); }}
      className="p-0 bg-transparent border-none shadow-none md:shadow-none w-full max-w-5xl max-h-[900px] overflow-hidden"
      hideCloseButton
    >
      {document && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div
            className="w-full h-full max-w-5xl bg-white rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#3B82F6]/20 relative mx-auto"
            style={{ height: '85vh', maxHeight: '800px', minHeight: '300px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full h-[80px] bg-[#1B3F7A] flex items-center px-4 md:px-8 shrink-0 relative overflow-hidden text-left shadow-md z-10">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#3B82F6]/30 blur-[120px] rounded-full pointer-events-none"></div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] relative z-10 shrink-0">
                <FileSignature className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex flex-col ml-3 md:ml-4 relative z-10 flex-1 min-w-0 pr-28">
                <h3 className="text-white font-black text-sm md:text-lg tracking-wide uppercase truncate block">{document.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60A5FA', display: 'inline-block', boxShadow: '0 0 8px #60A5FA' }} />
                  <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70">
                    Официальный документ
                  </span>
                </div>
              </div>

              <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
                <button
                  onClick={() => setIsZoomed(z => !z)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all font-medium"
                  title={isZoomed ? 'Уменьшить' : 'Увеличить'}
                  aria-label="Zoom toggle"
                >
                  {isZoomed ? <ZoomOut className="w-4 h-4 md:w-5 md:h-5" /> : <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
                <button
                  onClick={() => { onClose(); setIsZoomed(false); }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-[#1B3F7A] hover:bg-gray-100 flex items-center justify-center transition-all"
                  title="Закрыть"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            <div className="w-full p-4 md:p-8 bg-[#E2E8F0] flex-1 overflow-auto min-h-0 relative flex items-center justify-center">
              <img
                src={document.image || FALLBACK_IMAGE}
                alt={document.name}
                onClick={() => setIsZoomed(z => !z)}
                className={`max-w-full max-h-full w-auto h-auto object-contain rounded shadow-2xl bg-white transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
