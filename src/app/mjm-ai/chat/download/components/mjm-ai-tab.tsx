import { Card, CardAction, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const coreFeatureData = [
  {
    id: "create-song",
    title: "Create Song",
    description:
      "Simply enter your desired style, mood, and song description and our AI will create a unique, original track tailored to your creative vision.",
    icon: "/icons/note.svg",
    activeIcon: "/icons/note-active.svg",
  },
  {
    id: "music-explorer",
    title: "Music Explorer",
    description:
      "Explore your favorite genres and let AI craft an original track tailored to your musical preferences and creative expression.",
    icon: "/icons/search.svg",
    activeIcon: "/icons/search-active.svg",
  },
  {
    id: "change-model-voice",
    title: "Change Model Voice",
    description:
      "Transform the original generated vocals into your own voice or any selected voice model, seamlessly personalizing the track while preserving the song’s melody and structure.",
    icon: "/icons/generate.svg",
    activeIcon: "/icons/generate-active.svg",
  },
];

const coreFeatureImages = {
  "create-song": "/images/create-song.png",
  "music-explorer": "/images/music-explorer.png",
  "change-model-voice": "/images/change-model-voice.png",
} as const;

type coreFeatureType = keyof typeof coreFeatureImages;

const exploreImages = [
  { src: "/images/1.svg", className: "top-[15%] left-[15%] w-28 h-28" },
  { src: "/images/2.svg", className: "top-[40%] left-[5%] w-20 h-20" },
  { src: "/images/3.svg", className: "bottom-[20%] left-[8%] w-32 h-32" },
  { src: "/images/4.svg", className: "bottom-[15%] left-[25%] w-24 h-24" },
  { src: "/images/5.svg", className: "top-[15%] right-[15%] w-32 h-32" },
  { src: "/images/6.svg", className: "top-[35%] right-[5%] w-24 h-24" },
  { src: "/images/7.svg", className: "bottom-[20%] right-[8%] w-28 h-28" },
  { src: "/images/8.svg", className: "bottom-[15%] right-[25%] w-20 h-20" },
];

export function MjmAiTab() {
  const [activeCoreFeture, setActiveCoreFeture] = useState<coreFeatureType>("create-song");

  function handleClickActiveCore(id: coreFeatureType) {
    setActiveCoreFeture(id);
  }

  return (
    <div className="flex flex-col gap-4">
      <section>
        <Card className="flex items-center bg-transparent border-none shadow-none">
          <CardContent className="text-muted-foreground text-sm">
            <Image src="/images/mjm-app.png" alt={"MJM Pad"} width={900} height={500} />
          </CardContent>
          <CardFooter>
            <CardAction>
              <div className="flex gap-16">
                <Link
                  target="_blank"
                  href="https://apps.apple.com/us/app/mjm-ai/id6742097032"
                  className="cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <Image src="/images/appstore.png" alt="Apple Store Logo" width={200} height={200} />
                </Link>
                <Link
                  target="_blank"
                  href="https://play.google.com/store/apps/details?id=com.yojoies.mjm_app&hl=th"
                  className="cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <Image src="/images/googleplay.png" alt="Google Play Logo" width={200} height={200} />
                </Link>
              </div>
            </CardAction>
          </CardFooter>
        </Card>
      </section>
      <section className="bg-transparent border-none shadow-none">
        <div className="flex justify-start ml-56 mb-8">
          <p className="text-5xl font-bold mt-8">CORE FEATURES</p>
        </div>
        <div className="flex justify-start ml-52">
          <p className=" text-center">
            Advanced Ai Features That turn Your ideas into Fully <br />
            Customized, Studio-Quality Music.
          </p>
        </div>
      </section>
      <section>
        <div className="flex flex-row justify-center gap-3 p-4 ">
          <div className="w-2/4">
            {coreFeatureData.map((feature, index) => (
              <Card
                key={index}
                className={cn(
                  "cursor-pointer transition-all duration-300 ease-out group",
                  activeCoreFeture === feature.id
                    ? "border border-blue-200 border-t-0 border-l-4 border-r-0 border-b-0 rounded-none mt-2 scale-[1.02] bg-white/5 shadow-[0_0_15px_rgba(231,89,255,0.15)]"
                    : "border-none bg-transparent hover:translate-x-2 hover:bg-white/5"
                )}
                onClick={() => handleClickActiveCore(feature.id as coreFeatureType)}
              >
                <CardHeader className="flex gap-4">
                  <div className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    {activeCoreFeture === feature.id ? (
                      <Image src={feature.activeIcon} alt={feature.title} width={30} height={50} />
                    ) : (
                      <Image src={feature.icon} alt={feature.title} width={30} height={50} />
                    )}
                  </div>
                  <h1
                    className={cn(
                      "transition-colors duration-300",
                      activeCoreFeture === feature.id
                        ? "text-2xl font-extrabold bg-linear-to-r from-[#E759FF] to-[#6174FF] text-transparent bg-clip-text inline-block"
                        : "text-2xl text-zinc-300 group-hover:text-zinc-100"
                    )}
                  >
                    {feature.title}
                  </h1>
                </CardHeader>
                <CardContent
                  className={cn(
                    "flex justify-start transition-colors duration-300",
                    activeCoreFeture === feature.id ? "text-white" : "text-muted-foreground group-hover:text-gray-300"
                  )}
                >
                  {feature.description}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <Image
              key={activeCoreFeture}
              src={coreFeatureImages[activeCoreFeture]}
              alt="mjm"
              width={250}
              height={250}
              className="drop-shadow-2xl animate-[fadeInRight_0.4s_ease-out]"
            />
          </div>
        </div>
      </section>

      <section className="relative w-full min-h-125 md:min-h-150 flex flex-col items-center justify-center rounded-[3rem]  mt-12 overflow-hidden shadow-sm">
        {exploreImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute rounded-full overflow-hidden shadow-xl hidden md:block animate-float-${idx % 3} ${img.className}`}
          >
            <Image src={img.src} alt="Explore" fill className="object-cover" />
          </div>
        ))}

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <h1
            className="text-3xl font-black text-white tracking-widest leading-snug"
            style={{
              textShadow: "0px 15px 30px rgba(0,0,0,0.15), 0px 4px 10px rgba(0,0,0,0.1), 0px 0px 2px rgba(0,0,0,0.15)",
            }}
          >
            YOU CAN START EXPLORING
            <br />
            OUR APP TODAY.
          </h1>
          <p className="mt-8 mb-4 text-white font-medium max-w-md">
            Creativity belongs to everyone. Our app is designed to be open, simple, And accessible to all users — with
            powerful AI tools to help you create and customize music effortlessly, wherever inspiration strikes.
          </p>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes fadeInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes float0 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
          @keyframes float1 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
          @keyframes float2 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          .animate-float-0 { animation: float0 6s ease-in-out infinite; }
          .animate-float-1 { animation: float1 7s ease-in-out infinite; animation-delay: 1.5s; }
          .animate-float-2 { animation: float2 5s ease-in-out infinite; animation-delay: 3s; }
        `,
          }}
        />
      </section>
    </div>
  );
}
