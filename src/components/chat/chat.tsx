/** @format */
"use client";

import { useLanguage } from "@/hooks/LanguageProvider";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { useChatContext } from "@/hooks/ChatContext";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useState } from "react";
import LoaderChat from "@/components/loaderChat/loaderChat";
import ChatFirstPage from "@/components/chat/ChatFirstPage";
import ChordRecommend from "@/components/ChordRecommend";
import ChatPromptInput from "./chatPromptInput";
import { ModelSelected } from "@/components/modal/model_selected";
import { get_all_by_type } from "@/api/music";

import { Inter } from "next/font/google";
import { toast } from "sonner";

const inter = Inter({});

interface Props {
  id?: string;
  initialMessages?: any[];
}

export function Chat({ id, initialMessages }: Props) {
  const { loadChatHistory, chatMode } = useChatContext();

  /* -------------------- CHAT SDK -------------------- */
  const { messages, sendMessage, status, setMessages } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          message: messages[messages.length - 1],
          chatId: id,
        },
      }),
    }),
    onFinish: ({ messages }) => {
      if (messages.length <= 2) loadChatHistory();
    },
    onError: error => {
      console.error(error);
      toast("Error: " + error);
    },
  });

  console.log("messages:", messages);

  /* -------------------- INPUT -------------------- */
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim() || isSubmitting || status === "streaming") return;
    setIsSubmitting(true);
    sendMessage({ text: message.text });
    setText("");
  };

  useEffect(() => {
    if (status !== "streaming") setIsSubmitting(false);
  }, [status]);

  useEffect(() => {
    if (initialMessages?.length) setMessages(initialMessages);
  }, [initialMessages, setMessages]);

  /* -------------------- MODEL SELECTED -------------------- */
  const [openModel, setOpenModel] = useState(false);
  const [selectModel, setSelectModel] = useState<string | null>(null);
  const [dataType, setDataType] = useState<any>(null);

  const handleSelectOption = async (option: string) => {
    setSelectModel(option);

    if (["genre", "key", "mood", "instrumental"].includes(option)) {
      setOpenModel(true);

      if (option === "genre" || option === "key" || option === "mood") {
        const res = await get_all_by_type(option);
        setDataType(res.data);
      }
    }
  };

  const handleSelectValue = (value: string) => {
    setText(prev => (prev ? `${prev}, ${value}` : value));
    clearModel();
  };

  const clearModel = () => {
    setOpenModel(false);
    setSelectModel(null);
    setDataType(null);
  };

  /* -------------------- RENDER -------------------- */
  const lastMessage = messages[messages.length - 1];
  const assistantTyping = lastMessage?.role === "assistant" && lastMessage.parts.some(p => p.type === "text" && p.text);

  return (
    <div className="relative flex flex-col w-full h-screen bg-black overflow-hidden z-0">
      <Conversation>
        <ConversationContent>
          {chatMode === "chat" && messages.length === 0 && (
            <ChatFirstPage
              value={text}
              onChange={setText}
              onSubmit={handleSubmit}
              onSelectOption={handleSelectOption}
              isStreaming={status === "streaming"}
            />
          )}

          {messages.map(msg => {
            const hasRenderable = msg.parts.some(
              p => (p.type === "text" && p.text) || (p.type === "tool-aiRecommend" && p.output)
            );
            if (msg.role === "assistant" && !hasRenderable) return null;

            return (
              <Message from={msg.role} key={msg.id}>
                <MessageContent className={inter.className}>
                  {msg.parts.map((part, i) => {
                    const partKey = `${msg.id}-part-${i}`;

                    if (part.type === "text") {
                      return (
                        <Response key={partKey} shikiTheme={["dark-plus"]}>
                          {part.text}
                        </Response>
                      );
                    }
                    if (part.type === "tool-aiRecommend") {
                      const d = part.args || part.input;
                      return (
                        <ChordRecommend
                          key={partKey}
                          initialData={{
                            key: d?.key ?? "C",
                            mood: d?.mood ?? "Pop",
                          }}
                        />
                      );
                    }

                    return null;
                  })}
                </MessageContent>
              </Message>
            );
          })}

          {status === "streaming" && !assistantTyping && <LoaderChat />}
        </ConversationContent>

        <ConversationScrollButton />
      </Conversation>

      {messages.length > 0 && (
        <div className="w-full pb-10">
          <ChatPromptInput
            showOptions
            value={text}
            onChange={setText}
            onSubmit={handleSubmit}
            onSelectOption={handleSelectOption}
            submitting={isSubmitting}
            status={status === "streaming" ? "streaming" : "ready"}
            placeholder="Ask me anything about music..."
          />
        </div>
      )}

      <ModelSelected
        model={openModel}
        data={dataType}
        instrumentalOptions={["Arp", "Bassline"]}
        onClose={clearModel}
        onSelect={handleSelectValue}
        title={
          selectModel === "genre"
            ? "genre"
            : selectModel === "key"
              ? "Key"
              : selectModel === "mood"
                ? "Mood"
                : "Instrumental"
        }
      />
    </div>
  );
}
