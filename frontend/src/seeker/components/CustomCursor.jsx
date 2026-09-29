import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const ringRef = useRef(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth elastic lag for trailing ring
  const springConfig = { damping: 28, stiffness: 350, mass: 0.3 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable custom cursor if device has mouse/fine pointer
    const mediaQuery = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e) => setIsFinePointer(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    let rafId;
    const handleMouseMove = (e) => {
      if (!mediaQuery.matches) return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };

    let isHovered = false;
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.glass-card-hover') ||
        target.closest('[data-cursor="expand"]');

      const nextHovered = !!isInteractive;
      if (nextHovered !== isHovered) {
        isHovered = nextHovered;
        if (ringRef.current) {
          if (isHovered) {
            ringRef.current.classList.add('cursor-expanded');
          } else {
            ringRef.current.classList.remove('cursor-expanded');
          }
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!isFinePointer) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block select-none [contain:strict]">
      {/* Center Core Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#D4A64A] shadow-[0_0_8px_#D4A64A] will-change-transform"
      />

      {/* Trailing Elastic Ring */}
      <motion.div
        ref={ringRef}
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#D4A64A]/60 shadow-[0_0_12px_rgba(212,166,74,0.3)] transition-all duration-200 will-change-transform [&.cursor-expanded]:scale-150 [&.cursor-expanded]:border-[#FAF7F0] [&.cursor-expanded]:bg-[#D4A64A]/15"
      />
    </div>
  );
}

