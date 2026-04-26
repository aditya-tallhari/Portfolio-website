'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, BookOpen, Binary, Cpu } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { fetchEducation, Education } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

export const Achievements = () => {
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const loadEducation = async () => {
      try {
        const data = await fetchEducation();
        setEducationData(data);
      } catch (error) {
        console.error("Error fetching education:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEducation();
  }, []);

  // Simple Entrance
  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.from(".edu-container", {
      opacity: 0,
      duration: 0.5,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
      }
    });
  }, { scope: containerRef });

  // Simple Indicator Slide
  useGSAP(() => {
    if (!containerRef.current || !indicatorRef.current) return;
    const activeLabel = labelRefs.current[activeIndex];
    if (activeLabel) {
      gsap.to(indicatorRef.current, {
        y: activeLabel.offsetTop,
        height: activeLabel.offsetHeight,
        duration: 0.25,
        ease: "sine.out"
      });
    }
  }, { scope: containerRef, dependencies: [activeIndex] });

  // Premium Staggered Content Transition
  useGSAP(() => {
    if (!containerRef.current || !detailRef.current) return;

    const tl = gsap.timeline();

    // 1. Reset state (invisible and slightly shifted)
    tl.set([".detail-header", ".detail-stats", ".detail-focus", ".detail-tags"], { 
      opacity: 0, 
      y: 10 
    });

    // 2. Coordinated entrance
    tl.to([".detail-header", ".detail-stats", ".detail-focus", ".detail-tags"], {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out",
    });
  }, { scope: containerRef, dependencies: [activeIndex] });


  const activeData = educationData[activeIndex] || educationData[0];

  if (isLoading) {
    return (
      <section className="relative w-full py-20 bg-[var(--bg-primary)] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="w-48 h-4 bg-[var(--text-primary)]/[0.04] rounded animate-pulse mb-4" />
          <div className="w-96 h-12 bg-[var(--text-primary)]/[0.04] rounded animate-pulse mb-12" />
          <div className="h-96 rounded-2xl bg-[var(--text-primary)]/[0.02] border border-[var(--border-primary)] animate-pulse" />
        </div>
      </section>
    );
  }

  if (educationData.length === 0) return null;

  const handleHover = (index: number) => {
    if (index === activeIndex) return;

    // 1. Animate current content OUT first
    gsap.to([".detail-header", ".detail-stats", ".detail-focus", ".detail-tags"], {
      opacity: 0,
      y: -10,
      duration: 0.15,
      ease: "power2.in",
      onComplete: () => {
        // 2. Change state ONLY after animation is done
        setActiveIndex(index);
      }
    });
  };

  return (
    <section 
      ref={containerRef} 
      id="education" 
      className="relative w-full py-20 bg-[var(--bg-primary)] overflow-hidden"
    >
      <div className="edu-container max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-[1px] bg-[var(--accent-primary)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)] font-jetbrains">Education</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-black uppercase text-[var(--text-primary)]">
            Academic <span className="text-[var(--accent-primary)]">Milestones</span>
          </h2>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Simple Sidebar */}
          <div className="w-full lg:w-[200px] relative">
            <div 
              ref={indicatorRef}
              className="absolute left-0 w-[2px] bg-[var(--accent-primary)] hidden lg:block z-20"
            />
            <div className="flex flex-row lg:flex-col border-l border-[var(--border-primary)]/30">
              {educationData.map((edu, index) => (
                <button
                  key={edu._id}
                  ref={el => { labelRefs.current[index] = el }}
                  onMouseEnter={() => handleHover(index)}
                  className={`relative px-6 py-4 text-left transition-all duration-200 group ${
                    activeIndex === index ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]/30 hover:text-[var(--text-primary)]/60'
                  }`}
                >
                  <span className="text-[13px] font-jetbrains font-medium block tracking-tight">
                    {edu.label}
                  </span>
                </button>
              ))}
            </div>
          </div>


          {/* Simple Detail Section */}
          <div 
            ref={detailRef}
            className="flex-1 w-full relative"
          >
            <div className="p-8 md:p-10 rounded-[1rem] bg-[var(--text-primary)]/[0.02] border border-[var(--border-primary)] relative min-h-[400px] flex flex-col justify-center">
              <div className="detail-content-inner space-y-8">
                <div className="detail-header flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-widest">
                      {activeData.degree}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-playfair font-black text-[var(--text-primary)]">
                      {activeData.specialization}
                    </h3>
                  </div>


                  <div className="detail-stats flex flex-col items-end">
                    <div className="text-3xl md:text-4xl font-playfair font-black text-[var(--accent-primary)]">
                      {activeData.grade.split(': ')[1] || activeData.grade}
                    </div>
                    <span className="text-[10px] font-bold opacity-40 uppercase">
                      {activeData.grade.includes(':') ? activeData.grade.split(': ')[0] : 'Result'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[var(--border-primary)]/10">
                  <div className="detail-focus space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase text-[var(--accent-primary)]">Institution</span>
                      <div className="text-sm font-bold text-[var(--text-primary)]">
                        {activeData.institution}
                        <span className="block opacity-40 text-[10px]">{activeData.location}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase text-[var(--accent-primary)]">Timeline</span>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{activeData.period}</p>
                    </div>
                  </div>
                  <div className="detail-focus space-y-1">
                    <span className="text-[9px] font-bold uppercase text-[var(--accent-primary)]">Description</span>
                    <p className="text-xs text-[var(--text-secondary)] opacity-70 leading-relaxed font-jetbrains">
                      {activeData.desc}
                    </p>
                  </div>
                </div>

                <div className="detail-tags flex flex-wrap gap-2 pt-4">
                  {activeData.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] text-[9px] font-bold uppercase opacity-60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
