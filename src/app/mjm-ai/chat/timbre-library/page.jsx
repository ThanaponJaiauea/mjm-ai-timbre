"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AudioLibraryList from "@/components/timbre-library/AudioLibraryList";
import { getTranding, getMyTimble } from "@/api/music";
import TrendingSwiper from "../../../../components/timbre-library/TrendingSwiper";
import {
  bg_instrument_arp,
  bg_instrument_Bass,
} from "../../../../../public/index";

const instruments = [
  {
    id: 1,
    title: "Arp",
    description: "Rhythmic Synth Patterns",
    bgImage: bg_instrument_arp.src,
  },
  {
    id: 2,
    title: "Bass",
    description: "Deep Low Frequencies",
    bgImage: bg_instrument_Bass.src,
  },
];

export default function TimbreLibraryPage() {
  const menuList = ["All", "My Timble", "Trending", "Instrument"];
  const [selectedMenu, setSelectedMenu] = useState("All");
  const [showInstrumentDropdown, setShowInstrumentDropdown] = useState(false);
  const [trandingData, setTrandingData] = useState(null);
  const [myTimble, setMyTimble] = useState(null);

  const trandingDatas = async () => {
    try {
      const res = await getTranding();
      setTrandingData(res.data);
    } catch (error) {
      console.error("Error fetching music style:", error);
    }
  };

  const myTimbleData = async () => {
    try {
      const res = await getMyTimble();
      setMyTimble(res.data);
    } catch (error) {
      console.error("Error fetching music style:", error);
    }
  };

  useEffect(() => {
    trandingDatas();
    myTimbleData();
  }, []);

  return (
    <div className="w-[90%] mx-auto m-0 flex flex-col gap-4 min-h-screen text-white">
      {/* Header */}
      <div className="text-[40px] font-bold mt-10">Library</div>

      {/* Menu nav bar & Search */}
      <div className="flex justify-between items-center mt-6">
        {/* Menu nav*/}
        <div className="flex gap-2 p-2 bg-[#141414] rounded-full">
          {menuList.map((menu) =>
            menu === "Instrument" ? (
              <div className="relative" key={menu}>
                <button
                  className={`px-6 py-2 rounded-full font-medium focus:outline-none flex items-center ${selectedMenu === menu ? "bg-[#232323] text-[#E759FF]" : "bg-transparent  text-[#8F8F8F]"}`}
                  onClick={() => {
                    setSelectedMenu(menu);
                    setShowInstrumentDropdown((prev) => !prev);
                  }}
                >
                  Instrument
                  <span className="ml-2">
                    <Image
                      src="/icons/icon_dropdown.png"
                      alt="dropdown"
                      width={14}
                      height={14}
                      className="inline"
                    />
                  </span>
                </button>

                {/* Dropdown slide down */}
                {showInstrumentDropdown && selectedMenu === "Instrument" && (
                  <div className="absolute left-0 top-[110%] w-full bg-[#232323] rounded-xl shadow-lg flex flex-col animate-slide-down z-10">
                    <button
                      className="px-6 py-3 text-left text-white hover:text-[#E759FF] hover:bg-[#181818] rounded-xl transition"
                      onClick={() => {
                        setShowInstrumentDropdown(false);
                        setSelectedMenu("Arp");
                      }}
                    >
                      Arp
                    </button>
                    <button
                      className="px-6 py-3 text-left text-white hover:text-[#E759FF] hover:bg-[#181818] rounded-xl transition"
                      onClick={() => {
                        setShowInstrumentDropdown(false);
                        setSelectedMenu("Bass");
                      }}
                    >
                      Bass
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                key={menu}
                className={`px-6 py-2 rounded-full font-medium focus:outline-none ${selectedMenu === menu ? "bg-[#232323] text-[#E759FF]" : "bg-transparent text-[#8F8F8F]"}`}
                onClick={() => {
                  setSelectedMenu(menu);
                  setShowInstrumentDropdown(false);
                }}
              >
                {menu}
              </button>
            ),
          )}
        </div>

        {/* Search */}
        <div className="relative w-[250px]">
          <input
            type="text"
            placeholder="Search your idea"
            className="bg-[#232323] text-white pl-12 pr-4 py-2 rounded-full outline-none w-full"
          />
          <span className="absolute left-5 top-1/2 transform -translate-y-1/2">
            <Image
              src="/icons/icon_search.png"
              alt="search"
              width={16}
              height={16}
            />
          </span>
        </div>
      </div>

      {/* Section  : My Timble */}
      {myTimble ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center mt-10">
            <span className="text-[24px] font-semibold">My Timble</span>
            <span className="ml-2 text-[22px]">🎵</span>
            <span className="ml-auto text-[16px] cursor-pointer hover:border-b-2 hover:border-white">
              See All
            </span>
          </div>

          <AudioLibraryList data={myTimble} limit={3} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center mt-10 ">
            <span className="text-[24px] font-semibold">My Timble</span>
            <span className="ml-2 text-[22px]">🎵</span>
          </div>

          <div className="flex flex-col items-center justify-center mt-16">
            <Image
              src="/icons/icon_music_add.png"
              alt="Library Empty"
              width={112}
              height={112}
            />
            <div className="mt-8 text-[22px] font-semibold">
              Your library is empty
            </div>
            <div className="mt-2 text-[16px] text-gray-400">
              Start creating music and your songs will show up here.
            </div>
          </div>
        </div>
      )}

      {/* Section : Trending */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center mt-10 mb-6">
          <span className="text-[24px] font-semibold">Trending</span>
          <span className="ml-2 text-[22px]">🔥</span>

          <span className="ml-auto text-[16px] cursor-pointer hover:border-b-2 hover:border-white">
            See All
          </span>
        </div>

        {/* Trending Items */}
        <TrendingSwiper data={trandingData} />
      </div>

      {/* Section : Instruments */}
      <div className="flex flex-col gap-4 mb-20">
        <div className="flex items-center mt-10 mb-6">
          <span className="text-[24px] font-semibold">Instrument</span>
          <span className="ml-2 text-[22px]">🔥</span>

          <span className="ml-auto text-[16px] cursor-pointer hover:border-b-2 hover:border-white">
            See All
          </span>
        </div>

        {/* Instruments Items */}
        <div className="flex gap-6 w-full">
          {instruments.map((item) => {
            const isBass = item.title === "Bass";

            return (
              <div
                key={item.id}
                className={`relative w-[450px] h-[200px] rounded-[24px] p-[1px] overflow-hidden 
          ${isBass ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
          bg-gradient-to-bl from-[#292B2C] to-[#6174FF]`}
              >
                <div
                  className="w-full h-full rounded-[23px] p-8 flex flex-col justify-between overflow-hidden"
                  style={{
                    backgroundImage: `url(${item.bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="z-10">
                    <h3 className="text-[28px] font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-[16px] text-gray-200 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <button
                    disabled={isBass}
                    className={`flex items-center justify-end gap-2 text-white font-medium transition-colors 
              ${isBass ? "text-gray-500" : "hover:text-[#E759FF] cursor-pointer"}`}
                  >
                    Explore <span>&gt;</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
