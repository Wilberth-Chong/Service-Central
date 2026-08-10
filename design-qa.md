# Dashboard design QA

**Comparison target**

- Source visual truth: Figma node `3351:87661` in CSC CR4.0 Prototype; the repository's `assets/dashboard.png` is the matching 1440 × 2537 exported dashboard reference.
- Implementation: `http://localhost:4173/#dashboard`.
- Browser state: default desktop state, active-tickets tab selected.

**Findings**

- [P1] Product imagery and icon assets are not source-faithful.
  Location: dashboard quick actions, side navigation, ticket instrument thumbnails, and favorite-instrument cards.
  Evidence: the Figma source uses the Komodo icon set and product imagery; this static prototype has no bundled Komodo package, icon set, or individual instrument assets.
  Impact: the main visual language still differs from the source at close inspection.
  Fix: add the approved Komodo icon package and the exported instrument assets, then replace the local CSS approximations.

- [P2] Exact Figma-to-rendered screenshot comparison is not yet reproducible in this environment.
  Location: visual validation process.
  Evidence: the Figma canvas can be viewed, but its browser screenshot is zoom/canvas-framed while the browser screenshot bridge captures the local viewport at a different density. A normalized side-by-side image could not be captured with the available tooling.
  Impact: exact pixel-level acceptance cannot be asserted yet.
  Fix: export node `3351:87661` at 1440px from Figma and provide it as a PNG, or make the Komodo implementation package available locally for direct component comparison.

**Implemented fixes**

- Added Komodo Web Apps structural adapters for Platform Header, Platform Navigation, Page Header, Banner, Button variants, Tabs, Search Filters, and Data Table.
- Preserved the 1440px desktop composition and added responsive behavior below 1100px: quick-action cards reflow, data tables scroll within their region, and fixed-width clipping is removed.
- Added working dashboard search (Enter opens My instruments) and ticket-tab selected/count states.

**Validation**

- At 986px: document width remains 986px; quick-action cards render in two columns without clipping.
- At 1440px: document width remains 1440px; dashboard height is 2540.5px, matching the reference page's vertical composition.
- Search navigation and Start a request routing were verified in-browser.
- Browser console: no errors in the current dashboard bundle.

**Implementation Checklist**

- [x] Preserve the native coded dashboard rather than render the dashboard screenshot.
- [x] Use documented Komodo Web Apps patterns where the static project can support them.
- [x] Keep primary dashboard routes functional.
- [ ] Replace temporary CSS-drawn imagery/icons with approved Komodo assets.
- [ ] Run a normalized exported-Figma screenshot comparison.

**Follow-up Polish**

- Match the final approved icon assets, product thumbnails, and typographic rendering once the source assets or package are available.

final result: blocked
