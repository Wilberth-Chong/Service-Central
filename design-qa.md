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

---

# Contact Detail parent navigation design QA

**Comparison target**

- Source visual truth: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/Coverage contacts - Contact detail page.png`.
- Implementation: `http://localhost:4174/?contactParentNavigation=v1#contact-page`, browser-rendered at the desktop application viewport.
- State: expanded titlebar and compact-on-scroll titlebar.

**Findings and resolution**

- [P1 resolved] Contact Detail previously used a single-line "Service plan contacts" title without a parent control. The expanded titlebar now uses the reference hierarchy: blue `← Service plan contacts` parent navigation above `Service plan contact detail`, with Scheduling support retained at the right.
- [P1 resolved] Contact Detail had no compact titlebar. At scroll, it now keeps the parent navigation in the first row and places the page title with Go to top in the second row, while retaining the right-side action.

**Required fidelity surfaces**

- Fonts and typography: parent navigation is 14px, blue, and bold; expanded/compact page titles use the existing 32px/20px page-header hierarchy.
- Spacing and layout rhythm: expanded titlebar is 114px; compact titlebar is an 88px two-row grid, matching the established installation FAQ compact pattern.
- Colors and visual tokens: existing patterned pale titlebar background, primary blue navigation, and disabled gray Scheduling support action are retained.
- Image and copy fidelity: the existing mono left-arrow asset is used; parent and title copy match the supplied Contact Detail reference.

**Interaction verification**

- Browser check: parent control is visible and enabled; it routes to `#service-plan-contacts`.
- Scroll check: `.contact-main` enters compact mode at `scrollTop: 27.5px`; titlebar measures `88px`, with parent navigation on row one and Go to top on row two.
- Browser console: no errors.
- Focused shell tests and `git diff --check`: pass.

final result: passed

---

# Request qualification table design QA

**Comparison target**

- Source visual truth: [Figma node `8094:190356`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?node-id=8094-190356), captured in the in-app browser. The visible Figma canvas includes the selected instrument-selection frame and its request-detail sibling at 28% canvas zoom.
- Implementation: `http://localhost:4173/?qualificationTable=visual#request-qualification`, captured in the in-app browser at the desktop viewport.
- State: first step, no selected instruments, system expanded, filters and page-size menus closed.

**Findings and resolution**

- [P1 resolved] Qualification used a separate PM stepper. It now mounts the shared `TicketStepViewer` component with the four qualification labels and current-step semantics.
- [P1 resolved] The top Select all control included a checkbox that is absent from the source. It is now a text action; the selectable instrument rows retain 20px Komodo-style checkbox states.
- [P1 resolved] The table used PM-only controls. Qualification now uses the Open support ticket table treatment for its system expansion control, instrument imagery, overflow tooltips, four column multi-select menus, selected rows, and raised menus.
- [P1 resolved] Pagination now uses the Open support ticket result-count, page-size, page-number, and Go to styling. The page-size menu offers 10, 20, 30, 40, and 50.

**Focused interaction evidence**

- The four shared viewer labels render as Select instrument(s), Add request details, Confirm contact information, and Review and submit; the accessibility label is Qualification service request progress.
- The top Select all action has no nested checkbox. It selects all 15 visible fixture instruments and enables Continue.
- Collapse hides the five system children; Model opens the multi-select list above table content; Results per page opens the five-option list.

**Required fidelity surfaces**

- Fonts and typography: existing Helvetica/Komodo-compatible table, control, and step-viewer typography are reused.
- Spacing and layout rhythm: the 1200px instrument-selection card and shared table/pagination dimensions remain aligned with the native ticket-selection implementation.
- Colors and tokens: primary red, Komodo blue selection, neutral borders, and coverage-status colors reuse existing page tokens.
- Image quality and asset fidelity: existing repository instrument images and mono navigation/filter assets are reused; no generated or replacement assets were introduced.
- Copy and content: Qualification copy, 267-instrument count, and four request steps match the captured frame.

**Comparison limitation**

- The Figma capture is an editor canvas at 28% zoom and contains adjacent frames rather than an exported node image. A normalized, same-crop side-by-side comparison cannot be produced from that canvas capture alone.

final result: blocked

---

# Request Support design QA

**Comparison target**

- Source visual truth: Figma node `8026:173099` in CSC CR4.0 Prototype.
- Implementation: `http://localhost:4173/#request-support`.
- Browser state: 1440 × 1000 desktop viewport override.

**Validation**

- Native app shell, six bordered request cards, compact outlined actions, pale-blue promotional rail, and fixed desktop sidebar were inspected against the reference.
- Open a support ticket routes to `#instrument-support-selection`; Request PM scheduling routes to `#request-pm`; Installation support routes to `#installation-order`.
- Quote controls display an in-app confirmation toast.
- At 900px, the right rail follows the request list without document-width overflow.
- Browser console: no errors.

final result: passed

---

# First-visit “New on Services Central” modal QA

- Source visual truth: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/WhatsNew modal.png` (1100 × 540 px).
- Implementation: `http://localhost:4173/?showWhatsNew=1#my-instruments`, captured in the in-app browser at 1280 × 720 CSS px.
- Same-state comparison: the supplied modal reference and the forced first-visit browser capture were compared in their desktop modal states.

**Findings and resolution**

- The implementation uses the existing shared modal surface and backdrop, preserving the app’s dialog focus and close behavior.
- The 1100px desktop modal follows the reference’s light feature area, 40px heading, two balanced feature columns, close icon, and separated white preference area.
- Existing user-add and support-tool icons are used rather than introducing replacement artwork.

**Interaction checks**

- A successful sign-in submission opens the modal after the user is routed to Dashboard; direct landing routes do not trigger it.
- The close button dismisses the modal without affecting the current route.
- Checking “Don’t show this again” before closing persists the preference; a new `#support-history` app load did not reopen the modal.
- `?showWhatsNew=1` provides a non-destructive preview path even after the preference has been stored.
- `tests/whats-new-modal.test.sh` and `git diff --check` passed.

final result: passed

---

# PM direct-review route regression QA

**Scope**

- Step 1 serial action: `TSQ-Z-12347` on `#request-pm`.
- Expected destination: `#request-pm-direct-review`, not `#request-pm-status`.

**Verification**

- Fresh browser navigation loaded the cache-busted application script, clicked the exact serial button, and reached `#request-pm-direct-review`.
- The confirmed-PM notice was present and the legacy PM-status route was absent.
- The trigger is now an explicit `data-pm-direct-review-trigger`, preventing it from relying on display-text matching or the generic instrument handler.
- Focused route regression, JavaScript syntax check, and `git diff --check` passed.

final result: passed

---

# Direct PM scheduled-instrument review QA

**Comparison target**

- Source: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/MyIns/InsDe/TSQ-2/ReqSupp/PM/Review.png`.
- Implementation: `http://localhost:4173/#request-pm-direct-review`.
- Same-state desktop comparison: reference and the 1440px-wide implementation capture at `/private/tmp/pm-direct-review-implementation-1440.png` were reviewed together.

**Fidelity and interaction review**

- The direct route retains the application shell, title bar, two-position red progress line, completed first step, checked Review marker, submitted-style green notice, confirmed-date disclosure heading, and the single TSQ-Z-12347 date row.
- The table uses the existing TSQ repository thumbnail, blue serial/date links, row treatment, and source-aligned columns.
- Only the TSQ-Z-12347 serial button from PM Step 1 navigates here; other serial actions retain their existing behavior.
- Close uses the shared action bar and returns to Request support.

**Validation**

- `bash tests/request-pm-direct-review.test.sh` passes.
- Browser interaction confirmed Step 1 serial click → `#request-pm-direct-review`; visible notice, two viewer states, confirmed PM row, and Close action all rendered with zero console errors.
- Close returned to `#request-support`.

final result: passed

---

# PM scheduling submitted summary QA

**Comparison target**

- Source: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/Request PM/Submitted.png`.
- Implementation: `http://localhost:4173/#pm-request-summary`.
- Same-state comparison: the supplied reference and the browser-rendered implementation were reviewed together after submission; implementation evidence was captured at `/private/tmp/pm-request-summary-implementation.png`.

