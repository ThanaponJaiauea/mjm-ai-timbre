"use client";

import { bg_ChatFirstPage, image_style_hip_hop } from "@/images/index";
import { useAuthStore } from "@/store/use-auth-store";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserMenu } from "../auth/user-menu";
import { ButtonSign } from "../button/button_sign";
import ChatPromptInput from "./chatPromptInput";
import { useState } from "react";

const montserrat = Montserrat();

const listStyleDataMoc = [
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
];

const ideasDataMoc = [{ title: "Lofi, Key C, 120 BPM, Drums" }, { title: "Pop, Key F, 120 BPM, Drums" }];

export default function ChatFirstPage({ value, onChange, onSubmit, onSelectOption, isStreaming }) {
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  const [selectedIdea, setSelectedIdea] = useState(null);

  const handleSignIn = () => {
    router.push("?auth=signin");
  };

  const handleSignUp = () => {
    router.push("?auth=signup");
  };

  return (
    <section className="flex flex-col items-center relative w-full p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <Image src={bg_ChatFirstPage} alt="Background" fill priority className="object-cover" />
      </div>

      <div className="flex justify-end w-full gap-4">
        {user ? (
          <UserMenu />
        ) : (
          <>
            <ButtonSign title="Sign In" onClick={() => handleSignIn()} />
            <ButtonSign title="Sign Up" onClick={() => handleSignUp()} />
          </>
        )}
      </div>

      <div className="mt-20 flex flex-col items-center gap-10">
        <div>
          <h1 className={`font-bold text-[70px] ${montserrat.className}`}>CREATIVE AI MUSIC</h1>
          <p className="text-center text-sm">
            Create unique sounds instantly with AI and turn your creative ideas into <br /> original, personalized music
            in just seconds.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3">
          <ChatPromptInput
            value={value}
            onChange={onChange}
            showOptions
            onSelectOption={onSelectOption}
            onSubmit={onSubmit}
            submitting={isStreaming}
            status={isStreaming ? "streaming" : "ready"}
          />

          <div className="flex items-center justify-center gap-2">
            <p className="text-[13px] font-normal leading-[20px] bg-gradient-to-r from-[#E759FF] to-[#6174FF] bg-clip-text text-transparent [letter-spacing:0px]">
              Ideas
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {ideasDataMoc.map((idea, idx) => {
                const isSelected = selectedIdea === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedIdea(idx)}
                    className={`
          cursor-pointer px-6 py-2 rounded-full text-[14px] transition-all duration-200
          bg-[#181818] border border-white/10 hover:border-white/30
          ${isSelected ? "ring-1 ring-[#E759FF]/50" : ""}
        `}
                  >
                    <span
                      className={`
          ${
            isSelected
              ? "bg-gradient-to-r from-[#E759FF] to-[#6174FF] bg-clip-text text-transparent font-medium"
              : "text-[#FFFFFF]/80"
          }
        `}
                    >
                      {idea.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-wrap items-center justify-center mt-20 gap-2">
        {listStyleDataMoc?.map((el, idx) => (
          <div
            key={idx}
            className="bg-[#1B1B1B] w-[227px] h-[172px] flex flex-col items-center justify-center gap-4 rounded-[16px]"
          >
            <Image src={el.image} alt={el.label + " Style"} width={200} height={100} />

            <div className="w-full">
              <p className="text-[16px] text-white font-medium">{el.label}</p>
              <p className="text-[14px] text-[#848484] font-medium">{el.bpm}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
