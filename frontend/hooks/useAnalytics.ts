"use client";

import { useCallback, useEffect, useState } from "react";
import { getAnalytics } from "@/lib/api";
import type { AnalyticsEntry, FilterParams } from "@/lib/types";

interface UseAnalyticsResult {
  entries: AnalyticsEntry[];
  total: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useAnalytics(filters?: FilterParams): UseAnalyticsResult {
  const [entries, setEntries] = useState<AnalyticsEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, total: t } = await getAnalytics(filters);
      setEntries(Array.isArray(data) ? data : []);
      setTotal(t);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }, [filters?.gameId, filters?.eventType, filters?.startDate, filters?.endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { entries, total, loading, error, refresh: fetchData };
}
