import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bed, Home as HomeIcon, DoorClosed, Clock, CheckCircle2, Calendar, ArrowRight, Phone, MessageSquare, Sparkles, ShieldCheck, Calculator, Coins } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PriceCalculator from '../components/PriceCalculator';
import SavingsCalculator from '../components/SavingsCalculator';
import PromotionalBannerSection from '../components/PromotionalBannerSection';
import { api } from '../../services/api';

export default function RoomsPage({ onOpenBooking }) {
  const [activeSection, setActiveSection] = useState('plans'); // 'plans' | 'calculator' | 'savings' | 'all'
  const [activeTab, setActiveTab] = useState('all');
  const [dbProps, setDbProps] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api.getProperties({ status: 'Active', verificationStatus: 'Verified' })
      .then(res => {
        if (res && res.data && isMounted) {
          setDbProps(res.data);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const getDbPrice = (keyword, fallback) => {
    const found = dbProps.find(p => 
      (p.name || '').toLowerCase().includes(keyword.toLowerCase()) &&
      (p.status || 'Active').toLowerCase() === 'active' &&
      (p.verificationStatus || 'Verified').toLowerCase() === 'verified'
    );
    if (found) {
      if (found.rooms && found.rooms.length > 0) {
        const min = Math.min(...found.rooms.map(r => Number(r.rent) || 99999));
        if (min < 99999) return `₹${min.toLocaleString('en-IN')}`;
      }
      if (found.rent) return `₹${Number(found.rent).toLocaleString('en-IN')}`;
    }
    return fallback;
  };

  const plans = [
    {
      id: '1bhk-fully-furnished',
      title: '1 BHK FULLY FURNISHED',
      category: 'monthly',
      price: getDbPrice('1 BHK', '₹18,000'),
      period: 'month',
      badge: '18k Rent • 18k Deposit',
      image: '/images/1r.jpeg',
      images: [
        "/images/1r.jpeg", "/images/2r.jpeg", "/images/3r.jpeg", "/images/4r.jpeg",
        "/images/5r.jpeg", "/images/6r.jpeg", "/images/7r.jpeg", "/images/8r.jpeg",
        "/images/9r.jpeg", "/images/10r.jpeg", "/images/11r.jpeg", "/images/12r.jpeg",
        "/images/13r.jpeg", "/images/14r.jpeg", "/images/15r.jpeg"
      ],
      includes: [
        '1 BHK Fully Furnished (Hall + Bedroom + Kitchenette)',
        '18k Security Deposit (1 Month)',
        'Aafa Suites Hotel Near By Infosys, Electronic City',
        'Power Back Up & High-Speed Dual WiFi',
        'Washing Machine & 24/7 Hot Water Geyser',
        '3 Times Kerala Food Available'
      ],
      description: 'Aafa Suites Hotel Near By Infosys, 3rd Cross Rd, Krishna Reddy Layout, Electronic City, Konappana Agrahara, Karnataka 560100. Complete fully furnished independent suite for professionals.',
      icon: HomeIcon,
      highlight: true,
    },
    {
      id: 'daily-stay',
      title: 'Daily Stay Special ⭐',
      category: 'daily',
      price: getDbPrice('Daily Stay', '₹499'),
      period: 'day',
      badge: 'Breakfast Free',
      image: '/images/7pg.jpeg',
      images: [
        "/images/7pg.jpeg",
        "/images/8pg.jpeg"
      ],
      includes: ['Hot Kerala Breakfast Included', 'High-Speed WiFi', '24/7 Hot Water Geyser', 'Power Back Up', 'Zero Security Deposit', 'Near HCL Gate no 2, Sannidhi layout'],
      description: 'Ideal for short business trips, interviews, or trial stays near HCL Gate 2 with fresh Kerala breakfast included every morning.',
      icon: Clock,
      highlight: true,
    },
    {
      id: '1-sharing',
      title: '1 Sharing (Private Suite)',
      category: 'monthly',
      price: getDbPrice('1 Sharing', '₹11,499'),
      period: 'month',
      badge: '100% Private',
      image: '/images/1pg.jpeg',
      images: [
        "/images/1pg.jpeg",
        "/images/8pg.jpeg"
      ],
      includes: ['Private Single Bedroom (No Roommates)', '3 Times Kerala Homestyle Food', 'Lounge Area & Entertainment Zone', 'Attached Western Bathroom', 'Power Back Up & High-Speed WiFi', 'Washing Machine & Caretaker'],
      description: 'Dedicated private room with zero roommate interference near HCL Gate 2, Sannidhi layout, Jigani.',
      icon: DoorClosed,
      highlight: true,
    },
    {
      id: '2-sharing',
      title: '2 Sharing (Twin Room)',
      category: 'monthly',
      price: getDbPrice('2 Sharing', '₹7,499'),
      period: 'month',
      badge: 'Most Popular',
      image: '/images/7pg.jpeg',
      images: [
        "/images/7pg.jpeg",
        "/images/8pg.jpeg"
      ],
      includes: ['3 Times Daily Kerala Homestyle Meals', 'Personal Wardrobe & Study Space', 'Lounge Area & Entertainment Zone', 'High-Speed WiFi & Power Back Up', 'Washing Machine & 24/7 Hot Water', 'CCTV & Caretaker Security'],
      description: 'Comfortable twin sharing room in Sannidhi Layout, Jigani designed for tech professionals and students.',
      icon: Bed,
      highlight: true,
    },
    {
      id: '3-sharing',
      title: '3 Sharing (Triple Room)',
      category: 'monthly',
      price: getDbPrice('3 Sharing', '₹5,999'),
      period: 'month',
      badge: 'Value Saver',
      image: '/images/3sharing.png',
      images: [
        "/images/3sharing.png",
        "/images/8pg.jpeg"
      ],
      includes: ['3 Times Daily Kerala Homestyle Meals', 'Spacious Room with Dedicated Storage', 'Lounge & Entertainment Zone', 'High-Speed WiFi & Power Back Up', 'Washing Machine & Self Cooking Area', '24/7 Hot Water & Caretaker'],
      description: 'Spacious triple sharing room offering great value, peaceful living, and authentic homestyle food.',
      icon: Bed,
    },
    {
      id: '4-sharing',
      title: '4 Sharing (Quad Room)',
      category: 'monthly',
      price: getDbPrice('4 Sharing', '₹4,999'),
      period: 'month',
      badge: 'Budget Saver',
      image: '/images/4share.png',
      images: [
        "/images/4share.png",
        "/images/8pg.jpeg"
      ],
      includes: ['3 Times Daily Kerala Homestyle Food', 'Power Back Up & WiFi', 'Washing Machine & Hot Water', 'Self Cooking Area Available', 'CCTV Security & Caretaker', 'Lounge Access'],
      description: 'Ultra-affordable 4 sharing room with complete access to all facilities in Sannidhi Layout, Jigani.',
      icon: HomeIcon,
    },
  ];

  const filteredPlans = activeTab === 'all'
    ? plans
    : plans.filter((p) => p.category === activeTab);

  const handleWhatsApp = (title) => {
    const text = encodeURIComponent(`Hello Aafa Coliving Team! I am interested in checking availability for *${title}* at Aafa Coliving (Near HCL Gate no 2, Sannidhi layout, Jigani). Could you share current move-in details?`);
    window.open(`https://wa.me/919900082615?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageTransition>
      <div className="relative pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#D4A64A] text-xs font-semibold uppercase tracking-wider mb-4">
            <Bed className="w-4 h-4 text-[#D4A64A]" />
            <span>Rooms & Pricing Plans</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FAF7F0] mb-4 font-sora tracking-tight">
            Flexible Accommodation <span className="text-gradient-gold">Tailored for You</span>
          </h1>
          <p className="text-[#FAF7F0]/80 text-sm sm:text-base leading-relaxed">
            Choose from 1BHK suites, 2BHK sharing, single private rooms, or flexible ₹499/day stays across Pan-India.
          </p>
        </div>

        {/* Dynamic Promotional & Sponsored Banner */}
        <div className="mb-8">
          <PromotionalBannerSection
            placement="Search Results Header"
            currentCity="All"
          />
        </div>

        {/* Top-Level Low-Scroll Section Controller */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 rounded-2xl glass-card border border-[#D4A64A]/30 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'plans', label: '🛏️ Living Sanctuaries', icon: Bed },
              { id: 'calculator', label: '💰 Custom Rate Estimator', icon: Calculator },
              { id: 'savings', label: '⚖️ Savings vs Renting Flat', icon: Coins },
              { id: 'all', label: '📜 View All Sequentially', icon: Sparkles },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-[#D4A64A] to-amber-500 text-[#0B1220] shadow-md shadow-[#D4A64A]/30 scale-105'
                    : 'text-[#FAF7F0]/70 hover:text-[#FAF7F0]'
                }`}
                data-cursor="expand"
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: Plans */}
        {(activeSection === 'plans' || activeSection === 'all') && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-16"
          >
            {/* Filter Tabs */}
            <div className="flex justify-center gap-2.5 mb-10 overflow-x-auto pb-2">
              {[
                { id: 'all', label: 'All Living Plans' },
                { id: 'daily', label: '⭐ Daily Stay (₹499/day)' },
                { id: 'monthly', label: 'Monthly Co-Living' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#D4A64A] text-[#0B1220] shadow-md shadow-[#D4A64A]/30'
                      : 'glass-card text-[#FAF7F0]/70 hover:text-[#FAF7F0]'
                  }`}
                  data-cursor="expand"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredPlans.map((plan, idx) => {
                  const Icon = plan.icon;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                      key={plan.id}
                      className={`glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border flex flex-col justify-between group relative overflow-hidden ${
                        plan.highlight ? 'border-[#D4A64A]/40 shadow-xl' : 'border-white/10'
                      }`}
                      data-cursor="expand"
                    >
                      <div>
                        {/* Image Preview */}
                        <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden mb-6 border border-white/10 bg-[#080d1a]">
                          <img
                            src={plan.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
                            alt={plan.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
                            }}
                            className="w-full h-full object-cover object-center transition-transform duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0B1220]/85 backdrop-blur-md text-[#D4A64A] border border-[#D4A64A]/30 text-xs font-bold font-mono">
                            {plan.badge}
                          </div>
                        </div>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-[#D4A64A]/15 border border-[#D4A64A]/30 flex items-center justify-center text-[#D4A64A] shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-extrabold text-[#FAF7F0] font-sora">
                            {plan.title}
                          </h3>
                        </div>

                        <p className="text-[#FAF7F0]/80 text-xs sm:text-sm leading-relaxed mb-6">
                          {plan.description}
                        </p>

                        {/* Price Pill */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 flex items-baseline justify-between">
                          <div>
                            <p className="text-[10px] text-[#FAF7F0]/60 uppercase font-mono">Pricing Rate</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-[#D4A64A] font-sora">
                              {plan.price} <span className="text-xs font-normal text-[#FAF7F0]/60">/ {plan.period}</span>
                            </p>
                          </div>
                          {plan.id === 'daily-stay' && (
                            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-xl border border-emerald-500/30 font-mono">
                              Breakfast Included
                            </span>
                          )}
                        </div>

                        {/* Includes List */}
                        <h4 className="text-xs font-bold text-[#D4A64A] uppercase tracking-wider mb-3 font-mono">
                          What's Included:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                          {plan.includes.map((inc, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-[#FAF7F0]/90">
                              <CheckCircle2 className="w-4 h-4 text-[#D4A64A] shrink-0" />
                              <span>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-4 border-t border-white/10">
                        <button
                          onClick={() => onOpenBooking(plan.title)}
                          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#D4A64A] via-amber-500 to-yellow-600 text-[#0B1220] font-extrabold text-xs sm:text-sm shadow-lg shadow-[#D4A64A]/30 hover:shadow-[#D4A64A]/50 transition-all btn-shimmer"
                        >
                          <Calendar className="w-4 h-4 stroke-[2.5]" />
                          <span>Book Room</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <a
                          href="tel:9900082615"
                          className="w-full sm:w-auto px-3.5 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                          title="Call Desk (+91 99000 82615)"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>

                        <button
                          onClick={() => handleWhatsApp(plan.title)}
                          className="w-full sm:w-auto px-3.5 py-3 rounded-xl glass-card text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/15 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                          title="Enquire on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                        </button>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Section 2: Interactive Cost Calculator */}
        {(activeSection === 'calculator' || activeSection === 'all') && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-16"
          >
            <div className="rounded-3xl glass-card border border-[#D4A64A]/30 p-4 sm:p-8">
              <PriceCalculator onOpenBooking={onOpenBooking} />
            </div>
          </motion.div>
        )}

        {/* Section 3: Savings Tool */}
        {(activeSection === 'savings' || activeSection === 'all') && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-16"
          >
            <div className="rounded-3xl glass-card border border-[#D4A64A]/30 p-4 sm:p-8">
              <SavingsCalculator onOpenBooking={onOpenBooking} />
            </div>
          </motion.div>
        )}

      </div>
    </PageTransition>
  );
}
