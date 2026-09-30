import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Calendar, Phone, ArrowRight, ShieldCheck, Utensils, Wifi, Zap, Star, MapPin, CheckCircle2, ChevronDown, Award, Users, HeartHandshake, ZoomIn, Building2, Bed, MessageSquare, Layers, SlidersHorizontal, Search, Compass
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Hero3DCanvas from '../components/Hero3DCanvas';
import PriceCalculator from '../components/PriceCalculator';
import TodayLiveKitchen from '../components/TodayLiveKitchen';
import SavingsCalculator from '../components/SavingsCalculator';
import NeighborhoodExplorer from '../components/NeighborhoodExplorer';
import AmenitiesGrid from '../components/AmenitiesGrid';
import DiningMarquee from '../components/DiningMarquee';
import TestimonialsOrbit from '../components/TestimonialsOrbit';
import FloatingQuickDock from '../components/FloatingQuickDock';
import HomePgFilterModal from '../components/HomePgFilterModal';
import FindYourSpacePanel from '../components/BookingFlow/FindYourSpacePanel';
import MatchingRoomsSection from '../components/BookingFlow/MatchingRoomsSection';
import RoomDetailsModal from '../components/BookingFlow/RoomDetailsModal';
import StayPlanModal from '../components/BookingFlow/StayPlanModal';
import FindSpaceLogo from '../components/FindSpaceLogo';
import PromotionalBannerSection from '../components/PromotionalBannerSection';
import { locations } from '../data/locationsData';
import { transformDbProperty, registerDynamicFacilities } from '../data/pgListingsData';
import { api } from '../../services/api';

