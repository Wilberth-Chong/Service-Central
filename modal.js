(function () {
  const CLOSE_ICON = "assets/icons/actions/close/size=24px, style=bold.svg";
  const MODAL_SIZES = Object.freeze({
    sm: "600px",
    md: "824px",
    lg: "1080px",
    xl: "1248px",
  });
  const DEFAULT_SIZE = "sm";

  function resolveTarget(target) {
    return typeof target === "string" ? document.querySelector(target) : target;
  }

  function resolveDialog(dialog) {
    if (typeof dialog !== "string") return dialog;
    return document.getElementById(dialog) || document.querySelector(dialog);
  }

  function normalizeWidth(width) {
    if (typeof width === "number") return `${width}px`;
    return width || MODAL_SIZES[DEFAULT_SIZE];
  }

  function applyDataset(element, dataset = {}) {
    Object.entries(dataset).forEach(([key, value]) => {
      element.dataset[key] = value;
    });
  }

  function appendContent(target, content) {
    if (content === undefined || content === null) return;
    if (Array.isArray(content)) {
      content.forEach((item) => appendContent(target, item));
      return;
    }
    if (typeof content === "string") {
      target.innerHTML = content;
      return;
    }
    target.append(content);
  }

  function findAll(root, selector) {
    const elements = [];
    if (root.matches?.(selector)) elements.push(root);
    elements.push(...root.querySelectorAll(selector));
    return elements;
  }

  function createAction(action) {
    const button = document.createElement("button");
    button.type = action.type || "button";
    button.className = `modal__button modal__button--${action.variant || "secondary"}`;
    button.textContent = action.label;
    button.disabled = Boolean(action.disabled);
    if (action.action) button.dataset.modalAction = action.action;
    if (action.closes) button.dataset.modalClose = "";
    applyDataset(button, action.dataset);

    button.addEventListener("click", () => {
      button.dispatchEvent(new CustomEvent("modal:action", {
        bubbles: true,
        detail: { action: action.action || action.label, source: button },
      }));
    });

    return button;
  }

  function create({
    id,
    title,
    description = "",
    width,
    size,
    className = "",
    content,
    actions = [],
    closeLabel,
    closeIcon = CLOSE_ICON,
    closeButton = true,
    closeOnBackdrop = true,
    closeDataset = {},
    bodyClassName = "",
    footerClassName = "",
  } = {}) {
    const resolvedSize = MODAL_SIZES[size] ? size : width ? "" : DEFAULT_SIZE;
    const resolvedWidth = width || MODAL_SIZES[resolvedSize] || MODAL_SIZES[DEFAULT_SIZE];
    const dialog = document.createElement("dialog");
    dialog.className = ["modal", resolvedSize ? `modal--${resolvedSize}` : "", className].filter(Boolean).join(" ");
    dialog.dataset.modal = "";
    dialog.style.setProperty("--modal-width", normalizeWidth(resolvedWidth));
    if (id) dialog.id = id;
    if (closeOnBackdrop) dialog.dataset.modalCloseOnBackdrop = "";

    const baseId = id || `modal-${Math.random().toString(36).slice(2)}`;
    const titleId = `${baseId}-title`;
    const descriptionId = description ? `${baseId}-description` : "";
    dialog.setAttribute("aria-labelledby", titleId);
    if (descriptionId) dialog.setAttribute("aria-describedby", descriptionId);

    const surface = document.createElement("section");
    surface.className = "modal__surface";
    surface.autofocus = true;
    surface.tabIndex = -1;

    const header = document.createElement("header");
    header.className = "modal__header";

    const heading = document.createElement("div");
    heading.className = "modal__heading";

    const titleElement = document.createElement("h2");
    titleElement.className = "modal__title";
    titleElement.id = titleId;
    titleElement.textContent = title;
    heading.append(titleElement);

    if (description) {
      const descriptionElement = document.createElement("p");
      descriptionElement.className = "modal__description";
      descriptionElement.id = descriptionId;
      descriptionElement.textContent = description;
      heading.append(descriptionElement);
    }

    header.append(heading);

    if (closeButton) {
      const close = document.createElement("button");
      close.type = "button";
      close.className = "modal__close";
      close.dataset.modalClose = "";
      close.setAttribute("aria-label", closeLabel || `Close ${title || "modal"}`);
      applyDataset(close, closeDataset);

      const icon = document.createElement("img");
      icon.src = closeIcon;
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      close.append(icon);
      header.append(close);
    }

    const body = document.createElement("div");
    body.className = ["modal__body", bodyClassName].filter(Boolean).join(" ");
    body.dataset.modalBody = "";
    appendContent(body, content);

    surface.append(header, body);

    if (actions.length) {
      const footer = document.createElement("footer");
      footer.className = ["modal__footer", footerClassName].filter(Boolean).join(" ");
      actions.forEach((action) => footer.append(createAction(action)));
      surface.append(footer);
    }

    dialog.append(surface);
    wire(dialog);
    return dialog;
  }

  function open(dialog) {
    const modal = resolveDialog(dialog);
    if (modal && !modal.open) modal.showModal();
    return modal;
  }

  function close(dialog, returnValue) {
    const modal = resolveDialog(dialog);
    if (modal?.open) modal.close(returnValue);
    return modal;
  }

  function mount(target, options = {}) {
    const mountTarget = resolveTarget(target);
    if (!mountTarget) return undefined;
    const modal = create(options);
    mountTarget.replaceWith(modal);
    return modal;
  }

  function wire(root = document) {
    findAll(root, "[data-modal]").forEach((dialog) => {
      if (dialog.dataset.modalWired) return;
      dialog.dataset.modalWired = "true";
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog && dialog.hasAttribute("data-modal-close-on-backdrop")) close(dialog);
      });
    });

    findAll(root, "[data-modal-close]").forEach((control) => {
      if (control.dataset.modalCloseWired) return;
      control.dataset.modalCloseWired = "true";
      control.addEventListener("click", () => close(control.closest("[data-modal]")));
    });
  }

  const api = Object.freeze({ create, mount, wire, open, close, sizes: MODAL_SIZES });
  window.Modal = api;
  window.PlatformModal = api;
}());
