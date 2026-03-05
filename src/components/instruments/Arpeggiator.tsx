"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { useVSTBridge } from '../../hooks/useVSTBridge';
import '../../app/arp/arp.css';

// --- TYPES ---
type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle';
type Pattern = 'Up' | 'Down' | 'UpDown' | 'Random';
type PlaybackState = 'stopped' | 'playing';
type TimeDivision = '1/4' | '1/8' | '1/16' | '1/32';
type MusicalKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
type Scale = 'Major' | 'Minor' | 'Dorian' | 'Phrygian' | 'Lydian' | 'Mixolydian' | 'Locrian' | 'Harmonic Minor' | 'Melodic Minor' | 'Pentatonic Major' | 'Pentatonic Minor' | 'Blues' | 'Chromatic' | 'Freestyle';

export interface ArpSettings {
    waveform: Waveform;
    bpm: number;
    timeDivision: TimeDivision;
    pattern: Pattern;
    octaveRange: number;
    gateLength: number;
    velocity: number;
    rootNote: number;
    masterVolume: number;
    heldRoots: number[];
    sortNotes: boolean;
    sequencerSteps: boolean[];
    heldNotes?: (string | string[])[];
    name?: string;
    musicalKey?: MusicalKey;
    scale?: Scale;
    style?: string;
    mood?: string;
    chords?: string[];
}

interface ArpeggiatorProps {
    compact?: boolean;
    onPlayChange?: (isPlaying: boolean) => void;
    onBpmChange?: (bpm: number) => void;
    onPatternChange?: (pattern: Pattern) => void;
    onWaveformChange?: (waveform: Waveform) => void;
    onPresetChange?: (presetName: string) => void;
    onSequenceChange?: (sequence: (number | number[] | null)[]) => void;
    initialSettings?: Partial<ArpSettings>;
    onSave?: (settings: ArpSettings) => void;
}

// --- CONSTANTS ---
const TIME_DIVISIONS: Record<TimeDivision, number> = { '1/4': 1, '1/8': 0.5, '1/16': 0.25, '1/32': 0.125 };
const ROOT_NOTES: Record<string, number> = { 'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63, 'E': 64, 'F': 65, 'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68, 'Ab': 68, 'A': 69, 'A#': 70, 'Bb': 70, 'B': 71 };
const SCALE_INTERVALS: Record<Scale, number[]> = {
    'Major': [0, 2, 4, 5, 7, 9, 11],
    'Minor': [0, 2, 3, 5, 7, 8, 10],
    'Dorian': [0, 2, 3, 5, 7, 9, 10],
    'Phrygian': [0, 1, 3, 5, 7, 8, 10],
    'Lydian': [0, 2, 4, 6, 7, 9, 11],
    'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
    'Locrian': [0, 1, 3, 5, 6, 8, 10],
    'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
    'Melodic Minor': [0, 2, 3, 5, 7, 9, 11],
    'Pentatonic Major': [0, 2, 4, 7, 9],
    'Pentatonic Minor': [0, 3, 5, 7, 10],
    'Blues': [0, 3, 5, 6, 7, 10],
    'Chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    'Freestyle': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] // เหมือน Chromatic แต่ไม่ transpose
};
const KEY_NAMES: MusicalKey[] = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
const SCALE_NAMES: Scale[] = ['Major', 'Minor', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian', 'Harmonic Minor', 'Melodic Minor', 'Pentatonic Major', 'Pentatonic Minor', 'Blues', 'Chromatic', 'Freestyle'];

const GENRE_PRESETS: Record<string, ArpSettings> = {
    'TRANCE': {
        name: 'TRANCE', waveform: 'sawtooth', bpm: 140, timeDivision: '1/16', pattern: 'UpDown',
        octaveRange: 2, gateLength: 90, velocity: 0.9, rootNote: 53,
        masterVolume: 0.6, heldRoots: [60, 63, 67, 72],
        sortNotes: true,
        sequencerSteps: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
        musicalKey: 'C', scale: 'Minor'
    },
    'SYNTHWAVE': {
        name: 'SYNTHWAVE', waveform: 'sawtooth', bpm: 110, timeDivision: '1/16', pattern: 'Down',
        octaveRange: 1, gateLength: 85, velocity: 0.85, rootNote: 33,
        masterVolume: 0.6, heldRoots: [60, 63, 67, 72, 75],
        sortNotes: false,
        sequencerSteps: [true, false, true, true, true, false, true, true, true, false, true, true, true, false, true, true],
        musicalKey: 'C', scale: 'Minor'
    },
    'TECHNO': {
        name: 'TECHNO', waveform: 'square', bpm: 135, timeDivision: '1/16', pattern: 'Up',
        octaveRange: 1, gateLength: 80, velocity: 1.0, rootNote: 36,
        masterVolume: 0.75, heldRoots: [60, 63, 67, 72],
        sortNotes: true,
        sequencerSteps: [true, false, true, true, true, true, true, false, true, true, true, true, true, true, true, false],
        musicalKey: 'C', scale: 'Minor'
    },
    'AMBIENT': {
        name: 'AMBIENT', waveform: 'triangle', bpm: 80, timeDivision: '1/8', pattern: 'Random',
        octaveRange: 3, gateLength: 110, velocity: 0.6, rootNote: 39,
        masterVolume: 0.5, heldRoots: [60, 64, 67, 71, 74, 79],
        sortNotes: true,
        sequencerSteps: [true, true, false, true, true, true, false, true, true, false, true, true, false, true, true, true],
        musicalKey: 'C', scale: 'Major'
    },
    'CHIPTUNE': {
        name: 'CHIPTUNE', waveform: 'square', bpm: 160, timeDivision: '1/32', pattern: 'Up',
        octaveRange: 2, gateLength: 85, velocity: 0.8, rootNote: 64,
        masterVolume: 0.5, heldRoots: [60, 64, 67, 71, 72, 76],
        sortNotes: true,
        sequencerSteps: [true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true],
        musicalKey: 'C', scale: 'Major'
    },
    'DEEP HOUSE': {
        name: 'DEEP HOUSE', waveform: 'sawtooth', bpm: 124, timeDivision: '1/8', pattern: 'UpDown',
        octaveRange: 2, gateLength: 85, velocity: 0.75, rootNote: 43,
        masterVolume: 0.65, heldRoots: [60, 63, 67, 70, 74, 77],
        sortNotes: true,
        sequencerSteps: [true, false, true, true, false, true, true, false, true, true, true, false, true, true, true, true],
        musicalKey: 'C', scale: 'Minor'
    },
    'DNB': {
        name: 'DNB', waveform: 'sawtooth', bpm: 174, timeDivision: '1/16', pattern: 'Random',
        octaveRange: 2, gateLength: 90, velocity: 1.0, rootNote: 41,
        masterVolume: 0.7, heldRoots: [60, 63, 67, 70, 75],
        sortNotes: false,
        sequencerSteps: [true, true, true, false, true, true, false, true, true, true, false, true, true, false, true, true],
        musicalKey: 'C', scale: 'Minor'
    },
    'LO-FI': {
        name: 'LO-FI', waveform: 'sine', bpm: 85, timeDivision: '1/8', pattern: 'Down',
        octaveRange: 1, gateLength: 95, velocity: 0.6, rootNote: 49,
        masterVolume: 0.55, heldRoots: [60, 64, 67, 71, 74],
        sortNotes: true,
        sequencerSteps: [true, false, true, false, true, true, false, true, false, true, false, false, true, false, true, false],
        musicalKey: 'C', scale: 'Major'
    },
    'CYBERPUNK': {
        name: 'CYBERPUNK', waveform: 'sawtooth', bpm: 100, timeDivision: '1/16', pattern: 'Down',
        octaveRange: 1, gateLength: 90, velocity: 0.95, rootNote: 36,
        masterVolume: 0.7, heldRoots: [60, 66, 67, 72],
        sortNotes: false,
        sequencerSteps: [true, true, true, true, true, true, false, true, true, true, true, true, true, false, true, true],
        musicalKey: 'C', scale: 'Chromatic'
    },
    'CLASSICAL': {
        name: 'CLASSICAL', waveform: 'triangle', bpm: 120, timeDivision: '1/16', pattern: 'UpDown',
        octaveRange: 3, gateLength: 95, velocity: 0.7, rootNote: 61,
        masterVolume: 0.6, heldRoots: [60, 63, 68, 72],
        sortNotes: true,
        sequencerSteps: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
        musicalKey: 'C', scale: 'Major'
    },
    'FREESTYLE': {
        name: 'FREESTYLE', waveform: 'sawtooth', bpm: 120, timeDivision: '1/16', pattern: 'UpDown',
        octaveRange: 2, gateLength: 90, velocity: 0.8, rootNote: 60,
        masterVolume: 0.7, heldRoots: [],
        sortNotes: true,
        sequencerSteps: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
        musicalKey: 'C', scale: 'Freestyle'
    }
};

// --- HELPER FUNCTIONS ---
const midiToFreq = (midi: number): number => Math.pow(2, (midi - 69) / 12) * 440;

const midiToNoteName = (midi: number): string => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    return noteNames[midi % 12] + octave;
};

