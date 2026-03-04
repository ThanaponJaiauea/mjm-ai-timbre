/** @format */

"use client";

import { SidebarMenu, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { icon_mjm } from "@/images";

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
          onClick={state === "collapsed" ? toggleSidebar : () => router.push("/mjm-ai/chat")}
          title={state === "collapsed" ? "Expand Sidebar" : "New Chat"}
        >
          <Image src={icon_mjm} alt="Icon MJM" width={60} height={60} />
        </Button>

        <SidebarTrigger className={state === "collapsed" ? "hidden" : "flex cursor-pointer"} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
