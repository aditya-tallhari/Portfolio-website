'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Code2,
  Database,
  Globe,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  Boxes,
  Workflow,
  Server,
  Smartphone,
  Layout,
  Settings,
  Flame,
  Zap,
  Coffee,
  GitBranch,
  Cloud,
  Brain,
  Microscope,
  Box
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const frontend = [
  { name: 'Next.js', icon: '/tech/next.svg', iconComp: Globe, color: '#000000', proficiency: 95, level: 'Advanced', desc: 'Server-side rendering & Static Generation' },
  { name: 'React.js', icon: '/tech/react.svg', iconComp: Layout, color: '#61DAFB', proficiency: 98, level: 'Expert', desc: 'Component-driven UI development' },
  { name: 'TypeScript', icon: '/tech/typescript.svg', iconComp: Code2, color: '#3178C6', proficiency: 90, level: 'Advanced', desc: 'Typed JavaScript for scale' },
  { name: 'Tailwind CSS', icon: '/tech/tailwind.svg', iconComp: Palette, color: '#06B6D4', proficiency: 95, level: 'Expert', desc: 'Utility-first CSS styling' },
  { name: 'Redux', icon: '/tech/redux.svg', iconComp: Layers, color: '#764ABC', proficiency: 85, level: 'Advanced', desc: 'Predictable state management' },
  { name: 'HTML5', icon: '/tech/html5.svg', iconComp: Code2, color: '#E34F26', proficiency: 100, level: 'Expert', desc: 'Semantic web architecture' },
  { name: 'CSS3', icon: '/tech/css3.svg', iconComp: Palette, color: '#1572B6', proficiency: 95, level: 'Expert', desc: 'Advanced layouts & animations' },
  { name: 'Firebase', icon: null, iconComp: Flame, color: '#FFCA28', proficiency: 80, level: 'Intermediate', desc: 'Real-time database & Auth' },
];

const backend = [
  { name: 'Node.js', icon: '/tech/nodejs.svg', iconComp: Server, color: '#339933', proficiency: 92, level: 'Advanced', desc: 'High-performance runtime' },
  { name: 'Express.js', icon: '/tech/Express.svg', iconComp: Workflow, color: '#000000', proficiency: 95, level: 'Advanced', desc: 'Lightweight web framework' },
  { name: 'MongoDB', icon: '/tech/mongodb.svg', iconComp: Database, color: '#47A248', proficiency: 88, level: 'Advanced', desc: 'NoSQL document storage' },
  { name: 'PostgreSQL', icon: '/tech/PostgresSQL.svg', iconComp: Database, color: '#336791', proficiency: 82, level: 'Intermediate', desc: 'Relational database management' },
  { name: 'Redis', icon: '/tech/redis.svg', iconComp: Zap, color: '#DC382D', proficiency: 75, level: 'Intermediate', desc: 'In-memory data structure store' },
  { name: 'GraphQL', icon: '/tech/Graphql.svg', iconComp: GitBranch, color: '#E10098', proficiency: 80, level: 'Intermediate', desc: 'Query language for APIs' },
  { name: 'Docker', icon: '/tech/docker.svg', iconComp: Boxes, color: '#2496ED', proficiency: 70, level: 'Intermediate', desc: 'Containerization & orchestration' },
  { name: 'JWT Auth', icon: null, iconComp: ShieldCheck, color: '#D4AF37', proficiency: 95, level: 'Advanced', desc: 'Secure token-based authentication' },
];

const core = [
  { name: 'Python', icon: '/tech/python.svg', iconComp: Code2, color: '#3776AB', proficiency: 85, level: 'Advanced', desc: 'Data science & automation' },
  { name: 'Java', icon: '/tech/Java.svg', iconComp: Coffee, color: '#007396', proficiency: 78, level: 'Intermediate', desc: 'Enterprise software development' },
  { name: 'JavaScript', icon: '/tech/JavaScript.svg', iconComp: Coffee, color: '#007396', proficiency: 78, level: 'Intermediate', desc: 'Enterprise software development' },
  { name: 'Git', icon: '/tech/git.svg', iconComp: GitBranch, color: '#F05032', proficiency: 95, level: 'Expert', desc: 'Distributed version control' },
  { name: 'VS Code', icon: '/tech/vscode.svg', iconComp: Terminal, color: '#007ACC', proficiency: 100, level: 'Expert', desc: 'Primary IDE & customization' },
  { name: 'C Language', icon: '/tech/C.svg', iconComp: Terminal, color: '#A8B9CC', proficiency: 80, level: 'Intermediate', desc: 'Low-level systems programming' },
  { name: 'DSA', icon: null, iconComp: Boxes, color: '#D4AF37', proficiency: 85, level: 'Advanced', desc: 'Optimizing through algorithms' },
];

