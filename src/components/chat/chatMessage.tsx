/** @format */

import { UIDataTypes, UIMessagePart, UITools } from "ai";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { ChordRecommend } from "@/components/chordRecommend/ChordRecommend";

export function ChatMessage({ part, role }: { part: UIMessagePart<UIDataTypes, UITools>; role: string }) {
  // ข้อความปกติ
  if (part.type === "text" && part.text.trim()) {
    return (
      <div
        className={`p-2 rounded break-words whitespace-pre-wrap ${
          role === "user" ? "bg-blue-500 text-white self-end" : "text-white self-start w-full"
        }`}
      >
        {/* <Response remarkPlugins={[remarkGfm]}>{part.text}</Response> */}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mb-2" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-md font-semibold mb-1" {...props} />,
            a: ({ node, ...props }) => <a className="text-blue-400 underline" target="_blank" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc ml-5 mb-2" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal ml-5 mb-2" {...props} />,
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
          }}
        >
          {part.text}
        </ReactMarkdown>
      </div>
    );
  }

  // แสดงผล toolsRecommend
  if (part.type === "tool-toolsRecommend") {
    return (
      <div className="flex flex-col md:flex-row items-start gap-4 self-start w-full">
        <ChordRecommend />
      </div>
    );
  }

  return null;
}
