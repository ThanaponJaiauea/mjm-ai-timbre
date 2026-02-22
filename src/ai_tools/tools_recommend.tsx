/** @format */

import { tool } from "ai";
import { z } from "zod";

export const aiRecommend = tool({
  description: "Recommend a YouTube song in the DrawerShow component",
  inputSchema: z.object({}),
});

export const tools = {
  aiRecommend,
};
