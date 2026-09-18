import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import ProtectedRoute from './components/ProtectedRoute';

import PublicLayout from './pages/PublicLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ContentCategoryPage from './pages/admin/ContentCategoryPage';
import TextSectionPage from './pages/admin/TextSectionPage';

import AboutPage from './pages/AboutPage';
import AcademicPage from './pages/AcademicPage';
import AchievementPage from './pages/AchievementPage';
import FacilityPage from './pages/FacilityPage';

function ComingSoon({ label }) {
  return <div className="public-section"><h2 className="public-section-title">{label}</h2><p style={{ textAlign: 'center' }}>Halaman ini akan segera dibangun.</p></div>;
}

export default function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/tentang" element={<AboutPage />} />
                <Route path="/akademik" element={<AcademicPage />} />
                <Route path="/prestasi" element={<AchievementPage />} />
                <Route path="/fasilitas" element={<FacilityPage />} />
              </Route>

              <Route path="/controlpanel/login" element={<LoginPage />} />

              <Route
                path="/controlpanel"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="content" element={<Navigate to="/controlpanel/content/banner" replace />} />
                <Route path="content/:category" element={<ContentCategoryPage />} />
                <Route path="text" element={<Navigate to="/controlpanel/text/visi_misi" replace />} />
                <Route path="text/:sectionKey" element={<TextSectionPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}