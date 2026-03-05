"use client";

import ErrorMessage from "@/app/components/ui/ErrorMessage";
import StatCard from "@/app/components/ui/StatCard";
import type { SummaryStats as SummaryStatsType } from "@/lib/types";

interface SummaryStatsProps {
  stats: SummaryStatsType | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="h-3 w-24 rounded bg-zinc-200" />
      <div className="mt-3 h-8 w-16 rounded bg-zinc-200" />
    </div>
  );
}

export default function SummaryStats({ stats, loading, error, onRetry }: SummaryStatsProps) {
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: "Total Entries", value: stats.totalEntries.toLocaleString() },
    { label: "Total Games", value: stats.totalGames.toLocaleString() },
    { label: "Avg Score", value: stats.avgScore.toFixed(1) },
    { label: "Avg Duration (s)", value: stats.avgDuration.toFixed(1) },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      {Object.keys(stats.eventTypeBreakdown).length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">
            Event Type Breakdown
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.eventTypeBreakdown).map(([type, count]) => (
              <span
                key={type}
                className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700"
              >
                {type}: {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
