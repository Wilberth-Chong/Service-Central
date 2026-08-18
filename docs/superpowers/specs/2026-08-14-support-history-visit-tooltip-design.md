# Support History Visit Tooltip Design

## Goal

Replace the service/support indicator in the Support request history table with the supplied 24 px mono SVG and show the Figma-defined `Visit scheduled` tooltip on hover and keyboard focus.

## Visual sources

- Icon source: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/Support history page/Icon.svg`
- Figma file: `CSC CR4.0 Prototype`
- Figma frame: `6036:233277`
- Tooltip copy: `Visit scheduled`
- Tooltip dimensions: 126 px wide by 54 px high

## Asset handling

- Copy the supplied SVG unchanged into `assets/icons/general/visit scheduled/size=24px, style=mono.svg`.
- Preserve its 24 × 24 view box and `#54545C` mono fill.
- Use the new asset only for Support History rows whose indicator type is `support`.
- Do not overwrite `assets/icons/navigation/support/size=24px, style=mono.svg`; that shared asset is also used by navigation and dashboard UI.

## Architecture

Generalize the existing Support History tooltip markup so each indicator can provide:

- its asset path;
- an accessible label;
- tooltip copy;
- a tooltip width modifier.

The existing quote indicator remains configured as `Quote ready` at 110 × 54 px. The support indicator is configured as `Visit scheduled` at 126 × 54 px. Both indicators reuse the same markup, event delegation, clipping protection, focus treatment, and tooltip surface styling.

## Appearance

- Render the supplied support icon at exactly 24 × 24 px using the existing `.sh-ticket-icon` sizing.
- Render the `Visit scheduled` tooltip as a 126 × 54 px white surface.
- Center the existing 14 px application typography within the surface.
- Reuse the neutral border, small Komodo-style radius, and soft elevation from the approved quote tooltip.
- Position the surface above and horizontally centered on the icon without changing table width or the 41 px row height.

## Interaction

- Show immediately on pointer hover.
- Show on keyboard focus.
- Hide on pointer leave or focus loss.
- Hide when Escape is pressed while the trigger is focused.
- Keep the tooltip out of layout and hidden from assistive technology while inactive.
- Do not introduce click navigation or an auto-dismiss timer.

## Accessibility

- The supplied SVG remains decorative inside a focusable informational wrapper.
- The wrapper exposes the accessible label `Visit status`.
- `aria-describedby` references the `Visit scheduled` tooltip.
- The existing visible focus outline remains unchanged.
- The tooltip does not capture pointer events or keyboard focus.

## Testing and verification

- Add a failing regression for the new asset path, tooltip copy, 126 × 54 dimensions, and hover/focus lifecycle before production changes.
- Confirm the existing quote tooltip remains `Quote ready` at 110 × 54 px.
- Confirm only quote and support indicators become tooltip triggers.
- Confirm the shared navigation support asset is unchanged.
- Compare the ready Figma frame and the implementation in the same browser comparison pass.
- Run the dedicated browser regressions, focused Support History shell tests, JavaScript syntax check, and `git diff --check`.

## Out of scope

- Changing the global `.toast` notification component.
- Adding tooltips to the ticket indicator or rows without an indicator.
- Changing Support History data, filtering, sorting, table columns, or navigation.
- Replacing the shared navigation support icon.
