# Open Support Ticket Step Viewer

## Scope

Replace only the four-step progress indicator on the Open Support Ticket page with the repository's Komodo-style step viewer, visually aligned to Figma frame `11554:235317`.

## Design

- Preserve the existing four steps and their order: Select instrument, Add request details, Confirm contact information, Review and submit.
- Render a semantic ordered list with accessible progress labeling.
- Show step one as the current state with Thermo Fisher red circle, white numeral, red connector, and bold label.
- Show the remaining steps as neutral outlined circles with dark connectors and regular-weight labels.
- Use the existing application typography, color tokens, and responsive page gutters. The table, filters, pagination, navigation, and page interactions remain unchanged.

## Verification

- Inspect the target Figma frame and the local Open Support Ticket route at the same desktop viewport.
- Verify the four-step hierarchy, state styling, connector alignment, and narrow-width behavior.
- Run `git diff --check`.
