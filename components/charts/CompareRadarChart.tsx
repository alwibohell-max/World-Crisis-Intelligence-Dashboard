"use client";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
export function CompareRadarChart({ data }: { data: Array<Record<string, string | number>> }) { return <div className="h-80"><ResponsiveContainer><RadarChart data={data}><PolarGrid /><PolarAngleAxis dataKey="metric" /><Tooltip /><Radar dataKey="risk" stroke="#f97316" fill="#f97316" fillOpacity={0.35} /></RadarChart></ResponsiveContainer></div>; }
