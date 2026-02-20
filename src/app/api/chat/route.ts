/** @format */

import { saveChat } from "@/api/chatHistory";
import { loadChat } from "@/utils/chat-utils";
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

export const maxDuration = 30;

const ollama = createOllama({
  baseURL: process.env.OLLAMA_SERVER,
});

export async function POST(req: Request) {
  const { message, chatId }: { message: UIMessage; chatId: string } = await req.json();

  await saveChat({ chatId, messages: [message], mode: "CHAT_AI" });
  const messages = await loadChat(chatId);
  console.log("messages===", JSON.stringify(messages, null, 2));

  // --- Stream response ---
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      if (message.role === "user") {
        writer.write({ type: "start", messageId: generateId() });
        writer.write({ type: "start-step" });
      }

      const result = streamText({
        model: ollama("gpt-oss:20b"),
        messages: convertToModelMessages(messages),
        stopWhen: stepCountIs(20),
      });

      result.consumeStream();
      writer.merge(result.toUIMessageStream({ sendStart: false }));
    },
    onError: error => (error instanceof Error ? error.message : String(error)),
    originalMessages: messages,
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
