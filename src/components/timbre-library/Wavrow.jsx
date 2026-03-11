"use client";

/** @format */

import { useState, useRef, useEffect } from "react";
import { icon_controlPlay, icon_stop } from "../../../public/index";
import Image from "next/image";

export default function WavRow({
  menuIcons,
  item,
  instrument,
  onSelect,
  isSelected,
  isPlaying,
  onTogglePlay,
  isMenuOpen,
  onToggleMenu,
  onDelete,
  onDurationLoaded,
  badgeStyle,
  textStyle,
  menuItems,
}) {
  const [duration, setDuration] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      onDurationLoaded?.(item.id, audio.duration);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setCurrentTime(0);
      onTogglePlay(null);
    };
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
      setCurrentTime(0);
    }
  }, [isPlaying]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const displayTime = isPlaying
    ? formatTime(currentTime)
    : formatTime(duration);

  return (
    <div
      onClick={() => {
        onSelect();
        onTogglePlay(item.id);
      }}
      className={`cursor-pointer flex items-center justify-between p-3 hover:bg-[#252525] rounded-lg transition-all group ${isSelected ? "bg-[#292B2C]" : ""}`}
    >
      <audio ref={audioRef} src={item.wav_file_url} preload="metadata" />

      {/* left */}
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 flex-shrink-0">
          <img
            src={item.MusicStyle?.image}
            alt={item.MusicStyle?.title}
            className="w-full h-full object-cover rounded-md opacity-80"
          />
          <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
            <Image
              src={isPlaying ? icon_stop : icon_controlPlay}
              alt={isPlaying ? "stop" : "play"}
              width={20}
              height={20}
            />
          </button>
        </div>
        <h3 className="text-white text-sm font-medium leading-tight">
          {item.MusicStyle?.title}.WAV
        </h3>
      </div>

      {/* center */}
      <div className="hidden md:flex items-center gap-2">
        {[
          instrument,
          item.MusicStyle?.title,
          `#${item.musical_key}`,
          item.bpm,
        ].map((val, i) => (
          <span
            key={i}
            className="px-2 py-1 text-[10px] font-bold"
            style={badgeStyle}
          >
            <span style={textStyle}>{val}</span>
          </span>
        ))}
      </div>

      {/* right */}
      <div className="flex items-center gap-6 relative">
        <span className="text-gray-500 text-xs tabular-nums w-8 text-right">
          {displayTime}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
          className="text-gray-400 hover:text-white text-xl cursor-pointer"
        >
          •••
        </button>
        {isMenuOpen && (
          <div className="absolute w-[200px] right-0 top-full mt-2 bg-[#1A1A1A] border border-[#374151] rounded-xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95">
            {menuItems?.map((el, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (el.title === "Move To Trash") onDelete?.(item.id);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#292B2C] rounded-lg cursor-pointer"
              >
                <Image
                  alt="icon"
                  src={menuIcons[el.title]}
                  width={24}
                  height={24}
                />
                {el?.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
