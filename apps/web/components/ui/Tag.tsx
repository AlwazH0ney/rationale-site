import type { ReactNode } from "react";

export type TagVariant = "default" | "strong" | "sage" | "mono";

const VARIANTS: Record<TagVariant, string> = {
  default: "border-chalk bg-paper text-slate",
  strong: "border-ink bg-paper text-ink font-semibold",
  sage: "border-transparent bg-sage-ghost text-sage",
  mono: "border-chalk bg-cream text-slate font-mono",
};

export interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
  title?: string;
}

/** Small lowercase label for mutations, cited features and metadata. */
export function Tag({ children, variant = "default", title }: TagProps) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-micro ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