**Fidelity review**

- Structure: the route uses the existing Services Central header, left navigation, page title bar, submitted notice, three stacked summary cards, fixed Close action bar, and footer.
- Typography and spacing: title, Summary heading, card headings, labels, disclosure controls, and contact grid use the established PM review scale and card rhythm.
- Visual treatment: the submitted notice retains the `#00a62c` left success accent and `#f7f7f7` surface; cards retain the source-matched neutral border and white background.
- Content: scheduling details, PM request details, contact name, phone, email, company, and two-line service address are populated from the preceding PM steps.
- Interaction: Submit routes from Step 5 to the submitted summary; both instrument disclosures expand/collapse; Close returns to Request support.

**Validation**

- `bash tests/request-pm-summary.test.sh` passes.
- PM review Submit reached `#pm-request-summary`; the green notice rendered; an instrument disclosure expanded; Close returned to `#request-support`.
- Browser console returned no errors for the summary flow.
- JavaScript syntax validation and `git diff --check` pass.

final result: passed

---

# PM scheduling Step 5 review and submit QA

**Comparison target**

- Source visual truth: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/S&S/ReqSupp/PM/Revie and Submit.png` (1440 × 1827).
- Implementation: `http://localhost:4173/?pmReviewFlow=1#request-pm-review`, captured at 1280 × 720 CSS px from the live app.
- State: populated Scheduling request details, PM request details, and contact information; Step 5 current; both selected-instrument disclosures collapsed.

**Findings and resolution**

- [P1 resolved] The PM flow previously ended at contact information. Step 4 Continue now opens a dedicated Step 5 review route with the active five-step viewer state and Submit action.
- [P1 resolved] The review cards now retain separate Scheduling request and PM request detail values, with independent expandable selected-instrument tables.
- [P1 resolved] Contact information is populated from the PM contact draft and formats the full service address in the same review-card treatment as the source.
- Typography: the review title, card headings, labels, and body copy use the existing Services Central Helvetica stack, matching the surrounding PM flow.
- Spacing/layout: the 1200px content column, 32px card rhythm, promotion banner, and fixed action bar match the PM request shell. The live shell retains its existing route toolbar above the application header; this is shared shell behavior and not modified by Step 5.
- Colors/tokens: PM red is retained for Step 5 and Submit, and blue `#0071d0` is used for the promotion accent and terms links.
- Assets/copy: existing blue information, chevron, and PM shell assets are used; no placeholders or newly generated assets were introduced.

**Interaction verification**

- Step 3 → Step 4 → Step 5 preserves entered detail and contact data.
- Both selected-instrument disclosures expand correctly.
- Promotion terms opens the existing Terms and conditions modal.
- Browser console errors: none.

final result: passed

---

# Request PM scheduling — View PM status design QA

**Comparison target**

- Source visual truth: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/S&S/ReqSupp/PM/PM Status.png` (1440 × 1827).
- Implementation capture: `/Users/niranjan.kumarm/Sc/Service-Central/.tmp-pm-status-implementation.png` (1440 × 1827, CSS viewport 1440 × 1827, density 1×).
- State: PM flow Step 2, all supplied PM-status rows expanded and selected as in the reference.

**Findings and resolution**

- [P1 resolved] Step 1 previously stopped at a toast. Selecting an instrument and continuing now navigates to a dedicated `#request-pm-status` screen with Step 2 current and Step 1 complete.
- [P1 resolved] The five-step connector used an incorrect fixed offset for current steps. It now derives the completed segment from the number of labels; the Step 2 segment ends at the left edge of its active circle.
- [P2 resolved] The reference has three distinct PM-status data groups. The implementation now provides Confirmed PM date(s), Request PM scheduling, and Request PM(s), with matching records, system/instrument icons, selected Komodo-style checkboxes, and semantic status badges.
- [P2 resolved] The status table began too far left and its header columns drifted from the source. A leading spacing column and reference-aligned table tracks now place scheduled date, image, serial number, nickname, and contact columns in the same visual order.

**Fidelity surfaces**

- Fonts and typography: existing Services Central Helvetica stack, 22px title, 28px section headings, 16px message/body copy, and 14px table copy were compared against the source hierarchy.
- Spacing and layout rhythm: fixed header begins at 0px; title bar starts at 64px; step viewer starts at 152px; promotion begins at 282px (source: 279px). Section/table left edges, 60px rows, and fixed action/footer treatment follow the source composition.
- Colors and visual tokens: existing red wizard state, blue promotion rail/link and checkbox treatment, neutral borders, green Under contract badge, blue Open badge, and gray Expired badge are used.
- Image quality and asset fidelity: repository TSQ/Q Exactive product thumbnails and existing 24px mono system, chevron, and information assets are used. No replacement or generated assets were introduced.
- Copy and content: headings, promotion copy, dates, serials, nicknames, contacts, and badge labels match the supplied reference.

**Interaction verification**

- Step 1: selecting `1009996` enables Continue; Continue opens `#request-pm-status`.
- Step 2: Back returns to `#request-pm`; each PM-status disclosure toggles its table.
- Browser console: no errors or warnings.

**Follow-up polish**

- [P3] The inherited native-flow action bar and scroll container differ slightly from the full-height Figma canvas outside the source’s visible content region; they preserve the repository’s required shared shell behavior.

final result: passed

---

# Request PM Step 1 design QA

**Comparison target**

- Source visual truth: Figma node `8041:199081`, captured in the in-app browser on 2026-08-22. The selected frame is the 1440 × 1827 PM Step 1 selection state.
- Implementation: `http://localhost:4173/#request-pm`.
- Intended state: PM Step 1, system expanded, no filters active.

**Implemented alignment**

- Replaced PM's legacy step strip with the reusable five-step `TicketStepViewer` treatment.
- Reused the Qualification-style instrument selection: search, column multi-select filters, applied-filter badges, clear action, select-all/indeterminate states, collapsible system rows, overflow handling, and page-size/pagination controls.
- Retained the PM title, promotion, PM-specific 240-instrument copy, and current Continue action.

**Required fidelity surfaces**

- Fonts and typography: shared step viewer and 14px dense-table control typography are reused.
- Spacing and layout rhythm: the 1320px five-step PM viewer, 188px promotion banner, and Qualification-style table treatment align to the captured PM frame.
- Colors and visual tokens: existing Komodo-compatible red, blue, neutral borders, and coverage badges are reused.
- Image quality and assets: existing repository instrument thumbnails and mono system icon are reused.
- Copy and content: PM-specific headings, promotion, and selection copy are retained.

**Validation limitation**

- The refreshed `localhost:4173` bundle was verified at the 1440 × 1827 target viewport: the five-step viewer, 188px banner, Qualification-style table, and opened Groups menu all render. Figma is available only as an editor-canvas capture in this environment, so a normalized source/implementation pixel-diff remains unavailable.

final result: blocked

---

# Service Plan Step 1 parity QA

**Comparison target**

- Source visual truth: Service Plan selection reference supplied by the user, including the active first-step viewer, instrument-selection card, multi-select table, and pagination.
- Implementation: `http://localhost:4173/?servicePlanStepOne=1#request-serviceplan`, captured in the in-app browser at the 1440 × 1600 reference viewport.
- State: unselected Step 1, then a single instrument selected with the Model filter menu opened and closed before continuing.

**Findings and resolution**

- [P1 resolved] Service Plan's legacy selection controls used a different table, standalone filters, and pagination treatment. Its Step 1 now uses the same Komodo-style selection controls as Calibration while retaining Service Plan's 240-instrument copy, title, route, thumbnails, system row, and downstream draft data.
- Fonts and typography: the existing application title, four-step viewer, table labels, and 14px dense-table copy are retained.
- Spacing and layout rhythm: the search field, blue select-all action, applied-filter region, table columns, 12px pagination separation, fixed action bar, and footer reuse the existing native selection patterns.
- Colors and visual tokens: active red step, blue action/link color, neutral borders, status badges, and selected-row state come from the existing shared CSS.
- Image quality and copy: existing repository instrument thumbnails and mono navigation/filter assets are retained; no generated or placeholder assets were added.

