import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isFinePointer, setIsFinePointer] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
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
    </div>
  );
}

