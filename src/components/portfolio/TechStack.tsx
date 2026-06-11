'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Code2,
  Database,
  Globe,
  Terminal,
  Layers,
  ShieldCheck,
  Boxes,
  Workflow,
  Server,
  Smartphone,
  Layout,
  Flame,
  Zap,
  Coffee,
  GitBranch,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const frontend = [
  { name: 'React.js', icon: 'https://icon.icepanel.io/Technology/svg/React.svg', iconComp: Layout, color: '#d7f6ffff', proficiency: 98, level: 'Expert', desc: 'Component-driven UI development' },
  { name: 'Next.js', icon: 'https://icon.icepanel.io/Technology/png-shadow-512/Next.js.png', iconComp: Globe, color: '#000000', proficiency: 95, level: 'Advanced', desc: 'Server-side rendering & Static Generation' },
  { name: 'TypeScript', icon: 'https://icon.icepanel.io/Technology/svg/TypeScript.svg', iconComp: Code2, color: '#3178C6', proficiency: 90, level: 'Advanced', desc: 'Typed JavaScript for scale' },
  { name: 'Tailwind CSS', icon: 'https://icon.icepanel.io/Technology/svg/Tailwind-CSS.svg', iconComp: Palette, color: '#06B6D4', proficiency: 95, level: 'Expert', desc: 'Utility-first CSS styling' },
  { name: 'Redux', icon: 'https://icon.icepanel.io/Technology/svg/Redux.svg', iconComp: Layers, color: '#764ABC', proficiency: 85, level: 'Advanced', desc: 'Predictable state management' },
  { name: 'HTML5', icon: 'https://icon.icepanel.io/Technology/svg/HTML5.svg', iconComp: Code2, color: '#E34F26', proficiency: 100, level: 'Expert', desc: 'Semantic web architecture' },
  { name: 'CSS3', icon: 'https://icon.icepanel.io/Technology/svg/CSS3.svg', iconComp: Palette, color: '#1572B6', proficiency: 95, level: 'Expert', desc: 'Advanced layouts & animations' },
  { name: 'Firebase', icon: 'https://icon.icepanel.io/Technology/svg/Firebase.svg', iconComp: Flame, color: '#FFCA28', proficiency: 80, level: 'Intermediate', desc: 'Real-time database & Auth' },
];

