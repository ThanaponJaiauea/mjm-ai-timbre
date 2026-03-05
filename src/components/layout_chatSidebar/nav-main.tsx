/** @format */

"use client";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Clock4, EllipsisIcon, Trash, type LucideIcon } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../ui/collapsible";

interface NavItem {
  title: string;
  url: string;
  icon?: string | LucideIcon;
  isActive?: boolean;
  isShowSubmenu?: boolean;
  onClick?: () => void;
  items?: [
    {
      title: string;
      url: string;
      icon: string;
      iconActive: string;
      isActive?: boolean;
    },
  ];
}

interface NavMainProps {
  items: NavItem[];
  state: "collapsed" | "expanded";
  t: typeof en;
  chatHistory: { id: string; title: string }[];
  chatHistoryLoading: boolean;
  pathname: string;
  handDeleteChat: (id: string, isCurrentPage: boolean) => void;
}

export function NavMain({
  items,
  state,
  t,
  chatHistory,
  chatHistoryLoading,
  pathname,
  handDeleteChat,
}: Readonly<NavMainProps>) {
  return (
    <SidebarGroup className="flex flex-col">
      <SidebarMenu>
        {items.map(item => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={item.title}
                  isActive={item.isActive}
                  className={`h-10 ${state === "collapsed" && "flex items-center justify-center"} `}
                  onClick={item.onClick}
                >
                  <Link href={item.url}>
                    <span className={`${state === "collapsed" && "hidden"}`}>{item.title}</span>
                  </Link>
                  {item.isShowSubmenu && (
                    <ChevronRight
                      className={cn(
                        "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90",
                        state === "collapsed" && "hidden"
                      )}
                    />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {item.items && (
                  <SidebarMenuSub>
                    {item.items.map(subItem => (
                      <SidebarMenuSubItem key={subItem.title} className="mt-2">
                        <SidebarMenuSubButton size="md" className=" h-10" isActive={subItem.isActive} asChild>
                          <Link href={subItem.url}>
                            {subItem.icon && (
                              <div className="flex items-center m-1 gap-2 w-52 h-14 tex-sm ">
                                {subItem.isActive ? (
                                  <>
                                    <Image src={subItem.iconActive} alt="image" width={16} height={16} />
                                    <span className="text-sm font-normal bg-linear-to-r from-[#E759FF] to-[#6174FF] inline-block text-transparent bg-clip-text">
                                      {subItem.title}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Image src={subItem.icon} alt={subItem.title} width={16} height={16} />
                                    <span className="text-sm font-normal text-[#8F8F8F] inline-block ">
                                      {subItem.title}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
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
