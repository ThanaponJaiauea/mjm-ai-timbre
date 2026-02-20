/** @format */

"use client";

import { Chat } from "@/components/chat/chat";
import { use, useEffect, useState } from "react";
import { loadChat } from "@/utils/chat-utils";
import { MyUIMessage } from "@/utils/message-type";

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [messages, setMessages] = useState<MyUIMessage[]>([]);

  useEffect(() => {
    const fetchChatMessage = async () => {
      if (!id) return;
      const data = await loadChat(id);
      setMessages(data);
    };

    fetchChatMessage();
  }, [id]);

  if (!id) return null;

  return <Chat id={id} initialMessages={messages} />;
}
