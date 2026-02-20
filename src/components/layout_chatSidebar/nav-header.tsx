/** @format */

"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "../ui/button";

export function NavHeader({
  toggleSidebar,
  state,
  router,
}: {
  toggleSidebar: () => void;
  state: "expanded" | "collapsed";
  router: { push: (url: string) => void };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer text-center "
          onClick={
            state === "collapsed"
              ? toggleSidebar
              : () => router.push("/mjm-ai/chat")
          }
          title={state === "collapsed" ? "Expand Sidebar" : "New Chat"}
        ></Button>

        <SidebarTrigger
          className={state === "collapsed" ? "hidden" : "flex cursor-pointer"}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
