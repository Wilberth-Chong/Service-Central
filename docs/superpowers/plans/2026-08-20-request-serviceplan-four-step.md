# Request Service Plan Four-step Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Service Plan selection-only screen with a complete, dynamic four-step request flow and submitted summary.

**Architecture:** Keep an independent `servicePlanRequestDraft` and Service Plan route set. Reuse the existing shared step viewer, selected-instrument disclosure, contact controls, page chrome, and action bar used by Calibration and Qualification; introduce only Service Plan-specific templates, renderers, wiring, and coverage-needs presentation.

**Tech Stack:** Vanilla JavaScript, HTML templates, CSS, existing Komodo-style components, shell regression tests.

**Spec:** `docs/superpowers/specs/2026-08-20-request-serviceplan-four-step-design.md`

## Global Constraints

- Preserve the Calibration and Qualification routes, drafts, templates, and behavior.
- Preserve the Service Plan 240-instrument wording and existing table data in Step 1.
- Use `TicketStepViewer`, `KomodoSingleSelect`, `mountNativePageChrome`, `mountNativeFlowActionBar`, and `renderSelectedInstrumentTable` rather than duplicating their behavior.
- Use supplied Service Plan Step 1, Step 3, and Step 4 references plus the captured Figma Step 2 card as visual sources of truth.
- Keep all controls keyboard-accessible and retain existing cancel-confirmation behavior.
- Add no dependency or design system.

---

### Task 1: Service Plan request state and Step 1 navigation

**Files:**
- Modify: `app.js: draft declarations, route metadata, wireRequestServicePlan(), renderRequestServicePlan(), render() route dispatch`
- Modify: `index.html: request-serviceplan-native-template`
- Modify: `styles.css: Service Plan Step 1 scoped table and selection styles`
- Create: `tests/request-serviceplan-steps.test.sh`

**Interfaces:**
- Produces `servicePlanRequestDraft = { instruments: [], additionalDetails: "", coverageNeeds: { downtime: "", priorities: [] }, contact: {} }`.
- Produces Step 1 route `request-serviceplan` that writes selected row data into `servicePlanRequestDraft.instruments` then calls `setRoute("request-serviceplan-details")`.
- Consumes existing `renderSelectedInstrumentTable(instruments)` by retaining selected objects with `serial`, `nickname`, `image`, `model`, and `type` keys.

- [ ] **Step 1: Write the failing static regression test**

```bash
rg -Fq 'const servicePlanRequestDraft' app.js
rg -Fq 'coverageNeeds: { downtime: "", priorities: [] }' app.js
rg -Fq 'setRoute("request-serviceplan-details")' app.js
rg -Fq '"request-serviceplan-details"' app.js
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bash tests/request-serviceplan-steps.test.sh`

Expected: failure because the four-step Service Plan routes and independent draft do not exist.

- [ ] **Step 3: Implement selection handoff and route registration**

```js
const servicePlanRequestDraft = {
  instruments: [],
  additionalDetails: "",
  coverageNeeds: { downtime: "", priorities: [] },
  contact: {},
};

continueButton.addEventListener("click", () => {
  servicePlanRequestDraft.instruments = instruments
    .filter((input) => input.checked)
    .map((input) => readServicePlanInstrument(input));
  setRoute("request-serviceplan-details");
});
```

Retain the screenshot’s header checkbox, indeterminate state, system-only selection, searchable table, filters, paginated controls, and enabled Continue appearance. Use the existing Service Plan dataset and capture selected data in the same object shape used by `renderSelectedInstrumentTable`.

- [ ] **Step 4: Run the Step 1 regression test**

Run: `bash tests/request-serviceplan-steps.test.sh`

Expected: Step 1 assertions pass; later-flow assertions still fail until Tasks 2–3 are complete.

- [ ] **Step 5: Commit the Step 1 implementation**

```bash
git add app.js index.html styles.css tests/request-serviceplan-steps.test.sh
git commit -m "feat: add service plan step one handoff"
```

### Task 2: Service Plan details and contact steps

**Files:**
- Modify: `index.html: add request-serviceplan-details-template and request-serviceplan-contact-template`
- Modify: `app.js: renderRequestServicePlanDetails(), wireServicePlanDetails(), renderRequestServicePlanContact(), wireServicePlanContact()`
- Modify: `styles.css: .service-plan-coverage-needs and scoped service-plan flow styles`
- Modify: `tests/request-serviceplan-steps.test.sh`

**Interfaces:**
- Consumes `servicePlanRequestDraft.instruments` from Task 1.
- Produces `servicePlanRequestDraft.additionalDetails`, `coverageNeeds.downtime`, `coverageNeeds.priorities`, and validated `contact`.
- Produces routes `request-serviceplan-details` and `request-serviceplan-contact`.

- [ ] **Step 1: Extend the failing test for the Step 2 and Step 3 interfaces**

```bash
rg -Fq 'function renderRequestServicePlanDetails()' app.js
rg -Fq 'function wireServicePlanDetails()' app.js
rg -Fq 'Service coverage needs' app.js
rg -Fq 'data-serviceplan-downtime' app.js
rg -Fq 'data-serviceplan-priority' app.js
rg -Fq 'function renderRequestServicePlanContact()' app.js
rg -Fq 'new KomodoSingleSelect(country)' app.js
rg -Fq 'setRoute("request-serviceplan-review")' app.js
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bash tests/request-serviceplan-steps.test.sh`

