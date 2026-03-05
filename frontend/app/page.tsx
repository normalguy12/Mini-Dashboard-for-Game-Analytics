"use client";

import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useSummary } from "@/hooks/useSummary";
import SummaryStats from "@/app/components/SummaryStats";
import FilterBar from "@/app/components/FilterBar";
import AnalyticsTable from "@/app/components/AnalyticsTable";
import AddEntryForm from "@/app/components/AddEntryForm";
import ChartSection from "@/app/components/ChartSection";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import type { FilterParams } from "@/lib/types";

export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterParams>({});
  const [showForm, setShowForm] = useState(false);

  const { entries, total, loading: tableLoading, error: tableError, refresh: refreshTable } = useAnalytics(filters);
  const { stats, loading: summaryLoading, error: summaryError, refresh: refreshSummary } = useSummary();

  function handleSuccess() {
    refreshTable();
    refreshSummary();
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* KPI Summary Cards */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Summary
          </h2>
          <SummaryStats
            stats={stats}
            loading={summaryLoading}
            error={summaryError}
            onRetry={refreshSummary}
          />
        </section>

        {/* Charts */}
        {!tableLoading && entries.length > 0 && (
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Charts
            </h2>
            <ChartSection entries={entries} stats={stats} />
          </section>
        )}

        {/* Filters + Actions */}
        <section>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Analytics Entries
              </h2>
              <FilterBar filters={filters} onFiltersChange={setFilters} />
            </div>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="shrink-0 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              + Add Entry
            </button>
          </div>

          <AnalyticsTable
            entries={entries}
            total={total}
            loading={tableLoading}
            error={tableError}
            onRetry={refreshTable}
          />
        </section>
      </div>

      {/* Add Entry Modal */}
      {showForm && (
        <AddEntryForm
          onSuccess={handleSuccess}
          onClose={() => setShowForm(false)}
        />
      )}
    </ErrorBoundary>
  );
}
