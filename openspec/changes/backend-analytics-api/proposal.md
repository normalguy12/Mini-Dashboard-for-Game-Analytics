## Why

The Game Analytics Mini Dashboard needs a backend API to store, retrieve, and aggregate player/game event data. Without a structured API, the frontend has no source of truth for analytics entries and cannot display meaningful stats.

## What Changes

- Introduce a NestJS REST API at `backend/` with three endpoints
- Implement in-memory data store (array-based, no database required)
- Add seed data so the frontend has entries to display on first load
- Add request validation (required fields, correct types)
- Enable CORS for the Next.js frontend at `http://localhost:3000`

## Capabilities

### New Capabilities

- `analytics-crud`: Create and retrieve analytics entries via `POST /analytics` and `GET /analytics` with optional query-param filtering (`gameId`, `eventType`, `startDate`, `endDate`)
- `analytics-summary`: Aggregate stored entries and return statistics via `GET /analytics/summary` (total entries, total games, average score, average duration, event-type breakdown)

### Modified Capabilities

<!-- none — this is a greenfield API -->

## Impact

- **Backend**: New NestJS module `AnalyticsModule` with controller, service, and DTOs under `backend/src/analytics/`
- **Frontend**: Depends on this API for all data; must align with response shapes defined here
- **Dependencies**: `class-validator`, `class-transformer` added to backend for DTO validation; `uuid` for ID generation
- **CORS**: `main.ts` configured to allow origin `http://localhost:3000`
- **No database**: All data is lost on server restart — acceptable for this MVP
