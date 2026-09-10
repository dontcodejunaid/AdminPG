import React from 'react';
import { 
  Heart, 
  CreditCard, 
  MessageSquare, 
  ExternalLink, 
  LogOut, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SeekerPortalPage = () => {
  const { currentUser, logout, setDarkMode, darkMode } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-md border border-brand-200/60 dark:border-slate-700">
            <img src="/logo.png" alt="KeralaPG Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Kerala<span className="text-amber-500 font-black">PG</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-brand-100 text-brand-900 dark:bg-brand-950 dark:text-brand-300">
                Seeker Portal
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser?.name}</p>
            <p className="text-[10px] text-slate-400">{currentUser?.phone || currentUser?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        
        {/* Notice Banner about Public Website */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-brand-700/50">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
              <Sparkles className="w-3 h-3" />
              <span>Seeker Account Active</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight">
              Welcome to your KeralaPG Customer Dashboard
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              You are signed in as a PG seeker. Here you can track your saved properties, unlock receipts, and scheduled visits.
            </p>
          </div>

          <a
            href="https://keralapg.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 self-start md:self-auto transition-all hover:scale-105"
          >
            <span>Browse All PGs on KeralaPG.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 Overview Stat Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Saved Wishlist</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">2 PGs</h3>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Active Inquiries</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">2 Leads</h3>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Owner Contact Unlocks</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">1 Unlock (₹19)</h3>
            </div>
          </div>
        </div>

        {/* Wishlist and Unlocks Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            Your Saved & Unlocked PGs
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* PG Item 1 */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80"
                  alt="Malabar Luxury PG"
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Contact Unlocked ✓
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    Malabar Luxury Executive PG for Men
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Kakkanad, Kochi (Near Infopark)</span>
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400">Direct Owner Contact:</span>
                  <p className="font-bold text-slate-900 dark:text-white">+91 98470 12345</p>
                </div>
                <a
                  href="https://wa.me/919847012345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            {/* PG Item 2 */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80"
                  alt="Urban Nest PG"
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Saved in Wishlist
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    Urban Nest Co-Living & Studio PG
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Electronic City Phase 1, Bangalore</span>
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400">Starting from:</span>
                  <p className="font-bold text-brand-600 dark:text-brand-400">₹11,000 / month</p>
                </div>
                <button
                  className="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
                >
                  Unlock Owner (₹19)
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        © {new Date().getFullYear()} KeralaPG.com • Customer Seeker Account
      </footer>

    </div>
  );
};
