/** @format */
import { tool } from "ai";
import { z } from "zod";

export const aiRecommend = tool({
  description: "Summarize the key and mood of the song based on the user's request, in order to suggest chords.",
  parameters: z.object({
    key: z.string().describe("คีย์ของเพลง เช่น C, Am, G, F#m"),
    mood: z.string().describe("อารมณ์หรือแนวเพลง เช่น Pop, Jazz, Rock, Sad, Happy"),
  }),
  execute: async ({ key, mood }) => {
    return { key, mood };
  },
});

export const tools = {
  aiRecommend,
};
