'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import Link from 'next/link';

import { Toast, ToastContainer, createToastHelpers } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import { fetchExperience, updateExperience, Experience } from '@/lib/api';

export default function EditExperiencePage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = createToastHelpers(setToasts);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [form, setForm] = useState({
    company: '', role: '', location: '', duration: '',
    startDate: '', highlights: [''], isInternship: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchExperience();
        const exp = list.find((e: Experience) => e._id === id);
        if (exp) {
          setForm({
            company: exp.company || '',
            role: exp.role || '',
            location: exp.location || '',
            duration: exp.duration || '',
            startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
            highlights: exp.highlights?.length ? exp.highlights : [''],
            isInternship: exp.isInternship || false,
          });
        }
      } catch {
        toast.error('Failed to load experience');
      } finally {
        setIsFetching(false);
      }
    };
    load();
  }, [id]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.company.trim()) e.company = 'Company name is required';
    if (!form.role.trim()) e.role = 'Role is required';
    if (!form.duration.trim()) e.duration = 'Duration is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const updateHighlight = (i: number, value: string) => {
    setForm(p => { const h = [...p.highlights]; h[i] = value; return { ...p, highlights: h }; });
  };
  const addHighlight = () => setForm(p => ({ ...p, highlights: [...p.highlights, ''] }));
  const removeHighlight = (i: number) => setForm(p => ({ ...p, highlights: p.highlights.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !token) return;
    setIsLoading(true);
    try {
      await updateExperience(id, {
        company: form.company, role: form.role, location: form.location,
        duration: form.duration, startDate: form.startDate,
        highlights: form.highlights.filter(h => h.trim()),
        isInternship: form.isInternship,
      }, token);
      toast.success('Experience updated successfully!');
      setTimeout(() => router.push('/admin/experience'), 1200);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update experience');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-primary)] placeholder:opacity-20 focus:outline-none focus:border-[var(--accent-primary)] transition-colors text-sm font-jetbrains";

  if (isFetching) {
    return (
      <div className="animate-pulse space-y-6">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 rounded-xl bg-[var(--bg-secondary)]" />)}
      </div>
    );
  }

  return (
    <>
          <div className="flex items-center gap-4 mb-10">
            <Link href="/admin/experience" className="p-2 rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] opacity-60 hover:opacity-100 transition-opacity">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-jetbrains">Experience / Edit</p>
              <h1 className="text-3xl font-playfair font-black text-[var(--text-primary)]">Edit Experience</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Company *', key: 'company', placeholder: 'Company name' },
                { label: 'Role *', key: 'role', placeholder: 'Your role' },
                { label: 'Location', key: 'location', placeholder: 'City, Country' },
                { label: 'Duration *', key: 'duration', placeholder: 'e.g. Jan 2024 – Present' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60 mb-2 font-jetbrains">{f.label}</label>
                  <input type="text" placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className={inputClass} />
                  {errors[f.key] && <p className="text-red-400 text-[10px] mt-1 font-jetbrains">{errors[f.key]}</p>}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60 mb-2 font-jetbrains">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className={inputClass} />
            </div>

            {/* Highlights */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60 mb-3 font-jetbrains">Highlights</label>
              <div className="space-y-3">
                {form.highlights.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="mt-3.5 text-[var(--accent-primary)] opacity-60 text-sm font-bold">›</span>
                    <input type="text" placeholder={`Highlight ${i + 1}...`} value={h} onChange={e => updateHighlight(i, e.target.value)} className={`flex-1 ${inputClass}`} />
                    {form.highlights.length > 1 && (
                      <button type="button" onClick={() => removeHighlight(i)} className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><X size={14} /></button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addHighlight} className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[var(--accent-primary)] opacity-60 hover:opacity-100 transition-opacity font-jetbrains">
                <Plus size={12} /> Add Highlight
              </button>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm(p => ({ ...p, isInternship: !p.isInternship }))} className={`w-12 h-6 rounded-full transition-colors relative ${form.isInternship ? 'bg-[var(--accent-primary)]' : 'bg-[var(--text-primary)]/10'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isInternship ? 'left-7' : 'left-1'}`} />
              </div>
              <span className="text-xs font-bold text-[var(--text-primary)] opacity-70 uppercase tracking-widest font-jetbrains">This is an Internship</span>
            </label>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-black uppercase tracking-widest hover:scale-105 hover:shadow-lg transition-all disabled:opacity-50 disabled:scale-100 font-jetbrains">
                {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <Link href="/admin/experience" className="flex items-center gap-2 px-8 py-4 rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] opacity-60 hover:opacity-100 text-xs font-bold uppercase tracking-widest transition-all font-jetbrains">Cancel</Link>
            </div>
          </form>
      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => p.filter(t => t.id !== id))} />
    </>
  );
}
