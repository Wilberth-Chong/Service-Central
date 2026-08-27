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

  function wireDeferredTitlebar(titlebar, scrollContainer, triggerSelector) {
    const trigger = titlebar.querySelector(triggerSelector);
    if (!trigger) return false;

    const clone = titlebar.cloneNode(true);
    clone.removeAttribute("data-platform-titlebar");
    clone.removeAttribute("data-platform-titlebar-trigger");
    clone.removeAttribute("data-platform-titlebar-wired");
    clone.querySelectorAll("[data-platform-titlebar-deferred-hide]").forEach((element) => element.remove());
    clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    clone.classList.add("platform-titlebar__deferred");
    titlebar.classList.add("platform-titlebar--deferred-source");
    titlebar.insertAdjacentElement("afterend", clone);
    addGoToTop(clone, scrollContainer);

    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const triggerRect = trigger.getBoundingClientRect();
        const sourceRect = titlebar.getBoundingClientRect();
        const triggerGap = Math.max(0, sourceRect.bottom - triggerRect.bottom);
        const triggerIsOutOfView = trigger.getBoundingClientRect().bottom <= scrollContainer.getBoundingClientRect().top;
        clone.style.setProperty("--platform-titlebar-trigger-gap", `${triggerGap}px`);
        clone.classList.toggle("is-visible", triggerIsOutOfView);
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
      if (triggerSelector && wireDeferredTitlebar(titlebar, scrollContainer, triggerSelector)) return;

      addGoToTop(titlebar, scrollContainer);
      let frame = 0;
      const update = () => {
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          scrollContainer.classList.toggle(COMPACT_CLASS, scrollContainer.scrollTop > 0);
        });
      };

      scrollContainer.addEventListener("scroll", update, { passive: true });
      update();
    });
  }

  window.PlatformTitlebar = Object.freeze({ wire });
})();
