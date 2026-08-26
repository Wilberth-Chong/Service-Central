# Fixed Platform Titlebar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the titlebar visible beneath the topbar while scrolling and switch it to the specified 56px compact presentation on the approved platform pages.

**Architecture:** Add a small shared `PlatformTitlebar.wire(root)` behavior that discovers explicitly marked titlebars, listens to their existing `.platform-page-body` scroll container, and toggles one compact-state class through `requestAnimationFrame`. Shared CSS owns the sticky positioning and exact compact dimensions; page-specific CSS only handles titlebars whose current absolute or multi-row layout needs accommodation.

**Tech Stack:** Static HTML, CSS, browser JavaScript, shell regression tests, in-app browser visual verification.

**Spec:** User-approved design in the Codex task on 2026-08-26.

## Global Constraints

- Compact titlebar height is exactly `56px`.
- Compact titlebar padding is exactly `13px 32px`.
- Compact title font size is exactly `20px`.
- The titlebar stays directly beneath the existing topbar while its `.platform-page-body` scrolls.
- Apply to Dashboard, Instruments, all Add instrument states, Support history, Installation, all Edit service plan contact steps, Consumables, Request support, Instrument shell detail, and Installation FAQs.
- Do not change Instrument detail or System detail.
- Preserve existing full-size titlebars at scroll position zero.

---

### Task 1: Shared Titlebar Behavior

**Files:**
- Create: `platform-titlebar.js`
- Modify: `index.html`
- Test: `tests/platform-titlebar.test.sh`

**Interfaces:**
- Consumes: `[data-platform-titlebar]` inside `.platform-page-body`.
- Produces: `window.PlatformTitlebar.wire(root)` and the `.is-platform-titlebar-compact` state on the scroll container.

- [ ] **Step 1: Write the failing structural and route-coverage test**

Assert that the shared script, public API, scroll listener, route mount points, and explicit Instrument/System detail exclusions exist.

- [ ] **Step 2: Run the test to verify it fails**

Run: `bash tests/platform-titlebar.test.sh`

Expected: FAIL because `platform-titlebar.js` and the titlebar mount attributes do not exist.

- [ ] **Step 3: Implement the minimal shared behavior**

Create an idempotent `wire(root)` function, discover each marked titlebar, listen to the nearest page body, and toggle compact state whenever `scrollTop > 0`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `bash tests/platform-titlebar.test.sh`

Expected: PASS.

### Task 2: Compact Styling and Page Compatibility

**Files:**
- Modify: `styles.css`
- Test: `tests/platform-titlebar.test.sh`

**Interfaces:**
- Consumes: `.is-platform-titlebar-compact` and `[data-platform-titlebar]` from Task 1.
- Produces: sticky positioning and the exact compact titlebar dimensions.

- [ ] **Step 1: Extend the failing test with exact CSS assertions**

Assert the compact height, padding, title size, sticky positioning, and z-index contract.

- [ ] **Step 2: Run the test to verify it fails for missing compact CSS**

Run: `bash tests/platform-titlebar.test.sh`

Expected: FAIL on compact style assertions.

- [ ] **Step 3: Add shared compact CSS and narrow page-specific adjustments**

Keep the standard header visible, remove Consumables absolute positioning from the sticky path, retain Installation actions, and compress the Installation FAQ heading without overlapping its controls.

- [ ] **Step 4: Run the full local test suite**

Run: `for test in tests/*.test.sh; do bash "$test"; done`

Expected: all shell tests PASS.

### Task 3: Browser Verification

**Files:**
- No production files.

**Interfaces:**
- Consumes: the completed shared behavior and styles.
- Produces: visual evidence that compact mode activates only after scrolling.

- [ ] **Step 1: Verify representative simple titlebars**

Open Dashboard, Instruments, Support history, Consumables, and Request support. Scroll each page and confirm the titlebar stays below the topbar at 56px without covering content.

- [ ] **Step 2: Verify flow and complex titlebars**

Open Add instruments, Edit service plan contact steps, Installations, Instrument shell detail, and Installation FAQs. Confirm the title and actions fit at desktop and mobile viewport widths.

- [ ] **Step 3: Verify exclusions**

Open Instrument detail and System detail and confirm their existing hero headers are unchanged.
