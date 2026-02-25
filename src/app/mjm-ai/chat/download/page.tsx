import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

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

export default function DownloadAppPage() {
  return (
    <div
      className="flex flex-col items-center justify-start min-h-[calc(100vh-60px)] w-full
    text-white bg-linear-to-br from-[#121212] via-[#1e1e1e] to-[#252525] p-4 sm:p-6 relative overflow-hidden overflow-y-auto"
    >
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-6xl w-full text-center space-y-8 sm:space-y-12 relative z-10 py-6 sm:py-10 animate-in slide-in-from-bottom-8 duration-700 fade-in">
        <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">DOWNLOAD APP</h1>
          <p className="text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed">
            Download MJM and unlock instant AI-powered sound creation, transforming your ideas into original music
            anytime, anywhere.
          </p>
        </div>
      </div>
      <Tabs defaultValue="mjm-pad" className="w-4/5">
        <TabsList className="w-full">
          <TabsTrigger value="mjm-ai">MJM AI</TabsTrigger>
          <TabsTrigger value="mjm-pad">MJM Pad</TabsTrigger>
        </TabsList>
        <TabsContent value="mjm-ai">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                View your key metrics and recent project activity. Track progress across all your active projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              You have 12 active projects and 3 pending tasks.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mjm-pad">
          <div className="flex flex-col gap-4 p-2 mt-4">
            <Card className="flex justify-center items-center">
              <CardContent className="text-muted-foreground text-sm">
                <Image src="/images/mjm-ai-app.png" alt={"MJM Pad"} width={400} height={400} />
              </CardContent>
            </Card>
            <p className="text-2xl font-bold">FUNCTIONAL HIGHLIGHTS</p>
            <Card className="flex justify-center items-center">
              <CardContent className="text-muted-foreground text-sm">
                <div className="flex flex-1 gap-4">
                  {mjmPadImageData.map(app => (
                    <Image
                      key={app.name}
                      className="hover:scale-105  hover:border-blue-500 border rounded-3xl transition duration-250 ease-in-out"
                      src={app.path}
                      alt={app.name}
                      width={300}
                      height={400}
                    />
                  ))}
                </div>
                <div className="flex justify-center">
                  <Image className="p-4 m-2" src="/images/pad.png" alt="{MJM Pad}" width={500} height={500} />
                </div>
              </CardContent>
            </Card>
            <p className="flex justify-center text-2xl font-bold">UNLOCK LIMILESS MUSICAL</p>
            <p className="flex justify-center text-2xl font-bold">POSSIBILTES</p>
            <Card>
              <CardContent>
                <Image className="w-full pt-2" src="/images/pad-style.png" alt="{MJM Pad}" width={500} height={500} />
                <div className="flex flex-col items-center mt-4 mb-4 justify-center text-sm font-light">
                  <p>Explore Endless Genres, Styles, And Creative Directions With The Power Of Advanced AI.</p>
                  <p>Turn Your ideas into Fully Produced, Professional-Quality Tracks in Just Seconds.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
