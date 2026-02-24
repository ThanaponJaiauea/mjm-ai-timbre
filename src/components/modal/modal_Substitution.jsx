import { Play, X } from "lucide-react";

export default function ModalSubstitution({
  currentRomanNumerals,
  selectedIndex,
  setIsModalOpen,
  currentSubs,
  selectNewChord,
  playSingleChord,
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-[#1a1c23] border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111827]">
          <div>
            <h3 className="text-xl font-bold text-white">Select Substitution</h3>
            <p className="text-sm text-gray-400 font-mono">Degree: {currentRomanNumerals[selectedIndex]}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
          {currentSubs.map((sub, idx) => (
            <button
              key={idx}
              onClick={() => selectNewChord(sub.chord)}
              onMouseEnter={() => playSingleChord(sub.chord)}
              className="flex items-center justify-between p-4 rounded-xl bg-[#262730] hover:bg-green-900/30 border border-transparent hover:border-green-500/50 transition-all group text-left"
            >
              <div>
                <span className="text-2xl font-black text-green-500 group-hover:text-green-400">{sub.chord}</span>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{sub.vibe || "Variation"}</p>
              </div>
              <div className="bg-gray-800 p-2 rounded-full group-hover:bg-green-500/20 transition-colors">
                <Play size={14} className="text-gray-500 group-hover:text-green-400" fill="currentColor" />
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 bg-[#111827] text-center border-t border-gray-800">
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
