import useScrollLock from '../hooks/useScrollLock';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Sparkles, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function RoomModal({ room, onClose, onBookNow }) {
  useScrollLock(!!room);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const imagesList = room?.images && room.images.length > 0 ? room.images : (room?.image ? [room.image] : all8Images);

  // Always show the first image (index 0) by default
  useEffect(() => {
    setActiveImageIndex(0);
    setIsFullScreen(false);
  }, [room]);

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!room) return;
      if (e.key === 'Escape') {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
      }
    };

    if (room) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [room, isFullScreen, onClose, imagesList.length]);

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
        handleNext(); // Swiped Left -> Next
      } else {
        handlePrev(); // Swiped Right -> Prev
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  if (!room) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0B1220]/80 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl rounded-3xl glass-card border border-[#D4A64A]/30 p-4 sm:p-8 shadow-2xl z-10 my-auto overflow-y-auto max-h-[92vh]"
        >
          {/* Close Button with aria-label */}
          <button
            onClick={onClose}
            aria-label="Close Room Details Modal"
            className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F0] transition-all z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
            
            {/* Left: High-Clarity Keyboard & Arrow Slider */}
            <div className="lg:col-span-7 flex flex-col gap-2">
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => setIsFullScreen(true)}
                title="Click photo to view full screen"
                className="relative h-64 xs:h-72 sm:h-80 md:h-[400px] max-h-[50vh] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#080d1a] flex items-center justify-center select-none group cursor-zoom-in"
              >
                {/* Soft ambient background fill */}
                <img
                  src={imagesList[activeImageIndex]}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-105 pointer-events-none"
                />

                {/* Active Photo - Full uncropped wide view (Zoomed out) */}
                <img
                  key={activeImageIndex}
                  src={imagesList[activeImageIndex]}
                  alt={`${room.title} interior preview`}
                  className="relative z-1 max-w-full max-h-full object-contain p-2 sm:p-3 transition-opacity duration-300 drop-shadow-2xl"
                />

                {/* Top Badges Bar */}
                <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
                  {/* Photo Counter Pill */}
                  <div className="px-2.5 sm:px-3 py-1 rounded-full bg-[#0B1220]/90 backdrop-blur-md text-[#FAF7F0] text-[10px] sm:text-xs font-mono font-bold border border-white/15 shadow-lg flex items-center gap-1.5 shrink-0">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D4A64A]" />
                    <span>Photo {activeImageIndex + 1}/{imagesList.length}</span>
                  </div>
                </div>

                {/* Previous Arrow Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Previous photo (Left Arrow)"
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0B1220]/80 hover:bg-[#0B1220] active:scale-95 text-white flex items-center justify-center transition-all border border-white/20 hover:border-[#D4A64A] shadow-xl hover:scale-105 z-10 cursor-pointer backdrop-blur-md"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </button>

                {/* Next Arrow Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Next photo (Right Arrow)"
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0B1220]/80 hover:bg-[#0B1220] active:scale-95 text-white flex items-center justify-center transition-all border border-white/20 hover:border-[#D4A64A] shadow-xl hover:scale-105 z-10 cursor-pointer backdrop-blur-md"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </button>

                {/* Bottom Center Dots Indicator */}
                <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 max-w-[85%] flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#0B1220]/85 backdrop-blur-md border border-white/15 z-10 overflow-x-auto no-scrollbar">
                  {imagesList.map((_, idx) => {
                    const isVisibleOnMobile = Math.abs(idx - activeImageIndex) <= 3 || idx === 0 || idx === imagesList.length - 1;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex(idx);
                        }}
                        aria-label={`Go to photo ${idx + 1}`}
                        className={`transition-all rounded-full cursor-pointer shrink-0 ${
                          activeImageIndex === idx
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

              <div className="flex items-center justify-between text-[10px] font-mono text-[#FAF7F0]/60 px-1">
                <span>
                  <span className="sm:hidden">👆 Tap photo for fullscreen • Swipe to browse</span>
                  <span className="hidden sm:inline">💡 Click photo for Fullscreen • <kbd className="px-1 rounded bg-white/10 text-[#D4A64A]">←</kbd> <kbd className="px-1 rounded bg-white/10 text-[#D4A64A]">→</kbd> to browse</span>
                </span>
                <span>{imagesList.length} Photos</span>
              </div>
            </div>

            {/* Right: Detailed Room Specs & Booking */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A64A]/15 text-[#D4A64A] border border-[#D4A64A]/30 text-xs font-semibold uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{room.sharing || 'Coliving'}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FAF7F0] mb-2 font-sora">
                  {room.title || room.name}
                </h3>

                <p className="text-[#FAF7F0]/80 text-xs sm:text-sm leading-relaxed mb-4">
                  {room.description || room.desc}
                </p>

                {/* Features Breakdown */}
                <h4 className="text-xs font-bold text-[#D4A64A] uppercase tracking-wider mb-2.5 font-mono">
                  Included Amenities
                </h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {(room.features || room.facilities || room.highlights || []).slice(0, 6).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#FAF7F0]/90">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl glass-card border border-white/10 mb-4">
                  <p className="text-[11px] text-[#D4A64A] mb-0.5 font-mono uppercase font-bold">Zero Hidden Costs Guarantee</p>
                  <p className="text-xs text-[#FAF7F0]/75">
                    Includes 3 times Kerala homestyle meals, power backup, washing machine, hot water, and WiFi.
                  </p>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] text-[#FAF7F0]/60 uppercase font-mono">Monthly Rent</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#FAF7F0] font-sora">
                    {room.priceDisplay || `₹${room.price?.toLocaleString('en-IN') || '7,499'}`}{' '}
                    <span className="text-xs font-normal text-[#FAF7F0]/60">/{room.period || 'month'}</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onBookNow(room.title || room.name);
                  }}
                  className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4A64A] to-yellow-600 text-[#0B1220] font-bold text-xs sm:text-sm shadow-xl shadow-[#D4A64A]/25 hover:shadow-[#D4A64A]/40 transition-all cursor-pointer"
                  data-cursor="expand"
                >
                  <Calendar className="w-4 h-4 stroke-[2.5]" />
                  <span>Reserve Room</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>

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
                    Photo {activeImageIndex + 1} of {imagesList.length}
                  </span>
                  <span className="text-sm sm:text-base font-bold font-sora text-[#FAF7F0] truncate hidden xs:inline">
                    {room.title || room.name}
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
                  src={imagesList[activeImageIndex]}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-25 scale-110 pointer-events-none"
                />

                {/* Active Fullscreen Photo */}
                <motion.img
                  key={activeImageIndex}
                  initial={{ opacity: 0.6, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  src={imagesList[activeImageIndex]}
                  alt={`${room.title || room.name} Photo ${activeImageIndex + 1}`}
                  onClick={() => setIsFullScreen(false)}
                  className="relative z-10 max-h-[74vh] max-w-[92vw] object-contain rounded-xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] cursor-zoom-out"
                  title="Click photo to exit fullscreen"
                />

                {/* Left Arrow Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photo (Left Arrow)"
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0B1220]/80 hover:bg-[#D4A64A] text-white hover:text-[#0B1220] flex items-center justify-center transition-all border border-white/25 hover:border-[#D4A64A] shadow-2xl hover:scale-110 active:scale-95 z-20 cursor-pointer backdrop-blur-md group"
                >
                  <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
                </button>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  onClick={handleNext}
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
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`Jump to photo ${idx + 1}`}
                      className={`relative w-12 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        activeImageIndex === idx
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
      </div>
    </AnimatePresence>
  );
}

