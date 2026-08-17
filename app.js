const app = document.querySelector("#app");
const helpDialog = document.querySelector("#help-dialog");
const servicesHelpDialog = document.querySelector("#services-help-dialog");
const flowsDialog = document.querySelector("#flows-dialog");
const flowsGrid = document.querySelector("[data-flows-grid]");
const toast = document.querySelector(".toast");
let toastTimer;
let selectedOpenSupportTicketInstrument = null;

const CUSTOM_ROUTES = {
  "edit-spc": "Edit service plan contact",
};

let spcResizeObserver;

const ROUTES = {
  "my-instruments": { title: "My instruments", src: "assets/flows/my-instruments.png", width: 1440, height: 1460, kind: "app" },
  "add-instruments": { title: "Add instruments", src: "assets/flows/add-instruments.png", width: 1440, height: 1460, kind: "app" },
  installations: { title: "Installations", src: "assets/flows/installations.png", width: 1440, height: 2900, kind: "app" },
  "installations-expanded": { title: "Installations — order 9012611245", src: "assets/flows/installations-expanded.png", width: 1440, height: 2900, kind: "app" },
  "support-history": { title: "Support request history", src: "assets/flows/support-history.png", width: 1440, height: 1460, kind: "app" },
  "service-plan-contacts": { title: "Service plan contacts", src: "assets/flows/service-plan-contacts.png", width: 1440, height: 1800, kind: "app" },
  "request-support": { title: "Request support", src: "assets/flows/request-support.png", width: 1440, height: 1460, kind: "app" },
  "request-pm": { title: "Request PM scheduling", src: "assets/flows/request-pm.png", width: 1440, height: 1500, kind: "app" },
  "request-serviceplan": { title: "Request a service plan quote", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "request-qualification": { title: "Request qualification service", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "request-calibration": { title: "Request a calibration service", src: "assets/flows/request-support.png", width: 1440, height: 1623, kind: "app" },
  "request-installation": { title: "Installation support", src: "assets/flows/request-support.png", width: 1440, height: 1623, kind: "app" },
  "open-support-ticket": { title: "Open a support ticket", src: "assets/flows/instrument-support-selection.png", width: 1440, height: 2339, kind: "app" },
  "open-support-ticket-details": { title: "Open a support ticket — add request details", src: "assets/flows/instrument-support-selection.png", width: 1440, height: 2339, kind: "app" },
  notifications: { title: "Notification settings", src: "assets/flows/notifications.png", width: 1440, height: 2200, kind: "app" },
  consumables: { title: "Consumables", src: "assets/flows/consumables.png", width: 1440, height: 2200, kind: "app" },
  education: { title: "Browse education", src: "assets/flows/education.png", width: 1440, height: 1460, kind: "external" },
  "ticket-detail": { title: "Support ticket detail", src: "assets/flows/ticket-detail.png", width: 1456, height: 2069, kind: "app" },
  "tech-support-summary": { title: "Tech support summary", src: "assets/flows/ticket-detail.png", width: 1440, height: 1623, kind: "app" },
  "service-requests-summary": { title: "Service request summary", src: "assets/flows/ticket-detail.png", width: 1440, height: 1623, kind: "app" },
  "pm-summary": { title: "Preventive maintenance summary", src: "assets/flows/ticket-detail.png", width: 1440, height: 1623, kind: "app" },
  "closed-summary": { title: "Closed ticket summary", src: "assets/flows/ticket-detail.png", width: 1440, height: 1623, kind: "app" },
  "user-not-mapped": { title: "From sign in — user not mapped", src: "assets/flows/user-not-mapped.png", width: 1440, height: 1090, kind: "signin", cta: { x: 204, y: 452, w: 392, h: 53, route: "add-instruments", label: "Continue user-not-mapped flow" } },
  "installation-order": { title: "From installation order ready", src: "assets/flows/installation-order.png", width: 600, height: 941, kind: "email", cta: { x: 56, y: 428, w: 198, h: 42, route: "request-support", label: "View installation order" } },
  "service-plan-approval": { title: "From service plan contact approval", src: "assets/flows/service-plan-approval.png", width: 600, height: 1494, kind: "email", cta: { x: 56, y: 375, w: 184, h: 42, route: "my-instruments", label: "Review and confirm" } },
  "ticket-status-email": { title: "From ticket status email", src: "assets/flows/ticket-status-email.png", width: 600, height: 1160, kind: "email", cta: { x: 56, y: 350, w: 178, h: 42, route: "ticket-detail", label: "View support ticket" } },
  "ticket-invite": { title: "From ticket-based onboard invite", src: "assets/flows/ticket-invite.png", width: 600, height: 1457, kind: "email", cta: { x: 56, y: 385, w: 152, h: 42, route: "instrument-access", label: "Add instrument" } },
  "instrument-access": { title: "From instrument access — user tab", src: "assets/flows/instrument-access.png", width: 1440, height: 2000, kind: "app" },
  "pm-cycle": { title: "From PM Cycle", src: "assets/flows/pm-cycle.png", width: 1440, height: 2000, kind: "app", cta: { x: 1190, y: 590, w: 204, h: 40, route: "request-support", label: "Request PM scheduling" } },
  multiuse: { title: "From multiuse system — edit/share", src: "assets/flows/multiuse.png", width: 1440, height: 2000, kind: "app" },
  "approval-email": { title: "From approval email", src: "assets/flows/approval-email.png", width: 600, height: 1305, kind: "email", cta: { x: 232, y: 354, w: 136, h: 42, route: "my-instruments", label: "View request" } },
  "europe-le": { title: "Europe — LE dashboard", src: "assets/flows/europe-le.png", width: 1440, height: 2537, kind: "dashboard" },
  "north-america-cmd": { title: "North America — CMD dashboard", src: "assets/flows/north-america-cmd.png", width: 1440, height: 2537, kind: "dashboard" },
  "korea-cmd": { title: "Korea — CMD dashboard", src: "assets/flows/korea-cmd.png", width: 1440, height: 2537, kind: "dashboard" },
};

const FLOW_MENU = [
  ["From sign In", "signin"],
  ["From sign in (user not mapped)", "user-not-mapped"],
  ["From installation order ready", "installation-order"],
  ["From service plan contact approval", "service-plan-approval"],
  ["From ticket status email", "ticket-status-email"],
  ["From ticket-based onboard invite", "ticket-invite"],
  ["From instrument access (user tab)", "instrument-access"],
  ["From PM Cycle", "pm-cycle"],
  ["From multiuse sys (Edit/share)", "multiuse"],
  ["From approval email", "approval-email"],
  ["Other — Europe — LE", "europe-le"],
  ["Other — North America — CMD", "north-america-cmd"],
  ["Other — Korea — CMD", "korea-cmd"],
  ["My instruments", "my-instruments"],
  ["Add instruments", "add-instruments"],
  ["Installations", "installations"],
  ["Installations — order 9012611245 expanded", "installations-expanded"],
  ["Support history", "support-history"],
  ["Service plan contacts", "service-plan-contacts"],
  ["Edit service plan contact", "edit-spc"],
  ["Request support", "request-support"],
  ["Request PM scheduling", "request-pm"],
  ["Request a service plan quote", "request-serviceplan"],
  ["Request qualification service", "request-qualification"],
  ["Request a calibration service", "request-calibration"],
  ["Installation support", "request-installation"],
  ["Notification settings", "notifications"],
  ["Consumables", "consumables"],
  ["Browse education", "education"],
  ["Support ticket detail", "ticket-detail"],
];

const APP_NAV = [
  ["Dashboard", "dashboard"],
  ["My instruments", "my-instruments"],
  ["Add instruments", "add-instruments"],
  ["Installations", "installations"],
  ["Support history", "support-history"],
  ["Service plan contacts", "service-plan-contacts"],
  ["Consumables", "consumables"],
  ["Settings", "notifications"],
  ["Get help", null, "services-help"],
];

const DASHBOARD_HOTSPOTS = [
  { label: "Start a request", route: "request-support", x: 1194, y: 92, w: 196, h: 42 },
  { label: "Go to pending access requests", route: "approval-email", x: 1210, y: 166, w: 160, h: 42 },
  { label: "Search instruments, groups and tickets", route: "my-instruments", x: 84, y: 329, w: 1272, h: 52 },
  { label: "Order consumables", route: "consumables", x: 88, y: 452, w: 304, h: 128 },
  { label: "Browse education", route: "education", x: 426, y: 452, w: 304, h: 128 },
  { label: "Request service plan", route: "service-plan-approval", x: 764, y: 452, w: 304, h: 128 },
  { label: "Request maintenance or support", route: "request-support", x: 1102, y: 452, w: 304, h: 128 },
  { label: "Support request history", route: "support-history", x: 365, y: 870, w: 235, h: 42 },
  { label: "View all my instruments", route: "my-instruments", x: 360, y: 1846, w: 240, h: 42 },
];

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

function openServicesHelpModal(trigger) {
  if (servicesHelpDialog.open) return;
  servicesHelpDialog.dataset.openedBy = trigger?.dataset.helpSource || trigger?.getAttribute("aria-label") || "";
  servicesHelpDialog.showModal();
}

function closeServicesHelpModal() {
  if (servicesHelpDialog.open) servicesHelpDialog.close();
}

function wireServicesHelpTriggers(scope = document) {
  scope.querySelectorAll("[data-open-services-help]").forEach((control) => {
    if (control.dataset.servicesHelpWired) return;
    control.dataset.servicesHelpWired = "true";
    control.addEventListener("click", () => openServicesHelpModal(control));
  });
}

window.ServicesHelpModal = Object.freeze({
  open: openServicesHelpModal,
  close: closeServicesHelpModal,
  wire: wireServicesHelpTriggers,
});

function routeFromHash() {
  const route = window.location.hash.replace(/^#\/?/, "");
  if (route === "dashboard" || route === "signin" || ROUTES[route] || CUSTOM_ROUTES[route]) return route;
  return "signin";
}

let selectedSupportHistoryTicket = null;

function setRoute(route, summaryTicket = null) {
  selectedSupportHistoryTicket = summaryTicket;
  const safeRoute = route === "dashboard" || route === "signin" || ROUTES[route] || CUSTOM_ROUTES[route] ? route : "signin";
  const nextHash = `#${safeRoute}`;
  if (window.location.hash !== nextHash) window.history.pushState({}, "", nextHash);
  render();
}

function addHotspot(canvas, screen, hotspot, extraClass = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `hotspot flow-hotspot ${extraClass}`.trim();
  if (hotspot.route) button.dataset.route = hotspot.route;
  if (hotspot.action === "services-help") button.dataset.openServicesHelp = "";
  button.setAttribute("aria-label", hotspot.label);
  button.style.left = `${(hotspot.x / screen.width) * 100}%`;
  button.style.top = `${(hotspot.y / screen.height) * 100}%`;
  button.style.width = `${(hotspot.w / screen.width) * 100}%`;
  button.style.height = `${(hotspot.h / screen.height) * 100}%`;
  canvas.append(button);
}

function addAppNavigation(canvas, screen) {
  APP_NAV.forEach(([label, route, action], index) => {
    addHotspot(canvas, screen, { label, route, action, x: 0, y: 64 + index * 48, w: 56, h: 48 });
  });
}

function addScreenSpecificHotspots(canvas, route, screen) {
  if (screen.kind === "dashboard") {
    addAppNavigation(canvas, screen);
    DASHBOARD_HOTSPOTS.forEach((hotspot) => addHotspot(canvas, screen, hotspot));
  } else if (screen.kind === "app") {
    addAppNavigation(canvas, screen);
  }

  if (screen.cta) addHotspot(canvas, screen, screen.cta, "flow-cta");

  const extras = {
    "my-instruments": [
      { label: "Start a request", route: "request-support", x: 1229, y: 94, w: 178, h: 29 },
      { label: "Open instrument", route: "instrument-access", x: 88, y: 408, w: 1320, h: 120 },
    ],
    "add-instruments": [{ label: "Continue adding instruments", route: "instrument-access", x: 810, y: 1052, w: 150, h: 48 }],
    "installations": [{ label: "Expand order 9012611245", route: "installations-expanded", x: 88, y: 270, w: 1320, h: 72 }],
    "installations-expanded": [{ label: "Collapse order 9012611245", route: "installations", x: 88, y: 270, w: 1320, h: 72 }],
    "support-history": [{ label: "Open support ticket", route: "ticket-detail", x: 88, y: 455, w: 1320, h: 72 }],
    "service-plan-contacts": [
      { label: "Edit service plan contact", route: "edit-spc", x: 1168, y: 95, w: 210, h: 40 },
      { label: "Edit contact for selected instruments", route: "edit-spc", x: 1110, y: 725, w: 116, h: 32 },
      { label: "Edit contact for instruments with no service plan", route: "edit-spc", x: 1110, y: 765, w: 116, h: 32 },
    ],
    "request-support": [
      { label: "Open a support ticket", route: "open-support-ticket", x: 730, y: 348, w: 210, h: 50 },
      { label: "Request preventive maintenance", route: "request-pm", x: 730, y: 483, w: 210, h: 50 },
      { label: "Request a service plan", route: "service-plan-approval", x: 730, y: 618, w: 210, h: 50 },
      { label: "Installation support", route: "installation-order", x: 730, y: 888, w: 210, h: 50 },
    ],
    "instrument-access": [
      { label: "Start a request", route: "request-support", x: 1122, y: 97, w: 166, h: 27 },
      { label: "View PM cycle", route: "pm-cycle", x: 56, y: 534, w: 1384, h: 128 },
    ],
    multiuse: [{ label: "Open first instrument", route: "instrument-access", x: 88, y: 520, w: 304, h: 390 }],
    "ticket-detail": [{ label: "View quote", route: "installation-order", x: 980, y: 575, w: 110, h: 42 }],
    education: [{ label: "Return to dashboard", route: "dashboard", x: 0, y: 0, w: 1440, h: 1460 }],
  };

  (extras[route] || []).forEach((hotspot) => addHotspot(canvas, screen, hotspot));
}

function wireRouteControls(scope = app) {
  scope.querySelectorAll("[data-route]").forEach((control) => {
    control.addEventListener("click", () => setRoute(control.dataset.route));
  });
  scope.querySelectorAll("[data-open-flows]").forEach((control) => {
    control.addEventListener("click", () => flowsDialog.showModal());
  });
  window.ServicesHelpModal.wire(scope);
}

function wireSignIn() {
  app.querySelector("[data-signin-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    setRoute("dashboard");
  });
  app.querySelector("[data-help]").addEventListener("click", () => helpDialog.showModal());
}

function wireDashboard() {
  app.querySelector("[data-back-to-signin]")?.addEventListener("click", () => setRoute("signin"));
  app.querySelector("[data-dashboard-search]")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") setRoute("my-instruments");
  });
  app.querySelectorAll(".db-tabs [role='tab']").forEach((tab) => {
    tab.addEventListener("click", () => {
      app.querySelectorAll(".db-tabs [role='tab']").forEach((candidate) => {
        const selected = candidate === tab;
        candidate.classList.toggle("is-active", selected);
        candidate.setAttribute("aria-selected", String(selected));
      });
      const ticketCounts = {
        active: "16 active tickets",
        closed: "2 recently closed tickets",
        visits: "3 upcoming on-site visits",
      };
      const ticketCount = app.querySelector("[data-ticket-count]");
      if (ticketCount) ticketCount.textContent = ticketCounts[tab.dataset.ticketState] || ticketCounts.active;
    });
  });
  let bannerIndex = 0;
  const updateBanner = () => {
    app.querySelectorAll(".db-banner .ai-banner__dots span").forEach((dot, index) => dot.classList.toggle("is-active", index === bannerIndex));
    app.querySelector(".db-banner .ai-banner__dots")?.setAttribute("aria-label", `Notification ${bannerIndex + 1} of 3`);
  };
  app.querySelector("[data-db-banner-prev]")?.addEventListener("click", () => { bannerIndex = (bannerIndex + 2) % 3; updateBanner(); });
  app.querySelector("[data-db-banner-next]")?.addEventListener("click", () => { bannerIndex = (bannerIndex + 1) % 3; updateBanner(); });
  app.querySelector(".db-promo__close")?.addEventListener("click", (event) => event.currentTarget.closest(".db-promo")?.remove());
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function disconnectEditSpcCanvas() {
  if (spcResizeObserver) {
    spcResizeObserver.disconnect();
    spcResizeObserver = undefined;
  }
}

function syncEditSpcCanvas() {
  const canvas = app.querySelector(".flow-canvas--spc");
  const shell = app.querySelector(".spc-shell");
  if (!canvas || !shell) return;
  shell.style.setProperty("--spc-scale", canvas.clientWidth / 1440);
}

function observeEditSpcCanvas() {
  disconnectEditSpcCanvas();
  const canvas = app.querySelector(".flow-canvas--spc");
  if (!canvas) return;
  syncEditSpcCanvas();
  spcResizeObserver = new ResizeObserver(syncEditSpcCanvas);
  spcResizeObserver.observe(canvas);
}

function mountPlatformSidebar(activeRoute) {
  window.PlatformSidebar?.mount(app.querySelector("[data-platform-sidebar-mount]"), {
    activeRoute,
    collapsed: true,
  });
}

function wireEditSpc() {
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  app.querySelectorAll("[data-spc-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      app.querySelectorAll("[data-spc-filter]").forEach((filter) => filter.classList.remove("is-selected"));
      button.classList.add("is-selected");
    });
  });
  app.querySelector("[data-spc-continue]").addEventListener("click", () => {
    showToast("Continue to contact details");
  });
}

