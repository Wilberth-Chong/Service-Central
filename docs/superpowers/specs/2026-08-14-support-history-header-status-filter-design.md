# Support History header Status filter design

## Goal

Move the reusable Status multiselect trigger and menu from the standalone filter row into the Support History table's Status header while keeping the applied-filter badge in its current position between the search controls and table.

## Approved architecture

Extend `MultiSelectFilter` with an optional `controlHost` configuration. The component continues to use its original host for the applied-filter badge and public events, while rendering the trigger and listbox into `controlHost` when supplied. When `controlHost` is omitted, the existing single-host behavior remains unchanged for other consumers and the isolated Region fixture.

Support History will provide two mounts:

- `[data-sh-status-filter-trigger]` inside the Status table header for the dropdown control and listbox.
- `[data-sh-status-filter]` in the existing filter row for the applied badge and Clear filters action.

The component's outside-click boundary must include both mounts so pointer interaction with the header listbox does not close it prematurely. Keyboard behavior, ARIA relationships, selected state, and the bubbling `multiselect-filter-change` event remain unchanged.

## Layout and visual treatment

- Replace the plain Status heading with the multiselect control.
- Style the Status trigger as a compact table-header dropdown aligned with the repository's existing header dropdown controls.
- Allow the header cell and trigger mount to show the anchored listbox without clipping it.
- Keep the applied badge at its existing vertical position between the search/date controls and the table.
- Change the applied badge height to `30px` and its radius to `15px` for a fully rounded pill.
- Retain the existing pale-blue information surface, 14px typography, and repository 16px mono close icon.
- Set Clear filters to `#0071d0`, exactly matching the Ticket no. link color.
- Preserve the 1320px table width, existing column proportions, 45px header height, 41px body-row height, and page overflow behavior.

## Behavior

- Options remain in this exact order: All, Open, In progress, Closed.
- Initial All state, persistent checked selections, live OR filtering, search/date AND composition, badge removal, Clear filters, keyboard navigation, focus restoration, and outside-click dismissal remain unchanged.
- Badge removal and Clear filters continue to reset only Status.
- The component remains reusable and must still support its default single-host construction.

## Regression coverage

Update the isolated component regression to verify the optional split-host rendering and outside-click boundary. Update the Support History regression to verify:

- the trigger is inside the Status table header;
- the applied badge remains in the standalone filter row;
- the badge is 30px high with a 15px radius;
- Clear filters resolves to `rgb(0, 113, 208)`;
- menu selection, filtering, keyboard behavior, table dimensions, and page width remain unchanged.

Run the existing Support History date-range, search, fidelity, quote-tooltip, and visit-tooltip regressions after the change.

## Scope boundaries

- No changes to ticket data, routing, other table columns, search behavior, date-range behavior, pagination, sidebar, header, footer, or tooltip features.
- No new dependencies or design-system implementation.
- Preserve unrelated dirty-worktree changes and commit only this design specification during the design phase.
