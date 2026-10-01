"use client";

import { MotionConfig } from "framer-motion";

/** Framer Motion honours prefers-reduced-motion everywhere below this provider. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
