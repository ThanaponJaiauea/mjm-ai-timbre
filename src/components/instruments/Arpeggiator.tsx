"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { useVSTBridge } from '../../hooks/useVSTBridge';
import '../../app/arp/arp.css';
import { Knob, HardButton, Led, ModulePanel, Screw, StepButton, VirtualKeyboard, ArpDisplay } from './ui';

export type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle';
export type Pattern = 'Up' | 'Down' | 'UpDown' | 'Random';
export type PlaybackState = 'stopped' | 'playing';
export type TimeDivision = '1/4' | '1/8' | '1/16' | '1/32';
export type MusicalKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
export type Scale = 'Major' | 'Minor' | 'Dorian' | 'Phrygian' | 'Lydian' | 'Mixolydian' | 'Locrian' | 'Harmonic Minor' | 'Melodic Minor' | 'Pentatonic Major' | 'Pentatonic Minor' | 'Blues' | 'Chromatic' | 'Freestyle';
export type TimbreCategory = 'Analog' | 'Digital' | 'Acoustic' | 'Synth' | 'Bass' | 'Lead' | 'Pad' | 'FX' | 'Electric';
export type TimbreType = 'Piano' | 'Synth' | 'Strings' | 'Brass' | 'Guitar' | 'Bass' | 'Drums' | 'Organ' | 'Choir' | 'Bell' | 'Pluck' | 'Arp' | 'Sweep' | 'Lead' | 'Pad';
export type ArpState = { noteIndex: number; direction: 'up' | 'down' };
export interface TimbrePreset {
    id: string; name: string; category: TimbreCategory; type: TimbreType; waveform: Waveform;
    attack: number; decay: number; sustain: number; release: number;
    filterCutoff: number; filterResonance: number; octaveShift: number; detune: number;
    icon: string; color: string;
}

export interface ArpSettings {
    waveform: Waveform; bpm: number; timeDivision: TimeDivision; pattern: Pattern;
    octaveRange: number; gateLength: number; velocity: number; rootNote: number;
    masterVolume: number; heldRoots: number[]; sortNotes: boolean; sequencerSteps: boolean[];
    heldNotes?: (string | string[])[]; name?: string; musicalKey?: MusicalKey; scale?: Scale;
    style?: string; mood?: string; chords?: string[]; wavFileUrl?: string; midiFileUrl?: string;
}

interface ArpeggiatorProps {
    compact?: boolean; onPlayChange?: (isPlaying: boolean) => void; onBpmChange?: (bpm: number) => void;
    onPatternChange?: (pattern: Pattern) => void; onWaveformChange?: (waveform: Waveform) => void;
    onPresetChange?: (presetName: string) => void; onSequenceChange?: (sequence: (number | number[] | null)[]) => void;
    initialSettings?: Partial<ArpSettings>; onSave?: (settings: ArpSettings) => void;
}

