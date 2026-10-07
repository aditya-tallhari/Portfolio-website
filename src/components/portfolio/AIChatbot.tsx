"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, RefreshCw, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { sendAIChat } from '@/lib/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-msg',
  role: 'ai',
  content: "Hi! I'm Aditya AI, your personal guide to Aditya Tallare's portfolio. How can I help you today?"
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
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const conversation = [...messages.filter(message => message.id !== 'init-msg'), userMessage]
        .slice(-12)
        .map(({ role, content }) => ({ role: role === 'ai' ? 'assistant' as const : 'user' as const, content }));
      const data = await sendAIChat(conversation);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.status === 'success' && data.data ? data.data.answer : (data.answer || data.message || "Sorry, I couldn't understand that.")
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMsg = error.message || "Sorry, I'm having trouble connecting right now. Please try again later.";
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: errorMsg
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
      <div className="fixed bottom-3 right-3 z-[9999] flex flex-col items-end pointer-events-none sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pointer-events-auto w-[calc(100vw-24px)] sm:w-[380px] md:w-[440px] h-[min(76dvh,680px)] sm:h-[min(72dvh,680px)] max-h-[calc(100dvh-84px)] glass-card flex flex-col overflow-hidden mb-3 sm:mb-4 rounded-2xl shadow-2xl border border-[var(--text-primary)]/15"
              style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary) 95%, transparent)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--text-primary)]/10 shrink-0 bg-[var(--bg-primary)]/50">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full bg-[var(--text-primary)]/10 flex items-center justify-center p-[1px] shadow-sm">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-[var(--bg-primary)]">
                       <Image 
                         src="/fly.svg" 
                         alt="Aditya AI" 
                         fill 
                         sizes="36px"
                         className="object-cover scale-110" 
                       />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-[var(--bg-primary)] rounded-full"></span>
                  </div>
                  <h3 className="font-playfair font-bold text-base tracking-tight">Aditya AI Assistant</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleClear} 
                    aria-label="Clear conversation"
                    className="p-2 rounded-full hover:bg-[var(--text-primary)]/10 transition-colors text-[var(--text-primary)]/60 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                    className="p-2 rounded-full hover:bg-[var(--text-primary)]/10 transition-colors text-[var(--text-primary)]/60 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Area */}
              <div 
                data-lenis-prevent={true}
                className="flex-1 overflow-y-auto overscroll-contain p-4 flex flex-col gap-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--text-primary)]/15 [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col max-w-[96%] sm:max-w-[92%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'} group relative`}
                  >
                    <div 
                      className={`px-4 py-3 rounded-2xl text-sm leading-6 font-sans shadow-sm break-words ${
                        msg.role === 'user' 
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border border-[var(--bg-primary)]/10 rounded-br-sm' 
                          : 'bg-[var(--text-primary)]/5 text-[var(--text-primary)] border border-[var(--text-primary)]/10 rounded-bl-sm'
                      }`}
                    >
                      {msg.role === 'ai' ? (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            h1: ({ children }) => <h1 className="mb-2 text-lg font-bold leading-snug">{children}</h1>,
                            h2: ({ children }) => <h2 className="mb-2 text-base font-bold leading-snug">{children}</h2>,
                            h3: ({ children }) => <h3 className="mb-2 text-sm font-bold leading-snug">{children}</h3>,
                            ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
                            li: ({ children }) => <li className="pl-0.5">{children}</li>,
                            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                            a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2 decoration-[var(--accent-primary)]">{children}</a>,
                            pre: ({ children }) => <pre className="my-2 overflow-x-auto rounded-lg bg-black/20 p-3 text-xs leading-5">{children}</pre>,
                            code: ({ children, className }) => <code className={`${className || ''} rounded bg-black/15 px-1 py-0.5 font-mono text-[0.9em]`}>{children}</code>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : msg.content}
                    </div>
                    {msg.role === 'ai' && msg.id !== 'init-msg' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="absolute -right-2 top-1 p-1 opacity-100 sm:-right-6 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-[var(--bg-primary)] rounded-md border border-[var(--text-primary)]/10 text-[var(--text-primary)]/60 hover:text-[var(--text-primary)]"
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
                    className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--text-primary)]/20 text-[var(--text-primary)]/70 hover:bg-[var(--text-primary)]/10 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-[var(--text-primary)]/10 bg-[var(--bg-primary)]/80 backdrop-blur-md shrink-0">
                <div className="relative flex items-center shadow-sm">
                  <input
                    ref={inputRef}
                    type="text"
                    maxLength={1200}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask..."
                    className="w-full pl-4 pr-12 py-3 rounded-full bg-[var(--text-primary)]/5 border border-[var(--text-primary)]/20 text-sm focus:outline-none focus:border-[var(--text-primary)]/50 focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/60 transition-colors"
                  />
                  <button
                    onClick={() => handleSend()}
                    aria-label="Send message"
                    disabled={!input.trim() || isTyping}
                    className="absolute right-1.5 p-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] hover:scale-105 active:scale-95 disabled:opacity-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          className="pointer-events-auto relative w-12 h-12 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 overflow-hidden group border border-[var(--bg-primary)]/20"
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
                  sizes="48px"
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
