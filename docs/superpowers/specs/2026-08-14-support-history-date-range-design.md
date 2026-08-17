# Support History Date Range Design

## Objective

Replace the support-history date control's placeholder toast with a working Komodo-style date-range picker. The selected range filters tickets by their **Created date** while preserving the existing Figma-aligned filter layout and table.

## Interaction

- Clicking anywhere on the `Date range` field, including its calendar icon, opens a popover anchored below the field.
- The popover presents two adjacent calendar months with previous and next month navigation.
- With no applied range, the left calendar opens to the current local month and the right calendar shows the following month.
- The first day chosen becomes the start date. The second becomes the end date. Selecting a day before the current start begins a new range from that day.
- A one-day range is valid when the same day is selected twice.
- The pending range is highlighted inclusively across both calendars.
- `Apply` remains disabled until both dates are selected. Applying closes the popover, updates the field to `DD MMM YYYY – DD MMM YYYY`, filters the table, and updates the visible result count.
- `Clear` removes the applied range, restores the placeholder `Select a date range`, restores rows allowed by the other active filters, and closes the popover.
- `Cancel`, clicking outside the popover, or pressing `Escape` closes the picker without changing the currently applied range.
- Reopening the picker restores the currently applied range as the pending selection.

## Filtering

- Range boundaries are inclusive.
- Only each ticket's `created` value participates in date filtering.
- Date filtering composes with the existing live text search and status filter; a row must satisfy every active filter.
- Unparseable or empty created dates do not match while a date range is active.
- Sorting or rerendering the table reapplies all active filters.

## Components and Styling

- Reuse the existing date field, calendar icon asset, typography, colors, borders, focus treatment, and button conventions already present in the repository.
- Add a reusable `DateRangePicker` component in its own JavaScript and CSS files. The component owns the trigger, dual-month popover, pending/applied state, accessibility, dismissal behavior, and `Clear`, `Cancel`, and `Apply` actions.
- The support-history page consumes the component's `date-range-change` event and applies its `{ start, end }` ISO date values to the Created-date table filter.
- Keep the existing 243 × 40 trigger dimensions and surrounding support-history layout unchanged.
- The popover remains within the viewport at narrower widths and does not affect document flow.

## Accessibility

- The trigger exposes `aria-haspopup="dialog"` and reflects its open state with `aria-expanded`.
- The popover has an accessible dialog name.
- Day controls expose full date names and selected/range state.
- All controls are keyboard reachable with visible focus styles.
- `Escape` closes the popover and returns focus to the trigger.

## Verification

- Add regression coverage for opening and closing, start/end selection, inclusive Created-date filtering, result-count updates, clearing, canceling, and combination with text/status filters.
- Verify the interaction in the running app, including mouse and keyboard behavior.
- Compare closed and open picker screenshots against the Figma-aligned support-history screen and correct visible spacing, sizing, and alignment differences.
- Run the focused support-history checks and the repository test suite, reporting any unrelated existing failures separately.
