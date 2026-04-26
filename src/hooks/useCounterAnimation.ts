'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export const useCounterAnimation = (targetValue: number, duration: number = 2) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);
  const animated = useRef(false);

  useGSAP(() => {
    if (!elementRef.current || animated.current) return;

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
  }, { scope: elementRef, dependencies: [targetValue, duration] });

  return { elementRef, count };
};
