import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../common/Toast';
import { PGFormModal } from '../forms/PGFormModal';
import { LoginPage } from '../../pages/LoginPage';

export function AdminLayout({ onOpenNewPg, onEditPg, isPgModalOpen, setIsPgModalOpen, pgToEdit }) {
  const { isAuthenticated, currentUser } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const userRole = (currentUser?.role || '').toLowerCase().trim();
  const isAdminRole = ['super admin', 'admin', 'staff', 'property manager'].includes(userRole);

  // If not logged in as admin, redirect to /login
  if (!isAuthenticated || !isAdminRole) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        onOpenNewPgModal={onOpenNewPg}
      />

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNewPgModal={onOpenNewPg}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
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

export default AdminLayout;
