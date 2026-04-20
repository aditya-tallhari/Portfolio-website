'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel',
  isDangerous = false, isLoading = false, onConfirm, onCancel
}: ConfirmDialogProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-8 shadow-2xl"
          >
            <div className={`flex items-center gap-3 mb-4 ${isDangerous ? 'text-red-400' : 'text-[var(--accent-primary)]'}`}>
              <AlertTriangle size={20} />
              <h2 className="text-lg font-playfair font-black text-[var(--text-primary)]">{title}</h2>
            </div>
            <p className="text-sm text-[var(--text-primary)] opacity-60 mb-8 font-jetbrains leading-relaxed">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] opacity-70 hover:opacity-100 text-xs font-bold uppercase tracking-widest transition-all font-jetbrains"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 py-3 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 font-jetbrains ${
                  isDangerous ? 'bg-red-500 hover:bg-red-600' : 'bg-[var(--accent-primary)] hover:opacity-90'
                } disabled:opacity-50`}
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
