'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FolderKanban, Briefcase, MessageSquare, BarChart3,
  Code2, Plus, TrendingUp, Eye, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchProjects, fetchExperience, fetchGithubStats,
  fetchDashboardStats
} from '@/lib/api';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  subtitle?: string;
  href?: string;
  addHref?: string;
  color?: string;
  delay?: number;
}

const StatCard = ({ icon, title, value, subtitle, href, addHref, color = 'var(--accent-primary)', delay = 0 }: StatCardProps) => {
  const [count, setCount] = useState(0);
  const numericValue = typeof value === 'number' ? value : 0;

  useEffect(() => {
    if (typeof value !== 'number') return;
    let start = 0;
    const step = Math.ceil(numericValue / 40);
    const interval = setInterval(() => {
      start += step;
      if (start >= numericValue) { setCount(numericValue); clearInterval(interval); }
      else setCount(start);
    }, 30);
    return () => clearInterval(interval);
  }, [value, numericValue]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:-translate-y-1 transition-all duration-300 hover:border-[var(--accent-primary)]/30 group"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="p-3 rounded-xl" style={{ background: `color-mix(in srgb, ${color} 10%, transparent)` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        {addHref && (
          <Link href={addHref} className="p-2 rounded-lg bg-[var(--text-primary)]/[0.04] hover:bg-[var(--accent-primary)]/10 transition-colors" title={`Add new ${title}`}>
            <Plus size={14} className="text-[var(--text-primary)] opacity-60" />
          </Link>
        )}
      </div>
      <div className="text-4xl font-black font-playfair mb-1" style={{ color }}>
        {typeof value === 'number' ? count : value}
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60 font-jetbrains">{title}</p>
      {subtitle && <p className="text-xs text-[var(--text-primary)] opacity-30 mt-1 font-jetbrains">{subtitle}</p>}
      {href && (
        <Link href={href} className="inline-flex items-center gap-1 mt-4 text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-80 transition-opacity text-[var(--text-primary)] font-jetbrains">
          View all <Eye size={10} />
        </Link>
      )}
    </motion.div>
  );
};

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [githubStats, setGithubStats] = useState<any>(null);
  const [dashStats, setDashStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [p, e, g] = await Promise.allSettled([
          fetchProjects(),
          fetchExperience(),
          fetchGithubStats(),
        ]);
        if (p.status === 'fulfilled') setProjects(p.value || []);
        if (e.status === 'fulfilled') setExperiences(e.value || []);
        if (g.status === 'fulfilled') setGithubStats(g.value?.data?.stats || null);
        if (token) {
          try {
            const ds = await fetchDashboardStats(token);
            setDashStats(ds?.data || null);
          } catch {}
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [token]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-jetbrains mb-1">{greeting()}, {user?.name || 'Admin'}</p>
            <h1 className="text-4xl font-playfair font-black text-[var(--text-primary)]">Dashboard</h1>
            <div className="h-[1px] w-16 bg-[var(--accent-primary)] mt-4 opacity-60" />
          </motion.div>

          {/* Stats Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-40 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard icon={<FolderKanban size={20} />} title="Projects" value={projects.length} href="/admin/projects" addHref="/admin/projects/add" delay={0} />
              <StatCard icon={<Briefcase size={20} />} title="Experience" value={experiences.length} href="/admin/experience" addHref="/admin/experience/add" delay={0.1} />
              <StatCard icon={<Code2 size={20} />} title="Repositories" value={githubStats?.totalRepos || 0} subtitle={`${githubStats?.totalStars || 0} stars`} href="/admin/github" delay={0.2} />
              <StatCard icon={<TrendingUp size={20} />} title="Contributions" value={githubStats?.contributions || 0} subtitle="Total commits" href="/admin/github" delay={0.3} />
            </div>
          )}

          {/* Recent Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)] font-jetbrains">Recent Projects</h2>
                <Link href="/admin/projects/add" className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-[var(--accent-primary)] hover:opacity-80 transition-opacity font-jetbrains">
                  <Plus size={12} /> Add New
                </Link>
              </div>
              {isLoading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 rounded-xl bg-[var(--text-primary)]/[0.04] animate-pulse" />)}</div>
              ) : projects.length === 0 ? (
                <p className="text-xs text-[var(--text-primary)] opacity-30 font-jetbrains py-8 text-center">No projects yet</p>
              ) : (
                <div className="space-y-2">
                  {projects.slice(0, 5).map((p: any, i) => (
                    <Link key={p._id || i} href={`/admin/projects/${p._id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--text-primary)]/[0.04] transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center shrink-0">
                        <FolderKanban size={14} className="text-[var(--accent-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--text-primary)] truncate font-jetbrains group-hover:text-[var(--accent-primary)] transition-colors">{p.title}</p>
                        <p className="text-[10px] text-[var(--text-primary)] opacity-30 font-jetbrains">{p.techStack?.slice(0, 3).join(', ')}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-full font-jetbrains ${p.isFeatured ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' : 'bg-[var(--text-primary)]/[0.04] text-[var(--text-primary)] opacity-40'}`}>
                        {p.isFeatured ? 'Featured' : 'Normal'}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent Experience */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)] font-jetbrains">Experience</h2>
                <Link href="/admin/experience/add" className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-[var(--accent-primary)] hover:opacity-80 transition-opacity font-jetbrains">
                  <Plus size={12} /> Add New
                </Link>
              </div>
              {isLoading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-[var(--text-primary)]/[0.04] animate-pulse" />)}</div>
              ) : experiences.length === 0 ? (
                <p className="text-xs text-[var(--text-primary)] opacity-30 font-jetbrains py-8 text-center">No experience entries yet</p>
              ) : (
                <div className="space-y-2">
                  {experiences.slice(0, 4).map((exp: any, i) => (
                    <Link key={exp._id || i} href={`/admin/experience/${exp._id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--text-primary)]/[0.04] transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center shrink-0">
                        <Briefcase size={14} className="text-[var(--accent-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--text-primary)] truncate font-jetbrains group-hover:text-[var(--accent-primary)] transition-colors">{exp.role}</p>
                        <p className="text-[10px] text-[var(--text-primary)] opacity-40 font-jetbrains">{exp.company} · {exp.duration}</p>
                      </div>
                      {exp.isInternship && (
                        <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 font-jetbrains shrink-0">Internship</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8 flex flex-wrap gap-4">
            {[
              { label: '+ New Project', href: '/admin/projects/add', primary: true },
              { label: '+ New Experience', href: '/admin/experience/add', primary: true },
              { label: 'View Messages', href: '/admin/messages', primary: false },
              { label: 'Analytics', href: '/admin/analytics', primary: false },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all font-jetbrains ${
                  action.primary
                    ? 'bg-[var(--accent-primary)] text-white hover:scale-105 hover:shadow-lg hover:shadow-[var(--accent-primary)]/20'
                    : 'bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40'
                }`}
              >
                {action.label}
              </Link>
            ))}
          </motion.div>
    </>
  );
}
