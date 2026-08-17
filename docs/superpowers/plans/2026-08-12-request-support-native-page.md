# Request Support Native Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the image-backed Request Support flow with a working native page faithful to Figma node `8026:173099`.

**Architecture:** Add a dedicated native request-support template in `index.html`, select it in `app.js`, and use focused `rs-*` styles while retaining the shared Services Central shell. Existing routes drive the primary actions; quote actions use the existing toast.

**Tech Stack:** Static HTML templates, CSS, vanilla JavaScript, repository Komodo SVG assets, browser verification.

## Global Constraints

- Use Figma node `8026:173099` as the 1440px desktop source.
- Reuse `mi-*`, `platform-sidebar`, `mi-button`, and `assets/icons` conventions.
- Do not render `assets/flows/request-support.png` for `#request-support`.
- Preserve existing route destinations and the fixed-header/sidebar changes currently unstaged.

---

### Task 1: Define and prove the native route contract

**Files:**
- Create: `tests/request-support-native-page.test.sh`
- Modify: `index.html`, `app.js`

**Interfaces:**
- Produces: `#request-support-native-template`, `renderRequestSupport()`, and `wireRequestSupport()`.

- [x] **Step 1: Write the failing test**

Create `tests/request-support-native-page.test.sh` with this exact content:

```bash
#!/usr/bin/env bash
set -euo pipefail
rg -q 'id="request-support-native-template"' index.html
rg -q 'route === "request-support"' app.js
rg -q 'renderRequestSupport\(\)' app.js
rg -q 'data-route="instrument-support-selection"' index.html
```

- [x] **Step 2: Run the test before the implementation**

Run `bash tests/request-support-native-page.test.sh`. Expect exit status `1` because the native template and renderer are not present.

- [x] **Step 3: Add native markup**

Create `#request-support-native-template` with the existing flow toolbar, `mi-shell`, `mi-header`, platform-sidebar mount, `mi-main`, and footer. Its title must read `Request support` and its content must include these six request rows:

```text
Instrument support
Preventive maintenance
Service plans
Compliance services - Qualification
Compliance services - Calibration
Installation
```

Use `data-route="instrument-support-selection"`, `data-route="pm-cycle"`, and `data-route="installation-order"` for the three routed actions. Use `data-rs-quote` for the quote buttons.

- [x] **Step 4: Add routing and behavior**

Define:

```js
function renderRequestSupport() {
  const template = document.querySelector("#request-support-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  document.title = "Request support — Services Central";
  wireRequestSupport();
}

function wireRequestSupport() {
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  app.querySelectorAll("[data-rs-quote]").forEach((button) => {
    button.addEventListener("click", () => showToast(`${button.dataset.rsQuote} quote request started`));
  });
  mountPlatformSidebar();
  wireRouteControls();
}
```

Add `else if (route === "request-support") renderRequestSupport();` before the generic flow fallback.

- [x] **Step 5: Verify green**

Run `bash tests/request-support-native-page.test.sh`. Expect exit status `0`.

### Task 2: Match the Figma layout with existing Komodo assets

**Files:**
- Modify: `styles.css`

**Interfaces:**
- Consumes: the `rs-*` markup from Task 1 and current `mi-*` reusable styles.
- Produces: desktop and responsive Request Support layout styles.

- [x] **Step 1: Implement the desktop two-column frame**

Add `rs-*` styles with a 1440px shell, 88px title bar, and two-column content: request list on the left and a 360px promotion rail on the right. Use thin `var(--mi-line)` borders, white surfaces, and existing 14px body / 18px section-heading hierarchy. Each request row is a semantic grid with copy on the left and an `mi-button` action at the right.

- [x] **Step 2: Add the reference promotion rail**

Add one preventive-maintenance promotion and two compact informational cards. Use only existing icon assets and visible Figma copy. Do not create CSS-drawn icons or add a new asset library.

- [x] **Step 3: Add responsive behavior**

Below 980px, stack the rail after the request list, retain 16px horizontal content margins, and maintain buttons without overflow.

- [x] **Step 4: Run regression checks**

Run `bash tests/request-support-native-page.test.sh` and `git diff --check`. Expect both exit statuses to be `0`.

### Task 3: Browser QA and delivery documentation

**Files:**
- Modify: `design-qa.md`

**Interfaces:**
- Consumes: Figma node `8026:173099`, local `#request-support`, and primary request routes.
- Produces: current visual and interaction QA evidence.

- [x] **Step 1: Capture canonical desktop state**

At a 1440px browser viewport, capture `#request-support` and compare its platform shell, title, row density, CTA alignment, and right-hand rail with Figma node `8026:173099`.

- [x] **Step 2: Test primary interactions**

Verify: Open a support ticket → `#instrument-support-selection`; Request PM scheduling → `#pm-cycle`; Installation support → `#installation-order`; Request a quote → visible toast.

- [x] **Step 3: Test narrow viewport and console**

Below 980px, verify the rail stacks after the rows without clipping. Check browser console for errors.

- [x] **Step 4: Update QA report**

Record source, local capture, viewport, tested interactions, focused visual findings, and `final result: passed` only if no P0/P1/P2 issues remain.

- [x] **Step 5: Run final commands**

Run `bash tests/request-support-native-page.test.sh` and `git diff --check`, both with expected exit status `0`.
