"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  fetchGithubStats, 
  fetchGithubActivity 
} from "@/lib/api";
import { 
  Code, 
  Star, 
  GitPullRequest, 
  Users, 
  GitFork,
  Zap,
  Calendar,
  CircleDot,
  GitBranch,
  ArrowUpRight
} from "lucide-react";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { RogueMascot } from "./RogueMascot";
import gsap from "gsap";
import { cn } from "@/lib/utils";

type Tab = "Overview" | "Activity" | "Insights";

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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.03, ease: "easeOut" }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export const GithubStats = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tabRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, activityData] = await Promise.all([
          fetchGithubStats(),
          fetchGithubActivity()
        ]);
        
        const rawStats = statsData?.data?.stats;
        if (!rawStats) throw new Error("No stats payload found in response");

        setStats({
          ...rawStats,
          breakdown: rawStats.distribution || { original: 90, forked: 10 }
        });
        
        const events = activityData?.data?.events || [];
        setActivity(events);
      } catch (error) {
        console.warn("GitHub integration error. Using offline fallback.", error instanceof Error ? error.message : "");
        setStats({
          totalRepos: 0,
          totalStars: 0,
          contributions: 0,
          pullRequests: 0,
          followers: 0,
          streaks: { current: 0, longest: 0, bestDay: 0 },
          breakdown: { original: 100, forked: 0 },
          languages: [
            { name: "TypeScript", percent: 0 }
          ],
          contributionHistory: []
        });
        setActivity([
          { type: "PushEvent", repo: "aditya/portfolio", summary: "Offline fallback data" },
          { type: "CreateEvent", repo: "aditya/backend", summary: "Backend unreachable" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!indicatorRef.current || !tabRef.current) return;
    const activeBtn = tabRef.current.querySelector(`button[data-tab="${activeTab}"]`) as HTMLButtonElement;
    if (activeBtn) {
      gsap.to(indicatorRef.current, { x: activeBtn.offsetLeft, width: activeBtn.offsetWidth, duration: 0.4, ease: "power3.out" });
    }
  }, [activeTab, loading]);

  if (loading) return null;

  return (
    <section id="stats" className="relative z-50 w-full py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors duration-500">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(var(--accent-primary) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 blur-[120px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div>
             <div className="flex items-center gap-3 mb-4 opacity-40">
                <div className="w-16 h-[1px] bg-[var(--text-primary)]" />
                <span className="text-[10px] font-jetbrains font-bold uppercase tracking-[0.3em] text-[var(--text-primary)]">Open Source // Metrics</span>
             </div>
             <h2 className="text-4xl sm:text-5xl md:text-7xl font-playfair font-black tracking-tighter uppercase mb-2 leading-none">
                <SplitText text="GitHub" className="mr-3 md:mr-5" />
                <span className="text-[var(--accent-primary)]">
                  <SplitText text="Insights" />
                </span>
             </h2>
           </div>

          {/* Tab Navigation */}
          <div ref={tabRef} className="relative flex p-1.5 bg-[var(--bg-secondary)] border border-[var(--border-primary)]/50 backdrop-blur-md rounded-xl w-full sm:w-fit overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide shadow-xl">
            <div ref={indicatorRef} className="absolute bottom-1.5 top-1.5 rounded-lg bg-[var(--accent-primary)] z-0 shadow-[0_0_15px_var(--accent-primary)]/20" style={{ width: 0 }} />
            {(["Overview", "Activity", "Insights"] as Tab[]).map((tab) => (
              <button
                key={tab}
                data-tab={tab}
                onClick={() => setActiveTab(tab)}
                className={`snap-center relative z-10 px-6 sm:px-8 py-3 rounded-lg text-[10px] sm:text-[11px] font-jetbrains font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                  activeTab === tab ? "text-white" : "text-[var(--text-primary)] opacity-50 hover:opacity-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="wait">
            {activeTab === "Overview" && (
              <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Mobile: 2-col stat grid, Desktop: left sidebar */}
                <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-6">
                   <MiniStatCard icon={<Code size={20} />} label="Repositories" value={stats?.totalRepos || 0} />
                   <MiniStatCard icon={<Star size={20} />} label="Stars Earned" value={stats?.totalStars || 0} />
                   
                   <div className="col-span-2 lg:col-span-1 p-6 sm:p-8 rounded-3xl border border-[var(--border-primary)]/60 bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/5 flex flex-col justify-between h-auto lg:h-48 group transition-all duration-500 relative overflow-hidden">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-primary)]/0 via-[var(--accent-primary)]/5 to-[var(--accent-primary)]/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                           <div className="p-3 rounded-xl bg-[var(--text-primary)]/5 group-hover:bg-[var(--accent-primary)]/10 text-[var(--text-primary)] opacity-50 group-hover:text-[var(--accent-primary)] group-hover:opacity-100 transition-all duration-500">
                             <Users size={20} />
                           </div>
                           <span className="text-[9px] sm:text-[10px] font-jetbrains font-bold uppercase tracking-[0.2em] opacity-40">Followers</span>
                         </div>
                        <div className="text-4xl sm:text-5xl font-black font-playfair leading-none group-hover:scale-105 origin-left transition-transform duration-500">
                          <CounterValue targetValue={stats?.followers || 0} />
                        </div>
                      </div>
                   </div>
                </div>

                {/* Mascot / Hero Stat */}
                <div className="lg:col-span-6">
                  <div className="relative h-48 sm:h-80 lg:h-full border border-[var(--border-primary)]/60 rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)] p-0 shadow-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <RogueMascot className="w-full h-full transform group-hover:scale-[1.02] transition-transform duration-700" />
                  </div>
                </div>

                {/* Mobile: 2-col stat grid, Desktop: right sidebar */}
                <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-6">
                   <MiniStatCard icon={<GitBranch size={20} />} label="Total Commits" value={stats?.contributions || 0} />
                   <MiniStatCard icon={<GitPullRequest size={20} />} label="Pull Requests" value={stats?.pullRequests || 0} />
                   
                   <div className="col-span-2 lg:col-span-1 p-6 sm:p-8 rounded-3xl border border-[var(--border-primary)]/60 bg-[var(--bg-secondary)] h-auto lg:h-48 flex flex-col group hover:border-[var(--accent-primary)]/30 transition-all duration-500">
                      <h4 className="text-[9px] sm:text-[10px] font-jetbrains font-bold uppercase tracking-[0.2em] mb-6 opacity-40">Language Breakdown</h4>
                      <div className="space-y-4 flex-1 justify-center flex flex-col">
                        {stats?.languages?.slice(0, 3).map((l: any, i: number) => (
                          <div key={i} className="space-y-2 group/lang">
                            <div className="flex justify-between text-[10px] sm:text-xs font-jetbrains font-bold uppercase tracking-wide">
                              <span className="opacity-70 group-hover/lang:opacity-100 transition-opacity">{l.name}</span>
                              <span className="text-[var(--accent-primary)] opacity-80">{l.percent}%</span>
                            </div>
                            <div className="h-[3px] bg-[var(--text-primary)]/10 rounded-full overflow-hidden">
                              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2 + (i * 0.1), duration: 0.8, ease: "easeOut" }} className="h-full origin-left bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]/50" style={{ width: `${parseFloat(l.percent) || 0}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Activity" && (
              <motion.div key="ac" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="space-y-6">
                
                {/* Header Row */}
                <div className="border border-[var(--border-primary)]/60 rounded-3xl p-5 sm:p-8 bg-[var(--bg-secondary)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
                   <div className="flex items-center gap-5">
                      <div className="p-4 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                        <Calendar size={24} />
                      </div>
                      <div>
                         <h3 className="text-sm sm:text-base font-bold font-playfair uppercase tracking-wide">Activity Status</h3>
                         <p className="text-[10px] sm:text-[11px] opacity-50 font-jetbrains uppercase tracking-[0.2em] mt-1">{stats?.contributions || 167} total commits</p>
                      </div>
                   </div>
                   <div className="flex gap-2 flex-wrap">
                      {["2026", "2025", "2024"].map((y, i) => (
                        <span key={y} className={cn("px-4 py-2 rounded-xl border text-[10px] sm:text-xs font-jetbrains font-bold transition-all", i === 0 ? "border-[var(--accent-primary)]/50 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]" : "border-[var(--border-primary)] text-[var(--text-primary)] opacity-40 hover:opacity-100")}>{y}</span>
                      ))}
                   </div>
                </div>

                {/* Graph Area */}
                <div className="border border-[var(--border-primary)]/60 rounded-3xl p-6 sm:p-8 md:p-12 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)] flex-1 flex flex-col min-h-[300px] shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/5 blur-[80px] rounded-full pointer-events-none" />
                   
                   <div className="flex items-center justify-between mb-12 relative z-10">
                      <h4 className="text-[10px] font-jetbrains font-bold uppercase tracking-[0.3em] opacity-40">Activity // Pulse</h4>
                      <div className="px-4 py-1.5 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 text-[10px] font-jetbrains font-bold uppercase tracking-widest text-[var(--accent-primary)] flex items-center gap-2 backdrop-blur-sm shadow-[0_0_15px_var(--accent-primary)]/10">
                        <motion.div 
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]" 
                        />
                        Real-time Data
                      </div>
                   </div>

                   <div className="flex-1 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide relative z-10" style={{ WebkitOverflowScrolling: 'touch' }}>
                      {stats?.contributionHistory && stats.contributionHistory.length > 0 ? (
                         <div className="w-full py-6">
                            {/* Month Labels */}
                            <div className="relative h-6 mb-4 ml-[46px] w-full">
                               {(() => {
                                 const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                 const history = stats.contributionHistory || [];
                                 const weekMarkers: { month: string; weekIndex: number }[] = [];
                                 
                                 for (let i = 0; i < history.length; i += 7) {
                                   if (!history[i]) continue;
                                   const date = new Date(history[i].date);
                                   const monthLabel = months[date.getMonth()];
                                   
                                   if (weekMarkers.length === 0 || weekMarkers[weekMarkers.length - 1].month !== monthLabel) {
                                     weekMarkers.push({ month: monthLabel, weekIndex: i / 7 });
                                   }
                                 }
                                 
                                 return weekMarkers.map((m, idx) => (
                                   <div 
                                     key={idx} 
                                     className="absolute text-[10px] font-jetbrains font-medium text-[var(--text-secondary)] opacity-60 whitespace-nowrap"
                                     style={{ left: `calc(${m.weekIndex} * (100% / 52.5))` }}
                                   >
                                     {m.month}
                                   </div>
                                 ));
                               })()}
                            </div>

                            <div className="flex gap-5">
                               {/* Day Labels */}
                               <div className="flex flex-col justify-between py-1 text-[10px] font-jetbrains text-[var(--text-secondary)] opacity-60 w-[36px] shrink-0 text-right pr-3">
                                  <span className="h-[18px]"></span>
                                  <span className="h-[18px]">Mon</span>
                                  <span className="h-[18px]"></span>
                                  <span className="h-[18px]">Wed</span>
                                  <span className="h-[18px]"></span>
                                  <span className="h-[18px]">Fri</span>
                                  <span className="h-[18px]"></span>
                               </div>

                               <div className="flex flex-1 justify-between gap-[5px]">
                                 {(() => {
                                   const history = stats.contributionHistory;
                                   const weeks = [];
                                   for (let i = 0; i < history.length; i += 7) {
                                     weeks.push(history.slice(i, i + 7));
                                   }
                                   
                                   const displayWeeks = weeks.slice(-52);
                                   
                                   return displayWeeks.map((week, wIdx) => (
                                     <div key={wIdx} className="snap-center flex flex-col gap-[5px] flex-1">
                                       {week.map((day: any, dIdx: number) => {
                                         // Premium Dark Theme Graph Colors
                                         let bg = "var(--text-primary)";
                                         let opacity = 0.05;
                                         if (day.count > 0) { bg = "var(--accent-primary)"; opacity = 0.2; }
                                         if (day.count > 3) { bg = "var(--accent-primary)"; opacity = 0.4; }
                                         if (day.count > 6) { bg = "var(--accent-primary)"; opacity = 0.7; }
                                         if (day.count > 10) { bg = "var(--accent-primary)"; opacity = 1; }
                                         
                                         return (
                                           <div
                                             key={dIdx}
                                             className="aspect-square w-full min-h-[14px] rounded-[4px] cursor-pointer group relative hover:scale-125 hover:z-50 transition-all duration-300"
                                             style={{ backgroundColor: bg, opacity: day.count === 0 ? 0.05 : opacity, boxShadow: day.count > 10 ? `0 0 10px ${bg}80` : 'none' }}
                                           >
                                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-3 bg-[#111] backdrop-blur-xl border border-white/10 text-white text-[11px] font-jetbrains font-bold rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[100] transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                               <span className="text-[var(--accent-primary)]">{day.count}</span> contributions on {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                               <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white/10" />
                                             </div>
                                           </div>
                                         );
                                       })}
                                     </div>
                                   ));
                                 })()}
                               </div>
                            </div>
                            
                            {/* Legend */}
                            <div className="flex items-center justify-end gap-3 mt-10 mr-4 font-jetbrains">
                               <span className="text-[10px] text-[var(--text-secondary)] opacity-50 uppercase tracking-widest">Less</span>
                               <div className="flex gap-[6px]">
                                  {[0.05, 0.2, 0.4, 0.7, 1].map((op, i) => (
                                     <div key={i} className="w-[14px] h-[14px] rounded-[3px]" style={{ backgroundColor: i === 0 ? 'var(--text-primary)' : 'var(--accent-primary)', opacity: op }} />
                                  ))}
                               </div>
                               <span className="text-[10px] text-[var(--text-secondary)] opacity-50 uppercase tracking-widest">More</span>
                            </div>
                         </div>
                      ) : (
                        <div className="w-full h-64 flex items-center justify-center border border-[var(--border-primary)]/50 rounded-2xl bg-[var(--text-primary)]/[0.02]">
                           <span className="text-[10px] font-jetbrains uppercase tracking-widest font-bold text-[var(--text-primary)] opacity-40 animate-pulse">Syncing contribution history...</span>
                        </div>
                      )}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {activity.slice(0, 6).map((e, i) => <MiniActivityItem key={i} event={e} index={i} />)}
                </div>
              </motion.div>
            )}

            {activeTab === "Insights" && (
              <motion.div key="in" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <MicroCard label="Current Streak" value={`${stats?.streaks?.current || 0} Days`} icon={<Zap size={18} />} />
                   <MicroCard label="Longest Streak" value={`${stats?.streaks?.longest || 0} Days`} icon={<TrophyIcon />} />
                   <MicroCard label="Peak Day" value={`${stats?.streaks?.bestDay || 0} Commits`} icon={<Star size={18} />} />
                </div>

                <div className="border border-[var(--border-primary)]/60 rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] shadow-lg relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/5 blur-[80px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                   
                   <h3 className="text-[10px] sm:text-xs font-jetbrains font-bold uppercase tracking-[0.3em] opacity-40 mb-10">Repository Distribution</h3>
                   <div className="space-y-8 relative z-10">
                      <div className="space-y-3">
                         <div className="flex justify-between text-xs sm:text-sm font-jetbrains font-bold uppercase tracking-wide">
                            <span className="opacity-60">Original Work</span>
                            <span className="text-[var(--accent-primary)] font-black text-xl sm:text-2xl font-playfair">{stats?.breakdown?.original || 0}%</span>
                         </div>
                         <div className="h-[4px] w-full bg-[var(--text-primary)]/10 rounded-full overflow-hidden shadow-inner">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${stats?.breakdown?.original || 0}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-[var(--accent-primary)] shadow-[0_0_15px_var(--accent-primary)]" />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between text-xs sm:text-sm font-jetbrains font-bold uppercase tracking-wide">
                            <span className="opacity-60">Forked Contributions</span>
                            <span className="text-[var(--text-primary)] font-black opacity-80 text-xl sm:text-2xl font-playfair">{stats?.breakdown?.forked || 0}%</span>
                         </div>
                         <div className="h-[4px] w-full bg-[var(--text-primary)]/10 rounded-full overflow-hidden shadow-inner">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${stats?.breakdown?.forked || 0}%` }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} className="h-full bg-[var(--text-primary)]/30" />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="border border-[var(--border-primary)]/60 rounded-3xl p-8 bg-[var(--bg-secondary)] flex flex-col justify-between group hover:border-[var(--accent-primary)]/30 transition-colors">
                      <div>
                        <p className="text-[10px] font-jetbrains font-bold uppercase tracking-[0.2em] opacity-40 mb-2">System Status</p>
                        <h4 className="text-xl font-playfair font-black">All Systems Operational</h4>
                      </div>
                      <div className="mt-8 flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-40"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent-primary)]"></span>
                        </span>
                        <span className="text-xs font-jetbrains font-bold uppercase tracking-widest text-[var(--accent-primary)]">API Connected</span>
                      </div>
                   </div>
                   <div className="border border-[var(--border-primary)]/60 rounded-3xl p-8 bg-[var(--bg-secondary)] flex flex-col justify-between group hover:border-[var(--text-primary)]/20 transition-colors">
                      <div>
                        <p className="text-[10px] font-jetbrains font-bold uppercase tracking-[0.2em] opacity-40 mb-2">Network Hub</p>
                        <h4 className="text-xl font-playfair font-black">Global Data Sync</h4>
                      </div>
                      <div className="mt-8 h-[2px] w-full bg-[var(--text-primary)]/10 overflow-hidden rounded-full">
                        <motion.div 
                          animate={{ x: ["-100%", "200%"] }} 
                          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                          className="h-full w-1/3 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent" 
                        />
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// Sub-components

const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const MiniStatCard = ({ icon, label, value }: any) => (
  <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-primary)]/60 bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)]/5 hover:border-[var(--accent-primary)]/30 flex flex-col justify-between h-36 sm:h-48 group transition-all duration-500 hover:-translate-y-1 hover:shadow-xl cursor-default relative overflow-hidden">
    <div className="absolute -inset-1 bg-gradient-to-br from-[var(--accent-primary)]/0 via-[var(--accent-primary)]/5 to-[var(--accent-primary)]/0 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
    
    <div className="relative z-10 flex items-center justify-between">
      <div className="p-3 rounded-xl bg-[var(--text-primary)]/5 group-hover:bg-[var(--accent-primary)]/10 text-[var(--text-primary)] opacity-50 group-hover:text-[var(--accent-primary)] group-hover:opacity-100 transition-all duration-500">
        {icon}
      </div>
      <span className="text-[9px] sm:text-[10px] font-jetbrains font-bold uppercase opacity-40 tracking-[0.2em] leading-none text-right">{label}</span>
    </div>
    <div className="relative z-10 text-3xl sm:text-5xl font-black font-playfair leading-none text-[var(--text-primary)] group-hover:scale-105 origin-left transition-transform duration-500">
      <CounterValue targetValue={value} />
    </div>
  </div>
);

const MicroCard = ({ label, value, icon }: any) => (
  <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-primary)]/60 bg-[var(--bg-secondary)] text-left hover:border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/5 transition-all duration-500 group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:text-[var(--accent-primary)] transition-all duration-500">
      {icon}
    </div>
    <p className="text-[9px] sm:text-[10px] font-jetbrains font-bold uppercase opacity-40 tracking-[0.2em] mb-4 leading-none">{label}</p>
    <p className="text-2xl sm:text-3xl font-black font-playfair text-[var(--text-primary)] group-hover:translate-x-1 transition-transform duration-500">{value}</p>
  </div>
);

const MiniActivityItem = ({ event, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: index * 0.05, duration: 0.4 }} 
    className="flex items-center gap-5 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]/60 group hover:border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/5 transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-md"
  >
    <div className="p-3.5 rounded-xl bg-[var(--text-primary)]/5 text-[var(--text-primary)] opacity-40 shrink-0 group-hover:bg-[var(--accent-primary)]/10 group-hover:text-[var(--accent-primary)] group-hover:opacity-100 transition-all duration-300">
      <GitBranch size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-jetbrains font-bold text-[10px] sm:text-xs uppercase tracking-wide truncate opacity-80 group-hover:text-[var(--accent-primary)] transition-colors text-[var(--text-primary)]">
        {event.repo}
      </h4>
      <p className="text-xs font-medium text-[var(--text-secondary)] opacity-60 mt-1.5 line-clamp-1 font-sans">
        {event.summary && event.summary !== 'Activity' ? event.summary : `${event.type} event on GitHub`}
      </p>
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="text-[9px] font-jetbrains font-bold uppercase tracking-widest opacity-30 group-hover:opacity-60 transition-opacity text-[var(--text-primary)]">
         {event.type.replace('Event', '')}
      </div>
      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 text-[var(--accent-primary)] -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
    </div>
  </motion.div>
);