const backend = [
  { name: 'Node.js', icon: 'https://icon.icepanel.io/Technology/svg/Node.js.svg', iconComp: Server, color: '#339933', proficiency: 92, level: 'Advanced', desc: 'High-performance runtime' },
  { name: 'Express.js', icon: 'https://cdn.simpleicons.org/express/ffffff', iconComp: Workflow, color: '#000000', proficiency: 95, level: 'Advanced', desc: 'Lightweight web framework' },
  { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/47A248', iconComp: Database, color: '#47A248', proficiency: 88, level: 'Advanced', desc: 'NoSQL document storage' },
  { name: 'PostgreSQL', icon: 'https://icon.icepanel.io/Technology/svg/PostgresSQL.svg', iconComp: Database, color: '#336791', proficiency: 82, level: 'Intermediate', desc: 'Relational database management' },
  { name: 'Redis', icon: 'https://icon.icepanel.io/Technology/svg/Redis.svg', iconComp: Zap, color: '#DC382D', proficiency: 75, level: 'Intermediate', desc: 'In-memory data structure store' },
  { name: 'GraphQL', icon: 'https://icon.icepanel.io/Technology/svg/GraphQL.svg', iconComp: GitBranch, color: '#E10098', proficiency: 80, level: 'Intermediate', desc: 'Query language for APIs' },
  { name: 'Docker', icon: 'https://icon.icepanel.io/Technology/svg/Docker.svg', iconComp: Boxes, color: '#2496ED', proficiency: 70, level: 'Intermediate', desc: 'Containerization & orchestration' },
  { name: 'JWT Auth', icon: null, iconComp: ShieldCheck, color: '#D4AF37', proficiency: 95, level: 'Advanced', desc: 'Secure token-based authentication' },
];

const core = [
  { name: 'Python', icon: 'https://icon.icepanel.io/Technology/svg/Python.svg', iconComp: Code2, color: '#3776AB', proficiency: 85, level: 'Advanced', desc: 'Data science & automation' },
  { name: 'Java', icon: 'https://icon.icepanel.io/Technology/svg/Java.svg', iconComp: Coffee, color: '#007396', proficiency: 78, level: 'Intermediate', desc: 'Enterprise software development' },
  { name: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E', iconComp: Coffee, color: '#F7DF1E', proficiency: 78, level: 'Intermediate', desc: 'Enterprise software development' },
  { name: 'Git', icon: 'https://cdn.simpleicons.org/git/F05032', iconComp: GitBranch, color: '#F05032', proficiency: 95, level: 'Expert', desc: 'Distributed version control' },
  { name: 'VS Code', icon: 'https://icon.icepanel.io/Technology/svg/Visual-Studio-Code-%28VS-Code%29.svg', iconComp: Terminal, color: '#007ACC', proficiency: 100, level: 'Expert', desc: 'Primary IDE & customization' },
  { name: 'DSA', icon: null, iconComp: Boxes, color: '#D4AF37', proficiency: 85, level: 'Advanced', desc: 'Optimizing through algorithms' },
  { name: 'C Language', icon: 'https://icon.icepanel.io/Technology/svg/C.svg', iconComp: Terminal, color: '#A8B9CC', proficiency: 80, level: 'Intermediate', desc: 'Low-level systems programming' },
  { name: 'Github', icon: 'https://cdn.simpleicons.org/github/ffffff', iconComp: GitBranch, color: '#181717', proficiency: 95, level: 'Expert', desc: 'Version control & collaboration' },
];

const mobile = [
  { name: 'React Native', icon: 'https://cdn.simpleicons.org/react/61DAFB', iconComp: Smartphone, color: '#61DAFB', proficiency: 85, level: 'Advanced', desc: 'Cross-platform app development' },
  { name: 'Expo', icon: 'https://cdn.simpleicons.org/expo/ffffff', iconComp: Zap, color: '#000000', proficiency: 92, level: 'Expert', desc: 'Universal React applications' },
  { name: 'Android Studio', icon: 'https://icon.icepanel.io/Technology/png-shadow-512/Android-Studio.png', iconComp: Layers, color: '#02569B', proficiency: 75, level: 'Intermediate', desc: 'Multi-platform UI toolkit' },
];

const cloud = [
  // { name: 'AWS', icon: null, iconComp: Cloud, color: '#FF9900', proficiency: 78, level: 'Intermediate', desc: 'Scalable cloud solutions' },
  // { name: 'Google Cloud', icon: null, iconComp: Globe, color: '#4285F4', proficiency: 70, level: 'Intermediate', desc: 'Managed infrastructure' },
  { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel/ffffff', iconComp: Globe, color: '#000000', proficiency: 95, level: 'Expert', desc: 'Deployment & Edge Hosting' },
  { name: 'GitHub Actions', icon: 'https://cdn.simpleicons.org/githubactions/2088FF', iconComp: Workflow, color: '#2088FF', proficiency: 85, level: 'Advanced', desc: 'CI/CD Pipeline Automation' },
];

const design = [
  { name: 'Figma', icon: 'https://icon.icepanel.io/Technology/svg/Figma.svg', iconComp: Layout, color: '#F24E1E', proficiency: 85, level: 'Advanced', desc: 'UI/UX Design' },
  { name: 'Postman', icon: 'https://icon.icepanel.io/Technology/png-shadow-512/Postman.png', iconComp: Terminal, color: '#FF6C37', proficiency: 90, level: 'Advanced', desc: 'API Testing' },
  { name: 'Stitch', icon: null, iconComp: Layers, color: '#5E6AD2', proficiency: 95, level: 'Expert', desc: 'Project management' },
  // { name: 'Spline', icon: null, iconComp: Box, color: '#FF3366', proficiency: 75, level: 'Intermediate', desc: '3D Web Design' },
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

import { Component as MorphingCardStack } from '@/components/ui/morphing-card-stack';

export const TechStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // HEADER REVEAL
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

    // Scroll reveal for the card stack container
    gsap.set('.tech-stack-container', { transformPerspective: 1200 });
    gsap.fromTo('.tech-stack-container',
      {
        opacity: 0,
        y: 100,
        rotateX: -15,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.tech-stack-container',
          start: 'top 85%',
          once: true
        }
      }
    );

  }, { scope: containerRef });

  const categories = [
    { id: '01', title: 'Frontend Architecture', data: frontend, icon: <Layout className="w-5 h-5" />, desc: 'Client side development' },
    { id: '02', title: 'Backend & Systems', data: backend, icon: <Server className="w-5 h-5" />, desc: 'Server side architecture' },
    { id: '03', title: 'Core Foundations', data: core, icon: <Code2 className="w-5 h-5" />, desc: 'Languages & DSA' },
    { id: '04', title: 'Mobile Development', data: mobile, icon: <Smartphone className="w-5 h-5" />, desc: 'Cross platform apps' },
    { id: '05', title: 'Cloud & Infrastructure', data: cloud, icon: <Globe className="w-5 h-5" />, desc: 'Deployment & CI/CD' },
    { id: '06', title: 'Design & Workflow', data: design, icon: <Layers className="w-5 h-5" />, desc: 'Prototyping & testing' },
  ];

  const cards = categories.map((cat) => ({
    id: cat.id,
    title: cat.title,
    description: cat.desc,
    icon: cat.icon,
    content: (
      <div className="flex flex-wrap gap-2.5 mt-3 select-none">
        {cat.data.map((tech, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--text-primary)]/[0.02] border border-[var(--border-primary)]/60 text-xs font-semibold text-[var(--text-primary)] font-jetbrains hover:bg-[var(--text-primary)]/[0.04] hover:border-[var(--accent-primary)]/30 transition-all duration-300">
            {tech.icon ? (
              <img src={tech.icon} alt={tech.name} className="w-5 h-5 object-contain" />
            ) : (
              <tech.iconComp size={18} style={{ color: tech.color }} />
            )}
            <span>{tech.name}</span>
          </div>
        ))}
      </div>
    )
  }));

  return (
    <section ref={containerRef} id="tech" className="relative py-20 px-4 sm:px-6 md:px-12 bg-[var(--bg-primary)] overflow-hidden">
      {/* Subtle Central Glow */}
      <div className="globe-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 blur-[120px] rounded-full pointer-events-none z-0 opacity-40" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 text-center flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[var(--accent-primary)]/60" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--accent-primary)] font-jetbrains">Tech Stack</span>
            <div className="w-8 h-[1px] bg-[var(--accent-primary)]/60" />
          </div>
          <h2 ref={titleRef} className="text-3xl md:text-4xl lg:text-5xl font-playfair font-medium text-[var(--text-primary)] mb-6 flex flex-wrap justify-center gap-[0.2em] max-w-3xl leading-[1.15]">
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

        <div className="tech-stack-container w-full relative min-h-[420px] sm:min-h-[550px]">
          <MorphingCardStack cards={cards} defaultLayout="grid" />
        </div>
      </div>
    </section>
  );
};