**Interaction verification**

- Header checkbox and the blue **Select all 240 instruments** action select the Service Plan instruments; a single selection enables Continue.
- Groups, Type, Model, and Coverage use the reusable multi-select filter treatment and applied-filter state.
- Page-size options 10, 20, 30, 40, and 50 use the same popover pattern as Calibration.
- Continuing with a selected row reaches `#request-serviceplan-details` and renders that selected instrument in Step 2.
- Browser console: no errors in the checked Step 1 and continuation states.

final result: passed

---

# Request Service Plan four-step flow QA

**Comparison target**

- Step 1: user-supplied `Selected.png` reference for the selected-instruments state.
- Step 2: Figma frame `8085:187356`, captured in the in-app browser before later Figma loading failures.
- Step 3: user-supplied `Filled.png` reference.
- Step 4: user-supplied `Review and Submit.png` reference.
- Summary: the approved Calibration submitted-summary pattern, retitled and populated for Service Plan.

**Verified interaction path**

- Selecting an instrument enables Continue and opens `#request-serviceplan-details`.
- Required additional details and a selected downtime level enable Continue; optional service priorities persist.
- The contact screen uses the existing Country and State/Province Komodo single-select controls.
- Review displays the selected instruments disclosure, request details, Service coverage needs, and combined service address.
- Submit opens `#serviceplan-summary`; its selected-instrument disclosure expands; Close returns to `#request-support`.

**Scope check**

- Service Plan uses a dedicated draft and dedicated routes. Calibration routes, drafts, templates, and CSS selectors were not changed.

**Known visual limitation**

- The supplied Service Plan summary Figma frame could not be captured because Figma remained on its loading screen. The summary follows the explicitly approved Calibration summary pattern, but a source-to-rendered visual comparison for that final state is still unavailable.

final result: blocked

---

# Calibration submitted summary design QA

**Comparison target**

- Source visual truth: [Figma frame `13191:285215`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?node-id=13191-285215), captured in the in-app browser at its 28% canvas zoom.
- Implementation: `http://localhost:4174/#calibration-summary`, captured in the in-app browser at 1280 × 720 CSS px after submitting the four-step calibration flow.
- State: one selected instrument, populated additional details, selected calibration service level and interval, and populated contact/service-address fields.

**Findings and resolution**

- [P1 resolved] The submitted calibration route did not display the calibration service needs captured in Step 2. The summary now places that card between Request details and Contact information, matching the Figma hierarchy.
- [P1 resolved] The summary template used different name and service-address data hooks than the calibration binding helper. The submitted screen now renders the combined name and complete multi-line service address captured in Step 3.
- [P2 resolved] The submitted title was "Request a calibration service" while the reference title is "Request calibration service". The summary title and native header now match the reference copy.

**Fidelity surfaces**

- Typography and layout: the existing native 1200px content region, summary heading, card order, and fixed Close action match the source hierarchy; the existing Komodo type and card rhythm are retained.
- Colors and tokens: the submitted notice uses the existing neutral `#f7f7f7` panel, green status edge/icon treatment, and neutral card borders used by the reference.
- Assets and copy: the repository success icon remains in use; no generated or placeholder assets were introduced. Copy matches the reference submitted notice and calibration summary labels.
- Focused comparison: notice, request-details, service-needs, and contact cards were inspected from the source canvas and populated implementation state. No actionable P0/P1/P2 differences remain.

**Interaction verification**

- The UI journey Step 1 → Step 2 → Step 3 → Step 4 → Submit routes to `#calibration-summary`.
- The populated summary renders selected instrument `1141529637`, request details, ISO 17025 service level, 12-month interval, full contact name, phone, email, company, and service address.
- The summary includes the Close action and no browser-rendered errors.

final result: passed

---

# Calibration Step 4 review QA

**Comparison target**

- Source visual truth: [Figma frame `8279:229598`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8279-229598&t=jIBL8eK3P1BoX9qZ-1), captured in the in-app browser.
- Implementation: `http://localhost:4174/#request-calibration-review`, captured in the in-app browser at the 1280px desktop viewport with request details, service needs, and contact fields populated.
- State: ISO 17025 selected; 12-month interval selected; Molly Hartman; service address with an additional-address line.

**Findings and resolution**

- [P1 resolved] The shared review template did not target its separate Name and Service address nodes for Calibration. Step 4 now renders the combined first/last name and a two-line, combined service address from Step 3.
- [P1 resolved] The Figma frame places a Calibration service needs card between Request details and Contact information. Calibration now inserts that card only in its own review route and displays the selected service level and interval in two review columns.
- Fonts and typography: the new card uses the existing 24px review-card heading and 14px label/value treatment.
- Spacing and layout rhythm: the card uses the existing review-card border, padding, and 32px two-column rhythm, preserving the requested placement.
- Colors and tokens: repository neutral borders, dark headings, and muted value text are reused.
- Image quality and assets: no imagery or custom icon treatment was added.
- Copy and content: card and field labels match the referenced Figma frame.

**Validation**

- Full review path tested: instrument selection → details and calibration needs → contact → review.
- Rendered review evidence: `Molly Hartman`, `123 Blueberry Lane, Building 2` with locality line, ISO 17025, and `12 months` appear in their corresponding review regions.
- Browser console: no errors.

final result: passed

## Calibration four-step flow

**Implementation and verification**

- Calibration now follows the same shared step-viewer and native action-bar pattern as Qualification across instrument selection, request details, contact confirmation, review, and submitted summary.
- Calibration retains its own draft state, selected freezer instruments, request details, contact information, and submitted-summary route.
- Browser verification completed the full user journey from one selected instrument through required details/contact fields to the submitted summary. Step 4 displayed enabled `Submit`; the summary contained the entered request detail, the submitted notice, and Close; console errors: none.

final result: passed

## Qualification submitted summary

**Comparison target**

- Source visual truth: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/Qual/Submitted.png`.
- Implementation: `http://localhost:4173/?qualificationSummary=1#qualification-summary`, reached by clicking Submit on the Qualification review route.

**Findings and resolution**

- [P1 resolved] Qualification Submit previously displayed only a toast. It now opens a dedicated submitted-summary screen with the source's title, green submitted notice, Summary heading, request-details card, contact-information card, and bottom Close action.
- [P1 resolved] The submitted summary derives its additional details, selected instruments, and contact data from the preceding Qualification flow rather than hard-coded review content.
- [P2 resolved] The existing submitted notice, shared selected-instrument disclosure, shell alignment, and native Close action bar are reused to match the established Services Central treatment.

**Interaction verification**

- Clicking Submit from `#request-qualification-review` navigates to `#qualification-summary`.
- The rendered screen contains the submitted notice, Summary, Close, and the five expected contact labels; browser console errors: none.
- A current-page screenshot was captured after navigation; static route coverage, JavaScript syntax, and `git diff --check` passed.

final result: passed

## Request Qualification steps 3–4 sidebar alignment

**Implementation and verification**

- Source convention: Request Qualification uses the same 1440px application-shell alignment as the existing request-flow screens.
- Applied the shell-origin sidebar calculation only to the Confirm contact information and Review and submit routes.
- At the default 1280px viewport, both routes compute to `left: 0px`, which is the expected clamped value; at larger viewports the existing `max(0px, calc((100vw - 1440px) / 2))` rule moves the sidebar with the centered shell.
- Browser navigation through both routes reported no console errors. Static sidebar regression, JavaScript syntax, and `git diff --check` passed.

final result: passed

---

# Request Qualification Step 4 contact summary QA

**Comparison target**

- Source visual truth: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/S&S/ReqSupp/QualServ/Review and Submit.png` (attached desktop reference).
- Implementation: `http://localhost:4173/?qualificationReviewContact=1#request-qualification-review`, rendered after completing the Step 3 required fields.
- State: Step 4 Review and submit with a populated company and service address.

