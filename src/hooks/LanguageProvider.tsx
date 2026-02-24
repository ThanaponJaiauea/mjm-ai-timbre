/** @format */

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import zh from "../locales/zh.json";

type Locale = "en" | "zh";
const texts: Record<Locale, typeof en> = { en, zh };

type LanguageContextType = {
  lang: Locale;
  setLang: (lang: Locale) => void;
  t: typeof en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ตั้งค่าเริ่มต้นเป็น "zh"
  const [lang, setLang] = useState<Locale>("zh");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Locale | null;
    // ถ้า localStorage ไม่มีค่า ให้ใช้ zh เป็น default
    if (saved) {
      setLang(saved);
    } else {
      localStorage.setItem("lang", "zh");
    }
    setReady(true);
  }, []);

  const setLangHandler = (lang: Locale) => {
    setLang(lang);
    localStorage.setItem("lang", lang);
  };

  const value = {
    lang,
    setLang: setLangHandler,
    t: texts[lang] || texts.zh,
  };

  if (!ready) return null;

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
