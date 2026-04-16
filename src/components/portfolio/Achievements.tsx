'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Star, Medal, Award, Code2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  { title: 'Best Web Performance 2024', org: 'Standard Awards', icon: Trophy, size: 'large' },
  { title: 'Innovation Hackathon #1', org: 'Major League Hacking', icon: Medal, size: 'small' },
  { title: 'Open Source Contributor', org: 'Next.js / Vercel', icon: Code2, size: 'medium' },
  { title: 'Full Stack Excellence', org: 'Udemy Certified', icon: Award, size: 'small' },
  { title: 'Top 1% Creator', org: 'Dev.to Community', icon: Star, size: 'medium' },
  { title: 'Creative Dev of the Year', org: 'Design Awards', icon: Trophy, size: 'large' },
];


export const Achievements = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    itemRefs.current.forEach((item) => {
      if (!item) return;

      gsap.fromTo(item,
        { scale: 0.8, opacity: 0, filter: 'blur(10px)' },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    gsap.from('.achieve-title-reveal', {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-20 bg-[var(--bg-primary)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="overflow-hidden mb-32">
          <h2 className="achieve-title-reveal text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
            Hall of/<br/><span className="text-[var(--muted-text)]">Fame</span>
          </h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {achievements.map((ach, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              className={`break-inside-avoid relative p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-primary)] backdrop-blur-md flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-[var(--accent-glow)] transition-colors ${
                ach.size === 'large' ? 'min-h-[400px]' : ach.size === 'medium' ? 'min-h-[300px]' : 'min-h-[200px]'
              }`}
            >
              <div className="mb-6 p-4 rounded-2xl bg-[var(--border-primary)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--bg-primary)] transition-all duration-500 group-hover:scale-110">
                <ach.icon size={32} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--muted-text)] mb-2 group-hover:text-[var(--text-primary)]">{ach.org}</p>
              <h3 className="text-xl font-bold tracking-tight max-w-[200px] leading-tight transition-colors">{ach.title}</h3>
              
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <Star size={12} className="text-[var(--accent-primary)] fill-[var(--accent-primary)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
