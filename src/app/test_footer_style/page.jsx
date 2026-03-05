"use client";

import { getMusicStyle } from "@/api/music";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function TestFooterStyle() {
  const [dataStyle, setDataStyle] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMusicStyle();
        // ตรวจสอบโครงสร้างข้อมูลที่ส่งกลับมาจาก API
        setDataStyle(res.data.data);
      } catch (error) {
        console.error("Error fetching music style:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-10 bg-black min-h-screen">
      <h1 className="text-2xl font-bold text-white">Music Styles : {dataStyle.length}</h1>

      <div className="w-full flex flex-wrap items-center justify-center mt-10 gap-6">
        {dataStyle && dataStyle.length > 0 ? (
          dataStyle.map(el => {
            const isSelected = selectedId === el.id;

            return (
              <div
                key={el.id}
                onClick={() => setSelectedId(el.id)}
                // เพิ่มสี bg-[#1B1B1B] เป็นค่าเริ่มต้นเพื่อให้มองเห็นกล่องข้อมูล
                className={`w-[227px] h-[220px] flex flex-col items-center p-4 gap-3 rounded-[16px] transition-all duration-300 cursor-pointer hover:scale-105 
                  ${isSelected ? "bg-[#333333] border-white" : ""} `}
              >
                <div className="w-full h-[120px] relative overflow-hidden rounded-lg">
                  {el.image ? (
                    <Image src={el.image} alt={el.title || "Music Style"} fill className="object-cover" sizes="227px" />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                </div>

                <div className="w-full text-left">
                  <p className="text-[16px] font-semibold truncate text-white">{el.title}</p>
                  <p className="text-[14px] text-[#848484] font-medium">120 BPM</p>
                </div>
              </div>
            );
          })
        ) : (
          // แสดง Loading หรือ Skeleton ขณะรอข้อมูล
          <p className="text-white">Loading styles...</p>
        )}
      </div>
    </div>
  );
}
