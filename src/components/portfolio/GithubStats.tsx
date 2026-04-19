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
  GitBranch
} from "lucide-react";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { RogueMascot } from "./RogueMascot";
import gsap from "gsap";

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
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.02, ease: "easeOut" }}
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
        
        const rawStats = statsData.data.stats;
        setStats({
          ...rawStats,
          // Use real distribution from backend
          breakdown: rawStats.distribution || { original: 90, forked: 10 },
          // Avatars for followers representation
          avatars: Array(4).fill(rawStats.avatarUrl || "https://github.com/identicons/default.png")
        });
        
        setActivity(activityData.data.events || []);
      } catch (error) {
        console.error("GitHub integration error:", error);
        // Robust fallback if API fails
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
          avatars: Array(4).fill("https://github.com/identicons/jason.png")
        });
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
      gsap.to(indicatorRef.current, { x: activeBtn.offsetLeft, width: activeBtn.offsetWidth, duration: 0.3, ease: "power2.out" });
    }
  }, [activeTab, loading]);

  if (loading) return null;

  return (
    <section id="stats" className="relative w-full py-24 px-6 md:px-12 bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none" style={{ backgroundImage: `radial-gradient(var(--accent-primary) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-10">
           <div className="flex items-center gap-3 mb-4 opacity-30">
              <div className="w-12 h-[1px] bg-[var(--accent-primary)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)]">GitHub // System</span>
           </div>
           <h2 className="text-4xl md:text-6xl font-playfair font-black tracking-tighter uppercase mb-2">
             <SplitText text="GitHub" className="mr-4" />
             <SplitText text="Statistics" className="text-[var(--accent-primary)]" />
           </h2>
        </div>

        <div ref={tabRef} className="relative flex mb-12 p-1.5 bg-[var(--text-primary)]/[0.03] border border-[var(--border-primary)] rounded-lg w-fit">
          <div ref={indicatorRef} className="absolute bottom-0 h-0.5 bg-[var(--accent-primary)] z-0" style={{ width: 0 }} />
          {(["Overview", "Activity", "Insights"] as Tab[]).map((tab) => (
            <button
              key={tab}
              data-tab={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative z-10 px-8 py-3 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)] opacity-40 hover:opacity-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="wait">
            {activeTab === "Overview" && (
              <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-3 space-y-6">
                   <MiniStatCard icon={<Code size={18} />} label="Repos" value={stats?.totalRepos || 0} />
                   <MiniStatCard icon={<Star size={18} />} label="Stars" value={stats?.totalStars || 0} />
                   <div className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--text-primary)]/[0.02] flex flex-col justify-between h-44">
                      <div className="flex items-center justify-between">
                         <Users size={18} className="text-[var(--accent-primary)] opacity-40" />
                         <span className="text-xs font-bold uppercase tracking-widest opacity-30">Followers</span>
                       </div>
                      <div className="text-4xl font-black italic font-playfair leading-none"><CounterValue targetValue={stats?.followers || 0} /></div>
                      <div className="flex -space-x-2 mt-4">
                        {stats?.avatars?.map((a: string, i: number) => <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--bg-primary)] overflow-hidden bg-[var(--text-primary)]/[0.05]" />)}
                      </div>
                   </div>
                </div>
                <div className="lg:col-span-6"><div className="relative h-full border border-[var(--border-primary)] rounded-[2.5rem] overflow-hidden bg-[var(--text-primary)]/[0.01] p-0 shadow-2xl dark:shadow-none"><RogueMascot className="w-full h-full" /></div></div>
                <div className="lg:col-span-3 space-y-6">
                   <MiniStatCard icon={<GitFork size={18} />} label="Commits" value={stats?.contributions || 0} />
                   <MiniStatCard icon={<GitPullRequest size={18} />} label="PRs" value={stats?.pullRequests || 0} />
                   <div className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--text-primary)]/[0.02] h-44 flex flex-col">
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-30">Breakdown</h4>
                      <div className="space-y-4">{stats?.languages?.slice(0, 3).map((l: any, i: number) => <div key={i} className="space-y-1.5"><div className="flex justify-between text-xs font-bold uppercase"><span>{l.name}</span><span className="text-[var(--accent-primary)] opacity-60">{l.percent}%</span></div><div className="h-[2px] bg-[var(--text-primary)]/5 rounded-full overflow-hidden"><motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="h-full origin-left bg-[var(--accent-primary)]" style={{ width: `${l.percent}%` }} /></div></div>)}</div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Activity" && (
              <motion.div key="ac" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="border border-[var(--border-primary)] rounded-2xl p-6 bg-[var(--text-primary)]/[0.02] flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <Calendar size={20} className="text-[var(--accent-primary)] opacity-60" />
                      <div>
                         <h3 className="text-sm font-bold uppercase tracking-tight">Activity Status</h3>
                         <p className="text-xs opacity-60 uppercase tracking-widest">{stats?.contributions || 167} total commits</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      {["2026", "2025", "2024"].map(y => (
                        <span key={y} className="px-3 py-1 rounded border border-[var(--border-primary)] text-xs font-bold opacity-40">{y}</span>
                      ))}
                   </div>
                </div>

                <div className="border border-[var(--border-primary)] rounded-2xl p-10 bg-[var(--text-primary)]/[0.01] h-64 flex flex-col">
                   <div className="flex items-center justify-between mb-10">
                      <h4 className="text-xs font-bold uppercase tracking-widest opacity-30">Trends // Payload</h4>
                      <div className="px-4 py-1 rounded-full border border-[var(--accent-primary)]/20 text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] flex items-center gap-2"><Zap size={10} /> Connected</div>
                   </div>
                   <div className="flex-1 relative">
                      <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" className="overflow-visible">
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 1.5 }}
                          d="M0,80 L300,80 C400,80 500,20 600,20 C700,20 800,80 1000,80"
                          fill="none"
                          stroke="var(--accent-primary)"
                          strokeWidth="2"
                        />
                        <motion.path
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.05 }}
                          d="M0,80 L300,80 C400,80 500,20 600,20 C700,20 800,80 1000,80 V100 H0 Z"
                          fill="var(--accent-primary)"
                        />
                        <circle cx="600" cy="20" r="4" fill="var(--accent-primary)" />
                      </svg>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {activity.map((e, i) => <MiniActivityItem key={i} event={e} index={i} />)}
                </div>
              </motion.div>
            )}

            {activeTab === "Insights" && (
              <motion.div key="in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                   <MicroCard label="Streak" value={`${stats?.streaks?.current || 0}d`} />
                   <MicroCard label="Max" value={`${stats?.streaks?.longest || 0}d`} />
                   <MicroCard label="Peak" value={`${stats?.streaks?.bestDay || 0}c`} />
                </div>
                <div className="border border-[var(--border-primary)] rounded-2xl p-8 bg-[var(--text-primary)]/[0.02]">
                   <h3 className="text-xs font-bold uppercase tracking-widest opacity-30 mb-8">Distribution</h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <div className="flex justify-between text-xs font-bold uppercase">
                            <span className="opacity-40">Original</span>
                            <span className="text-[var(--accent-primary)] font-black">{stats?.breakdown?.original || 0}%</span>
                         </div>
                         <div className="h-[2px] w-full bg-[var(--text-primary)]/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${stats?.breakdown?.original || 0}%` }} transition={{ duration: 0.8 }} className="h-full bg-[var(--accent-primary)]" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-xs font-bold uppercase">
                            <span className="opacity-40">Forked</span>
                            <span className="text-[var(--text-primary)] font-black opacity-80">{stats?.breakdown?.forked || 0}%</span>
                         </div>
                         <div className="h-[2px] w-full bg-[var(--text-primary)]/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${stats?.breakdown?.forked || 0}%` }} transition={{ duration: 0.8 }} className="h-full bg-[var(--text-primary)]/20" />
                         </div>
                      </div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="border border-[var(--border-primary)] rounded-2xl p-6 bg-[var(--text-primary)]/[0.01]">
                      <p className="text-xs font-bold uppercase opacity-30 mb-4">PR_INDEX</p>
                      <div className="h-[2px] w-full bg-[var(--text-primary)]/5" />
                   </div>
                   <div className="border border-[var(--border-primary)] rounded-2xl p-6 bg-[var(--text-primary)]/[0.01]">
                      <p className="text-xs font-bold uppercase opacity-30 mb-4">ISSUE_LOG</p>
                      <div className="h-[2px] w-full bg-[var(--accent-primary)] opacity-40 shadow-[0_0_10px_var(--accent-primary)]" />
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

const MiniStatCard = ({ icon, label, value }: any) => (
  <div className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--text-primary)]/[0.02] flex flex-col justify-between h-44">
    <div className="flex items-center justify-between">
      <div className="text-[var(--accent-primary)] opacity-60">{icon}</div>
      <span className="text-xs font-bold uppercase opacity-30 tracking-widest leading-none">{label}</span>
    </div>
    <div className="text-4xl font-black font-playfair leading-none text-[var(--text-primary)]"><CounterValue targetValue={value} /></div>
  </div>
);

