/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsEntry } from './interfaces/analytics-entry.interface';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    // onModuleInit seeds 12 entries — reset to an empty store for most tests
    (service as any).entries = [];
  });

  // ---------------------------------------------------------------------------
  // create()
  // ---------------------------------------------------------------------------

  describe('create()', () => {
    it('should auto-generate an id and timestamp', () => {
      const dto: CreateAnalyticsDto = {
        gameId: 'game-001',
        eventType: 'match_start',
        playerId: 'player-1',
      };

      const entry = service.create(dto);

      expect(entry.id).toBeDefined();
      expect(typeof entry.id).toBe('string');
      expect(entry.id.length).toBeGreaterThan(0);
      expect(entry.timestamp).toBeDefined();
      expect(() => new Date(entry.timestamp)).not.toThrow();
    });

    it('should persist the created entry in the store', () => {
      const dto: CreateAnalyticsDto = {
        gameId: 'game-001',
        eventType: 'match_start',
        playerId: 'player-1',
      };
      service.create(dto);

      const { total } = service.findAll({});
      expect(total).toBe(1);
    });

    it('should include optional fields when provided', () => {
      const dto: CreateAnalyticsDto = {
        gameId: 'game-002',
        eventType: 'match_end',
        playerId: 'player-2',
        score: 900,
        duration: 120,
        metadata: { custom: true },
      };

      const entry = service.create(dto);

      expect(entry.score).toBe(900);
      expect(entry.duration).toBe(120);
      expect(entry.metadata).toEqual({ custom: true });
    });

    it('should omit optional fields when not provided', () => {
      const dto: CreateAnalyticsDto = {
        gameId: 'game-001',
        eventType: 'match_start',
        playerId: 'player-1',
      };

      const entry = service.create(dto);

      expect(entry.score).toBeUndefined();
      expect(entry.duration).toBeUndefined();
      expect(entry.metadata).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // findAll()
  // ---------------------------------------------------------------------------

  describe('findAll()', () => {
    let seeded: AnalyticsEntry[];

    beforeEach(() => {
      // Seed a known set of entries for filtering tests
      seeded = [
        service.create({
          gameId: 'game-001',
          eventType: 'match_start',
          playerId: 'player-1',
        }),
        service.create({
          gameId: 'game-001',
          eventType: 'match_end',
          playerId: 'player-1',
          score: 100,
        }),
        service.create({
          gameId: 'game-002',
          eventType: 'match_start',
          playerId: 'player-2',
        }),
        service.create({
          gameId: 'game-002',
          eventType: 'achievement',
          playerId: 'player-3',
          score: 500,
        }),
      ];
      // Fix timestamps so date-range tests are deterministic
      (service as any).entries[0].timestamp = '2026-01-01T00:00:00.000Z';
      (service as any).entries[1].timestamp = '2026-02-01T00:00:00.000Z';
      (service as any).entries[2].timestamp = '2026-03-01T00:00:00.000Z';
      (service as any).entries[3].timestamp = '2026-04-01T00:00:00.000Z';
    });

    it('should return all entries with no filters', () => {
      const { data, total } = service.findAll({});
      expect(total).toBe(4);
      expect(data).toHaveLength(4);
    });

    it('should filter by gameId', () => {
      const { data, total } = service.findAll({ gameId: 'game-001' });
      expect(total).toBe(2);
      data.forEach((e) => expect(e.gameId).toBe('game-001'));
    });

    it('should filter by eventType', () => {
      const { data, total } = service.findAll({ eventType: 'match_start' });
      expect(total).toBe(2);
      data.forEach((e) => expect(e.eventType).toBe('match_start'));
    });

    it('should filter by startDate', () => {
      const { data, total } = service.findAll({
        startDate: '2026-02-15T00:00:00.000Z',
      });
      expect(total).toBe(2);
      data.forEach((e) =>
        expect(new Date(e.timestamp).getTime()).toBeGreaterThanOrEqual(
          new Date('2026-02-15T00:00:00.000Z').getTime(),
        ),
      );
    });

    it('should filter by endDate', () => {
      const { data, total } = service.findAll({
        endDate: '2026-01-31T23:59:59.000Z',
      });
      expect(total).toBe(1);
      expect(data[0].timestamp).toBe('2026-01-01T00:00:00.000Z');
    });

    it('should apply combined gameId + eventType filters', () => {
      const { data, total } = service.findAll({
        gameId: 'game-001',
        eventType: 'match_end',
      });
      expect(total).toBe(1);
      expect(data[0].gameId).toBe('game-001');
      expect(data[0].eventType).toBe('match_end');
    });

    it('should return empty result when no entries match', () => {
      const { data, total } = service.findAll({ gameId: 'nonexistent-game' });
      expect(total).toBe(0);
      expect(data).toEqual([]);
    });

    it('should throw BadRequestException for invalid startDate', () => {
      expect(() => service.findAll({ startDate: 'not-a-date' })).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid endDate', () => {
      expect(() => service.findAll({ endDate: 'bad-value' })).toThrow(
        BadRequestException,
      );
    });
  });

  // ---------------------------------------------------------------------------
  // getSummary()
  // ---------------------------------------------------------------------------

  describe('getSummary()', () => {
    it('should return zeroed summary when store is empty', () => {
      const summary = service.getSummary();
      expect(summary).toEqual({
        totalEntries: 0,
        totalGames: 0,
        avgScore: 0,
        avgDuration: 0,
        eventTypeBreakdown: {},
      });
    });

    it('should compute totalEntries and totalGames correctly', () => {
      service.create({
        gameId: 'game-001',
        eventType: 'match_start',
        playerId: 'p1',
      });
      service.create({
        gameId: 'game-001',
        eventType: 'match_end',
        playerId: 'p2',
      });
      service.create({
        gameId: 'game-002',
        eventType: 'match_start',
        playerId: 'p3',
      });

      const { totalEntries, totalGames } = service.getSummary();
      expect(totalEntries).toBe(3);
      expect(totalGames).toBe(2);
    });

    it('should exclude entries without score from avgScore', () => {
      service.create({
        gameId: 'g1',
        eventType: 'e1',
        playerId: 'p1',
        score: 100,
      });
      service.create({
        gameId: 'g1',
        eventType: 'e1',
        playerId: 'p2',
        score: 200,
      });
      service.create({ gameId: 'g1', eventType: 'e1', playerId: 'p3' }); // no score

      const { avgScore } = service.getSummary();
      expect(avgScore).toBe(150); // (100 + 200) / 2
    });

    it('should exclude entries without duration from avgDuration', () => {
      service.create({
        gameId: 'g1',
        eventType: 'e1',
        playerId: 'p1',
        duration: 60,
      });
      service.create({
        gameId: 'g1',
        eventType: 'e1',
        playerId: 'p2',
        duration: 120,
      });
      service.create({ gameId: 'g1', eventType: 'e1', playerId: 'p3' }); // no duration

      const { avgDuration } = service.getSummary();
      expect(avgDuration).toBe(90); // (60 + 120) / 2
    });

    it('should produce correct eventTypeBreakdown', () => {
      service.create({
        gameId: 'g1',
        eventType: 'match_start',
        playerId: 'p1',
      });
      service.create({
        gameId: 'g1',
        eventType: 'match_start',
        playerId: 'p2',
      });
      service.create({ gameId: 'g1', eventType: 'match_end', playerId: 'p3' });
      service.create({ gameId: 'g1', eventType: 'match_end', playerId: 'p4' });

      const { eventTypeBreakdown } = service.getSummary();
      expect(eventTypeBreakdown).toEqual({ match_start: 2, match_end: 2 });
    });

    it('avgScore should be 0 when no entries have a score', () => {
      service.create({ gameId: 'g1', eventType: 'quit', playerId: 'p1' });
      const { avgScore } = service.getSummary();
      expect(avgScore).toBe(0);
    });
  });
});
