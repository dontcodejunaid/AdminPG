import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  MapPin,
  CheckCircle2,
  Phone,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';

const all8Images = [
  "/images/1pg.jpeg",
  "/images/2pg.jpeg",
  "/images/3pg.jpeg",
  "/images/4pg.jpeg",
  "/images/5pg.jpeg",
  "/images/6pg.jpeg",
  "/images/7pg.jpeg",
  "/images/8pg.jpeg"
];

export default function RoomDetailsModal({
  isOpen,
  onClose,
  room,
  currentStayType = 'day',
  onProceedToBooking,
}) {
  useScrollLock(isOpen);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const imagesList = room?.images && room.images.length > 0 ? room.images : (room?.image ? [room.image] : all8Images);

  // Always show the first image (index 0) by default when opening the modal
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setIsFullScreen(false);
    }
  }, [isOpen, room]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  // Keyboard Navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullScreen, onClose, imagesList.length]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distanceX = touchStartX.current - touchEndX.current;
    const distanceY = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 45;

    // In Fullscreen Mode: Swiping vertically exits fullscreen mode back to modal
    if (isFullScreen && Math.abs(distanceY) > 50 && Math.abs(distanceY) > Math.abs(distanceX)) {
      setIsFullScreen(false);
    } else if (Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) {
        handleNextImage(); // Swiped Left -> Next
      } else {
        handlePrevImage(); // Swiped Right -> Prev
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  if (!isOpen || !room) return null;
  if (typeof document === 'undefined') return null;

  const facilitiesList = room.facilities || [
    "Lounge area",
    "Power back up",
    "CCTV",
    "Washing machine",
    "3 times Kerala food",
    "Entertainment zone",
    "Caretaker",
    "24/7 hot water",
    "Self cooking area",
    "WiFi"
  ];

  const phones = room.phones || ["9900082615", "8150082433"];

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-[#0B1220]/90 backdrop-blur-md">
      {/* Floating High-Contrast Close Button - Desktop */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="hidden sm:flex fixed top-4 right-4 z-[100000] px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-extrabold text-xs items-center gap-1.5 shadow-[0_10px_25px_rgba(239,68,68,0.5)] border-2 border-white/30 transition-all cursor-pointer"
      >
        <X className="w-4 h-4 stroke-[3]" />
        <span>Close (Esc)</span>
      </button>

      {/* Backdrop click dismisser */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Flex container that prevents top clipping */}
      <div className="min-h-full flex items-start sm:items-center justify-center p-2 sm:p-4 pt-16 sm:pt-6 pb-8 relative pointer-events-none">
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl rounded-3xl bg-[#0B1220] border-2 border-[#D4A64A]/50 text-[#FAF7F0] shadow-[0_25px_80px_rgba(0,0,0,0.98)] z-10 overflow-hidden flex flex-col max-h-[calc(100vh-5rem)] sm:max-h-[92vh] my-auto pointer-events-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-30 p-2.5 sm:p-4 border-b border-white/10 flex items-center justify-between gap-2 bg-[#0E172A] shadow-md">
            {/* Back Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-[#FAF7F0] text-xs font-bold flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer shadow-sm hover:border-[#D4A64A]/50 group shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4A64A] group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back to Rooms</span>
              <span className="sm:hidden">Back</span>
            </button>

            {/* Middle Badges */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink">
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#D4A64A]/15 text-[#D4A64A] text-[10px] sm:text-xs font-mono font-bold border border-[#D4A64A]/30 shrink-0">
                Coliving
              </span>
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px] sm:text-xs font-mono font-bold border border-emerald-500/30 truncate text-center">
                {room.sharingLabel || '1, 2, 3 & 4 Sharing'}
              </span>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500 text-red-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-red-500/30 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            
            {/* High-Clarity Keyboard & Arrow Navigable Image Slider */}
            <div className="space-y-2">
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => setIsFullScreen(true)}
                title="Click photo to view full screen"
                className="relative h-64 xs:h-72 sm:h-88 md:h-[420px] max-h-[55vh] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#080d1a] flex items-center justify-center select-none group cursor-zoom-in"
              >
                {/* Soft ambient background fill */}
                <img
                  src={imagesList[currentImageIndex]}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-105 pointer-events-none"
                />

                {/* Active Photo - Full uncropped wide view (Zoomed out) */}
                <img
                  key={currentImageIndex}
                  src={imagesList[currentImageIndex]}
                  alt={`Aafa Coliving Photo ${currentImageIndex + 1}`}
                  className="relative z-1 max-w-full max-h-full object-contain p-2 sm:p-4 transition-opacity duration-300 drop-shadow-2xl"
                />

                {/* Top Badges Bar - flex container to prevent overlap on all devices */}
                <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 flex items-center justify-between gap-2 pointer-events-none z-10">
                  {/* Photo Counter Pill */}
                  <div className="px-2.5 sm:px-3 py-1 rounded-full bg-[#0B1220]/90 backdrop-blur-md text-[#FAF7F0] text-[10px] sm:text-xs font-mono font-bold border border-white/15 shadow-lg flex items-center gap-1.5 shrink-0">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D4A64A]" />
                    <span>Photo {currentImageIndex + 1}/{imagesList.length}</span>
                  </div>

                  {/* Rating Badge */}
                  <div className="px-2.5 sm:px-3 py-1 rounded-full bg-[#0B1220]/90 backdrop-blur-md text-[#FAF7F0] text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 border border-white/15 shadow-lg shrink-0">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4A64A] fill-[#D4A64A]" />
                    <span>4.9 <span className="hidden xs:inline font-normal text-[#FAF7F0]/80">(140+)</span></span>
                  </div>
                </div>

                {/* Left Navigation Arrow */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  aria-label="Previous photo (Left Arrow)"
                  title="Previous Photo (Left Arrow Key)"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0B1220]/80 hover:bg-[#0B1220] active:scale-95 text-white flex items-center justify-center transition-all border border-white/25 hover:border-[#D4A64A] shadow-2xl hover:scale-105 z-10 cursor-pointer backdrop-blur-md"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                </button>

                {/* Right Navigation Arrow */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  aria-label="Next photo (Right Arrow)"
                  title="Next Photo (Right Arrow Key)"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0B1220]/80 hover:bg-[#0B1220] active:scale-95 text-white flex items-center justify-center transition-all border border-white/25 hover:border-[#D4A64A] shadow-2xl hover:scale-105 z-10 cursor-pointer backdrop-blur-md"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                </button>

                {/* Bottom Center Smart Dots Indicator */}
                <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 max-w-[85%] flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#0B1220]/85 backdrop-blur-md border border-white/15 z-10 overflow-x-auto no-scrollbar">
                  {imagesList.map((_, idx) => {
                    const isVisibleOnMobile = Math.abs(idx - currentImageIndex) <= 3 || idx === 0 || idx === imagesList.length - 1;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        aria-label={`Go to photo ${idx + 1}`}
                        className={`transition-all rounded-full cursor-pointer shrink-0 ${
                          currentImageIndex === idx
                            ? 'w-4 sm:w-6 h-1.5 sm:h-2 bg-[#D4A64A]'
                            : isVisibleOnMobile
                            ? 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/70'
                            : 'hidden sm:block w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/20'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Keyboard & Swipe Hint Bar */}
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#FAF7F0]/60 px-1">
                <span>
                  <span className="sm:hidden">👆 Tap photo for fullscreen • Swipe to browse</span>
                  <span className="hidden sm:inline">💡 Click photo for Fullscreen • <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#D4A64A] font-bold">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#D4A64A] font-bold">→</kbd> arrows or swipe to browse</span>
                </span>
                <span>{imagesList.length} Photos</span>
              </div>
            </div>

            {/* Title, Direction, and Contact Details */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono text-[#D4A64A] uppercase tracking-wider block mb-0.5">
                    {room.pgName || 'Aafa Coliving'} • {room.badge || 'Coliving'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-sora text-[#FAF7F0]">
                    {room.name}
                  </h3>
                </div>
                
                {/* Direct Call / Contact Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {phones.map((p, i) => (
                    <a
                      key={i}
                      href={`tel:${p}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 border border-emerald-500/40 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{p}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Direction Badge */}
              <div className="flex items-start gap-2 text-xs sm:text-sm text-[#FAF7F0]/90 font-medium bg-[#0B1220]/60 p-3 rounded-xl border border-white/10">
                <MapPin className="w-4 h-4 text-[#D4A64A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#D4A64A]">Direction: </span>
                  <span>{room.direction || 'Near HCL Gate no 2, Sannidhi layout, Jigani'}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#FAF7F0]/80 leading-relaxed">
                {room.desc}
              </p>
            </div>

            {/* 3 Stay Rates Comparison */}
            <div className="rounded-2xl bg-[#10192B] border border-white/10 p-4 space-y-3">
              <h4 className="text-xs font-mono font-bold text-[#D4A64A] uppercase tracking-wider">
                Available Stay Plans for this Room
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#0B1220] border border-white/10 text-center">
                  <span className="text-[10px] font-mono text-white/60 block">Day Stay</span>
                  <span className="text-lg font-bold text-[#FAF7F0] font-sora block">
                    {room.stayRates?.dayDisplay || '₹499'}
                    <span className="text-xs font-normal text-white/50">/day</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">Breakfast Free</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0B1220] border border-white/10 text-center">
                  <span className="text-[10px] font-mono text-white/60 block">Weekly Stay</span>
                  <span className="text-lg font-bold text-[#FAF7F0] font-sora block">
                    {room.stayRates?.weekDisplay || '₹2,199'}
                    <span className="text-xs font-normal text-white/50">/week</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">Breakfast & Dinner</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0B1220] border border-[#D4A64A]/40 text-center bg-gradient-to-b from-[#D4A64A]/10 to-transparent">
                  <span className="text-[10px] font-mono text-[#D4A64A] font-bold block">Monthly (Best Value)</span>
                  <span className="text-lg font-bold text-[#D4A64A] font-sora block">
                    {room.stayRates?.monthDisplay || room.priceDisplay}
                    <span className="text-xs font-normal text-white/50">/month</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">3 Times Kerala Food</span>
                </div>
              </div>
            </div>

            {/* All 10 Included Facilities */}
            <div>
              <h4 className="text-xs font-mono font-bold text-[#D4A64A] uppercase tracking-wider mb-3">
                All 10 Included Campus Facilities
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {facilitiesList.map((facility, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-[#FAF7F0] font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="capitalize">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Action Bar */}
          <div className="p-3 sm:p-5 border-t border-white/10 bg-[#0E172A] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold text-white/90 transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white/15 hover:border-[#D4A64A]/40"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#D4A64A]" />
                <span>Back</span>
              </button>

              <a
                href={`tel:${phones[0]}`}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Desk</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onProceedToBooking) onProceedToBooking(room);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A64A] via-amber-500 to-yellow-600 text-[#0B1220] text-xs sm:text-sm font-extrabold shadow-lg shadow-[#D4A64A]/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer btn-shimmer"
            >
              <span>Choose Stay Plan & Book</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* FULLSCREEN LIGHTBOX PHOTO VIEWER */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100005] bg-[#050914]/98 backdrop-blur-3xl flex flex-col justify-between p-3 sm:p-6 select-none pointer-events-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-3 text-white z-20 shrink-0 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-3 py-1 rounded-full bg-[#D4A64A]/20 text-[#D4A64A] text-xs font-mono font-bold border border-[#D4A64A]/40 shrink-0">
                  Photo {currentImageIndex + 1} of {imagesList.length}
                </span>
                <span className="text-sm sm:text-base font-bold font-sora text-[#FAF7F0] truncate hidden xs:inline">
                  {room.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-white/50 hidden md:inline">
                  Double-click or press Esc to exit
                </span>
                <button
                  type="button"
                  onClick={() => setIsFullScreen(false)}
                  aria-label="Exit full screen mode"
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/80 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 hover:border-red-400 transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                  <span>Exit Fullscreen</span>
                </button>
              </div>
            </div>

            {/* Central Stage */}
            <div className="relative flex-1 flex items-center justify-center min-h-0 py-2 sm:py-4">
              {/* Soft ambient backlight glow */}
              <img
                src={imagesList[currentImageIndex]}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-25 scale-110 pointer-events-none"
              />

              {/* Active Fullscreen Photo */}
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0.6, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.6, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                src={imagesList[currentImageIndex]}
                alt={`${room.name} Photo ${currentImageIndex + 1}`}
                onClick={() => setIsFullScreen(false)}
                className="relative z-10 max-h-[74vh] max-w-[92vw] object-contain rounded-xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] cursor-zoom-out"
                title="Click photo to exit fullscreen"
              />

              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous photo (Left Arrow)"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0B1220]/80 hover:bg-[#D4A64A] text-white hover:text-[#0B1220] flex items-center justify-center transition-all border border-white/25 hover:border-[#D4A64A] shadow-2xl hover:scale-110 active:scale-95 z-20 cursor-pointer backdrop-blur-md group"
              >
                <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next photo (Right Arrow)"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0B1220]/80 hover:bg-[#D4A64A] text-white hover:text-[#0B1220] flex items-center justify-center transition-all border border-white/25 hover:border-[#D4A64A] shadow-2xl hover:scale-110 active:scale-95 z-20 cursor-pointer backdrop-blur-md group"
              >
                <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Bottom Strip: Thumbnails & Navigation Hint */}
            <div className="z-20 shrink-0 pt-2 border-t border-white/10 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 overflow-x-auto max-w-full p-1 no-scrollbar">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    aria-label={`Jump to photo ${idx + 1}`}
                    className={`relative w-12 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      currentImageIndex === idx
                        ? 'border-[#D4A64A] scale-105 shadow-[0_0_15px_rgba(212,166,74,0.6)]'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="text-[11px] font-mono text-[#FAF7F0]/60 flex items-center gap-3">
                <span>⌨️ Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#D4A64A] font-bold">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#D4A64A] font-bold">→</kbd> arrows or swipe to browse photos</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
