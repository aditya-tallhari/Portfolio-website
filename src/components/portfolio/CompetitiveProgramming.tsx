'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';
import { 
  ArrowUpRight, Trophy, Code2, Zap, Target, 
  ExternalLink, Cpu, Users, Terminal, Activity,
  Layout, Binary, Globe, Award
} from 'lucide-react';
import { useGSAP } from "@gsap/react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchLeetCodeProfile, fetchCodeChefProfile } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

interface PlatformData {
  name: string;
  id: string;
  rating: string;
  ratingValue: number;
  solved: number;
  maxSolved: number;
  streak: string;
  globalRank?: number;
  countryRank?: number;
  maxRank?: number;
  color: string;
  link: string;
  icon: React.ReactNode;
  calendar?: Record<string, number>;
  breakdown?: {
    easy: number;
    medium: number;
    hard: number;
  };
}

const DEFAULT_PLATFORMS: PlatformData[] = [
  {
    name: 'LeetCode',
    id: 'aditya_tallhari_',
    rating: 'Rank',
    ratingValue: 1850,
    solved: 450,
    maxSolved: 3300,
    streak: '120',
    color: '#FFA116',
    link: 'https://leetcode.com/u/aditya_tallhari_/',
    icon: <Code2 size={20} />,
    calendar: {},
    breakdown: { easy: 150, medium: 250, hard: 50 }
  },
  {
    name: 'CodeChef',
    id: 'basic_spark_55',
    rating: '3 Stars',
    ratingValue: 1650,
    solved: 200,
    maxSolved: 1000,
    streak: '45',
    color: '#5B4638',
    link: 'https://www.codechef.com/users/basic_spark_55',
    icon: <Trophy size={20} />
  }
];

