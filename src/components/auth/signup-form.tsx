"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    username: z.string().min(3, { error: "Username must be at least 3 characters long" }),
    email: z.email(),
    password: z.string().min(8, { error: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, { error: "Password must be at least 8 characters long" }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch("https://apigateway.yojomjm.com/auth-service/v1/auth/signup", {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
          }),
        });

        if (!response.ok) {
          const result = await response.json();
          if (result?.message) {
            throw new Error(result.message);
          } else {
            throw new Error("Failed to create account");
          }
        }

        const result = await response.json();
        toast.success("Account created successfully!");
        console.log("Signup result:", result);

        router.push(`?auth=verify-email&email=${data.email}`);
      } catch (error) {
        toast.error("Sign up failed", {
          description: error instanceof Error ? error.message : "An unexpected error occurred",
        });
      }
    });
  }
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold">Create an Account ✨</h2>
        <p className="text-[16px] text-muted-foreground">
          Choose a sign-up method to <span className="text-[#6174FF]">continue</span>
        </p>
      </div>
      <div className="flex flex-row gap-8 justify-center">
        <Button variant="outline" className="rounded-full size-14">
          <Link href="https://apigateway.yojomjm.com/auth-service/oauth2/google?redirectUrl=http://localhost:3000/auth/callback">
            <Image src="/logo/google-logo.svg" alt="Google" width={28} height={28} />
          </Link>
        </Button>
        <Button variant="outline" className="rounded-full size-14">
          <Link href="https://apigateway.yojomjm.com/auth-service/oauth2/apple?redirectUrl=http://localhost:3000/auth/callback">
            <Image src="/logo/apple-logo.svg" alt="Apple" width={28} height={28} />
          </Link>
        </Button>
        <Button variant="outline" className="rounded-full size-14">
          <Link href="#">
            <Image src="/logo/mjm-music-logo.svg" alt="MJM Music" width={28} height={28} />
          </Link>
        </Button>
      </div>
      <div className="relative flex items-center py-2 w-48 mx-auto">
        <div className="grow border-t border-muted" />
        <span className="mx-2 shrink text-xs uppercase text-muted-foreground">Or</span>
        <div className="grow border-t border-muted" />
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <FieldGroup className="gap-4">
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  {...field}
                  id="username"
                  type="text"
                  placeholder="Username"
                  aria-invalid={fieldState.invalid}
                  autoComplete="username"
                  className="rounded-full h-12"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                  className="rounded-full h-12"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  {...field}
                  id="password"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                  className="rounded-full h-12"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <Input
                  {...field}
                  id="confirmPassword"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                  className="rounded-full h-12"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        <Button type="submit" className="w-full rounded-full h-12 text-[18px] font-medium mt-4" disabled={isPending}>
          {isPending && <Spinner />}
          <span className="bg-linear-to-r from-[#E759FF] to-[#6174FF] bg-clip-text text-transparent">Sign Up</span>
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="?auth=signin" className="text-[#6174FF] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
