import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/Toast';
import { PGFormModal } from './components/forms/PGFormModal';

// Auth
import { LoginPage } from './pages/LoginPage';

import { SeekerPortalPage } from './pages/SeekerPortalPage';

// Pages for all 15 modules
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
  const { activeTab, isAuthenticated, currentUser } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPgModalOpen, setIsPgModalOpen] = useState(false);
  const [pgToEdit, setPgToEdit] = useState(null);

  // If user is not signed in, show the Universal Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Check if user is an Admin vs Seeker/Customer
  const roleLower = (currentUser?.role || '').toLowerCase().trim();
  const isAdminRole = roleLower === 'super admin' || roleLower === 'admin' || roleLower === 'staff' || roleLower === 'property manager';
  const isCustomerUser = !isAdminRole || ['seeker', 'customer', 'user', 'pg seeker', 'tenant', 'guest'].includes(roleLower);

  if (isCustomerUser) {
    return (
      <>
        <SeekerPortalPage />
        <ToastContainer />
      </>
    );
  }

  const handleOpenNewPg = () => {
    setPgToEdit(null);
    setIsPgModalOpen(true);
  };

  const handleOpenEditPg = (pg) => {
    setPgToEdit(pg);
    setIsPgModalOpen(true);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome onOpenNewPgModal={handleOpenNewPg} onEditPg={handleOpenEditPg} />;
      case 'properties':
        return <PropertiesPage onOpenNewPgModal={handleOpenNewPg} onEditPg={handleOpenEditPg} />;
      case 'locations':
        return <LocationsPage />;
      case 'facilities':
        return <FacilitiesPage />;
      case 'verifications':
        return <VerificationPage onEditPg={handleOpenEditPg} />;
      case 'enquiries':
        return <EnquiriesPage />;
      case 'customers':
        return <CustomersPage />;
      case 'reported':
        return <ReportedPage onEditPg={handleOpenEditPg} />;
      case 'featured':
        return <FeaturedPage onEditPg={handleOpenEditPg} />;
      case 'payments':
        return <PaymentsPage />;
      case 'cms':
        return <PagesCmsPage />;
      case 'banners':
        return <BannersPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'users':
        return currentUser?.role === 'Super Admin' 
          ? <AdminUsersPage /> 
          : <DashboardHome onOpenNewPgModal={handleOpenNewPg} onEditPg={handleOpenEditPg} />;
      default:
        return <DashboardHome onOpenNewPgModal={handleOpenNewPg} onEditPg={handleOpenEditPg} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        onOpenNewPgModal={handleOpenNewPg}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNewPgModal={handleOpenNewPg}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global PG Form Modal (Add / Edit) */}
      <PGFormModal
        isOpen={isPgModalOpen}
        onClose={() => setIsPgModalOpen(false)}
        pgToEdit={pgToEdit}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
