"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the AcidSynth component with SSR disabled
// This solves the hydration mismatch by ensuring the component only renders on the client.
const AcidSynth = dynamic(() => import('./AcidSynth'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#fffa65] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-[#fffa65] text-[10px] uppercase tracking-[0.4em] font-black animate-pulse">
                    Synchronizing Acid Core...
                </div>
            </div>
        </div>
    )
});

export default function AcidPage() {
    return <AcidSynth />;
}
