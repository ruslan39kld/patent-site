import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ScrollUpButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-10 right-6 z-50 w-12 h-12 rounded-full bg-[#3B82F6] text-white flex items-center justify-center border border-[#3B82F6]/50 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 hover:bg-[#2563EB] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
      aria-label="Наверх"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
