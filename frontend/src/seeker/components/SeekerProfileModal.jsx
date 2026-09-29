import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  LogOut, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Building2,
  Sparkles,
  Save,
  Home
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import useScrollLock from '../hooks/useScrollLock';

export default function SeekerProfileModal({ isOpen, onClose }) {
  useScrollLock(isOpen);
  const { currentUser, logout, showToast, isSupabaseConfigured } = useApp();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'bookings'
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'PG Seeker',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    city: currentUser?.city || 'Kochi, Kerala',
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const role = currentUser?.role || 'PG Seeker';
  const isAdminRole = ['super admin', 'admin', 'staff', 'property manager'].includes(role.toLowerCase());

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Save updated user to local state
      const updatedUser = { ...currentUser, ...formData };
      localStorage.setItem('keralapg_auth_user', JSON.stringify(updatedUser));
      if (showToast) showToast('Profile updated successfully!', 'success');
      setTimeout(() => {
        setIsSaving(false);
      }, 500);
    } catch (err) {
      setIsSaving(false);
      if (showToast) showToast('Failed to save profile', 'error');
    }
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  const handleOpenAdmin = () => {
    onClose();
    window.location.hash = '#admin';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl rounded-3xl glass-card border border-[#D4A64A]/30 shadow-2xl bg-[#0B1220]/95 text-[#FAF7F0] overflow-hidden my-auto"
        >
          {/* Header Banner */}
          <div className="relative p-6 bg-gradient-to-r from-[#D4A64A]/20 via-[#0B1220] to-[#D4A64A]/10 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4A64A] via-amber-500 to-amber-700 text-[#0B1220] flex items-center justify-center font-black text-2xl shadow-lg shadow-[#D4A64A]/20 shrink-0">
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-sora text-white">
                    {currentUser?.name || 'My Account'}
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4A64A]/20 text-[#D4A64A] border border-[#D4A64A]/40 font-bold uppercase">
                    {role}
                  </span>
                </div>
                <p className="text-xs text-[#FAF7F0]/65 mt-0.5">{currentUser?.email}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-[#0B1220]">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 px-4 text-xs font-bold font-sora flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'profile'
                  ? 'border-[#D4A64A] text-[#D4A64A] bg-[#D4A64A]/10'
                  : 'border-transparent text-[#FAF7F0]/60 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Personal Details</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 py-3 px-4 text-xs font-bold font-sora flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'bookings'
                  ? 'border-[#D4A64A] text-[#D4A64A] bg-[#D4A64A]/10'
                  : 'border-transparent text-[#FAF7F0]/60 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Visits & Bookings</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#D4A64A] uppercase mb-1.5 font-bold">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#FAF7F0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#D4A64A] focus:ring-1 focus:ring-[#D4A64A] outline-none transition-all"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#D4A64A] uppercase mb-1.5 font-bold">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#FAF7F0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#D4A64A] focus:ring-1 focus:ring-[#D4A64A] outline-none transition-all"
                        placeholder="WhatsApp / Mobile phone"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#D4A64A] uppercase mb-1.5 font-bold">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#FAF7F0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white/50 cursor-not-allowed outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-white/40 mt-1 block">Registered login email</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#D4A64A] uppercase mb-1.5 font-bold">
                      Preferred City / Location
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#FAF7F0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#D4A64A] focus:ring-1 focus:ring-[#D4A64A] outline-none transition-all"
                        placeholder="e.g. Kochi, Bengaluru"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Badges */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Verified KeralaPG Account</p>
                      <p className="text-[10px] text-white/60">Priority key booking & direct host WhatsApp access</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A64A] via-amber-500 to-amber-600 text-[#0B1220] font-bold text-xs shadow-lg shadow-[#D4A64A]/25 hover:shadow-[#D4A64A]/40 transition-all btn-shimmer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#D4A64A]/20 border border-[#D4A64A]/40 text-[#D4A64A] flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Aafa Coliving — Sannidhi Layout</h4>
                      <p className="text-[11px] text-white/70">Daily Stay Special (₹499/day) • Breakfast Included</p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-[#D4A64A] font-mono">
                        <Clock className="w-3 h-3" />
                        <span>Visit scheduled via WhatsApp</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    Dispatched
                  </span>
                </div>

                <p className="text-center text-xs text-white/40 pt-3">
                  Need to schedule another visit or book a room? Explore the listings on the homepage.
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-black/40 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            {isAdminRole ? (
              <button
                onClick={handleOpenAdmin}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D4A64A]/20 hover:bg-[#D4A64A]/30 text-[#D4A64A] border border-[#D4A64A]/40 text-xs font-bold transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Switch to Admin Dashboard →</span>
              </button>
            ) : (
              <span className="text-[11px] text-white/50 font-mono">KeralaPG Seeker Member</span>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors ml-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
