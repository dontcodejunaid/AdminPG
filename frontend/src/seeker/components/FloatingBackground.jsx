import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function FloatingBackground() {
  const containerRef = useRef(null);
  const cursorBlobRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return;

    let rafId;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const targetX = clientX - 150;
        const targetY = clientY - 150;

        if (cursorBlobRef.current) {
          gsap.to(cursorBlobRef.current, {
            x: targetX,
            y: targetY,
            duration: 1.2,
            overwrite: 'auto',
            ease: 'power2.out',
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none [contain:strict]"
      aria-hidden="true"
    >
      {/* Deep Space Background Mesh */}
      <div className="absolute inset-0 bg-[#080c16] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,41,59,0.5),rgba(255,255,255,0))]" />

      {/* Mouse Following Gravity Glow */}
      <div
        ref={cursorBlobRef}
        className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-60 pointer-events-none will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(212,166,74,0.14) 0%, rgba(212,166,74,0) 70%)'
        }}
      />

      {/* Ambient Floating Glow Orbs with zero-cost radial gradients */}
      <div
        className="absolute top-1/4 -left-20 w-96 h-96 rounded-full opacity-50 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(212,166,74,0.12) 0%, rgba(212,166,74,0) 70%)'
        }}
      />
      <div
        className="absolute top-2/3 -right-20 w-[450px] h-[450px] rounded-full opacity-40 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, rgba(37,99,235,0) 70%)'
        }}
      />
      <div
        className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full opacity-40 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0) 70%)'
        }}
      />

      {/* Subtle Dust & Floating Star Spec Grid */}
      <div 
        className="absolute inset-0 opacity-12" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}
      />
    </div>
  );
}

