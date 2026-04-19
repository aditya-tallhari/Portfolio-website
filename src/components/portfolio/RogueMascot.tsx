"use client";

import React from "react";

export const RogueMascot = ({ className }: { className?: string }) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <img 
        src="/64d452a749a58717c1f2c9b0_Rogue.svg" 
        alt="Rogue Mascot" 
        className="w-full h-full object-contain block"
      />
    </div>
  );
};
