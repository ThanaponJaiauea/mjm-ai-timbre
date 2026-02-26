"use client";

import { useState } from "react";
import { Card, CardAction, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const mjmPadImageData = [
  {
    name: "ai-sound-pad",
    path: "/images/ai-sound-pad.png",
  },
  {
    name: "ai-record-voice",
    path: "/images/record-voice.png",
  },
  {
    name: "ai-cover-song-generate",
    path: "/images/ai-cover-song-generate.png",
  },
];

const activeFunctions = {
  "ai-sound-pad": "/images/ai-sound-pad-function.png",
  "ai-record-voice": "/images/record-voice-function.png",
  "ai-cover-song-generate": "/images/ai-cover-song-generate-function.png",
} as const;

type ActiveFunctionType = keyof typeof activeFunctions;

const genreCards = [
  { src: "/images/afro.png", alt: "Afro beat", desktopClass: "top-[5%] left-[8%] w-[12%] z-10" },
  { src: "/images/down-tempo.png", alt: "Down tempo", desktopClass: "top-[48%] left-[0%] w-[13%] z-20" },
  { src: "/images/jazz.png", alt: "Jazz", desktopClass: "top-[28%] left-[17%] w-[14%] z-10" },
  { src: "/images/seires.png", alt: "Series", desktopClass: "top-[12%] left-[37%] w-[18%] z-10" },
  { src: "/images/rock.png", alt: "Rock", desktopClass: "top-[45%] left-[29%] w-[23%] z-30" },
  { src: "/images/disco.png", alt: "Disco", desktopClass: "top-[0%] left-[61%] w-[18%] z-10" },
  { src: "/images/house.png", alt: "House", desktopClass: "top-[58%] left-[59%] w-[15%] z-20" },
  { src: "/images/synth-wave.png", alt: "Synth wave", desktopClass: "top-[25%] left-[78%] w-[20%] z-20" },
];

export function MjmPadTab() {
  const [activeFunction, setActiveFunction] = useState<ActiveFunctionType>("ai-sound-pad");

  function handleClickActiveShowFunction(name: ActiveFunctionType) {
    setActiveFunction(name);
  }

  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      <Card className="flex items-center bg-transparent border-none shadow-none">
        <CardContent className="text-muted-foreground text-sm">
          <Image src="/images/mjm-pad-app.png" alt={"MJM Pad"} width={600} height={500} />
        </CardContent>
        <CardFooter>
          <CardAction>
            <div className="flex  gap-4">
              <Link target="_blank" href="https://apps.apple.com/us/app/mjm-pad/id6751707171">
                <Image src="/images/appstore.png" alt="Apple Store Logo" width={150} height={200} />
              </Link>
              <Link target="_blank" href="https://apps.apple.com/us/app/mjm-pad/id6751707171">
                <Image src="/images/googleplay.png" alt="Apple Store Logo" width={150} height={200} />
              </Link>
            </div>
          </CardAction>
        </CardFooter>
      </Card>
      <Card className="flex justify-center items-center bg-transparent border-none shadow-none">
        <p className="text-2xl font-bold">FUNCTIONAL HIGHLIGHTS</p>
        <CardContent className="text-muted-foreground text-sm ">
          <div className="flex flex-1 gap-4">
            {mjmPadImageData.map(app => (
              <Image
                key={app.name}
                onClick={() => handleClickActiveShowFunction(app.name as ActiveFunctionType)}
                className={`hover:cursor-pointer transition-all duration-300 ease-in-out border-2 rounded-3xl active:scale-95 ${
                  activeFunction === app.name
                    ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-105"
                    : "border-transparent hover:border-blue-500/50 hover:scale-105"
                }`}
                src={app.path}
                alt={app.name}
                width={300}
                height={400}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Image
              key={activeFunction}
              className="p-4 m-2 animate-in fade-in zoom-in-95 duration-700 ease-in-out slide-in-from-bottom-4 "
              src={activeFunctions[activeFunction]}
              alt="{MJM Pad}"
              width={700}
              height={700}
            />
          </div>
        </CardContent>
      </Card>
      <p className="flex justify-center text-2xl font-bold text-center mt-8">UNLOCK LIMITLESS MUSICAL</p>
      <p className="flex justify-center text-2xl font-bold text-center mb-2">POSSIBILITIES</p>
      <Card className="bg-transparent border-none shadow-none w-full">
        <CardContent className="p-0">
          {/* Desktop View (Scattered Layout) */}
          <div className="hidden md:block relative w-full aspect-2/1 lg:aspect-[2.2/1] max-w-5xl mx-auto my-8">
            {genreCards.map((genre, index) => (
              <Image
                key={index}
                className={`absolute ${genre.desktopClass} h-auto drop-shadow-2xl transition-all duration-300 ease-out cursor-pointer animate-float`}
                src={genre.src}
                alt={genre.alt}
                width={400}
                height={400}
                style={{
                  animationDelay: `${index * 0.4}s`,
                  animationDuration: `${4 + (index % 3)}s`,
                }}
              />
            ))}
          </div>

          {/* Mobile/Tablet View (Grid Layout) */}
          <div className="md:hidden grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 px-2">
            {genreCards.map((genre, index) => (
              <div key={index} className="flex justify-center items-center">
                <Image
                  src={genre.src}
                  alt={genre.alt}
                  width={200}
                  height={200}
                  className="w-full max-w-40 h-auto animate-float transition-transform drop-shadow-xl"
                  style={{
                    animationDelay: `${index * 0.4}s`,
                    animationDuration: `${4 + (index % 3)}s`,
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col items-center mt-4 mb-4 justify-center text-sm font-light">
        <p>Explore Endless Genres, Styles, And Creative Directions With The Power Of Advanced AI.</p>
        <p>Turn Your ideas into Fully Produced, Professional-Quality Tracks in Just Seconds.</p>
      </div>
    </div>
  );
}
