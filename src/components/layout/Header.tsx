import { Menu, Phone, X, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../store/DataContext';
import { cn } from '../../lib/utils';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useData();

  const navLinks = [
    { name: 'Услуги', id: 'services' },
    { name: 'Задачи', id: 'tasks' },
    { name: 'Кейсы', id: 'cases' },
    { name: 'Обо мне', id: 'about' },
    { name: 'FAQ', id: 'faq' },
  ];

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (sectionId === 'ai-bot') {
      window.dispatchEvent(new CustomEvent('open-ai-bot'));
      setIsMobileMenuOpen(false);
      return;
    }
    
    setIsMobileMenuOpen(false);
    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;

    const sections = ['hero', 'services', 'tasks', 'cases', 'about', 'faq', 'contact'];
    
    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter(e => e.isIntersecting);
      if (visibleEntries.length > 0) {
        const sorted = visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        setActiveSection(sorted[0].target.id);
      }
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className={cn(
      "fixed w-full top-0 z-50 transition-all duration-300 ease-in-out bg-white",
      isScrolled 
        ? "shadow-[0_1px_20px_rgba(0,0,0,0.08)] py-0" 
        : "py-2 border-b border-gray/10"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#hero" onClick={(e) => handleNavClick(e, 'hero')} className="flex items-center gap-3 group text-left outline-none">
              <div className="w-10 h-10 rounded-lg bg-[#1B3F7A] text-white flex items-center justify-center shrink-0 group-hover:bg-[#C8A028] transition-colors">
                 <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="leading-tight">
                <span className="block text-[#1B3F7A] font-bold text-xl leading-none mb-1">Виктория Тарасова</span>
                <span className="block text-[10px] font-bold text-gray/50 uppercase tracking-widest leading-none">Патентный поверенный РФ №1558</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={cn(
                  "px-4 py-2 text-sm font-bold transition-all rounded-md tracking-wide cursor-pointer outline-none",
                  activeSection === link.id && pathname === '/'
                    ? "text-[#1B3F7A]" 
                    : "text-[#1F2937] hover:text-[#1B3F7A]"
                )}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={(e) => handleNavClick(e, 'ai-bot')}
              className="px-4 py-2 text-sm font-bold transition-all rounded-md tracking-wide cursor-pointer outline-none text-[#1F2937] hover:text-[#1B3F7A] flex items-center"
            >
              🤖 Бот
            </button>
          </nav>

          {/* Desktop Contacts */}
          <div className="hidden lg:flex items-center space-x-6">
             <a href={`tel:${state.content.phone.replace(/[^+\d]/g, '')}`} className="flex items-center text-[#1F2937] font-bold hover:text-[#1B3F7A] transition-colors group">
               <Phone className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform text-[#1B3F7A]" />
               {state.content.phone}
             </a>
             <button
              onClick={(e) => handleNavClick(e, 'contact')}
              className="bg-[#1B3F7A] hover:bg-[#2960B0] text-white px-5 py-2.5 rounded-md text-sm font-bold transition-all hover:shadow-[0_4px_14px_0_rgba(27,63,122,0.2)] hover:-translate-y-0.5 outline-none"
             >
               Обсудить задачу
             </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="text-[#1B3F7A] hover:text-[#C8A028] p-2 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray/10 absolute w-full shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
          <div className="px-4 pt-2 pb-6 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={cn(
                  "block w-full text-left px-4 py-3 text-base font-bold rounded-md transition-colors outline-none",
                  activeSection === link.id && pathname === '/'
                    ? "text-[#1B3F7A] bg-[#F8F9FA]" 
                    : "text-[#1F2937] hover:text-[#1B3F7A] hover:bg-[#F8F9FA]"
                )}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={(e) => handleNavClick(e, 'ai-bot')}
              className="block w-full text-left px-4 py-3 text-base font-bold rounded-md transition-colors outline-none text-[#1F2937] hover:text-[#1B3F7A] hover:bg-[#F8F9FA] flex items-center"
            >
              🤖 Бот
            </button>

            <div className="mt-4 pt-4 border-t border-gray/10 flex flex-col space-y-4">
              <a href={`tel:${state.content.phone.replace(/[^+\d]/g, '')}`} className="flex items-center justify-center text-[#1B3F7A] font-bold bg-[#F8F9FA] p-3 rounded-md">
                <Phone className="w-5 h-5 mr-3 text-[#1B3F7A]" />
                {state.content.phone}
              </a>
              <button
                onClick={(e) => handleNavClick(e, 'contact')}
                className="block w-full text-center bg-[#1B3F7A] text-white px-5 py-4 rounded-md text-base font-bold transition-colors outline-none"
              >
                Обсудить задачу
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
