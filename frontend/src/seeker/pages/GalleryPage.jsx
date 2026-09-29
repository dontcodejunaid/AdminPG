import useScrollLock from '../hooks/useScrollLock';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeImage, setActiveImage] = useState(null);
  useScrollLock(!!activeImage);

  const galleryItems = [
    {
      id: 1,
      title: 'Aafa Coliving - Private & Executive Rooms',
      category: 'rooms',
      image: '/images/1pg.jpeg',
      caption: 'Furnished bedroom space with beds, wardrobes, and high-speed WiFi.'
    },
    {
      id: 2,
      title: 'Aafa Coliving - Twin & Sharing Bedrooms',
      category: 'rooms',
      image: '/images/2pg.jpeg',
      caption: 'Spacious sharing room layout with power backup and natural ventilation.'
    },
    {
      id: 3,
      title: 'Aafa Coliving - Triple & Sharing Setup',
      category: 'rooms',
      image: '/images/3pg.jpeg',
      caption: 'Comfortable sharing arrangement with individual storage and charging points.'
    },
    {
      id: 4,
      title: 'Aafa Coliving - Quad Room & Wardrobes',
      category: 'rooms',
      image: '/images/4pg.jpeg',
      caption: 'Clean, well-maintained budget-friendly 4 sharing room setup.'
    },
    {
      id: 5,
      title: 'Aafa Coliving - Common Lounge & Living Zone',
      category: 'lounge',
      image: '/images/5pg.jpeg',
      caption: 'Relaxing lounge area and entertainment zone for residents.'
    },
    {
      id: 6,
      title: 'Aafa Coliving - Dining Hall & Kerala Mess',
      category: 'dining',
      image: '/images/6pg.jpeg',
      caption: 'Communal dining space serving 3 times fresh homestyle Kerala meals.'
    },
    {
      id: 7,
      title: 'Aafa Coliving - Washing & Utility Area',
      category: 'lounge',
      image: '/images/7pg.jpeg',
      caption: 'Washing machine and utility facilities with 24/7 hot water supply.'
    },
    {
      id: 8,
      title: 'Aafa Coliving - Self Cooking & Kitchen Space',
      category: 'kitchen',
      image: '/images/8pg.jpeg',
      caption: 'Self cooking kitchen area equipped with essential amenities for residents.'
    }
  ];

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  const activeIndex = activeImage ? filteredItems.findIndex(item => item.id === activeImage.id) : -1;

  const handlePrev = () => {
    if (activeIndex === -1) return;
    const prevIndex = activeIndex === 0 ? filteredItems.length - 1 : activeIndex - 1;
    setActiveImage(filteredItems[prevIndex]);
  };

  const handleNext = () => {
    if (activeIndex === -1) return;
    const nextIndex = activeIndex === filteredItems.length - 1 ? 0 : activeIndex + 1;
    setActiveImage(filteredItems[nextIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeImage) return;
      if (e.key === 'Escape') {
        setActiveImage(null);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    if (activeImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage, activeIndex, filteredItems]);

  return (
    <PageTransition>
      <div className="relative pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-[#D4A64A] text-xs font-semibold uppercase tracking-wider mb-4">
            <Image className="w-4 h-4 text-[#D4A64A]" />
            <span>Aafa Campus Photo Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 font-sora tracking-tight">
            Take a Virtual Walk Through <span className="text-gradient-gold">Aafa Coliving</span>
          </h2>
          <p className="opacity-80 text-base sm:text-lg">
            Real photos of our bedrooms, attached bathrooms, dining mess, gaming lounge, and rooftop terrace across Pan-India.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'rooms', label: 'Bedrooms & Workstations' },
            { id: 'dining', label: 'Dining & Kerala Mess' },
            { id: 'kitchen', label: 'Kitchen & Prep' },
            { id: 'lounge', label: 'Lounge & Rooftop' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeFilter === tab.id
                  ? 'bg-gradient-to-r from-[#D4A64A] to-yellow-600 text-[#0B1220] shadow-lg shadow-[#D4A64A]/25 scale-105 font-bold'
                  : 'glass-card opacity-80 hover:opacity-100'
              }`}
              data-cursor="expand"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/10 cursor-pointer group relative h-72"
                data-cursor="expand"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent opacity-90" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#D4A64A] uppercase bg-[#0B1220]/80 px-2 py-0.5 rounded border border-[#D4A64A]/30">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold mt-1 font-sora">
                      {item.title}
                    </h3>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#D4A64A] text-[#0B1220] shadow-md">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveImage(null)}
                className="fixed inset-0 bg-[#0B1220]/95 backdrop-blur-2xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-5xl w-full rounded-3xl overflow-hidden glass-card border border-[#D4A64A]/40 p-3 sm:p-5 shadow-2xl z-10"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <span className="px-3 py-1 rounded-full bg-[#D4A64A]/20 text-[#D4A64A] text-xs font-mono font-bold border border-[#D4A64A]/40">
                    Photo {activeIndex + 1} of {filteredItems.length}
                  </span>
                  <button
                    onClick={() => setActiveImage(null)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative h-[50vh] sm:h-[65vh] rounded-2xl overflow-hidden bg-[#080d1a] flex items-center justify-center border border-white/10 group">
                  <img
                    src={activeImage.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-25 scale-105 pointer-events-none"
                  />
                  <img
                    key={activeImage.id}
                    src={activeImage.image}
                    alt={activeImage.title}
                    onDoubleClick={() => setActiveImage(null)}
                    title="Double click to close"
                    className="relative z-1 max-w-full max-h-full object-contain p-2 sm:p-4 drop-shadow-2xl cursor-zoom-out"
                  />

                  {/* Previous Arrow */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0B1220]/80 hover:bg-[#D4A64A] text-white hover:text-[#0B1220] flex items-center justify-center transition-all border border-white/20 shadow-xl z-20 cursor-pointer backdrop-blur-md"
                  >
                    <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                  </button>

                  {/* Next Arrow */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0B1220]/80 hover:bg-[#D4A64A] text-white hover:text-[#0B1220] flex items-center justify-center transition-all border border-white/20 shadow-xl z-20 cursor-pointer backdrop-blur-md"
                  >
                    <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                  </button>
                </div>

                <div className="px-2 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-sora text-[#FAF7F0]">
                      {activeImage.title}
                    </h3>
                    <p className="text-xs text-[#FAF7F0]/70 mt-0.5">
                      {activeImage.caption}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#FAF7F0]/50 shrink-0">
                    Use <kbd className="px-1 rounded bg-white/10 text-[#D4A64A]">←</kbd> <kbd className="px-1 rounded bg-white/10 text-[#D4A64A]">→</kbd> to browse
                  </span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}

