import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function TestStrategyPage() {
  return (
    <div className="max-w-7xl p-20 flex flex-col mx-auto gap-10">
      <section>
        <p className="text-3xl font-semibold mb-4">Quality Assurance (Development Team Testing)</p>
        <p>
          To ensure system stability, accuracy, and a reliable user experience, the platform undergoes multiple levels
          of testing performed by the development team before each release.
        </p>
      </section>

      <Separator />

      <section>
        <p className="text-2xl font-semibold mb-4">Unit Testing (Function-Level Testing)</p>
        <p>
          Unit testing verifies that individual system components and core logic work correctly according to design
          expectations.
        </p>
      </section>

      <section className="flex gap-12 justify-between ">
        <div className="flex flex-col justify-center">
          <p className="text-xl font-semibold ml-4">Rule Engine Testing</p>
          <p className="p-4">Ensures music generation rules function properly.</p>
          <ul className="list-disc ml-10">
            <li>Selecting a “Jazz Rule” produces MIDI notes containing appropriate 7th chords</li>
            <li>Generated results follow established music theory principles</li>
          </ul>
        </div>
        <div className="flex w-80">
          <div className="flex flex-col justify-center items-center ">
            <Image className="mb-2" src="/icons/microphone.svg" alt=" rule engine testing" width={50} height={40} />
            <p>Rule Engine Testing</p>
            <p className="text-muted-foreground">Checks pricing and payment accuracy.</p>
          </div>
          <div className="ml-auto h-full w-[0.5px] bg-linear-to-b from-white to-white/12"></div>
        </div>
      </section>

      <Separator />

      <section className="flex gap-12 justify-between ">
        <div className="flex w-80">
          <div className="flex flex-col justify-center items-center text-center">
            <Image className="mb-2" src="/icons/conversion.svg" alt=" conversion testing" width={50} height={40} />
            <p>Conversion Testing</p>
            <p className="text-muted-foreground">Verifies accurate MIDI-to-audio conversion.</p>
          </div>
          <div className="ml-auto h-full w-[0.5px] bg-linear-to-b from-white to-white/12"></div>
        </div>
        <div className="flex flex-col justify-center w-3/5">
          <p className="text-xl font-semibold ml-4">Conversion Testing</p>
          <p className="p-4 ">Validates audio conversion processes.</p>
          <ul className="list-disc ml-10">
            <li>Tests MIDI → WAV conversion accuracy</li>
            <li>Confirms correct audio duration and sound quality after export</li>
          </ul>
        </div>
      </section>

      <Separator />

      <section className="flex gap-12 justify-between ">
        <div className="flex flex-col justify-center">
          <p className="text-xl font-semibold ml-4">Calculation Testing</p>
          <p className="p-4">Verifies system calculations and transaction logic.</p>
          <ul className="list-disc ml-10">
            <li>Checks pricing calculations</li>
            <li>Ensures payment history and billing records are processed correctly</li>
          </ul>
        </div>
        <div className="flex w-80">
          <div className="flex flex-col justify-center items-center ">
            <Image className="mb-2" src="/icons/calculation.svg" alt="calculation testing" width={50} height={40} />
            <p>Calculation Testing</p>
            <p className="text-muted-foreground">Checks pricing and payment accuracy.</p>
          </div>
          <div className="ml-auto h-full w-[0.5px] bg-linear-to-b from-white to-white/12"></div>
        </div>
      </section>

      <Separator />

      <section>
        <p className="text-2xl font-semibold mb-2">Unit Testing (Function-Level Testing)</p>
        <p>
          Unit testing verifies that individual system components and core logic work correctly according to design
          expectations.
        </p>
      </section>
      <section className="flex gap-12 justify-between ">
        <div className="flex w-80">
          <div className="flex flex-col justify-center items-center text-center">
            <Image className="mb-2" src="/icons/user-flow.svg" alt=" conversion testing" width={50} height={40} />
            <p>User Flow Testing</p>
            <p className="text-muted-foreground">Validates Core Functions And Components.</p>
          </div>
          <div className="ml-auto h-full w-[0.5px] bg-linear-to-b from-white to-white/12"></div>
        </div>
        <div className="flex flex-col justify-center w-3/5">
          <p className="text-xl font-semibold ml-4">User Flow Testing</p>
          <p className="p-4 ">
            Tests Full User Journey: Register → Payment → Upload Slip → Admin Approval → VST Access Ensures Successful
            Feature Access.
          </p>
        </div>
      </section>

      <Separator />

      <section className="flex gap-12 justify-between ">
        <div className="flex flex-col justify-center">
          <p className="text-xl font-semibold ml-4">Offline to Online Workflow</p>
          <p className="p-4">Tests hybrid system reliability.</p>
          <ul className="list-disc ml-10">
            <li>Users generate content while offline</li>
            <li>Once reconnected, all data in the Save List automatically syncs to the Cloud without loss</li>
          </ul>
        </div>
        <div className="flex w-80">
          <div className="flex flex-col justify-center items-center ">
            <Image
              className="mb-2"
              src="/icons/offline-online.svg"
              alt="offline to online testing"
              width={50}
              height={40}
            />
            <p>Offline to Online Workflow</p>
            <p className="text-muted-foreground">Tests hybrid system reliability.</p>
          </div>
          <div className="ml-auto h-full w-[0.5px] bg-linear-to-b from-white to-white/12"></div>
        </div>
      </section>

      <Separator />

      <section className="flex gap-12 justify-between ">
        <div className="flex w-80">
          <div className="flex flex-col justify-center items-center text-center">
            <Image className="mb-2" src="/icons/vst.svg" alt="vst workflow testing" width={50} height={40} />
            <p>VST Workflow Testing</p>
            <p className="text-muted-foreground">Ensures stable plugin operation inside DAWs.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center w-3/5">
          <p className="text-xl font-semibold ml-4">VST Workflow Testing</p>
          <p className="p-4 ">Ensures stable plugin operation inside DAWs.</p>
          <ul className="list-disc ml-10">
            <li>Plugin launches correctly in DAW environments</li>
            <li>Drag-and-drop MIDI into tracks works smoothly</li>
            <li>No crashes or workflow interruptions occur</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
