# Request Qualification Steps 2–4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend Request qualification service from instrument selection through request details, contact information, and a data-backed review-and-submit screen.

**Architecture:** Add three route-specific templates and render/wire functions alongside the existing native request flows. A single in-memory `qualificationRequestDraft` retains Step 1 selection, Step 2 details, and Step 3 contact data; all later screens render exclusively from it. The existing shell, `TicketStepViewer`, platform action bar, and native styling primitives remain the shared UI foundation.

**Tech Stack:** Static HTML templates, vanilla JavaScript, CSS, browser-native form validation, existing Services Central components.

**Spec:** `docs/superpowers/specs/2026-08-20-request-qualification-steps-2-4-design.md`

## Global Constraints

- Reuse the existing `TicketStepViewer`, `mountNativePageChrome`, and `mountNativeFlowActionBar` components.
- Do not modify or regress Open support ticket routes or existing Step 1 Qualification filters, selection, pagination, and applied-filter behavior.
- Keep the qualification draft in memory only; do not add dependencies or persistence.
- Use semantic labels, required attributes, keyboard-operable disclosures, and native button semantics.
- Use `apply_patch` for source edits and do not commit or push without explicit user authorization.

---

### Task 1: Qualification flow data contract and routing

**Files:**
- Modify: `app.js: qualification route state, wireRequestQualification(), render()`
- Test: `tests/request-qualification-steps.test.sh`

**Interfaces:**
- Produces: `qualificationRequestDraft` with `{ instruments, additionalDetails, contact }` and `captureQualificationSelectedInstruments()`.
- Produces routes `request-qualification-details`, `request-qualification-contact`, and `request-qualification-review` for Tasks 2–4.

- [ ] **Step 1: Write the failing test**

```sh
#!/usr/bin/env bash
set -euo pipefail
rg -q 'qualificationRequestDraft' app.js
rg -q 'request-qualification-details' app.js
rg -q 'request-qualification-contact' app.js
rg -q 'request-qualification-review' app.js
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bash tests/request-qualification-steps.test.sh`

Expected: failure because the additional routes and draft contract are absent.

- [ ] **Step 3: Write minimal implementation**

```js
const qualificationRequestDraft = {
  instruments: [],
  additionalDetails: "",
  contact: {},
};

function captureQualificationSelectedInstruments(rows) {
  return rows.filter((row) => row.querySelector("[data-sp-instrument]")?.checked).map((row) => ({
    serial: row.cells[3]?.textContent.trim() || "—",
    nickname: row.cells[4]?.textContent.trim() || "—",
    type: row.dataset.type || "—",
    model: row.dataset.model || "—",
    coverage: row.dataset.coverage || "—",
    imageSrc: row.cells[1]?.querySelector("img")?.src || row.cells[2]?.querySelector("img")?.src || "",
  }));
}
```

Make Step 1 Continue capture selected rows and call `setRoute("request-qualification-details")`. Add the three routes to the central renderer.

- [ ] **Step 4: Run test to verify it passes**

Run: `bash tests/request-qualification-steps.test.sh`

Expected: PASS.

### Task 2: Step 2 request-details template and behavior

**Files:**
- Modify: `index.html: add request-qualification-details template`
- Modify: `app.js: add renderRequestQualificationDetails() and wireRequestQualificationDetails()`
- Modify: `styles.css: add scoped .screen--request-qualification-details styles`
- Test: `tests/request-qualification-steps.test.sh`

**Interfaces:**
- Consumes: `qualificationRequestDraft.instruments` and `qualificationRequestDraft.additionalDetails` from Task 1.
- Produces: an accessible `data-qualification-selected-toggle` disclosure and stores `additionalDetails` before routing to Step 3.

- [ ] **Step 1: Extend the failing test**

```sh
rg -q 'request-qualification-details-template' index.html
rg -q 'data-qualification-details' index.html
rg -q 'data-qualification-selected-toggle' index.html
rg -q 'renderRequestQualificationDetails' app.js
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bash tests/request-qualification-steps.test.sh`

Expected: failure because the Step 2 template and renderer are absent.

- [ ] **Step 3: Write minimal implementation**

Add a native-shell template whose content card has `Request details`, the specified explanatory copy, a required textarea labelled `Additional details *`, and an initially collapsed `Show selected instrument(s)` button. In the wire function:

```js
const update = () => {
  qualificationRequestDraft.additionalDetails = textarea.value;
  primary.disabled = !textarea.value.trim();
};
toggle.addEventListener("click", () => {
  const expanded = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(expanded));
  panel.hidden = !expanded;
});
primary.addEventListener("click", () => setRoute("request-qualification-contact"));
```

