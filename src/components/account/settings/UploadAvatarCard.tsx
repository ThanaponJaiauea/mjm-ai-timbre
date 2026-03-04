"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Upload } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export function UploadAvatarCard({ avatar }: Readonly<{ avatar?: string }>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleSave = async () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file!);
        const res = await fetch("https://apigateway.yojomjm.com/file-service/v1/files/upload", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to upload avatar");
        }
        const data = await res.json();

        const res2 = await fetch("https://apigateway.yojomjm.com/auth-service/v1/account", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            avatar: data.data.url,
          }),
        });
        if (!res2.ok) {
          throw new Error("Failed to update avatar");
        }
        const data2 = await res2.json();
        console.log(data2);

        toast.success("Avatar uploaded successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload avatar");
      }
    });
  };

  return (
    <>
      <input type="file" accept="image/*" className="hidden" ref={inputRef} onChange={handleFileChange} />
      <Card>
        <CardHeader>
          <CardTitle>Upload Avatar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="w-24 h-24" onClick={handleUpload}>
              <AvatarImage src={file ? URL.createObjectURL(file) : avatar} />
              <AvatarFallback className="text-4xl">U</AvatarFallback>
            </Avatar>
            <Button variant="ghost" onClick={handleUpload}>
              <Upload /> Upload
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" onClick={() => setFile(null)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Spinner />}
            Save
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
