/** @format */

import { tool } from "ai";
import { z } from "zod";

const toolsRecommend = tool({
  description: "Recommend a YouTube song in the DrawerShow component for demo purposes",
  inputSchema: z.object({
    url: z.string().url(),
    title: z.string(),
    artist: z.string(),
  }),
  execute: async () => {
    const data = "toolsRecommend";

    return {
      data,
    };
  },
});

export const tools = {
  toolsRecommend,
};