**Findings and resolution**

- [P1 resolved] Step 4 previously listed every address field independently. The contact summary now has the reference's five fields: Name, Phone number, Email, Company, and a combined Service address.
- [P1 resolved] The Service address displays its street and optional second line first, then city, state, country, and postal code as the second line.
- [P2 resolved] The review introduction copy and contact grid now use the source's two-row hierarchy, without changing the request-details disclosure.

**Interaction verification**

- Completing Step 3 with `123 Blueberry Lane` and `Thermo Fisher` routes to Step 4.
- The review contains only the five expected labels and produces `123 Blueberry Lane` plus `Carlsbad, California, USA, CP: 93047` in the combined address.
- Browser console errors: none.

final result: passed

---

# Request Qualification Step 3 contact form QA

**Comparison target**

- Source visual truth: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/S&S/ReqSupp/QualServ/ContactInfo.png` (attached 1,440 × 1,620 desktop reference).
- Implementation: `http://localhost:4173/?qualificationContactPrefill=2#request-qualification-contact`, rendered in the in-app browser at the desktop flow state.
- State: initial contact form with reference prefilled identity/contact/location values, empty required service address and company fields, and disabled Continue.

**Findings and resolution**

- [P1 resolved] The previous generic two-column grid interleaved unrelated fields. The form now uses the reference's two fixed 524px columns with a 72px gutter, grouping identity/company fields at left and address/location fields at right.
- [P1 resolved] Country and State/Province are now native select controls; email and telephone retain their appropriate semantic types and existing validation.
- [P2 resolved] Initial values and placeholders now match the reference intent. Continue remains disabled until the empty required Service address and Company fields are valid, then routes to Step 4.

**Fidelity review**

- Typography: 14px label/input treatment, with required indicators aligned in the label.
- Spacing and layout: 32px row rhythm within columns; split rows use 246px controls separated by 32px.
- Colors and tokens: existing Komodo-style neutral controls, red required markers, and standard focus treatment are retained.
- Copy and input types: labels, optional address wording, and placeholder copy follow the supplied reference; `tel`, `email`, text, and select controls are used where appropriate.

**Interaction verification**

- Initial Continue disabled; entering `Street and number` and `Company name` enables it, with existing required fields prefilled.
- Continue routes to `#request-qualification-review` and renders `Review and submit`.
- Browser console errors: none.

final result: passed

---

# Request Qualification selected-instruments disclosure QA

**Comparison target**

- Source visual truth: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/Screenshot 2026-08-20 at 12.57.49 AM.png` (attached 1,780 × 445 reference).
- Implementation: `http://localhost:4173/?qualificationSelectedTable=2#request-qualification-details`, captured in the in-app browser at the matching expanded disclosure state (1,280 × 720 CSS viewport; browser capture retained in the active verification tab).
- State: one selected system instrument, expanded selected-instruments disclosure.

**Findings and resolution**

- [P1 resolved] The disclosure previously used free-form detail cards. It now renders a compact three-column table with the reference's blank icon column, `Serial number`, and `Nickname` headers.
- [P1 resolved] The original extraction read the return-arrow table cell rather than the instrument-thumbnail cell. The summary now uses the actual instrument asset and adds a single system-context row using the repository’s mono system icon.
- [P2 resolved] The disclosure control now changes between `Show selected instrument(s)` and `Hide selected instrument(s)` as its accessible expanded state changes.

**Fidelity review**

- Typography: headers use 16px bold; selected values use 16px / 24px with the existing Helvetica-based application stack.
- Spacing and layout: table width is capped at 856px, header height is 68px, body rows are 62px, and the disclosure-to-table gap is 16px.
- Colors and tokens: white table surface, neutral `#ddd` dividers, `#29292e` content, and the existing `#0071d0` disclosure action are retained.
- Assets and copy: the existing instrument thumbnail and 24px mono system icon are used; all labels match the supplied reference pattern.

**Interaction verification**

- Selecting an instrument enables Continue and routes to Step 2.
- Expanding yields `Hide selected instrument(s)`, `aria-expanded="true"`, the three expected headers, one instrument row plus one system row, and two rendered icons.
- Browser console errors: none.
- Static flow and table regression checks, JavaScript syntax check, and `git diff --check`: passed.

final result: passed

---

# Open support ticket Step 4 attachment comparison QA

**Comparison target**

- Source visual truth: [Figma frame `8054:180026`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8054-180026&t=jIBL8eK3P1BoX9qZ-1), re-captured in the in-app browser at 50% zoom for readable detail comparison.
- Implementation: `http://localhost:4173/#open-support-ticket-review`, browser-rendered in the clean no-file state.

**Findings and resolution**

- [P1 resolved] The source uses a single-column request-detail stack. The review card now has a single 1118px content track rather than a two-column summary grid.
- [P1 resolved] The source disclosure shows an attached-file count and compact preview tiles. Uploaded files now render as an initially expanded `N attached files` disclosure using 160 × 90px image/document previews, two-line file names, and 12px file sizes. The disclosure remains collapsible with the matching up/down chevrons.
- Instrument information continues to reuse the Step 2 panel, including coverage and manuals.

**Validation**

- Browser DOM confirms the single-column detail track, attachment preview-grid class, empty-state counter, and zero console errors.
- Focused flow, shell, and footer regression scripts pass; `git diff --check` is clean.

final result: passed

---

# Open support ticket Step 4 detail alignment QA

**Comparison target**

- Source visual truth: [Figma frame `8054:180026`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8054-180026&t=jIBL8eK3P1BoX9qZ-1), captured in the in-app browser.
- Implementation: `http://localhost:4173/#open-support-ticket-review`, browser-rendered in a clean-route state.

**Findings and resolution**

- [P1 resolved] Removed the non-reference Request type row and shortened the request-detail labels to the source-aligned terms: Request subject, Problem, Error codes, and Recent changes to the instrument or environment.
- [P1 resolved] Replaced the simplified instrument summary with the same facts, coverage, manuals, and included-service structure used in Step 2.
- [P2 resolved] Combined first and last name into one Name row.
- [P2 resolved] Added the dynamic files-attached counter with a keyboard-accessible expand/collapse button and directional chevrons. In the clean state it correctly reports No files attached and disables the disclosure.

**Validation**

- Browser DOM confirms the required labels, full Step 2 instrument panel, disabled zero-file state, and no console errors.
- Focused flow, shell, and footer regression scripts pass; `git diff --check` is clean.

final result: passed

---

# Open support ticket Step 4 review QA

**Comparison target**

- Source visual truth: [Figma frame `8054:180026`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8054-180026&t=jIBL8eK3P1BoX9qZ-1), captured in the in-app browser at its 20% canvas zoom.
- Implementation: `http://localhost:4173/#open-support-ticket-review`, captured in the in-app browser at the desktop viewport.
- State: source depicts completed request data; the clean-route implementation intentionally shows dynamic empty-data fallbacks until the user completes earlier steps.

**Findings and resolution**

- [P1 resolved] The former review route used a generic two-card summary. It now follows the source hierarchy: review introduction, support request details, instrument information, then contact information.
- [P1 resolved] Request, instrument, contact, and attachment values are now populated dynamically from prior steps.
- Fonts and typography: existing Komodo-compatible Helvetica stack, 24px section headings, and 14px detail labels/values are retained.
- Spacing and layout rhythm: cards use the existing 1200px content column, 20px card separation, 32/40px internal padding, and a four-column instrument summary that collapses at the existing responsive breakpoint.
- Colors and tokens: neutral card borders, pale instrument surface, and the green under-contract status use existing page tokens.
- Image and copy fidelity: the existing instrument image asset and source labels are used; no generated or placeholder assets were introduced.

**Validation**

- Browser-rendered route has no console errors.
- Full-view and focused review-card comparison performed from the in-app browser captures.
- Primary interactions retained: Back returns to Step 3; Submit continues to use the existing confirmation toast.
- Focused flow, shell, and footer regression scripts pass; `git diff --check` is clean.

final result: passed

---

