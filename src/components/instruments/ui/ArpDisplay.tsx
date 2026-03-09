"use client";

import React, { memo } from 'react';
import { ArpGrid } from './ArpGrid';

export const ArpDisplay = memo(({ sequence, currentStep }: { sequence: (number | number[] | null)[], currentStep: number | null }) => {
    const totalSteps = Math.max(16, sequence.length);

    return (
        <div className="relative w-full h-full bg-[#050505] overflow-hidden rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,1)] border-8 border-zinc-800 border-b-zinc-700 border-t-zinc-900">
            <ArpGrid sequence={sequence} />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_4px,3px_100%] pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-radial-gradient(circle, transparent 60%, black 100%) opacity-50 pointer-events-none z-10"></div>
            {currentStep !== null && (
                <div
                    className="absolute top-0 bottom-0 bg-white/10 border-l border-white/30 z-10 transition-transform duration-75 shadow-[0_0_10px_white]"
                    style={{ width: `${100 / totalSteps}%`, left: 0, transform: `translateX(${currentStep * 100}%)` }}
                />
            )}
        </div>
    )
});

ArpDisplay.displayName = 'ArpDisplay';
