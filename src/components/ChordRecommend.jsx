/** @format */
"use client";

import { Play, RefreshCw, Loader2, Music4 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { recommend_chords, change_chords, generate_settings } from "../api/music";
import * as Tone from "tone";
import { Chord } from "@tonaljs/tonal";
import ModalSubstitution from "@/components/modal/modal_Substitution";

export default function ChordRecommend({ initialData, setArp, selectStyle }) {
  const [recommendedChords, setRecommendedChords] = useState([]);
  const [recommendedKey, setRecommendedKey] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [currentRomanNumerals, setCurrentRomanNumerals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [activeChordIndex, setActiveChordIndex] = useState(null);

  // state สำหรับ modal substitution
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubs, setCurrentSubs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const samplerRef = useRef(null);

  // --- 1. Setup เสียง ---
  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => setIsAudioReady(true),
    }).toDestination();

    const reverb = new Tone.Reverb({ decay: 3, wet: 0.3 }).toDestination();
    sampler.connect(reverb);
    samplerRef.current = sampler;

    return () => {
      sampler.dispose();
      reverb.dispose();
    };
  }, []);

  const playSingleChord = chordName => {
    if (!isAudioReady || !samplerRef.current) return;
    const chordData = Chord.get(chordName);
    if (!chordData.empty) {
      const notes = chordData.notes.map(n => n + "4");
      samplerRef.current.triggerAttackRelease(notes, "2n");
    }
  };

  const playChords = async () => {
    if (!isAudioReady || !samplerRef.current) return;
    await Tone.start();
    const now = Tone.now();
    const interval = 1.5;

    recommendedChords.forEach((chordName, i) => {
      const chordData = Chord.get(chordName);
      if (!chordData.empty) {
        const notes = chordData.notes.map(n => n + "4");
        samplerRef.current.triggerAttackRelease(notes, "2n", now + i * interval);
        setTimeout(() => setActiveChordIndex(i), i * interval * 1000);
      }
    });
    setTimeout(() => setActiveChordIndex(null), recommendedChords.length * interval * 1000);
  };

  const handleRecommend = async queryData => {
    setLoading(true);
    try {
      const response = await recommend_chords({ data: queryData });
      const { chords, roman_numerals } = response.data;

      console.log("response", response.data);

      const chordArray = typeof chords === "string" ? chords.split(",").map(c => c.trim()) : chords;
      const romanArray =
        typeof roman_numerals === "string" ? roman_numerals.split(",").map(r => r.trim()) : roman_numerals;

      const romanOrder = {
        I: 1,
        i: 1,
        ii: 2,
        II: 2,
        bII: 2.5,
        iii: 3,
        III: 3,
        IV: 4,
        iv: 4,
        V: 5,
        v: 5,
        vi: 6,
        VI: 6,
        vii: 7,
        VII: 7,
        "vii°": 7,
      };

      const combined = chordArray.map((chord, index) => ({
        chord: chord,
        roman: romanArray[index] || "?",
        weight: romanOrder[romanArray[index]] || 99,
      }));

      combined.sort((a, b) => a.weight - b.weight);
      setRecommendedKey(response.data.key);
      setSelectedMood(response.data.mood);
      setRecommendedChords(combined.map(item => item.chord));
      setCurrentRomanNumerals(combined.map(item => item.roman));
    } catch (error) {
      console.error("Error fetching chords:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSingleChord = async index => {
    const currentDegree = currentRomanNumerals[index];
    const targetKey = recommendedKey;

    setSelectedIndex(index);

    try {
      const res = await change_chords({
        degree: currentDegree,
        target_key: targetKey,
      });

      if (res.data.results && res.data.results.length > 0) {
        setCurrentSubs(res.data.results[0].substitutions);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching substitutions:", err);
    }
  };

  const selectNewChord = newChordName => {
    const updatedChords = [...recommendedChords];
    updatedChords[selectedIndex] = newChordName;
    setRecommendedChords(updatedChords);
    setIsModalOpen(false);
    playSingleChord(newChordName);
  };

  useEffect(() => {
    if (initialData && !recommendedChords.length) {
      handleRecommend(initialData);
    }
  }, [initialData]);

  const handleGenerate = async () => {
    if (recommendedChords.length === 0) return;

    setLoading(true);
    try {
      const payload = {
        chords: recommendedChords,
        mood: selectedMood,
        style: selectStyle,
      };

      const response = await generate_settings(payload);
      setArp(response.data);
    } catch (error) {
      console.error("Error generating synth settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      {loading && (
        <div className="bg-[#1e1e1e] p-6 rounded-xl border-l-4 border-gray-600 animate-pulse">
          <div className="flex items-center gap-2 mb-4 text-gray-500">
            <Loader2 className="animate-spin" size={18} />
            <span className="text-sm font-mono">AI กำลังเลือกคอร์ดที่เหมาะสมที่สุด...</span>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="bg-[#1a1c23] border-2 border-gray-800 p-5 rounded-2xl w-32 h-24 flex flex-col items-center justify-center gap-2"
              >
                <div className="h-8 w-12 bg-gray-800 rounded"></div>
                <div className="h-3 w-8 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
          <div className="h-10 w-40 bg-gray-800 rounded-md"></div>
        </div>
      )}

      {!loading && recommendedChords.length > 0 && (
        <div className="bg-[#1e1e1e] p-6 rounded-xl border-l-4 border-green-500 relative overflow-hidden">
          <div className="text-xs text-gray-400 mb-4 flex items-center gap-2 font-mono">
            <Music4 size={14} /> AI RECOMMENDED PROGRESSION
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {recommendedChords.map((chord, idx) => (
              <div
                key={idx}
                className={`relative group bg-[#1a1c23] border-2 transition-all duration-300 p-5 rounded-2xl w-32 flex flex-col items-center gap-2 ${
                  activeChordIndex === idx
                    ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-105"
                    : "border-gray-800 hover:border-green-900/50"
                }`}
              >
                <span
                  onClick={() => playSingleChord(chord)}
                  className={`text-3xl font-black cursor-pointer transition-colors ${
                    activeChordIndex === idx ? "text-green-400" : "text-green-500 hover:text-green-400"
                  }`}
                >
                  {chord}
                </span>
                <span className="text-[10px] text-gray-500 font-mono uppercase">{currentRomanNumerals[idx]}</span>

                {idx !== 0 && (
                  <button
                    onClick={() => handleChangeSingleChord(idx)}
                    className="cursor-pointer absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-green-400 p-1"
                  >
                    <RefreshCw size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={playChords}
              disabled={activeChordIndex !== null || !isAudioReady}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!isAudioReady ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Play size={16} fill={activeChordIndex !== null ? "transparent" : "white"} />
              )}
              {!isAudioReady ? "LOADING AUDIO..." : activeChordIndex !== null ? "PLAYING..." : "PLAY SEQUENCE"}
            </button>

            <button
              onClick={handleGenerate}
              disabled={recommendedChords.length === 0 || loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-md font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              {loading ? "GENERATING..." : "GENERATE NEW PROGRESSION"}
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <ModalSubstitution
          currentRomanNumerals={currentRomanNumerals}
          selectedIndex={selectedIndex}
          setIsModalOpen={setIsModalOpen}
          currentSubs={currentSubs}
          selectNewChord={selectNewChord}
          playSingleChord={playSingleChord}
        />
      )}
    </div>
  );
}
