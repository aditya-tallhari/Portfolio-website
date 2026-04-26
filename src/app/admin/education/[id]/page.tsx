'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, GraduationCap, Plus, X, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Toast, ToastContainer, createToastHelpers } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import { fetchEducation, updateEducation, Education } from '@/lib/api';

export default function EditEducationPage() {
  const router = useRouter();
  const { id } = useParams();
  const { token } = useAuth();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<any[]>([]);
  const toast = createToastHelpers(setToasts);

  const [formData, setFormData] = useState<Partial<Education>>({
    label: '',
    degree: '',
    specialization: '',
    institution: '',
    location: '',
    period: '',
    grade: '',
    desc: '',
    tags: [],
    accent: 'var(--accent-primary)',
    order: 0
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadEducation(id);
    }
  }, [id]);

  const loadEducation = async (educationId: string) => {
    setIsLoading(true);
    try {
      const allEdu = await fetchEducation();
      const edu = allEdu.find(e => e._id === educationId);
      if (edu) {
        setFormData(edu);
      } else {
        toast.error('Education record not found');
      }
    } catch {
      toast.error('Failed to load education details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (formData.tags?.includes(newTag.trim())) {
      setNewTag('');
      return;
    }
    setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTag.trim()] }));
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tagToRemove) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id || typeof id !== 'string') return;

    setIsSaving(true);
    try {
      await updateEducation(id, formData, token);
      toast.success('Education record updated successfully!');
      setTimeout(() => router.push('/admin/education'), 1500);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update education record');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-[60vh] text-[var(--accent-primary)] font-jetbrains text-xs uppercase tracking-widest animate-pulse">Retrieving academic record...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link href="/admin/education" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-40 hover:opacity-100 hover:text-[var(--accent-primary)] transition-all mb-8 font-jetbrains group w-fit">
        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Education
      </Link>

      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-jetbrains mb-1">Edit Entry</p>
        <h1 className="text-3xl font-playfair font-black text-[var(--text-primary)]">Update Milestone</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Degree Info */}
          <div className="space-y-6 p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap size={18} className="text-[var(--accent-primary)]" />
              <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)]">Degree Details</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains ml-1">Specialization</label>
                <input required type="text" placeholder="e.g. Computer Science & Engineering" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} className="w-full px-5 py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-[var(--accent-primary)] outline-none text-sm font-jetbrains transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains ml-1">Degree Title</label>
                <input required type="text" placeholder="e.g. Bachelor of Technology" value={formData.degree} onChange={e => setFormData({ ...formData, degree: e.target.value })} className="w-full px-5 py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-[var(--accent-primary)] outline-none text-sm font-jetbrains transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains ml-1">Short Label</label>
                <input required type="text" placeholder="e.g. B.Tech CSE" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} className="w-full px-5 py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-[var(--accent-primary)] outline-none text-sm font-jetbrains transition-all" />
              </div>
            </div>
          </div>

          {/* Institution Info */}
          <div className="space-y-6 p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-5 h-5 rounded bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)]">
                <Save size={12} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)]">Institution Info</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains ml-1">Institution Name</label>
                <input required type="text" placeholder="e.g. R.C. Patel Institute of Technology" value={formData.institution} onChange={e => setFormData({ ...formData, institution: e.target.value })} className="w-full px-5 py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-[var(--accent-primary)] outline-none text-sm font-jetbrains transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains ml-1">Location</label>
                <input required type="text" placeholder="e.g. Shirpur, Maharashtra" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-5 py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-[var(--accent-primary)] outline-none text-sm font-jetbrains transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains ml-1">Timeline</label>
                  <input required type="text" placeholder="2024 — 2027" value={formData.period} onChange={e => setFormData({ ...formData, period: e.target.value })} className="w-full px-5 py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-[var(--accent-primary)] outline-none text-sm font-jetbrains transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains ml-1">Grade / Result</label>
                  <input required type="text" placeholder="CGPA: 8.47" value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} className="w-full px-5 py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-[var(--accent-primary)] outline-none text-sm font-jetbrains transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Tags */}
        <div className="space-y-6 p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains ml-1">Description</label>
            <textarea required rows={4} placeholder="Describe your focus, major subjects, and achievements during this period..." value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full px-5 py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-[var(--accent-primary)] outline-none text-sm font-jetbrains transition-all resize-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 font-jetbrains ml-1">Learning Focus (Tags)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags?.map(tag => (
                <span key={tag} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-white text-[10px] font-bold uppercase tracking-widest">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-200"><X size={12} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Add a tag..." value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} className="flex-1 px-5 py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-[var(--accent-primary)] outline-none text-sm font-jetbrains transition-all" />
              <button type="button" onClick={handleAddTag} className="px-5 rounded-xl bg-[var(--text-primary)]/[0.04] text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all"><Plus size={20} /></button>
            </div>
          </div>
        </div>

        <button disabled={isSaving} type="submit" className="w-full py-5 rounded-2xl bg-[var(--accent-primary)] text-white font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 font-jetbrains text-sm">
          {isSaving ? 'Updating...' : <><Save size={18} /> Update Academic Record</>}
        </button>
      </form>

      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => p.filter(t => t.id !== id))} />
    </div>
  );
}
