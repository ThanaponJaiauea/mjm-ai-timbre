/** @format */
"use client";

import { Play, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function ChordRecommend() {
  const [recommendedChords, setRecommendedChords] = useState(["Cmaj7", "Am7", "Dm7", "G7"]);

  return (
    <div className="w-4/5 m-auto flex flex-col gap-10 mt-20">
      {/* Chords Display */}
      <section className="space-y-6 mb-20">
        <div className="bg-[#1e1e1e] p-6 rounded-xl border-l-4 border-green-500 animate-in fade-in slide-in-from-right duration-500 relative overflow-hidden">
          <div className="flex flex-wrap gap-3 mb-6">
            {recommendedChords?.map((chord, idx) => (
              <div
                key={idx}
                className="relative group bg-[#1a1c23] border-2 transition-all duration-300 p-5 rounded-2xl w-32 flex flex-col items-center gap-2 border-gray-800 hover:border-green-900/50
               "
              >
                <span className={`text-3xl font-black cursor-pointer `}>{chord}</span>
                <span className="text-[10px] text-gray-500 font-mono uppercase">s</span>

                {idx !== 0 && (
                  <button className="cursor-pointer absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-green-400 p-1">
                    <RefreshCw size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-md font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50">
            <Play size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
