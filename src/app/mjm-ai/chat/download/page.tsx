import { Apple, Play } from "lucide-react";
import Image from "next/image";

const availableApps = [
  {
    id: "mjm-ai",
    name: "MJM AI Music",
    description:
      "Powerful AI tools for seamless music creation. AI Pad, Create, record, and generate covers instantly.",
    icon: "/images/mjm-ai-app.png",
    appleStoreUrl: "https://apps.apple.com/us/app/mjm-ai/id6742097032",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.yojoies.mjm_app",
    badge: "Recommended ⭐",
  },
  {
    id: "mjm-pad",
    name: "MJM Pad",
    description:
      "Powerful AI tools for seamless music creation. AI Pad, Create, record, and generate covers instantly.",
    icon: "/images/mjm-pad-app.png",
    appleStoreUrl: "https://apps.apple.com/us/app/mjm-pad/id6751707171",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.yojoies.mjmpad_android",
  },
];

export default function DownloadAppPage() {
  return (
    <div
      className="flex flex-col items-center justify-start min-h-[calc(100vh-60px)] w-full
      text-white bg-linear-to-br from-[#121212] via-[#1e1e1e] to-[#252525] p-6 relative overflow-hidden overflow-y-auto"
    >
      {/* Decorative background elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl w-full text-center space-y-12 relative z-10 py-10 animate-in slide-in-from-bottom-8 duration-700 fade-in">
        {/* Typogrpahy */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400">
            DOWNLOAD APP
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Download MJM and unlock instant AI-powered sound creation, transforming your ideas into original music
            anytime, anywhere.
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto pt-6 text-left">
          {availableApps.map(app => (
            <div
              key={app.id}
              className="group relative flex flex-col p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/20 hover:bg-black/60 shadow-2xl transition-all duration-300"
            >
              {/* Optional Badge */}
              {app.badge && (
                <div className="absolute -top-4 -right-4 bg-linear-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-10">
                  {app.badge}
                </div>
              )}
              <p>{app.name}</p>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center justify-center p-3  group-hover:scale-105 transition-transform duration-300 shadow-inner">
                  <Image
                    width={500}
                    height={500}
                    src={app.icon}
                    alt={`${app.name} icon`}
                    className="w-full h-full object-contain filter drop-shadow-md"
                    title={app.name}
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="text-zinc-400 mb-8  leading-relaxed">{app.description}</p>
              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <a
                  href={app.appleStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex-1 flex items-center justify-center gap-3 h-16 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all duration-300 border border-white/10 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/20 group/btn"
                >
                  <Apple className="w-7 h-7 group-hover/btn:text-blue-400 transition-colors" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">
                      Download on the
                    </span>
                    <span className="text-lg font-bold tracking-tight">App Store</span>
                  </div>
                </a>
                <a
                  href={app.googlePlayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex-1 flex items-center justify-center gap-3 h-16 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all duration-300 border border-white/10 hover:border-green-500/50 shadow-lg hover:shadow-green-500/20 group/btn"
                >
                  <Play className="w-6 h-6 text-[#00ffcc] fill-[#00ffcc] group-hover/btn:text-green-400 group-hover/btn:fill-green-400 transition-colors" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">GET IT ON</span>
                    <span className="text-lg font-bold tracking-tight">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
        {/* Supported version note */}
        <div className="pt-8 text-sm font-medium text-zinc-500/80">Available for iOS 14.0+ and Android 8.0+</div>
      </div>
    </div>
  );
}
