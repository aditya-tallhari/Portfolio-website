"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BotMessageSquare, X, Send, User, RefreshCw, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { sendAIChat } from '@/lib/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-msg',
  role: 'ai',
  content: "Hey! I'm Aditya's AI Assistant. Ask me about his projects, experience, skills, or anything else!"
};

const SUGGESTIONS = [
  "Tell me about your projects",
  "What's your tech stack?",
  "Show me your GitHub"
];

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await sendAIChat(text.trim());
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.status === 'success' && data.data ? data.data.answer : (data.answer || data.message || "Sorry, I couldn't understand that.")
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Sorry, I'm having trouble connecting right now. Please try again later."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pointer-events-auto w-[calc(100vw-48px)] sm:w-[300px] h-[420px] max-h-[calc(100vh-80px)] glass-card flex flex-col overflow-hidden mb-4 rounded-xl shadow-2xl border border-[var(--text-primary)]/10"
              style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary) 95%, transparent)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--text-primary)]/10 shrink-0 bg-[var(--bg-primary)]/50">
                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7 rounded-full bg-[var(--text-primary)]/10 flex items-center justify-center p-[1px] shadow-sm">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-[var(--bg-primary)]">
                       <Image 
                         src="/fly.svg" 
                         alt="Aditya AI" 
                         fill 
                         className="object-cover scale-110" 
                       />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-[var(--bg-primary)] rounded-full"></span>
                  </div>
                  <h3 className="font-playfair font-bold text-sm tracking-tight">Aditya's AI</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleClear} 
                    className="p-1 rounded-full hover:bg-[var(--text-primary)]/10 transition-colors text-[var(--text-primary)]/60 hover:text-[var(--text-primary)]"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full hover:bg-[var(--text-primary)]/10 transition-colors text-[var(--text-primary)]/60 hover:text-[var(--text-primary)]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Chat Area */}
              <div 
                data-lenis-prevent={true}
                className="flex-1 overflow-y-auto overscroll-contain p-3 p-y-2 flex flex-col gap-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--text-primary)]/10 [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col max-w-[90%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'} group relative`}
                  >
                    <div 
                      className={`px-3 py-2 rounded-xl text-[12px] leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border border-[var(--bg-primary)]/10 rounded-br-sm' 
                          : 'bg-[var(--text-primary)]/5 text-[var(--text-primary)] border border-[var(--text-primary)]/10 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === 'ai' && msg.id !== 'init-msg' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="absolute -right-6 top-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-primary)] rounded-md border border-[var(--text-primary)]/10 text-[var(--text-primary)]/60 hover:text-[var(--text-primary)]"
                      >
                        {copiedId === msg.id ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5" />}
                      </button>
                    )}
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="self-start px-3 py-2 rounded-xl rounded-bl-sm bg-[var(--text-primary)]/5 border border-[var(--text-primary)]/10 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-[var(--text-primary)]/50 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1 h-1 rounded-full bg-[var(--text-primary)]/50 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1 h-1 rounded-full bg-[var(--text-primary)]/50 animate-bounce"></span>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {messages.length === 1 && (
                <div className="px-3 pb-2 flex flex-wrap gap-1">
                  {SUGGESTIONS.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(suggestion)}
                      className="text-[9px] px-2 py-0.5 rounded-full border border-[var(--text-primary)]/20 text-[var(--text-primary)]/70 hover:bg-[var(--text-primary)]/10 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 border-t border-[var(--text-primary)]/10 bg-[var(--bg-primary)]/80 backdrop-blur-md shrink-0">
                <div className="relative flex items-center shadow-sm">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask..."
                    className="w-full pl-3 pr-8 py-2 rounded-full bg-[var(--text-primary)]/5 border border-[var(--text-primary)]/20 text-[12px] focus:outline-none focus:border-[var(--text-primary)]/50 transition-colors font-jetbrains"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-1 p-1 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto relative w-10 h-10 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 overflow-hidden group border border-[var(--bg-primary)]/20"
        >
          <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 w-full h-full flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-[#D4AF37]/20"></div>
                <Image 
                  src="/fly.svg" 
                  alt="Chat" 
                  fill 
                  className="object-cover scale-[1.1] rounded-full drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                />
                {/* Notification Ping */}
                <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--text-primary)] rounded-full z-20"></span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  );
};
