import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Check localStorage for persisted user login
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('keralapg_auth_user');
      if (!saved) return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return Boolean(localStorage.getItem('keralapg_auth_user'));
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTabState] = useState('dashboard');
  const [pageFilters, setPageFilters] = useState({});

  const setActiveTab = (tab, filters = {}) => {
    setPageFilters(filters || {});
    setActiveTabState(tab);
  };

  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(2);
  const [stats, setStats] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Custom Confirm Alert Dialog State
  const [confirmState, setConfirmState] = useState(null);

  const confirm = ({
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    type = 'danger'
  }) => {
    return new Promise((resolve) => {
      setConfirmState({
        title,
        message,
        confirmText,
        cancelText,
        type,
        isOpen: true,
        onConfirm: () => {
          setConfirmState(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(null);
          resolve(false);
        }
      });
    });
  };

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

  // Supabase OAuth (Google Sign-In) session handler & account unifier
  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const u = session.user;
          const userEmail = u.email;
          const fullName = u.user_metadata?.full_name || u.user_metadata?.name || userEmail?.split('@')[0];
          const avatar = u.user_metadata?.avatar_url || u.user_metadata?.picture || '';

          try {
            // Unify with existing database account (Super Admin, Admin, Staff, or Customer)
            const res = await api.oauthSync({
              email: userEmail,
              name: fullName,
              avatar: avatar,
              authUserId: u.id
            });

            if (res.success && res.data) {
              const matchedUser = res.data;
              login(matchedUser, res.token || session.access_token);
              return;
            }
          } catch (syncErr) {
            console.warn('OAuth sync endpoint fallback:', syncErr);
          }

          // Fallback if backend sync had an issue
          const fallbackUser = {
            id: u.id,
            email: userEmail,
            name: fullName,
            role: 'Customer',
            avatar: avatar,
            permissions: {
              canAddPG: false,
              canEditPG: false,
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
          login(fallbackUser, session.access_token);
        }
      });
      return () => subscription?.unsubscribe();
    }
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Login Handler
  const login = (userData, token) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('keralapg_auth_user', JSON.stringify(userData));
      if (token) localStorage.setItem('keralapg_auth_token', token);
    } catch (e) {
      console.error('Storage error:', e);
    }
    showToast(`Welcome back, ${userData.name}!`, 'success');
  };

  // Logout Handler
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('keralapg_auth_user');
      localStorage.removeItem('keralapg_auth_token');
    } catch (e) {
      console.error('Storage error:', e);
    }
    showToast('Logged out successfully', 'info');
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
      'Super Admin': 'Super Admin',
      'Admin': 'Operations Admin',
      'Staff': 'Staff Executive'
    };

    const updatedUser = {
      id: newRole === 'Super Admin' ? 'usr_1' : (newRole === 'Admin' ? 'usr_2' : 'usr_3'),
      name: names[newRole],
      role: newRole,
      email: `${newRole.toLowerCase().replace(' ', '')}@keralapg.com`,
      permissions: rolePermissions[newRole]
    };

    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('keralapg_auth_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }

    showToast(`Switched active view to: ${newRole}`, 'info');
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated,
      login,
      logout,
      switchRole,
      activeTab,
      setActiveTab,
      pageFilters,
      setPageFilters,
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
      triggerRefresh,
      confirm
    }}>
      {children}
      {confirmState && <ConfirmDialog {...confirmState} />}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
