'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface PageLoaderProps {
  onComplete?: (timeline: gsap.core.Timeline) => void;
}

const words = [
  "Hello", "Namaste"
];

export const PageLoader = ({ onComplete }: PageLoaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const isCompletedRef = useRef(false);

  useGSAP(() => {
    // 1. Initial State: Hide all words
    gsap.set("[class^='word-']", { 
      opacity: 0, 
      y: 30 
    });

    const tl = gsap.timeline({
      delay: 0.15, // Small buffer for initial paint
      onComplete: () => {
        const exitTl = gsap.timeline();
        exitTl.to(loaderRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          onStart: () => {
            // Signal completion to parent
            if (onComplete) onComplete(exitTl);
          }
        });
      }
    });

    // 2. Sequential Word Animation
    words.forEach((_, i) => {
      const isLast = i === words.length - 1;
      
      // Entrance
      tl.to(`.word-${i}`, {
        opacity: 1, 
        y: 0, 
        duration: 0.4, 
        ease: "power3.out" 
      });

      // Reading Pause
      tl.to({}, { duration: 0.5 });

      // Exit (if not last)
      if (!isLast) {
        tl.to(`.word-${i}`, {
          opacity: 0,
          y: -30,
          duration: 0.3,
          ease: "power3.in"
        });
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none">
      <div
        ref={loaderRef}
        className="absolute inset-0 bg-[var(--bg-primary)] flex flex-col justify-center items-center pointer-events-auto"
      >
        <div className="relative h-20 md:h-32 w-full flex justify-center items-center overflow-hidden px-10 text-center">
          {words.map((word, i) => (
            <div 
              key={i} 
              className={`word-${i} absolute opacity-0 flex justify-center items-center`}
            >
              <h1 className="text-5xl md:text-7xl font-playfair font-black text-[var(--text-primary)] lowercase tracking-tighter whitespace-nowrap">
                {word}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
