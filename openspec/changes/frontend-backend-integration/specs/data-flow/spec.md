## ADDED Requirements

### Requirement: Page load populates table and summary stats
The system SHALL fetch both `GET /analytics` and `GET /analytics/summary` on initial page load. The table SHALL populate with all seeded entries and the summary cards SHALL show correct aggregate values.

#### Scenario: Initial page load — both fetches succeed
- **WHEN** the user navigates to the dashboard and the backend is running
- **THEN** the table renders all entries and summary stat cards show non-zero values

#### Scenario: Initial page load — fetches run in parallel
- **WHEN** the page mounts
- **THEN** `getAnalytics` and `getSummary` are initiated concurrently, not sequentially

### Requirement: Filter change updates table without affecting summary
The system SHALL re-fetch `GET /analytics` with updated query params when the user changes a filter. The summary stats SHALL NOT re-fetch on filter changes.

#### Scenario: Filter by gameId updates table only
- **WHEN** the user types a value in the gameId filter
- **THEN** the table re-fetches with `?gameId=<value>` and summary stats remain unchanged

#### Scenario: Multiple filters applied together
- **WHEN** both `gameId` and `eventType` filters are set
- **THEN** a single request is made with both params (e.g., `?gameId=game-001&eventType=match_end`)

#### Scenario: Filter cleared restores full list
- **WHEN** the user clears all filter inputs
- **THEN** `GET /analytics` is called with no params and all entries are shown

### Requirement: POST success triggers coordinated refresh
The system SHALL refresh both the analytics table and summary stats after a successful `POST /analytics`.

#### Scenario: New entry appears in table immediately after POST
- **WHEN** the user submits a valid new entry and the API returns 201
- **THEN** the Add Entry form closes, the table re-fetches and the new row appears, and summary `totalEntries` increments

#### Scenario: Both refreshes fire concurrently after POST
- **WHEN** `handleSuccess()` is called after a successful POST
- **THEN** `refreshTable()` and `refreshSummary()` are both triggered without waiting for one to finish before starting the other
