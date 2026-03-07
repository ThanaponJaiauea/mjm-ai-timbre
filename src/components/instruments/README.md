# Music Synth Components

Reusable components for Arpeggiator and TB-303 - คัดลอกฟังก์ชันเต็มจากหน้า `/arp` และ `/acid`

## Components

### Arpeggiator
Component สำหรับสร้าง Arpeggio จากคอร์ด - มีฟังก์ชันเต็มเหมือนหน้า `/arp`
- Web Audio API scheduler
- Virtual keyboard
- 16-step sequencer
- 10 genre presets (TRANCE, TECHNO, HOUSE, etc.)
- MIDI export

### AcidSynth
Component สำหรับสร้างเสียงเบสสไตล์ Acid Techno (TB-303 style) - มีฟังก์ชันเต็มเหมือนหน้า `/acid`
- Tone.js synth engine
- Piano roll grid
- O.S.A.N. lanes (Octave, Slide, Accent, Note)
- 16 scales
- Creeper evolution
- MIDI export

---

## วิธีใช้งาน

### 1. Import Components

```tsx
import { Arpeggiator, AcidSynth } from '@/components/instruments';
// หรือ
import Arpeggiator from '@/components/instruments/Arpeggiator';
import AcidSynth from '@/components/instruments/AcidSynth';
```

### 2. ใช้งานแบบ Full Version

```tsx
export default function MyPage() {
    return (
        <div>
            <Arpeggiator />
            <AcidSynth />
        </div>
    );
}
```

### 3. ใช้งานแบบ Compact Mode

```tsx
export default function Dashboard() {
    return (
        <div className="space-y-4">
            <Arpeggiator compact />
            <AcidSynth compact />
        </div>
    );
}
```

### 4. ใช้งานพร้อม Props

#### Arpeggiator Props:
```tsx
<Arpeggiator
    settings={{
        bpm: 140,
        waveform: 'sawtooth',
        pattern: 'UpDown',
        // ... ดู ArpSettings type
    }}
    onSettingsChange={(settings) => console.log(settings)}
    compact={false}
/>
```

#### AcidSynth Props:
```tsx
<AcidSynth
    initialBpm={140}
    initialScale="Minor"
    initialRoot={0}  // 0 = C
    patternLength={16}
    compact={false}
    onPatternChange={(pattern) => console.log(pattern)}
/>
```

### 5. ตัวอย่างการใช้งานจริง

```tsx
"use client";

import { Arpeggiator, AcidSynth } from '@/components';
import { useState } from 'react';

export default function MusicStudio() {
    const [arpSettings, setArpSettings] = useState(null);
    const [acidPattern, setAcidPattern] = useState(null);

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold">Music Studio</h1>
            
            {/* Arpeggiator Section */}
            <section>
                <h2 className="text-xl mb-4">Arpeggiator</h2>
                <Arpeggiator
                    onSettingsChange={setArpSettings}
                />
            </section>

            {/* TB-303 Section */}
            <section>
                <h2 className="text-xl mb-4">TB-303</h2>
                <AcidSynth
                    initialBpm={140}
                    initialScale="Minor"
                    onPatternChange={setAcidPattern}
                />
            </section>

            {/* Debug/Info */}
            <section className="text-sm text-zinc-500">
                <h3 className="font-bold mb-2">Current Settings:</h3>
                <pre>
                    Arp: {JSON.stringify(arpSettings, null, 2)}
                    Acid Pattern: {acidPattern?.length || 0} steps
                </pre>
            </section>
        </div>
    );
}
```

### 6. ใช้งานใน Modal/Overlay

```tsx
import { Arpeggiator } from '@/components';

export default function Modal() {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-[#0a0a0a] p-6 rounded-lg max-w-4xl">
                <Arpeggiator compact />
            </div>
        </div>
    );
}
```

---

## Types

### ArpSettings
```typescript
interface ArpSettings {
    waveform: 'sine' | 'square' | 'sawtooth' | 'triangle';
    bpm: number;
    timeDivision: '1/4' | '1/8' | '1/16' | '1/32';
    pattern: 'Up' | 'Down' | 'UpDown' | 'Random';
    octaveRange: number;
    gateLength: number;
    velocity: number;
    rootNote: number;
    chordType: 'Single' | 'Major' | 'Minor' | '7th' | '9th';
    masterVolume: number;
    heldRoots: number[];
    sortNotes: boolean;
    sequencerSteps: boolean[];
}
```

### AcidSynthProps
```typescript
interface AcidSynthProps {
    initialBpm?: number;
    initialScale?: 'Minor' | 'Major' | 'Dorian' | ...;
    initialRoot?: number;  // 0-11 (C-B)
    patternLength?: number;
    compact?: boolean;
    onPatternChange?: (pattern: Step[]) => void;
}
```

---

## หมายเหตุ

- ทั้งสอง component ใช้ `use client` directive ต้องใช้งานใน Client Components
- AcidSynth ใช้ Tone.js ต้องเรียก `Tone.start()` ก่อนใช้งาน (component จัดการให้อัตโนมัติ)
- CSS ต้อง import ไฟล์ arp.css และ acid.css ในโปรเจกต์
