"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ReactNode } from "react";
import Button from "./ui/button";

type DeleteAlertProps = {
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
};

export default function DeleteAlert({
  title = "Revoke access",
  description = "Are you sure? This application will no longer be accessible and any existing sessions will be expired.",
  cancelText = "Cancel",
  confirmText = "Revoke",
  onConfirm,
}: DeleteAlertProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/30" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg">
          <AlertDialog.Title className="text-lg font-semibold text-gray-900">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-foreground ">
            {description}
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" color="gray">
                {cancelText}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="luxury" color="red" onClick={onConfirm}>
                {confirmText}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
