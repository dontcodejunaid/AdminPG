import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  MapPin,
  CheckCircle2,
  Utensils,
  Wifi,
  Zap,
  Home,
  ShieldCheck,
  Calendar,
  SlidersHorizontal,
  RotateCcw,
  Eye,
  ArrowRight,
  Flame,
  Check,
  Phone,
  Lock,
  Unlock,
  Sparkles,
  Flag,
} from 'lucide-react';
import { allEnrichedListings, transformDbProperty, matchLocation, registerDynamicFacilities } from '../../data/pgListingsData';
import { api } from '../../../services/api';
import UnlockContactModal from '../UnlockContactModal';
import ReportListingModal from '../ReportListingModal';

export default function MatchingRoomsSection({
  filters = {
    location: 'all',
    stayType: 'month',
    roomType: 'all',
    sharing: 'all',
    gender: 'all',
    checkInDate: '',
    duration: '1 Month',
    durationValue: 1,
  },
  onEditFilters,
  onViewDetails,
  onSelectRoom,
}) {
  const [dbListings, setDbListings] = useState([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [unlockModalProperty, setUnlockModalProperty] = useState(null);
  const [reportModalProperty, setReportModalProperty] = useState(null);
  const [unlockedIds, setUnlockedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('unlocked_pg_contacts') || '[]');
    } catch {
      return [];
    }
  });

  const handleUnlockSuccess = (pgId) => {
    setUnlockedIds((prev) => {
      const next = Array.from(new Set([...prev, pgId]));
      localStorage.setItem('unlocked_pg_contacts', JSON.stringify(next));
      return next;
    });
  };

  // Fetch live properties & facilities from database API
  useEffect(() => {
    let isMounted = true;
    api.getFacilities()
      .then((res) => {
        if (res && res.data && isMounted) {
          registerDynamicFacilities(res.data);
        }
      })
      .catch(() => {});

    api.getProperties({ status: 'Active', verificationStatus: 'Verified' })
      .then((res) => {
        if (res && res.data && isMounted) {
          const transformed = res.data.map(transformDbProperty);
          setDbListings(transformed);
          setIsDbLoaded(true);
        }
      })
      .catch((err) => {
        console.log('Live properties fetch error:', err);
        if (isMounted) setIsDbLoaded(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const listingsPool = isDbLoaded ? dbListings : allEnrichedListings;

  // Filtering & Sorting Logic
  const matchingListings = useMemo(() => {
    return listingsPool
      .filter((item) => {
        // 0. Active & Verified status check - exclude Inactive, Draft, or Pending/Unverified properties
        if ((item.status || 'Active').toLowerCase() !== 'active') {
          return false;
        }
        if (item.verificationStatus && item.verificationStatus.toLowerCase() !== 'verified') {
          return false;
        }

        // 1. Location match using cluster-aware matcher
        if (!matchLocation(item, filters.location)) {
          return false;
        }

        // 2. Room Type match
        if (filters.roomType && filters.roomType !== 'all') {
          const itemRoomTypes = item.availableRoomTypes || [item.roomType];
          if (item.roomType !== filters.roomType && !itemRoomTypes.includes(filters.roomType)) {
            return false;
          }
        }

        // 3. Sharing match
        if (filters.sharing && filters.sharing !== 'all') {
          const reqSharing = Number(filters.sharing);
          const itemSharings = item.availableSharings || [item.sharing];
          if (item.sharing !== reqSharing && !itemSharings.includes(reqSharing)) {
            return false;
          }
        }

        // 4. Gender match
        if (filters.gender && filters.gender !== 'all') {
          const reqGender = (filters.gender || '').toLowerCase();
          const itemGender = (item.genderType || 'coliving').toLowerCase();
          
          if (reqGender === 'boys') {
            if (itemGender !== 'boys' && itemGender !== 'coliving') return false;
          } else if (reqGender === 'girls') {
            if (itemGender !== 'girls' && itemGender !== 'coliving') return false;
          } else if (reqGender === 'coliving') {
            if (itemGender !== 'coliving') return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const aFeatured = Boolean(a.isFeatured ?? a.isPremium);
        const bFeatured = Boolean(b.isFeatured ?? b.isPremium);
        if (aFeatured !== bFeatured) {
          return aFeatured ? -1 : 1;
        }
        const aOrder = a.featuredOrder ?? 999;
        const bOrder = b.featuredOrder ?? 999;
        return aOrder - bOrder;
      });
  }, [listingsPool, filters]);

  // Price helper based on selected stayType
  const getDisplayPrice = (room) => {
    if (filters.stayType === 'day') {
      return {
        amount: room.stayRates.dayDisplay,
        period: 'day',
        subtext: 'Free Breakfast Included',
      };
    } else if (filters.stayType === 'week') {
      return {
        amount: room.stayRates.weekDisplay,
        period: 'week',
        subtext: 'Better Value • Flexible',
      };
    } else {
      return {
        amount: room.stayRates.monthDisplay,
        period: 'month',
        subtext: '3x Daily Kerala Meals',
      };
    }
  };

  // Label helpers
  const locationLabel =
    filters.location === 'all' ? 'All Locations' : filters.location;
  const stayTypeLabel =
    filters.stayType === 'day'
      ? 'Day Stay'
      : filters.stayType === 'week'
      ? 'Weekly Stay'
      : 'Monthly Stay';
  const sharingLabel =
    filters.sharing === 'all'
      ? 'All Sharing'
      : `${filters.sharing} Sharing`;

  return (
    <div id="matching-rooms-results" className="w-full space-y-6 pt-4">
      {/* Top Compact Summary Bar with "Edit Filters" button */}
      <div className="rounded-2xl glass-card border border-white/10 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg bg-[#0B1220]/80">
        
        {/* Summary text */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-mono text-[#FAF7F0]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-bold text-[#D4A64A] text-sm sm:text-base whitespace-nowrap">
            {matchingListings.length} {matchingListings.length === 1 ? 'Space Available' : 'Spaces Available'}
          </span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-xs sm:text-sm text-[#FAF7F0]/85">
            Rooms in <strong className="text-[#FAF7F0]">{locationLabel}</strong> • {sharingLabel} • <strong className="text-emerald-400">{stayTypeLabel}</strong>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={onEditFilters}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#D4A64A]/20 border border-white/15 hover:border-[#D4A64A]/50 text-xs text-[#FAF7F0] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4A64A]" />
            <span>Edit Filters</span>
          </button>
        </div>
      </div>

      {/* Results Grid */}
      {matchingListings.length === 0 ? (
        /* Empty State with Helpful Relaxation Suggestions */
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#0E172A] border border-white/10 shadow-2xl space-y-4 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-sora text-[#FAF7F0] mb-1">
              No matching rooms found for this specific combination
            </h4>
            <p className="text-xs sm:text-sm text-[#FAF7F0]/70 max-w-md mx-auto">
              Try switching your sharing preference or selecting "Any / Unisex" to view available rooms nearby.
            </p>
          </div>

          {/* Quick Filter Relaxation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => onEditFilters({ sharing: 'all', gender: 'all' })}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#D4A64A]/20 border border-white/15 text-xs text-[#FAF7F0] hover:text-[#D4A64A] transition-all cursor-pointer"
            >
              Show All Sharing Types
            </button>
            <button
              onClick={() => onEditFilters({ location: 'Bengaluru' })}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#D4A64A]/20 border border-white/15 text-xs text-[#FAF7F0] hover:text-[#D4A64A] transition-all cursor-pointer"
            >
              Search All of Bengaluru
            </button>
            <button
              onClick={() => onEditFilters({ roomType: 'all', sharing: 'all', gender: 'all', location: 'all' })}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A64A] to-amber-500 text-[#0B1220] font-bold text-xs transition-all cursor-pointer"
            >
              Reset to Recommended
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {matchingListings.map((room, idx) => {
              const priceInfo = getDisplayPrice(room);

              return (
                <motion.div
                  layout
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className={`rounded-3xl p-5 bg-[#10192B] hover:bg-[#132038] border transition-all duration-300 flex flex-col justify-between group shadow-xl ${
                    room.isPremium
                      ? 'border-[#D4A64A]/50 shadow-[0_4px_30px_rgba(212,166,74,0.12)]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    {/* Room Image Container - Click to view details */}
                    <div
                      onClick={() => onViewDetails && onViewDetails(room)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onViewDetails && onViewDetails(room);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${room.name}`}
                      className="relative h-52 rounded-2xl overflow-hidden mb-4 border border-white/10 bg-[#080d1a] cursor-pointer group/img select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A64A]"
                    >
                      <img
                        src={room.image}
                        alt={room.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80';
                        }}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/img:scale-105"
                        loading="lazy"
                      />

                      {/* Hover Overlay with Quick View Hint */}
                      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#0B1220]/90 backdrop-blur-md text-xs font-bold text-[#D4A64A] border border-[#D4A64A]/40 flex items-center gap-1.5 shadow-xl transform translate-y-1 group-hover/img:translate-y-0 transition-transform duration-300">
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </span>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-lg bg-[#0B1220]/90 backdrop-blur-md text-[#D4A64A] text-[10px] font-mono font-bold border border-[#D4A64A]/30">
                          {room.genderLabel}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#0B1220]/90 backdrop-blur-md text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                          {room.sharingLabel}
                        </span>
                      </div>

                      {/* Rating & Report Flag */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                        <span className="px-2.5 py-1 rounded-lg bg-[#0B1220]/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 border border-white/15 pointer-events-none">
                          <Star className="w-3 h-3 text-[#D4A64A] fill-[#D4A64A]" />
                          <span>{room.rating}</span>
                        </span>
                        <button
                          type="button"
                          title="Report inaccurate listing or scam"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReportModalProperty(room);
                          }}
                          className="w-7 h-7 rounded-lg bg-[#0B1220]/90 backdrop-blur-md text-white/70 hover:text-red-400 hover:bg-red-500/20 border border-white/15 hover:border-red-500/40 flex items-center justify-center transition-all cursor-pointer shadow-md"
                        >
                          <Flag className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Availability banner */}
                      <div className={`absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 border pointer-events-none backdrop-blur-md ${
                        (room.availabilityStatus || '').toLowerCase() === 'full'
                          ? 'bg-red-950/95 text-red-300 border-red-500/50 shadow-lg shadow-red-950/50'
                          : (room.availabilityStatus || '').toLowerCase() === 'limited'
                          ? 'bg-amber-950/95 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-950/50'
                          : 'bg-[#0B1220]/95 text-emerald-400 border-emerald-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          (room.availabilityStatus || '').toLowerCase() === 'full'
                            ? 'bg-red-500'
                            : (room.availabilityStatus || '').toLowerCase() === 'limited'
                            ? 'bg-amber-400 animate-ping'
                            : 'bg-emerald-400 animate-ping'
                        }`} />
                        <span>
                          {(room.availabilityStatus || '').toLowerCase() === 'full'
                            ? 'Full • Sold Out'
                            : (room.availabilityStatus || '').toLowerCase() === 'limited'
                            ? 'Limited Beds Left'
                            : 'Move-In Ready'}
                        </span>
                      </div>
                    </div>

                    {/* Location & Title */}
                    <div className="flex items-center gap-1 text-[11px] text-[#D4A64A] font-mono mb-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{room.area}</span>
                    </div>

                    <h4
                      onClick={() => onViewDetails && onViewDetails(room)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onViewDetails && onViewDetails(room);
                        }
                      }}
                      className="text-base font-bold font-sora text-[#FAF7F0] mb-1.5 line-clamp-1 group-hover:text-[#D4A64A] transition-colors cursor-pointer focus:outline-none"
                    >
                      {room.name}
                    </h4>

                    <p className="text-xs text-[#FAF7F0]/70 leading-relaxed mb-4 line-clamp-2">
                      {room.desc}
                    </p>

                    {/* Core Features Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3 p-2.5 rounded-xl bg-[#0B1220]/60 border border-white/5 text-[10px] text-[#FAF7F0]/80 font-medium">
                      <div className="flex items-center gap-1.5 truncate">
                        <Utensils className="w-3.5 h-3.5 text-[#D4A64A] shrink-0" />
                        <span className="truncate">Kerala Meals</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Wifi className="w-3.5 h-3.5 text-[#D4A64A] shrink-0" />
                        <span className="truncate">1 Gbps Dual Wi-Fi</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Zap className="w-3.5 h-3.5 text-[#D4A64A] shrink-0" />
                        <span className="truncate">100% Gen Power</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">Biometric Entry</span>
                      </div>
                    </div>

                    {/* Direct Owner Contact Bar - Locked/Blurred until ₹19 payment */}
                    {unlockedIds.includes(room.id) ? (
                      <div className="flex items-center justify-between gap-2 mb-3 p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/35 text-xs shadow-sm">
                        <div className="flex items-center gap-1.5 text-emerald-300 font-mono text-[11px] truncate min-w-0">
                          <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-white/60">Owner:</span>
                          <span className="font-bold text-[#FAF7F0] truncate">{room.contactNumber || room.phones?.[0] || '+91 99000 82615'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={`tel:${room.contactNumber || room.phones?.[0] || '9900082615'}`}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm"
                            title="Call PG Owner / Caretaker"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                          <a
                            href={`https://wa.me/${(room.whatsappNumber || room.contactNumber || '918747049377').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I just unlocked ${room.name} (${room.area}) on KeralaPG. Please confirm availability.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366] active:scale-95 text-[#25D366] hover:text-white border border-[#25D366]/40 text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm"
                            title="WhatsApp PG Owner / Caretaker"
                          >
                            <span>WA</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2 mb-3 p-2 rounded-xl bg-[#090E1B] border border-amber-500/30 text-xs shadow-inner">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-white/50 text-[10px] font-mono">Owner:</span>
                          <span className="font-mono text-[11px] text-white/40 blur-[3px] select-none tracking-wider truncate">
                            +91 99000 •••••
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUnlockModalProperty(room)}
                          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-[#0B1220] text-[11px] font-extrabold flex items-center gap-1 transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                          title="Pay ₹19 to unlock verified owner phone number"
                        >
                          <Lock className="w-3 h-3 stroke-[2.5]" />
                          <span>Unlock ₹19</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pricing & Dual Action Buttons ("View Details" and "Book Now") */}
                  <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#FAF7F0]/60 uppercase tracking-wider block">
                          {stayTypeLabel} Rate
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-extrabold text-[#D4A64A] font-sora">
                            {priceInfo.amount}
                          </span>
                          <span className="text-xs text-[#FAF7F0]/60 font-normal">
                            /{priceInfo.period}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {priceInfo.subtext}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onViewDetails && onViewDetails(room)}
                        className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#FAF7F0] border border-white/10 hover:border-white/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#D4A64A]" />
                        <span>View Details</span>
                      </button>

                      {(room.availabilityStatus || '').toLowerCase() === 'full' ? (
                        <button
                          type="button"
                          onClick={() => onSelectRoom && onSelectRoom(room)}
                          className="py-2.5 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                        >
                          <span>Full • Waitlist</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectRoom && onSelectRoom(room)}
                          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D4A64A] via-amber-500 to-yellow-600 text-[#0B1220] text-xs font-extrabold shadow-md shadow-[#D4A64A]/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1 cursor-pointer btn-shimmer"
                        >
                          <span>Book Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ₹19 Owner Contact Micro-Payment Unlock Modal */}
      <UnlockContactModal
        property={unlockModalProperty}
        isOpen={Boolean(unlockModalProperty)}
        onClose={() => setUnlockModalProperty(null)}
        onUnlockSuccess={handleUnlockSuccess}
      />

      {/* Listing Report Moderation Modal */}
      <ReportListingModal
        property={reportModalProperty}
        isOpen={Boolean(reportModalProperty)}
        onClose={() => setReportModalProperty(null)}
      />
    </div>
  );
}
