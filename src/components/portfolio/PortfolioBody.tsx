'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AboutSection } from './AboutSection';
import { TechStack } from './TechStack';
import { Experience } from './Experience';
import { Projects } from './Projects';
import { Achievements } from './Achievements';
import {GithubStats} from './GithubStats';
import { CompetitiveProgramming } from './CompetitiveProgramming';
import { ContactSection } from './ContactSection';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);

interface PortfolioBodyProps {
  profileImageRef: React.RefObject<HTMLDivElement | null>;
  profileDestRef: React.RefObject<HTMLDivElement | null>;
}

export const PortfolioBody = ({ profileImageRef, profileDestRef }: PortfolioBodyProps) => {
  useEffect(() => {
    if (!profileImageRef.current || !profileDestRef.current) return;

    // 1. Create a clone of the hero profile image div
    const clone = profileImageRef.current.cloneNode(true) as HTMLElement;
    
    // 2. Style the clone as a fixed-position flying element
    clone.style.position = 'fixed';
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.margin = '0';
    clone.style.border = 'none';
    clone.style.background = 'none';
    clone.style.boxShadow = 'none';
    clone.style.willChange = 'transform, top, left, width, height, opacity';
    
    const innerDiv = clone.querySelector('div');
    if (innerDiv) {
      innerDiv.style.border = 'none';
      innerDiv.style.background = 'none';
      innerDiv.style.boxShadow = 'none';
    }

    document.body.appendChild(clone);

    const getHeroRect = () => profileImageRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const getDestRect = () => profileDestRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };

    const setCloneToHero = () => {
      const r = getHeroRect();
      gsap.set(clone, {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
        borderRadius: '50%',
        opacity: 0,
        display: 'block'
      });
    };
    setCloneToHero();

    const st = ScrollTrigger.create({
      trigger: '#about',
      start: 'top 98%',
      end: 'top 5%',
      scrub: 0.1, // Near-instant sync to prevent lag-based blinking
      onUpdate: (self) => {
        const progress = self.progress;
        const heroRect = getHeroRect();
        const destRect = getDestRect();
        const aboutImg = profileDestRef.current?.querySelector('img');

        // Linear progression for hero and clone
        // 0.0 -> 0.02 : Hero fades out, Clone fades in
        // 0.02 -> 0.98 : Clone moves
        // 0.98 -> 1.0 : Clone fades out, About Image fades in
        
        if (progress <= 0) {
          if (profileImageRef.current) gsap.set(profileImageRef.current, { opacity: 1 });
          gsap.set(clone, { opacity: 0 });
          if (aboutImg) gsap.set(aboutImg, { opacity: 0 });
        } 
        else if (progress > 0 && progress < 0.02) {
          const p = progress / 0.02;
          if (profileImageRef.current) gsap.set(profileImageRef.current, { opacity: 1 - p });
          gsap.set(clone, { opacity: p });
          if (aboutImg) gsap.set(aboutImg, { opacity: 0 });
        }
        else if (progress >= 0.02 && progress <= 0.98) {
          if (profileImageRef.current) gsap.set(profileImageRef.current, { opacity: 0 });
          gsap.set(clone, { opacity: 1 });
          if (aboutImg) gsap.set(aboutImg, { opacity: 0 });
        }
        else if (progress > 0.98 && progress < 1) {
          const p = (progress - 0.98) / 0.02;
          if (profileImageRef.current) gsap.set(profileImageRef.current, { opacity: 0 });
          gsap.set(clone, { opacity: 1 - p });
          if (aboutImg) gsap.set(aboutImg, { opacity: p });
        }
        else if (progress >= 1) {
          if (profileImageRef.current) gsap.set(profileImageRef.current, { opacity: 0 });
          gsap.set(clone, { opacity: 0 });
          if (aboutImg) gsap.set(aboutImg, { opacity: 1 });
        }
        
        // Dynamic path interpolation (Always running during scroll range)
        gsap.set(clone, {
          left: gsap.utils.interpolate(heroRect.left, destRect.left, progress),
          top: gsap.utils.interpolate(heroRect.top, destRect.top, progress),
          width: gsap.utils.interpolate(heroRect.width, destRect.width, progress),
          height: gsap.utils.interpolate(heroRect.height, destRect.height, progress),
          borderRadius: gsap.utils.interpolate(200, 32, progress),
        });
      }
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
      setCloneToHero();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (document.body.contains(clone)) document.body.removeChild(clone);
      if (profileImageRef.current) gsap.set(profileImageRef.current, { opacity: 1 });
      st.kill();
    };
  }, [profileImageRef, profileDestRef]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <AboutSection profileDestRef={profileDestRef} />
      <TechStack />
      <Experience />
      <Projects />
      <GithubStats />
      <Achievements />
      <CompetitiveProgramming />
      <ContactSection />
    </>
  );
};
