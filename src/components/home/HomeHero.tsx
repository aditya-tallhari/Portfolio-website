'use client';

import React, { useRef, useCallback } from 'react';
import { LaptopConsole, ArrowKey } from './LaptopConsole';
import { ConsoleScreen } from './ConsoleScreen';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const HomeHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Basic entrance animation for the laptop
    gsap.from('.hero-laptop', {
      scale: 0.8,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out',
    });
  }, { scope: containerRef });

  const handleArrowPress = useCallback((key: ArrowKey) => {
    (window as any).__consoleHandleArrow?.(key);
  }, []);

  const handleAction = useCallback((action: "select" | "back") => {
    (window as any).__consoleHandleAction?.(action);
  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center py-20 overflow-visible">
      
      {/* Centered Laptop Console - As Requested: No name, description or buttons in main page */}
      <div className="hero-laptop w-full flex justify-center items-center">
        <div className="relative scale-100">
           <LaptopConsole
             onArrowKeyPress={handleArrowPress}
             onActionExecute={handleAction}
           >
             <ConsoleScreen />
           </LaptopConsole>
        </div>
      </div>

    </section>
  );
};
