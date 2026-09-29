import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Clock,
  Home,
  Users,
  Search,
  Sparkles,
  ChevronDown,
  Check,
  ShieldCheck,
  SlidersHorizontal,
  Flame,
} from 'lucide-react';

export default function FindYourSpacePanel({
  initialFilters = {},
  onSearch,
  className = '',
}) {
  // 1. Location
  const [location, setLocation] = useState(initialFilters.location || 'all');

  // 2. Stay Type: 'day' | 'week' | 'month'
  const [stayType, setStayType] = useState(initialFilters.stayType || 'month');

  // 3. Room Type: 'all' | '1bhk' | '2bhk' | 'single' | 'shared'
  const [roomType, setRoomType] = useState(initialFilters.roomType || 'all');

  // 4. Sharing: 'all' | '1' | '2' | '3' | '4'
  const [sharing, setSharing] = useState(initialFilters.sharing || 'all');

  // 5. Gender: 'all' | 'boys' | 'girls'
  const [gender, setGender] = useState(initialFilters.gender || 'all');

  // 6. Dynamic Date & Duration
  const todayStr = new Date().toISOString().split('T')[0];
  const [checkInDate, setCheckInDate] = useState(initialFilters.checkInDate || todayStr);
  const [durationDays, setDurationDays] = useState(initialFilters.durationDays || '1');
  const [durationWeeks, setDurationWeeks] = useState(initialFilters.durationWeeks || '1');
  const [durationMonths, setDurationMonths] = useState(initialFilters.durationMonths || '1');

  // Sync state if initialFilters changes from outside (e.g. quick filter buttons or modals)
  useEffect(() => {
    if (initialFilters.location !== undefined) setLocation(initialFilters.location);
    if (initialFilters.stayType !== undefined) setStayType(initialFilters.stayType);
    if (initialFilters.roomType !== undefined) setRoomType(initialFilters.roomType);
    if (initialFilters.sharing !== undefined) setSharing(initialFilters.sharing);
    if (initialFilters.gender !== undefined) setGender(initialFilters.gender);
    if (initialFilters.checkInDate !== undefined) setCheckInDate(initialFilters.checkInDate);
    if (initialFilters.durationDays !== undefined) setDurationDays(initialFilters.durationDays);
    if (initialFilters.durationWeeks !== undefined) setDurationWeeks(initialFilters.durationWeeks);
    if (initialFilters.durationMonths !== undefined) setDurationMonths(initialFilters.durationMonths);
  }, [
    initialFilters.location,
    initialFilters.stayType,
    initialFilters.roomType,
    initialFilters.sharing,
    initialFilters.gender,
    initialFilters.checkInDate,
    initialFilters.durationDays,
    initialFilters.durationWeeks,
    initialFilters.durationMonths,
  ]);

  const emitSearch = (overrides = {}) => {
    const currentLoc = overrides.location !== undefined ? overrides.location : location;
    const currentStay = overrides.stayType !== undefined ? overrides.stayType : stayType;
    const currentRoom = overrides.roomType !== undefined ? overrides.roomType : roomType;
    const currentShare = overrides.sharing !== undefined ? overrides.sharing : sharing;
    const currentGen = overrides.gender !== undefined ? overrides.gender : gender;
    const currentDate = overrides.checkInDate !== undefined ? overrides.checkInDate : checkInDate;
    const curDays = overrides.durationDays !== undefined ? overrides.durationDays : durationDays;
    const curWeeks = overrides.durationWeeks !== undefined ? overrides.durationWeeks : durationWeeks;
    const curMonths = overrides.durationMonths !== undefined ? overrides.durationMonths : durationMonths;

    const duration =
      currentStay === 'day'
        ? `${curDays} ${curDays === '1' ? 'Day' : 'Days'}`
        : currentStay === 'week'
        ? `${curWeeks} ${curWeeks === '1' ? 'Week' : 'Weeks'}`
        : `${curMonths} ${curMonths === '1' ? 'Month' : 'Months'}`;

    if (onSearch) {
      onSearch({
        location: currentLoc,
        stayType: currentStay,
        roomType: currentRoom,
        sharing: currentShare,
        gender: currentGen,
        checkInDate: currentDate,
        duration,
        durationValue:
          currentStay === 'day'
            ? Number(curDays)
            : currentStay === 'week'
            ? Number(curWeeks)
            : Number(curMonths),
      });
    }
  };

  const handleApply = (e) => {
    if (e) e.preventDefault();
    emitSearch();
  };

  return (
    <div
      className={`rounded-3xl bg-[#0B1220]/95 backdrop-blur-xl border border-[#D4A64A]/30 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-[#FAF7F0] ${className}`}
    >
      {/* Panel Top Heading & Stay Type Segmented Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <img
            src="/find-space-logo.png"
            alt="FIND YOUR STAY"
            className="w-9 h-9 rounded-xl object-contain shadow-md shadow-[#D4A64A]/25 shrink-0 border border-[#D4A64A]/40"
          />
          <div>
            <h3 className="text-base sm:text-lg font-bold font-sora text-[#FAF7F0] leading-tight">
              FIND YOUR STAY
            </h3>
            <p className="text-[11px] text-[#FAF7F0]/65 font-mono">
              Direct booking • Pan-India • No Brokerage • Zero Advance Hassle
            </p>
          </div>
        </div>

        {/* Stay Type Segmented Switcher (Day Stay | Weekly | Monthly) - Fixed non-sliding 3-column grid on mobile */}
        <div className="grid grid-cols-3 w-full md:w-auto md:flex items-center gap-1 p-1 rounded-2xl bg-[#10192B] border border-white/10 shrink-0">
          {[
            { id: 'day', label: 'Day Stay', badge: '₹499/d' },
            { id: 'week', label: 'Weekly Stay', badge: 'Flexi' },
            { id: 'month', label: 'Monthly Stay', badge: 'Best Value' },
          ].map((tab) => {
            const isActive = stayType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStayType(tab.id);
                  emitSearch({ stayType: tab.id });
                }}
                className={`w-full md:w-auto px-1.5 xs:px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[10px] xs:text-[11px] sm:text-xs font-bold transition-all flex flex-col xs:flex-row items-center justify-center gap-0.5 xs:gap-1.5 cursor-pointer relative text-center ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4A64A] to-amber-500 text-[#0B1220] shadow-md shadow-[#D4A64A]/25'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="truncate xs:overflow-visible">{tab.label}</span>
                <span
                  className={`text-[8px] xs:text-[9px] px-1 xs:px-1.5 py-0.2 rounded-md font-mono shrink-0 ${
                    isActive
                      ? 'bg-[#0B1220]/25 text-[#0B1220] font-extrabold'
                      : 'bg-white/10 text-[#D4A64A]'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Controls */}
      <form onSubmit={handleApply} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* 1. Location Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#D4A64A] flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Location</span>
            </label>
            <div className="relative">
              <select
                value={location}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocation(val);
                  emitSearch({ location: val });
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-[#10192B] border border-white/15 text-xs sm:text-sm font-semibold text-[#FAF7F0] focus:border-[#D4A64A] outline-none cursor-pointer appearance-none pr-8"
              >
                <option value="all">Pan-India (All Cities)</option>
                <option value="Bengaluru">Bengaluru (Tech Corridor)</option>
                <option value="Kochi">Kochi (InfoPark)</option>
                <option value="Thiruvananthapuram">Thiruvananthapuram (Technopark)</option>
                <option value="Kozhikode">Kozhikode (Cyberpark)</option>
                <option value="Mysuru">Mysuru / Karnataka</option>
                <option value="Coimbatore">Coimbatore (TIDEL Park)</option>
                <option value="Chennai">Chennai (OMR)</option>
                <option value="Hyderabad">Hyderabad (Hitec City)</option>
                <option value="Pune">Pune (Hinjawadi)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Room Type Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#D4A64A] flex items-center gap-1">
              <Home className="w-3 h-3" />
              <span>Room Type</span>
            </label>
            <div className="relative">
              <select
                value={roomType}
                onChange={(e) => {
                  const val = e.target.value;
                  setRoomType(val);
                  emitSearch({ roomType: val });
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-[#10192B] border border-white/15 text-xs sm:text-sm font-semibold text-[#FAF7F0] focus:border-[#D4A64A] outline-none cursor-pointer appearance-none pr-8"
              >
                <option value="all">Any Room Type</option>
                <option value="1bhk">1 BHK Suite</option>
                <option value="2bhk">2 BHK Apartment</option>
                <option value="single">Single Room (Private)</option>
                <option value="shared">Shared Room</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. Sharing Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#D4A64A] flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Sharing</span>
            </label>
            <div className="relative">
              <select
                value={sharing}
                onChange={(e) => {
                  const val = e.target.value;
                  setSharing(val);
                  emitSearch({ sharing: val });
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-[#10192B] border border-white/15 text-xs sm:text-sm font-semibold text-[#FAF7F0] focus:border-[#D4A64A] outline-none cursor-pointer appearance-none pr-8"
              >
                <option value="all">Any Sharing</option>
                <option value="1">Single (1 Sharing)</option>
                <option value="2">2 Sharing (Twin)</option>
                <option value="3">3 Sharing (Triple)</option>
                <option value="4">4 Sharing (Quad)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4. Gender / Occupancy */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#D4A64A] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Gender</span>
            </label>
            <div className="relative">
              <select
                value={gender}
                onChange={(e) => {
                  const val = e.target.value;
                  setGender(val);
                  emitSearch({ gender: val });
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-[#10192B] border border-white/15 text-xs sm:text-sm font-semibold text-[#FAF7F0] focus:border-[#D4A64A] outline-none cursor-pointer appearance-none pr-8"
              >
                <option value="all">Any / Unisex / Coliving</option>
                <option value="boys">Boys / Men Only</option>
                <option value="girls">Girls / Women Only</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 5. Dynamic Check-in & Duration Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#D4A64A] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {stayType === 'day'
                  ? 'Check-In & Days'
                  : stayType === 'week'
                  ? 'Check-In & Weeks'
                  : 'Move-In & Months'}
              </span>
            </label>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-1.5">
              {/* Date Input */}
              <input
                type="date"
                value={checkInDate}
                min={todayStr}
                onChange={(e) => {
                  const val = e.target.value;
                  setCheckInDate(val);
                  emitSearch({ checkInDate: val });
                }}
                className="w-full px-2 py-2 rounded-xl bg-[#10192B] border border-white/15 text-[11px] font-semibold text-[#FAF7F0] focus:border-[#D4A64A] outline-none cursor-pointer min-w-0"
              />

              {/* Dynamic Duration Select based on Stay Type */}
              {stayType === 'day' && (
                <select
                  value={durationDays}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDurationDays(val);
                    emitSearch({ durationDays: val });
                  }}
                  className="w-full px-2 py-2 rounded-xl bg-[#10192B] border border-white/15 text-[11px] font-semibold text-[#FAF7F0] focus:border-[#D4A64A] outline-none cursor-pointer"
                >
                  <option value="1">1 Day (₹499)</option>
                  <option value="2">2 Days</option>
                  <option value="3">3 Days</option>
                  <option value="5">5 Days</option>
                  <option value="7">7 Days</option>
                  <option value="10">10 Days</option>
                  <option value="14">14 Days</option>
                </select>
              )}

              {stayType === 'week' && (
                <select
                  value={durationWeeks}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDurationWeeks(val);
                    emitSearch({ durationWeeks: val });
                  }}
                  className="w-full px-2 py-2 rounded-xl bg-[#10192B] border border-white/15 text-[11px] font-semibold text-[#FAF7F0] focus:border-[#D4A64A] outline-none cursor-pointer"
                >
                  <option value="1">1 Week</option>
                  <option value="2">2 Weeks</option>
                  <option value="3">3 Weeks</option>
                  <option value="4">4 Weeks</option>
                </select>
              )}

              {stayType === 'month' && (
                <select
                  value={durationMonths}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDurationMonths(val);
                    emitSearch({ durationMonths: val });
                  }}
                  className="w-full px-2 py-2 rounded-xl bg-[#10192B] border border-white/15 text-[11px] font-semibold text-[#FAF7F0] focus:border-[#D4A64A] outline-none cursor-pointer"
                >
                  <option value="1">1 Month</option>
                  <option value="2">2 Months</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="11">11 Months</option>
                </select>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Action Bar with Large Primary CTA: "Find Available Rooms →" */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Quick Perks Pill */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono text-white/70">
            <span className="flex items-center gap-1 text-emerald-400">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>3x Kerala Meals Included</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>100% Commercial Gen Backup</span>
            </span>
            <span className="text-white/40">• 1-Month Deposit Only</span>
          </div>

          {/* LARGE PRIMARY CTA: "Find Available Rooms →" */}
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#D4A64A] via-amber-500 to-yellow-600 text-[#0B1220] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-[#D4A64A]/30 hover:shadow-[#D4A64A]/50 hover:scale-[1.03] active:scale-[0.99] transition-all cursor-pointer btn-shimmer group shrink-0"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B1220] transition-transform group-hover:scale-110" />
            <span>Find Available Rooms</span>
            <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
          </button>

        </div>
      </form>
    </div>
  );
}
