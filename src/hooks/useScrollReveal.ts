'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealConfig {
  selector?: string;        // CSS selector for children to animate
  y?: number;               // vertical offset
  x?: number;               // horizontal offset
  opacity?: number;         // initial opacity
  scale?: number;           // initial scale
  stagger?: number;         // delay between items
  start?: string;           // scroll trigger start position
  duration?: number;        // animation duration
  ease?: string;            // easing function
  scrub?: boolean | number; // scrub amount
}

export const useScrollReveal = (
  containerRef: RefObject<HTMLElement | null>,
  config: ScrollRevealConfig = {}
) => {
  const {
    selector,
    y = 40,
    x = 0,
    opacity = 0,
    scale = 1,
    stagger = 0.1,
    start = 'top 85%',
    duration = 1.2,
    ease = 'expo.out',
    scrub = false,
  } = config;

  useGSAP(() => {
    if (!containerRef.current) return;

    const targets = selector 
      ? containerRef.current.querySelectorAll(selector) 
      : containerRef.current;

    gsap.from(targets, {
      y,
      x,
      opacity,
      scale,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: containerRef.current,
        start,
        toggleActions: scrub ? undefined : 'play none none reverse',
        scrub,
      },
    });
  }, { scope: containerRef });
};
