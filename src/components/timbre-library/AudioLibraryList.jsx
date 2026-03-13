"use client";

/** @format */

import React, { useState, useRef, useEffect } from "react";
import WavRow from "./Wavrow";
import MidiRow from "./Midirow";
import {
  icon_share,
  icon_remove2,
  icon_download2,
} from "../../../public/index";

const defaultBadgeStyle = {
  background: "#0f0f0f",
  border: "1px solid #374151",
  borderRadius: "4px",
};

const defaultTextStyle = { color: "#9ca3af" };

const selectedBadgeStyle = {
  background:
    "linear-gradient(black, black) padding-box, linear-gradient(to right, #E759FF, #6174FF) border-box",
  borderRadius: "4px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const selectedTextStyle = {
  backgroundImage: "linear-gradient(to right, #E759FF, #6174FF)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
};

const modelData = [
  { title: "Download" },
  { title: "Share" },
  { title: "Move To Trash" },
];

const menuIcons = {
  Download: icon_download2,
  Share: icon_share,
  "Move To Trash": icon_remove2,
};

const modelDataNoTrash = modelData.filter((el) => el.title !== "Move To Trash");
// ------------------------------------------------

export default function AudioLibraryList({
  data,
  limit,
  showTrash = false,
  onDelete,
}) {
  const musicList = data?.data || [];
  const displayList = limit ? musicList.slice(0, limit) : musicList;
  const [selectedId, setSelectedId] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [durationsMap, setDurationsMap] = useState({});
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTogglePlay = (id) => {
    setPlayingId((prev) => (prev === id ? null : id));
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  };

  const menuItems = showTrash ? modelData : modelDataNoTrash;

  return (
    <div className="flex flex-col gap-2 w-full p-4 relative" ref={menuRef}>
      {displayList.map((item) => {
        const wavSelected = selectedId === item.id;
        const midiSelected = selectedId === `midi-${item.id}`;

        return (
          <React.Fragment key={item.id}>
            <WavRow
              item={item}
              instrument={data.instrument}
              isSelected={wavSelected}
              isPlaying={playingId === item.id}
              onSelect={() => setSelectedId(item.id)}
              onTogglePlay={handleTogglePlay}
              isMenuOpen={menuOpenId === item.id}
              onToggleMenu={() =>
                setMenuOpenId(menuOpenId === item.id ? null : item.id)
              }
              showTrash={showTrash}
              onDelete={onDelete}
              onDurationLoaded={(id, dur) =>
                setDurationsMap((prev) => ({ ...prev, [id]: dur }))
              }
              badgeStyle={wavSelected ? selectedBadgeStyle : defaultBadgeStyle}
              textStyle={wavSelected ? selectedTextStyle : defaultTextStyle}
              menuItems={menuItems}
              menuIcons={menuIcons}
            />

            {item.midi_file_url && (
              <MidiRow
                item={item}
                instrument={data.instrument}
                showTrash={showTrash}
                onDelete={onDelete}
                displayTime={formatDuration(durationsMap[item.id])}
                isSelected={midiSelected}
                onSelect={() => setSelectedId(`midi-${item.id}`)}
                badgeStyle={
                  midiSelected ? selectedBadgeStyle : defaultBadgeStyle
                }
                textStyle={midiSelected ? selectedTextStyle : defaultTextStyle}
                menuItems={menuItems}
                menuIcons={menuIcons}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
