import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Code, User, FileText, Briefcase, MessagesSquare, Settings, DollarSign, HelpCircle, Star, PenTool, CheckCircle2, AlertCircle, X, Bot, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import Login from './Login';

export function useToast() {
  const toast = (message: string, type: 'success' | 'error' = 'success') => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type } }));
  };
  return { toast };
}

function ToastManager() {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([]);

  useEffect(() => {
    const handleToast = (e: any) => {
      const newToast = { id: Date.now().toString(), message: e.detail.message, type: e.detail.type };
      setToasts(prev => [...prev, newToast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 3000);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={cn(
          "bg-white shadow-xl rounded-[12px] border flex items-center p-4 min-w-[300px]",
          "animate-in slide-in-from-right-8 fade-in duration-300",
          t.type === 'success' ? "border-[#E2E8F0] border-l-4 border-l-[#10B981]" : "border-[#E2E8F0] border-l-4 border-l-[#EF4444]"
        )}>
          {t.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#10B981] mr-3" /> : <AlertCircle className="w-5 h-5 text-[#EF4444] mr-3" />}
          <div className="flex-1">
             <div className="text-[14px] font-bold text-[#0F172A]">{t.type === 'success' ? 'Успешно' : 'Ошибка'}</div>
             <div className="text-[13px] text-[#64748B]">{t.message}</div>
          </div>
          <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="text-[#94A3B8] hover:text-[#0F172A] ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAdminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAdminAuth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuth');
    setIsAuthenticated(false);
    navigate('/admin');
  };

  if (isAuthenticated === null) return null; // loading

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const links = [
    { to: "/admin", icon: <LayoutDashboard className="w-4 h-4 mr-3" />, label: "Дашборд" },
    { to: "/admin/home", icon: <LayoutDashboard className="w-4 h-4 mr-3" />, label: "Главная страница" },
    { to: "/admin/services", icon: <Code className="w-4 h-4 mr-3" />, label: "Услуги" },
    { to: "/admin/prices", icon: <DollarSign className="w-4 h-4 mr-3" />, label: "Стоимость" },
    { to: "/admin/cases", icon: <Briefcase className="w-4 h-4 mr-3" />, label: "Кейсы" },
    { to: "/admin/blog", icon: <FileText className="w-4 h-4 mr-3" />, label: "Статьи" },
    { to: "/admin/faq", icon: <HelpCircle className="w-4 h-4 mr-3" />, label: "FAQ" },
    { to: "/admin/bot", icon: <Bot className="w-4 h-4 mr-3" />, label: "ИИ Бот" },
    { to: "/admin/reviews", icon: <Star className="w-4 h-4 mr-3" />, label: "Отзывы" },
    { to: "/admin/contacts", icon: <User className="w-4 h-4 mr-3" />, label: "Контакты" },
    { to: "/admin/leads", icon: <MessagesSquare className="w-4 h-4 mr-3" />, label: "Заявки" },
    { to: "/admin/builder", icon: <PenTool className="w-4 h-4 mr-3" />, label: "Конструктор" },
    { to: "/admin/system", icon: <Settings className="w-4 h-4 mr-3" />, label: "Система" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex font-sans">
      <ToastManager />
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-[#E2E8F0] hidden md:flex flex-col">
        <div className="p-6 border-b border-[#E2E8F0] flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#1B3F7A] text-white flex items-center justify-center font-bold">
            ВT
          </div>
          <div>
            <div className="font-bold text-[#1B3F7A]">Админ Панель</div>
            <div className="text-xs text-[#64748B]">В. Тарасова</div>
          </div>
        </div>
        
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {links.map((link) => {
            const isActive = pathname === link.to || (pathname.startsWith(link.to) && link.to !== "/admin");
            return (
              <Link 
                key={link.to}
                to={link.to} 
                className={cn(
                  "flex items-center px-6 py-2.5 text-sm font-medium transition-colors border-l-[3px]",
                  isActive 
                    ? "bg-[#EEF3FB] text-[#1B3F7A] border-[#1B3F7A]" 
                    : "text-[#64748B] border-transparent hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                )}
              >
                {/* Clone icon to set size 18px */}
                <div style={{ width: '18px', height: '18px' }} className="mr-3 flex items-center justify-center">
                  {link.icon}
                </div>
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[#E2E8F0] space-y-2">
          <Link to="/" className="flex items-center text-sm text-[#64748B] hover:text-[#0F172A] transition-colors w-full px-6 py-2 hover:bg-[#F8FAFC] rounded-lg">
            Открыть сайт
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center text-sm text-red-500 hover:text-red-600 transition-colors w-full px-6 py-2 hover:bg-[#F8FAFC] rounded-lg text-left"
          >
            <LogOut className="w-[18px] h-[18px] mr-3" /> Выйти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-[#F8FAFC]">
         <div className="md:hidden bg-white text-[#0F172A] p-4 flex justify-between items-center z-20 relative border-b border-[#E2E8F0]">
            <div className="flex items-center gap-3">
               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] focus:outline-none transition-colors">
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
               </button>
               <div className="font-bold">Admin Panel</div>
            </div>
            <div className="flex gap-2">
               <Link to="/" className="text-sm border border-[#E2E8F0] px-3 py-1 rounded hover:bg-[#F1F5F9] transition-colors">Сайт</Link>
               <button onClick={handleLogout} className="text-sm border border-[#E2E8F0] text-red-500 px-3 py-1 rounded hover:bg-[#F1F5F9] transition-colors flex items-center justify-center"><LogOut className="w-4 h-4" /></button>
            </div>
         </div>
         
         {/* Mobile Slide-over Menu */}
         {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-10 flex">
               <div className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
               <div className="relative mt-[65px] flex-1 flex flex-col w-full bg-white shadow-xl h-[calc(100vh-65px)] overflow-y-auto animate-in slide-in-from-left-full duration-200">
                  <nav className="flex-1 py-4 space-y-1">
                     {links.map((link) => {
                       const isActive = pathname === link.to || (pathname.startsWith(link.to) && link.to !== "/admin");
                       return (
                         <Link 
                           key={link.to}
                           to={link.to} 
                           onClick={() => setIsMobileMenuOpen(false)}
                           className={cn(
                             "flex items-center px-6 py-3.5 text-[15px] font-medium transition-colors border-l-[3px]",
                             isActive 
                               ? "bg-[#EEF3FB] text-[#1B3F7A] border-[#1B3F7A]" 
                               : "text-[#64748B] border-transparent hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                           )}
                         >
                           <div style={{ width: '20px', height: '20px' }} className="mr-4 flex items-center justify-center">
                             {link.icon}
                           </div>
                           {link.label}
                         </Link>
                       );
                     })}
                  </nav>
               </div>
            </div>
         )}

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
