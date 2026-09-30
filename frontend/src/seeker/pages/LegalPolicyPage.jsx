import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Lock, ChevronRight, Sparkles, Clock, ArrowLeft } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { api } from '../../services/api';

export default function LegalPolicyPage() {
  const location = useLocation();
  const isPrivacyInitial = location.pathname.includes('privacy');
  
  const [activeTab, setActiveTab] = useState(isPrivacyInitial ? 'privacy' : 'terms');
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.pathname.includes('privacy')) {
      setActiveTab('privacy');
    } else {
      setActiveTab('terms');
    }
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;
    api.getCms()
      .then((res) => {
        if (res && res.data && isMounted) {
          setCmsData(res.data);
        }
      })
      .catch((err) => console.warn('CMS fetch non-blocking error:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const defaultTerms = `1. ACCEPTANCE OF TERMS
By accessing or using the KeralaPG / Aafa Coliving platform, seeker services, or booking a room/stay, you agree to be bound by these Terms & Conditions.

2. ACCOMMODATION & BOOKING POLICIES
- Bookings made through KeralaPG are subject to verification and property check-in approval.
- Direct PG contact access via the platform requires a nominal ₹19 security connection fee.
- Monthly room rentals require 1-month refundable security deposit and 30-day advance vacating notice.
- Daily stays (₹499/day) are subject to room availability and zero security deposit.

3. RESIDENT CODE OF CONDUCT & HOUSE RULES
- Respect for fellow residents, housekeeping staff, and security personnel is mandatory.
- Quiet hours are observed between 10:30 PM and 7:00 AM across all campuses.
- Any form of harassment, illegal substance abuse, or unauthorized property damage will result in immediate termination of stay.

4. PLATFORM ROLE & TRUST & SAFETY
KeralaPG acts as a direct discovery and moderation bridge between seekers and verified property hosts. While we perform stringent quality checks, residents are encouraged to report any discrepancies immediately via our Trust & Safety Moderation portal.`;

  const defaultPrivacy = `1. INFORMATION WE COLLECT
We collect necessary seeker details including your full name, phone number, email address, preferred stay type, and booking enquiries to facilitate direct accommodation matching.

2. HOW WE USE YOUR INFORMATION
- To connect you directly with genuine PG and coliving property owners.
- To provide SMS and WhatsApp booking confirmations, helpline support, and safety alerts.
- To prevent spam, duplicate enquiries, and protect seeker privacy from unauthorized brokers.

3. DATA SECURITY & ENCRYPTION
All seeker and payment transactions are secured using industry-standard SSL encryption and protected PostgreSQL databases. We never sell or share your personal data with third-party advertisers.

4. YOUR DATA RIGHTS & CONTROLS
You may request deletion, review, or correction of your profile and booking details at any time by contacting our helpline desk at support@keralapg.com.`;

  const termsContent = cmsData?.termsAndConditions?.content || defaultTerms;
  const privacyContent = cmsData?.privacyPolicy?.content || defaultPrivacy;

  return (
    <PageTransition>
      <div className="relative pt-28 pb-20 px-4 sm:px-8 max-w-5xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#D4A64A] text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-[#D4A64A]" />
            <span>Trust, Privacy & Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FAF7F0] mb-4 font-sora tracking-tight">
            Platform Policies <span className="text-gradient-gold">& Legal Code</span>
          </h1>
          <p className="text-[#FAF7F0]/80 text-sm sm:text-base">
            Transparent, simple, and straightforward terms designed to protect residents and verified property hosts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-gradient-to-r from-[#D4A64A] to-amber-500 text-[#0B1220] shadow-lg shadow-[#D4A64A]/30 scale-105'
                : 'glass-card text-[#FAF7F0]/80 hover:text-[#FAF7F0] border border-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms & Conditions</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-gradient-to-r from-[#D4A64A] to-amber-500 text-[#0B1220] shadow-lg shadow-[#D4A64A]/30 scale-105'
                : 'glass-card text-[#FAF7F0]/80 hover:text-[#FAF7F0] border border-white/10'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>
        </div>

        {/* Content Box */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl glass-card border border-[#D4A64A]/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden bg-[#0B1220]/90"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-[#FAF7F0]/70">
                {activeTab === 'terms' ? 'Official Terms of Service' : 'Official Seeker Privacy Policy'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#D4A64A] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Live Synced</span>
            </span>
          </div>

          <div className="text-[#FAF7F0]/90 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans space-y-4">
            {activeTab === 'terms' ? termsContent : privacyContent}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F0]/60">
            <span>Questions regarding this policy? Reach our compliance desk at support@keralapg.com</span>
            <Link
              to="/contact"
              className="text-[#D4A64A] hover:underline font-bold flex items-center gap-1"
            >
              <span>Contact Support</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

      </div>
    </PageTransition>
  );
}
