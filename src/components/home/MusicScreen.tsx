"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { fetchRandomTrack, fetchPlaylist, Song } from "@/lib/api";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

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
  // playerKey forces a full ReactPlayer remount on track change, killing any AbortError
  const [playerKey, setPlayerKey] = useState(0);

  // Step 1: On mount, hit /random to get the initial song instantly
  useEffect(() => {
    const init = async () => {
      try {
        // Load a random song immediately to show something fast
        const { track } = await fetchRandomTrack();
        setCurrentSong(track);

        // In the background, load the full playlist for prev/next navigation
        const full = await fetchPlaylist();
        if (full && full.length > 0) {
          setPlaylist(full);
          // Find this song in the full list so index is correct
          const idx = full.findIndex((s) => s.url === track.url);
          setCurrentIndex(idx >= 0 ? idx : 0);
        }
      } catch (err) {
        console.error("Music init error:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Whenever index changes (prev/next), update currentSong and force player remount
  const goToIndex = useCallback((idx: number) => {
    if (playlist.length === 0) return;
    const safeIdx = (idx + playlist.length) % playlist.length;
    setCurrentIndex(safeIdx);
    setCurrentSong(playlist[safeIdx]);
    // Remounting the player prevents the AbortError race condition
    setPlayerKey((k) => k + 1);
  }, [playlist]);

  const nextTrack = useCallback(() => goToIndex(currentIndex + 1), [goToIndex, currentIndex]);
  const prevTrack = useCallback(() => goToIndex(currentIndex - 1), [goToIndex, currentIndex]);

  const handleTogglePlay = () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsPlaying((p) => !p);
  };

  // When a song naturally ends, advance and keep playing
  const handleEnded = useCallback(() => {
    goToIndex(currentIndex + 1);
    setIsPlaying(true);
  }, [goToIndex, currentIndex]);

  // If a video errors (deleted/unavailable), skip it
  const handleError = useCallback(() => {
    goToIndex(currentIndex + 1);
  }, [goToIndex, currentIndex]);

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
              ? "Synchronizing // Stream Active"
              : "System Idle // Waiting"}
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
                  src={currentSong?.cover}
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
            SRC: DB_PLAYLIST_JSON // INDEX: {currentIndex}
          </span>
        </div>
      </div>

      {/*
        Hidden ReactPlayer — positioned off-screen but large enough (250px) that
        Chrome doesn't auto-mute it as a "background" tab player.
        The `key` prop forces a full remount on every track change which
        completely eliminates the AbortError race condition.
      */}
      {currentSong && (
        <div
          style={{
            position: "absolute",
            width: "250px",
            height: "250px",
            bottom: "-100px",
            right: "-100px",
            opacity: 0.01,
            pointerEvents: "none",
          }}
        >
          <ReactPlayer
            key={playerKey}
            url={currentSong.url}
            playing={isPlaying}
            volume={1.0}
            width="100%"
            height="100%"
            playsinline
            onEnded={handleEnded}
            onError={handleError}
            config={{
              youtube: {
                playerVars: {
                  controls: 0,
                  modestbranding: 1,
                  origin:
                    typeof window !== "undefined"
                      ? window.location.origin
                      : "",
                },
              } as any,
            }}
          />
        </div>
      )}
    </motion.div>
  );
};
