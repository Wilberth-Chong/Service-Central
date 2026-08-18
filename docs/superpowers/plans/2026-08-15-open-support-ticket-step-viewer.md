# Open Support Ticket Step Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Open Support Ticket progress indicator match the Komodo step-viewer treatment shown in Figma frame `11554:235317`.

**Architecture:** Keep the existing semantic four-item ordered list in the page template. Restrict implementation to step-viewer CSS and a small browser regression assertion; do not change routing, table behavior, filters, pagination, or action buttons.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript browser test harness.

## Global Constraints

- Preserve the exact four existing progress labels and order.
- Keep the first step active and all remaining steps inactive.
- Reuse existing Services Central color tokens and page gutters.
- Do not stage or commit: the working tree contains unrelated user changes.

---

### Task 1: Establish the step-viewer regression contract

**Files:**
- Create: `tests/open-support-ticket-step-viewer.test.html`
- Modify: none

**Interfaces:**
- Consumes: `#open-support-ticket-template` and `.iss-steps` from `index.html`.
- Produces: a browser-runnable PASS/FAIL check that confirms four steps, one active step, and the required labels.

- [x] **Step 1: Write the failing test**

Create a test page that fetches `index.html`, creates the `#open-support-ticket-template` content, and asserts:

```js
const labels = [...root.querySelectorAll('.iss-steps li')]
  .map((step) => step.textContent.trim().replace(/\s+/g, ' '));
assert(labels.length === 4, 'renders four steps');
assert(root.querySelectorAll('.iss-steps .is-current').length === 1, 'renders one active step');
assert(labels.join('|') === '1 Select instrument|2 Add request details|3 Confirm contact information|4 Review and submit', 'keeps the Figma step labels');
```

- [x] **Step 2: Run the browser test and verify it fails before the selector contract exists**

Run the page against the local server and capture the first failure. If the current markup already satisfies the structure contract, record it as an expected structural pass and continue to the visual state assertion in Step 3.

- [x] **Step 3: Add the visual state assertion**

Extend the test to verify the active circle has a red computed background, inactive circles have a white computed background, and the list is not rendered as an unconnected stack:

```js
const activeCircle = root.querySelector('.iss-steps .is-current > span');
const inactiveCircle = root.querySelector('.iss-steps li:not(.is-current) > span');
assert(getComputedStyle(activeCircle).backgroundColor !== getComputedStyle(inactiveCircle).backgroundColor, 'active and inactive circles are visually distinct');
assert(getComputedStyle(root.querySelector('.iss-steps')).display !== 'block', 'uses a horizontal step-viewer layout');
```

### Task 2: Implement Komodo-style step-viewer styling

**Files:**
- Modify: `styles.css:646-653`
- Test: `tests/open-support-ticket-step-viewer.test.html`

**Interfaces:**
- Consumes: `.iss-steps`, `.iss-steps li`, `.iss-steps .is-current`, and their existing inner spans/strong element.
- Produces: a four-step horizontal progress control with active, inactive, and connector states.

- [x] **Step 1: Run the test before styling changes**

Run the browser test. Expected: the visual-state assertion demonstrates the pre-change mismatch or records current state as the baseline for visual review.

- [x] **Step 2: Replace only the `.iss-steps` styling block**

Use one centered horizontal grid with a 36px circle and connector pseudo-elements. Preserve desktop 32px gutters and let the existing media rule set the narrower gutters:

```css
.iss-steps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.iss-steps li { position: relative; display: grid; justify-items: center; }
.iss-steps li:not(:last-child)::after { /* neutral connector */ }
.iss-steps li.is-current::after { /* red completed connector */ }
.iss-steps li > span:first-child { width: 36px; height: 36px; border-radius: 50%; }
.iss-steps li.is-current > span:first-child { background: var(--mi-red); color: #fff; }
```

- [x] **Step 3: Keep label semantics and emphasis exact**

Ensure current label is bold, future labels are regular, and labels sit directly beneath their circles with an 8px gap. Do not alter the HTML labels or replace controls with images.

- [x] **Step 4: Run the regression test and inspect the route**

Open `http://localhost:4173/#open-support-ticket`, inspect all four steps at the Figma desktop viewport, and verify no JavaScript console errors.

- [x] **Step 5: Run final text and whitespace validation**

Run:

```bash
git diff --check
```

Expected: exit code `0` with no output.
