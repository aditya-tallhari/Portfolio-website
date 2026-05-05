"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Trophy,
  Award,
  Zap,
  Medal,
  Flag,
  ExternalLink,
  Code2,
  Cpu,
  Globe,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

interface HackathonEvent {
  id: string;
  title: string;
  achievement: string;
  date: string;
  description: string;
  techStack: string[];
  link?: string;
  type: string;
  status: "WIN" | "FINALIST" | "PARTICIPANT";
}

const HACKATHONS: HackathonEvent[] = [
  {
    id: "1",
    title: "Global AI Innovators",
    achievement: "Grand Prize Winner",
    date: "2025.10",
    description: "Developed a real-time decentralized AI governance model using zero-knowledge proofs.",
    techStack: ["PyTorch", "Solidity", "Zero-Knowledge"],
    link: "#",
    type: "GLOBAL",
    status: "WIN"
  },
  {
    id: "2",
    title: "Google Solution Challenge",
    achievement: "Top 10 Finalist",
    date: "2025.08",
    description: "Built a sustainable energy grid monitoring system using GCP and edge computing.",
    techStack: ["Go", "GCP", "Kubernetes"],
    link: "#",
    type: "INTL",
    status: "FINALIST"
  },
  {
    id: "3",
    title: "Ethereum India",
    achievement: "Best UX Award",
    date: "2024.12",
    description: "Redesigned the wallet experience for first-time DeFi users with biometric security.",
    techStack: ["Solidity", "React", "Web3Auth"],
    link: "#",
    type: "NATIONAL",
    status: "WIN"
  },
  {
    id: "4",
    title: "NASA Space Apps",
    achievement: "Global Runner Up",
    date: "2024.06",
    description: "Predicting solar flare impact on satellite communications using orbital telemetry.",
    techStack: ["Python", "TensorFlow", "AWS"],
    link: "#",
    type: "GLOBAL",
    status: "FINALIST"
  }
];

const Hackathons = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ghostTextRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (sectionRef.current) {
      if (ghostTextRef.current) {
        gsap.to(ghostTextRef.current, {
          xPercent: -30,
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

      if (cardsRef.current) {
        const cards = cardsRef.current.children;
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
              trigger: cardsRef.current,
              start: "top 90%"
            }
          }
        );
      }
    }
  }, []);

  if (!mounted) return null;

  return (
    <section 
      ref={sectionRef}
      id="hackathons" 
      className="relative py-16 md:py-20 bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
    >
      {/* Small Ghost Text */}
      <div 
        ref={ghostTextRef}
        className="absolute top-10 left-0 text-[10vw] font-playfair font-black text-[var(--text-primary)] opacity-[0.02] whitespace-nowrap pointer-events-none select-none z-0"
      >
        RECORDS ARENA BATTLEFIELD
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Compact Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-[1px] bg-[var(--accent-primary)]" />
            <span className="text-[9px] font-jetbrains font-bold tracking-[0.2em] uppercase text-[var(--accent-primary)]">
              Index.log
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 
              ref={titleRef}
              className="text-3xl sm:text-4xl md:text-5xl font-playfair font-black tracking-tighter leading-[1.0]"
            >
              HACKATHON <span className="text-[var(--accent-primary)]">RECORDS</span>
            </h2>
            <p className="max-w-xs text-[11px] text-[var(--text-secondary)] opacity-50 font-jetbrains leading-relaxed">
              Technical milestones and competitive victories in rapid development.
            </p>
          </div>
        </div>

        {/* Compact Bento Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {HACKATHONS.map((event, idx) => (
            <div
              key={event.id}
              className="group relative flex flex-col p-4 sm:p-6 bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/40 transition-all duration-300 rounded-sm"
            >
              <div className="absolute top-0 right-0 w-0 h-0 border-t border-r border-[var(--accent-primary)] group-hover:w-3 group-hover:h-3 transition-all duration-300" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-0.5 text-[8px] font-jetbrains font-bold tracking-widest rounded-full border",
                    event.status === "WIN" 
                      ? "border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/5" 
                      : "border-[var(--text-primary)]/20 text-[var(--text-primary)]/40"
                  )}>
                    {event.status}
                  </span>
                  <span className="text-[8px] font-jetbrains opacity-20 uppercase tracking-widest">{event.type}</span>
                </div>
                <span className="text-[9px] font-jetbrains opacity-20 group-hover:opacity-60 transition-opacity">{event.date}</span>
              </div>

              <div className="flex-grow space-y-3">
                <h3 className="text-lg font-playfair font-black group-hover:text-[var(--accent-primary)] transition-colors">
                  {event.title}
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] opacity-60 leading-relaxed font-jetbrains line-clamp-2">
                  {event.description}
                </p>
                <div className="text-[9px] font-jetbrains text-[var(--accent-primary)] opacity-60 uppercase tracking-widest pt-1">
                  {event.achievement}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-primary)] flex flex-wrap gap-x-3 gap-y-1">
                {event.techStack.map(tech => (
                  <span key={tech} className="text-[9px] font-jetbrains text-[var(--text-primary)] opacity-30 hover:text-[var(--accent-primary)] hover:opacity-100 transition-all">
                    #{tech}
                  </span>
                ))}
              </div>

              {event.link && (
                <a 
                  href={event.link} 
                  className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink size={12} className="text-[var(--accent-primary)]" />
                </a>
              )}
            </div>
          ))}

          {/* Compact Stats Card */}
          <div
            className="sm:col-span-1 lg:col-span-2 flex flex-col justify-between p-5 sm:p-7 bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/10 backdrop-blur-md rounded-sm relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent-primary)]/5 to-transparent h-16 -top-16 group-hover:animate-scan pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <Cpu size={14} className="text-[var(--accent-primary)]" />
                <span className="text-[10px] font-jetbrains font-bold tracking-[0.3em] text-[var(--accent-primary)] uppercase">LOGS.DASH</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { label: "Builds", val: "12" },
                  { label: "Wins", val: "04" },
                  { label: "Rank", val: "L1" },
                  { label: "Health", val: "99%" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-1 group/stat">
                    <div className="text-2xl font-playfair font-black group-hover/stat:text-[var(--accent-primary)] transition-colors">{stat.val}</div>
                    <div className="text-[8px] font-jetbrains text-[var(--text-secondary)] opacity-30 tracking-widest uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4 text-[8px] font-jetbrains text-[var(--text-secondary)] opacity-30 uppercase tracking-widest">
              <span className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"><Star size={9} /> Verified</span>
              <span className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"><Globe size={9} /> Sync</span>
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="mt-12 flex items-center gap-2 opacity-10 font-jetbrains text-[9px] tracking-widest uppercase group">
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
