/** @format */
"use client";

import { Montserrat } from "next/font/google";
import { ButtonSign } from "../button/button_sign";
import { PromptInput, PromptInputBody, PromptInputSubmit, PromptInputTextarea } from "../ai-elements/prompt-input";
import { BadgeButton } from "../button/badgeButton";
import { image_style_hip_hop } from "@/images/index";
import Image from "next/image";

const montserrat = Montserrat({});

const listStyleDataMoc = [
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
  { label: "Hip Hop", image: image_style_hip_hop, bpm: "120 BPM" },
];

export default function ChatFirstPage() {
  const handleSignIn = () => {
    console.log("Sign In clicked");
  };

  const handleSignUp = () => {
    console.log("Sign Up clicked");
  };

  return (
    <section className="flex flex-col items-center">
      {/* TOP : BTN login and register*/}
      <div className="flex justify-end w-full gap-4">
        <ButtonSign title={"Sign In"} onClick={handleSignIn} />
        <ButtonSign title={"Sign Up"} onClick={handleSignUp} />
      </div>

      {/* CENTER : Header and chat input */}
      <div className="mt-20 flex flex-col items-center gap-10">
        <div>
          <h1 className={`font-bold text-[70px] uppercase  ${montserrat.className}`}>CREATIVE AI MUSIC</h1>
          <p className="text-center text-[16px]">
            Create unique sounds instantly with AI and turn your creative ideas into <br /> original, personalized music
            in just seconds.
          </p>
        </div>

        <PromptInput className="mt-4 w-full m-auto relative bg-[#1A1A1A] border-[#2A2A2A] rounded-[24px] overflow-hidden">
          <PromptInputBody className="p-2">
            <PromptInputTextarea
              placeholder="Customize your sound..."
              className="pl-4 pt-4 text-gray-300 min-h-[40px]"
            />

            <div className="flex gap-2 px-3 pt-2 items-center">
              <BadgeButton label="Style" />
              <BadgeButton label="Key" />
              <BadgeButton label="BPM" />
              <BadgeButton label="Instrumental" />
            </div>
          </PromptInputBody>

          <PromptInputSubmit className="absolute bottom-3 right-3 rounded-full w-[40px] h-[40px] bg-[#292929] hover:bg-[#333] border-none" />
        </PromptInput>
      </div>

      {/* BOTTOM : Footer List style */}
      <div className="w-full flex flex-wrap items-center mt-20 gap-2">
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
