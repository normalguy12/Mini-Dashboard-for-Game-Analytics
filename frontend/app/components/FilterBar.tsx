"use client";

import { clsx } from "clsx";
import type { FilterParams } from "@/lib/types";

interface FilterBarProps {
  filters: FilterParams;
  onFiltersChange: (filters: FilterParams) => void;
}

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const hasFilters = Boolean(filters.gameId || filters.eventType);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium text-zinc-600">Game ID</label>
        <input
          type="text"
          className={inputClass}
          placeholder="e.g. game-42"
          value={filters.gameId ?? ""}
          onChange={(e) => onFiltersChange({ ...filters, gameId: e.target.value || undefined })}
        />
      </div>

      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium text-zinc-600">Event Type</label>
        <input
          type="text"
          className={inputClass}
          placeholder="e.g. level_complete"
          value={filters.eventType ?? ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, eventType: e.target.value || undefined })
          }
        />
      </div>

      <button
        type="button"
        disabled={!hasFilters}
        onClick={() => onFiltersChange({})}
        className={clsx(
          "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          hasFilters
            ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            : "cursor-not-allowed bg-zinc-50 text-zinc-400"
        )}
      >
        Clear Filters
      </button>
    </div>
  );
}
