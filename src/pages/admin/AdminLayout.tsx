import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Code, User, FileText, Briefcase, MessagesSquare, Settings, DollarSign, HelpCircle, Star, PenTool } from 'lucide-react';
import { cn } from '../../lib/utils';
import Login from './Login';

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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
    { to: "/admin/blog", icon: <FileText className="w-4 h-4 mr-3" />, label: "Блог" },
    { to: "/admin/faq", icon: <HelpCircle className="w-4 h-4 mr-3" />, label: "FAQ" },
    { to: "/admin/reviews", icon: <Star className="w-4 h-4 mr-3" />, label: "Отзывы" },
    { to: "/admin/contacts", icon: <User className="w-4 h-4 mr-3" />, label: "Контакты" },
    { to: "/admin/leads", icon: <MessagesSquare className="w-4 h-4 mr-3" />, label: "Заявки" },
    { to: "/admin/builder", icon: <PenTool className="w-4 h-4 mr-3" />, label: "Конструктор" },
    { to: "/admin/system", icon: <Settings className="w-4 h-4 mr-3" />, label: "Система" },
    { to: "/admin/api-keys", icon: <Code className="w-4 h-4 mr-3" />, label: "API Ключи" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-20"></div>
          <div className="font-bold text-xl relative z-10">Admin Panel</div>
          <div className="text-xs text-accent mt-1 relative z-10">Виктория Тарасова</div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {links.map((link) => (
             <Link 
               key={link.to}
               to={link.to} 
               className={cn(
                 "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                 pathname === link.to || (pathname.startsWith(link.to) && link.to !== "/admin")
                   ? "bg-white/10 font-bold text-white shadow-sm" 
                   : "text-white/70 hover:bg-white/5 hover:text-white"
               )}
             >
               {link.icon} {link.label}
             </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" className="flex items-center text-sm text-white/70 hover:text-white transition-colors w-full px-4 py-2 hover:bg-white/5 rounded-lg">
            Вернуться на сайт
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center text-sm text-red-300 hover:text-red-200 transition-colors w-full px-4 py-2 hover:bg-white/5 rounded-lg text-left"
          >
            <LogOut className="w-4 h-4 mr-2" /> Выйти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-50/50">
         <div className="md:hidden bg-primary text-white p-4 flex justify-between items-center z-10 relative shadow-md">
            <div className="font-bold">Admin Panel</div>
            <div className="flex gap-2">
               <Link to="/" className="text-sm border border-white/20 px-3 py-1 rounded hover:bg-white/10 transition-colors">Сайт</Link>
               <button onClick={handleLogout} className="text-sm border border-white/20 text-red-300 px-3 py-1 rounded hover:bg-white/10 transition-colors"><LogOut className="w-4 h-4" /></button>
            </div>
         </div>
         {/* Mobile menu (simple) */}
         <div className="md:hidden bg-white border-b flex overflow-x-auto whitespace-nowrap p-2 shadow-sm relative z-0 hide-scrollbar">
            {links.map((link) => (
               <Link 
                 key={link.to}
                 to={link.to} 
                 className={cn(
                   "inline-flex items-center px-4 py-2 rounded-lg text-xs font-medium mr-2 transition-colors",
                   pathname === link.to || (pathname.startsWith(link.to) && link.to !== "/admin")
                     ? "bg-primary text-white shadow-sm" 
                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                 )}
               >
                 {link.label}
               </Link>
            ))}
         </div>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
