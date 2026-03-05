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
  const router = useRouter();
  const pathname = usePathname();
  const { toggleSidebar, state } = useSidebar();

  const languages = [
    { code: "en", label: "English", flag: null },
    { code: "zh", label: "中文", flag: null },
  ];

  const data = {
    navMain: [
      {
        title: t.newchat,
        url: "/",
        icon: "/icon/icon_instrument.png",
        isActive: pathname === "/mjm-ai/chat",
        isShowSubmenu: false,
        onClick: () => {
          handleNewChat();
          openToggleSidebar();
        },
      },
      {
        title: t.downloadApp,
        url: "/mjm-ai/chat/download",
        icon: "/icon/icon_download.png",
        isShowSubmenu: false,
        isActive: pathname === "/mjm-ai/chat/download",
      },
      {
        title: "Creator Guide",
        url: "/mjm-ai/chat/creator-guide",
        icon: "/icon/icon_creator.png",
        isActive: pathname === "/mjm-ai/chat/creator-guide",
        isShowSubmenu: true,
        items: [
          {
            title: "Get start",
            url: "/mjm-ai/chat/creator-guide/getstart",
            icon: "/icons/getstart.svg",
            iconActive: "/icons/getstart-active.svg",
            isActive: pathname === "/mjm-ai/chat/creator-guide/getstart",
          },
          {
            title: "Multi-Engine Generation",
            url: "/mjm-ai/chat/creator-guide/engine-generation",
            icon: "/icons/engine-generation.svg",
            iconActive: "/icons/engine-generation-active.svg",
            isActive: pathname === "/mjm-ai/chat/creator-guide/engine-generation",
          },
          {
            title: "Smart Timbre Library",
            url: "/mjm-ai/chat/creator-guide/timbre",
            icon: "/icons/timbre.svg",
            iconActive: "/icons/timbre-active.svg",
            isActive: pathname === "/mjm-ai/chat/creator-guide/timbre",
          },
          {
            title: "DAW (VST Display)",
            url: "/mjm-ai/chat/creator-guide/daw",
            icon: "/icons/daw.svg",
            iconActive: "/icons/daw-active.svg",
            isActive: pathname === "/mjm-ai/chat/creator-guide/daw",
          },
          {
            title: "Subscription",
            url: "/mjm-ai/chat/creator-guide/subscription",
            icon: "/icons/subscription.svg",
            iconActive: "/icons/subscription-active.svg",
            isActive: pathname === "/mjm-ai/chat/creator-guide/subscription",
          },
          {
            title: "Unit Testing",
            url: "/mjm-ai/chat/creator-guide/unit-test",
            icon: "/icons/unit-test.svg",
            iconActive: "/icons/unit-test-active.svg",
            isActive: pathname === "/mjm-ai/chat/creator-guide/unit-test",
          },
        ],
      },
    ],
  };

  const { chatHistory, loadChatHistory, chatHistoryLoading, setChatMode, setChatHistory } = useChatContext();

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

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
          t={t}
          chatHistoryLoading={chatHistoryLoading}
          chatHistory={chatHistory}
          pathname={pathname}
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
