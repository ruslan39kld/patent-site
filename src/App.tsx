/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';

const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Pricing = lazy(() => import('./pages/Pricing'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Certificates = lazy(() => import('./pages/Certificates'));
const Cases = lazy(() => import('./pages/Cases'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Reviews = lazy(() => import('./pages/Reviews'));

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const SystemAdmin = lazy(() => import('./pages/admin/SystemAdmin'));
const HomeAdmin = lazy(() => import('./pages/admin/HomeAdmin'));
const ServicesAdmin = lazy(() => import('./pages/admin/ServicesAdmin'));
const BlogAdmin = lazy(() => import('./pages/admin/BlogAdmin'));
const PricesAdmin = lazy(() => import('./pages/admin/PricesAdmin'));
const CasesAdmin = lazy(() => import('./pages/admin/CasesAdmin'));
const FaqAdmin = lazy(() => import('./pages/admin/FaqAdmin'));
const BotAdmin = lazy(() => import('./pages/admin/BotAdmin'));
const ReviewsAdmin = lazy(() => import('./pages/admin/ReviewsAdmin'));
const ContactsAdmin = lazy(() => import('./pages/admin/ContactsAdmin'));
const LeadsAdmin = lazy(() => import('./pages/admin/LeadsAdmin'));
const BuilderAdmin = lazy(() => import('./pages/admin/BuilderAdmin'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-[#94A3B8]">
      Загрузка…
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services/*" element={<Navigate to="/#contact" replace />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="cases" element={<Cases />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="*" element={<div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#F8F9FA] px-4"><div className="text-center"><h1 className="text-6xl font-black text-[#1B3F7A] mb-4">404</h1><p className="text-xl text-[#6B7280] mb-8">Страница не найдена или еще не создана.</p><Link to="/" className="inline-flex bg-[#C8A028] text-white px-8 py-3 rounded-lg font-bold">На главную</Link></div></div>} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="home" element={<HomeAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="prices" element={<PricesAdmin />} />
            <Route path="cases" element={<CasesAdmin />} />
            <Route path="blog" element={<BlogAdmin />} />
            <Route path="faq" element={<FaqAdmin />} />
            <Route path="bot" element={<BotAdmin />} />
            <Route path="reviews" element={<ReviewsAdmin />} />
            <Route path="contacts" element={<ContactsAdmin />} />
            <Route path="leads" element={<LeadsAdmin />} />
            <Route path="builder" element={<BuilderAdmin />} />
            <Route path="system" element={<SystemAdmin />} />
            <Route path="*" element={<div className="text-gray-500 p-8">Раздел находится в разработке или не существует.</div>} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
