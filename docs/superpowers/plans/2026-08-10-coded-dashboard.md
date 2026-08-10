# Coded Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the screenshot-backed dashboard with an interactive native dashboard.

**Architecture:** Render a dedicated dashboard template from `index.html`, populate it from local data in `app.js`, and style it with responsive CSS that matches the 1440px reference.

**Tech Stack:** HTML, CSS, vanilla JavaScript.

## Global Constraints

- Do not use `dashboard.png` in the dashboard render path.
- Preserve existing route destinations.
- Keep local ticket, instrument, carousel, filter, and pagination behavior accessible.

---

### Task 1: Native dashboard structure and styling

**Files:**
- Modify: `index.html`, `styles.css`, `app.js`

- [ ] Create semantic dashboard sections for chrome, access notice, shortcuts, promotion, tickets, and favorite instruments.
- [ ] Add the local datasets and render/search/filter/tab/pagination handlers.
- [ ] Wire existing route destinations to native dashboard controls.
- [ ] Compare the 1440px local view with the reference and fix layout differences.
