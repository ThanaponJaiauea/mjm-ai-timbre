"use client";

import { useState, useRef, useEffect } from "react";

export default function AudioPlayerBar({ track, onClose }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [track]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    audio.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const handleSkip = (secs) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(
      0,
      Math.min(duration, audio.currentTime + secs),
    );
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {track && (
        <audio
          ref={audioRef}
          src={track.file_url || track.wav_file_url}
          preload="metadata"
        />
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] flex items-center gap-4 px-6 h-[72px]
        bg-[rgba(14,14,14,0.92)] backdrop-blur-xl border-t border-white/[0.08]
        shadow-[0_-4px_40px_rgba(0,0,0,0.6)] transition-transform duration-[350ms]
        ease-[cubic-bezier(0.32,0.72,0,1)] ${visible ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Thumbnail */}
        <div className="w-11 h-11 rounded-md overflow-hidden flex-shrink-0 bg-[#1a1a1a] flex items-center justify-center border border-white/10">
          {track?.MusicStyle?.image ? (
            <img
              src={track.MusicStyle.image}
              alt={track.MusicStyle?.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl">🎵</span>
          )}
        </div>

        {/* Title + Artist */}
        <div className="min-w-0 w-40 flex-shrink-0">
          <div className="text-[13px] font-semibold text-white truncate">
            {`${track?.MusicStyle?.title ?? "Unknown"}.WAV`}
          </div>
          <div className="text-[11px] text-[#6b7280] truncate">
            {track?.MusicStyle?.title ?? ""}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Skip Back */}
          <button
            onClick={() => handleSkip(-10)}
            className="text-[#9ca3af] hover:text-white p-1.5 rounded-md transition-colors cursor-pointer bg-transparent border-none"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="19" x2="5" y2="5" />
            </svg>
          </button>

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.92)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 transition-transform cursor-pointer border-none"
          >
            {isPlaying ? (
              <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                <rect x="0" y="0" width="4" height="16" rx="1.5" fill="#000" />
                <rect x="8" y="0" width="4" height="16" rx="1.5" fill="#000" />
              </svg>
            ) : (
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                <path d="M1 1L13 8L1 15V1Z" fill="#000" />
              </svg>
            )}
          </button>

          {/* Skip Forward */}
          <button
            onClick={() => handleSkip(10)}
            className="text-[#9ca3af] hover:text-white p-1.5 rounded-md transition-colors cursor-pointer bg-transparent border-none"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex-1 flex items-center gap-2.5 min-w-0">
          <span className="text-[11px] text-[#6b7280] flex-shrink-0 tabular-nums">
            {formatTime(currentTime)}
          </span>
          <div
            onClick={handleSeek}
            className="flex-1 h-[3px] bg-white/10 rounded-full cursor-pointer relative overflow-visible"
          >
            <div
              className="h-full rounded-full relative"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(to right, #E759FF, #6174FF)",
                transition: "width 0.1s linear",
              }}
            >
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_rgba(97,116,255,0.8)]" />
            </div>
          </div>
          <span className="text-[11px] text-[#6b7280] flex-shrink-0 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
          >
            {volume === 0 ? (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </>
            ) : (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </>
            )}
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            className="w-20 cursor-pointer accent-[#6174FF]"
          />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="ml-2 text-[#9ca3af] hover:text-white p-1.5 rounded-md transition-colors cursor-pointer flex-shrink-0 bg-transparent border-none"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </>
  );
}