Expected: failure because details/contact renderers and controls are not implemented.

- [ ] **Step 3: Implement Step 2 Service coverage needs**

```js
const updateDetails = () => {
  servicePlanRequestDraft.additionalDetails = details.value;
  servicePlanRequestDraft.coverageNeeds.downtime = downtimeChoices.find((input) => input.checked)?.value || "";
  servicePlanRequestDraft.coverageNeeds.priorities = priorityChoices
    .filter((input) => input.checked)
    .map((input) => input.value);
  primary.disabled = !servicePlanRequestDraft.additionalDetails.trim()
    || !servicePlanRequestDraft.coverageNeeds.downtime;
};
```

Build the captured Figma card below Request details with radio downtime choices `Minor`, `Moderate`, and `Severe`, plus checkbox priorities `Software / firmware updates`, `Preventive Maintenance`, `Same day, remote technical support`, `Calibration services`, `Corrective Maintenance / Repair`, and `Factory training onsite`. Render the selected-instruments disclosure using the shared renderer.

- [ ] **Step 4: Implement Step 3 contact form**

```js
const required = fields.filter((field) => field.required);
const valid = required.every((field) => field.value.trim() && field.checkValidity());
primary.disabled = !valid;
primary.addEventListener("click", () => setRoute("request-serviceplan-review"));
```

Mount the existing contact template with the Service Plan title; prefill Molly Hartman, phone `123-456-7890`, email, Thermo Fisher, `123 Blueberry Lane`, USA, California, Carlsbad, and 93047. Reuse the supported-country and state/province lists plus the existing dynamic Europe `Not applicable` state behavior.

- [ ] **Step 5: Run the test to verify Steps 2–3 pass**

Run: `bash tests/request-serviceplan-steps.test.sh`

Expected: details and contact route assertions pass; review and summary assertions remain failing until Task 3.

- [ ] **Step 6: Commit the Step 2–3 implementation**

```bash
git add app.js index.html styles.css tests/request-serviceplan-steps.test.sh
git commit -m "feat: add service plan details and contact steps"
```

### Task 3: Review, summary, and visual verification

**Files:**
- Modify: `index.html: add request-serviceplan-review-template and serviceplan-summary-template`
- Modify: `app.js: renderRequestServicePlanReview(), renderServicePlanSummary(), fillServicePlanReview()`
- Modify: `styles.css: service plan review and submitted summary card styles`
- Modify: `tests/request-serviceplan-steps.test.sh`
- Modify: `design-qa.md`

**Interfaces:**
- Consumes the full `servicePlanRequestDraft` created by Tasks 1–2.
- Produces `request-serviceplan-review` and `serviceplan-summary` routes.
- Produces a Close action that invokes `setRoute("request-support")`.

- [ ] **Step 1: Extend the failing regression test for review, submit, and summary**

```bash
rg -Fq 'function renderRequestServicePlanReview()' app.js
rg -Fq 'function renderServicePlanSummary()' app.js
rg -Fq 'data-serviceplan-review-downtime' app.js
rg -Fq 'data-serviceplan-review-priorities' app.js
rg -Fq 'setRoute("serviceplan-summary")' app.js
rg -Fq 'data-serviceplan-summary-details' index.html
rg -Fq 'data-serviceplan-summary-name' index.html
rg -Fq 'setRoute("request-support")' app.js
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bash tests/request-serviceplan-steps.test.sh`

Expected: failure because review and summary routes are absent.

- [ ] **Step 3: Implement dynamic review and submitted summary**

```js
function fillServicePlanReview(scope, prefix) {
  const { contact, coverageNeeds } = servicePlanRequestDraft;
  scope.querySelector(`[data-${prefix}-details]`).textContent = servicePlanRequestDraft.additionalDetails || "—";
  scope.querySelector(`[data-${prefix}-downtime]`).textContent = coverageNeeds.downtime || "—";
  scope.querySelector(`[data-${prefix}-priorities]`).textContent = coverageNeeds.priorities.join(", ") || "—";
  scope.querySelector(`[data-${prefix}-name]`).textContent = `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "—";
}
```

Match the supplied Step 4 ordering: Request details with disclosure, Service coverage needs, then Contact information. Submit routes to `serviceplan-summary`; summary includes the green submitted notice, dynamic details, expandable selected-instruments table, and a secondary Close action.

- [ ] **Step 4: Run full static and formatting verification**

Run:

```bash
bash tests/request-serviceplan-steps.test.sh
bash tests/request-calibration-steps.test.sh
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 5: Run the browser flow and design comparison**

At the desktop reference viewport: select instruments; complete valid details, coverage needs, and contact; inspect the review; submit; expand selected instruments on the summary; close to Request support. Capture the local screens and compare them beside the supplied references. Record any resolved P0–P2 mismatches and `final result: passed` in `design-qa.md`.

- [ ] **Step 6: Commit the review and summary implementation**

```bash
git add app.js index.html styles.css tests/request-serviceplan-steps.test.sh design-qa.md
git commit -m "feat: complete service plan request flow"
```
