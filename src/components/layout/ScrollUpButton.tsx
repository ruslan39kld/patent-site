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
        "fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-[#1B3F7A] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-[#2960B0] hover:scale-110",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
      aria-label="Наверх"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}