const noteNameToMidi = (note: string): number => {
    const noteNames: Record<string, number> = { 'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11 };
    const match = note.match(/^([A-G][b#]?)(-?\d+)$/);
    if (!match) return 60;
    const name = match[1];
    const octave = parseInt(match[2]);
    return (octave + 1) * 12 + (noteNames[name] || 0);
};

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
            noteIndex = (noteIndex + 1) % sequenceLength;
            break;
        case 'Down':
            const step = noteIndex % sequenceLength;
            currentNoteIndex = sequenceLength - 1 - step;
            noteIndex = (noteIndex + 1) % sequenceLength;
            break;
        case 'UpDown':
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
                } else {
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
            noteIndex = (noteIndex + 1) % sequenceLength;
            break;
        default:
            currentNoteIndex = noteIndex % sequenceLength;
            noteIndex++;
            break;
    }

    return { nextState: { noteIndex, direction }, currentNoteIndex };
};

const generateArpeggioPattern = (params: any, stepCount = 64): (number | number[] | null)[] => {
    const { arpSequence, pattern, sequencerSteps } = params;
    if (!arpSequence.length) return [];

    const generated: (number | number[] | null)[] = [];
    let state: ArpState = { noteIndex: 0, direction: 'up' };

    for (let i = 0; i < stepCount; i++) {
        const seqStep = i % 16;
        const { nextState, currentNoteIndex } = calculateNextArpState(state, pattern, arpSequence.length);
        state = nextState;
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

    const microsecondsPerBeat = Math.round(60000000 / bpm);
    const tempoBytes = [
        (microsecondsPerBeat >> 16) & 0xFF,
        (microsecondsPerBeat >> 8) & 0xFF,
        microsecondsPerBeat & 0xFF
    ];
    events.push({ ticks: 0, type: 0xFF, metaType: 0x51, data: tempoBytes });

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
        trackEvents.push(...writeVarInt(event.ticks - lastEventTicks));
        lastEventTicks = event.ticks;
        if (event.type === 0xFF) {
            trackEvents.push(0xFF, event.metaType!, event.data!.length, ...event.data!);
        } else {
            trackEvents.push(event.type, event.note!, event.velocity!);
        }
    });

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

// --- UI COMPONENTS ---

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
};

const HardButton = ({ label, active, onClick, color = "red" }: { label: React.ReactNode, active: boolean, onClick: () => void, color?: string }) => {
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

const Led = ({ active, color = "#2ed573" }: { active: boolean, color?: string }) => (
    <div
        className={`w-2 h-2 rounded-full transition-all duration-75 border border-black/50 ${active ? 'opacity-100 bg-white' : 'opacity-30 bg-zinc-600'}`}
        style={{
            backgroundColor: active ? color : undefined,
            boxShadow: active ? `0 0 8px ${color}, inset 0 0 2px rgba(255,255,255,0.8)` : 'none'
        }}
    />
);

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

const Screw = ({ className }: { className?: string }) => (
    <div className={`w-3 h-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,#666,#111)] shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center border border-[#111] ${className}`}>
        <div className="w-[80%] h-[1px] bg-[#1a1a1a] rotate-45"></div>
        <div className="w-[80%] h-[1px] bg-[#1a1a1a] -rotate-45 absolute"></div>
    </div>
);

const StepButton = ({ index, active, current, onClick }: { index: number, active: boolean, current: boolean, onClick: () => void }) => {
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

const VirtualKeyboard = ({ heldRoots, activeChordNotes, onNoteOn, onNoteOff }: { heldRoots: number[], activeChordNotes?: number[], onNoteOn: (n: number) => void, onNoteOff: (n: number) => void }) => {
    const keys = useMemo(() => {
        let startMidi = 48;
        let endMidi = 72;

        // ใช้ activeChordNotes ถ้ามี (จาก heldNotes) ไม่อย่างนั้นใช้ heldRoots
        const displayNotes = activeChordNotes && activeChordNotes.length > 0 ? activeChordNotes : heldRoots;

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
    }, [heldRoots, activeChordNotes]);

    const whiteKeys = keys.filter(k => k.type === 'white');
    const whiteKeyWidthPct = 100 / whiteKeys.length;

    return (
        <div className="w-full relative h-[120px] select-none bg-zinc-950 rounded-b-md overflow-hidden shadow-inner border-t-4 border-zinc-900">
            {whiteKeys.map((key, index) => {
                // ใช้ activeChordNotes ถ้ามี ไม่อย่างนั้นใช้ heldRoots
                const displayNotes = activeChordNotes && activeChordNotes.length > 0 ? activeChordNotes : heldRoots;
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
                // ใช้ activeChordNotes ถ้ามี ไม่อย่างนั้นใช้ heldRoots
                const displayNotes = activeChordNotes && activeChordNotes.length > 0 ? activeChordNotes : heldRoots;
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
};

const ArpGrid = memo(({ sequence }: { sequence: (number | number[] | null)[] }) => {
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

const ArpDisplay = memo(({ sequence, currentStep }: { sequence: (number | number[] | null)[], currentStep: number | null }) => {
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

type SavedMidi = { name: string; data: string; settings?: ArpSettings; };

// --- MAIN COMPONENT ---

export default function Arpeggiator({
    compact = false,
    onPlayChange,
    onBpmChange,
    onPatternChange,
    onWaveformChange,
    onPresetChange,
    onSequenceChange,
    onSave,
    initialSettings
}: ArpeggiatorProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeMidiNotes, setActiveMidiNotes] = useState<(number | number[])[]>([]);
    const [heldRoots, setHeldRoots] = useState<number[]>([]);
    const [activeChordNotes, setActiveChordNotes] = useState<number[]>([]); // โน๊ตทั้งหมดจาก heldNotes สำหรับแสดงบน Virtual Keyboard
    const [waveform, setWaveform] = useState<Waveform>(initialSettings?.waveform || 'sine');
    const [masterVolume, setMasterVolume] = useState(initialSettings?.masterVolume || 0.5);
    const [gateLength, setGateLength] = useState(initialSettings?.gateLength || 100);
    const [velocity, setVelocity] = useState(initialSettings?.velocity || 1.0);
    const [bpm, setBpm] = useState(initialSettings?.bpm || 120);
    const [timeDivision, setTimeDivision] = useState<TimeDivision>(initialSettings?.timeDivision || '1/16');
    const [pattern, setPattern] = useState<Pattern>(initialSettings?.pattern || 'Up');
    const [sortNotes, setSortNotes] = useState(initialSettings?.sortNotes || false);
    const [octaveRange, setOctaveRange] = useState(initialSettings?.octaveRange || 1);
    const [rootNote, setRootNote] = useState<number>(initialSettings?.rootNote || 60);
    const [musicalKey, setMusicalKey] = useState<MusicalKey>(initialSettings?.musicalKey || 'C');
    const [scale, setScale] = useState<Scale>(initialSettings?.scale || 'Major');
    const [style, setStyle] = useState<string>(initialSettings?.style || '');
    const [mood, setMood] = useState<string>(initialSettings?.mood || '');
    const [chords, setChords] = useState<string[]>(initialSettings?.chords || []);
    const [savedMidis, setSavedMidis] = useState<SavedMidi[]>([]);
    const [playbackState, setPlaybackState] = useState<Record<string, PlaybackState>>({});
    const [isHoldOn, setIsHoldOn] = useState(false);
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
    const [keyboardOctave, setKeyboardOctave] = useState(0); // Octave offset for keyboard input (-2 to +2)
    const [currentPresetName, setCurrentPresetName] = useState<string | null>(null);

    const [currentStep, setCurrentStep] = useState<number | null>(null);
    const [currentSeqStep, setCurrentSeqStep] = useState<number>(-1);
    const [sequencerSteps, setSequencerSteps] = useState<boolean[]>(initialSettings?.sequencerSteps || Array(16).fill(true));
    const [modalState, setModalState] = useState<{ show: boolean; type: 'alert' | 'confirm' | 'success'; title: string; message: string; onConfirm?: () => void; }>({ show: false, type: 'alert', title: '', message: '' });

    const { isVST, sendVSTMidi } = useVSTBridge();

    const audioContextRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const midiMainGainRef = useRef<GainNode | null>(null);
    const compressorRef = useRef<DynamicsCompressorNode | null>(null);

    const timerIDRef = useRef<NodeJS.Timeout | null>(null);
    const nextNoteTimeRef = useRef(0.0);
    const noteIndexRef = useRef(0);
    const seqStepRef = useRef(0);
    const upDownDirectionRef = useRef<'up' | 'down'>('up');

    const notesInQueueRef = useRef<{ noteIndex: number, seqIndex: number, midiNote: number | number[] | null, time: number }[]>([]);

    const pressedKeysRef = useRef(new Set<string>());
    const scheduledEventsRef = useRef<number[]>([]);

    const loadSettings = useCallback((settings: ArpSettings) => {
        setWaveform(settings.waveform);
        setBpm(settings.bpm);
        setTimeDivision(settings.timeDivision);
        setPattern(settings.pattern);
        setOctaveRange(settings.octaveRange);
        setGateLength(settings.gateLength);
        setVelocity(settings.velocity);
        setMasterVolume(settings.masterVolume);
        setSortNotes(settings.sortNotes ?? false);
        setSequencerSteps(settings.sequencerSteps || Array(16).fill(true));
        if (settings.name) setCurrentPresetName(settings.name);
        if (settings.musicalKey) setMusicalKey(settings.musicalKey);
        if (settings.scale) setScale(settings.scale);

        let targetRoot = settings.rootNote;

        // เซ็ต activeChordNotes จาก heldNotes (สำหรับแสดงบน Virtual Keyboard)
        if (settings.heldNotes && settings.heldNotes.length > 0) {
            const flatNotes: string[] = settings.heldNotes.flat() as string[];
            const allChordNotes = Array.from(new Set(flatNotes.map(noteNameToMidi)));
            setActiveChordNotes(allChordNotes);
        }

        // ใช้ heldRoots จาก settings โดยตรง (สำคัญ: เพื่อให้ AI ส่งค่ามาแล้วเล่นได้ทันที)
        if (settings.heldRoots && settings.heldRoots.length > 0) {
            setHeldRoots(settings.heldRoots);
            setIsHoldOn(true);
        } else if (settings.heldNotes && settings.heldNotes.length > 0) {
            const flatNotes: string[] = settings.heldNotes.flat() as string[];
            const uniqueNotes = Array.from(new Set(flatNotes));
            const rawMidiNotes = uniqueNotes.map(noteNameToMidi);

            if (rawMidiNotes.length > 0) {
                const firstNoteMidi = rawMidiNotes[0];
                const derivedRoot = 60 + (firstNoteMidi % 12);
                targetRoot = derivedRoot;

                const transposeOffset = derivedRoot - 60;
                const adjustedRoots = rawMidiNotes.map(n => n - transposeOffset);
                setHeldRoots(adjustedRoots);
                setIsHoldOn(true);
            }
        }

        setRootNote(targetRoot);
        onPresetChange?.(settings.name || '');
    }, [onPresetChange]);

    // Log เมื่อ component mount/unmount
    useEffect(() => {
        // Initialize audio บน mount (ต้องเกิดจาก user gesture)
        const handleUserGesture = () => {
            initializeAudio();
            document.removeEventListener('click', handleUserGesture);
            document.removeEventListener('keydown', handleUserGesture);
        };
        
        document.addEventListener('click', handleUserGesture);
        document.addEventListener('keydown', handleUserGesture);
        
        return () => {
            document.removeEventListener('click', handleUserGesture);
            document.removeEventListener('keydown', handleUserGesture);
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // ตั้งค่า initialKey และ initialScale สำหรับ transpose
    const [initialKey, setInitialKey] = useState<MusicalKey | null>(null);
    const hasInitializedRef = useRef(false); // เช็คว่าเคยเซ็ตค่าเริ่มต้นแล้วหรือยัง

    // เซ็ตค่าเริ่มต้นจาก initialSettings (รันแค่ครั้งเดียวตอน mount)
    useEffect(() => {
        if (!initialSettings || hasInitializedRef.current) return;
        hasInitializedRef.current = true;

        console.log('[Arpeggiator] Initializing with initialSettings:', initialSettings);

        if (initialSettings.musicalKey) {
            setMusicalKey(initialSettings.musicalKey);
            setInitialKey(initialSettings.musicalKey);
        }
        if (initialSettings.scale) setScale(initialSettings.scale);

        // เซ็ต Hold = true โดยอัตโนมัติถ้ามี heldRoots จาก initialSettings (เพื่อให้กด RUN แล้วเล่นได้ทันที)
        if (initialSettings.heldRoots && initialSettings.heldRoots.length > 0) {
            console.log('[Arpeggiator] Setting heldRoots:', initialSettings.heldRoots);
            setHeldRoots(initialSettings.heldRoots);
            setIsHoldOn(true);
        }

        // เซ็ต activeChordNotes จาก heldNotes (สำหรับแสดงบน Virtual Keyboard)
        if (initialSettings.heldNotes && initialSettings.heldNotes.length > 0) {
            const flatNotes: string[] = initialSettings.heldNotes
                .flat()
                .filter((n): n is string => typeof n === 'string' && n.length > 0);
            if (flatNotes.length > 0) {
                const allChordNotes = Array.from(new Set(flatNotes.map(noteNameToMidi)));
                console.log('[Arpeggiator] Setting activeChordNotes from heldNotes:', allChordNotes);
                setActiveChordNotes(allChordNotes);
            }
        }
    }, []);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('savedMidis');
            if (saved) setSavedMidis(JSON.parse(saved));
        } catch (e) { console.warn("LocalStorage read failed", e); }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('savedMidis', JSON.stringify(savedMidis));
        } catch (e) { console.warn("LocalStorage write failed", e); }
    }, [savedMidis]);

    // คำนวณ activeMidiNotes จาก heldRoots/activeChordNotes + KEY + SCALE (transpose ตาม key)
    useEffect(() => {
        // ใช้ activeChordNotes ถ้ามี ไม่อย่างนั้นใช้ heldRoots
        const sourceNotes = activeChordNotes && activeChordNotes.length > 0 ? activeChordNotes : heldRoots;

        if (sourceNotes.length === 0) {
            setActiveMidiNotes([]);
            return;
        }

        // Freestyle: ใช้โน๊ตตามที่กดเลย ไม่บังคับตาม scale
        if (scale === 'Freestyle') {
            setActiveMidiNotes([...sourceNotes]);
            return;
        }

        // ถ้าไม่มี initialKey ให้ใช้โน๊ตตรงๆ
        if (!initialKey) {
            setActiveMidiNotes([...sourceNotes]);
            return;
        }

        const scaleIntervals = SCALE_INTERVALS[scale];
        const currentKeyRootMidi = ROOT_NOTES[musicalKey];
        const initialKeyRootMidi = ROOT_NOTES[initialKey];

        // คำนวณ interval จาก initialKey แล้ว transpose ไป currentKey
        const transposedNotes = sourceNotes.map(keyMidi => {
            // คำนวณ interval จาก initialKey
            const initialInterval = (keyMidi - initialKeyRootMidi + 1200) % 12;
            const octaveOffset = Math.floor((keyMidi - initialKeyRootMidi) / 12) * 12;

            // Transpose ไปยัง currentKey
            const transposedNote = currentKeyRootMidi + initialInterval + octaveOffset;

            // ปรับให้อยู่ใน scale (ถ้าไม่อยู่ใน scale ให้หาโน๊ตที่ใกล้ที่สุด)
            const rawInterval = (transposedNote - currentKeyRootMidi + 1200) % 12;
            if (scaleIntervals.includes(rawInterval)) {
                return transposedNote;
            }

            // หาโน๊ตที่ใกล้ที่สุดใน scale
            let closestInterval = scaleIntervals[0];
            let minDiff = 12;
            for (const interval of scaleIntervals) {
                let diff = Math.abs(rawInterval - interval);
                if (diff > 6) diff = 12 - diff;
                if (diff < minDiff) {
                    minDiff = diff;
                    closestInterval = interval;
                }
            }

            return currentKeyRootMidi + closestInterval + octaveOffset;
        });

        setActiveMidiNotes(transposedNotes);
    }, [heldRoots, activeChordNotes, musicalKey, scale, initialKey]);

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
    const paramsRef = useRef({ waveform, masterVolume, gateLength, velocity, bpm, timeDivision, pattern, octaveRange, arpSequence: [] as (number | number[] | null)[], heldRoots, sortNotes, sequencerSteps, musicalKey, scale });
    useEffect(() => { paramsRef.current = { waveform, masterVolume, gateLength, velocity, bpm, timeDivision, pattern, octaveRange, arpSequence, heldRoots, sortNotes, sequencerSteps, musicalKey, scale }; }, [waveform, masterVolume, gateLength, velocity, bpm, timeDivision, pattern, octaveRange, arpSequence, heldRoots, sortNotes, sequencerSteps, musicalKey, scale]);

    useEffect(() => {
        onSequenceChange?.(arpSequence);
    }, [arpSequence, onSequenceChange]);

    useEffect(() => {
        onPlayChange?.(isPlaying);
    }, [isPlaying, onPlayChange]);

    useEffect(() => {
        onBpmChange?.(bpm);
    }, [bpm, onBpmChange]);

    useEffect(() => {
        onPatternChange?.(pattern);
    }, [pattern, onPatternChange]);

    useEffect(() => {
        onWaveformChange?.(waveform);
    }, [waveform, onWaveformChange]);

    const initializeAudio = useCallback(() => {
        if (!audioContextRef.current) {
            try {
                const context = new (window.AudioContext || (window as any).webkitAudioContext)();
                audioContextRef.current = context;

                const masterGain = context.createGain();
                const compressor = context.createDynamicsCompressor();

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
            } catch (error) {
                console.error('[Arpeggiator] Error creating audio context:', error);
            }
        }

        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume().catch(err => {
                console.error('[Arpeggiator] Error resuming audio context:', err);
            });
        }
    }, [masterVolume]);

    // State สำหรับ Undo
    const [heldRootsHistory, setHeldRootsHistory] = useState<number[][]>([]);
    const [activeChordNotesHistory, setActiveChordNotesHistory] = useState<number[][]>([]);

    // State สำหรับเก็บโน๊ตที่กดในขณะ Hold ปิด (momentary notes)
    const momentaryNotes = useRef<Set<number>>(new Set());

    const handleNoteOn = useCallback((midiNote: number) => {
        initializeAudio();

        if (isHoldOn) {
            // Hold เปิด: บันทึก state สำหรับ Undo แล้ว toggle โน๊ต (latch mode)
            setHeldRootsHistory(prev => [...prev.slice(-9), [...heldRoots]]);
            setActiveChordNotesHistory(prev => [...prev.slice(-9), [...activeChordNotes]]);

            // Toggle โน๊ต: ถ้ามีอยู่แล้วให้ลบออก, ถ้าไม่มีให้เพิ่ม
            setHeldRoots(prev => {
                if (prev.includes(midiNote)) {
                    return prev.filter(n => n !== midiNote);
                }
                return [...prev, midiNote];
            });
            setActiveChordNotes(prev => {
                if (prev.includes(midiNote)) {
                    return prev.filter(n => n !== midiNote);
                }
                return [...prev, midiNote];
            });
        } else {
            // Hold ปิด: เพิ่มโน๊ตแบบ momentary (ผู้ใช้ต้องกดค้างเอง ปล่อยมือ=โน๊ตหลุด)
            momentaryNotes.current.add(midiNote);
            setHeldRoots(prev => {
                if (!prev.includes(midiNote)) {
                    return [...prev, midiNote];
                }
                return prev;
            });
            setActiveChordNotes(prev => {
                if (!prev.includes(midiNote)) {
                    return [...prev, midiNote];
                }
                return prev;
            });
        }
    }, [initializeAudio, isHoldOn, heldRoots, activeChordNotes]);

    const handleNoteOff = useCallback((midiNote: number) => {
        if (!isHoldOn) {
            // Hold ปิด: ลบเฉพาะ momentary notes (โน๊ตที่ผู้ใช้กดค้างไว้)
            // ปล่อยมือ = โน๊ตหลุด (momentary mode)
            if (momentaryNotes.current.has(midiNote)) {
                momentaryNotes.current.delete(midiNote);
                setHeldRoots(prev => prev.filter(n => n !== midiNote));
                setActiveChordNotes(prev => prev.filter(n => n !== midiNote));
            }
        }
        // Hold เปิด: ไม่ลบโน๊ต (โน๊ตจะค้างอยู่จนกว่าจะกดซ้ำหรือ CLEAR) - latch mode
    }, [isHoldOn]);

    // Clear momentary notes เมื่อ Hold ถูกเปิด หรือเมื่อหยุดเล่น
    useEffect(() => {
        if (isHoldOn) {
            momentaryNotes.current.clear();
        }
    }, [isHoldOn]);

    useEffect(() => {
        if (!isPlaying) {
            momentaryNotes.current.clear();
        }
    }, [isPlaying]);

    // ฟังก์ชัน Undo
    const undo = useCallback(() => {
        if (heldRootsHistory.length > 0) {
            const lastRoots = heldRootsHistory[heldRootsHistory.length - 1];
            setHeldRoots(lastRoots);
            setHeldRootsHistory(prev => prev.slice(0, -1));
        }
        if (activeChordNotesHistory.length > 0) {
            const lastChords = activeChordNotesHistory[activeChordNotesHistory.length - 1];
            setActiveChordNotes(lastChords);
            setActiveChordNotesHistory(prev => prev.slice(0, -1));
        }
    }, [heldRootsHistory, activeChordNotesHistory]);

    // ฟังก์ชัน Clear โน๊ตทั้งหมด (ลบหมดทุกอย่าง)
    const clearNotes = useCallback(() => {
        // บันทึก state ปัจจุบันสำหรับ Undo
        setHeldRootsHistory(prev => [...prev.slice(-9), [...heldRoots]]);
        setActiveChordNotesHistory(prev => [...prev.slice(-9), [...activeChordNotes]]);

        // ลบโน๊ตทั้งหมด
        setHeldRoots([]);
        setActiveChordNotes([]);
    }, [heldRoots, activeChordNotes]);

    // ฟังก์ชัน Save ARP Settings (แสดง confirmation modal)
    const handleSave = useCallback(() => {
        // ตรวจสอบว่ามีโน๊ตหรือไม่
        if (heldRoots.length === 0) {
            setModalState({
                show: true,
                type: 'alert',
                title: 'NO NOTES',
                message: 'Please add notes before saving. Press keys or enable HOLD to add notes.',
            });
            return;
        }

        setModalState({
            show: true,
            type: 'confirm',
            title: 'CONFIRM SAVE',
            message: `Save current arpeggiator settings? (BPM: ${Math.round(bpm)}, Pattern: ${pattern}, Key: ${musicalKey}, Notes: ${heldRoots.length})`,
            onConfirm: () => {
                const settings: ArpSettings = {
                    waveform,
                    bpm: Math.round(bpm), // ปัดเศษ BPM เป็นจำนวนเต็ม
                    timeDivision,
                    pattern,
                    octaveRange,
                    gateLength: Math.round(gateLength), // ปัดเศษ gateLength เป็นจำนวนเต็ม
                    velocity: Math.round(velocity * 100) / 100, // ปัดเศษ velocity 2 ตำแหน่ง
                    rootNote: Math.round(rootNote), // ปัดเศษ rootNote เป็นจำนวนเต็ม
                    masterVolume: Math.round(masterVolume * 100) / 100, // ปัดเศษ masterVolume 2 ตำแหน่ง
                    heldRoots: heldRoots.map(n => Math.round(n)), // ปัดเศษ heldRoots เป็นจำนวนเต็ม
                    sortNotes,
                    sequencerSteps,
                    musicalKey,
                    scale,
                    heldNotes: activeChordNotes.length > 0 ? activeChordNotes.map(n => midiToNoteName(n)) : undefined,
                    style,
                    mood,
                    chords,
                };
                onSave?.(settings);
                setModalState({ show: false, type: 'alert', title: '', message: '' });
                // Show success message after save
                setTimeout(() => {
                    setModalState({
                        show: true,
                        type: 'success',
                        title: 'SAVED',
                        message: 'Arpeggiator settings saved successfully!',
                    });
                }, 100);
            }
        });
    }, [waveform, bpm, timeDivision, pattern, octaveRange, gateLength, velocity, rootNote, masterVolume, heldRoots, sortNotes, sequencerSteps, musicalKey, scale, activeChordNotes, style, mood, chords, onSave]);

    // Initialize audio เมื่อ component mount (สำหรับแสดงใน chat)
    useEffect(() => {
        const handleUserGesture = () => {
            initializeAudio();
            document.removeEventListener('click', handleUserGesture);
            document.removeEventListener('keydown', handleUserGesture);
        };

        document.addEventListener('click', handleUserGesture);
        document.addEventListener('keydown', handleUserGesture);

        return () => {
            document.removeEventListener('click', handleUserGesture);
            document.removeEventListener('keydown', handleUserGesture);
        };
    }, [initializeAudio]);

    // Keyboard input for playing VIRTUAL KEYBED
    useEffect(() => {
        // Map computer keyboard to MIDI notes (2 octaves starting from C3 + keyboardOctave offset)
        const baseOctave = 3 + keyboardOctave; // Default C3, can be changed with octave buttons
        const KEY_TO_MIDI: Record<string, number> = {
            // Lower octave (starts from C of baseOctave)
            'a': 12 * baseOctave, 'w': 12 * baseOctave + 1, 's': 12 * baseOctave + 1, 'e': 12 * baseOctave + 2, 'd': 12 * baseOctave + 3, 'f': 12 * baseOctave + 4, 't': 12 * baseOctave + 5, 'g': 12 * baseOctave + 6, 'y': 12 * baseOctave + 7, 'h': 12 * baseOctave + 8, 'u': 12 * baseOctave + 9, 'j': 12 * baseOctave + 10, 'k': 12 * baseOctave + 11,
            // Upper octave (starts from C of baseOctave+1)
            'z': 12 * (baseOctave + 1), 's': 12 * (baseOctave + 1) + 1, 'x': 12 * (baseOctave + 1) + 2, 'd': 12 * (baseOctave + 1) + 3, 'c': 12 * (baseOctave + 1) + 4, 'v': 12 * (baseOctave + 1) + 5, 'g': 12 * (baseOctave + 1) + 6, 'b': 12 * (baseOctave + 1) + 7, 'n': 12 * (baseOctave + 1) + 8, 'm': 12 * (baseOctave + 1) + 9, ',': 12 * (baseOctave + 1) + 10, '.': 12 * (baseOctave + 1) + 11, '/': 12 * (baseOctave + 1) + 12
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            // Ignore if typing in input or modifier keys are pressed
            if (e.ctrlKey || e.metaKey || e.altKey || target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.isContentEditable) return;

            const key = e.key.toLowerCase();
            if (KEY_TO_MIDI[key] && !pressedKeysRef.current.has(key)) {
                e.preventDefault();
                pressedKeysRef.current.add(key);
                handleNoteOn(KEY_TO_MIDI[key]);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (KEY_TO_MIDI[key]) {
                e.preventDefault();
                pressedKeysRef.current.delete(key);

                if (!isHoldOn) {
                    handleNoteOff(KEY_TO_MIDI[key]);
                }
                // Hold เปิด: ไม่ลบโน๊ต (latch mode)
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isHoldOn, handleNoteOn, handleNoteOff, keyboardOctave]);

    const LOOKAHEAD = 25.0;
    const SCHEDULE_AHEAD_TIME = 0.2;

    const getNextNote = useCallback(() => {
        const { arpSequence, pattern } = paramsRef.current;
        if (arpSequence.length === 0) return null;

        const currentState: ArpState = {
            noteIndex: noteIndexRef.current,
            direction: upDownDirectionRef.current
        };

        const { nextState, currentNoteIndex } = calculateNextArpState(currentState, pattern, arpSequence.length);

        noteIndexRef.current = nextState.noteIndex;
        upDownDirectionRef.current = nextState.direction;

        return { note: arpSequence[currentNoteIndex], index: currentNoteIndex };
    }, []);

    const scheduleNote = (seqStep: number, time: number) => {
        const { sequencerSteps } = paramsRef.current;

        const isActiveStep = sequencerSteps[seqStep];
        let noteToPlay: number | number[] | null = null;
        let noteIndex = -1;

        // ใช้ heldRoots จาก state โดยตรง ไม่ใช่จาก paramsRef
        if (heldRoots.length > 0) {
            const result = getNextNote();
            if (result) {
                if (isActiveStep) {
                    noteToPlay = result.note;
                    noteIndex = result.index;
                }
            }
        }

        notesInQueueRef.current.push({
            noteIndex: (isActiveStep && heldRoots.length > 0 && noteToPlay !== null) ? noteIndex : -1,
            seqIndex: seqStep,
            midiNote: (isActiveStep && heldRoots.length > 0) ? noteToPlay : null,
            time
        });

        if (noteToPlay !== null && isActiveStep) {
            playOscillator(noteToPlay, time);
        }
    };

    const playOscillator = (midiNote: number | number[] | null, time: number) => {
        if (!audioContextRef.current || !masterGainRef.current || midiNote === null || typeof midiNote === 'undefined') return;
        const { waveform, gateLength, velocity, bpm, timeDivision } = paramsRef.current;
        const stepDuration = (60 / bpm) * TIME_DIVISIONS[timeDivision];

        const trigger = (n: number) => {
            if (!Number.isFinite(n)) return;
            const ctx = audioContextRef.current!;
            const osc = ctx.createOscillator();
            osc.type = waveform;
            const freq = midiToFreq(n);
            osc.frequency.value = freq;
            const adsr = ctx.createGain();

            adsr.gain.setValueAtTime(0, time);
            adsr.gain.linearRampToValueAtTime(velocity, time + 0.005);

            const gateDuration = stepDuration * (gateLength >= 128 ? 1.0 : gateLength / 127.0);
            const adaptiveRelease = Math.max(0.01, Math.min(0.25, 5 / freq));

            adsr.gain.setValueAtTime(velocity, time + gateDuration);
            adsr.gain.linearRampToValueAtTime(0, time + gateDuration + adaptiveRelease);

            osc.connect(adsr);
            adsr.connect(masterGainRef.current!);
            osc.start(time);
            osc.stop(time + gateDuration + adaptiveRelease + 0.1);
            osc.onended = () => { osc.disconnect(); adsr.disconnect(); };
        };

        if (isVST && midiNote !== null) {
            const notes = Array.isArray(midiNote) ? midiNote : [midiNote];
            notes.forEach(n => {
                sendVSTMidi(144, n, Math.round(velocity * 127));
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

    useEffect(() => {
        let rAF: number;
        const draw = () => {
            if (!audioContextRef.current) { rAF = requestAnimationFrame(draw); return; }
            const currentTime = audioContextRef.current.currentTime;

            let currentVisual = null;
            while (notesInQueueRef.current.length && notesInQueueRef.current[0].time <= currentTime) {
                currentVisual = notesInQueueRef.current.shift();
            }

            if (currentVisual) {
                setCurrentSeqStep(currentVisual.seqIndex);
                if (currentVisual.midiNote !== null && currentVisual.midiNote !== undefined) {
                    const notes = Array.isArray(currentVisual.midiNote) ? currentVisual.midiNote : [currentVisual.midiNote];
                    const stepIndex = arpSequence.findIndex(n => {
                        if (n === null) return false;
                        if (Array.isArray(n)) return notes.some(m => n.includes(m));
                        return notes.includes(n);
                    });
                    setCurrentStep(stepIndex >= 0 ? stepIndex : null);
                } else {
                    setCurrentStep(null);
                }
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
    }, [isPlaying, arpSequence]);

    useEffect(() => {
        if (isPlaying) {
            initializeAudio();

            // Force resume audio context (สำคัญสำหรับ browser ที่ suspend audio)
            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume().catch(err => {
                    console.error('[Arpeggiator] Error resuming audio context:', err);
                });
            }

            noteIndexRef.current = 0;
            seqStepRef.current = 0;
            upDownDirectionRef.current = 'up';
            notesInQueueRef.current = [];

            if (audioContextRef.current) {
                nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.05;
                
                // ใช้ setTimeout แทน worker (Next.js App Router ไม่รองรับ worker)
                // Clear timer เก่าก่อนสร้างใหม่ (ป้องกัน scheduler ซ้อน)
                if (timerIDRef.current) {
                    clearInterval(timerIDRef.current);
                }
                timerIDRef.current = setInterval(() => {
                    if (!isPlaying) return;
                    const ctx = audioContextRef.current;
                    if (!ctx) return;
                    
                    while (nextNoteTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD_TIME) {
                        scheduleNote(seqStepRef.current, nextNoteTimeRef.current);
                        nextNote();
                    }
                }, LOOKAHEAD);
            }
        } else {
            if (timerIDRef.current) {
                clearInterval(timerIDRef.current);
            }
            timerIDRef.current = null;
        }
        
        // Cleanup function
        return () => {
            if (timerIDRef.current) {
                clearInterval(timerIDRef.current);
                timerIDRef.current = null;
            }
        };
    }, [isPlaying, initializeAudio, heldRoots, arpSequence, pattern]);

    useEffect(() => { if (masterGainRef.current) masterGainRef.current.gain.value = masterVolume; }, [masterVolume]);

    const togglePlay = useCallback(() => { 
        initializeAudio(); 
        setIsPlaying(prev => !prev); 
    }, [initializeAudio]);
    
    const toggleHold = useCallback(() => {
        const newHold = !isHoldOn;
        setIsHoldOn(newHold);

        // เมื่อปิด HOLD → ล้าง momentary notes และโน๊ตที่ค้างไว้จากการเปิด HOLD
        if (!newHold) {
            momentaryNotes.current.clear();
            // ลบโน๊ตที่ค้างไว้ตอน HOLD เปิด
            setHeldRoots([]);
            setActiveChordNotes([]);
        }
    }, [isHoldOn]);

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
    }, [playbackState, stopAllMidiPlayback, initializeAudio]);

    const handleSaveMidi = () => {
        if (arpSequence.length === 0) { setModalState({ show: true, type: 'alert', title: 'EMPTY SEQUENCE', message: 'NO DATA TO SAVE' }); return; }

        const exportSequence = generateArpeggioPattern(paramsRef.current, 64);
        const dataUri = createMidiDataUri(exportSequence, bpm, 480, TIME_DIVISIONS[timeDivision], gateLength, velocity);

        const newMidi: SavedMidi = { name: `Arp-${new Date().toLocaleTimeString().replace(/:/g, '')}`, data: dataUri, settings: { waveform, bpm, timeDivision, pattern, octaveRange, gateLength, velocity, rootNote, masterVolume, heldRoots, sortNotes, sequencerSteps, musicalKey, scale } };
        setSavedMidis(prev => [...prev, newMidi]);
        setModalState({ show: true, type: 'success', title: 'SAVED', message: `PRESET "${newMidi.name}" STORED.` });
    };

    const closeModal = () => setModalState(prev => ({ ...prev, show: false }));

    // --- COMPACT MODE RENDER ---
    if (compact) {
        return (
            <div className="w-full max-w-md bg-[#222] rounded-xl border-4 border-[#1a1a1a] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                <div className="h-12 bg-[#111] border-b border-black flex items-center justify-between px-6">
                    <h1 className="text-xl font-black text-zinc-400 tracking-[0.2em] italic">ARP</h1>
                    <Led active={isPlaying} color="#2ed573" />
                </div>
                <div className="p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <HardButton label={isPlaying ? "STOP" : "RUN"} active={isPlaying} color="green" onClick={togglePlay} />
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">BPM</span>
                            <Knob label="" value={bpm} min={60} max={200} onChange={setBpm} size={50} color="white" />
                        </div>
                    </div>
                    <PresetSelector currentPreset={currentPresetName} onSelect={loadSettings} />
                </div>
            </div>
        );
    }

    // --- FULL MODE RENDER ---
    return (
        <div className="w-full bg-[#0a0a0a] p-2 md:p-4 font-sans select-none text-[#ededed]">
            <div className="relative w-full rounded-lg md:rounded-xl border-2 md:border-4 border-[#1a1a1a] flex flex-col overflow-hidden bg-[#222] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_0_2px_rgba(255,255,255,0.1)]">

                <Screw className="absolute top-1 md:top-3 left-1 md:left-3 w-2 h-2 md:w-3 md:h-3" />
                <Screw className="absolute top-1 md:top-3 right-1 md:right-3 w-2 h-2 md:w-3 md:h-3" />
                <Screw className="absolute bottom-1 md:bottom-3 left-1 md:left-3 w-2 h-2 md:w-3 md:h-3" />
                <Screw className="absolute bottom-1 md:bottom-3 right-1 md:right-3 w-2 h-2 md:w-3 md:h-3" />

                <div className="h-10 md:h-14 bg-[#111] border-b border-black flex items-center justify-between px-3 md:px-8 z-10 shadow-md">
                    <div className="flex items-center gap-2 md:gap-3">
                        <h1 className="text-lg md:text-3xl font-black text-zinc-400 tracking-[0.2em] italic" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>YOJOIES ARP </h1>
                        <span className="text-[6px] md:text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5 md:mt-1 border-l border-zinc-700 pl-1 md:pl-3 hidden xs:inline">ARPEGGIATOR MIDI</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-[6px] md:text-[8px] text-zinc-600 font-mono tracking-wider">SER: 808-909-MKII</div>
                        <div className="flex gap-0.5 md:gap-1 mt-0.5 md:mt-1">
                            <div className="w-6 md:w-12 h-1 md:h-1.5 bg-zinc-800 rounded-full shadow-inner"></div>
                            <div className="w-6 md:w-12 h-1 md:h-1.5 bg-zinc-800 rounded-full shadow-inner"></div>
                        </div>
                    </div>
                </div>

                <div className="p-2 md:p-4 lg:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 md:gap-3 lg:gap-4 relative z-10 w-full">

                    <div className="col-span-1 sm:col-span-2 lg:col-span-12 h-28 md:h-36 lg:h-40 bg-black rounded p-1 border-b border-zinc-700 shadow-[0_5px_15px_rgba(0,0,0,0.5)] relative group mb-1 md:mb-2">
                        <div className="absolute top-1 left-1 md:top-2 md:left-2 text-[8px] md:text-[10px] text-zinc-500 font-mono z-30 tracking-wider">SEQUENCE MONITOR // <span className={isPlaying ? "text-[#2ed573] animate-pulse" : "text-red-500"}>{isPlaying ? "RUNNING" : "STOPPED"}</span> {scale === 'Freestyle' && <span className="text-[#ff0080] ml-2">🎹 FREESTYLE MODE</span>}</div>
                        <ArpDisplay sequence={arpSequence} currentStep={currentStep} />
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col gap-1 md:gap-2 min-h-[120px] md:min-h-[150px]">
                        <ModulePanel title="OSCILLATOR" className="h-full flex flex-col justify-between">
                            <div className="grid grid-cols-4 gap-0.5 md:gap-1 mt-1">
                                {(['sine', 'square', 'sawtooth', 'triangle'] as const).map(w => (
                                    <button key={w} onClick={() => setWaveform(w)} className={`h-7 md:h-8 rounded-[2px] text-[8px] md:text-[9px] font-bold uppercase border transition-all duration-100 shadow-sm ${waveform === w ? 'bg-[#2ed573] text-black border-[#2ed573] shadow-[0_0_8px_rgba(46,213,115,0.4)]' : 'bg-[#333] text-[#888] border-[#111] hover:text-[#ccc] hover:bg-[#444]'}`}>{w.slice(0, 3)}</button>
                                ))}
                            </div>
                            <div className="flex justify-between items-end mt-1 md:mt-2 px-0.5">
                                <Knob label="Gate" value={gateLength} min={10} max={128} onChange={setGateLength} size={35} color="#00dfd8" />
                                <Knob label="Vel" value={velocity} min={0} max={1} onChange={setVelocity} size={35} color="#00dfd8" />
                            </div>
                        </ModulePanel>
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 min-h-[120px] md:min-h-[150px]">
                        <PresetSelector currentPreset={currentPresetName} onSelect={loadSettings} />
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-6 flex flex-col gap-1 md:gap-2 min-h-[120px] md:min-h-[150px]">
                        <ModulePanel title="SEQUENCE ENGINE" className="h-full">
                            <div className="absolute top-1 right-1 md:top-2 md:right-2 flex gap-0.5 md:gap-1"><Led active={arpSequence.length > 0} /><Led active={isPlaying} color="#ff0080" /></div>
                            <div className="grid grid-cols-2 gap-2 md:gap-4 mt-1">
                                <div className="space-y-1 md:space-y-2">
                                    <div className="space-y-0.5">
                                        <div className="text-[7px] md:text-[9px] text-zinc-500 font-bold tracking-widest text-center">PATTERN</div>
                                        <div className="grid grid-cols-2 gap-0.5">
                                            {(['Up', 'Down', 'UpDown', 'Random'] as const).map(p => (
                                                <button key={p} onClick={() => setPattern(p)} className={`h-6 md:h-7 text-[7px] md:text-[9px] uppercase font-bold rounded-[2px] border ${pattern === p ? 'bg-[#ffa502] text-black border-[#e67e22] shadow-[0_0_8px_rgba(255,165,2,0.4)]' : 'bg-[#222] text-zinc-500 border-[#111] hover:bg-[#333]'}`}>{p}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between px-0.5">
                                        <Knob label="Octave" value={octaveRange} min={1} max={4} onChange={setOctaveRange} size={30} color="#ffa502" />
                                        <Knob label="Root" value={rootNote} min={36} max={84} onChange={setRootNote} size={30} color="#ffa502" />
                                    </div>
                                    <div className="mt-0.5 md:mt-1">
                                        <div className="text-[7px] md:text-[9px] text-zinc-500 font-bold tracking-widest text-center mb-0.5">TIME DIV</div>
                                        <div className="grid grid-cols-4 gap-0.5">
                                            {(['1/4', '1/8', '1/16', '1/32'] as const).map(t => (
                                                <button key={t} onClick={() => setTimeDivision(t as TimeDivision)} className={`h-6 md:h-7 text-[7px] md:text-[9px] font-mono tracking-wider rounded-[1px] border transition-all ${timeDivision === t ? 'bg-[#ffa502] text-black border-[#ffa502] shadow-[0_0_8px_rgba(255,165,2,0.4)]' : 'bg-[#222] text-zinc-500 border-[#111] hover:bg-[#333]'}`}>{t}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-[7px] md:text-[9px] text-zinc-500 font-bold tracking-widest text-center mb-0.5">KEY</div>
                                    <div className="grid grid-cols-4 gap-0.5">
                                        {KEY_NAMES.map(key => (
                                            <button key={key} onClick={() => setMusicalKey(key)} className={`h-6 md:h-7 text-[7px] md:text-[9px] font-bold rounded-[1px] border transition-all ${musicalKey === key ? 'bg-[#2ed573] text-black border-[#2ed573] shadow-[0_0_8px_rgba(46,213,115,0.4)]' : 'bg-[#222] text-zinc-500 border-[#111] hover:bg-[#333]'}`}>{key}</button>
                                        ))}
                                    </div>
                                    <div className="text-[7px] md:text-[9px] text-zinc-500 font-bold tracking-widest text-center mb-0.5 mt-0.5 md:mt-1">SCALE</div>
                                    <div className="grid grid-cols-2 gap-0.5 max-h-[80px] md:max-h-[100px] overflow-y-auto custom-scrollbar">
                                        {SCALE_NAMES.map(s => (
                                            <button key={s} onClick={() => setScale(s)} className={`h-5 md:h-6 text-[7px] md:text-[9px] font-mono tracking-wider rounded-[1px] border-l-2 transition-all ${scale === s ? 'bg-[#222] border-[#2ed573] text-[#2ed573]' : 'bg-[#111] border-zinc-800 text-zinc-600 hover:text-zinc-400'}`}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ModulePanel>
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-12 flex flex-col sm:flex-row gap-2 md:gap-3 h-full">
                        <div className="w-full sm:w-2/5 lg:w-1/3 flex-shrink-0">
                            <ModulePanel title="MASTER" className="h-full flex flex-col min-h-[140px] md:min-h-[160px]">
                                <div className="flex justify-around mb-2 md:mb-4 mt-1">
                                    <Knob label="BPM" value={bpm} min={60} max={200} onChange={setBpm} size={45} color="white" />
                                    <Knob label="Vol" value={masterVolume} min={0} max={1} onChange={setMasterVolume} size={45} color="white" />
                                </div>
                                <div className="mt-auto grid grid-cols-4 gap-1 md:gap-2">
                                    <HardButton label={isPlaying ? "STOP" : "RUN"} active={isPlaying} color="green" onClick={togglePlay} />
                                    <HardButton label="HOLD" active={isHoldOn} color="red" onClick={toggleHold} />
                                    <HardButton label="UNDO" active={heldRootsHistory.length > 0} color="blue" onClick={undo} />
                                    <HardButton label="CLEAR" active={false} color="orange" onClick={clearNotes} />
                                </div>
                                <div className="mt-5 text-[8px] md:text-[10px] text-zinc-400 text-center px-1 font-medium">
                                    {isHoldOn
                                        ? "🔒 HOLD: Release key to sustain note"
                                        : "🔓 HOLD: Press & hold for note"}
                                </div>
                                <div className="mt-2 flex items-center justify-between gap-1 px-1">
                                    <button
                                        onClick={() => setKeyboardOctave(prev => Math.max(-2, prev - 1))}
                                        disabled={keyboardOctave <= -2}
                                        className="flex-1 h-6 bg-[#333] hover:bg-[#444] disabled:bg-[#222] disabled:text-[#444] text-[8px] md:text-[9px] font-bold rounded border border-[#222] text-[#2ed573]"
                                    >
                                        OCT -
                                    </button>
                                    <span className="text-[7px] md:text-[8px] text-zinc-400 px-1">
                                        C{3 + keyboardOctave}
                                    </span>
                                    <button
                                        onClick={() => setKeyboardOctave(prev => Math.min(2, prev + 1))}
                                        disabled={keyboardOctave >= 2}
                                        className="flex-1 h-6 bg-[#333] hover:bg-[#444] disabled:bg-[#222] disabled:text-[#444] text-[8px] md:text-[9px] font-bold rounded border border-[#222] text-[#2ed573]"
                                    >
                                        OCT +
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowKeyboardHelp(true)}
                                    className="mt-2 text-[7px] md:text-[8px] text-[#2ed573] hover:text-[#00dfd8] underline text-center px-1 w-full"
                                >
                                    ⌨️ Keyboard Shortcuts
                                </button>
                            </ModulePanel>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="bg-[#1a1a1a] rounded p-1 md:p-2 pt-2 md:pt-3 border border-[#111] shadow-inner relative overflow-hidden h-full flex flex-col justify-center">
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 opacity-20"></div>
                                <div className="flex items-center justify-between mb-1 md:mb-2 px-0.5">
                                    <div className="text-[8px] md:text-[10px] font-black text-[#555] tracking-[0.2em] flex items-center gap-0.5 md:gap-1"><span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_red]"></span>RHYTHM GATE</div>
                                    <div className="text-[7px] md:text-[9px] text-[#444] font-mono">16-STEP</div>
                                </div>
                                <div className="flex gap-0.5 md:gap-1 px-0.5 overflow-x-auto pb-1 custom-scrollbar min-w-full">
                                    {sequencerSteps.map((isActive, i) => (
                                        <StepButton key={i} index={i} active={isActive} current={currentSeqStep === i} onClick={() => { const newSteps = [...sequencerSteps]; newSteps[i] = !newSteps[i]; setSequencerSteps(newSteps); }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-12 mt-1 md:mt-2">
                        <div className="bg-[#111] p-0.5 rounded-t-sm border-t border-[#333] pb-0 shadow-lg">
                            <div className="text-[7px] md:text-[9px] text-center text-[#555] tracking-[0.3em] mb-0.5 font-bold">VIRTUAL KEYBED CONTROLLER</div>
                        </div>
                        <VirtualKeyboard key={`kbd-${activeChordNotes.join(',')}-${heldRoots.join(',')}`} heldRoots={heldRoots} activeChordNotes={activeChordNotes} onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} />
                    </div>

                    {/* SAVE BUTTON */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-12 mt-2 md:mt-4 flex justify-center">
                        <button
                            onClick={handleSave}
                            className="group relative h-11 px-8 bg-[#ff9f43] text-[#5c4033] text-[11px] font-bold tracking-[0.2em] uppercase rounded-sm border border-[#cc8e35] border-b-4 border-b-[#a36b22] hover:bg-[#ffa502] hover:border-[#ffb14d] hover:shadow-[0_0_20px_rgba(255,159,67,0.4)] active:translate-y-[1px] active:border-b-2 transition-all duration-100 flex items-center gap-3"
                        >
                            {/* Save Icon (Floppy Disk SVG) */}
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            <span>Save Arpeggiator Settings</span>
                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-sm bg-gradient-to-r from-[#fff]/0 via-[#fff]/20 to-[#fff]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </button>
                    </div>

                    {/* <div className="col-span-1 md:col-span-2 lg:col-span-12 bg-[#080808] rounded border border-[#333] p-3 flex flex-col md:flex-row items-center justify-between shadow-[inset_0_0_10px_black] gap-4">
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
                    </div> */}

                </div>

                {/* Keyboard Help Modal */}
                {showKeyboardHelp && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowKeyboardHelp(false)}>
                        <div className="bg-[#222] border-2 border-[#2ed573] p-6 rounded shadow-[0_0_50px_rgba(46,213,115,0.3)] max-w-lg w-full text-center" onClick={e => e.stopPropagation()}>
                            <div className="text-xl font-bold text-[#2ed573] mb-4 tracking-widest">⌨️ KEYBOARD SHORTCUTS</div>

                            <div className="text-[10px] text-zinc-400 mb-4 space-y-3">
                                <div className="bg-[#1a1a1a] p-3 rounded border border-[#333]">
                                    <div className="text-[9px] text-[#ffa502] font-bold mb-2">🎼 CURRENT OCTAVE</div>
                                    <div className="text-[8px] text-zinc-400">
                                        Press <span className="text-[#2ed573] font-bold">OCT -</span> or <span className="text-[#2ed573] font-bold">OCT +</span> to change starting octave
                                    </div>
                                    <div className="text-[8px] text-[#2ed573] font-bold mt-1">
                                        Currently: C{3 + keyboardOctave} (Z key)
                                    </div>
                                </div>

                                <div className="bg-[#1a1a1a] p-3 rounded border border-[#333]">
                                    <div className="text-[9px] text-[#2ed573] font-bold mb-2">🎹 LOWER OCTAVE</div>
                                    <div className="grid grid-cols-7 gap-1 text-[8px] font-mono">
                                        <div className="bg-[#333] p-1 rounded">A=C</div>
                                        <div className="bg-[#222] p-1 rounded">W=C#</div>
                                        <div className="bg-[#333] p-1 rounded">S=D</div>
                                        <div className="bg-[#222] p-1 rounded">E=D#</div>
                                        <div className="bg-[#333] p-1 rounded">D=E</div>
                                        <div className="bg-[#333] p-1 rounded">F=F</div>
                                        <div className="bg-[#222] p-1 rounded">T=F#</div>
                                        <div className="bg-[#333] p-1 rounded">G=G</div>
                                        <div className="bg-[#222] p-1 rounded">Y=G#</div>
                                        <div className="bg-[#333] p-1 rounded">H=A</div>
                                        <div className="bg-[#222] p-1 rounded">U=A#</div>
                                        <div className="bg-[#333] p-1 rounded">J=B</div>
                                        <div className="bg-[#333] p-1 rounded">K=C↑</div>
                                    </div>
                                </div>

                                <div className="bg-[#1a1a1a] p-3 rounded border border-[#333]">
                                    <div className="text-[9px] text-[#00dfd8] font-bold mb-2">🎹 UPPER OCTAVE</div>
                                    <div className="grid grid-cols-7 gap-1 text-[8px] font-mono">
                                        <div className="bg-[#333] p-1 rounded">Z=C</div>
                                        <div className="bg-[#222] p-1 rounded">S=C#</div>
                                        <div className="bg-[#333] p-1 rounded">X=D</div>
                                        <div className="bg-[#222] p-1 rounded">D=D#</div>
                                        <div className="bg-[#333] p-1 rounded">C=E</div>
                                        <div className="bg-[#333] p-1 rounded">V=F</div>
                                        <div className="bg-[#222] p-1 rounded">G=F#</div>
                                        <div className="bg-[#333] p-1 rounded">B=G</div>
                                        <div className="bg-[#222] p-1 rounded">N=G#</div>
                                        <div className="bg-[#333] p-1 rounded">M=A</div>
                                        <div className="bg-[#222] p-1 rounded">,=A#</div>
                                        <div className="bg-[#333] p-1 rounded">.=B</div>
                                        <div className="bg-[#333] p-1 rounded">/=C↑↑</div>
                                    </div>
                                </div>

                                <div className="bg-[#1a1a1a] p-3 rounded border border-[#333] text-left">
                                    <div className="text-[9px] text-[#ffa502] font-bold mb-2">💡 TIPS</div>
                                    <ul className="text-[8px] space-y-1 text-zinc-400">
                                        <li>• <span className="text-[#2ed573]">HOLD ON 🔒</span>: Press key once to toggle note on/off</li>
                                        <li>• <span className="text-[#00dfd8]">HOLD OFF 🔓</span>: Hold key down for note (release to stop)</li>
                                        <li>• White keys = natural notes (A,S,D,F,G,H,J,K / Z,X,C,V,B,N,M)</li>
                                        <li>• Black keys = sharps (W,E,T,Y,U / S,D,G,N,.)</li>
                                        <li>• <span className="text-[#ffa502]">OCT - / OCT +</span>: Change starting octave (C3 to C5)</li>
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowKeyboardHelp(false)}
                                className="px-6 py-2 bg-[#2ed573] text-black text-[10px] font-bold tracking-widest border border-[#1a9c50] hover:bg-[#00dfd8] rounded"
                            >
                                GOT IT!
                            </button>
                        </div>
                    </div>
                )}

                {modalState.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget && modalState.type !== 'confirm') closeModal(); }}>
                        <div className="bg-[#222] border-2 border-zinc-700 p-6 rounded shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
                            <div className={`text-lg font-bold tracking-widest mb-2 ${modalState.type === 'alert' ? 'text-red-500' : modalState.type === 'success' ? 'text-[#2ed573]' : 'text-[#ffa502]'}`}>{modalState.title}</div>
                            <div className="text-[11px] font-mono text-zinc-400 mb-6">{modalState.message}</div>
                            <div className="flex gap-2 justify-center">
                                {modalState.type === 'confirm' ? (
                                    <>
                                        <button onClick={() => { modalState.onConfirm?.(); }} className="px-6 py-2 bg-[#2ed573] text-black text-[10px] font-bold tracking-widest border border-[#1a9c50] hover:bg-[#00dfd8]">CONFIRM</button>
                                        <button onClick={closeModal} className="px-6 py-2 bg-zinc-800 text-white text-[10px] font-bold tracking-widest border border-zinc-600 hover:bg-zinc-700">CANCEL</button>
                                    </>
                                ) : (
                                    <button onClick={closeModal} className="px-6 py-2 bg-zinc-800 text-white text-[10px] font-bold tracking-widest border border-zinc-600 hover:bg-zinc-700">OK</button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
