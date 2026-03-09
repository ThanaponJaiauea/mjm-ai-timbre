"use client";

import React, { useState, useRef, useEffect, memo } from 'react';

interface KnobProps {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    color?: string;
    size?: number;
}

export const Knob = memo(({ label, value, min, max, onChange, color = "#2ed573", size = 60 }: KnobProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const startVal = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        startY.current = e.clientY;
        startVal.current = value;
        document.body.style.cursor = 'ns-resize';
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaY = startY.current - e.clientY;
            const range = max - min;
            const deltaVal = (deltaY / 150) * range;
            let newVal = startVal.current + deltaVal;
            newVal = Math.max(min, Math.min(max, newVal));
            onChange(Number(newVal));
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = 'default';
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, max, min, onChange]);

    const percentage = (value - min) / (max - min);
    const rotation = -145 + (percentage * 290);

    return (
        <div className="flex flex-col items-center gap-2 group relative">
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest select-none" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.05)' }}>{label}</div>
            <div
                className="relative rounded-full bg-[#1a1a1a] shadow-[0_5px_10px_rgba(0,0,0,0.5),0_0_0_1px_#000] cursor-ns-resize"
                style={{ width: size, height: size }}
                onMouseDown={handleMouseDown}
            >
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#555" strokeWidth="2" strokeDasharray="1, 4" transform="rotate(125 50 50)" strokeDashoffset="0" />
                </svg>
                <div
                    className="absolute top-1/2 left-1/2 rounded-full shadow-lg"
                    style={{
                        width: size * 0.75,
                        height: size * 0.75,
                        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                        background: 'conic-gradient(#333, #111, #333)',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.5)'
                    }}
                >
                    <div className="absolute top-[10%] left-1/2 w-[2px] h-[30%] -translate-x-1/2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}` }}></div>
                </div>
            </div>
            <div className="text-[9px] font-mono text-zinc-500 select-none bg-black/40 px-1.5 py-0.5 rounded border border-white/5 shadow-inner">
                {value < 1 && value > 0 ? value.toFixed(2) : Math.round(value)}
            </div>
        </div>
    );
});

Knob.displayName = 'Knob';
