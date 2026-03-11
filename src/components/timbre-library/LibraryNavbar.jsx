"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function LibraryNavbar({ selectedMenu, setSelectedMenu }) {
  console.log("selectedMenu", selectedMenu);

  const [showInstrumentDropdown, setShowInstrumentDropdown] = useState(false);
  const menuList = ["All", "My Timble", "Trending", "Instrument"];

  return (
    <div className="flex justify-between items-center mt-6">
      {/* Group เมนูซ้าย */}
      <div className="flex gap-2 p-2 bg-[#141414] rounded-full">
        {menuList.map((menu) =>
          menu === "Instrument" ? (
            <div className="relative" key={menu}>
              <button
                className={`cursor-pointer px-6 py-2 rounded-full font-medium focus:outline-none flex items-center transition-all ${
                  selectedMenu === "Instrument" ||
                  selectedMenu === "ARP" ||
                  selectedMenu === "BASS"
                    ? "bg-[#232323] text-[#E759FF]"
                    : "bg-transparent text-[#8F8F8F]"
                }`}
                onClick={() => {
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
                    className={`inline transition-transform ${showInstrumentDropdown ? "rotate-180" : ""}`}
                  />
                </span>
              </button>

              {showInstrumentDropdown && (
                <div className="absolute left-0 top-[115%] w-full bg-[#232323] rounded-xl shadow-2xl flex flex-col z-50 border border-white/5 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <button
                    className="px-6 py-3 text-left text-white hover:text-[#E759FF] hover:bg-[#181818] transition"
                    onClick={() => {
                      setSelectedMenu("ARP");
                      setShowInstrumentDropdown(false);
                    }}
                  >
                    Arp
                  </button>
                  <button
                    className="px-6 py-3 text-left text-white hover:text-[#E759FF] hover:bg-[#181818] transition"
                    onClick={() => {
                      setSelectedMenu("BASS");
                      setShowInstrumentDropdown(false);
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
              className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
                selectedMenu === menu
                  ? "bg-[#232323] text-[#E759FF]"
                  : "bg-transparent text-[#8F8F8F]"
              }`}
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
      {selectedMenu !== "All" && (
        <div className="relative w-[250px]">
          <input
            type="text"
            placeholder="Search your idea"
            className="bg-[#232323] text-white pl-12 pr-4 py-2 rounded-full outline-none w-full border border-transparent focus:border-[#E759FF] transition-all"
          />
          <span className="absolute left-5 top-1/2 transform -translate-y-1/2 opacity-60">
            <Image
              src="/icons/icon_search.png"
              alt="search"
              width={16}
              height={16}
            />
          </span>
        </div>
      )}
    </div>
  );
}
