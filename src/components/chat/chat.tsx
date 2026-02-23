/** @format */

"use client";
import { useLanguage } from "@/hooks/LanguageProvider";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { useChatContext } from "@/hooks/ChatContext";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useState } from "react";
import LoaderChat from "@/components/loaderChat/loaderChat";
import ChatUiPage from "@/components/chat/ChatUiPage";
import ChordRecommend from "@/components/ChordRecommend";

import { Inter } from "next/font/google";
import { toast } from "sonner";

const inter = Inter({});

interface Props {
  id?: string | undefined;
  initialMessages?: any[];
}

export function Chat({ id, initialMessages }: Props) {
  const { loadChatHistory, chatMode } = useChatContext();
  const { t } = useLanguage();
  const { messages, sendMessage, status, setMessages } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages }) => {
        const lastMessage = messages[messages.length - 1];

        return {
          body: {
            message: lastMessage,
            chatId: id,
          },
        };
      },
    }),
    onFinish: ({ messages }) => {
      console.log(messages.length);
      if (messages.length <= 2) {
        loadChatHistory();
      }
    },
    onError: error => {
      console.error("Error:", error);
      toast("Error: " + error);
    },
  });

  console.log("messages", messages);

  const [text, setText] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (message: PromptInputMessage) => {
    // ถ้าไม่มีข้อความ หรือกำลังส่งอยู่ ให้ return
    if (!message.text.trim() || isSubmitting || status === "streaming") return;

    setIsSubmitting(true);
    sendMessage({ text });
    setText("");
  };

  useEffect(() => {
    if (status !== "streaming") setIsSubmitting(false);
  }, [status]);

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);

  const lastMessage = messages[messages.length - 1];
  const assistantHasStartedTyping =
    lastMessage?.role === "assistant" && lastMessage.parts.some(part => part.type === "text" && part.text);

  return (
    <div className="p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {chatMode === "chat" && messages.length === 0 && <ChatUiPage />}

            {messages.map(message => {
              console.log("message", message);

              // Do not render assistant messages that have no renderable parts.
              // This prevents an empty message bubble from appearing while waiting for tool output.
              const hasRenderableParts = message.parts.some(part => {
                if (part.type === "text" && part.text) {
                  return true;
                }
                if (part.type === "tool-aiRecommend" && part.output) {
                  return true; // Tool has output
                }

                return false;
              });

              return (
                <Message from={message.role} key={message.id}>
                  <MessageContent className={`${inter.className}`}>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <Response key={`${message.id}-text-${i}`} shikiTheme={["dark-plus"]}>
                              {part.text}
                            </Response>
                          );

                        case "reasoning":
                          return (
                            <Response key={`${message.id}-text-${i}`} shikiTheme={["dark-plus"]}>
                              {part.text}
                            </Response>
                          );

                        case "tool-aiRecommend":
                          const toolData = part.args || part.input;
                          const hasData = toolData && Object.keys(toolData).length > 0;

                          return (
                            <div key={`${message.id}-tool-${i}`} className="my-4">
                              <ChordRecommend
                                initialData={{
                                  key: hasData ? toolData.key : "C",
                                  mood: hasData ? toolData.mood : "Pop",
                                }}
                              />
                            </div>
                          );

                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              );
            })}

            {status === "streaming" && !assistantHasStartedTyping && (
              <div className="mb-8">
                <LoaderChat />
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4 w-[70%] m-auto relative bg-[#3D3D3D] h-[56px] mb-4">
          <PromptInputTextarea
            value={text}
            placeholder={t.placeholder}
            onChange={e => setText(e.currentTarget.value)}
          />
          <PromptInputSubmit
            status={status === "streaming" ? "streaming" : "ready"}
            disabled={!text.trim() || isSubmitting || status === "streaming"}
            className="absolute bottom-2 right-3 rounded-full cursor-pointer w-[40px] h-[40px] bg-[#292929]"
          />
        </PromptInput>
      </div>
    </div>
  );
}
