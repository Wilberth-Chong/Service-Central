# Support History Date Range Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable accessible dual-month `DateRangePicker` component and use its applied value to filter support-history tickets inclusively by Created date.

**Architecture:** `date-range-picker.js` owns rendering, pending/applied state, keyboard and pointer dismissal, and emits `date-range-change` with ISO `{ start, end }` values. `date-range-picker.css` owns all reusable picker visuals. The support-history page provides only a mount element and translates the emitted range into its existing shared row-filtering path.

**Tech Stack:** Vanilla HTML, CSS, browser JavaScript, repository SVG icons, a browser-executed component regression harness, Bash support-history checks, and in-app browser visual verification.

## Global Constraints

- Filter only each ticket's **Created date**, inclusively.
- Keep the existing 243 × 40 trigger and Figma-aligned support-history filter layout unchanged.
- Date, live-search, and status filters must compose.
- Use repository icon assets and existing Komodo-style typography, colors, borders, buttons, and focus treatments.
- `Apply` requires two selected endpoints; `Clear` removes the value; `Cancel`, outside-click, and `Escape` preserve the applied range.
- Do not stage or commit overlapping user-owned changes in `app.js`, `index.html`, or `styles.css`.

---

### Task 1: Standalone component behavior

**Files:**
- Create: `tests/date-range-picker.test.html`
- Create: `date-range-picker.js`

**Interfaces:**
- Produces: `window.DateRangePicker` constructed with `(root: HTMLElement, options?: { initialMonth?: Date })`.
- Produces: `date-range-change` on `root`, with `event.detail` equal to `{ start: "YYYY-MM-DD", end: "YYYY-MM-DD" }`; clearing emits empty strings.
- Produces: the trigger and dialog selectors used by the page and browser tests.

- [ ] **Step 1: Write a browser regression harness before production code**

Create a test page that loads `date-range-picker.css` and `date-range-picker.js`, mounts the component with October 2020 as its deterministic initial month, and asserts real DOM behavior:

```html
<div id="fixture" class="date-range-picker"></div>
<output id="result">RUNNING</output>
<script src="../date-range-picker.js"></script>
<script>
  const root = document.querySelector("#fixture");
  const changes = [];
  root.addEventListener("date-range-change", (event) => changes.push(event.detail));
  new DateRangePicker(root, { initialMonth: new Date(2020, 9, 1) });

  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const trigger = root.querySelector("[data-date-range-trigger]");
  trigger.click();
  assert(trigger.getAttribute("aria-expanded") === "true", "trigger opens the dialog");
  assert(root.querySelectorAll("[data-date-range-month]").length === 2, "renders two months");
  assert(root.querySelector("[data-date-range-apply]").disabled, "apply starts disabled");

  root.querySelector('[data-date-value="2020-10-18"]').click();
  root.querySelector('[data-date-value="2020-10-18"]').click();
  assert(!root.querySelector("[data-date-range-apply]").disabled, "complete range enables apply");
  root.querySelector("[data-date-range-apply]").click();
  assert(JSON.stringify(changes[0]) === JSON.stringify({ start: "2020-10-18", end: "2020-10-18" }), "emits applied ISO range");
  assert(root.querySelector("[data-date-range-label]").textContent === "18 Oct 2020 – 18 Oct 2020", "formats applied label");

  trigger.click();
  root.querySelector('[data-date-value="2020-10-20"]').click();
  root.querySelector("[data-date-range-cancel]").click();
  assert(root.querySelector("[data-date-range-label]").textContent === "18 Oct 2020 – 18 Oct 2020", "cancel preserves applied value");

  trigger.click();
  root.querySelector("[data-date-range-clear]").click();
  assert(JSON.stringify(changes[1]) === JSON.stringify({ start: "", end: "" }), "clear emits empty range");
  assert(root.querySelector("[data-date-range-label]").textContent === "Select a date range", "clear restores placeholder");

  document.body.dataset.testStatus = "passed";
  document.querySelector("#result").textContent = "PASS";
</script>
```

- [ ] **Step 2: Open the harness and verify RED**

Open `http://localhost:4173/tests/date-range-picker.test.html`.