const devops = [
  // { name: 'AWS', icon: '/tech/aws.svg', iconComp: Cloud, color: '#FF9900', proficiency: 75, level: 'Intermediate', desc: 'Cloud infrastructure' },
  { name: 'Vercel', icon: '/tech/vercel.svg', iconComp: Globe, color: '#000000', proficiency: 95, level: 'Expert', desc: 'Deployment & Hosting' },
  { name: 'Docker', icon: '/tech/docker.svg', iconComp: Box, color: '#2496ED', proficiency: 70, level: 'Intermediate', desc: 'Containerization' },
  { name: 'GitHub Actions', icon: "/tech/GitHubActions.svg", iconComp: Workflow, color: '#2088FF', proficiency: 85, level: 'Advanced', desc: 'CI/CD Automation' },
];

const ai = [
  { name: 'Ollama', icon: null, iconComp: Cpu, color: '#000000', proficiency: 85, level: 'Advanced', desc: 'Local LLM orchestration' },
  { name: 'LangChain', icon: null, iconComp: Workflow, color: '#1389FD', proficiency: 82, level: 'Advanced', desc: 'AI Agents & RAG' },
  { name: 'Vector DBs', icon: null, iconComp: Database, color: '#272727', proficiency: 78, level: 'Intermediate', desc: 'Pinecone & Milvus' },
  { name: 'Prompt Eng.', icon: null, iconComp: Microscope, color: '#FF5733', proficiency: 95, level: 'Expert', desc: 'Advanced LLM steering' },
];

const design = [
  // { name: 'Figma', icon: '/tech/figma.svg', iconComp: Layout, color: '#F24E1E', proficiency: 85, level: 'Advanced', desc: 'UI/UX Design' },
  { name: 'Postman', icon: '/tech/Postman.svg', iconComp: Terminal, color: '#FF6C37', proficiency: 90, level: 'Advanced', desc: 'API Testing' },
  { name: 'Linear', icon: null, iconComp: Layers, color: '#5E6AD2', proficiency: 95, level: 'Expert', desc: 'Project management' },
  { name: 'Spline', icon: null, iconComp: Box, color: '#FF3366', proficiency: 75, level: 'Intermediate', desc: '3D Web Design' },
];


function Palette(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.5 2-1.2.4.7 1.1 1.2 2 1.2 2.8 0 5-2.2 5-5 0-1-.4-1.9-1-2.6 1-.7 1.6-1.8 1.6-3 0-4.4-3.6-8-8-8z" />
    </svg>
  );
}




