'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MailOpen, Trash2, Search, Clock, User, AtSign } from 'lucide-react';

import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast, ToastContainer, createToastHelpers } from '../components/Toast';

// Messages are fetched from the admin endpoint with auth token
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aditya-tallhari-portfolio.vercel.app/api/v1';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  status?: 'read' | 'unread';
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [search, setSearch] = useState('');
  const toast = createToastHelpers(setToasts);

  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/messages/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setMessages(data.data || data.messages || []);
    } catch {
      toast.error('Failed to load messages. Ensure you are logged in.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadMessages(); }, []);

  const markRead = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/messages/admin/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status: 'read' } : m));
    } catch {
      toast.error('Failed to update message status');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await fetch(`${API_BASE_URL}/messages/admin/${deleteTarget}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(prev => prev.filter(m => m._id !== deleteTarget));
      if (selected?._id === deleteTarget) setSelected(null);
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = messages.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.message?.toLowerCase().includes(search.toLowerCase())
  );
  const unreadCount = messages.filter(m => m.status !== 'read').length;

  return (
    <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-jetbrains mb-1">Inbox</p>
              <h1 className="text-3xl font-playfair font-black text-[var(--text-primary)] flex items-center gap-3">
                Messages
                {unreadCount > 0 && (
                  <span className="text-sm px-2.5 py-1 rounded-full bg-[var(--accent-primary)] text-white font-jetbrains font-black">{unreadCount}</span>
                )}
              </h1>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-8 max-w-md">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-primary)] opacity-30" />
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--text-primary)]/[0.04] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-primary)] placeholder:opacity-30 focus:outline-none focus:border-[var(--accent-primary)] transition-colors text-sm font-jetbrains"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Message List */}
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] animate-pulse" />)
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-[var(--text-primary)] opacity-30 font-jetbrains text-xs uppercase tracking-widest">
                  No messages found
                </div>
              ) : (
                filtered.map((msg, i) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => { setSelected(msg); if (msg.status !== 'read') markRead(msg._id); }}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      selected?._id === msg._id
                        ? 'border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/5'
                        : 'border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/20'
                    } ${msg.status !== 'read' ? 'ring-1 ring-[var(--accent-primary)]/20' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {msg.status !== 'read'
                          ? <Mail size={14} className="text-[var(--accent-primary)] shrink-0" />
                          : <MailOpen size={14} className="text-[var(--text-primary)] opacity-30 shrink-0" />
                        }
                        <span className={`text-sm font-bold font-jetbrains ${msg.status !== 'read' ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)] opacity-60'}`}>
                          {msg.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={e => { e.stopPropagation(); setDeleteTarget(msg._id); }}
                          className="p-1.5 rounded-lg bg-red-500/0 hover:bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-[var(--text-primary)] opacity-40 font-jetbrains flex items-center gap-1 mb-2">
                      <AtSign size={9} /> {msg.email}
                    </p>
                    <p className="text-xs text-[var(--text-primary)] opacity-50 font-jetbrains line-clamp-2 leading-relaxed">{msg.message}</p>
                    <p className="text-[9px] text-[var(--text-primary)] opacity-20 mt-2 font-jetbrains flex items-center gap-1">
                      <Clock size={8} /> {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
              )}
            </div>

            {/* Message Detail */}
            {selected ? (
              <motion.div
                key={selected._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] h-fit sticky top-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User size={14} className="text-[var(--accent-primary)]" />
                      <h3 className="font-black text-[var(--text-primary)] font-playfair">{selected.name}</h3>
                    </div>
                    <p className="text-xs text-[var(--text-primary)] opacity-40 font-jetbrains">{selected.email}</p>
                  </div>
                  <button onClick={() => setDeleteTarget(selected._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="h-[1px] bg-[var(--border-primary)] mb-6" />

                <div className="bg-[var(--text-primary)]/[0.02] rounded-xl p-5 mb-6">
                  <p className="text-sm text-[var(--text-primary)] opacity-70 font-jetbrains leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                <p className="text-[10px] text-[var(--text-primary)] opacity-20 font-jetbrains flex items-center gap-1">
                  <Clock size={10} /> Received {new Date(selected.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center p-16 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] opacity-20">
                <Mail size={32} className="mb-3" />
                <p className="text-xs uppercase tracking-widest font-jetbrains">Select a message to read</p>
              </div>
            )}
          </div>
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Message"
        message="Are you sure want to delete this message? This cannot be undone."
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
