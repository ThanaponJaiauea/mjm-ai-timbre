/** @format */
"use client";

import {getChatHistory} from "@/api/chatHistory";
import React, {createContext, useContext, useState} from "react";

interface ChatContextType {
  chatMode: string;
  setChatMode: React.Dispatch<React.SetStateAction<string>>;
  chatHistory: any[];
  setChatHistory: React.Dispatch<React.SetStateAction<any[]>>;
  loadChatHistory: () => void;
  chatHistoryLoading: boolean;
  loadPreview: boolean;
  setLoadPreview: React.Dispatch<React.SetStateAction<boolean>>;
  loadData: boolean;
  setLoadData: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType>({
  chatMode: "chat",
  setChatMode: () => {},
  chatHistory: [],
  setChatHistory: () => {},
  loadChatHistory: () => {},
  chatHistoryLoading: false,
  loadPreview: true,
  setLoadPreview: () => {},
  loadData: false,
  setLoadData: () => {},
});

export function ChatProvider({children}: {children: React.ReactNode}) {
  const [chatMode, setChatMode] = useState("chat");
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const [selectedItem, setSelectedItem] = useState(null);

  const [chatHistoryLoading, setChatHistoryLoading] = useState<boolean>(false);
  const [chatHistoryFirstLoad, setChatHistoryFirstLoad] =
    useState<boolean>(true);

  const [loadPreview, setLoadPreview] = useState<boolean>(true);
  const [loadData, setLoadData] = useState<boolean>(false);

  const fetchChatHistory = async () => {
    if (chatHistoryFirstLoad) {
      setChatHistoryLoading(true);
      setChatHistoryFirstLoad(false);
    }

    const data = await getChatHistory();
    setChatHistory(data.data.data);
    setChatHistoryLoading(false);
  };

  return (
    <ChatContext.Provider
      value={{
        chatMode,
        setChatMode,
        chatHistory,
        setChatHistory,
        loadChatHistory: fetchChatHistory,
        chatHistoryLoading,
        loadPreview,
        setLoadPreview,
        loadData,
        setLoadData,
        selectedItem,
        setSelectedItem,
      }}>
      {children}
    </ChatContext.Provider>
  );
}

// custom hook
export function useChatContext() {
  return useContext(ChatContext);
}
