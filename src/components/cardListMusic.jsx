"use client";

import { useState } from "react";
import Image from "next/image";
import { icon_controlPlay, icon_stop } from "../../public/index";

export default function CardListMusic({ data, icon_data }) {
  const [selectedStyleId, setSelectedStyleId] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  const togglePlay = (e, idx) => {
    e.stopPropagation();
    setPlayingId(playingId === idx ? null : idx);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {data?.map((el, idx) => {
        const isSelected = selectedStyleId === idx;

        return (
          <div
            key={idx}
            onClick={() => setSelectedStyleId(idx)}
            className={`
             group w-[200px] h-[200px] flex flex-col items-start p-4 gap-2 rounded-[16px] overflow-hidden cursor-pointer transition-all duration-300 cursor-pointer hover:scale-105 
              ${isSelected ? "bg-[#1B1B1B] " : "bg-transparent"}
            `}
          >
            <div className="relative w-full h-[100px] rounded-lg overflow-hidden">
              <Image src={el.image} alt="image style" fill className="object-cover" />

              <div
                onClick={e => togglePlay(e, idx)}
                className={`
        absolute inset-0 flex items-end justify-end bg-black/20 p-2 transition-opacity duration-300
        ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
      `}
              >
                <Image
                  src={playingId === idx ? icon_stop : icon_controlPlay}
                  alt="play icon"
                  width={30}
                  height={30}
                  className="cursor-pointer hover:scale-110 transition-transform"
                />
              </div>
            </div>

            <div className="w-full flex flex-col">
              <div className="flex gap-2 mb-2">
                {icon_data && icon_data[idx] && (
                  <Image src={icon_data[idx]} alt="instrument-icon" width={20} height={20} className="opacity-70" />
                )}
                <p className="text-[16px] text-white font-medium truncate">{el.styleName}</p>
              </div>

              <div className="flex items-center justify-between text-[14px] text-[#848484] font-medium">
                <p>{el.sampleArp ? `${el.sampleArp.bpm} BPM` : "120 BPM"}</p>
                <p>count {el?.count}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
