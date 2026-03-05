"use client";

import dynamic from "next/dynamic";
import type { AnalyticsEntry, SummaryStats } from "@/lib/types";

// Dynamic import with ssr:false for Recharts (required for Next.js SSR compatibility)
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const LineChart = dynamic(() => import("recharts").then((m) => m.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then((m) => m.Line), { ssr: false });
const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), {
  ssr: false,
});
const Legend = dynamic(() => import("recharts").then((m) => m.Legend), { ssr: false });

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

interface ChartSectionProps {
  entries: AnalyticsEntry[];
  stats: SummaryStats | null;
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700">{title}</h3>
      {children}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-48 items-center justify-center text-sm text-zinc-400">
      No data available
    </div>
  );
}

export default function ChartSection({ entries, stats }: ChartSectionProps) {
  // --- Active users over time (Line Chart) ---
  const usersByDate = entries.reduce<Record<string, Set<string>>>((acc, e) => {
    const day = e.timestamp.slice(0, 10);
    if (!acc[day]) acc[day] = new Set();
    acc[day].add(e.playerId);
    return acc;
  }, {});
  const lineData = Object.entries(usersByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, players]) => ({ date, users: players.size }));

  // --- Score over time (Bar Chart) ---
  const scoreByDate = entries
    .filter((e) => e.score !== undefined)
    .reduce<Record<string, number[]>>((acc, e) => {
      const day = e.timestamp.slice(0, 10);
      if (!acc[day]) acc[day] = [];
      acc[day].push(e.score!);
      return acc;
    }, {});
  const barData = Object.entries(scoreByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, scores]) => ({
      date,
      avgScore: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
    }));

  // --- Event type distribution (Pie Chart) ---
  const breakdown = stats?.eventTypeBreakdown ?? {};
  const pieData = Object.entries(breakdown).map(([name, value]) => ({ name, value }));

  // --- Top games by entry count (Horizontal Bar) ---
  const gameCount = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.gameId] = (acc[e.gameId] ?? 0) + 1;
    return acc;
  }, {});
  const topGamesData = Object.entries(gameCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([gameId, count]) => ({ gameId, count }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Line Chart — Active users over time */}
      <ChartCard title="Active Users Over Time">
        {lineData.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Bar Chart — Avg score over time */}
      <ChartCard title="Average Score Over Time">
        {barData.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Pie Chart — Event type distribution */}
      <ChartCard title="Event Type Distribution">
        {pieData.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Horizontal Bar Chart — Top games */}
      <ChartCard title="Top Games by Entry Count">
        {topGamesData.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topGamesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="gameId" tick={{ fontSize: 11 }} width={70} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}
