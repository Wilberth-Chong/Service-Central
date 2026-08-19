# Shared Page Chrome Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the support-request and ticket-summary flows use the same mounted top bar, sidebar, and footer components as the established application routes.

**Architecture:** Keep each page's content template intact. Add one page-chrome helper in `app.js` that replaces legacy header and footer markup with the existing component mount points, then mounts `TopbarSc`, `PlatformSidebar`, and `Footer` using the route-specific active navigation state.

**Tech Stack:** Vanilla JavaScript, HTML templates, CSS, shell-based regression checks.

**Spec:** User-approved shared-component migration for ticket summaries and request-support flows (2026-08-19).

## Global Constraints

- Preserve each route's existing content, interactions, and route state.
- Use the repository's existing `TopbarSc`, `PlatformSidebar`, and `Footer` components.
- Do not change unrelated routes or push the branch.

---

### Task 1: Mount shared page chrome on legacy native routes

**Files:**
- Modify: `app.js:1075-1094, 1639, 1658, 1806, 1877, 1925, 1973, 1989, 2025, 2066`
- Modify: `index.html:1405`
- Create: `tests/shared-page-chrome.test.sh`

**Interfaces:**
- Consumes: `mountTopbarSc()`, `mountPlatformSidebar(activeRoute)`, and `mountFooter()`.
- Produces: `mountNativePageChrome(activeRoute)`, which replaces legacy `.mi-header`/`.mi-footer` nodes with their established component mount points and mounts all three shared components.

- [x] **Step 1: Write the failing test**

Create a shell test that requires `mountNativePageChrome`, requires one support-history summary call, requires eight request-support flow calls, and verifies the app cache URL is updated.

- [x] **Step 2: Run test to verify it fails**

Run: `bash tests/shared-page-chrome.test.sh`

Expected: FAIL because the helper and route calls do not exist yet.

- [x] **Step 3: Write minimal implementation**

Add `mountNativePageChrome(activeRoute)`. Replace the direct sidebar mount in the ticket summary renderer with `mountNativePageChrome("support-history")`. Replace the direct sidebar mounts in request support, open-ticket steps, PM, service-plan, qualification, calibration, and installation renderers with `mountNativePageChrome("request-support")`. Bump the `app.js` cache key in `index.html`.

- [x] **Step 4: Run regression verification**

Run: `bash tests/shared-page-chrome.test.sh && for test_file in tests/*.test.sh; do bash "$test_file"; done && git diff --check`

Expected: all checks pass with no whitespace errors.

- [x] **Step 5: Commit**

```bash
git add app.js index.html tests/shared-page-chrome.test.sh docs/superpowers/plans/2026-08-19-shared-page-chrome.md
git commit -m "fix: use shared chrome on support request flows"
```
