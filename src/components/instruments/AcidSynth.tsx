"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import * as Tone from 'tone';
import '../../app/acid/acid.css';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const midiToFreq = (midi: number): number => Math.pow(2, (midi - 69) / 12) * 440;

const getNoteName = (midi: number) => {
    return NOTE_NAMES[midi % 12];
};

// --- MIDI EXPORT UTILS ---
const encodeVLQ = (value: number) => {
    const bytes = [];
    do {
        let byte = value & 0x7f;
        value >>= 7;
        if (bytes.length > 0) byte |= 0x80;
        bytes.push(byte);
    } while (value > 0);
    return bytes.reverse();
};

// --- COLOR SYSTEM (Exact Match) ---
const THEME = {
    laneO_Up: "#3b82f6",     // Blue
    laneO_Down: "#22c55e",   // Green
    laneS: "#a16207",        // Gold/Yellow
    laneA: "#b91c1c",        // Red
    bg: "#111111",
    panel: "#0a0a0a",
    grid: "#1a1a1a",
    activeNote: "#588173",   // Muted Green for notes
    text: "#d1d5db",
};

// --- UI COMPONENTS ---

const Knob = ({ label, value, min, max, onChange, color = "#00f0ff", size = 45 }: any) => {
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const startVal = useRef(0);
    const lastUpdate = useRef(0);
    const throttleMs = 50; // Update every 50ms to avoid audio glitches

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        startY.current = e.clientY;
        startVal.current = value;
        document.body.style.cursor = 'ns-resize';
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        startY.current = e.touches[0].clientY;
        startVal.current = value;
    };

    useEffect(() => {
        const handleMove = (clientY: number) => {
            if (!isDragging) return;

            // Throttle updates to avoid audio glitches
            const now = Date.now();
            if (now - lastUpdate.current < throttleMs) return;
            lastUpdate.current = now;

            const deltaY = startY.current - clientY;
            const range = max - min;
            const deltaVal = (deltaY / 150) * range;
            let newVal = startVal.current + deltaVal;
            newVal = Math.max(min, Math.min(max, newVal));
            newVal = Math.round(newVal);
            onChange(Number(newVal));
        };

        const onMouseMove = (e: MouseEvent) => handleMove(e.clientY);
        const onTouchMove = (e: TouchEvent) => {
            if (e.cancelable) e.preventDefault();
            handleMove(e.touches[0].clientY);
        };

        const onEnd = () => {
            setIsDragging(false);
            document.body.style.cursor = 'default';
        };

        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onEnd);
            window.addEventListener('touchmove', onTouchMove, { passive: false });
            window.addEventListener('touchend', onEnd);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onEnd);
        };
    }, [isDragging, max, min, onChange]);

    const percentage = (value - min) / (max - min);
    const rotation = -145 + (percentage * 290);

    return (
        <div className="flex flex-col items-center gap-1 group">
            <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter select-none">{label}</div>
            <div
                className="relative rounded-full bg-zinc-900 shadow-xl border border-zinc-800 cursor-ns-resize touch-none"
                style={{ width: size, height: size }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div
                    className="absolute top-1/2 left-1/2 rounded-full"
                    style={{
                        width: '80%',
                        height: '80%',
                        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                        background: 'linear-gradient(135deg, #333, #111)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                >
                    <div className="absolute top-[10%] left-1/2 w-[2px] h-[30%] -translate-x-1/2 bg-zinc-400 rounded-full"></div>
                </div>
            </div>
            <div className="text-[8px] font-mono text-zinc-600">{value}</div>
        </div>
    );
};

// --- LOGIC ---

const SCALES = {
    'Chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    'Major': [0, 2, 4, 5, 7, 9, 11],
    'Minor': [0, 2, 3, 5, 7, 8, 10],
    'Dorian': [0, 2, 3, 5, 7, 9, 10],
    'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
    'Lydian': [0, 2, 4, 6, 7, 9, 11],
    'Phrygian': [0, 1, 3, 5, 7, 8, 10],
    'Locrian': [0, 1, 3, 5, 6, 8, 10],
    'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
    'Melodic Minor': [0, 2, 3, 5, 7, 9, 11],
    'Pentatonic Major': [0, 2, 4, 7, 9],
    'Pentatonic Minor': [0, 3, 5, 7, 10],
    'Bhairav': [0, 1, 4, 5, 7, 8, 11],
    'Spanish': [0, 1, 4, 5, 7, 8, 10],
    'Blue': [0, 3, 5, 6, 7, 10],
    'Whole Tone': [0, 2, 4, 6, 8, 10]
};

export type Step = {
    note: number;
    active: boolean;
    accent: boolean;
    slide: boolean;
    octave: number; // -1, 0, 1
};

export interface AcidSynthProps {
    compact?: boolean;
    initialBpm?: number;
    initialScale?: string;
    initialRoot?: number;
    patternLength?: number;
    onPatternChange?: (pattern: Step[]) => void;
    onPlayChange?: (isPlaying: boolean) => void;
    onBpmChange?: (bpm: number) => void;
}

const AcidSynth: React.FC<AcidSynthProps> = ({
    compact = false,
    initialBpm = 140,
    initialScale = 'Minor',
    initialRoot = 0,
    patternLength: initialPatternLength = 16,
    onPatternChange,
    onPlayChange,
    onBpmChange,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(initialBpm);
    const [masterVolume, setMasterVolume] = useState(0.5);
    const [patternLength, setPatternLength] = useState(initialPatternLength);
    const [noteDensity, setNoteDensity] = useState(60);
    const [accentDensity, setAccentDensity] = useState(30);
    const [slideDensity, setSlideDensity] = useState(20);
    const [spread, setSpread] = useState(50);
    const [scale, setScale] = useState<keyof typeof SCALES>(initialScale as keyof typeof SCALES);
    const [root, setRoot] = useState(initialRoot);
    const [drive, setDrive] = useState(50); // TB-303 Drive control (0-100)

    // ตั้งค่า initialRoot และ initialScale เมื่อเปลี่ยน props
    useEffect(() => {
        console.log('[AcidSynth] Updating initialRoot:', initialRoot, 'initialScale:', initialScale);
        setRoot(initialRoot);
        setScale(initialScale as keyof typeof SCALES);
    }, [initialRoot, initialScale]);

    // Cleanup เมื่อ unmount
    useEffect(() => {
        return () => {
            console.log('[AcidSynth] Component unmounting, cleaning up');
            // Stop playback if playing
            if (isPlaying) {
                setIsPlaying(false);
            }
        };
    }, [isPlaying]);

    // Pattern State
    const [pattern, setPattern] = useState<Step[]>([]);
    const [currentStep, setCurrentStep] = useState(-1);

    // Synth Parameters
    const [cutoff, setCutoff] = useState(40);
    const [resonance, setResonance] = useState(60);
    const [envMod, setEnvMod] = useState(70);
    const [decay, setDecay] = useState(50);
    const [accent, setAccent] = useState(80);
    const [isCreeper, setIsCreeper] = useState(false);
    const [isEvolving, setIsEvolving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAudioReady, setIsAudioReady] = useState(false);

    // Tone.js Audio Engine Refs
    const samplerRef = useRef<Tone.MonoSynth | null>(null);
    const filterRef = useRef<Tone.Filter | null>(null);
    const gainRef = useRef<Tone.Gain | null>(null);
    const masterGainRef = useRef<Tone.Gain | null>(null);
    const compressorRef = useRef<Tone.Compressor | null>(null);
    const driveRef = useRef<Tone.Distortion | null>(null);
    const baseCutoffRef = useRef(400);

    const paramsRef = useRef({ bpm, cutoff, resonance, envMod, decay, accent, pattern, isPlaying, masterVolume, patternLength, scale, root, isCreeper });

    // Notify parent of pattern changes
    useEffect(() => {
        if (onPatternChange && pattern.length > 0) {
            onPatternChange(pattern);
        }
    }, [pattern, onPatternChange]);

    // Notify parent of play state changes
    useEffect(() => {
        if (onPlayChange) {
            onPlayChange(isPlaying);
        }
    }, [isPlaying, onPlayChange]);

    // Notify parent of BPM changes
    useEffect(() => {
        if (onBpmChange) {
            onBpmChange(bpm);
        }
    }, [bpm, onBpmChange]);

    useEffect(() => {
        paramsRef.current = { bpm, cutoff, resonance, envMod, decay, accent, pattern, isPlaying, masterVolume, patternLength, scale, root, isCreeper, drive };

        // Update Tone.js params in real-time with smoothing to avoid clicks/pops
        if (filterRef.current) {
            const cutoffFreq = 30 + (cutoff / 127) * (cutoff / 127) * 800;
            // Smooth cutoff transition (100ms ramp)
            filterRef.current.frequency.rampTo(cutoffFreq, 0.1);
            // Smooth resonance transition (50ms ramp)
            filterRef.current.Q.rampTo((resonance / 127) * 15, 0.05);
            baseCutoffRef.current = cutoffFreq;
        }
        // Update Drive with smoothing (TB-303 style soft clipping)
        // Note: Tone.Distortion doesn't support rampTo on distortion parameter
        // We use the wet/dry mix for smooth transitions instead
        if (driveRef.current) {
            const driveAmount = 0.1 + (drive / 100) * 0.5; // 0.1 to 0.6
            // Gradually update distortion to minimize clicks
            requestAnimationFrame(() => {
                if (driveRef.current) {
                    driveRef.current.distortion = driveAmount;
                }
            });
        }
        if (masterGainRef.current) {
            // Smooth volume transition (50ms ramp) to avoid clicks
            masterGainRef.current.gain.rampTo(masterVolume, 0.05);
        }
        // Update BPM in real-time
        if (Tone.Transport) {
            Tone.Transport.bpm.rampTo(bpm, 0.1);
        }
    }, [bpm, cutoff, resonance, envMod, decay, accent, pattern, isPlaying, masterVolume, patternLength, scale, root, isCreeper, drive]);

    const initAudio = useCallback(async (): Promise<boolean> => {
        // Prevent re-initialization if synth already exists
        if (samplerRef.current) {
            setIsLoading(false);
            setIsAudioReady(true);
            return true;
        }

        setIsLoading(true);
        setIsAudioReady(false);
        console.log('[TB-303] Initializing synth...');
        await Tone.start();

        // --- MONOSYNTH: TB-303 style bass synthesizer
        // TB-303 uses sawtooth + square wave mix, we use sawtooth as base
        const synth = new Tone.MonoSynth({
            oscillator: {
                type: "sawtooth"
            },
            envelope: {
                attack: 0.001,      // Very fast attack like TB-303
                decay: 0.3,
                sustain: 0.5,
                release: 0.5
            },
            filterEnvelope: {
                attack: 0.01,
                decay: 0.5,
                sustain: 0.6,
                baseFrequency: 50,   // Lower base for wider range
                octaves: 4,          // Wider range (TB-303 has wide sweep)
                exponent: 2
            }
        });

        // --- DRIVE: TB-303 style soft clipping (from jc303/Open303 algorithm)
        // shape(x) = x - (1/6)*x^3 with soft limiting
        const driveAmount = 0.1 + (drive / 100) * 0.5; // 0.1 to 0.6
        const driveEffect = new Tone.Distortion({
            distortion: driveAmount,   // Drive from state
            oversample: "4x"           // High quality oversampling
        });

        // --- FILTER: TB-303 style lowpass with resonance
        // TB-303 uses a 4-stage ladder filter variation with feedback highpass
        // Note: Tone.js only supports -12, -24, -48, -96 dB/oct
        const filter = new Tone.Filter({
            frequency: 400,
            type: "lowpass",
            Q: (resonance / 127) * 15,  // Resonance from parameter
            rolloff: -24                // Using -24 (closest to TB-303's ~18dB/oct)
        });

        const gain = new Tone.Gain(0.5);
        const masterGain = new Tone.Gain(masterVolume);

        const compressor = new Tone.Compressor({
            threshold: -24,
            ratio: 12,
            attack: 0.003,
            release: 0.25
        });

        // Connect chain: Synth -> Drive -> Filter -> Gain -> Master -> Compressor
        // Drive before filter like TB-303 circuit
        synth.connect(driveEffect);
        driveEffect.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        masterGain.connect(compressor);
        compressor.toDestination();

        samplerRef.current = synth;
        filterRef.current = filter;
        gainRef.current = gain;
        masterGainRef.current = masterGain;
        compressorRef.current = compressor;
        driveRef.current = driveEffect;

        setIsAudioReady(true);
        setIsLoading(false);
        console.log('[TB-303] Synth ready!');
        return true;
    }, [masterVolume]);

    // Play pattern using Tone.Transport
    useEffect(() => {
        if (!isPlaying || pattern.length === 0 || !isAudioReady) {
            Tone.Transport.stop();
            setCurrentStep(-1);
            return;
        }

        // Clear existing events
        Tone.Transport.cancel();

        // Schedule notes - each step is a 16th note (0.25 beats)
        for (let i = 0; i < patternLength; i++) {
            const step = pattern[i];
            if (step && step.active) {
                const freq = midiToFreq(36 + root + step.note + (step.octave * 12));
                const velocity = step.accent ? 1 : 0.7;

                // Schedule at exact 16th note positions
                // Tone.Transport uses beats (quarter notes), so 16th note = 0.25 beats
                Tone.Transport.schedule((time) => {
                    // TB-303 ACCENT CIRCUIT:
                    // Accent increases filter envelope depth, drive, and velocity
                    if (filterRef.current) {
                        const baseFreq = baseCutoffRef.current;
                        // Accent adds extra filter modulation depth (from jc303 algorithm)
                        const accentMod = step.accent ? (accent / 127) * 2500 : 0;
                        const modDepth = ((envMod / 127) * 2000) + accentMod;
                        // TB-303 decay envelope is exponential
                        const decayTime = (decay / 127) * 0.5 + 0.05;

                        filterRef.current.frequency.cancelScheduledValues(time);
                        filterRef.current.frequency.setValueAtTime(baseFreq + modDepth, time);
                        filterRef.current.frequency.exponentialRampToValueAtTime(baseFreq, time + decayTime);
                    }

                    // TB-303 DRIVE CIRCUIT:
                    // Accent increases drive amount for harder clipping
                    if (driveRef.current && samplerRef.current) {
                        const driveAmount = step.accent ? 0.4 + (accent / 127) * 0.2 : 0.3;
                        driveRef.current.distortion = driveAmount;

                        // TB-303 SLIDE:
                        // Extend note duration for slide effect (simpler approach)
                        // True portamento causes timing issues with Tone.Transport
                        const slideDuration = step.slide ? "8n" : "16n";

                        samplerRef.current.triggerAttackRelease(freq, slideDuration, time, velocity);
                    }

                    // Update visual
                    setCurrentStep(i);
                }, i * 0.25);
            }
        }

        Tone.Transport.loop = true;
        Tone.Transport.loopEnd = patternLength * 0.25;
        Tone.Transport.start();

        return () => {
            Tone.Transport.stop();
        };
    }, [isPlaying, pattern, patternLength, root, envMod, decay, accent, isAudioReady]);

    // Creeper effect
    useEffect(() => {
        if (!isCreeper || !isPlaying) return;

        const interval = setInterval(() => {
            if (Math.random() < 0.5) {
                const evolveIdx = Math.floor(Math.random() * patternLength);
                setPattern(prev => {
                    const next = [...prev];
                    const step = { ...next[evolveIdx] };
                    const rand = Math.random();

                    if (rand < 0.3) {
                        const scaleNotes = SCALES[scale];
                        step.note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
                    } else if (rand < 0.5) {
                        step.active = !step.active;
                    } else if (rand < 0.7) {
                        step.accent = !step.accent;
                    } else if (rand < 0.9) {
                        step.slide = !step.slide;
                    } else {
                        step.octave = Math.random() > 0.8 ? 1 : Math.random() > 0.9 ? -1 : 0;
                    }

                    next[evolveIdx] = step;
                    return next;
                });

                setIsEvolving(true);
                setTimeout(() => setIsEvolving(false), 150);
            }
        }, patternLength * (60 / bpm) * 1000);

        return () => clearInterval(interval);
    }, [isCreeper, isPlaying, patternLength, bpm, scale]);

    const generatePattern = useCallback(() => {
        const newPattern: Step[] = Array.from({ length: 64 }, () => ({
            active: false,
            note: 0,
            accent: false,
            slide: false,
            octave: 0
        }));

        const scaleNotes = SCALES[scale];
        const rootNote = scaleNotes[0];
        const fifth = scaleNotes[4] || scaleNotes[0];

        for (let i = 0; i < patternLength; i++) {
            // Rhythmic probability (Downbeats are more likely)
            const isDownbeat = i % 4 === 0;
            const isOffbeat = i % 2 !== 0;
            const prob = isDownbeat ? noteDensity * 1.2 : isOffbeat ? noteDensity * 0.6 : noteDensity;

            if (Math.random() * 100 < prob) {
                // Note Selection: Favor Root and 5th
                let note;
                const noteRand = Math.random();
                if (noteRand < 0.4) note = rootNote;
                else if (noteRand < 0.6) note = fifth;
                else note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];

                newPattern[i] = {
                    active: true,
                    note: note,
                    accent: Math.random() * 100 < accentDensity,
                    slide: Math.random() * 100 < slideDensity,
                    octave: Math.random() > 0.85 ? 1 : Math.random() > 0.9 ? -1 : 0
                };

                // Tie slides to next note logic
                if (newPattern[i].slide && i < patternLength - 1 && Math.random() > 0.5) {
                    // Ensure next note is active for the slide to be meaningful
                    // (Actually Slide on 303 affects the current note trailing into next)
                }
            }
        }
        setPattern(newPattern);
    }, [noteDensity, accentDensity, slideDensity, spread, scale, patternLength]);

    useEffect(() => {
        if (pattern.length === 0) return;

        const scaleNotes = SCALES[scale];
        setPattern(prev => prev.map(step => {
            if (!step.active) return step;

            // Find the closest note in the new scale
            let closestNote = scaleNotes[0];
            let minDiff = 999;

            for (const sn of scaleNotes) {
                const diff = Math.abs(step.note - sn);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestNote = sn;
                }
            }

            return { ...step, note: closestNote };
        }));
    }, [scale, root]);

    useEffect(() => {
        if (pattern.length === 0) generatePattern();
    }, [generatePattern]);

    const exportMidi = useCallback(() => {
        const PPQ = 480;
        const stepTicks = PPQ / 4;

        let trackData: number[] = [];
        let currentTime = 0;
        let lastEventTime = 0;

        paramsRef.current.pattern.slice(0, patternLength).forEach((step, i) => {
            if (step.active) {
                const midiNote = 36 + step.note + (step.octave * 12);
                const velocity = step.accent ? 127 : 90;
                const duration = stepTicks * (step.slide ? 1.25 : 0.8);

                // Delta time for Note On
                const deltaOn = currentTime - lastEventTime;
                trackData.push(...encodeVLQ(deltaOn));
                trackData.push(0x90, midiNote, velocity);
                lastEventTime = currentTime;

                // Delta time for Note Off
                const deltaOff = duration;
                trackData.push(...encodeVLQ(deltaOff));
                trackData.push(0x80, midiNote, 0);
                lastEventTime = currentTime + duration;
            }
            currentTime += stepTicks;
        });

        // End of track
        trackData.push(0x00, 0xFF, 0x2F, 0x00);

        const headerChunk = [
            0x4D, 0x54, 0x68, 0x64,
            0x00, 0x00, 0x00, 0x06,
            0x00, 0x00,
            0x00, 0x01,
            (PPQ >> 8) & 0xFF, PPQ & 0xFF
        ];

        const trackChunkHeader = [
            0x4D, 0x54, 0x72, 0x6B,
            (trackData.length >> 24) & 0xFF,
            (trackData.length >> 16) & 0xFF,
            (trackData.length >> 8) & 0xFF,
            trackData.length & 0xFF
        ];

        const midiFile = new Uint8Array([...headerChunk, ...trackChunkHeader, ...trackData]);
        const blob = new Blob([midiFile], { type: 'audio/midi' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `acid_pattern_${Date.now()}.mid`;
        a.click();
        URL.revokeObjectURL(url);
    }, [patternLength]);

    // Grid Construction
    const gridNotes = useMemo(() => {
        const scaleNotes = SCALES[scale];
        const notes: { midi: number, octave: number }[] = [];
        [1, 0, -1].forEach(oct => {
            scaleNotes.forEach(n => {
                notes.push({ midi: n, octave: oct });
            });
        });
        return notes;
    }, [scale]);

    // Compact mode - minimal controls
    if (compact) {
        return (
            <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4 select-none">
                {isLoading && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 border-4 border-[#fffa65] border-t-transparent rounded-full animate-spin"></div>
                            <div className="text-[#fffa65] text-[10px] uppercase tracking-[0.4em] font-black animate-pulse">
                                Initializing Synth...
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={async () => {
                            if (isPlaying) {
                                setIsPlaying(false);
                            } else {
                                setIsAudioReady(false);
                                const ready = await initAudio();
                                if (ready) {
                                    setIsPlaying(true);
                                }
                            }
                        }}
                        disabled={isLoading}
                        className={`px-6 py-2 rounded-sm font-black text-xs border transition-all relative overflow-hidden ${isLoading
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                            : isPlaying
                                ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-3 h-3 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
                                <span>LOADING...</span>
                            </div>
                        ) : (
                            isPlaying ? 'STOP' : 'PLAY'
                        )}
                    </button>

                    <Knob label="BPM" value={bpm} min={60} max={220} onChange={setBpm} size={40} />
                    <Knob label="CUTOFF" value={cutoff} min={0} max={127} onChange={setCutoff} size={40} />
                    <Knob label="RESO" value={resonance} min={0} max={127} onChange={setResonance} size={40} />
                    <Knob label="DRIVE" value={drive} min={0} max={100} onChange={setDrive} size={40} />

                    <div className="flex gap-1">
                        <select
                            value={root}
                            onChange={(e) => setRoot(parseInt(e.target.value))}
                            className="bg-black border border-zinc-800 text-[10px] p-2 text-zinc-400 rounded outline-none focus:border-zinc-500"
                        >
                            {NOTE_NAMES.map((name, i) => <option key={i} value={i}>{name}</option>)}
                        </select>
                        <select
                            value={scale}
                            onChange={(e) => setScale(e.target.value as any)}
                            className="bg-black border border-zinc-800 text-[10px] p-2 text-zinc-400 rounded outline-none focus:border-zinc-500"
                        >
                            {Object.keys(SCALES).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            generatePattern();
                            if (!isPlaying) {
                                setIsPlaying(true);
                            }
                        }}
                        className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-sm font-black text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                    >
                        GENERATE
                    </button>
                </div>
            </div>
        );
    }

    // Full mode - complete interface
    return (
        <div className="min-h-screen bg-[#050505] text-zinc-400 p-2 sm:p-4 lg:p-8 font-mono select-none overflow-x-hidden">
            <div className="max-w-[1400px] mx-auto space-y-6">

                {/* Visual Matrix Container */}
                <div className="border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl rounded-sm sm:rounded-md relative">

                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 border-4 border-[#fffa65] border-t-transparent rounded-full animate-spin"></div>
                                <div className="text-[#fffa65] text-[10px] uppercase tracking-[0.4em] font-black animate-pulse">
                                    Initializing Synth...
                                </div>
                                <div className="text-zinc-500 text-[9px] font-mono">
                                    Please wait while synth initializes
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Header Controls - All in One Panel */}
                    <div className="flex flex-col gap-4 p-4 border-b border-zinc-900 bg-black/40">
                        {/* Row 1: Transport & Main Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={async () => {
                                    if (isPlaying) {
                                        setIsPlaying(false);
                                    } else {
                                        setIsAudioReady(false);
                                        const ready = await initAudio();
                                        if (ready) {
                                            setIsPlaying(true);
                                        }
                                    }
                                }}
                                disabled={isLoading}
                                className={`flex-1 sm:flex-none sm:px-6 py-2 rounded-sm font-black text-xs border transition-all relative overflow-hidden ${isLoading
                                    ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                                    : isPlaying
                                        ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-3 h-3 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span>LOADING...</span>
                                    </div>
                                ) : (
                                    isPlaying ? 'STOP' : 'PLAY'
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    generatePattern();
                                    if (!isPlaying) {
                                        setIsPlaying(true);
                                    }
                                }}
                                className="flex-1 sm:flex-none sm:px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-sm font-black text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                            >
                                GENERATE
                            </button>
                            <button
                                onClick={exportMidi}
                                className="flex-1 sm:flex-none sm:px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-sm font-black text-xs text-zinc-400 hover:text-blue-400 hover:border-blue-900/50 transition-all"
                            >
                                Download MIDI
                            </button>
                        </div>

                        {/* Row 2: Synth Parameters Knobs */}
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex flex-wrap gap-2 items-center">
                                <Knob label="LENGTH" value={patternLength} min={1} max={64} onChange={setPatternLength} size={28} />
                                <div className="w-[1px] h-6 bg-zinc-800"></div>
                                <Knob label="CUTOFF" value={cutoff} min={0} max={127} onChange={setCutoff} size={28} />
                                <Knob label="RESO" value={resonance} min={0} max={127} onChange={setResonance} size={28} />
                                <Knob label="DRIVE" value={drive} min={0} max={100} onChange={setDrive} size={28} />
                                <Knob label="MOD" value={envMod} min={0} max={127} onChange={setEnvMod} size={28} />
                                <Knob label="DECAY" value={decay} min={0} max={127} onChange={setDecay} size={28} />
                                <Knob label="ACCENT" value={accent} min={0} max={127} onChange={setAccent} size={28} />
                            </div>
                            <div className="w-[1px] h-6 bg-zinc-800 hidden sm:block"></div>
                            <div className="flex flex-wrap gap-2 items-center">
                                <Knob label="BPM" value={bpm} min={60} max={220} onChange={setBpm} size={28} />
                                <Knob label="VOL" value={masterVolume} min={0} max={1} onChange={setMasterVolume} size={28} />
                            </div>
                        </div>

                        {/* Row 3: Pattern Generator Controls */}
                        <div className="flex flex-wrap gap-4 items-center pt-2 border-t border-zinc-800/50">
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-bold text-zinc-600 uppercase">Root</span>
                                <select
                                    value={root}
                                    onChange={(e) => setRoot(parseInt(e.target.value))}
                                    className="bg-black border border-zinc-800 text-[10px] p-2 text-zinc-400 rounded outline-none focus:border-zinc-500"
                                >
                                    {NOTE_NAMES.map((name, i) => <option key={i} value={i}>{name}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-bold text-zinc-600 uppercase">Scale</span>
                                <select
                                    value={scale}
                                    onChange={(e) => setScale(e.target.value as any)}
                                    className="bg-black border border-zinc-800 text-[10px] p-2 text-zinc-400 rounded outline-none focus:border-zinc-500 w-32"
                                >
                                    {Object.keys(SCALES).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="w-[1px] h-6 bg-zinc-800"></div>
                            <Knob label="DENSITY" value={noteDensity} min={0} max={100} onChange={setNoteDensity} />
                            <Knob label="ACCENT %" value={accentDensity} min={0} max={100} onChange={setAccentDensity} />
                            <Knob label="SLIDE %" value={slideDensity} min={0} max={100} onChange={setSlideDensity} />
                            <Knob label="SPREAD" value={spread} min={0} max={100} onChange={setSpread} />
                            <div className="w-[1px] h-6 bg-zinc-800"></div>
                            <button
                                onClick={() => setIsCreeper(!isCreeper)}
                                className={`px-4 py-1 text-[8px] font-bold uppercase border rounded-sm transition-all ${isCreeper ? 'bg-green-600 text-white border-green-400' : 'bg-black text-zinc-600 border-zinc-800'}`}
                            >
                                Creeper: {isCreeper ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    </div>

                    {/* PIANO ROLL GRID + LANES (Scrollable) */}
                    <div className="overflow-x-auto">
                        <div className="flex flex-col" style={{ minWidth: Math.max(900, patternLength * 60) }}>
                            <div className="flex h-[300px] sm:h-[400px] lg:h-[550px] relative">
                                {/* Left Side Labels (Notes) */}
                                <div className="w-14 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
                                    {gridNotes.map((n, i) => (
                                        <div key={i} className="flex-1 border-b border-zinc-800/50 bg-black/50 flex items-center justify-center">
                                            <span className="text-[8px] font-bold text-zinc-600">
                                                {getNoteName(n.midi + root)}{n.octave > 0 ? '+' : n.octave < 0 ? '-' : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Main Grid Area */}
                                <div
                                    className="flex-1 grid relative"
                                    style={{ gridTemplateColumns: `repeat(${patternLength}, minmax(0, 1fr))` }}
                                >
                                    {Array.from({ length: patternLength }).map((_, col) => (
                                        <div key={col} className={`relative border-r border-zinc-800/30 flex flex-col ${currentStep === col ? 'bg-white/5' : ''}`}>
                                            {gridNotes.map((note, row) => {
                                                const step = pattern[col];
                                                const isActive = step?.active && step.note === note.midi && step.octave === note.octave;
                                                return (
                                                    <div
                                                        key={row}
                                                        className={`flex-1 border-b border-zinc-800/30 relative flex items-center justify-center cursor-pointer hover:bg-white/5 ${isActive ? 'z-10 bg-[#588173] shadow-inner' : ''}`}
                                                        onClick={() => {
                                                            const p = [...pattern];
                                                            if (p[col].active && p[col].note === note.midi && p[col].octave === note.octave) {
                                                                p[col].active = false;
                                                            } else {
                                                                p[col].active = true;
                                                                p[col].note = note.midi;
                                                                p[col].octave = note.octave;
                                                            }
                                                            setPattern(p);
                                                        }}
                                                    >
                                                        {isActive && (
                                                            <span className="text-[10px] lg:text-[12px] font-black text-black/40 pointer-events-none uppercase">
                                                                {getNoteName(note.midi)}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* OSAN DATA LANES */}
                            <div className="flex flex-col border-t border-zinc-700">
                                {/* O: Octave */}
                                <div className="flex h-12 border-b border-zinc-800">
                                    <div className="w-14 border-r border-zinc-800 bg-zinc-900 flex items-center justify-center text-[12px] lg:text-[14px] font-black text-zinc-500">O</div>
                                    <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${patternLength}, minmax(0, 1fr))` }}>
                                        {pattern.slice(0, patternLength).map((step, i) => (
                                            <div
                                                key={i}
                                                className={`border-r border-zinc-800/30 flex items-center justify-center cursor-pointer transition-colors ${step.active && step.octave !== 0 ? '' : 'hover:bg-white/5'}`}
                                                onClick={() => {
                                                    const p = [...pattern];
                                                    p[i].octave = p[i].octave === 0 ? 1 : p[i].octave === 1 ? -1 : 0;
                                                    setPattern(p);
                                                }}
                                            >
                                                {step.active && step.octave === 1 && <span className="text-[12px] lg:text-[14px] font-black" style={{ color: THEME.laneO_Up }}>U</span>}
                                                {step.active && step.octave === -1 && <span className="text-[12px] lg:text-[14px] font-black" style={{ color: THEME.laneO_Down }}>D</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* S: Slide */}
                                <div className="flex h-12 border-b border-zinc-800">
                                    <div className="w-14 border-r border-zinc-800 bg-zinc-900 flex items-center justify-center text-[12px] lg:text-[14px] font-black text-zinc-500">S</div>
                                    <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${patternLength}, minmax(0, 1fr))` }}>
                                        {pattern.slice(0, patternLength).map((step, i) => (
                                            <div
                                                key={i}
                                                onClick={() => {
                                                    const p = [...pattern];
                                                    if (p[i].active) p[i].slide = !p[i].slide;
                                                    setPattern(p);
                                                }}
                                                className={`border-r border-zinc-800/30 flex items-center justify-center cursor-pointer ${step.active && step.slide ? '' : 'hover:bg-white/5'}`}
                                            >
                                                {step.active && step.slide && <div className="h-full w-full" style={{ backgroundColor: THEME.laneS }}></div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* A: Accent */}
                                <div className="flex h-12 border-b border-zinc-800">
                                    <div className="w-14 border-r border-zinc-800 bg-zinc-900 flex items-center justify-center text-[12px] lg:text-[14px] font-black text-zinc-500">A</div>
                                    <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${patternLength}, minmax(0, 1fr))` }}>
                                        {pattern.slice(0, patternLength).map((step, i) => (
                                            <div
                                                key={i}
                                                onClick={() => {
                                                    const p = [...pattern];
                                                    if (p[i].active) p[i].accent = !p[i].accent;
                                                    setPattern(p);
                                                }}
                                                className={`border-r border-zinc-800/30 flex items-center justify-center cursor-pointer ${step.active && step.accent ? '' : 'hover:bg-white/5'}`}
                                            >
                                                {step.active && step.accent && <div className="h-full w-full" style={{ backgroundColor: THEME.laneA }}></div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* N: Step Number / Note Name */}
                                <div className="flex h-12 bg-black/40">
                                    <div className="w-14 border-r border-zinc-800 bg-zinc-900 flex items-center justify-center text-[12px] lg:text-[14px] font-black text-zinc-500">N</div>
                                    <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${patternLength}, minmax(0, 1fr))` }}>
                                        {pattern.slice(0, patternLength).map((step, i) => (
                                            <div key={i} className={`border-r border-zinc-800/30 flex flex-col items-center justify-center text-[8px] font-bold ${currentStep === i ? 'text-white bg-white/10' : 'text-zinc-600'}`}>
                                                <span>{i + 1}</span>
                                                {step.active && (
                                                    <span className="text-[7px] text-zinc-400">
                                                        {getNoteName(step.note)}{step.octave !== 0 ? (step.octave > 0 ? '+1' : '-1') : ''}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="flex justify-between items-center text-[8px] text-zinc-800 font-bold uppercase tracking-[0.2em] pt-4">
                    <div>© 2026 ARPEGGIATOR LABS // ACID DIVISION</div>
                    <div className="hover:text-zinc-600 cursor-pointer">EXIT SEQUENCE_</div>
                </footer>
            </div>
        </div>
    );
};

export default AcidSynth;
