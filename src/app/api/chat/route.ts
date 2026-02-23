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
        tools,
        stopWhen: stepCountIs(20),
        system: `
คุณคือผู้ช่วยอัจฉริยะด้านดนตรี (Music Assistant)
หน้าที่ของคุณ:
1. ตอบคำถามผู้ใช้ด้วยข้อความสั้นๆ ที่เป็นมิตร
2. หากผู้ใช้ต้องการคอร์ดหรือแนะนำเพลง ให้เรียกใช้เครื่องมือ "tool-aiRecommend" เสมอ
3. สกัด 'key' (เช่น C, Am, G#) และ 'mood' (เช่น สดใส, เศร้า, Rock) จากข้อความผู้ใช้มาเป็นพารามิเตอร์
- ตัวอย่าง: "ขอเพลงเศร้าคีย์ C" -> เรียก tool-aiRecommend(key: "C", mood: "เศร้า")
`,
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