Expected: the page does not reach `data-test-status="passed"` because `DateRangePicker` does not exist.

- [ ] **Step 3: Implement the minimal standalone component**

Create `date-range-picker.js` as an IIFE that assigns one class to `window.DateRangePicker`. The class must:

- render the existing calendar icon and chevron SVG assets;
- render a labelled trigger and `role="dialog"` popover;
- generate two adjacent months from `initialMonth` or the current local month;
- use ISO date keys so lexical comparisons implement the inclusive range;
- separate `pendingStart`/`pendingEnd` from `appliedStart`/`appliedEnd`;
- enable Apply only when both endpoints exist;
- reset pending state from applied state each time it opens;
- dispatch `date-range-change` on Apply and Clear;
- attach outside-click and Escape listeners only while open, then remove them on close;
- return focus to the trigger for Apply, Clear, Cancel, and Escape.

Use these public data hooks exactly: `data-date-range-trigger`, `data-date-range-label`, `data-date-range-dialog`, `data-date-range-months`, `data-date-range-month`, `data-date-range-prev`, `data-date-range-next`, `data-date-value`, `data-date-range-clear`, `data-date-range-cancel`, and `data-date-range-apply`.

- [ ] **Step 4: Verify GREEN in the real browser harness**

Reload `http://localhost:4173/tests/date-range-picker.test.html`.

Expected: `[data-test-status]` equals `passed`, output reads `PASS`, two months render, and no image is broken.

- [ ] **Step 5: Mutation-check component behavior**

Temporarily reason through these mutations and confirm an existing assertion would fail for each: no open state update, one month only, Apply never disabled, wrong ISO endpoint, Cancel overwrites applied value, Clear keeps the label. Add one literal assertion to the harness for any uncovered mutation before continuing.

---

### Task 2: Reusable component visual layer

**Files:**
- Create: `date-range-picker.css`
- Modify: `tests/date-range-picker.test.html`

**Interfaces:**
- Consumes: the component DOM/data hooks from Task 1.
- Produces: the 243 × 40 trigger, anchored dual-month dialog, inclusive range highlight, endpoint styling, actions, responsive containment, and visible focus.

- [ ] **Step 1: Add browser-computed-style assertions before component CSS**

Extend the harness with literals derived from the approved design:

```js
const triggerStyle = getComputedStyle(trigger);
assert(trigger.getBoundingClientRect().width === 243, "trigger width is 243px");
assert(trigger.getBoundingClientRect().height === 40, "trigger height is 40px");
assert(triggerStyle.backgroundColor === "rgb(255, 255, 255)", "trigger uses white background");
```

- [ ] **Step 2: Verify RED**

Reload the harness.

Expected: it does not reach `passed` because the unstyled trigger is not 243 × 40.

- [ ] **Step 3: Implement reusable component CSS**

Create `date-range-picker.css` with `.date-range-picker`-scoped rules only. Use:

- root `position: relative; display: grid; grid-template-rows: 22px 40px; gap: 5px`;
- trigger `width: 243px; height: 40px; border: 1px solid #ccc; padding: 0 16px`;
- dialog `position: absolute; top: 72px; right: 0; z-index: 40; width: 584px; border: 1px solid #ccc; background: #fff; box-shadow: 0 4px 12px rgb(0 0 0 / 18%)`;
- two equal calendar columns, seven 32px day columns, 32px day buttons;
- range fill `#dfeeff`, endpoint circle `#0071d0` with white text;
- action footer with existing `.mi-button` classes;
- `:focus-visible` outline `2px solid #006db6`;
- at `max-width: 900px`, constrain the dialog to `calc(100vw - 48px)` and show one month.

- [ ] **Step 4: Verify GREEN and open-state visuals**

Reload the harness and open the picker.

Expected: test status is `passed`; the trigger is 243 × 40; the dialog is anchored without affecting document flow; endpoint and range states are visible.

---

### Task 3: Support-history Created-date integration

**Files:**
- Create: `tests/support-history-date-range-filter.test.sh`
- Modify: `index.html`
- Modify: `app.js`

