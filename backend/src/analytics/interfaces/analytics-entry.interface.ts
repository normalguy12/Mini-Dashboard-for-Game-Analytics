export interface AnalyticsEntry {
  id: string; // UUID
  gameId: string; // e.g. "game-001"
  eventType: string; // e.g. "match_start", "match_end", "achievement"
  playerId: string; // e.g. "player-42"
  score?: number; // optional numeric score
  duration?: number; // optional session duration in seconds
  metadata?: object; // optional extra data
  timestamp: string; // ISO 8601
}
