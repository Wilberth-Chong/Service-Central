# Support History Visit Tooltip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the supplied 24 px mono visit icon to repository assets and show the Figma-defined `Visit scheduled` tooltip for Support History support indicators.

**Architecture:** Extend the existing Support History tooltip renderer from a quote-only branch to a small indicator configuration shared by quote and support rows. Preserve the quote-specific hook for its existing regression, add a support-specific hook, and reuse the existing delegated interaction and clipping behavior.

**Tech Stack:** SVG repository asset, static HTML, CSS, browser JavaScript, repository shell regressions, and in-browser HTML regression harnesses.

## Global Constraints

- Copy the supplied SVG unchanged into `assets/icons/general/visit scheduled/size=24px, style=mono.svg`.
- Preserve the SVG's 24 × 24 view box and `#54545C` mono fill.
- The support tooltip copy is exactly `Visit scheduled`.
- The support tooltip surface is exactly 126 px wide by 54 px high.
- The quote tooltip remains exactly `Quote ready` at 110 px wide by 54 px high.
- Only quote and support indicators receive tooltip triggers.
- Do not overwrite `assets/icons/navigation/support/size=24px, style=mono.svg`.
- Preserve table dimensions, 41 px row heights, filtering, sorting, and ticket navigation.
- Reuse hover, focus, pointer-leave, blur, Escape, focus outline, and clipping behavior.
- Do not change the global `.toast` notification component or add dependencies.
- Preserve every unrelated dirty-worktree change; `app.js`, `styles.css`, `index.html`, and `design-qa.md` already contain user-owned modifications.

---

### Task 1: Add the failing visit-tooltip regression

**Files:**
- Create: `tests/support-history-visit-tooltip.test.html`

**Interfaces:**
- Consumes: the existing `#support-history` route and existing quote-tooltip behavior
- Produces: a browser regression that validates the support asset path, tooltip copy, dimensions, lifecycle, and quote non-regression

- [ ] **Step 1: Create the failing browser regression**

