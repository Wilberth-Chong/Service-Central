# Open Support Ticket Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the four-step support-ticket flow with reusable step rendering, dynamic state, validation, and Figma-aligned details/contact/review pages.

**Architecture:** A small `TicketStepViewer` module renders the four shared steps. `app.js` owns a single in-memory ticket draft and mounts route-specific templates; it passes the draft through each form and action bar. Existing `PlatformActionBar` keeps Back, Cancel confirmation, and primary-button behavior consistent.

**Tech Stack:** Static HTML templates, vanilla JavaScript, CSS, existing Komodo-style assets and components.

**Spec:** `docs/superpowers/specs/2026-08-19-open-support-ticket-completion-design.md`

## Global Constraints

- Reuse existing native page chrome, PlatformActionBar, icons, and tooltip treatment.
- Do not add dependencies or backend calls.
- Preserve the existing steps 1–2 routes and all current selection behavior.

---

### Task 1: Ticket flow state and reusable viewer

**Files:**
- Create: `ticket-step-viewer.js`
- Modify: `index.html`, `app.js`
- Test: `tests/open-support-ticket-flow.test.html`

- [ ] Write a failing browser regression asserting four labels, one current step, and completed-state rendering on steps 2–4.
- [ ] Implement `window.TicketStepViewer.mount(target, { currentStep })` and load it before `app.js`.
- [ ] Add `openSupportTicketDraft` with `instrument`, `request`, `files`, and `contact`; update step 1 selection to populate `instrument`.
- [ ] Run the regression and confirm it passes.

### Task 2: Step 2 upload and instrument-information fidelity

**Files:**
- Modify: `index.html`, `app.js`, `styles.css`
- Test: `tests/open-support-ticket-details.test.html`

- [ ] Add failing assertions for blue info icon, uploaded cards before requirements, and retained request fields.
- [ ] Implement the Figma-aligned file card and instrument-information grid; make upload state update `openSupportTicketDraft.request` and `files`.
- [ ] Make Continue route to `open-support-ticket-contact` only after required request fields are present.
- [ ] Run the detail regression and confirm it passes.

### Task 3: Contact-information step

**Files:**
- Modify: `index.html`, `app.js`, `styles.css`
- Test: `tests/open-support-ticket-flow.test.html`

- [ ] Add a failing assertion for the contact route, four required contact fields, disabled first-load Continue, and enabled filled state.
- [ ] Implement the contact template, validation, draft updates, action-bar Back to step 2, and Continue to review.
- [ ] Run the flow regression and confirm it passes.

### Task 4: Dynamic review/submission step

**Files:**
- Modify: `index.html`, `app.js`, `styles.css`
- Test: `tests/open-support-ticket-flow.test.html`

- [ ] Add a failing assertion that review displays selected instrument, request subject, and contact name from the draft.
- [ ] Implement the review template with complete step-viewer state, Back to contact, Submit request, and existing toast confirmation.
- [ ] Run the flow and existing route tests and confirm they pass.

### Task 5: Visual and regression validation

**Files:**
- Modify: `design-qa.md`
- Test: existing native-flow and support-ticket tests

- [ ] Compare steps 2–4 against the supplied Figma frames at desktop width and document remaining differences.
- [ ] Verify selection → details → contact → review, Back, and Cancel confirmation in the local browser.
- [ ] Run all affected tests and `git diff --check`.
