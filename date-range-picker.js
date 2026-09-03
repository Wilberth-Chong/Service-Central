(() => {
  const padDatePart = (value) => String(value).padStart(2, "0");
  const isoDate = (date) => `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
  const monthStart = (date, offset = 0) => new Date(date.getFullYear(), date.getMonth() + offset, 1);
  const dateFromKey = (key) => {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  const formatInputDate = (key) => {
    if (!key) return "";
    const date = dateFromKey(key);
    return `${padDatePart(date.getDate())}/${padDatePart(date.getMonth() + 1)}/${date.getFullYear()}`;
  };
  const parseInputDate = (value) => {
    const match = String(value).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return "";
    const date = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
    if (date.getFullYear() !== Number(match[3]) || date.getMonth() !== Number(match[2]) - 1 || date.getDate() !== Number(match[1])) return "";
    return isoDate(date);
  };
  const formatRange = (start, end) => {
    const format = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    return `${format.format(dateFromKey(start))} – ${format.format(dateFromKey(end))}`;
  };

  class DateRangePicker {
    constructor(root, options = {}) {
      if (!(root instanceof HTMLElement)) throw new TypeError("DateRangePicker requires a root element.");
      this.root = root;
      this.today = new Date();
      this.today.setHours(0, 0, 0, 0);
      this.initialMonth = options.initialMonth instanceof Date && !Number.isNaN(options.initialMonth.valueOf())
        ? monthStart(options.initialMonth)
        : monthStart(this.today);
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
      this.renderMonth();
    }

    renderShell() {
      this.root.classList.add("date-range-picker");
      this.root.innerHTML = `
        <strong class="date-range-picker__label">Date range</strong>
        <button class="date-range-picker__trigger" type="button" data-date-range-trigger aria-haspopup="dialog" aria-expanded="false">
          <span data-date-range-label>Select a date range</span>
          <img src="assets/icons/features/calendar/size=24px, style=mono.svg" alt="" />
        </button>
        <div class="date-range-picker__dialog" data-date-range-dialog role="dialog" aria-label="Select a date range" hidden>
          <section class="date-range-picker__presets">
            <strong>Select a date range from the last</strong>
            <div role="group" aria-label="Common date ranges">
              <button type="button" data-date-range-preset="15">15 days</button>
              <button type="button" data-date-range-preset="30">30 days</button>
              <button type="button" data-date-range-preset="90">90 days</button>
            </div>
          </section>
          <section class="date-range-picker__custom">
            <strong>Or set a custom date range</strong>
            <div class="date-range-picker__inputs">
              <label><span>From:</span><span class="date-range-picker__input-wrap"><input type="text" inputmode="numeric" placeholder="dd/mm/yyyy" data-date-range-from /><img src="assets/icons/features/calendar/size=24px, style=mono.svg" alt="" /></span></label>
              <label><span>To:</span><span class="date-range-picker__input-wrap"><input type="text" inputmode="numeric" placeholder="dd/mm/yyyy" data-date-range-to /><img src="assets/icons/features/calendar/size=24px, style=mono.svg" alt="" /></span></label>
            </div>
          </section>
          <header class="date-range-picker__header">
            <div>
              <button type="button" data-date-range-prev-year aria-label="Previous year"><img src="assets/icons/directions/chevron left/size=16px, style=mono.svg" alt="" /><img src="assets/icons/directions/chevron left/size=16px, style=mono.svg" alt="" /></button>
              <button type="button" data-date-range-prev aria-label="Previous month"><img src="assets/icons/directions/chevron left/size=16px, style=mono.svg" alt="" /></button>
            </div>
            <strong data-date-range-month-label></strong>
            <div>
              <button type="button" data-date-range-next aria-label="Next month"><img src="assets/icons/directions/chevron right/size=16px, style=mono.svg" alt="" /></button>
              <button type="button" data-date-range-next-year aria-label="Next year"><img src="assets/icons/directions/chevron right/size=16px, style=mono.svg" alt="" /><img src="assets/icons/directions/chevron right/size=16px, style=mono.svg" alt="" /></button>
            </div>
          </header>
          <div class="date-range-picker__month" data-date-range-month></div>
          <footer class="date-range-picker__actions">
            <button class="mi-button" type="button" data-date-range-cancel>Cancel</button>
            <button class="mi-button mi-button--primary" type="button" data-date-range-apply disabled>Select</button>
          </footer>
        </div>`;
    }

    cacheElements() {
      this.trigger = this.root.querySelector("[data-date-range-trigger]");
      this.valueLabel = this.root.querySelector("[data-date-range-label]");
      this.dialog = this.root.querySelector("[data-date-range-dialog]");
      this.month = this.root.querySelector("[data-date-range-month]");
      this.monthLabel = this.root.querySelector("[data-date-range-month-label]");
      this.fromInput = this.root.querySelector("[data-date-range-from]");
      this.toInput = this.root.querySelector("[data-date-range-to]");
      this.applyButton = this.root.querySelector("[data-date-range-apply]");
    }

    bindEvents() {
      this.trigger.addEventListener("click", () => this.dialog.hidden ? this.open() : this.close(true));
      this.root.querySelector("[data-date-range-prev-year]").addEventListener("click", () => this.navigate(-12));
      this.root.querySelector("[data-date-range-prev]").addEventListener("click", () => this.navigate(-1));
      this.root.querySelector("[data-date-range-next]").addEventListener("click", () => this.navigate(1));
      this.root.querySelector("[data-date-range-next-year]").addEventListener("click", () => this.navigate(12));
      this.root.querySelectorAll("[data-date-range-preset]").forEach((button) => button.addEventListener("click", () => this.selectPreset(Number(button.dataset.dateRangePreset))));
      this.fromInput.addEventListener("input", () => this.syncFromInputs());
      this.toInput.addEventListener("input", () => this.syncFromInputs());
      this.month.addEventListener("click", this.handleDayClick);
      this.applyButton.addEventListener("click", () => this.apply());
      this.root.querySelector("[data-date-range-cancel]").addEventListener("click", () => this.close(true));
    }

    navigate(offset) {
      this.visibleMonth = monthStart(this.visibleMonth, offset);
      this.renderMonth();
    }

    open() {
      this.pendingStart = this.appliedStart;
      this.pendingEnd = this.appliedEnd;
      this.visibleMonth = this.pendingStart ? monthStart(dateFromKey(this.pendingStart)) : new Date(this.initialMonth);
      this.syncInputs();
      this.renderMonth();
      this.dialog.hidden = false;
      this.trigger.setAttribute("aria-expanded", "true");
      document.addEventListener("pointerdown", this.handleOutsidePointer);
      document.addEventListener("keydown", this.handleDocumentKeydown);
      this.root.querySelector("[data-date-range-preset]").focus();
    }

    close(restoreFocus = false) {
      this.dialog.hidden = true;
      this.trigger.setAttribute("aria-expanded", "false");
      document.removeEventListener("pointerdown", this.handleOutsidePointer);
      document.removeEventListener("keydown", this.handleDocumentKeydown);
      if (restoreFocus) this.trigger.focus();
    }

    selectPreset(days) {
      const end = new Date(this.today);
      const start = new Date(this.today);
      start.setDate(start.getDate() - days + 1);
      this.pendingStart = isoDate(start);
      this.pendingEnd = isoDate(end);
      this.visibleMonth = monthStart(end);
      this.syncInputs();
      this.renderMonth();
    }

    syncFromInputs() {
      const start = parseInputDate(this.fromInput.value);
      const end = parseInputDate(this.toInput.value);
      this.pendingStart = start;
      this.pendingEnd = end && (!start || end >= start) ? end : "";
      if (start) this.visibleMonth = monthStart(dateFromKey(start));
      this.renderMonth();
    }

    syncInputs() {
      this.fromInput.value = formatInputDate(this.pendingStart);
      this.toInput.value = formatInputDate(this.pendingEnd);
    }

    apply() {
      if (!this.pendingStart || !this.pendingEnd) return;
      this.appliedStart = this.pendingStart;
      this.appliedEnd = this.pendingEnd;
      this.valueLabel.textContent = formatRange(this.appliedStart, this.appliedEnd);
      this.trigger.classList.add("has-value");
      this.root.dispatchEvent(new CustomEvent("date-range-change", {
        bubbles: true,
        detail: { start: this.appliedStart, end: this.appliedEnd },
      }));
      this.close(true);
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
      if (!day || day.disabled) return;
      const value = day.dataset.dateValue;
      if (!this.pendingStart || this.pendingEnd || value < this.pendingStart) {
        this.pendingStart = value;
        this.pendingEnd = "";
      } else {
        this.pendingEnd = value;
      }
      this.syncInputs();
      this.renderMonth();
    }

    renderMonth() {
      const year = this.visibleMonth.getFullYear();
      const month = this.visibleMonth.getMonth();
      const firstCell = new Date(year, month, 1 - new Date(year, month, 1).getDay());
      const todayKey = isoDate(this.today);
      const days = Array.from({ length: 42 }, (_, index) => {
        const date = new Date(firstCell);
        date.setDate(firstCell.getDate() + index);
        const key = isoDate(date);
        const isOutside = date.getMonth() !== month;
        const isFuture = key > todayKey;
        const isEndpoint = key === this.pendingStart || key === this.pendingEnd;
        const isInRange = Boolean(this.pendingStart && this.pendingEnd && key >= this.pendingStart && key <= this.pendingEnd);
        const classes = ["date-range-picker__day", isOutside ? "is-outside" : "", isFuture ? "is-future" : "", key === todayKey ? "is-today" : "", isInRange ? "is-in-range" : "", isEndpoint ? "is-endpoint" : ""].filter(Boolean).join(" ");
        const label = new Intl.DateTimeFormat("en-GB", { dateStyle: "full" }).format(date);
        return `<button class="${classes}" type="button" data-date-value="${key}" aria-label="${label}" aria-pressed="${Boolean(isInRange || isEndpoint)}"${isFuture ? " disabled" : ""}>${date.getDate()}</button>`;
      }).join("");
      this.monthLabel.textContent = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(this.visibleMonth);
      this.month.innerHTML = `<div class="date-range-picker__weekdays" aria-hidden="true"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div><div class="date-range-picker__grid">${days}</div>`;
      this.applyButton.disabled = !this.pendingStart || !this.pendingEnd;
      this.root.querySelectorAll("[data-date-range-preset]").forEach((button) => {
        const daysValue = Number(button.dataset.dateRangePreset);
        const expectedStart = new Date(this.today);
        expectedStart.setDate(expectedStart.getDate() - daysValue + 1);
        button.classList.toggle("is-selected", this.pendingStart === isoDate(expectedStart) && this.pendingEnd === todayKey);
      });
    }
  }

  window.DateRangePicker = DateRangePicker;
})();
