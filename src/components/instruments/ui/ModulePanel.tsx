"use client";

import React from 'react';

interface ModulePanelProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const ModulePanel = ({ title, children, className = "" }: ModulePanelProps) => (
    <div className={`
        relative bg-[#2a2a2a] rounded p-4 pt-6
        border border-[#111]
        shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-1px_-1px_1px_rgba(255,255,255,0.05)]
        ${className}
    `}>
        <div className="absolute -top-2.5 left-3 bg-[#222] px-2 py-0.5 border border-[#111] rounded-sm shadow-md z-10">
            <span className="text-[10px] font-mono font-black text-[#888] tracking-[0.2em] uppercase text-shadow-sm">
                {title}
            </span>
        </div>
        {children}
    </div>
);
