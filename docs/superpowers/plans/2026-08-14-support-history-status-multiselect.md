# Support History Status Multiselect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable Komodo-style status multiselect between the Support History search controls and table, with live OR filtering, persistent selected states, and a removable applied-filter badge matching the supplied image.

**Architecture:** Create a standalone `window.MultiSelectFilter` component with no Support History dependencies, its own stylesheet, a small public API, and a bubbling change event. Support History instantiates the component and composes its selected values with the existing search and created-date filters. Dedicated component and route-level browser regressions drive the implementation before image-to-code comparison and design QA.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, native checkbox controls, existing Komodo tokens/assets, in-app browser regressions.

## Global Constraints

- Visual target: `/Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/Screenshot 2026-08-14 at 1.20.38 PM.png`.
- Komodo measurements: 40 px control and menu-item height, 1 px stroke, 16 px horizontal content spacing, 14 px/22 px content text, 8 px caret.
- Exact options and order: `All`, `Open`, `In progress`, `Closed`.
- Empty `values` means All/no status restriction; all three explicit values remain explicit and do not collapse to All.
- Status values combine with OR semantics; Status combines with search and created date using AND semantics.
- Badge format is `Status: Open, In progress`; use the existing 16 px mono close asset and existing Komodo tokens.
- No new dependency, route, ticket data, or changes to unrelated filters/components.
- Use the in-app browser for interaction and image-to-code verification.
- Preserve all unrelated dirty-worktree changes. Do not stage or commit production files unless the user separately authorizes it.

## File Map

- Create `multi-select-filter.js`: reusable component state, DOM, public API, keyboard/outside-click behavior, and change event.
- Create `multi-select-filter.css`: component-only Komodo control, menu, option, selected, badge, clear-link, and focus styles.
- Create `tests/multi-select-filter.test.html`: isolated component contract and keyboard regression.
- Create `tests/support-history-status-multiselect.test.html`: Support History placement, filtering, badge, and filter-composition regression.
- Modify `index.html`: load component resources, add Support History host, and replace the header select with plain text.
- Modify `app.js`: initialize the component and compose selected statuses in `filterRows()`.
- Modify `styles.css`: remove obsolete header-select rules and adjust only Support History spacing.
- Modify `tests/support-history-fidelity.test.sh`: replace obsolete native-select assertions with the new host/header/spacing invariants.
- Modify `design-qa.md`: append the final image-to-code comparison record only after QA passes.

---

### Task 1: Build the reusable multiselect component

**Files:**
- Create: `tests/multi-select-filter.test.html`
- Create: `multi-select-filter.js`
- Create: `multi-select-filter.css`

**Interfaces:**
- Consumes: a host `HTMLElement` and `{ label: string, allLabel: string, options: string[] }`
- Produces: `new window.MultiSelectFilter(host, config)`, getter `values: string[]`, `setValues(values: string[]): void`, `clear(): void`, and bubbling `multiselect-filter-change` with `{ values: string[] }`

- [ ] **Step 1: Add the isolated failing browser regression**

