# Support History Header Status Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the reusable Status multiselect trigger into the Support History table header while preserving the applied badge position and updating the badge and Clear filters styling.

**Architecture:** Extend `MultiSelectFilter` with an optional `controlHost` so its dropdown control can render separately from the applied-filter UI without duplicating selection state. Support History supplies a table-header mount for the control and retains the existing filter-row host for the badge. Component defaults remain backward compatible.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, semantic native checkboxes, existing Komodo tokens/assets, in-app browser regression harnesses.

## Global Constraints

- Status options remain exactly `All`, `Open`, `In progress`, `Closed`.
- Badge remains between the search controls and table at its current vertical position.
- Badge height is exactly `30px`; pill radius is exactly `15px`.
- Clear filters uses `#0071d0`, matching Ticket no. links.
- Preserve the 1320px table, 45px header, 41px rows, filtering semantics, accessibility, and all unrelated dirty-worktree changes.
- No new dependency, route, ticket data, or unrelated refactor.
- Do not stage or commit production changes without separate authorization.

## File Map

- Modify `tests/multi-select-filter.test.html`: cover split control/badge hosts and cross-host outside-click behavior.
- Modify `tests/support-history-status-multiselect.test.html`: cover header placement and requested computed styles.
- Modify `multi-select-filter.js`: add optional `controlHost` rendering and a two-root interaction boundary.
- Modify `multi-select-filter.css`: support split mounts and the 30px badge/link treatment.
- Modify `index.html`: add the Status header mount and update cache markers.
- Modify `app.js`: pass the header mount into `MultiSelectFilter`.
- Modify `styles.css`: size the header-mounted trigger/menu and preserve badge placement without changing table dimensions.
- Modify `tests/support-history-fidelity.test.sh`: update structural assertions for the header mount.
- Modify `design-qa.md`: append the final follow-up comparison and validation result.

---

### Task 1: Add reusable split-host support

**Files:**
- Modify: `tests/multi-select-filter.test.html`
- Modify: `multi-select-filter.js`
- Modify: `multi-select-filter.css`

**Interfaces:**
- Consumes: `new MultiSelectFilter(host, { label, allLabel, options, controlHost? })`
- Produces: a dropdown in `controlHost` when provided; badge and change events remain owned by `host`

- [ ] **Step 1: Write the failing split-host regression**

Add a dedicated control mount before constructing the second fixture and assert observable behavior:

```js
const splitHost = document.createElement("div");
const splitControlHost = document.createElement("div");
document.body.append(splitControlHost, splitHost);
const split = new window.MultiSelectFilter(splitHost, {
  label: "Region",
  allLabel: "Everywhere",
  options: ["North", "South"],
  controlHost: splitControlHost,
});
assert(splitControlHost.querySelector("[data-msf-trigger]"), "split host renders trigger in control mount");
assert(!splitHost.querySelector("[data-msf-trigger]"), "split host keeps trigger out of badge mount");
splitControlHost.querySelector("[data-msf-trigger]").click();
splitControlHost.querySelector('[data-msf-option][data-value="South"]').click();
await nextFrame();
assert(splitHost.querySelector("[data-msf-badge-text]").textContent.trim() === "Region: South", "split host badge follows header selection");
assert(!splitControlHost.querySelector("[data-msf-menu]").hidden, "option interaction inside control mount does not dismiss menu early");
```

Name the mutation caught: removing `controlHost` support or checking only the badge host in the outside-click handler makes these assertions fail.

- [ ] **Step 2: Run the isolated harness and verify RED**

Open `http://localhost:4173/tests/multi-select-filter.test.html?headerStatusRed=1`.

Expected: `FAIL: split host renders trigger in control mount`.

- [ ] **Step 3: Implement minimal split-host rendering**

Change the constructor signature and boundary:

```js
constructor(host, { label, allLabel = "All", options, controlHost = host }) {
  if (!(host instanceof HTMLElement) || !(controlHost instanceof HTMLElement)) {
    throw new TypeError("MultiSelectFilter requires host elements");
  }
  this.host = host;
  this.controlHost = controlHost;
  this.onDocumentPointerDown = (event) => {
    if (!this.host.contains(event.target) && !this.controlHost.contains(event.target)) this.close();
  };
}
```

Render control and applied UI separately:

```js
this.host.classList.add("msf", "msf--applied-host");
this.controlHost.classList.add("msf", "msf--control-host");
this.controlHost.innerHTML = controlMarkup;
this.host.innerHTML = appliedMarkup;
```

Query the trigger, menu, and option rows from `this.controlHost`; keep badge/remove/clear queries on `this.host`.

- [ ] **Step 4: Preserve default single-host behavior**

When `controlHost === host`, render both markup blocks into the same host in their existing order. Verify the original Status fixture and alternate Region fixture still work without passing `controlHost`.

- [ ] **Step 5: Run GREEN and syntax checks**

Reload the isolated harness and expect `PASS`, then run:

```bash
/Users/niranjan.kumarm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check multi-select-filter.js
git diff --check
```

Expected: browser `PASS`; commands exit 0 with no output.

---

