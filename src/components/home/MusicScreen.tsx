"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fetchRandomTrack, fetchPlaylist, Song } from "@/lib/api";

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

// Animated Equalizer Bars
const Equalizer = ({ isPlaying }: { isPlaying: boolean }) => (
  <div className="flex items-end gap-[1px] h-3 w-8 mb-1">
    {[0.6, 1.0, 0.7, 1.2, 0.8, 0.9].map((speed, i) => (
      <motion.div
        key={i}
        animate={isPlaying ? {
          height: ["2px", "10px", "4px", "12px", "2px"]
        } : { height: "2px" }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.1,
        }}
        className="w-1 bg-[#c2410c]"
      />
    ))}
  </div>
);

export const MusicScreen: React.FC<MusicScreenProps> = ({ onBack }) => {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Step 1: On mount, load initial random track and playlist
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const randomData = await fetchRandomTrack();
        
        if (randomData && randomData.track) {
          setCurrentSong(randomData.track);
        }

        const full = await fetchPlaylist();
        if (full && full.length > 0) {
          setPlaylist(full);
          if (randomData && randomData.track) {
            const idx = full.findIndex((s) => s.url === randomData.track.url);
            setCurrentIndex(idx >= 0 ? idx : 0);
          }
        }
      } catch (err) {
        console.warn("Music initialization error. Using offline fallback.", err instanceof Error ? err.message : "");
        const fallbackSong = {
          id: 1,
          title: "Offline System Track",
          url: "",
          cover: "",
          channel: "Local Cache"
        };
        setPlaylist([fallbackSong]);
        setCurrentSong(fallbackSong);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Sync play/pause with state - Improved for "audible" playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Ensure volume is up
    audio.volume = 1.0;

    const attemptPlay = async () => {
      if (isPlaying && hasInteracted) {
        try {
          // Some browsers need a tiny delay or it might error if src just changed
          await audio.play();
        } catch (error: any) {
          if (error.name !== "AbortError") {
            console.error("Playback failed:", error);
            // If it's a cross-origin or codec issue, we might want to skip
            if (error.name === "NotAllowedError") {
              setHasInteracted(false); // Reset to show "START" button
              setIsPlaying(false);
            }
          }
        }
      } else {
        audio.pause();
      }
    };

    attemptPlay();
  }, [isPlaying, hasInteracted, currentSong?.url]); // Dependent on url change

  const goToIndex = useCallback((idx: number) => {
    if (playlist.length === 0) return;
    const safeIdx = (idx + playlist.length) % playlist.length;
    setCurrentIndex(safeIdx);
    setCurrentSong(playlist[safeIdx]);
  }, [playlist]);

  const nextTrack = useCallback(() => goToIndex(currentIndex + 1), [goToIndex, currentIndex]);
  const prevTrack = useCallback(() => goToIndex(currentIndex - 1), [goToIndex, currentIndex]);

  const handleTogglePlay = () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsPlaying((p) => !p);
  };

  const handleEnded = useCallback(() => {
    nextTrack();
  }, [nextTrack]);

  const handleError = useCallback((err: any) => {
    console.warn("Audio error, skipping track:", err);
    setTimeout(nextTrack, 1000);
  }, [nextTrack]);

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
      <div className="absolute inset-0 bg-[#1a1a2e]/60 z-0" />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-1 p-2">
        {/* Back button */}
        <div className="absolute top-1 left-2">
          <button
            onClick={onBack}
            className="flex items-center gap-0.5 text-[4px] font-black uppercase text-[#FFFCF0]/80 hover:text-[#FFFCF0]"
          >
            ◀ BACK
          </button>
        </div>

        {/* EQ Visualizer */}
        <div className="flex flex-col items-center mb-1">
          <Equalizer isPlaying={isPlaying} />
          <p className="text-[3px] font-mono text-white/40 uppercase tracking-widest leading-none">
            {loading
              ? "Initializing..."
              : isPlaying
              ? " Stream Active"
              : "Waiting"}
          </p>
        </div>

        {/* Song Info Bubble */}
        <SpeechBubble className="min-w-[120px] max-w-[140px] border-[1.5px] shadow-[1.5px_1.5px_0_0_rgba(0,0,0,1)] px-2 py-1.5">
          <div className="absolute -top-1.5 right-2 bg-[#c2410c] text-white text-[3px] px-1 py-0.5 font-bold uppercase tracking-[0.2em]">
            Now Playing
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative w-10 h-10 border-[1px] border-black/20 overflow-hidden bg-black flex-shrink-0 shadow-[1px_1px_0_0_rgba(0,0,0,1)]">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 border-[1px] border-black border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <img
                  src={currentSong?.cover || "/music-placeholder.jpg"}
                  className="w-full h-full object-cover"
                  alt="cover"
                />
              )}
            </div>

            <div className="flex flex-col justify-center min-w-0 flex-1">
              <h2 className="text-[4.5px] font-black text-[#1a1a2e] uppercase leading-tight truncate">
                {currentSong?.title || "No Track Selected"}
              </h2>
              <p className="text-[3.5px] font-bold text-[#c2410c] uppercase truncate">
                {currentSong?.channel || "Unknown Source"}
              </p>
            </div>
          </div>
        </SpeechBubble>

        {/* Controls Bubble */}
        <SpeechBubble
          direction="left"
          className="min-w-[100px] max-w-[120px] border-[1px] shadow-[1px_1px_0_0_rgba(0,0,0,1)] px-2 py-1"
        >
          <div className="flex items-center justify-between w-full">
            <button
              onClick={prevTrack}
              className="text-[4px] font-black uppercase text-[#1a1a2e] hover:text-[#c2410c]"
            >
              ⏮
            </button>
            <div className="w-[0.5px] h-3 bg-black/10" />
            <button
              onClick={handleTogglePlay}
              className="px-2 text-[4px] font-black uppercase text-[#1a1a2e] hover:text-[#c2410c]"
            >
              {!hasInteracted && !isPlaying ? "▶ START" : isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
            </button>
            <div className="w-[0.5px] h-3 bg-black/10" />
            <button
              onClick={nextTrack}
              className="text-[4px] font-black uppercase text-[#1a1a2e] hover:text-[#c2410c]"
            >
              ⏭
            </button>
          </div>
        </SpeechBubble>

        <div className="mt-2 flex items-center gap-1.5 opacity-60">
          <span className="text-[2.5px] font-mono text-[#FFFCF0] font-black tracking-tighter">
            {/* SRC: DEEZER_API // INDEX: {currentIndex} */}
          </span>
        </div>
      </div>

      {/* Hidden HTML5 Audio Element */}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.url}
          onEnded={handleEnded}
          onError={handleError}
          preload="auto"
        />
      )}
    </motion.div>
  );
};
