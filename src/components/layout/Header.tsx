import { Menu, Phone, X, ShieldCheck } from 'lucide-react';
import React, { useState, useEffect } from 'react';
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
              {state.content?.headerLogoImage ? (
                <img src={state.content.headerLogoImage} alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#1B3F7A] text-white flex items-center justify-center shrink-0 group-hover:bg-[#C8A028] transition-colors">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              )}
              <div className="leading-tight">
                <span className="block text-[#1B3F7A] font-bold text-xl leading-none mb-1">{state.content?.headerLogoText || 'Виктория Тарасова'}</span>
                <span className="block text-[10px] font-bold text-gray/50 uppercase tracking-widest leading-none">{state.content?.headerLogoSubtitle || 'Патентный поверенный РФ №1558'}</span>
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
          </div>
        </div>
      )}
    </header>
  );
}
