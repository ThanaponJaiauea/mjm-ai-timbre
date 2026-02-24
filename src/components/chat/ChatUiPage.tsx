/** @format */
"use client";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useLanguage } from "@/hooks/LanguageProvider";
const montserrat = Montserrat({});

export default function ChatUiPage() {
  const { t } = useLanguage();
  return (
    <section className="flex flex-col items-center gap-8">
      <div>
        <h1 className={`font-bold text-[70px] uppercase  ${montserrat.className}`}>{t.musicalai}</h1>
      </div>
    </section>
  );
}
