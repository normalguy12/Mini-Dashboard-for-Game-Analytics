## ADDED Requirements

### Requirement: Summary stats error is isolated from table
The system SHALL render the analytics table independently of the summary stats fetch. A failure in `GET /analytics/summary` SHALL NOT crash or blank out the table.

#### Scenario: Summary fails, table succeeds
- **WHEN** `GET /analytics/summary` returns an error but `GET /analytics` succeeds
- **THEN** the summary area shows an error banner and the table renders normally with data

#### Scenario: Table fails, summary succeeds
- **WHEN** `GET /analytics` returns an error but `GET /analytics/summary` succeeds
- **THEN** the table shows an error state and the summary cards are populated correctly

### Requirement: Error states display actionable messages
The system SHALL display a human-readable error message with a retry button whenever a fetch fails. The retry button SHALL re-trigger the failed request.

#### Scenario: Table error with retry
- **WHEN** the table fetch fails and the user clicks the retry button
- **THEN** `refresh()` from `useAnalytics` is called and the table attempts to fetch again

#### Scenario: Backend offline — both components show errors
- **WHEN** the backend is not running and the page loads
- **THEN** both the summary area and the table show error banners; the page does not crash or show a blank screen

### Requirement: POST /analytics error displayed in form
The system SHALL display the backend error message (or a generic fallback) inside the Add Entry form when `POST /analytics` fails.

#### Scenario: Backend validation error shown in form
- **WHEN** `POST /analytics` returns 400 with a validation message
- **THEN** the form remains open, shows the backend error message, and the Submit button is re-enabled

#### Scenario: Network error during POST
- **WHEN** a network error occurs during form submission
- **THEN** the form shows "Failed to connect to server. Please try again." and stays open

### Requirement: Graceful handling of CORS errors
When a CORS error occurs, the system SHALL surface an error state in any component whose fetch is blocked, without throwing an unhandled exception.

#### Scenario: CORS blocked fetch
- **WHEN** the browser blocks a `fetch` call due to missing CORS headers
- **THEN** the hook catches the error, sets `error` state, and the corresponding component shows an error banner