### Task 2: Mount Status in the table header and apply requested styling

**Files:**
- Modify: `tests/support-history-status-multiselect.test.html`
- Modify: `tests/support-history-fidelity.test.sh`
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`
- Modify: `multi-select-filter.css`
- Modify: `design-qa.md`

**Interfaces:**
- Consumes: `controlHost` support from Task 1
- Produces: header-mounted Status trigger/menu and unchanged filter-row badge behavior

- [ ] **Step 1: Write failing integration assertions**

Replace the obsolete plain-header expectation with:

```js
const triggerHost = doc.querySelector("[data-sh-status-filter-trigger]");
assert(triggerHost.closest("th") === doc.querySelector(".sh-table thead th:nth-child(2)"), "Status trigger renders in table header");
assert(host.closest(".sh-filter-row"), "applied badge remains in filter row");
assert(triggerHost.querySelector("[data-msf-trigger]"), "header mount owns the Status trigger");
```

After selecting Open and In progress, assert:

```js
const badge = host.querySelector(".msf__badge");
const clear = host.querySelector(".msf__clear");
assert(badge.getBoundingClientRect().height === 30, "badge is 30px high");
assert(getComputedStyle(badge).borderRadius === "15px", "badge has fully rounded radius");
assert(getComputedStyle(clear).color === "rgb(0, 113, 208)", "Clear filters matches Ticket no. blue");
```

Name the mutations caught: rendering the trigger in the filter row, retaining 24px/12px badge geometry, or inheriting `#0781d5` makes the test fail.

- [ ] **Step 2: Run the route harness and verify RED**

Open `http://localhost:4173/tests/support-history-status-multiselect.test.html?headerStatusRed=1`.

Expected: `FAIL: Status trigger renders in table header`.

- [ ] **Step 3: Add the header mount and wire it**

Use this table-header structure:

```html
<th><div data-sh-status-filter-trigger></div></th>
```

Initialize with:

```js
const statusFilterTriggerRoot = app.querySelector("[data-sh-status-filter-trigger]");
const statusFilter = new window.MultiSelectFilter(statusFilterRoot, {
  label: "Status",
  allLabel: "All",
  options: ["Open", "In progress", "Closed"],
  controlHost: statusFilterTriggerRoot,
});
```

- [ ] **Step 4: Apply header and badge CSS**

Keep reusable badge rules exact:

```css
.msf__badge { height: 30px; border-radius: 15px; }
.msf__clear { color: #0071d0; }
```

Add Support History-scoped rules so the header control matches the existing compact header dropdown, the listbox can overflow visibly, and the filter row reserves the former control height so the badge's vertical position does not move:

```css
.sh-table th:nth-child(2) { overflow: visible; }
.sh-table [data-sh-status-filter-trigger] .msf__control,
.sh-table [data-sh-status-filter-trigger] .msf__trigger { width: 100%; }
.sh-table [data-sh-status-filter-trigger] .msf__trigger { height: 30px; padding: 0 12px; }
.sh-table [data-sh-status-filter-trigger] .msf__menu { width: 180px; }
.sh-filter-row { min-height: 40px; }
.sh-filter-row .msf__applied { margin-top: 56px; }
```

Adjust only if browser measurement proves a more precise page-scoped value is required to preserve the approved badge position and 45px header height.

- [ ] **Step 5: Update fidelity and cache markers**

Update resource query strings in `index.html`. Change the fidelity shell test from the plain Status header assertion to the real rendered header-mount structure and retain its page-width/header/row invariants.

- [ ] **Step 6: Run GREEN regression matrix**

Run in the in-app browser:

- `tests/multi-select-filter.test.html`
- `tests/support-history-status-multiselect.test.html`
- `tests/support-history-date-range.test.html`
- `tests/support-history-quote-tooltip.test.html`
- `tests/support-history-visit-tooltip.test.html`

Expected: every harness reports `PASS`.

Run:

```bash
bash tests/support-history-search.test.sh
bash tests/support-history-fidelity.test.sh
/Users/niranjan.kumarm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check multi-select-filter.js
/Users/niranjan.kumarm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js
git diff --check
```

Expected: exit 0 with no output.

- [ ] **Step 7: Perform final visual and interaction QA**

Capture the open dropdown and selected badge at `http://localhost:4173/?supportHistoryHeaderStatus=final#support-history`. Verify together with the existing Komodo and badge references:

- trigger is visually inside Status header;
- badge top position is unchanged from the approved prior capture;
- badge is 30px high with a 15px radius;
- Clear filters matches Ticket no. blue;
- header remains 45px; rows remain 41px; page remains 1320px without horizontal overflow;
- click, outside-click, Escape, Tab, Arrow keys, Enter, Space, badge removal, and Clear filters work.

Append a follow-up record to `design-qa.md` with source/implementation capture details, measurements, resolved P0/P1/P2 findings, interaction results, and `final result: passed`.

- [ ] **Step 8: Preserve the verified preview**

Keep the selected-badge state open at `http://localhost:4173/?supportHistoryHeaderStatus=final#support-history` and mark only that in-app browser tab deliverable. Do not perform further browser calls afterward.
