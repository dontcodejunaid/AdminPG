import React, { useRef } from 'react';
import { Star, Zap, Utensils } from 'lucide-react';

export default function Hero3DCanvas() {
  const cardRef = useRef(null);
  const rafRef = useRef(null);

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = (-y / 16).toFixed(2);
    const rotY = (x / 16).toFixed(2);

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
      }
    });
  };

  const handleCardMouseLeave = () => {
    cancelAnimationFrame(rafRef.current);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center p-2 [contain:layout_style]">
      
      {/* Background Radial Glow */}
      <div 
        className="absolute -inset-4 rounded-full opacity-60 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,166,74,0.2) 0%, rgba(245,158,11,0.08) 45%, transparent 70%)'
        }}
      />

      {/* Main 3D Floating Showcase Container */}
      <div
        ref={cardRef}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        style={{
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform',
        }}
        className="relative w-full max-w-md rounded-3xl p-4 sm:p-5 glass-card border border-[#D4A64A]/40 shadow-2xl group"
      >
        
        {/* High-Resolution Room Interior Showcase Image */}
        <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#FAF7F0]/15 bg-[#080d1a]">
          <img
            src="/images/1pg.jpeg"
            alt="Aafa Coliving Luxury Room Interior"
            loading="eager"
            className="w-full h-full object-cover object-center transition-transform duration-500 filter brightness-105 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent opacity-80" />     

          {/* Top Verified Location Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0B1220]/85 backdrop-blur-md border border-[#D4A64A]/40 text-[#D4A64A] text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Move-In Ready Sanctuary</span>
          </div>

          {/* Bottom Floating Price & Rating Pill */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#0B1220]/90 backdrop-blur-md border border-[#FAF7F0]/15 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-[9px] text-[#FAF7F0]/60 uppercase font-mono tracking-wider">Starting Daily Rate</p>
              <p className="text-lg font-extrabold text-[#FAF7F0] font-sora">
                ₹499 <span className="text-xs font-normal text-[#FAF7F0]/70">/ day (Breakfast Free)</span>
              </p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D4A64A]/20 text-[#D4A64A] text-xs font-bold border border-[#D4A64A]/30">
              <Star className="w-3.5 h-3.5 fill-[#D4A64A] text-[#D4A64A]" />
              <span>4.9★</span>
            </div>
          </div>

        </div>

        {/* Orbiting Satellite Floating Badges */}
        <div className="absolute -top-3 -left-3 px-3 py-2 rounded-xl glass-card border border-[#D4A64A]/40 shadow-xl animate-float-reverse hidden sm:flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#D4A64A]/20 flex items-center justify-center text-[#D4A64A]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#FAF7F0] font-sora">100% Power Backup</p>
            <p className="text-[9px] text-[#FAF7F0]/70 font-mono">Commercial Generator</p>
          </div>
        </div>

        <div className="absolute -bottom-3 -right-3 px-3 py-2 rounded-xl glass-card border border-[#D4A64A]/40 shadow-xl animate-float-slow hidden sm:flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#D4A64A]/20 flex items-center justify-center text-[#D4A64A]">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#FAF7F0] font-sora">Kerala Cooking</p>
            <p className="text-[9px] text-[#FAF7F0]/70 font-mono">3x Fresh Meals</p>
          </div>
        </div>

      </div>
    </div>
  );
}
