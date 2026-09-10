import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  MapPin, 
  Sparkles, 
  BadgeCheck, 
  MessageSquareText, 
  Users, 
  AlertOctagon, 
  Star, 
  CreditCard, 
  FileText, 
  Image as ImageIcon, 
  Bell, 
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen, onOpenNewPgModal }) => {
  const { activeTab, setActiveTab, currentUser, unreadNotifsCount } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Home', icon: LayoutDashboard, category: 'Overview', moduleNum: '1' },
    
    // Core Property Ops
    { id: 'properties', label: 'PG Management', icon: Building2, category: 'Properties', moduleNum: '2 & 3', highlight: true },
    { id: 'locations', label: 'Locations (City/Area)', icon: MapPin, category: 'Properties', moduleNum: '4' },
    { id: 'facilities', label: 'Facilities & Amenities', icon: Sparkles, category: 'Properties', moduleNum: '5' },
    { id: 'verifications', label: 'Verification Hub', icon: BadgeCheck, category: 'Properties', moduleNum: '6' },
    { id: 'featured', label: 'Featured PGs', icon: Star, category: 'Properties', moduleNum: '10' },

    // Leads & CRM
    { id: 'enquiries', label: 'Customer Enquiries', icon: MessageSquareText, category: 'Growth & CRM', moduleNum: '7' },
    { id: 'customers', label: 'Customer Registry', icon: Users, category: 'Growth & CRM', moduleNum: '8' },
    { id: 'payments', label: 'Payments & ₹19 Log', icon: CreditCard, category: 'Growth & CRM', moduleNum: '11' },

    // Moderation & Marketing
    { id: 'reported', label: 'Reported Listings', icon: AlertOctagon, category: 'Trust & Safety', moduleNum: '9' },
    { id: 'banners', label: 'Banners & Ads', icon: ImageIcon, category: 'Marketing', moduleNum: '13' },
    { id: 'cms', label: 'Pages & Content', icon: FileText, category: 'Marketing', moduleNum: '12' },

    // System
    { id: 'notifications', label: 'Activity & Alerts', icon: Bell, category: 'System', moduleNum: '14' },
    { id: 'users', label: 'Admin Users & Roles', icon: ShieldAlert, category: 'System', moduleNum: '15' }
  ];

  // Group nav items by category
  const categories = ['Overview', 'Properties', 'Growth & CRM', 'Trust & Safety', 'Marketing', 'System'];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Header with Emblem Logo */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-brand-50/30 dark:bg-brand-950/20">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-md border border-brand-200/60 dark:border-slate-700 flex-shrink-0">
              <img
                src="/logo.png"
                alt="KeralaPG Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-brand-900 dark:text-white">
                  Kerala<span className="text-amber-500 font-black">PG</span>
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Master Operations Hub
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {categories.map(cat => {
            const items = navItems.filter(item => item.category === cat);
            if (items.length === 0) return null;

            return (
              <div key={cat} className="space-y-1">
                <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {cat}
                </h4>
                {items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-brand-50 text-brand-800 dark:bg-brand-950/80 dark:text-brand-300 font-bold shadow-sm border border-brand-200/60 dark:border-brand-800/40' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-400'
                        }`} />
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.highlight && (
                          <span className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold px-1.5 py-0.5 rounded">
                            Core
                          </span>
                        )}
                        {item.id === 'notifications' && unreadNotifsCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {unreadNotifsCount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Quick PG Add CTA */}
        {currentUser.permissions.canAddPG && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              onClick={() => onOpenNewPgModal()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white text-sm font-bold shadow-md shadow-brand-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>+ Add New PG Property</span>
            </button>
          </div>
        )}

        {/* Active Role Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 flex items-center justify-center text-xs font-black">
              {currentUser.name.charAt(0)}
            </div>
            <div className="truncate max-w-[130px]">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold truncate">
                {currentUser.role}
              </p>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};
