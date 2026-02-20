/** @format */
"use client";

import Image from "next/image";

import styles from "./Loader.module.css";
import { useLanguage } from "@/hooks/LanguageProvider";
export default function LoaderChat({ loadPreview, mode }) {
  const { t } = useLanguage();
  return (
    <div className="relative w-[40px] h-[40px] z-0 ">
      <div className={styles.loader}></div>

      <div className="absolute inset-0 flex items-center justify-center z-[2000]">
        <Image
          src="../../images/icon/icon_loader.png"
          alt="Icon MJM"
          width={32}
          height={32}
          className="rounded-full"
        />
        {!loadPreview ? (
          <p
            className={`bg-gradient-to-r from-[#6F6F6F] to-[#FFFFFF] bg-clip-text text-transparent font-medium ${
              mode === "preview"
                ? "absolute left-[80px] w-[85px] text-center"
                : "absolute font-[300] text-[14px] ml-36 w-[200px] text-center"
            } `}
          >
            {mode === "preview" ? t.status.thinking : t.status.generating}
          </p>
        ) : null}
      </div>
    </div>
  );
}
