"use client";
import { NoiseProps } from "@/components/ui/noise";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import React from "react";

const Noise = dynamic(() => import("@/components/ui/noise"), {
  ssr: false,
});

export const BackgroundNoise = ({ className, ...props }: NoiseProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none fixed top-0 left-0 size-full overflow-hidden z-[-1]",
        className,
      )}
    >
      <Noise
        patternSize={250}
        patternScaleX={1}
        patternScaleY={1}
        patternRefreshInterval={2}
        patternAlpha={15}
        className="size-full"
        {...props}
      />
    </div>
  );
};

export const BackgroundGridAnimated = () => {
  return (
    <motion.div
      className="absolute inset-0 size-full z-[-1]"
      animate={{
        backgroundPosition: ["0px 0px", "60px 60px"],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundImage: `linear-gradient(to right, var(--border-primary) 1px, transparent 1px),
                      linear-gradient(to bottom, var(--border-primary) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />
  );
};
