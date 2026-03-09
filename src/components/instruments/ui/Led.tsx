"use client";

import React from 'react';

interface LedProps {
    active: boolean;
    color?: string;
}

export const Led = ({ active, color = "#2ed573" }: LedProps) => (
    <div
        className={`w-2 h-2 rounded-full transition-all duration-75 border border-black/50 ${active ? 'opacity-100 bg-white' : 'opacity-30 bg-zinc-600'}`}
        style={{
            backgroundColor: active ? color : undefined,
            boxShadow: active ? `0 0 8px ${color}, inset 0 0 2px rgba(255,255,255,0.8)` : 'none'
        }}
    />
);
