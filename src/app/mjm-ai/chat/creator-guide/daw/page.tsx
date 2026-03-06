import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function DawPage() {
  return (
    <div className="max-w-7xl mx-auto p-20">
      <div className="flex flex-col gap-10">
        <section>
          <h1 className="text-3xl font-semibold">DAW Integration (VST Display)</h1>
          <p className="text-base font-extralight mt-4">
            The VST Display allows seamless integration between the plugin and your Digital Audio Workstation (DAW),
            making it easy to move and use generated music directly inside your project.
          </p>
        </section>
        <Separator />
        <section>
          <Image src="/images/daw/workflow.svg" alt="DAW Integration" width={1200} height={800} />
          <h1 className="text-2xl font-semibold mt-12">🎵 Drag-and-Drop Workflow</h1>
          <p className="text-base font-extralight mt-4">
            Users can drag MIDI files directly from the plugin into a track within their DAW.
          </p>
          <ul className="list-disc list-inside pl-4 font-extralight">
            <li>No manual export required</li>
            <li>Instantly transfer generated MIDI into your project</li>
            <li>Compatible with standard DAW workflows</li>
          </ul>
          <p className="text-base font-extralight">
            ✅ Simply drag the MIDI file and drop it onto a DAW track to start editing immediately.
          </p>
        </section>
        <Separator />
        <section>
          <h1 className="text-2xl font-semibold">🔐 Offline Grace Period</h1>
          <p className="text-base font-extralight mt-4">
            The VST plugin remains fully usable even without an internet connection.
          </p>
          <ul className="list-disc list-inside pl-4 font-extralight">
            <li>Works offline for up to 7 days</li>
            <li>No interruption during ongoing projects</li>
            <li>License re-sync is required only after the grace period ends</li>
          </ul>
          <p className="text-base font-extralight">
            💡 This ensures uninterrupted music production when working offline or traveling.
          </p>
        </section>
      </div>
    </div>
  );
}
