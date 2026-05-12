"use client";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface CurrencyTrendPoint {
  date: string;
  value: number;
}

export function CurrencyTrendChart({ data, from, to }: { data: CurrencyTrendPoint[]; from: string; to: string }) {
  const formatted = data.map((point) => ({ ...point, label: point.date.slice(5) }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.2)" />
          <XAxis dataKey="label" stroke="rgba(148,163,184,.7)" tick={{ fontSize: 11 }} minTickGap={20} />
          <YAxis stroke="rgba(148,163,184,.7)" tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: 6 }}
            labelFormatter={(value, payload) => payload?.[0]?.payload?.date ?? value}
            formatter={(value) => [typeof value === "number" ? value.toFixed(5) : String(value), `${from} to ${to}`]}
          />
          <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
