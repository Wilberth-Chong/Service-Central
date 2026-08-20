# Request Service Plan four-step flow

## Goal

Replace the current one-screen Service Plan request with a working four-step request flow and submitted summary. Match the supplied Service Plan references while preserving the existing Calibration and Qualification flows.

## Flow

1. **Select instrument** (`#request-serviceplan`)
   - Retain the Service Plan instrument dataset and its 240-instrument selection language.
   - Support individual, system, and select-all checkbox states, search, filters, pagination, and an enabled Continue action only when an instrument is selected.
2. **Add request details** (`#request-serviceplan-details`)
   - Capture required additional details.
   - Show an expandable selected-instruments table.
   - Capture required Service coverage needs: downtime severity (Minor, Moderate, Severe) and zero-or-more requested priorities: software/firmware updates, preventative maintenance, same-day remote technical support, calibration services, corrective maintenance/repair, and factory training onsite.
3. **Confirm contact information** (`#request-serviceplan-contact`)
   - Use the calibrated contact layout and prefilled values.
   - Use the existing single-select Country and State/Province component and supported geography lists.
   - Validate all required values before enabling Continue.
4. **Review and submit** (`#request-serviceplan-review`)
   - Show the collected request details, selected instruments disclosure, Service coverage needs, and a combined service address.
   - Submit only after reaching this review page.
5. **Submitted summary** (`#serviceplan-summary`)
   - Display a submitted banner, dynamic request/coverage/contact data, an expandable selected-instruments table, and a Close action.

## Architecture

- Add a Service Plan draft object, separate from `calibrationRequestDraft` and `qualificationRequestDraft`.
- Reuse the shared ticket step viewer, selected-instrument disclosure renderer, Komodo single-select component, page chrome, footer, sidebar, and platform action bar.
- Add Service Plan-specific templates, renderers, and event wiring. Do not convert the existing Calibration or Qualification implementations into a generic factory.
- The selected instrument rows and contact fields must populate review and summary from the Service Plan draft rather than fixed display text.

## Visual treatment

- Use the supplied Service Plan Step 1, 3, and 4 screenshots as the source of truth.
- Use the captured Step 2 Figma frame for the Service coverage needs card.
- Keep the established 1440px shell, Komodo controls, 36px step circles, 18px numerals, 16px labels, fixed action bar, page chrome, and 14px detail/table typography.
- Step 2 uses the Service Plan card composition: request details first, Service coverage needs below, then the selected-instrument disclosure within request details.

## Interaction and error handling

- Back returns to the immediately previous Service Plan step.
- Cancel uses the existing cancel-confirmation modal and returns to Request support only after confirmation.
- Country changes refresh available State/Province choices; European countries use Not applicable.
- Required fields keep Continue disabled until valid.
- Close returns to Request support.

## Validation

- Add a Service Plan flow regression test covering selection, required Step 2 service coverage data, contact validation, review, submit, summary data, and close navigation.
- Run static checks, `git diff --check`, and browser verification at the canonical desktop viewport.
- Compare rendered Step 1–4 and submitted summary states with their supplied references; document findings in `design-qa.md`.
