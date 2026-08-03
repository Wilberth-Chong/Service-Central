const app = document.querySelector("#app");
const helpDialog = document.querySelector("#help-dialog");
const servicesHelpDialog = document.querySelector("#services-help-dialog");
const flowsDialog = document.querySelector("#flows-dialog");
const flowsGrid = document.querySelector("[data-flows-grid]");
const toast = document.querySelector(".toast");
let toastTimer;

const ROUTES = {
  "my-instruments": { title: "My instruments", src: "assets/flows/my-instruments.png", width: 1440, height: 1460, kind: "app" },
  "add-instruments": { title: "Add instruments", src: "assets/flows/add-instruments.png", width: 1440, height: 1460, kind: "app" },
  installations: { title: "Installations", src: "assets/flows/installations.png", width: 1440, height: 2900, kind: "app" },
  "support-history": { title: "Support request history", src: "assets/flows/support-history.png", width: 1440, height: 1460, kind: "app" },
  "service-plan-contacts": { title: "Service plan contacts", src: "assets/flows/service-plan-contacts.png", width: 1440, height: 1800, kind: "app" },
  "request-support": { title: "Request support", src: "assets/flows/request-support.png", width: 1440, height: 1460, kind: "app" },
  notifications: { title: "Notification settings", src: "assets/flows/notifications.png", width: 1440, height: 2200, kind: "app" },
  consumables: { title: "Consumables", src: "assets/flows/consumables.png", width: 1440, height: 2200, kind: "app" },
  education: { title: "Browse education", src: "assets/flows/education.png", width: 1440, height: 1460, kind: "external" },
  "ticket-detail": { title: "Support ticket detail", src: "assets/flows/ticket-detail.png", width: 1456, height: 2069, kind: "app" },
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
  ["Support history", "support-history"],
  ["Service plan contacts", "service-plan-contacts"],
  ["Request support", "request-support"],
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

function routeFromHash() {
  const route = window.location.hash.replace(/^#\/?/, "");
  if (route === "dashboard" || route === "signin" || ROUTES[route]) return route;
  return "signin";
}

function setRoute(route) {
  const safeRoute = route === "dashboard" || route === "signin" || ROUTES[route] ? route : "signin";
  const nextHash = `#${safeRoute}`;
  if (window.location.hash !== nextHash) window.history.pushState({}, "", nextHash);
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
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
    "my-instruments": [{ label: "Open instrument", route: "instrument-access", x: 88, y: 408, w: 1320, h: 120 }],
    "add-instruments": [{ label: "Continue adding instruments", route: "instrument-access", x: 810, y: 1052, w: 150, h: 48 }],
    "support-history": [{ label: "Open support ticket", route: "ticket-detail", x: 88, y: 455, w: 1320, h: 72 }],
    "request-support": [
      { label: "Open a support ticket", route: "ticket-status-email", x: 730, y: 348, w: 210, h: 50 },
      { label: "Request preventive maintenance", route: "pm-cycle", x: 730, y: 483, w: 210, h: 50 },
      { label: "Request a service plan", route: "service-plan-approval", x: 730, y: 618, w: 210, h: 50 },
      { label: "Installation support", route: "installation-order", x: 730, y: 888, w: 210, h: 50 },
    ],
    "instrument-access": [{ label: "View PM cycle", route: "pm-cycle", x: 56, y: 534, w: 1384, h: 128 }],
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
  scope.querySelectorAll("[data-open-services-help]").forEach((control) => {
    control.addEventListener("click", () => servicesHelpDialog.showModal());
  });
}

function wireSignIn() {
  app.querySelector("[data-signin-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    setRoute("dashboard");
  });
  app.querySelector("[data-help]").addEventListener("click", () => helpDialog.showModal());
}

function wireDashboard() {
  app.querySelector("[data-back-to-signin]").addEventListener("click", () => setRoute("signin"));
  wireRouteControls();
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
  const route = routeFromHash();
  if (route === "signin") {
    const template = document.querySelector("#sign-in-template");
    app.replaceChildren(template.content.cloneNode(true));
    document.title = "Services Central Sign In";
    wireSignIn();
  } else if (route === "dashboard") {
    const template = document.querySelector("#dashboard-template");
    app.replaceChildren(template.content.cloneNode(true));
    document.title = "Services Central Dashboard";
    wireDashboard();
  } else {
    renderFlow(route);
  }
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
document.querySelector("[data-close-services-help]").addEventListener("click", () => servicesHelpDialog.close());
helpDialog.addEventListener("click", (event) => {
  if (event.target === helpDialog) helpDialog.close();
});
flowsDialog.addEventListener("click", (event) => {
  if (event.target === flowsDialog) flowsDialog.close();
});
servicesHelpDialog.addEventListener("click", (event) => {
  if (event.target === servicesHelpDialog) servicesHelpDialog.close();
});
window.addEventListener("popstate", render);
window.addEventListener("hashchange", render);
render();
