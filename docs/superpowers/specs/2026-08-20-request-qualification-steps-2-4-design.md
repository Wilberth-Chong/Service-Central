# Request Qualification Steps 2–4 Design

## Goal

Extend the Request qualification service flow from instrument selection through request details, contact information, and review and submit while preserving the existing Services Central shell, action bar, and TicketStepViewer behavior.

## Visual sources

- Step 2 initial: https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8094-192034
- Step 2 completed: https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8094-197365
- Step 3 initial: https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8094-197877
- Step 3 completed: https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8094-198667
- Step 4 review: https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=8099-198971
- Shared selected-instruments component: https://www.figma.com/design/DO1Jw806KJ880tf86p25u4/%F0%9F%9B%A0-Services-Central--Components?node-id=9760-70368

The prototype-file frames were captured in the in-app browser. The separate component file was sign-in gated, so its documented interaction is used while its unavailable fine measurements are not inferred beyond existing repository patterns.

## Routes and state

The flow owns one in-memory `qualificationRequestDraft` object. It persists while navigating between these routes in the same session:

1. `request-qualification` — Step 1 selection.
2. `request-qualification-details` — Step 2 request details.
3. `request-qualification-contact` — Step 3 contact information.
4. `request-qualification-review` — Step 4 review and submit.

Draft fields:

- `instruments`: selected table rows, preserving serial number, nickname, type, model, coverage, and image source.
- `additionalDetails`: required Step 2 textarea value.
- `contact`: first name, last name, phone number, email, company, service address, additional address information, country, state/province, city, and ZIP/postal code.

Step 1 Continue is enabled only with one or more selected instruments and then sets `draft.instruments` before entering Step 2. Existing selection/filter behavior remains unchanged.

## Shared frame behavior

- Reuse `TicketStepViewer` with labels: Select instrument(s), Add request details, Confirm contact information, Review and submit.
- Step completion/current states use the existing component’s complete/current/next logic.
- Reuse `mountNativePageChrome` for the header and side navigation.
- Reuse `mountNativeFlowActionBar` for Back, Cancel, and Continue/Submit placement. Back moves one route backward without clearing the draft. Cancel opens the existing confirmation modal and returns to `request-support` only after confirmation.

## Step 2 — Add request details

- Page title: `Request qualification service`.
- Current TicketStepViewer step: 2.
- Content card heading: `Request details`.
- Intro text: `Please provide any additional details you would like to share with us to help us process your request.`
- Required textarea label: `Additional details *`.
- Continue is disabled when the trimmed textarea is empty and uses the existing red primary treatment once valid.
- `Show selected instrument(s)` is a keyboard-accessible disclosure button. It is collapsed on first arrival, uses `aria-expanded`, and reveals/collapses the instruments stored in `draft.instruments`.
- The expanded content uses the existing instrument imagery and table-detail typography; it contains only the selected instruments and has no selection controls.

## Step 3 — Confirm contact information

- Page title: `Request qualification service`.
- Current TicketStepViewer step: 3.
- Content card heading: `Contact information`.
- Intro text: `This contact will be the primary recipient of communications regarding this request.`
- Two-column address/contact grid follows the Figma frame order: first name, service address, last name, additional address information, phone number, email, company, country, state/province, city, and ZIP/postal code.
- First name, last name, phone number, email, service address, country, state/province, city, and ZIP/postal code are required. Company and additional address information are optional.
- Phone input uses `type="tel"` and numeric input mode. Email uses `type="email"`.
- Continue remains disabled until every required field is valid. Entered values are retained when moving back or forward.

## Step 4 — Review and submit

- Page title: `Request qualification service`.
- Current TicketStepViewer step: 4.
- Heading: `Review and submit`.
- Intro text: `Please review the details you have entered and submitted any additional details and files. The information below is complete the process.`
- Request details card displays `Additional details` and its draft value, plus the same collapsed selected-instruments disclosure used in Step 2.
- Contact information card displays the draft’s contact data in the Figma review grid: name, phone number, email, company, service address, country/state/city/ZIP, and optional address line when present.
- The Step 4 primary action is visually enabled whenever the flow reaches Step 4. Submission/success behavior is explicitly out of scope because no submitted-state behavior was requested in this task.

## Accessibility and validation

- Use semantic forms, labels, `required`, and native input types.
- Do not move keyboard focus unexpectedly while enabling actions.
- Disclosures expose `aria-expanded` and retain visible focus styling.
- Action buttons keep native button semantics and accessible names.

## Regression coverage

- Step 1 stores selected instruments and routes to Step 2.
- Step 2 starts disabled, enables from valid details, and expands/collapses selected instruments.
- Step 3 starts disabled, validates required fields, preserves draft values, and routes to Step 4.
- Step 4 renders the values and selected instruments from the draft.
- Back and Cancel preserve/clear navigation as specified.
- Existing Step 1 Qualification filters, selection, pagination, applied-filter visibility, and Open support ticket behavior remain covered.
