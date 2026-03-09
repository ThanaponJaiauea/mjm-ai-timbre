// Re-export components for easier imports
export { default as Arpeggiator } from './Arpeggiator';
export { default as AcidSynth } from './AcidSynth';

// Re-export types
export type {
    ArpSettings, Waveform, Pattern, PlaybackState, TimeDivision,
    MusicalKey, Scale, TimbreCategory, TimbreType, ArpState, TimbrePreset, SavedMidi
} from './Arpeggiator';
export type { AcidSynthProps, Step } from './AcidSynth';