export default function Home({ onOpenBooking, onSelectRoom }) {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [roomCategoryTab, setRoomCategoryTab] = useState('all');
  const [dbProps, setDbProps] = useState([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [cmsData, setCmsData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.getFacilities()
      .then(res => {
        if (res && res.data && isMounted) {
          registerDynamicFacilities(res.data);
        }
      })
      .catch(() => {});

    api.getCms()
      .then(res => {
        if (res && res.data && isMounted) {
          setCmsData(res.data);
        }
      })
      .catch(() => {});

    api.getProperties({ status: 'Active', verificationStatus: 'Verified' })
      .then(res => {
        if (res && res.data && isMounted) {
          setDbProps(res.data);
          setIsDbLoaded(true);
        }
      })
      .catch(() => {
        if (isMounted) setIsDbLoaded(true);
      });
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

  // Filter Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Dynamic Booking Flow State
  const [bookingFilters, setBookingFilters] = useState({
    location: 'all',
    stayType: 'month',
    roomType: 'all',
    sharing: 'all',
    gender: 'all',
    checkInDate: new Date().toISOString().split('T')[0],
    duration: '1 Month',
    durationValue: 1,
  });

  const [selectedRoomForPlan, setSelectedRoomForPlan] = useState(null);
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState(null);

  const handleSearchRooms = (newFilters) => {
    setBookingFilters((prev) => ({ ...prev, ...newFilters }));
    setTimeout(() => {
      const el = document.getElementById('matching-rooms-results');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleEditFilters = (overrides) => {
    if (overrides) {
      setBookingFilters((prev) => ({ ...prev, ...overrides }));
    }
    const el = document.getElementById('find-your-space-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Low-Scroll Master Deck Navigation State
  const [activeMasterDeck, setActiveMasterDeck] = useState('living'); // 'living' | 'dining' | 'campus' | 'reviews'
  const [livingSubTab, setLivingSubTab] = useState('rooms'); // 'rooms' | 'calculator' | 'savings' | 'hotspots'
  const [diningSubTab, setDiningSubTab] = useState('live-kitchen'); // 'live-kitchen' | 'dining-marquee'
  const [campusSubTab, setCampusSubTab] = useState('commute'); // 'commute' | 'amenities' | 'comparison'
  const [reviewsSubTab, setReviewsSubTab] = useState('testimonials'); // 'testimonials' | 'faq' | 'expansion'

  // Browsing Mode: 'compact' (low scroll interactive deck) or 'expanded' (full sequential scroll)
  const [displayMode, setDisplayMode] = useState('compact');

  // FAQ Quick Search & Filter
  const [faqSearch, setFaqSearch] = useState('');

  const aafa1BhkImages = [
    "/images/1r.jpeg", "/images/2r.jpeg", "/images/3r.jpeg", "/images/4r.jpeg",
    "/images/5r.jpeg", "/images/6r.jpeg", "/images/7r.jpeg", "/images/8r.jpeg",
    "/images/9r.jpeg", "/images/10r.jpeg", "/images/11r.jpeg", "/images/12r.jpeg",
    "/images/13r.jpeg", "/images/14r.jpeg", "/images/15r.jpeg"
  ];

  // 4 Interactive Room Feature Hotspots
  const roomHotspots = [
    {
      id: 1,
      x: '25%',
      y: '35%',
      title: 'Orthopedic Mattress',
      desc: '8-inch high-density memory foam for deep restful sleep after long shifts.',
    },
    {
      id: 2,
      x: '70%',
      y: '45%',
      title: 'Ergonomic Workstation',
      desc: 'Surge-protected study desk with warm reading lights & power sockets.',
    },
    {
      id: 3,
      x: '82%',
      y: '20%',
      title: '1GBPS Dual Fiber Wi-Fi',
      desc: 'Dedicated high-speed fiber connection ensuring zero work-from-home lag.',
    },
    {
      id: 4,
      x: '45%',
      y: '75%',
      title: 'Attached Western Washroom',
      desc: 'Pristine attached western bathroom with 24/7 hot water geyser & daily cleaning.',
    },
  ];

  // Curated room plans dynamically derived from Admin database properties
  const featuredRooms = useMemo(() => {
    if (isDbLoaded) {
      const activeDbProps = dbProps.filter(p => (p.status || 'Active').toLowerCase() === 'active');
      // Prioritize featured properties, then by featuredOrder or creation
      const sorted = [...activeDbProps].sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (Number(a.featuredOrder) || 0) - (Number(b.featuredOrder) || 0);
      });

      return sorted.map((p, idx) => {
        const transformed = transformDbProperty(p);
        const nameLower = (p.name || '').toLowerCase();
        const descLower = (p.description || '').toLowerCase();
        const is1BHK = nameLower.includes('1bhk') || nameLower.includes('1 bhk') || descLower.includes('1bhk') || transformed.roomType === '1bhk';
        const isDaily = nameLower.includes('daily') || descLower.includes('daily') || (p.charges?.dayRate && !p.rent);
        
        let type = 'sharing';
        if (is1BHK) type = '1bhk';
        else if (isDaily) type = 'daily';
        else if (transformed.sharing === 1 || transformed.roomType === 'single' || nameLower.includes('1 sharing') || nameLower.includes('single') || nameLower.includes('private')) type = 'private';
        else type = 'sharing';

        const photos = (Array.isArray(p.photos) && p.photos.length > 0)
          ? p.photos
          : [
              is1BHK ? '/images/1r.jpeg' : isDaily ? '/images/7pg.jpeg' : `/images/${((idx % 8) + 1)}pg.jpeg`
            ];

        const defaultBadge = is1BHK ? '18k Rent • 18k Deposit' : (isDaily ? 'Breakfast Free' : (type === 'private' ? '100% Private' : 'Most Popular'));
        const badge = p.badge || transformed.badge || defaultBadge;

        const defaultHighlights = is1BHK
          ? ['18k Rent • 18k Deposit', 'Near By Infosys, Electronic City', '1 BHK Fully Furnished', 'Power Back Up & WiFi']
          : isDaily
          ? ['Hot Kerala Breakfast', 'High-Speed WiFi', 'Near HCL Gate 2', 'Zero Security Deposit']
          : [
              '3x Daily Kerala Meals',
              'Attached Western Bath',
              'Power Back Up & Wi-Fi',
              'Washing Machine & CCTV'
            ];

        const highlights = (Array.isArray(p.highlights) && p.highlights.length > 0)
          ? p.highlights
          : (p.tagline ? [p.tagline, ...(transformed.facilities || []).slice(0, 3)] : defaultHighlights);

        const priceDisplay = isDaily
          ? (p.charges?.dayRate ? `₹${Number(p.charges.dayRate).toLocaleString('en-IN')}` : (transformed.stayRates?.dayDisplay || '₹499'))
          : transformed.priceDisplay;

        return {
          id: p.id || `prop-${idx}`,
          title: p.name || 'Curated Living Sanctuary',
          type,
          price: priceDisplay,
          period: isDaily ? 'day' : 'month',
          image: photos[0],
          images: photos,
          badge,
          desc: p.description || p.fullAddress || p.area || 'Premium coliving sanctuary with homestyle Kerala dining, high-speed Wi-Fi, and 24/7 caretaker support.',
          highlights,
          rawProperty: p,
          transformed,
        };
      });
    }

    // Fallback if dbProps hasn't finished loading
    return [
      {
        id: '1bhk-fully-furnished',
        title: '1 BHK FULLY FURNISHED',
        type: '1bhk',
        price: '₹18,000',
        period: 'month',
        image: '/images/1r.jpeg',
        images: aafa1BhkImages,
        badge: '18k Rent • 18k Deposit',
        desc: 'Aafa Suites Hotel Near By Infosys, 3rd Cross Rd, Krishna Reddy Layout, Electronic City. Fully furnished 1 BHK with hall, bed & kitchenette.',
        highlights: ['18k Rent • 18k Deposit', 'Near By Infosys, Electronic City', '1 BHK Fully Furnished', 'Power Back Up & WiFi']
      },
      {
        id: 'daily-special',
        title: 'Daily Stay Special',
        type: 'daily',
        price: '₹499',
        period: 'day',
        image: '/images/7pg.jpeg',
        images: [
          '/images/7pg.jpeg',
          '/images/8pg.jpeg'
        ],
        badge: 'Breakfast Free',
        desc: 'Clean furnished room + free hot Kerala breakfast (Puttu/Dosa/Idli) every morning near HCL Gate 2.',
        highlights: ['Hot Kerala Breakfast', 'High-Speed WiFi', 'Near HCL Gate 2', 'Zero Security Deposit']
      },
      {
        id: '1-sharing',
        title: '1 Sharing (Private Suite)',
        type: 'private',
        price: '₹11,499',
        period: 'month',
        image: '/images/1pg.jpeg',
        images: [
          '/images/1pg.jpeg',
          '/images/8pg.jpeg'
        ],
        badge: '100% Private',
        desc: 'Dedicated private single room with attached bath, study desk, power backup, and 3 times Kerala food.',
        highlights: ['3x Daily Kerala Meals', 'Attached Western Bath', 'Power Back Up', 'High-Speed WiFi']
      },
      {
        id: '2-sharing',
        title: '2 Sharing (Twin Room)',
        type: 'sharing',
        price: '₹7,499',
        period: 'month',
        image: '/images/7pg.jpeg',
        images: [
          '/images/7pg.jpeg',
          '/images/8pg.jpeg'
        ],
        badge: 'Most Popular',
        desc: 'Spacious twin sharing room with wardrobe storage, lounge access, washing machine, and 3 times meals.',
        highlights: ['3x Daily Kerala Food', 'Lounge & Entertainment', 'Washing Machine', '24/7 Hot Water']
      },
      {
        id: '3-sharing',
        title: '3 Sharing (Triple Room)',
        type: 'sharing',
        price: '₹5,999',
        period: 'month',
        image: '/images/3sharing.png',
        images: [
          '/images/3sharing.png',
          '/images/8pg.jpeg'
        ],
        badge: 'Value Saver',
        desc: 'Comfortable 3 sharing room setup in Sannidhi layout, Jigani with full facilities and caretaker support.',
        highlights: ['3x Daily Kerala Food', 'Power Back Up', 'Self Cooking Area', 'High-Speed WiFi']
      },
      {
        id: '4-sharing',
        title: '4 Sharing (Quad Room)',
        type: 'sharing',
        price: '₹4,999',
        period: 'month',
        image: '/images/4share.png',
        images: [
          '/images/4share.png',
          '/images/8pg.jpeg'
        ],
        badge: 'Budget Saver',
        desc: 'Affordable 4 sharing room with individual charging points, power backup, and 3 times fresh meals.',
        highlights: ['3x Daily Kerala Meals', 'CCTV & Caretaker', 'Washing Machine', 'WiFi & Power Backup']
      }
    ];
  }, [dbProps]);

  const filteredFeaturedRooms = roomCategoryTab === 'all'
    ? featuredRooms
    : roomCategoryTab === 'sharing'
    ? featuredRooms.filter((r) => r.type === 'sharing' || (r.transformed?.sharing && r.transformed.sharing > 1))
    : roomCategoryTab === 'daily'
    ? featuredRooms.filter((r) => r.type === 'daily' || r.period === 'day')
    : featuredRooms.filter((r) => r.type === roomCategoryTab || (roomCategoryTab === 'private' && (r.type === '1bhk' || r.type === 'private')));

  // FAQ Accordion Data (synced live with Super Admin CMS)
  const faqs = useMemo(() => {
    if (cmsData?.faq && Array.isArray(cmsData.faq) && cmsData.faq.length > 0) {
      return cmsData.faq.map((f, idx) => ({
        q: f.question || `Question ${idx + 1}`,
        a: f.answer || '',
        category: 'general'
      }));
    }
    return [
      {
        q: 'Is 3x daily food included in the monthly rent?',
        a: 'Yes! All monthly room plans (1BHK, 2BHK, Single Room) include 3x daily fresh Kerala homestyle meals (Breakfast, Lunch, Dinner) + evening tea & snacks prepared in-house by experienced chefs.',
        category: 'food'
      },
      {
        q: 'How does the ₹499/day Daily Stay plan work?',
        a: 'Ideal for short business trips, exams, or interview visits near Bengaluru tech corridors! The ₹499/day rate includes a clean furnished room + free Puttu, Dosa, or Uppumavu breakfast every morning with zero deposit.',
        category: 'pricing'
      },
      {
        q: 'How far is Aafa Coliving from HCL Gate and major tech parks?',
        a: 'We are located right in Sannidhi Layout, just 300 meters (2-minute walk) from HCL Gate! Convenient for engineers, researchers, and corporate professionals.',
        category: 'location'
      },
      {
        q: 'What is the deposit policy and notice period?',
        a: 'We maintain a transparent 1-month refundable security deposit policy with zero hidden deduction fees. 1-month notice prior to vacating is required.',
        category: 'pricing'
      },
      {
        q: 'Is there 24/7 generator power backup?',
        a: 'Yes! We have an automatic commercial generator line that powers lights, laptop chargers, Wi-Fi, and common areas during power cuts.',
        category: 'amenities'
      },
      {
        q: 'Is Aafa Coliving safe for female residents?',
        a: 'Absolutely. We have biometric facial recognition entry, 24/7 CCTV surveillance across all corridors and gates, and dedicated staff on campus 24/7.',
        category: 'safety'
      },
    ];
  }, [cmsData]);

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return faqs;
    const term = faqSearch.toLowerCase();
    return faqs.filter(f => f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term));
  }, [faqSearch, faqs]);

  // Master Hub Deck Definitions
  const masterDecks = [
    {
      id: 'living',
      title: 'Living & Budget',
      subtitle: 'Rooms, Hotspots & Pricing Calculators',
      icon: Bed,
      badge: '4 Options',
    },
    {
      id: 'dining',
      title: 'Kitchen & Dining',
      subtitle: 'Live Kitchen Tracker & Kerala Feasts',
      icon: Utensils,
      badge: 'Live Status',
    },
    {
      id: 'campus',
      title: 'Campus & Location',
      subtitle: 'Commute Radius, Amenities & Matrix',
      icon: Compass,
      badge: '300m to HCL',
    },
    {
      id: 'reviews',
      title: 'Reviews & FAQ',
      subtitle: 'Verified Ratings, Instant Answers & Cities',
      icon: Star,
      badge: '140+ Reviews',
    },
  ];

  // Helper renderers for modular sections
  const renderCuratedRooms = () => (
    <div className="space-y-8">
      {/* Room Category Tabs + Small Filter Icon Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-sora text-[#FAF7F0]">
            Curated Living Sanctuaries
          </h3>
          <p className="text-xs text-[#FAF7F0]/70">
            Select your preferred layout or daily stay trial
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {/* Small Filter Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#D4A64A]/15 hover:bg-[#D4A64A]/25 border border-[#D4A64A]/40 text-[#D4A64A] text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 shadow-sm"
            title="Filter by City, Type, Room Type and Sharing"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>

          {[
            { id: 'all', label: 'All Plans' },
            { id: 'daily', label: 'Daily Stay (₹499/day)' },
            { id: 'sharing', label: '2 BHK Sharing' },
            { id: 'private', label: 'Private Suites' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoomCategoryTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${roomCategoryTab === tab.id
                ? 'bg-gradient-to-r from-[#D4A64A] to-amber-500 text-[#0B1220] shadow-md shadow-[#D4A64A]/30 scale-105'
                : 'glass-card text-[#FAF7F0]/70 hover:text-[#FAF7F0]'
                }`}
              data-cursor="expand"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredFeaturedRooms.map((room, idx) => (
            <motion.div
              layout
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className="glass-card glass-card-hover rounded-3xl p-5 border border-white/10 flex flex-col justify-between group overflow-hidden cursor-pointer"
              onClick={() => {
                const roomObj = room.transformed || (room.rawProperty ? transformDbProperty(room.rawProperty) : room);
                setSelectedRoomForDetails(roomObj);
                if (onSelectRoom) onSelectRoom(roomObj);
              }}
            >
              <div>
                <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden mb-4 border border-white/10 bg-[#080d1a]">
                  <img
                    src={room.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
                    alt={room.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                    <div className="px-3 py-1 rounded-full bg-[#0B1220]/80 backdrop-blur-md text-[#D4A64A] border border-[#D4A64A]/30 text-[10px] font-bold font-mono">
                      {room.badge}
                    </div>
                    {room.transformed?.availabilityStatus && (
                      <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border backdrop-blur-md ${
                        (room.transformed.availabilityStatus || '').toLowerCase() === 'full'
                          ? 'bg-red-950/90 text-red-300 border-red-500/50 shadow-sm'
                          : (room.transformed.availabilityStatus || '').toLowerCase() === 'limited'
                          ? 'bg-amber-950/90 text-amber-300 border-amber-500/50 shadow-sm'
                          : 'bg-[#0B1220]/90 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {(room.transformed.availabilityStatus || '').toLowerCase() === 'full'
                          ? '🔴 Full'
                          : (room.transformed.availabilityStatus || '').toLowerCase() === 'limited'
                          ? '🟡 Limited'
                          : '🟢 Ready'}
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-bold font-sora text-[#FAF7F0] mb-1 group-hover:text-[#D4A64A] transition-colors">
                  {room.title}
                </h4>
                <p className="text-xs text-[#FAF7F0]/70 leading-relaxed mb-3 line-clamp-2">
                  {room.desc}
                </p>

                <div className="space-y-1 mb-4">
                  {room.highlights.slice(0, 3).map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#FAF7F0]/85">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A64A] shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[9px] font-mono text-[#FAF7F0]/60 uppercase">Rent</span>
                  <p className={`font-extrabold text-[#D4A64A] font-sora truncate ${room.id === '1bhk-suite' ? 'text-xs sm:text-sm' : 'text-base'
                    }`}>
                    {room.price} {room.id !== '1bhk-suite' && (
                      <span className="text-[10px] font-normal text-[#FAF7F0]/60">/{room.period}</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const roomObj = room.transformed || (room.rawProperty ? transformDbProperty(room.rawProperty) : room);
                    setSelectedRoomForPlan(roomObj);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    (room.transformed?.availabilityStatus || '').toLowerCase() === 'full'
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40'
                      : 'bg-gradient-to-r from-[#D4A64A] to-amber-500 text-[#0B1220] shadow-[#D4A64A]/25 hover:scale-105'
                  }`}
                  data-cursor="expand"
                >
                  {(room.transformed?.availabilityStatus || '').toLowerCase() === 'full' ? 'Join Waitlist' : 'Book Now'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderHotspotsTour = () => (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold font-sora mb-2 text-[#FAF7F0]">
          Interactive Bedroom Feature Inspector
        </h3>
        <p className="text-xs sm:text-sm text-[#FAF7F0]/80">
          Click any glowing gold hotspot on the bedroom canvas to inspect orthopedic mattresses, study nooks, attached washrooms, and high-speed fiber lines.
        </p>
      </div>

      <div className="relative rounded-3xl overflow-hidden glass-card border border-[#D4A64A]/30 h-[380px] sm:h-[480px] shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=80"
          alt="Aafa Bedroom Hotspot Tour"
          className="w-full h-full object-cover filter brightness-105 contrast-105"
        />
        <div className="absolute inset-0 bg-[#0B1220]/40" />

        {/* Hotspot Pins */}
        {roomHotspots.map((spot) => (
          <div
            key={spot.id}
            style={{ top: spot.y, left: spot.x }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <button
              onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
              className="relative w-8 h-8 rounded-full bg-[#D4A64A] text-[#0B1220] font-bold text-xs flex items-center justify-center shadow-lg shadow-[#D4A64A]/50 hover:scale-125 transition-transform"
              data-cursor="expand"
            >
              <span className="absolute -inset-2 rounded-full border-2 border-[#D4A64A] animate-ping opacity-75" />
              <span>+</span>
            </button>

            <AnimatePresence>
              {activeHotspot === spot.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 10 }}
                  className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-56 sm:w-64 max-w-[80vw] rounded-2xl glass-card p-3.5 sm:p-4 border border-[#D4A64A]/40 shadow-2xl text-left bg-[#0B1220]/95 z-30"
                >
                  <h4 className="text-sm font-bold text-[#D4A64A] font-sora mb-1">{spot.title}</h4>
                  <p className="text-xs text-[#FAF7F0]/80 leading-relaxed">{spot.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );

  const renderComparisonTable = () => (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold font-sora mb-2 text-[#FAF7F0]">
          AAFA Coliving vs Traditional Options
        </h3>
        <p className="text-xs sm:text-sm text-[#FAF7F0]/80">
          Transparent comparison showing why IT professionals choose Aafa over standard PGs and flat rentals.
        </p>
      </div>

      <div className="rounded-3xl glass-card border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-white/10 bg-[#D4A64A]/10 text-xs font-mono uppercase tracking-wider text-[#D4A64A]">
                <th className="p-4 font-bold font-sora">Living Feature</th>
                <th className="p-4 font-bold font-sora text-[#D4A64A] bg-[#D4A64A]/15">AAFA COLIVING</th>
                <th className="p-4 font-bold font-sora">Traditional PG</th>
                <th className="p-4 font-bold font-sora">Renting a Flat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
              {[
                { feature: '3x Daily Kerala Homestyle Meals', aafa: 'Included Free', pg: 'Extra / Low Quality', flat: 'Self Cook / Cook Salary' },
                { feature: 'Wi-Fi Speed', aafa: '1 GBPS Dual Fiber', pg: 'Shared slow Wi-Fi', flat: 'Self Broadband Contract' },
                { feature: 'Power Backup', aafa: '100% Commercial Generator', pg: 'Inverter (Lights only)', flat: 'No Generator' },
                { feature: 'Housekeeping & Washroom Cleaning', aafa: 'Daily Maid Service', pg: 'Weekly / Irregular', flat: 'Self Cleaning' },
                { feature: 'Security Deposit', aafa: '1 Month Refundable Only', pg: '2-3 Months Deposit', flat: '6-10 Months Deposit' },
                { feature: 'Daily Stay Plan Available', aafa: 'Yes (₹499/day)', pg: 'No', flat: 'No' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold font-sora text-[#FAF7F0]">{row.feature}</td>
                  <td className="p-4 font-bold text-[#D4A64A] bg-[#D4A64A]/10">{row.aafa}</td>
                  <td className="p-4 text-[#FAF7F0]/60">{row.pg}</td>
                  <td className="p-4 text-[#FAF7F0]/60">{row.flat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFaqSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold font-sora text-[#FAF7F0]">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-[#FAF7F0]/70">
            Instant answers about food, deposit, safety, and booking
          </p>
        </div>

        {/* Instant Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#D4A64A]" />
          <input
            type="text"
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            placeholder="Quick search questions..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-card border border-white/10 focus:border-[#D4A64A] outline-none text-[#FAF7F0] placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#FAF7F0]/60 glass-card rounded-2xl">
            No matching questions found for "{faqSearch}". Call hotline 8747049377 for immediate assistance.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl glass-card border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold font-sora text-xs sm:text-sm text-[#FAF7F0] hover:text-[#D4A64A] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#D4A64A] shrink-0 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 sm:px-5 pb-5 text-xs text-[#FAF7F0]/80 leading-relaxed border-t border-white/5 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderExpansionTeaser = () => (
    <div className="rounded-3xl glass-card border border-[#D4A64A]/30 p-6 sm:p-10 shadow-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#D4A64A] bg-[#D4A64A]/15 px-3 py-1 rounded-full border border-[#D4A64A]/30">
            Pan-India Network
          </span>
          <h3 className="text-xl sm:text-3xl font-extrabold font-sora mt-2 text-[#FAF7F0]">
            Expanding to India’s Major IT Hubs
          </h3>
          <p className="text-xs text-[#FAF7F0]/70 mt-1">
            Quality homestyle coliving expanding across tier-1 technology corridors.
          </p>
        </div>

        <Link
          to="/locations"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A64A] to-yellow-600 text-[#0B1220] font-bold text-xs shrink-0 shadow-lg shadow-[#D4A64A]/25"
          data-cursor="expand"
        >
          Explore All Cities →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {locations.map((loc) => (
          <Link
            key={loc.slug}
            to={`/locations/${loc.slug}`}
            className="p-3.5 rounded-2xl glass-card border border-white/10 hover:border-[#D4A64A]/40 text-center group transition-all"
            data-cursor="expand"
          >
            <span className="text-sm sm:text-base font-bold font-sora text-[#FAF7F0] group-hover:text-[#D4A64A] block">
              {loc.city}
            </span>
            <span className="text-[9px] font-mono text-[#D4A64A] mt-0.5 block">
              {loc.status === 'live' ? 'Live' : 'Coming Soon'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <PageTransition>
      <div className="relative z-10 overflow-hidden">

        {/* HERO SECTION WITH IMMEDIATE "FIND YOUR SPACE" BOOKING & FILTER INTERFACE */}
        <section className="relative pt-20 sm:pt-28 pb-6 sm:pb-8 px-3.5 sm:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">

          {/* Hero Branding Header + 3D Canvas Row */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-2">

            {/* Left Column: Brand Headline & Value Proposition */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-7/12 flex flex-col items-start text-left"
            >
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-[#FAF7F0] mb-3.5 font-sora">
                FIND YOUR <span className="text-gradient-gold">STAY</span>
              </h1>

              {/* Main Description Paragraph */}
              <p className="text-[#FAF7F0]/90 text-sm sm:text-base lg:text-lg font-normal leading-relaxed mb-5 max-w-2xl font-sora">
                Elevate your daily living in premium, fully serviced spaces built for work and tranquility. Enjoy authentic Kerala homestyle dining, high-speed fiber connectivity, and a peaceful community just moments from major tech hubs.
              </p>

              {/* Social Proof & Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[11px] text-[#FAF7F0]/80">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-[#D4A64A] text-[#D4A64A]" />
                  <span className="font-bold text-[#FAF7F0]">4.9</span>
                  <span>(140+ Google Reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Google Maps Campus</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: 3D Living Canvas Preview (Desktop only) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="lg:w-5/12 w-full hidden md:flex items-center justify-end"
            >
              <Hero3DCanvas />
            </motion.div>

          </div>

          {/* DYNAMIC PROMOTIONAL & SPONSORED ADS BANNER (Managed in Super Admin) */}
          <PromotionalBannerSection
            placement="Homepage Hero Top"
            currentCity={bookingFilters.location}
            onSelectCityFilter={(city) => handleEditFilters({ location: city })}
          />

          {/* STEP 1: PROMINENT "FIND YOUR SPACE" BOOKING & FILTER PANEL */}
          <div id="find-your-space-panel" className="scroll-mt-28 relative z-20">
            <FindYourSpacePanel
              initialFilters={bookingFilters}
              onSearch={handleSearchRooms}
            />
          </div>

          {/* STEP 2: SHOW MATCHING ROOMS */}
          <MatchingRoomsSection
            filters={bookingFilters}
            onEditFilters={handleEditFilters}
            onViewDetails={(room) => setSelectedRoomForDetails(room)}
            onSelectRoom={(room) => setSelectedRoomForPlan(room)}
          />

        </section>

        {/* RESIDENT LIFE STATS BAR */}
        <section className="py-10 px-4 sm:px-8 border-y border-[#FAF7F0]/10 bg-[#FAF7F0]/5 backdrop-blur-md">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '500+', label: 'Happy Residents' },
              { number: '7+', label: 'Years of Trust' },
              { number: '4.9', label: 'Google Rating' },
              { number: '100%', label: 'Generator Backup' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="text-center"
              >
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#D4A64A] font-sora mb-1">{stat.number}</h3>
                <p className="text-xs text-[#FAF7F0]/70 font-mono">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE EXPERIENCE HUB (LOW-SCROLL WORKSPACE) */}
        <section id="experience-hub" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">

          {/* Top Control Bar: Master Deck Switcher & Display Mode Toggle */}
          <div className="rounded-3xl glass-card border border-[#D4A64A]/30 p-4 sm:p-6 mb-10 shadow-2xl bg-gradient-to-r from-[#0B1220]/90 via-[#0E172A]/90 to-[#0B1220]/90">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">

              {/* Master 4 Decks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
                {masterDecks.map((deck) => {
                  const Icon = deck.icon;
                  const isActive = activeMasterDeck === deck.id;
                  return (
                    <button
                      key={deck.id}
                      onClick={() => setActiveMasterDeck(deck.id)}
                      className={`p-3 sm:p-4 rounded-2xl text-left transition-all border relative flex flex-col justify-between ${isActive
                        ? 'bg-gradient-to-br from-[#D4A64A]/30 via-amber-500/15 to-[#D4A64A]/5 border-[#D4A64A] shadow-lg shadow-[#D4A64A]/25 scale-[1.02]'
                        : 'glass-card border-white/10 hover:border-white/20'
                        }`}
                      data-cursor="expand"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-[#D4A64A]' : 'text-white/60'}`} />
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-[#D4A64A] text-[#0B1220] font-bold' : 'bg-white/10 text-white/60'
                          }`}>
                          {deck.badge}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold font-sora text-[#FAF7F0] block">
                          {deck.title}
                        </span>
                        <span className="text-[10px] text-white/50 hidden sm:block truncate">
                          {deck.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Display Mode Toggle */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 p-1 sm:p-1.5 rounded-2xl shrink-0 self-center md:self-center">
                <button
                  onClick={() => setDisplayMode('compact')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${displayMode === 'compact'
                    ? 'bg-[#D4A64A] text-[#0B1220] shadow-sm'
                    : 'text-white/70 hover:text-white'
                    }`}
                  title="Low-Scroll Interactive Tabs"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Compact Deck</span>
                </button>
                <button
                  onClick={() => setDisplayMode('expanded')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${displayMode === 'expanded'
                    ? 'bg-[#D4A64A] text-[#0B1220] shadow-sm'
                    : 'text-white/70 hover:text-white'
                    }`}
                  title="Traditional Continuous View"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Expanded View</span>
                </button>
              </div>

            </div>
          </div>

          {/* MAIN DECK CONTENT CONTAINER */}
          {displayMode === 'compact' ? (
            <div className="min-h-[500px]">

              {/* DECK 1: LIVING & BUDGET */}
              {activeMasterDeck === 'living' && (
                <motion.div
                  key="living-deck"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Sub-Tabs */}
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl glass-card border border-white/10 max-w-full overflow-x-auto no-scrollbar sm:justify-center sm:mx-auto">
                    {[
                      { id: 'rooms', label: 'Rooms Preview' },
                      { id: 'calculator', label: 'Rate Calculator' },
                      { id: 'savings', label: 'Savings vs Flat' },
                      { id: 'hotspots', label: '360° Hotspots' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setLivingSubTab(st.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${livingSubTab === st.id
                          ? 'bg-[#D4A64A] text-[#0B1220] shadow-md shadow-[#D4A64A]/30'
                          : 'text-white/70 hover:text-white'
                          }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Sub-Tab Panes */}
                  <div className="pt-2">
                    {livingSubTab === 'rooms' && renderCuratedRooms()}
                    {livingSubTab === 'calculator' && (
                      <div className="glass-card rounded-3xl p-6 border border-[#D4A64A]/30">
                        <PriceCalculator onOpenBooking={(title) => onOpenBooking(title)} />
                      </div>
                    )}
                    {livingSubTab === 'savings' && (
                      <div className="glass-card rounded-3xl p-6 border border-[#D4A64A]/30">
                        <SavingsCalculator onOpenBooking={(title) => onOpenBooking(title)} />
                      </div>
                    )}
                    {livingSubTab === 'hotspots' && renderHotspotsTour()}
                  </div>
                </motion.div>
              )}

              {/* DECK 2: KITCHEN & DINING */}
              {activeMasterDeck === 'dining' && (
                <motion.div
                  key="dining-deck"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Sub-Tabs */}
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl glass-card border border-white/10 max-w-full overflow-x-auto no-scrollbar sm:justify-center sm:mx-auto">
                    {[
                      { id: 'live-kitchen', label: 'Today Live Kitchen' },
                      { id: 'dining-marquee', label: 'Kerala Dining Showcase' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setDiningSubTab(st.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${diningSubTab === st.id
                          ? 'bg-[#D4A64A] text-[#0B1220] shadow-md shadow-[#D4A64A]/30'
                          : 'text-white/70 hover:text-white'
                          }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    {diningSubTab === 'live-kitchen' && <TodayLiveKitchen />}
                    {diningSubTab === 'dining-marquee' && (
                      <div className="rounded-3xl glass-card border border-white/10 p-4 sm:p-8">
                        <DiningMarquee />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* DECK 3: CAMPUS, COMMUTE & AMENITIES */}
              {activeMasterDeck === 'campus' && (
                <motion.div
                  key="campus-deck"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Sub-Tabs */}
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl glass-card border border-white/10 max-w-full overflow-x-auto no-scrollbar sm:justify-center sm:mx-auto">
                    {[
                      { id: 'commute', label: 'Commute Radius (HCL Gate)' },
                      { id: 'amenities', label: 'Zero-Gravity Amenities' },
                      { id: 'comparison', label: 'PG vs Flat Matrix' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setCampusSubTab(st.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${campusSubTab === st.id
                          ? 'bg-[#D4A64A] text-[#0B1220] shadow-md shadow-[#D4A64A]/30'
                          : 'text-white/70 hover:text-white'
                          }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    {campusSubTab === 'commute' && <NeighborhoodExplorer />}
                    {campusSubTab === 'amenities' && <AmenitiesGrid />}
                    {campusSubTab === 'comparison' && renderComparisonTable()}
                  </div>
                </motion.div>
              )}

              {/* DECK 4: REVIEWS, FAQS & CITIES */}
              {activeMasterDeck === 'reviews' && (
                <motion.div
                  key="reviews-deck"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Sub-Tabs */}
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl glass-card border border-white/10 max-w-full overflow-x-auto no-scrollbar sm:justify-center sm:mx-auto">
                    {[
                      { id: 'testimonials', label: 'Resident Reviews' },
                      { id: 'faq', label: 'FAQ Finder' },
                      { id: 'expansion', label: 'Pan-India Cities' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setReviewsSubTab(st.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${reviewsSubTab === st.id
                          ? 'bg-[#D4A64A] text-[#0B1220] shadow-md shadow-[#D4A64A]/30'
                          : 'text-white/70 hover:text-white'
                          }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    {reviewsSubTab === 'testimonials' && <TestimonialsOrbit />}
                    {reviewsSubTab === 'faq' && renderFaqSection()}
                    {reviewsSubTab === 'expansion' && renderExpansionTeaser()}
                  </div>
                </motion.div>
              )}

            </div>
          ) : (
            /* EXPANDED VIEW (ALL SECTIONS SEQUENTIAL) */
            <div className="space-y-24">
              {renderCuratedRooms()}
              <TodayLiveKitchen />
              <PriceCalculator onOpenBooking={(title) => onOpenBooking(title)} />
              {renderHotspotsTour()}
              <SavingsCalculator onOpenBooking={(title) => onOpenBooking(title)} />
              <NeighborhoodExplorer />
              <AmenitiesGrid />
              <DiningMarquee />
              {renderComparisonTable()}
              <TestimonialsOrbit />
              {renderExpansionTeaser()}
              {renderFaqSection()}
            </div>
          )}

        </section>

        {/* BOTTOM BIG CTA SANCTUARY BOOKING BANNER */}
        <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto mb-12">
          <div className="rounded-3xl glass-card-glow border-2 border-[#D4A64A] p-8 sm:p-14 text-center relative overflow-hidden bg-gradient-to-br from-[#D4A64A]/20 via-[#0B1220] to-[#0B1220]">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A64A]/20 text-[#D4A64A] border border-[#D4A64A]/40 text-xs font-mono font-bold uppercase">
                <FindSpaceLogo className="w-4 h-4" />
                <span>Move-In Ready Sanctuary</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-sora text-[#FAF7F0]">
                Ready to Experience Stress-Free Living Across Pan-India?
              </h2>
              <p className="text-sm sm:text-base text-[#FAF7F0]/80 leading-relaxed">
                Schedule a free campus visit today, sample our authentic Kerala lunch, or book your ₹499/day trial stay instantly.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => onOpenBooking('Daily Stay Special (₹499/day)')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4A64A] via-amber-500 to-yellow-600 text-[#0B1220] font-extrabold text-sm sm:text-base shadow-xl shadow-[#D4A64A]/30 hover:shadow-[#D4A64A]/50 hover:scale-105 transition-all flex items-center gap-2 btn-shimmer"
                  data-cursor="expand"
                >
                  <Calendar className="w-5 h-5 stroke-[2.5]" />
                  <span>Book Room Now — ₹499/day</span>
                </button>

                <a
                  href="tel:+918747049377"
                  className="px-8 py-4 rounded-2xl glass-card border border-white/20 text-[#FAF7F0] font-bold text-sm sm:text-base hover:bg-white/10 hover:border-[#D4A64A]/50 transition-all flex items-center gap-2"
                  data-cursor="expand"
                >
                  <Phone className="w-5 h-5 text-[#D4A64A]" />
                  <span>Call Hotline: 8747049377</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FLOATING QUICK DOCK HUD */}
        <FloatingQuickDock
          activeMasterDeck={activeMasterDeck}
          onSelectMasterDeck={(deck) => setActiveMasterDeck(deck)}
          onOpenBooking={onOpenBooking}
          onOpenFilter={() => setIsFilterModalOpen(true)}
        />

        {/* CLEAN FILTER MODAL WITH DROPDOWNS (TRIGGERED BY SMALL FILTER ICON) */}
        <HomePgFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onOpenBooking={onOpenBooking}
        />

        {/* ROOM DETAILS INSPECTION MODAL */}
        <RoomDetailsModal
          isOpen={!!selectedRoomForDetails}
          onClose={() => setSelectedRoomForDetails(null)}
          room={selectedRoomForDetails}
          currentStayType={bookingFilters.stayType}
          onProceedToBooking={(room) => {
            setSelectedRoomForDetails(null);
            setSelectedRoomForPlan(room);
          }}
        />

        {/* STEP 3 & 4: STAY PLAN SELECTION & BOOKING CONFIRMATION MODAL */}
        <StayPlanModal
          isOpen={!!selectedRoomForPlan}
          onClose={() => setSelectedRoomForPlan(null)}
          room={selectedRoomForPlan}
          initialStayType={bookingFilters.stayType}
          initialCheckInDate={bookingFilters.checkInDate}
          initialDurationValue={bookingFilters.durationValue}
          onBookingConfirmed={(data) => {
            console.log('Booking confirmed:', data);
          }}
        />

      </div>
    </PageTransition>
  );
}
