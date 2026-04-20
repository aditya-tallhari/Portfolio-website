'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Terminal, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;
  const canSubmit = emailValid && passwordValid && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="login-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#login-grid)" />
        </svg>
      </div>

      {/* Floating accents */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[var(--accent-primary)]/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-[var(--accent-primary)]/3 blur-[60px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Top accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
          className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent mb-8 origin-left"
        />

        {/* Card */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-3xl p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
              <Terminal size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent-primary)] font-jetbrains">Portfolio</p>
              <p className="text-lg font-playfair font-black text-[var(--text-primary)] leading-none">Admin CMS</p>
            </div>
          </div>

          <h1 className="text-3xl font-playfair font-black text-[var(--text-primary)] mb-2">Welcome Back</h1>
          <p className="text-[11px] uppercase tracking-widest text-[var(--text-primary)] opacity-40 mb-10 font-jetbrains">Sign in to access the dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60 mb-2 font-jetbrains">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-primary)] opacity-30" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(null); }}
                  onBlur={() => setTouched(p => ({ ...p, email: true }))}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3.5 bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-primary)] placeholder:opacity-20 focus:outline-none focus:border-[var(--accent-primary)] transition-colors text-sm font-jetbrains"
                  required
                />
              </div>
              <AnimatePresence>
                {touched.email && !emailValid && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-red-400 text-[10px] mt-1.5 flex items-center gap-1 font-jetbrains">
                    <AlertCircle size={10} /> Enter a valid email address
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] opacity-60 mb-2 font-jetbrains">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-primary)] opacity-30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(null); }}
                  onBlur={() => setTouched(p => ({ ...p, password: true }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3.5 bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-primary)] placeholder:opacity-20 focus:outline-none focus:border-[var(--accent-primary)] transition-colors text-sm font-jetbrains"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-primary)] opacity-30 hover:opacity-70 transition-opacity"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <AnimatePresence>
                {touched.password && !passwordValid && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-red-400 text-[10px] mt-1.5 flex items-center gap-1 font-jetbrains">
                    <AlertCircle size={10} /> Password must be at least 6 characters
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-jetbrains"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-4 rounded-xl bg-[var(--accent-primary)] text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed font-jetbrains"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Sign In
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--border-primary)] text-center">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-primary)] opacity-20 font-jetbrains">Secured Admin Access Only</p>
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent mt-8 origin-right"
        />
      </motion.div>
    </div>
  );
}
