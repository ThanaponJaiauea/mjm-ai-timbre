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

const ALLOWED_KEYS = ["A", "Ab", "B", "Bb", "C", "D", "Db", "E", "Eb", "F", "F#", "G"];

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
        toolChoice: "auto",
        system: `คุณคือ Music Assistant
หน้าที่: สกัด Key และ Mood จาก User แล้วส่งเข้าเครื่องมือ 'aiRecommend' **ทันที**

กฎข้อบังคับ:
1. เมื่อได้รับคำขอ ต้องใช้ tool 'aiRecommend' เสมอ
2. พารามิเตอร์ 'key':
   - หาก User ระบุมา ให้ใช้คีย์นั้น
   - หาก User **ไม่ระบุ** คีย์มา ให้คุณเลือกคีย์จาก ${ALLOWED_KEYS} มา 1 คีย์ (แนะนำให้เลือกคีย์ที่เข้ากับ Mood เช่น C หรือ G สำหรับเพลงสนุก และ Am หรือ Em สำหรับเพลงเศร้า) **ห้ามปล่อยว่าง**
3. พารามิเตอร์ 'mood': ให้สรุปเป็นภาษาอังกฤษสั้นๆ
4. ห้ามตอบเป็นข้อความเปล่าๆ โดยไม่เรียกใช้ tool 'aiRecommend'

ตัวอย่างขั้นตอน:
User: "ขอเพลงแนวสดใสหน่อย"
Assistant: (วิเคราะห์แล้วเลือกคีย์ C ให้) -> เรียก aiRecommend(key: "C", mood: "Bright, Happy")`,
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
