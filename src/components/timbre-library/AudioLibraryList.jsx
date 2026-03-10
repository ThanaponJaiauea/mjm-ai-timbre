"use client";

/** @format */

import React, { useState, useRef, useEffect } from "react";
import { icon_controlPlay, icon_stop } from "../../../public/index";
import Image from "next/image";

function WavRow({
  item,
  instrument,
  onSelect,
  isSelected,
  isPlaying,
  onTogglePlay,
}) {
  const [duration, setDuration] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
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

  // ✅ Parent สั่ง play/pause จาก isPlaying prop
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

  const badgeStyle = isSelected
    ? {
        background:
          "linear-gradient(black, black) padding-box, linear-gradient(to right, #E759FF, #6174FF) border-box",
        borderRadius: "4px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }
    : {
        background: "#0f0f0f",
        border: "1px solid #374151",
        borderRadius: "4px",
      };

  const textStyle = isSelected
    ? {
        backgroundImage: "linear-gradient(to right, #E759FF, #6174FF)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent",
      }
    : { color: "#9ca3af" };

  return (
    <div
      onClick={() => {
        onSelect();
        onTogglePlay(item.id);
      }}
      className={`cursor-pointer flex items-center justify-between p-3 hover:bg-[#252525] rounded-lg transition-all group ${isSelected ? "bg-[#292B2C]" : ""}`}
    >
      <audio ref={audioRef} src={item.wav_file_url} preload="metadata" />

      {/* Left: Image + Play + Title */}
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

        <div className="flex flex-col">
          <h3 className="text-white text-sm font-medium leading-tight">
            {item.MusicStyle?.title}.WAV
          </h3>
        </div>
      </div>

      {/* Badges */}
      <div className="hidden md:flex items-center gap-2">
        <span className="px-2 py-1 text-[10px] font-bold" style={badgeStyle}>
          <span style={textStyle}>{instrument}</span>
        </span>
        <span className="px-2 py-1 text-[10px] font-bold" style={badgeStyle}>
          <span style={textStyle}>{item.MusicStyle?.title}</span>
        </span>
        <span className="px-2 py-1 text-[10px] font-bold" style={badgeStyle}>
          <span style={textStyle}>#{item.musical_key}</span>
        </span>
        <span className="px-2 py-1 text-[10px] font-bold" style={badgeStyle}>
          <span style={textStyle}>{item.bpm}</span>
        </span>
      </div>

      {/* Time & Menu */}
      <div className="flex items-center gap-6">
        <span className="text-gray-500 text-xs tabular-nums w-8 text-right">
          {displayTime}
        </span>
        <button className="text-gray-400 hover:text-white text-xl">•••</button>
      </div>
    </div>
  );
}

export default function AudioLibraryList({ data, limit }) {
  const musicList = data?.data || [];
  const displayList = limit ? musicList.slice(0, limit) : musicList;
  const [selectedId, setSelectedId] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  const handleTogglePlay = (id) => {
    setPlayingId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-2 w-full p-4">
      {displayList.map((item) => (
        <WavRow
          key={item.id}
          item={item}
          instrument={data.instrument}
          isSelected={selectedId === item.id}
          isPlaying={playingId === item.id}
          onSelect={() => setSelectedId(item.id)}
          onTogglePlay={handleTogglePlay}
        />
      ))}
    </div>
  );
}
