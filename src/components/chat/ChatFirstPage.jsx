"use client";

import { Montserrat } from "next/font/google";
import { ButtonSign } from "../button/button_sign";
import Image from "next/image";
import ChatPromptInput from "./chatPromptInput";
import { image_style_hip_hop, bg_ChatFirstPage } from "@/images/index";

const montserrat = Montserrat();

const listStyleDataMoc = [
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
];

export default function ChatFirstPage({ value, onChange, onSubmit, onSelectOption, isStreaming }) {
  const handleSignIn = () => {
    console.log("Sign In clicked");
  };

  const handleSignUp = () => {
    console.log("Sign Up clicked");
  };

  return (
    <section className="flex flex-col items-center relative w-full">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <Image src={bg_ChatFirstPage} alt="Background" fill priority className="object-cover" />
      </div>

      <div className="flex justify-end w-full gap-4">
        <ButtonSign title="Sign In" onClick={() => handleSignIn()} />
        <ButtonSign title="Sign Up" onClick={() => handleSignUp()} />
      </div>

      <div className="mt-20 flex flex-col items-center gap-10">
        <div>
          <h1 className={`font-bold text-[70px] ${montserrat.className}`}>CREATIVE AI MUSIC</h1>
          <p className="text-center text-sm">
            Create unique sounds instantly with AI and turn your creative ideas into <br /> original, personalized music
            in just seconds.
          </p>
        </div>

        <ChatPromptInput
          value={value}
          onChange={onChange}
          showOptions
          onSelectOption={onSelectOption}
          onSubmit={onSubmit}
          submitting={isStreaming}
          status={isStreaming ? "streaming" : "ready"}
        />
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
