"use client";

import { bg_ChatFirstPage } from "../../../public/index";
import { useAuthStore } from "@/store/use-auth-store";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserMenu } from "../auth/user-menu";
import { ButtonSign } from "../button/button_sign";
import ChatPromptInput from "./chatPromptInput";
import CardListMusic from "../cardListMusic";
import { useEffect, useState } from "react";
import { getMusicStyle } from "@/api/music";
import {
  icon_instrument1,
  icon_instrument2,
  icon_instrument3,
  icon_instrument4,
  icon_instrument5,
} from "../../../public/index";

const montserrat = Montserrat();

const ideasDataMoc = [
  { title: "Lofi, Key C, 120 BPM, Drums" },
  { title: "Pop, Key F, 120 BPM, Drums" },
];

const icon_instrument_data = [
  icon_instrument1,
  icon_instrument2,
  icon_instrument3,
  icon_instrument4,
  icon_instrument5,
];

export default function ChatFirstPage({
  value,
  onChange,
  onSubmit,
  onSelectOption,
  isStreaming,
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [selectedIdea, setSelectedIdea] = useState(null);

  const [musicStyleData, setMusicStyleData] = useState([]);
  console.log("musicStyleData", musicStyleData);

  const handleSignIn = () => {
    router.push("?auth=signin");
  };

  const handleSignUp = () => {
    router.push("?auth=signup");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMusicStyle();
        setMusicStyleData(res.data.data);
      } catch (error) {
        console.error("Error fetching music style:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="flex flex-col items-center relative w-full p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <Image
          src={bg_ChatFirstPage}
          alt="Background"
          fill
          priority
          className="object-cover"
        />
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

      <div className="mt-20 flex flex-col items-center gap-8">
        <div>
          <h1 className={`font-bold text-[70px] ${montserrat.className}`}>
            CREATIVE AI MUSIC
          </h1>
          <p className="text-center text-sm">
            Create unique sounds instantly with AI and turn your creative ideas
            into <br /> original, personalized music in just seconds.
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

      <div className="mt-14">
        <CardListMusic data={musicStyleData} icon_data={icon_instrument_data} />
      </div>
    </section>
  );
}
