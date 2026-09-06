import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useLang } from "@/lib/LanguageProvider";

// App-wide delete confirmation. Shown before any deletion (medication,
// allergy, alarm, profile, scan session). Canceling or dismissing leaves
// everything unchanged; only "Remove" actually deletes.
export default function ConfirmDeleteDialog({ open, onConfirm, onCancel }) {
  const { t } = useLang();
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("confirmDelete.title")}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{t("confirmDelete.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{t("confirmDelete.remove")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}