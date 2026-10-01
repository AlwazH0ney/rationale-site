/** Recharts styling shared by both line charts: 1px dotted chalk grid, stone mono ticks. */
export const GRID = { stroke: "#E6E4DD", strokeDasharray: "1 3", vertical: true } as const;

export const AXIS = {
  stroke: "#C9C6BE",
  tickLine: false,
  tick: { fill: "#8A8780", fontSize: 11, fontFamily: "var(--font-jetbrains)" },
} as const;

export const TOOLTIP = {
  isAnimationActive: false,
  contentStyle: {
    border: "1px solid #E6E4DD",
    borderRadius: 10,
    boxShadow: "none",
    fontSize: 12,
    fontFamily: "var(--font-jetbrains)",
  },
  formatter: (v: number) => v.toFixed(2),
  labelFormatter: (l: number) => `at ${Number(l).toFixed(2)}`,
} as const;