Create `tests/multi-select-filter.test.html` with this complete harness:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="../" />
    <title>MultiSelectFilter regression</title>
    <link rel="stylesheet" href="multi-select-filter.css" />
    <style>#result{position:fixed;right:8px;top:8px;z-index:10;background:#fff;padding:8px}body{font-family:"Helvetica Neue",Arial,sans-serif}.fixture{width:640px;margin:64px}</style>
  </head>
  <body>
    <strong id="result">RUNNING</strong>
    <div class="fixture"><div id="fixture-filter"></div></div>
    <script src="multi-select-filter.js"></script>
    <script>
      const result = document.querySelector("#result");
      const assert = (condition, message) => { if (!condition) throw new Error(message); };
      const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const selectedLabels = (root) => [...root.querySelectorAll("[data-msf-option][aria-selected='true']")].map((option) => option.dataset.value);

      (async () => {
        try {
          const host = document.querySelector("#fixture-filter");
          const changes = [];
          host.addEventListener("multiselect-filter-change", (event) => changes.push(event.detail.values));
          const filter = new window.MultiSelectFilter(host, {
            label: "Status",
            allLabel: "All",
            options: ["Open", "In progress", "Closed"],
          });

          const trigger = host.querySelector("[data-msf-trigger]");
          const menu = host.querySelector("[data-msf-menu]");
          assert(trigger.getBoundingClientRect().height === 40, "trigger is 40px high");
          assert(trigger.getAttribute("aria-haspopup") === "listbox", "trigger identifies a listbox");
          assert(trigger.getAttribute("aria-expanded") === "false", "trigger starts collapsed");
          assert(menu.getAttribute("aria-multiselectable") === "true", "menu exposes multiselect semantics");
          assert([...host.querySelectorAll("[data-msf-option]")].map((option) => option.dataset.value).join("|") === "All|Open|In progress|Closed", "options render in exact order");
          assert(selectedLabels(host).join("|") === "All", "All is selected initially");
          assert(filter.values.length === 0, "empty values represent All");

          trigger.click();
          await nextFrame();
          assert(!menu.hidden && trigger.getAttribute("aria-expanded") === "true", "trigger opens the menu");
          const rows = [...host.querySelectorAll("[data-msf-option]")];
          assert(rows.every((row) => row.getBoundingClientRect().height === 40), "each menu row is 40px high");
          rows[1].click();
          await nextFrame();
          assert(filter.values.join("|") === "Open", "specific selection clears All");
          assert(selectedLabels(host).join("|") === "Open", "selected state stays visible");
          assert(host.querySelector("[data-msf-badge-text]").textContent.trim() === "Status: Open", "single selection renders badge copy");
          assert(changes.at(-1).join("|") === "Open", "user selection emits values");

          rows[2].click();
          await nextFrame();
          assert(filter.values.join("|") === "Open|In progress", "component retains multiple selections");
          assert(host.querySelector("[data-msf-badge-text]").textContent.trim() === "Status: Open, In progress", "multiple selection badge matches reference format");
          assert(host.querySelector("[data-msf-remove] img").getAttribute("src") === "assets/icons/actions/close/size=16px, style=mono.svg", "badge uses repository close asset");

          trigger.focus();
          trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
          await nextFrame();
          assert(document.activeElement === rows[0].querySelector("input"), "ArrowDown opens and focuses first option");
          rows[0].querySelector("input").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
          assert(document.activeElement === rows[1].querySelector("input"), "ArrowDown advances option focus");
          rows[1].querySelector("input").dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
          await nextFrame();
          assert(menu.hidden && document.activeElement === trigger, "Escape closes and restores trigger focus");

          trigger.click();
          document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
          await nextFrame();
          assert(menu.hidden, "outside click closes the menu");

          filter.setValues(["Closed", "Unknown"]);
          assert(filter.values.join("|") === "Closed", "setValues accepts only configured options");
          host.querySelector("[data-msf-remove]").click();
          await nextFrame();
          assert(filter.values.length === 0 && selectedLabels(host).join("|") === "All", "badge removal restores All");

          filter.setValues(["Open"]);
          host.querySelector("[data-msf-clear]").click();
          await nextFrame();
          assert(filter.values.length === 0 && changes.at(-1).length === 0, "Clear filters restores All and emits change");

          const secondHost = document.createElement("div");
          document.body.append(secondHost);
          const second = new window.MultiSelectFilter(secondHost, { label: "Region", allLabel: "Everywhere", options: ["North", "South"] });
          second.setValues(["South"]);
          assert(secondHost.textContent.includes("Region: South"), "component is reusable with alternate configuration");

          result.textContent = "PASS";
          result.dataset.status = "passed";
        } catch (error) {
          result.textContent = `FAIL: ${error.message}`;
          result.dataset.status = "failed";
        }
      })();
    </script>
  </body>
</html>
```

- [ ] **Step 2: Run the isolated harness and verify RED**

Open `http://localhost:4173/tests/multi-select-filter.test.html`.

