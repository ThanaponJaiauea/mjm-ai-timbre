/** @format */
"use client";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { AppSidebar } from "@/components/layout_chatSidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatProvider } from "@/hooks/ChatContext";
import { useAuthStore } from "@/store/use-auth-store";
import { useEffect } from "react";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const loadAuth = useAuthStore(state => state.loadAuth);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  return (
    <SidebarProvider>
      <AuthDialog />
      <ChatProvider>
        <AppSidebar />
        <main className="w-screen">{children}</main>
      </ChatProvider>
    </SidebarProvider>
  );
}
