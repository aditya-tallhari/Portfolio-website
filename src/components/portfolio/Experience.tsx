'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { 
  Calendar, 
  MapPin, 
  Briefcase, 
  Award, 
  ChevronRight, 
  CheckCircle2,
  Trophy,
  History
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchExperience, Experience as APIExperience } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceData {
  id: string;
  type: 'work' | 'event';
  period: string;
  year: string;
  role: string;
  company: string;
  location: string;
  points: string[];
  accent: string;
}

export const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const timelineFillRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [experiencesList, setExperiencesList] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExperience = async () => {
      try {
        const data = await fetchExperience();
        const mappedData: ExperienceData[] = data.map((exp: APIExperience, index: number) => ({
          id: String(index + 1).padStart(2, '0'),
          type: exp.isInternship ? 'work' : 'work', // Defaulting to work, can be adjusted
          period: exp.duration,
          year: exp.startDate ? new Date(exp.startDate).getFullYear().toString() : '2024',
          role: exp.role,
          company: exp.company,
          location: exp.location,
          points: exp.highlights,
          accent: index % 2 === 0 ? '#FF4500' : '#D4AF37'
        }));
        setExperiencesList(mappedData);
      } catch (error) {
        console.error("Error fetching experience:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExperience();
  }, []);

  /* ── Magnetic & 3D Tilt Interaction ── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 1. 3D Tilt for the card container
    gsap.to(card, {
      rotateX: (y - centerY) / 20,
      rotateY: (centerX - x) / 20,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1200,
    });

    // 2. Magnetic shift for internal content (Inner depth)
    const content = card.querySelector('.exp-card-content');
    if (content) {
      gsap.to(content, {
        x: (x - centerX) * 0.05,
        y: (y - centerY) * 0.05,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    // 3. Highlight timeline node (Global sync)
    const index = card.getAttribute('data-index');
    gsap.to(`.exp-node-${index}`, {
      scale: 1.4,
      borderColor: 'var(--accent-primary)',
      xPercent: -50,
      duration: 0.3
    });
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });

    const content = card.querySelector('.exp-card-content');
    if (content) {
      gsap.to(content, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
    }

    const index = card.getAttribute('data-index');
    gsap.to(`.exp-node-${index}`, {
      scale: 1,
      borderColor: 'rgba(255, 69, 0, 0.4)',
      xPercent: -50,
      duration: 0.5
    });
  }, []);

  /* ── GSAP Choreography ── */
  useGSAP(() => {
    if (typeof window === 'undefined' || !containerRef.current || experiencesList.length === 0) return;

    const ctx = gsap.context(() => {
      /* ─── Phase 2: Header Redesign Entrance ─── */
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 75%',
          toggleActions: "play reverse play reverse"
        }
      });

      headerTl.fromTo('.exp-accent-line', 
        { scaleX: 0 }, 
        { scaleX: 1, duration: 1, ease: 'power4.inOut', transformOrigin: 'left' }
      )
      .fromTo('.exp-label-char', 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.04, stagger: 0.03, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo('.exp-title-career', 
        { x: -100, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1.2, ease: 'expo.out' },
        '-=0.8'
      )
      .fromTo('.exp-title-log', 
        { x: 100, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1.2, ease: 'expo.out' },
        '-=1.2'
      )
      .fromTo('.exp-subtitle-line', 
        { scaleX: 0 }, 
        { scaleX: 1, duration: 0.8, ease: 'power3.out', transformOrigin: 'left' },
        '-=0.6'
      )
      .fromTo('.exp-counter-box', 
        { opacity: 0, y: 20 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          onComplete: () => {
             // Animate counter number
             const target = experiencesList.length;
             gsap.to({ val: 0 }, {
               val: target,
               duration: 2,
               ease: 'power2.out',
               onUpdate: function() {
                 setCount(Math.ceil(this.targets()[0].val));
               }
             });
          }
        },
        '-=0.4'
      );

      /* ─── Phase 3: Timeline Fill ─── */
      if (timelineFillRef.current) {
        gsap.fromTo(timelineFillRef.current, 
          { scaleY: 0 }, 
          { 
            scaleY: 1, 
            ease: 'none',
            scrollTrigger: {
              trigger: timelineTrackRef.current,
              start: 'top 60%',
              end: 'bottom 80%',
              scrub: 1,
            }
          }
        );
      }

      /* ─── Phase 4 & 5: Node & Card Staggered Revelations ─── */
      gsap.utils.toArray<HTMLElement>('.exp-row').forEach((row, i) => {
        const card = row.querySelector('.exp-card');
        const node = row.querySelector('.exp-node');
        const ghost = row.querySelector('.exp-ghost-num');

        if (!card || !node || !ghost) return;

        const isEven = i % 2 === 0;

        // Node Pop
        gsap.fromTo(node, 
          { scale: 0, opacity: 0, xPercent: -50 }, 
          { 
            scale: 1, 
            opacity: 1, 
            xPercent: -50,
            duration: 0.8, 
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: node,
              start: 'top 75%',
              toggleActions: "play reverse play reverse"
            }
          }
        );

        // Card Slide & 3D Rotate
        gsap.fromTo(card, 
          { 
            x: isEven ? -100 : 100, 
            opacity: 0, 
            rotateY: isEven ? 15 : -15,
            transformPerspective: 1200
          }, 
          { 
            x: 0, 
            opacity: 1, 
            rotateY: 0, 
            duration: 1.2, 
            ease: 'power4.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 72%',
              toggleActions: "play reverse play reverse"
            }
          }
        );

        // ghost number slide
        gsap.fromTo(ghost, 
          { y: 30, opacity: 0 }, 
          { 
            y: 0, 
            opacity: 0.03, 
            duration: 1.5, 
            ease: 'power3.out',
            scrollTrigger: { 
              trigger: card, 
              start: 'top 70%',
              toggleActions: "play reverse play reverse"
            }
          }
        );

        // Content Stagger (Inner)
        const bullets = card.querySelectorAll('.exp-bullet');
        if (bullets && bullets.length > 0) {
          gsap.fromTo(bullets, 
            { x: -10, opacity: 0 }, 
            { 
              x: 0, 
              opacity: 1, 
              stagger: 0.1, 
              duration: 0.6, 
              ease: 'power2.out',
              scrollTrigger: { 
                trigger: card, 
                start: 'top 65%',
                toggleActions: "play reverse play reverse"
              }
            }
          );
        }
      });

      /* ─── Background Parallax (Depth) ─── */
      gsap.to('.exp-bg-text-layer', {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Refresh ScrollTrigger after dynamic content is possibly rendered
      ScrollTrigger.refresh();

    }, containerRef);

    return () => ctx.revert();
  }, [experiencesList]);

  return (
    <section 
      ref={containerRef} 
      id="experience" 
      className="relative py-40 md:py-48 px-6 md:px-12 bg-[var(--bg-primary)] overflow-hidden"
    >
      {/* ── Background Patterns & Depth Layer ── */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="exp-grid-dots" width="60" height="60" patternUnits="userSpaceOnUse">
             <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#exp-grid-dots)" />
        </svg>
      </div>

      {/* Floating Parallax Background Text */}
      <div className="exp-bg-text-layer absolute top-0 left-0 right-0 h-full pointer-events-none select-none z-0 overflow-hidden flex flex-col justify-around">
        {['HISTORY', 'PROGRESS', 'MILESTONES'].map((text, i) => (
          <div key={i} className="text-[25vw] font-black tracking-tighter text-[var(--text-primary)] opacity-[0.02] leading-none text-center transition-opacity duration-500">
            {text}
          </div>
        ))}
      </div>

      {/* Architectural Side Accents */}
      <div className="absolute top-0 left-8 md:left-16 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--border-primary)] to-transparent hidden xl:block opacity-40" />
      <div className="absolute top-0 right-8 md:right-16 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--border-primary)] to-transparent hidden xl:block opacity-40" />

      {/* Side Metadata Columns */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden 2xl:flex flex-col gap-12 opacity-[0.2] pointer-events-none tracking-[1em] uppercase text-[9px] [writing-mode:vertical-lr] rotate-180 text-[var(--text-primary)] transition-opacity duration-500">
        <span>STRATEGIC / PLANNING</span>
        <span>DEPLOYMENT / ARCHIVE</span>
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden 2xl:flex flex-col gap-12 opacity-[0.2] pointer-events-none tracking-[1em] uppercase text-[9px] [writing-mode:vertical-lr] text-[var(--text-primary)] transition-opacity duration-500">
        <span>CHRONOLOGY / STACK</span>
        <span>SYSTEM_LOAD_V3</span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ═══════════════════════════════════════════════
           PHASE 2: HEADER REDESIGN
           ═══════════════════════════════════════════════ */}
        <header ref={headerRef} className="mb-40 relative">
          {/* Section ID BG */}
          <div className="absolute -top-12 -left-4 text-[12vw] font-black text-[var(--accent-primary)] opacity-[0.08] select-none z-0">
             EXP
          </div>

          <div className="relative z-10 flex flex-col items-start md:items-center text-left md:text-center">
            {/* Minimal Detail Label */}
            <div className="flex items-center gap-4 mb-6">
              <div className="exp-accent-line w-8 h-[1px] bg-[var(--accent-primary)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent-primary)]">
                {'CHRONOLOGY // ARCHIVE'.split('').map((c, i) => (
                  <span key={i} className="exp-label-char inline-block">{c === ' ' ? '\u00A0' : c}</span>
                ))}
              </span>
            </div>

            {/* Main Animated Title */}
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-playfair font-black tracking-tighter uppercase leading-[0.8] mb-10 overflow-hidden">
              <span className="exp-title-career inline-block">Career</span>
              <span className="text-[var(--accent-primary)] mx-2">/</span>
              <span className="exp-title-log inline-block">Log</span>
            </h2>

            {/* Separator Line */}
            <div className="exp-subtitle-line w-24 h-[1.5px] bg-gradient-to-r from-[var(--accent-primary)] to-transparent mb-8" />

            {/* Counter Animation */}
            <div className="exp-counter-box flex items-center gap-4">
               <div className="px-4 py-2 border border-[var(--border-primary)] rounded-xl bg-[var(--text-primary)]/[0.04] backdrop-blur-md">
                  <span className="text-2xl font-jetbrains font-black text-[var(--accent-primary)]">
                    {count < 10 ? `0${count}` : count}
                  </span>
               </div>
               <div className="flex flex-col items-start leading-none gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-80">Professional</span>
                  <span className="text-[9px] font-bold text-[var(--text-primary)] opacity-40 font-jetbrains uppercase tracking-tight">Engagements // Logged</span>
               </div>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════
           PHASE 3: TIMELINE TRACKERS
           ═══════════════════════════════════════════════ */}
        <div ref={timelineTrackRef} className="relative">
          {/* Main Axis (Desktop) */}
          <div className="hidden md:block absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[var(--border-primary)] opacity-30" />
          <div 
            ref={timelineFillRef} 
            className="hidden md:block absolute top-0 left-1/2 w-0.5 -translate-x-1/2 bg-[var(--accent-primary)] origin-top opacity-60 filter blur-[0.5px]" 
            style={{ height: '100%' }} // GSAP will control this via scaleY
          />

          {/* Mobile Linear Axis */}
          <div className="md:hidden absolute left-8 top-0 bottom-0 w-px -translate-x-1/2 bg-[var(--border-primary)] opacity-30" />

          {/* ═══════════════════════════════════════════════
             PHASE 5-7: REFINED ENTRIES
             ═══════════════════════════════════════════════ */}
          <div className="flex flex-col gap-32 md:gap-40">
            {isLoading ? (
              // Enhanced Skeleton Loader
              <div className="flex flex-col items-center justify-center py-20 text-[var(--muted-text)] font-jetbrains opacity-50">
                <div className="animate-spin mb-4">
                   <History size={32} />
                </div>
                <span>Syncing Chronology...</span>
              </div>
            ) : (
              experiencesList.map((exp, i) => {
                const isEven = i % 2 === 0;
                const IconType = exp.type === 'work' ? Briefcase : Trophy;

                return (
                  <div key={i} className="exp-row relative">
                    {/* Timeline Node Node Marker */}
                    <div className={`exp-node exp-node-${i} absolute left-8 md:left-1/2 -translate-x-1/2 top-10 z-20 w-5 h-5 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/40 flex items-center justify-center transition-all duration-300`}>
                       <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                       {/* Pulse Ring Overlay */}
                       <div className="absolute inset-[-4px] rounded-full border border-[var(--accent-primary)] opacity-20 animate-ping opacity-0 group-hover:opacity-100" />
                    </div>

                    {/* Entry Layout Structure */}
                    <div className={`flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      
                      {/* Magnetic Card Container */}
                      <div 
                        className={`exp-card relative w-full md:w-[46%] group cursor-default ${isEven ? 'ml-14 md:ml-0' : 'ml-14 md:ml-0'}`}
                        data-index={i}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Premium Card Surface */}
                        <div className="exp-card-inner relative p-8 md:p-12 rounded-[2rem] bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] backdrop-blur-3xl transition-all duration-700 hover:border-[var(--accent-primary)]/40 hover:shadow-[0_30px_100px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden">
                          
                          {/* Interactive Radial Glow (Inside Card) */}
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                          
                          {/* Magnetic Inner Content */}
                          <div className="exp-card-content relative z-10 flex flex-col gap-8">
                            
                            {/* Year & Period Row */}
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <IconType size={14} className="text-[var(--accent-primary)] opacity-60" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] font-jetbrains text-[var(--accent-primary)]">
                                  {exp.period}
                                </span>
                              </div>
                              <div className="px-2 py-0.5 rounded border border-[var(--border-primary)] text-[8px] font-black text-[var(--muted-text)] font-jetbrains tracking-tight">
                                 MOD_{exp.year}
                              </div>
                            </div>

                            {/* Role Heading */}
                            <div className="space-y-3">
                              <h3 className="text-3xl md:text-4xl font-playfair font-black tracking-tighter uppercase leading-[0.9] text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-500">
                                 {exp.role}
                              </h3>
                              <div className="flex items-center gap-4 flex-wrap">
                                 <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--accent-primary)] opacity-80">
                                    {exp.company}
                                 </span>
                                 <div className="w-1 h-1 rounded-full bg-[var(--border-primary)]" />
                                 <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-[var(--text-primary)] opacity-40">
                                    <MapPin size={10} className="text-[var(--accent-primary)] opacity-60" />
                                    {exp.location}
                                 </span>
                              </div>
                            </div>

                            {/* Decorative Row Divider */}
                            <div className="h-[1px] w-full bg-gradient-to-r from-[var(--border-primary)] via-[var(--border-primary)]/50 to-transparent" />

                            {/* Staggered Content Points */}
                            <ul className="flex flex-col gap-4 font-jetbrains">
                               {exp.points.map((p, j) => (
                                 <li key={j} className="exp-bullet flex items-start gap-4 text-[13px] leading-relaxed text-[var(--text-secondary)]/80 hover:text-[var(--text-primary)] transition-colors group/bullet">
                                    <ChevronRight size={14} className="mt-1 text-[var(--accent-primary)] opacity-30 group-hover/bullet:opacity-100 group-hover/bullet:translate-x-1 transition-all" />
                                    <span>{p}</span>
                                 </li>
                               ))}
                            </ul>
                          </div>

                          {/* Floating Aesthetic Mark */}
                          <div className="absolute top-6 right-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000 rotate-12">
                             <History size={100} strokeWidth={1} />
                          </div>
                        </div>
                      </div>

                      {/* Central Spacer */}
                      <div className="hidden md:block md:w-[8%]" />

                      {/* Phase 5: Parallax Ghost Typography */}
                      <div className={`exp-ghost-num hidden md:flex md:w-[46%] items-center ${isEven ? 'justify-start pl-12' : 'justify-end pr-12'}`}>
                         <span className="text-[12vw] font-playfair font-black text-[var(--text-primary)] select-none pointer-events-none tracking-tighter leading-none opacity-[0.05] transition-opacity duration-500">
                           {exp.id}
                         </span>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Section End Anchor */}
        
      </div>
    </section>
  );
};
