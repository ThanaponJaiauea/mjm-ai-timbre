"use client";

import { generateId } from "ai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const chatId = generateId();
    router.push(`/mjm-ai/chat/${chatId}`);
  }, [router]);

  return null;
}
