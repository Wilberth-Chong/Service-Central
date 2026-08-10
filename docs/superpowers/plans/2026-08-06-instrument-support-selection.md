# Instrument Support Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the Figma Instrument support instrument-selection step and route the existing ticket CTA to it.

**Architecture:** Add a new route and Figma-derived canvas asset, then attach table row selection and continue-state hotspots through the existing route renderer.

**Tech Stack:** Vanilla JavaScript, CSS, static image assets.

## Global Constraints

- Keep the Request support menu route intact.
- Route **Open a support ticket** to `instrument-support-selection`.
- Match Figma node `8036:174500` at 1440×2339.

---

### Task 1: Add and wire the selection flow

**Files:**
- Create: `assets/flows/instrument-support-selection.png`
- Modify: `app.js`
- Test: local Request support route

- [ ] Add the Figma-derived selection canvas and its `instrument-support-selection` route.
- [ ] Change the Request support CTA route to `instrument-support-selection`.
- [ ] Add selection and continuation hotspots.
- [ ] Open Request support, click **Open a support ticket**, and confirm the selection screen renders.