export const CompetitiveProgramming = () => {
  const [platforms, setPlatforms] = useState<PlatformData[]>(DEFAULT_PLATFORMS);
  const [activePlatform, setActivePlatform] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [leetcodeRes, codechefRes] = await Promise.allSettled([
          fetchLeetCodeProfile('aditya_tallhari_'),
          fetchCodeChefProfile('basic_spark_55')
        ]);

        console.log('🔄 Data Sync Status:', {
          leetcode: leetcodeRes.status,
          codechef: codechefRes.status
        });

        let leetcodeData = leetcodeRes.status === 'fulfilled' ? leetcodeRes.value.data : null;
        let codechefData = codechefRes.status === 'fulfilled' ? codechefRes.value.data : null;

        if (codechefRes.status === 'rejected') {
          console.error('❌ CodeChef Fetch Error:', codechefRes.reason);
        }

        setPlatforms(prev => prev.map(p => {
          if (p.name === 'LeetCode' && leetcodeData?.leetcode) {
            const data = leetcodeData.leetcode;
            console.log('✅ Mapping LeetCode:', data);
            return {
              ...p,
              ratingValue: data.rating,
              rating: `Rank: ${data.rank}`,
              solved: data.solved.total || 0,
              globalRank: data.rank,
              maxRank: Math.round(data.rating), // For LeetCode, use rating as peak placeholder
              breakdown: {
                easy: data.solved.easy,
                medium: data.solved.medium,
                hard: data.solved.hard
              },
              calendar: data.calendar,
              streak: data.streak?.toString() || '0'
            };
          }
          if (p.name === 'CodeChef' && codechefData?.codechef) {
            const data = codechefData.codechef;
            console.log('✅ Mapping CodeChef:', data);
            return {
              ...p,
              ratingValue: data.rating,
              rating: `${data.stars} Stars`,
              solved: data.solved || 0,
              streak: data.streak?.toString() || '0',
              globalRank: data.globalRank,
              countryRank: data.countryRank,
              maxRank: data.maxRank,
              calendar: {}
            };
          }
          return p;
        }));
      } catch (error) {
        console.error('❌ Error loading coding profiles:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalSolved = platforms.reduce((acc, p) => acc + (p.solved || 0), 0);
  const currentPlatform = platforms[activePlatform];

  return (
    <section id="competitive" ref={containerRef} className="relative z-10 w-full py-24 px-6 md:px-12 bg-[var(--bg-primary)] overflow-hidden">
      {/* Abstract Background Design */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--accent-primary)]/[0.03] blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--accent-primary)]/[0.02] blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{ backgroundImage: 'radial-gradient(var(--text-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Profile Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="p-2 rounded bg-[var(--accent-primary)]/[0.1] border border-[var(--accent-primary)]/20">
                <Terminal size={14} className="text-[var(--accent-primary)]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent-primary)] font-jetbrains">
                Runtime_Identity // Profiles_02
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-playfair font-black tracking-tighter uppercase leading-[0.85]">
              Coding <br />
              <span className="text-[var(--accent-primary)]">Persona</span>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-6xl font-playfair font-black text-[var(--text-primary)]">
                <CounterValue targetValue={totalSolved} />+
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 font-jetbrains">Total Problems</span>
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 font-jetbrains mt-2">
              Aggregated across all platforms
            </div>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar: Platform Selector */}
          <div className="lg:col-span-3 space-y-4">
            {platforms.map((p, idx) => (
              <button
                key={p.name}
                onClick={() => setActivePlatform(idx)}
                className={`w-full group relative p-6 rounded-2xl border transition-all duration-500 flex items-center justify-between overflow-hidden ${
                  activePlatform === idx 
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/[0.03]' 
                    : 'border-[var(--border-primary)] bg-[var(--text-primary)]/[0.01] hover:border-[var(--text-primary)]/20'
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    activePlatform === idx ? 'border-[var(--accent-primary)]/40 bg-[var(--bg-primary)]' : 'border-[var(--border-primary)]'
                  }`} style={{ color: p.color }}>
                    {p.icon}
                  </div>
                  <div className="text-left">
                    <span className={`block text-xs font-black uppercase tracking-widest font-jetbrains ${
                      activePlatform === idx ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]/40 group-hover:text-[var(--text-primary)]/60'
                    }`}>
                      {p.name}
                    </span>
                    <span className="text-[9px] font-bold opacity-30 font-jetbrains uppercase">{p.id}</span>
                  </div>
                </div>
                {activePlatform === idx && (
                  <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                )}
              </button>
            ))}

            {/* Global Quick Stats */}
            <div className="p-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--text-primary)]/[0.01] mt-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 font-jetbrains block mb-6">Global_Metrics</span>
              <div className="space-y-6">
                {/* <div className="flex justify-between items-center">
                  <Activity size={16} className="opacity-30" />
                  <span className="text-xs font-black font-jetbrains text-[var(--text-primary)]">99.8% Efficiency</span>
                </div> */}
                <div className="flex justify-between items-center">
                  <Target size={16} className="opacity-30" />
                  <span className="text-xs font-black font-jetbrains text-[var(--text-primary)]">Top 0.5% Global</span>
                </div>
                {/* <div className="flex justify-between items-center">
                  <Award size={16} className="opacity-30" />
                  <span className="text-xs font-black font-jetbrains text-[var(--text-primary)]">Gold Medalist</span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPlatform.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Platform Hero Card */}
                <div className="md:col-span-2 p-10 rounded-3xl border border-[var(--border-primary)] bg-[var(--text-primary)]/[0.02] backdrop-blur-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-12 group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentPlatform.color }} />
                      <span className="text-[10px] font-black uppercase tracking-widest font-jetbrains opacity-40">System Status: Active</span>
                    </div>
                    <h3 className="text-4xl md:text-6xl font-playfair font-black text-[var(--text-primary)] mb-2">
                      {currentPlatform.name}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-jetbrains text-[var(--accent-primary)] mb-8">
                      Authorized Access: {currentPlatform.id}
                    </p>
                    <a 
                      href={currentPlatform.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/[0.05] transition-all duration-300 group/link"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest font-jetbrains">View Profile</span>
                      <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>

                  <div className="relative z-10 flex flex-col items-start md:items-end">
                    <div className="text-right">
                      <span className="block text-[10px] font-black uppercase tracking-widest opacity-30 font-jetbrains mb-1">Global Rating</span>
                      <span className="text-5xl md:text-7xl font-playfair font-black text-[var(--text-primary)]" style={{ color: currentPlatform.color }}>
                        {currentPlatform.ratingValue}
                      </span>
                    </div>
                    <div className="mt-4 px-4 py-1.5 rounded-full border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[9px] font-black uppercase tracking-widest font-jetbrains opacity-60">
                      {currentPlatform.rating}
                    </div>
                  </div>

                  {/* Large background icon */}
                  <div className="absolute -right-8 -bottom-8 opacity-[0.03] scale-[4] rotate-12 pointer-events-none">
                    {currentPlatform.icon}
                  </div>
                </div>

                {/* Global Standing Card */}
                <div className="p-10 rounded-3xl border border-[var(--border-primary)] bg-[var(--text-primary)]/[0.01] relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-12">
                    <span className="text-[12px] font-black uppercase tracking-widest opacity-40 font-jetbrains">Global Standing</span>
                    <Globe size={20} className="opacity-40 group-hover:rotate-12 transition-transform duration-500" />
                  </div>
                  
                  <div className="space-y-8 relative z-10">
                    {currentPlatform.name === 'LeetCode' ? (
                      /* LeetCode: Problem Mastery View */
                      <>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains block mb-2">Total Solved</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-playfair font-black text-[var(--text-primary)]">
                              <CounterValue targetValue={currentPlatform.solved} />
                            </span>
                            <span className="text-xs font-bold opacity-30 font-jetbrains uppercase">/ {currentPlatform.maxSolved}</span>
                          </div>
                        </div>

                        {currentPlatform.breakdown && (
                          <div className="space-y-4 pt-4 border-t border-[var(--border-primary)]/10">
                            {[
                              { label: 'Easy', val: currentPlatform.breakdown.easy, color: 'text-emerald-500', bg: 'bg-emerald-500' },
                              { label: 'Medium', val: currentPlatform.breakdown.medium, color: 'text-amber-500', bg: 'bg-amber-500' },
                              { label: 'Hard', val: currentPlatform.breakdown.hard, color: 'text-rose-500', bg: 'bg-rose-500' }
                            ].map(item => (
                              <div key={item.label}>
                                <div className="flex justify-between items-end mb-1.5">
                                  <span className={`text-[9px] font-black uppercase tracking-widest ${item.color} font-jetbrains`}>{item.label}</span>
                                  <span className="text-[10px] font-black font-jetbrains text-[var(--text-primary)]">{item.val}</span>
                                </div>
                                <div className="h-[2px] w-full bg-[var(--text-primary)]/[0.05] rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(item.val / currentPlatform.solved) * 100}%` }}
                                    className={`h-full ${item.bg}`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      /* CodeChef: Standing View */
                      <>
                        <div className="mb-8 flex justify-between items-end">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains block mb-2">Global Rank</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-5xl font-playfair font-black text-[var(--text-primary)]">
                                {currentPlatform.globalRank ? `#${currentPlatform.globalRank.toLocaleString()}` : '#- -'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right pb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains block mb-1">Current Rating</span>
                            <span className="text-2xl font-black font-jetbrains text-[var(--text-primary)]">
                              {currentPlatform.ratingValue}
                            </span>
                          </div>
                        </div>

                        {/* <div className="flex gap-12 pt-6 border-t border-[var(--border-primary)]/10">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains block mb-2">Peak Rating</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-playfair font-black text-[var(--text-primary)]">
                                {currentPlatform.maxRank || currentPlatform.ratingValue}
                              </span>
                              <span className="text-[10px] font-bold opacity-30 font-jetbrains uppercase">Max</span>
                            </div>
                          </div>
                          
                          {currentPlatform.countryRank && (
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains block mb-2">Country Rank</span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-playfair font-black text-[var(--text-primary)]">
                                  #{currentPlatform.countryRank.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div> */}

                        <div className="pt-6 border-t border-[var(--border-primary)]/10">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-[var(--text-primary)]/[0.03] flex items-center justify-center border border-[var(--border-primary)]/10">
                              <Trophy size={18} className="text-[var(--text-primary)] opacity-60" />
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains block">Current Tier</span>
                              <span className="text-sm font-black font-jetbrains text-[var(--text-primary)]">
                                {currentPlatform.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Decorative element */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[var(--text-primary)]/[0.01] blur-3xl rounded-full pointer-events-none" />
                </div>

                <div className="p-10 rounded-3xl border border-[var(--border-primary)] bg-[var(--text-primary)]/[0.01] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[12px] font-black uppercase tracking-widest opacity-40 font-jetbrains">
                        {currentPlatform.name === 'LeetCode' ? 'Annual Activity' : 'Activity Insight'}
                      </span>
                      {currentPlatform.name === 'LeetCode' ? <Globe size={20} className="opacity-40" /> : <Activity size={20} className="opacity-40" />}
                    </div>
                    
                    {currentPlatform.name === 'LeetCode' ? (
                      <div className="space-y-8">
                        <div className="relative">
                          {/* Heatmap Grid - Enhanced Visibility */}
                          <div className="flex gap-[3px] md:gap-[4px] overflow-hidden">
                            {Array.from({ length: 28 }).map((_, weekIndex) => (
                              <div key={weekIndex} className="flex-1 flex flex-col gap-[3px] md:gap-[4px]">
                                {Array.from({ length: 7 }).map((_, dayIndex) => {
                                  const totalDays = weekIndex * 7 + dayIndex;
                                  const date = new Date();
                                  date.setHours(0, 0, 0, 0);
                                  date.setDate(date.getDate() - (195 - totalDays));
                                  
                                  const dayStart = Math.floor(date.getTime() / 1000);
                                  const dayEnd = dayStart + 86400;
                                  
                                  let intensity = 0;
                                  if (currentPlatform.calendar) {
                                    const match = Object.keys(currentPlatform.calendar).find(k => {
                                      const ts = parseInt(k);
                                      return ts >= dayStart && ts < dayEnd;
                                    });
                                    if (match) intensity = currentPlatform.calendar[match];
                                  }

                                  // Improved Visibility Logic
                                  const isActive = intensity > 0;
                                  const bgColor = isActive ? '#22c55e' : 'rgba(255,255,255,0.1)';
                                  const opacity = isActive ? 0.3 + (Math.min(intensity, 8) * 0.1) : 0.4;

                                  return (
                                    <div 
                                      key={dayIndex}
                                      className="aspect-square w-full rounded-[1px] md:rounded-[2px] transition-all duration-300 hover:scale-125 hover:z-10 cursor-help"
                                      style={{ 
                                        backgroundColor: bgColor, 
                                        opacity: opacity,
                                        border: isActive ? 'none' : '1px solid rgba(255,255,255,0.05)'
                                      }}
                                      title={`${date.toLocaleDateString('en-US')}: ${intensity} submissions`}
                                    />
                                  );
                                })}
                              </div>
                            ))}
                          </div>

                          {/* Month Labels */}
                          <div className="flex justify-between px-2 text-[8px] font-black uppercase tracking-widest opacity-30 font-jetbrains mt-6">
                            <span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-end border-t border-[var(--border-primary)]/20 pt-6">
                          <div>
                            <span className="block text-[8px] font-bold uppercase tracking-widest opacity-30 font-jetbrains mb-1">Max Streak</span>
                            <span className="text-3xl font-playfair font-black text-[var(--text-primary)]">
                              {currentPlatform.streak} Days
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[8px] font-bold uppercase tracking-widest opacity-30 font-jetbrains mb-1">Performance Index</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-jetbrains font-black text-[var(--accent-primary)]">TOP 4.2%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-12">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-bold uppercase tracking-widest opacity-30 font-jetbrains">Longest Active Streak</span>
                          <span className="text-4xl font-playfair font-black text-[var(--text-primary)]">
                            {currentPlatform.streak} Days
                          </span>
                        </div>

                        <div className="pt-8 border-t border-[var(--border-primary)]/30">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30 font-jetbrains">Algorithm efficiency</span>
                            <span className="text-[10px] font-black font-jetbrains text-[var(--accent-primary)]">92.4%</span>
                          </div>
                          <div className="flex gap-1">
                            {Array.from({ length: 24 }).map((_, i) => (
                              <div 
                                key={i} 
                                className="flex-1 h-8 rounded-sm bg-[var(--accent-primary)]" 
                                style={{ opacity: 0.1 + (Math.random() * 0.4) }} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Global Footer Decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-24 pt-8 border-t border-[var(--border-primary)] opacity-40 flex flex-wrap items-center justify-center gap-12 md:gap-24"
        >
          <Metric label="Algorithms" value="640+" />
          <Metric label="Top Rank" value="Global 540" />
          <Metric label="Language" value="Java" />
          <Metric label="System" value="O(log n) Ready" />
        </motion.div>
      </div>
    </section>
  );
};

const CounterValue = ({ targetValue }: { targetValue: number }) => {
  const { elementRef, count } = useCounterAnimation(targetValue);
  return <span ref={elementRef as any}>{count}</span>;
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-[9px] font-black uppercase tracking-widest font-jetbrains">{label}</span>
    <span className="text-xs font-black font-jetbrains text-[var(--text-primary)]">{value}</span>
  </div>
);
