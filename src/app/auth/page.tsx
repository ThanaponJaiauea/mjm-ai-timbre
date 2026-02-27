import { AuthDialog } from "@/components/auth/auth-dialog";

export default function AuthPage() {
  return (
    <div className="flex h-screen flex-col gap-4 items-center justify-center">
      <AuthDialog />
    </div>
  );
}
