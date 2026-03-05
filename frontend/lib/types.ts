export interface AnalyticsEntry {
  id: string;
  gameId: string;
  eventType: string;
  playerId: string;
  score?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface SummaryStats {
  totalEntries: number;
  totalGames: number;
  avgScore: number;
  avgDuration: number;
  eventTypeBreakdown: Record<string, number>;
}

export interface FilterParams {
  gameId?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsResponse {
  data: AnalyticsEntry[];
  total: number;
}

export interface CreateAnalyticsDto {
  gameId: string;
  eventType: string;
  playerId: string;
  score?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}
