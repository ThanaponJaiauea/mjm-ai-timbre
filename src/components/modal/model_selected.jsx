"use client";

import { useEffect } from "react";

export function ModelSelected({ model, onClose, title, data, onSelect, instrumentalOptions }) {
  useEffect(() => {
    if (!model) return;

    const handleEsc = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [model, onClose]);

  if (!model) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-[600px] rounded-[20px] bg-[#1A1A1A] border border-[#2A2A2A] p-6">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-white font-semibold">Select {title === "genre" ? "Style" : title}</h2>
          <button onClick={onClose} className="cursor-pointer">
            ✕
          </button>
        </div>

        {/* Content */}
        {title === "genre" || title === "Key" ? (
          <div className="space-y-3">
            {data?.items?.length ? (
              <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[300px] p-4">
                {data.items.map(item => (
                  <button
                    key={item}
                    className="px-4 py-2 bg-[#2A2A2A] rounded-xl hover:bg-[#333] cursor-pointer"
                    onClick={() => {
                      onSelect(title === "Key" ? `Key ${item}` : item);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Loading...</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 max-h-[300px] p-4">
            {instrumentalOptions.map(option => (
              <button
                key={option}
                className="px-4 py-2 bg-[#2A2A2A] rounded-xl hover:bg-[#333]"
                onClick={() => onSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
