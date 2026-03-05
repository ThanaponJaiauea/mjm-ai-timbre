import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function TimbrePage() {
  return (
    <div className="p-20 max-w-7xl mx-auto flex flex-col gap-10">
      <section>
        <p className="text-3xl font-semibold mb-4">Smart Timbre Libary</p>
        <p>
          The Smart Timbre Library organizes, syncs, and discovers your sounds automatically — enabling seamless
          workflow across Offline and Online environments.
        </p>
      </section>

      <Separator />

      <section>
        <p className="text-2xl font-semibold mb-4">Save List (Hybrid Storage)</p>
        <p>Automatic Sound Storage & Backup</p>
      </section>

      <section className="flex items-end justify-center">
        <Image src="/images/timbre.png" alt="Sidebar Menu" width={1000} height={500} />
      </section>

      <section className="flex justify-between">
        <div className="flex flex-col">
          <p className="text-xl font-semibold mb-4">💻 Local Save List</p>
          <p>Offline Ready Storage</p>
          <ul className="list-disc ml-6">
            <li>Saves MIDI and creation history locally</li>
            <li>Instant access without internet</li>
            <li>Fast loading from device storage</li>
          </ul>
          <p>👉 Badge: Offline Mode</p>
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-semibold mb-4">☁ Cloud Backup</p>
          <p>Automatic Cloud Protection</p>
          <ul className="list-disc ml-6">
            <li>Syncs after login</li>
            <li>Access projects across devices</li>
            <li>No manual upload required</li>
          </ul>
          <p>👉 Badge: Auto Sync</p>
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-semibold mb-4">🏷 Metadata Tagging</p>
          <p>Automatically records:</p>
          <ul className="list-disc ml-6">
            <li>Instrument type</li>
            <li>Creation date</li>
            <li>Parameters & rules used</li>
          </ul>
          <p>👉 Makes Recall instant</p>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col space-y-4">
        <p className="text-2xl font-semibold ">Sync System (Background Intelligent Sync)</p>
        <p className="text-xl font-semibold">Conflict Resolution </p>
        <p>
          If the same file is modified in both Offline and Online environments, the system uses timestamp comparison to
          automatically select the latest version, or prompts the user to choose a version to prevent data conflicts.
        </p>
        <p className="text-xl font-semibold">Bandwidth Optimization</p>
        <p>
          When handling large files (such as WAV files), the system prioritizes syncing MIDI files first due to their
          smaller size. This allows users to instantly see their file list, while larger audio files are uploaded
          silently in the background once the network connection becomes stable.
        </p>
        <p className="text-xl font-semibold">Offline Access Token</p>
        <p>
          License information is securely stored on the user’s device in advance, allowing paid users to continue
          accessing their personal sound library even when the internet connection is unavailable.
        </p>
      </section>

      <Separator />

      <section className="flex flex-col space-y-4">
        <p className="text-2xl font-semibold ">Timbre Discovery (Content-Based Sound Search)</p>
        <p className="text-xl font-semibold">Similarity Search</p>
        <p>
          Instead of searching by file name, users can press the “Similar” button to find sounds with comparable audio
          characteristics. The system uses vector embeddings to analyze sonic properties such as harmonics, attack, and
          decay to recommend similar timbres.
        </p>
        <p className="text-xl font-semibold">Cloud Library Integration</p>
        <p>
          If no matching sound is found locally, the system automatically recommends similar sounds from the Yojoies
          Cloud Library, which is continuously updated with new sound content every month.
        </p>
      </section>
    </div>
  );
}
