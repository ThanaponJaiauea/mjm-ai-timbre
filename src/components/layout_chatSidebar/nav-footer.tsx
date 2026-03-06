/** @format */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import Image from "next/image";
import { useLanguage } from "@/hooks/LanguageProvider";

type Locale = "en" | "zh";

const languages = [
  { code: "en", label: "English", flag: null },
  { code: "zh", label: "中文", flag: null },
];

export function NavFooter() {
  const { isMobile } = useSidebar();
  const { lang, setLang } = useLanguage();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="justify-start">
              {/* <Image
                src={languages.find(l => l.code === currentLang)?.flag || ""}
                alt={currentLang}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full"
              /> */}
              <span className="ml-2">{languages.find(l => l.code === lang)?.label}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            className="flex flex-col cursor-pointer items-center justify-center p-2 bg-[#232323] rounded-[10px] w-30"
          >
            {languages.map(lang => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLang(lang.code as Locale)}
                className="flex items-center w-full  hover:bg-[#6e6e6e]"
              >
                {lang.flag && (
                  <Image
                    src={lang.flag}
                    alt={lang.label}
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full mr-2"
                  />
                )}
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
