import useScrollLock from '../hooks/useScrollLock';
import React, { useEffect, useState } from 'react';
import { LogoArtwork } from './KeralamLogo';
import './keralam-intro.css';

export default function KeralamIntro() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return true;
  });

  useScrollLock(visible);

  const dismiss = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    const timeout = window.setTimeout(dismiss, 1200);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  if (!visible) return null;
  return (
    <div 
      className="keralam-intro cursor-pointer" 
      onClick={dismiss}
      data-testid="keralam-intro"
    >
      <div className="keralam-intro__ambient" aria-hidden="true"/>
      <div className="keralam-intro__content max-w-lg w-full px-6 text-center animate-in fade-in zoom-in-95 duration-500">
        <p className="keralam-intro__welcome text-xs tracking-widest text-[#D4A64A] uppercase font-mono mb-2">WELCOME HOME</p>
        <div className="w-full">
          <LogoArtwork caption="FIND YOUR STAY" />
        </div>
      </div>
    </div>
  );
}


