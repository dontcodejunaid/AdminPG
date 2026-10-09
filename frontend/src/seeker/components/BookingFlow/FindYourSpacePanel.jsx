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
import LuxurySelect from '../LuxurySelect';
import LuxuryDatePicker from '../LuxuryDatePicker';
import { api } from '../../../services/api';

const DEFAULT_ADMIN_LOCATIONS = [
  {
    value: 'all',
    label: 'Pan-India',
    badge: 'All Hubs',
    subtext: 'Browse all active coliving campuses across Kerala & Karnataka',
  },
  {
    value: 'Kochi',
    label: 'Kochi',
    badge: 'Kerala',
    subtext: 'Kakkanad • Edappally • Kaloor • Infopark Campus',
    groupHeader: 'Kerala Hubs',
  },
  {
    value: 'Thiruvananthapuram',
    label: 'Thiruvananthapuram',
    badge: 'Kerala',
    subtext: 'Kazhakkoottam (Technopark) • Pattom',
  },
  {
    value: 'Kozhikode',
    label: 'Kozhikode',
    badge: 'Kerala',
    subtext: 'Cyberpark • Hilite City',
  },
  {
    value: 'Bengaluru',
    label: 'Bengaluru',
    badge: 'Karnataka',
    subtext: 'Electronic City • HSR • Sannidhi Layout / Jigani (HCL)',
    groupHeader: 'Karnataka Hubs',
  },
  {
    value: 'Mysuru',
    label: 'Mysuru',
    badge: 'Karnataka',
    subtext: 'Hebbal • Bannimantap • NR Mohalla',
  },
  {
    value: 'Ramanagara',
    label: 'Ramanagara',
    badge: 'Karnataka',
    subtext: 'Ghousia College (GCE) • Local Town',
  },
];

