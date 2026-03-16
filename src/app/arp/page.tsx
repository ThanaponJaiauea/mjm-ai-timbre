"use client";

import React from 'react';
import Arpeggiator from '@/components/instruments/Arpeggiator';

export default function ArpeggiatorPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-8 font-sans select-none text-[#ededed]">
            <Arpeggiator />
        </div>
    );
}
