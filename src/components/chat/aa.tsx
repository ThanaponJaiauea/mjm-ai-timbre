/** @format */
"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
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
import { updateArpOutput } from "@/api/chatHistory";
import Arpeggiator, { ArpSettings } from "@/components/instruments/Arpeggiator";
import AcidSynth from "@/components/instruments/AcidSynth";

import { Inter } from "next/font/google";
import { toast } from "sonner";
import { MyUIMessage } from "@/utils/message-type";
import { getAccessToken } from "@/utils/local-storage";

const inter = Inter({});

interface Props {
  id: string;
  initialMessages?: MyUIMessage[];
}

export function Chat({ id, initialMessages }: Props) {
  const { loadChatHistory, chatMode } = useChatContext();

  // ✅ track ว่า partKey ไหนที่ user กด Generate แล้ว
  const [generatedKeys, setGeneratedKeys] = useState<Set<string>>(new Set());
  // ✅ เก็บ arp แยกตาม partKey
  const [arpMap, setArpMap] = useState<Record<string, ArpSettings>>({});

  const [acid] = useState(null);

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
    onError: (error) => {
      console.error(error);
      toast("Error: " + error);
    },
  });

  /* -------------------- INPUT -------------------- */
  const [text, setText] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message?.text?.trim() || isSubmitting || status === "streaming")
      return;

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
    if (selectModel === "genre") setSelectStyle(value);
    setText((prev) => (prev ? `${prev}, ${value}` : value));
    clearModel();
  };

  const clearModel = () => {
    setOpenModel(false);
    setSelectModel(null);
    setDataType(null);
  };

  const handleSaveArp = async (data: ArpSettings) => {
    if (!data) return;

    try {
      await save_arp_settings(data);
    } catch (error) {
      console.error("Error saving arp settings:", error);
    }
  };

  /* -------------------- RENDER -------------------- */
  const lastMessage = messages[messages.length - 1];
  const assistantTyping =
    lastMessage?.role === "assistant" &&
    lastMessage.parts.some((p) => p.type === "text" && p.text);

  return (
    <div
      className={`relative flex flex-col w-full h-screen ${messages.length !== 0 ? "p-4" : ""}`}
    >
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

          {messages.map((msg) => {
            const hasRenderable = msg.parts.some(
              (p) =>
                (p.type === "text" && p.text) ||
                (p.type === "tool-aiRecommend" && p.output),
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

                      const arpFromMap = arpMap[partKey] ?? null;
                      const savedArp =
                        (part.output?.arpSettings as ArpSettings) ?? null;

                      const isGenerated = generatedKeys.has(partKey);
                      const displayArp = isGenerated
                        ? (arpFromMap ?? savedArp)
                        : savedArp;

                      const stableArpKey = `arp-${partKey}-${displayArp?.bpm ?? 120}-${displayArp?.pattern ?? "UpDown"}`;
                      const acidKey = `acid-${d?.bpm ?? 120}-${d?.musicalKey ?? "C"}-${d?.scale ?? "Minor"}-${d?.rootNote ?? 60}`;

                      return (
                        <div
                          key={partKey}
                          className="space-y-4 w-full max-w-5xl"
                        >
                          <ChordRecommend
                            initialData={{
                              key: d?.key ?? "C",
                              mood: d?.mood ?? "Pop",
                            }}
                            setArp={(newArp: ArpSettings) =>
                              setArpMap((prev) => ({
                                ...prev,
                                [partKey]: newArp,
                              }))
                            }
                            arp={displayArp}
                            selectStyle={selectStyle}
                            // ✅ เมื่อ generate เสร็จ: mark partKey, update arpMap, save ลง DB
                            onArpGenerated={async (arpData: ArpSettings) => {
                              setGeneratedKeys(
                                (prev) => new Set([...prev, partKey]),
                              );
                              setArpMap((prev) => ({
                                ...prev,
                                [partKey]: arpData,
                              }));
                              try {
                                const token = getAccessToken();
                                await updateArpOutput(
                                  {
                                    messageId: msg.id,
                                    partIndex: i,
                                    arpSettings: arpData,
                                  },
                                  token,
                                );
                              } catch (err) {
                                console.error("Failed to save arp to DB:", err);
                              }
                            }}
                          />

                          {/* ✅ โชว์ Arpeggiator เฉพาะเมื่อ displayArp มีค่า */}
                          {displayArp !== null && (
                            <div className="w-full overflow-auto">
                              <Arpeggiator
                                compact={false}
                                key={stableArpKey}
                                initialSettings={{
                                  waveform: displayArp.waveform ?? "sawtooth",
                                  bpm: displayArp.bpm ?? 120,
                                  timeDivision:
                                    displayArp.timeDivision ?? "1/16",
                                  pattern: displayArp.pattern ?? "UpDown",
                                  octaveRange: displayArp.octaveRange ?? 1,
                                  gateLength: displayArp.gateLength ?? 90,
                                  velocity: displayArp.velocity ?? 0.9,
                                  rootNote: displayArp.rootNote ?? 60,
                                  masterVolume: displayArp.masterVolume ?? 0.6,
                                  heldRoots: displayArp.heldRoots ?? [],
                                  sortNotes: displayArp.sortNotes ?? true,
                                  sequencerSteps:
                                    displayArp.sequencerSteps ??
                                    Array(16).fill(true),
                                  musicalKey: displayArp.musicalKey ?? "C",
                                  scale: displayArp.scale ?? "Minor",
                                  heldNotes: (displayArp.heldNotes
                                    ? Array.isArray(displayArp.heldNotes[0])
                                      ? displayArp.heldNotes.flat()
                                      : displayArp.heldNotes
                                    : []) as string[],
                                  style: displayArp.style ?? "",
                                  mood: displayArp.mood ?? "",
                                  chords: displayArp.chords ?? [],
                                }}
                                onSave={(settings) => {
                                  setArpMap((prev) => ({
                                    ...prev,
                                    [partKey]: settings,
                                  }));
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
                                initialRoot={0}
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
