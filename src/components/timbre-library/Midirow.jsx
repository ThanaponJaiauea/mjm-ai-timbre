"use client";

/** @format */

import { useState } from "react";
import Image from "next/image";

export default function MidiRow({
  item,
  instrument,
  onDelete,
  displayTime,
  isSelected,
  onSelect,
  badgeStyle,
  textStyle,
  menuItems,
  menuIcons,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer flex items-center justify-between p-3 hover:bg-[#252525] rounded-lg transition-all group ${isSelected ? "bg-[#292B2C]" : ""}`}
    >
      {/* left */}
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 flex-shrink-0">
          <img
            src={item.MusicStyle?.image}
            alt={item.MusicStyle?.title}
            className="w-full h-full object-cover rounded-md opacity-80"
          />
        </div>
        <h3 className="text-white text-sm font-medium leading-tight">
          {item.MusicStyle?.title}.MIDI
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
            setIsMenuOpen((prev) => !prev);
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
                  setIsMenuOpen(false);
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
