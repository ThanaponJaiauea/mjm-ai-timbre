/** @format */

"use client";

import {Chat} from "@/components/chat/chat";
import {use, useEffect, useState} from "react";
import {loadChat} from "@/utils/chat-utils";
import {MyUIMessage} from "@/utils/message-type";

export default function ChatPage({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params);

  const [messages, setMessages] = useState<MyUIMessage[]>([]);

  const fetchChatMessage = async (id: string) => {
    const data = await loadChat(id);
    setMessages(data);
  };

  useEffect(() => {
    if (id) {
      fetchChatMessage(id);
    }
  }, [id]);

  if (!id) return null;

  return (
    <Chat
      id={id}
      initialMessages={messages}
    />
  );
}
