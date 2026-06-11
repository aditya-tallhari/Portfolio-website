"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Trophy,
  Award,
  Zap,
  Medal,
  Flag,
  ExternalLink,
  Cpu,
  Globe,
  Star,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchHackathons, Hackathon } from "@/lib/api";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HackathonEvent {
  id: string;
  _id?: string;
  title: string;
  achievement: string;
  date: string;
  description: string;
  techStack: string[];
  link?: string;
  type: string;
  status: "WIN" | "FINALIST" | "PARTICIPANT";
  image?: string;
}

// Placeholder fallback for when no data is loaded yet
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800";

const Hackathons = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ghostTextRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hackathons, setHackathons] = useState<HackathonEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHackathons()
      .then(data => {
        const normalized = data.map((h: Hackathon) => ({
          id: h._id || '',
          _id: h._id,
          title: h.title,
          achievement: h.achievement,
          date: h.date,
          description: h.description,
          techStack: h.techStack || [],
          link: h.link,
          type: h.type || 'NATIONAL',
          status: h.status || 'PARTICIPANT',
          image: h.image || FALLBACK_IMAGE,
        }));
        setHackathons(normalized);
      })
      .catch(() => setHackathons([]))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setMounted(true);

    if (!sectionRef.current) return;

    if (ghostTextRef.current) {
      gsap.to(ghostTextRef.current, {
        xPercent: -20,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }

    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 95%"
          }
        }
      );
    }

    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.children;
      gsap.fromTo(cards,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: "top 90%"
          }
        }
      );
    }
  }, [hackathons]);

  if (!mounted) return null;

  return (
    <section 
      ref={sectionRef}
      id="hackathons" 
      className="relative py-20 md:py-28 bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div 
        ref={ghostTextRef}
        className="absolute top-10 left-0 text-[10vw] font-playfair font-black text-[var(--text-primary)] opacity-[0.02] whitespace-nowrap pointer-events-none select-none z-0"
      >
        RECORDS ARENA BATTLEFIELD CHAMPIONSHIPS
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-[1px] bg-[var(--accent-primary)]" />
            <span className="text-[9px] font-jetbrains font-bold tracking-[0.2em] uppercase text-[var(--accent-primary)]">
              Index.log
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 
              ref={titleRef}
              className="text-4xl md:text-6xl font-playfair font-black tracking-tighter leading-[1.0] uppercase"
            >
              HACKATHON <span className="text-[var(--accent-primary)]">RECORDS</span>
            </h2>
            <p className="max-w-xs text-[11px] text-[var(--text-secondary)] opacity-50 font-jetbrains leading-relaxed">
              Technical milestones and competitive victories in rapid development.
            </p>
          </div>
        </div>

        {/* Expand-On-Hover Cards Layout */}
        <div 
          ref={cardsContainerRef}
          className="flex flex-col lg:flex-row w-full gap-4 items-stretch min-h-[450px] mb-8"
        >
          {isLoading ? (
            // Skeleton placeholders while loading
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 min-h-[200px] lg:h-[480px] rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] animate-pulse"
              />
            ))
          ) : hackathons.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-20 text-[var(--text-primary)] opacity-30">
              <div className="text-center">
                <Trophy size={40} className="mx-auto mb-3" />
                <p className="text-xs font-jetbrains uppercase tracking-widest">No hackathons added yet</p>
              </div>
            </div>
          ) : (
            hackathons.map((event, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={event.id}
                  className={cn(
                    "relative cursor-pointer overflow-hidden rounded-3xl transition-all duration-700 ease-in-out border border-[var(--border-primary)]/80 hover:border-[var(--accent-primary)]/40 flex-1 group",
                    isActive ? "flex-[2.5] lg:flex-[3] h-[350px] lg:h-[480px]" : "flex-[0.8] lg:flex-[0.8] h-[90px] lg:h-[480px]"
                  )}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => setActiveIdx(idx)}
                >
                  {/* Background Tech Image */}
                  <img
                    src={event.image || FALLBACK_IMAGE}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />

                  {/* Dark Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                  {/* Active Expanded Card Content */}
                  <div 
                    className={cn(
                      "absolute inset-0 flex flex-col justify-between p-6 sm:p-8 transition-opacity duration-500",
                      isActive ? "opacity-100 delay-200 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 text-[9px] font-jetbrains font-bold tracking-widest rounded-full border border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10">
                          {event.status}
                        </span>
                        <span className="text-[9px] font-jetbrains text-white/50 uppercase tracking-widest">{event.type}</span>
                      </div>
                      <span className="text-[10px] font-jetbrains text-white/40">{event.date}</span>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl sm:text-3xl font-playfair font-black text-white leading-tight">
                        {event.title}
                      </h3>
                      <p className="text-xs text-white/70 leading-relaxed font-jetbrains max-w-lg">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs font-jetbrains text-[var(--accent-primary)] font-black uppercase tracking-wider">
                        <Trophy size={14} />
                        {event.achievement}
                      </div>

                      <div className="pt-2 flex flex-wrap gap-2">
                        {event.techStack.map(tech => (
                          <span 
                            key={tech} 
                            className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] font-jetbrains text-white/60 hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/40 transition-colors"
                          >
                            #{tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {event.link && (
                      <div className="flex justify-end pt-4">
                        <a 
                          href={event.link} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[10px] font-jetbrains uppercase tracking-widest text-white/80 hover:text-[var(--accent-primary)] transition-colors"
                        >
                          View Project <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Collapsed Card Content */}
                  <div 
                    className={cn(
                      "absolute inset-0 flex transition-opacity duration-500 p-4 lg:p-6",
                      !isActive ? "opacity-100 delay-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}
                  >
                    <div className="hidden lg:flex flex-col items-center justify-between w-full h-full select-none">
                       <span className="text-base font-jetbrains font-black text-[var(--accent-primary)]">
                         {String(idx + 1).padStart(2, '0')}
                       </span>
                       <span className="text-xs font-jetbrains uppercase tracking-[0.4em] [writing-mode:vertical-lr] text-white/60 rotate-180 py-4 font-black truncate max-h-[200px]">
                         {event.title}
                       </span>
                       <Trophy size={18} className="text-white/40" />
                    </div>
                    <div className="lg:hidden flex items-center justify-between w-full select-none">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-jetbrains font-black text-[var(--accent-primary)]">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-playfair font-black text-white/80">
                          {event.title}
                        </span>
                      </div>
                      <Trophy size={16} className="text-white/40" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Compact Stats Dashboard */}
        {/* <div
          className="w-full p-6 sm:p-8 bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/10 backdrop-blur-md rounded-3xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent-primary)]/5 to-transparent h-16 -top-16 group-hover:animate-scan pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-[var(--accent-primary)]" />
                <span className="text-[10px] font-jetbrains font-bold tracking-[0.3em] text-[var(--accent-primary)] uppercase">LOGS.DASH</span>
              </div>
              <p className="text-[10px] font-jetbrains text-[var(--text-secondary)] opacity-50 uppercase">Performance Indicators & Core Stats</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 w-full sm:w-auto">
              {[
                { label: "Builds", val: String(hackathons.length).padStart(2, '0') },
                { label: "Wins", val: String(hackathons.filter(h => h.status === 'WIN').length).padStart(2, '0') },
                { label: "Finalist", val: String(hackathons.filter(h => h.status === 'FINALIST').length).padStart(2, '0') },
                { label: "Tech Used", val: String(new Set(hackathons.flatMap(h => h.techStack)).size) }
              ].map((stat, i) => (
                <div key={i} className="space-y-1 group/stat">
                  <div className="text-3xl font-playfair font-black text-[var(--text-primary)] group-hover/stat:text-[var(--accent-primary)] transition-colors">{stat.val}</div>
                  <div className="text-[8px] font-jetbrains text-[var(--text-secondary)] opacity-40 tracking-widest uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-primary)]/30 flex items-center gap-4 text-[8px] font-jetbrains text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Star size={9} /> Verified Archive</span>
            <span className="flex items-center gap-1.5"><Globe size={9} /> Network Sync</span>
          </div>
        </div> */}

        {/* Section Footer indicator */}
        <div className="mt-12 flex items-center gap-2 opacity-10 font-jetbrains text-[9px] tracking-widest uppercase">
          <span className="text-[var(--accent-primary)]">{">"}</span>
          <span>Index_End</span>
          <div className="w-1.5 h-3 bg-[var(--text-primary)] animate-pulse" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .animate-scan {
          animation: scan 2.5s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hackathons;
