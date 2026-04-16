"use client";

import React from "react";

export interface NoiseProps extends React.HTMLAttributes<HTMLDivElement> {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
}

const Noise = ({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
  className,
  ...props
}: NoiseProps) => {
  return (
    <div
      className={className}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 ${patternSize} ${patternSize}' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity: patternAlpha / 100,
        pointerEvents: "none",
      }}
      {...props}
    />
  );
};

export default Noise;
