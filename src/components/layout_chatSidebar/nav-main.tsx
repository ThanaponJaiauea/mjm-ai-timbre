/** @format */

"use client";

import { ChevronRight, Clock4, EllipsisIcon, Trash } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useLanguage } from "@/hooks/LanguageProvider";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import NavChatHistorySkeleton from "./navChatHistorySkeleton";

export interface NavSubItemType {
  icon: string;
  iconActive: string;
  title: string;
  url: string;
}

export interface NavItemType {
  icon: string | StaticImageData;
  isShowSubmenu: boolean;
  items?: NavSubItemType[];
  onClick?: () => void;
  title: string;
  url: string;
}

interface NavMainProps {
  chatHistory: { id: string; title: string }[];
  chatHistoryLoading: boolean;
  handDeleteChat: (id: string, isCurrentPage: boolean) => void;
  items: NavItemType[];
  state: "collapsed" | "expanded";
}

export function NavMain({
  items,
  state,
  chatHistory,
  chatHistoryLoading,
  handDeleteChat,
}: Readonly<NavMainProps>) {
  const pathname = usePathname();
  const { t } = useLanguage();
  return (
    <SidebarGroup className="flex flex-col">
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            asChild
            className="group/collapsible"
            defaultOpen={pathname === item.url}
            key={item.title}
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className={`h-10 ${state === "collapsed" && "flex items-center justify-center"} `}
                  isActive={pathname === item.url}
                  onClick={item.onClick}
                  size="lg"
                  tooltip={
                    typeof t[item.title as keyof typeof t] === "string"
                      ? (t[item.title as keyof typeof t] as string)
                      : item.title
                  }
                >
                  <Image alt="image" height={24} src={item.icon} width={24} />

                  <Link href={item.url}>
                    <span className={`${state === "collapsed" && "hidden"}`}>
                      {item.title}
                    </span>
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
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem className="mt-2" key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className="h-10"
                          isActive={pathname === subItem.url}
                          size="md"
                        >
                          <Link href={subItem.url}>
                            {subItem.icon && (
                              <div className="tex-sm m-1 flex h-14 w-52 items-center gap-2">
                                {pathname === subItem.url ? (
                                  <>
                                    <Image
                                      alt="image"
                                      height={16}
                                      src={subItem.iconActive}
                                      width={16}
                                    />
                                    <span className="inline-block bg-linear-to-r from-[#E759FF] to-[#6174FF] bg-clip-text font-normal text-sm text-transparent">
                                      {subItem.title}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Image
                                      alt={subItem.title}
                                      height={16}
                                      src={subItem.icon}
                                      width={16}
                                    />
                                    <span className="inline-block font-normal text-[#8F8F8F] text-sm">
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
        <SidebarGroupLabel className="flex gap-2 font-normal text-[#6A6A6A] text-[14px]">
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
                        aria-current={isActive ? "page" : undefined}
                        asChild
                        isActive={isActive}
                      >
                        <Link href={`/mjm-ai/chat/${el.id}`}>
                          <span className="w-45 truncate text-[14px]">
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
                        <DropdownMenuContent align="start" side="right">
                          <DropdownMenuItem
                            onClick={() => handDeleteChat(el.id, isActive)}
                            variant="destructive"
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
