import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Format Date -> 'YYYY-MM-DD'
const toIsoDateString = (date) => {
  if (!date || isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Parse 'YYYY-MM-DD' or Date string
const parseDate = (val) => {
  if (!val) return null;
  if (val instanceof Date && !isNaN(val.getTime())) return val;
  if (typeof val === 'string') {
    const parts = val.split('-');
    if (parts.length === 3) {
      const parsed = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      if (!isNaN(parsed.getTime())) return parsed;
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
};

// Format for display: "09 Oct 2026"
const formatDisplayDate = (date) => {
  if (!date) return '';
  const d = String(date.getDate()).padStart(2, '0');
  const m = MONTH_NAMES[date.getMonth()].slice(0, 3);
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
};

export default function LuxuryDatePicker({
  value,
  onChange,
  minDate = null,
  maxDate = null,
  placeholder = 'Select Date',
  className = '',
  label = null,
  icon: Icon = CalendarIcon,
  align = 'auto',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [computedAlign, setComputedAlign] = useState(align === 'right' ? 'right' : 'left');
  const containerRef = useRef(null);

  const selectedDate = useMemo(() => parseDate(value), [value]);
  const min = useMemo(() => parseDate(minDate), [minDate]);
  const max = useMemo(() => parseDate(maxDate), [maxDate]);

  const initialView = selectedDate || new Date();
  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());

  useEffect(() => {
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [value]);

  // Calculate best alignment
  const calculateAlignment = () => {
    if (align === 'right') return 'right';
    if (align === 'left') return 'left';
    if (!containerRef.current) return 'left';

    const rect = containerRef.current.getBoundingClientRect();
    const spaceOnRight = window.innerWidth - rect.left;
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

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day) => {
    const newDate = new Date(viewYear, viewMonth, day);
    const iso = toIsoDateString(newDate);
    if (onChange) onChange(iso);
    setIsOpen(false);
  };

  const handleToday = (e) => {
    e.stopPropagation();
    const today = new Date();
    const iso = toIsoDateString(today);
    if (onChange) onChange(iso);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setIsOpen(false);
  };

  // Calendar matrix calculation
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

  const today = new Date();
  const isCurrentMonthToday =
    today.getFullYear() === viewYear && today.getMonth() === viewMonth;

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
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <CalendarIcon className="w-3.5 h-3.5 text-[#D4A64A] shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-[#FAF7F0] whitespace-nowrap">
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </span>
        </div>
      </button>

      {/* Luxury Dark Calendar Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            style={{ backgroundColor: '#0B1220' }}
            className={`absolute ${
              computedAlign === 'right' ? 'right-0' : 'left-0'
            } top-full mt-2 z-[9999] w-[270px] sm:w-[280px] max-w-[calc(100vw-24px)] p-3.5 rounded-2xl bg-[#0B1220] border border-[#D4A64A]/40 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(0,0,0,0.9)] text-[#FAF7F0] overflow-hidden`}
          >
            {/* Header with Month/Year & Navigation */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#FAF7F0] font-sora">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1.5 font-mono">
              {DAYS_SHORT.map((d, idx) => (
                <div
                  key={d}
                  className={`text-[10px] font-bold ${
                    idx === 0 || idx === 6 ? 'text-[#D4A64A]' : 'text-white/50'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days Matrix */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono">
              {/* Empty leading cells */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-7 w-7" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const cellDate = new Date(viewYear, viewMonth, day);
                const isSelected =
                  selectedDate &&
                  selectedDate.getFullYear() === viewYear &&
                  selectedDate.getMonth() === viewMonth &&
                  selectedDate.getDate() === day;

                const isToday = isCurrentMonthToday && today.getDate() === day;

                const isDisabled =
                  (min && cellDate < new Date(min.getFullYear(), min.getMonth(), min.getDate())) ||
                  (max && cellDate > new Date(max.getFullYear(), max.getMonth(), max.getDate()));

                return (
                  <button
                    key={`day-${day}`}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelectDay(day)}
                    className={`h-7 w-7 mx-auto rounded-lg text-[11px] font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      isDisabled
                        ? 'text-white/20 cursor-not-allowed opacity-40'
                        : isSelected
                        ? 'bg-gradient-to-r from-[#D4A64A] to-amber-500 text-[#0B1220] font-extrabold shadow-md shadow-[#D4A64A]/30 scale-105'
                        : isToday
                        ? 'border border-[#D4A64A] text-[#D4A64A] hover:bg-[#D4A64A]/20'
                        : 'text-white/85 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Footer with Today Quick Button */}
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
              <button
                type="button"
                onClick={handleToday}
                className="text-[#D4A64A] hover:underline font-bold cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Today</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
