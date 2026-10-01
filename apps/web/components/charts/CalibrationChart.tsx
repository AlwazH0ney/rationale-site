"use client";

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Metrics } from "@/lib/types";
import { ChartFrame } from "./ChartFrame";
import { AXIS, GRID, TOOLTIP } from "./theme";

export interface CalibrationChartProps {
  data: Metrics["calibration"];
}

/** Reliability diagram: predicted confidence against observed accuracy, raw vs calibrated. */
export function CalibrationChart({ data }: CalibrationChartProps) {
  return (
    <ChartFrame
      title="Calibration"
      illustrative={data.illustrative}
      caption={data.note}
      legend={[
        { label: "raw phi4 confidence", swatch: "ink" },
        { label: "calibrated", swatch: "sage" },
        { label: "perfect calibration", swatch: "dashed" },
      ]}
    >
      <div className="h-[240px]" aria-label="Reliability diagram" role="img">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.points} margin={{ top: 8, right: 8, bottom: 16, left: -8 }}>
            <CartesianGrid {...GRID} />
            <XAxis dataKey="confidence" type="number" domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]} {...AXIS}
              label={{ value: "predicted confidence", position: "insideBottom", offset: -8, ...AXIS.tick }} />
            <YAxis type="number" domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]} {...AXIS} />
            <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="#8A8780" strokeDasharray="4 4" ifOverflow="extendDomain" />
            <Tooltip {...TOOLTIP} />
            <Line type="monotone" dataKey="raw" name="raw" stroke="#15150F" strokeWidth={1.5} dot={{ r: 2 }} isAnimationActive={false} />
            <Line type="monotone" dataKey="calibrated" name="calibrated" stroke="#6B7E73" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