Create `tests/support-history-visit-tooltip.test.html` with this complete harness:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Support History visit tooltip regression</title>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; }
      #result { position: fixed; z-index: 100; top: 8px; right: 8px; padding: 8px 12px; background: #fff; }
      iframe { width: 1280px; height: 720px; border: 0; }
    </style>
  </head>
  <body>
    <strong id="result">RUNNING</strong>
    <iframe id="app-frame" src="../?supportHistoryVisitTooltipHarness=1#support-history" title="Support History fixture"></iframe>
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
          const supportTrigger = doc.querySelector("[data-sh-support-tip]");
          assert(supportTrigger, "support row renders a visit tooltip trigger");
          const supportIcon = supportTrigger.querySelector(".sh-ticket-icon");
          assert(supportIcon.getAttribute("src") === "assets/icons/general/visit scheduled/size=24px, style=mono.svg", "support row uses the supplied repository asset");
          assert(supportIcon.naturalWidth === 24 && supportIcon.naturalHeight === 24, "support asset loads at 24 by 24");

          const supportTooltip = doc.getElementById(supportTrigger.getAttribute("aria-describedby"));
          assert(supportTrigger.getAttribute("aria-label") === "Visit status", "support trigger has the accessible visit label");
          assert(supportTooltip?.getAttribute("role") === "tooltip", "support trigger references a semantic tooltip");
          assert(supportTooltip.textContent.trim() === "Visit scheduled", "support tooltip uses the Figma copy");
          assert(supportTooltip.hidden, "support tooltip starts hidden");

          supportTrigger.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
          await nextFrame();
          assert(!supportTooltip.hidden, "hover opens the support tooltip");
          const supportRect = supportTooltip.getBoundingClientRect();
          assert(supportRect.width === 126 && supportRect.height === 54, "support tooltip matches the 126 by 54 Figma dimensions");
          assert(getComputedStyle(doc.querySelector(".sh-table-wrap")).overflow === "visible", "support tooltip is not clipped by the table wrapper");

          supportTrigger.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: doc.body }));
          await nextFrame();
          assert(supportTooltip.hidden, "pointer leave closes the support tooltip");
          supportTrigger.focus();
          await nextFrame();
          assert(!supportTooltip.hidden, "keyboard focus opens the support tooltip");
          supportTrigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
          await nextFrame();
          assert(supportTooltip.hidden, "Escape closes the support tooltip");
          supportTrigger.blur();
          await nextFrame();
          supportTrigger.focus();
          await nextFrame();
          assert(!supportTooltip.hidden, "keyboard focus reopens the support tooltip");
          supportTrigger.blur();
          await nextFrame();
          assert(supportTooltip.hidden, "blur closes the support tooltip");

          const quoteTrigger = doc.querySelector("[data-sh-quote-tip]");
          const quoteTooltip = doc.getElementById(quoteTrigger.getAttribute("aria-describedby"));
          quoteTrigger.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
          await nextFrame();
          const quoteRect = quoteTooltip.getBoundingClientRect();
          assert(quoteTooltip.textContent.trim() === "Quote ready", "quote tooltip copy is unchanged");
          assert(quoteRect.width === 110 && quoteRect.height === 54, "quote tooltip dimensions are unchanged");
          assert(doc.querySelectorAll("[data-sh-ticket-tip]").length === 2, "only quote and support indicators receive tooltip triggers");

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
http://localhost:4173/tests/support-history-visit-tooltip.test.html
```

Expected before production changes:

```text
FAIL: support row renders a visit tooltip trigger
```

---

### Task 2: Add the supplied asset and generalize indicator tooltips

**Files:**
- Create: `assets/icons/general/visit scheduled/size=24px, style=mono.svg`
- Modify: `app.js` in the Support History indicator configuration, renderer, and delegated handlers
- Modify: `styles.css` after the existing `.sh-ticket-tooltip` dimensions
- Modify: `index.html` cache-version markers for the changed CSS and JavaScript
- Test: `tests/support-history-visit-tooltip.test.html`
- Test: `tests/support-history-quote-tooltip.test.html`

**Interfaces:**
- Consumes: `SUPPORT_HISTORY_TICKETS`, `supportHistoryIndicatorMarkup(ticket)`, and the existing `.sh-ticket-tip` tooltip surface
- Produces: `SUPPORT_HISTORY_INDICATORS`, `[data-sh-ticket-tip]`, `[data-sh-support-tip]`, and `setSupportHistoryTicketTooltip(trigger, visible)`

- [ ] **Step 1: Create the asset directory**

Run:

```bash
mkdir -p "assets/icons/general/visit scheduled"
```

- [ ] **Step 2: Add the supplied SVG unchanged**

Create `assets/icons/general/visit scheduled/size=24px, style=mono.svg` with:

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 12V11H18V12H16V11H14V12H12.2L15.1 8.5C16.4 9.1 18 8.7 19 7.6C20 6.4 20 4.8 19.3 3.6L16.5 6.9L15 5.6L17.8 2.3C16.5 1.7 14.9 2.1 13.9 3.3C12.9 4.5 12.9 6.1 13.7 7.3L10.7 10.9L9.2 9.6L10.5 8L7.5 5.5L7.3 3.4L3.3 2L2 3.5L4.1 7.3L6.2 7.1L9.2 9.6L2.7 17.4C1.7 18.6 1.9 20.4 3.1 21.4C3.5 21.8 4.2 22 4.8 22C4.9 22 5 22 5.1 22C5.9 21.9 6.5 21.6 7 21L12 15V22H22V12H20ZM20 15H14V14H20V15ZM5.5 19.7C5.4 19.9 5.2 20 4.9 20C4.7 20 4.5 20 4.3 19.8C4 19.5 3.9 19 4.2 18.6L9.4 12.3L10.7 13.4L5.5 19.7ZM14 20V17H20V20H14Z" fill="#54545C"/>
</svg>
```

- [ ] **Step 3: Replace the quote-only branch with indicator configuration**

Add this configuration before `supportHistoryIndicatorMarkup()`:

```js
const SUPPORT_HISTORY_INDICATORS = {
  quote: {
    src: "assets/icons/general/quote/size=24px, style=mono.svg",
    label: "Quote status",
    tooltip: "Quote ready",
    modifier: "sh-ticket-tooltip--quote",
    hook: "data-sh-quote-tip",
  },
  support: {
    src: "assets/icons/general/visit scheduled/size=24px, style=mono.svg",
    label: "Visit status",
    tooltip: "Visit scheduled",
    modifier: "sh-ticket-tooltip--visit",
    hook: "data-sh-support-tip",
  },
};
```

Replace `supportHistoryIndicatorMarkup(ticket, rowIcon)` with:

