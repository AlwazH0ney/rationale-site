"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { Button } from "./Button";
import { useDialog } from "./useDialog";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  label?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, label, children }: ModalProps) {
  const ref = useDialog<HTMLDivElement>(open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-ink/30"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-testid="modal-backdrop"
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            className="relative flex w-full max-w-[520px] flex-col gap-5 rounded-lg bg-paper p-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                {label && <p className="label">{label}</p>}
                <h3 id="modal-title" className="text-h2">
                  {title}
                </h3>
              </div>
              <Button variant="ghost" onClick={onClose} aria-label="Close dialog">
                close
              </Button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
