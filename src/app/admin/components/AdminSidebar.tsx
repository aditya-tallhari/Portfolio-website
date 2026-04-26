'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, Briefcase, Code2,
  MessageSquare, BarChart3, LogOut, Menu, X, Terminal, ChevronRight, GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { href: '/admin/education', icon: GraduationCap, label: 'Education' },
  { href: '/admin/github', icon: Code2, label: 'GitHub Stats' },
  { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-primary)]">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border-primary)]">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center shrink-0">
            <Terminal size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--accent-primary)] font-jetbrains">Admin</p>
            <p className="text-sm font-playfair font-black text-[var(--text-primary)] leading-none">CMS Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group font-jetbrains ${
                isActive
                  ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20'
                  : 'text-[var(--text-primary)] opacity-60 hover:opacity-100 hover:bg-[var(--text-primary)]/[0.04]'
              }`}
            >
              <item.icon size={16} className={isActive ? 'text-[var(--accent-primary)]' : ''} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={12} />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-[var(--border-primary)]">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--text-primary)]/[0.04] mb-2">
          <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-black text-[var(--accent-primary)] font-jetbrains">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[var(--text-primary)] truncate font-jetbrains">{user?.name || 'Admin'}</p>
            <p className="text-[9px] text-[var(--text-primary)] opacity-40 truncate font-jetbrains">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-xs font-bold uppercase tracking-widest font-jetbrains"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(p => !p)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)]"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
