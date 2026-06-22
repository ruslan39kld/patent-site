import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  hideCloseButton?: boolean;
}

export default function Modal({ isOpen, onClose, children, className, hideCloseButton }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (!(window as any).activeModals) (window as any).activeModals = 0;
      (window as any).activeModals++;
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        (window as any).activeModals--;
        if ((window as any).activeModals <= 0) {
          document.body.style.overflow = '';
          (window as any).activeModals = 0;
        }
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-white/30 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center">
        <div 
          className={cn(
            "bg-white rounded-[24px] shadow-[0_0_50px_rgba(27,63,122,0.15)] md:shadow-[0_0_100px_rgba(27,63,122,0.2)] w-full max-w-[640px] relative p-8 border border-[#3B82F6]/20 mx-auto",
            "scale-95 animate-in zoom-in-95 duration-300",
            className
          )}
          onClick={e => e.stopPropagation()}
        >
          {!hideCloseButton && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 bg-white hover:bg-[#EEF3FB] rounded-full flex items-center justify-center text-[#1B3F7A] transition-colors border border-[#E5E7EB] hover:border-[#3B82F6]/30 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
