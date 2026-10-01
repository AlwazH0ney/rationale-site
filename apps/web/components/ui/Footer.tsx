import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="mt-16 flex flex-col gap-4 border-t border-chalk pt-8 md:flex-row md:items-center md:justify-between">
      <Wordmark />
      <p className="text-label font-semibold text-ink">Not for clinical use</p>
      <p className="text-label text-stone">© 2026 rationale · research prototype</p>
    </footer>
  );
}
