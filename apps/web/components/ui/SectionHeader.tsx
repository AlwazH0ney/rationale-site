import type { ReactNode } from "react";

export interface SectionHeaderProps {
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  size?: "display1" | "display2";
  id?: string;
  as?: "h1" | "h2";
}

/** Section label, headline and the thin counter-text lede. */
export function SectionHeader({ label, title, lede, size = "display2", id, as = "h2" }: SectionHeaderProps) {
  const Heading = as;
  return (
    <header className="flex max-w-[760px] flex-col gap-5">
      <p className="label">{label}</p>
      <Heading id={id} className={size === "display1" ? "text-display1" : "text-display2"}>
        {title}
      </Heading>
      {lede && <p className="max-w-[620px] text-lede text-slate">{lede}</p>}
    </header>
  );
}

/** The one sage word per headline. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-sage">{children}</span>;
}
