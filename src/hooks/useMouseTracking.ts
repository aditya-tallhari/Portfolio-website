'use client';

import { useRef, useCallback } from 'react';
import gsap from 'gsap';

export const useMouseTracking = (intensity: number = 15) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: 'power3.out',
      transformPerspective: 1000,
    });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
    });
  }, []);

  return { cardRef, handleMouseMove, handleMouseLeave };
};