const TIME_DIVISIONS: Record<TimeDivision, number> = { '1/4': 1, '1/8': 0.5, '1/16': 0.25, '1/32': 0.125 };
const ROOT_NOTES: Record<string, number> = { 'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63, 'E': 64, 'F': 65, 'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68, 'Ab': 68, 'A': 69, 'A#': 70, 'Bb': 70, 'B': 71 };
const SCALE_INTERVALS: Record<Scale, number[]> = { 'Major': [0, 2, 4, 5, 7, 9, 11], 'Minor': [0, 2, 3, 5, 7, 8, 10], 'Dorian': [0, 2, 3, 5, 7, 9, 10], 'Phrygian': [0, 1, 3, 5, 7, 8, 10], 'Lydian': [0, 2, 4, 6, 7, 9, 11], 'Mixolydian': [0, 2, 4, 5, 7, 9, 10], 'Locrian': [0, 1, 3, 5, 6, 8, 10], 'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11], 'Melodic Minor': [0, 2, 3, 5, 7, 9, 11], 'Pentatonic Major': [0, 2, 4, 7, 9], 'Pentatonic Minor': [0, 3, 5, 7, 10], 'Blues': [0, 3, 5, 6, 7, 10], 'Chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Freestyle': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] };
const KEY_NAMES: (MusicalKey | string)[] = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
const SCALE_NAMES: Scale[] = ['Major', 'Minor', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian', 'Harmonic Minor', 'Melodic Minor', 'Pentatonic Major', 'Pentatonic Minor', 'Blues', 'Chromatic', 'Freestyle'];

const CLASSIC_TIMBRES: TimbrePreset[] = [
    { id: 'grand-piano', name: 'Grand Piano', category: 'Acoustic', type: 'Piano', waveform: 'triangle', attack: 0.01, decay: 0.3, sustain: 0.7, release: 0.5, filterCutoff: 8000, filterResonance: 0.5, octaveShift: 0, detune: 0, icon: '🎹', color: '#f5f5f5' },
    { id: 'electric-piano', name: 'Electric Piano', category: 'Electric', type: 'Piano', waveform: 'sine', attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.4, filterCutoff: 5000, filterResonance: 0.3, octaveShift: 0, detune: 5, icon: '🎹', color: '#d4a574' },
    { id: 'rhodes', name: 'Rhodes', category: 'Electric', type: 'Piano', waveform: 'sine', attack: 0.02, decay: 0.4, sustain: 0.6, release: 0.6, filterCutoff: 3000, filterResonance: 0.4, octaveShift: 0, detune: 10, icon: '🎹', color: '#c4a484' },
    { id: 'supersaw', name: 'SuperSaw', category: 'Synth', type: 'Synth', waveform: 'sawtooth', attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.3, filterCutoff: 6000, filterResonance: 0.7, octaveShift: 0, detune: 20, icon: '🎛️', color: '#ff6b6b' },
    { id: 'plucky-synth', name: 'Plucky Synth', category: 'Synth', type: 'Pluck', waveform: 'square', attack: 0.001, decay: 0.15, sustain: 0.3, release: 0.1, filterCutoff: 4000, filterResonance: 0.5, octaveShift: 1, detune: 8, icon: '🎛️', color: '#4ecdc4' },
    { id: 'warm-pad', name: 'Warm Pad', category: 'Synth', type: 'Pad', waveform: 'sawtooth', attack: 0.3, decay: 0.5, sustain: 0.9, release: 1.0, filterCutoff: 2000, filterResonance: 0.3, octaveShift: 0, detune: 15, icon: '🎛️', color: '#a55eea' },
    { id: 'orchestral-strings', name: 'Orchestral Strings', category: 'Acoustic', type: 'Strings', waveform: 'sawtooth', attack: 0.1, decay: 0.3, sustain: 0.8, release: 0.8, filterCutoff: 3500, filterResonance: 0.2, octaveShift: 0, detune: 8, icon: '🎻', color: '#8b4513' },
    { id: 'synth-strings', name: 'Synth Strings', category: 'Synth', type: 'Strings', waveform: 'sawtooth', attack: 0.05, decay: 0.2, sustain: 0.9, release: 0.6, filterCutoff: 4000, filterResonance: 0.4, octaveShift: 0, detune: 12, icon: '🎻', color: '#cd853f' },
    { id: 'chamber-strings', name: 'Chamber Strings', category: 'Acoustic', type: 'Strings', waveform: 'triangle', attack: 0.08, decay: 0.4, sustain: 0.7, release: 0.9, filterCutoff: 5000, filterResonance: 0.3, octaveShift: 0, detune: 5, icon: '🎻', color: '#a0522d' },
    { id: 'trumpet-section', name: 'Trumpet Section', category: 'Acoustic', type: 'Brass', waveform: 'sawtooth', attack: 0.05, decay: 0.2, sustain: 0.7, release: 0.4, filterCutoff: 4500, filterResonance: 0.5, octaveShift: 0, detune: 8, icon: '🎺', color: '#ffd700' },
    { id: 'french-horn', name: 'French Horn', category: 'Acoustic', type: 'Brass', waveform: 'triangle', attack: 0.08, decay: 0.3, sustain: 0.6, release: 0.5, filterCutoff: 3000, filterResonance: 0.4, octaveShift: -1, detune: 5, icon: '🎺', color: '#daa520' },
    { id: 'synth-brass', name: 'Synth Brass', category: 'Synth', type: 'Brass', waveform: 'square', attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.2, filterCutoff: 5500, filterResonance: 0.6, octaveShift: 0, detune: 15, icon: '🎺', color: '#b8860b' },
    { id: 'sub-bass', name: 'Sub Bass', category: 'Synth', type: 'Bass', waveform: 'sine', attack: 0.01, decay: 0.3, sustain: 0.9, release: 0.2, filterCutoff: 800, filterResonance: 0.2, octaveShift: -1, detune: 0, icon: '🎸', color: '#2d3436' },
    { id: 'acid-bass', name: 'Acid Bass', category: 'Synth', type: 'Bass', waveform: 'sawtooth', attack: 0.001, decay: 0.2, sustain: 0.7, release: 0.15, filterCutoff: 2500, filterResonance: 0.9, octaveShift: 0, detune: 10, icon: '🎸', color: '#636e72' },
    { id: 'electric-bass', name: 'Electric Bass', category: 'Electric', type: 'Bass', waveform: 'triangle', attack: 0.01, decay: 0.25, sustain: 0.8, release: 0.3, filterCutoff: 1500, filterResonance: 0.3, octaveShift: -1, detune: 5, icon: '🎸', color: '#8b4513' },
    { id: 'saw-lead', name: 'Saw Lead', category: 'Synth', type: 'Lead', waveform: 'sawtooth', attack: 0.01, decay: 0.1, sustain: 0.7, release: 0.2, filterCutoff: 5000, filterResonance: 0.5, octaveShift: 0, detune: 12, icon: '🎤', color: '#e74c3c' },
    { id: 'square-lead', name: 'Square Lead', category: 'Synth', type: 'Lead', waveform: 'square', attack: 0.01, decay: 0.15, sustain: 0.6, release: 0.25, filterCutoff: 4500, filterResonance: 0.4, octaveShift: 0, detune: 8, icon: '🎤', color: '#e67e22' },
    { id: 'soft-lead', name: 'Soft Lead', category: 'Synth', type: 'Lead', waveform: 'triangle', attack: 0.02, decay: 0.2, sustain: 0.8, release: 0.4, filterCutoff: 3500, filterResonance: 0.3, octaveShift: 0, detune: 5, icon: '🎤', color: '#f39c12' },
    { id: 'crystal-bell', name: 'Crystal Bell', category: 'FX', type: 'Bell', waveform: 'sine', attack: 0.001, decay: 0.8, sustain: 0.1, release: 1.5, filterCutoff: 8000, filterResonance: 0.2, octaveShift: 2, detune: 3, icon: '🔔', color: '#74b9ff' },
    { id: 'sweep-up', name: 'Sweep Up', category: 'FX', type: 'Sweep', waveform: 'sawtooth', attack: 0.5, decay: 0.5, sustain: 0.5, release: 0.5, filterCutoff: 8000, filterResonance: 0.8, octaveShift: 0, detune: 20, icon: '🌊', color: '#a29bfe' },
    { id: 'choir-ahh', name: 'Choir Ahh', category: 'Acoustic', type: 'Choir', waveform: 'sawtooth', attack: 0.1, decay: 0.3, sustain: 0.8, release: 0.8, filterCutoff: 2500, filterResonance: 0.3, octaveShift: 0, detune: 10, icon: '🎵', color: '#fd79a8' },
];

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

// === CONSTANTS & HELPER FUNCTIONS ===

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

// สร้าง WAV file จาก AudioBuffer
const createWavDataUri = (audioBuffer: AudioBuffer): string => {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const data = [];
    for (let i = 0; i < audioBuffer.length; i++) {
        for (let channel = 0; channel < numChannels; channel++) {
            const sample = audioBuffer.getChannelData(channel)[i];
            const intSample = Math.max(-1, Math.min(1, sample));
            data.push(intSample < 0 ? intSample * 0x8000 : intSample * 0x7FFF);
        }
    }

    const dataLength = data.length * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);

    let offset = 44;
    for (let i = 0; i < data.length; i++) {
        view.setInt16(offset, data[i], true);
        offset += 2;
    }

    let binary = '';
    for (let i = 0; i < buffer.byteLength; i++) {
        binary += String.fromCharCode(view.getUint8(i));
    }
    return 'data:audio/wav;base64,' + btoa(binary);
};

// === UI COMPONENTS MOVED TO ./ui/ FOLDER ===
// Components: Knob, HardButton, Led, ModulePanel, Screw, StepButton, VirtualKeyboard, ArpGrid, ArpDisplay

export type SavedMidi = { name: string; data: string; settings?: ArpSettings; };

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
    const [heldIntervals, setHeldIntervals] = useState<number[]>([]); // เก็บ interval (0-11) จาก root note
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
    const [isOpen, setIsOpen] = useState(false);

    // Timbre Modal State
    const [showTimbreModal, setShowTimbreModal] = useState(false);
    const [selectedTimbreId, setSelectedTimbreId] = useState<string | null>(null);
    const [activeTimbreCategory, setActiveTimbreCategory] = useState<TimbreCategory | 'All'>('All');
    const [generatedArpPattern, setGeneratedArpPattern] = useState<(number | number[] | null)[]>([]);
    const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
    const [timbreArpSettings, setTimbreArpSettings] = useState<Partial<ArpSettings>>({});

    // VST Install State
    const [showVstSearching, setShowVstSearching] = useState(false);

    // Preview oscillators reference
    const previewOscillatorsRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
    const previewMasterGainRef = useRef<GainNode | null>(null);
    const previewFilterRef = useRef<BiquadFilterNode | null>(null);
    const previewCompressorRef = useRef<DynamicsCompressorNode | null>(null);
    const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isPreviewPlayingRef = useRef<boolean>(false);
    const previewTimbreArpRef = useRef<() => Promise<void>>(() => Promise.resolve());

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
            // แปลง MIDI notes เป็น intervals (0-11)
            const intervals = settings.heldRoots.map(n => n % 12);
            setHeldIntervals(intervals);
            setIsHoldOn(true);
        } else if (settings.heldNotes && settings.heldNotes.length > 0) {
            const flatNotes: string[] = settings.heldNotes.flat() as string[];
            const uniqueNotes = Array.from(new Set(flatNotes));
            const rawMidiNotes = uniqueNotes.map(noteNameToMidi);

            if (rawMidiNotes.length > 0) {
                const firstNoteMidi = rawMidiNotes[0];
                const derivedRoot = 60 + (firstNoteMidi % 12);
                targetRoot = derivedRoot;

                // แปลงเป็น intervals
                const intervals = rawMidiNotes.map(n => n % 12);
                setHeldIntervals(intervals);
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

    const hasInitializedRef = useRef(false);

    // เซ็ตค่าเริ่มต้นจาก initialSettings (รันแค่ครั้งเดียวตอน mount)
    useEffect(() => {
        if (!initialSettings || hasInitializedRef.current) return;
        hasInitializedRef.current = true;

        console.log('[Arpeggiator] Initializing with initialSettings:', initialSettings);

        if (initialSettings.musicalKey) setMusicalKey(initialSettings.musicalKey);
        if (initialSettings.scale) setScale(initialSettings.scale);

        // เซ็ต Hold = true โดยอัตโนมัติถ้ามี heldRoots จาก initialSettings (เพื่อให้กด RUN แล้วเล่นได้ทันที)
        if (initialSettings.heldRoots && initialSettings.heldRoots.length > 0) {
            console.log('[Arpeggiator] Setting heldRoots:', initialSettings.heldRoots);
            // แปลง MIDI notes เป็น intervals
            const intervals = initialSettings.heldRoots.map(n => n % 12);
            setHeldIntervals(intervals);
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
        // ใช้ activeChordNotes ถ้ามี ไม่อย่างนั้นใช้ heldIntervals
        const sourceIntervals = activeChordNotes && activeChordNotes.length > 0
            ? activeChordNotes.map(n => n % 12)
            : heldIntervals;

        if (sourceIntervals.length === 0) {
            setActiveMidiNotes([]);
            return;
        }

        const currentKeyRootMidi = ROOT_NOTES[musicalKey];
        const octaveShift = keyboardOctave * 12; // เพิ่ม octave shift จาก keyboardOctave

        // Freestyle: ใช้โน๊ตตามที่กดเลย ไม่บังคับตาม scale
        if (scale === 'Freestyle') {
            const freestyleNotes = sourceIntervals.map(interval => currentKeyRootMidi + interval + octaveShift);
            setActiveMidiNotes(freestyleNotes);
            return;
        }

        const scaleIntervals = SCALE_INTERVALS[scale];

        // Transpose โน้ตให้อยู่ใน scale ของ musicalKey ปัจจุบัน
        const transposedNotes = sourceIntervals.map(interval => {
            // หา interval ที่ใกล้ที่สุดใน scale
            let closestInterval = scaleIntervals[0];
            let minDiff = 12;
            for (const scaleInterval of scaleIntervals) {
                let diff = Math.abs(interval - scaleInterval);
                if (diff > 6) diff = 12 - diff;
                if (diff < minDiff) {
                    minDiff = diff;
                    closestInterval = scaleInterval;
                }
            }
            return currentKeyRootMidi + closestInterval + octaveShift;
        });

        setActiveMidiNotes(transposedNotes);
    }, [heldIntervals, activeChordNotes, musicalKey, scale, keyboardOctave]);

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
    const paramsRef = useRef({ waveform, masterVolume, gateLength, velocity, bpm, timeDivision, pattern, octaveRange, arpSequence: [] as (number | number[] | null)[], heldIntervals, sortNotes, sequencerSteps, musicalKey, scale });
    useEffect(() => { paramsRef.current = { waveform, masterVolume, gateLength, velocity, bpm, timeDivision, pattern, octaveRange, arpSequence, heldIntervals, sortNotes, sequencerSteps, musicalKey, scale }; }, [waveform, masterVolume, gateLength, velocity, bpm, timeDivision, pattern, octaveRange, arpSequence, heldIntervals, sortNotes, sequencerSteps, musicalKey, scale]);

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
    const [heldIntervalsHistory, setHeldIntervalsHistory] = useState<number[][]>([]);
    const [activeChordNotesHistory, setActiveChordNotesHistory] = useState<number[][]>([]);

    // State สำหรับเก็บโน๊ตที่กดในขณะ Hold ปิด (momentary notes)
    const momentaryNotes = useRef<Set<number>>(new Set());

    const handleNoteOn = useCallback((midiNote: number) => {
        initializeAudio();

        const interval = midiNote % 12;

        if (isHoldOn) {
            // Hold เปิด: บันทึก state สำหรับ Undo แล้ว toggle โน๊ต (latch mode)
            setHeldIntervalsHistory(prev => [...prev.slice(-9), [...heldIntervals]]);
            setActiveChordNotesHistory(prev => [...prev.slice(-9), [...activeChordNotes]]);

            // Toggle โน๊ต: ถ้ามีอยู่แล้วให้ลบออก, ถ้าไม่มีให้เพิ่ม
            setHeldIntervals(prev => {
                if (prev.includes(interval)) {
                    return prev.filter(n => n !== interval);
                }
                return [...prev, interval];
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
            setHeldIntervals(prev => {
                if (!prev.includes(interval)) {
                    return [...prev, interval];
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
    }, [initializeAudio, isHoldOn, heldIntervals, activeChordNotes]);

    const handleNoteOff = useCallback((midiNote: number) => {
        const interval = midiNote % 12;
        
        if (!isHoldOn) {
            // Hold ปิด: ลบเฉพาะ momentary notes (โน๊ตที่ผู้ใช้กดค้างไว้)
            // ปล่อยมือ = โน๊ตหลุด (momentary mode)
            if (momentaryNotes.current.has(midiNote)) {
                momentaryNotes.current.delete(midiNote);
                setHeldIntervals(prev => prev.filter(n => n !== interval));
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
        if (heldIntervalsHistory.length > 0) {
            const lastIntervals = heldIntervalsHistory[heldIntervalsHistory.length - 1];
            setHeldIntervals(lastIntervals);
            setHeldIntervalsHistory(prev => prev.slice(0, -1));
        }
        if (activeChordNotesHistory.length > 0) {
            const lastChords = activeChordNotesHistory[activeChordNotesHistory.length - 1];
            setActiveChordNotes(lastChords);
            setActiveChordNotesHistory(prev => prev.slice(0, -1));
        }
    }, [heldIntervalsHistory, activeChordNotesHistory]);

    // ฟังก์ชัน Clear โน๊ตทั้งหมด (ลบหมดทุกอย่าง)
    const clearNotes = useCallback(() => {
        // บันทึก state ปัจจุบันสำหรับ Undo
        setHeldIntervalsHistory(prev => [...prev.slice(-9), [...heldIntervals]]);
        setActiveChordNotesHistory(prev => [...prev.slice(-9), [...activeChordNotes]]);

        // ลบโน๊ตทั้งหมด
        setHeldIntervals([]);
        setActiveChordNotes([]);
    }, [heldIntervals, activeChordNotes]);

    // ฟังก์ชัน Save ARP Settings (แสดง confirmation modal)
    const handleSave = useCallback(async () => {
        // ตรวจสอบว่ามีโน๊ตหรือไม่
        if (heldIntervals.length === 0) {
            setModalState({
                show: true,
                type: 'alert',
                title: 'NO NOTES',
                message: 'Please add notes before saving. Press keys or enable HOLD to add notes.',
            });
            return;
        }

        // แปลง intervals เป็น MIDI notes จาก musicalKey ปัจจุบัน
        const currentKeyRootMidi = ROOT_NOTES[musicalKey];
        const midiNotes = heldIntervals.map(interval => currentKeyRootMidi + interval);

        setModalState({
            show: true,
            type: 'confirm',
            title: 'CONFIRM SAVE',
            message: `Save current arpeggiator settings? (BPM: ${Math.round(bpm)}, Pattern: ${pattern}, Key: ${musicalKey}, Notes: ${heldIntervals.length})`,
            onConfirm: async () => {
                // สร้าง arpSequence จาก heldIntervals
                let arpSeq: number[] = [];
                for (let i = 0; i < octaveRange; i++) {
                    const octaveShift = i * 12;
                    arpSeq.push(...midiNotes.map(note => note + octaveShift));
                }
                if (sortNotes) {
                    arpSeq.sort((a, b) => a - b);
                }

                // สร้าง MIDI file
                const exportSequence = generateArpeggioPattern({
                    arpSequence: arpSeq,
                    pattern,
                    sequencerSteps,
                }, 64);
                const midiDataUri = createMidiDataUri(exportSequence, bpm, 480, TIME_DIVISIONS[timeDivision], gateLength, velocity);

                // สร้าง WAV file โดย render audio
                let wavDataUri = '';
                try {
                    const audioContext = audioContextRef.current;
                    if (audioContext) {
                        // สร้าง offline audio context เพื่อ render
                        const durationInSeconds = (60 / bpm) * TIME_DIVISIONS[timeDivision] * exportSequence.length * 2; // เพิ่ม buffer
                        const offlineContext = new OfflineAudioContext(2, Math.floor(audioContext.sampleRate * durationInSeconds), audioContext.sampleRate);

                        // �����ร้าง oscillator และ schedule ใน offline context
                        const now = 0;
                        const stepDuration = (60 / bpm) * TIME_DIVISIONS[timeDivision];
                        exportSequence.forEach((midiNote, index) => {
                            if (midiNote !== null) {
                                const notes = Array.isArray(midiNote) ? midiNote : [midiNote];
                                const startTime = now + index * stepDuration;
                                const noteDuration = stepDuration * (gateLength >= 128 ? 1.0 : gateLength / 127.0);
                                
                                notes.forEach(noteNum => {
                                    const osc = offlineContext.createOscillator();
                                    const gain = offlineContext.createGain();
                                    osc.type = waveform;
                                    osc.frequency.value = 440 * Math.pow(2, (noteNum - 69) / 12);
                                    gain.gain.setValueAtTime(velocity * masterVolume, startTime);
                                    gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);
                                    osc.connect(gain);
                                    gain.connect(offlineContext.destination);
                                    osc.start(startTime);
                                    osc.stop(startTime + noteDuration);
                                });
                            }
                        });

                        const renderedBuffer = await offlineContext.startRendering();
                        wavDataUri = createWavDataUri(renderedBuffer);
                    }
                } catch (error) {
                    console.warn('Failed to create WAV file:', error);
                }

                const settings: ArpSettings = {
                    waveform,
                    bpm: Math.round(bpm),
                    timeDivision,
                    pattern,
                    octaveRange,
                    gateLength: Math.round(gateLength),
                    velocity: Math.round(velocity * 100) / 100,
                    rootNote: Math.round(rootNote),
                    masterVolume: Math.round(masterVolume * 100) / 100,
                    heldRoots: midiNotes.map(n => Math.round(n)),
                    sortNotes,
                    sequencerSteps,
                    musicalKey,
                    scale,
                    heldNotes: activeChordNotes.length > 0 ? activeChordNotes.map(n => midiToNoteName(n)) : undefined,
                    style,
                    mood,
                    chords,
                    midiFileUrl: midiDataUri,
                    wavFileUrl: wavDataUri,
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
    }, [waveform, bpm, timeDivision, pattern, octaveRange, gateLength, velocity, rootNote, masterVolume, heldIntervals, sortNotes, sequencerSteps, musicalKey, scale, activeChordNotes, style, mood, chords, onSave]);

    // --- TIMBRE MODAL FUNCTIONS ---

    // เปิด Modal ตาม category ที่เลือก (หยุดเสียง preview และ ARP ก่อน)
    const openTimbreModal = useCallback((category: TimbreCategory | 'All') => {
        // หยุดเสียง preview ที่กำลังเล่นอยู่
        if (isPreviewPlayingRef.current) {
            stopPreviewTimbreArp();
        }
        // หยุดเสียง ARP ที่กำลังเล่นอยู่
        if (isPlaying) {
            setIsPlaying(false);
        }
        setActiveTimbreCategory(category);
        setShowTimbreModal(true);
    }, [isPlaying]);

    // Handle Download Desktop App Button Click
    const [isDownloading, setIsDownloading] = useState(false);

    const handleInstallVst = useCallback(() => {
        // ดาวน์โหลดจากโฟลเดอร์ public ในเครื่อง - เพิ่ม timestamp เพื่อ bypass cache
        const downloadUrl = `/MJM-AI-Timbre-Arpeggiator-Setup-1.0.0.exe?t=${Date.now()}`;

        // แสดง loading state ทันที
        setIsDownloading(true);

        // เปิดหน้าต่างดาวน์โหลด
        const downloadWindow = window.open(downloadUrl, '_blank');

        // ตรวจสอบว่าเปิดหน้าต่างสำเร็จหรือไม่
        if (downloadWindow) {
            // รอ 3 วินาทีแล้วแสดง success message
            setTimeout(() => {
                setIsDownloading(false);
                setModalState({
                    show: true,
                    type: 'success',
                    title: '✅ DOWNLOAD STARTED',
                    message: 'Your download should have started.\n\n' +
                             '📁 File: MJM-AI-Timbre-Arpeggiator-Setup-1.0.0.exe\n\n' +
                             '⚠️ Note: If the file icon shows as Inno Setup on first download,\n' +
                             'this is Windows cache. The file is correct!\n\n' +
                             'To fix: Clear Windows icon cache or download again.'
                });
            }, 3000);
        } else {
            // Popup blocked
            setIsDownloading(false);
            setModalState({
                show: true,
                type: 'alert',
                title: '⚠️ POPUP BLOCKED',
                message: 'Your browser blocked the download popup.\n\n' +
                         'Please allow popups for this site and try again.'
            });
        }
    }, []);

    // เลือก Timbre (generate และเล่นทันที)
    const selectTimbre = useCallback(async (timbreId: string) => {
        setSelectedTimbreId(timbreId);

        // Generate ARP pattern ใหม่ทันทีที่เปลี่ยนเสียง
        const timbre = CLASSIC_TIMBRES.find(t => t.id === timbreId);
        if (!timbre || heldIntervals.length === 0) return;

        const currentKeyRootMidi = ROOT_NOTES[musicalKey];
        const midiNotes = heldIntervals.map(interval => currentKeyRootMidi + interval);

        // สร้าง arpSequence
        let arpSeq: number[] = [];
        for (let i = 0; i < octaveRange; i++) {
            const octaveShift = i * 12 + timbre.octaveShift * 12;
            arpSeq.push(...midiNotes.map(note => note + octaveShift));
        }
        if (sortNotes) {
            arpSeq.sort((a, b) => a - b);
        }

        // Generate pattern
        const generated = generateArpeggioPattern({
            arpSequence: arpSeq,
            pattern,
            sequencerSteps,
        }, 64);

        setGeneratedArpPattern(generated);
        setTimbreArpSettings({
            waveform: timbre.waveform,
            rootNote: timbre.octaveShift > 0 ? rootNote + timbre.octaveShift * 12 : rootNote,
        });

        // เล่นเสียงทันทีหลังจากเปลี่ยนเสียง
        // รอเล็กน้อยให้ state update เสร็จ
        await new Promise(resolve => setTimeout(resolve, 100));

        // เรียก preview โดยตรง (ใช้ ref แทน)
        const context = audioContextRef.current;
        if (context) {
            if (context.state === 'suspended') {
                await context.resume();
            }

            // หยุดเสียงเก่าก่อน
            if (isPreviewPlayingRef.current) {
                stopPreviewTimbreArp();
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            // เล่นเสียงใหม่ทันที
            previewTimbreArpRef.current();
        }
    }, [heldIntervals, musicalKey, octaveRange, sortNotes, pattern, sequencerSteps, rootNote]);

    // Generate ARP Pattern จาก Timbre ที่เลือก
    const generateArpFromTimbre = useCallback(() => {
        if (!selectedTimbreId) return;

        const timbre = CLASSIC_TIMBRES.find(t => t.id === selectedTimbreId);
        if (!timbre) return;

        // สร้าง ARP Pattern จากโน๊ตที่กดไว้
        const currentKeyRootMidi = ROOT_NOTES[musicalKey];
        const midiNotes = heldIntervals.map(interval => currentKeyRootMidi + interval);

        if (midiNotes.length === 0) {
            setModalState({
                show: true,
                type: 'alert',
                title: 'NO NOTES',
                message: 'Please add notes before generating. Press keys or enable HOLD to add notes.',
            });
            return;
        }

        // สร้าง arpSequence
        let arpSeq: number[] = [];
        for (let i = 0; i < octaveRange; i++) {
            const octaveShift = i * 12 + timbre.octaveShift * 12;
            arpSeq.push(...midiNotes.map(note => note + octaveShift));
        }
        if (sortNotes) {
            arpSeq.sort((a, b) => a - b);
        }

        // Generate pattern
        const generated = generateArpeggioPattern({
            arpSequence: arpSeq,
            pattern,
            sequencerSteps,
        }, 64);

        setGeneratedArpPattern(generated);

        // บันทึก settings ของ Timbre
        setTimbreArpSettings({
            waveform: timbre.waveform,
            rootNote: timbre.octaveShift > 0 ? rootNote + timbre.octaveShift * 12 : rootNote,
        });

        // เล่นเสียงทันทีหลังจาก generate (ใช้ ref)
        setTimeout(() => {
            previewTimbreArpRef.current();
        }, 100);
    }, [selectedTimbreId, heldIntervals, musicalKey, octaveRange, sortNotes, pattern, sequencerSteps, rootNote]);

    // Preview ARP Pattern ด้วย Timbre ที่เลือก
    const previewTimbreArp = useCallback(async () => {
        if (generatedArpPattern.length === 0) {
            setModalState({
                show: true,
                type: 'alert',
                title: 'NO PATTERN',
                message: 'Please generate ARP pattern first.',
            });
            return;
        }

        const timbre = selectedTimbreId ? CLASSIC_TIMBRES.find(t => t.id === selectedTimbreId) : null;
        if (!timbre) {
            console.error('[Preview] Timbre not found');
            return;
        }

        console.log('[Preview] Starting preview with timbre:', timbre.name, 'waveform:', timbre.waveform);

        initializeAudio();
        const context = audioContextRef.current;
        if (!context) {
            console.error('[Preview] Audio context not available');
            return;
        }

        // Force resume audio context (สำคัญมาก!)
        if (context.state === 'suspended') {
            await context.resume();
            console.log('[Preview] Audio context resumed');
        }

        // หยุดเสียง preview เก่าก่อนเล่นเสียงใหม่
        if (isPreviewPlayingRef.current) {
            stopPreviewTimbreArp();
            // รอเล็กน้อยให้เสียงเก่าหยุดสนิท
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        isPreviewPlayingRef.current = true;
        setIsPreviewPlaying(true);

        try {
            const now = context.currentTime;
            const stepDuration = (60 / bpm) * TIME_DIVISIONS[timeDivision];
            const gateDuration = stepDuration * (gateLength >= 128 ? 1.0 : gateLength / 127.0);

            // สร้าง master gain node สำหรับ preview - ลด volume เพื่อป้องกันเสียงแตก
            const previewMasterGain = context.createGain();
            previewMasterGain.gain.value = masterVolume * 0.5;

            // สร้าง low-pass filter เพื่อตัดความถี่สูงที่ทำให้เสียงแตก
            const previewFilter = context.createBiquadFilter();
            previewFilter.type = 'lowpass';
            previewFilter.frequency.value = Math.min(timbre.filterCutoff, 10000);
            previewFilter.Q.value = timbre.filterResonance * 0.1;

            // สร้าง compressor เพื่อป้องกันเสียงแตก
            const previewCompressor = context.createDynamicsCompressor();
            previewCompressor.threshold.value = -30;
            previewCompressor.knee.value = 40;
            previewCompressor.ratio.value = 12;
            previewCompressor.attack.value = 0.003;
            previewCompressor.release.value = 0.2;

            previewMasterGain.connect(previewFilter);
            previewFilter.connect(previewCompressor);
            previewCompressor.connect(context.destination);

            // เก็บ reference
            previewMasterGainRef.current = previewMasterGain;
            previewFilterRef.current = previewFilter;
            previewCompressorRef.current = previewCompressor;

            let maxTime = now;
            const scheduledOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];

            // คำนวณจำนวน notes สูงสุดที่เล่นพร้อมกัน เพื่อลด volume ต่อ note
            const maxPolyphony = generatedArpPattern.reduce((max: number, note) => {
                if (note === null) return max;
                const count = Array.isArray(note) ? note.length : 1;
                return Math.max(count, max);
            }, 1);
            const perNoteGain = 0.7 / maxPolyphony;

            // ฟังก์ชันสร้าง Oscillator สำหรับโน้ต
            const createOscillatorForNote = (
                freq: number,
                startTime: number,
                gateDuration: number,
                timbreData: TimbrePreset,
                outputGain: GainNode
            ) => {
                const osc = context.createOscillator();
                const gainNode = context.createGain();

                osc.type = timbreData.waveform;
                osc.frequency.value = freq;

                // ADSR Envelope
                const attackTime = Math.max(0.001, timbreData.attack * 0.3);
                const decayTime = Math.max(0.01, timbreData.decay * 0.3);
                const releaseTime = Math.max(0.05, timbreData.release * 0.5);

                const peakGain = velocity * perNoteGain * 1.0;

                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attackTime);
                gainNode.gain.linearRampToValueAtTime(peakGain * timbreData.sustain, startTime + attackTime + decayTime);
                gainNode.gain.setValueAtTime(peakGain * timbreData.sustain, startTime + gateDuration);
                gainNode.gain.linearRampToValueAtTime(0, startTime + gateDuration + releaseTime);

                osc.connect(gainNode);
                gainNode.connect(outputGain);
                osc.start(startTime);
                osc.stop(startTime + gateDuration + releaseTime + 0.1);

                scheduledOscillators.push({ osc, gain: gainNode });
            };

            // เล่น ARP Pattern ด้วยเสียงของ Timbre (ใช้ waveform)
            generatedArpPattern.forEach((midiNote, index) => {
                if (midiNote !== null) {
                    const notes = Array.isArray(midiNote) ? midiNote : [midiNote];
                    const startTime = now + index * stepDuration;
                    const stopTime = startTime + gateDuration;

                    notes.forEach(noteNum => {
                        const freq = midiToFreq(noteNum);
                        createOscillatorForNote(freq, startTime, gateDuration, timbre, previewMasterGain);

                        if (stopTime + gateDuration > maxTime) {
                            maxTime = stopTime + gateDuration;
                        }
                    });
                }
            });

            // เก็บ reference สำหรับหยุด
            previewOscillatorsRef.current = scheduledOscillators;

            // หยุด preview เมื่อเล่นจบ
            const endTimeout = setTimeout(() => {
                setIsPreviewPlaying(false);
                isPreviewPlayingRef.current = false;
                previewMasterGain.disconnect();
                previewFilter.disconnect();
                previewCompressor.disconnect();
                scheduledOscillators.forEach(({ osc, gain }) => {
                    try {
                        osc.disconnect();
                        gain.disconnect();
                    } catch (e) {}
                });
                previewOscillatorsRef.current = [];
                previewMasterGainRef.current = null;
                previewFilterRef.current = null;
                previewCompressorRef.current = null;
                previewTimeoutRef.current = null;
            }, (maxTime - now) * 1000 + 200);

            previewTimeoutRef.current = endTimeout;
            scheduledEventsRef.current.push(endTimeout as unknown as number);

        } catch (error) {
            console.error('Preview error:', error);
            setIsPreviewPlaying(false);
            setModalState({
                show: true,
                type: 'alert',
                title: 'PREVIEW ERROR',
                message: 'Failed to play preview.',
            });
        }
    }, [generatedArpPattern, selectedTimbreId, bpm, timeDivision, gateLength, masterVolume, velocity, sortNotes, initializeAudio]);

    // Set ref for previewTimbreArp
    useEffect(() => {
        previewTimbreArpRef.current = previewTimbreArp;
    }, [previewTimbreArp]);

    // หยุด Preview
    const stopPreviewTimbreArp = useCallback(() => {
        // Clear timeout
        if (previewTimeoutRef.current) {
            try {
                clearTimeout(previewTimeoutRef.current);
            } catch (e) {}
            previewTimeoutRef.current = null;
        }

        // Clear all scheduled timeouts
        scheduledEventsRef.current.forEach(id => {
            try {
                clearTimeout(id as unknown as number);
            } catch (e) {}
        });
        scheduledEventsRef.current = [];

        // Stop all oscillators immediately
        const context = audioContextRef.current;
        if (context) {
            const now = context.currentTime;

            // Stop all oscillators
            previewOscillatorsRef.current.forEach(({ osc, gain }) => {
                try {
                    // Ramp down gain quickly to prevent clicking
                    gain.gain.cancelScheduledValues(now);
                    gain.gain.setValueAtTime(gain.gain.value, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.01);

                    // Stop oscillator
                    osc.stop(now + 0.02);

                    // Disconnect after stopping
                    setTimeout(() => {
                        try {
                            osc.disconnect();
                            gain.disconnect();
                        } catch (e) {}
                    }, 30);
                } catch (e) {}
            });

            // Disconnect master gain, filter and compressor
            if (previewMasterGainRef.current) {
                try {
                    previewMasterGainRef.current.disconnect();
                } catch (e) {}
                previewMasterGainRef.current = null;
            }

            if (previewFilterRef.current) {
                try {
                    previewFilterRef.current.disconnect();
                } catch (e) {}
                previewFilterRef.current = null;
            }

            if (previewCompressorRef.current) {
                try {
                    previewCompressorRef.current.disconnect();
                } catch (e) {}
                previewCompressorRef.current = null;
            }
        }

        previewOscillatorsRef.current = [];
        isPreviewPlayingRef.current = false;
        setIsPreviewPlaying(false);
    }, []);

    // ปิด Timbre Modal และหยุดเสียงทั้งหมด
    const closeTimbreModal = useCallback(() => {
        stopPreviewTimbreArp();
        stopAllMidiPlayback();
        setShowTimbreModal(false);
    }, []);

    // Export เป็น MIDI
    const exportTimbreMidi = useCallback(() => {
        if (generatedArpPattern.length === 0) {
            setModalState({
                show: true,
                type: 'alert',
                title: 'NO PATTERN',
                message: 'Please generate ARP pattern first.',
            });
            return;
        }

        const timbre = selectedTimbreId ? CLASSIC_TIMBRES.find(t => t.id === selectedTimbreId) : null;
        const exportBpm = timbreArpSettings.bpm || bpm;

        const midiDataUri = createMidiDataUri(
            generatedArpPattern,
            exportBpm,
            480,
            TIME_DIVISIONS[timeDivision],
            gateLength,
            velocity
        );

        const link = document.createElement('a');
        link.href = midiDataUri;
        link.download = `ARP_${timbre?.name || 'Timbre'}_${new Date().getTime()}.mid`;
        link.click();

        setModalState({
            show: true,
            type: 'success',
            title: 'EXPORTED',
            message: 'MIDI file exported successfully!',
        });
    }, [generatedArpPattern, selectedTimbreId, timbreArpSettings, bpm, timeDivision, gateLength, velocity]);

    // Export เป็น WAV
    const exportTimbreWav = useCallback(async () => {
        if (generatedArpPattern.length === 0) {
            setModalState({
                show: true,
                type: 'alert',
                title: 'NO PATTERN',
                message: 'Please generate ARP pattern first.',
            });
            return;
        }

        const timbre = selectedTimbreId ? CLASSIC_TIMBRES.find(t => t.id === selectedTimbreId) : null;
        if (!timbre) return;

        const audioContext = audioContextRef.current;
        if (!audioContext) return;

        try {
            const exportBpm = timbreArpSettings.bpm || bpm;
            const stepDuration = (60 / exportBpm) * TIME_DIVISIONS[timeDivision];
            const gateDuration = stepDuration * (gateLength >= 128 ? 1.0 : gateLength / 127.0);
            const durationInSeconds = stepDuration * generatedArpPattern.length * 2;

            const offlineContext = new OfflineAudioContext(
                2,
                Math.floor(audioContext.sampleRate * durationInSeconds),
                audioContext.sampleRate
            );

            const masterGain = offlineContext.createGain();
            masterGain.gain.value = masterVolume;
            masterGain.connect(offlineContext.destination);

            const now = 0;
            generatedArpPattern.forEach((midiNote, index) => {
                if (midiNote !== null) {
                    const notes = Array.isArray(midiNote) ? midiNote : [midiNote];
                    const startTime = now + index * stepDuration;
                    const stopTime = startTime + gateDuration;

                    notes.forEach(noteNum => {
                        const osc = offlineContext.createOscillator();
                        const gainNode = offlineContext.createGain();

                        osc.type = timbre.waveform;
                        osc.frequency.value = midiToFreq(noteNum);

                        // ADSR Envelope
                        gainNode.gain.setValueAtTime(0, startTime);
                        gainNode.gain.linearRampToValueAtTime(velocity, startTime + timbre.attack);
                        gainNode.gain.linearRampToValueAtTime(velocity * timbre.sustain, startTime + timbre.attack + timbre.decay);
                        gainNode.gain.linearRampToValueAtTime(0, stopTime + timbre.release);

                        osc.connect(gainNode);
                        gainNode.connect(masterGain);
                        osc.start(startTime);
                        osc.stop(stopTime + timbre.release + 0.1);
                    });
                }
            });

            const renderedBuffer = await offlineContext.startRendering();
            const wavDataUri = createWavDataUri(renderedBuffer);

            const link = document.createElement('a');
            link.href = wavDataUri;
            link.download = `ARP_${timbre.name || 'Timbre'}_${new Date().getTime()}.wav`;
            link.click();

            setModalState({
                show: true,
                type: 'success',
                title: 'EXPORTED',
                message: 'WAV file exported successfully!',
            });

        } catch (error) {
            console.error('WAV export error:', error);
            setModalState({
                show: true,
                type: 'alert',
                title: 'EXPORT ERROR',
                message: 'Failed to export WAV file.',
            });
        }
    }, [generatedArpPattern, selectedTimbreId, timbreArpSettings, bpm, timeDivision, gateLength, masterVolume, velocity, sortNotes]);

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
        const KEY_TO_MIDI_LOWER: Record<string, number> = {
            // Lower octave (starts from C of baseOctave)
            'a': 12 * baseOctave, 'w': 12 * baseOctave + 1, 's': 12 * baseOctave + 2, 'e': 12 * baseOctave + 3, 'd': 12 * baseOctave + 4, 'f': 12 * baseOctave + 5, 't': 12 * baseOctave + 6, 'g': 12 * baseOctave + 7, 'y': 12 * baseOctave + 8, 'h': 12 * baseOctave + 9, 'u': 12 * baseOctave + 10, 'j': 12 * baseOctave + 11, 'k': 12 * baseOctave + 12
        };
        const KEY_TO_MIDI_UPPER: Record<string, number> = {
            // Upper octave (starts from C of baseOctave+1)
            'z': 12 * (baseOctave + 1), 's': 12 * (baseOctave + 1) + 1, 'x': 12 * (baseOctave + 1) + 2, 'd': 12 * (baseOctave + 1) + 3, 'c': 12 * (baseOctave + 1) + 4, 'v': 12 * (baseOctave + 1) + 5, 'g': 12 * (baseOctave + 1) + 6, 'b': 12 * (baseOctave + 1) + 7, 'n': 12 * (baseOctave + 1) + 8, 'm': 12 * (baseOctave + 1) + 9, ',': 12 * (baseOctave + 1) + 10, '.': 12 * (baseOctave + 1) + 11, '/': 12 * (baseOctave + 1) + 12
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            // Ignore if typing in input or modifier keys are pressed
            if (e.ctrlKey || e.metaKey || e.altKey || target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.isContentEditable) return;

            const key = e.key.toLowerCase();
            const midiNote = KEY_TO_MIDI_LOWER[key] || KEY_TO_MIDI_UPPER[key];
            if (midiNote && !pressedKeysRef.current.has(key)) {
                e.preventDefault();
                pressedKeysRef.current.add(key);
                handleNoteOn(midiNote);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const midiNote = KEY_TO_MIDI_LOWER[key] || KEY_TO_MIDI_UPPER[key];
            if (midiNote) {
                e.preventDefault();
                pressedKeysRef.current.delete(key);

                if (!isHoldOn) {
                    handleNoteOff(midiNote);
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

        // ใช้ heldIntervals จาก state โดยตรง ไม่ใช่จาก paramsRef
        if (heldIntervals.length > 0) {
            const result = getNextNote();
            if (result) {
                if (isActiveStep) {
                    noteToPlay = result.note;
                    noteIndex = result.index;
                }
            }
        }

        notesInQueueRef.current.push({
            noteIndex: (isActiveStep && heldIntervals.length > 0 && noteToPlay !== null) ? noteIndex : -1,
            seqIndex: seqStep,
            midiNote: (isActiveStep && heldIntervals.length > 0) ? noteToPlay : null,
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

            // Force resume audio context (สำคัญสำหรั������� browser ที่ suspend audio)
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
                // Clear timer เก่าก่อนสร้างใหม่ (����้อ���กัน scheduler ซ้อน)
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
    }, [isPlaying, initializeAudio, heldIntervals, arpSequence, pattern]);

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
            setHeldIntervals([]);
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

        // แปลง intervals เป็น MIDI notes จาก musicalKey ปัจจุบัน
        const currentKeyRootMidi = ROOT_NOTES[musicalKey];
        const midiNotes = heldIntervals.map(interval => currentKeyRootMidi + interval);

        const newMidi: SavedMidi = { name: `Arp-${new Date().toLocaleTimeString().replace(/:/g, '')}`, data: dataUri, settings: { waveform, bpm, timeDivision, pattern, octaveRange, gateLength, velocity, rootNote, masterVolume, heldRoots: midiNotes, sortNotes, sequencerSteps, musicalKey, scale } };
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
                    <div className="relative w-full">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full h-10 bg-[#151515] border border-zinc-700 text-[#2ed573] font-bold text-[12px] tracking-widest px-3 flex items-center justify-between shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] hover:border-[#2ed573] hover:shadow-[0_0_10px_rgba(46,213,115,0.2)] transition-all rounded-[2px]"
                        >
                            <span className="truncate">{currentPresetName || "SELECT STYLE"}</span>
                            <span className="text-[10px] transform scale-y-75">▼</span>
                        </button>

                        {isOpen && (
                            <div className="absolute top-full left-0 w-full mt-1 max-h-[200px] overflow-y-auto bg-[#1a1a1a] border border-zinc-700 shadow-[0_10px_30px_rgba(0,0,0,0.9)] z-50 rounded-[2px] custom-scrollbar">
                                {Object.values(GENRE_PRESETS).map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => { loadSettings(preset); setIsOpen(false); }}
                                        className={`
                                    w-full text-left px-3 py-2 text-[10px] font-bold tracking-widest border-b border-[#222] hover:bg-[#2ed573] hover:text-black transition-colors
                                    ${currentPresetName === preset.name ? 'text-[#2ed573] bg-[#222]' : 'text-zinc-500'}
                                `}
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
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

                    <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex flex-col gap-1 md:gap-2 min-h-[120px] md:min-h-[150px]">
                        <ModulePanel title="OSCILLATOR" className="h-full">
                            <div className="flex flex-col h-full gap-1 md:gap-2">
                                <div className="flex-1">
                                    <div className="text-[7px] md:text-[9px] text-zinc-500 font-bold tracking-widest text-center mb-0.5">WAVEFORM</div>
                                    <div className="grid grid-cols-4 gap-0.5 md:gap-1">
                                        {(['sine', 'square', 'sawtooth', 'triangle'] as const).map(w => (
                                            <button key={w} onClick={() => setWaveform(w)} className={`h-7 md:h-8 rounded-[2px] text-[8px] md:text-[9px] font-bold uppercase border transition-all duration-100 shadow-sm ${waveform === w ? 'bg-[#2ed573] text-black border-[#2ed573] shadow-[0_0_8px_rgba(46,213,115,0.4)]' : 'bg-[#333] text-[#888] border-[#111] hover:text-[#ccc] hover:bg-[#444]'}`}>{w.slice(0, 3)}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-[7px] md:text-[9px] text-zinc-500 font-bold tracking-widest text-center mb-0.5">TIMBRE</div>
                                    <button
                                        onClick={() => openTimbreModal('All')}
                                        className="w-full h-8 md:h-9 rounded-[2px] text-[8px] md:text-[9px] font-bold uppercase border bg-gradient-to-r from-[#f5f5f5] to-[#d4a574] text-black border-[#b8956a] shadow-[0_0_8px_rgba(245,245,245,0.3)] hover:shadow-[0_0_15px_rgba(245,245,245,0.5)] transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="text-lg">🎼</span>
                                        <span>Iconic Timbre</span>
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <button
                                        onClick={handleInstallVst}
                                        className="w-full h-8 md:h-9 rounded-[2px] text-[8px] md:text-[9px] font-bold uppercase border bg-gradient-to-r from-[#2ed573] to-[#26a65b] text-black border-[#1e8f5f] shadow-[0_0_8px_rgba(46,213,115,0.4)] hover:shadow-[0_0_12px_rgba(46,213,115,0.6)] transition-all"
                                    >
                                        🖥️ Download Desktop
                                    </button>
                                </div>
                            </div>
                        </ModulePanel>
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-8 flex flex-col gap-1 md:gap-2 min-h-[120px] md:min-h-[150px]">
                        <ModulePanel title="SEQUENCE ENGINE" className="h-full">
                            <div className="absolute top-1 right-1 md:top-2 md:right-2 flex gap-0.5 md:gap-1"><Led active={arpSequence.length > 0} /><Led active={isPlaying} color="#ff0080" /></div>
                            <div className="flex gap-2 md:gap-4 mt-1 h-full">
                                <div className="flex flex-col gap-1 md:gap-2 flex-1">
                                    <div className="space-y-0.5">
                                        <div className="text-[7px] md:text-[9px] text-zinc-500 font-bold tracking-widest text-center mb-0.5">PRESETS</div>
                                        <div className="relative w-full">
                                            <button
                                                onClick={() => setIsOpen(!isOpen)}
                                                className="w-full h-8 bg-[#151515] border border-zinc-700 text-[#2ed573] font-bold text-[10px] tracking-widest px-2 flex items-center justify-between shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] hover:border-[#2ed573] hover:shadow-[0_0_10px_rgba(46,213,115,0.2)] transition-all rounded-[2px]"
                                            >
                                                <span className="truncate">{currentPresetName || "SELECT STYLE"}</span>
                                                <span className="text-[8px] transform scale-y-75">▼</span>
                                            </button>

                                            {isOpen && (
                                                <div className="absolute top-full left-0 w-full mt-1 max-h-[200px] overflow-y-auto bg-[#1a1a1a] border border-zinc-700 shadow-[0_10px_30px_rgba(0,0,0,0.9)] z-50 rounded-[2px] custom-scrollbar">
                                                    {Object.values(GENRE_PRESETS).map((preset) => (
                                                        <button
                                                            key={preset.name}
                                                            onClick={() => { loadSettings(preset); setIsOpen(false); }}
                                                            className={`
                                    w-full text-left px-3 py-2 text-[10px] font-bold tracking-widest border-b border-[#222] hover:bg-[#2ed573] hover:text-black transition-colors
                                    ${currentPresetName === preset.name ? 'text-[#2ed573] bg-[#222]' : 'text-zinc-500'}
                                `}
                                                        >
                                                            {preset.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-[7px] md:text-[9px] text-zinc-500 font-bold tracking-widest text-center">PATTERN</div>
                                        <div className="grid grid-cols-2 gap-0.5">
                                            {(['Up', 'Down', 'UpDown', 'Random'] as const).map(p => (
                                                <button key={p} onClick={() => setPattern(p)} className={`h-6 md:h-7 text-[7px] md:text-[9px] uppercase font-bold rounded-[2px] border ${pattern === p ? 'bg-[#ffa502] text-black border-[#e67e22] shadow-[0_0_8px_rgba(255,165,2,0.4)]' : 'bg-[#222] text-zinc-500 border-[#111] hover:bg-[#333]'}`}>{p}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between px-0.5 gap-0.5">
                                        <Knob label="Octave" value={octaveRange} min={1} max={4} onChange={setOctaveRange} size={30} color="#ffa502" />
                                        <Knob label="Root" value={rootNote} min={36} max={84} onChange={setRootNote} size={30} color="#ffa502" />
                                        <Knob label="Gate" value={gateLength} min={10} max={128} onChange={setGateLength} size={30} color="#00dfd8" />
                                        <Knob label="Vel" value={velocity} min={0} max={1} onChange={setVelocity} size={30} color="#00dfd8" />
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

                                <div className="flex flex-col gap-1 flex-1">
                                    <div className="text-[7px] md:text-[9px] text-zinc-500 font-bold tracking-widest text-center mb-0.5">KEY</div>
                                    <div className="grid grid-cols-4 gap-0.5">
                                        {KEY_NAMES.map(key => (
                                            <button key={key} onClick={() => setMusicalKey(key as MusicalKey)} className={`h-6 md:h-7 text-[7px] md:text-[9px] font-bold rounded-[1px] border transition-all ${musicalKey === key ? 'bg-[#2ed573] text-black border-[#2ed573] shadow-[0_0_8px_rgba(46,213,115,0.4)]' : 'bg-[#222] text-zinc-500 border-[#111] hover:bg-[#333]'}`}>{key}</button>
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
                                    <HardButton label="UNDO" active={heldIntervalsHistory.length > 0} color="blue" onClick={undo} />
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
                        <VirtualKeyboard key={`kbd-${activeChordNotes.join(',')}-${heldIntervals.join(',')}-${musicalKey}`} heldIntervals={heldIntervals} musicalKey={musicalKey} activeChordNotes={activeChordNotes} onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} />
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
                                        <li>• <span className="text-[#2ed573]">HOLD ON ����</span>: Press key once to toggle note on/off</li>
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

                {/* VST Searching Popup */}
                {showVstSearching && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md">
                        <div className="bg-[#222] border-2 border-[#2ed573] p-8 rounded-lg shadow-[0_0_50px_rgba(46,213,115,0.5)] max-w-sm w-full text-center">
                            <div className="text-4xl mb-4 animate-pulse">🔍</div>
                            <div className="text-lg font-bold text-[#2ed573] tracking-widest mb-2">SEARCHING VST</div>
                            <div className="text-[10px] font-mono text-zinc-400 mb-6">Scanning for VST plugins...</div>
                            <div className="flex justify-center gap-1">
                                <div className="w-3 h-3 bg-[#2ed573] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-3 h-3 bg-[#2ed573] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-3 h-3 bg-[#2ed573] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                {modalState.show && !isDownloading && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget && modalState.type !== 'confirm') closeModal(); }}>
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
                
                {/* Loading Modal for Download */}
                {isDownloading && (
                    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/90 backdrop-blur-sm">
                        <div className="bg-[#222] border-2 border-[#2ed573] p-8 rounded-lg shadow-[0_0_50px_rgba(46,213,115,0.3)] max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
                            <div className="text-[#2ed573] text-lg font-bold tracking-widest mb-4">⬇️ DOWNLOADING...</div>
                            <div className="flex justify-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-[#2ed573] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-3 h-3 bg-[#2ed573] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-3 h-3 bg-[#2ed573] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <div className="text-[10px] font-mono text-zinc-400">
                                Starting your download...<br/>
                                Please wait
                            </div>
                        </div>
                    </div>
                )}

                {/* Timbre Modal */}
                {showTimbreModal && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
                        onClick={closeTimbreModal}
                    >
                        <div
                            className="bg-[#1a1a1a] border-2 border-[#333] rounded-lg shadow-[0_0_100px_rgba(0,0,0,0.8)] max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-[#111] border-b border-[#333] px-6 py-4 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🎼</span>
                                    <div>
                                        <h2 className="text-xl font-bold text-[#2ed573] tracking-widest">TIMBRE LIBRARY</h2>
                                        <p className="text-[10px] text-zinc-500">Select your instrument and generate ARP patterns</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeTimbreModal}
                                    className="text-zinc-500 hover:text-white transition-colors text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Category Tabs - Fixed position */}
                            <div className="bg-[#0f0f0f] border-b border-[#333] px-6 py-3 flex gap-2 overflow-x-auto flex-shrink-0 sticky top-0 z-10">
                                {(['All', 'Acoustic', 'Synth', 'Bass', 'Lead', 'Pad', 'FX'] as (TimbreCategory | 'All')[]).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveTimbreCategory(cat as TimbreCategory)}
                                        className={`px-4 py-2 text-[10px] font-bold tracking-widest rounded transition-all whitespace-nowrap ${
                                            activeTimbreCategory === cat
                                                ? 'bg-[#2ed573] text-black shadow-[0_0_15px_rgba(46,213,115,0.4)]'
                                                : 'bg-[#222] text-zinc-500 hover:text-white hover:bg-[#333]'
                                        }`}
                                    >
                                        {cat === 'All' && '🎼'}
                                        {cat === 'Acoustic' && '🎹'}
                                        {cat === 'Synth' && '🎛️'}
                                        {cat === 'Bass' && '🎸'}
                                        {cat === 'Lead' && '🎤'}
                                        {cat === 'Pad' && '🌊'}
                                        {cat === 'FX' && '✨'}
                                        {' '}{cat.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            {/* Timbre Grid */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {CLASSIC_TIMBRES
                                        .filter(t => {
                                            if (activeTimbreCategory === 'All') return true;
                                            if (activeTimbreCategory === 'Acoustic') return t.category === 'Acoustic' || t.category === 'Electric';
                                            if (activeTimbreCategory === 'Synth') return t.category === 'Synth';
                                            if (activeTimbreCategory === 'Bass') return t.type === 'Bass';
                                            if (activeTimbreCategory === 'Lead') return ['Lead', 'Pluck', 'Arp'].includes(t.type);
                                            if (activeTimbreCategory === 'Pad') return ['Pad', 'Strings', 'Choir'].includes(t.type);
                                            if (activeTimbreCategory === 'FX') return t.category === 'FX' || ['Bell', 'Sweep', 'Choir'].includes(t.type);
                                            return true;
                                        })
                                        .map(timbre => (
                                            <button
                                                key={timbre.id}
                                                onClick={() => selectTimbre(timbre.id)}
                                                className={`relative p-4 rounded-lg border-2 transition-all duration-200 group ${
                                                    selectedTimbreId === timbre.id
                                                        ? 'border-[#2ed573] bg-[#2ed573]/10 shadow-[0_0_20px_rgba(46,213,115,0.3)]'
                                                        : 'border-[#333] bg-[#222] hover:border-[#555] hover:bg-[#2a2a2a]'
                                                }`}
                                            >
                                                <div className="text-4xl mb-2">{timbre.icon}</div>
                                                <div className="text-[11px] font-bold text-white mb-1">{timbre.name}</div>
                                                <div className="text-[9px] text-zinc-500">{timbre.type}</div>
                                                <div
                                                    className="absolute top-2 right-2 w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: timbre.color }}
                                                />
                                                {selectedTimbreId === timbre.id && (
                                                    <div className="absolute top-2 left-2 w-5 h-5 bg-[#2ed573] rounded-full flex items-center justify-center">
                                                        <span className="text-black text-xs">✓</span>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                </div>
                            </div>

                            {/* Action Panel - Fixed at bottom */}
                            <div className="bg-[#111] border-t border-[#333] px-6 py-4 flex-shrink-0">
                                <div className="flex items-center justify-between gap-4">
                                    {/* Selected Timbre Info */}
                                    <div className="flex items-center gap-3 flex-1">
                                        {selectedTimbreId ? (() => {
                                            const selectedTimbre = CLASSIC_TIMBRES.find(t => t.id === selectedTimbreId);
                                            if (!selectedTimbre) return null;
                                            return (
                                                <>
                                                    <span className="text-3xl">{selectedTimbre.icon}</span>
                                                    <div>
                                                        <div className="text-[10px] text-zinc-500">SELECTED TIMBRE</div>
                                                        <div className="text-lg font-bold text-white">{selectedTimbre.name}</div>
                                                        <div className="text-[9px] text-zinc-400 flex gap-2">
                                                            <span>Wave: {selectedTimbre.waveform}</span>
                                                            <span>•</span>
                                                            <span>Octave: {selectedTimbre.octaveShift > 0 ? '+' : ''}{selectedTimbre.octaveShift}</span>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })() : (
                                            <div className="text-zinc-500 text-sm">Select a timbre to continue</div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={generateArpFromTimbre}
                                            disabled={!selectedTimbreId || heldIntervals.length === 0}
                                            className="px-6 py-3 bg-[#ffa502] text-black text-[10px] font-bold tracking-widest rounded border border-[#e67e22] hover:bg-[#ffb14d] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(255,165,2,0.3)] hover:shadow-[0_0_25px_rgba(255,165,2,0.5)]"
                                            title="Generate ARP pattern from selected timbre"
                                        >
                                            ⚡ GENERATE
                                        </button>
                                        <button
                                            onClick={isPreviewPlaying ? stopPreviewTimbreArp : previewTimbreArp}
                                            disabled={!selectedTimbreId || generatedArpPattern.length === 0}
                                            className={`px-6 py-3 text-[10px] font-bold tracking-widest rounded border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                                isPreviewPlaying
                                                    ? 'bg-red-600 text-white border-red-800 shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:bg-red-700'
                                                    : 'bg-[#2ed573] text-black border-[#1a9c50] hover:bg-[#00dfd8] shadow-[0_0_15px_rgba(46,213,115,0.3)]'
                                            }`}
                                            title={isPreviewPlaying ? 'Stop preview' : 'Play preview'}
                                        >
                                            {isPreviewPlaying ? '⬛ STOP' : '▶ PREVIEW'}
                                        </button>
                                        <button
                                            onClick={exportTimbreMidi}
                                            disabled={generatedArpPattern.length === 0}
                                            className="px-4 py-3 bg-[#333] text-zinc-400 text-[10px] font-bold tracking-widest rounded border border-[#222] hover:text-white hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            title="Export MIDI"
                                        >
                                            🎹 MIDI
                                        </button>
                                        <button
                                            onClick={exportTimbreWav}
                                            disabled={generatedArpPattern.length === 0}
                                            className="px-4 py-3 bg-[#333] text-zinc-400 text-[10px] font-bold tracking-widest rounded border border-[#222] hover:text-white hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            title="Export WAV"
                                        >
                                            🌊 WAV
                                        </button>
                                    </div>
                                </div>

                                {/* Pattern Status */}
                                {generatedArpPattern.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-[#333] flex items-center gap-2">
                                        <div className="text-[9px] text-zinc-500">PATTERN STATUS:</div>
                                        <div className="flex items-center gap-1">
                                            <div className={`w-2 h-2 rounded-full ${generatedArpPattern.length > 0 ? 'bg-[#2ed573] animate-pulse' : 'bg-zinc-600'}`} />
                                            <span className="text-[9px] text-[#2ed573] font-mono">
                                                {generatedArpPattern.filter(n => n !== null).length} notes generated
                                            </span>
                                        </div>
                                        {timbreArpSettings.waveform && (
                                            <>
                                                <span className="text-zinc-600">•</span>
                                                <span className="text-[9px] text-zinc-400 font-mono">
                                                    Wave: {timbreArpSettings.waveform}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
