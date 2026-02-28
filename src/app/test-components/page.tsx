"use client";

import React, { useState } from 'react';
import Arpeggiator from '@/components/instruments/Arpeggiator';
import AcidSynth from '@/components/instruments/AcidSynth';

export default function TestPage() {
    const [activeTab, setActiveTab] = useState<'arp' | 'acid'>('arp');

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-wider">COMPONENT TEST PAGE</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('arp')}
                            className={`px-6 py-2 rounded font-bold text-sm transition-all ${
                                activeTab === 'arp'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }`}
                        >
                            ARPEGGIATOR
                        </button>
                        <button
                            onClick={() => setActiveTab('acid')}
                            className={`px-6 py-2 rounded font-bold text-sm transition-all ${
                                activeTab === 'acid'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }`}
                        >
                            ACID SYNTH
                        </button>
                    </div>
                </div>

                {/* Arpeggiator Section */}
                {activeTab === 'arp' && (
                    <div className="space-y-6">
                        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-zinc-800">
                            <h2 className="text-xl font-bold mb-4 text-green-400">Full Version</h2>
                            <Arpeggiator />
                        </div>
                        
                        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-zinc-800">
                            <h2 className="text-xl font-bold mb-4 text-green-400">Compact Version</h2>
                            <Arpeggiator compact />
                        </div>
                    </div>
                )}

                {/* Acid Synth Section */}
                {activeTab === 'acid' && (
                    <div className="space-y-6">
                        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-zinc-800">
                            <h2 className="text-xl font-bold mb-4 text-yellow-400">Full Version</h2>
                            <AcidSynth />
                        </div>
                        
                        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-zinc-800">
                            <h2 className="text-xl font-bold mb-4 text-yellow-400">Compact Version</h2>
                            <AcidSynth compact />
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-zinc-800">
                    <h3 className="text-lg font-bold mb-2">Import Statement:</h3>
                    <code className="block bg-black p-4 rounded text-green-400 text-sm font-mono">
                        {`import Arpeggiator from '@/components/instruments/Arpeggiator';
import AcidSynth from '@/components/instruments/AcidSynth';`}
                    </code>
                    
                    <h3 className="text-lg font-bold mt-4 mb-2">Usage:</h3>
                    <code className="block bg-black p-4 rounded text-green-400 text-sm font-mono">
                        {`<Arpeggiator />
<Arpeggiator compact />
<AcidSynth />
<AcidSynth compact />`}
                    </code>
                </div>
            </div>
        </div>
    );
}
