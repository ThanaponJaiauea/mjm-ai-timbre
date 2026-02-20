/** @format */

export type TChatHistory = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  messages?: TChatMessage[];
  ui: "chat" | "drum";
};

export type TChatMessage = {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
  ui: "chat" | "drum";
  image?: string | null;
  spotify?: string | null;
  spotifyId?: string | null;
  video?: string | null;
  // midi?: Uint8Array<any> | null;
  url?: string | null;
};

export type TChatMode = "chat" | "drum";
