"use client";

import React from 'react';

interface HardButtonProps {
    label: React.ReactNode;
    active: boolean;
    onClick: () => void;
    color?: string;
}

export const HardButton = ({ label, active, onClick, color = "red" }: HardButtonProps) => {
    const activeColors: Record<string, string> = {
        red: 'from-red-600 to-red-800 border-red-900 text-white shadow-[0_0_15px_rgba(255,0,0,0.5),inset_0_0_5px_rgba(0,0,0,0.5)]',
        green: 'from-green-600 to-green-800 border-green-900 text-white shadow-[0_0_15px_rgba(0,255,0,0.5),inset_0_0_5px_rgba(0,0,0,0.5)]',
        blue: 'from-blue-600 to-blue-800 border-blue-900 text-white shadow-[0_0_15px_rgba(0,0,255,0.5),inset_0_0_5px_rgba(0,0,0,0.5)]',
        orange: 'from-orange-500 to-orange-700 border-orange-900 text-white shadow-[0_0_15px_rgba(255,165,0,0.5),inset_0_0_5px_rgba(0,0,0,0.5)]',
    };

    return (
        <button
            onClick={onClick}
            className={`
                h-10 px-4 rounded-sm border-t border-x border-b-2
                transition-all duration-100 active:translate-y-[1px] active:shadow-none
                font-bold text-[10px] tracking-widest uppercase flex items-center justify-center
                ${active
                    ? `bg-gradient-to-b ${activeColors[color]}`
                    : 'bg-gradient-to-b from-[#333] to-[#222] border-[#111] border-t-[#444] text-zinc-400 shadow-[0_4px_6px_rgba(0,0,0,0.3)] hover:text-zinc-200'
                }
            `}
        >
            {label}
        </button>
    )
};