export const TechStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // 1. HEADER REVEAL
    const chars = titleRef.current?.querySelectorAll('.char-reveal');
    if (chars && chars.length > 0 && titleRef.current) {
      gsap.fromTo(chars,
        { opacity: 0, y: 30, rotateX: -90, filter: 'blur(10px)' },
        {
          opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
          stagger: 0.02, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { 
            trigger: titleRef.current, 
            start: 'top 85%', 
            once: true 
          }
        }
      );
    }

    // 2. CATEGORIZED CLUSTER ANIMATION
    const groups = gsap.utils.toArray('.tech-category-group');
    if (groups.length > 0) {
      groups.forEach((group: any) => {
        const title = group.querySelector('.cat-title');
        const cards = group.querySelectorAll('.tech-icon-wrapper');
        
        if (!title || cards.length === 0) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: group,
            start: 'top 85%',
            once: true
          }
        });

        tl.fromTo(title,
          { opacity: 0, x: -20, filter: 'blur(5px)' },
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.5 }
        )
          .fromTo(cards,
            {
              scale: 0.8,
              opacity: 0,
              y: 20,
              rotate: () => (Math.random() - 0.5) * 10
            },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              rotate: 0,
              stagger: 0.05,
              duration: 0.8,
              ease: 'power3.out'
            },
            "-=0.3"
          );
      });
    }

    // 3. Central Globe Pulse
    const globeGlow = containerRef.current.querySelector('.globe-glow');
    if (globeGlow) {
      gsap.to(globeGlow, {
        scale: 1.4,
        opacity: 0.4,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    // 4. Parallax Background Shift (Desktop Only)
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const bgPattern = containerRef.current?.querySelector('.bg-pattern');
      if (bgPattern && containerRef.current) {
        gsap.to(bgPattern, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      }
    });
  }, { scope: containerRef });

  const categories = [
    { id: '01', title: 'Frontend Architecture', data: frontend },
    { id: '02', title: 'Backend & Systems', data: backend },
    { id: '03', title: 'Core Foundations', data: core },
    { id: '04', title: 'DevOps & Cloud', data: devops },
    { id: '05', title: 'Autonomous AI', data: ai },
    { id: '06', title: 'Design & Workflow', data: design },
  ];

  return (
    <section ref={containerRef} id="tech" className="relative py-20 px-6 md:px-12 bg-[var(--bg-primary)] overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="bg-pattern absolute inset-0 opacity-[0.05] pointer-events-none transition-opacity duration-500">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative Architectural Lines */}
      <div className="absolute top-0 left-8 md:left-16 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--border-primary)] to-transparent opacity-20 hidden xl:block" />
      <div className="absolute top-0 right-8 md:right-16 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--border-primary)] to-transparent opacity-20 hidden xl:block" />

      {/* Subtler Side Metadata */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden 2xl:flex flex-col gap-12 opacity-[0.2] pointer-events-none transition-opacity duration-500">
        {['SYSTEM_V1', 'MOD_TECH', 'ACTIVE_STATE'].map((text, i) => (
          <span key={i} className="text-[9px] font-black uppercase tracking-[1em] [writing-mode:vertical-lr] text-[var(--text-primary)] rotate-180">
            {text}
          </span>
        ))}
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden 2xl:flex flex-col gap-12 opacity-[0.2] pointer-events-none transition-opacity duration-500">
        {['NODE_CLUSTER', 'STACK_LOAD', 'CORE_INIT'].map((text, i) => (
          <span key={i} className="text-[9px] font-black uppercase tracking-[1em] [writing-mode:vertical-lr] text-[var(--text-primary)]">
            {text}
          </span>
        ))}
      </div>

      {/* Central Globe Glow */}
      <div className="globe-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[var(--accent-primary)]/5 blur-[150px] rounded-full pointer-events-none z-0 opacity-40 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 text-center flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-[1px] bg-[var(--accent-primary)]" />
            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--accent-primary)]">Tech Stack</span>
            <div className="w-10 h-[1px] bg-[var(--accent-primary)]" />
          </div>
          <h2 ref={titleRef} className="text-3xl md:text-4xl lg:text-5xl font-playfair font-medium text-[var(--text-primary)] mb-6 flex flex-wrap justify-center gap-[0.2em] max-w-3xl leading-[1.1]">
            {"Making apps with modern technologies.".split(" ").map((word, i) => (
              <span key={i} className="flex">
                {word.split("").map((char, j) => (
                  <span key={j} className="char-reveal inline-block">{char}</span>
                ))}
                <span className="char-reveal">&nbsp;</span>
              </span>
            ))}
          </h2>

        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {categories.map((cat, idx) => (
            <div key={idx} className="tech-category-group flex flex-col group/cat">
              {/* Partition Header */}
              <div className="cat-title flex items-center gap-6 mb-8 w-full max-w-5xl">
                <span className="text-[12px] font-black text-[var(--accent-primary)] font-jetbrains opacity-40">
                  {cat.id}
                </span>
                <h3 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.6em] text-[var(--text-primary)] whitespace-nowrap group-hover/cat:text-[var(--accent-primary)] transition-colors">
                  {cat.title}
                </h3>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-[var(--border-primary)] via-[var(--border-primary)]/40 to-transparent" />
              </div>

              {/* Icon Cloud for Category */}
              <div className="flex flex-wrap gap-3 md:gap-4">
                {cat.data.map((tech, i) => (
                  <div key={i} className="tech-icon-wrapper group relative">
                    <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-2xl bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] shadow-sm overflow-hidden transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:border-[var(--accent-primary)]/40 hover:shadow-xl hover:shadow-[var(--accent-primary)]/5">
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700"
                        style={{ background: `radial-gradient(circle at center, ${tech.color}, transparent 80%)` }}
                      />

                      {tech.icon ? (
                        <div className="relative z-10 transition-all duration-500 group-hover:scale-75 group-hover:opacity-10">
                          <Image
                            src={tech.icon}
                            alt={tech.name}
                            width={32}
                            height={32}
                            className="w-6 h-6 md:w-8 md:h-8 object-contain grayscale-[0.3] group-hover:grayscale-0"
                          />
                        </div>
                      ) : (
                        <div className="relative z-10 transition-all duration-500 group-hover:scale-75 group-hover:opacity-10">
                          <tech.iconComp
                            size={24}
                            className="w-6 h-6 md:w-8 md:h-8"
                            style={{ color: tech.color || 'var(--text-secondary)' }}
                          />
                        </div>
                      )}

                      {/* Hover Label - Internal to prevent overlap */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 px-2">
                        <span className="text-[7px] md:text-[9px] font-black uppercase tracking-tighter text-[var(--text-primary)] text-center leading-tight">
                          {tech.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
