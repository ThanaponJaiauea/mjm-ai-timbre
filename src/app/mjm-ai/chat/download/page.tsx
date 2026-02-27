"use client";

import { useState } from "react";
import { MjmAiTab } from "./components/mjm-ai-tab";
import { MjmPadTab } from "./components/mjm-pad-tab";

export default function DownloadAppPage() {
  const [activeTab, setActiveTab] = useState("mjm-pad");

  return (
    <div
      className="flex flex-col justify-center items-center min-h-[calc(100vh-60px)] w-full
    text-white bg-linear-to-br from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A] p-4 sm:p-6 relative overflow-hidden overflow-y-auto"
    >
      <div className="fixed top-[20%] left-[-10%] w-[20%] h-[30%] bg-linear-to-br from-[#181A1EEE] via-[#E759FF] to-[#6174FFF3] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[20%] right-[-10%] w-[20%] h-[30%] bg-linear-to-br from-[#181A1EEE] via-[#E759FF] to-[#6174FFF3] rounded-full blur-[140px] pointer-events-none" />
      <div className="max-w-6xl w-full text-center space-y-8 sm:space-y-12 relative z-10 py-6 sm:py-10 animate-in slide-in-from-bottom-8 duration-700 fade-in">
        <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">DOWNLOAD APP</h1>
          <p className=" text-white max-w-2xl mx-auto leading-relaxed">
            Download MJM and Unlock instant AI-powered Sound Creation, Transforming <br />
            Your ideas into Original Music Anytime, Anywhere.
          </p>
        </div>
      </div>
      <div className="relative w-full flex flex-col items-center z-10 px-2 sm:px-0">
        <div className="flex justify-center w-full">
          {/* Container matches the visual width of the header text above (approx max-w-105) */}
          <div className="relative flex w-full max-w-105 items-center justify-between rounded-full bg-zinc-900/90 p-1 text-zinc-400 border border-zinc-800">
            {/* Active Indicator Background */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-0.70rem)] rounded-full bg-zinc-700/80 shadow-sm transition-all duration-300 ease-in-out ${
                activeTab === "mjm-ai" ? "translate-x-0 left-2" : "translate-x-[calc(100%+0.5rem)] left-2"
              }`}
            />

            <button
              onClick={() => setActiveTab("mjm-ai")}
              className={`relative z-10 flex-1 flex items-center justify-center whitespace-nowrap rounded-full py-2.5 text-lg font-medium transition-all duration-300 ${
                activeTab === "mjm-ai" ? "text-white scale-95" : "hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              MJM AI
            </button>
            <button
              onClick={() => setActiveTab("mjm-pad")}
              className={`relative z-10 flex-1 flex items-center justify-center whitespace-nowrap rounded-full py-2.5 text-lg font-medium transition-all duration-300 ${
                activeTab === "mjm-pad" ? "text-white scale-95" : "hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              MJM Pad
            </button>
          </div>
        </div>
        <div
          key={activeTab}
          className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-700 ease-out"
        >
          {activeTab === "mjm-ai" && <MjmAiTab />}
          {activeTab === "mjm-pad" && <MjmPadTab />}
        </div>
      </div>
    </div>
  );
}