Expected: `FAIL: window.MultiSelectFilter is not a constructor` or an equivalent missing-constructor failure.

- [ ] **Step 3: Implement the reusable component**

Create `multi-select-filter.js` as an IIFE that assigns `window.MultiSelectFilter`. Implement these exact state rules and methods:

```js
(() => {
  let instanceCount = 0;

  class MultiSelectFilter {
    constructor(host, { label, allLabel = "All", options }) {
      if (!(host instanceof HTMLElement)) throw new TypeError("MultiSelectFilter requires a host element");
      if (!label || !Array.isArray(options) || !options.length) throw new TypeError("MultiSelectFilter requires a label and options");
      this.host = host;
      this.label = label;
      this.allLabel = allLabel;
      this.options = [...new Set(options)];
      this.selected = new Set();
      this.id = `multi-select-filter-${++instanceCount}`;
      this.onDocumentPointerDown = (event) => { if (!this.host.contains(event.target)) this.close(); };
      this.render();
      this.wire();
      this.sync();
    }

    get values() { return this.options.filter((option) => this.selected.has(option)); }

    setValues(values) {
      const next = Array.isArray(values) ? values : [];
      this.selected = new Set(next.filter((value) => this.options.includes(value)));
      this.sync();
    }

    clear() {
      this.selected.clear();
      this.sync();
      this.emitChange();
    }

    render() {
      const optionMarkup = [this.allLabel, ...this.options].map((value, index) => `
        <label class="msf__option" data-msf-option data-value="${value}" role="option" aria-selected="false">
          <input type="checkbox" data-msf-checkbox value="${value}" tabindex="${index === 0 ? "0" : "-1"}" />
          <span>${value}</span>
        </label>`).join("");
      this.host.classList.add("msf");
      this.host.innerHTML = `
        <div class="msf__control">
          <button class="msf__trigger" type="button" data-msf-trigger aria-haspopup="listbox" aria-expanded="false" aria-controls="${this.id}-menu">
            <span>${this.label}</span><img src="assets/icons/directions/caret down/Down caret.svg" alt="" />
          </button>
          <div class="msf__menu" id="${this.id}-menu" data-msf-menu role="listbox" aria-label="${this.label}" aria-multiselectable="true" hidden>${optionMarkup}</div>
        </div>
        <div class="msf__applied" data-msf-applied hidden>
          <span class="msf__badge"><span data-msf-badge-text></span><button type="button" data-msf-remove aria-label="Remove ${this.label} filter"><img src="assets/icons/actions/close/size=16px, style=mono.svg" alt="" /></button></span>
          <button class="msf__clear" type="button" data-msf-clear>Clear filters</button>
        </div>`;
    }
```

Add `wire()`, `toggleValue(value)`, `sync()`, `open()`, `close({ restoreFocus = false } = {})`, `moveFocus(current, delta)`, and `emitChange()` with these exact behaviors:

