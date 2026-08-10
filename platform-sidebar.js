(function () {
  const PLATFORM_ICON_PATHS = Object.freeze({
    dashboard: "assets/icons/navigation/dashboard/Size=24px, Style=Mono.svg",
    instruments: "assets/icons/science/instrument/Size=24px, Style=Mono.svg",
    addInstruments: "assets/icons/science/add instrument/size=24px, style=mono.svg",
    installations: "assets/icons/general/installations/size=24px, style=mono.svg",
    supportHistory: "assets/icons/navigation/support/size=24px, style=mono.svg",
    servicePlanContacts: "assets/icons/general/coverage contact/ size=24px, style=mono.svg",
    consumables: "assets/icons/commerce/cart/Size=24px, Style=Mono.svg",
    notifications: "assets/icons/navigation/bell settings/size=24px, style=mono.svg",
    help: "assets/icons/notifications/question/size=24px, style=mono.svg",
    collapse: "assets/icons/general/expanded panel/size=24px, style=mono.svg",
  });

  const PLATFORM_SIDEBAR_ITEMS = Object.freeze([
    {
      id: "dashboard",
      label: "Services Central dashboard",
      route: "dashboard",
      icon: "dashboard",
    },
    {
      id: "instruments",
      label: "Instruments",
      route: "my-instruments",
      icon: "instruments",
    },
    {
      id: "add-instruments",
      label: "Add instruments",
      route: "add-instruments",
      icon: "addInstruments",
    },
    {
      id: "installations",
      label: "Installations",
      route: "installations",
      activeRoutes: ["installations", "installations-expanded"],
      icon: "installations",
    },
    {
      id: "support-history",
      label: "Support history",
      route: "support-history",
      activeRoutes: ["support-history", "ticket-detail", "request-support", "instrument-support-selection"],
      icon: "supportHistory",
    },
    {
      id: "service-plan-contacts",
      label: "Service plan contacts",
      route: "service-plan-contacts",
      activeRoutes: ["service-plan-contacts", "edit-spc"],
      icon: "servicePlanContacts",
    },
    {
      id: "consumables",
      label: "Consumables",
      route: "consumables",
      icon: "consumables",
    },
    {
      id: "notifications",
      label: "Services Central notifications",
      route: "notifications",
      icon: "notifications",
    },
    {
      id: "help",
      label: "Services Central help",
      action: "services-help",
      icon: "help",
    },
  ]);

  function iconCssUrl(iconName) {
    const path = PLATFORM_ICON_PATHS[iconName];
    if (!path) return "";
    return `url("${path.replace(/"/g, '\\"')}")`;
  }

  function isActiveItem(item, activeRoute) {
    return item.route === activeRoute || item.activeRoutes?.includes(activeRoute);
  }

  function createSidebarItem(item, activeRoute) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "platform-sidebar__item";
    button.setAttribute("aria-label", item.label);
    button.title = item.label;

    if (item.route) button.dataset.route = item.route;
    if (item.action === "services-help") button.dataset.openServicesHelp = "";
    if (isActiveItem(item, activeRoute)) {
      button.classList.add("is-active");
      button.setAttribute("aria-current", "page");
    }

    const icon = document.createElement("span");
    icon.className = "platform-sidebar__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.style.setProperty("--platform-sidebar-icon", iconCssUrl(item.icon));

    const label = document.createElement("span");
    label.className = "platform-sidebar__label";
    label.textContent = item.label;

    button.append(icon, label);
    return button;
  }

  function createCollapseButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "platform-sidebar__item platform-sidebar__item--collapse";
    button.dataset.platformSidebarToggle = "";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Expand navigation");
    button.title = "Collapse navigation";

    const icon = document.createElement("span");
    icon.className = "platform-sidebar__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.style.setProperty("--platform-sidebar-icon", iconCssUrl("collapse"));

    const label = document.createElement("span");
    label.className = "platform-sidebar__label";
    label.textContent = "Collapse";

    button.append(icon, label);
    return button;
  }

  function createSidebar({ activeRoute = "dashboard", collapsed = true } = {}) {
    const sidebar = document.createElement("aside");
    sidebar.className = "platform-sidebar";
    sidebar.dataset.platformSidebar = "";
    sidebar.setAttribute("aria-label", "Services Central navigation");
    if (collapsed) sidebar.classList.add("is-collapsed");

    PLATFORM_SIDEBAR_ITEMS.forEach((item) => {
      sidebar.append(createSidebarItem(item, activeRoute));
    });
    sidebar.append(createCollapseButton());
    return sidebar;
  }

  function setCollapsed(sidebar, collapsed) {
    sidebar.classList.toggle("is-collapsed", collapsed);

    sidebar.querySelectorAll("[data-platform-sidebar-toggle]").forEach((toggle) => {
      toggle.setAttribute("aria-expanded", String(!collapsed));
      toggle.setAttribute("aria-label", collapsed ? "Expand navigation" : "Collapse navigation");
      toggle.title = collapsed ? "Expand navigation" : "Collapse navigation";
    });
  }

  function mount(target, options) {
    const mountTarget = typeof target === "string" ? document.querySelector(target) : target;
    if (!mountTarget) return undefined;

    const sidebar = createSidebar(options);
    mountTarget.replaceWith(sidebar);
    return sidebar;
  }

  function wire(root = document) {
    root.querySelectorAll("[data-platform-sidebar]").forEach((sidebar) => {
      const sidebarControls = sidebar.querySelectorAll("[data-platform-sidebar-toggle]");

      setCollapsed(sidebar, sidebar.classList.contains("is-collapsed"));

      sidebarControls.forEach((control) => {
        if (control.dataset.platformSidebarWired) return;
        control.dataset.platformSidebarWired = "true";
        control.addEventListener("click", () => {
          setCollapsed(sidebar, !sidebar.classList.contains("is-collapsed"));
        });
      });
    });
  }

  window.PlatformIcons = PLATFORM_ICON_PATHS;
  window.PlatformSidebar = {
    create: createSidebar,
    iconPaths: PLATFORM_ICON_PATHS,
    items: PLATFORM_SIDEBAR_ITEMS,
    mount,
    setCollapsed,
    wire,
  };
})();
