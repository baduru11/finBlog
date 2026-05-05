"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
  x: string | number;
  y: number;
}

interface MiniChartProps {
  data: DataPoint[];
  caption?: string;
  source?: string;
  yLabel?: string;
  height?: number;
}

export function MiniChart({
  data,
  caption,
  source,
  yLabel,
  height = 220,
}: MiniChartProps) {
  return (
    <figure className="my-8 not-prose">
      <div
        className="border border-[color:var(--rule)] bg-[color:var(--bg-elevated)] p-4 pb-2"
        style={{ height: height + 24 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="finblog-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.18} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--rule)" strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="x"
              stroke="var(--ink-subtle)"
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "var(--ink-subtle)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--rule)" }}
            />
            <YAxis
              stroke="var(--ink-subtle)"
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)", fill: "var(--ink-subtle)" }}
              tickLine={false}
              axisLine={false}
              label={
                yLabel
                  ? {
                      value: yLabel,
                      position: "insideTopLeft",
                      offset: 8,
                      style: { fill: "var(--ink-subtle)", fontSize: 11 },
                    }
                  : undefined
              }
            />
            <Tooltip
              contentStyle={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--rule)",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
              }}
              labelStyle={{ color: "var(--ink-muted)" }}
              cursor={{ stroke: "var(--ink-subtle)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="y"
              stroke="var(--accent)"
              strokeWidth={1.75}
              fill="url(#finblog-grad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {(caption || source) && (
        <figcaption className="mt-2 flex items-baseline justify-between gap-4 text-[0.75rem]">
          {caption && (
            <span className="text-[color:var(--ink-muted)] italic">{caption}</span>
          )}
          {source && (
            <span className="text-[color:var(--ink-subtle)] font-[family-name:var(--font-mono)]">
              Source: {source}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