# Open support ticket — Step 2 design QA

**Comparison target**

- Source visual truth: [Figma frame `8052:180425`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?node-id=8052-180425&t=jIBL8eK3P1BoX9qZ-1), inspected in the in-app browser at 100% canvas zoom.
- Implementation: `http://localhost:4173/?openSupportTicketDetailsFinal=1#open-support-ticket-details`, rendered in the in-app browser.
- State: desktop Step 2 with the filled Figma form state; Step 2 is current and Step 1 is complete.

**Observed implementation coverage**

- The page preserves the platform header, side navigation, title bar, fixed action bar, and footer used by the Step 1 ticket-selection page.
- The current form reproduces the Figma frame's support-request title, subject, multi-line problem and environment fields, error-code field, counters, upload area, sample files, and instrument-information summary.
- The user journey is functional: selecting instrument `1009996` in Step 1 and pressing Continue opens Step 2 and carries that serial number into the summary. Back returns to Step 1; required fields control Continue availability.
- Browser console errors: none. Dedicated Step 2 regression and the wizard-navigation check pass.

**Comparison limitation**

- The browser security policy blocked creation of a combined side-by-side Figma/implementation capture. The two live visual sources were captured individually, but the required same-input normalized comparison cannot be completed with the available browser policy.

**Findings**

- [P2] Pixel-level comparison remains unverified because the browser policy blocks the combined comparison artifact.
  Location: visual QA process.
  Evidence: source and implementation were individually rendered; the combined visual comparison could not be opened.
  Fix: provide an exported PNG of Figma node `8052:180425` or permit a local comparison artifact.

final result: blocked

---

# Support History systems tooltip design QA

**Comparison target**

- Source visual truth: Figma node `6036:236187`, captured in the in-app browser.
- Implementation: `http://localhost:4173/?figmaSystemTooltipLayered=20260814#support-history`, captured while hovering the first Systems icon.
- Focused state: Systems tooltip; source callout specifies `193 × 54`.

**Findings and resolution**

- [P1 resolved] The Systems tooltip state opened but was clipped by its table cell beneath the table header. The active tooltip cell now establishes a visible, raised stacking context.
- [P2 resolved] The tooltip was 214px wide. It now measures 193 × 54 CSS px, uses the Figma copy, preserves the blue Alpine and Sasha links, and includes the matching outlined bottom pointer.
- Interaction verification: pointer hover and keyboard focus open the tooltip; pointer leave, blur, and Escape close it. Browser console errors: none.

**Comparison limitation**

- The source and implementation captures were both obtained, but the browser policy blocked opening the generated combined comparison canvas. A compliant same-input visual-comparison pass could not be completed in this environment.

final result: blocked

---

# Support History status multiselect design QA

**Comparison target**

- Badge source: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/Screenshot 2026-08-14 at 1.20.38 PM.png`, normalized from its 2× physical-pixel capture to CSS-pixel scale as `/tmp/status-badge-reference-normalized.png`.
- Dropdown source: Komodo Web Apps Library Storybook, `core-components-dropdown--multi-select-open`, captured with Arizona and Arkansas selected as `/tmp/komodo-multiselect-reference.png`.
- Implementation: `http://localhost:4173/?supportHistoryStatusMultiselect=final#support-history`, captured at 1280 CSS px and device scale factor 1 as `/tmp/support-history-status-badge-final.png` and `/tmp/support-history-status-multiselect-final.png`.
- Same-state evidence: the normalized badge source and closed applied-filter state were emitted together; the open Komodo two-selection state and open Support History `Open` + `In progress` state were emitted together in the same comparison input.

**Comparison history**

- [P1 resolved] The initial applied badge used the reference's 48 physical pixels as 48 CSS pixels. Density normalization established the intended 24 CSS px height; the final badge is 24px high with a 12px radius, 14px/22px text, 8px inline padding, and the repository 16px mono close asset.
- [P2 resolved] The initial menu applied an information-surface background to every checked row. Komodo preserves selection with its checked checkbox and uses `rgb(223, 238, 255)` only for hover/focus. The final component follows that behavior while keeping `aria-selected` and checked state persistent.
- [P2 resolved] The initial 220px menu was wider than its 180px trigger. The final menu uses the trigger width and border-box sizing, matching Komodo's aligned control/menu edges.

**Final measurements and behavior**

- Trigger: 180 × 40 CSS px; menu: 180px wide; each option row: 40px high; four options in exact order: All, Open, In progress, Closed.
- Badge: 24px high; Clear filters: 14px/22px; table header and body rows remain 45px and 41px respectively.
- Selecting one or more statuses filters live with OR semantics; Status composes with search and created date using AND semantics. Badge removal, Clear filters, All, Escape, outside click, Tab dismissal, Arrow navigation, Enter, Space, and focus restoration all pass.
- Reusable component contract and an alternate Region fixture pass independently of Support History.
- Browser regressions passed: reusable component, Status integration, date range, quote tooltip, and visit tooltip.
- Focused shell checks, JavaScript syntax checks, and `git diff --check` passed. The broader shell suite retains one unrelated pre-existing failure in `tests/fixed-page-footers.test.sh` because `.ns-footer` does not declare `position: fixed`; all other shell tests passed.

final result: passed

---

# Support History quote tooltip design QA

**Comparison target**

- Source: Figma frame `6036:233278`, `Quote ready` tooltip state.
- Implementation: `http://localhost:4173/?supportHistoryQuoteTooltip=finalqa#support-history`, captured in the in-app browser at 1280 × 720 CSS px.
- Tooltip measurement: 110 × 54 CSS px.

**Comparison history**

- [P2 resolved] The first implementation had the correct tooltip geometry but the existing Support History table wrapper clipped the left half of the surface. The wrapper now exposes overflow only while the quote tooltip is visible, keeping the inactive table behavior unchanged.
- The ready Figma canvas and final implementation were opened together in the same comparison pass at the same browser density.

**Findings**

- No actionable P0/P1/P2 discrepancies remain.
- The white surface, centered 14 px `Quote ready` copy, compact neutral border, small radius, and soft elevation follow the selected Figma component.
- Tooltip placement does not change the Support History table layout: the quote row remains 41 px high and the page remains 1280 px wide at the verification viewport.
- The existing 24 px quote asset and Services Central typography are preserved.

**Interaction verification**

- Hover and keyboard focus show `Quote ready`.
- Pointer leave, blur, and Escape hide the tooltip.
- Support indicators and empty indicator cells do not expose the quote tooltip.
- The dedicated browser regression reports `PASS` without an uncaught harness error.

final result: passed

---

# Support history date-range component design QA

**Comparison target**

- Source visual truth: Figma `CSC CR4.0 Prototype`, support-history `Date range` control selected from `S&S / history / start`; focused capture `/tmp/figma-support-history-date-control.png` at 1214 × 901 pixels, 1214 × 901 CSS px, density 1.
- Implementation closed state: `/tmp/support-history-date-control-closed.png` at 1280 × 720 pixels, 1280 × 720 CSS px, density 1.
- Implementation open state after refinement: `/tmp/support-history-date-control-open-final.png` at 1280 × 720 pixels, 1280 × 720 CSS px, density 1.
- Route: `http://localhost:4173/?supportHistoryDateRange=5#support-history`.
- State: desktop support-history filters with no applied range; open-state verification used August–September 2026 before selecting a range.
- Normalization: source and implementation were reviewed together in one comparison input. Figma editor/search chrome was excluded from product judgement; the focused 243 × 40 date control and its adjacent filter grid were compared directly because the source and implementation viewport heights differ.

**Full-view and focused comparison evidence**

- The full support-history implementation preserves the previously aligned title band, 32px content gutter, search/date/edit-columns grid, table columns, row density, status chips, fixed sidebar, and footer.
- The focused closed-state comparison confirms the trigger remains 243 × 40 with the same label hierarchy, neutral border, white background, 16px horizontal inset, and repository calendar icon placement as the Figma control.
- A focused open-state comparison was required because the calendar actions are too small to judge in the full page. The final capture shows both months, navigation, weekday/day density, complete Clear/Cancel/Apply row, and the table remaining fixed behind the anchored popover.

