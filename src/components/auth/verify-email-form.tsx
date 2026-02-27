"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuthStore } from "@/store/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState } from "nuqs";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  code: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export function VerifyEmailForm() {
  const [email, setEmail] = useQueryState("email", {
    defaultValue: "example@email.com",
  });
  const [, setTab] = useQueryState("auth");
  const [countdown, setCountdown] = useState(30);
  const [isPending, startTransition] = useTransition();
  const setAuth = useAuthStore(state => state.setAuth);
  const canResend = countdown === 0;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch("https://apigateway.yojomjm.com/auth-service/v1/auth/verify-email", {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            verifyCode: data.code,
          }),
        });

        if (!response.ok) {
          const result = await response.json();
          if (result?.message) {
            throw new Error(result.message);
          } else {
            throw new Error("Failed to verify email");
          }
        }

        const result = await response.json();
        toast.success("Email verified successfully!");
        console.log("Verification result:", result);

        setAuth(result.data);
        setTab(null);
        setEmail(null);
      } catch (error) {
        toast.error("Verification failed", {
          description: error instanceof Error ? error.message : "An unexpected error occurred",
        });
      }
    });
  }

  function handleResend() {
    startTransition(async () => {
      try {
        const response = await fetch("https://apigateway.yojomjm.com/auth-service/v1/auth/resend-verify", {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to resend verification code");
        }

        setCountdown(30);
        toast.success("Verification code resent to your email");
      } catch (error) {
        toast.error("Failed to resend code", {
          description: error instanceof Error ? error.message : "An unexpected error occurred",
        });
      }
    });
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Verify your email</h2>
        <p className="text-[16px] text-muted-foreground">
          Please enter the 6-digit code sent to your email
          <span className="text-[#6174FF]"> {email} </span>
          for verification.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4 mt-2">
        <FieldGroup className="gap-4">
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="code" className="sr-only">
                  Verification Code
                </FieldLabel>
                <div className="flex w-full justify-center">
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-12 text-xl" />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={1} className="w-12 h-12 text-xl" />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={2} className="w-12 h-12 text-xl" />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="w-12 h-12 text-xl" />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={4} className="w-12 h-12 text-xl" />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={5} className="w-12 h-12 text-xl" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-center" />}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex items-center justify-center">
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={handleResend}
            disabled={!canResend}
            className="h-auto text-muted-foreground"
          >
            {canResend ? "Resend code" : `Resend code (${countdown}s)`}
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full rounded-full h-12 text-[18px] font-medium mt-4"
          disabled={!form.formState.isValid || isPending}
        >
          <span className="bg-linear-to-r from-[#E759FF] to-[#6174FF] bg-clip-text text-transparent">
            {isPending ? "Verifying..." : "Continue"}
          </span>
        </Button>
      </form>
    </div>
  );
}
