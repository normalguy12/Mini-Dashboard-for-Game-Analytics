## ADDED Requirements

### Requirement: Single typed API gateway
The system SHALL have a `lib/api.ts` module that is the only place in the frontend that calls `fetch`. It SHALL export `getAnalytics(filters?)`, `postAnalytics(dto)`, and `getSummary()` as typed async functions.

#### Scenario: Successful GET /analytics call
- **WHEN** `getAnalytics()` is called with no filters
- **THEN** it returns `Promise<{ data: AnalyticsEntry[], total: number }>` with values from the backend

#### Scenario: Successful GET /analytics with filters
- **WHEN** `getAnalytics({ gameId: 'game-001' })` is called
- **THEN** the HTTP request includes `?gameId=game-001` and the response is typed correctly

#### Scenario: Successful POST /analytics call
- **WHEN** `postAnalytics(dto)` is called with a valid DTO
- **THEN** it sends a POST with `Content-Type: application/json` and returns the created `AnalyticsEntry`

#### Scenario: Non-2xx response normalisation
- **WHEN** the backend returns a 400 with `{ message: ['gameId should not be empty'] }`
- **THEN** `getAnalytics` or `postAnalytics` throws an `Error` with message `"gameId should not be empty"`

#### Scenario: Non-2xx with array message
- **WHEN** the backend returns a 400 with `{ message: ['field1 error', 'field2 error'] }`
- **THEN** the thrown error message is `"field1 error, field2 error"`

#### Scenario: Environment base URL
- **WHEN** `NEXT_PUBLIC_API_BASE_URL` is set in `.env.local`
- **THEN** all API calls use that value as the base URL

### Requirement: Shared TypeScript types mirror backend exactly
The system SHALL define `AnalyticsEntry`, `SummaryStats`, `CreateAnalyticsDto`, and `FilterParams` in `lib/types.ts`. These types SHALL match the backend's data shapes exactly so no runtime casting is needed.

#### Scenario: Type safety on API responses
- **WHEN** `getAnalytics()` resolves
- **THEN** TypeScript knows `data` is `AnalyticsEntry[]` and `total` is `number` without casting