```js
    wire() {
      this.trigger = this.host.querySelector("[data-msf-trigger]");
      this.menu = this.host.querySelector("[data-msf-menu]");
      this.optionRows = [...this.host.querySelectorAll("[data-msf-option]")];
      this.trigger.addEventListener("click", () => this.menu.hidden ? this.open() : this.close());
      this.trigger.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        this.open();
        const inputs = this.optionRows.map((row) => row.querySelector("input"));
        inputs[event.key === "ArrowDown" ? 0 : inputs.length - 1].focus();
      });
      this.optionRows.forEach((row) => {
        const checkbox = row.querySelector("input");
        checkbox.addEventListener("change", () => this.toggleValue(row.dataset.value));
        row.addEventListener("click", (event) => {
          if (event.target === checkbox) return;
          event.preventDefault();
          this.toggleValue(row.dataset.value);
        });
        checkbox.addEventListener("keydown", (event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            this.moveFocus(checkbox, event.key === "ArrowDown" ? 1 : -1);
          } else if (event.key === "Enter") {
            event.preventDefault();
            this.toggleValue(row.dataset.value);
          } else if (event.key === "Escape") {
            event.preventDefault();
            this.close({ restoreFocus: true });
          } else if (event.key === "Tab") {
            this.close();
          }
        });
      });
      this.host.querySelector("[data-msf-remove]").addEventListener("click", () => this.clear());
      this.host.querySelector("[data-msf-clear]").addEventListener("click", () => this.clear());
      document.addEventListener("mousedown", this.onDocumentPointerDown);
    }

    toggleValue(value) {
      if (value === this.allLabel) this.selected.clear();
      else if (this.selected.has(value)) this.selected.delete(value);
      else this.selected.add(value);
      this.sync();
      this.emitChange();
    }

    sync() {
      const values = this.values;
      this.optionRows.forEach((row) => {
        const selected = row.dataset.value === this.allLabel ? values.length === 0 : this.selected.has(row.dataset.value);
        row.classList.toggle("is-selected", selected);
        row.setAttribute("aria-selected", String(selected));
        row.querySelector("input").checked = selected;
      });
      const applied = this.host.querySelector("[data-msf-applied]");
      applied.hidden = values.length === 0;
      this.host.querySelector("[data-msf-badge-text]").innerHTML = values.length ? `<strong>${this.label}:</strong> ${values.join(", ")}` : "";
    }

    open() { this.menu.hidden = false; this.trigger.setAttribute("aria-expanded", "true"); }
    close({ restoreFocus = false } = {}) { this.menu.hidden = true; this.trigger.setAttribute("aria-expanded", "false"); if (restoreFocus) this.trigger.focus(); }
    moveFocus(current, delta) {
      const inputs = this.optionRows.map((row) => row.querySelector("input"));
      const nextIndex = (inputs.indexOf(current) + delta + inputs.length) % inputs.length;
      inputs.forEach((input, index) => { input.tabIndex = index === nextIndex ? 0 : -1; });
      inputs[nextIndex].focus();
    }
    emitChange() { this.host.dispatchEvent(new CustomEvent("multiselect-filter-change", { bubbles: true, detail: { values: this.values } })); }
  }

  window.MultiSelectFilter = MultiSelectFilter;
})();
```

- [ ] **Step 4: Add exact component styling**

Create `multi-select-filter.css` with these component-scoped rules:

```css
.msf { --msf-text:var(--komodo-color-text,#28282d); --msf-link:var(--komodo-color-action-link,#0071d0); --msf-border:var(--komodo-color-border-subtle,#ccc); --msf-info:var(--komodo-color-surface-information,#edf8ff); position:relative; color:var(--msf-text); font-family:"Helvetica Neue",Helvetica,Arial,sans-serif; font-size:14px; line-height:22px; }
.msf__control { position:relative; width:180px; }
.msf__trigger { display:flex; width:180px; height:40px; align-items:center; justify-content:space-between; border:1px solid var(--msf-border); border-radius:0; padding:0 16px; color:var(--msf-text); background:#fff; font-family:inherit; font-size:14px; font-weight:400; line-height:22px; cursor:pointer; }
.msf__trigger img { width:8px; height:8px; transition:transform .15s ease; }
.msf__trigger[aria-expanded="true"] img { transform:rotate(180deg); }
.msf__menu { position:absolute; z-index:25; top:calc(100% + 4px); left:0; box-sizing:border-box; width:100%; border:1px solid var(--msf-border); background:#fff; box-shadow:0 3px 10px rgb(0 0 0 / 18%); }
.msf__menu[hidden], .msf__applied[hidden] { display:none; }
.msf__option { display:flex; height:40px; align-items:center; gap:8px; padding:0 16px; background:#fff; cursor:pointer; }
.msf__option:hover, .msf__option:focus-within { background:#dfeeff; }
.msf__option input { width:16px; height:16px; margin:0; accent-color:#0071d0; }
.msf__applied { display:flex; min-height:24px; align-items:center; gap:16px; margin-top:16px; }
.msf__badge { display:inline-flex; height:24px; align-items:center; gap:8px; border-radius:12px; padding:0 8px; background:var(--msf-info); font-size:14px; line-height:22px; white-space:nowrap; }
.msf__badge strong { font-weight:600; }
.msf__badge button { display:grid; width:16px; height:16px; place-items:center; border:0; padding:0; background:transparent; cursor:pointer; }
.msf__badge img { width:16px; height:16px; }
.msf__clear { border:0; padding:0; color:var(--msf-link); background:transparent; font-family:inherit; font-size:14px; font-weight:500; line-height:22px; cursor:pointer; }
.msf :is(button,input):focus-visible { outline:2px solid #0077c8; outline-offset:2px; }
```

