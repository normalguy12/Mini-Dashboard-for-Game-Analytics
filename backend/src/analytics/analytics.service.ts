/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { AnalyticsEntry } from './interfaces/analytics-entry.interface';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { FilterAnalyticsDto } from './dto/filter-analytics.dto';

@Injectable()
export class AnalyticsService implements OnModuleInit {
  /** In-memory store — data is lost on server restart (acceptable for MVP) */
  private entries: AnalyticsEntry[] = [];

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  onModuleInit(): void {
    this.seedData();
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Return all entries, optionally filtered by gameId, eventType,
   * startDate, and/or endDate.
   */
  findAll(filters: FilterAnalyticsDto): {
    data: AnalyticsEntry[];
    total: number;
  } {
    let result = [...this.entries];

    if (filters.gameId) {
      result = result.filter((e) => e.gameId === filters.gameId);
    }

    if (filters.eventType) {
      result = result.filter((e) => e.eventType === filters.eventType);
    }

    if (filters.startDate || filters.endDate) {
      // Validate date strings before using them
      const start = filters.startDate
        ? this.parseDate(filters.startDate, 'startDate')
        : null;
      const end = filters.endDate
        ? this.parseDate(filters.endDate, 'endDate')
        : null;

      result = result.filter((e) => {
        const ts = new Date(e.timestamp).getTime();
        if (start && ts < start) return false;
        if (end && ts > end) return false;
        return true;
      });
    }

    return { data: result, total: result.length };
  }

  /**
   * Create a new analytics entry with an auto-generated id and timestamp.
   */
  create(dto: CreateAnalyticsDto): AnalyticsEntry {
    const entry: AnalyticsEntry = {
      id: crypto.randomUUID(),
      gameId: dto.gameId,
      eventType: dto.eventType,
      playerId: dto.playerId,
      timestamp: new Date().toISOString(),
    };

    if (dto.score !== undefined) entry.score = dto.score;
    if (dto.duration !== undefined) entry.duration = dto.duration;
    if (dto.metadata !== undefined) entry.metadata = dto.metadata;

    this.entries.push(entry);
    return entry;
  }

  /**
   * Return aggregated statistics across all stored entries.
   */
  getSummary(): {
    totalEntries: number;
    totalGames: number;
    avgScore: number;
    avgDuration: number;
    eventTypeBreakdown: Record<string, number>;
  } {
    const totalEntries = this.entries.length;

    // Distinct game IDs
    const totalGames = new Set(this.entries.map((e) => e.gameId)).size;

    // Average score — only entries that have a score value
    const scored = this.entries.filter((e) => e.score !== undefined);
    const avgScore =
      scored.length > 0
        ? scored.reduce((sum, e) => sum + (e.score as number), 0) /
        scored.length
        : 0;

    // Average duration — only entries that have a duration value
    const timed = this.entries.filter((e) => e.duration !== undefined);
    const avgDuration =
      timed.length > 0
        ? timed.reduce((sum, e) => sum + (e.duration as number), 0) /
        timed.length
        : 0;

    // Count per eventType
    const eventTypeBreakdown: Record<string, number> = {};
    for (const entry of this.entries) {
      eventTypeBreakdown[entry.eventType] =
        (eventTypeBreakdown[entry.eventType] ?? 0) + 1;
    }

    return {
      totalEntries,
      totalGames,
      avgScore,
      avgDuration,
      eventTypeBreakdown,
    };
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /** Parse a date string; throws BadRequestException if it is not a valid date. */
  private parseDate(value: string, fieldName: string): number {
    const ms = Date.parse(value);
    if (isNaN(ms)) {
      throw new BadRequestException(
        `Invalid date value for '${fieldName}': "${value}"`,
      );
    }
    return ms;
  }

  /** Populate the store with realistic sample entries on startup. */
  private seedData(): void {
    const games = ['game-001', 'game-002', 'game-003'];
    const eventTypes = [
      'match_start',
      'match_end',
      'achievement',
      'level_up',
      'quit',
    ];
    const players = [
      'player-1',
      'player-2',
      'player-3',
      'player-4',
      'player-5',
    ];

    const seed: Omit<AnalyticsEntry, 'id'>[] = [
      {
        gameId: 'game-001',
        eventType: 'match_start',
        playerId: 'player-1',
        timestamp: '2026-01-10T08:00:00.000Z',
      },
      {
        gameId: 'game-001',
        eventType: 'match_end',
        playerId: 'player-1',
        score: 1500,
        duration: 320,
        timestamp: '2026-01-10T08:06:00.000Z',
      },
      {
        gameId: 'game-001',
        eventType: 'achievement',
        playerId: 'player-2',
        score: 500,
        timestamp: '2026-01-11T09:15:00.000Z',
        metadata: { achievement: 'first_blood' },
      },
      {
        gameId: 'game-002',
        eventType: 'match_start',
        playerId: 'player-3',
        timestamp: '2026-01-12T13:00:00.000Z',
      },
      {
        gameId: 'game-002',
        eventType: 'match_end',
        playerId: 'player-3',
        score: 2200,
        duration: 480,
        timestamp: '2026-01-12T13:10:00.000Z',
      },
      {
        gameId: 'game-002',
        eventType: 'level_up',
        playerId: 'player-4',
        score: 300,
        timestamp: '2026-01-13T15:30:00.000Z',
        metadata: { level: 5 },
      },
      {
        gameId: 'game-003',
        eventType: 'match_start',
        playerId: 'player-5',
        timestamp: '2026-01-14T10:00:00.000Z',
      },
      {
        gameId: 'game-003',
        eventType: 'match_end',
        playerId: 'player-5',
        score: 900,
        duration: 210,
        timestamp: '2026-01-14T10:04:00.000Z',
      },
      {
        gameId: 'game-003',
        eventType: 'quit',
        playerId: 'player-2',
        duration: 60,
        timestamp: '2026-01-15T11:00:00.000Z',
      },
      {
        gameId: 'game-001',
        eventType: 'match_end',
        playerId: 'player-4',
        score: 3100,
        duration: 540,
        timestamp: '2026-01-16T14:20:00.000Z',
      },
      {
        gameId: 'game-002',
        eventType: 'achievement',
        playerId: 'player-1',
        score: 750,
        timestamp: '2026-01-17T16:45:00.000Z',
        metadata: { achievement: 'hat_trick' },
      },
      {
        gameId: 'game-003',
        eventType: 'level_up',
        playerId: 'player-3',
        score: 400,
        timestamp: '2026-01-18T12:00:00.000Z',
        metadata: { level: 10 },
      },
    ];

    // Suppress unused variable warnings for the arrays — they're here for documentation
    void games;
    void eventTypes;
    void players;

    this.entries = seed.map((s) => ({ ...s, id: crypto.randomUUID() }));
  }
}
