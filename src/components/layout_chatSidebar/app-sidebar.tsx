/** @format */

"use client";

import * as React from "react";
import { NavMain } from "@/components/layout_chatSidebar/nav-main";
import { NavFooter } from "@/components/layout_chatSidebar/nav-footer";
import { NavHeader } from "@/components/layout_chatSidebar/nav-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { useLanguage } from "@/hooks/LanguageProvider";
import { usePathname, useRouter } from "next/navigation";
import { useChatContext } from "@/hooks/ChatContext";
import { useEffect } from "react";
import { deleteChat } from "@/api/chatHistory";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t, lang, setLang } = useLanguage();

  const languages = [
    { code: "en", label: "English", flag: null },
    { code: "zh", label: "中文", flag: null },
  ];

  const { chatHistory, loadChatHistory, chatHistoryLoading, setChatMode, setChatHistory } = useChatContext();

  useEffect(() => {
    loadChatHistory();
  }, []);

  const router = useRouter();
  const pathname = usePathname();

  const { toggleSidebar, state } = useSidebar();

  const handleNewChat = async () => {
    router.push(`/mjm-ai/chat`);
    setChatMode("chat");
  };

  const handDeleteChat = async (id: string, isCurrentPage: boolean) => {
    try {
      await deleteChat(id);
      setChatHistory(prev => prev.filter(chat => chat.id !== id));
      if (!isCurrentPage) handleNewChat();
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const openToggleSidebar = () => {
    if (state === "collapsed") {
      toggleSidebar();
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-[#232323]">
        <NavHeader state={state} toggleSidebar={toggleSidebar} router={router} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          state={state}
          openToggleSidebar={openToggleSidebar}
          t={t}
          chatHistoryLoading={chatHistoryLoading}
          chatHistory={chatHistory}
          pathname={pathname}
          handleNewChat={handleNewChat}
          handDeleteChat={handDeleteChat}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter languages={languages} currentLang={lang} setLang={setLang} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
