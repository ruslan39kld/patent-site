import { Link, Outlet } from 'react-router-dom';
import { Menu, Phone, Mail, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Услуги', path: '/services' },
    { name: 'Стоимость', path: '/pricing' },
    { name: 'Кейсы', path: '/cases' },
    { name: 'Обо мне', path: '/about' },
    { name: 'Контакты', path: '/contacts' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-primary font-bold text-xl leading-tight">
                Виктория Тарасова
                <span className="block text-sm font-normal text-gray">Патентный поверенный РФ №1558</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-ink hover:text-secondary px-3 py-2 text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Contacts */}
            <div className="hidden md:flex items-center space-x-4">
               <a href="tel:+79990000000" className="flex items-center text-primary font-medium hover:text-secondary group">
                 <Phone className="w-4 h-4 mr-2 group-hover:text-accent transition-colors" />
                 +7 (999) 000-00-00
               </a>
               <Link
                to="/contacts"
                className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors"
               >
                 Обсудить задачу
               </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="text-ink hover:text-primary p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 text-base font-medium text-ink hover:text-primary hover:bg-blue-bg rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 px-3 pt-4 border-t border-gray-100">
                <a href="tel:+79990000000" className="flex items-center text-primary font-medium mb-4">
                  <Phone className="w-5 h-5 mr-3 text-accent" />
                  +7 (999) 000-00-00
                </a>
                <Link
                  to="/contacts"
                  className="block w-full text-center bg-primary hover:bg-secondary text-white px-5 py-3 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Обсудить задачу
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-primary text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-xl font-bold mb-4">Виктория Тарасова</h3>
              <p className="text-sm text-blue-bg/80 mb-6">
                Патентный поверенный РФ №1558.<br />
                Защита бренда, продукта и разработок вашего бизнеса более 20 лет.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-accent">Услуги</h4>
              <ul className="space-y-2 text-sm text-blue-bg/80">
                <li><Link to="/services" className="hover:text-white transition-colors">Товарные знаки</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Изобретения и полезные модели</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Промышленные образцы</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Программы ЭВМ и БД</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Договоры и защита прав</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-accent">Клиентам</h4>
              <ul className="space-y-2 text-sm text-blue-bg/80">
                <li><Link to="/pricing" className="hover:text-white transition-colors">Стоимость услуг</Link></li>
                <li><Link to="/cases" className="hover:text-white transition-colors">Кейсы из практики</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Обо мне</Link></li>
                <li><Link to="/contacts" className="hover:text-white transition-colors">Контакты</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-accent">Связь</h4>
              <ul className="space-y-4 text-sm text-blue-bg/80">
                <li>
                  <a href="tel:+79990000000" className="flex items-center hover:text-white transition-colors">
                    <Phone className="w-4 h-4 mr-2" /> +7 (999) 000-00-00
                  </a>
                </li>
                <li>
                  <a href="mailto:info@tarasovapatent.ru" className="flex items-center hover:text-white transition-colors">
                    <Mail className="w-4 h-4 mr-2" /> info@tarasovapatent.ru
                  </a>
                </li>
                <li>
                  <Link to="/contacts" className="inline-block border border-accent text-accent hover:bg-accent hover:text-primary px-4 py-2 rounded transition-colors">
                    Написать сообщение
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/20 text-sm text-blue-bg/60 flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">© {new Date().getFullYear()} Тарасова В.Н. Патентный поверенный РФ №1558. Все права защищены.</p>
            <div className="flex space-x-4">
              <Link to="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
