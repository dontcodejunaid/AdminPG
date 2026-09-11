import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Helper to format Date -> 'YYYY-MM-DD'
const toIsoDateString = (date) => {
  if (!date || isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Helper to parse 'YYYY-MM-DD' or Date or ISO string
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

// Helper to format for display: "11 Sep 2026"
const formatDisplayDate = (date) => {
  if (!date) return '';
  const d = date.getDate();
  const m = MONTH_NAMES[date.getMonth()].slice(0, 3);
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
};

export const CustomDatePicker = ({
  value,
  onChange,
  placeholder = 'Select date',
  className = '',
  disabled = false,
  minDate = null,
  maxDate = null,
  align = 'auto' // 'left', 'right', 'auto'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const popoverRef = useRef(null);

  const selectedDate = parseDate(value);
  const min = parseDate(minDate);
  const max = parseDate(maxDate);

  // Current viewing month and year in calendar
  const initialView = selectedDate || new Date();
  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());

  // Calculate screen coordinates for fixed Portal
  const updatePosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const calendarWidth = 264;
    const calendarHeight = 296;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top;
    if (spaceBelow >= calendarHeight + 12 || spaceBelow >= spaceAbove) {
      top = rect.bottom + 6;
    } else {
      top = rect.top - calendarHeight - 6;
    }

    // Clamp top inside viewport
    top = Math.max(12, Math.min(window.innerHeight - calendarHeight - 12, top));

    let left;
    if (align === 'right' || (align === 'auto' && (rect.left + calendarWidth > window.innerWidth - 20))) {
      left = rect.right - calendarWidth;
    } else {
      left = rect.left;
    }

    // Clamp left inside viewport
    left = Math.max(12, Math.min(window.innerWidth - calendarWidth - 12, left));

    setCoords({ top, left });
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleScrollOrResize = () => updatePosition();
      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);
      return () => {
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
      };
    }
  }, [isOpen, align]);

  // Keep view aligned when value changes externally
  useEffect(() => {
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target) &&
        popoverRef.current && !popoverRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleSelectDate = (d, m, y) => {
    const newDate = new Date(y, m, d);
    const isoString = toIsoDateString(newDate);
    if (onChange) {
      onChange({ target: { value: isoString } });
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({ target: { value: '' } });
    }
    setIsOpen(false);
  };

  const handleToday = (e) => {
    e.stopPropagation();
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    handleSelectDate(today.getDate(), today.getMonth(), today.getFullYear());
  };

  // Build calendar matrix
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const prevMonthDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i);
  }

  const currentMonthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push(i);
  }

  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextMonthDays = [];
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    nextMonthDays.push(i);
  }

  const isToday = (day, month, year) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isSelected = (day, month, year) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const isDisabled = (day, month, year) => {
    const d = new Date(year, month, day);
    if (min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return true;
    if (max && d > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return true;
    return false;
  };

  // Year options for fast selection (+- 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 5; y <= currentYear + 10; y++) {
    yearOptions.push(y);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(prev => !prev);
          }
        }}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-all select-none ${
          disabled ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : ''
        } ${isOpen ? 'ring-2 ring-brand-500/20 border-brand-500 dark:border-brand-500' : ''}`}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
          <span className={selectedDate ? 'font-medium' : 'text-slate-400 dark:text-slate-500'}>
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {selectedDate && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Clear date"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Popover Calendar rendered into document.body to prevent any container clipping */}
      {isOpen && createPortal(
        <div
          ref={popoverRef}
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            zIndex: 999999
          }}
          className="w-[264px] p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Month / Year & Prev / Next */}
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5">
              {/* Month Selector */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="text-xs font-bold text-slate-800 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors pr-1"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Selector */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="text-xs font-bold text-slate-800 dark:text-white bg-transparent border-none focus:outline-none cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {DAYS_SHORT.map((d, i) => (
              <div
                key={d}
                className={`text-[11px] font-semibold ${
                  i === 0 || i === 6 ? 'text-slate-400 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells matrix */}
          <div className="grid grid-cols-7 gap-1">
            {/* Previous month overflow */}
            {prevMonthDays.map((day) => {
              const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
              const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
              return (
                <button
                  type="button"
                  key={`prev-${day}`}
                  onClick={() => handleSelectDate(day, prevM, prevY)}
                  className="h-7 w-full flex items-center justify-center text-[11px] text-slate-300 dark:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/40 transition-colors"
                >
                  {day}
                </button>
              );
            })}

            {/* Current month days */}
            {currentMonthDays.map((day) => {
              const sel = isSelected(day, viewMonth, viewYear);
              const today = isToday(day, viewMonth, viewYear);
              const dis = isDisabled(day, viewMonth, viewYear);

              return (
                <button
                  type="button"
                  key={`curr-${day}`}
                  disabled={dis}
                  onClick={() => handleSelectDate(day, viewMonth, viewYear)}
                  className={`h-7 w-full flex items-center justify-center text-xs rounded-lg transition-all font-medium relative ${
                    sel
                      ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-500/20'
                      : today
                      ? 'text-brand-600 dark:text-brand-400 font-bold bg-brand-50/70 dark:bg-brand-900/20 border border-brand-300 dark:border-brand-700/60'
                      : dis
                      ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {day}
                </button>
              );
            })}

            {/* Next month overflow */}
            {nextMonthDays.map((day) => {
              const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
              const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
              return (
                <button
                  type="button"
                  key={`next-${day}`}
                  onClick={() => handleSelectDate(day, nextM, nextY)}
                  className="h-7 w-full flex items-center justify-center text-[11px] text-slate-300 dark:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/40 transition-colors"
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Actions Footer */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
            <button
              type="button"
              onClick={handleClear}
              className="font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors px-2 py-0.5 rounded hover:bg-brand-50 dark:hover:bg-brand-900/20"
            >
              Today
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomDatePicker;
