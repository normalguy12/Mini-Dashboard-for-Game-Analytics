## Context

The Game Analytics Mini Dashboard backend is a greenfield NestJS application. There is no existing codebase to migrate from. The stack is TypeScript + NestJS, and the only persistence mechanism for this MVP is an in-memory array inside the `AnalyticsService`. The frontend (Next.js on port 3000) will be the sole consumer.

## Goals / Non-Goals

**Goals:**
- Expose three REST endpoints: `GET /analytics`, `POST /analytics`, `GET /analytics/summary`
- Validate incoming request bodies with `class-validator`
- Aggregate in-memory data for the summary endpoint
- Seed realistic sample data on startup so the frontend is non-empty by default
- Enable CORS for `http://localhost:3000`

**Non-Goals:**
- Persistent storage (database, file system) — not required for this MVP
- Authentication or authorization
- Pagination (the data set is small enough to return all entries)
- WebSockets or real-time push

## Decisions

### 1. Framework: NestJS (not plain Express)
NestJS provides decorators, DI, `ValidationPipe`, and module structure out of the box. For a multi-endpoint API with DTOs and service separation, NestJS is faster to write correctly than raw Express.

### 2. In-memory store as a service-level array
A plain array inside `AnalyticsService` is sufficient. It is injected via NestJS DI, making it easy to unit-test with a mock. No repository pattern or ORM needed — YAGNI for this scope.

**Alternative considered**: JSON file on disk — rejected because it adds async I/O complexity without meaningful benefit for an MVP that's evaluated in a single session.

### 3. ID generation: `crypto.randomUUID()`
Built into Node 14.17+. No external `uuid` package needed. Reduces dependency count.

### 4. Filtering via query params on `GET /analytics`
Filters `gameId`, `eventType`, `startDate`, `endDate` are passed as query params and applied server-side. Frontend passes them as `?gameId=X` — keeps filtering logic in one place and avoids over-fetching.

### 5. `GET /analytics/summary` as a separate endpoint (not a query param)
Aggregation logic is distinct from listing logic. A dedicated endpoint is cleaner and cacheable independently. The `/summary` path is registered before parameterized routes to avoid NestJS route shadowing.

### 6. Validation: `class-validator` + `ValidationPipe` (global)
Applied globally in `main.ts` with `whitelist: true` and `forbidNonWhitelisted: false`. This strips unknown properties without erroring, returns structured 400 messages on missing/invalid fields.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Data lost on server restart | Acceptable for MVP; documented in README |
| No auth — anyone can POST | Acceptable for local dev environment only |
| In-memory store not thread-safe at scale | Single Node.js process, no concurrency issues in practice |
| `startDate`/`endDate` filter requires valid ISO strings | Return 400 with helpful message if parsing fails |

## Migration Plan

1. `npm run start:dev` — starts NestJS on port 3001 with seed data loaded
2. No database migrations required
3. Rollback: simply stop the process — no persistent state to clean up

## Open Questions

- None — requirements are fully defined for this MVP scope.
