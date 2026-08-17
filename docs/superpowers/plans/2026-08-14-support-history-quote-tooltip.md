# Support History Quote Tooltip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the Figma-defined `Quote ready` tooltip when the Support History quote indicator is hovered or keyboard-focused.

**Architecture:** Keep the feature local to the native Support History table. Render a focusable tooltip trigger only for quote indicators, use delegated table events to control its visible state across row re-renders, and style the tooltip with page-scoped Komodo-compatible CSS.

**Tech Stack:** Static HTML, CSS, browser JavaScript, repository shell regressions, and an in-browser HTML regression harness.

## Global Constraints

- The tooltip copy is exactly `Quote ready`.
- The tooltip surface is exactly 110 px wide by 54 px high at the canonical desktop viewport.
- Only quote indicators receive the tooltip; support indicators and empty indicator cells remain unchanged.
- Preserve the existing quote icon asset, table dimensions, row height, filtering, sorting, and ticket navigation.
- Show on pointer hover and keyboard focus; hide on pointer leave, blur, and Escape.
- Do not change the global `.toast` notification component.
- Do not introduce dependencies, new routes, custom SVGs, or replacement icon assets.
- Preserve every unrelated dirty-worktree change; `app.js` and `styles.css` already contain user-owned modifications.

---

### Task 1: Add the failing Support History tooltip regression

**Files:**
- Create: `tests/support-history-quote-tooltip.test.html`

**Interfaces:**
- Consumes: the existing `#support-history` route served at `http://localhost:4173/`
- Produces: a browser regression that reports `PASS` only when the quote tooltip structure, dimensions, and hover/focus lifecycle work

- [ ] **Step 1: Create the failing browser regression**

Create `tests/support-history-quote-tooltip.test.html` with this complete harness:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Support History quote tooltip regression</title>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; }
      #result { position: fixed; z-index: 100; top: 8px; right: 8px; padding: 8px 12px; background: #fff; }
      iframe { width: 1280px; height: 720px; border: 0; }
    </style>
  </head>
  <body>
    <strong id="result">RUNNING</strong>
    <iframe id="app-frame" src="../?supportHistoryQuoteTooltipHarness=1#support-history" title="Support History fixture"></iframe>
    <script>
      const result = document.querySelector("#result");
      const frame = document.querySelector("#app-frame");
      const assert = (condition, message) => {
        if (!condition) throw new Error(message);
      };
      const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      frame.addEventListener("load", async () => {
        try {
          const doc = frame.contentDocument;
          const trigger = doc.querySelector("[data-sh-quote-tip]");
          assert(trigger, "quote row renders a tooltip trigger");
          const tooltip = doc.getElementById(trigger.getAttribute("aria-describedby"));
          assert(tooltip?.getAttribute("role") === "tooltip", "trigger references a semantic tooltip");
          assert(tooltip.textContent.trim() === "Quote ready", "tooltip uses the Figma copy");
          assert(doc.querySelectorAll("[data-sh-quote-tip]").length === 1, "only the quote indicator receives a tooltip");
          assert(tooltip.hidden, "tooltip starts hidden");

          trigger.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
          await nextFrame();
          assert(!tooltip.hidden, "hover opens the tooltip");
          const tooltipRect = tooltip.getBoundingClientRect();
          const triggerRect = trigger.getBoundingClientRect();
          assert(tooltipRect.width === 110 && tooltipRect.height === 54, "tooltip matches the 110 by 54 Figma dimensions");
          assert(tooltipRect.bottom <= triggerRect.top, "tooltip is anchored above the quote icon");

          trigger.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: doc.body }));
          await nextFrame();
          assert(tooltip.hidden, "pointer leave closes the tooltip");

          trigger.focus();
          await nextFrame();
          assert(!tooltip.hidden, "keyboard focus opens the tooltip");
          trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
          await nextFrame();
          assert(tooltip.hidden, "Escape closes the tooltip");

          trigger.focus();
          trigger.blur();
          await nextFrame();
          assert(tooltip.hidden, "blur closes the tooltip");

          result.textContent = "PASS";
          result.dataset.status = "passed";
        } catch (error) {
          result.textContent = `FAIL: ${error.message}`;
          result.dataset.status = "failed";
        }
      });
    </script>
  </body>
