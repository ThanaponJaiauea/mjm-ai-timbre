/** @format */

"use client";

import * as React from "react";
import { NavMain, type NavItemType } from "@/components/layout_chatSidebar/nav-main";
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

import { icon_create, icon_creator_guide, icon_download, icon_subscription, icon_library } from "../../../public/index";

import { useRouter } from "next/navigation";
import { useChatContext } from "@/hooks/ChatContext";
import { useEffect } from "react";
import { deleteChat } from "@/api/chatHistory";

const getNavData = (handleNewChat: () => void, openToggleSidebar: () => void): { navMain: NavItemType[] } => ({
  navMain: [
    {
      title: "newchat",
      url: "/mjm-ai/chat",
      icon: icon_create,
      isShowSubmenu: false,
      onClick: () => {
        handleNewChat();
        openToggleSidebar();
      },
    },
    {
      title: "Timbre Library",
      url: "/mjm-ai/chat/timbre-library",
      icon: icon_library,
      isShowSubmenu: false,
    },
    {
      title: "Subscription Plan",
      url: "",
      icon: icon_subscription,
      isShowSubmenu: false,
    },
    {
      title: "downloadApp",
      url: "/mjm-ai/chat/download",
      icon: icon_download,
      isShowSubmenu: false,
    },
    {
      title: "Creator Guide",
      url: "/mjm-ai/chat/creator-guide",
      icon: icon_creator_guide,
      isShowSubmenu: true,
      items: [
        {
          title: "Get start",
          url: "/mjm-ai/chat/creator-guide/getstart",
          icon: "/icons/getstart.svg",
          iconActive: "/icons/getstart-active.svg",
        },
        {
          title: "Multi-Engine Generation",
          url: "/mjm-ai/chat/creator-guide/engine-generation",
          icon: "/icons/engine-generation.svg",
          iconActive: "/icons/engine-generation-active.svg",
        },
        {
          title: "Smart Timbre Library",
          url: "/mjm-ai/chat/creator-guide/timbre",
          icon: "/icons/timbre.svg",
          iconActive: "/icons/timbre-active.svg",
        },
        {
          title: "DAW (VST Display)",
          url: "/mjm-ai/chat/creator-guide/daw",
          icon: "/icons/daw.svg",
          iconActive: "/icons/daw-active.svg",
        },
        {
          title: "Subscription",
          url: "/mjm-ai/chat/creator-guide/subscription",
          icon: "/icons/subscription.svg",
          iconActive: "/icons/subscription-active.svg",
        },
        {
          title: "Testing Strategy",
          url: "/mjm-ai/chat/creator-guide/test-strategy",
          icon: "/icons/unit-test.svg",
          iconActive: "/icons/unit-test-active.svg",
        },
      ],
    },
  ],
});

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { toggleSidebar, state } = useSidebar();

  const { chatHistory, loadChatHistory, chatHistoryLoading, setChatMode, setChatHistory } = useChatContext();

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  const handleNewChat = React.useCallback(async () => {
    router.push("/mjm-ai/chat");
    setChatMode("chat");
  }, [router, setChatMode]);

  const handDeleteChat = async (id: string, isCurrentPage: boolean) => {
    try {
      await deleteChat(id);
      setChatHistory(prev => prev.filter(chat => chat.id !== id));
      if (!isCurrentPage) handleNewChat();
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const openToggleSidebar = React.useCallback(() => {
    if (state === "collapsed") {
      toggleSidebar();
    }
  }, [state, toggleSidebar]);

  const navData = React.useMemo(() => getNavData(handleNewChat, openToggleSidebar), [handleNewChat, openToggleSidebar]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-[#232323]">
        <NavHeader state={state} toggleSidebar={toggleSidebar} router={router} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={navData.navMain}
          state={state}
          chatHistoryLoading={chatHistoryLoading}
          chatHistory={chatHistory}
          handDeleteChat={handDeleteChat}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
