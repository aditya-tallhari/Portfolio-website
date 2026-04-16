"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface GridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  squares?: [number, number][]
  strokeDasharray?: string
  className?: string
  [key: string]: any
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  squares,
  className,
  ...props
}: GridPatternProps) {
  const id = React.useId()

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-[var(--text-primary)] opacity-20",
        className,
      )}
      {...(props as any)}
    >
      <defs>
        <pattern height={height} id={id} patternUnits="userSpaceOnUse" width={width} x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" stroke="currentColor" strokeDasharray={strokeDasharray} />
        </pattern>
      </defs>
      <rect fill={`url(#${id})`} height="100%" strokeWidth={0} width="100%" />
      {squares && (
        <svg aria-label="Grid squares" className="overflow-visible" role="img" x={x} y={y}>
          {squares.map(([sqX, sqY], index) => (
            <rect
              fill="currentColor"
              height={height - 1}
              key={`${sqX}-${sqY}-${index}`}
              strokeWidth="0"
              width={width - 1}
              x={sqX * width + 1}
              y={sqY * height + 1}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

export type { GridPatternProps }

export default GridPattern
