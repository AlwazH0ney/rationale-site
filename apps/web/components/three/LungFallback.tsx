/** Static sage line drawing of the lungs: SSR, loading and no-WebGL state. */
export function LungFallback({ height = 460 }: { height?: number | string }) {
  return (
    <div className="flex w-full items-center justify-center" style={{ height }}>
      <svg viewBox="0 0 240 240" className="h-[80%] max-h-full" role="img" aria-label="Line drawing of the lungs">
        <g fill="none" stroke="#6B7E73" strokeWidth="1.5" strokeLinecap="round">
          <path d="M120 20 V92" />
          <path d="M120 92 L92 112 M120 92 L148 112" />
          <path d="M92 70 C58 74 34 120 36 168 C38 204 70 214 96 200 C108 192 110 150 108 112 Z" />
          <path d="M148 70 C182 74 206 120 204 168 C202 204 172 212 146 200 C134 192 130 150 132 112 Z" />
          <path d="M44 132 C66 130 88 132 106 140" />
          <path d="M40 166 C64 158 84 152 104 138" />
          <path d="M200 152 C178 148 156 144 134 132" />
        </g>
        <circle cx="166" cy="104" r="4" fill="#6B7E73" />
        <circle cx="166" cy="104" r="9" fill="none" stroke="#6B7E73" strokeWidth="1" />
      </svg>
    </div>
  );
}
