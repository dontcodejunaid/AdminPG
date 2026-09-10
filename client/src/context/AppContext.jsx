import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Active role can be toggled in real-time by the user to test RBAC!
  const [currentUser, setCurrentUser] = useState({
    id: 'usr_1',
    name: 'Junaid (Super Admin)',
    role: 'Super Admin', // 'Super Admin' | 'Admin' | 'Staff'
    email: 'superadmin@keralapg.com',
    permissions: {
      canAddPG: true,
      canEditPG: true,
      canDeletePG: true,
      canVerifyPG: true,
      canManageLocations: true,
      canManageFacilities: true,
      canManageEnquiries: true,
      canManageCustomers: true,
      canModerateReports: true,
      canManagePayments: true,
      canManageCMS: true,
      canManageBanners: true,
      canManageUsers: true
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(2);
  const [stats, setStats] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Switch Role Helper for Testing RBAC
  const switchRole = (newRole) => {
    const rolePermissions = {
      'Super Admin': {
        canAddPG: true,
        canEditPG: true,
        canDeletePG: true,
        canVerifyPG: true,
        canManageLocations: true,
        canManageFacilities: true,
        canManageEnquiries: true,
        canManageCustomers: true,
        canModerateReports: true,
        canManagePayments: true,
        canManageCMS: true,
        canManageBanners: true,
        canManageUsers: true
      },
      'Admin': {
        canAddPG: true,
        canEditPG: true,
        canDeletePG: true,
        canVerifyPG: true,
        canManageLocations: true,
        canManageFacilities: true,
        canManageEnquiries: true,
        canManageCustomers: true,
        canModerateReports: true,
        canManagePayments: false,
        canManageCMS: true,
        canManageBanners: true,
        canManageUsers: false
      },
      'Staff': {
        canAddPG: true,
        canEditPG: true,
        canDeletePG: false,
        canVerifyPG: false,
        canManageLocations: false,
        canManageFacilities: false,
        canManageEnquiries: true,
        canManageCustomers: false,
        canModerateReports: false,
        canManagePayments: false,
        canManageCMS: false,
        canManageBanners: false,
        canManageUsers: false
      }
    };

    const names = {
      'Super Admin': 'Junaid (Super Admin)',
      'Admin': 'Operations Admin',
      'Staff': 'Staff Executive'
    };

    setCurrentUser({
      id: newRole === 'Super Admin' ? 'usr_1' : (newRole === 'Admin' ? 'usr_2' : 'usr_3'),
      name: names[newRole],
      role: newRole,
      email: `${newRole.toLowerCase().replace(' ', '')}@keralapg.com`,
      permissions: rolePermissions[newRole]
    });

    showToast(`Switched active view to: ${newRole}`, 'info');
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      switchRole,
      activeTab,
      setActiveTab,
      darkMode,
      setDarkMode,
      toasts,
      showToast,
      removeToast,
      unreadNotifsCount,
      setUnreadNotifsCount,
      stats,
      setStats,
      refreshTrigger,
      triggerRefresh
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
