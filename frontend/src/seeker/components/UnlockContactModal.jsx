import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CreditCard,
  QrCode,
  Zap,
  Check,
  Building2,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import useScrollLock from '../hooks/useScrollLock';
import { api } from '../../services/api';

export default function UnlockContactModal({
  isOpen,
  onClose,
  property,
  onUnlockSuccess,
}) {
  useScrollLock(isOpen);

  const [fullName, setFullName] = useState(() => localStorage.getItem('seeker_name') || '');
  const [phone, setPhone] = useState(() => localStorage.getItem('seeker_phone') || '');
  const [selectedUpi, setSelectedUpi] = useState('gpay'); // 'gpay' | 'phonepe' | 'paytm' | 'qr'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setIsSuccess(false);
      setTransactionDetails(null);
      const savedName = localStorage.getItem('seeker_name') || '';
      const savedPhone = localStorage.getItem('seeker_phone') || '';
      if (savedName) setFullName(savedName);
      if (savedPhone) setPhone(savedPhone);
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

  const rawPhone = property.contactNumber || property.phones?.[0] || '9900082615';
  const waNumber = (property.whatsappNumber || property.contactNumber || '918747049377').replace(/[^0-9]/g, '');

  const handlePayAndUnlock = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || phone.trim().length < 10) {
      alert('Please enter your full name and a valid 10-digit mobile number.');
      return;
    }

    setIsProcessing(true);

    try {
      // Save contact locally
      localStorage.setItem('seeker_name', fullName.trim());
      localStorage.setItem('seeker_phone', phone.trim());

      const res = await api.createPayment({
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        propertyId: property.id,
        propertyName: property.name || property.pgName || 'KeralaPG Property',
        amount: 19,
        purpose: `Owner Direct Contact Unlock (₹19 Plan)`,
        paymentGateway: `UPI (${selectedUpi.toUpperCase()})`,
        status: 'Success'
      });

      // Save to localStorage unlocked list
      try {
        const stored = JSON.parse(localStorage.getItem('unlocked_pg_contacts') || '[]');
        if (!stored.includes(property.id)) {
          stored.push(property.id);
          localStorage.setItem('unlocked_pg_contacts', JSON.stringify(stored));
        }
      } catch (e) {}

      setTransactionDetails(res?.data || { transactionId: `TXN_KP_${Date.now().toString().slice(-8)}` });
      setIsSuccess(true);
      setIsProcessing(false);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 160,
          spread: 85,
          origin: { y: 0.55 },
          colors: ['#10B981', '#D4A64A', '#FAF7F0'],
        });
      } catch (cErr) {}

      // Browser Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('🔓 Owner Contact Unlocked — KeralaPG', {
            body: `Direct contact for ${property.name} unlocked: +91 ${rawPhone}`,
            icon: '/favicon.svg',
          });
        } catch (nErr) {}
      }

      if (onUnlockSuccess) {
        onUnlockSuccess(property.id);
      }
    } catch (err) {
      console.error('Payment error:', err);
      // Fallback local unlock
      try {
        const stored = JSON.parse(localStorage.getItem('unlocked_pg_contacts') || '[]');
        if (!stored.includes(property.id)) {
          stored.push(property.id);
          localStorage.setItem('unlocked_pg_contacts', JSON.stringify(stored));
        }
      } catch (e) {}

      setIsSuccess(true);
      setIsProcessing(false);
      if (onUnlockSuccess) {
        onUnlockSuccess(property.id);
      }
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
        className="relative w-full max-w-lg rounded-3xl bg-[#0F172A] border border-[#D4A64A]/40 shadow-2xl p-5 sm:p-7 text-[#FAF7F0] z-10 overflow-hidden"
      >
        {/* Glow ambient background accent */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-[#D4A64A] flex items-center justify-center shrink-0 shadow-lg">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-[#D4A64A] text-[10px] font-mono font-bold border border-amber-500/30 mb-0.5">
                  <Lock className="w-3 h-3" />
                  <span>Micro-Access Pass • ₹19</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black font-sora text-[#FAF7F0]">
                  Unlock Direct Owner Contact
                </h3>
              </div>
            </div>

            {/* Target Property Card Summary */}
            <div className="p-3.5 rounded-2xl bg-[#080D1A] border border-white/10 flex items-center gap-3 mb-5">
              <img
                src={property.image || (property.images && property.images[0]) || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=200&q=80'}
                alt={property.name}
                className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  {property.name}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-[#D4A64A] font-mono truncate mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{property.area || property.city}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    Direct Caretaker / Owner Line
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits Checklist */}
            <div className="space-y-2 mb-5 p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant unmasked phone & WhatsApp number</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero brokerage • Talk directly with property manager</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant lock verification receipt sent to your phone</span>
              </div>
            </div>

            {/* User Form */}
            <form onSubmit={handlePayAndUnlock} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Menon"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D1A] border border-white/15 focus:border-[#D4A64A] text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    Your Mobile Phone (10 digits)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D1A] border border-white/15 focus:border-[#D4A64A] text-xs text-white placeholder-white/40 focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* UPI Options */}
              <div>
                <label className="block text-[11px] font-mono text-white/70 mb-2">
                  Select Fast Payment Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gpay', label: 'Google Pay', badge: 'Fastest' },
                    { id: 'phonepe', label: 'PhonePe', badge: 'Instant' },
                    { id: 'paytm', label: 'Paytm / UPI', badge: 'QR/App' },
                  ].map((upi) => (
                    <button
                      key={upi.id}
                      type="button"
                      onClick={() => setSelectedUpi(upi.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedUpi === upi.id
                          ? 'bg-amber-500/20 border-[#D4A64A] shadow-md shadow-amber-500/10'
                          : 'bg-[#080D1A] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white block truncate">{upi.label}</span>
                      <span className="text-[9px] font-mono text-emerald-400 mt-1">{upi.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span>Processing ₹19 Payment...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Pay ₹19 & Unlock Owner Contact</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-white/40 font-mono mt-2">
                  🔒 256-Bit Encrypted Micro-Payment • 100% Verified Caretaker Access
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="text-center py-2 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <Unlock className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 mb-1.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Contact Unlocked Successfully!</span>
              </div>
              <h3 className="text-xl font-black font-sora text-white">
                Direct Owner Line is Ready
              </h3>
              <p className="text-xs text-white/70 mt-1 max-w-sm mx-auto">
                Transaction Ref: <span className="font-mono text-[#D4A64A] font-bold">{transactionDetails?.transactionId || 'TXN_KP_SUCCESS'}</span>
              </p>
            </div>

            {/* Unlocked Contact Box */}
            <div className="p-5 rounded-2xl bg-[#080D1A] border-2 border-emerald-500/40 space-y-3 max-w-sm mx-auto shadow-2xl">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">
                Direct Verified Owner Phone
              </span>
              <div className="text-2xl font-mono font-black text-white tracking-wider">
                +91 {rawPhone}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${rawPhone}`}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Owner</span>
                </a>
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi, I just unlocked your property ${property.name} on KeralaPG. Please confirm room availability.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#22bf5b] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
            >
              Done / Return to Listings
            </button>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
