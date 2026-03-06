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

      <section className="flex  gap-12 ">
        <div className="flex flex-col justify-center">
          <p className="text-xl font-semibold">Rule Engine Testing</p>
          <p className="p-4">Ensures music generation rules function properly.</p>
          <ul className="list-disc ml-8">
            <li>Selecting a “Jazz Rule” produces MIDI notes containing appropriate 7th chords</li>
            <li>Generated results follow established music theory principles</li>
          </ul>
        </div>
        <Image
          className="w-2/5 pt-6"
          src="/images/rule-engine-testing.svg"
          alt="rule engine testing"
          width={400}
          height={400}
        />
      </section>

      <Separator />

      <section className="flex gap-12 ">
        <Image
          className="w-2/5"
          src="/images/conversion-testing.svg"
          alt="conversion testing"
          width={400}
          height={400}
        />
        <div className="flex flex-col justify-center ">
          <p className="text-xl font-semibold mb-2">Conversion Testing</p>
          <p className="p-4">Validates audio conversion processes.</p>
          <ul className="list-disc ml-10">
            <li>Tests MIDI → WAV conversion accuracy</li>
            <li>Confirms correct audio duration and sound quality after export</li>
          </ul>
        </div>
      </section>

      <Separator />

      <section className="flex  gap-12">
        <div className="flex flex-col justify-center">
          <p className="text-xl font-semibold mb-4">Calculation Testing</p>
          <p className="">Verifies system calculations and transaction logic.</p>
          <ul className="list-disc ml-8">
            <li>Checks pricing calculations</li>
            <li>Ensures payment history and billing records are processed correctly</li>
          </ul>
        </div>
        <Image
          className="ml-10"
          src="/images/calculation-testing.svg"
          alt="calculation testing"
          width={500}
          height={400}
        />
      </section>

      <Separator />

      <section>
        <p className="text-2xl font-semibold mb-2">Unit Testing (Function-Level Testing)</p>
        <p>
          Unit testing verifies that individual system components and core logic work correctly according to design
          expectations.
        </p>
      </section>
      <section className="flex  gap-12 ">
        <Image
          className="w-2/5"
          src="/images/user-flow-testing.svg"
          alt="conversion testing"
          width={400}
          height={400}
        />
        <div className="flex flex-col justify-center ">
          <p className="text-xl font-semibold mb-4">User Flow Testing</p>
          <p>
            Tests the complete user journey: Register → Payment → Slip Upload → Admin Approval → VST Access Ensures
            users can successfully access features after completing required steps.
          </p>
        </div>
      </section>

      <Separator />

      <section className="flex  gap-12 ">
        <div className="flex flex-col justify-center  ">
          <p className="text-xl font-semibold mb-2">Offline to Online Workflow</p>
          <p className="">Tests hybrid system reliability.</p>
          <ul className="list-disc ml-8">
            <li>Users generate content while offline</li>
            <li>Once reconnected, all data in the Save List automatically syncs to the Cloud without loss</li>
          </ul>
        </div>
        <Image className="w-2/5" src="/images/online-workflow.svg" alt="offline testing" width={400} height={400} />
      </section>

      <Separator />

      <section className="flex  gap-12 -mb-10">
        <Image className="w-2/5" src="/images/vst-workflow.svg" alt="vst workflow" width={400} height={400} />
        <div className="flex flex-col justify-center  ">
          <p className="text-xl font-semibold mb-2">VST Workflow Testing</p>
          <p className="">Ensures stable plugin operation inside DAWs.</p>
          <ul className="list-disc ml-8">
            <li>Plugin launches correctly in DAW environments</li>
            <li>Drag-and-drop MIDI into tracks works smoothly</li>
            <li>No crashes or workflow interruptions occur</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
