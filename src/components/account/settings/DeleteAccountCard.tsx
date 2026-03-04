"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/use-auth-store";
import { Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function DeleteAccountCard() {
  return (
    <Card className="border-destructive bg-destructive/5">
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
      </CardHeader>
      <CardContent>
        <p>By deleting your account, you will lose all your data. This action cannot be undone.</p>
      </CardContent>
      <CardFooter className="justify-end">
        <ConfirmDeleteDialog />
      </CardFooter>
    </Card>
  );
}

function ConfirmDeleteDialog() {
  const clearAuth = useAuthStore(state => state.clearAuth);

  const [open, setOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  async function handleDelete() {
    startDeleteTransition(async () => {
      console.log("delete");
      try {
        const res = await fetch("https://apigateway.yojomjm.com/auth-service/v1/account", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) {
          if (res.status === 417) {
            const error = await res.json();
            toast.error(`${error.code}: ${error.message}`);
            return;
          } else {
            throw new Error("Failed to delete account");
          }
        }
        const data = await res.json();
        console.log(data);
        toast.success("Account deleted successfully");

        clearAuth();
        globalThis.location.href = "/";
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete account");
      }
      setOpen(false);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete account?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account. All your data will be deleted. You will not be able to recover
            your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Spinner />}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
