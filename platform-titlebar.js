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

  function wire(root = document) {
    root.querySelectorAll(TITLEBAR_SELECTOR).forEach((titlebar) => {
      if (titlebar.dataset.platformTitlebarWired === "true") return;

      const scrollContainer = titlebar.closest(".platform-page-body, .mi-main");
      if (!scrollContainer) return;

      titlebar.dataset.platformTitlebarWired = "true";
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
