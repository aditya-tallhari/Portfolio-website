'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ExternalLink, Code2, Star } from 'lucide-react';

import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast, ToastContainer, createToastHelpers } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { fetchProjects, deleteProject, Project } from '@/lib/api';

export default function ProjectsPage() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [search, setSearch] = useState('');
  const toast = createToastHelpers(setToasts);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data || []);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteTarget, token);
      setProjects(prev => prev.filter(p => p._id !== deleteTarget));
      toast.success('Project deleted successfully');
    } catch {
      toast.error('Failed to delete project');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-jetbrains mb-1">Content</p>
              <h1 className="text-3xl font-playfair font-black text-[var(--text-primary)]">Projects</h1>
            </div>
            <Link
              href="/admin/projects/add"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-black uppercase tracking-widest hover:scale-105 hover:shadow-lg transition-all font-jetbrains"
            >
              <Plus size={14} /> Add Project
            </Link>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md mb-8 px-4 py-3 rounded-xl bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-primary)] placeholder:opacity-30 focus:outline-none focus:border-[var(--accent-primary)] transition-colors text-sm font-jetbrains"
          />

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-primary)] opacity-30">
              <p className="text-xs uppercase tracking-widest font-jetbrains">No projects found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((project, i) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/30 transition-all duration-300 flex flex-col gap-4"
                >
                  {/* Project image */}
                  {(project.imageUrl || (project as any).image) && (
                    <div className="h-32 rounded-xl overflow-hidden bg-[var(--text-primary)]/[0.04]">
                      <img src={project.imageUrl || (project as any).image} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-black text-[var(--text-primary)] font-jetbrains group-hover:text-[var(--accent-primary)] transition-colors leading-tight">
                        {project.title}
                      </h3>
                      {project.isFeatured && (
                        <Star size={12} className="text-yellow-400 shrink-0 mt-0.5" fill="currentColor" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-primary)] opacity-50 font-jetbrains line-clamp-2 leading-relaxed mb-3">
                      {project.description}
                    </p>
                    {/* Tech badges */}
                    <div className="flex flex-wrap gap-1">
                      {project.techStack?.slice(0, 4).map((tech, j) => (
                        <span key={j} className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold font-jetbrains">
                          {tech}
                        </span>
                      ))}
                      {project.techStack?.length > 4 && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--text-primary)]/[0.04] text-[var(--text-primary)] opacity-40 font-jetbrains">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-primary)]">
                    {project.links?.github && (
                      <a href={project.links.github} target="_blank" className="p-2 rounded-lg hover:bg-[var(--text-primary)]/[0.04] transition-colors text-[var(--text-primary)] opacity-40 hover:opacity-80">
                        <Code2 size={14} />
                      </a>
                    )}
                    {project.links?.live && (
                      <a href={project.links.live} target="_blank" className="p-2 rounded-lg hover:bg-[var(--text-primary)]/[0.04] transition-colors text-[var(--text-primary)] opacity-40 hover:opacity-80">
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <div className="flex-1" />
                    <Link href={`/admin/projects/${project._id}`} className="p-2 rounded-lg bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 transition-colors text-[var(--accent-primary)]">
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(project._id!)}
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
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
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
