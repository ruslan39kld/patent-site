import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let consent = null;
    try {
      consent = localStorage.getItem('cookie_consent');
    } catch (e) {
      console.warn("localStorage not available");
    }
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    try {
      localStorage.setItem('cookie_consent', 'true');
    } catch (e) {
      console.warn("localStorage not available");
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[9999] max-w-[320px] w-full animate-fade-in">
      <div className="bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(27,63,122,0.15)] border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-4">
        <div className="text-sm font-bold text-[#1F2937]">Использование cookie</div>
        <div className="text-xs text-[#475569] leading-relaxed">
          Мы используем файлы cookie для обеспечения лучшего пользовательского опыта и аналитики. 
          Продолжая использовать сайт, вы соглашаетесь с нашей <Link to="/privacy" className="text-[#1B3F7A] underline hover:text-[#3B82F6] transition-colors">Политикой конфиденциальности</Link>.
        </div>
        <button
          onClick={acceptCookies}
          className="w-full bg-[#1B3F7A] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#2960B0] transition-colors"
        >
          Хорошо, согласен
        </button>
      </div>
    </div>
  );
}
