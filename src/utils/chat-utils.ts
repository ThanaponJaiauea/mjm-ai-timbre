/** @format */

import {getChatMessages} from "@/api/chatHistory";
import {mapDBPartToUIMessagePart} from "./message-mapping";
import {MyUIMessage} from "./message-type";

export const loadChat = async (chatId: string): Promise<MyUIMessage[]> => {
  const result = await getChatMessages(chatId);

  return (result.data.data as any[]).map((message) => ({
    id: message.id,
    role: message.role,
    parts: message.parts.map((part) => mapDBPartToUIMessagePart(part)),
  }));
};