export default function FindYourSpacePanel({
  initialFilters = {},
  onSearch,
  className = '',
}) {
  // 1. Location
  const [location, setLocation] = useState(initialFilters.location || 'all');
  const [dynamicLocations, setDynamicLocations] = useState(DEFAULT_ADMIN_LOCATIONS);

  // Fetch dynamic locations live from Admin database
  useEffect(() => {
    let isMounted = true;
    const fetchAdminLocations = async () => {
      try {
        const res = await api.getLocations();
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const list = [
            {
              value: 'all',
              label: 'Pan-India',
              badge: 'All Hubs',
              subtext: 'Browse all active coliving campuses across Kerala & Karnataka',
            },
          ];

          (res.data || []).forEach((country) => {
            (country.states || []).forEach((state) => {
              const stateName = state.name || 'Region';
              const stateCode = state.code || stateName.substring(0, 2).toUpperCase();

              (state.cities || []).forEach((city, cIdx) => {
                const areasStr = (city.areas || [])
                  .map((a) => (typeof a === 'string' ? a : a.name))
                  .filter(Boolean)
                  .join(' • ');

                list.push({
                  value: city.name,
                  label: city.name,
                  badge: stateCode,
                  subtext: areasStr ? areasStr : `${stateName} Coliving Hub`,
                  groupHeader: cIdx === 0 ? `${stateName} (${state.cities?.length || 0} Cities)` : undefined,
                });
              });
            });
          });

          if (list.length > 1) {
            setDynamicLocations(list);
          }
        }
      } catch (err) {
        console.warn('Using default admin locations:', err);
      }
    };
    fetchAdminLocations();
    return () => {
      isMounted = false;
    };
  }, []);

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
      className={`rounded-3xl bg-[#0B1220] border border-[#D4A64A]/30 p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-[#FAF7F0] relative z-20 ${className}`}
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
      <form onSubmit={handleApply} className="space-y-4 relative z-30">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          
          {/* 1. Location Selector */}
          <div className="space-y-1">
            <LuxurySelect
              label="Location"
              icon={MapPin}
              value={location}
              searchable={true}
              options={dynamicLocations}
              onChange={(val) => {
                setLocation(val);
                emitSearch({ location: val });
              }}
            />
          </div>

          {/* 2. Room Type Selector */}
          <div className="space-y-1">
            <LuxurySelect
              label="Room Type"
              icon={Home}
              value={roomType}
              options={[
                { value: 'all', label: 'Any Room Type' },
                { value: '1bhk', label: '1 BHK Suite', badge: 'Private' },
                { value: '2bhk', label: '2 BHK Flat', badge: 'Spacious' },
                { value: 'single', label: 'Single Room', badge: 'Solo' },
                { value: 'shared', label: 'Shared Room', badge: 'Budget' },
              ]}
              onChange={(val) => {
                setRoomType(val);
                emitSearch({ roomType: val });
              }}
            />
          </div>

          {/* 3. Sharing Selector */}
          <div className="space-y-1">
            <LuxurySelect
              label="Sharing"
              icon={Users}
              value={sharing}
              options={[
                { value: 'all', label: 'Any Sharing' },
                { value: '1', label: 'Single Sharing' },
                { value: '2', label: 'Double Sharing' },
                { value: '3', label: 'Triple Sharing' },
                { value: '4', label: 'Four Sharing' },
              ]}
              onChange={(val) => {
                setSharing(val);
                emitSearch({ sharing: val });
              }}
            />
          </div>

          {/* 4. Gender / Occupancy */}
          <div className="space-y-1">
            <LuxurySelect
              label="Gender"
              icon={ShieldCheck}
              value={gender}
              options={[
                { value: 'all', label: 'Any / Coliving' },
                { value: 'boys', label: 'Boys / Men' },
                { value: 'girls', label: 'Girls / Women' },
              ]}
              onChange={(val) => {
                setGender(val);
                emitSearch({ gender: val });
              }}
            />
          </div>

          {/* 5. Check-In / Move-In Date */}
          <div className="space-y-1">
            <LuxuryDatePicker
              label={stayType === 'month' ? 'Move-In Date' : 'Check-In Date'}
              icon={Calendar}
              value={checkInDate}
              minDate={todayStr}
              onChange={(val) => {
                setCheckInDate(val);
                emitSearch({ checkInDate: val });
              }}
            />
          </div>

          {/* 6. Dynamic Duration Select based on Stay Type */}
          <div className="space-y-1">
            {stayType === 'day' && (
              <LuxurySelect
                label="Duration (Days)"
                icon={Clock}
                value={durationDays}
                className="py-2.5"
                align="right"
                dropdownClassName="min-w-[190px]"
                options={[
                  { value: '1', label: '1 Day', badge: '₹499' },
                  { value: '2', label: '2 Days' },
                  { value: '3', label: '3 Days' },
                  { value: '5', label: '5 Days' },
                  { value: '7', label: '7 Days' },
                  { value: '10', label: '10 Days' },
                  { value: '14', label: '14 Days' },
                ]}
                onChange={(val) => {
                  setDurationDays(val);
                  emitSearch({ durationDays: val });
                }}
              />
            )}

            {stayType === 'week' && (
              <LuxurySelect
                label="Duration (Weeks)"
                icon={Clock}
                value={durationWeeks}
                className="py-2.5"
                align="right"
                dropdownClassName="min-w-[190px]"
                options={[
                  { value: '1', label: '1 Week' },
                  { value: '2', label: '2 Weeks' },
                  { value: '3', label: '3 Weeks' },
                  { value: '4', label: '4 Weeks' },
                ]}
                onChange={(val) => {
                  setDurationWeeks(val);
                  emitSearch({ durationWeeks: val });
                }}
              />
            )}

            {stayType === 'month' && (
              <LuxurySelect
                label="Stay Duration"
                icon={Clock}
                value={durationMonths}
                className="py-2.5"
                align="right"
                dropdownClassName="min-w-[190px]"
                options={[
                  { value: '1', label: '1 Month' },
                  { value: '2', label: '2 Months' },
                  { value: '3', label: '3 Months' },
                  { value: '6', label: '6 Months' },
                  { value: '11', label: '11 Months' },
                ]}
                onChange={(val) => {
                  setDurationMonths(val);
                  emitSearch({ durationMonths: val });
                }}
              />
            )}
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
