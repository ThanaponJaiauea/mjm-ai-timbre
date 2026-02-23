/** @format */
import { tool } from "ai";
import { z } from "zod";

const keys = ["A", "Ab", "B", "Bb", "C", "D", "Db", "E", "Eb", "F", "F#", "G"] as const;

export const aiRecommend = tool({
  description: "Summarize the key and mood into English terms supported by the database.",
  parameters: z.object({
    key: z.enum(keys).describe("The musical key (Must be one of the allowed keys)"),
    mood: z.string().describe("The mood in English that best matches the user's request"),
  }),
  execute: async ({ key, mood }) => {
    return { key, mood };
  },
});

export const tools = {
  aiRecommend,
};
