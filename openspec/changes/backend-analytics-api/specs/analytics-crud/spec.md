## ADDED Requirements

### Requirement: Fetch all analytics entries
The system SHALL return all stored analytics entries via `GET /analytics` with a 200 response containing `{ data: AnalyticsEntry[], total: number }`.

#### Scenario: Fetch entries with no filters
- **WHEN** a client sends `GET /analytics` with no query parameters
- **THEN** the system returns 200 with all stored entries and the correct `total` count

#### Scenario: Filter by gameId
- **WHEN** a client sends `GET /analytics?gameId=game-001`
- **THEN** the system returns 200 with only entries where `gameId === "game-001"`

#### Scenario: Filter by eventType
- **WHEN** a client sends `GET /analytics?eventType=match_end`
- **THEN** the system returns 200 with only entries where `eventType === "match_end"`

#### Scenario: Filter by date range
- **WHEN** a client sends `GET /analytics?startDate=2026-01-01T00:00:00Z&endDate=2026-12-31T23:59:59Z`
- **THEN** the system returns 200 with only entries whose `timestamp` falls within the range

#### Scenario: No matching results
- **WHEN** a client sends `GET /analytics?gameId=nonexistent-game`
- **THEN** the system returns 200 with `{ data: [], total: 0 }`

---

### Requirement: Create a new analytics entry
The system SHALL create a new analytics entry via `POST /analytics` and return the created entry with a 201 status. The entry SHALL have an auto-generated `id` (UUID) and `timestamp` (ISO 8601).

#### Scenario: Valid creation request
- **WHEN** a client sends `POST /analytics` with `{ gameId, eventType, playerId }` and optional `score`, `duration`, `metadata`
- **THEN** the system returns 201 with the full entry including generated `id` and `timestamp`

#### Scenario: Missing required field
- **WHEN** a client sends `POST /analytics` with `gameId` or `eventType` or `playerId` missing
- **THEN** the system returns 400 with a validation error message identifying the missing field(s)

#### Scenario: Invalid field type
- **WHEN** a client sends `POST /analytics` with `score` as a non-numeric string (e.g., `"abc"`)
- **THEN** the system returns 400 with a validation error message

#### Scenario: Optional fields omitted
- **WHEN** a client sends `POST /analytics` with only the three required fields
- **THEN** the system returns 201; `score`, `duration`, and `metadata` are undefined/absent in the response

---

### Requirement: Seed data on startup
The system SHALL populate the in-memory store with at least 10 analytics entries when the application starts, so the dashboard is non-empty on first load.

#### Scenario: Application startup
- **WHEN** the NestJS application initializes
- **THEN** the in-memory store contains at least 10 pre-seeded entries with varied `gameId`, `eventType`, `playerId`, `score`, and `duration` values
