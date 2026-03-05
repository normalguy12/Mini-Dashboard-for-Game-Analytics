"use client";

import SkeletonRow from "@/app/components/ui/SkeletonRow";
import type { AnalyticsEntry } from "@/lib/types";

interface AnalyticsTableProps {
  entries: AnalyticsEntry[];
  total: number;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

const SKELETON_COUNT = 8;

const th =
  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500";
const td =
  "whitespace-nowrap px-4 py-3 text-sm text-zinc-700";

function fmt(value: number | undefined): string {
  return value !== undefined && value !== null ? String(value) : "—";
}

export default function AnalyticsTable({ entries, total, loading, error, onRetry }: AnalyticsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 px-4 py-3">
        <span className="text-xs text-zinc-500">
          {loading ? "Loading…" : `Showing ${total} entr${total === 1 ? "y" : "ies"}`}
        </span>
      </div>

      <table className="min-w-full divide-y divide-zinc-100">
        <thead className="bg-zinc-50">
          <tr>
            <th className={th}>Game ID</th>
            <th className={th}>Event Type</th>
            <th className={th}>Player ID</th>
            <th className={th}>Score</th>
            <th className={th}>Duration (s)</th>
            <th className={th}>Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {loading && entries.length === 0 && (
            <>
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-sm text-red-600">
                <span>{error}</span>
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="ml-3 rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    Retry
                  </button>
                )}
              </td>
            </tr>
          )}

          {!loading && !error && entries.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-400">
                No entries found.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-zinc-50 transition-colors">
                <td className={td}>{entry.gameId}</td>
                <td className={td}>
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                    {entry.eventType}
                  </span>
                </td>
                <td className={td}>{entry.playerId}</td>
                <td className={td}>{fmt(entry.score)}</td>
                <td className={td}>{fmt(entry.duration)}</td>
                <td className={td}>{new Date(entry.timestamp).toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
