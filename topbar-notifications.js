(function () {
  const assets = {
    hamburger: "assets/icons/navigation/hamburger/size=24px,%20style=mono.svg",
    logo: "assets/thermo-fisher-mark.png",
    notifications: "assets/icons/notifications/bell/size=24px,%20style=mono.svg",
    profile: "assets/icons/users/profile/size=24px,%20style=mono.svg",
    help: "assets/icons/notifications/question/size=24px,%20style=mono.svg",
  };

  function iconButton(className, label, icon, attrs = "") {
    return `<button class="topbar-notifications__icon-button ${className}" type="button" aria-label="${label}" ${attrs}><img src="${icon}" alt="" /></button>`;
  }

  function create() {
    const topbar = document.createElement("header");
    topbar.className = "topbar-notifications";
    topbar.innerHTML = `
      <div class="topbar-notifications__left">
        ${iconButton("topbar-notifications__menu", "Open menu", assets.hamburger)}
        <img class="topbar-notifications__brand" src="${assets.logo}" alt="Thermo Fisher Scientific" />
        <span class="topbar-notifications__platform">Connect Platform</span>
        <strong class="topbar-notifications__title">Notification Settings</strong>
      </div>
      <div class="topbar-notifications__right">
        ${iconButton("", "Notifications", assets.notifications)}
        ${iconButton("", "User profile", assets.profile)}
        ${iconButton("", "Help", assets.help, "data-open-services-help data-help-source=\"notification-settings-topbar\"")}
      </div>
    `;
    return topbar;
  }

  function wire(root = document) {
    window.ServicesHelpModal?.wire(root);
  }

  function mount(target) {
    if (!target) return undefined;
    const topbar = create();
    target.replaceChildren(topbar);
    wire(topbar);
    return topbar;
  }

  window.TopbarNotifications = Object.freeze({
    assets,
    create,
    mount,
    wire,
  });
})();
