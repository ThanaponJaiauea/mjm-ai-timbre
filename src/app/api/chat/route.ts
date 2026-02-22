/** @format */

import { tools } from "@/ai_tools/tools_recommend";
import {
  UIMessage,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  stepCountIs,
  streamText,
} from "ai";
import { createOllama } from "ollama-ai-provider-v2";
import { saveChat } from "@/api/chatHistory";

export const maxDuration = 30;

const ollama = createOllama({
  baseURL: process.env.OLLAMA_SERVER,
});

export async function POST(req: Request) {
  const { message, chatId }: { message: UIMessage; chatId: string } = await req.json();

  await saveChat({ chatId, messages: [message], mode: "CHAT_AI" });
  const modelMessages = await convertToModelMessages([message]);

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      if (message.role === "user") {
        writer.write({ type: "start", messageId: generateId() });
        writer.write({ type: "start-step" });
      }

      const result = streamText({
        model: ollama("gpt-oss:20b"),
        messages: modelMessages,
        stopWhen: stepCountIs(20),
        tools: tools,
        system: "You need to use toolsRecommend constantly.",
      });

      result.consumeStream();
      writer.merge(result.toUIMessageStream({ sendStart: false }));
    },

    onError: error => (error instanceof Error ? error.message : String(error)),

    originalMessages: [message],
    onFinish: async ({ responseMessage }) => {
      try {
        saveChat({ chatId, messages: [responseMessage], mode: "CHAT_AI" });
      } catch (error) {
        console.error(error);
      }
    },
  });

  return createUIMessageStreamResponse({ stream });
}
