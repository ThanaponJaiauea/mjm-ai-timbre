"use client";

import React, { useState, useEffect } from "react";
import AudioLibraryList from "./AudioLibraryList";

export default function LibraryListView({
  title,
  data,
  onBack,
  styleAllData,
  isSearching,
  onStyleSelect,
  onLoadMore,
  hasMore,
  isLoadingMore,
  onLoadPrev,
  hasPrev,
  currentPage,
  onPlay, // NEW
  currentTrack, // NEW
}) {
  const [selectedStyle, setSelectedStyle] = useState("");
  const styles = styleAllData?.items || [];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col gap-6 mt-10">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            onBack();
            setSelectedStyle("");
          }}
          className="p-2 hover:bg-white/10 rounded-full transition cursor-pointer text-white"
        >
          ← Back
        </button>
        <h2 className="text-[28px] font-bold text-white">
          {title === "ARP" || title === "BASS" ? `${title} Synth` : title}
        </h2>
      </div>

      {(title === "ARP" || title === "BASS") && styles.length > 0 && (
        <div className="flex flex-wrap gap-3 py-4">
          {styles.map((style, index) => {
            const isActive = selectedStyle === style;
            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  const next = selectedStyle === style ? "" : style;
                  setSelectedStyle(next);
                  onStyleSelect(next);
                }}
                className={`cursor-pointer px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border
                  ${
                    isActive
                      ? "bg-transparent border-[#E759FF] text-[#E759FF] shadow-[0_0_10px_rgba(231,89,255,0.3)]"
                      : "bg-[#1A1A1A] border-[#2A2A2A] text-[#8F8F8F] hover:bg-[#252525] hover:text-white"
                  }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      )}

      {/* Music List */}
      <div className="mt-4">
        {isSearching ? (
          <div className="text-gray-500 text-center py-10">Searching...</div>
        ) : !data || !data.data ? (
          <div className="text-gray-500 text-center py-10">
            No data available
          </div>
        ) : data.data.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            No results found
          </div>
        ) : (
          <AudioLibraryList
            data={data}
            showTrash={title === "My Timble"}
            onLoadMore={onLoadMore}
            onLoadPrev={onLoadPrev}
            hasMore={hasMore}
            hasPrev={hasPrev}
            isLoadingMore={isLoadingMore}
            currentPage={currentPage}
            onPlay={onPlay}
            currentTrack={currentTrack}
          />
        )}
      </div>
    </div>
  );
}
