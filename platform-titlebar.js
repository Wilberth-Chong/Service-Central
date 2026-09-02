(function () {
  "use strict";

  const TITLEBAR_SELECTOR = "[data-platform-titlebar]";
  const COMPACT_CLASS = "is-platform-titlebar-compact";

  function addGoToTop(titlebar, scrollContainer) {
    const title = titlebar.querySelector("h1");
    const anchor = titlebar.querySelector("[data-platform-go-top-anchor]");
    const button = document.createElement("button");
    button.className = "platform-titlebar__go-top";
    button.type = "button";
    button.textContent = "Go to top";

    titlebar.classList.toggle("platform-titlebar--without-title", !title);
    if (anchor) {
      anchor.insertAdjacentElement("afterend", button);
    } else if (title) {
      let titleGroup = title;
      while (titleGroup.parentElement && titleGroup.parentElement !== titlebar) {
        titleGroup = titleGroup.parentElement;
      }
      titleGroup.insertAdjacentElement("afterend", button);
    } else {
      titlebar.prepend(button);
    }

    button.addEventListener("click", () => {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function wireCloneControls(titlebar, clone) {
    const sourceControls = titlebar.querySelectorAll("button, a");
    const cloneControls = clone.querySelectorAll("button, a");

    cloneControls.forEach((control, index) => {
      const sourceControl = sourceControls[index];
      if (!sourceControl) return;

      control.addEventListener("click", (event) => {
        event.preventDefault();
        const sourceRoute = sourceControl.getAttribute("data-route");
        const compactRoute = control.getAttribute("data-route");

        if (compactRoute) sourceControl.setAttribute("data-route", compactRoute);
        sourceControl.click();
        if (sourceRoute === null) sourceControl.removeAttribute("data-route");
        else sourceControl.setAttribute("data-route", sourceRoute);
      });
    });
  }

  function applyCompactOverrides(clone) {
    clone.querySelectorAll("[data-platform-titlebar-compact-label]").forEach((control) => {
      const label = control.dataset.platformTitlebarCompactLabel;
      const labelTarget = control.querySelector("span") || control;
      labelTarget.textContent = label;

      const route = control.dataset.platformTitlebarCompactRoute;
      if (route) control.dataset.route = route;
    });
  }

  function wireStickyTitlebar(titlebar, scrollContainer, triggerSelector) {
    const trigger = triggerSelector ? titlebar.querySelector(triggerSelector) : titlebar;
    if (!trigger) return false;

    const clone = titlebar.cloneNode(true);
    applyCompactOverrides(clone);
    wireCloneControls(titlebar, clone);
    clone.removeAttribute("data-platform-titlebar-trigger");
    clone.dataset.platformTitlebarWired = "true";
    clone.querySelectorAll("[data-platform-titlebar-deferred-hide]").forEach((element) => element.remove());
    clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    clone.classList.add("platform-titlebar__deferred");

    const host = document.createElement("div");
    host.className = `platform-titlebar__sticky-host ${COMPACT_CLASS}`;
    host.setAttribute("aria-hidden", "true");
    host.append(clone);

    titlebar.classList.add("platform-titlebar--deferred-source");
    titlebar.insertAdjacentElement("afterend", host);
    addGoToTop(clone, scrollContainer);

    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const triggerRect = trigger.getBoundingClientRect();
        const sourceRect = titlebar.getBoundingClientRect();
        const triggerGap = Math.max(0, sourceRect.bottom - triggerRect.bottom);
        const triggerIsOutOfView = triggerRect.bottom <= scrollContainer.getBoundingClientRect().top;
        host.style.setProperty("--platform-titlebar-trigger-gap", `${triggerGap}px`);
        host.classList.toggle("is-visible", triggerIsOutOfView);
        host.setAttribute("aria-hidden", String(!triggerIsOutOfView));
      });
    };

    scrollContainer.addEventListener("scroll", update, { passive: true });
    update();
    return true;
  }

  function wire(root = document) {
    root.querySelectorAll(TITLEBAR_SELECTOR).forEach((titlebar) => {
      if (titlebar.dataset.platformTitlebarWired === "true") return;

      const scrollContainer = titlebar.closest(".platform-page-body, .mi-main");
      if (!scrollContainer) return;

      titlebar.dataset.platformTitlebarWired = "true";
      const triggerSelector = titlebar.dataset.platformTitlebarTrigger;
      wireStickyTitlebar(titlebar, scrollContainer, triggerSelector);
    });
  }

  window.PlatformTitlebar = Object.freeze({ wire });
})();
