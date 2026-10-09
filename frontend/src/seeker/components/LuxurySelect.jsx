import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';

export default function LuxurySelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  label = null,
  icon: Icon = null,
  className = '',
  dropdownClassName = '',
  searchable = false,
  align = 'auto',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [computedAlign, setComputedAlign] = useState(align === 'right' ? 'right' : 'left');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options: can be array of strings or objects { value, label, badge, subtext }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt) };
    }
    return {
      value: opt.value,
      label: opt.label !== undefined ? opt.label : String(opt.value),
      badge: opt.badge,
      subtext: opt.subtext,
      groupHeader: opt.groupHeader,
    };
  });

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  const filteredOptions = searchable && searchTerm.trim()
    ? normalizedOptions.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (opt.subtext && opt.subtext.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : normalizedOptions;

  // Calculate best alignment
  const calculateAlignment = () => {
    if (align === 'right') return 'right';
    if (align === 'left') return 'left';
    if (!containerRef.current) return 'left';

    const rect = containerRef.current.getBoundingClientRect();
    const spaceOnRight = window.innerWidth - rect.left;
    // If there's less than 300px on the right or the element is in the right half of the screen
    if (spaceOnRight < 300 || rect.right > window.innerWidth - 60 || rect.left > window.innerWidth * 0.55) {
      return 'right';
    }
    return 'left';
  };

  // Smart boundary detection to keep dropdown inside viewport
  useEffect(() => {
    if (isOpen && containerRef.current) {
      setComputedAlign(calculateAlignment());
    }
  }, [isOpen, align]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen, searchable]);

  const handleSelect = (val) => {
    setIsOpen(false);
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full space-y-1 select-none">
      {label && (
        <label className="text-[11px] font-mono text-[#D4A64A] flex items-center gap-1">
          {Icon && <Icon className="w-3 h-3" />}
          <span>{label}</span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (!isOpen) {
            setComputedAlign(calculateAlignment());
          }
          setIsOpen(!isOpen);
        }}
        className={`w-full flex items-center justify-between gap-1.5 px-3 py-2.5 rounded-2xl bg-[#10192B] border transition-all text-left outline-none cursor-pointer group ${
          isOpen
            ? 'border-[#D4A64A] shadow-[0_0_15px_rgba(212,166,74,0.25)] ring-1 ring-[#D4A64A]/40'
            : 'border-white/15 hover:border-[#D4A64A]/50 hover:bg-[#131E34]'
        } ${className}`}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="text-xs sm:text-sm font-semibold text-[#FAF7F0] truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="text-[8px] xs:text-[9px] px-1.5 py-0.5 rounded-md bg-[#D4A64A]/20 text-[#D4A64A] font-mono shrink-0 font-bold border border-[#D4A64A]/30">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-white/50 group-hover:text-[#D4A64A] transition-colors ml-1"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            style={{ backgroundColor: '#0B1220' }}
            className={`absolute ${
              computedAlign === 'right' ? 'right-0' : 'left-0'
            } top-full mt-2 z-[9999] min-w-[240px] sm:min-w-[280px] max-w-[calc(100vw-24px)] rounded-2xl bg-[#0B1220] border border-[#D4A64A]/45 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(0,0,0,0.9)] p-2 overflow-hidden ${dropdownClassName}`}
          >
            {/* Optional Search */}
            {searchable && (
              <div className="p-1 mb-1.5 border-b border-white/10 relative">
                <Search className="w-3.5 h-3.5 text-[#D4A64A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search city, area or tech park..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#10192B] text-[#FAF7F0] placeholder-white/40 border border-white/10 focus:border-[#D4A64A] focus:outline-none"
                />
              </div>
            )}

            {/* Options List */}
            <div className="max-h-64 overflow-y-auto space-y-1 custom-scroll pr-1">
              {filteredOptions.length === 0 ? (
                <div className="py-4 text-center text-xs text-white/50 font-mono">
                  No matching options
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = String(opt.value) === String(value);
                  return (
                    <React.Fragment key={String(opt.value) + idx}>
                      {opt.groupHeader && (
                        <div className="px-2.5 pt-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-[#D4A64A] font-bold border-t border-white/5 first:border-t-0">
                          {opt.groupHeader}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm text-left transition-all cursor-pointer group ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#D4A64A]/30 to-amber-500/15 text-[#FAF7F0] font-bold border border-[#D4A64A]/50 shadow-sm'
                            : 'text-[#FAF7F0]/85 hover:bg-white/10 hover:text-[#FAF7F0]'
                        }`}
                      >
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#FAF7F0]">{opt.label}</span>
                            {opt.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#D4A64A]/20 text-[#D4A64A] font-mono border border-[#D4A64A]/30 font-bold shrink-0">
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          {opt.subtext && (
                            <span className="text-[10.5px] text-white/55 font-mono line-clamp-1 mt-0.5">
                              {opt.subtext}
                            </span>
                          )}
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-[#D4A64A] shrink-0 stroke-[2.5]" />
                        )}
                      </button>
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