**Comparison history**

- [P2 resolved] Initial open-state capture measured the dialog at 584 × 399 and placed its bottom at 784px in the 720px viewport, hiding the action row. The component calendar was compacted without changing its 584px width or the 243 × 40 trigger. The revised six-week-month dialog measures 584 × 334, ends at 719px, and keeps both Clear and Apply bottoms at 710.5px.
- Post-fix evidence: the standalone component harness checks six-week month height, and `/tmp/support-history-date-control-open-final.png` shows all actions visible above the viewport edge.

**Findings**

- No actionable P0/P1/P2 differences remain.
- Fonts and typography: the component uses the existing Arial/Helvetica application stack, 14px field/heading text, 16px month headings, and compact 28px day cells; hierarchy and optical weight match neighboring Komodo-style controls.
- Spacing and layout rhythm: the trigger and support-history grid are unchanged. The dialog is anchored below the trigger, does not alter document flow, keeps a 24px two-month gap, and remains fully operable at the 1280 × 720 verification viewport.
- Colors and visual tokens: neutral `#ccc` borders, white surfaces, `#dfeeff` range fill, `#0071d0` endpoints, red existing primary action, and blue focus outline follow the repository's established semantic palette.
- Image quality and assets: calendar and chevron controls use the repository's existing SVG assets. Both browser harnesses report no broken images; no generated, inline, or placeholder icons were introduced.
- Copy and content: `Date range`, `Select a date range`, `Select created date range`, `Clear`, `Cancel`, and `Apply` are explicit and consistent with the approved interaction specification.

**Interaction verification**

- Standalone browser harness: opening, two-month rendering, disabled Apply, same-day range, emitted ISO values, Cancel preservation, Escape dismissal/focus return, outside-click preservation, Clear, route-independent icons, trigger dimensions, and six-week-month containment all pass.
- Support-history browser harness: `18 Oct 2020 – 18 Oct 2020` returns five Created rows; the total changes to `5`; Status `Open` and search `Detector-2B` each compose to one row; Clear restores 20 rendered rows and total `100`.
- Direct routed-page verification: `12 May 2020 – 18 Oct 2020` returns nine rows; Status and live search each compose to one row; clearing restores the placeholder, 20 rows, total `100`, and trigger focus.

**Follow-up polish**

- No P3 items recorded for this component pass.

final result: passed

---

# Support request history fidelity QA — 2026-08-13

**Comparison target**

- Source visual truth: [Figma frame `8272:202190`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8272-202190&t=jIBL8eK3P1BoX9qZ-1) and its repository export at `assets/flows/support-history.png` (`1440 × 1460` pixels).
- Implementation: `http://localhost:4173/?supportHistoryFidelity=2#support-history`, captured in the in-app browser at a `1280 × 720` CSS viewport with device pixel ratio `2`; the browser screenshot API normalized the output to `1280 × 720` pixels.
- State: desktop, collapsed navigation, default unfiltered table. The retained 48px prototype flow toolbar is outside the approved change scope, so comparison crops normalize it out and begin at the application title bar.
- Full-view comparison evidence: `/tmp/support-history-comparison-pass1.png` (`2560 × 608`), with source and implementation titlebar-to-table regions placed side by side at 1:1 density.
- Focused comparison evidence: `/tmp/support-history-comparison-pass2.png` (`2384 × 370`), with the heading, filters, column headers, badges, and first four rows placed side by side at 1:1 density.

**Comparison history**

- [P2 resolved] The implementation content began 2px to the right of the Figma grid because the shared collapsed sidebar uses a 58px main offset. A support-history-only main offset now restores the source’s 56px titlebar start and 88px content gutter without changing the sidebar itself.
- [P2 resolved] The status select used the browser’s Arial default, sort glyphs were too dark, the status pills used a 10px radius, and the search copy omitted “instrument.” The revised controls inherit the application font, use source-matched icon opacity and 12px pill radius, and reproduce the Figma placeholder.
- Post-fix full and focused comparison passes found no actionable P0/P1/P2 differences in the approved regions.

**Required fidelity surfaces**

- Fonts and typography: the title, section heading, labels, inputs, header select, body cells, and badges use the application’s Helvetica Neue/Helvetica/Arial stack. The native status select now inherits that stack at `14px/22px`.
- Spacing and layout rhythm: titlebar is `1384 × 88` from x=`56`; content is `1320px` from x=`88`; filters begin at x=`88`, `762`, and `1037`; table header is `45px`; data rows are `41px`.
- Colors and tokens: existing Komodo-style red, blue, neutral borders, semantic badge colors, and repository surface tokens remain unchanged. Sort indicators now use the source’s subdued opacity while dropdown carets remain fully opaque.
- Image quality and asset fidelity: all branding, navigation, search, calendar, caret, sort, and ticket icons continue to use repository assets; no new or generated imagery was introduced.
- Copy and content: the source placeholder now reads “Search by instrument serial number, nickname, ticket number, or subject.” Existing ticket data and interactions remain intact.

**Interaction verification**

- Search for `SN98361W` returns one visible row and updates the count to `1`.
- Closed-status filtering returns all 11 closed rows; clearing filters restores all 20 rows.
- Ticket sorting remains functional; ascending order begins with ticket `46000283`.
- Browser-rendered image audit reports no broken repository assets. The current in-app browser binding does not expose console-log collection; no visible error state or interaction failure occurred during the checks.

final result: passed

---

# Installation fidelity rebuild QA

**Comparison target**

- Source visual truth: [Figma frame `15019:277354`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=15019-277354&t=jIBL8eK3P1BoX9qZ-1), revisited at Figma’s 100% canvas zoom.
- Implementation: `http://localhost:4173/?installationFidelity=1#request-installation`, inspected at a 1440px browser viewport.

**Findings and resolution**

- [P1 resolved] The earlier form used a uniform 300px width, generic helper copy, and a native single-select for orders. The source has a compact 296px Select order(s) control, 560px Installation topic and Additional details fields, helper copy “Get help from the installation team.”, and an order-list dropdown.
- The native rebuild now applies those exact dimensions, source copy, source placeholder, and a checkbox order menu. It retains the required-field gating for selected orders, topic, and details.

**Validation**

- Computed browser widths: Select order(s) `296px`; Installation topic `560px`; Additional details `560px`.
- The order selector opens with selectable installation orders; one selected order updates its summary label. Continue is disabled before details and enabled after details are provided.
- Browser console logs: `[]`.

final result: passed

---

# Installation form controls follow-up QA

**Finding and resolution**

- [P1 resolved] The Installation form used a 504px shared-form width and the first field label read “Select a service,” neither of which matched the Figma frame. The dedicated form now uses 300px dropdown controls and the source label, “Select service.”

**Validation**

- Browser-rendered computed widths: Select service `300px`; Installation type `300px`.
- Browser console logs: `[]`.

final result: passed

---

# Installation support design QA

**Comparison target**

- Source visual truth: [Figma frame `15019:277354`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=15019-277354&t=jIBL8eK3P1BoX9qZ-1), opened in the in-app browser. The source canvas declares `1440 × 1623`.
- Implementation: `http://localhost:4173/?requestInstallationCompare=1#request-installation`, captured at 1440 × 1000 CSS px and device scale factor 1.
- State: desktop, initial form state with disabled Continue; a second browser pass selected both required values and confirmed the enabled interaction state.

**Comparison history**

- [P1 resolved] The first native pass placed the request-details card too close to the three-step progress indicator and made it shorter than the source frame. The final page applies the source-matched card offset and 510px form-card height; the paired source/implementation capture confirms the corrected relationship.
- Figma and implementation captures were emitted together for full-view comparison. Figma editor/cookie chrome is not part of the product-frame judgement.

**Findings**

