## ADDED Requirements

### Requirement: Display analytics entries in a table
The system SHALL fetch `GET /analytics` and render results in a scrollable table with columns: Game ID, Event Type, Player ID, Score, Duration (s), and Timestamp. Rows with no `score` or `duration` SHALL display "—" in those cells. Timestamps SHALL be formatted as human-readable local date/time strings.

#### Scenario: Table loads with data
- **WHEN** the page mounts and the backend returns entries
- **THEN** a table is rendered with one row per entry and correct values in each column

#### Scenario: Table loading state
- **WHEN** the data fetch is in progress
- **THEN** skeleton rows are shown in the table body

#### Scenario: Table error state
- **WHEN** the data fetch fails
- **THEN** the table body shows a single row with an error message spanning all columns

#### Scenario: Empty results
- **WHEN** the fetch returns `{ data: [], total: 0 }`
- **THEN** the table body shows a single row with "No entries found"

#### Scenario: Table refreshes after new entry
- **WHEN** a new entry is successfully created via the Add Entry form
- **THEN** the table re-fetches and the new entry appears without a full page reload

### Requirement: Display total entry count
The system SHALL display the `total` count returned by `GET /analytics` above or below the table (e.g., "Showing 12 entries").

#### Scenario: Count displayed
- **WHEN** the fetch succeeds
- **THEN** the count label reflects the number of entries currently shown (accounting for active filters)
