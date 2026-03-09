"use client";

import React from 'react';

interface ScrewProps {
    className?: string;
}

export const Screw = ({ className }: ScrewProps) => (
    <div className={`w-3 h-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,#666,#111)] shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center border border-[#111] ${className}`}>
        <div className="w-[80%] h-[1px] bg-[#1a1a1a] rotate-45"></div>
        <div className="w-[80%] h-[1px] bg-[#1a1a1a] -rotate-45 absolute"></div>
    </div>
);
