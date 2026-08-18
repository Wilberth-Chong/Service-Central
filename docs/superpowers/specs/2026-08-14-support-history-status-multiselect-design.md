# Support History status multiselect design

## Goal

Replace the single-select Status control in the Support History table header with a reusable, accessible Komodo-style multiselect filter placed between the search/date controls and the table. The component must filter tickets by one or more statuses and expose applied selections as a removable badge matching the supplied screenshot.

## Visual sources

- Badge reference: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/Screenshot 2026-08-14 at 1.20.38 PM.png` (666 × 89 px).
- Komodo Dropdown documentation: `https://designsystem.thermofisher.com/09523d9e2/p/20c7e1-dropdown`.
- Komodo regular dropdown specifications: 40 px control height, 1 px inside stroke, 16 px horizontal content spacing, 14 px regular content with 22 px line-height, 8 px caret, 40 px menu-item height.
- Existing repository tokens and assets: Helvetica Neue stack, `--komodo-color-text`, `--komodo-color-action-link`, `--komodo-color-surface-information`, subtle border token, the existing 8 px down-caret asset, and the existing 16 px mono close asset.

## Selected approach

Build a standalone reusable `MultiSelectFilter` component in its own JavaScript and stylesheet files. The repository is a static prototype and does not bundle the published Komodo web-component package, so the component will compose semantic native controls and existing Komodo tokens without adding a dependency or impersonating a core Komodo tag.

The component owns dropdown state, checkbox selection, badge rendering, keyboard behavior, and its public change event. Support History owns ticket filtering and count updates.

## Reusable component contract

### Construction

The component is initialized on a host element:

```js
const statusFilter = new window.MultiSelectFilter(host, {
  label: "Status",
  allLabel: "All",
  options: ["Open", "In progress", "Closed"],
});
```

### Public interface

- `values`: returns an array of selected specific values. An empty array means All/no status restriction.
- `clear()`: resets the component to All and updates its visual state.
- `setValues(values)`: applies valid selections and re-renders the component.
- `multiselect-filter-change`: bubbles from the host whenever the committed selection changes, with `event.detail.values` containing the selected specific values.

### Reuse boundary

The component must not reference Support History selectors, ticket data, routes, or count elements. Labels, options, and selections are configuration. Support History listens to the component event and composes the result with the existing search and created-date filters.

## Layout and visual treatment

- Add a filter row immediately after `.sh-top` and before `.sh-table-wrap`.
- The closed dropdown button is 40 px high and follows the Komodo regular dropdown measurements. It displays `Status` and the repository 8 px caret.
- The menu is anchored below the button, has a 1 px neutral border, white background, existing elevation treatment, and four 40 px rows: All, Open, In progress, Closed.
- Each menu row uses a semantic checkbox. The checked state remains visible while the menu is open.
- The table header becomes a plain `Status` heading; the existing table-header `<select>` and its page-specific CSS are removed.
- The table retains its existing 45 px header and 41 px body rows.
- The applied-filter strip appears below the dropdown control and above the table.
- When specific statuses are selected, show one badge with the exact format `Status: Open, In progress`. The label prefix is medium/bold and the values follow in the same line.
- The badge uses the reference's rounded pill shape, Komodo information-surface background, text color, 16 px horizontal spacing, and the repository 16 px mono close icon in an accessible icon button.
- A blue `Clear filters` button appears immediately to the right of the badge, matching the reference spacing and link treatment.
- When All is active, no applied-status badge or Clear filters action is shown.
- The new row must not change the 1320 px content width or introduce horizontal page scrolling.

## Selection behavior

- Initial state: All is checked; Open, In progress, and Closed are unchecked; all tickets are eligible.
- Selecting a specific status unchecks All.
- Multiple specific statuses may be checked simultaneously.
- Selecting All clears all specific selections and closes the badge state.
- Clearing the final specific status returns the component to All.
- If all three specific statuses become checked, keep all three visibly selected and show `Status: Open, In progress, Closed`; do not silently collapse the state to All.
- Clicking the badge close button or `Clear filters` resets only the Status component to All. Existing search text and created-date selection remain unchanged.
- Ticket filtering is live after every checkbox change and uses OR semantics within Status: a row matches when its status is any selected value.
- Status filtering composes with the existing search and created-date filters using AND semantics between filter groups.
- The visible ticket count updates after every selection change.

## Open, selected, and keyboard states

- The trigger exposes `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`.
- The menu uses an accessible multiselect pattern and exposes selected state for each option.
- Trigger click toggles the menu.
- ArrowDown from the trigger opens the menu and focuses the first option.
- ArrowUp/ArrowDown move between options; Space or Enter toggles the focused option.
- Escape closes the menu and returns focus to the trigger.
- Tab leaves the component and closes the menu without trapping focus.
- Clicking outside closes the menu while preserving selections.
- The trigger, option rows, badge remove button, and Clear filters button use the repository Komodo focus ring.

## Files and integration

- Create `multi-select-filter.js` for the reusable component.
- Create `multi-select-filter.css` for component-only styling.
- Load both resources from `index.html` before `app.js`.
- Replace the Support History header select with a plain heading and add a component host between `.sh-top` and `.sh-table-wrap`.
- Update `wireSupportHistory()` in `app.js` to initialize the component, read its `values`, handle `multiselect-filter-change`, and keep search/date composition unchanged.
- Remove obsolete `.sh-header-select` styles and adjust only Support History vertical spacing needed for the new filter row.
- Do not refactor unrelated dropdowns or table filters.

## Regression coverage

Add a dedicated browser regression that verifies:

- the reusable script and stylesheet are loaded;
- the component renders between `.sh-top` and `.sh-table-wrap`;
- the menu contains All, Open, In progress, and Closed;
- All is the initial selected state;
- selected states remain visible when the menu is open;
- one or multiple status selections filter the rows live with OR semantics;
- search, created-date, and Status compose correctly;
- the badge text and close asset match the approved design;
- badge removal and Clear filters restore All without clearing search/date;
- outside click, Escape, focus return, arrow navigation, Enter/Space toggling, and Tab dismissal work;
- the table header is plain text and row/header heights remain unchanged;
- the component has no Support History dependency and can be instantiated in a small second fixture with alternate labels/options.

Retain and rerun the existing Support History search, date-range, fidelity, quote-tooltip, and visit-tooltip regressions.

## Image-to-code verification

- Capture the reference badge and the rendered applied-status badge at matching scale and compare them in the same visual input.
- Verify the open dropdown against the Komodo dropdown source at the same interaction state.
- Measure control height, menu-row height, caret size, badge height/radius/padding, link spacing, and page width.
- Fix all actionable P0/P1/P2 differences, rerun interaction regressions, and append a `final result: passed` section to `design-qa.md` before handoff.

## Scope boundaries

- No new package or design-system dependency.
- No changes to ticket data, date-range semantics, search fields, routing, sidebar, header, footer, pagination, or tooltip features.
- No staging or commit of the existing dirty production worktree unless separately authorized. The design document itself may be committed as the brainstorming record.