- [ ] **Step 5: Run the isolated component regression**

Reload `http://localhost:4173/tests/multi-select-filter.test.html`.

Expected: `PASS`.

- [ ] **Step 6: Run focused syntax and whitespace checks**

Run:

```bash
/Users/niranjan.kumarm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check multi-select-filter.js
git diff --check
```

Expected: exit 0 with no output.

---

### Task 2: Integrate the component into Support History

**Files:**
- Create: `tests/support-history-status-multiselect.test.html`
- Modify: `index.html` in the Support History template and resource links
- Modify: `app.js` in `wireSupportHistory()`
- Modify: `styles.css` in the Support History section
- Modify: `tests/support-history-fidelity.test.sh`

**Interfaces:**
- Consumes: `window.MultiSelectFilter`, `statusFilter.values`, and `multiselect-filter-change`
- Produces: `[data-sh-status-filter]`, plain Status header, live status/search/date composition, and updated ticket count

- [ ] **Step 1: Add the failing Support History browser regression**

Create `tests/support-history-status-multiselect.test.html`. Load the app in an iframe using `../?supportHistoryStatusMultiselectHarness=1#support-history` and implement these exact assertions:

```js
const host = doc.querySelector("[data-sh-status-filter]");
assert(host, "status component host renders");
assert(doc.querySelector(".sh-top").nextElementSibling.contains(host), "status filter is directly after search controls");
assert(host.closest(".sh-filter-row").nextElementSibling.classList.contains("sh-table-wrap"), "status filter is before table");
assert(!doc.querySelector("[data-sh-status]"), "obsolete header select is removed");
assert(doc.querySelector(".sh-table thead th:nth-child(2)").textContent.trim() === "Status", "status header is plain text");

const trigger = host.querySelector("[data-msf-trigger]");
trigger.click();
const options = [...host.querySelectorAll("[data-msf-option]")];
assert(options.map((option) => option.dataset.value).join("|") === "All|Open|In progress|Closed", "exact status options render");
options.find((option) => option.dataset.value === "Open").click();
await nextFrame();
assert(visibleRows().length === 1 && visibleRows()[0].dataset.status === "Open", "Open filters live");
assert(host.querySelector("[data-msf-badge-text]").textContent.trim() === "Status: Open", "Open badge renders");

options.find((option) => option.dataset.value === "In progress").click();
await nextFrame();
assert(visibleRows().length === 9, "Open and In progress use OR semantics");
assert(host.querySelector("[data-msf-badge-text]").textContent.trim() === "Status: Open, In progress", "multiple badge matches reference");

const search = doc.querySelector("[data-sh-search]");
search.value = "1009996";
search.dispatchEvent(new Event("input", { bubbles: true }));
await nextFrame();
assert(visibleRows().length === 1, "search and status compose with AND semantics");
host.querySelector("[data-msf-clear]").click();
await nextFrame();
assert(search.value === "1009996" && visibleRows().length === 1, "Clear filters resets only Status");

search.value = "";
search.dispatchEvent(new Event("input", { bubbles: true }));
doc.querySelector("[data-sh-date-picker]").dispatchEvent(new CustomEvent("date-range-change", { bubbles: true, detail: { start: "2020-10-18", end: "2020-10-18" } }));
trigger.click();
options.find((option) => option.dataset.value === "Closed").click();
await nextFrame();
assert(visibleRows().length === 0, "created date and Status compose with AND semantics");
assert(doc.querySelector("[data-sh-count]").textContent === "0", "count follows composed filters");

assert(doc.querySelector(".sh-table thead tr").getBoundingClientRect().height === 45, "header height remains 45px");
assert(doc.querySelector("[data-sh-row]").getBoundingClientRect().height === 41, "row height remains 41px");
assert(doc.documentElement.scrollWidth === doc.body.scrollWidth, "status component adds no page-width overflow");
```

