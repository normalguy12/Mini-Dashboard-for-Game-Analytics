## ADDED Requirements

### Requirement: Responsive page shell
The system SHALL render a full-page layout with a top navigation header containing the app title and a main content area. The layout SHALL adapt between mobile (≥375px) and desktop (≥1280px) breakpoints without horizontal scroll or overflow.

#### Scenario: Desktop layout
- **WHEN** the user views the dashboard on a screen ≥1280px wide
- **THEN** the header spans full width and main content is centred with a max-width container

#### Scenario: Mobile layout
- **WHEN** the user views the dashboard on a screen ≤375px wide
- **THEN** all content stacks vertically, no element overflows the viewport, and text remains readable
