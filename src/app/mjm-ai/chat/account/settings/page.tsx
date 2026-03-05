"use client";

import { ChangePasswordForm } from "@/components/account/settings/ChangePasswordForm";
import { DeleteAccountCard } from "@/components/account/settings/DeleteAccountCard";
import { UpdateProfileForm } from "@/components/account/settings/UpdateProfileForm";
import { UploadAvatarCard } from "@/components/account/settings/UploadAvatarCard";
import { Spinner } from "@/components/ui/spinner";
import { getAccessToken } from "@/utils/local-storage";
import { useQuery } from "@tanstack/react-query";

export default function SettingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      fetch("https://apigateway.yojomjm.com/auth-service/v1/account", {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }).then(res => res.json()),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  const user = data.data;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <UploadAvatarCard avatar={user.avatar} />
        <UpdateProfileForm username={user.username} />
        {user.provider === "LOCAL" && <ChangePasswordForm />}
        <DeleteAccountCard />
      </div>
    </div>
  );
}
