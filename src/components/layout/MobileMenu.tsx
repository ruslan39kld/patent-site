import { Phone } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavLink {
  name: string;
  id: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  activeSection: string;
  pathname: string;
  phone: string;
  onNavClick: (e: React.MouseEvent, sectionId: string) => void;
}

export default function MobileMenu({ isOpen, navLinks, activeSection, pathname, phone, onNavClick }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-white border-t border-gray/10 absolute w-full shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
      <div className="px-4 pt-2 pb-6 flex flex-col space-y-2">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={`#${link.id}`}
            onClick={(e) => onNavClick(e, link.id)}
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
          onClick={(e) => onNavClick(e, 'ai-bot')}
          className="block w-full text-left px-4 py-3 text-base font-bold rounded-md transition-colors outline-none text-[#1F2937] hover:text-[#1B3F7A] hover:bg-[#F8F9FA] flex items-center"
        >
          🤖 Бот
        </button>

        <div className="mt-4 pt-4 border-t border-gray/10 flex flex-col space-y-4">
          <a
            href={`tel:${phone.replace(/[^+\d]/g, '')}`}
            className="flex items-center justify-center text-[#1B3F7A] font-bold bg-[#F8F9FA] p-3 rounded-md"
          >
            <Phone className="w-5 h-5 mr-3 text-[#1B3F7A]" />
            {phone}
          </a>
          <button
            onClick={(e) => onNavClick(e, 'contact')}
            className="block w-full text-center bg-[#1B3F7A] text-white px-5 py-4 rounded-md text-base font-bold transition-colors outline-none"
          >
            Обсудить задачу
          </button>
        </div>
      </div>
    </div>
  );
}