```js
function supportHistoryIndicatorMarkup(ticket) {
  const indicator = SUPPORT_HISTORY_INDICATORS[ticket.icon];
  if (!indicator) return "";
  const tooltipId = `sh-${ticket.icon}-tooltip-${ticket.ticket}`;
  return `<span class="sh-ticket-tip" data-sh-ticket-tip ${indicator.hook} tabindex="0" aria-label="${indicator.label}" aria-describedby="${tooltipId}">
    <img class="sh-ticket-icon" src="${indicator.src}" alt="" />
    <span class="sh-ticket-tooltip ${indicator.modifier}" id="${tooltipId}" role="tooltip" hidden>${indicator.tooltip}</span>
  </span>`;
}
```

Remove the `rowIcon` declaration from `supportHistoryRowMarkup()` and render the first cell with:

```js
<td>${supportHistoryIndicatorMarkup(ticket)}</td>
```

- [ ] **Step 4: Generalize delegated interaction naming and selectors**

Rename `setSupportHistoryQuoteTooltip` to:

```js
function setSupportHistoryTicketTooltip(trigger, visible) {
  const tooltipId = trigger?.getAttribute("aria-describedby");
  const tooltip = tooltipId ? document.getElementById(tooltipId) : null;
  if (!tooltip) return;
  tooltip.hidden = !visible;
  trigger.classList.toggle("is-tooltip-visible", visible);
}
```

In each `mouseover`, `mouseout`, `focusin`, `focusout`, and `keydown` handler, replace `[data-sh-quote-tip]` with `[data-sh-ticket-tip]` and call `setSupportHistoryTicketTooltip`.

- [ ] **Step 5: Add the visit width modifier**

Keep the existing `.sh-ticket-tooltip` declaration at 110 × 54 px and add:

```css
.sh-ticket-tooltip--visit { width: 126px; }
```

- [ ] **Step 6: Update the changed resource version markers**

Use these URLs in `index.html`:

```html
<link rel="stylesheet" href="styles.css?v=20260814-support-history-visit-tooltip" />
<script src="app.js?v=20260814-support-history-visit-tooltip"></script>
```

- [ ] **Step 7: Run both browser regressions**

Reload:

```text
http://localhost:4173/tests/support-history-visit-tooltip.test.html
http://localhost:4173/tests/support-history-quote-tooltip.test.html
```

Expected: both report `PASS`.

- [ ] **Step 8: Run focused shell verification**

Run:

```bash
bash tests/support-history-search.test.sh
bash tests/support-history-fidelity.test.sh
/Users/niranjan.kumarm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js
git diff --check
```

Expected: exit 0 with no output.

---

### Task 3: Complete visual comparison and design QA

**Files:**
- Modify: `design-qa.md`
- Test: `tests/support-history-visit-tooltip.test.html`
- Test: `tests/support-history-quote-tooltip.test.html`

**Interfaces:**
- Consumes: Figma frame `6036:233277`, the supplied SVG, and both indicator tooltip states
- Produces: a Product Design QA record with `final result: passed` only after source and implementation compare successfully

- [ ] **Step 1: Capture matching reference and implementation states**

Use the in-app browser to capture:

```text
Figma: https://www.figma.com/design/jUFmLXXT8tPFy0yq6SUCqJ/CSC-CR4.0--Prototype?m=auto&node-id=6036-233277&t=jIBL8eK3P1BoX9qZ-1
Implementation: http://localhost:4173/?supportHistoryVisitTooltip=qa#support-history
```

Focus or hover the support indicator before the implementation capture. Open the ready Figma reference and implementation together in the same comparison input.

- [ ] **Step 2: Correct actionable discrepancies**

Measure and correct P0/P1/P2 differences in the icon, tooltip width, height, placement, typography, border, radius, elevation, clipping, row height, or page width. Re-run both browser regressions after any production correction.

- [ ] **Step 3: Append the QA record**

After browser measurement confirms the values, append:

```md
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
```

- [ ] **Step 4: Run final verification**

Run the focused shell command from Task 2, reload both browser harnesses, and inspect `git status --short` plus `git diff --stat`.

- [ ] **Step 5: Preserve the dirty-worktree boundary**

Do not stage or commit `app.js`, `styles.css`, `index.html`, `design-qa.md`, the new SVG, or browser harness unless the user separately authorizes a commit that includes the current worktree state.
