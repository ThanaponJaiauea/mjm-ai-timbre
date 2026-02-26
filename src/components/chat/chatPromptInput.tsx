"use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { BadgeButton } from "../button/badgeButton";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (msg: PromptInputMessage) => void;
  onSelectOption?: (type: "genre" | "key" | "instrumental") => void;
  showOptions?: boolean;
  placeholder?: string;
  submitting?: boolean;
  status?: "ready" | "streaming";
}

export default function ChatPromptInput({
  value,
  onChange,
  onSubmit,
  onSelectOption,
  showOptions = false,
  placeholder = "Customize your sound...",
  submitting,
  status = "ready",
}: Props) {
  return (
    <PromptInput
      onSubmit={onSubmit}
      className="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-[24px] overflow-hidden w-full max-w-[1400px] mx-auto transition-all"
    >
      <PromptInputBody className="p-2">
        <PromptInputTextarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-4 pt-4 text-gray-300 min-h-[40px]"
        />
        {showOptions && (
          <div className="flex gap-2 px-3 items-center border-r border-[#2A2A2A] mr-2 shrink-0">
            <BadgeButton label="Style" onClick={() => onSelectOption?.("genre")} />
            <BadgeButton label="Key" onClick={() => onSelectOption?.("key")} />
            <BadgeButton label="Instrumental" onClick={() => onSelectOption?.("instrumental")} />
          </div>
        )}
      </PromptInputBody>

      <PromptInputSubmit
        status={status}
        disabled={submitting}
        className="absolute bottom-3 right-3 rounded-full w-[40px] h-[40px] bg-[#292929]"
      />
    </PromptInput>
  );
}
