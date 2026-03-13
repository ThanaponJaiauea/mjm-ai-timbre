"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { icon_controlPlay, icon_stop, icon_mjm } from "../../../public/index";

export default function TrendingSwiper({ data }) {
  const [selectedId, setSelectedId] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const audioRef = useRef(null);
  const scrollRef = useRef(null);

  // drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const didDrag = useRef(false); // ป้องกัน click หลัง drag

  const handlePlay = (item) => {
    if (didDrag.current) return; // ถ้า drag อยู่ไม่ให้ play
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

  // check scroll arrows
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [data]);

  // drag handlers
  const onMouseDown = (e) => {
    isDragging.current = true;
    didDrag.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    if (Math.abs(walk) > 5) didDrag.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  if (!data?.data || data.data.length === 0) return null;

  return (
    <div className="relative w-full ">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-5 top-[40%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-[#1A1A1A] border border-[#374151] rounded-full text-white text-lg hover:bg-[#252525] transition-all"
        >
          ‹
        </button>
      )}

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide select-none"
        style={{ cursor: "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {data.data.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-[320px]">
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
                  draggable={false}
                />
                <div className="absolute bottom-2 right-2 flex items-center justify-center bg-black/50 rounded-full">
                  <Image
                    src={selectedId === item.id ? icon_stop : icon_controlPlay}
                    alt="play-control"
                    width={36}
                    height={36}
                    draggable={false}
                  />
                </div>
              </div>

              {/* Info */}
              <div>
                <h4 className="text-white font-semibold truncate">
                  Listen Again
                </h4>
                <div className="flex items-center gap-1 text-[12px] text-gray-400 mt-1">
                  <div className="flex items-center gap-2">
                    <Image
                      alt="user avatar"
                      src={item?.user?.avatar || icon_mjm}
                      width={14}
                      height={14}
                      draggable={false}
                    />
                    <span className="truncate">{item?.user?.username}</span>
                  </div>
                  <div className="flex items-center gap-1 overflow-hidden">
                    <span>•</span>
                    <span className="truncate">
                      {data?.instrument}, {item.MusicStyle?.title}, {item.bpm}{" "}
                      BPM, {item.musical_key}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-5 top-[40%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-[#1A1A1A] border border-[#374151] rounded-full text-white text-lg hover:bg-[#252525] transition-all"
        >
          ›
        </button>
      )}
    </div>
  );
}
