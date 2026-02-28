"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { useVSTBridge } from '../../hooks/useVSTBridge';
import './arp.css';


// --- UI COMPONENTS (Custom Styled for Hardware Look) ---

// 1. Rotary Knob (Updated with better shadows/gradient from your CSS concept)
const Knob = ({ label, value, min, max, onChange, color = "#2ed573", size = 60 }: any) => {
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
                {/* Dial Marks */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#555" strokeWidth="2" strokeDasharray="1, 4" transform="rotate(125 50 50)" strokeDashoffset="0" />
                </svg>

                {/* Knob Body */}
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
                    {/* Indicator */}
                    <div className="absolute top-[10%] left-1/2 w-[2px] h-[30%] -translate-x-1/2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}` }}></div>
                </div>
            </div>
            <div className="text-[9px] font-mono text-zinc-500 select-none bg-black/40 px-1.5 py-0.5 rounded border border-white/5 shadow-inner">
                {value < 1 && value > 0 ? value.toFixed(2) : Math.round(value)}
            </div>
        </div>
    );
};

// 2. Hardware Button (Styled to match .hardware-btn)
const HardButton = ({ label, active, onClick, color = "red" }: any) => {
    // Colors mapped from CSS variables
    const activeColors: Record<string, string> = {
        red: 'from-red-600 to-red-800 border-red-900 text-white shadow-[0_0_15px_rgba(255,0,0,0.5),inset_0_0_5px_rgba(0,0,0,0.5)]',
        green: 'from-green-600 to-green-800 border-green-900 text-white shadow-[0_0_15px_rgba(0,255,0,0.5),inset_0_0_5px_rgba(0,0,0,0.5)]',
        blue: 'from-blue-600 to-blue-800 border-blue-900 text-white shadow-[0_0_15px_rgba(0,0,255,0.5),inset_0_0_5px_rgba(0,0,0,0.5)]',
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
}

// 3. LED Indicator
const Led = ({ active, color = "#2ed573" }: { active: boolean, color?: string }) => (
    <div
        className={`w-2 h-2 rounded-full transition-all duration-75 border border-black/50 ${active ? 'opacity-100 bg-white' : 'opacity-30 bg-zinc-600'}`}
        style={{
            backgroundColor: active ? color : undefined,
            boxShadow: active ? `0 0 8px ${color}, inset 0 0 2px rgba(255,255,255,0.8)` : 'none'
        }}
    />
);

// 4. Panel Container (Replaces .module-panel)
const ModulePanel = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
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

// 5. Screw (Replaces .screw)
const Screw = ({ className }: { className?: string }) => (
    <div className={`w-3 h-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,#666,#111)] shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center border border-[#111] ${className}`}>
        <div className="w-[80%] h-[1px] bg-[#1a1a1a] rotate-45"></div>
        <div className="w-[80%] h-[1px] bg-[#1a1a1a] -rotate-45 absolute"></div>
    </div>
);

// 6. Step Button (TR-808 Style)
const StepButton = ({ index, active, current, onClick }: { index: number, active: boolean, current: boolean, onClick: () => void }) => {
    const isAccent = index % 4 === 0;
    return (
        <div className="flex flex-col items-center gap-1">
            {/* LED */}
            <div className={`w-1.5 h-1.5 rounded-full border border-black/50 transition-all duration-75 ${current ? 'bg-red-500 shadow-[0_0_8px_#f00]' : active ? 'bg-red-900/50' : 'bg-[#111]'}`}></div>

            {/* Button */}
            <button
                onClick={onClick}
                className={`
          w-8 h-12 rounded-[2px] relative overflow-hidden transition-transform active:scale-[0.98]
          border-b-[4px] border-r-[1px] border-l-[1px] border-t-[1px]
          ${active
                        ? isAccent
                            ? 'bg-[#ff9f43] border-[#d35400] shadow-[0_0_10px_rgba(255,159,67,0.4)]' // Orange accent
                            : 'bg-[#fffa65] border-[#f1c40f] shadow-[0_0_10px_rgba(255,250,101,0.4)]' // Yellow normal
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

// --- LOGIC & HELPERS (Unchanged) ---

type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle';
type Pattern = 'Up' | 'Down' | 'UpDown' | 'Random';
type PlaybackState = 'stopped' | 'playing';

const TIME_DIVISIONS = { '1/4': 1, '1/8': 0.5, '1/16': 0.25, '1/32': 0.125 };
type TimeDivision = keyof typeof TIME_DIVISIONS;

const CHORD_TYPES = { 'Single': [0], 'Major': [0, 4, 7], 'Minor': [0, 3, 7], '7th': [0, 4, 7, 10], '9th': [0, 4, 7, 10, 14] };
type ChordType = keyof typeof CHORD_TYPES;

const ROOT_NOTES = { 'C': 60, 'C#': 61, 'D': 62, 'D#': 63, 'E': 64, 'F': 65, 'F#': 66, 'G': 67, 'G#': 68, 'A': 69, 'A#': 70, 'B': 71 };

type ArpSettings = {
    waveform: Waveform; bpm: number; timeDivision: TimeDivision; pattern: Pattern;
    octaveRange: number; gateLength: number; velocity: number; rootNote: number;
    chordType: ChordType; masterVolume: number; heldRoots: number[]; sortNotes: boolean;
    sequencerSteps: boolean[]; // NEW: Rhythm Gate Steps
    heldNotes?: (string | string[])[];      // NEW: For API JSON (e.g., ["C4", "E4"] OR [["C4", "E4"], ["G4", "B4"]])
    name?: string; // Optional name for presets
};

const GENRE_PRESETS: Record<string, ArpSettings> = {
    'TRANCE': {
        name: 'TRANCE', waveform: 'sawtooth', bpm: 140, timeDivision: '1/16', pattern: 'UpDown',
        octaveRange: 2, gateLength: 90, velocity: 0.9, rootNote: 53, chordType: 'Minor',
        masterVolume: 0.6, heldRoots: [60, 63, 67, 72], // F Minor (Normalized to C4 ref)
        sortNotes: true,
        // Driving 1/16th notes, slightly open for groove
        sequencerSteps: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
    },
    'SYNTHWAVE': {
        name: 'SYNTHWAVE', waveform: 'sawtooth', bpm: 110, timeDivision: '1/16', pattern: 'Down',
        octaveRange: 1, gateLength: 85, velocity: 0.85, rootNote: 33, chordType: 'Minor',
        masterVolume: 0.6, heldRoots: [60, 63, 67, 72, 75], // A Minor (Normalized)
        sortNotes: false,
        // Classic "Gallop" Bass: x-xx-x-xx-x-xx-x
        sequencerSteps: [true, false, true, true, true, false, true, true, true, false, true, true, true, false, true, true]
    },
    'TECHNO': {
        name: 'TECHNO', waveform: 'square', bpm: 135, timeDivision: '1/16', pattern: 'Up',
        octaveRange: 1, gateLength: 80, velocity: 1.0, rootNote: 36, chordType: 'Single',
        masterVolume: 0.75, heldRoots: [60, 63, 67, 72], // C Minor (Normalized to C4)
        sortNotes: true,
        // Rolling Industrial: More consistent drive
        sequencerSteps: [true, false, true, true, true, true, true, false, true, true, true, true, true, true, true, false]
    },
    'AMBIENT': {
        name: 'AMBIENT', waveform: 'triangle', bpm: 80, timeDivision: '1/8', pattern: 'Random',
        octaveRange: 3, gateLength: 110, velocity: 0.6, rootNote: 39, chordType: '9th',
        masterVolume: 0.5, heldRoots: [60, 64, 67, 71, 74, 79], // Eb Lydian (Normalized)
        sortNotes: true,
        // More flowing, less empty space
        sequencerSteps: [true, true, false, true, true, true, false, true, true, false, true, true, false, true, true, true]
    },
    'CHIPTUNE': {
        name: 'CHIPTUNE', waveform: 'square', bpm: 160, timeDivision: '1/32', pattern: 'Up',
        octaveRange: 2, gateLength: 85, velocity: 0.8, rootNote: 64, chordType: 'Major',
        masterVolume: 0.5, heldRoots: [60, 64, 67, 71, 72, 76], // E Major (Normalized)
        sortNotes: true,
        // Fast runs, very full
        sequencerSteps: [true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true]
    },
    'DEEP HOUSE': {
        name: 'DEEP HOUSE', waveform: 'sawtooth', bpm: 124, timeDivision: '1/8', pattern: 'UpDown',
        octaveRange: 2, gateLength: 85, velocity: 0.75, rootNote: 43, chordType: '7th',
        masterVolume: 0.65, heldRoots: [60, 63, 67, 70, 74, 77], // Gm9 (Normalized)
        sortNotes: true,
        // Swingy Off-beats with more presence
        sequencerSteps: [true, false, true, true, false, true, true, false, true, true, true, false, true, true, true, true]
    },
    'DNB': {
        name: 'DNB', waveform: 'sawtooth', bpm: 174, timeDivision: '1/16', pattern: 'Random',
        octaveRange: 2, gateLength: 90, velocity: 1.0, rootNote: 41, chordType: 'Minor',
        masterVolume: 0.7, heldRoots: [60, 63, 67, 70, 75], // Fm7 (Normalized)
        sortNotes: false,
        // Breakbeat chaos with more hits
        sequencerSteps: [true, true, true, false, true, true, false, true, true, true, false, true, true, false, true, true]
    },
    'LO-FI': {
        name: 'LO-FI', waveform: 'sine', bpm: 85, timeDivision: '1/8', pattern: 'Down',
        octaveRange: 1, gateLength: 95, velocity: 0.6, rootNote: 49, chordType: '9th',
        masterVolume: 0.55, heldRoots: [60, 64, 67, 71, 74], // Db Major 9 (Normalized)
        sortNotes: true,
        // Lazy layout
        sequencerSteps: [true, false, true, false, true, true, false, true, false, true, false, false, true, false, true, false]
    },
    'CYBERPUNK': {
        name: 'CYBERPUNK', waveform: 'sawtooth', bpm: 100, timeDivision: '1/16', pattern: 'Down',
        octaveRange: 1, gateLength: 90, velocity: 0.95, rootNote: 36, chordType: 'Single',
        masterVolume: 0.7, heldRoots: [60, 66, 67, 72], // C Tritone + Power chord (Normalized)
        sortNotes: false,
        // Aggressive, fuller drive
        sequencerSteps: [true, true, true, true, true, true, false, true, true, true, true, true, true, false, true, true]
    },
    'CLASSICAL': {
        name: 'CLASSICAL', waveform: 'triangle', bpm: 120, timeDivision: '1/16', pattern: 'UpDown',
        octaveRange: 3, gateLength: 95, velocity: 0.7, rootNote: 61, chordType: 'Major',
        masterVolume: 0.6, heldRoots: [60, 63, 68, 72], // C# Minor (Normalized)
        sortNotes: true,
        // Flowing 16ths almost continuous
        sequencerSteps: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
    }
};




type SavedMidi = { name: string; data: string; settings?: ArpSettings; };

const midiToFreq = (midi: number): number => Math.pow(2, (midi - 69) / 12) * 440;
const midiToNoteName = (midi: number): string => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    return noteNames[midi % 12] + octave;
};

const noteNameToMidi = (note: string): number => {
    const noteNames = { 'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11 };
    const match = note.match(/^([A-G][b#]?)(-?\d+)$/);
    if (!match) return 60; // Default C4 if invalid
    const name = match[1];
    const octave = parseInt(match[2]);
    return (octave + 1) * 12 + (noteNames[name as keyof typeof noteNames] || 0);
};

// --- CUSTOM MIDI PARSER ---
const parseMidiNotes = (buffer: ArrayBuffer, bpm: number) => {
    const data = new Uint8Array(buffer);
    let p = 0;
    const readVarInt = () => {
        let result = 0;
        while (true) {
            const b = data[p++];
            result = (result << 7) | (b & 0x7F);
            if (!(b & 0x80)) return result;
        }
    };
    if (data[0] !== 0x4d || data[1] !== 0x54) return [];
    p += 14;
    if (data[p] !== 0x4d || data[p + 1] !== 0x54) return [];
    p += 8;

    const notes: { midi: number; time: number; duration: number; velocity: number }[] = [];
    const activeNotes: Record<number, number> = {};
    let currentTicks = 0;
    const TICKS_PER_QUARTER = 480;

    while (p < data.length) {
        if (p >= data.length) break;
        const delta = readVarInt();
        currentTicks += delta;
        const status = data[p++];
        if (status === 0xFF) {
            const type = data[p++];
            const len = readVarInt();
            p += len;
            if (type === 0x2F) break;
        } else if ((status & 0xF0) === 0x90) {
            const note = data[p++];
            const vel = data[p++];
            const timeSec = (currentTicks / TICKS_PER_QUARTER) * (60 / bpm);
            if (vel > 0) activeNotes[note] = timeSec;
            else { if (activeNotes[note] !== undefined) { notes.push({ midi: note, time: activeNotes[note], duration: timeSec - activeNotes[note], velocity: 0.8 }); delete activeNotes[note]; } }
        } else if ((status & 0xF0) === 0x80) {
            const note = data[p++];
            const vel = data[p++];
            const timeSec = (currentTicks / TICKS_PER_QUARTER) * (60 / bpm);
            if (activeNotes[note] !== undefined) { notes.push({ midi: note, time: activeNotes[note], duration: timeSec - activeNotes[note], velocity: 0 }); delete activeNotes[note]; }
        }
    }
    return notes;
};

// --- SHARED LOGIC ---

type ArpState = {
    noteIndex: number;
    direction: 'up' | 'down';
};

const calculateNextArpState = (
    currentState: ArpState,
    pattern: Pattern,
    sequenceLength: number
): { nextState: ArpState; currentNoteIndex: number } => {
    let { noteIndex, direction } = currentState;
    let currentNoteIndex = 0;

    if (sequenceLength === 0) return { nextState: currentState, currentNoteIndex: -1 };

    switch (pattern) {
        case 'Up':
            currentNoteIndex = noteIndex % sequenceLength;
            noteIndex = (noteIndex + 1) % sequenceLength; // Wrap around safely
            break;
        case 'Down':
            const step = noteIndex % sequenceLength;
            currentNoteIndex = sequenceLength - 1 - step;
            noteIndex = (noteIndex + 1) % sequenceLength;
            break;
        case 'UpDown':
            // Safety clamp
            if (noteIndex >= sequenceLength) noteIndex = sequenceLength - 1;
            if (noteIndex < 0) noteIndex = 0;

            currentNoteIndex = noteIndex;

            if (sequenceLength > 1) {
                if (direction === 'up') {
                    if (noteIndex >= sequenceLength - 1) {
                        direction = 'down';
                        noteIndex = noteIndex - 1;
                    } else {
                        noteIndex = noteIndex + 1;
                    }
                } else { // down
                    if (noteIndex <= 0) {
                        direction = 'up';
                        noteIndex = noteIndex + 1;
                    } else {
                        noteIndex = noteIndex - 1;
                    }
                }
            } else {
                noteIndex = 0;
            }
            break;
        case 'Random':
            currentNoteIndex = Math.floor(Math.random() * sequenceLength);
            // noteIndex doesn't strictly matter for random, but keep it moving
            noteIndex = (noteIndex + 1) % sequenceLength;
            break;
        default:
            currentNoteIndex = noteIndex % sequenceLength;
            noteIndex++;
            break;
    }

    return { nextState: { noteIndex, direction }, currentNoteIndex };
};

// --- MIDI HELPERS (ENHANCED) ---

const generateArpeggioPattern = (params: any, stepCount = 64): (number | number[] | null)[] => {
    const { arpSequence, pattern, sequencerSteps } = params;
    if (!arpSequence.length) return [];

    const generated: (number | number[] | null)[] = [];
    let state: ArpState = { noteIndex: 0, direction: 'up' };

    for (let i = 0; i < stepCount; i++) {
        const seqStep = i % 16;

        // Always calculate next state to keep pattern alignment
        const { nextState, currentNoteIndex } = calculateNextArpState(state, pattern, arpSequence.length);
        state = nextState;

        // Apply Rhythm Gate
        if (!sequencerSteps[seqStep]) {
            generated.push(null);
        } else {
            generated.push(arpSequence[currentNoteIndex]);
        }
    }
    return generated;
};

const createMidiDataUri = (sequence: (number | number[] | null)[], bpm: number, ticksPerQuarterNote: number, stepDuration: number, gateLength: number, velocity: number): string => {
    let gateMultiplier = gateLength >= 128 ? 1.0 : gateLength / 127.0;
    const noteDurationTicks = Math.round(ticksPerQuarterNote * stepDuration * gateMultiplier);
    const stepDurationTicks = Math.round(ticksPerQuarterNote * stepDuration);

    const writeVarInt = (value: number): number[] => {
        if (value === 0) return [0];
        let buffer: number[] = [], v = value;
        while (v > 0) { buffer.unshift(v & 0x7F); v >>= 7; }
        return buffer.map((b, i) => (i < buffer.length - 1 ? b | 0x80 : b));
    };

    type MidiEvent = { ticks: number; type: number; note?: number; velocity?: number; metaType?: number; data?: number[] };
    const events: MidiEvent[] = [];

    // 1. Add Tempo Meta Event (FF 51 03 tttttt) at Time 0
    // Microseconds per quarter note = 60,000,000 / BPM
    const microsecondsPerBeat = Math.round(60000000 / bpm);
    const tempoBytes = [
        (microsecondsPerBeat >> 16) & 0xFF,
        (microsecondsPerBeat >> 8) & 0xFF,
        microsecondsPerBeat & 0xFF
    ];
    events.push({ ticks: 0, type: 0xFF, metaType: 0x51, data: tempoBytes });

    // 2. Add Note Events
    let currentTimeTicks = 0;
    sequence.forEach(midiNote => {
        if (midiNote !== null) {
            const notes = Array.isArray(midiNote) ? midiNote : [midiNote];
            const noteVelocity = Math.round(velocity * 127) & 0x7F;
            notes.forEach(noteNum => {
                events.push({ ticks: currentTimeTicks, type: 0x90, note: noteNum & 0x7F, velocity: noteVelocity });
                events.push({ ticks: currentTimeTicks + noteDurationTicks, type: 0x80, note: noteNum & 0x7F, velocity: 0 });
            });
        }
        currentTimeTicks += stepDurationTicks;
    });

    events.sort((a, b) => a.ticks - b.ticks);

    const trackEvents: number[] = [];
    let lastEventTicks = 0;
    events.forEach(event => {
        // Delta time
        trackEvents.push(...writeVarInt(event.ticks - lastEventTicks));
        lastEventTicks = event.ticks;

        // Event Data
        if (event.type === 0xFF) {
            // Meta Event
            trackEvents.push(0xFF, event.metaType!, event.data!.length, ...event.data!);
        } else {
            // Channel Voice Message
            trackEvents.push(event.type, event.note!, event.velocity!);
        }
    });

    // End of Track
    trackEvents.push(...writeVarInt(0), 0xFF, 0x2F, 0x00);

    const track = new Uint8Array(trackEvents);
    const trackSizeBytes = new Uint8Array([(track.length >> 24) & 0xFF, (track.length >> 16) & 0xFF, (track.length >> 8) & 0xFF, track.length & 0xFF]);
    const header = new Uint8Array([0x4D, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x01, (ticksPerQuarterNote >> 8) & 0xFF, ticksPerQuarterNote & 0xFF]);

    const trackHeader = new Uint8Array(4 + trackSizeBytes.length);
    trackHeader.set([0x4D, 0x54, 0x72, 0x6B], 0);
    trackHeader.set(trackSizeBytes, 4);

    const midiFile = new Uint8Array(header.length + trackHeader.length + track.length);
    midiFile.set(header, 0);
    midiFile.set(trackHeader, header.length);
    midiFile.set(track, header.length + trackHeader.length);

    let binary = '';
    for (let i = 0; i < midiFile.byteLength; i++) binary += String.fromCharCode(midiFile[i]);
    return 'data:audio/midi;base64,' + btoa(binary);
};

// --- REFACTORED SUB-COMPONENTS ---

const VirtualKeyboard = memo(({ heldRoots, onNoteOn, onNoteOff }: { heldRoots: number[], onNoteOn: (n: number) => void, onNoteOff: (n: number) => void }) => {
    const keys = useMemo(() => {
        // Dynamic Range Calculation
        let startMidi = 48; // Default C3
        let endMidi = 72;   // Default C5

        if (heldRoots.length > 0) {
            const minHeld = Math.min(...heldRoots);
            const maxHeld = Math.max(...heldRoots);

            // Expand if needed, with 2 semitone padding
            if (minHeld < startMidi) startMidi = Math.max(0, minHeld - 2);
            if (maxHeld > endMidi) endMidi = Math.min(127, maxHeld + 2);
        }

        // Ensure start is a white key (approximated for visual stability) or C
        // Adjusting start to previous C if possible for clean look
        const startOctave = Math.floor(startMidi / 12);
        startMidi = Math.min(startMidi, startOctave * 12); // Snap to C

        const generatedKeys = [];
        for (let i = startMidi; i <= endMidi; i++) {
            const noteName = midiToNoteName(i);
            generatedKeys.push({ note: noteName, midi: i, type: noteName.includes('#') ? 'black' : 'white' });
        }
        return generatedKeys;
    }, [heldRoots]); // Dep on heldRoots to re-calc range

    const whiteKeys = keys.filter(k => k.type === 'white');
    const whiteKeyWidthPct = 100 / whiteKeys.length;

    return (
        <div className="w-full relative h-[120px] select-none bg-zinc-950 rounded-b-md overflow-hidden shadow-inner border-t-4 border-zinc-900">
            {whiteKeys.map((key, index) => (
                <button
                    key={key.midi}
                    onMouseDown={() => onNoteOn(key.midi)} onMouseUp={() => onNoteOff(key.midi)} onMouseLeave={() => onNoteOff(key.midi)}
                    onTouchStart={(e) => { e.preventDefault(); onNoteOn(key.midi); }} onTouchEnd={(e) => { e.preventDefault(); onNoteOff(key.midi); }}
                    className={`absolute top-0 h-full border-l border-b-8 border-r border-zinc-300 rounded-b-md active:bg-zinc-200 transition-colors shadow-[inset_0_0_10px_rgba(0,0,0,0.1)] ${heldRoots.includes(key.midi) ? 'bg-blue-100' : 'bg-[#f0f0f0]'}`}
                    style={{ width: `${whiteKeyWidthPct}%`, left: `${index * whiteKeyWidthPct}%`, zIndex: 1 }}
                >
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[8px] font-bold text-zinc-400">{key.note}</span>
                </button>
            ))}
            {keys.filter(k => k.type === 'black').map((key) => {
                const whiteKeyIndex = whiteKeys.findIndex(wk => wk.midi === key.midi - 1);
                if (whiteKeyIndex === -1) return null; // Safety
                const blackKeyWidthPct = whiteKeyWidthPct * 0.65;
                const leftPosPct = ((whiteKeyIndex + 1) * whiteKeyWidthPct) - (blackKeyWidthPct / 2);
                return (
                    <button
                        key={key.midi}
                        onMouseDown={() => onNoteOn(key.midi)} onMouseUp={() => onNoteOff(key.midi)} onMouseLeave={() => onNoteOff(key.midi)}
                        onTouchStart={(e) => { e.preventDefault(); onNoteOn(key.midi); }} onTouchEnd={(e) => { e.preventDefault(); onNoteOff(key.midi); }}
                        className={`absolute top-0 h-[60%] border-b-8 border-x-2 border-black rounded-b-sm z-10 shadow-[2px_2px_5px_rgba(0,0,0,0.5),inset_0_5px_10px_rgba(255,255,255,0.1)] ${heldRoots.includes(key.midi) ? 'bg-blue-900 border-blue-900' : 'bg-gradient-to-b from-[#333] to-black'}`}
                        style={{ width: `${blackKeyWidthPct}%`, left: `${leftPosPct}%` }}
                    />
                );
            })}
        </div>
    );
});
VirtualKeyboard.displayName = 'VirtualKeyboard';

// --- OPTIMIZED SUB-COMPONENTS ---

// 2.a ArpGrid (Heavy rendering - Memoized on Sequence only)
const ArpGrid = memo(({ sequence }: { sequence: (number | number[] | null)[] }) => {
    const totalSteps = Math.max(16, sequence.length);
    const validNotes = sequence.flatMap(n => Array.isArray(n) ? n : [n]).filter((n): n is number => n !== null);
    const pitchRange = useMemo(() => {
        if (validNotes.length === 0) return Array.from({ length: 25 }, (_, i) => 72 - i);
        const min = Math.min(48, Math.min(...validNotes) - 4);
        const max = Math.max(84, Math.max(...validNotes) + 4);
        return Array.from({ length: max - min + 1 }, (_, i) => max - i);
    }, [sequence, validNotes]); // Depend only on sequence content

    return (
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)`, gridTemplateRows: `repeat(${pitchRange.length}, 1fr)` }}>
            {/* Grid Background Pattern included here to avoid external re-renders */}
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

// 2.b ArpDisplay (Lightweight Wrapper - Updates frequently with currentStep)
const ArpDisplay = memo(({ sequence, currentStep }: { sequence: (number | number[] | null)[], currentStep: number | null }) => {
    const totalSteps = Math.max(16, sequence.length);

    return (
        <div className="relative w-full h-full bg-[#050505] overflow-hidden rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,1)] border-8 border-zinc-800 border-b-zinc-700 border-t-zinc-900">

            {/* Heavy Grid - Only re-renders when sequence changes */}
            <ArpGrid sequence={sequence} />

            {/* Scanlines & CRT effect (Static overlays) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_4px,3px_100%] pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-radial-gradient(circle, transparent 60%, black 100%) opacity-50 pointer-events-none z-10"></div>

            {/* Lightweight Cursor - Re-renders frequently */}
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

// 7. Preset Selector (Dropdown Style)
const PresetSelector = ({ currentPreset, onSelect }: { currentPreset: string | null, onSelect: (settings: ArpSettings) => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ModulePanel title="PRESETS" className="h-full flex flex-col gap-2 relative z-50">
            <div className="h-full flex items-center">
                <div className="relative w-full">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full h-10 bg-[#151515] border border-zinc-700 text-[#2ed573] font-bold text-[12px] tracking-widest px-3 flex items-center justify-between shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] hover:border-[#2ed573] hover:shadow-[0_0_10px_rgba(46,213,115,0.2)] transition-all rounded-[2px]"
                    >
                        <span className="truncate">{currentPreset || "SELECT STYLE"}</span>
                        <span className="text-[10px] transform scale-y-75">▼</span>
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 w-full mt-1 max-h-[200px] overflow-y-auto bg-[#1a1a1a] border border-zinc-700 shadow-[0_10px_30px_rgba(0,0,0,0.9)] z-50 rounded-[2px] custom-scrollbar">
                            {Object.values(GENRE_PRESETS).map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => { onSelect(preset); setIsOpen(false); }}
                                    className={`
                                    w-full text-left px-3 py-2 text-[10px] font-bold tracking-widest border-b border-[#222] hover:bg-[#2ed573] hover:text-black transition-colors
                                    ${currentPreset === preset.name ? 'text-[#2ed573] bg-[#222]' : 'text-zinc-500'}
                                `}
                                >
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ModulePanel>
    );
};


export default function ArpeggiatorPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeMidiNotes, setActiveMidiNotes] = useState<(number | number[])[]>([]);
    const [heldRoots, setHeldRoots] = useState<number[]>([]);
    const [waveform, setWaveform] = useState<Waveform>('sine');
    const [masterVolume, setMasterVolume] = useState(0.5);
    const [gateLength, setGateLength] = useState(100);
    const [velocity, setVelocity] = useState(1.0);
    const [bpm, setBpm] = useState(120);
    const [timeDivision, setTimeDivision] = useState<TimeDivision>('1/16');
    const [pattern, setPattern] = useState<Pattern>('Up');
    const [sortNotes, setSortNotes] = useState(false);
    const [octaveRange, setOctaveRange] = useState(1);
    const [rootNote, setRootNote] = useState<number>(60);
    const [chordType, setChordType] = useState<ChordType>('Single');
    const [savedMidis, setSavedMidis] = useState<SavedMidi[]>([]);
    const [playbackState, setPlaybackState] = useState<Record<string, PlaybackState>>({});
    const [isHoldOn, setIsHoldOn] = useState(false);
    const [currentPresetName, setCurrentPresetName] = useState<string | null>(null);

    // UI States (for Visualizer)
    const [currentStep, setCurrentStep] = useState<number | null>(null);
    const [currentSeqStep, setCurrentSeqStep] = useState<number>(-1);
    const [sequencerSteps, setSequencerSteps] = useState<boolean[]>(Array(16).fill(true));
    const [modalState, setModalState] = useState<{ show: boolean; type: 'alert' | 'confirm' | 'success'; title: string; message: string; onConfirm?: () => void; }>({ show: false, type: 'alert', title: '', message: '' });

    // VST Bridge
    const { isVST, sendVSTMidi } = useVSTBridge();

    // Refs for Audio Engine
    const audioContextRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const midiMainGainRef = useRef<GainNode | null>(null);
    // Add Compressor Ref
    const compressorRef = useRef<DynamicsCompressorNode | null>(null);

    // Scheduler Refs
    const timerIDRef = useRef<NodeJS.Timeout | null>(null);
    const nextNoteTimeRef = useRef(0.0);
    const noteIndexRef = useRef(0); // Sequence array index
    const seqStepRef = useRef(0); // Rhythm 0-15 index
    const upDownDirectionRef = useRef<'up' | 'down'>('up');

    // Queue for UI Synchronization: [{ noteIndex: 2, time: 10.5, seqIndex: 4 }, ...]
    const notesInQueueRef = useRef<{ noteIndex: number, seqIndex: number, time: number }[]>([]);

    const pressedKeysRef = useRef(new Set<string>());
    const scheduledEventsRef = useRef<number[]>([]); // For MIDI playback timeouts

    // --- HELPERS ---
    const loadSettings = (settings: ArpSettings) => {
        // 1. Direct value updates
        setWaveform(settings.waveform);
        setBpm(settings.bpm);
        setTimeDivision(settings.timeDivision);
        setPattern(settings.pattern);
        setOctaveRange(settings.octaveRange);
        setGateLength(settings.gateLength);
        setVelocity(settings.velocity);
        setChordType(settings.chordType);
        setMasterVolume(settings.masterVolume);
        setChordType(settings.chordType);
        setMasterVolume(settings.masterVolume);
        setSortNotes(settings.sortNotes ?? false);
        setSequencerSteps(settings.sequencerSteps || Array(16).fill(true));
        if (settings.name) setCurrentPresetName(settings.name);

        // 2. Intelligent Root/Key Logic
        // Problem: Backend might send `rootNote: 48` (C) while `heldNotes` are in F (53).
        // User wants UI to show "F" (Key Scale) if the notes are in F.

        let targetRoot = settings.rootNote; // Default to backend value

        // Priority: heldNotes (API Strings)
        if (settings.heldNotes && settings.heldNotes.length > 0) {
            const flatNotes: string[] = settings.heldNotes.flat() as string[];
            const uniqueNotes = Array.from(new Set(flatNotes));
            const rawMidiNotes = uniqueNotes.map(noteNameToMidi);

            // Heuristic Check: Does the backend rootNote (e.g. 48) match the keys provided?
            // If we have explicit notes, we should trust them for the "Key Scale" display.
            // Let's derive the Musical Key from the first note (usually the root of the first chord).
            if (rawMidiNotes.length > 0) {
                const firstNoteMidi = rawMidiNotes[0]; // e.g. F3 (53)
                // Normalize firstNote to our dropdown range (60-71) to find the "Key Name"
                // e.g. 53 % 12 = 5.  60 + 5 = 65 (F4).
                const derivedRoot = 60 + (firstNoteMidi % 12);

                // Set UI to show this Key (e.g. F)
                targetRoot = derivedRoot;

                // CRITICAL: We changed rootNote from 48 (C) to 65 (F) for Display.
                // But the App Logic adds (rootNote - 60) to playback.
                // Old: Play = Stored(53) + (48-60) = 41 (Too low? Or intentional?)
                // Wait, if backend sent explicit notes "F3", it usually expects to HEAR "F3".
                // If we use rootNote=60 (Offset 0), we hear F3.
                // If we use rootNote=65 (Offset +5), we hear Bb3.
                // We want to HEAR 53.
                // So: 53 = Stored + (65 - 60) => Stored = 53 - 5 = 48.
                // So we must shift the imported notes DOWN by the transpose amount so they play back correctly.

                const transposeOffset = derivedRoot - 60;
                const adjustedRoots = rawMidiNotes.map(n => n - transposeOffset);
                setHeldRoots(adjustedRoots);
                setIsHoldOn(true);
            }
        } else if (settings.heldRoots && settings.heldRoots.length > 0) {
            setHeldRoots(settings.heldRoots);
            setIsHoldOn(true);
            // If just raw roots, maybe standard rootNote application is fine?
            // But let's clamp rootNote for display if needed
            if (targetRoot < 60 || targetRoot > 71) {
                // If backend sends 48, map to 60 for UI consistency?
                // Or leave as is if no explicit strings to derive from.
            }
        }

        setRootNote(targetRoot);
    };

    // --- API INTEGRATION (LEGACY - COMMENTED OUT) ---
    /*
    useEffect(() => {
      const fetchSettings = async () => {
        try {
          // Replace with your actual API endpoint
          const response = await fetch('/api/arpeggiator-settings');
          if (response.ok) {
            const data: ArpSettings = await response.json();
            console.log("Loaded settings from API:", data);
            loadSettings(data);
          } else {
            console.warn("API not found, using default settings");
          }
        } catch (error) {
          console.error("Failed to fetch settings from API:", error);
        }
      };
  
      fetchSettings();
      fetchSettings();
    }, []);
    */

    useEffect(() => {
        try {
            const saved = localStorage.getItem('savedMidis');
            if (saved) setSavedMidis(JSON.parse(saved));
        } catch (e) { console.warn("LocaleStorage read failed", e); }
    }, []);
    useEffect(() => {
        try {
            localStorage.setItem('savedMidis', JSON.stringify(savedMidis));
        } catch (e) { console.warn("LocaleStorage write failed", e); }
    }, [savedMidis]);

    useEffect(() => {
        if (heldRoots.length === 0) { setActiveMidiNotes([]); return; }
        const transposeOffset = rootNote - 60;
        let notesToPlay: number[] = [];
        if (chordType === 'Single') { notesToPlay = heldRoots.map(keyMidi => keyMidi + transposeOffset); } else {
            const rootKey = heldRoots[0];
            const validIntervals = CHORD_TYPES[chordType].map(i => i % 12);
            notesToPlay = heldRoots.map(keyMidi => {
                const rawInterval = (keyMidi - rootKey + 1200) % 12;
                let closest = validIntervals[0], minDiff = 100;
                for (const valid of validIntervals) { let diff = Math.abs(rawInterval - valid); if (diff > 6) diff = 12 - diff; if (diff < minDiff) { minDiff = diff; closest = valid; } }
                let delta = closest - rawInterval; if (delta > 6) delta -= 12; if (delta < -6) delta += 12;
                return keyMidi + delta + transposeOffset;
            });
        }
        setActiveMidiNotes(notesToPlay);
    }, [heldRoots, chordType, rootNote]);

    const arpSequence = useMemo(() => {
        if (activeMidiNotes.length === 0) return [];
        const flatNotes = activeMidiNotes.flat();
        let uniqueNotes = Array.from(new Set(flatNotes));
        if (sortNotes) { uniqueNotes.sort((a, b) => (a as number) - (b as number)); }
        let sequence: (number | number[] | null)[] = [];
        for (let i = 0; i < octaveRange; i++) { const octaveShift = i * 12; sequence.push(...uniqueNotes.map(note => (note as number) + octaveShift)); }
        return sequence;
    }, [activeMidiNotes, octaveRange, sortNotes]);

    // Combined Params Ref for Scheduler Access
    const paramsRef = useRef({ waveform, masterVolume, gateLength, velocity, bpm, timeDivision, pattern, octaveRange, arpSequence, heldRoots, sortNotes, sequencerSteps });
    useEffect(() => { paramsRef.current = { waveform, masterVolume, gateLength, velocity, bpm, timeDivision, pattern, octaveRange, arpSequence, heldRoots, sortNotes, sequencerSteps }; }, [waveform, masterVolume, gateLength, velocity, bpm, timeDivision, pattern, octaveRange, arpSequence, heldRoots, sortNotes, sequencerSteps]);


    const initializeAudio = () => {
        if (!audioContextRef.current) {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = context;

            const masterGain = context.createGain();
            const compressor = context.createDynamicsCompressor();

            // Compressor Settings for "Punchy" but clean sound
            compressor.threshold.setValueAtTime(-24, context.currentTime);
            compressor.knee.setValueAtTime(30, context.currentTime);
            compressor.ratio.setValueAtTime(12, context.currentTime);
            compressor.attack.setValueAtTime(0.003, context.currentTime);
            compressor.release.setValueAtTime(0.25, context.currentTime);

            masterGain.connect(compressor);
            compressor.connect(context.destination);

            masterGain.gain.value = masterVolume;

            masterGainRef.current = masterGain;
            compressorRef.current = compressor;
        }
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();
    };

    const handleNoteOn = useCallback((midiNote: number) => { initializeAudio(); setHeldRoots(prev => [...prev, midiNote]); }, []);
    const handleNoteOff = useCallback((midiNote: number) => { if (!isHoldOn) setHeldRoots(prev => prev.filter(n => n !== midiNote)); }, [isHoldOn]);

    // Keyboard Handlers
    useEffect(() => {
        const KEY_TO_MIDI: Record<string, number> = { 'a': 60, 's': 62, 'd': 64, 'f': 65, 'g': 67, 'h': 69, 'j': 71, 'k': 72 };
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (e.ctrlKey || e.metaKey || e.altKey || target.tagName === 'INPUT' || target.tagName === 'SELECT') return;
            const key = e.key.toLowerCase();
            if (KEY_TO_MIDI[key] && !pressedKeysRef.current.has(key)) { e.preventDefault(); pressedKeysRef.current.add(key); handleNoteOn(KEY_TO_MIDI[key]); }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (KEY_TO_MIDI[key]) { e.preventDefault(); pressedKeysRef.current.delete(key); handleNoteOff(KEY_TO_MIDI[key]); }
        };
        window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
        return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
    }, [handleNoteOn, handleNoteOff]);

    // --- AUDIO SCHEDULER LOGIC ---
    const LOOKAHEAD = 25.0; // ms
    const SCHEDULE_AHEAD_TIME = 0.2; // s (Increased buffer for stability)

    const getNextNote = useCallback(() => {
        const { arpSequence, pattern } = paramsRef.current;
        if (arpSequence.length === 0) return null;

        const currentState: ArpState = {
            noteIndex: noteIndexRef.current,
            direction: upDownDirectionRef.current
        };

        const { nextState, currentNoteIndex } = calculateNextArpState(currentState, pattern, arpSequence.length);

        // Update Refs
        noteIndexRef.current = nextState.noteIndex;
        upDownDirectionRef.current = nextState.direction;

        return { note: arpSequence[currentNoteIndex], index: currentNoteIndex };
    }, []);

    const scheduleNote = (seqStep: number, time: number) => {
        const { sequencerSteps, heldRoots } = paramsRef.current;

        const isActiveStep = sequencerSteps[seqStep];
        let noteToPlay: number | number[] | null = null;
        let noteIndex = -1;

        // ALWAYS advance the arpeggiator state (Pattern) on every clock tick
        // This ensures the pattern stays aligned with the grid (Musical behavior)
        if (heldRoots.length > 0) {
            const result = getNextNote();
            if (result) {
                // Only assign the note to be played if the Gate is OPEN
                if (isActiveStep) {
                    noteToPlay = result.note;
                    noteIndex = result.index;
                }
                // If Gate is CLOSED, we calculated the note (to advance state) but won't play it
            }
        }

        // Queue UI update
        notesInQueueRef.current.push({ noteIndex: (isActiveStep && heldRoots.length > 0) ? noteIndex : -1, seqIndex: seqStep, time });

        if (noteToPlay !== null && isActiveStep) {
            playOscillator(noteToPlay, time);
        }
    };

    const playOscillator = (midiNote: number | number[] | null, time: number) => {
        if (!audioContextRef.current || !masterGainRef.current || midiNote === null || typeof midiNote === 'undefined') return;
        const { waveform, gateLength, velocity, bpm, timeDivision } = paramsRef.current;
        const stepDuration = (60 / bpm) * TIME_DIVISIONS[timeDivision]; // s

        const trigger = (n: number) => {
            if (!Number.isFinite(n)) return;
            const ctx = audioContextRef.current!;
            const osc = ctx.createOscillator();
            osc.type = waveform;
            const freq = midiToFreq(n);
            osc.frequency.value = freq;
            const adsr = ctx.createGain();

            // Accurate ADSR timing
            adsr.gain.setValueAtTime(0, time);
            adsr.gain.linearRampToValueAtTime(velocity, time + 0.005); // fast attack

            const gateDuration = stepDuration * (gateLength >= 128 ? 1.0 : gateLength / 127.0);

            // Adaptive Release: Lower frequency = Longer release to prevent clicking
            // 20Hz -> ~0.25s, 100Hz -> ~0.05s, 500Hz+ -> ~0.01s
            const adaptiveRelease = Math.max(0.01, Math.min(0.25, 5 / freq));

            adsr.gain.setValueAtTime(velocity, time + gateDuration); // sustain
            adsr.gain.linearRampToValueAtTime(0, time + gateDuration + adaptiveRelease); // release

            osc.connect(adsr);
            adsr.connect(masterGainRef.current!);
            osc.start(time);
            osc.stop(time + gateDuration + adaptiveRelease + 0.1);
            osc.onended = () => { osc.disconnect(); adsr.disconnect(); };
        };

        // Send MIDI to VST Host (if active)
        if (isVST && midiNote !== null) {
            const notes = Array.isArray(midiNote) ? midiNote : [midiNote];
            notes.forEach(n => {
                // Note On (144)
                sendVSTMidi(144, n, Math.round(velocity * 127));
                // Note Off (128) - Scheduled (Approximation for VST JSON)
                setTimeout(() => sendVSTMidi(128, n, 0), stepDuration * gateLength / 127.0 * 1000);
            });
        }

        if (Array.isArray(midiNote)) midiNote.forEach(n => trigger(n)); else trigger(midiNote);
    };

    const nextNote = () => {
        const { bpm, timeDivision } = paramsRef.current;
        const secondsPerBeat = 60.0 / bpm;
        const stepTime = secondsPerBeat * TIME_DIVISIONS[timeDivision];

        nextNoteTimeRef.current += stepTime;
        seqStepRef.current = (seqStepRef.current + 1) % 16;
    };

    // Worker Ref
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        // Initialize Worker
        try {
            workerRef.current = new Worker('metronome.worker.js');
            workerRef.current.onmessage = (e) => {
                if (e.data === 'tick') {
                    scheduler();
                }
            };
        } catch (err) {
            console.warn("Worker failed to init (likely file:// protocol restriction):", err);
            // Fallback: Use setInterval if Worker fails (less accurate but works)
            timerIDRef.current = setInterval(scheduler, 25);
        }
        return () => {
            workerRef.current?.terminate();
            if (timerIDRef.current) clearInterval(timerIDRef.current);
        };
    }, []); // Run once on mount

    const scheduler = useCallback(() => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;

        // schedule ahead
        while (nextNoteTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD_TIME) {
            scheduleNote(seqStepRef.current, nextNoteTimeRef.current);
            nextNote();
        }
        // No setTimeout here anymore! Worker drives this.
    }, [getNextNote]);

    // UI VISUALIZER LOOP (RequestAnimationFrame)
    useEffect(() => {
        let rAF: number;
        const draw = () => {
            if (!audioContextRef.current) { rAF = requestAnimationFrame(draw); return; }
            const currentTime = audioContextRef.current.currentTime;

            let currentVisual = null;
            // Find the latest note that has passed 'now'
            while (notesInQueueRef.current.length && notesInQueueRef.current[0].time <= currentTime) {
                currentVisual = notesInQueueRef.current.shift();
            }

            if (currentVisual) {
                setCurrentSeqStep(currentVisual.seqIndex);
                if (currentVisual.noteIndex !== -1) setCurrentStep(currentVisual.noteIndex);
                else setCurrentStep(null);
            }

            if (!isPlaying) {
                // Optional: Reset visuals immediately on stop? 
                // Logic kept same as before for consistency
            }

            rAF = requestAnimationFrame(draw);
        };

        if (isPlaying) {
            rAF = requestAnimationFrame(draw);
        } else {
            setCurrentSeqStep(-1);
            setCurrentStep(null);
        }

        return () => cancelAnimationFrame(rAF);
    }, [isPlaying]);


    // START/STOP SCHEDULER
    useEffect(() => {
        if (isPlaying) {
            initializeAudio();
            // Reset counters
            noteIndexRef.current = 0;
            seqStepRef.current = 0;
            upDownDirectionRef.current = 'up';
            notesInQueueRef.current = [];

            if (audioContextRef.current) {
                nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.05;
                // Start Worker
                workerRef.current?.postMessage('start');
            }
        } else {
            // Stop Worker
            workerRef.current?.postMessage('stop');
        }
        // No cleanup of timerID needed
    }, [isPlaying]);

    // Clean up on unmount
    useEffect(() => { if (masterGainRef.current) masterGainRef.current.gain.value = masterVolume; }, [masterVolume]);

    const togglePlay = () => { initializeAudio(); setIsPlaying(prev => !prev); };
    const toggleHold = () => { const newHold = !isHoldOn; setIsHoldOn(newHold); if (!newHold) setHeldRoots([]); };

    // ... (Midi Save/Load Logic omitted/retained? I need to keep it) ...
    // Re-implementing helper functions for Save/Load/Play Midi to ensure they work with new context

    const stopAllMidiPlayback = useCallback(() => {
        if (audioContextRef.current) { scheduledEventsRef.current.forEach(id => clearTimeout(id as unknown as number)); scheduledEventsRef.current = []; if (midiMainGainRef.current) { midiMainGainRef.current.disconnect(); midiMainGainRef.current = null; } }
        setPlaybackState({});
    }, []);

    const playMidiData = useCallback(async (midiItem: SavedMidi) => {
        initializeAudio();
        const context = audioContextRef.current;
        if (!context) return;
        const { name, data: midiData } = midiItem;
        if (playbackState[name] === 'playing') { stopAllMidiPlayback(); return; }
        stopAllMidiPlayback();
        try {
            setPlaybackState({ [name]: 'playing' });
            const midiGain = context.createGain(); midiGain.gain.value = 1.0; midiGain.connect(masterGainRef.current!); midiMainGainRef.current = midiGain;
            const base64String = midiData.split(',')[1]; if (!base64String) throw new Error("Invalid MIDI data URI");
            const binaryString = atob(base64String); const bytes = new Uint8Array(binaryString.length); for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
            const playbackBpm = midiItem.settings?.bpm || 120; const parsedNotes = parseMidiNotes(bytes.buffer, playbackBpm); const now = context.currentTime; let maxTime = 0;
            parsedNotes.forEach(note => {
                const startTime = now + note.time; const stopTime = startTime + note.duration; if (stopTime > maxTime) maxTime = stopTime;
                const osc = context.createOscillator(); const gainNode = context.createGain(); const playbackWaveform = midiItem.settings?.waveform || paramsRef.current.waveform;
                osc.type = playbackWaveform; osc.frequency.setValueAtTime(midiToFreq(note.midi), startTime);
                gainNode.gain.setValueAtTime(0, startTime); gainNode.gain.linearRampToValueAtTime(midiItem.settings?.velocity || 0.8, startTime + 0.01); gainNode.gain.linearRampToValueAtTime(0, stopTime);
                osc.connect(gainNode); gainNode.connect(midiGain); osc.start(startTime); osc.stop(stopTime + 0.1); osc.onended = () => { osc.disconnect(); gainNode.disconnect(); };
            });
            const totalDuration = (maxTime - now) * 1000;
            const endPlaybackTimeout = setTimeout(() => { setPlaybackState(prev => ({ ...prev, [name]: 'stopped' })); }, totalDuration + 100);
            scheduledEventsRef.current.push(endPlaybackTimeout as unknown as number);
        } catch (error) { console.error(error); setModalState({ show: true, type: 'alert', title: 'PLAYBACK ERROR', message: 'CORRUPTED FILE OR PARSE ERROR' }); stopAllMidiPlayback(); }
    }, [playbackState, stopAllMidiPlayback]);

    const handleSaveMidi = () => {
        if (arpSequence.length === 0) { setModalState({ show: true, type: 'alert', title: 'EMPTY SEQUENCE', message: 'NO DATA TO SAVE' }); return; }

        // Generate actual pattern (4 bars = 64 steps)
        const exportSequence = generateArpeggioPattern(paramsRef.current, 64);

        const dataUri = createMidiDataUri(exportSequence, bpm, 480, TIME_DIVISIONS[timeDivision], gateLength, velocity);

        const newMidi: SavedMidi = { name: `Arp-${new Date().toLocaleTimeString().replace(/:/g, '')}`, data: dataUri, settings: { waveform, bpm, timeDivision, pattern, octaveRange, gateLength, velocity, rootNote, chordType, masterVolume, heldRoots, sortNotes, sequencerSteps } };
        setSavedMidis(prev => [...prev, newMidi]);
        setModalState({ show: true, type: 'success', title: 'SAVED', message: `PRESET "${newMidi.name}" STORED.` });
    };

    const closeModal = () => setModalState(prev => ({ ...prev, show: false }));
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans select-none text-[#ededed]">
            {/* MAIN CHASSIS */}
            <div className="relative w-full max-w-5xl rounded-xl border-4 border-[#1a1a1a] flex flex-col overflow-hidden bg-[#222] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_0_2px_rgba(255,255,255,0.1)]">

                {/* Screws */}
                <Screw className="absolute top-3 left-3" />
                <Screw className="absolute top-3 right-3" />
                <Screw className="absolute bottom-3 left-3" />
                <Screw className="absolute bottom-3 right-3" />

                {/* HEADER */}
                <div className="h-14 bg-[#111] border-b border-black flex items-center justify-between px-8 z-10 shadow-md">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-zinc-400 tracking-[0.2em] italic" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>YOJOIES ARPEGGIATOR</h1>
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1 border-l border-zinc-700 pl-3"> ARPEGGIATOR MIDI</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-[8px] text-zinc-600 font-mono tracking-wider">SER: 808-909-MKII</div>
                        <div className="flex gap-1 mt-1">
                            <div className="w-12 h-1.5 bg-zinc-800 rounded-full shadow-inner"></div>
                            <div className="w-12 h-1.5 bg-zinc-800 rounded-full shadow-inner"></div>
                        </div>
                    </div>
                </div>

                {/* INTERFACE GRID - RESPONSIVE UPDATE */}
                <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-8 relative z-10 w-full">

                    {/* DISPLAY - FULL WIDTH */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-12 h-40 bg-black rounded p-1 border-b border-zinc-700 shadow-[0_5px_15px_rgba(0,0,0,0.5)] relative group mb-2">
                        <div className="absolute top-3 left-4 text-[9px] text-zinc-500 font-mono z-30 tracking-wider">SEQUENCE MONITOR // <span className={isPlaying ? "text-[#2ed573] animate-pulse" : "text-red-500"}>{isPlaying ? "RUNNING" : "STOPPED"}</span></div>
                        <ArpDisplay sequence={arpSequence} currentStep={currentStep} />
                    </div>

                    {/* ROW 2: OSCILLATOR & PRESETS & ENGINE */}
                    {/* OSCILLATOR PANEL */}
                    <div className="col-span-1 lg:col-span-3 flex flex-col gap-4 min-h-[180px]">
                        <ModulePanel title="OSCILLATOR" className="h-full flex flex-col justify-between">
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {(['sine', 'square', 'sawtooth', 'triangle'] as const).map(w => (
                                    <button key={w} onClick={() => setWaveform(w)} className={`h-8 rounded-[2px] text-[8px] font-bold uppercase border transition-all duration-100 shadow-sm ${waveform === w ? 'bg-[#2ed573] text-black border-[#2ed573] shadow-[0_0_8px_rgba(46,213,115,0.4)]' : 'bg-[#333] text-[#888] border-[#111] hover:text-[#ccc] hover:bg-[#444]'}`}>{w.slice(0, 3)}</button>
                                ))}
                            </div>
                            <div className="flex justify-between items-end mt-4 px-1">
                                <Knob label="Gate" value={gateLength} min={10} max={128} onChange={setGateLength} size={50} color="#00dfd8" />
                                <Knob label="Vel" value={velocity} min={0} max={1} onChange={setVelocity} size={50} color="#00dfd8" />
                            </div>
                        </ModulePanel>
                    </div>

                    {/* NEW: GENRE PRESETS */}
                    <div className="col-span-1 lg:col-span-3 min-h-[180px]">
                        {/* Keep height consistent but allow growth on small screens */}
                        <PresetSelector currentPreset={currentPresetName} onSelect={loadSettings} />
                    </div>

                    {/* SEQUENCE ENGINE */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-6 flex flex-col gap-4 min-h-[180px]">
                        <ModulePanel title="SEQUENCE ENGINE" className="h-full">
                            <div className="absolute top-2 right-3 flex gap-1.5"><Led active={arpSequence.length > 0} /><Led active={isPlaying} color="#ff0080" /></div>
                            <div className="grid grid-cols-2 gap-6 mt-2">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="text-[8px] text-zinc-500 font-bold tracking-widest text-center">PATTERN</div>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            {(['Up', 'Down', 'UpDown', 'Random'] as const).map(p => (
                                                <button key={p} onClick={() => setPattern(p)} className={`h-6 text-[8px] uppercase font-bold rounded-[2px] border ${pattern === p ? 'bg-[#ffa502] text-black border-[#e67e22] shadow-[0_0_8px_rgba(255,165,2,0.4)]' : 'bg-[#222] text-zinc-500 border-[#111] hover:bg-[#333]'}`}>{p}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between px-2">
                                        <Knob label="Octave" value={octaveRange} min={1} max={4} onChange={setOctaveRange} size={40} color="#ffa502" />
                                        <Knob label="Root" value={rootNote} min={36} max={84} onChange={setRootNote} size={40} color="#ffa502" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[8px] text-zinc-500 font-bold tracking-widest text-center mb-1">TIME DIV</div>
                                    <div className="grid grid-cols-1 gap-1">
                                        {(['1/4', '1/8', '1/16', '1/32'] as const).map(t => (
                                            <button key={t} onClick={() => setTimeDivision(t as TimeDivision)} className={`h-5 flex items-center px-2 text-[8px] font-mono tracking-wider rounded-[1px] border-l-2 transition-all ${timeDivision === t ? 'bg-[#222] border-[#ffa502] text-[#ffa502]' : 'bg-[#111] border-zinc-800 text-zinc-600 hover:text-zinc-400'}`}>{t}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ModulePanel>
                    </div>

                    {/* MASTER CONTROLS */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-12 flex flex-col md:flex-row gap-4 h-full"> {/* Adjust col-span to fit logic */}
                        {/* Wait, Sequence Engine took 6, Preset 3, Oscillator 3 = 12. Row complete.
                                 New Row: Master Controls.
                             */}
                        <div className="w-full md:w-1/3 lg:w-1/4">
                            <ModulePanel title="MASTER" className="h-full flex flex-col min-h-[160px]">
                                <div className="flex justify-around mb-6 mt-2">
                                    <Knob label="BPM" value={bpm} min={60} max={200} onChange={setBpm} size={60} color="white" />
                                    <Knob label="Vol" value={masterVolume} min={0} max={1} onChange={setMasterVolume} size={60} color="white" />
                                </div>
                                <div className="mt-auto grid grid-cols-2 gap-3">
                                    <HardButton label={isPlaying ? "STOP" : "RUN"} active={isPlaying} color="green" onClick={togglePlay} />
                                    <HardButton label="HOLD" active={isHoldOn} color="red" onClick={toggleHold} />
                                </div>
                            </ModulePanel>
                        </div>

                        {/* RHYTHM GATE - TAKES REMAINING WIDTH */}
                        <div className="flex-1">
                            <div className="bg-[#1a1a1a] rounded p-3 pt-4 border border-[#111] shadow-inner relative overflow-hidden h-full flex flex-col justify-center">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 opacity-20"></div>
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div className="text-[10px] font-black text-[#555] tracking-[0.2em] flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_red]"></span>RHYTHM GATE</div>
                                    <div className="text-[8px] text-[#444] font-mono">16-STEP GATE CONTROL</div>
                                </div>
                                <div className="flex justify-between gap-0.5 md:gap-1 px-1">
                                    {sequencerSteps.map((isActive, i) => (
                                        <StepButton key={i} index={i} active={isActive} current={currentSeqStep === i} onClick={() => { const newSteps = [...sequencerSteps]; newSteps[i] = !newSteps[i]; setSequencerSteps(newSteps); }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KEYBOARD */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-12 mt-4">
                        <div className="bg-[#111] p-1 rounded-t-sm border-t border-[#333] pb-0 shadow-lg">
                            <div className="text-[8px] text-center text-[#555] tracking-[0.3em] mb-1 font-bold">VIRTUAL KEYBED CONTROLLER</div>
                        </div>
                        <VirtualKeyboard heldRoots={heldRoots} onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} />
                    </div>

                    {/* DATA CARTRIDGE - Bottom Full Width */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-12 bg-[#080808] rounded border border-[#333] p-3 flex flex-col md:flex-row items-center justify-between shadow-[inset_0_0_10px_black] gap-4">
                        <div className="flex items-center gap-6 pl-2 w-full overflow-hidden">
                            <div className="text-right shrink-0 hidden md:block">
                                <div className="text-[9px] font-bold text-[#666] tracking-wider">DATA RECORDER</div>
                                <div className="text-[8px] text-[#444] font-mono mt-0.5">CAPACITY: {savedMidis.length}/128</div>
                            </div>
                            <div className="h-8 w-[1px] bg-[#333] hidden md:block"></div>
                            <div className="flex gap-2 overflow-x-auto w-full custom-scrollbar pb-1">
                                {savedMidis.length === 0 ? <span className="text-[9px] text-[#444] italic self-center tracking-wider">-- NO DATA CARTRIDGE INSERTED --</span> : savedMidis.map((m, i) => (
                                    <div key={i} className="flex-shrink-0 w-28 bg-[#1a1a1a] border border-[#333] rounded-[2px] p-1.5 group relative hover:border-[#555] transition-colors">
                                        <div className="text-[8px] text-[#ccc] truncate font-mono">{m.name.replace('Arp-', '')}</div>
                                        <div className="flex gap-1 mt-1.5">
                                            <button onClick={() => playMidiData(m)} className={`flex-1 text-[8px] rounded-[1px] border border-[#333] hover:text-white ${playbackState[m.name] === 'playing' ? 'bg-red-900 text-red-100 animate-pulse' : 'bg-[#222] text-[#888]'}`}>{playbackState[m.name] === 'playing' ? 'STOP' : 'PLAY'}</button>
                                            <button onClick={() => loadSettings(m.settings!)} className="flex-1 bg-[#222] text-[#888] text-[8px] rounded-[1px] hover:text-[#00dfd8] border border-[#333]">LOAD</button>
                                            <a href={m.data} download={m.name} className="flex-1 bg-[#222] text-[#888] text-[8px] rounded-[1px] hover:text-white border border-[#333] text-center flex items-center justify-center">⇩</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0 md:ml-4 md:border-l border-[#333] md:pl-4 w-full md:w-auto">
                            <button onClick={handleSaveMidi} className="flex-1 md:flex-none h-8 px-3 bg-[#cc8e35] text-black text-[9px] font-bold rounded-[1px] border-b-2 border-[#a36b22] active:translate-y-[1px] shadow-lg hover:bg-[#eeb158]">SAVE</button>
                            <button onClick={() => setSavedMidis([])} className="flex-1 md:flex-none h-8 px-3 bg-[#333] text-[#888] text-[9px] font-bold rounded-[1px] border-b-2 border-[#111] active:translate-y-[1px] shadow hover:text-white">CLEAR</button>
                        </div>
                    </div>

                </div>


                {/* MODAL */}
                {modalState.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#222] border-2 border-zinc-700 p-6 rounded shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-sm w-full text-center">
                            <div className={`text-lg font-bold tracking-widest mb-2 ${modalState.type === 'alert' ? 'text-red-500' : 'text-[#2ed573]'}`}>{modalState.title}</div>
                            <div className="text-[11px] font-mono text-zinc-400 mb-6">{modalState.message}</div>
                            <button onClick={closeModal} className="px-6 py-2 bg-zinc-800 text-white text-[10px] font-bold tracking-widest border border-zinc-600 hover:bg-zinc-700">ACKNOWLEDGE</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );

}