'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Pencil, Trash2, MapPin, Calendar, GraduationCap, Award } from 'lucide-react';

import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast, ToastContainer, createToastHelpers } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { fetchEducation, deleteEducation, Education } from '@/lib/api';

export default function EducationPage() {
  const { token } = useAuth();
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const toast = createToastHelpers(setToasts);

  useEffect(() => {
    loadEducations();
  }, []);

  const loadEducations = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEducation();
      setEducations(data || []);
    } catch {
      toast.error('Failed to load education entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setIsDeleting(true);
    try {
      await deleteEducation(deleteTarget, token);
      setEducations(prev => prev.filter(e => e._id !== deleteTarget));
      toast.success('Education entry deleted successfully');
    } catch {
      toast.error('Failed to delete education entry');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-jetbrains mb-1">Academic</p>
          <h1 className="text-3xl font-playfair font-black text-[var(--text-primary)]">Education</h1>
        </div>
        <Link href="/admin/education/add" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-black uppercase tracking-widest hover:scale-105 hover:shadow-lg transition-all font-jetbrains">
          <Plus size={14} /> Add Education
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] animate-pulse" />)}</div>
      ) : educations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-primary)] opacity-30">
          <p className="text-xs uppercase tracking-widest font-jetbrains">No education entries yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {educations.map((edu, i) => (
            <motion.div
              key={edu._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/20 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between md:justify-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] shrink-0">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-playfair font-black text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {edu.specialization}
                      </h3>
                      <p className="text-sm font-bold text-[var(--accent-primary)] uppercase tracking-widest">{edu.degree} — {edu.label}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-[var(--text-primary)] opacity-60 font-jetbrains">
                        <MapPin size={14} className="text-[var(--accent-primary)]" />
                        <span>{edu.institution}, {edu.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-primary)] opacity-60 font-jetbrains">
                        <Calendar size={14} className="text-[var(--accent-primary)]" />
                        <span>{edu.period}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-primary)] font-bold font-jetbrains text-[var(--accent-primary)]">
                        <Award size={14} />
                        <span>{edu.grade}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 items-start">
                      {edu.tags?.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] text-[9px] font-bold uppercase opacity-60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center justify-end gap-2 shrink-0">
                  <Link href={`/admin/education/${edu._id}`} className="p-3 rounded-xl bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)] text-[var(--accent-primary)] hover:text-white transition-all">
                    <Pencil size={16} />
                  </Link>
                  <button onClick={() => setDeleteTarget(edu._id!)} className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Education"
        message="Are you sure you want to delete this education entry? This action cannot be undone."
        confirmText="Delete Entry"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => p.filter(t => t.id !== id))} />
    </>
  );
}
