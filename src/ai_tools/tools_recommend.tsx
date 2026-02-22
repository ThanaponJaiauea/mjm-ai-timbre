/** @format */

import { tool } from "ai";
import { z } from "zod";

export const aiRecommend = tool({
  description: "",
  inputSchema: z.object({
    query: z.string().min(1).max(100),
  }),
});

export const tools = {
  aiRecommend,
};
