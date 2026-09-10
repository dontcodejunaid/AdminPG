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
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header = ({ onOpenMobileMenu, onOpenNewPgModal }) => {
  const { 
    currentUser, 
    switchRole, 
    darkMode, 
    setDarkMode, 
    unreadNotifsCount, 
    setActiveTab 
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles = [
    { name: 'Super Admin', desc: 'Unrestricted Full Access' },
    { name: 'Admin', desc: 'Properties, Leads & Operations' },
    { name: 'Staff', desc: 'Add/Edit PGs only (No Deletion/Payments)' }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#081c14]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#1b4332] px-4 sm:px-6 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-emerald-50 dark:hover:bg-[#143628]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Live Search */}
        <div className="hidden sm:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search PGs, leads, phone, area..."
            className="w-64 md:w-80 pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-[#0f291e] text-slate-800 dark:text-emerald-100 border border-transparent focus:border-[#2d6a4f] focus:bg-white dark:focus:bg-[#04100b] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-[#2d6a4f] bg-amber-50/50 dark:bg-[#0f291e] hover:bg-amber-100/60 dark:hover:bg-[#143628] transition-colors text-xs font-semibold text-[#1b4332] dark:text-emerald-200"
            title="Switch user role to test permissions"
          >
            <ShieldCheck className="w-4 h-4 text-[#d97706] dark:text-[#f59e0b]" />
            <span className="hidden md:inline">Role:</span>
            <span className="text-[#1b4332] dark:text-[#f59e0b] font-extrabold">{currentUser.role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#081c14] border border-slate-200 dark:border-[#2d6a4f] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-[#1b4332]">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#52b788]">
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
                      currentUser.role === r.name 
                        ? 'bg-emerald-50 text-[#1b4332] dark:bg-[#143628] dark:text-emerald-200 font-bold border border-emerald-200 dark:border-[#2d6a4f]' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0f291e]'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">{r.desc}</p>
                    </div>
                    {currentUser.role === r.name && <Check className="w-4 h-4 text-[#d97706] flex-shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-[#143628] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#081c14]" />
          )}
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-[#143628] transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-[#f59e0b]" /> : <Moon className="w-4 h-4 text-[#1b4332]" />}
        </button>

        {/* Quick Add Button */}
        {currentUser.permissions.canAddPG && (
          <button
            onClick={onOpenNewPgModal}
            className="hidden sm:flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] hover:from-[#143628] hover:to-[#1b4332] text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-[#f59e0b]" />
            <span>Add PG</span>
          </button>
        )}
      </div>
    </header>
  );
};
