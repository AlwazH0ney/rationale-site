export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`text-h2 font-extrabold tracking-[-0.03em] text-ink ${className}`}>
      rationale<span className="text-sage">.</span>
    </span>
  );
}
