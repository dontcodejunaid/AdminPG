import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Moon, 
  Sun, 
  Bell, 
  ShieldCheck, 
  ChevronDown, 
  Plus, 
  Check,
  LogOut,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header = ({ onOpenMobileMenu, onOpenNewPgModal }) => {
  const { 
    currentUser, 
    switchRole, 
    logout,
    darkMode, 
    setDarkMode, 
    unreadNotifsCount, 
    setActiveTab 
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const roles = [
    { name: 'Super Admin', desc: 'Unrestricted Full Access' },
    { name: 'Admin', desc: 'Properties, Leads & Operations' },
    { name: 'Staff', desc: 'Add/Edit PGs only (No Deletion/Payments)' }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Live Search */}
        <div className="hidden sm:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search PGs, leads, phone, area..."
            className="w-64 md:w-80 pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/60 hover:bg-brand-100/60 dark:hover:bg-brand-900/40 transition-colors text-xs font-semibold text-brand-900 dark:text-brand-200"
            title="Switch user role to test permissions"
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span className="hidden md:inline">Role:</span>
            <span className="text-brand-900 dark:text-amber-400 font-extrabold">{currentUser?.role || 'Admin'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Role (RBAC Demo)
                </p>
              </div>
              <div className="py-1 space-y-1">
                {roles.map(r => (
                  <button
                    key={r.name}
                    onClick={() => {
                      switchRole(r.name);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-start justify-between p-2.5 rounded-xl text-left text-xs transition-colors ${
                      currentUser?.role === r.name 
                        ? 'bg-brand-50 text-brand-900 dark:bg-brand-950/60 dark:text-brand-200 font-bold border border-brand-200 dark:border-brand-800' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">{r.desc}</p>
                    </div>
                    {currentUser?.role === r.name && <Check className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Quick Add Button */}
        {currentUser?.permissions?.canAddPG && (
          <button
            onClick={onOpenNewPgModal}
            className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Add PG</span>
          </button>
        )}

        {/* User Profile / Logout Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-800 flex items-center justify-center font-black text-xs hover:ring-2 hover:ring-brand-500/30 transition-all"
            title="User Profile & Settings"
          >
            {currentUser?.name?.charAt(0) || 'A'}
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name || 'Administrator'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {currentUser?.email || 'admin@keralapg.com'}
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  {currentUser?.role || 'Super Admin'}
                </span>
              </div>

              <div className="pt-1.5">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
