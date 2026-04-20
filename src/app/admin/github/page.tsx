'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Star, GitFork, Users, Activity, GitBranch, RefreshCw, Clock } from 'lucide-react';

import { Toast, ToastContainer, createToastHelpers } from '../components/Toast';
import { fetchGithubStats, fetchGithubActivity } from '@/lib/api';

interface StatPill {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color?: string;
}

const StatPill = ({ icon, label, value, color = 'var(--accent-primary)' }: StatPill) => (
  <div className="flex flex-col items-center p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:-translate-y-1 transition-all duration-300 group">
    <div className="p-3 rounded-xl mb-4" style={{ background: `color-mix(in srgb, ${color} 10%, transparent)` }}>
      <div style={{ color }}>{icon}</div>
    </div>
    <div className="text-3xl font-black font-playfair" style={{ color }}>{value}</div>
    <p className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] opacity-50 mt-2 font-jetbrains">{label}</p>
  </div>
);

export default function GithubAdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = createToastHelpers(setToasts);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const [s, a] = await Promise.allSettled([fetchGithubStats(), fetchGithubActivity()]);
      if (s.status === 'fulfilled') setStats(s.value?.data?.stats || null);
      if (a.status === 'fulfilled') setActivity(a.value?.data?.events || []);
      setLastUpdated(new Date());
    } catch {
      toast.error('Failed to load GitHub data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const statItems = [
    { icon: <Code2 size={20} />, label: 'Repositories', value: stats?.totalRepos || 0 },
    { icon: <Star size={20} />, label: 'Stars', value: stats?.totalStars || 0 },
    { icon: <Users size={20} />, label: 'Followers', value: stats?.followers || 0 },
    { icon: <Activity size={20} />, label: 'Contributions', value: stats?.contributions || 0 },
    { icon: <GitFork size={20} />, label: 'Pull Requests', value: stats?.pullRequests || 0 },
  ];

  return (
    <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-jetbrains mb-1">Statistics</p>
              <h1 className="text-3xl font-playfair font-black text-[var(--text-primary)]">GitHub Stats</h1>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <p className="text-xs text-[var(--text-primary)] opacity-30 flex items-center gap-1 font-jetbrains">
                  <Clock size={10} /> {lastUpdated.toLocaleTimeString()}
                </p>
              )}
              <button
                onClick={load}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest hover:border-[var(--accent-primary)]/40 transition-all font-jetbrains disabled:opacity-40"
              >
                <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-36 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] animate-pulse" />)}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
              {statItems.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
                  <StatPill {...s} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Languages */}
          {stats?.languages && stats.languages.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-10 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
              <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] mb-6 font-jetbrains">Language Breakdown</h2>
              <div className="space-y-4">
                {stats.languages.slice(0, 8).map((l: any, i: number) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-sm font-black uppercase font-jetbrains">
                      <span className="text-[var(--text-primary)]">{l.name}</span>
                      <span className="text-[var(--accent-primary)]">{l.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--text-primary)]/[0.05] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${l.percent}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full bg-[var(--accent-primary)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Distribution */}
          {stats?.distribution && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-10 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
              <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] mb-6 font-jetbrains">Repo Distribution</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-black uppercase font-jetbrains mb-2">
                  <span className="text-[var(--text-primary)]">Original ({stats.distribution.original || 0}%)</span>
                  <span className="text-[var(--accent-primary)]">Forked ({stats.distribution.forked || 0}%)</span>
                </div>
                <div className="h-3 w-full bg-[var(--text-primary)]/[0.05] rounded-full overflow-hidden flex">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.distribution.original || 0}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-[var(--text-primary)] opacity-80"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.distribution.forked || 0}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-[var(--accent-primary)]"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Activity Feed */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
            <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] mb-6 font-jetbrains">Recent Activity</h2>
            {isLoading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 rounded-xl bg-[var(--text-primary)]/[0.04] animate-pulse" />)}</div>
            ) : activity.length === 0 ? (
              <p className="text-xs text-[var(--text-primary)] opacity-30 font-jetbrains py-4 text-center">No recent activity</p>
            ) : (
              <div className="space-y-2">
                {activity.slice(0, 10).map((e: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--text-primary)]/[0.04] transition-colors">
                    <div className="p-2 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shrink-0">
                      <GitBranch size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate font-jetbrains">{e.repo}</p>
                      <p className="text-[10px] text-[var(--text-primary)] opacity-40 font-jetbrains">{e.type} • {new Date(e.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-[var(--text-primary)]/[0.04] text-[var(--text-primary)] opacity-40 font-jetbrains shrink-0">{e.type}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => p.filter(t => t.id !== id))} />
    </>
  );
}
