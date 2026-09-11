"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /**
   * When true, the dialog only closes via an explicit action (the close "X"
   * button, or a button inside the modal that calls onClose) — clicking
   * outside or pressing Escape is ignored. Useful for long forms where an
   * accidental dismissal would lose progress. Defaults to false to preserve
   * existing behavior for other consumers of this component.
   */
  preventAccidentalClose?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  preventAccidentalClose = false,
}) => {
  return (
    <Dialog
      open={isOpen}
      disablePointerDismissal={preventAccidentalClose}
      onOpenChange={(open, eventDetails) => {
        if (open) return;
        if (preventAccidentalClose && eventDetails.reason === "escape-key") return;
        onClose();
      }}
    >
      <DialogContent className={cn("max-h-[90dvh] gap-4 overflow-y-auto", className)}>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};