function renderEditSpc() {
  const template = document.querySelector("#edit-spc-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("edit-spc");
  wireEditSpc();
  observeEditSpcCanvas();
  document.title = "Edit service plan contact — Services Central";
}

const MY_INSTRUMENTS = [
  { image: "vanquish-detector.png", serial: "1009996", nickname: "Detector-2B", users: "3", group: "—", model: "VQF0000DET", coverage: "Under contract", end: "24 Dec 2025", locked: true },
  { image: "vanquish-column.png", serial: "1009999", nickname: "Column-2B", users: "3", group: "—", model: "VQH0000VEN", coverage: "Coverage expired", end: "24 Dec 2022", locked: true },
  { image: "vanquish-sampler.png", serial: "1009998", nickname: "Sampler-2B", users: "3", group: "—", model: "VQF00SAMPL", coverage: "Coverage expired", end: "24 Dec 2022", locked: true },
  { image: "vanquish-pump.png", serial: "1009997", nickname: "Pump-2B", users: "3", group: "—", model: "VQF000PUMP", coverage: "Coverage expired", end: "29 Dec 2022", locked: true },
  { image: "tsq.png", serial: "TSQ-Z-12346", nickname: "TSQ-0", users: "3", group: "—", model: "MSTSQQUANTISPLUS", coverage: "Expiring soon", end: "29 Mar 2024", locked: true },
  { image: "tsq.png", serial: "TSQ-Z-12347", nickname: "TSQ-1", users: "4", group: "—", model: "MSTSQQUANTISPLUS", coverage: "Coverage expired", end: "29 Mar 2023" },
  { image: "tsq.png", serial: "TSQ-Z-12348", nickname: "TSQ-2", users: "5", group: "—", model: "MSTSQQUANTISPLUS", coverage: "Under contract", end: "29 Mar 2025" },
  { image: "tsq.png", serial: "TSQ-Z-12349", nickname: "TSQ-3", users: "2", group: "—", model: "MSTSQQUANTISPLUS", coverage: "Expiring soon", end: "29 Mar 2024" },
  { image: "q-exactive.png", serial: "SN98355W", nickname: "QEXACTIVE_30", users: "4", group: "—", model: "QEXAC00001", coverage: "Under contract", end: "28 Apr 2025" },
  { image: "q-exactive.png", serial: "SN98356W", nickname: "QEXACTIVE_31", users: "2", group: "Global Research and Development", model: "QEXAC00001", coverage: "Under contract", end: "29 Mar 2025", locked: true },
  { image: "q-exactive.png", serial: "SN98358W", nickname: "QEXACTIVE_32", users: "4", group: "Department of Medical Affairs", model: "QEXAC00001", coverage: "Under contract", end: "29 Mar 2025", locked: true },
  { image: "q-exactive.png", serial: "SN98359W", nickname: "QEXACTIVE_33", users: "2", group: "Department of Medical Affairs", model: "QEXAC00001", coverage: "Under contract", end: "29 Mar 2025", locked: true },
  { image: "q-exactive.png", serial: "SN98360W", nickname: "—", users: "3", group: "—", model: "QEXAC00001", coverage: "Under contract", end: "28 Apr 2025", locked: true },
  { image: "q-exactive.png", serial: "SN98361W", nickname: "—", users: "3", group: "Global Research and Development", model: "QEXAC00001", coverage: "Under contract", end: "29 Mar 2025", locked: true },
  { image: "q-exactive.png", serial: "SN98362W", nickname: "—", users: "3", group: "Global Research and Development", model: "QEXAC00001", coverage: "Under contract", end: "29 Mar 2025", locked: true },
];

function instrumentRowMarkup(instrument) {
  const coverageClass = instrument.coverage === "Coverage expired" ? "mi-status--expired" : instrument.coverage === "Expiring soon" ? "mi-status--soon" : "";
  return `<tr data-mi-row data-search="${instrument.serial} ${instrument.nickname} ${instrument.group} ${instrument.model}">
    <td><input type="checkbox" data-mi-checkbox aria-label="Select ${instrument.serial}" /></td>
    <td><button class="mi-favorite" type="button" aria-label="Add ${instrument.serial} to favorites" aria-pressed="false"><img src="assets/icons/commerce/rating/Size=16px, Style=Mono.svg" alt="" /></button></td>
    <td><img class="mi-product" src="assets/instruments/${instrument.image}" alt="" /></td>
    <td>${instrument.locked ? '<img class="mi-lock" src="assets/icons/actions/lock closed/size=16px, style=mono.svg" alt="Access controlled" />' : ""}</td>
    <td><button class="mi-link" type="button" data-route="instrument-access">${instrument.serial}</button></td>
    <td><span class="mi-ellipsis">${instrument.nickname}</span></td>
    <td><button class="mi-link mi-link--center" type="button" data-mi-toast="Users opened">${instrument.users}</button></td>
    <td>${instrument.group === "—" ? '<span class="mi-ellipsis">—</span>' : `<button class="mi-link mi-ellipsis" type="button" data-mi-toast="Group opened">${instrument.group}</button>`}</td>
    <td><span class="mi-ellipsis">${instrument.model}</span></td>
    <td>${coverageClass ? `<span class="mi-status ${coverageClass}">${instrument.coverage}</span>` : instrument.coverage}</td>
    <td>${instrument.end}</td>
    <td><button class="mi-more" type="button" data-mi-toast="Instrument actions opened" aria-label="Actions for ${instrument.serial}"><img src="assets/icons/actions/more horizontal/size=16px, style=mono.svg" alt="" /></button></td>
  </tr>`;
}

function wireMyInstruments() {
  const rowsContainer = app.querySelector("[data-mi-rows]");
  rowsContainer.innerHTML = MY_INSTRUMENTS.map(instrumentRowMarkup).join("");
  const updateCount = () => {
    const visible = [...app.querySelectorAll("[data-mi-row]")].filter((row) => !row.hidden).length;
    app.querySelector("[data-mi-count]").textContent = String(visible);
  };
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  app.querySelector("[data-mi-search]").addEventListener("input", (event) => {
    const query = event.currentTarget.value.trim().toLowerCase();
    app.querySelectorAll("[data-mi-row]").forEach((row) => {
      row.hidden = query !== "" && !row.dataset.search.toLowerCase().includes(query);
    });
    updateCount();
  });
  app.querySelector("[data-mi-select-all]").addEventListener("change", (event) => {
    app.querySelectorAll("[data-mi-checkbox]").forEach((checkbox) => { checkbox.checked = event.currentTarget.checked; });
  });
  app.querySelectorAll(".mi-favorite").forEach((button) => {
    button.addEventListener("click", () => {
      const pressed = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(pressed));
    });
  });
  app.querySelectorAll(".mi-tabs [role='tab']").forEach((tab) => {
    tab.addEventListener("click", () => {
      app.querySelectorAll(".mi-tabs [role='tab']").forEach((candidate) => {
        const selected = candidate === tab;
        candidate.classList.toggle("is-active", selected);
        candidate.setAttribute("aria-selected", String(selected));
      });
      if (!tab.textContent.trim().startsWith("My Instruments")) showToast(`${tab.textContent.trim()} selected`);
    });
  });
  app.querySelectorAll(".mi-view-toggle button").forEach((button) => {
    button.addEventListener("click", () => {
      app.querySelectorAll(".mi-view-toggle button").forEach((candidate) => candidate.classList.toggle("is-selected", candidate === button));
      showToast(`${button.getAttribute("aria-label")} selected`);
    });
  });
  app.querySelectorAll("[data-mi-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.miToast)));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderMyInstruments() {
  const template = document.querySelector("#my-instruments-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("my-instruments");
  wireMyInstruments();
  document.title = "My instruments — Services Central";
}

function addInstrumentEntryRows(count = 1) {
  const container = app.querySelector("[data-ai-rows]");
  const startIndex = container.children.length;
  const fragment = document.createDocumentFragment();
  for (let offset = 0; offset < count; offset += 1) {
    const rowNumber = startIndex + offset + 1;
    const row = document.createElement("div");
    row.className = "ai-entry-row";
    row.innerHTML = `<label><span class="sr-only">Serial number ${rowNumber}</span><input type="text" data-ai-serial autocomplete="off" /></label><label><span class="sr-only">Nickname ${rowNumber}</span><input type="text" data-ai-nickname placeholder="Example Asset ID or Instrument name" autocomplete="off" /></label><button type="button" data-ai-remove aria-label="Remove instrument row ${rowNumber}"><img src="assets/icons/actions/bin/size=24px, style=mono.svg" alt="" /></button>`;
    fragment.append(row);
  }
  container.append(fragment);
}

function updateAddInstrumentsContinueState() {
  const hasSerial = [...app.querySelectorAll("[data-ai-serial]")].some((input) => input.value.trim() !== "");
  const continueButton = app.querySelector("[data-ai-continue]");
  continueButton.disabled = !hasSerial;
}

function wireAddInstruments() {
  addInstrumentEntryRows(5);
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("my-instruments"));
  const rows = app.querySelector("[data-ai-rows]");
  rows.addEventListener("input", updateAddInstrumentsContinueState);
  rows.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-ai-remove]");
    if (!removeButton) return;
    removeButton.closest(".ai-entry-row").remove();
    if (!rows.children.length) addInstrumentEntryRows(1);
    updateAddInstrumentsContinueState();
  });
  rows.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const currentRow = event.target.closest(".ai-entry-row");
    if (currentRow !== rows.lastElementChild) return;
    event.preventDefault();
    addInstrumentEntryRows(1);
    rows.lastElementChild.querySelector("input").focus();
  });
  app.querySelector("[data-ai-add-rows]").addEventListener("click", () => addInstrumentEntryRows(5));
  app.querySelector("[data-ai-clear]").addEventListener("click", () => {
    app.querySelectorAll("[data-ai-rows] input").forEach((input) => { input.value = ""; });
    updateAddInstrumentsContinueState();
  });
  app.querySelector("[data-ai-continue]").addEventListener("click", () => setRoute("instrument-access"));

  app.querySelectorAll("[data-ai-mode]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const mode = tab.dataset.aiMode;
      app.querySelectorAll("[data-ai-mode]").forEach((candidate) => {
        const selected = candidate === tab;
        candidate.classList.toggle("is-active", selected);
        candidate.setAttribute("aria-selected", String(selected));
      });
      app.querySelectorAll("[data-ai-panel]").forEach((panel) => { panel.hidden = panel.dataset.aiPanel !== mode; });
    });
  });
  app.querySelector("[data-ai-file]").addEventListener("change", (event) => {
    app.querySelector("[data-ai-bulk-continue]").disabled = !event.currentTarget.files.length;
  });
  app.querySelector("[data-ai-bulk-continue]").addEventListener("click", () => showToast("Instrument file ready for review"));
  app.querySelector("[data-ai-template]").addEventListener("click", () => showToast("Instrument upload template downloaded"));

  let bannerIndex = 0;
  const updateBannerDots = () => {
    app.querySelectorAll(".ai-banner__dots span").forEach((dot, index) => dot.classList.toggle("is-active", index === bannerIndex));
    app.querySelector(".ai-banner__dots").setAttribute("aria-label", `Suggestion ${bannerIndex + 1} of 3`);
  };
  app.querySelector("[data-ai-banner-prev]").addEventListener("click", () => { bannerIndex = (bannerIndex + 2) % 3; updateBannerDots(); });
  app.querySelector("[data-ai-banner-next]").addEventListener("click", () => { bannerIndex = (bannerIndex + 1) % 3; updateBannerDots(); });

  const supportedDialog = app.querySelector("[data-ai-supported-dialog]");
  app.querySelectorAll("[data-ai-supported]").forEach((button) => button.addEventListener("click", () => supportedDialog.showModal()));
  app.querySelectorAll("[data-ai-supported-close]").forEach((button) => button.addEventListener("click", () => supportedDialog.close()));
  supportedDialog.addEventListener("click", (event) => { if (event.target === supportedDialog) supportedDialog.close(); });
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderAddInstruments() {
  const template = document.querySelector("#add-instruments-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("add-instruments");
  wireAddInstruments();
  document.title = "Add instruments — Services Central";
}

const SUPPORT_HISTORY_TICKETS = [
  { status: "Open", ticket: "5551726344", type: "Tech Support", subject: "Won’t turn on", serial: "1009996", model: "VQF0000DET", nickname: "Detector-2B", group: "HPLC 2B...", contact: "Alma...", created: "18 Oct 2020", closed: "---", systemNames: ["Alpine", "Sasha"] },
  { status: "In progress", ticket: "46521863", type: "Service Request", subject: "Repair 0000123459", serial: "1009999", model: "VQH0000VEN", nickname: "Column-2B", group: "HPLC 2B...", contact: "Alma...", created: "18 Oct 2020", closed: "---", icon: "quote" },
  { status: "In progress", ticket: "46927364", type: "PM (Contract)", subject: "Preventive maintenance", serial: "1009998", model: "VQF00SAMPL", nickname: "Sampler-2B", group: "HPLC 2B...", contact: "Alma...", created: "18 Oct 2020", closed: "---", icon: "support", systemNames: ["Alpine", "Sasha"] },
  { status: "In progress", ticket: "465218988", type: "Inquiry", subject: "Repair instrument", serial: "1009997", model: "VQF000PUMP", nickname: "Pump-2B", group: "HPLC 2B...", contact: "Alma...", created: "18 Oct 2020", closed: "---" },
  { status: "In progress", ticket: "46927364", type: "Tech Support", subject: "Repair instrument", serial: "8044421", model: "ULT3R0PDET", nickname: "Pump-RD", group: "Biotherapeutics...", contact: "Alma...", created: "18 Oct 2020", closed: "---" },
  { status: "In progress", ticket: "46719836", type: "Inquiry", subject: "Need support for error", serial: "8044422", model: "ULT3S0MISC", nickname: "Misc-RD", group: "Biotherapeutics...", contact: "Alma...", created: "12 May 2020", closed: "---" },
  { status: "In progress", ticket: "46075402", type: "Inquiry", subject: "Need support for error", serial: "8044423", model: "ULT3S00DET", nickname: "Detector-RD", group: "Biotherapeutics...", contact: "Alma...", created: "12 May 2020", closed: "---" },
  { status: "In progress", ticket: "46917372", type: "Inquiry", subject: "Need support for error", serial: "8044424", model: "ULT3SSA000", nickname: "Sampler-RD", group: "Biotherapeutics...", contact: "Alma...", created: "12 May 2020", closed: "---" },
  { status: "In progress", ticket: "46003524", type: "Depot Repair", subject: "Need support for error", serial: "TSQ-...", model: "MSTSQQUTIS", nickname: "", group: "", contact: "Tyler Durden", created: "12 May 2020", closed: "---" },
  { status: "Closed", ticket: "46195527", type: "PM (Contract)", subject: "Preventive maintenance", serial: "TSQ-...", model: "MSTSQQUTIS", nickname: "", group: "Global...", contact: "Tyler Durden", created: "23 Jan 2019", closed: "23 Jan 2019" },
  { status: "Closed", ticket: "46939573", type: "Inquiry", subject: "Need support", serial: "TSQ-...", model: "MSTSQQUTIS", nickname: "TSQ-1", group: "Precision...", contact: "Tyler Durden", created: "23 Jan 2019", closed: "23 Jan 2019" },
  { status: "Closed", ticket: "46074658", type: "Tech Support", subject: "Need support", serial: "TSQ-...", model: "MSTSQQUTIS", nickname: "TSQ-2", group: "Precision...", contact: "Tyler Durden", created: "23 Jan 2019", closed: "23 Jan 2019" },
  { status: "Closed", ticket: "46884635", type: "Tech Support", subject: "Need support", serial: "TSQ-...", model: "MSTSQQUTIS", nickname: "TSQ-3", group: "Precision...", contact: "Tyler Durden", created: "23 Jan 2019", closed: "23 Jan 2019" },
  { status: "Closed", ticket: "46626384", type: "Inquiry", subject: "Need support", serial: "SN98355W", model: "QEXAC00001", nickname: "", group: "", contact: "Tyler Durden", created: "23 Jan 2019", closed: "23 Jan 2019" },
  { status: "Closed", ticket: "46977462", type: "Tech Support", subject: "Need support", serial: "SN98356W", model: "QEXAC00001", nickname: "", group: "Global...", contact: "Tyler Durden", created: "23 Jan 2019", closed: "23 Jan 2019" },
  { status: "Closed", ticket: "46118377", type: "PM (Contract)", subject: "Need support", serial: "SN98357W", model: "QEXAC00001", nickname: "Q-EXACTIVE...", group: "Department...", contact: "Tyler Durden", created: "23 Jan 2019", closed: "23 Jan 2019" },
  { status: "Closed", ticket: "46000283", type: "PM (Contract)", subject: "Need support", serial: "SN98358W", model: "QEXAC00001", nickname: "Q-EXACTIVE...", group: "Department...", contact: "Tyler Durden", created: "23 Jan 2019", closed: "23 Jan 2019" },
  { status: "Closed", ticket: "46993746", type: "Inquiry", subject: "Need support", serial: "SN98359W", model: "QEXAC00001", nickname: "Q-EXACTIVE...", group: "Department...", contact: "Tyler Durden", created: "23 Jan 2019", closed: "23 Jan 2019" },
  { status: "Closed", ticket: "46296730", type: "Inquiry", subject: "Need support", serial: "SN98360W", model: "QEXAC00001", nickname: "", group: "", contact: "Tyler Durden", created: "23 Jan 2019", closed: "23 Jan 2019" },
  { status: "Closed", ticket: "46434295", type: "Installation", subject: "Need support", serial: "SN98361W", model: "QEXAC00001", nickname: "", group: "Global...", contact: "Tyler Durden", created: "23 Jan 2019", closed: "23 Jan 2019" },
];

const SUPPORT_HISTORY_SUMMARY_ROUTES = {
  "5551726344": "tech-support-summary",
  "46521863": "service-requests-summary",
  "46927364": "pm-summary",
  "46195527": "closed-summary",
};

function summaryRouteForTicket(ticket) {
  if (!ticket) return null;
  if (ticket.status === "Closed" && ["Tech Support", "Service Request", "Depot Repair", "Inquiry", "PM (Contract)"].includes(ticket.type)) return "closed-summary";
  if (ticket.type === "Tech Support") return "tech-support-summary";
  if (["Service Request", "Depot Repair", "Inquiry"].includes(ticket.type)) return "service-requests-summary";
  if (ticket.type === "PM (Contract)") return "pm-summary";
  return null;
}

const TICKET_SUMMARIES = {
  "tech-support-summary": { title: "Won’t turn on", ticket: "5551726344", state: "Open", subject: "Need support for unknown instrument error", type: "Tech Support", serial: "1009996", model: "VQF0000DET", nickname: "Detector-2B", created: "26 April 2023", isTechSupport: true },
  "service-requests-summary": { title: "Repair 0000123459 instrument parts", ticket: "46521863", state: "In progress", type: "Service Request", serial: "1009999", model: "VQH0000VEN", nickname: "Detector-2B", created: "Monday, 30 Apr 2023", summaryKind: "quote" },
  "pm-summary": { title: "Preventive Maintenance - 0012345L", ticket: "46927364", state: "In progress", type: "PM (Contract)", serial: "1009998", model: "VQF00SAMPL", nickname: "Detector-2B", created: "Monday, 12 May 2023", summaryKind: "preventive" },
  "closed-summary": { title: "Preventive Maintenance 00000", ticket: "46195527", state: "Closed", type: "PM (Contract)", serial: "SN98355W", model: "QEXAC00001", nickname: "Detector-2B", created: "Tuesday, 15 May 2019", summaryKind: "closed" },
};

const SUPPORT_HISTORY_MONTH_INDEX = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseSupportHistoryDate(value) {
  const parts = String(value || "").trim().split(/\s+/);
  if (parts.length !== 3) return null;
  const [dayText, monthText, yearText] = parts;
  const day = Number(dayText);
  const month = SUPPORT_HISTORY_MONTH_INDEX[monthText];
  const year = Number(yearText);
  if (!Number.isInteger(day) || month === undefined || !Number.isInteger(year)) return null;
  const date = new Date(year, month, day);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
}

function supportHistoryDateKey(value) {
  const date = parseSupportHistoryDate(value);
  if (!date) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function supportHistoryDateInRange(value, start, end) {
  if (!start || !end) return true;
  return Boolean(value && value >= start && value <= end);
}

function supportHistorySearchText(ticket) {
  return [ticket.serial, ticket.nickname, ticket.ticket, ticket.subject]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

const SUPPORT_HISTORY_INDICATORS = {
  quote: {
    src: "assets/icons/general/quote/size=24px, style=mono.svg",
    label: "Quote status",
    tooltip: "Quote ready",
    modifier: "sh-ticket-tooltip--quote",
    hook: "data-sh-quote-tip",
  },
  support: {
    src: "assets/icons/general/visit scheduled/size=24px, style=mono.svg",
    label: "Visit status",
    tooltip: "Visit scheduled",
    modifier: "sh-ticket-tooltip--visit",
    hook: "data-sh-support-tip",
  },
};

function supportHistorySystemsMarkup(ticket) {
  if (!ticket.systemNames) return "";
  const tooltipId = `sh-systems-tooltip-${ticket.ticket}`;
  return `<span class="sh-system-tip" data-sh-system-tip tabindex="0" aria-label="Systems" aria-describedby="${tooltipId}">
    <img class="sh-system-icon" src="assets/icons/general/in systems/size=24px, style=mono.svg" alt="" />
    <span class="sh-system-tooltip" id="${tooltipId}" role="tooltip" hidden><span class="sh-system-tooltip__content">In system(s): ${ticket.systemNames.map((name) => `<span class="sh-system-name">${name}</span>`).join(", ")}</span></span>
  </span>`;
}

function supportHistoryOverflowMarkup(ticket, field, value) {
  const tooltipId = `sh-overflow-tooltip-${ticket.ticket}-${ticket.serial}-${field}`;
  return `<span class="sh-overflow" data-sh-tooltip tabindex="0" aria-describedby="${tooltipId}">${value}<span class="sh-overflow-tooltip" id="${tooltipId}" role="tooltip" hidden>${value}</span></span>`;
}

function supportHistoryIndicatorMarkup(ticket) {
  const indicator = SUPPORT_HISTORY_INDICATORS[ticket.icon];
  if (!indicator) return "";
  const tooltipId = `sh-${ticket.icon}-tooltip-${ticket.ticket}`;
  return `<span class="sh-ticket-tip" data-sh-ticket-tip ${indicator.hook} tabindex="0" aria-label="${indicator.label}" aria-describedby="${tooltipId}">
    <img class="sh-ticket-icon" src="${indicator.src}" alt="" />
    <span class="sh-ticket-tooltip ${indicator.modifier}" id="${tooltipId}" role="tooltip" hidden>${indicator.tooltip}</span>
  </span>`;
}

function supportHistoryRowMarkup(ticket) {
  const statusClass = ticket.status === "Open" ? "sh-status--open" : ticket.status === "In progress" ? "sh-status--progress" : "sh-status--closed";
  return `<tr data-sh-row data-status="${ticket.status}" data-type="${ticket.type}" data-model="${ticket.model}" data-group="${ticket.group}" data-contact="${ticket.contact}" data-search="${supportHistorySearchText(ticket)}" data-created="${supportHistoryDateKey(ticket.created)}">
    <td>${supportHistoryIndicatorMarkup(ticket)}</td>
    <td><span class="sh-status ${statusClass}">${ticket.status}</span></td>
    <td><button class="sh-link" type="button" data-sh-ticket="${ticket.ticket}" data-sh-ticket-index="${SUPPORT_HISTORY_TICKETS.indexOf(ticket)}">${ticket.ticket}</button></td>
    <td>${supportHistoryOverflowMarkup(ticket, "type", ticket.type)}</td><td>${supportHistoryOverflowMarkup(ticket, "subject", ticket.subject)}</td><td>${supportHistorySystemsMarkup(ticket)}</td>
    <td><button class="sh-link" type="button" data-route="instrument-access">${ticket.serial}</button></td>
    <td>${supportHistoryOverflowMarkup(ticket, "model", ticket.model)}</td><td>${supportHistoryOverflowMarkup(ticket, "nickname", ticket.nickname)}</td>
    <td title="${ticket.group}">${ticket.group ? `<button class="sh-link" type="button" data-sh-group>${ticket.group}</button>` : ""}</td>
    <td>${supportHistoryOverflowMarkup(ticket, "contact", ticket.contact)}</td><td>${ticket.created}</td><td>${ticket.closed}</td>
  </tr>`;
}

function setSupportHistoryTooltip(trigger, visible) {
  const tooltipId = trigger?.getAttribute("aria-describedby");
  const tooltip = tooltipId ? document.getElementById(tooltipId) : null;
  if (!tooltip) return;
  if (visible) {
    tooltip.hidden = false;
    document.body.append(tooltip);
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    tooltip.style.top = `${triggerRect.top - tooltipRect.height - 8}px`;
    tooltip.style.left = `${triggerRect.left + triggerRect.width / 2}px`;
    tooltip.style.bottom = "auto";
  } else {
    tooltip.hidden = true;
    trigger.append(tooltip);
    tooltip.removeAttribute("style");
  }
  trigger.classList.toggle("is-tooltip-visible", visible);
  trigger.closest("td")?.classList.toggle("is-tooltip-visible", visible);
}

function canShowSupportHistoryTooltip(trigger) {
  return !trigger.matches("[data-sh-tooltip]") || trigger.scrollWidth > trigger.clientWidth;
}

function wireSupportHistory() {
  const tbody = app.querySelector("[data-sh-rows]");
  const datePickerRoot = app.querySelector("[data-sh-date-picker]");
  const statusFilterRoot = app.querySelector("[data-sh-status-filter]");
  const statusFilterTriggerRoot = app.querySelector("[data-sh-status-filter-trigger]");
  const statusFilter = new window.MultiSelectFilter(statusFilterRoot, {
    label: "Status",
    allLabel: "All",
    options: ["Open", "In progress", "Closed"],
    controlHost: statusFilterTriggerRoot,
  });
  const columnFilterConfig = [
    { key: "type", label: "Ticket type" },
    { key: "model", label: "Model" },
    { key: "group", label: "Groups" },
    { key: "contact", label: "Contact" },
  ];
  const columnFilters = columnFilterConfig.map(({ key, label }) => {
    const root = app.querySelector(`[data-sh-${key}-filter]`);
    const controlHost = app.querySelector(`[data-sh-column-filter-trigger="${key}"]`);
    const options = [...new Set(SUPPORT_HISTORY_TICKETS.map((ticket) => ticket[key]).filter(Boolean))];
    return { key, root, filter: new window.MultiSelectFilter(root, {
      label,
      controlLabel: key === "type" ? "Ticket t..." : label,
      allLabel: "All",
      options,
      controlHost,
      menuStyle: "figma-column",
    }) };
  });
  const allFilters = [statusFilter, ...columnFilters.map(({ filter }) => filter)];
  const clearFiltersButton = app.querySelector("[data-sh-clear-filters]");
  const updateClearFilters = () => {
    clearFiltersButton.hidden = allFilters.every((filter) => filter.values.length === 0);
  };
  let tickets = [...SUPPORT_HISTORY_TICKETS];
  let appliedStart = "";
  let appliedEnd = "";
  new window.DateRangePicker(datePickerRoot);
  const renderRows = () => {
    tbody.innerHTML = tickets.map(supportHistoryRowMarkup).join("");
    tbody.querySelectorAll("[data-sh-ticket-tip], [data-sh-system-tip], [data-sh-tooltip]").forEach((trigger) => {
      trigger.addEventListener("pointerenter", () => { if (canShowSupportHistoryTooltip(trigger)) setSupportHistoryTooltip(trigger, true); });
      trigger.addEventListener("pointerleave", () => setSupportHistoryTooltip(trigger, false));
    });
  };
  const filterRows = () => {
    const query = app.querySelector("[data-sh-search]").value.trim().toLowerCase();
    const statuses = statusFilter.values;
    let visible = 0;
    app.querySelectorAll("[data-sh-row]").forEach((row) => {
      const textMatches = !query || row.dataset.search.includes(query);
      const statusMatches = statuses.length === 0 || statuses.includes(row.dataset.status);
      const columnMatches = columnFilters.every(({ key, filter }) => filter.values.length === 0 || filter.values.includes(row.dataset[key]));
      const dateMatches = supportHistoryDateInRange(row.dataset.created, appliedStart, appliedEnd);
      row.hidden = !textMatches || !statusMatches || !columnMatches || !dateMatches;
      if (!row.hidden) visible += 1;
    });
    app.querySelector("[data-sh-count]").textContent = query || statuses.length || (appliedStart && appliedEnd) ? String(visible) : "100";
    updateClearFilters();
  };
  renderRows();
  tbody.addEventListener("mouseover", (event) => {
    const trigger = event.target.closest("[data-sh-ticket-tip], [data-sh-system-tip], [data-sh-tooltip]");
    if (trigger && canShowSupportHistoryTooltip(trigger)) setSupportHistoryTooltip(trigger, true);
  });
  tbody.addEventListener("mouseout", (event) => {
    const trigger = event.target.closest("[data-sh-ticket-tip], [data-sh-system-tip], [data-sh-tooltip]");
    if (trigger && !trigger.contains(event.relatedTarget)) setSupportHistoryTooltip(trigger, false);
  });
  tbody.addEventListener("focusin", (event) => {
    const trigger = event.target.closest("[data-sh-ticket-tip], [data-sh-system-tip], [data-sh-tooltip]");
    if (trigger && canShowSupportHistoryTooltip(trigger)) setSupportHistoryTooltip(trigger, true);
  });
  tbody.addEventListener("focusout", (event) => {
    const trigger = event.target.closest("[data-sh-ticket-tip], [data-sh-system-tip], [data-sh-tooltip]");
    if (trigger) setSupportHistoryTooltip(trigger, false);
  });
  tbody.addEventListener("keydown", (event) => {
    const trigger = event.target.closest("[data-sh-ticket-tip], [data-sh-system-tip], [data-sh-tooltip]");
    if (trigger && event.key === "Escape") {
      event.preventDefault();
      setSupportHistoryTooltip(trigger, false);
    }
  });
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  app.querySelector("[data-sh-search]").addEventListener("input", filterRows);
  statusFilterRoot.addEventListener("multiselect-filter-change", filterRows);
  columnFilters.forEach(({ root }) => root.addEventListener("multiselect-filter-change", filterRows));
  columnFilters.forEach(({ key, root }) => root.addEventListener("multiselect-filter-sort", (event) => {
    const direction = event.detail.direction === "desc" ? -1 : 1;
    tickets.sort((left, right) => direction * String(left[key]).localeCompare(String(right[key])));
    renderRows();
    filterRows();
  }));
  clearFiltersButton.addEventListener("click", () => allFilters.forEach((filter) => filter.clear()));
  datePickerRoot.addEventListener("date-range-change", (event) => {
    appliedStart = event.detail.start;
    appliedEnd = event.detail.end;
    filterRows();
  });
  app.querySelectorAll("[data-sh-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.shSort;
      const descending = button.dataset.direction !== "desc";
      button.dataset.direction = descending ? "desc" : "asc";
      tickets.sort((a, b) => String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true }) * (descending ? -1 : 1));
      renderRows();
      filterRows();
    });
  });
  tbody.addEventListener("click", (event) => {
    const ticketButton = event.target.closest("[data-sh-ticket]");
    if (ticketButton) {
      const historyTicket = SUPPORT_HISTORY_TICKETS[Number(ticketButton.dataset.shTicketIndex)];
      setRoute(summaryRouteForTicket(historyTicket) || SUPPORT_HISTORY_SUMMARY_ROUTES[ticketButton.dataset.shTicket] || "ticket-detail", historyTicket || null);
    }
    if (event.target.closest("[data-sh-group]")) showToast("Instrument group opened");
  });
  app.querySelector("[data-sh-edit-columns]").addEventListener("click", () => showToast("Column editor opened"));
  app.querySelectorAll("[data-sh-menu]").forEach((button) => button.addEventListener("click", () => showToast(`${button.dataset.shMenu} filter opened`)));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderSupportHistory() {
  const template = document.querySelector("#support-history-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("support-history");
  wireSupportHistory();
  document.title = "Support request history — Services Central";
}

function renderTicketSummary(route) {
  const baseTicket = TICKET_SUMMARIES[route];
  const historyTicket = selectedSupportHistoryTicket && summaryRouteForTicket(selectedSupportHistoryTicket) === route ? selectedSupportHistoryTicket : null;
  const ticket = historyTicket ? {
    ...baseTicket,
    title: historyTicket.subject || baseTicket.title,
    ticket: historyTicket.ticket,
    state: historyTicket.status,
    type: historyTicket.type,
    subject: historyTicket.subject || baseTicket.subject,
    serial: historyTicket.serial || baseTicket.serial,
    model: historyTicket.model || baseTicket.model,
    nickname: historyTicket.nickname || baseTicket.nickname,
    group: historyTicket.group || "---",
    contact: historyTicket.contact || "---",
    created: historyTicket.created || baseTicket.created,
    closed: historyTicket.closed || "---",
    selectedFromHistory: true,
  } : baseTicket;
  const isTechSupport = ticket.isTechSupport === true;
  const usesReferenceLayout = isTechSupport || Boolean(ticket.summaryKind);
  const titleMeta = usesReferenceLayout
    ? `<p><span class="ts-ticket-meta__number"><strong>Ticket number:</strong> ${ticket.ticket}</span><span class="ts-ticket-meta__type"><strong>Ticket type:</strong> ${ticket.type}</span></p>`
    : `<p>Ticket number: ${ticket.ticket} <span class="ts-state ts-state--${ticket.state.toLowerCase().replaceAll(" ", "-")}">${ticket.state}</span></p>`;
  const ticketContact = ticket.selectedFromHistory ? ticket.contact : "Molly Hartman";
  const ticketCreated = ticket.selectedFromHistory ? ticket.created : "26 April 2023";
  const ticketClosed = ticket.state === "Closed" ? ticket.closed : "---";
  const techContent = `<article class="ts-card ts-card--tech"><h2>Ticket contact information</h2><dl class="ts-contact"><div><dt>Name</dt><dd>${ticketContact}</dd></div><div><dt>Phone number</dt><dd>123-456-7890</dd></div><div><dt>Email</dt><dd>molly.hartman@thermofisher.com</dd></div></dl><h2>Support request details</h2><dl class="ts-tech-details"><div><dt>Request subject</dt><dd>${ticket.subject}</dd></div><div><dt>Problem</dt><dd>I urgently need comprehensive technical support to resolve an unknown instrument error that has occurred.</dd></div><div><dt>Error codes</dt><dd>No</dd></div><div><dt>Recent changes to the instrument or environment</dt><dd>We disassembled the system to clean it and now it won’t turn on.</dd></div><div><dt>Created date</dt><dd>${ticketCreated}</dd></div><div><dt>Closed date</dt><dd>${ticketClosed}</dd></div></dl><section class="ts-submitted"><h3>Submitted by</h3><dl><div><dt>Name</dt><dd>${ticketContact}</dd></div><div><dt>Email</dt><dd>molly.hartman@thermofisher.com</dd></div></dl></section></article><article class="ts-card ts-instrument ts-instrument--tech"><img src="assets/instruments/vanquish-detector.png" alt="Vanquish variable wavelength detector" /><dl><div><dt>Serial number</dt><dd class="ts-link">${ticket.serial}</dd></div><div><dt>Model number</dt><dd>${ticket.model}</dd></div><div><dt>Type</dt><dd>HPLC</dd></div><div><dt>Catalog name</dt><dd>Vanquish™ Variable Wavelength Detector F</dd></div><div><dt>Nickname</dt><dd>${ticket.nickname}</dd></div><div><dt>Groups</dt><dd>${ticket.group || "HPLC 2B Sys., Global Research and Development..."}</dd></div><div><dt>Notes</dt><dd>Vanquish HPLC System, Lab 2B</dd></div><div><dt>Manuals</dt><dd class="ts-link">View operating manual<br />View system operating manual</dd></div></dl></article>`;
  const contactMarkup = `<h2>Ticket contact information</h2><dl class="ts-contact"><div><dt>Name</dt><dd>${ticketContact}</dd></div><div><dt>Phone number</dt><dd>123-456-7890</dd></div><div><dt>Email</dt><dd>molly.hartman@thermofisher.com</dd></div></dl>`;
  const requestMarkup = `<h2>Support request details</h2><dl class="ts-standard-details"><div><dt>Request subject</dt><dd>${ticket.selectedFromHistory ? ticket.subject : "Need support"}</dd></div><div><dt>Additional details</dt><dd>We disassembled the system to clean it and now it won’t turn on.</dd></div><div><dt>Created date</dt><dd>${ticketCreated}</dd></div><div><dt>Closed date</dt><dd>${ticketClosed}</dd></div></dl><section class="ts-submitted"><h3>Submitted by</h3><dl><div><dt>Name</dt><dd>${ticketContact}</dd></div><div><dt>Email</dt><dd>molly.hartman@thermofisher.com</dd></div></dl></section>`;
  const instrumentMarkup = `<article class="ts-card ts-instrument ts-instrument--standard"><img src="assets/instruments/vanquish-detector.png" alt="Vanquish variable wavelength detector" /><dl><div><dt>Serial number</dt><dd class="ts-link">${ticket.serial}</dd></div><div><dt>Model number</dt><dd>${ticket.model}</dd></div><div><dt>Type</dt><dd>HPLC</dd></div><div><dt>Catalog name</dt><dd>Vanquish™ Variable Wavelength Detector F</dd></div><div><dt>Nickname</dt><dd>${ticket.nickname}</dd></div><div><dt>Groups</dt><dd>${ticket.group || "HPLC 2B Sys., Global Research and Development..."}</dd></div><div><dt>Notes</dt><dd>Vanquish HPLC System, Lab 2B</dd></div><div><dt>Manuals</dt><dd class="ts-link">View operating manual<br />View system operating manual</dd></div></dl></article>`;
  const quoteContent = `<article class="ts-card ts-card--standard ts-card--quote">${contactMarkup}<div class="ts-summary-split"><section>${requestMarkup}</section><section class="ts-quotes"><header><h2>Quote(s)</h2><span>Prices are subject to change</span></header><article class="ts-quote"><img src="assets/icons/general/quote/size=24px, style=mono.svg" alt="" /><div><span><b>Quote:</b> <span class="ts-quote__number">17171847</span></span><span><b>Created:</b> 11 Apr 2023</span><span><b>Total:</b> $10,285</span></div><div class="ts-quote__actions"><button class="mi-button" type="button">View quote</button><button class="mi-button" type="button">Place order</button></div></article></section></div><section class="ts-service ts-service--quote"><h3>Service details</h3><dl class="ts-service-details"><div><dt>Scheduled start date</dt><dd>Monday, 30 Apr 2023</dd></div></dl></section></article>${instrumentMarkup}`;
  const preventiveContent = `<article class="ts-card ts-card--standard ts-card--preventive">${contactMarkup}${requestMarkup}<section class="ts-service ts-service--preventive"><h3>Service details</h3><dl class="ts-service-details"><div><dt>Scheduled start date</dt><dd>Monday, 12 May 2023</dd></div></dl></section></article>${instrumentMarkup}`;
  const closedRequestMarkup = `<h2>Support request details</h2><dl class="ts-standard-details"><div><dt>Request subject</dt><dd>${ticket.selectedFromHistory ? ticket.subject : "Won’t turn on"}</dd></div><div><dt>Additional details</dt><dd>We disassembled the system to clean it and now it won’t turn on.</dd></div><div><dt>Created date</dt><dd>${ticket.selectedFromHistory ? ticket.created : "26 April 2023"}</dd></div><div><dt>Closed date</dt><dd>${ticket.selectedFromHistory ? ticket.closed : "1 May 2023"}</dd></div></dl><section class="ts-submitted"><h3>Submitted by</h3><dl><div><dt>Name</dt><dd>${ticketContact}</dd></div><div><dt>Email</dt><dd>molly.hartman@thermofisher.com</dd></div></dl></section>`;
  const closedContent = `<article class="ts-card ts-card--standard ts-card--closed">${contactMarkup}${closedRequestMarkup}<section class="ts-service ts-service--closed"><h3>Service details</h3><div class="ts-service--closed__body"><div class="ts-service--closed__details"><dl><div><dt>Arrival date</dt><dd>12 Mar 2023</dd></div><div><dt>Completion date</dt><dd>12 Mar 2023</dd></div><div><dt>Type of service</dt><dd>Preventive maintenance</dd></div></dl><dl class="ts-service-description"><div><dt>Service description</dt><dd>Cras gravida nibh enim, sit amet molestie nisi congue id. Proin rhoncus consectetur arcu, in lobortis magna. Donec purus ipsum, dignissim non maximus nec, rhoncus accumsan erat. Proin consectetur tincidunt mi eget cursus. Sed facilisis at risus imperdiet.</dd></div></dl></div><article class="ts-service-report"><div><strong>View service report</strong><p>Available here until dd mmm yyyy.<br />After this date, contact support.</p></div><button type="button" aria-label="Download service report"><img src="assets/icons/actions/download/Size=24px, Style=Mono, Color=Blue.svg" alt="" /></button></article></div></section></article>${instrumentMarkup}`;
  const defaultContent = ticket.summaryKind === "quote" ? quoteContent : ticket.summaryKind === "preventive" ? preventiveContent : closedContent;
  const titleDate = ticket.summaryKind === "quote" || ticket.summaryKind === "preventive" ? `<div class="ts-title-date"><span>Scheduled start date</span><time>${ticket.created}</time></div>` : ticket.summaryKind === "closed" || isTechSupport ? "" : `<time>${ticket.created}</time>`;
  app.innerHTML = `<section class="screen screen--ticket-summary"><div class="mi-stage"><div class="mi-shell ts-shell ${route === "tech-support-summary" ? "ts-shell--tech" : "ts-shell--standard"}">
    <header class="mi-header"><div class="mi-header__left"><button class="mi-icon-button" type="button" aria-label="Open menu"><img src="assets/icons/navigation/hamburger/size=24px, style=mono.svg" alt="" /></button><img class="mi-brand" src="assets/instruments/thermo-fisher-mark.png" alt="Thermo Fisher Scientific" /><span class="mi-header__label">Connect Platform</span><strong class="mi-header__product">Services Central</strong></div><div class="mi-header__right"><button class="mi-icon-button mi-notifications" type="button" aria-label="Notifications"><img src="assets/icons/notifications/bell/size=24px, style=mono.svg" alt="" /><span>2</span></button><button class="mi-icon-button" type="button" aria-label="User profile"><img src="assets/icons/users/profile/size=24px, style=mono.svg" alt="" /></button></div></header>
    <div data-platform-sidebar-mount></div><main class="mi-main ts-main"><section class="ts-titlebar"><div><h1>${ticket.title}${usesReferenceLayout ? ` <span class="ts-state ts-state--${ticket.state.toLowerCase().replaceAll(" ", "-")}">${ticket.state}</span>` : ""}</h1>${titleMeta}</div>${titleDate}</section><section class="ts-content">${isTechSupport ? techContent : defaultContent}</section></main><footer class="mi-footer"><span>© 2025 - Thermo Fisher Scientific</span><i></i><a href="#privacy">Privacy policy</a><a href="#terms">Terms of use</a></footer></div></div></section>`;
  mountPlatformSidebar("support-history");
  app.querySelector("[data-go-back]")?.addEventListener("click", () => setRoute("support-history"));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = `${ticket.title} — Services Central`;
}

function wireRequestSupport() {
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  app.querySelectorAll("[data-rs-toast]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.rsToast));
  });
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestSupport() {
  const template = document.querySelector("#request-support-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("request-support");
  wireRequestSupport();
  document.title = "Request support — Services Central";
}

function wireInstrumentSupportSelection() {
  const continueButton = app.querySelector("[data-iss-continue]");
  const search = app.querySelector("[data-iss-search]");
  const systemToggle = app.querySelector("[data-iss-system-toggle]");
  const systemRow = app.querySelector(".iss-system");
  const systemRows = [...app.querySelectorAll("[data-iss-row]")];
  const collapsibleSystemRows = systemRows.slice(0, 5);
  let systemExpanded = true;
  systemRows.forEach((row) => {
    row.classList.add("iss-system-child");
    row.querySelectorAll('img[src="assets/icons/actions/return/Size=16px, Style=Mono.svg"]').forEach((icon) => {
      icon.src = "assets/icons/actions/system-return/Size=16px, Style=Mono.svg";
    });
    const cells = row.cells;
    if (!row.dataset.group) row.dataset.group = cells[5]?.textContent.trim() || "—";
    if (!row.dataset.type) row.dataset.type = cells[6]?.textContent.trim() || "—";
    if (!row.dataset.model) row.dataset.model = cells[7]?.textContent.trim() || "—";
    if (!row.dataset.coverage) row.dataset.coverage = cells[8]?.textContent.trim() || "—";
  });
  systemRows.slice(5).forEach((row) => {
    const image = row.cells[2]?.querySelector("img");
    if (!image) return;
    image.classList.add("iss-indent-instrument");
    row.cells[1].replaceChildren(image);
  });
  const fullEllipsisText = new Map([
    ["Mass Spec Lif...", "Mass Spec Life Sciences"],
    ["MSTSQQUAN...", "MSTSQQUANTISPLUS"],
    ["Global...", "Global group"],
    ["Department...", "Department group"],
  ]);
  let tooltipCount = 0;
  systemRows.forEach((row) => {
    [5, 6, 7].forEach((column) => {
      const cell = row.cells[column];
      const value = cell?.textContent.trim();
      if (!value?.includes("...")) return;
      const trigger = cell.querySelector("button") || document.createElement("span");
      if (!trigger.parentElement) {
        trigger.textContent = value;
        trigger.tabIndex = 0;
        cell.replaceChildren(trigger);
      }
      const tooltip = document.createElement("span");
      const tooltipId = `iss-overflow-tooltip-${++tooltipCount}`;
      tooltip.className = "iss-overflow-tooltip";
      tooltip.id = tooltipId;
      tooltip.setAttribute("role", "tooltip");
      tooltip.hidden = true;
      tooltip.textContent = fullEllipsisText.get(value) || value;
      trigger.classList.add("iss-overflow");
      trigger.dataset.issOverflowTooltip = "";
      trigger.setAttribute("aria-describedby", tooltipId);
      trigger.append(tooltip);
      const showTooltip = () => setSupportHistoryTooltip(trigger, true);
      const hideTooltip = () => setSupportHistoryTooltip(trigger, false);
      trigger.addEventListener("mouseover", showTooltip);
      trigger.addEventListener("mouseout", hideTooltip);
      trigger.addEventListener("focus", showTooltip);
      trigger.addEventListener("blur", hideTooltip);
      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          hideTooltip();
          trigger.blur();
        }
      });
    });
  });
  const filterConfig = [
    ["group", "Groups"], ["type", "Type"], ["model", "Model"], ["coverage", "Coverage"],
  ];
  const tableFilters = filterConfig.map(([key, label]) => {
    const host = app.querySelector(`[data-iss-filter-host="${key}"]`);
    const options = [...new Set(systemRows.map((row) => row.dataset[key]).filter((value) => value && value !== "—"))];
    return { key, filter: new window.MultiSelectFilter(host, { label, options: options.length ? options : ["—"], menuStyle: "figma-column" }) };
  });
  const filterRows = () => {
    const query = search.value.trim().toLowerCase();
    let visibleSystemInstrument = false;
    systemRows.forEach((row) => {
      const matchesSearch = !query || row.dataset.search.includes(query);
      const matchesFilters = tableFilters.every(({ key, filter }) => !filter.values.length || filter.values.includes(row.dataset[key]));
      row.hidden = (!systemExpanded && collapsibleSystemRows.includes(row)) || !matchesSearch || !matchesFilters;
      if (collapsibleSystemRows.includes(row) && !row.hidden) visibleSystemInstrument = true;
    });
    systemRow.hidden = Boolean(query) && !visibleSystemInstrument;
  };
  systemToggle.addEventListener("click", () => {
    systemExpanded = !systemExpanded;
    systemToggle.setAttribute("aria-expanded", String(systemExpanded));
    systemToggle.setAttribute("aria-label", `${systemExpanded ? "Collapse" : "Expand"} system`);
    systemToggle.querySelector("img").style.transform = systemExpanded ? "" : "rotate(-90deg)";
    filterRows();
  });
  tableFilters.forEach(({ filter }) => filter.host.addEventListener("multiselect-filter-change", filterRows));
  const pageSizeButton = app.querySelector("[data-iss-page-size]");
  const pageSizeMenu = app.querySelector("[data-iss-page-size-menu]");
  const closePageSizeMenu = () => {
    pageSizeMenu.hidden = true;
    pageSizeButton.setAttribute("aria-expanded", "false");
  };
  pageSizeButton.addEventListener("click", () => {
    pageSizeMenu.hidden = !pageSizeMenu.hidden;
    pageSizeButton.setAttribute("aria-expanded", String(!pageSizeMenu.hidden));
  });
  pageSizeMenu.querySelectorAll("[data-iss-page-size-option]").forEach((option) => option.addEventListener("click", () => {
    const value = option.dataset.issPageSizeOption;
    const caret = pageSizeButton.querySelector("img");
    pageSizeButton.replaceChildren(document.createTextNode(`${value} `), caret);
    pageSizeMenu.querySelectorAll("[data-iss-page-size-option]").forEach((item) => item.setAttribute("aria-selected", String(item === option)));
    closePageSizeMenu();
  }));
  document.addEventListener("mousedown", (event) => {
    if (!event.target.closest(".iss-page-size-control")) closePageSizeMenu();
  });
  pageSizeButton.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePageSizeMenu();
  });
  app.querySelectorAll("[data-iss-instrument]").forEach((input) => input.addEventListener("change", () => {
    continueButton.disabled = !input.checked;
  }));
  search.addEventListener("input", filterRows);
  continueButton.addEventListener("click", () => {
    const selectedRow = app.querySelector("[data-iss-instrument]:checked")?.closest("tr");
    if (selectedRow) {
      selectedOpenSupportTicketInstrument = {
        serial: selectedRow.cells[3].textContent.trim(),
        nickname: selectedRow.cells[4].textContent.trim(),
        type: selectedRow.cells[6].textContent.trim(),
        model: selectedRow.cells[7].textContent.trim(),
        image: selectedRow.querySelector('img[src*="assets/instruments/"]')?.getAttribute("src"),
      };
    }
    setRoute("open-support-ticket-details");
  });
  app.querySelectorAll("[data-iss-toast], [data-iss-filter], [data-iss-instrument-link]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.issToast || "Instrument details opened")));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderOpenSupportTicket() {
  const template = document.querySelector("#open-support-ticket-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("request-support");
  wireInstrumentSupportSelection();
  document.title = "Open a support ticket — Services Central";
}

function wireOpenSupportTicketDetails() {
  const fields = [...app.querySelectorAll("[data-isd-field]")];
  const continueButton = app.querySelector("[data-isd-continue]");
  const detailsCard = app.querySelector(".isd-card");
  const uploadRequirements = app.querySelector(".isd-upload__requirements");
  const filledFiles = app.querySelector(".isd-filled-files");
  const uploadInput = app.querySelector("[data-isd-upload] input");
  const filesRoot = app.querySelector("[data-isd-files]");
  let uploadedFiles = [];
  if (selectedOpenSupportTicketInstrument) {
    const selected = selectedOpenSupportTicketInstrument;
    app.querySelector("[data-isd-serial]").textContent = selected.serial;
    app.querySelector("[data-isd-nickname]").textContent = selected.nickname;
    app.querySelector("[data-isd-type]").textContent = selected.type;
    app.querySelector("[data-isd-model]").textContent = selected.model;
    if (selected.image) app.querySelector("[data-isd-instrument-image]").src = selected.image;
  }
  const updateForm = ({ updateCounts = true } = {}) => {
    fields.forEach((field) => {
      const count = app.querySelector(`[data-isd-count="${field.dataset.isdField}"]`);
      if (updateCounts && count) count.textContent = `${field.value.length} / ${field.maxLength}`;
    });
    const isComplete = fields.every((field) => field.value.trim());
    continueButton.disabled = !isComplete;
    detailsCard.classList.toggle("is-filled", isComplete);
    uploadRequirements.hidden = uploadedFiles.length > 0;
    filledFiles.hidden = uploadedFiles.length === 0;
  };
  fields.forEach((field) => field.addEventListener("input", () => updateForm()));
  const renderUploadedFiles = () => {
    filesRoot.replaceChildren(...uploadedFiles.map((file, index) => {
      const item = document.createElement("article");
      item.innerHTML = `<img src="assets/icons/media/document/size=24px, style=mono.svg" alt="" /><span>${file.name}</span><small>${Math.max(1, Math.ceil(file.size / 1024 / 1024))}mb</small><button type="button" aria-label="Remove ${file.name}"><img src="assets/icons/actions/delete/size=16px, style=mono.svg" alt="" /></button>`;
      item.querySelector("button").addEventListener("click", () => {
        uploadedFiles.splice(index, 1);
        renderUploadedFiles();
        updateForm();
      });
      return item;
    }));
  };
  app.querySelector("[data-isd-upload]").addEventListener("click", (event) => {
    if (event.target !== uploadInput) uploadInput.click();
  });
  uploadInput.addEventListener("change", () => {
    uploadedFiles = [...uploadInput.files].slice(0, 5);
    renderUploadedFiles();
    updateForm();
  });
  const infoTrigger = app.querySelector("[data-isd-info-tooltip]");
  infoTrigger.addEventListener("pointerenter", () => setSupportHistoryTooltip(infoTrigger, true));
  infoTrigger.addEventListener("pointerleave", () => setSupportHistoryTooltip(infoTrigger, false));
  infoTrigger.addEventListener("focus", () => setSupportHistoryTooltip(infoTrigger, true));
  infoTrigger.addEventListener("blur", () => setSupportHistoryTooltip(infoTrigger, false));
  infoTrigger.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSupportHistoryTooltip(infoTrigger, false);
  });
  continueButton.addEventListener("click", () => showToast("Continue to confirm contact information"));
  updateForm({ updateCounts: false });
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderOpenSupportTicketDetails() {
  const template = document.querySelector("#open-support-ticket-details-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("request-support");
  wireOpenSupportTicketDetails();
  document.title = "Open a support ticket — add request details";
}

function wireRequestPm() {
  const continueButton = app.querySelector("[data-pm-continue]");
  const search = app.querySelector("[data-pm-search]");
  const selectAll = app.querySelector("[data-pm-select-all]");
  const system = app.querySelector("[data-pm-system]");
  const instruments = [...app.querySelectorAll("[data-pm-instrument]")];

  const updateSelection = () => {
    const selected = instruments.filter((input) => input.checked).length;
    system.checked = selected > 0 && selected === instruments.length;
    system.indeterminate = selected > 0 && selected < instruments.length;
    selectAll.checked = system.checked;
    selectAll.indeterminate = system.indeterminate;
    continueButton.disabled = selected === 0;
    app.querySelector("[data-pm-selected-count]").textContent = String(selected);
  };

  const setAll = (checked) => {
    instruments.forEach((input) => { input.checked = checked; });
    updateSelection();
  };

  system.addEventListener("change", () => setAll(system.checked));
  selectAll.addEventListener("change", () => setAll(selectAll.checked));
  instruments.forEach((input) => input.addEventListener("change", updateSelection));
  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    app.querySelectorAll("[data-pm-row]").forEach((row) => {
      row.hidden = Boolean(query) && !row.dataset.search.includes(query);
    });
  });
  continueButton.addEventListener("click", () => showToast("Continue to View PM status"));
  app.querySelectorAll("[data-pm-promo], [data-pm-filter], [data-pm-instrument-link]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.pmPromo || "Instrument details opened"));
  });
  updateSelection();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestPm() {
  const template = document.querySelector("#request-pm-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("request-support");
  wireRequestPm();
  document.title = "Request PM scheduling — Services Central";
}

function wireRequestServicePlan() {
  const continueButton = app.querySelector("[data-sp-continue]");
  const search = app.querySelector("[data-sp-search]");
  const selectAll = app.querySelector("[data-sp-select-all]");
  const system = app.querySelector("[data-sp-system]");
  const instruments = [...app.querySelectorAll("[data-sp-instrument]")];

  const updateSelection = () => {
    const selected = instruments.filter((input) => input.checked).length;
    system.checked = selected > 0 && selected === instruments.length;
    system.indeterminate = selected > 0 && selected < instruments.length;
    selectAll.checked = system.checked;
    selectAll.indeterminate = system.indeterminate;
    continueButton.disabled = selected === 0;
    app.querySelector("[data-sp-selected-count]").textContent = String(selected);
  };

  const setAll = (checked) => {
    instruments.forEach((input) => { input.checked = checked; });
    updateSelection();
  };

  system.addEventListener("change", () => setAll(system.checked));
  selectAll.addEventListener("change", () => setAll(selectAll.checked));
  instruments.forEach((input) => input.addEventListener("change", updateSelection));
  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    app.querySelectorAll("[data-sp-row]").forEach((row) => {
      row.hidden = Boolean(query) && !row.dataset.search.includes(query);
    });
  });
  continueButton.addEventListener("click", () => showToast("Continue to Add request details"));
  app.querySelectorAll("[data-sp-filter], [data-sp-instrument-link]").forEach((button) => {
    button.addEventListener("click", () => showToast("Instrument details opened"));
  });
  updateSelection();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestServicePlan() {
  const template = document.querySelector("#request-serviceplan-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("request-support");
  wireRequestServicePlan();
  document.title = "Request a service plan quote — Services Central";
}

function renderRequestQualification() {
  const template = document.querySelector("#request-serviceplan-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  const section = app.querySelector(".screen--request-serviceplan");
  section.classList.replace("screen--request-serviceplan", "screen--request-qualification");
  section.setAttribute("aria-label", "Request qualification service");
  app.querySelector(".pm-titlebar h1").textContent = "Request qualification service";
  app.querySelector(".sp-steps li:first-child strong").textContent = "Select instrument";
  app.querySelector("#sp-description").textContent = "Request a quote for a compliance service such as Installation Qualification (IQ), Operational Qualification (OQ), Requalification (RQ), or Temperature mapping.";
  app.querySelector(".sp-steps").setAttribute("aria-label", "Qualification service request progress");
  app.querySelector(".pm-select-all span").textContent = "Select all 267 instruments";
  app.querySelector(".pm-pagination strong").textContent = "267";
  mountPlatformSidebar("request-support");
  wireRequestServicePlan();
  document.title = "Request qualification service — Services Central";
}

function wireRequestCalibration() {
  const continueButton = app.querySelector("[data-cal-continue]");
  const search = app.querySelector("[data-cal-search]");
  const selectAll = app.querySelector("[data-cal-select-all]");
  const instruments = [...app.querySelectorAll("[data-cal-instrument]")];
  const updateSelection = () => {
    const selected = instruments.filter((input) => input.checked).length;
    selectAll.checked = selected > 0 && selected === instruments.length;
    selectAll.indeterminate = selected > 0 && selected < instruments.length;
    continueButton.disabled = selected === 0;
  };
  selectAll.addEventListener("change", () => {
    instruments.forEach((input) => { input.checked = selectAll.checked; });
    updateSelection();
  });
  instruments.forEach((input) => input.addEventListener("change", updateSelection));
  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    app.querySelectorAll("[data-cal-row]").forEach((row) => { row.hidden = Boolean(query) && !row.dataset.search.includes(query); });
  });
  continueButton.addEventListener("click", () => showToast("Continue to Add request details"));
  app.querySelectorAll("[data-cal-filter], [data-cal-instrument-link]").forEach((button) => button.addEventListener("click", () => showToast("Instrument details opened")));
  updateSelection();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestCalibration() {
  const template = document.querySelector("#request-calibration-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("request-support");
  wireRequestCalibration();
  document.title = "Request a calibration service — Services Central";
}

function wireRequestInstallation() {
  const service = app.querySelector("[data-installation-service]");
  const type = app.querySelector("[data-installation-type]");
  const details = app.querySelector("[data-installation-details]");
  const continueButton = app.querySelector("[data-installation-continue]");
  const orderToggle = app.querySelector("[data-installation-order-toggle]");
  const orderMenu = app.querySelector("[data-installation-order-menu]");
  const orderLabel = app.querySelector("[data-installation-order-label]");
  const orderInputs = [...app.querySelectorAll("[data-installation-order]")];
  const update = () => { continueButton.disabled = !service.value || !type.value || !details.value.trim(); };
  type.addEventListener("change", update);
  orderToggle.addEventListener("click", () => {
    const expanded = orderToggle.getAttribute("aria-expanded") !== "true";
    orderToggle.setAttribute("aria-expanded", String(expanded));
    orderMenu.hidden = !expanded;
  });
  orderInputs.forEach((input) => input.addEventListener("change", () => {
    const selected = orderInputs.filter((order) => order.checked);
    service.value = selected.map((order) => order.value).join(",");
    orderLabel.textContent = selected.length ? `${selected.length} order(s) selected` : "Please select order(s)";
    update();
  }));
  app.querySelector("[data-installation-order-help]").addEventListener("click", () => showToast("Installation order support opened"));
  details.addEventListener("input", () => {
    app.querySelector("[data-installation-count]").textContent = String(details.value.length);
    update();
  });
  continueButton.addEventListener("click", () => showToast("Continue to Confirm contact information"));
  update();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestInstallation() {
  const template = document.querySelector("#request-installation-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("request-support");
  wireRequestInstallation();
  document.title = "Installation support — Services Central";
}

function wireServicePlanContacts() {
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  app.querySelectorAll("[data-splan-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const group = toggle.closest("[data-splan-group]");
      const expanded = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(expanded));
      group.classList.toggle("is-expanded", expanded);
      group.classList.toggle("is-collapsed", !expanded);
      const icon = toggle.querySelector("img");
      icon.src = `assets/icons/directions/chevron ${expanded ? "down" : "right"}/size=24px, style=mono.svg`;
    });
  });
  app.querySelector("[data-splan-select-all]").addEventListener("click", (event) => {
    const checks = [...app.querySelectorAll("[data-splan-check]")];
    const select = checks.some((check) => !check.checked);
    checks.forEach((check) => { check.checked = select; });
    event.currentTarget.textContent = select ? "Clear selection" : "Select all 14 instruments";
  });
  app.querySelectorAll("[data-splan-action]").forEach((button) => {
    button.addEventListener("click", () => showToast(`${button.dataset.splanAction} selected`));
  });
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderServicePlanContacts() {
  const template = document.querySelector("#service-plan-contacts-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("service-plan-contacts");
  wireServicePlanContacts();
  document.title = "Service plan contacts — Services Central";
}

function wireConsumables() {
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  app.querySelectorAll("[data-cons-action]").forEach((button) => {
    button.addEventListener("click", () => showToast(`${button.dataset.consAction} selected`));
  });
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderConsumables() {
  const template = document.querySelector("#consumables-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("consumables");
  wireConsumables();
  document.title = "Consumables — Services Central";
}

const NOTIFICATION_SETTINGS_ROWS = [
  ["Instruments shared with me", false],
  ["Support ticket status", false],
  ["Open", true],
  ["In progress", true],
  ["Delayed due to parts", true],
  ["Customer testing", true],
  ["Pending customer readiness", true],
  ["Closed", true],
  ["Request submitted", false],
  ["Instrument support", true],
  ["Preventive maintenance", true],
  ["Service plans", true],
  ["Compliance services - Qualification", true],
  ["Compliance services - Calibration", true],
  ["Quotes", false],
  ["New quote available", true],
  ["Quote expiring soon", true],
  ["Access Management", false],
  ["Instrument access approval", true],
  ["Instrument access request(s) approved", true],
  ["Instrument access request(s) denied", true],
];

function setNotificationTab(tab) {
  const selected = tab === "services" ? "services" : "connected";
  app.querySelectorAll("[data-ns-tab]").forEach((button) => {
    const active = button.dataset.nsTab === selected;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  app.querySelector(".ns-tabs").classList.toggle("is-services", selected === "services");
  app.querySelector("[data-ns-panel='connected']").hidden = selected !== "connected";
  app.querySelector("[data-ns-panel='services']").hidden = selected !== "services";
}

function setNotificationSwitch(button, checked) {
  button.setAttribute("aria-checked", String(checked));
}

function wireNotifications() {
  const list = app.querySelector("[data-ns-list]");
  NOTIFICATION_SETTINGS_ROWS.forEach(([label, child]) => {
    const row = document.createElement("div");
    row.className = `ns-setting-row${child ? " is-child" : ""}`;
    row.innerHTML = `<span>${label}</span><button class="ns-switch" type="button" role="switch" aria-checked="true" aria-label="${label}"><span></span></button>`;
    list.append(row);
  });
  app.querySelectorAll("[data-ns-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.nsTab === "edge") {
        showToast("Edge Management notification settings selected");
        return;
      }
      setNotificationTab(button.dataset.nsTab);
    });
  });
  app.querySelectorAll(".ns-switch").forEach((button) => {
    button.addEventListener("click", () => setNotificationSwitch(button, button.getAttribute("aria-checked") !== "true"));
  });
  app.querySelector("[data-ns-global]").addEventListener("click", (event) => {
    const checked = event.currentTarget.getAttribute("aria-checked") === "true";
    app.querySelector("[data-ns-global-copy]").textContent = `All email notifications turned ${checked ? "on" : "off"}.`;
  });
  app.querySelector("[data-ns-master]").addEventListener("click", (event) => {
    const checked = event.currentTarget.getAttribute("aria-checked") === "true";
    app.querySelectorAll(".ns-setting-row").forEach((row) => {
      row.classList.toggle("is-disabled", !checked);
      setNotificationSwitch(row.querySelector(".ns-switch"), checked);
    });
  });
  app.querySelectorAll("[data-ns-connected]").forEach((button) => button.addEventListener("click", () => showToast(`${button.dataset.nsConnected} selected`)));
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  setNotificationTab("services");
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderNotifications() {
  const template = document.querySelector("#notifications-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountPlatformSidebar("notifications");
  wireNotifications();
  document.title = "Notification settings — Connect Platform";
}

const INSTALLATION_ITEMS = [
  ["10", "1", "vanquish-pump.png", "VN-P10-A-01", "Vanquish binary pump N"],
  ["10", "1", "vanquish-pump.png", "VN-P10-A-01", "Vanquish binary pump N"],
  ["11", "1", "vanquish-sampler.png", "6252.1940", "Vanquish split sampler NT"],
  ["11", "1", "vanquish-sampler.png", "6252.1940", "Vanquish split sampler NT"],
  ["13", "1", "vanquish-column.png", "VN-C10-A-01", "Vanquish column compartment N"],
  ["13", "1", "vanquish-column.png", "VN-C10-A-01", "Vanquish column compartment N"],
  ["14", "1", "tsq.png", "BRE725660", "Astral"],
  ["17", "1", "vanquish-detector.png", "VC-D50-A-01", "Vanquish fluorescence detector"],
  ["17", "1", "vanquish-detector.png", "VC-D50-A-01", "Vanquish fluorescence detector"],
  ["18", "1", "tsq.png", "BRE725660", "Astral"],
];

function setInstallationExpanded(expanded) {
  const order = app.querySelector("[data-ins-order]");
  const toggle = app.querySelector("[data-ins-toggle]");
  if (!order || !toggle) return;
  order.classList.toggle("is-expanded", expanded);
  toggle.setAttribute("aria-expanded", String(expanded));
  app.querySelectorAll("[data-ins-expanded]").forEach((element) => { element.hidden = !expanded; });
  const route = expanded ? "installations-expanded" : "installations";
  window.history.replaceState({}, "", `#${route}`);
  document.title = expanded ? "Installations — order 9012611245 — Services Central" : "Installations — Services Central";
}

function wireInstallations(expanded = false) {
  const tbody = app.querySelector("[data-ins-items]");
  INSTALLATION_ITEMS.forEach(([item, qty, image, catalog, name]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item}</td><td>${qty}</td><td><img src="assets/instruments/${image}" alt="" /></td><td>${catalog}</td><td title="${name}">${name}</td><td><span class="ins-awaiting">Awaiting action(s)</span></td><td>—</td><td>—</td><td><button class="ins-view" type="button" data-ins-action="View ${catalog}">View</button></td>`;
    tbody.append(row);
  });
  setInstallationExpanded(expanded);
  app.querySelector("[data-ins-toggle]").addEventListener("click", (event) => setInstallationExpanded(event.currentTarget.getAttribute("aria-expanded") !== "true"));
  app.querySelector(".ins-order--secondary .ins-order-toggle").addEventListener("click", () => showToast("Order 7659430547 is in progress"));
  app.querySelectorAll("[data-ins-action]").forEach((button) => button.addEventListener("click", () => showToast(`${button.dataset.insAction} selected`)));
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  wireRouteControls();
}

function renderInstallations(expanded = false) {
  const template = document.querySelector("#installations-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  if (window.PlatformSidebar) {
    window.PlatformSidebar.mount(
      document.querySelector("[data-platform-sidebar-mount]"),
      {
        activeRoute: "installations",
        collapsed: true,
      },
    );
    window.PlatformSidebar.wire(document);
  }
  wireInstallations(expanded);
}

function renderFlow(route) {
  const screen = ROUTES[route];
  const template = document.querySelector("#flow-template");
  app.replaceChildren(template.content.cloneNode(true));
  const section = app.querySelector(".screen--flow");
  const canvas = app.querySelector("[data-flow-canvas]");
  const image = app.querySelector("[data-flow-image]");
  section.setAttribute("aria-label", screen.title);
  app.querySelector("[data-flow-title]").textContent = screen.title;
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  canvas.style.setProperty("--screen-width", `${screen.width}px`);
  canvas.style.setProperty("--screen-ratio", `${screen.width} / ${screen.height}`);
  if (screen.kind === "email") canvas.classList.add("flow-canvas--email");
  if (screen.kind === "signin") canvas.classList.add("flow-canvas--signin");
  image.src = screen.src;
  image.width = screen.width;
  image.height = screen.height;
  image.alt = screen.title;
  addScreenSpecificHotspots(canvas, route, screen);
  wireRouteControls();
  document.title = `${screen.title} — Services Central`;
}

function render() {
  disconnectEditSpcCanvas();
  const route = routeFromHash();
  if (route === "signin") {
    const template = document.querySelector("#sign-in-template");
    app.replaceChildren(template.content.cloneNode(true));
    document.title = "Services Central Sign In";
    wireSignIn();
  } else if (route === "dashboard") {
    const template = document.querySelector("#dashboard-native-template");
    app.replaceChildren(template.content.cloneNode(true));
    mountPlatformSidebar("dashboard");
    document.title = "Services Central Dashboard";
    wireDashboard();
  } else if (route === "edit-spc") {
    renderEditSpc();
  } else if (route === "my-instruments") {
    renderMyInstruments();
  } else if (route === "add-instruments") {
    renderAddInstruments();
  } else if (route === "installations" || route === "installations-expanded") {
    renderInstallations(route === "installations-expanded");
  } else if (route === "support-history") {
    renderSupportHistory();
  } else if (TICKET_SUMMARIES[route]) {
    renderTicketSummary(route);
  } else if (route === "request-support") {
    renderRequestSupport();
  } else if (route === "request-pm") {
    renderRequestPm();
  } else if (route === "request-serviceplan") {
    renderRequestServicePlan();
  } else if (route === "request-qualification") {
    renderRequestQualification();
  } else if (route === "request-calibration") {
    renderRequestCalibration();
  } else if (route === "request-installation") {
    renderRequestInstallation();
  } else if (route === "open-support-ticket") {
    renderOpenSupportTicket();
  } else if (route === "open-support-ticket-details") {
    renderOpenSupportTicketDetails();
  } else if (route === "service-plan-contacts") {
    renderServicePlanContacts();
  } else if (route === "consumables") {
    renderConsumables();
  } else if (route === "notifications") {
    renderNotifications();
  } else {
    renderFlow(route);
  }
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

FLOW_MENU.forEach(([label, route]) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "flow-link";
  button.textContent = label;
  button.addEventListener("click", () => {
    flowsDialog.close();
    setRoute(route);
  });
  flowsGrid.append(button);
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => helpDialog.close());
});
document.querySelector("[data-close-flows]").addEventListener("click", () => flowsDialog.close());
document.querySelector("[data-close-services-help]").addEventListener("click", closeServicesHelpModal);
servicesHelpDialog.querySelectorAll("[data-services-help-action]").forEach((control) => {
  control.addEventListener("click", () => {
    const action = control.dataset.servicesHelpAction;
    servicesHelpDialog.dispatchEvent(new CustomEvent("services-help:action", { detail: { action } }));
    showToast(action === "email" ? "Email support selected" : "Tours selected");
  });
});
helpDialog.addEventListener("click", (event) => {
  if (event.target === helpDialog) helpDialog.close();
});
flowsDialog.addEventListener("click", (event) => {
  if (event.target === flowsDialog) flowsDialog.close();
});
servicesHelpDialog.addEventListener("click", (event) => {
  if (event.target === servicesHelpDialog) closeServicesHelpModal();
});
window.addEventListener("popstate", render);
window.addEventListener("hashchange", render);
render();
