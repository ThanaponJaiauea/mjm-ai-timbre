"use client";

import React from 'react';

interface StepButtonProps {
    index: number;
    active: boolean;
    current: boolean;
    onClick: () => void;
}

export const StepButton = ({ index, active, current, onClick }: StepButtonProps) => {
    const isAccent = index % 4 === 0;
    return (
        <div className="flex flex-col items-center gap-0.5 md:gap-1">
            <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full border border-black/50 transition-all duration-75 ${current ? 'bg-red-500 shadow-[0_0_8px_#f00]' : active ? 'bg-red-900/50' : 'bg-[#111]'}`}></div>
            <button
                onClick={onClick}
                className={`
          w-6 md:w-8 h-8 md:h-12 rounded-[2px] relative overflow-hidden transition-transform active:scale-[0.98]
          border-b-[3px] md:border-b-[4px] border-r-[1px] border-l-[1px] border-t-[1px]
          ${active
                        ? isAccent
                            ? 'bg-[#ff9f43] border-[#d35400] shadow-[0_0_10px_rgba(255,159,67,0.4)]'
                            : 'bg-[#fffa65] border-[#f1c40f] shadow-[0_0_10px_rgba(255,250,101,0.4)]'
                        : 'bg-[#333] border-[#111] shadow-inner'
                    }
        `}
            >
                <div className={`absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none ${active ? 'opacity-100' : 'opacity-10'}`}></div>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-black text-black/50">{index + 1}</div>
            </button>
        </div>
    );
};
