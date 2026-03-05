import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { FilterAnalyticsDto } from './dto/filter-analytics.dto';
import type { AnalyticsEntry } from './interfaces/analytics-entry.interface';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  /**
   * GET /analytics/summary
   * Must be declared BEFORE any parameterised route (e.g. /:id) so NestJS
   * does not treat the literal string "summary" as a URL parameter.
   */
  @Get('summary')
  getSummary(): {
    totalEntries: number;
    totalGames: number;
    avgScore: number;
    avgDuration: number;
    eventTypeBreakdown: Record<string, number>;
  } {
    return this.analyticsService.getSummary();
  }

  /**
   * GET /analytics
   * Returns all entries, optionally filtered by gameId, eventType,
   * startDate, and/or endDate.
   */
  @Get()
  findAll(@Query() filters: FilterAnalyticsDto): {
    data: AnalyticsEntry[];
    total: number;
  } {
    return this.analyticsService.findAll(filters);
  }

  /**
   * POST /analytics
   * Creates a new analytics entry. Returns 201 with the created entry.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAnalyticsDto): AnalyticsEntry {
    return this.analyticsService.create(dto);
  }
}
