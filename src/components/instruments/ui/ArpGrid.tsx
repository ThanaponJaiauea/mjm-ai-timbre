"use client";

import React, { useMemo, memo } from 'react';

export const ArpGrid = memo(({ sequence }: { sequence: (number | number[] | null)[] }) => {
    const totalSteps = Math.max(16, sequence.length);
    const validNotes = sequence.flatMap(n => Array.isArray(n) ? n : [n]).filter((n): n is number => n !== null);
    const pitchRange = useMemo(() => {
        if (validNotes.length === 0) return Array.from({ length: 25 }, (_, i) => 72 - i);
        const min = Math.min(48, Math.min(...validNotes) - 4);
        const max = Math.max(84, Math.max(...validNotes) + 4);
        return Array.from({ length: max - min + 1 }, (_, i) => max - i);
    }, [sequence, validNotes]);

    return (
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)`, gridTemplateRows: `repeat(${pitchRange.length}, 1fr)` }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
                    backgroundSize: `${100 / totalSteps}% ${100 / pitchRange.length}%`
                }}
            />
            {pitchRange.map(pitch => (
                Array.from({ length: totalSteps }).map((_, step) => {
                    const note = sequence[step];
                    const isOn = Array.isArray(note) ? note.includes(pitch) : note === pitch;
                    return (
                        <div key={`${pitch}-${step}`} className={`${isOn ? 'bg-[#2ed573] shadow-[0_0_10px_#2ed573,0_0_20px_#2ed573]' : ''} border-r border-b border-white/5`}></div>
                    )
                })
            ))}
        </div>
    );
});

ArpGrid.displayName = 'ArpGrid';
