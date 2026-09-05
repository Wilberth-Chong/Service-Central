(function () {
  const TOPBAR_SC_ASSETS = Object.freeze({
    hamburger: "assets/icons/navigation/hamburger/size=24px, style=mono.svg",
    logo: "assets/thermo-fisher-mark.png",
    notifications: "assets/icons/notifications/bell/size=24px, style=mono.svg",
    profile: "assets/icons/users/profile/size=24px, style=mono.svg",
    initials: "assets/header/liu-initials.svg",
  });

  const LOGGED_IN_USER = Object.freeze({
    firstName: "My",
    lastName: "Name",
    email: "my_name.lastname@company.com",
    initials: "MN",
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
    user = LOGGED_IN_USER,
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
      className: "topbar-sc__icon-button topbar-sc__profile-button",
      icon: TOPBAR_SC_ASSETS.profile,
      label: "User profile",
      dataset: { topbarScProfile: "" },
    });
    profile.setAttribute("aria-haspopup", "menu");
    profile.setAttribute("aria-expanded", "false");

    const profileMenu = createProfileMenu(user);
    profile.setAttribute("aria-controls", profileMenu.id);

    right.append(notifications, divider, profile, profileMenu);

    topbar.append(left, right);
    return topbar;
  }

  function createProfileMenu(user = LOGGED_IN_USER) {
    const menu = document.createElement("section");
    menu.className = "topbar-sc__profile-menu";
    menu.id = "topbar-sc-profile-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "User profile");
    menu.hidden = true;
    menu.innerHTML = `
      <div class="topbar-sc__profile-identity">
        <span class="topbar-sc__profile-initials"><img src="${TOPBAR_SC_ASSETS.initials}" alt="" /><span>${user.initials}</span></span>
        <a href="mailto:${user.email}">${user.email}</a>
      </div>
      <button class="topbar-sc__profile-row" type="button" role="menuitem">Account</button>
      <button class="topbar-sc__profile-row" type="button" role="menuitem">Profile</button>
      <div class="topbar-sc__storage">
        <span class="topbar-sc__storage-bar" aria-hidden="true"></span>
        <div><span>0% used</span><span>0 B of 1.0 TB</span></div>
        <button type="button">Get more storage</button>
      </div>
      <button class="topbar-sc__profile-row topbar-sc__sign-out" type="button" role="menuitem">Sign out</button>`;
    return menu;
  }

  function ensureProfileMenu(profile) {
    const host = profile.parentElement;
    let menu = host.querySelector(":scope > .topbar-sc__profile-menu");
    if (!menu) {
      menu = createProfileMenu();
      host.append(menu);
      profile.setAttribute("aria-haspopup", "menu");
      profile.setAttribute("aria-controls", menu.id);
      profile.setAttribute("aria-expanded", "false");
    }
    return menu;
  }

  function closeProfileMenus(exceptProfile) {
    document.querySelectorAll("[data-topbar-sc-profile], .mi-header button[aria-label='User profile']").forEach((profile) => {
      if (profile === exceptProfile) return;
      profile.setAttribute("aria-expanded", "false");
      const menu = profile.parentElement?.querySelector(":scope > .topbar-sc__profile-menu");
      if (menu) menu.hidden = true;
    });
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
    root.querySelectorAll("[data-topbar-sc-profile], .mi-header button[aria-label='User profile']").forEach((profile) => {
      if (profile.dataset.topbarScProfileWired) return;
      profile.dataset.topbarScProfileWired = "true";
      const menu = ensureProfileMenu(profile);
      profile.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = profile.getAttribute("aria-expanded") !== "true";
        closeProfileMenus(open ? profile : undefined);
        profile.setAttribute("aria-expanded", String(open));
        menu.hidden = !open;
      });
      menu.addEventListener("click", (event) => event.stopPropagation());
      menu.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        menu.hidden = true;
        profile.setAttribute("aria-expanded", "false");
        profile.focus();
      });
    });
  }

  document.addEventListener("click", () => closeProfileMenus());

  window.TopbarSc = {
    assets: TOPBAR_SC_ASSETS,
    create: createTopbar,
    loggedInUser: LOGGED_IN_USER,
    mount,
    wire,
  };
})();
