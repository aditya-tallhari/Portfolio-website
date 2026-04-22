'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';
import { ArrowUpRight, Trophy, Code2, Zap, Target, ExternalLink, Cpu } from 'lucide-react';

const platforms = [
  {
    name: 'LeetCode',
    id: 'aditya_lc',
    rating: 'Knight',
    ratingValue: '1850',
    solved: 850,
    maxSolved: 2000,
    streak: '150+',
    color: '#FFA116',
    link: 'https://leetcode.com/u/aditya_lc/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.834-.645s1.366.195 1.833.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.9-.535-.535-1.386-.553-1.899-.039l-4.204 4.282c-.931.93-1.42 2.158-1.42 3.475 0 1.316.51 2.545 1.442 3.475l4.317 4.363c.96.96 2.221 1.474 3.559 1.474s2.616-.514 3.559-1.474l2.609-2.636c.514-.516.498-1.367-.037-1.901-.536-.535-1.387-.553-1.9-.039l-.001.002z"/>
      </svg>
    )
  },
  {
    name: 'CodeChef',
    id: 'aditya_cc',
    rating: '5 Star',
    ratingValue: '2023',
    solved: 400,
    maxSolved: 2000,
    streak: '50+',
    color: '#5B4638',
    link: 'https://www.codechef.com/users/aditya_cc',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12.004 0C5.378 0 0 5.378 0 12c0 6.621 5.378 12 12.004 12 6.621 0 12-5.378 12-12C24.004 5.378 18.625 0 12.004 0zM17.472 8.423l-3.328 5.751h3.336v2.179H6.52v-2.18h3.337l-3.329-5.75H8.71l2.127 3.659L12.96 8.423h4.512z"/>
      </svg>
    )
  },
  {
    name: 'HackerRank',
    id: 'aditya_hr',
    rating: 'Gold Badge',
    ratingValue: 'Top 1%',
    solved: 650,
    maxSolved: 1000,
    streak: '30+',
    color: '#00EA64',
    link: 'https://www.hackerrank.com/aditya_hr',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12.001 0a2.316 2.316 0 0 0-2.316 2.316 2.316 2.316 0 0 0 1.258 2.052v3.666l-5.696 3.288V7.525a2.315 2.315 0 0 0 1.053-1.94 2.315 2.315 0 0 0-2.316-2.316A2.316 2.316 0 0 0 1.669 5.585a2.315 2.315 0 0 0 1.053 1.94v7.712a2.315 2.315 0 0 0-1.053 1.94 2.316 2.316 0 0 0 2.315 2.316 2.316 2.316 0 0 0 2.316-2.316 2.313 2.313 0 0 0-1.053-1.94v-3.797l5.696-3.288v3.916a2.315 2.315 0 0 0-1.258 2.052 2.316 2.316 0 0 0 2.316 2.316 2.316 2.316 0 0 0 2.316-2.316 2.315 2.315 0 0 0-1.258-2.052v-3.916l5.695 3.288v3.916l5.695 3.288v3.797a2.313 2.313 0 0 0-1.052 1.94 2.316 2.316 0 0 0 2.316 2.316 2.316 2.316 0 0 0 2.315-2.316 2.315 2.315 0 0 0-1.052-1.94V7.525a2.315 2.315 0 0 0 1.052-1.94A2.316 2.316 0 0 0 20.016 3.27a2.316 2.316 0 0 0-2.315 2.316 2.315 2.315 0 0 0 1.052 1.94v3.797l-5.695-3.288V4.368A2.316 2.316 0 0 0 14.317 2.316 2.316 2.316 0 0 0 12.001 0z"/>
      </svg>
    )
  }
];

const CounterValue = ({ targetValue }: { targetValue: number }) => {
  const { elementRef, count } = useCounterAnimation(targetValue);
  return <span ref={elementRef as any}>{count}</span>;
};

