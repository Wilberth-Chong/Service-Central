(function () {
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
    } = options;
    const bar = document.createElement("div");
    bar.className = "platform-actionbar";
    bar.dataset.platformActionbar = "";

    const cancel = createButton({ label: cancelLabel, variant: "tertiary", route: cancelRoute, action: "cancel" });
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

  window.PlatformActionBar = Object.freeze({ create, mount, setPrimaryDisabled });
})();
