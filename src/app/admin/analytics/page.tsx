'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, TrendingUp, BarChart3, RefreshCw, Clock } from 'lucide-react';

import { Toast, ToastContainer, createToastHelpers } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardStats, checkSystemHealth } from '@/lib/api';

const MetricCard = ({ icon, label, value, suffix = '', delay = 0 }: { icon: React.ReactNode; label: string; value: number | string; suffix?: string; delay?: number }) => {
  const [count, setCount] = useState(0);
  const num = typeof value === 'number' ? value : 0;

  useEffect(() => {
    if (!num) return;
    let s = 0;
    const step = Math.ceil(num / 50);
    const iv = setInterval(() => {
      s += step;
      if (s >= num) { setCount(num); clearInterval(iv); } else setCount(s);
    }, 25);
    return () => clearInterval(iv);
  }, [num]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="p-3 rounded-xl bg-[var(--accent-primary)]/10 w-fit mb-5 text-[var(--accent-primary)]">{icon}</div>
      <div className="text-4xl font-black font-playfair text-[var(--accent-primary)] mb-1">{typeof value === 'number' ? count : value}{suffix}</div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-50 font-jetbrains">{label}</p>
    </motion.div>
  );
};

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [dashStats, setDashStats] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = createToastHelpers(setToasts);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        token ? fetchDashboardStats(token) : Promise.reject('No token'),
        checkSystemHealth(),
      ]);
      if (results[0].status === 'fulfilled') setDashStats((results[0].value as any)?.data?.stats || null);
      if (results[1].status === 'fulfilled') setHealth((results[1].value as any) || null);
      setLastUpdated(new Date());
    } catch {
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const metrics = [
    { icon: <Users size={20} />, label: 'Total Visitors', value: dashStats?.traffic || 0, delay: 0 },
    { icon: <Eye size={20} />, label: 'Page Views', value: dashStats?.traffic || 0, delay: 0.1 }, // Assuming traffic represents views for now
    { icon: <TrendingUp size={20} />, label: 'Projects', value: dashStats?.projects || 0, delay: 0.2 },
    { icon: <BarChart3 size={20} />, label: 'Experiences', value: dashStats?.experience || 0, delay: 0.3 },
  ];

  return (
    <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-jetbrains mb-1">Overview</p>
              <h1 className="text-3xl font-playfair font-black text-[var(--text-primary)]">Analytics</h1>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <p className="text-[10px] text-[var(--text-primary)] opacity-30 flex items-center gap-1 font-jetbrains">
                  <Clock size={10} /> {lastUpdated.toLocaleTimeString()}
                </p>
              )}
              <button onClick={load} disabled={isLoading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest hover:border-[var(--accent-primary)]/40 transition-all font-jetbrains disabled:opacity-40">
                <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
          </div>

          {/* Metrics */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-36 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
            </div>
          )}

          {/* System Health */}
          {health && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
              <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] mb-6 font-jetbrains">System Health</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'API Status', value: health.status || 'Online', ok: health.status === 'success' || health.status === 'ok' },
                  { label: 'Database', value: health.data?.database || health.database || 'Connected', ok: true },
                  { label: 'Uptime', value: health.data?.uptime || health.uptime || '—' },
                  { label: 'Version', value: health.data?.version || health.version || 'v1.0.0' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[var(--text-primary)]/[0.02] border border-[var(--border-primary)]">
                    <p className="text-[9px] uppercase tracking-widest text-[var(--text-primary)] opacity-30 mb-2 font-jetbrains">{item.label}</p>
                    <p className={`text-sm font-black font-jetbrains ${item.ok !== undefined ? (item.ok ? 'text-emerald-400' : 'text-red-400') : 'text-[var(--text-primary)]'}`}>
                      {String(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Raw Data */}
          {dashStats && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
              <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] mb-6 font-jetbrains">Dashboard Data</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-jetbrains">
                  <thead>
                    <tr className="border-b border-[var(--border-primary)]">
                      {['Metric', 'Value'].map(h => (
                        <th key={h} className="text-left py-3 pr-6 text-[10px] uppercase tracking-widest text-[var(--text-primary)] opacity-40 font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(dashStats).map(([k, v]) => (
                      <tr key={k} className="border-b border-[var(--border-primary)] hover:bg-[var(--text-primary)]/[0.02] transition-colors">
                        <td className="py-3 pr-6 text-[var(--text-primary)] opacity-60 capitalize">{k.replace(/([A-Z])/g, ' $1')}</td>
                        <td className="py-3 font-bold text-[var(--text-primary)]">{String(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {!isLoading && !dashStats && !health && (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-primary)] opacity-30">
              <BarChart3 size={32} className="mb-3" />
              <p className="text-xs uppercase tracking-widest font-jetbrains">No analytics data available yet</p>
            </div>
          )}
      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => p.filter(t => t.id !== id))} />
    </>
  );
}
