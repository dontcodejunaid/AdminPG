import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { ToastContainer } from './components/common/Toast';

// Auth
import { LoginPage } from './pages/LoginPage';

// Unified Seeker Application (Customer / Public Website)
import { SeekerApp } from './seeker/SeekerApp';

// Admin Modules
import { DashboardHome } from './pages/DashboardHome';
import { PropertiesPage } from './pages/PropertiesPage';
import { LocationsPage } from './pages/LocationsPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { VerificationPage } from './pages/VerificationPage';
import { EnquiriesPage } from './pages/EnquiriesPage';
import { CustomersPage } from './pages/CustomersPage';
import { ReportedPage } from './pages/ReportedPage';
import { FeaturedPage } from './pages/FeaturedPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { PagesCmsPage } from './pages/PagesCmsPage';
import { BannersPage } from './pages/BannersPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';

export function App() {
  const { isAuthenticated, currentUser } = useApp();
  const [isPgModalOpen, setIsPgModalOpen] = useState(false);
  const [pgToEdit, setPgToEdit] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect legacy hash '#admin' to '/admin'
  useEffect(() => {
    if (window.location.hash === '#admin') {
      window.location.hash = '';
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleOpenNewPg = () => {
    setPgToEdit(null);
    setIsPgModalOpen(true);
  };

  const handleOpenEditPg = (pg) => {
    setPgToEdit(pg);
    setIsPgModalOpen(true);
  };

  return (
    <>
      <Routes>
        {/* Admin Portal Hierarchy */}
        <Route
          path="/admin"
          element={
            <AdminLayout
              onOpenNewPg={handleOpenNewPg}
              onEditPg={handleOpenEditPg}
              isPgModalOpen={isPgModalOpen}
              setIsPgModalOpen={setIsPgModalOpen}
              pgToEdit={pgToEdit}
            />
          }
        >
          <Route index element={<DashboardHome onOpenNewPgModal={handleOpenNewPg} onEditPg={handleOpenEditPg} />} />
          <Route path="dashboard" element={<DashboardHome onOpenNewPgModal={handleOpenNewPg} onEditPg={handleOpenEditPg} />} />
          <Route path="properties" element={<PropertiesPage onOpenNewPgModal={handleOpenNewPg} onEditPg={handleOpenEditPg} />} />
          <Route path="locations" element={<LocationsPage />} />
          <Route path="facilities" element={<FacilitiesPage />} />
          <Route path="verifications" element={<VerificationPage onEditPg={handleOpenEditPg} />} />
          <Route path="enquiries" element={<EnquiriesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="reported" element={<ReportedPage onEditPg={handleOpenEditPg} />} />
          <Route path="featured" element={<FeaturedPage onEditPg={handleOpenEditPg} />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="cms" element={<PagesCmsPage />} />
          <Route path="banners" element={<BannersPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>

        {/* Dedicated Login Route */}
        <Route
          path="/login"
          element={<LoginPage onClose={() => navigate('/admin')} />}
        />

        {/* All Seeker Public Portal Routes */}
        <Route
          path="/*"
          element={<SeekerApp onOpenAuthModal={() => setIsAuthModalOpen(true)} />}
        />
      </Routes>

      {/* Global Auth Modal for popup sign-in */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full h-full max-h-screen">
            <LoginPage onClose={() => setIsAuthModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </>
  );
}

export default App;