const MicroCard = ({ label, value }: any) => (
  <div className="p-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--text-primary)]/[0.01] text-center">
    <p className="text-xs font-bold uppercase opacity-30 tracking-widest mb-4 leading-none">{label}</p>
    <p className="text-2xl font-black font-playfair text-[var(--text-primary)]">{value}</p>
  </div>
);

const MiniActivityItem = ({ event, index }: any) => (
  <motion.div initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-6 p-5 rounded-xl bg-[var(--text-primary)]/[0.01] border border-[var(--border-primary)] group/activity transition-colors duration-300">
    <div className="p-3 rounded-lg bg-[var(--text-primary)]/5 text-[var(--accent-primary)] opacity-60 shrink-0 group-hover/activity:bg-[var(--accent-primary)]/10 group-hover/activity:opacity-100 transition-all">
      <GitBranch size={16} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-xs uppercase truncate opacity-80 group-hover/activity:text-[var(--accent-primary)] transition-colors text-[var(--text-primary)]">
        {event.repo}
      </h4>
      <p className="text-xs font-medium text-[var(--text-secondary)] opacity-50 mt-1 line-clamp-1">
        {event.summary && event.summary !== 'Activity' ? event.summary : `${event.type} event on GitHub`}
      </p>
    </div>
    <div className="text-xs font-bold uppercase tracking-widest opacity-20 group-hover/activity:opacity-40 transition-opacity text-[var(--text-primary)]">
       {event.type}
    </div>
  </motion.div>
);
