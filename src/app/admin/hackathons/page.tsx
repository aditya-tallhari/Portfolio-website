'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ExternalLink, Trophy, Medal } from 'lucide-react';
import Link from 'next/link';

import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast, ToastContainer, createToastHelpers } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { fetchHackathons, deleteHackathon, Hackathon } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
  WIN: 'bg-yellow-400/20 text-yellow-400',
  FINALIST: 'bg-blue-400/20 text-blue-400',
  PARTICIPANT: 'bg-zinc-400/20 text-zinc-400',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  WIN: <Trophy size={10} />,
  FINALIST: <Medal size={10} />,
  PARTICIPANT: null,
};

export default function HackathonsAdminPage() {
  const { token } = useAuth();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [search, setSearch] = useState('');
  const toast = createToastHelpers(setToasts);

  useEffect(() => {
    loadHackathons();
  }, []);

  const loadHackathons = async () => {
    setIsLoading(true);
    try {
      const data = await fetchHackathons();
      setHackathons(data || []);
    } catch {
      toast.error('Failed to load hackathons');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setIsDeleting(true);
    try {
      await deleteHackathon(deleteTarget, token);
      setHackathons(prev => prev.filter(h => h._id !== deleteTarget));
      toast.success('Hackathon deleted successfully');
    } catch {
      toast.error('Failed to delete hackathon');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = hackathons.filter(h =>
    h.title.toLowerCase().includes(search.toLowerCase()) ||
    h.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-jetbrains mb-1">Content</p>
          <h1 className="text-3xl font-playfair font-black text-[var(--text-primary)]">Hackathons</h1>
        </div>
        <Link
          href="/admin/hackathons/add"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-black uppercase tracking-widest hover:scale-105 hover:shadow-lg transition-all font-jetbrains"
        >
          <Plus size={14} /> Add Hackathon
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search hackathons..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md mb-8 px-4 py-3 rounded-xl bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-primary)] placeholder:opacity-30 focus:outline-none focus:border-[var(--accent-primary)] transition-colors text-sm font-jetbrains"
      />

      {/* Hackathons Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-primary)] opacity-30">
          <Trophy size={32} className="mb-3 opacity-50" />
          <p className="text-xs uppercase tracking-widest font-jetbrains">No hackathons found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((hackathon, i) => (
            <motion.div
              key={hackathon._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/30 transition-all duration-300 flex flex-col gap-4"
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-1 text-[9px] font-black font-jetbrains uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_COLORS[hackathon.status] || STATUS_COLORS.PARTICIPANT}`}>
                  {STATUS_ICONS[hackathon.status]}
                  {hackathon.status}
                </span>
                <span className="text-[9px] font-jetbrains text-[var(--text-primary)] opacity-40 uppercase tracking-wider">{hackathon.type}</span>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-black text-[var(--text-primary)] font-jetbrains group-hover:text-[var(--accent-primary)] transition-colors leading-tight mb-1">
                  {hackathon.title}
                </h3>
                <p className="text-[10px] text-[var(--accent-primary)] font-jetbrains font-bold mb-2">{hackathon.achievement}</p>
                <p className="text-xs text-[var(--text-primary)] opacity-50 font-jetbrains line-clamp-2 leading-relaxed mb-3">
                  {hackathon.description}
                </p>
                {/* Tech badges */}
                <div className="flex flex-wrap gap-1">
                  {hackathon.techStack?.slice(0, 4).map((tech, j) => (
                    <span key={j} className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold font-jetbrains">
                      {tech}
                    </span>
                  ))}
                  {hackathon.techStack?.length > 4 && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--text-primary)]/[0.04] text-[var(--text-primary)] opacity-40 font-jetbrains">
                      +{hackathon.techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Date */}
              <p className="text-[10px] text-[var(--text-primary)] opacity-30 font-jetbrains">{hackathon.date}</p>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-primary)]">
                {hackathon.link && (
                  <a href={hackathon.link} target="_blank" className="p-2 rounded-lg hover:bg-[var(--text-primary)]/[0.04] transition-colors text-[var(--text-primary)] opacity-40 hover:opacity-80">
                    <ExternalLink size={14} />
                  </a>
                )}
                <div className="flex-1" />
                <Link
                  href={`/admin/hackathons/${hackathon._id}`}
                  className="p-2 rounded-lg bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 transition-colors text-[var(--accent-primary)]"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => setDeleteTarget(hackathon._id!)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Hackathon"
        message="Are you sure you want to delete this hackathon? This action cannot be undone."
        confirmText="Delete"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => p.filter(t => t.id !== id))} />
    </>
  );
}
