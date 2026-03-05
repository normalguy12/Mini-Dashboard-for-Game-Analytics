## ADDED Requirements

### Requirement: Display summary statistics
The system SHALL fetch `GET /analytics/summary` and display the result as a row of stat cards showing `totalEntries`, `totalGames`, `avgScore` (rounded to 1 decimal), and `avgDuration` (rounded to 1 decimal, labelled in seconds).

#### Scenario: Stats load successfully
- **WHEN** the page mounts and the backend is reachable
- **THEN** four stat cards appear with correct labels and numeric values from the API

#### Scenario: Stats loading state
- **WHEN** the summary fetch is in progress
- **THEN** skeleton placeholder cards are shown in place of stat values

#### Scenario: Stats error state
- **WHEN** the summary fetch fails (network error or non-2xx response)
- **THEN** the stats area shows an error message and does not display stale data

### Requirement: Display event-type breakdown
The system SHALL display the `eventTypeBreakdown` object from the summary response as a secondary row or section below the main stat cards.

#### Scenario: Breakdown rendered
- **WHEN** `eventTypeBreakdown` contains entries (e.g., `{ match_start: 5, match_end: 4 }`)
- **THEN** each event type and its count is displayed

#### Scenario: Empty breakdown
- **WHEN** `eventTypeBreakdown` is an empty object
- **THEN** the breakdown section is hidden or shows "No event types recorded"

### Requirement: Stats auto-refresh after new entry
The system SHALL re-fetch `GET /analytics/summary` after a new analytics entry is successfully created via the Add Entry form.

#### Scenario: Stats update after POST
- **WHEN** the user submits a valid new entry and the POST succeeds
- **THEN** `totalEntries` increments by 1 and `avgScore`/`avgDuration` update to reflect the new data
