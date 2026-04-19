'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useCounterAnimation = (targetValue: number, duration: number = 2) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!elementRef.current || animated.current) return;

    const ctx = gsap.context(() => {
      gsap.to({ val: 0 }, {
        val: targetValue,
        duration,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top 90%',
          onEnter: () => {
            if (animated.current) return;
            gsap.to({ val: 0 }, {
              val: targetValue,
              duration,
              ease: 'power3.out',
              onUpdate: function() {
                setCount(Math.ceil(this.targets()[0].val));
              },
              onComplete: () => {
                animated.current = true;
              }
            });
          }
        }
      });
    }, elementRef);

    return () => ctx.revert();
  }, [targetValue, duration]);

  return { elementRef, count };
};
