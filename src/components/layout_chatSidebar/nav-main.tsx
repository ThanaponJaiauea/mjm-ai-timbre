/** @format */

"use client";
import Link from "next/link";
import { Clock4, EllipsisIcon, Trash, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NavChatHistorySkeleton from "./navChatHistorySkeleton";

import en from "@/locales/en.json";
import Image from "next/image";
import {
  icon_create,
  icon_creator_guide,
  icon_download,
  icon_subscription,
  icon_vst_plugins,
  icon_library,
} from "../../../public/index";

interface NavMainProps {
  openToggleSidebar: () => void;
  state: "collapsed" | "expanded" | string;
  t: typeof en;
  chatHistory: { id: string; title: string }[];
  chatHistoryLoading: boolean;
  pathname: string;
  handleNewChat: () => void;
  handDeleteChat: (id: string, isCurrentPage: boolean) => void;
}

export function NavMain({
  openToggleSidebar,
  state,
  t,
  chatHistory,
  chatHistoryLoading,
  pathname,
  handleNewChat,
  handDeleteChat,
}: NavMainProps) {
  return (
    <SidebarGroup className="flex flex-col">
      {/* Create */}
      <SidebarMenu>
        <SidebarMenuButton
          size="lg"
          tooltip={t.newchat}
          className={`h-10 ${state === "collapsed" && "flex items-center justify-center"} `}
          onClick={() => {
            handleNewChat();
            openToggleSidebar();
          }}
        >
          <Image alt="create" width={24} height={24} src={icon_create} />
          <span className={`${state === "collapsed" && "hidden"}`}>Create</span>
        </SidebarMenuButton>
      </SidebarMenu>

      {/* Timbre Library */}
      <SidebarMenu>
        <SidebarMenuButton
          size="lg"
          isActive={pathname === "/mjm-ai/chat/timbre-library"}
          className={`h-10 ${state === "collapsed" && "flex items-center justify-center"}`}
          asChild
        >
          <Link href="/mjm-ai/chat/timbre-library" onClick={openToggleSidebar} className="flex items-center gap-2">
            <Image alt="timbre-library" width={24} height={24} src={icon_library} />
            <span className={`${state === "collapsed" && "hidden"}`}>Timbre Library</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenu>

      {/* Subscription Plan */}
      <SidebarMenu>
        <SidebarMenuButton size="lg" className={`h-10 ${state === "collapsed" && "flex items-center justify-center"}`}>
          <Image alt="subscription" width={24} height={24} src={icon_subscription} />
          <span className={`${state === "collapsed" && "hidden"}`}>Subscription Plan</span>
        </SidebarMenuButton>
      </SidebarMenu>

      {/* Creator Guide */}
      <SidebarMenu>
        <SidebarMenuButton size="lg" className={`h-10 ${state === "collapsed" && "flex items-center justify-center"}`}>
          <Image alt="creator guide" width={24} height={24} src={icon_creator_guide} />
          <span className={`${state === "collapsed" && "hidden"}`}>Creator Guide</span>
        </SidebarMenuButton>
      </SidebarMenu>

      {/* Creator Guide */}
      <SidebarMenu>
        <SidebarMenuButton size="lg" className={`h-10 ${state === "collapsed" && "flex items-center justify-center"}`}>
          <Image alt="vst plugins" width={24} height={24} src={icon_vst_plugins} />
          <span className={`${state === "collapsed" && "hidden"}`}>VST Plugins</span>
        </SidebarMenuButton>
      </SidebarMenu>

      {/* Download App */}
      <SidebarMenu>
        <SidebarMenuButton
          size="lg"
          isActive={pathname === "/mjm-ai/chat/download"}
          tooltip={t.downloadApp}
          className={`h-10 ${state === "collapsed" && "flex items-center justify-center"}`}
          asChild
        >
          <Link href="/mjm-ai/chat/download" onClick={openToggleSidebar}>
            <Image alt="download app" width={24} height={24} src={icon_download} />
            <span className={`${state === "collapsed" && "hidden"}`}>{t.downloadApp}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenu>

      {/* History */}
      <SidebarGroup className={`${state === "collapsed" ? "hidden" : "flex"}`}>
        <SidebarGroupLabel className="flex gap-2 text-[14px] font-normal text-[#6A6A6A]">
          <Clock4 />
          {t.labelHistory}
        </SidebarGroupLabel>

        {state !== "collapsed" && (
          <SidebarGroupContent>
            <SidebarMenu>
              {chatHistoryLoading ? (
                <NavChatHistorySkeleton />
              ) : (
                chatHistory.map(el => {
                  const isActive = el.id === pathname.split("/")[3];

                  return (
                    <SidebarMenuItem key={el.id}>
                      <SidebarMenuButton isActive={isActive} aria-current={isActive ? "page" : undefined} asChild>
                        <Link href={`/mjm-ai/chat/${el.id}`}>
                          <span className="w-45 text-[14px] truncate">{el.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <EllipsisIcon />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem variant="destructive" onClick={() => handDeleteChat(el.id, isActive)}>
                            <Trash />
                            {t.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        )}
      </SidebarGroup>
    </SidebarGroup>
  );
}
