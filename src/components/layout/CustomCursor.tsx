'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


export const CustomCursor = () => {
  const container = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    if (!mounted || !container.current) return;

    const moveCursor = (e: MouseEvent) => {
      // Use quickSetter for performance in mousemove
      gsap.to(".cursor-dot", {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        overwrite: 'auto'
      });
      gsap.to(".cursor-follower", {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        overwrite: 'auto'
      });
    };

    window.addEventListener('mousemove', moveCursor);

    // Hover effects
    const onMouseEnter = () => {
      gsap.to(".cursor-follower", { 
        scale: 3, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        duration: 0.3 
      });
    };
    const onMouseLeave = () => {
      gsap.to(".cursor-follower", { 
        scale: 1, 
        backgroundColor: 'transparent', 
        duration: 0.3 
      });
    };

    const interactables = document.querySelectorAll('button, a, .magnetic');
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, { scope: container, dependencies: [mounted] });

  if (!mounted) return null;


  return (
    <div ref={container}>
      <div
        className="cursor-dot fixed top-0 left-0 w-2 h-2 bg-white rounded-full z-[9999] pointer-events-none mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      />
      <div
        className="cursor-follower fixed top-0 left-0 w-8 h-8 border border-white/30 rounded-full z-[9998] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

