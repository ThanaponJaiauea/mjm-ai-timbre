"use client";

import { useState } from "react";
import { MjmAiTab } from "./components/mjm-ai-tab";
import { MjmPadTab } from "./components/mjm-pad-tab";

export default function DownloadAppPage() {
  const [activeTab, setActiveTab] = useState("mjm-pad");

  return (
    <div
      className="flex flex-col justify-center items-center min-h-[calc(100vh-60px)] w-full
    text-white bg-linear-to-br from-[#121212] via-[#1e1e1e] to-[#252525] p-4 sm:p-6 relative overflow-hidden overflow-y-auto"
    >
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-6xl w-full text-center space-y-8 sm:space-y-12 relative z-10 py-6 sm:py-10 animate-in slide-in-from-bottom-8 duration-700 fade-in">
        <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">DOWNLOAD APP</h1>
          <p className="text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed">
            Download MJM and unlock instant AI-powered sound creation, transforming your ideas into original music
            anytime, anywhere.
          </p>
        </div>
      </div>
      <div className="relative w-full flex flex-col items-center z-10 px-2 sm:px-0">
        <div className="flex justify-center w-full mb-8">
          <div className="relative flex h-11 items-center justify-center rounded-full bg-zinc-800/80 p-1 text-zinc-400">
            <div
              className={`absolute top-1 bottom-1 w-30 rounded-full bg-zinc-950 shadow-sm transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                activeTab === "mjm-ai" ? "left-1" : "left-31"
              }`}
            />
            <button
              onClick={() => setActiveTab("mjm-ai")}
              className={`relative z-10 inline-flex w-30 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 active:scale-95 ${
                activeTab === "mjm-ai" ? "text-white" : "hover:text-white"
              }`}
            >
              MJM AI
            </button>
            <button
              onClick={() => setActiveTab("mjm-pad")}
              className={`relative z-10 inline-flex w-30 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 active:scale-95 ${
                activeTab === "mjm-pad" ? "text-white" : "hover:text-white"
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
