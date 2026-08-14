(function () {
  const DEFAULT_LINKS = [
    { href: "#privacy", label: "Privacy policy" },
    { href: "#terms", label: "Terms of use" },
  ];

  const DEFAULT_OPTIONS = {
    ariaLabel: "Thermo Fisher Scientific footer",
    copyright: "\u00a9 2025 - Thermo Fisher Scientific",
    links: DEFAULT_LINKS,
  };

  function createLink({ href, label }) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    return link;
  }

  function create(options = {}) {
    const config = { ...DEFAULT_OPTIONS, ...options };
    const footer = document.createElement("footer");
    footer.className = ["footer", config.className].filter(Boolean).join(" ");
    footer.setAttribute("aria-label", config.ariaLabel);

    const copyright = document.createElement("span");
    copyright.className = "footer__copyright";
    copyright.textContent = config.copyright;
    footer.append(copyright);

    if (config.links?.length) {
      const divider = document.createElement("i");
      divider.className = "footer__divider";
      divider.setAttribute("aria-hidden", "true");
      footer.append(divider);
      config.links.forEach((link) => footer.append(createLink(link)));
    }

    return footer;
  }

  function wire(root = document) {
    return root;
  }

  function mount(target, options = {}) {
    if (!target) return null;
    const footer = create(options);
    target.replaceChildren(footer);
    wire(footer);
    return footer;
  }

  window.Footer = Object.freeze({ create, mount, wire });
}());
