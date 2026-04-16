'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface PageLoaderProps {
  onComplete?: (timeline: gsap.core.Timeline) => void;
}

export const PageLoader = ({ onComplete }: PageLoaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Optional: you could remove the loader from DOM here if needed
      }
    });

    // Phase 1: Counter Loader
    const counterObj = { val: 0 };
    tl.to(counterObj, {
      val: 100,
      duration: 1.5,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.innerText = Math.floor(counterObj.val) + '%';
        }
      }
    });

    // Phase 1 -> 2: Slide out white overlay
    tl.to(loaderRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: 'power3.inOut',
      delay: 0.2,
      onStart: () => {
        // When the slide out starts, we can notify the parent to start their animations
        if (onComplete) {
          onComplete(tl);
        }
      }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] pointer-events-none">
      <div
        ref={loaderRef}
        className="absolute inset-0 bg-white flex flex-col justify-end p-8 text-black pointer-events-auto"
        style={{ transformOrigin: 'top center' }}
      >
        <div className="flex justify-between items-end w-full tracking-widest uppercase font-jetbrains font-bold">
          <span ref={counterRef} className="text-6xl md:text-8xl leading-none">0%</span>
        </div>
      </div>
    </div>
  );
};
