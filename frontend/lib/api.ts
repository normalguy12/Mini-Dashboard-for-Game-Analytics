import type { AnalyticsEntry, AnalyticsResponse, CreateAnalyticsDto, FilterParams, SummaryStats } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.message) {
        message = Array.isArray(body.message)
          ? body.message.join(", ")
          : body.message;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function getAnalytics(filters?: FilterParams): Promise<AnalyticsResponse> {
  const params = new URLSearchParams();
  if (filters?.gameId) params.set("gameId", filters.gameId);
  if (filters?.eventType) params.set("eventType", filters.eventType);
  if (filters?.startDate) params.set("startDate", filters.startDate);
  if (filters?.endDate) params.set("endDate", filters.endDate);

  const qs = params.toString();
  return request<AnalyticsResponse>(`/analytics${qs ? `?${qs}` : ""}`);
}

export async function postAnalytics(dto: CreateAnalyticsDto): Promise<AnalyticsEntry> {
  return request<AnalyticsEntry>("/analytics", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function getSummary(): Promise<SummaryStats> {
  return request<SummaryStats>("/analytics/summary");
}
