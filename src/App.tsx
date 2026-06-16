/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Certificates from './pages/Certificates';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import SystemAdmin from './pages/admin/SystemAdmin';
import HomeAdmin from './pages/admin/HomeAdmin';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import BlogAdmin from './pages/admin/BlogAdmin';
import PricesAdmin from './pages/admin/PricesAdmin';
import CasesAdmin from './pages/admin/CasesAdmin';
import FaqAdmin from './pages/admin/FaqAdmin';
import ReviewsAdmin from './pages/admin/ReviewsAdmin';
import ContactsAdmin from './pages/admin/ContactsAdmin';
import LeadsAdmin from './pages/admin/LeadsAdmin';
import BuilderAdmin from './pages/admin/BuilderAdmin';
import ApiKeysAdmin from './pages/admin/ApiKeysAdmin';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services/*" element={<Navigate to="/#contact" replace />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="home" element={<HomeAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="prices" element={<PricesAdmin />} />
          <Route path="cases" element={<CasesAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="faq" element={<FaqAdmin />} />
          <Route path="reviews" element={<ReviewsAdmin />} />
          <Route path="contacts" element={<ContactsAdmin />} />
          <Route path="leads" element={<LeadsAdmin />} />
          <Route path="builder" element={<BuilderAdmin />} />
          <Route path="system" element={<SystemAdmin />} />
          <Route path="api-keys" element={<ApiKeysAdmin />} />
          <Route path="*" element={<div className="text-gray-500 p-8">Раздел находится в разработке или не существует.</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
