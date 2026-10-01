"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Metrics } from "@/lib/types";
import { ChartFrame } from "./ChartFrame";
import { AXIS, GRID, TOOLTIP } from "./theme";

export interface CoverageRiskChartProps {
  data: Metrics["coverage_risk"];
}

/** Error rate on committed decisions as the matcher commits to fewer of them. */
export function CoverageRiskChart({ data }: CoverageRiskChartProps) {
  return (
    <ChartFrame
      title="Coverage and risk"
      illustrative={data.illustrative}
      caption={data.note}
      legend={[
        { label: "ranked by raw confidence", swatch: "ink" },
        { label: "ranked by calibrated confidence", swatch: "sage" },
      ]}
    >
      <div className="h-[240px]" aria-label="Coverage-risk curve" role="img">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.points} margin={{ top: 8, right: 8, bottom: 16, left: -8 }}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="coverage" type="number" domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]} {...AXIS}
              label={{ value: "coverage", position: "insideBottom", offset: -8, ...AXIS.tick }} />
            <YAxis type="number" domain={[0, 0.25]} ticks={[0, 0.05, 0.1, 0.15, 0.2, 0.25]} {...AXIS} />
            <Tooltip {...TOOLTIP} />
            <Line type="monotone" dataKey="raw" name="raw" stroke="#15150F" strokeWidth={1.5} dot={{ r: 2 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="calibrated" name="calibrated" stroke="#6B7E73" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
