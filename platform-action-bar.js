(function () {
  let cancelDialog;
  let pendingCancelButton;

  function closeCancelDialog() {
    if (cancelDialog?.open) cancelDialog.close();
    pendingCancelButton = undefined;
  }

  function getCancelDialog() {
    if (cancelDialog) return cancelDialog;

    cancelDialog = document.createElement("dialog");
    cancelDialog.className = "platform-actionbar-cancel-dialog";
    cancelDialog.setAttribute("aria-labelledby", "platform-actionbar-cancel-title");
    cancelDialog.setAttribute("aria-describedby", "platform-actionbar-cancel-description");
    cancelDialog.innerHTML = `
      <section class="platform-actionbar-cancel-modal">
        <header>
          <h2 id="platform-actionbar-cancel-title">Cancel service request</h2>
          <button type="button" class="platform-actionbar-cancel-modal__close" data-actionbar-cancel-dismiss aria-label="Close cancellation confirmation">
            <img src="assets/icons/actions/close/size=24px, style=mono.svg" alt="" />
          </button>
        </header>
        <p id="platform-actionbar-cancel-description">Are you sure you want to cancel your service request?<br />You will lose all progress.</p>
        <footer>
          <button type="button" class="platform-actionbar-cancel-modal__continue" data-actionbar-cancel-dismiss>Continue request</button>
          <button type="button" class="platform-actionbar-cancel-modal__confirm" data-actionbar-cancel-confirm>Confirm</button>
        </footer>
      </section>`;

    cancelDialog.querySelectorAll("[data-actionbar-cancel-dismiss]").forEach((button) => {
      button.addEventListener("click", closeCancelDialog);
    });
    cancelDialog.querySelector("[data-actionbar-cancel-confirm]").addEventListener("click", () => {
      const button = pendingCancelButton;
      closeCancelDialog();
      if (!button) return;
      button.dataset.actionbarCancelConfirmed = "true";
      button.click();
    });
    cancelDialog.addEventListener("click", (event) => {
      if (event.target === cancelDialog) closeCancelDialog();
    });
    cancelDialog.addEventListener("close", () => { pendingCancelButton = undefined; });
    document.body.append(cancelDialog);
    return cancelDialog;
  }

  function requestCancelConfirmation(button) {
    pendingCancelButton = button;
    const dialog = getCancelDialog();
    dialog.showModal();
    dialog.querySelector("[data-actionbar-cancel-dismiss]").focus({ preventScroll: true });
  }

  function createButton({ label, variant, route, action, disabled = false }) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `platform-actionbar__button platform-actionbar__button--${variant}`;
    button.textContent = label;
    button.disabled = disabled;
    if (route) button.dataset.route = route;
    if (action) button.dataset.actionbarAction = action;
    return button;
  }

  function create(options = {}) {
    const {
      cancelLabel = "Cancel",
      backLabel = "Back",
      primaryLabel = "Continue",
      auxiliaryLabel = "",
      cancelRoute,
      backRoute,
      primaryRoute,
      auxiliaryRoute,
      primaryDisabled = false,
      closeOnly = false,
      closeRoute = "request-support",
    } = options;
    const bar = document.createElement("div");
    bar.className = "platform-actionbar";
    bar.dataset.platformActionbar = "";

    if (closeOnly) {
      const trailing = document.createElement("div");
      trailing.className = "platform-actionbar__trailing";
      trailing.append(createButton({ label: "Close", variant: "secondary", route: closeRoute, action: "close" }));
      bar.append(trailing);
      return bar;
    }

    const cancel = createButton({ label: cancelLabel, variant: "tertiary", route: cancelRoute, action: "cancel" });
    cancel.addEventListener("click", (event) => {
      if (cancel.dataset.actionbarCancelConfirmed === "true") {
        delete cancel.dataset.actionbarCancelConfirmed;
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      requestCancelConfirmation(cancel);
    });
    const leading = document.createElement("div");
    leading.className = "platform-actionbar__leading";
    leading.append(cancel);
    if (auxiliaryLabel) {
      const auxiliary = createButton({ label: auxiliaryLabel, variant: "link", route: auxiliaryRoute, action: "auxiliary" });
      leading.append(auxiliary);
    }
    const trailing = document.createElement("div");
    trailing.className = "platform-actionbar__trailing";
    const back = createButton({ label: backLabel, variant: "secondary", route: backRoute, action: "back" });
    const primary = createButton({ label: primaryLabel, variant: "primary", route: primaryRoute, action: "primary", disabled: primaryDisabled });
    trailing.append(back, primary);
    bar.append(leading, trailing);
    return bar;
  }

  function mount(target, options = {}) {
    const mountTarget = typeof target === "string" ? document.querySelector(target) : target;
    if (!mountTarget) return undefined;
    const bar = create(options);
    mountTarget.replaceWith(bar);
    return bar;
  }

  function setPrimaryDisabled(bar, disabled) {
    bar?.querySelector('[data-actionbar-action="primary"]')?.toggleAttribute("disabled", disabled);
  }

  window.PlatformActionBar = Object.freeze({ create, mount, setPrimaryDisabled, requestCancelConfirmation });
})();
