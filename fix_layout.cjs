const fs = require('fs');
let code = `import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollUpButton from './ScrollUpButton';
import AIBot from '../AIBot';
import CookieConsent from './CookieConsent';
import CanvasParticles from '../home/CanvasParticles';

export default function Layout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F5EDD8] text-[#1F2937] relative selection:bg-[#1B3F7A] selection:text-white">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CanvasParticles />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-20">
          <Outlet />
        </main>
        <Footer />
        <AIBot />
        <ScrollUpButton />
        <CookieConsent />
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/layout/Layout.tsx', code);
