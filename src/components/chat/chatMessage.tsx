/** @format */

import {UIDataTypes, UIMessagePart, UITools} from "ai";
import DrawerShow from "../drawer";
import {Response} from "@/components/ai-elements/response";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export function ChatMessage({
  part,
  role,
}: {
  part: UIMessagePart<UIDataTypes, UITools>;
  role: string;
}) {
  // ข้อความปกติ
  if (part.type === "text" && part.text.trim()) {
    return (
      <div
        className={`p-2 rounded break-words whitespace-pre-wrap ${
          role === "user"
            ? "bg-blue-500 text-white self-end"
            : "text-white self-start w-full"
        }`}>
        {/* <Response remarkPlugins={[remarkGfm]}>{part.text}</Response> */}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => (
              <h1
                className="text-xl font-bold mb-2"
                {...props}
              />
            ),
            h2: ({node, ...props}) => (
              <h2
                className="text-lg font-semibold mb-2"
                {...props}
              />
            ),
            h3: ({node, ...props}) => (
              <h3
                className="text-md font-semibold mb-1"
                {...props}
              />
            ),
            a: ({node, ...props}) => (
              <a
                className="text-blue-400 underline"
                target="_blank"
                {...props}
              />
            ),
            ul: ({node, ...props}) => (
              <ul
                className="list-disc ml-5 mb-2"
                {...props}
              />
            ),
            ol: ({node, ...props}) => (
              <ol
                className="list-decimal ml-5 mb-2"
                {...props}
              />
            ),
            li: ({node, ...props}) => (
              <li
                className="mb-1"
                {...props}
              />
            ),
            strong: ({node, ...props}) => (
              <strong
                className="font-bold"
                {...props}
              />
            ),
          }}>
          {part.text}
        </ReactMarkdown>
      </div>
    );
  }

  // แสดงผล tool-webSearch
  if (part.type === "tool-webSearch" && part.output?.length) {
    const data = part.output.find(
      (el) => el.url.includes("youtube.com") || el.url.includes("youtu.be")
    );

    if (data) {
      let videoId = "";
      if (data.url.includes("watch?v=")) {
        videoId = new URL(data.url).searchParams.get("v")!;
      } else if (data.url.includes("youtu.be")) {
        videoId = data.url.split("/").pop()!;
      }

      return (
        <div className="self-start w-full space-y-2">
          <div className="relative w-full md:w-2/5 pb-[20%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    }
  }

  // แสดงผล playSongDemo
  if (part.type === "tool-playSongDemo") {
    console.log("part", part);

    const url = part.output?.url || part.output?.output?.url;
    if (url) {
      return (
        <div className="flex flex-col md:flex-row items-start gap-4 self-start w-full">
          <DrawerShow url={url} />
        </div>
      );
    }
  }

  return null;
}
