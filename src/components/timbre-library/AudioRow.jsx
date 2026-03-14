"use client";

import { useState, useRef, useEffect } from "react";
import { icon_controlPlay, icon_stop } from "../../../public/index";
import Image from "next/image";

export default function AudioRow({
  item,
  type = "wav",
  instrument,
  onSelect,
  isSelected,
  isPlaying,
  onTogglePlay,
  isMenuOpen,
  onToggleMenu,
  onDelete,
  onDurationLoaded,
  displayTime,
  badgeStyle,
  textStyle,
  menuItems,
  menuIcons,
}) {
  const [midiMenuOpen, setMidiMenuOpen] = useState(false);

  const isWav = type === "wav";
  const menuOpen = isWav ? isMenuOpen : midiMenuOpen;

  // ── duration: ใช้ hidden audio element เพื่อดึง duration เท่านั้น ──
  // ไม่ได้ใช้เล่นเสียง (AudioPlayerBar จัดการแทน)
  const durationAudioRef = useRef(null);
  useEffect(() => {
    if (!isWav || !item.wav_file_url) return;
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = item.wav_file_url;
    audio.addEventListener("loadedmetadata", () => {
      onDurationLoaded?.(item.id, audio.duration);
    });
    durationAudioRef.current = audio;
    return () => {
      audio.src = "";
    };
  }, [item.wav_file_url]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  // แสดงเวลา: ถ้า wav ให้แสดงแค่ duration (เวลาเล่นจริงอยู่ที่ PlayerBar)
  const shownTime = isWav ? displayTime : displayTime;

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    if (isWav) onToggleMenu?.();
    else setMidiMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    if (isWav) onToggleMenu?.();
    else setMidiMenuOpen(false);
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleMenuItemClick = async (e, el) => {
    e.stopPropagation();

    const url = isWav ? item.wav_file_url : item.midi_file_url;
    const ext = isWav ? "wav" : "midi";
    const filename = `${item.MusicStyle?.title ?? "audio"}.${ext}`;

    if (el.title === "Download") await handleDownload(url, filename);

    if (el.title === "Share") {
      const shareUrl = isWav ? item.wav_file_url : item.midi_file_url;
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch (err) {
        console.error("Copy failed:", err);
      }
      try {
        if (navigator.share) {
          await navigator.share({ title: filename, url: shareUrl });
        }
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    }

    if (el.title === "Move To Trash") onDelete?.(item.id);
    handleMenuClose();
  };

  return (
    <div
      onClick={() => {
        onSelect();
        // WAV เท่านั้นที่ trigger player bar
        if (isWav) onTogglePlay?.(item.id);
      }}
      className={`cursor-pointer flex items-center justify-between p-3 hover:bg-[#252525] rounded-lg transition-all group ${
        isSelected ? "bg-[#292B2C]" : ""
      }`}
    >
      {/* left */}
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 flex-shrink-0">
          <img
            src={item.MusicStyle?.image}
            alt={item.MusicStyle?.title}
            className="w-full h-full object-cover rounded-md opacity-80"
          />
          {isWav && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlay?.(item.id);
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
            >
              <Image
                src={isPlaying ? icon_stop : icon_controlPlay}
                alt={isPlaying ? "stop" : "play"}
                width={20}
                height={20}
              />
            </button>
          )}
        </div>
        <h3 className="text-white text-sm font-medium leading-tight">
          {item.MusicStyle?.title}.{isWav ? "WAV" : "MIDI"}
        </h3>
      </div>

      {/* center badges */}
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
          {shownTime}
        </span>
        <button
          onClick={handleMenuToggle}
          className="text-gray-400 hover:text-white text-xl cursor-pointer"
        >
          •••
        </button>
        {menuOpen && (
          <div className="absolute w-[200px] right-0 top-full mt-2 bg-[#1A1A1A] border border-[#374151] rounded-xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95">
            {menuItems?.map((el, idx) => (
              <button
                key={idx}
                onClick={(e) => handleMenuItemClick(e, el)}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#292B2C] rounded-lg cursor-pointer"
              >
                <Image
                  alt="icon"
                  src={menuIcons[el.title]}
                  width={24}
                  height={24}
                />
                {el.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
