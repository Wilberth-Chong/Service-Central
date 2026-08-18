(() => {
  let instanceCount = 0;

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  class MultiSelectFilter {
    constructor(host, { label, controlLabel = label, allLabel = "All", options, controlHost = host, menuStyle = "default" }) {
      if (!(host instanceof HTMLElement) || !(controlHost instanceof HTMLElement)) {
        throw new TypeError("MultiSelectFilter requires host elements");
      }
      if (!label || !Array.isArray(options) || !options.length) {
        throw new TypeError("MultiSelectFilter requires a label and options");
      }

      this.host = host;
      this.controlHost = controlHost;
      this.label = String(label);
      this.controlLabel = String(controlLabel);
      this.allLabel = String(allLabel);
      this.menuStyle = menuStyle;
      this.options = [...new Set(options.map(String))].filter((option) => option !== this.allLabel);
      this.selected = new Set();
      this.id = `multi-select-filter-${++instanceCount}`;
      this.onDocumentPointerDown = (event) => {
        if (!this.host.contains(event.target) && !this.controlHost.contains(event.target)) this.close();
      };

      this.render();
      this.wire();
      this.sync();
    }

    get values() {
      return this.options.filter((option) => this.selected.has(option));
    }

    setValues(values) {
      const next = Array.isArray(values) ? values.map(String) : [];
      this.selected = new Set(next.filter((value) => this.options.includes(value)));
      this.sync();
    }

    clear() {
      this.selected.clear();
      this.sync();
      this.emitChange();
    }

    render() {
      const menuValues = this.menuStyle === "figma-column" ? this.options : [this.allLabel, ...this.options];
      const optionMarkup = menuValues.map((value, index) => `
        <label class="msf__option" data-msf-option data-value="${escapeHtml(value)}" role="option" aria-selected="false">
          <input type="checkbox" data-msf-checkbox value="${escapeHtml(value)}" tabindex="${index === 0 ? "0" : "-1"}" />
          <span>${escapeHtml(value)}</span>
        </label>`).join("");

      const controlMarkup = `
        <div class="msf__control">
          <button class="msf__trigger" type="button" data-msf-trigger aria-haspopup="listbox" aria-expanded="false" aria-controls="${this.id}-menu">
            <span>${escapeHtml(this.controlLabel)}</span>
            <img src="assets/icons/directions/caret down/Down caret.svg" alt="" />
          </button>
          <div class="msf__menu ${this.menuStyle === "figma-column" ? "msf__menu--figma-column" : ""}" id="${this.id}-menu" data-msf-menu role="listbox" aria-label="${escapeHtml(this.label)}" aria-multiselectable="true" hidden>
            ${this.menuStyle === "figma-column" ? `<div class="msf__section-label">Sort</div><button type="button" class="msf__sort" data-msf-sort="asc">A to Z</button><button type="button" class="msf__sort" data-msf-sort="desc">Z to A</button><div class="msf__section-label">Filter</div><button type="button" class="msf__clear-menu" data-msf-clear-menu><img src="assets/icons/actions/filter refresh/size=24px, style=mono.svg" alt="" />Clear</button>` : ""}
            ${optionMarkup}
          </div>
        </div>`;
      const appliedMarkup = `
        <div class="msf__applied" data-msf-applied hidden>
          <span class="msf__badge">
            <span data-msf-badge-text></span>
            <button type="button" data-msf-remove aria-label="Remove ${escapeHtml(this.label)} filter">
              <img src="assets/icons/actions/close/size=16px, style=mono.svg" alt="" />
            </button>
          </span>
          <button class="msf__clear" type="button" data-msf-clear>Clear filters</button>
        </div>`;

      this.host.classList.add("msf");
      if (this.controlHost === this.host) {
        this.host.classList.add("msf--combined-host");
        this.host.innerHTML = `${controlMarkup}${appliedMarkup}`;
      } else {
        this.host.classList.add("msf--applied-host");
        this.controlHost.classList.add("msf", "msf--control-host");
        this.controlHost.innerHTML = controlMarkup;
        this.host.innerHTML = appliedMarkup;
      }
    }

    wire() {
      this.trigger = this.controlHost.querySelector("[data-msf-trigger]");
      this.menu = this.controlHost.querySelector("[data-msf-menu]");
      this.optionRows = [...this.controlHost.querySelectorAll("[data-msf-option]")];

      this.trigger.addEventListener("click", () => {
        if (this.menu.hidden) this.open();
        else this.close();
      });
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
          } else if (event.key === "Enter" || event.key === " ") {
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

      this.controlHost.querySelectorAll("[data-msf-clear-menu]").forEach((button) => button.addEventListener("click", () => this.clear()));
      this.controlHost.querySelectorAll("[data-msf-sort]").forEach((button) => button.addEventListener("click", () => {
        this.host.dispatchEvent(new CustomEvent("multiselect-filter-sort", { bubbles: true, detail: { direction: button.dataset.msfSort } }));
      }));

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
        const selected = row.dataset.value === this.allLabel
          ? values.length === 0
          : this.selected.has(row.dataset.value);
        row.classList.toggle("is-selected", selected);
        row.setAttribute("aria-selected", String(selected));
        row.querySelector("input").checked = selected;
      });

      const applied = this.host.querySelector("[data-msf-applied]");
      applied.hidden = values.length === 0;
      this.host.querySelector("[data-msf-badge-text]").innerHTML = values.length
        ? `<strong>${escapeHtml(this.label)}:</strong> ${values.map(escapeHtml).join(", ")}`
        : "";
    }

    open() {
      this.menu.hidden = false;
      this.trigger.setAttribute("aria-expanded", "true");
    }

    close({ restoreFocus = false } = {}) {
      this.menu.hidden = true;
      this.trigger.setAttribute("aria-expanded", "false");
      if (restoreFocus) this.trigger.focus();
    }

    moveFocus(current, delta) {
      const inputs = this.optionRows.map((row) => row.querySelector("input"));
      const nextIndex = (inputs.indexOf(current) + delta + inputs.length) % inputs.length;
      inputs.forEach((input, index) => {
        input.tabIndex = index === nextIndex ? 0 : -1;
      });
      inputs[nextIndex].focus();
    }

    emitChange() {
      this.host.dispatchEvent(new CustomEvent("multiselect-filter-change", {
        bubbles: true,
        detail: { values: this.values },
      }));
    }
  }

  window.MultiSelectFilter = MultiSelectFilter;
})();
