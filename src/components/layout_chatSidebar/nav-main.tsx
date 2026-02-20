/** @format */

"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Clock4,
  EllipsisIcon,
  Trash,
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NavChatHistorySkeleton from "./ืnavChatHistorySkeleton";

import en from "@/locales/en.json";

interface NavItem {
  title: string;
  url: string;
  icon?: string | LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    icon?: string | LucideIcon;
  }[];
}

interface NavMainProps {
  items: NavItem[];
  openToggleSidebar: () => void;
  state: "collapsed" | "expanded" | string;
  t: typeof en;
  chatHistory: { id: string; title: string }[];
  chatHistoryLoading: boolean;
  pathname: string;
  handleNewChat: () => void;
  handleChatVocal: () => void;
  handDeleteChat: (id: string, isCurrentPage: boolean) => void;
}

export function NavMain({
  items,
  openToggleSidebar,
  state,
  t,
  chatHistory,
  chatHistoryLoading,
  pathname,
  handleNewChat,
  handleChatVocal,
  handDeleteChat,
}: NavMainProps) {
  return (
    <SidebarGroup className="flex flex-col">
      {/* New Chat */}
      <SidebarMenu>
        <SidebarMenuButton
          size="lg"
          tooltip={t.newchat}
          className={`h-[40px] ${
            state === "collapsed" && "flex items-center justify-center"
          } `}
          onClick={() => {
            handleNewChat();
            openToggleSidebar();
          }}
        >
          <span className={`${state === "collapsed" && "hidden"}`}>
            {t.newchat.trim()}
          </span>
        </SidebarMenuButton>
      </SidebarMenu>

      {/* Vocal */}
      <SidebarMenu>
        <SidebarMenuButton
          size="lg"
          isActive={pathname === "/mjm-ai/chat/vocal" || false}
          tooltip={t.vocal}
          className={`h-[40px] ${
            state === "collapsed" && "flex items-center justify-center"
          }`}
          onClick={() => {
            handleChatVocal();
            openToggleSidebar();
          }}
        >
          <span className={`${state === "collapsed" && "hidden"}`}>
            {t.vocal}
          </span>
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
                chatHistory.map((el) => {
                  const isActive = el.id === pathname.split("/")[3];

                  return (
                    <SidebarMenuItem key={el.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        aria-current={isActive ? "page" : undefined}
                        asChild
                      >
                        <Link href={`/mjm-ai/chat/${el.id}`}>
                          <span className="w-[180px] text-[14px] truncate">
                            {el.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <EllipsisIcon />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handDeleteChat(el.id, isActive)}
                          >
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