The harness must define `assert`, `nextFrame`, `visibleRows`, catch failures into `#result`, and finish with `PASS` using the same structure as the existing tooltip regressions.

- [ ] **Step 2: Run the integration harness and verify RED**

Open `http://localhost:4173/tests/support-history-status-multiselect.test.html`.

Expected: `FAIL: status component host renders`.

- [ ] **Step 3: Load the reusable resources and add the host**

In `index.html`:

```html
<link rel="stylesheet" href="multi-select-filter.css?v=20260814-support-history-status-multiselect" />
```

Load `multi-select-filter.js` after `date-range-picker.js` and before `app.js`:

```html
<script src="multi-select-filter.js?v=20260814-support-history-status-multiselect"></script>
```

In the Support History template, insert after `.sh-top`:

```html
<div class="sh-filter-row" aria-label="Ticket filters">
  <div data-sh-status-filter></div>
</div>
```

Replace the second table header cell with:

```html
<th>Status</th>
```

Use `20260814-support-history-status-multiselect` for the `styles.css` and `app.js` cache markers as well.

- [ ] **Step 4: Compose Status values into Support History filtering**

At the start of `wireSupportHistory()` add:

```js
const statusFilterRoot = app.querySelector("[data-sh-status-filter]");
const statusFilter = new window.MultiSelectFilter(statusFilterRoot, {
  label: "Status",
  allLabel: "All",
  options: ["Open", "In progress", "Closed"],
});
```

Replace the single-value status logic in `filterRows()` with:

```js
const statuses = statusFilter.values;
// inside the row loop
const statusMatches = statuses.length === 0 || statuses.includes(row.dataset.status);
// count display
app.querySelector("[data-sh-count]").textContent = query || statuses.length || (appliedStart && appliedEnd) ? String(visible) : "100";
```

Replace the obsolete select listener with:

```js
statusFilterRoot.addEventListener("multiselect-filter-change", filterRows);
```

- [ ] **Step 5: Update Support History spacing and remove obsolete select CSS**

Delete `.sh-header-select` and `.sh-header-select select`. Replace the status header padding override with:

```css
.sh-table th:nth-child(2), .sh-table td:nth-child(2) { padding: 0 16px; }
.sh-filter-row { position: relative; z-index: 3; width: 1320px; margin-top: 32px; }
.sh-table-wrap { margin-top: 24px; }
```

Do not change `.sh-table th { height: 45px; }`, `.sh-table th, .sh-table td { height: 41px; ... }`, column widths, or page width.

- [ ] **Step 6: Update the shell fidelity regression**

In `tests/support-history-fidelity.test.sh`, remove the exact `.sh-header-select select` assertion and add:

```bash
rg -Fq '<div data-sh-status-filter></div>' index.html
rg -Fq '<th>Status</th>' index.html
rg -Fq '.sh-filter-row { position: relative; z-index: 3; width: 1320px; margin-top: 32px; }' styles.css
rg -Fq 'const statusFilter = new window.MultiSelectFilter(statusFilterRoot' app.js
```

- [ ] **Step 7: Run GREEN regressions**

Reload:

```text
http://localhost:4173/tests/multi-select-filter.test.html
http://localhost:4173/tests/support-history-status-multiselect.test.html
http://localhost:4173/tests/support-history-date-range.test.html
http://localhost:4173/tests/support-history-quote-tooltip.test.html
http://localhost:4173/tests/support-history-visit-tooltip.test.html
```