</html>
```

- [ ] **Step 2: Run the harness and verify the required red state**

Open:

```text
http://localhost:4173/tests/support-history-quote-tooltip.test.html
```

Expected result before production changes:

```text
FAIL: quote row renders a tooltip trigger
```

- [ ] **Step 3: Preserve the red-state evidence**

Record the failing message in the implementation notes. Do not change the assertion to accommodate the current `<img class="sh-ticket-icon">` markup.

---

### Task 2: Render and operate the accessible quote tooltip

**Files:**
- Modify: `app.js` in `supportHistoryRowMarkup()` and `wireSupportHistory()`
- Modify: `styles.css` immediately after the existing `.sh-ticket-icon` rule
- Test: `tests/support-history-quote-tooltip.test.html`

**Interfaces:**
- Consumes: `SUPPORT_HISTORY_TICKETS`, `supportHistoryRowMarkup(ticket)`, and the existing delegated Support History table body
- Produces: `[data-sh-quote-tip]`, a unique `aria-describedby` target with `role="tooltip"`, and the `setSupportHistoryQuoteTooltip(trigger, visible)` state helper

- [ ] **Step 1: Add indicator markup that distinguishes quote rows**

Add this helper immediately before `supportHistoryRowMarkup()`:

```js
function supportHistoryIndicatorMarkup(ticket, rowIcon) {
  if (!rowIcon) return "";
  if (ticket.icon !== "quote") {
    return `<img class="sh-ticket-icon" src="${rowIcon}" alt="" />`;
  }
  const tooltipId = `sh-quote-tooltip-${ticket.ticket}`;
  return `<span class="sh-ticket-tip" data-sh-quote-tip tabindex="0" aria-label="Quote status" aria-describedby="${tooltipId}">
    <img class="sh-ticket-icon" src="${rowIcon}" alt="" />
    <span class="sh-ticket-tooltip" id="${tooltipId}" role="tooltip" hidden>Quote ready</span>
  </span>`;
}
```

Replace the first table-cell interpolation in `supportHistoryRowMarkup()` with:

```js
<td>${supportHistoryIndicatorMarkup(ticket, rowIcon)}</td>
```

- [ ] **Step 2: Add explicit hover/focus state handling**

Add this helper before `wireSupportHistory()`:

```js
function setSupportHistoryQuoteTooltip(trigger, visible) {
  const tooltipId = trigger?.getAttribute("aria-describedby");
  const tooltip = tooltipId ? document.getElementById(tooltipId) : null;
  if (!tooltip) return;
  tooltip.hidden = !visible;
  trigger.classList.toggle("is-tooltip-visible", visible);
}
```

Inside `wireSupportHistory()`, after `renderRows()`, add delegated handlers that survive sorting re-renders:

```js
tbody.addEventListener("mouseover", (event) => {
  const trigger = event.target.closest("[data-sh-quote-tip]");
  if (trigger) setSupportHistoryQuoteTooltip(trigger, true);
});
tbody.addEventListener("mouseout", (event) => {
  const trigger = event.target.closest("[data-sh-quote-tip]");
  if (trigger && !trigger.contains(event.relatedTarget)) setSupportHistoryQuoteTooltip(trigger, false);
});
tbody.addEventListener("focusin", (event) => {
  const trigger = event.target.closest("[data-sh-quote-tip]");
  if (trigger) setSupportHistoryQuoteTooltip(trigger, true);
});
tbody.addEventListener("focusout", (event) => {
  const trigger = event.target.closest("[data-sh-quote-tip]");
  if (trigger) setSupportHistoryQuoteTooltip(trigger, false);
});
tbody.addEventListener("keydown", (event) => {
  const trigger = event.target.closest("[data-sh-quote-tip]");
  if (trigger && event.key === "Escape") {
    event.preventDefault();
    setSupportHistoryQuoteTooltip(trigger, false);
  }
});
```

- [ ] **Step 3: Add Figma-matched, page-scoped styling**

Add these rules after `.sh-ticket-icon`:

```css
.sh-ticket-tip {
  position: relative;
  display: block;
  width: 24px;
  height: 24px;
  outline: 0;
}
.sh-ticket-tip:focus-visible {
  outline: 2px solid #0071d0;
  outline-offset: 2px;
}
.sh-ticket-tooltip {
  position: absolute;
  z-index: 24;
  bottom: calc(100% + 8px);
  left: 50%;
  display: flex;
  width: 110px;
  height: 54px;
  align-items: center;
  justify-content: center;
  border: 1px solid #dedede;
  border-radius: 4px;
  color: #2b2b30;
  background: #fff;
  box-shadow: 0 3px 10px rgb(0 0 0 / 18%);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  pointer-events: none;
  transform: translateX(-50%);
  white-space: nowrap;
}
.sh-ticket-tooltip[hidden] { display: none; }
```

- [ ] **Step 4: Run the browser regression and verify green**

Reload:

```text
http://localhost:4173/tests/support-history-quote-tooltip.test.html
```

Expected:

```text
PASS
```

- [ ] **Step 5: Run the existing focused regressions**

Run:

```bash
bash tests/support-history-search.test.sh
bash tests/support-history-fidelity.test.sh
git diff --check
```

Expected: both shell tests exit 0 and `git diff --check` prints no errors.

- [ ] **Step 6: Review the shared-file diff without committing it**

Run:

```bash
git diff -- app.js styles.css tests/support-history-quote-tooltip.test.html
git status --short
```

Confirm that only the planned tooltip hunks were added to the already-modified shared files. Leave production changes unstaged because the worktree contains unrelated user-owned changes in those files.

---

### Task 3: Complete visual comparison and design QA

**Files:**
- Modify: `design-qa.md`
- Test: `tests/support-history-quote-tooltip.test.html`

**Interfaces:**
- Consumes: Figma frame `6036:233278` and the implemented `Quote ready` hover/focus state
- Produces: a Product Design QA record with `final result: passed` only after the source and implementation compare successfully

- [ ] **Step 1: Capture the reference and implementation in matching states**

Use the in-app browser to capture:

```text
Figma: https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=6036-233278&t=jIBL8eK3P1BoX9qZ-1
Implementation: http://localhost:4173/?supportHistoryQuoteTooltip=qa#support-history
```

Hover the quote indicator in the implementation before capture. Compare both images together at the same browser density.

- [ ] **Step 2: Correct actionable visual discrepancies**

Measure and correct any P0/P1/P2 differences in tooltip width, height, placement, type, border, radius, elevation, clipping, or table-layout movement. Re-run the browser regression after each CSS correction.

- [ ] **Step 3: Append the QA record**

Append this section to `design-qa.md` after confirming the stated measurement directly in the final browser capture:

```md
# Support History quote tooltip design QA

**Comparison target**

- Source: Figma frame `6036:233278`, `Quote ready` tooltip state.
- Implementation: `http://localhost:4173/?supportHistoryQuoteTooltip=qa#support-history`.
- Tooltip measurement: 110 × 54 CSS px.

**Findings**

- No actionable P0/P1/P2 discrepancies remain.
- Tooltip placement does not change the Support History table layout or row height.
- The existing quote icon and Services Central typography are preserved.

**Interaction verification**

- Hover and keyboard focus show `Quote ready`.
- Pointer leave, blur, and Escape hide the tooltip.
- Support indicators and empty indicator cells do not expose the quote tooltip.
- Browser console errors: 0.

final result: passed
```

- [ ] **Step 4: Run final verification**

Run:

```bash
bash tests/support-history-search.test.sh
bash tests/support-history-fidelity.test.sh
git diff --check
```

Reload the browser harness and confirm `PASS`. Inspect the browser console and confirm zero errors.

- [ ] **Step 5: Preserve the reviewed dirty-worktree boundary**

Run:

```bash
git status --short
git diff --stat
```

Do not stage or commit `app.js`, `styles.css`, `design-qa.md`, or the new regression harness unless the user separately authorizes a commit that includes the current worktree state.