- No actionable P0/P1/P2 discrepancies remain.
- Fonts and typography: title, concise wizard labels, card heading, body helper text, labels, count, and compact footer actions follow the source hierarchy.
- Spacing and layout rhythm: the 1440px shell, fixed sidebar/header, three-step line, empty-space balance, form-card offset/height, 504px form controls, and fixed bottom actions align to the reference.
- Colors and tokens: source-style red active state and required indicator, neutral borders, subdued placeholder/count text, and disabled/enabled primary action styles reuse existing repository tokens.
- Image quality and assets: repository branding and interface icons are reused; the source frame contains no new imagery.
- Copy and content: visible Installation support request copy and field labels match the source. Option values are realistic interactive data for the otherwise static Figma select controls.

**Interaction verification**

- The Installation tile’s **Installation support** action routes from `#request-support` to `#request-installation`.
- Continue remains disabled until both required selects have values; it then opens the Confirm contact information confirmation. Additional details enforces its 500-character count.
- Browser console logs: `[]`.

final result: passed

---

# Request calibration service design QA

**Comparison target**

- Source visual truth: [Figma frame `8279:229273`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8279-229273&t=jIBL8eK3P1BoX9qZ-1), opened in the in-app browser. The source canvas declares `1440 × 1623`.
- Implementation: `http://localhost:4173/?requestCalibrationSpacing=2#request-calibration`, captured in the in-app browser at 1440 × 1000 CSS px, device scale factor 1. The selected-instrument capture provides the focused table comparison.
- State: desktop, initial selection state plus one selected instrument state. Figma editor/cookie chrome is excluded from the product-frame judgement.

**Comparison history**

- [P1 resolved] The first Calibration pass used the shared quote-screen gap, which placed the selection card too close to the two-line calibration explanation. The dedicated page now applies the source-matched 94px transition; the revised source/implementation capture aligns the title, wizard, explanatory copy, and selection-card start.
- Source and implementation screenshots were captured together in one browser result for full-view comparison. The focused selected state was inspected for controls, table density, selection colors, pagination, and the persistent action bar.

**Findings**

- No actionable P0/P1/P2 discrepancies remain.
- Fonts and typography: the existing Komodo-style title, wizard labels, body copy, card heading, table, and compact actions preserve the source hierarchy and wrapping.
- Spacing and layout rhythm: fixed shell, title band, four-step sequence, long-form calibration explanation, selection-card offset, flat seven-column table, pagination, and bottom controls align to the `1440 × 1623` source composition.
- Colors and tokens: the repository red active step/action, blue checkbox and serial states, neutral table borders, and semantic coverage chips reproduce the source’s interaction states.
- Image quality and assets: existing branding and interface icon assets are used directly. The source table does not require product thumbnails, so the calibration-specific flat table intentionally contains no substituted imagery.
- Copy and content: all visible Calibration-specific text is reproduced, including the laboratory-equipment restriction and biosafety/water-purification exclusion.

**Interaction verification**

- The Compliance services - Calibration **Request a quote** action on `#request-support` routes to `#request-calibration`.
- Selecting an eligible instrument sets the parent selection checkbox indeterminate, enables Continue, and shows the Add request details confirmation.
- Search, filter buttons, serial controls, pagination, Cancel, and Back use semantic interactive elements; the shared table layout remains responsive below desktop widths.
- Browser console logs: `[]`.

final result: passed

---

# Request qualification service design QA

**Comparison target**

- Source visual truth: [Figma frame `8094:190356`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8094-190356&t=jIBL8eK3P1BoX9qZ-1), captured from the selected-instrument frame at Figma’s 28% canvas view. The source canvas declares `1440 × 1623`.
- Implementation: `http://localhost:4173/?requestQualificationFinalQa=1#request-qualification`, captured in the in-app browser at 1440 × 1000 CSS px and device scale factor 1; full-page capture covers the native 1623px screen.
- State: desktop, first wizard step, unselected instruments. A selected final table row was also captured to evaluate scroll, selection, and the enabled action state.

**Comparison history**

- [P1 resolved] The first native pass ended the instrument table too early and left a large blank area before the fixed action bar. The Qualification route now uses the source canvas height, 267-instrument copy, and a taller scrollable instrument table; the revised focused table capture shows the source-like row density, scrollbar, pagination, selected state, and persistent action bar.
- The paired source/implementation capture was reviewed in the same browser result. Figma editor and cookie chrome are excluded from the comparison because they are not part of the product frame.

**Findings**

- No actionable P0/P1/P2 discrepancies remain.
- Fonts and typography: the existing Komodo-style hierarchy matches the source’s title, wizard labels, explanation, card heading, table text, and compact fixed actions. Source capitalization is reproduced, including “Select instrument” and “Temperature mapping.”
- Spacing and layout rhythm: the 1440px shell, fixed header/sidebar, page band, 1320px content column, four-step line, bordered selection card, dense scrollable table, pagination, and lower action/footer treatment reproduce the source structure.
- Colors and tokens: repository red active-step/primary action, blue action and checkbox states, neutral borders, table fills, and coverage statuses map to the source’s visual states.
- Image quality and assets: existing repository Thermo Fisher branding, interface icons, and instrument thumbnails are used directly; no page image, generated asset, placeholder, or custom SVG substitute was introduced.
- Copy and content: Qualification-specific title, service description, and 267-instrument dataset are distinct from the Service Plan flow while reusing the shared accessible selection component.

**Interaction verification**

- The **Request a quote** button in the Compliance services - Qualification tile routes from `#request-support` to `#request-qualification`.
- Selecting an instrument updates the indeterminate group checkbox, enables Continue, and displays the Add request details confirmation.
- Search, instrument links, filters, paging controls, Cancel, and Back remain semantic keyboard-operable controls; the shared responsive table treatment remains available below desktop widths.
- Browser console logs: `[]`.

final result: passed

---

# Request service plan quote design QA

**Comparison target**

- Source visual truth: [Figma frame `8085:184425`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8085-184425&t=jIBL8eK3P1BoX9qZ-1), captured in the in-app browser from the selected instrument-state canvas.
- Implementation: `http://localhost:4173/?requestServicePlanLink=qa#request-serviceplan`, captured through the in-app browser at 1440 × 1000 CSS px, device scale factor 1.
- State: desktop, first wizard step, unselected instruments. An additional capture used one selected table row to verify the selected state.

**Findings**

- No actionable P0/P1/P2 differences found after the native build. The implementation uses the same fixed Services Central shell, title band, four-step progress indicator, explanatory copy, multi-instrument selection card, dense filters/table, pagination, fixed action bar, and fixed footer seen in the source frame.
- Fonts and typography: the existing application’s Komodo-style heading, progress-label, table, and action typography are retained; source copy is reproduced directly.
- Spacing and layout rhythm: the 1320px content area, 32px page gutter, bordered selection card, search field, selection row, and persistent bottom controls align with the source composition.
- Colors and visual tokens: the existing red active step and primary action, blue links/checkbox state, neutral table borders, and coverage chips are reused consistently.
- Image and copy fidelity: existing repository instrument thumbnails and approved interface icon assets are used; no rasterized page or placeholder art was added.

**Interaction verification**

- The Service plans tile’s **Request a quote** button on `#request-support` opens `#request-serviceplan`.
- Instrument checkboxes update the system/select-all indeterminate state and enable **Continue**; Continue confirms the next request step.
- Search filters visible rows; table filters and instrument serial controls remain keyboard-accessible buttons.
- Browser console logs on the routed page: `[]`.

final result: passed

---

# Request PM scheduling design QA

**Comparison target**

- Source visual truth: [Figma frame `8041:199081`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8041-199081&t=jIBL8eK3P1BoX9qZ-1), captured through the in-app browser at Figma's 100% canvas zoom.
- Implementation: `http://localhost:4173/#request-pm`, captured through the in-app browser at a 1440 × 1000 desktop viewport.
- State: initial unselected instrument-selection state. The source and implementation screenshots were captured together for visual review; Figma's cookie/editor chrome is excluded from the design judgement.

**Findings**

