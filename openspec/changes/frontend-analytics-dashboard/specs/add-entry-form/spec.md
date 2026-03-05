## ADDED Requirements

### Requirement: Open and close the Add Entry form
The system SHALL provide a button (e.g., "Add Entry") that opens an inline panel or modal containing the creation form. The form SHALL be dismissible without submitting.

#### Scenario: Form opens
- **WHEN** the user clicks the "Add Entry" button
- **THEN** the form/modal becomes visible with all fields empty and the submit button enabled

#### Scenario: Form closes without submitting
- **WHEN** the user clicks Cancel or closes the modal without submitting
- **THEN** the form closes and no API call is made

### Requirement: Submit a new analytics entry
The system SHALL collect `gameId` (required), `eventType` (required), `playerId` (required), `score` (optional, numeric), and `duration` (optional, numeric) from the form and submit them via `POST /analytics`.

#### Scenario: Successful submission
- **WHEN** the user fills in all required fields with valid values and clicks Submit
- **THEN** the system calls `POST /analytics`, the form closes, a success notification is shown, and the analytics table and summary stats are refreshed

#### Scenario: Missing required field — client-side
- **WHEN** the user clicks Submit with one or more required fields empty
- **THEN** the form does NOT call the API and shows an inline validation error next to each empty required field

#### Scenario: Invalid numeric field — client-side
- **WHEN** the user enters a non-numeric value in the `score` or `duration` field
- **THEN** the form does NOT call the API and shows a validation error on that field

#### Scenario: API error on submission
- **WHEN** the `POST /analytics` call returns a non-2xx response or network error
- **THEN** the form remains open, a descriptive error message is shown, and the user can retry without re-entering data

### Requirement: Form shows loading state during submission
The system SHALL disable the Submit button and show a loading indicator while the POST request is in flight.

#### Scenario: Submission in progress
- **WHEN** the user clicks Submit and the request is pending
- **THEN** the Submit button is disabled and shows a spinner or "Submitting…" label
