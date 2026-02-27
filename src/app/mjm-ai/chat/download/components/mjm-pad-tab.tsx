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
  const [activeFunction, setActiveFunction] = useState<ActiveFunctionType | undefined>();

  function handleClickActiveShowFunction(name: ActiveFunctionType) {
    setActiveFunction(name);
  }

  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      <section>
        <Card className="flex items-center bg-transparent border-none shadow-none">
          <CardContent className="text-muted-foreground text-sm">
            <Image src="/images/pad-app.png" alt={"MJM Pad"} width={900} height={500} />
          </CardContent>
          <CardFooter>
            <CardAction>
              <div className="flex  gap-16">
                <Link
                  target="_blank"
                  href="https://apps.apple.com/us/app/mjm-pad/id6751707171"
                  className="cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <Image src="/images/appstore.png" alt="Apple Store Logo" width={200} height={200} />
                </Link>
                <Link
                  target="_blank"
                  href="https://play.google.com/store/apps/details?id=com.yojoies.mjmpad_android&hl=th"
                  className="cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <Image src="/images/googleplay.png" alt="Google play Logo" width={200} height={200} />
                </Link>
              </div>
            </CardAction>
          </CardFooter>
        </Card>
      </section>
      <section className="flex flex-col items-start">
        <p className="text-5xl font-bold ml-38 mt-8">FUNCTIONAL HIGHLIGHTS</p>
        <p className="ml-38 mt-8">
          Powerful AI tools for seamless music creation. <br />
          AI Pad, Create, record, and generate covers instantly.
        </p>
      </section>
      <section>
        <Card className="flex justify-center items-center bg-transparent border-none shadow-none">
          <CardContent className="text-muted-foreground text-sm  mt-6">
            <div className="flex flex-1 gap-4">
              {mjmPadImageData.map(app => (
                <Image
                  key={app.name}
                  onClick={() => handleClickActiveShowFunction(app.name as ActiveFunctionType)}
                  className={`object-cover hover:cursor-pointer transition-all duration-300 ease-in-out border-2 rounded-2xl ${
                    activeFunction === app.name
                      ? "border-purple-500 scale-105 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      : "border-transparent hover:border-purple-500/50 hover:scale-105"
                  }`}
                  src={app.path}
                  alt={app.name}
                  width={270}
                  height={400}
                />
              ))}
            </div>
            <div className="flex justify-center">
              {activeFunction && (
                <Image
                  key={activeFunction}
                  className="p-4 m-2 animate-in fade-in zoom-in-95 duration-700 ease-in-out slide-in-from-bottom-4 "
                  src={activeFunctions[activeFunction]}
                  alt="{MJM Pad}"
                  width={700}
                  height={700}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </section>
      <section>
        <p className="flex justify-center text-5xl font-bold text-center mt-8">UNLOCK LIMITLESS MUSICAL</p>
        <p className="flex justify-center text-5xl font-bold text-center mb-2">POSSIBILITIES</p>
      </section>
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
      <div className="flex flex-col items-center mb-4 justify-center  font-light">
        <p>Explore Endless Genres, Styles, And Creative Directions With The Power Of Advanced AI.</p>
        <p>Turn Your ideas into Fully Produced, Professional-Quality Tracks in Just Seconds.</p>
      </div>
    </div>
  );
}
