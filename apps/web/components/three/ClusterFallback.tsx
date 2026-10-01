const DOTS: [number, number, number][] = [
  [120, 120, 18], [84, 96, 14], [156, 92, 12], [150, 150, 16], [92, 150, 13], [120, 70, 10],
  [60, 128, 11], [182, 128, 12], [118, 172, 12], [70, 70, 9], [174, 70, 9], [62, 176, 9],
];

/** Static sage line drawing of the cluster: SSR, loading and no-WebGL state. */
export function ClusterFallback({ height = 360 }: { height?: number }) {
  return (
    <div className="flex w-full items-center justify-center" style={{ height }}>
      <svg viewBox="0 0 240 240" className="h-[75%] max-h-full" role="img" aria-label="Line drawing of a molecular cluster">
        {DOTS.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="#6B7E73" strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  );
}
