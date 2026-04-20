'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  const icons = {
    success: <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />,
    error: <AlertCircle size={16} className="text-red-400 shrink-0" />,
    info: <Info size={16} className="text-blue-400 shrink-0" />,
  };
  const borders = { success: 'border-emerald-500/20', error: 'border-red-500/20', info: 'border-blue-500/20' };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-xl bg-[var(--bg-secondary)] border ${borders[toast.type]} shadow-xl`}
          >
            {icons[toast.type]}
            <p className="text-xs text-[var(--text-primary)] font-jetbrains flex-1 leading-relaxed">{toast.message}</p>
            <button onClick={() => onRemove(toast.id)} className="text-[var(--text-primary)] opacity-30 hover:opacity-70 transition-opacity shrink-0">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast hook
let toastId = 0;
type SetToastsFn = React.Dispatch<React.SetStateAction<Toast[]>>;

export const createToastHelpers = (setToasts: SetToastsFn) => ({
  success: (message: string) => {
    const id = String(++toastId);
    setToasts(p => [...p, { id, type: 'success', message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  },
  error: (message: string) => {
    const id = String(++toastId);
    setToasts(p => [...p, { id, type: 'error', message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 5000);
  },
  info: (message: string) => {
    const id = String(++toastId);
    setToasts(p => [...p, { id, type: 'info', message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  },
});
