## ADDED Requirements

### Requirement: Filter analytics entries by gameId
The system SHALL provide a text input for `gameId`. When the user types and submits/debounces the value, the system SHALL call `GET /analytics?gameId=<value>` and update the table with filtered results.

#### Scenario: Filter by gameId applied
- **WHEN** the user types "game-001" in the gameId filter and submits (or after debounce)
- **THEN** the API is called with `?gameId=game-001` and only matching entries appear in the table

#### Scenario: Filter cleared
- **WHEN** the user clears the gameId input or clicks a Reset button
- **THEN** the API is called without the `gameId` param and all entries are shown again

### Requirement: Filter analytics entries by eventType
The system SHALL provide a select dropdown or text input for `eventType`. When changed, the system SHALL call `GET /analytics?eventType=<value>` and update the table.

#### Scenario: Filter by eventType applied
- **WHEN** the user selects "match_end" from the eventType filter
- **THEN** the API is called with `?eventType=match_end` and only matching entries appear

#### Scenario: Filters combined
- **WHEN** the user applies both a `gameId` and an `eventType` filter simultaneously
- **THEN** the API is called with both params (e.g., `?gameId=game-001&eventType=match_end`) and only entries matching both are shown

### Requirement: Reset all filters
The system SHALL provide a single "Clear Filters" or "Reset" action that clears all active filter inputs and re-fetches all entries.

#### Scenario: Reset restores full list
- **WHEN** one or more filters are active and the user clicks Reset
- **THEN** all filter inputs are cleared and the full unfiltered entry list is displayed
