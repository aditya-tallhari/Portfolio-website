'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import Link from 'next/link';

import { Toast, ToastContainer, createToastHelpers } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import { fetchHackathons, updateHackathon, Hackathon } from '@/lib/api';

const TECH_SUGGESTIONS = ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Python', 'FastAPI', 'TailwindCSS', 'GSAP', 'OpenAI API', 'PostgreSQL', 'Docker', 'Vercel', 'Supabase', 'Firebase'];

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60 mb-2 font-jetbrains">{label}</label>
    {children}
    {error && <p className="text-red-400 text-[10px] mt-1 font-jetbrains">{error}</p>}
  </div>
);
export default function EditHackathonPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = createToastHelpers(setToasts);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [form, setForm] = useState({
    title: '',
    achievement: '',
    date: '',
    description: '',
    link: '',
    type: 'NATIONAL',
    status: 'WIN' as 'WIN' | 'FINALIST' | 'PARTICIPANT',
    techStack: [] as string[],
    order: 0,
  });
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    const loadHackathon = async () => {
      try {
        const all = await fetchHackathons();
        const found = all.find((h: Hackathon) => h._id === id);
        if (found) {
          setForm({
            title: found.title || '',
            achievement: found.achievement || '',
            date: found.date || '',
            description: found.description || '',
            link: found.link || '',
            type: found.type || 'NATIONAL',
            status: found.status || 'WIN',
            techStack: found.techStack || [],
            order: found.order || 0,
          });
          setExistingImage(found.image || null);
          setPreviewUrl(found.image || null);
        } else {
          toast.error('Hackathon not found');
          router.push('/admin/hackathons');
        }
      } catch {
        toast.error('Failed to load hackathon');
      } finally {
        setIsFetching(false);
      }
    };
    loadHackathon();
  }, [id]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim() || form.title.length < 3) e.title = 'Title must be at least 3 characters';
    if (!form.achievement.trim()) e.achievement = 'Achievement is required';
    if (!form.date.trim()) e.date = 'Date is required';
    if (!form.description.trim() || form.description.length < 10) e.description = 'Description must be at least 10 characters';
    if (form.techStack.length === 0) e.techStack = 'Add at least one technology';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addTech = (tech: string) => {
    const t = tech.trim();
    if (t && !form.techStack.includes(t)) {
      setForm(p => ({ ...p, techStack: [...p.techStack, t] }));
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => setForm(p => ({ ...p, techStack: p.techStack.filter(t => t !== tech) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !token) return;

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('achievement', form.achievement);
      fd.append('date', form.date);
      fd.append('description', form.description);
      fd.append('link', form.link);
      fd.append('type', form.type.toUpperCase());
      fd.append('status', form.status);
      fd.append('order', String(form.order));
      fd.append('techStack', form.techStack.join(','));
      if (imageFile) fd.append('image', imageFile);

      await updateHackathon(id, fd, token);
      toast.success('Hackathon updated successfully!');
      setTimeout(() => router.push('/admin/hackathons'), 1200);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update hackathon');
    } finally {
      setIsLoading(false);
    }
  };



  const inputClass = "w-full px-4 py-3 bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-primary)] placeholder:opacity-20 focus:outline-none focus:border-[var(--accent-primary)] transition-colors text-sm font-jetbrains";

  if (isFetching) {
    return (
      <div className="max-w-3xl space-y-6 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin/hackathons" className="p-2 rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] opacity-60 hover:opacity-100 transition-opacity">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-jetbrains">Hackathons</p>
          <h1 className="text-3xl font-playfair font-black text-[var(--text-primary)]">Edit Hackathon</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Field label="Hackathon Name *" error={errors.title}>
            <input type="text" placeholder="HackMIT 2024" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputClass} />
          </Field>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Field label="Achievement *" error={errors.achievement}>
            <input type="text" placeholder='1st Place — $5,000 Prize Pool' value={form.achievement} onChange={e => setForm(p => ({ ...p, achievement: e.target.value }))} className={inputClass} />
          </Field>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="Date *" error={errors.date}>
            <input type="text" placeholder="March 2024" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Type">
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className={inputClass}>
              <option value="NATIONAL">National</option>
              <option value="INTERNATIONAL">International</option>
              <option value="REGIONAL">Regional</option>
              <option value="COLLEGE">College</option>
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as any }))} className={inputClass}>
              <option value="WIN">Win 🏆</option>
              <option value="FINALIST">Finalist 🥈</option>
              <option value="PARTICIPANT">Participant</option>
            </select>
          </Field>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Field label="Description *" error={errors.description}>
            <textarea rows={4} placeholder="What was the hackathon about?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={`${inputClass} resize-none`} />
          </Field>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Submission / Demo Link">
            <input type="url" placeholder="https://devpost.com/submit/..." value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Display Order">
            <input type="number" min={0} value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} className={inputClass} />
          </Field>
        </motion.div>

        {/* Image Upload */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Field label="Hackathon Image">
            <div
              className={`relative group h-40 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-3 ${
                previewUrl ? 'border-[var(--accent-primary)]/40' : 'border-[var(--border-primary)] hover:border-[var(--accent-primary)]/40 bg-[var(--text-primary)]/[0.02]'
              }`}
              onClick={() => document.getElementById('image-upload-edit')?.click()}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-[10px] text-white font-bold tracking-widest uppercase font-jetbrains">Change Image</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-[var(--text-primary)]/[0.04] flex items-center justify-center">
                    <Plus size={20} className="text-[var(--text-primary)] opacity-40" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60">Upload Banner Image</p>
                </>
              )}
              <input
                id="image-upload-edit"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </Field>
        </motion.div>

        {/* Tech Stack */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Field label="Tech Stack *" error={errors.techStack}>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add technology..."
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(techInput); } }}
                className={`flex-1 ${inputClass}`}
              />
              <button type="button" onClick={() => addTech(techInput)} className="px-4 py-3 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/20 transition-colors">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {TECH_SUGGESTIONS.filter(t => !form.techStack.includes(t)).slice(0, 8).map(t => (
                <button key={t} type="button" onClick={() => addTech(t)} className="text-[9px] px-2 py-1 rounded-full border border-[var(--border-primary)] text-[var(--text-primary)] opacity-40 hover:opacity-80 hover:border-[var(--accent-primary)]/40 transition-all font-jetbrains">
                  + {t}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {form.techStack.map(t => (
                <span key={t} className="flex items-center gap-1 text-[10px] px-3 py-1.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold font-jetbrains">
                  {t}
                  <button type="button" onClick={() => removeTech(t)} className="hover:opacity-70 transition-opacity"><X size={10} /></button>
                </span>
              ))}
            </div>
          </Field>
        </motion.div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-black uppercase tracking-widest hover:scale-105 hover:shadow-lg transition-all disabled:opacity-50 disabled:scale-100 font-jetbrains"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/hackathons" className="flex items-center gap-2 px-8 py-4 rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] opacity-60 hover:opacity-100 text-xs font-bold uppercase tracking-widest transition-all font-jetbrains">
            Cancel
          </Link>
        </motion.div>
      </form>

      <ToastContainer toasts={toasts} onRemove={(id: string) => setToasts(p => p.filter(t => t.id !== id))} />
    </>
  );
}
