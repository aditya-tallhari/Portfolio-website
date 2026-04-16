"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { fetchRandomTrack, Song } from "@/lib/api";

interface MusicScreenProps {
  onBack: () => void;
}

const SpeechBubble = ({
  children,
  direction = "right",
  className = "",
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  className?: string;
}) => (
  <div
    className={`relative bg-[#FFFCF0] text-[#1a1a2e] border-[1px] border-black shadow-[1.5px_1.5px_0_0_rgba(0,0,0,1)] px-2 py-1 ${className}`}
    style={{ fontFamily: "'Courier New', Courier, monospace" }}
  >
    {children}
    {direction === "right" && (
      <>
        <div className="absolute -bottom-[4px] left-2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-black" />
        <div className="absolute -bottom-[2.5px] left-[2.2px] w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-t-[3.5px] border-t-[#FFFCF0]" />
      </>
    )}
  </div>
);

export const MusicScreen: React.FC<MusicScreenProps> = ({ onBack }) => {
  const [song, setSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  const nextTrack = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRandomTrack();
      setSong(data.track);
      // We'll set playing true, but browser might block until interaction if we are unlucky
      setIsPlaying(true);
    } catch (error) {
      console.error("Music fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    nextTrack();
    return () => setIsPlaying(false);
  }, [nextTrack]);

  const handleTogglePlay = () => {
    setHasInteracted(true);
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      key="music"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
    >
      <img
        src="/bg-image.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#1a1a2e]/60 z-0" />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-1 p-2">
        
        {/* Back control */}
        <div className="absolute top-1 left-2">
           <button 
            onClick={onBack}
            className="flex items-center gap-0.5 text-[4px] font-black uppercase text-[#FFFCF0]/80 hover:text-[#FFFCF0]"
          >
            ◀ BACK
          </button>
        </div>

        {/* Song Info Bubble */}
        <SpeechBubble className="min-w-[110px] max-w-[130px] border-[1.5px] shadow-[1.5px_1.5px_0_0_rgba(0,0,0,1)] px-2 py-1">
          <div className="absolute -top-1.5 right-2 bg-[#c2410c] text-white text-[3px] px-1 py-0.5 font-bold uppercase tracking-[0.2em]">
            Now Playing
          </div>
          
          <div className="flex gap-2 items-center">
            {/* Cover Art */}
            <div className="relative w-8 h-8 border-[1px] border-black/20 overflow-hidden bg-black flex-shrink-0 shadow-[1px_1px_0_0_rgba(0,0,0,1)]">
               {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                   <div className="w-2 h-2 border-[1px] border-black border-t-transparent rounded-full animate-spin" />
                </div>
               ) : (
                <img src={song?.cover} className="w-full h-full object-cover" alt="cover" />
               )}
            </div>

            {/* Title & Artist */}
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <h2 className="text-[4px] font-black text-[#1a1a2e] uppercase leading-tight truncate">
                {song?.title || "..."}
              </h2>
              <p className="text-[3px] font-bold text-[#c2410c] uppercase truncate">
                {song?.channel || "..."}
              </p>
            </div>
          </div>
        </SpeechBubble>

        {/* Controls Bubble */}
        <SpeechBubble direction="left" className="min-w-[90px] max-w-[110px] border-[1px] shadow-[1px_1px_0_0_rgba(0,0,0,1)] px-2 py-0.5">
          <div className="flex items-center justify-around w-full">
            <button 
              onClick={handleTogglePlay}
              className="flex items-center gap-1 text-[4px] font-black uppercase text-[#1a1a2e] hover:text-[#c2410c]"
            >
              {!hasInteracted && !isPlaying ? "▶ UNMUTE" : isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
            </button>
            <div className="w-[0.5px] h-2.5 bg-black/10" />
            <button 
              onClick={nextTrack}
              className="flex items-center gap-1 text-[4px] font-black uppercase text-[#1a1a2e] hover:text-[#c2410c]"
            >
              NEXT ⏭
            </button>
          </div>
        </SpeechBubble>

        {/* Status */}
        <div className="mt-1 flex items-center gap-1.5 opacity-60">
          <div className="w-12 h-0.5 bg-black/20 rounded-full overflow-hidden">
            <motion.div 
              animate={isPlaying ? { x: ["-100%", "0%"] } : {}}
              transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-[#c2410c]"
            />
          </div>
          <span className="text-[2.5px] font-mono text-black font-black tracking-tighter">
            {isPlaying ? "AUDIO_PLAYING // 320KBPS" : "AUDIO_PAUSED // IDLE"}
          </span>
        </div>
      </div>

      {/* 
          IMPORTANT: Use inline styles instead of tailwind classes that might 
          be optimized away or blocked. 
      */}
      {song && (
        <div style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}>
          <ReactPlayer
            url={song.url}
            playing={isPlaying}
            volume={0.8}
            onEnded={nextTrack}
            playsinline={true}
            config={{
              youtube: {
                playerVars: { 
                  autoplay: 1, 
                  controls: 0,
                  modestbranding: 1
                }
              }
            }}
            onError={(e: any) => console.error("Player error:", e)}
          />
        </div>
      )}
    </motion.div>
  );
};
