(() => {
  const padDatePart = (value) => String(value).padStart(2, "0");

  const isoDate = (date) => `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;

  const monthStart = (date, offset = 0) => new Date(date.getFullYear(), date.getMonth() + offset, 1);

  const dateFromKey = (key) => {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatRange = (start, end) => {
    const format = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    return `${format.format(dateFromKey(start))} – ${format.format(dateFromKey(end))}`;
  };

  class DateRangePicker {
    constructor(root, options = {}) {
      if (!(root instanceof HTMLElement)) throw new TypeError("DateRangePicker requires a root element.");

      this.root = root;
      this.initialMonth = options.initialMonth instanceof Date && !Number.isNaN(options.initialMonth.valueOf())
        ? monthStart(options.initialMonth)
        : monthStart(new Date());
      this.visibleMonth = new Date(this.initialMonth);
      this.pendingStart = "";
      this.pendingEnd = "";
      this.appliedStart = "";
      this.appliedEnd = "";

      this.handleOutsidePointer = this.handleOutsidePointer.bind(this);
      this.handleDocumentKeydown = this.handleDocumentKeydown.bind(this);
      this.handleDayClick = this.handleDayClick.bind(this);

      this.renderShell();
      this.cacheElements();
      this.bindEvents();
      this.renderMonths();
    }

    renderShell() {
      this.root.classList.add("date-range-picker");
      this.root.innerHTML = `
        <strong class="date-range-picker__label">Date range</strong>
        <button class="date-range-picker__trigger" type="button" data-date-range-trigger aria-haspopup="dialog" aria-expanded="false">
          <span data-date-range-label>Select a date range</span>
          <img src="assets/icons/features/calendar/size=24px, style=mono.svg" alt="" />
        </button>
        <div class="date-range-picker__dialog" data-date-range-dialog role="dialog" aria-label="Select created date range" hidden>
          <header class="date-range-picker__header">
            <button type="button" data-date-range-prev aria-label="Previous month"><img src="/assets/icons/directions/chevron left/size=24px, style=mono.svg" alt="" /></button>
            <strong>Select created date range</strong>
            <button type="button" data-date-range-next aria-label="Next month"><img src="/assets/icons/directions/chevron right/size=24px, style=mono.svg" alt="" /></button>
          </header>
          <div class="date-range-picker__months" data-date-range-months></div>
          <footer class="date-range-picker__actions">
            <button class="mi-button" type="button" data-date-range-clear>Clear</button>
            <div>
              <button class="mi-button" type="button" data-date-range-cancel>Cancel</button>
              <button class="mi-button mi-button--primary" type="button" data-date-range-apply disabled>Apply</button>
            </div>
          </footer>
        </div>`;
    }

    cacheElements() {
      this.trigger = this.root.querySelector("[data-date-range-trigger]");
      this.valueLabel = this.root.querySelector("[data-date-range-label]");
      this.dialog = this.root.querySelector("[data-date-range-dialog]");
      this.months = this.root.querySelector("[data-date-range-months]");
      this.applyButton = this.root.querySelector("[data-date-range-apply]");
    }

    bindEvents() {
      this.trigger.addEventListener("click", () => this.dialog.hidden ? this.open() : this.close(true));
      this.root.querySelector("[data-date-range-prev]").addEventListener("click", () => {
        this.visibleMonth = monthStart(this.visibleMonth, -1);
        this.renderMonths();
      });
      this.root.querySelector("[data-date-range-next]").addEventListener("click", () => {
        this.visibleMonth = monthStart(this.visibleMonth, 1);
        this.renderMonths();
      });
      this.months.addEventListener("click", this.handleDayClick);
      this.root.querySelector("[data-date-range-apply]").addEventListener("click", () => this.apply());
      this.root.querySelector("[data-date-range-clear]").addEventListener("click", () => this.clear());
      this.root.querySelector("[data-date-range-cancel]").addEventListener("click", () => this.close(true));
    }

    open() {
      this.pendingStart = this.appliedStart;
      this.pendingEnd = this.appliedEnd;
      this.visibleMonth = this.pendingStart ? monthStart(dateFromKey(this.pendingStart)) : new Date(this.initialMonth);
      this.renderMonths();
      this.dialog.hidden = false;
      this.trigger.setAttribute("aria-expanded", "true");
      document.addEventListener("pointerdown", this.handleOutsidePointer);
      document.addEventListener("keydown", this.handleDocumentKeydown);
      this.root.querySelector("[data-date-range-prev]").focus();
    }

    close(restoreFocus = false) {
      this.dialog.hidden = true;
      this.trigger.setAttribute("aria-expanded", "false");
      document.removeEventListener("pointerdown", this.handleOutsidePointer);
      document.removeEventListener("keydown", this.handleDocumentKeydown);
      if (restoreFocus) this.trigger.focus();
    }

    apply() {
      if (!this.pendingStart || !this.pendingEnd) return;
      this.appliedStart = this.pendingStart;
      this.appliedEnd = this.pendingEnd;
      this.valueLabel.textContent = formatRange(this.appliedStart, this.appliedEnd);
      this.trigger.classList.add("has-value");
      this.emitChange();
      this.close(true);
    }

    clear() {
      this.pendingStart = "";
      this.pendingEnd = "";
      this.appliedStart = "";
      this.appliedEnd = "";
      this.valueLabel.textContent = "Select a date range";
      this.trigger.classList.remove("has-value");
      this.emitChange();
      this.close(true);
    }

    emitChange() {
      this.root.dispatchEvent(new CustomEvent("date-range-change", {
        bubbles: true,
        detail: { start: this.appliedStart, end: this.appliedEnd },
      }));
    }

    handleOutsidePointer(event) {
      if (!this.root.contains(event.target)) this.close();
    }

    handleDocumentKeydown(event) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      this.close(true);
    }

    handleDayClick(event) {
      const day = event.target.closest("[data-date-value]");
      if (!day) return;
      const value = day.dataset.dateValue;
      if (!this.pendingStart || this.pendingEnd || value < this.pendingStart) {
        this.pendingStart = value;
        this.pendingEnd = "";
      } else {
        this.pendingEnd = value;
      }
      this.renderMonths();
    }

    renderMonths() {
      this.months.innerHTML = this.monthMarkup(this.visibleMonth)
        + this.monthMarkup(monthStart(this.visibleMonth, 1));
      this.applyButton.disabled = !this.pendingStart || !this.pendingEnd;
    }

    monthMarkup(monthDate) {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const firstWeekday = new Date(year, month, 1).getDay();
      const dayCount = new Date(year, month + 1, 0).getDate();
      const blanks = Array.from({ length: firstWeekday }, () => '<span class="date-range-picker__day is-empty" aria-hidden="true"></span>').join("");
      const days = Array.from({ length: dayCount }, (_, index) => {
        const date = new Date(year, month, index + 1);
        const key = isoDate(date);
        const isEndpoint = key === this.pendingStart || key === this.pendingEnd;
        const isInRange = Boolean(this.pendingStart && this.pendingEnd && key >= this.pendingStart && key <= this.pendingEnd);
        const classes = ["date-range-picker__day", isInRange ? "is-in-range" : "", isEndpoint ? "is-endpoint" : ""].filter(Boolean).join(" ");
        const label = new Intl.DateTimeFormat("en-GB", { dateStyle: "full" }).format(date);
        return `<button class="${classes}" type="button" data-date-value="${key}" aria-label="${label}" aria-pressed="${Boolean(isInRange || isEndpoint)}">${index + 1}</button>`;
      }).join("");
      const title = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(monthDate);
      return `<section class="date-range-picker__month" data-date-range-month aria-label="${title}">
        <h3>${title}</h3>
        <div class="date-range-picker__weekdays" aria-hidden="true"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
        <div class="date-range-picker__grid">${blanks}${days}</div>
      </section>`;
    }
  }

  window.DateRangePicker = DateRangePicker;
})();
