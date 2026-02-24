/** @format */
"use client";

import { SidebarMenu, SidebarMenuItem, SidebarMenuSkeleton } from "@/components/ui/sidebar";

export default function NavChatHistorySkeleton() {
  return (
    <SidebarMenu>
      {Array.from({ length: 10 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