Populate the disclosure panel from `qualificationRequestDraft.instruments`; do not render selection inputs. Mount native chrome, StepViewer 2, and action bar with `backRoute: "request-qualification"`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bash tests/request-qualification-steps.test.sh`

Expected: PASS.

### Task 3: Step 3 contact template and validation

**Files:**
- Modify: `index.html: add request-qualification-contact template`
- Modify: `app.js: add renderRequestQualificationContact() and wireRequestQualificationContact()`
- Modify: `styles.css: add shared Qualification details/contact/review layout rules`
- Test: `tests/request-qualification-steps.test.sh`

**Interfaces:**
- Consumes: `qualificationRequestDraft.contact` from Task 1 and Step 2 route from Task 2.
- Produces: validated `qualificationRequestDraft.contact` and navigation to `request-qualification-review`.

- [ ] **Step 1: Extend the failing test**

```sh
rg -q 'request-qualification-contact-template' index.html
rg -q 'data-qualification-contact-field="phone"' index.html
rg -q 'data-qualification-contact-field="email"' index.html
rg -q 'renderRequestQualificationContact' app.js
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bash tests/request-qualification-steps.test.sh`

Expected: failure because the Step 3 template and renderer are absent.

- [ ] **Step 3: Write minimal implementation**

Create a two-column form with fields exactly named `firstName`, `lastName`, `phone`, `email`, `company`, `serviceAddress`, `additionalAddress`, `country`, `state`, `city`, and `postalCode`. Mark all except company and additionalAddress required. Set phone to `type="tel" inputmode="numeric" pattern="[0-9]*"` and email to `type="email"`.

```js
const isValid = (field) => field.validity.valid && field.value.trim() !== "";
const update = () => {
  fields.forEach((field) => { qualificationRequestDraft.contact[field.dataset.qualificationContactField] = field.value; });
  primary.disabled = !requiredFields.every(isValid);
};
```

On phone input, strip non-digits. Restore draft values on render. Mount StepViewer 3, native chrome, action bar with `backRoute: "request-qualification-details"`, and route primary to review.

- [ ] **Step 4: Run test to verify it passes**

Run: `bash tests/request-qualification-steps.test.sh`

Expected: PASS.

### Task 4: Step 4 review template and dynamic rendering

**Files:**
- Modify: `index.html: add request-qualification-review template`
- Modify: `app.js: add renderRequestQualificationReview()` and review disclosure wiring`
- Modify: `styles.css: add scoped review-card and instrument summary styling`
- Test: `tests/request-qualification-steps.test.sh`

**Interfaces:**
- Consumes: `qualificationRequestDraft.instruments`, `additionalDetails`, and `contact` from Tasks 1–3.
- Produces: a Step 4 dynamic review page with an enabled `Submit request` action.

- [ ] **Step 1: Extend the failing test**

```sh
rg -q 'request-qualification-review-template' index.html
rg -q 'data-qualification-review-details' index.html
rg -q 'data-qualification-review-contact' index.html
rg -q 'renderRequestQualificationReview' app.js
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bash tests/request-qualification-steps.test.sh`

Expected: failure because the Step 4 template and renderer are absent.

- [ ] **Step 3: Write minimal implementation**

Render a `Review and submit` introduction, a Request details card containing `Additional details` and the same accessible selected-instruments disclosure, and a Contact information card containing Name, phone number, email, company, service address, country, state/province, city, postal code, and optional additional address when supplied.

```js
reviewDetails.textContent = qualificationRequestDraft.additionalDetails || "—";
reviewName.textContent = `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "—";
```

Mount StepViewer 4 and `mountNativeFlowActionBar({ backRoute: "request-qualification-contact", primaryDisabled: false })`; change the primary text to `Submit request`. Reuse details-page disclosure behavior for selected instruments.

- [ ] **Step 4: Run test to verify it passes**

Run: `bash tests/request-qualification-steps.test.sh`

Expected: PASS.

### Task 5: Regression verification and visual pass

**Files:**
- Modify: `index.html: update cache-buster query strings only if styles or app code changed`
- Test: `tests/request-qualification-steps.test.sh`, `tests/request-qualification-table.test.sh`, `tests/applied-filters-request-tables.test.sh`, `tests/request-qualification-flow.test.sh`

**Interfaces:**
- Consumes: all previous tasks.
- Produces: verified Step 1–4 qualification flow without regressions to protected request pages.

- [ ] **Step 1: Run static and regression checks**

Run:

```sh
/Users/niranjan.kumarm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js
bash tests/request-qualification-steps.test.sh
bash tests/request-qualification-table.test.sh
bash tests/applied-filters-request-tables.test.sh
bash tests/request-qualification-flow.test.sh
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 2: Run the local app and inspect the flow**

Use the existing local server and in-app browser to exercise one selected instrument through Step 2, Step 3, and Step 4. Confirm disabled/enabled Continue states, retained values after Back, selected-instrument disclosure behavior, action-bar Cancel confirmation, and no console errors.

- [ ] **Step 3: Compare against captured references**

At the canonical desktop viewport, compare Step 2, Step 3, and Step 4 screenshots with the captured Figma frames. Correct visible spacing, field-grid, card, typography, and disclosure discrepancies using page-scoped CSS only, then repeat Step 1.
