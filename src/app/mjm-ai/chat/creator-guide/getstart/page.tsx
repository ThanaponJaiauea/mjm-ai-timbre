import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function GetStartPage() {
  return (
    <div className="p-20 max-w-7xl mx-auto flex flex-col gap-10">
      <section className="p-2">
        <h1 className="text-3xl font-semibold">User Manual</h1>
        <p className="mt-2">
          Yojoies AI Timbre Library is a hybrid music creation platform designed to help users generate musical ideas,
          manage sound assets, and integrate seamlessly with DAWs. The system works both Offline (logic-based engine)
          and Online (AI-powered generation).
        </p>
      </section>
      <Separator />
      <section>
        <div className="p-2">
          <h1 className="text-3xl font-semibold mb-2">Step1: Login/Register</h1>
          <p>
            Sign up from any MJM platform using the same email. Each app offers a different way to create music, but all
            share one account and Cloud Sync.
          </p>
          <ul className="list-disc m-6 ">
            <li>Same email</li>
            <li> Shared cloud sync</li>
            <li>Access anywhere</li>
          </ul>
        </div>

        <div className="flex flex-row mt-2 bg-[#1D1D1D] rounded-4xl overflow-hidden">
          <div className="m-8 p-8 text-sm w-1/2">
            <h1 className="text-xl mb-4">Website MJM</h1>
            <p>
              Use MJM directly in your browser or load it as a VST plugin inside your DAW to access sounds, manage
              projects, and keep everything synced across all MJM apps.
            </p>
            <ul className="list-disc ml-8 mt-2">
              <li>Browser-based access </li>
              <li>DAW integration via VST </li>
              <li>Project & library management </li>
              <li>Cloud Sync enabled</li>
            </ul>
          </div>
          <Image className="mt-auto" src="/images/login.svg" alt="image" width={600} height={600} />
        </div>
        <div className="flex flex-row gap-4 justify-center w-full mx-auto mt-5 ">
          <div className="p-8 bg-[#1D1D1D] border rounded-4xl mt-2">
            <p className="text-2xl">MJM AI Generate</p>
            <p className="text-zinc-400 mt-2">Generate music automatically with Ai</p>
            <Image className="mt-10" src="/images/mjm-ai.svg" alt="image" width={500} height={600} />
          </div>
          <div className="p-8 bg-[#1D1D1D] border rounded-4xl mt-2">
            <p className="text-2xl">MJM Pad</p>
            <p className="text-zinc-400 mt-2">Play and create beats using and interactive miusic pad</p>
            <Image className="mt-10" src="/images/mjm-pad.svg" alt="image" width={500} height={600} />
          </div>
        </div>
      </section>
    </div>
  );
}
