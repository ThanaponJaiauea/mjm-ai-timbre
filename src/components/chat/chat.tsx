/** @format */
"use client";

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
import { get_all_by_type, save_arp_settings } from "@/api/music";
import Arpeggiator, { ArpSettings } from "@/components/instruments/Arpeggiator";
import AcidSynth from "@/components/instruments/AcidSynth";

import { Inter } from "next/font/google";
import { toast } from "sonner";
import { MyUIMessage } from "@/utils/message-type";
import { getAccessToken } from "@/utils/local-storage";

const inter = Inter({});

interface Props {
  id: string; // Make sure id is always a string
  initialMessages?: MyUIMessage[]; // Use the correct type
}

export function Chat({ id, initialMessages }: Props) {
  const { loadChatHistory, chatMode } = useChatContext();

  const [arp, setArp] = useState<ArpSettings | null>(null);
  console.log("arp", arp);

  const [acid, setAcid] = useState(null);

  /* -------------------- CHAT SDK -------------------- */
  const { messages, sendMessage, status, setMessages } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages }) => {
        const token = getAccessToken();

        return {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            message: messages[messages.length - 1],
            chatId: id,
          },
        };
      },
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
    if (!message?.text?.trim() || isSubmitting || status === "streaming") return;

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
  const [selectStyle, setSelectStyle] = useState<any>(null);
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
    if (selectModel === "genre") {
      setSelectStyle(value);
    }

    setText(prev => (prev ? `${prev}, ${value}` : value));
    clearModel();
  };

  const clearModel = () => {
    setOpenModel(false);
    setSelectModel(null);
    setDataType(null);
  };

  const handleSaveArp = async data => {
    if (data.length === 0) return;

    try {
      await save_arp_settings(data);
    } catch (error) {
      console.error("Error saving arp settings:", error);
    }
  };

  /* -------------------- RENDER -------------------- */
  const lastMessage = messages[messages.length - 1];
  const assistantTyping = lastMessage?.role === "assistant" && lastMessage.parts.some(p => p.type === "text" && p.text);

  return (
    <div className={`relative flex flex-col w-full h-screen  ${messages.length != 0 ? "p-4" : ""}`}>
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
                      const stableKey = `arp-${d?.bpm ?? 120}-${d?.pattern ?? "UpDown"}-${d?.musicalKey ?? "C"}-${d?.scale ?? "Minor"}`;
                      const acidKey = `acid-${d?.bpm ?? 120}-${d?.musicalKey ?? "C"}-${d?.scale ?? "Minor"}-${d?.rootNote ?? 60}`;

                      return (
                        <div key={partKey} className="space-y-4 w-full max-w-5xl">
                          <ChordRecommend
                            initialData={{
                              key: d?.key ?? "C",
                              mood: d?.mood ?? "Pop",
                            }}
                            setArp={setArp}
                            arp={arp}
                            selectStyle={selectStyle}
                          />
                          {arp !== null && (
                            <div className="w-full overflow-auto">
                              <Arpeggiator
                                compact={false}
                                key={stableKey}
                                initialSettings={{
                                  waveform: arp.waveform ?? "sawtooth",
                                  bpm: arp.bpm ?? 120,
                                  timeDivision: arp.timeDivision ?? "1/16",
                                  pattern: arp.pattern ?? "UpDown",
                                  octaveRange: arp.octaveRange ?? 1,
                                  gateLength: arp.gateLength ?? 90,
                                  velocity: arp.velocity ?? 0.9,
                                  rootNote: arp.rootNote ?? 60,
                                  masterVolume: arp.masterVolume ?? 0.6,
                                  heldRoots: arp.heldRoots ?? [],
                                  sortNotes: arp.sortNotes ?? true,
                                  sequencerSteps: arp.sequencerSteps ?? Array(16).fill(true),
                                  musicalKey: arp.musicalKey ?? "C",
                                  scale: arp.scale ?? "Minor",
                                  heldNotes: (arp.heldNotes
                                    ? Array.isArray(arp.heldNotes[0])
                                      ? arp.heldNotes.flat()
                                      : arp.heldNotes
                                    : []) as string[],
                                  style: arp?.style ?? "",
                                  mood: arp?.mood ?? "",
                                  chords: arp?.chords ?? [],
                                }}
                                onSave={settings => {
                                  handleSaveArp(settings);
                                }}
                              />
                            </div>
                          )}
                          
                          {acid !== null && (
                            <div className="w-full overflow-auto">
                              <AcidSynth
                                key={acidKey}
                                initialBpm={d?.bpm ?? 140}
                                initialScale={d?.scale ?? "Minor"}
                                initialRoot={0} // ใช้ 0 เสมอ เพื่อให้เสียงเหมือน test-components
                              />
                            </div>
                          )}
                        </div>
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
