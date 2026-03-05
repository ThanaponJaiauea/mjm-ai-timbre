import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function EngineGenerationPage() {
  return (
    <div className="p-20 max-w-7xl mx-auto flex flex-col gap-10">
      <section>
        <p className="text-3xl font-semibold mb-2">Multi-Engine Generation (Hybrid System)</p>
        <p>
          The music note creation feature is built as a hybrid system (Hybrid), enabling fast offline workflow while
          providing advanced intelligent capabilities when online.
        </p>
      </section>
      <section>
        <p>⚡ Offline Mode — Generate music instantly on your device </p>
        <p>☁️ Online Mode — Use Cloud AI for deeper creativity and inspiration</p>
        <p>🔄 Both modes work together seamlessly</p>
      </section>

      <Separator />

      <section>
        <p className="text-2xl font-semibold mb-2">Working Modes & Core Features</p>
        <p>Hybrid Generation System: Offline Speed & Online Intelligence</p>
      </section>

      <section className="flex justify-center">
        <Image
          className="w-full h-125"
          src={"/images/hybrid-system.svg"}
          alt="Hybrid System"
          width={600}
          height={300}
        />
      </section>

      <section>
        <p className="text-xl font-semibold">
          A. Rule-based Generator {""}
          <span className="bg-linear-to-r from-[#E759FF] to-[#6174FF] text-transparent bg-clip-text">
            (Offline Mode)
          </span>
        </p>
        <p>Hybrid Generation System: Offline Speed & Online Intelligence Works without Internet</p>
      </section>

      <section className="flex justify-center">
        <Image
          className="w-full p-10 h-125"
          src={"/images/instrument.svg"}
          alt="Hybrid System"
          width={600}
          height={300}
        />
      </section>

      <section>
        <p className="text-xl font-semibold">
          B. AI Generator{" "}
          <span className="bg-linear-to-r from-[#E759FF] to-[#6174FF] text-transparent bg-clip-text">
            (Online Mode)
          </span>{" "}
        </p>
        <p>Advanced Cloud AI Music , Powered by Cloud AI</p>
      </section>
      <section className="flex justify-center gap-10 p-10 ">
        <Image src={"/images/text-to-midi.svg"} alt="Hybrid System" width={600} height={300} />
        <Image src={"/images/referance-to-midi.svg"} alt="Hybrid System" width={600} height={300} />
      </section>
      <section className="-mb-10">
        <p className="text-xl font-semibold">C. Output & Conversion System</p>
        <p>Flexible Export Options , High-Quality Audio</p>
      </section>
      <section className="flex justify-center ">
        <Image
          className="w-full p-10 h-125 -mb-20"
          src={"/images/midi-file.svg"}
          alt="Hybrid System"
          width={600}
          height={300}
        />
      </section>
    </div>
  );
}
