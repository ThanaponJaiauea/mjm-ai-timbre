"use client";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { icon_controlPlay, icon_stop } from "../../../public/index";

export default function TrendingSwiper({ data }) {
  const [selectedId, setSelectedId] = useState(null);
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const swiperRef = useRef(null);

  const handlePlay = (item) => {
    if (selectedId === item.id) {
      audioRef.current?.pause();
      setSelectedId(null);
    } else {
      audioRef.current?.pause();

      audioRef.current = new Audio(item.wav_file_url);
      audioRef.current.play();
      setSelectedId(item.id);
    }
  };

  useEffect(() => {
    return () => audioRef.current?.pause();
  }, []);

  useEffect(() => {
    if (containerRef.current && swiperRef.current) {
      // Force Swiper ให้ใช้ width จาก container จริง
      swiperRef.current.update();
    }
  }, [data]);

  if (!data?.data || data.data.length === 0) return null;

  return (
    <div style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
      <Swiper
        spaceBetween={16}
        slidesPerView={4}
        observer={true}
        observeParents={true}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {data.data.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              onClick={() => handlePlay(item)}
              className={`w-full h-[230px] p-3 flex flex-col rounded-[20px] cursor-pointer transition-all border 
              ${selectedId === item.id ? "bg-[#292B2C]" : "bg-transparent border-transparent hover:bg-[#1f1f1f]"}`}
            >
              {/* Image Container */}
              <div className="relative w-full h-[165px] mb-3 overflow-hidden rounded-xl">
                <img
                  src={item.MusicStyle?.image}
                  alt={item.MusicStyle?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 flex items-center justify-center bg-black/50 rounded-full">
                  <Image
                    src={selectedId === item.id ? icon_stop : icon_controlPlay}
                    alt="play-control"
                    width={36}
                    height={36}
                  />
                </div>
              </div>

              {/* Info */}
              <div>
                <h4 className="text-white font-semibold truncate">
                  Listen Again
                </h4>
                <div className="flex items-center gap-1 text-[12px] text-gray-400 mt-1">
                  <span className="truncate">User name</span>
                  <span>•</span>
                  <span className="truncate">
                    {data?.instrument}, {item.MusicStyle?.title}, {item.bpm}{" "}
                    BPM, {item.musical_key}
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
