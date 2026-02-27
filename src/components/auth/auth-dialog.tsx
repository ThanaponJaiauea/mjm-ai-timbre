"use client";

import { AlertDialog, AlertDialogContent, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { SignInForm } from "./signin-form";
import { SignUpForm } from "./signup-form";
import { VerifyEmailForm } from "./verify-email-form";

export function AuthDialog() {
  const [tab, setTab] = useQueryState("auth", {
    defaultValue: null,
    parse: value => value as "signin" | "signup" | "verify-email",
  });
  const [, setEmail] = useQueryState("email");

  return (
    <AlertDialog
      open={!!tab}
      onOpenChange={open => {
        if (!open) {
          setTab(null);
          setEmail(null);
        }
      }}
    >
      <AlertDialogContent className="rounded-[50px] p-12 border-0">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full absolute top-8 right-8"
          onClick={() => setTab(null)}
        >
          <X className="size-6" />
        </Button>
        <AlertDialogHeader>
          <Image src="/logo/mjm-logo.svg" alt="Logo" width={50} height={50} />
        </AlertDialogHeader>
        {tab === "signin" && <SignInForm />}
        {tab === "signup" && <SignUpForm />}
        {tab === "verify-email" && <VerifyEmailForm />}
      </AlertDialogContent>
    </AlertDialog>
  );
}
