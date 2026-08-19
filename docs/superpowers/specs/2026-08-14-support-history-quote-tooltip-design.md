# Support History Quote Tooltip Design

## Goal

Show the Figma-defined `Quote ready` informational tooltip when a user hovers or keyboard-focuses the quote indicator in the Support request history table.

## Visual source

- Figma file: `CSC CR4.0 Prototype`
- Frame: `6036:233278`
- Reference label: `Quote ready`
- Reference dimensions: 110 px wide by 54 px high

The reference is an anchored tooltip near its trigger. It is not the application's existing bottom-right notification toast.

## Scope

- Apply the behavior only to table rows whose ticket indicator is the quote icon.
- Preserve the existing quote icon asset, table dimensions, row height, filtering, sorting, and ticket navigation.
- Leave the support/maintenance indicator and rows without an indicator unchanged.

## Structure

Render the quote indicator as a focusable tooltip trigger containing:

- the existing 24 px quote image;
- a visually adjacent element with `role="tooltip"` and the text `Quote ready`;
- a unique tooltip ID referenced by the trigger's `aria-describedby`.

The trigger is informational rather than actionable, so it will not introduce click navigation or a fake button action.

## Appearance

- 110 px by 54 px white tooltip surface.
- Centered `Quote ready` copy using the repository's existing 14 px application typography.
- Subtle neutral border, small Komodo-style radius, and soft elevation matching the Figma treatment.
- Positioned above and horizontally centered on the quote icon without changing table layout or row height.
- Tooltip stays within the visible table area at the canonical 1440 px frame.

## Interaction

- Show immediately on pointer hover.
- Show on keyboard focus.
- Hide on pointer leave or focus loss.
- Hide when Escape is pressed while the trigger is focused.
- Keep the tooltip hidden from layout and assistive technology when inactive.
- Do not use an auto-dismiss timer because the state is tied to hover/focus.

## Accessibility

- The quote icon remains decorative; the focusable wrapper carries the accessible relationship.
- `aria-describedby` exposes `Quote ready` while the tooltip is visible.
- A visible focus outline uses the existing Services Central focus color.
- The tooltip does not capture pointer events or keyboard focus.

## Testing and verification

- Add a regression that fails before implementation and verifies the quote tooltip structure and text.
- Verify hover, focus, pointer-leave, blur, and Escape behavior in the in-app browser.
- Confirm non-quote rows do not receive the tooltip.
- Capture the Figma reference and implementation in the same comparison pass.
- Run the focused Support History regressions and `git diff --check`.

## Out of scope

- Changing the global `.toast` notification component.
- Adding tooltips to other ticket indicators.
- Changing table data, row actions, or routes.
