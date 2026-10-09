'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        variant === 'outline'
          ? 'border border-white/20 bg-[#10192B] text-[#FAF7F0] hover:bg-white/10 hover:border-[#D4A64A]'
          : variant === 'ghost'
          ? 'hover:bg-white/10 text-[#FAF7F0]'
          : variant === 'link'
          ? 'text-[#D4A64A] underline-offset-4 hover:underline'
          : 'bg-[#D4A64A] text-[#0B1220] hover:bg-[#D4A64A]/90 font-bold',
        size === 'sm'
          ? 'h-9 px-3 text-xs'
          : size === 'lg'
          ? 'h-11 px-8'
          : size === 'icon'
          ? 'h-10 w-10'
          : 'h-10 px-4 py-2',
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';

function useClickOutside(ref, handler) {
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) handler();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler]);
}

const OnClickOutside = ({ children, onClickOutside, classes }) => {
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, onClickOutside);

  return (
    <div ref={wrapperRef} className={cn(classes)}>
      {children}
    </div>
  );
};

const DEMO = [
  { name: 'Documentation', link: '#' },
  { name: 'Components', link: '#' },
  { name: 'Examples', link: '#' },
  { name: 'GitHub', link: '#' },
];

export default function AnimatedDropdown({
  items = DEMO,
  text = 'Select Option',
  className,
  onSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <OnClickOutside onClickOutside={() => setIsOpen(false)}>
      <div
        data-state={isOpen ? 'open' : 'closed'}
        className={cn('group relative inline-block', className)}
      >
        <Button
          variant="outline"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{text}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4 text-[#D4A64A]" />
          </motion.div>
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              role="listbox"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
              }}
              className={cn(
                'absolute top-[calc(100%+0.5rem)] left-1/2 z-50 w-fit min-w-full -translate-x-1/2',
                'overflow-hidden rounded-2xl',
                'bg-[#0B1220]/95 backdrop-blur-xl',
                'border border-[#D4A64A]/30',
                'shadow-[0_15px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(212,166,74,0.15)]',
                'p-1.5'
              )}
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.03,
                    },
                  },
                }}
                className="space-y-0.5"
              >
                {items.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.link || '#'}
                    onClick={(e) => {
                      if (onSelect) {
                        e.preventDefault();
                        onSelect(item);
                        setIsOpen(false);
                      }
                    }}
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className={cn(
                      'block w-full px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl',
                      'text-[#FAF7F0]/85 hover:text-[#FAF7F0]',
                      'hover:bg-white/10 hover:border-[#D4A64A]/30',
                      'transition-colors duration-150',
                      'no-underline whitespace-nowrap'
                    )}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </OnClickOutside>
  );
}

export { AnimatedDropdown, Button };
