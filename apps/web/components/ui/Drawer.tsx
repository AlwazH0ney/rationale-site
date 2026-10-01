"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { Button } from "./Button";
import { useDialog } from "./useDialog";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  label?: string;
  children: ReactNode;
}

/** Slides in from the right over a dimmed backdrop; Escape or the backdrop closes it. */
export function Drawer({ open, onClose, title, label, children }: DrawerProps) {
  const ref = useDialog<HTMLDivElement>(open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-ink/30"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            data-testid="drawer-backdrop"
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col gap-6 overflow-y-auto bg-paper p-8 md:p-10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.2, 0.7, 0.2, 1], duration: 0.32 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                {label && <p className="label">{label}</p>}
                <h3 id="drawer-title" className="text-h1">
                  {title}
                </h3>
              </div>
              <Button variant="ghost" onClick={onClose} aria-label="Close panel">
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
