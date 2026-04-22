'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import Link from 'next/link';

import { Toast, ToastContainer, createToastHelpers } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import { createProject } from '@/lib/api';

const TECH_SUGGESTIONS = ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Express', 'TailwindCSS', 'GSAP', 'PostgreSQL', 'Docker', 'Python', 'FastAPI', 'Vue.js', 'GraphQL', 'Redis'];

export default function AddProjectPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = createToastHelpers(setToasts);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', content: '',
    githubUrl: '', liveUrl: '',
    techStack: [] as string[], isFeatured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim() || form.title.length < 3) e.title = 'Title must be at least 3 characters';
    if (!form.description.trim() || form.description.length < 10) e.description = 'Description must be at least 10 characters';
    if (!form.content.trim()) e.content = 'Content is required';
    if (!form.githubUrl.trim()) e.githubUrl = 'GitHub URL is required';
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

    if (!imageFile) {
      toast.error('Please upload a project image');
      return;
    }

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('content', form.content);
      if (imageFile) fd.append('image', imageFile);
      fd.append('isFeatured', String(form.isFeatured));
      fd.append('links[github]', form.githubUrl);
      fd.append('links[live]', form.liveUrl);
      form.techStack.forEach(t => fd.append('techStack[]', t));

      await createProject(fd, token);
      toast.success('Project created successfully!');
      setTimeout(() => router.push('/admin/projects'), 1200);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60 mb-2 font-jetbrains">{label}</label>
      {children}
      {error && <p className="text-red-400 text-[10px] mt-1 font-jetbrains">{error}</p>}
    </div>
  );

  const inputClass = "w-full px-4 py-3 bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-primary)] placeholder:opacity-20 focus:outline-none focus:border-[var(--accent-primary)] transition-colors text-sm font-jetbrains";

  return (
    <>
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <Link href="/admin/projects" className="p-2 rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] opacity-60 hover:opacity-100 transition-opacity">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-jetbrains">Projects</p>
              <h1 className="text-3xl font-playfair font-black text-[var(--text-primary)]">Add New Project</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Field label="Title *" error={errors.title}>
                <input type="text" placeholder="My Awesome Project" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputClass} />
                <p className="text-[9px] text-[var(--text-primary)] opacity-20 mt-1 font-jetbrains">{form.title.length}/100</p>
              </Field>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Field label="Description *" error={errors.description}>
                <textarea rows={3} placeholder="Brief project description..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={`${inputClass} resize-none`} />
                <p className="text-[9px] text-[var(--text-primary)] opacity-20 mt-1 font-jetbrains">{form.description.length}/300</p>
              </Field>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Field label="Content / Details *" error={errors.content}>
                <textarea rows={5} placeholder="Detailed project description, challenges, solutions..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className={`${inputClass} resize-none`} />
              </Field>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="GitHub URL *" error={errors.githubUrl}>
                <input type="url" placeholder="https://github.com/user/repo" value={form.githubUrl} onChange={e => setForm(p => ({ ...p, githubUrl: e.target.value }))} className={inputClass} />
              </Field>
              <Field label="Live URL">
                <input type="url" placeholder="https://project.com" value={form.liveUrl} onChange={e => setForm(p => ({ ...p, liveUrl: e.target.value }))} className={inputClass} />
              </Field>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Field label="Project Image *" error={errors.image}>
                <div 
                  className={`relative group h-48 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-3 ${
                    previewUrl ? 'border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/[0.02]' : 'border-[var(--border-primary)] hover:border-[var(--accent-primary)]/40 bg-[var(--text-primary)]/[0.02] hover:bg-[var(--text-primary)]/[0.04]'
                  }`}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-[10px] text-white font-bold tracking-widest uppercase font-jetbrains">Change Image</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-[var(--text-primary)]/[0.04] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={20} className="text-[var(--text-primary)] opacity-40" />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60">Upload Project Image</p>
                        <p className="text-[9px] text-[var(--text-primary)] opacity-20 mt-1 font-jetbrains">PNG, JPG or WebP (max 5MB)</p>
                      </div>
                    </>
                  )}
                  <input 
                    id="image-upload"
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
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
                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {TECH_SUGGESTIONS.filter(t => !form.techStack.includes(t)).slice(0, 8).map(t => (
                    <button key={t} type="button" onClick={() => addTech(t)} className="text-[9px] px-2 py-1 rounded-full border border-[var(--border-primary)] text-[var(--text-primary)] opacity-40 hover:opacity-80 hover:border-[var(--accent-primary)]/40 transition-all font-jetbrains">
                      + {t}
                    </button>
                  ))}
                </div>
                {/* Selected */}
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

            {/* Featured */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setForm(p => ({ ...p, isFeatured: !p.isFeatured }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${form.isFeatured ? 'bg-[var(--accent-primary)]' : 'bg-[var(--text-primary)]/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isFeatured ? 'left-7' : 'left-1'}`} />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)] opacity-70 uppercase tracking-widest font-jetbrains">Featured Project</span>
              </label>
            </motion.div>

            {/* Submit */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-black uppercase tracking-widest hover:scale-105 hover:shadow-lg transition-all disabled:opacity-50 disabled:scale-100 font-jetbrains"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
              <Link href="/admin/projects" className="flex items-center gap-2 px-8 py-4 rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] opacity-60 hover:opacity-100 text-xs font-bold uppercase tracking-widest transition-all font-jetbrains">
                Cancel
              </Link>
            </motion.div>
          </form>
      <ToastContainer toasts={toasts} onRemove={id => setToasts(p => p.filter(t => t.id !== id))} />
    </>
  );
}
