import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select option...',
  disabled = false,
  className = '',
  dropdownClassName = '',
  searchable = false,
  name,
  id,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options: allow strings or objects { value, label, desc, badge }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt) };
    }
    return {
      value: opt.value,
      label: opt.label !== undefined ? opt.label : opt.name || opt.value,
      desc: opt.desc || opt.description,
      badge: opt.badge
    };
  });

  // Selected item
  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  // Filtered options if searchable
  const filteredOptions = searchable && searchTerm.trim()
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opt.desc && opt.desc.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : normalizedOptions;

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen, searchable]);

  const handleSelect = (val) => {
    if (disabled) return;
    setIsOpen(false);
    if (onChange) {
      // Create synthetic event for compatibility with standard e.target.value handlers
      const syntheticEvent = {
        target: { value: val, name: name || id },
        currentTarget: { value: val, name: name || id },
        preventDefault: () => {},
        stopPropagation: () => {}
      };
      onChange(syntheticEvent);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full text-left select-none">
      {/* Hidden input for HTML form validation if required */}
      {required && (
        <input
          type="text"
          value={value || ''}
          required={required}
          onChange={() => {}}
          className="sr-only"
          tabIndex={-1}
        />
      )}

      {/* Select Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-xl border transition-all text-left outline-none ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
            : isOpen
            ? 'border-brand-500 ring-2 ring-brand-500/20 bg-white dark:bg-slate-800 shadow-sm'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 shadow-sm'
        } ${className}`}
      >
        <span className={`truncate ${selectedOption ? 'font-semibold text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500 font-normal'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-brand-600 dark:text-brand-400' : ''
          }`}
        />
      </button>

      {/* Custom Dropdown Popover */}
      {isOpen && (
        <div
          className={`absolute left-0 top-full mt-1.5 w-full min-w-[180px] max-h-64 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 ${dropdownClassName}`}
          style={{ zIndex: 999 }}
        >
          {/* Optional In-dropdown Search */}
          {(searchable || normalizedOptions.length > 7) && (
            <div className="p-1.5 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-transparent focus:border-brand-500 focus:outline-none"
              />
            </div>
          )}

          {/* Options List */}
          <div className="space-y-0.5 max-h-52 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all ${
                      isSelected
                        ? 'bg-brand-50 text-brand-900 dark:bg-brand-950/70 dark:text-brand-200 font-bold border border-brand-200/80 dark:border-brand-800/80'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="truncate">{opt.label}</p>
                      {opt.desc && (
                        <p className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                          {opt.desc}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {opt.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