const SplitText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export const CompetitiveProgramming = () => {
  return (
    <section id="competitive" className="relative z-10 w-full py-32 px-6 md:px-12 bg-[var(--bg-primary)] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="cp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#cp-grid)" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-16 h-[2px] bg-[var(--accent-primary)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent-primary)] font-jetbrains">Computational Logic // System_02</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-8xl font-playfair font-black tracking-tighter uppercase leading-[0.85] mb-8">
            <SplitText text="Coding" className="block text-[var(--text-primary)]" />
            <SplitText text="Profiles" className="block text-[var(--accent-primary)] italic" />
          </h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl text-sm md:text-base text-[var(--text-primary)] opacity-40 leading-relaxed font-jetbrains"
          >
            {/* Solving complex computational problems through optimized logic, data structures, and efficient algorithms across various competitive platforms. */}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {platforms.map((platform, i) => (
            <PlatformCard key={platform.name} platform={platform} index={i} />
          ))}
        </div>
        
        {/* Decorative metric footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 flex flex-wrap items-center justify-between gap-8 pt-8 border-t border-[var(--border-primary)] opacity-20"
        >
          <div className="flex items-center gap-2 font-jetbrains text-[9px] uppercase tracking-widest font-bold">
            <Cpu size={12} /> Runtime Complexity: O(log n)
          </div>
          <div className="flex items-center gap-2 font-jetbrains text-[9px] uppercase tracking-widest font-bold">
            <Code2 size={12} /> Total Problems: 1900+
          </div>
          <div className="flex items-center gap-2 font-jetbrains text-[9px] uppercase tracking-widest font-bold">
            <Target size={12} /> Global Percentile: Top 0.5%
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const PlatformCard = ({ platform, index }: { platform: typeof platforms[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        delay: index * 0.15, 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="group relative flex flex-col min-h-[440px]"
    >
      <div className="flex-1 p-10 rounded-[2rem] border border-[var(--border-primary)] bg-[var(--text-primary)]/[0.02] backdrop-blur-sm flex flex-col justify-between group-hover:border-[var(--accent-primary)]/20 transition-all duration-500 overflow-hidden relative">
        {/* Content */}
        <div className="relative z-10 space-y-12">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center border border-[var(--border-primary)] bg-[var(--bg-primary)] group-hover:scale-110 transition-transform duration-500"
                style={{ color: platform.color }}
              >
                {platform.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-primary)] font-jetbrains">{platform.name}</h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] w-fit">
                   <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: platform.color }} />
                   <span className="text-[9px] font-bold text-[var(--text-primary)] opacity-40 uppercase tracking-widest font-jetbrains">{platform.id}</span>
                </div>
              </div>
            </div>
            <a 
              href={platform.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-primary)] opacity-20 group-hover:opacity-100 group-hover:text-[var(--accent-primary)] group-hover:border-[var(--accent-primary)]/40 transition-all duration-300 bg-[var(--bg-primary)]"
            >
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="space-y-8">
            <StatLine icon={<Trophy size={16} />} label="Platform Rating" value={platform.ratingValue} sub={platform.rating} />
            <StatLine 
              icon={<Code2 size={16} />} 
              label="Problems Mastered" 
              value={<CounterValue targetValue={platform.solved} />} 
              unit={`/ ${platform.maxSolved}`}
            />
            <StatLine icon={<Zap size={16} />} label="Peak Consistency" value={platform.streak} />
          </div>
        </div>

        {/* Progress System */}
        <div className="relative z-10 mt-12">
          <div className="flex justify-between items-end mb-4">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-primary)] opacity-20 font-jetbrains">Progress_Index</span>
             <span className="text-xs font-black font-jetbrains text-[var(--accent-primary)]">{Math.round((platform.solved / platform.maxSolved) * 100)}%</span>
          </div>
          <div className="h-[2px] w-full bg-[var(--border-primary)] relative overflow-hidden rounded-full">
             <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${(platform.solved / platform.maxSolved) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="absolute top-0 left-0 h-full"
              style={{ backgroundColor: platform.color }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatLine = ({ icon, label, value, sub, unit }: { icon: any, label: string, value: any, sub?: string, unit?: string }) => (
  <div className="flex items-center justify-between group/stat">
    <div className="flex items-center gap-4">
      <div className="opacity-30 text-[var(--text-primary)] group-hover/stat:opacity-100 group-hover/stat:text-[var(--accent-primary)] transition-all duration-300 scale-90 group-hover/stat:scale-100">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 group-hover/stat:opacity-50 transition-all font-jetbrains">{label}</span>
    </div>
    <div className="flex flex-col items-end">
      <div className="text-2xl font-black font-playfair italic leading-none text-[var(--text-primary)] group-hover/stat:text-[var(--accent-primary)] transition-colors">
        {value}
        {unit && <span className="ml-2 text-xs opacity-20 font-jetbrains not-italic font-bold">{unit}</span>}
      </div>
      {sub && <span className="text-[9px] font-jetbrains font-bold uppercase opacity-30 mt-1 tracking-tighter">{sub}</span>}
    </div>
  </div>
);