**Interfaces:**
- Consumes: `window.DateRangePicker` and its `date-range-change` event.
- Produces: ISO `data-created` keys on rows and a composed Created-date predicate in `filterRows()`.

- [ ] **Step 1: Add the failing integration contract**

Create a focused shell check for the stable integration boundary:

```bash
#!/usr/bin/env bash
set -euo pipefail
rg -Fq 'href="date-range-picker.css' index.html
rg -Fq 'data-sh-date-picker' index.html
rg -Fq 'src="date-range-picker.js' index.html
rg -Fq 'new window.DateRangePicker' app.js
rg -Fq 'addEventListener("date-range-change"' app.js
rg -Fq 'data-created="${supportHistoryDateKey(ticket.created)}"' app.js
rg -Fq 'supportHistoryDateInRange(row.dataset.created, appliedStart, appliedEnd)' app.js
```

- [ ] **Step 2: Run and verify RED**

Run: `bash tests/support-history-date-range-filter.test.sh`

Expected: exit `1` because the component is not loaded or mounted by support history.

- [ ] **Step 3: Load and mount the component**

In `index.html`, add `date-range-picker.css`, replace the old `.sh-date` control with `<div class="sh-date date-range-picker" data-sh-date-picker></div>`, load `date-range-picker.js` before `app.js`, and bump `app.js` to `v=20260814-support-history-date-range`.

- [ ] **Step 4: Add Created-date helpers and row indexing**

In `app.js`, add a strict parser for `DD Mon YYYY`, convert valid values to `YYYY-MM-DD`, add `data-created` to each row, and implement:

```js
function supportHistoryDateInRange(value, start, end) {
  if (!start || !end) return true;
  return Boolean(value && value >= start && value <= end);
}
```

- [ ] **Step 5: Consume the component event in the shared filter path**

Inside `wireSupportHistory()`:

```js
const datePickerRoot = app.querySelector("[data-sh-date-picker]");
new window.DateRangePicker(datePickerRoot);
let appliedStart = "";
let appliedEnd = "";

datePickerRoot.addEventListener("date-range-change", (event) => {
  appliedStart = event.detail.start;
  appliedEnd = event.detail.end;
  filterRows();
});
```

Update each row's predicate so text, status, and date must all match, and include the applied range in the result-count condition. Remove the old `Date range selector opened` toast listener.

- [ ] **Step 6: Verify GREEN without regressing search/fidelity**

Run:

```bash
bash tests/support-history-date-range-filter.test.sh
bash tests/support-history-search.test.sh
bash tests/support-history-fidelity.test.sh
git diff --check
```

Expected: every command exits `0`.

---

### Task 4: Interaction and screenshot verification

**Files:**
- Modify only for in-scope defects: `date-range-picker.js`, `date-range-picker.css`, `tests/date-range-picker.test.html`, `index.html`, `app.js`.

- [ ] **Step 1: Verify support-history behavior in the in-app browser**

Open `http://localhost:4173/?supportHistoryDateRange=1#support-history` and verify:

- click anywhere on the trigger opens the component;
- selecting `18 Oct 2020` twice and applying leaves five visible rows and count `5`;
- `12 May 2020 – 18 Oct 2020` leaves nine visible rows;
- Status `Open` composes to one row;
- search `Detector-2B` composes to one row;
- Clear restores 20 rendered rows and count `100`;
- Cancel, outside-click, and Escape do not change the applied value;
- Escape returns focus to the trigger.

- [ ] **Step 2: Compare screenshots and refine**

Capture closed and open component states. Compare the closed trigger against the supplied Figma support-history frame, then inspect open-state anchoring, month density, labels, range styling, buttons, focus, borders, and shadow. Fix P0/P1/P2 mismatches, recapture, and update `design-qa.md` with `final result: passed` only after the comparison passes.

- [ ] **Step 3: Run the complete verification sweep**

Run every `tests/*.test.sh`, the browser component harness, and `git diff --check`. Report the known unrelated `fixed-page-footers.test.sh` failure separately if it remains; do not modify unrelated footer code.

- [ ] **Step 4: Preserve the dirty worktree boundary**

Review `git status --short` and `git diff --stat`. Do not stage or commit overlapping application files without explicit authorization.
