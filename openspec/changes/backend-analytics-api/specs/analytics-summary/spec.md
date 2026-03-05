## ADDED Requirements

### Requirement: Return aggregated analytics statistics
The system SHALL return aggregated statistics for all stored entries via `GET /analytics/summary` with a 200 response containing `{ totalEntries, totalGames, avgScore, avgDuration, eventTypeBreakdown }`.

#### Scenario: Summary with data present
- **WHEN** a client sends `GET /analytics/summary` and the store contains entries
- **THEN** the system returns 200 with:
  - `totalEntries`: total number of stored entries
  - `totalGames`: number of distinct `gameId` values
  - `avgScore`: mean of all entries that have a `score` value (0 if none)
  - `avgDuration`: mean of all entries that have a `duration` value (0 if none)
  - `eventTypeBreakdown`: an object mapping each `eventType` to its entry count

#### Scenario: Summary with empty store
- **WHEN** a client sends `GET /analytics/summary` and the store is empty
- **THEN** the system returns 200 with `{ totalEntries: 0, totalGames: 0, avgScore: 0, avgDuration: 0, eventTypeBreakdown: {} }`

#### Scenario: avgScore excludes entries without score
- **WHEN** the store contains 3 entries: two with `score` values of 100 and 200, one with no `score`
- **THEN** `avgScore` is 150 (average of the two scored entries only)

#### Scenario: eventTypeBreakdown correctness
- **WHEN** the store contains 4 entries: 2 with `eventType: "match_start"` and 2 with `eventType: "match_end"`
- **THEN** `eventTypeBreakdown` equals `{ "match_start": 2, "match_end": 2 }`

---

### Requirement: Summary endpoint does not conflict with parameterized routes
The system SHALL register `GET /analytics/summary` before any route that uses a URL parameter (e.g., `GET /analytics/:id`) to prevent NestJS from treating `summary` as a parameter value.

#### Scenario: Route resolution order
- **WHEN** a client sends `GET /analytics/summary`
- **THEN** the system resolves to the summary handler, not a by-ID handler, and returns the stats object
