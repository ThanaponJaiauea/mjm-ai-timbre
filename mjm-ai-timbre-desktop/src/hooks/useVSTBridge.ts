"use client";

import { useEffect, useRef, useState } from 'react';

// Type definition for the JUCE backend object injection
interface JuceBackend {
    send: (type: string, payload: any) => void;
}

declare global {
    interface Window {
        __JUCE_BACKEND__?: JuceBackend;
    }
}

export const useVSTBridge = () => {
    const [isVST, setIsVST] = useState(false);

    useEffect(() => {
        // Check if we are running inside the JUCE VST environment
        if (typeof window !== 'undefined' && window.__JUCE_BACKEND__) {
            setIsVST(true);
            console.log("VST Environment Detected: Bridge Active");
        }
    }, []);

    const sendVSTMidi = (status: number, note: number, velocity: number) => {
        if (typeof window !== 'undefined' && window.__JUCE_BACKEND__) {
            // Send a generic message to C++. 
            // The C++ side must implement the logic to interpret this JSON.
            // Expected C++ handler: void javascriptMessageReceived (const var& message)
            window.__JUCE_BACKEND__.send("MIDI", {
                status: status, // 144 = NoteOn, 128 = NoteOff
                note: note,
                velocity: velocity
            });
        }
    };

    return { isVST, sendVSTMidi };
};
