'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Pencil, Trash2, MapPin, Calendar, Building2 } from 'lucide-react';

import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast, ToastContainer, createToastHelpers } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { fetchExperience, deleteExperience, Experience } from '@/lib/api';

export default function ExperiencePage() {
  const { token } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = createToastHelpers(setToasts);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    setIsLoading(true);
    try {
      const data = await fetchExperience();
      setExperiences(data || []);
    } catch {
      toast.error('Failed to load experience entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setIsDeleting(true);
    try {
      await deleteExperience(deleteTarget, token);
      setExperiences(prev => prev.filter(e => e._id !== deleteTarget));
      toast.success('Experience deleted successfully');
    } catch {
      toast.error('Failed to delete experience');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-jetbrains mb-1">Content</p>
              <h1 className="text-3xl font-playfair font-black text-[var(--text-primary)]">Experience</h1>
            </div>
            <Link href="/admin/experience/add" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-black uppercase tracking-widest hover:scale-105 hover:shadow-lg transition-all font-jetbrains">
              <Plus size={14} /> Add Experience
            </Link>
          </div>

          {/* Timeline */}
          {isLoading ? (
            <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] animate-pulse" />)}</div>
          ) : experiences.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-primary)] opacity-30">
              <p className="text-xs uppercase tracking-widest font-jetbrains">No experience entries yet</p>
            </div>
          ) : (
            <div className="relative space-y-0">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent-primary)]/30 via-[var(--border-primary)] to-transparent hidden sm:block" />

              {experiences.map((exp, i) => (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative flex gap-6 pb-8 sm:pl-14"
                >
                  {/* Timeline node */}
                  <div className="hidden sm:flex absolute left-3 top-4 w-5 h-5 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/40 items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
                  </div>

                  {/* Card */}
                  <div className="flex-1 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/20 transition-all duration-300 group">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-base font-black text-[var(--text-primary)] font-playfair group-hover:text-[var(--accent-primary)] transition-colors">
                            {exp.role}
                          </h3>
                          {exp.isInternship && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-jetbrains">Internship</span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-primary)] opacity-50 font-jetbrains">
                          <span className="flex items-center gap-1"><Building2 size={11} /> {exp.company}</span>
                          <span className="flex items-center gap-1"><MapPin size={11} /> {exp.location}</span>
                          <span className="flex items-center gap-1"><Calendar size={11} /> {exp.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/admin/experience/${exp._id}`} className="p-2 rounded-lg bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 transition-colors text-[var(--accent-primary)]">
                          <Pencil size={14} />
                        </Link>
                        <button onClick={() => setDeleteTarget(exp._id!)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {/* Highlights */}
                    {exp.highlights?.length > 0 && (
                      <ul className="space-y-1 mt-3 border-t border-[var(--border-primary)] pt-3">
                        {exp.highlights.slice(0, 2).map((h, j) => (
                          <li key={j} className="text-[11px] text-[var(--text-primary)] opacity-50 font-jetbrains flex items-start gap-2">
                            <span className="text-[var(--accent-primary)] mt-0.5">›</span> {h}
                          </li>
                        ))}
                        {exp.highlights.length > 2 && (
                          <li className="text-[10px] text-[var(--text-primary)] opacity-30 font-jetbrains">+{exp.highlights.length - 2} more</li>
                        )}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Experience"
        message="Are you sure you want to delete this experience entry?"
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
