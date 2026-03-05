## 1. Project Setup

- [x] 1.1 Install required dependencies: `class-validator`, `class-transformer` (`npm install class-validator class-transformer`)
- [x] 1.2 Configure global `ValidationPipe` in `main.ts` with `whitelist: true`
- [x] 1.3 Enable CORS in `main.ts` for origin `http://localhost:3000`
- [x] 1.4 Set backend to listen on port `3001` in `main.ts`

## 2. Data Model & Module Scaffold

- [x] 2.1 Create `analytics-entry.interface.ts` defining the `AnalyticsEntry` interface (`id`, `gameId`, `eventType`, `playerId`, `score?`, `duration?`, `metadata?`, `timestamp`)
- [x] 2.2 Create `create-analytics.dto.ts` with `class-validator` decorators for required fields (`gameId`, `eventType`, `playerId`) and optional fields (`score`, `duration`, `metadata`)
- [x] 2.3 Create `filter-analytics.dto.ts` with optional query-param fields (`gameId?`, `eventType?`, `startDate?`, `endDate?`)
- [x] 2.4 Generate `AnalyticsModule`, `AnalyticsController`, and `AnalyticsService` under `src/analytics/`
- [x] 2.5 Register `AnalyticsModule` in `AppModule`

## 3. In-Memory Store & Seed Data

- [x] 3.1 Add a private array `private entries: AnalyticsEntry[] = []` to `AnalyticsService`
- [x] 3.2 Implement `onModuleInit()` in `AnalyticsService` to seed at least 10 realistic entries with varied `gameId`, `eventType`, `playerId`, `score`, `duration`, and `timestamp` values

## 4. Service Logic

- [x] 4.1 Implement `findAll(filters: FilterAnalyticsDto): { data: AnalyticsEntry[], total: number }` — filter by `gameId`, `eventType`, `startDate`, `endDate` when provided
- [x] 4.2 Implement `create(dto: CreateAnalyticsDto): AnalyticsEntry` — generate UUID via `crypto.randomUUID()`, set `timestamp` to current ISO string, push to array, return created entry
- [x] 4.3 Implement `getSummary()` — compute `totalEntries`, `totalGames` (distinct gameIds), `avgScore` (mean of entries with score), `avgDuration` (mean of entries with duration), `eventTypeBreakdown` (count per eventType)

## 5. Controller Endpoints

- [x] 5.1 Implement `GET /analytics` — accept `@Query() filters: FilterAnalyticsDto`, call `service.findAll(filters)`, return result
- [x] 5.2 Implement `GET /analytics/summary` — call `service.getSummary()`, return result (ensure this route is declared BEFORE any `/:id` route)
- [x] 5.3 Implement `POST /analytics` — accept `@Body() dto: CreateAnalyticsDto`, call `service.create(dto)`, return 201 with created entry

## 6. Validation & Error Handling

- [x] 6.1 Verify `ValidationPipe` returns 400 with descriptive messages when required fields are missing from `POST /analytics`
- [x] 6.2 Verify `ValidationPipe` returns 400 when `score` or `duration` are non-numeric
- [x] 6.3 Handle invalid `startDate`/`endDate` values gracefully (skip filter or return 400 with message)

## 7. Testing

- [x] 7.1 Write unit tests for `AnalyticsService.findAll()` — test no-filter, single filter, combined filters, empty results
- [x] 7.2 Write unit tests for `AnalyticsService.getSummary()` — test with data, test with empty store, test avgScore excludes scoreless entries
- [x] 7.3 Write unit tests for `AnalyticsService.create()` — verify `id` and `timestamp` are auto-generated
- [x] 7.4 Run `npm run test` and confirm all tests pass

## 8. Verification

- [x] 8.1 Start server with `npm run start:dev` and confirm it runs on port 3001
- [x] 8.2 Manually test `GET /analytics` returns seeded data
- [x] 8.3 Manually test `POST /analytics` with valid body returns 201 with generated `id` and `timestamp`
- [x] 8.4 Manually test `GET /analytics/summary` returns correct aggregate values
- [x] 8.5 Manually test `GET /analytics?gameId=X` returns filtered results
- [x] 8.6 Confirm CORS header `Access-Control-Allow-Origin: http://localhost:3000` present in responses
