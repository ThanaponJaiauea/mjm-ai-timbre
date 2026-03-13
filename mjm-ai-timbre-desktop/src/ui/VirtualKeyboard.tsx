"use client";

import React, { useMemo, memo } from 'react';
import type { MusicalKey } from '../Arpeggiator';

interface VirtualKeyboardProps {
    heldIntervals: number[];
    musicalKey: MusicalKey;
    activeChordNotes?: number[];
    onNoteOn: (n: number) => void;
    onNoteOff: (n: number) => void;
}

const ROOT_NOTES: Record<string, number> = { 'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63, 'E': 64, 'F': 65, 'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68, 'Ab': 68, 'A': 69, 'A#': 70, 'Bb': 70, 'B': 71 };

const midiToNoteName = (midi: number): string => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    return noteNames[midi % 12] + octave;
};

export const VirtualKeyboard = memo(({ heldIntervals, musicalKey, activeChordNotes, onNoteOn, onNoteOff }: VirtualKeyboardProps) => {
    const keys = useMemo(() => {
        let startMidi = 48;
        let endMidi = 72;

        const displayNotes = activeChordNotes && activeChordNotes.length > 0
            ? activeChordNotes
            : heldIntervals.map(interval => ROOT_NOTES[musicalKey] + interval);

        if (displayNotes.length > 0) {
            const minHeld = Math.min(...displayNotes);
            const maxHeld = Math.max(...displayNotes);
            if (minHeld < startMidi) startMidi = Math.max(0, minHeld - 2);
            if (maxHeld > endMidi) endMidi = Math.min(127, maxHeld + 2);
        }

        const startOctave = Math.floor(startMidi / 12);
        startMidi = Math.min(startMidi, startOctave * 12);

        const generatedKeys = [];
        for (let i = startMidi; i <= endMidi; i++) {
            const noteName = midiToNoteName(i);
            generatedKeys.push({ note: noteName, midi: i, type: noteName.includes('#') ? 'black' : 'white' });
        }
        return generatedKeys;
    }, [heldIntervals, musicalKey, activeChordNotes]);

    const whiteKeys = keys.filter(k => k.type === 'white');
    const whiteKeyWidthPct = 100 / whiteKeys.length;

    return (
        <div className="w-full relative h-[120px] select-none bg-zinc-950 rounded-b-md overflow-hidden shadow-inner border-t-4 border-zinc-900">
            {whiteKeys.map((key, index) => {
                const displayNotes = activeChordNotes && activeChordNotes.length > 0
                    ? activeChordNotes
                    : heldIntervals.map(interval => ROOT_NOTES[musicalKey] + interval);
                const isPressed = displayNotes.includes(key.midi);
                return (
                    <button
                        key={key.midi}
                        onMouseDown={() => onNoteOn(key.midi)} onMouseUp={() => onNoteOff(key.midi)} onMouseLeave={() => onNoteOff(key.midi)}
                        onTouchStart={(e) => { e.preventDefault(); onNoteOn(key.midi); }} onTouchEnd={(e) => { e.preventDefault(); onNoteOff(key.midi); }}
                        className={`absolute top-0 h-full border-l border-b-8 border-r border-zinc-300 rounded-b-md active:bg-zinc-200 transition-all duration-75 shadow-[inset_0_0_10px_rgba(0,0,0,0.1)] ${
                            isPressed
                                ? 'bg-gradient-to-b from-[#60a5fa] to-[#2563eb] border-b-[#2563eb] shadow-[0_0_20px_rgba(96,165,250,0.8),inset_0_0_10px_rgba(255,255,255,0.5)] scale-[0.98] translate-y-[2px]'
                                : 'bg-[#f0f0f0]'
                        }`}
                        style={{ width: `${whiteKeyWidthPct}%`, left: `${index * whiteKeyWidthPct}%`, zIndex: 1 }}
                    >
                        <span className={`absolute bottom-3 left-1/2 -translate-x-1/2 text-[8px] font-bold ${isPressed ? 'text-white drop-shadow-[0_0_3px_rgba(0,0,0,0.8)]' : 'text-zinc-400'}`}>{key.note}</span>
                    </button>
                );
            })}
            {keys.filter(k => k.type === 'black').map((key) => {
                const whiteKeyIndex = whiteKeys.findIndex(wk => wk.midi === key.midi - 1);
                if (whiteKeyIndex === -1) return null;
                const blackKeyWidthPct = whiteKeyWidthPct * 0.65;
                const leftPosPct = ((whiteKeyIndex + 1) * whiteKeyWidthPct) - (blackKeyWidthPct / 2);
                const displayNotes = activeChordNotes && activeChordNotes.length > 0
                    ? activeChordNotes
                    : heldIntervals.map(interval => ROOT_NOTES[musicalKey] + interval);
                const isPressed = displayNotes.includes(key.midi);
                return (
                    <button
                        key={key.midi}
                        onMouseDown={() => onNoteOn(key.midi)} onMouseUp={() => onNoteOff(key.midi)} onMouseLeave={() => onNoteOff(key.midi)}
                        onTouchStart={(e) => { e.preventDefault(); onNoteOn(key.midi); }} onTouchEnd={(e) => { e.preventDefault(); onNoteOff(key.midi); }}
                        className={`absolute top-0 h-[60%] border-b-8 border-x-2 border-black rounded-b-sm z-10 shadow-[2px_2px_5px_rgba(0,0,0,0.5),inset_0_5px_10px_rgba(255,255,255,0.1)] transition-all duration-75 ${
                            isPressed
                                ? 'bg-gradient-to-b from-[#93c5fd] to-[#3b82f6] border-b-[#3b82f6] shadow-[0_0_20px_rgba(147,197,255,0.8),inset_0_0_10px_rgba(255,255,255,0.5)] scale-[0.98] translate-y-[2px]'
                                : 'bg-gradient-to-b from-[#333] to-black'
                        }`}
                        style={{ width: `${blackKeyWidthPct}%`, left: `${leftPosPct}%` }}
                    />
                );
            })}
        </div>
    );
});

VirtualKeyboard.displayName = 'VirtualKeyboard';
