"use client";

import { useCallback, useEffect, useState } from "react";
import { getSummary } from "@/lib/api";
import type { SummaryStats } from "@/lib/types";

interface UseSummaryResult {
  stats: SummaryStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useSummary(): UseSummaryResult {
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSummary();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load summary stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stats, loading, error, refresh: fetchData };
}
