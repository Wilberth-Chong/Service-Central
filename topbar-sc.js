(function () {
  const TOPBAR_SC_ASSETS = Object.freeze({
    hamburger: "assets/icons/navigation/hamburger/size=24px, style=mono.svg",
    logo: "assets/thermo-fisher-mark.png",
    notifications: "assets/icons/notifications/bell/size=24px, style=mono.svg",
    profile: "assets/icons/users/profile/size=24px, style=mono.svg",
  });

  function createIconButton({ className, icon, label, dataset = {} }) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.setAttribute("aria-label", label);

    Object.entries(dataset).forEach(([key, value]) => {
      button.dataset[key] = value;
    });

    const image = document.createElement("img");
    image.src = icon;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    button.append(image);

    return button;
  }

  function createTopbar({
    platformLabel = "Connect Platform",
    productLabel = "Services Central",
    notificationCount = "2",
  } = {}) {
    const topbar = document.createElement("header");
    topbar.className = "topbar-sc";
    topbar.dataset.topbarSc = "";

    const left = document.createElement("div");
    left.className = "topbar-sc__left";

    const menu = createIconButton({
      className: "topbar-sc__icon-button",
      icon: TOPBAR_SC_ASSETS.hamburger,
      label: "Open menu",
      dataset: { topbarScMenu: "" },
    });

    const logo = document.createElement("img");
    logo.className = "topbar-sc__logo";
    logo.src = TOPBAR_SC_ASSETS.logo;
    logo.alt = "Thermo Fisher Scientific";

    const platform = document.createElement("span");
    platform.className = "topbar-sc__platform";
    platform.textContent = platformLabel;

    const product = document.createElement("strong");
    product.className = "topbar-sc__product";
    product.textContent = productLabel;

    left.append(menu, logo, platform, product);

    const right = document.createElement("div");
    right.className = "topbar-sc__right";

    const notifications = createIconButton({
      className: "topbar-sc__icon-button topbar-sc__notifications",
      icon: TOPBAR_SC_ASSETS.notifications,
      label: "Notifications",
      dataset: { topbarScNotifications: "" },
    });

    if (notificationCount !== false && notificationCount !== null && notificationCount !== undefined) {
      const badge = document.createElement("span");
      badge.className = "topbar-sc__badge";
      badge.textContent = String(notificationCount);
      notifications.append(badge);
    }

    const divider = document.createElement("span");
    divider.className = "topbar-sc__action-divider";
    divider.setAttribute("aria-hidden", "true");

    const profile = createIconButton({
      className: "topbar-sc__icon-button",
      icon: TOPBAR_SC_ASSETS.profile,
      label: "User profile",
      dataset: { topbarScProfile: "" },
    });

    right.append(notifications, divider, profile);

    topbar.append(left, right);
    return topbar;
  }

  function mount(target, options) {
    const mountTarget = typeof target === "string" ? document.querySelector(target) : target;
    if (!mountTarget) return undefined;

    const topbar = createTopbar(options);
    mountTarget.replaceWith(topbar);
    return topbar;
  }

  function wire(root = document) {
    window.ServicesHelpModal?.wire(root);
  }

  window.TopbarSc = {
    assets: TOPBAR_SC_ASSETS,
    create: createTopbar,
    mount,
    wire,
  };
})();
