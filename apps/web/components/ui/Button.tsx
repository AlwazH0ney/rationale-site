import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "sage" | "ghost";

const BASE =
  "inline-flex items-center justify-center gap-2 text-label font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40";

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "h-11 rounded-sm bg-ink px-5 text-paper hover:bg-slate",
  secondary: "h-11 rounded-pill bg-ink px-6 text-paper hover:bg-slate",
  outline: "h-11 rounded-pill border border-ink px-6 text-ink hover:bg-linen",
  sage: "h-11 rounded-pill bg-sage px-6 text-paper hover:bg-ink",
  ghost: "h-9 rounded-sm px-3 text-slate hover:bg-linen hover:text-ink",
};

interface CommonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
export type LinkButtonProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function buttonClass(variant: ButtonVariant = "primary", extra = ""): string {
  return `${BASE} ${BUTTON_VARIANTS[variant]} ${extra}`.trim();
}

/** Square ink (primary), pill ink (secondary), pill outline, sage-filled (one per page), ghost. */
export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />;
}

export function LinkButton({ variant = "primary", className = "", href, ...rest }: LinkButtonProps) {
  return <Link href={href} className={buttonClass(variant, className)} {...rest} />;
}
