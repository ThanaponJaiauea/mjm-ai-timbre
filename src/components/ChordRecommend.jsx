/** @format */
"use client";

import { Play, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { recommend_chords } from "../api/music";

export default function ChordRecommend({ initialData }) {
  const [recommendedChords, setRecommendedChords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async queryData => {
    setLoading(true);
    try {
      const response = await recommend_chords({ data: queryData });
      const chordsData = response.data.chords;
      const chordsArray = typeof chordsData === "string" ? chordsData.split(",").map(c => c.trim()) : chordsData;
      setRecommendedChords(chordsArray);
    } catch (error) {
      console.error("Error fetching chords:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      handleRecommend(initialData);
    }
  }, [initialData]);

  return (
    <div className="w-full bg-[#1e1e1e] p-6 rounded-xl border-l-4 border-green-500 my-4">
      <div className="text-sm text-gray-400 mb-2">
        AI แนะนำสำหรับ: Key {initialData?.key} | Mood {initialData?.mood}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {loading ? (
          <p>กำลังคำนวณคอร์ด...</p>
        ) : (
          recommendedChords?.map((chord, idx) => (
            <div key={idx} className="bg-[#1a1c23] border-2 p-4 rounded-2xl w-24 text-center border-gray-800">
              <span className="text-xl font-black">{chord}</span>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => handleRecommend(initialData)}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-bold flex items-center gap-2"
      >
        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        ขอคอร์ดใหม่
      </button>
    </div>
  );
}
