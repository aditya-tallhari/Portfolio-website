"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 flex flex-col items-center max-w-md w-full text-center"
      >
        <h2 className="text-[var(--accent-primary)] font-jetbrains font-bold text-2xl mb-4">
           {"< SYSTEM ERROR />"}
        </h2>
        <p className="text-[var(--text-secondary)] mb-6 text-sm">
          A critical exception was caught by the system boundary. Our autonomous units have been notified.
        </p>
        <p className="text-[var(--text-primary)] mb-8 text-xs bg-[var(--bg-primary)] p-4 rounded text-left w-full overflow-x-auto whitespace-pre-wrap font-mono">
          {error.message || "Unknown rendering exception"}
        </p>
        <button
          onClick={() => reset()}
          className="border border-[var(--accent-primary)] text-[var(--accent-primary)] px-6 py-2 uppercase tracking-widest text-xs font-bold hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors"
        >
          [ REBOOT SYSTEM ]
        </button>
      </motion.div>
    </div>
  );
}
