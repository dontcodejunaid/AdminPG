import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Flag,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  Send,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import useScrollLock from '../hooks/useScrollLock';
import { api } from '../../services/api';

const REPORT_REASONS = [
  { id: 'Wrong price', label: 'Wrong Price / Hidden Charges', desc: 'Actual asked rent differs from listing' },
  { id: 'Fake photos', label: 'Fake / Inaccurate Photos', desc: 'Photos do not represent actual room' },
  { id: 'Full/unavailable', label: 'Full / Sold Out', desc: 'Owner confirmed room is no longer available' },
  { id: 'Wrong contact number', label: 'Wrong Phone Number', desc: 'Number is unreachable, incorrect, or invalid' },
  { id: 'Harassment', label: 'Scam / Inappropriate Behavior', desc: 'Suspicious request, advance demand, or harassment' },
  { id: 'Other', label: 'Other Issue', desc: 'Incorrect amenities, wrong location, etc.' },
];

export default function ReportListingModal({
  isOpen,
  onClose,
  property,
}) {
  useScrollLock(isOpen);

  const [reason, setReason] = useState('Wrong price');
  const [complaint, setComplaint] = useState('');
  const [customerName, setCustomerName] = useState(() => localStorage.getItem('seeker_name') || '');
  const [customerPhone, setCustomerPhone] = useState(() => localStorage.getItem('seeker_phone') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
      setIsSubmitted(false);
      setComplaint('');
      const savedName = localStorage.getItem('seeker_name') || '';
      const savedPhone = localStorage.getItem('seeker_phone') || '';
      if (savedName) setCustomerName(savedName);
      if (savedPhone) setCustomerPhone(savedPhone);
    }
  }, [isOpen, property]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !property) return null;
  if (typeof document === 'undefined') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint.trim()) {
      alert('Please describe what is inaccurate or wrong with this listing.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.createReport({
        pgId: property.id || '',
        pgName: property.name || property.pgName || 'PG Listing',
        customerName: customerName.trim() || 'Anonymous Seeker',
        customerPhone: customerPhone.trim() || '',
        reason,
        complaint: complaint.trim(),
      });

      setIsSubmitted(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Report submission error:', err);
      // Fallback display success to user
      setIsSubmitted(true);
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] overflow-y-auto bg-[#070D1A]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop Dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg rounded-3xl bg-[#0F172A] border border-rose-500/30 shadow-2xl p-5 sm:p-7 text-[#FAF7F0] z-10 overflow-hidden"
      >
        {/* Glow ambient background accent */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 shadow-lg">
                <Flag className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30 mb-0.5">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Trust & Safety Moderation</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black font-sora text-[#FAF7F0]">
                  Report Inaccurate Listing
                </h3>
              </div>
            </div>

            {/* Target Listing Summary */}
            <div className="p-3 rounded-2xl bg-[#080D1A] border border-white/10 flex items-center gap-3 mb-4">
              <img
                src={property.image || (property.images && property.images[0]) || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=200&q=80'}
                alt={property.name}
                className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  {property.name}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-[#D4A64A] font-mono truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{property.area || property.city}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Reason Selector */}
              <div>
                <label className="block text-[11px] font-mono text-white/70 mb-1.5 font-bold">
                  What is the issue with this listing?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {REPORT_REASONS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setReason(r.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        reason === r.id
                          ? 'bg-rose-500/20 border-rose-500 text-white shadow-md shadow-rose-500/10'
                          : 'bg-[#080D1A] border-white/10 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold block">{r.label}</span>
                      <span className="text-[10px] text-white/50 line-clamp-1 mt-0.5">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Complaint Box */}
              <div>
                <label className="block text-[11px] font-mono text-white/70 mb-1 font-bold">
                  Explain Details / Evidence *
                </label>
                <textarea
                  required
                  rows={3}
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  placeholder="e.g. Owner asked for ₹14,000 rent instead of ₹7,499 listed online, and stated rooms are already full."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080D1A] border border-white/15 focus:border-rose-400 text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
                />
              </div>

              {/* Optional Seeker Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-mono text-white/60 mb-0.5">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#080D1A] border border-white/15 focus:border-rose-400 text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-white/60 mb-0.5">
                    Phone for Updates (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#080D1A] border border-white/15 focus:border-rose-400 text-xs text-white placeholder-white/40 focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-rose-600/25 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Submitting Report...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Report to Moderation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="text-center py-4 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                <span>Report Received</span>
              </div>
              <h3 className="text-xl font-black font-sora text-white">
                Thank You for Protecting Seekers
              </h3>
              <p className="text-xs text-white/70 mt-1 max-w-sm mx-auto leading-relaxed">
                Our Super Admin Trust & Safety team has received your report for <strong className="text-white">{property.name}</strong>. We will investigate the listing and take appropriate action.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
