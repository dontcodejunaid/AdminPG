import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, ArrowRight, ChevronLeft, ChevronRight, Tag, MapPin, ExternalLink, Flame } from 'lucide-react';
import { api } from '../../services/api';

export default function PromotionalBannerSection({
  placement = 'Homepage Hero Top',
  currentCity = 'All',
  onSelectCityFilter,
  className = '',
}) {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.getBanners()
      .then((res) => {
        if (res && res.data && isMounted) {
          const todayStr = new Date().toISOString().split('T')[0];
          // Filter active & valid date banners
          const valid = res.data.filter((b) => {
            const active = b.isActive !== false && b.is_active !== false;
            const startOk = !b.startDate || b.startDate <= todayStr;
            const endOk = !b.endDate || b.endDate >= todayStr;
            return active && startOk && endOk;
          });

          setBanners(valid);
        }
      })
      .catch((err) => console.warn('Banners fetch non-blocking error:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter banners matching current placement slot or matching city
  const filteredBanners = banners.filter((b) => {
    // If placement is specified, match placement or allow general
    const bPlacement = b.placement || 'Homepage Hero Top';
    const matchPlacement = placement === 'all' || bPlacement.toLowerCase() === placement.toLowerCase();
    
    // If city is specified, check city match
    const bCity = b.city || 'All Cities';
    const matchCity = currentCity === 'All' || bCity === 'All Cities' || bCity.toLowerCase() === currentCity.toLowerCase();

    return matchPlacement && matchCity;
  });

  const activePool = filteredBanners.length > 0 ? filteredBanners : (banners.length > 0 && placement === 'Homepage Hero Top' ? banners : []);

  // Auto rotate banner every 6 seconds if multiple banners
  useEffect(() => {
    if (activePool.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activePool.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [activePool.length, isPaused]);

  if (activePool.length === 0) return null;

  const currentBanner = activePool[currentIndex % activePool.length];

  const handleBannerClick = () => {
    const target = currentBanner.targetUrl || currentBanner.target_url || currentBanner.link;
    if (!target) return;

    if (target.startsWith('http')) {
      window.open(target, '_blank');
    } else if (target.startsWith('#')) {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (target.includes('city=') && onSelectCityFilter) {
      const urlParams = new URLSearchParams(target.split('?')[1] || '');
      const c = urlParams.get('city');
      if (c) onSelectCityFilter(c);
      navigate(target);
    } else {
      navigate(target);
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl group ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id || currentIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          onClick={handleBannerClick}
          className="relative min-h-[160px] sm:min-h-[190px] md:min-h-[220px] rounded-3xl overflow-hidden cursor-pointer border border-[#D4A64A]/30 shadow-2xl flex items-center p-5 sm:p-8 md:p-10 select-none"
        >
          {/* Background Banner Image */}
          <img
            src={currentBanner.imageUrl || currentBanner.image_url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1400&q=80'}
            alt={currentBanner.title}
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.45] group-hover:scale-105 transition-transform duration-700"
          />

          {/* Luxury Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070D1A] via-[#0B1220]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D1A] via-transparent to-transparent opacity-70" />

          {/* Banner Content */}
          <div className="relative z-10 max-w-2xl flex flex-col items-start gap-2.5">
            {/* Slot & City Tag */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#D4A64A]/20 border border-[#D4A64A]/40 text-[#D4A64A] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md backdrop-blur-md">
                <Megaphone className="w-3.5 h-3.5 text-[#D4A64A]" />
                <span>{currentBanner.placement || 'Featured Promo'}</span>
                {currentBanner.city && currentBanner.city !== 'All Cities' && (
                  <>
                    <span className="opacity-40">•</span>
                    <span className="text-white flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-[#D4A64A]" />
                      {currentBanner.city}
                    </span>
                  </>
                )}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-2xl md:text-3xl font-black font-sora text-[#FAF7F0] tracking-tight leading-snug group-hover:text-[#D4A64A] transition-colors">
              {currentBanner.title}
            </h3>

            {/* Subtitle */}
            {currentBanner.subtitle && (
              <p className="text-xs sm:text-sm text-[#FAF7F0]/85 max-w-xl font-medium leading-relaxed">
                {currentBanner.subtitle}
              </p>
            )}

            {/* CTA Button */}
            <div className="mt-1 flex items-center gap-2">
              <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A64A] to-amber-500 text-[#0B1220] text-xs font-extrabold shadow-lg shadow-[#D4A64A]/25 flex items-center gap-1.5 group-hover:scale-105 transition-transform">
                <span>Explore Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              {currentBanner.targetUrl && (
                <span className="text-[10px] font-mono text-[#FAF7F0]/60 hidden sm:inline">
                  {currentBanner.targetUrl}
                </span>
              )}
            </div>
          </div>

          {/* Navigation Controls (If > 1 banner) */}
          {activePool.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev === 0 ? activePool.length - 1 : prev - 1));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0B1220]/80 hover:bg-[#D4A64A] text-white hover:text-[#0B1220] flex items-center justify-center transition-all z-20 backdrop-blur-md opacity-0 group-hover:opacity-100 border border-white/20"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev + 1) % activePool.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0B1220]/80 hover:bg-[#D4A64A] text-white hover:text-[#0B1220] flex items-center justify-center transition-all z-20 backdrop-blur-md opacity-0 group-hover:opacity-100 border border-white/20"
                aria-label="Next banner"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-20">
                {activePool.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(i);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === currentIndex % activePool.length
                        ? 'w-6 bg-[#D4A64A]'
                        : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
