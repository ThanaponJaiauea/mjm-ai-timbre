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
    { code: "en", label: "English", flag: "/icon/en.png" },
    { code: "zh", label: "中文", flag: "/icon/zh.png" },
  ];

  const data = {
    navMain: [
      {
        title: t.labelInstruments,
        url: "#",
        icon: "/icon/icon_instrument.png",
        items: [
          {
            id: 1,
            icon: "/icon/icon_drum.png",
            title: "drums",
            url: "/mjm-ai/chat/instruments/drums",
          },
          {
            id: 2,
            icon: "/icon/icon_bass.png",
            title: "bass",
            url: "/mjm-ai/chat/instruments/bass",
          },
        ],
      },

      {
        title: t.myLibrary,
        url: "#",
        icon: "/icon/icon_library.png",
        isActive: true,
        items: [
          {
            id: 3,
            icon: "/icon/icon_music_play.png",
            title: "musicPlay",
            url: "/mjm-ai/chat/my-library/music-play",
          },
          {
            id: 4,
            icon: "/icon/icon_covered_song.png",
            title: "CoveredSong",
            url: "/mjm-ai/chat/my-library/covered-song",
          },
        ],
      },
    ],
  };

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

  const handleChatVocal = async () => {
    router.push(`/mjm-ai/chat/vocal`);
    setChatMode("vocal");
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
          items={data.navMain}
          state={state}
          openToggleSidebar={openToggleSidebar}
          t={t}
          chatHistoryLoading={chatHistoryLoading}
          chatHistory={chatHistory}
          pathname={pathname}
          handleNewChat={handleNewChat}
          handleChatVocal={handleChatVocal}
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
