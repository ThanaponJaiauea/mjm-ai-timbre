"use client";

import { AuthState, useAuthStore } from "@/store/use-auth-store";
import { Loader2, XCircle } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
  const [login_success] = useQueryState("login_success");
  const [token] = useQueryState("token");
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore(state => state.setAuth);

  useEffect(() => {
    if (token) {
      try {
        setAuth(JSON.parse(atob(token)) as AuthState);
        globalThis.location.href = "/";
      } catch (err) {
        console.error("Failed to parse auth token", err);
        // Avoid synchronous state update in effect warning
        setTimeout(() => setError("Failed to parse authentication token."), 0);
      }
    }
  }, [token, setAuth]);

  if (login_success !== "true") {
    return (
      <div className="flex min-h-dvh items-center justify-center p-4 bg-background">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border bg-card p-8 text-card-foreground shadow-sm">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-500" strokeWidth={1.5} />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Login Failed</h2>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t authenticate your account. Please return to the login page and try again.
            </p>
          </div>
          <button
            onClick={() => (globalThis.location.href = "/")}
            className="mt-4 h-10 px-4 py-2 w-full rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-4 bg-background">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border bg-card p-8 text-card-foreground shadow-sm">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-500" strokeWidth={1.5} />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Invalid Session</h2>
            <p className="text-sm text-muted-foreground">
              {error || "The login token is missing or invalid. Please try logging in again."}
            </p>
          </div>
          <button
            onClick={() => (globalThis.location.href = "/auth?error=invalid_token")}
            className="mt-4 h-10 px-4 py-2 w-full rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-4 bg-background">
      <div className="flex w-full max-w-md flex-col items-center gap-8 rounded-3xl p-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 animate-ping rounded-full border-2 border-primary/30" />
          <div className="absolute h-20 w-20 animate-ping rounded-full border-2 border-primary/40 [animation-delay:0.2s]" />
          <div className="relative rounded-full bg-primary/10 p-5 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-primary" strokeWidth={1.5} />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Authenticating</h2>
          <p className="text-sm text-muted-foreground animate-pulse">Attempting to securely sign you in...</p>
        </div>
      </div>
    </div>
  );
}