- No actionable P0/P1/P2 mismatches found. The native implementation matches the source composition: fixed Services Central header and sidebar, title band, five-step wizard, light-blue promotion banner, explanatory copy, multi-instrument selection card, pagination, fixed action bar, and footer.
- Fonts and typography: existing application typography and hierarchy were reused; title, wizard labels, banner, card heading, and table text match the source hierarchy.
- Spacing and layout rhythm: the 1320px content column, 184px banner, card treatment, desktop table density, and persistent bottom controls align to the source structure.
- Colors and tokens: existing red active-step/primary-action, blue selection state, pale-blue promotion, neutral borders, and status-chip colors were retained.
- Image and copy fidelity: all visible icons and instrument thumbnails use repository assets; the Figma text is reproduced directly in the page.

**Interaction verification**

- Request Support’s **Request PM scheduling** button opens `#request-pm`.
- Continue is disabled on arrival, enabled after a checkbox selection, and presents the next-step confirmation.
- System and page-level checkboxes reflect partial/all selection; search reduces visible rows.
- Browser console: no errors.

final result: passed

---

# Instrument support selection design QA

**Comparison target**

- Source visual truth: Figma frames `8036:174500` (unselected) and `8036:178325` (selected).
- Implementation: `http://localhost:4173/#instrument-support-selection`.
- Browser state: 1440 × 1000 desktop viewport override.

**Validation**

- Reused the existing Services Central shell, page footer, sidebar, Komodo-style buttons, inputs, table treatment, and available product thumbnail/icon assets.
- Verified the four-step wizard, selection card, search input, outlined table filters, coverage statuses, product thumbnails, pagination, and fixed action bar against the source frame.
- Continue is disabled initially, enabled after a single radio selection, and displays the next-step confirmation. Search narrows the visible instrument rows.
- Browser console: no errors.

final result: passed

---

# Instrument selection shell follow-up QA

**Comparison target**

- Source visual truth: [Figma frame `8036:174500`](https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8036-174500&t=jIBL8eK3P1BoX9qZ-1), captured in the in-app browser at the source's 20% canvas zoom.
- Implementation: `http://localhost:4173/#instrument-support-selection`, captured in the in-app browser at the desktop viewport.
- State: the first instrument row is selected, matching the selection control state used for interaction verification.

**Findings and resolution**

- [P1 resolved] The prototype-only flow toolbar appeared above the Komodo application header, creating an extra 48px band that is absent from the Figma frame. The selection template now begins with the fixed application header; its sidebar begins directly below that header.
- Typography and layout: the title bar, four-step wizard, card, table, fixed action bar, and footer retain their existing source-matched proportions.
- Colors and tokens: the existing Komodo-style red active step and primary action, blue radio state, neutral borders, and status chips were retained.
- Assets and copy: repository icon and instrument assets remain in use; no placeholder or generated imagery was introduced.

**Validation**

- Browser-rendered check: no selection flow toolbar; header computed at `top: 0px`; sidebar computed at `top: 64px`.
- Interaction check: selecting `1009996` enables Continue; browser console reports no errors.

final result: passed

---

# Support History visit tooltip design QA

**Comparison target**

- Source: Figma frame `6036:233277`, `Visit scheduled` tooltip state.
- Implementation: `http://localhost:4173/?supportHistoryVisitTooltip=qa#support-history`.
- Supplied asset: `assets/icons/general/visit scheduled/size=24px, style=mono.svg` at 24 × 24 CSS px.
- Tooltip measurement: 126 × 54 CSS px.

**Findings**

- No actionable P0/P1/P2 discrepancies remain.
- The supplied mono SVG is used without changing shared navigation assets.
- Tooltip placement does not change the 41 px row height or page width.
- The existing quote tooltip remains 110 × 54 with `Quote ready` copy.

**Interaction verification**

- Hover and keyboard focus show `Visit scheduled`.
- Pointer leave, blur, and Escape hide the tooltip.
- Quote and support indicators are the only ticket-tooltip triggers.
- Both dedicated browser regressions report `PASS`.

final result: passed

---

# Support History header Status filter follow-up QA

**Comparison target**

- Dropdown source: Komodo Web Apps Library Storybook `core-components-dropdown--multi-select-open`, captured with two selected options.
- Badge source: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/Screenshot 2026-08-14 at 1.20.38 PM.png`, normalized to CSS-pixel scale for typography, spacing, color, and pill treatment.
- Implementation: `http://localhost:4173/?supportHistoryHeaderStatus=qa#support-history`, captured in both open two-selection and closed applied-filter states.
- Same-state evidence: the open Komodo dropdown and open implementation were emitted together; the normalized badge source and closed implementation were emitted together in the same visual comparison input.

**Findings and resolution**

- [P1 resolved] The Status trigger previously occupied the standalone filter row. The reusable component now supports a separate control mount, and Support History renders the live trigger and listbox inside the Status table header while leaving the applied badge in the existing filter row.
- [P1 resolved] Separating the mounts initially allowed the applied element's top margin to collapse through its host. The final filter row establishes a flow-root boundary, preserving the approved 88px offset from the search-control block to the badge.
- [P2 resolved] The earlier badge was 24px high. The requested final badge is 30px high with a 15px radius and remains a fully rounded pale-blue pill.
- [P2 resolved] The application-shell button rule initially overrode the component link color. The final Clear filters selector resolves to `rgb(0, 113, 208)`, exactly matching Ticket no. links.

**Measurements and interaction verification**

- Header Status trigger: 81 × 30 CSS px inside the existing 113px Status column; menu: 180px wide; option rows remain 40px high.
- Badge: 30px high, 15px radius, 88px below the `.sh-top` bottom edge. Clear filters and Ticket no. both compute to `rgb(0, 113, 208)`.
- Table: 1320px wide; header: 45px; rows: 41px; the component introduces no new horizontal page overflow.
- All, Open, In progress, Closed; persistent checked states; live OR filtering; search/date AND composition; outside click; Escape; Tab; Arrow keys; Enter; Space; badge removal; and Clear filters pass.
- Browser regressions passed for the reusable component, Status integration, date range, quote tooltip, and visit tooltip. Focused Support History shell checks, JavaScript syntax checks, and `git diff --check` passed.

final result: passed

---

# Molly Hartman Contact Detail: coverage table

- Source visual truth: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/Coverage contacts - Contact detail page.png` (1456 × 1202 px).
- Implementation: `http://localhost:4173/?mollyContactQa=1#contact-page`, captured in the in-app browser at 1440 × 1200 CSS px, device scale factor 1. The close dimensions were compared as a desktop content region; no density normalization was needed.
- State: Molly Hartman detail route, “Instruments with no service plan” expanded.
- Full-view and focused comparison: the reference and browser-rendered capture were compared together, covering the titlebar, Molly-specific breadcrumb and description, coverage groups, system row, badges, and serial/nickname cells.

**Findings**

- [P1, fixed] System and lock icons clipped in the narrow table icon column.
  Evidence: the first implementation capture truncated the paired icons; the reference displays both before the Serial number column.
  Fix: widened `.contact-col-kind` and reduced the adjacent serial track to preserve the overall table width.
  Post-fix evidence: the final capture shows the full system and lock icons, the linked “System” serial value, and the Alpine nickname without clipping.
- No remaining actionable P0/P1/P2 differences were found in the requested content region. The existing prototype flow toolbar remains outside the referenced app content and was not changed by this scoped detail-table update.

**Interaction checks**

- The initial no-service-plan group is expanded with six visible rows.
- Its control collapses to zero visible rows and re-expands to six rows; the chevron and `aria-expanded` state change with the control.
- Browser console errors: none.

**Required fidelity surfaces**

- Fonts and typography: existing product font, breadcrumb hierarchy, table headers, and badge weights follow the reference hierarchy.
- Spacing and layout rhythm: the coverage rows, group dividers, icon/serial relationship, and table tracks align with the reference content region.
- Colors and visual tokens: existing Services Central blue links, green warranty badges, and red expiry badges are retained.
- Image quality and asset fidelity: existing system, lock, branch, and instrument assets are reused; no substitute artwork was introduced.
- Copy and content: Molly’s email, description, coverage groups, serials, and nicknames now match the reference.

final result: passed