Expected: all report `PASS`.

- [ ] **Step 8: Run focused shell verification**

Run:

```bash
bash tests/support-history-search.test.sh
bash tests/support-history-fidelity.test.sh
/Users/niranjan.kumarm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check multi-select-filter.js
/Users/niranjan.kumarm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js
git diff --check
```

Expected: exit 0 with no output.

---

### Task 3: Complete image-to-code comparison and design QA

**Files:**
- Modify: `design-qa.md`
- Test: `tests/multi-select-filter.test.html`
- Test: `tests/support-history-status-multiselect.test.html`

**Interfaces:**
- Consumes: the supplied badge screenshot, Komodo Dropdown documentation, component open/selected states, and Support History integration
- Produces: final visual measurements and a `final result: passed` QA record

- [ ] **Step 1: Capture the exact interaction states**

Use the in-app browser at a 1280 × 720 CSS viewport:

```text
Reference badge: /Users/niranjan.kumarm/Library/CloudStorage/OneDrive-ThermoFisherScientific/Desktop/Screenshot 2026-08-14 at 1.20.38 PM.png
Komodo dropdown: https://designsystem.thermofisher.com/09523d9e2/p/20c7e1-dropdown
Implementation: http://localhost:4173/?supportHistoryStatusMultiselect=qa#support-history
```

Capture these implementation states:

1. Dropdown open with `All` selected.
2. Dropdown open with `Open` and `In progress` selected.
3. Applied badge showing `Status: Open, In progress` with `Clear filters`.
4. Keyboard focus on the trigger and one selected option.

- [ ] **Step 2: Compare source and implementation together**

Open the reference badge and implementation badge in the same comparison input. Open the Komodo dropdown and implementation dropdown in the same comparison input. Measure and verify:

```text
trigger height: 40px
menu row height: 40px
caret: 8px
control horizontal padding: 16px
text: 14px / 22px
badge minimum height: 48px
close asset: 16px mono repository icon
table header: 45px
table body row: 41px
content/page width: unchanged, no horizontal growth
```

- [ ] **Step 3: Fix actionable discrepancies**

Correct all P0/P1/P2 differences in spacing, alignment, typography, selected-state background, checkbox alignment, menu border/elevation, badge radius/padding, close-icon sizing, Clear filters spacing, clipping, or page width. After every correction, rerun both new browser regressions and the existing date-range/tooltip regressions.

- [ ] **Step 4: Append the final QA record**

After the comparisons pass, append this section to `design-qa.md`:

```md
# Support History status multiselect design QA

**Comparison target**

- Badge source: supplied screenshot `Screenshot 2026-08-14 at 1.20.38 PM.png`.
- Dropdown source: Komodo Dropdown component and specifications.
- Implementation: `http://localhost:4173/?supportHistoryStatusMultiselect=qa#support-history`.

**Findings**

- No actionable P0/P1/P2 discrepancies remain.
- The reusable component matches the 40 px Komodo control/menu rhythm and retains visible selected states.
- The applied `Status: Open, In progress` badge matches the supplied reference treatment and uses the repository 16 px mono close asset.
- The new filter row does not change the 1320 px content width, 45 px table header, or 41 px rows.

**Interaction verification**

- All, Open, In progress, and Closed use the approved multiselect semantics.
- Status filters live with OR semantics and composes with search/created date using AND semantics.
- Badge removal and Clear filters restore All without clearing search/date.
- Mouse, outside-click, Arrow keys, Enter, Space, Escape, Tab, and visible focus states were verified.
- Component and Support History browser regressions report PASS.

final result: passed
```

- [ ] **Step 5: Run final verification and preserve the preview**

Run the focused shell commands from Task 2, reload every Support History browser regression, inspect browser errors/warnings, `git status --short`, `git diff --stat`, and `git diff --check`. Keep only the verified Support History page open as the deliverable browser tab. Do not stage or commit the shared production changes.
