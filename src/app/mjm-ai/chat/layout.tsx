/** @format */
"use client";

import { AppSidebar } from "@/components/layout_chatSidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatProvider } from "@/hooks/ChatContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ChatProvider>
        <AppSidebar />
        <main className="w-screen">{children}</main>
      </ChatProvider>
    </SidebarProvider>
  );
}
