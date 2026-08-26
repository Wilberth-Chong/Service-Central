const app = document.querySelector("#app");
const helpDialog = document.querySelector("#help-dialog");
const servicesHelpDialog = document.querySelector("#services-help-dialog");
const flowsDialog = document.querySelector("#flows-dialog");
const installationPendingDialog = createInstallationPendingDialog();
const installationWelcomeDialog = document.querySelector("#installation-welcome-dialog");
const servicePlanApprovalDialog = document.querySelector("#service-plan-approval-dialog");
const servicePlanDeclineDialog = document.querySelector("#service-plan-decline-dialog");
const addUserOrderDialog = document.querySelector("#add-user-order-dialog");
const preferredDeliveryDatesDialog = document.querySelector("#preferred-delivery-dates-dialog");
const deliveryChecklistUploadDialog = document.querySelector("#delivery-checklist-upload-dialog");
const preInstallChecklistUploadDialog = document.querySelector("#preinstall-checklist-upload-dialog");
const deliveryChecklistConfirmationDialog = document.querySelector("#delivery-checklist-confirmation-dialog");
const deliveryChecklistDetailsDialog = document.querySelector("#delivery-checklist-details-dialog");
const deliveryDatesConfirmationDialog = document.querySelector("#delivery-dates-confirmation-dialog");
const deliveryDatesPauseDialog = document.querySelector("#delivery-dates-pause-dialog");
const installationStatusScenariosDialog = document.querySelector("#installation-status-scenarios-dialog");
const installationActivityDialog = document.querySelector("#installation-activity-dialog");
const miEditColumnsDialog = document.querySelector("#mi-edit-columns-dialog");
const miEditColumnsDefaultRowsMarkup = miEditColumnsDialog.querySelector("tbody").innerHTML;
const miCreateDialog = document.querySelector("#mi-create-dialog");
const miCreateSystemDialog = document.querySelector("#mi-create-system-dialog");
const miCreateGroupDialog = document.querySelector("#mi-create-group-dialog");
const miSystemQuickviewDialog = document.querySelector("#mi-system-quickview-dialog");
const miAccessDialog = document.querySelector("#mi-access-dialog");
const miBulkAccessDialog = document.querySelector("#mi-bulk-access-dialog");
const miShareDialog = document.querySelector("#mi-share-dialog");
const miCoverageDialog = document.querySelector("#mi-coverage-dialog");
const flowsGrid = document.querySelector("[data-flows-grid]");
const toast = document.querySelector(".toast");
const CONSUMABLES_SUPPORT_PORTAL_IMAGE = "assets/consumables/support-portal-login.png";
const DEFAULT_INSTALLATION_USER_EMAIL = "holly.hartman@company.com";
let toastTimer;
let preferredDeliveryDatesSubmitted = false;
let preferredDeliveryDateValues = { earliest: "", latest: "" };
let deliveryReminderPauseDays = "";
let deliveryChecklistSubmitted = false;
let deliveryChecklistUploadTimer;
let checklistConfirmationContext = "";
let preInstallChecklistsUploaded = 0;
let pendingPreInstallChecklists = [];
const submittedPreInstallChecklists = [];
const submittedProgressPreInstallChecklists = [];
let preInstallChecklistOrderContext = "9012611245";
const installationActivityEntries = [
  { orderNumber: "7659430547", date: "26 Jun 2025", prefix: "Submitted ", emphasis: "latest delivery date", suffix: ": 31 Jul 2025", user: DEFAULT_INSTALLATION_USER_EMAIL },
  { orderNumber: "7659430547", date: "26 Jun 2025", prefix: "Submitted ", emphasis: "earliest delivery date", suffix: ": 01 Jul 2025", user: DEFAULT_INSTALLATION_USER_EMAIL },
];
const preInstallChecklistUploadTimers = new WeakMap();
let draggedPreInstallUploader = null;
let installationStatusScenario = "in-progress";
let installationStatusTargetOrder = "9012611245";
let progressInstallationStatusScenario = "in-progress";
const noChecklistOrderState = { expanded: false, statusScenario: "in-progress", step3Complete: false };
let installationOrderCollapsedByUser = false;
let installationPendingShownForVisit = false;
let installationWelcomeFromEmail = false;
let servicePlanApprovalPending = false;
let servicePlanApprovalPromptShown = false;
let servicePlanApprovalAcceptedNotice = false;
let selectedInstallationShellContext = null;
const whiteGloveOrderStates = new Map([
  ["1901126245", { expanded: false, status: "default" }],
]);
const PREINSTALL_CHECKLISTS = [
  { id: "hplc", name: "HPLC template long name", instruments: "4 instrument(s)", submittedBy: "cameron.williamson@companyname.com", submittedOn: "01 Jul 2025", items: [["10", "2", "VN-P10-A-01", "Vanquish binary pump N"], ["11", "2", "6252.1940", "Vanquish split sampler NT"]] },
  { id: "mass-spec", name: "Mass spec template long name", instruments: "2 instrument(s)", submittedBy: "adam.smith@companyname.com", submittedOn: "03 Jul 2025", items: [["13", "1", "VN-C10-A-01", "Vanquish column compartment N"], ["14", "1", "BRE725660", "Astral"]] },
  { id: "third", name: "Third template long name", instruments: "1 instrument(s)", submittedBy: "cameron.williamson@companyname.com", submittedOn: "01 Jul 2025", items: [["17", "1", "VC-D50-A-01", "Vanquish fluorescence detector"]] },
  { id: "fourth", name: "Fourth template long name", instruments: "2 instrument(s)", submittedBy: "adam.smith@companyname.com", submittedOn: "03 Jul 2025", items: [["14", "2", "BRE725660", "Astral"]] },
  { id: "fifth", name: "Fifth template long name", instruments: "1 instrument(s)", submittedBy: "adam.smith@companyname.com", submittedOn: "03 Jul 2025", items: [["18", "1", "BRE725660", "Astral"]] },
];
const PROGRESS_PREINSTALL_CHECKLISTS = PREINSTALL_CHECKLISTS.slice(0, 3);
let preInstallTooltipCloseTimer;
let selectedSupportHistoryTicket = null;
let selectedOpenSupportTicketInstrument = null;
let installationSupportReturnRoute = "request-support";
const openSupportTicketDraft = { instrument: null, request: {}, files: [], contact: {} };
const pmRequestDraft = { instruments: [], schedulingInstruments: [], requestInstruments: [], schedulingDetails: "", requestDetails: "", contact: {} };
const qualificationRequestDraft = { instruments: [], additionalDetails: "", contact: {} };
const calibrationRequestDraft = { instruments: [], additionalDetails: "", serviceNeeds: { level: "", interval: "" }, contact: {} };
const servicePlanRequestDraft = { instruments: [], additionalDetails: "", coverageNeeds: { downtime: "", priorities: [] }, contact: {} };
const CALIBRATION_EUROPEAN_COUNTRIES = ["Austria", "Belgium", "Denmark", "Finland", "France", "Germany", "Ireland", "Italy", "Netherlands", "Norway", "Poland", "Portugal", "Spain", "Sweden", "Switzerland", "United Kingdom"];
const CALIBRATION_SUPPORTED_COUNTRIES = ["USA", "Canada", ...CALIBRATION_EUROPEAN_COUNTRIES];
const CALIBRATION_US_STATES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
const CALIBRATION_CANADIAN_PROVINCES = ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"];

class ChecklistUploadNote extends HTMLElement {
  connectedCallback() {
    if (this.firstElementChild) return;
    this.innerHTML = `<aside class="delivery-checklist-upload-modal__note"><img src="assets/icons/notifications/info/size=24px, style=bold.svg" alt="" /><div><strong>Please note:</strong><ul><li>File format must be <b>PDF</b></li><li>Only a <b>single PDF</b> file per checklist can be uploaded</li><li>File size must not exceed <b>10 MB</b></li></ul></div></aside>`;
  }
}

if (!customElements.get("checklist-upload-note")) customElements.define("checklist-upload-note", ChecklistUploadNote);

function formatInstallationActivityDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function recordInstallationActivity(prefix, emphasis = "", suffix = "", orderNumber = "9012611245") {
  installationActivityEntries.unshift({
    orderNumber,
    date: formatInstallationActivityDate(),
    prefix,
    emphasis,
    suffix,
    user: DEFAULT_INSTALLATION_USER_EMAIL,
  });
}

function renderInstallationActivityLog(orderNumber = "9012611245") {
  const rows = installationActivityDialog.querySelector("[data-installation-activity-rows]");
  rows.replaceChildren();
  const orderEntries = installationActivityEntries.filter((entry) => entry.orderNumber === orderNumber);
  orderEntries.forEach((entry) => {
    const row = document.createElement("tr");
    const action = document.createElement("td");
    action.append(document.createTextNode(entry.prefix));
    if (entry.emphasis) action.append(Object.assign(document.createElement("strong"), { textContent: entry.emphasis }));
    if (entry.suffix) action.append(document.createTextNode(entry.suffix));
    row.innerHTML = `<td>${entry.date}</td>`;
    row.append(action, Object.assign(document.createElement("td"), { textContent: entry.user }));
    rows.append(row);
  });
  installationActivityDialog.querySelector("[data-installation-activity-empty]").hidden = orderEntries.length > 0;
}

function openInstallationActivityLog(orderNumber = "9012611245") {
  renderInstallationActivityLog(orderNumber);
  installationActivityDialog.showModal();
  installationActivityDialog.querySelector("[data-close-installation-activity]").focus({ preventScroll: true });
}

function wireInstallationActivityTriggers(scope = document) {
  scope.querySelectorAll("[data-open-installation-activity]").forEach((button) => {
    if (button.dataset.installationActivityWired) return;
    button.dataset.installationActivityWired = "true";
    button.addEventListener("click", () => openInstallationActivityLog(button.dataset.orderNumber || "9012611245"));
  });
}

function wireOrderUsersTooltips(scope = document) {
  const users = [
    "adam.smith@companyname.com",
    "cameron.williamson@companyname.com",
    "darlene.robertson@companyname.com",
    "jason.bourne@companyname.com",
  ];

  scope.querySelectorAll(".ins-summary-box--users em").forEach((badge, index) => {
    if (badge.dataset.orderUsersTooltipWired) return;
    const tooltipId = `order-users-tooltip-${index}`;
    badge.dataset.orderUsersTooltipWired = "true";
    badge.classList.add("ins-order-users-trigger");
    badge.tabIndex = 0;
    badge.setAttribute("aria-label", "4 additional order users");
    badge.setAttribute("aria-describedby", tooltipId);
    badge.insertAdjacentHTML(
      "beforeend",
      `<span class="ins-order-users-tooltip" id="${tooltipId}" role="tooltip"><img src="assets/installations/order-users-tooltip.svg" alt="" /><span><strong>Order user(s)</strong><span>${users.map((user) => `<span>${user}</span>`).join("")}</span></span></span>`,
    );
  });
}

function normalizeOrderUsersCards(scope = document) {
  scope.querySelectorAll(".ins-summary-box--users").forEach((card, index) => {
    const infoTooltipId = `order-users-info-tooltip-${index}`;
    card.innerHTML = `
      <div class="ins-order-users-card">
        <div class="ins-order-users-title">
          <img src="assets/icons/users/profile/size=16px, style=mono.svg" alt="" />
          <strong>Order user(s)</strong>
          <span class="ins-order-users-info" tabindex="0" aria-label="About order users" aria-describedby="${infoTooltipId}">
            <img src="assets/icons/notifications/info/size=16px, style=bold.svg" alt="" />
            <span class="ins-order-users-info-tooltip" id="${infoTooltipId}" role="tooltip"><img src="assets/installations/order-users-info-tooltip.svg" alt="" /><span>Users that have accessed this order in Services Central</span></span>
          </span>
        </div>
        <div class="ins-order-users-content"><span>alexander.constantine@companyname.com</span><em>+4</em></div>
      </div>`;
  });
}

function wireOrderEmailTooltips(scope = document) {
  const emailLabels = scope.querySelectorAll(".ins-order-users-content > span, .ins-summary-box--support > div > span");
  emailLabels.forEach((emailLabel, index) => {
    if (emailLabel.closest(".ins-order-email-trigger")) return;
    const email = emailLabel.textContent.trim();
    const tooltipId = `installation-order-email-tooltip-${index}`;
    const trigger = document.createElement("span");
    trigger.className = "ins-order-email-trigger";
    trigger.setAttribute("aria-label", email);
    trigger.innerHTML = `<span class="ins-order-email-label">${email}</span><span class="ins-order-email-tooltip" id="${tooltipId}" role="tooltip"><img src="assets/installations/shared-email-tooltip.svg" alt="" /><span>${email}</span></span>`;
    emailLabel.replaceWith(trigger);
    const label = trigger.querySelector(".ins-order-email-label");
    const updateOverflowState = () => {
      const hasOverflow = label.scrollWidth > label.clientWidth + 1;
      trigger.classList.toggle("has-email-overflow", hasOverflow);
      trigger.tabIndex = hasOverflow ? 0 : -1;
      if (hasOverflow) trigger.setAttribute("aria-describedby", tooltipId);
      else trigger.removeAttribute("aria-describedby");
    };
    window.requestAnimationFrame(updateOverflowState);
    if (window.ResizeObserver) new ResizeObserver(updateOverflowState).observe(label);
  });
}

function wireAdditionalItemsTooltips(scope = document) {
  scope.querySelectorAll(".ins-additional > img:last-child").forEach((icon, index) => {
    const toggle = icon.closest(".ins-additional");
    const tooltipId = `additional-items-tooltip-${index}`;
    const trigger = document.createElement("span");
    trigger.className = "ins-additional-info";
    trigger.innerHTML = `<img src="${icon.getAttribute("src")}" alt="" /><span class="ins-additional-info-tooltip" id="${tooltipId}" role="tooltip"><img src="assets/installations/additional-items-tooltip.svg" alt="" /><span>Details for certain items, such as accessories or items not requiring installation, are not tracked in Services Central.</span></span>`;
    toggle.setAttribute("aria-describedby", tooltipId);
    icon.replaceWith(trigger);
  });
}

function wireWhiteGloveTooltips(scope = document) {
  let tooltip = document.querySelector(".wg-premium-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "wg-premium-tooltip";
    tooltip.id = "white-glove-order-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.innerHTML = '<img src="assets/installations/white-glove-tooltip.svg" alt="" /><span><strong>White Glove</strong><span>Your installation includes white glove support. Our concierge team will contact you, or you can contact us using the information provided here.</span></span>';
    document.body.append(tooltip);
  }

  const show = (trigger) => {
    const rect = trigger.getBoundingClientRect();
    tooltip.style.left = `${rect.left + (rect.width / 2) - 134}px`;
    tooltip.style.top = `${rect.bottom - 2}px`;
    tooltip.classList.add("is-visible");
  };
  const hide = () => tooltip.classList.remove("is-visible");

  scope.querySelectorAll("[data-white-glove-tooltip]").forEach((trigger) => {
    trigger.setAttribute("aria-describedby", tooltip.id);
    trigger.addEventListener("mouseenter", () => show(trigger));
    trigger.addEventListener("mouseleave", hide);
    trigger.addEventListener("focus", () => show(trigger));
    trigger.addEventListener("blur", hide);
  });
}

const CUSTOM_ROUTES = {
  "contact-page": "Service plan contact detail",
  "edit-spc": "Edit service plan contact",
  "instrument-1009996": "Instrument 1009996",
  "installation-faqs": "Installation frequently asked questions",
  "installations-progress": "Installations — order 7659430547",
  "installations-no-checklist": "Installations — order 4827316059",
  "installation-support": "Installation support",
};

function isInstallationShellDetailRoute(route) {
  return /^installation-shell-\d+$/.test(route);
}

function isInstallationsSectionRoute(route) {
  return route === "installations" || route === "installations-expanded" || route === "installations-progress" || route === "installations-no-checklist" || route === "installation-faqs" || isInstallationShellDetailRoute(route);
}

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
  "request-pm-direct-review": { title: "Request PM scheduling — confirmed PM review", src: "assets/flows/request-pm.png", width: 1440, height: 1500, kind: "app" },
  "request-pm-status": { title: "Request PM scheduling — view PM status", src: "assets/flows/request-pm.png", width: 1440, height: 1827, kind: "app" },
  "request-pm-contact": { title: "Request PM scheduling — confirm contact information", src: "assets/flows/request-pm.png", width: 1440, height: 1500, kind: "app" },
  "request-pm-review": { title: "Request PM scheduling — review and submit", src: "assets/flows/request-pm.png", width: 1440, height: 1900, kind: "app" },
  "pm-request-summary": { title: "Request PM scheduling — submitted", src: "assets/flows/request-pm.png", width: 1440, height: 1623, kind: "app" },
  "request-pm-details": { title: "Request PM scheduling — add request details", src: "assets/flows/request-pm.png", width: 1440, height: 1827, kind: "app" },
  "request-serviceplan": { title: "Request a service plan quote", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "request-serviceplan-details": { title: "Request a service plan quote — add request details", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "request-serviceplan-contact": { title: "Request a service plan quote — confirm contact information", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "request-serviceplan-review": { title: "Request a service plan quote — review and submit", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "serviceplan-summary": { title: "Request a service plan quote — submitted", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "request-qualification": { title: "Request qualification service", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "request-qualification-details": { title: "Request qualification service — add request details", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "request-qualification-contact": { title: "Request qualification service — confirm contact information", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "request-qualification-review": { title: "Request qualification service — review and submit", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "qualification-summary": { title: "Request qualification service — submitted", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "request-calibration": { title: "Request a calibration service", src: "assets/flows/request-support.png", width: 1440, height: 1623, kind: "app" },
  "request-calibration-details": { title: "Request a calibration service — add request details", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "request-calibration-contact": { title: "Request a calibration service — confirm contact information", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "request-calibration-review": { title: "Request a calibration service — review and submit", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "calibration-summary": { title: "Request a calibration service — submitted", src: "assets/flows/request-support.png", width: 1440, height: 1500, kind: "app" },
  "request-installation": { title: "Installation support", src: "assets/flows/request-support.png", width: 1440, height: 1623, kind: "app" },
  "open-support-ticket": { title: "Open a support ticket", src: "assets/flows/instrument-support-selection.png", width: 1440, height: 2339, kind: "app" },
  "open-support-ticket-details": { title: "Open a support ticket — add request details", src: "assets/flows/instrument-support-selection.png", width: 1440, height: 2339, kind: "app" },
  "open-support-ticket-contact": { title: "Open a support ticket — contact information", src: "assets/flows/instrument-support-selection.png", width: 1440, height: 1460, kind: "app" },
  "open-support-ticket-review": { title: "Open a support ticket — review and submit", src: "assets/flows/instrument-support-selection.png", width: 1440, height: 1460, kind: "app" },
  notifications: { title: "Notification settings", src: "assets/flows/notifications.png", width: 1440, height: 2200, kind: "app" },
  consumables: { title: "Consumables", src: "assets/flows/consumables.png", width: 1440, height: 2200, kind: "app" },
  education: { title: "Browse education", src: "assets/flows/browser-education.png", width: 2878, height: 1826, kind: "external" },
  "korea-education": { title: "Browse education", src: "assets/flows/korea-education.png", width: 1291, height: 1309, kind: "external" },
  "ticket-detail": { title: "Support ticket detail", src: "assets/flows/ticket-detail.png", width: 1456, height: 2069, kind: "app" },
  "tech-support-summary": { title: "Tech support summary", src: "assets/flows/ticket-detail.png", width: 1440, height: 1623, kind: "app" },
  "service-requests-summary": { title: "Service request summary", src: "assets/flows/ticket-detail.png", width: 1440, height: 1623, kind: "app" },
  "pm-summary": { title: "Preventive maintenance summary", src: "assets/flows/ticket-detail.png", width: 1440, height: 1623, kind: "app" },
  "closed-summary": { title: "Closed ticket summary", src: "assets/flows/ticket-detail.png", width: 1440, height: 1623, kind: "app" },
  "user-not-mapped": { title: "From sign in — user not mapped", src: "assets/flows/user-not-mapped.png", width: 1440, height: 1090, kind: "signin", cta: { x: 204, y: 452, w: 392, h: 53, route: "add-instruments", label: "Continue user-not-mapped flow" } },
  "installation-order": {
    title: "From installation order ready",
    src: "assets/flows/installation-order.png",
    width: 600,
    height: 941,
    kind: "email",
    emailSkin: true,
    emailLabel: "Installation order notification",
    emailSubject: "Action required: Initiate your installation in Services Central",
    emailSender: "Thermo Fisher Scientific <notifications@thermofisher.com>",
    emailTime: "Today, 9:41 AM",
    cta: { x: 56, y: 428, w: 198, h: 42, route: "installations", label: "View installation order" },
  },
  "service-plan-approval": {
    title: "From service plan contact approval",
    src: "assets/flows/service-plan-approval.png",
    width: 600,
    height: 1494,
    kind: "email",
    emailSkin: true,
    emailLabel: "Service plan contact notification",
    emailSubject: "Action required - Confirm you are the service plan contact for your instruments",
    emailSender: "Thermo Fisher Scientific <notifications@thermofisher.com>",
    emailTime: "Today, 9:41 AM",
    cta: { x: 56, y: 375, w: 184, h: 42, route: "service-plan-contacts", label: "Review and confirm" },
  },
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
  { label: "From sign in - Main", mode: "main" },
  { label: "From sign in - User not mapped", mode: "unmapped" },
  { label: "Other - North America - CMD", region: "north-america-cmd", route: "my-instruments" },
  { label: "From service plan contact approval", route: "service-plan-approval" },
  { label: "Other - Europe - LE", region: "europe-le", route: "my-instruments" },
  { label: "From installation order ready", route: "installation-order" },
  { label: "Other - Korea - CMD", region: "korea-cmd", route: "my-instruments" },
];

function isUnmappedPrototypeUser() {
  return new URL(window.location.href).searchParams.get("prototype-user") === "unmapped";
}

function isEuropeLePrototype() {
  return new URL(window.location.href).searchParams.get("prototype-region") === "europe-le";
}

function isMainPrototype() {
  return new URL(window.location.href).searchParams.get("prototype-experience") === "main";
}

function isNorthAmericaCmdPrototype() {
  return new URL(window.location.href).searchParams.get("prototype-region") === "north-america-cmd";
}

function isKoreaCmdPrototype() {
  return new URL(window.location.href).searchParams.get("prototype-region") === "korea-cmd";
}

function isInstallationsUnavailablePrototype() {
  return isUnmappedPrototypeUser() || isEuropeLePrototype();
}

const FLOW_TOOLBAR_SUFFIX_PATTERN = /\s+-\s+(?:Main flow|User not mapped flow|North America - CMD|Europe - LE|Korea - CMD)$/;

function prototypeFlowToolbarSuffix() {
  const params = new URL(window.location.href).searchParams;
  if (params.get("prototype-user") === "unmapped") return "User not mapped flow";

  const region = params.get("prototype-region");
  if (region === "north-america-cmd") return "North America - CMD";
  if (region === "europe-le") return "Europe - LE";
  if (region === "korea-cmd") return "Korea - CMD";

  const namedFlow = params.get("prototype-flow");
  if (params.get("prototype-experience") === "main" || namedFlow === "service-plan-approval" || namedFlow === "installation-order") {
    return "Main flow";
  }
  return "";
}

function syncFlowToolbarTitle() {
  const title = app.querySelector(".flow-toolbar > strong");
  if (!title) return;
  const baseTitle = title.textContent.trim().replace(FLOW_TOOLBAR_SUFFIX_PATTERN, "");
  const suffix = prototypeFlowToolbarSuffix();
  title.textContent = suffix ? `${baseTitle} - ${suffix}` : baseTitle;
}

function isMainCmdExperience() {
  return isMainPrototype() || isNorthAmericaCmdPrototype() || isKoreaCmdPrototype();
}

function hasOnboardedAccountAssets() {
  const systems = miCurrentSystems();
  if (systems.length > 0) return true;
  return miCurrentInstruments().some((instrument) => !MI_REMOVED_INSTRUMENTS.has(instrument.serial));
}

function shouldShowAccountEmptyState() {
  return isUnmappedPrototypeUser() || !hasOnboardedAccountAssets();
}

function startPrototypeFlow(mode) {
  const nextUrl = new URL(window.location.href);
  nextUrl.hash = "#signin";
  nextUrl.searchParams.delete("instruments-tab");
  nextUrl.searchParams.delete("instruments-section");
  nextUrl.searchParams.delete("contacts");
  nextUrl.searchParams.delete("prototype-region");
  nextUrl.searchParams.delete("prototype-flow");
  if (mode === "main") nextUrl.searchParams.set("prototype-experience", "main");
  else nextUrl.searchParams.delete("prototype-experience");
  if (mode === "unmapped") nextUrl.searchParams.set("prototype-user", "unmapped");
  else nextUrl.searchParams.delete("prototype-user");
  window.history.pushState({ flow: mode }, "", nextUrl);
  render();
}

function startPrototypeRouteFlow(route) {
  const nextUrl = new URL(window.location.href);
  nextUrl.hash = `#${route}`;
  nextUrl.searchParams.delete("prototype-user");
  nextUrl.searchParams.delete("instruments-tab");
  nextUrl.searchParams.delete("instruments-section");
  nextUrl.searchParams.delete("contacts");
  nextUrl.searchParams.delete("prototype-region");
  nextUrl.searchParams.delete("prototype-experience");
  nextUrl.searchParams.set("prototype-flow", route);
  if (route === "service-plan-approval") {
    servicePlanApprovalPending = false;
    servicePlanApprovalPromptShown = false;
    servicePlanApprovalAcceptedNotice = false;
  }
  window.history.pushState({ flow: route }, "", nextUrl);
  render();
}

function startPrototypeRegionalFlow(region, route = "my-instruments") {
  const nextUrl = new URL(window.location.href);
  nextUrl.hash = `#${route}`;
  nextUrl.searchParams.delete("prototype-user");
  nextUrl.searchParams.delete("instruments-tab");
  nextUrl.searchParams.delete("instruments-section");
  nextUrl.searchParams.delete("contacts");
  nextUrl.searchParams.delete("prototype-experience");
  nextUrl.searchParams.delete("prototype-flow");
  nextUrl.searchParams.set("prototype-region", region);
  if (region === "europe-le") {
    ["1115281234567121", "BIOS16-847263", "TSX2330-481927", "MCO2-40L-638251"].forEach((serial) => miFavoritesStore().add(`instrument:${serial}`));
  }
  window.history.pushState({ flow: region }, "", nextUrl);
  render();
}

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
  { label: "Request service plan", x: 764, y: 452, w: 304, h: 128 },
  { label: "Request maintenance or support", route: "request-support", x: 1102, y: 452, w: 304, h: 128 },
  { label: "Support request history", route: "support-history", x: 365, y: 870, w: 235, h: 42 },
  { label: "View all my instruments", route: "my-instruments", x: 360, y: 1846, w: 240, h: 42 },
];

function hideToast() {
  window.clearTimeout(toastTimer);
  toast.hidden = true;
}

function showToast(message, { title = "", variant = "info", duration = 4000 } = {}) {
  window.clearTimeout(toastTimer);
  const isPreInstallChecklist = variant === "preinstall-checklist";
  const isSuccess = variant === "success" || variant === "checklist" || isPreInstallChecklist || variant === "system-success";
  toast.classList.toggle("toast--success", isSuccess);
  toast.classList.toggle("toast--checklist", variant === "checklist" || isPreInstallChecklist);
  toast.classList.toggle("toast--preinstall", isPreInstallChecklist);
  toast.classList.toggle("toast--system", variant === "system-success");
  toast.querySelector("[data-toast-icon]").hidden = !isSuccess;
  toast.querySelector("[data-toast-title]").textContent = title ? `${title} ` : "";
  toast.querySelector("[data-toast-message]").textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(hideToast, duration);
}

toast.querySelector("[data-toast-close]").addEventListener("click", hideToast);

function createInstallationPendingContent({
  showDeliveryDates = true,
  showDeliveryChecklist = true,
  preInstallOrderNumbers = ["9012611245", "7659430547"],
} = {}) {
  const actions = document.createElement("div");
  actions.className = "installation-pending-modal__actions";

  if (showDeliveryDates) {
    const deliveryRow = document.createElement("div");
    deliveryRow.className = "installation-pending-modal__row";
    deliveryRow.innerHTML = '<img src="assets/icons/features/calendar/size=24px, style=mono.svg" alt="" /><span>Add your preferred delivery dates for order: <strong>9012611245</strong></span>';
    actions.append(deliveryRow);
  }

  if (showDeliveryChecklist) {
    const deliveryChecklistRow = document.createElement("div");
    deliveryChecklistRow.className = "installation-pending-modal__row";
    deliveryChecklistRow.innerHTML = '<img src="assets/icons/installation/del checklist/size=24px, style=mono.svg" alt="" /><span>Upload the pending delivery checklist for order: <strong>9012611245</strong></span>';
    actions.append(deliveryChecklistRow);
  }

  if (preInstallOrderNumbers.length) {
    const preInstallChecklistRow = document.createElement("div");
    preInstallChecklistRow.className = "installation-pending-modal__row";
    preInstallChecklistRow.innerHTML = `<img src="assets/icons/installation/preinstall checklist/size=24px, style=mono.svg" alt="" /><span>Upload the pending pre-install checklist(s) for order: <strong>${preInstallOrderNumbers.join(", ")}</strong></span>`;
    actions.append(preInstallChecklistRow);
  }

  const instrumentsRow = document.createElement("button");
  instrumentsRow.type = "button";
  instrumentsRow.className = "installation-pending-modal__row";
  instrumentsRow.dataset.installationPendingInstruments = "";
  instrumentsRow.innerHTML = '<img src="assets/icons/science/instrument/Size=24px, Style=Mono.svg" alt="" /><span>Installation complete for order <strong>1901126245</strong>. Review your instruments in <b>My instruments</b> tab.</span>';

  const accountIssueRow = document.createElement("div");
  accountIssueRow.className = "installation-pending-modal__row installation-pending-modal__row--warning";
  accountIssueRow.innerHTML = '<img src="assets/icons/notifications/warning/size=24px, style=bold.svg" alt="" /><span>Installation complete for order <strong>323146241</strong>. An issue with your account is preventing your instrument from appearing on the My Instruments page. Please <button type="button" data-installation-pending-contact-support>contact support</button> to resolve it.</span>';

  actions.append(instrumentsRow, accountIssueRow);
  return actions;
}

function getInstallationPendingContentState() {
  const preInstallOrderNumbers = [];
  if (submittedPreInstallChecklists.length < PREINSTALL_CHECKLISTS.length) preInstallOrderNumbers.push("9012611245");
  if (!isProgressPreInstallComplete()) preInstallOrderNumbers.push("7659430547");
  return {
    showDeliveryDates: !preferredDeliveryDatesSubmitted,
    showDeliveryChecklist: !deliveryChecklistSubmitted,
    preInstallOrderNumbers,
  };
}

function refreshInstallationPendingContent() {
  const currentContent = installationPendingDialog?.querySelector(".installation-pending-modal__actions");
  currentContent?.replaceWith(createInstallationPendingContent(getInstallationPendingContentState()));
}

function createInstallationPendingDialog() {
  return window.Modal?.mount('[data-modal-mount="installation-pending"]', {
    id: "installation-pending-dialog",
    title: "Action(s) pending",
    description: "You have important pending actions to ensure your delivery and installation stay on track.",
    size: "md",
    className: "installation-pending-dialog",
    content: createInstallationPendingContent(),
    closeLabel: "Close pending actions",
    closeDataset: { installationPendingClose: "" },
    actions: [
      {
        label: "Cancel",
        variant: "secondary",
        closes: true,
        dataset: { installationPendingClose: "" },
      },
      {
        label: "Go to installation page",
        variant: "primary",
        closes: true,
        dataset: { installationPendingContinue: "" },
      },
    ],
  });
}

function openServicesHelpModal(trigger) {
  if (servicesHelpDialog.open) return;
  servicesHelpDialog.dataset.openedBy = trigger?.dataset.helpSource || trigger?.getAttribute("aria-label") || "";
  servicesHelpDialog.showModal();
}

function closeServicesHelpModal() {
  if (servicesHelpDialog.open) servicesHelpDialog.close();
}

const DEFAULT_RECIPIENT_QUERY = "sebastien.martin@company.com";

function setAddUserRecipientDropdownOpen(open) {
  const email = addUserOrderDialog.querySelector("[data-add-user-email]");
  const dropdown = addUserOrderDialog.querySelector("[data-add-user-recipient-dropdown]");
  email.setAttribute("aria-expanded", String(open));
  dropdown.hidden = !open;
}

function clearAddUserRecipients({ keepDropdownOpen = false } = {}) {
  const email = addUserOrderDialog.querySelector("[data-add-user-email]");
  addUserOrderDialog.querySelectorAll("[data-add-user-recipient]").forEach((checkbox) => { checkbox.checked = false; });
  email.value = "";
  addUserOrderDialog.querySelector("[data-add-user-query]").textContent = "";
  updateAddUserOrderConfirmState();
  setAddUserRecipientDropdownOpen(keepDropdownOpen);
  if (keepDropdownOpen) email.focus();
}

function updateAddUserOrderConfirmState() {
  const email = addUserOrderDialog.querySelector("[data-add-user-email]");
  const orderCheckboxes = [...addUserOrderDialog.querySelectorAll(".add-user-order-modal__orders input[type=\"checkbox\"]")];
  const recipients = [...addUserOrderDialog.querySelectorAll("[data-add-user-recipient]:checked")];
  orderCheckboxes.forEach((checkbox) => checkbox.closest("tr").classList.toggle("is-selected", checkbox.checked));
  const hasOrder = orderCheckboxes.some((checkbox) => checkbox.checked);
  addUserOrderDialog.querySelector("[data-add-user-selection-count]").textContent = `${recipients.length} of 6 selections`;
  if (recipients.length) {
    email.value = recipients.map((checkbox) => checkbox.value).join(", ");
    addUserOrderDialog.querySelector("[data-add-user-query]").textContent = email.value;
  }
  addUserOrderDialog.querySelector("[data-add-user-confirm]").disabled = recipients.length === 0 || !hasOrder;
}

function openAddUserOrderModal() {
  const form = addUserOrderDialog.querySelector("[data-add-user-form]");
  form.reset();
  addUserOrderDialog.querySelector("[data-add-user-email]").value = "";
  addUserOrderDialog.querySelector("[data-add-user-query]").textContent = DEFAULT_RECIPIENT_QUERY;
  setAddUserRecipientDropdownOpen(false);
  updateAddUserOrderConfirmState();
  addUserOrderDialog.showModal();
  form.focus({ preventScroll: true });
}

function wireAddUserOrderTriggers(scope = document) {
  scope.querySelectorAll("[data-open-add-user]").forEach((control) => control.addEventListener("click", openAddUserOrderModal));
}

function updatePreferredDeliveryDatesState() {
  const requiredFields = [...preferredDeliveryDatesDialog.querySelectorAll("[data-delivery-date-required]")];
  requiredFields.forEach((field) => {
    const clearButton = field.closest(".preferred-delivery-date-field").querySelector("[data-clear-delivery-date]");
    if (clearButton) clearButton.hidden = !field.value.trim();
  });
  preferredDeliveryDatesDialog.querySelector("[data-submit-delivery-dates]").disabled = requiredFields.some((field) => !field.value.trim());
}

function getTodayDeliveryDate() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date());
}

function openPreferredDeliveryDatesModal() {
  const form = preferredDeliveryDatesDialog.querySelector("[data-delivery-dates-form]");
  form.reset();
  preferredDeliveryDatesDialog.querySelector('[aria-label="Earliest delivery date"]').value = getTodayDeliveryDate();
  updatePreferredDeliveryDatesState();
  preferredDeliveryDatesDialog.showModal();
  form.focus({ preventScroll: true });
}

function wirePreferredDeliveryDatesTriggers(scope = document) {
  scope.querySelectorAll("[data-open-delivery-dates]").forEach((control) => control.addEventListener("click", openPreferredDeliveryDatesModal));
}

function setDeliveryChecklistUploadState(state, fileName = "") {
  const empty = deliveryChecklistUploadDialog.querySelector("[data-delivery-checklist-empty]");
  const uploading = deliveryChecklistUploadDialog.querySelector("[data-delivery-checklist-uploading]");
  const uploaded = deliveryChecklistUploadDialog.querySelector("[data-delivery-checklist-uploaded]");
  empty.hidden = state !== "empty";
  uploading.hidden = state !== "uploading";
  uploaded.hidden = state !== "uploaded";
  deliveryChecklistUploadDialog.querySelector("[data-delivery-checklist-uploading-name]").textContent = fileName;
  deliveryChecklistUploadDialog.querySelector("[data-delivery-checklist-file-name]").textContent = fileName;
  deliveryChecklistUploadDialog.querySelector("[data-submit-delivery-checklist]").disabled = state !== "uploaded";
  deliveryChecklistUploadDialog.querySelector("[data-delivery-checklist-dropzone]").dataset.state = state;
}

function handleDeliveryChecklistFile(file) {
  if (!file) return;
  window.clearTimeout(deliveryChecklistUploadTimer);
  setDeliveryChecklistUploadState("uploading", file.name);
  deliveryChecklistUploadTimer = window.setTimeout(() => setDeliveryChecklistUploadState("uploaded", file.name), 1400);
}

function openDeliveryChecklistUploadModal() {
  const form = deliveryChecklistUploadDialog.querySelector("[data-delivery-checklist-upload-form]");
  window.clearTimeout(deliveryChecklistUploadTimer);
  form.reset();
  setDeliveryChecklistUploadState("empty");
  deliveryChecklistUploadDialog.showModal();
  form.focus({ preventScroll: true });
}

function wireDeliveryChecklistUploadTriggers(scope = document) {
  scope.querySelectorAll("[data-open-delivery-checklist-upload]").forEach((control) => control.addEventListener("click", openDeliveryChecklistUploadModal));
}

function updatePreInstallChecklistSubmitState() {
  const hasUploadedFile = Array.from(preInstallChecklistUploadDialog.querySelectorAll("[data-preinstall-uploader]")).some((uploader) => uploader.dataset.state === "uploaded");
  preInstallChecklistUploadDialog.querySelector("[data-submit-preinstall-checklists]").disabled = !hasUploadedFile;
}

function getPreInstallUploadedFileName(uploader) {
  return uploader.querySelector("[data-preinstall-file-name]").textContent.trim();
}

function updatePreInstallDragHandle(uploader) {
  const uploaded = uploader.querySelector("[data-preinstall-uploaded]");
  let handle = uploaded.querySelector("[data-preinstall-drag-handle]");
  if (!handle) {
    handle = document.createElement("button");
    handle.type = "button";
    handle.className = "preinstall-upload-drag-handle";
    handle.dataset.preinstallDragHandle = "";
    handle.draggable = true;
    handle.innerHTML = `<img src="assets/icons/actions/drag & drop/Size=24px, Style=Mono.svg" alt="" />`;
    handle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    uploaded.prepend(handle);
  }
  const fileName = getPreInstallUploadedFileName(uploader);
  handle.setAttribute("aria-label", `Move ${fileName || "uploaded checklist"}`);
  handle.title = "Drag to move this file, or use the arrow keys";
}

function swapPreInstallUploaderAssignments(first, second) {
  if (!first || !second || first === second) return;
  const firstAssignment = { state: first.dataset.state || "empty", fileName: getPreInstallUploadedFileName(first) };
  const secondAssignment = { state: second.dataset.state || "empty", fileName: getPreInstallUploadedFileName(second) };
  first.querySelector("[data-preinstall-file]").value = "";
  second.querySelector("[data-preinstall-file]").value = "";
  setPreInstallChecklistUploadState(first, secondAssignment.state, secondAssignment.fileName);
  setPreInstallChecklistUploadState(second, firstAssignment.state, firstAssignment.fileName);
  const movedHandle = second.querySelector("[data-preinstall-drag-handle]");
  movedHandle?.focus();
}

function clearPreInstallReorderState() {
  preInstallChecklistUploadDialog.querySelectorAll(".is-reordering, .is-reorder-target").forEach((element) => element.classList.remove("is-reordering", "is-reorder-target"));
  draggedPreInstallUploader = null;
}

function setPreInstallChecklistUploadState(uploader, state, fileName = "") {
  uploader.querySelector("[data-preinstall-empty]").hidden = state !== "empty";
  uploader.querySelector("[data-preinstall-uploading]").hidden = state !== "uploading";
  uploader.querySelector("[data-preinstall-uploaded]").hidden = state !== "uploaded";
  uploader.querySelector("[data-preinstall-uploading-name]").textContent = fileName;
  uploader.querySelector("[data-preinstall-file-name]").textContent = fileName;
  uploader.dataset.state = state;
  if (state === "uploaded") updatePreInstallDragHandle(uploader);
  updatePreInstallChecklistSubmitState();
}

function handlePreInstallChecklistFile(uploader, file) {
  if (!file) return;
  window.clearTimeout(preInstallChecklistUploadTimers.get(uploader));
  setPreInstallChecklistUploadState(uploader, "uploading", file.name);
  const timer = window.setTimeout(() => setPreInstallChecklistUploadState(uploader, "uploaded", file.name), 1400);
  preInstallChecklistUploadTimers.set(uploader, timer);
}

function resetPreInstallChecklistUploader(uploader) {
  window.clearTimeout(preInstallChecklistUploadTimers.get(uploader));
  uploader.querySelector("[data-preinstall-file]").value = "";
  setPreInstallChecklistUploadState(uploader, "empty");
}

function setPreInstallSubmittedExpanded(expanded) {
  const toggle = preInstallChecklistUploadDialog.querySelector("[data-preinstall-submitted-toggle]");
  const table = preInstallChecklistUploadDialog.querySelector("[data-preinstall-submitted-table]");
  toggle.classList.toggle("is-expanded", expanded);
  toggle.setAttribute("aria-expanded", String(expanded));
  table.hidden = !expanded;
}

function closePreInstallInstrumentsTooltip() {
  window.clearTimeout(preInstallTooltipCloseTimer);
  preInstallChecklistUploadDialog.querySelector("[data-preinstall-instruments-tooltip]").hidden = true;
}

function schedulePreInstallInstrumentsTooltipClose() {
  window.clearTimeout(preInstallTooltipCloseTimer);
  preInstallTooltipCloseTimer = window.setTimeout(closePreInstallInstrumentsTooltip, 120);
}

function openPreInstallInstrumentsTooltip(trigger, checklist) {
  window.clearTimeout(preInstallTooltipCloseTimer);
  const tooltip = preInstallChecklistUploadDialog.querySelector("[data-preinstall-instruments-tooltip]");
  const rows = tooltip.querySelector("[data-preinstall-tooltip-rows]");
  rows.replaceChildren();
  checklist.items.forEach(([item, qty, catalog, name]) => {
    const row = document.createElement("div");
    row.className = "preinstall-instruments-tooltip__row";
    row.setAttribute("role", "row");
    row.innerHTML = `<span role="cell">${item}</span><span role="cell">${qty}</span><span role="cell">${catalog}</span><span role="cell">${name}</span>`;
    rows.append(row);
  });
  tooltip.hidden = false;
  const modalRect = preInstallChecklistUploadDialog.querySelector("[data-preinstall-checklist-upload-form]").getBoundingClientRect();
  const triggerRect = trigger.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const desiredLeft = triggerRect.left - modalRect.left - 24;
  const left = Math.max(16, Math.min(desiredLeft, modalRect.width - tooltipRect.width - 16));
  const spaceBelow = modalRect.bottom - triggerRect.bottom;
  const top = spaceBelow >= tooltipRect.height + 16 ? triggerRect.bottom - modalRect.top + 10 : triggerRect.top - modalRect.top - tooltipRect.height - 10;
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${Math.max(8, top)}px`;
  tooltip.style.setProperty("--tooltip-arrow-x", `${Math.max(20, Math.min(triggerRect.left - modalRect.left - left + triggerRect.width / 2, tooltipRect.width - 20))}px`);
}

function wirePreInstallInstrumentTooltips(scope = preInstallChecklistUploadDialog) {
  scope.querySelectorAll("[data-preinstall-instruments-link]").forEach((trigger) => {
    if (trigger.dataset.preInstallTooltipWired) return;
    trigger.dataset.preInstallTooltipWired = "true";
    const checklist = PREINSTALL_CHECKLISTS.find((item) => item.id === trigger.dataset.preinstallInstrumentsLink);
    trigger.addEventListener("mouseenter", () => openPreInstallInstrumentsTooltip(trigger, checklist));
    trigger.addEventListener("mouseleave", schedulePreInstallInstrumentsTooltipClose);
    trigger.addEventListener("focus", () => openPreInstallInstrumentsTooltip(trigger, checklist));
    trigger.addEventListener("blur", schedulePreInstallInstrumentsTooltipClose);
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openPreInstallInstrumentsTooltip(trigger, checklist);
    });
  });
}

function renderSubmittedPreInstallChecklists(checklists = submittedPreInstallChecklists, availableChecklists = PREINSTALL_CHECKLISTS) {
  const form = preInstallChecklistUploadDialog.querySelector("[data-preinstall-checklist-upload-form]");
  const title = preInstallChecklistUploadDialog.querySelector("#preinstall-checklist-upload-title");
  const description = preInstallChecklistUploadDialog.querySelector("#preinstall-checklist-upload-description");
  const closeButton = preInstallChecklistUploadDialog.querySelector(".preinstall-checklist-upload-modal__header > button");
  const uploadTable = preInstallChecklistUploadDialog.querySelector(".preinstall-checklist-upload-table");
  const uploadRows = Array.from(uploadTable.querySelectorAll(".preinstall-checklist-upload-table__row"));
  const isComplete = checklists.length === availableChecklists.length;

  form.classList.toggle("is-complete", isComplete);
  title.textContent = isComplete ? "Pre-install checklist(s) submitted successfully" : "Upload your pre-install checklist(s)";
  if (isComplete) {
    description.innerHTML = "Your checklist has been received, and the details are shown below for your reference. If you need to make any changes, please use the <strong>Installation Support</strong> button to contact our installation team.";
    closeButton.setAttribute("aria-label", "Close submitted pre-install checklists");
  } else {
    description.textContent = "Submit your completed pre-install checklist(s).";
    closeButton.setAttribute("aria-label", "Close upload pre-install checklists");
  }
  uploadRows.forEach((row, index) => {
    const instrumentLink = row.querySelector("a");
    const checklist = availableChecklists[index];
    if (checklist) instrumentLink.dataset.preinstallInstrumentsLink = checklist.id;
    instrumentLink.setAttribute("aria-describedby", "preinstall-instruments-tooltip");
    row.hidden = !checklist || checklists.some((submitted) => submitted.id === checklist.id);
  });
  uploadTable.querySelector(".preinstall-checklist-upload-table__header").hidden = isComplete;

  preInstallChecklistUploadDialog.querySelector("[data-preinstall-submitted-count]").textContent = String(checklists.length);
  const rows = preInstallChecklistUploadDialog.querySelector("[data-preinstall-submitted-rows]");
  rows.replaceChildren();
  checklists.forEach((checklist) => {
    const row = document.createElement("div");
    row.className = "preinstall-checklist-submitted-table__row";
    row.setAttribute("role", "row");
    row.innerHTML = `<span role="cell"><b>${checklist.name}</b><button type="button" data-preinstall-instruments-link="${checklist.id}" aria-describedby="preinstall-instruments-tooltip">${checklist.instruments}</button></span><span role="cell"><span class="delivery-checklist-details-badge"><img src="assets/icons/notifications/success/size=16px, style=bold.svg" alt="" />Submitted</span></span><span role="cell">${checklist.submittedBy}</span><span role="cell">${checklist.submittedOn}</span>`;
    rows.append(row);
  });
  wirePreInstallInstrumentTooltips();
  setPreInstallSubmittedExpanded(checklists.length > 0);
}

function openPreInstallChecklistUploadModal() {
  const form = preInstallChecklistUploadDialog.querySelector("[data-preinstall-checklist-upload-form]");
  preInstallChecklistOrderContext = "9012611245";
  pendingPreInstallChecklists = [];
  form.reset();
  preInstallChecklistUploadDialog.querySelectorAll("[data-preinstall-uploader]").forEach(resetPreInstallChecklistUploader);
  renderSubmittedPreInstallChecklists();
  closePreInstallInstrumentsTooltip();
  preInstallChecklistUploadDialog.showModal();
  form.focus({ preventScroll: true });
}

function openProgressPreInstallChecklistUploadModal() {
  const form = preInstallChecklistUploadDialog.querySelector("[data-preinstall-checklist-upload-form]");
  preInstallChecklistOrderContext = "7659430547";
  pendingPreInstallChecklists = [];
  form.reset();
  preInstallChecklistUploadDialog.querySelectorAll("[data-preinstall-uploader]").forEach(resetPreInstallChecklistUploader);
  renderSubmittedPreInstallChecklists(submittedProgressPreInstallChecklists, PROGRESS_PREINSTALL_CHECKLISTS);
  closePreInstallInstrumentsTooltip();
  preInstallChecklistUploadDialog.showModal();
  form.focus({ preventScroll: true });
}

function openCompletedPreInstallChecklistModal() {
  const form = preInstallChecklistUploadDialog.querySelector("[data-preinstall-checklist-upload-form]");
  pendingPreInstallChecklists = [];
  form.reset();
  preInstallChecklistUploadDialog.querySelectorAll("[data-preinstall-uploader]").forEach(resetPreInstallChecklistUploader);
  renderSubmittedPreInstallChecklists(PREINSTALL_CHECKLISTS);
  closePreInstallInstrumentsTooltip();
  preInstallChecklistUploadDialog.showModal();
  form.focus({ preventScroll: true });
}

function openCompletedProgressPreInstallChecklistModal() {
  const form = preInstallChecklistUploadDialog.querySelector("[data-preinstall-checklist-upload-form]");
  preInstallChecklistOrderContext = "7659430547";
  pendingPreInstallChecklists = [];
  form.reset();
  preInstallChecklistUploadDialog.querySelectorAll("[data-preinstall-uploader]").forEach(resetPreInstallChecklistUploader);
  renderSubmittedPreInstallChecklists(PROGRESS_PREINSTALL_CHECKLISTS, PROGRESS_PREINSTALL_CHECKLISTS);
  closePreInstallInstrumentsTooltip();
  preInstallChecklistUploadDialog.showModal();
  form.focus({ preventScroll: true });
}

function wirePreInstallChecklistUploadTriggers(scope = document) {
  scope.querySelectorAll("[data-open-preinstall-checklist-upload]").forEach((control) => {
    if (control.dataset.preInstallChecklistWired) return;
    control.dataset.preInstallChecklistWired = "true";
    control.addEventListener("click", openPreInstallChecklistUploadModal);
  });
}

function wirePreInstallTemplateDropdown(scope = document) {
  scope.querySelectorAll(".ins-template-dropdown").forEach((dropdown) => {
    const toggle = dropdown.querySelector("[data-preinstall-template-toggle]");
    const menu = dropdown.querySelector("[data-preinstall-template-menu]");
    if (!toggle || !menu || toggle.dataset.preInstallTemplateWired) return;
    toggle.dataset.preInstallTemplateWired = "true";

    const setOpen = (open, { focusFirst = false } = {}) => {
      toggle.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
      const caret = toggle.querySelector("img");
      caret.src = open
        ? "assets/icons/directions/caret up/up caret.svg"
        : "assets/icons/directions/caret down/Down caret.svg";
      if (open && focusFirst) menu.querySelector('[role="menuitem"]')?.focus();
    };

    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    menu.querySelectorAll('[role="menuitem"]').forEach((item) => item.addEventListener("click", () => setOpen(false)));
    menu.addEventListener("keydown", (event) => {
      const items = [...menu.querySelectorAll('[role="menuitem"]')];
      const current = items.indexOf(document.activeElement);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        items[(current + direction + items.length) % items.length].focus();
      } else if (event.key === "Escape") {
        setOpen(false);
        toggle.focus();
      }
    });
    toggle.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setOpen(true, { focusFirst: true });
      }
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".ins-template-dropdown")) setOpen(false);
    });
  });
}

function updatePreInstallChecklistCardCount() {
  const count = app.querySelector("[data-preinstall-card-count]");
  if (!count) return;
  count.textContent = `(${5 - preInstallChecklistsUploaded} of 5 remaining)`;
}

function formatDeliveryDate(value) {
  const match = value.trim().match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2}|\d{4})$/);
  if (!match) return value.trim();
  const [, day, month, yearValue] = match;
  const year = yearValue.length === 2 ? Number(`20${yearValue}`) : Number(yearValue);
  const date = new Date(Date.UTC(year, Number(month) - 1, Number(day)));
  if (date.getUTCDate() !== Number(day) || date.getUTCMonth() !== Number(month) - 1 || date.getUTCFullYear() !== year) return value.trim();
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

function formatInstallationActivityDeliveryDate(value) {
  const match = value.trim().match(/^(\d{1,2})[/\.\-](\d{1,2})[/\.\-](\d{2}|\d{4})$/);
  if (!match) return value.trim();
  const [, day, month, yearValue] = match;
  const year = yearValue.length === 2 ? Number(`20${yearValue}`) : Number(yearValue);
  const date = new Date(Date.UTC(year, Number(month) - 1, Number(day)));
  if (date.getUTCDate() !== Number(day) || date.getUTCMonth() !== Number(month) - 1 || date.getUTCFullYear() !== year) return value.trim();
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

function openDeliveryDatesConfirmationModal() {
  const fields = [...preferredDeliveryDatesDialog.querySelectorAll("[data-delivery-date-required]")];
  const outputs = [
    deliveryDatesConfirmationDialog.querySelector("[data-confirmation-earliest-date]"),
    deliveryDatesConfirmationDialog.querySelector("[data-confirmation-latest-date]"),
  ];
  fields.forEach((field, index) => { outputs[index].textContent = formatDeliveryDate(field.value); });
  deliveryDatesConfirmationDialog.showModal();
  deliveryDatesConfirmationDialog.querySelector("[data-delivery-dates-confirmation-form]").focus({ preventScroll: true });
}

function setDeliveryPauseDays(days) {
  deliveryDatesPauseDialog.querySelectorAll("[data-delivery-pause-days]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.deliveryPauseDays === days)));
}

function updateDeliveryPauseConfirmState() {
  const selectedReason = deliveryDatesPauseDialog.querySelector("[data-delivery-pause-reason]:checked");
  const isOther = selectedReason?.value === "Other";
  const otherDetails = deliveryDatesPauseDialog.querySelector("[data-delivery-pause-other-details]");
  otherDetails.hidden = !isOther;
  const hasReason = Boolean(selectedReason);
  const hasDetails = !isOther || Boolean(otherDetails.querySelector("[data-delivery-pause-details]").value.trim());
  deliveryDatesPauseDialog.querySelector("[data-confirm-delivery-pause]").disabled = !hasReason || !hasDetails;
}

function openDeliveryDatesPauseModal() {
  const form = deliveryDatesPauseDialog.querySelector("[data-delivery-pause-form]");
  form.reset();
  setDeliveryPauseDays(deliveryReminderPauseDays || "30");
  updateDeliveryPauseConfirmState();
  deliveryDatesPauseDialog.showModal();
  form.focus({ preventScroll: true });
}

function wireDeliveryDatesPauseTriggers(scope = document) {
  scope.querySelectorAll("[data-open-delivery-pause]").forEach((control) => control.addEventListener("click", openDeliveryDatesPauseModal));
}

function createCompletedDeliveryDatesCardMarkup(orderNumber) {
  return `<div class="ins-action-card__head"><img class="ins-complete" src="assets/icons/notifications/success/size=24px, style=bold.svg" alt="" /><span>Step 1</span><img class="ins-checklist-icon" src="assets/icons/installation/CRD/Size=32px, Style=Mono.svg" alt="" /></div><h3>Delivery dates submitted</h3><p>Thank you! Your preferred delivery dates have been received.</p><p class="ins-action-card__activity-link">View submitted dates in the <button type="button" data-open-installation-activity data-order-number="${orderNumber}">order activity log</button></p>`;
}

function setPreferredDeliveryDatesComplete(completed) {
  const card = app.querySelector("[data-delivery-dates-card]");
  if (!card) return;
  card.classList.toggle("is-complete", completed);
  updateInstallationActionCount();
  if (!completed) return;
  card.innerHTML = createCompletedDeliveryDatesCardMarkup("9012611245");
  wireInstallationActivityTriggers(card);
}

function setPreferredDeliveryDatesPaused(days) {
  const card = app.querySelector("[data-delivery-dates-card]");
  const status = card?.querySelector("small");
  const cannotProvideDatesButton = preferredDeliveryDatesDialog.querySelector("[data-cannot-provide-delivery-dates]");
  if (cannotProvideDatesButton) cannotProvideDatesButton.hidden = Boolean(days) && !preferredDeliveryDatesSubmitted;
  if (!status || !days || preferredDeliveryDatesSubmitted) return;
  status.className = "ins-action-card__pause-status";
  status.setAttribute("role", "status");
  status.innerHTML = `<img src="assets/icons/notifications/warning/size=16px, style=bold.svg" alt="" /><span>Email reminder paused for ${days} days</span>`;
}

function updateInstallationActionCount() {
  const count = app.querySelector("[data-ins-action-count]");
  const preInstallComplete = submittedPreInstallChecklists.length === PREINSTALL_CHECKLISTS.length;
  if (count) count.textContent = String(3 - Number(preferredDeliveryDatesSubmitted) - Number(deliveryChecklistSubmitted) - Number(preInstallComplete));
  updateInstallationItemStatuses();
  updateInstallationOrderStatus();
}

function updateInstallationOrderStatus() {
  const status = app.querySelector("[data-ins-order-status]");
  const newBadge = app.querySelector("[data-ins-order-new]");
  if (!status || !newBadge) return;
  const allStepsComplete = areInstallationStepsComplete();
  const installationComplete = allStepsComplete && installationStatusScenario === "all-installed";
  const order = app.querySelector("[data-ins-order]");
  const stepsJustCompleted = allStepsComplete && !order?.classList.contains("is-steps-complete");
  order?.classList.toggle("is-steps-complete", allStepsComplete);
  if (order && stepsJustCompleted && !installationOrderCollapsedByUser && !order.classList.contains("is-expanded")) {
    setInstallationExpanded(true, { updateStatus: false });
  }
  status.classList.toggle("ins-badge--danger", !allStepsComplete);
  status.classList.toggle("ins-badge--success", allStepsComplete);
  status.innerHTML = allStepsComplete
    ? `<img src="assets/icons/actions/checkmark/size=16px, style=bold.svg" alt="" />In progress`
    : `<img src="assets/icons/notifications/alert/size=16px, style=bold.svg" alt="" />Action(s) required`;
  newBadge.hidden = allStepsComplete;
  status.hidden = installationComplete;
  const actionHeading = app.querySelector("[data-ins-action-count]")?.closest(".ins-action-heading");
  const actionCards = app.querySelector("[data-ins-action-cards]");
  const completeNotice = app.querySelector("[data-ins-installation-complete-notice]");
  const orderExpanded = app.querySelector("[data-ins-order]")?.classList.contains("is-expanded") === true;
  if (actionHeading) actionHeading.hidden = installationComplete || !orderExpanded;
  if (actionCards) actionCards.hidden = installationComplete;
  if (completeNotice) completeNotice.hidden = !installationComplete || !orderExpanded;
  const statusScenarioButton = app.querySelector("[data-open-installation-status-scenarios]");
  if (statusScenarioButton) {
    statusScenarioButton.disabled = !allStepsComplete;
    statusScenarioButton.title = allStepsComplete
      ? "Simulate installation status change"
      : "Complete all three installation steps to change status";
  }
}

const INSTALLATION_ITEM_STATUS_DETAILS = {
  "Awaiting action(s)": {
    body: "Complete the action(s) required at the top of this order.",
    badgeClass: "ins-awaiting",
  },
  "Awaiting checklist(s)": {
    body: "Complete the checklist(s) required for this order.",
    badgeClass: "ins-awaiting",
  },
  "Install scheduled": {
    body: "The installation date has been scheduled.",
    badgeClass: "ins-installation-state ins-installation-state--scheduled",
  },
  "Install complete": {
    body: "Installation is complete and your instrument is available in My instruments page.",
    badgeClass: "ins-installation-state ins-installation-state--complete",
    tooltipClass: "ins-status-tooltip--tall",
  },
  Cancelled: {
    body: "Item is cancelled.",
    badgeClass: "ins-installation-state ins-installation-state--cancelled",
    tooltipClass: "ins-status-tooltip--compact",
  },
};

function createInstallationItemStatus(itemStatus, index, idPrefix = "installation") {
  const details = INSTALLATION_ITEM_STATUS_DETAILS[itemStatus];
  if (!details) {
    const status = document.createElement("span");
    status.textContent = itemStatus;
    return status;
  }

  const trigger = document.createElement("span");
  const safePrefix = idPrefix.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const tooltipId = `${safePrefix}-status-tooltip-${index}`;
  trigger.className = "ins-status-tooltip-trigger";
  trigger.tabIndex = 0;
  trigger.setAttribute("aria-describedby", tooltipId);

  const badge = document.createElement("span");
  badge.className = details.badgeClass;
  badge.textContent = itemStatus;

  const tooltip = document.createElement("span");
  tooltip.className = `ins-status-tooltip ${details.tooltipClass || ""}`.trim();
  tooltip.id = tooltipId;
  tooltip.setAttribute("role", "tooltip");
  tooltip.innerHTML = `<strong>${itemStatus}</strong><span>${details.body}</span>`;
  trigger.append(badge, tooltip);
  return trigger;
}

function updateInstallationItemStatuses() {
  app.querySelectorAll("[data-ins-item-status]").forEach((cell) => {
    const index = Number(cell.dataset.insItemIndex);
    const itemStatus = getInstallationItemStatus(index);
    const schedule = getInstallationItemSchedule(index);
    const row = cell.closest("tr");
    row.querySelector("[data-ins-item-date]").textContent = schedule?.date || "—";
    row.querySelector("[data-ins-item-engineer]").textContent = schedule?.engineer || "—";
    if (itemStatus === "—") {
      cell.textContent = "—";
      return;
    }
    cell.replaceChildren(createInstallationItemStatus(itemStatus, index));
  });
}

function getInstallationStatusScenarioForOrder(orderNumber) {
  if (orderNumber === "7659430547") return progressInstallationStatusScenario;
  if (orderNumber === "4827316059") return noChecklistOrderState.statusScenario;
  if (whiteGloveOrderStates.has(orderNumber)) {
    const status = whiteGloveOrderStates.get(orderNumber)?.status || "default";
    if (status === "scheduled") return "some-scheduled";
    if (status === "complete") return "all-installed";
    return "in-progress";
  }
  return installationStatusScenario;
}

function openInstallationStatusScenarios(event) {
  const trigger = event?.currentTarget;
  installationStatusTargetOrder = trigger?.dataset.statusOrder || "9012611245";
  if (installationStatusTargetOrder === "9012611245" && !areInstallationStepsComplete()) return;
  const currentScenario = getInstallationStatusScenarioForOrder(installationStatusTargetOrder);
  installationStatusScenariosDialog.querySelectorAll("[data-installation-status-scenario]").forEach((option) => {
    option.setAttribute("aria-pressed", String(option.dataset.installationStatusScenario === currentScenario));
  });
  installationStatusScenariosDialog.showModal();
  installationStatusScenariosDialog.querySelector("[data-close-installation-status-scenarios]").focus({ preventScroll: true });
}

function applyInstallationStatusScenario(scenario) {
  if (installationStatusTargetOrder === "7659430547") {
    progressInstallationStatusScenario = scenario;
    updateProgressOrderCompletionState();
    installationStatusScenariosDialog.close();
    return;
  }
  if (installationStatusTargetOrder === "4827316059") {
    noChecklistOrderState.statusScenario = scenario;
    noChecklistOrderState.step3Complete = scenario !== "in-progress";
    const order = app.querySelector('[data-no-checklist-order="4827316059"]');
    if (order) renderNoChecklistOrderState(order);
    installationStatusScenariosDialog.close();
    return;
  }
  if (whiteGloveOrderStates.has(installationStatusTargetOrder)) {
    const state = whiteGloveOrderStates.get(installationStatusTargetOrder);
    state.status = scenario === "in-progress" ? "default" : scenario === "some-scheduled" ? "scheduled" : "complete";
    const order = app.querySelector(`[data-wg-order-number="${installationStatusTargetOrder}"]`);
    if (order) renderWhiteGloveOrderState(order);
    installationStatusScenariosDialog.close();
    return;
  }
  installationStatusScenario = scenario;
  updateInstallationItemStatuses();
  updateInstallationOrderStatus();
  installationStatusScenariosDialog.close();
}

function wireInstallationStatusScenarioTrigger(scope = document) {
  scope.querySelectorAll("[data-open-installation-status-scenarios]").forEach((button) => {
    const orderNumber = button.dataset.statusOrder || "9012611245";
    button.disabled = orderNumber === "9012611245" && !areInstallationStepsComplete();
    button.title = button.disabled ? "Complete all three installation steps to change status" : "Change line item statuses";
    button.addEventListener("click", openInstallationStatusScenarios);
  });
}

function setDeliveryChecklistComplete(completed) {
  const card = app.querySelector("[data-delivery-checklist-card]");
  if (!card) return;
  card.classList.toggle("is-complete", completed);
  updateInstallationActionCount();
  if (!completed) return;
  card.innerHTML = `<div class="ins-action-card__head"><img class="ins-complete" src="assets/icons/notifications/success/size=24px, style=bold.svg" alt="" /><span>Step 2</span><img class="ins-checklist-icon" src="assets/icons/installation/del checklist/size=32px, style=mono.svg" alt="" /></div><h3>Delivery checklist submitted</h3><p>Thank you! Your checklist has been received.</p><button class="mi-button ins-small-button" type="button" data-open-delivery-checklist-details>View details</button>`;
  wireDeliveryChecklistDetailsTriggers(card);
}

function setPreInstallChecklistComplete(completed) {
  const card = app.querySelector("[data-preinstall-checklist-card]");
  if (!card) return;
  card.classList.toggle("is-complete", completed);
  updateInstallationActionCount();
  if (!completed) return;
  card.innerHTML = `<div class="ins-action-card__head"><img class="ins-complete" src="assets/icons/notifications/success/size=24px, style=bold.svg" alt="" /><span>Step 3</span><img class="ins-checklist-icon" src="assets/icons/installation/preinstall checklist/size=32px, style=mono.svg" alt="" /></div><h3>Pre-install checklist(s) submitted</h3><p>Thank you! Your checklist(s) have been received.</p><button class="mi-button ins-small-button" type="button" data-open-preinstall-checklist-upload>View details</button>`;
  wirePreInstallChecklistUploadTriggers(card);
}

function openDeliveryChecklistDetailsModal() {
  deliveryChecklistDetailsDialog.showModal();
  deliveryChecklistDetailsDialog.querySelector("[data-delivery-checklist-details-modal]").focus({ preventScroll: true });
}

function wireDeliveryChecklistDetailsTriggers(scope = document) {
  scope.querySelectorAll("[data-open-delivery-checklist-details]").forEach((control) => {
    if (control.dataset.deliveryChecklistDetailsWired) return;
    control.dataset.deliveryChecklistDetailsWired = "true";
    control.addEventListener("click", openDeliveryChecklistDetailsModal);
  });
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
  if (route === "dashboard" || route === "signin" || ROUTES[route] || CUSTOM_ROUTES[route] || isInstallationShellDetailRoute(route) || isMiUserDetailRoute(route) || isMiGroupDetailRoute(route) || isMiSystemDetailRoute(route) || isMiInstrumentDetailRoute(route)) return route;
  return "signin";
}

function setRoute(route, summaryTicket = null) {
  const fromRoute = routeFromHash();
  if (route === "education" && isKoreaCmdPrototype()) route = "korea-education";
  if (isInstallationsUnavailablePrototype() && (isInstallationsSectionRoute(route) || route === "installation-support")) {
    route = isUnmappedPrototypeUser() ? "dashboard" : "request-support";
  }
  if (route === "installation-support" && fromRoute !== "installation-support") {
    installationSupportReturnRoute = isInstallationsSectionRoute(fromRoute) ? "installations" : "request-support";
  }
  selectedSupportHistoryTicket = summaryTicket;
  const safeRoute = route === "dashboard" || route === "signin" || ROUTES[route] || CUSTOM_ROUTES[route] || isInstallationShellDetailRoute(route) || isMiUserDetailRoute(route) || isMiGroupDetailRoute(route) || isMiSystemDetailRoute(route) || isMiInstrumentDetailRoute(route) ? route : "signin";
  const nextHash = `#${safeRoute}`;
  const nextUrl = new URL(window.location.href);
  nextUrl.hash = nextHash;
  if (safeRoute !== "my-instruments") {
    nextUrl.searchParams.delete("instruments-tab");
    nextUrl.searchParams.delete("instruments-section");
  }
  if (window.location.href !== nextUrl.href) window.history.pushState({ fromRoute }, "", nextUrl);
  render();
}

document.addEventListener("click", (event) => {
  const backButton = event.target.closest("[data-flow-history-back]");
  if (!backButton) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  window.history.back();
}, true);

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
    if (route === "installations" && isInstallationsUnavailablePrototype()) return;
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
      { label: "Installation support", route: "installation-support", x: 730, y: 888, w: 210, h: 50 },
    ],
    "instrument-access": [
      { label: "Start a request", route: "request-support", x: 1122, y: 97, w: 166, h: 27 },
      { label: "View PM cycle", route: "pm-cycle", x: 56, y: 534, w: 1384, h: 128 },
    ],
    multiuse: [{ label: "Open first instrument", route: "instrument-access", x: 88, y: 520, w: 304, h: 390 }],
    "ticket-detail": [{ label: "View quote", route: "installation-order", x: 980, y: 575, w: 110, h: 42 }],
    education: [{ label: "Return to dashboard", route: "dashboard", x: 0, y: 0, w: 1440, h: 1460 }],
    "korea-education": [{ label: "Return to dashboard", route: "dashboard", x: 0, y: 0, w: 1291, h: 1309 }],
  };

  (extras[route] || []).forEach((hotspot) => addHotspot(canvas, screen, hotspot));
}

function wireRouteControls(scope = app) {
  hideMiUsersTooltip();
  ensureFlowToolbarHistoryControls(scope);
  scope.querySelectorAll("[data-route]").forEach((control) => {
    control.addEventListener("click", () => {
      if (control.hasAttribute("data-installation-email-entry")) installationWelcomeFromEmail = true;
      if (control.hasAttribute("data-service-plan-email-entry")) {
        servicePlanApprovalPending = true;
        servicePlanApprovalPromptShown = false;
      }
      setRoute(control.dataset.route);
    });
  });
  scope.querySelectorAll("[data-open-flows]").forEach((control) => {
    control.addEventListener("click", () => flowsDialog.showModal());
  });
  window.TopbarSc?.wire(scope);
  window.ServicesHelpModal.wire(scope);
  wireMiUserCountTooltips(scope);
}

function ensureFlowToolbarHistoryControls(scope = app) {
  scope.querySelectorAll(".flow-toolbar").forEach((toolbar) => {
    if (toolbar.querySelector(".flow-toolbar__history")) return;
    const backButton = toolbar.querySelector(":scope > button:first-child");
    if (!backButton) return;
    backButton.dataset.flowHistoryBack = "";
    const historyControls = document.createElement("div");
    historyControls.className = "flow-toolbar__history";
    const refreshButton = document.createElement("button");
    refreshButton.type = "button";
    refreshButton.textContent = "Refresh";
    refreshButton.dataset.flowRefresh = "";
    refreshButton.addEventListener("click", () => window.location.reload());
    backButton.before(historyControls);
    historyControls.append(backButton, refreshButton);
  });
}

function wireSignIn() {
  app.querySelector("[data-signin-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    setRoute("dashboard");
  });
  app.querySelector("[data-help]").addEventListener("click", () => helpDialog.showModal());
}

const DASHBOARD_SORT_ICON = '<img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" />';
const DASHBOARD_SYSTEM_ICON = "assets/icons/science/system/size=24px,%20style=mono.svg";
const DASHBOARD_VISIT_ICON = "assets/icons/general/scheduled%20service/size=24px,%20style=mono.svg";
const DASHBOARD_DOWNLOAD_ICON = "assets/icons/actions/download/Size=16px, Style=Mono.svg";
const DASHBOARD_BANNERS = [
  {
    title: "We found 24 instrument(s) associated with your email address",
    body: "Review and add the suggested instruments to your account.",
    action: "Go to suggestions",
    image: "assets/instruments/add-instruments-suggestion.svg",
  },
  {
    title: "6 related system(s) suggested",
    body: "Review the system(s) and add or ignore.",
    action: "Go to suggestions",
    image: "assets/dashboard/related-systems-suggestion.svg",
  },
  {
    title: "3 instrument(s) access requests awaiting your approval",
    body: "Review the instrument(s) and approve or deny.",
    action: "Go to pending",
    image: "assets/instruments/add-instruments-suggestion.svg",
  },
  {
    title: "5 instrument(s) shared with you",
    body: "Review and add instruments to your account.",
    action: "Go to pending",
    image: "assets/instruments/add-instruments-suggestion.svg",
  },
];

const DASHBOARD_CARD_ICONS = {
  favorite: "assets/icons/commerce/rating/Size=16px,%20Style=Bold.svg",
  close: "assets/icons/actions/close/size=32px,%20style=bold.svg",
  lock: "assets/icons/actions/lock%20closed/size=16px,%20style=mono.svg",
  users: "assets/icons/general/2%20users/size=16px,%20style=mono.svg",
  support: "assets/icons/navigation/support/size=16px, style=bold.svg",
  expand: "assets/icons/tools/resize%20large/size=16px,%20style=bold.svg",
  more: "assets/icons/actions/more%20horizontal/size=24px,%20style=bold.svg",
};

const DASHBOARD_FAVORITE_INSTRUMENTS = [
  {
    serial: "TSQ-Z-12346",
    name: "Triple Quadrupole LC-MS",
    nickname: "TSQ-0",
    model: "MSTSQQUANTISPLUS",
    type: "LC",
    groups: "—",
    image: "tsq.png",
    coverage: "Under contract",
    coverageTone: "contract",
    userCount: 3,
  },
  {
    serial: "TSQ-Z-12347",
    name: "Triple Quadrupole LC-MS",
    nickname: "TSQ-1",
    model: "MSTSQQUANTISPLUS",
    type: "Cold Chromatograph",
    groups: "—",
    image: "tsq.png",
    coverage: "Under contract",
    coverageTone: "contract",
    userCount: 4,
  },
  {
    serial: "TSQ-Z-12348",
    name: "Triple Quadrupole LC-MS",
    nickname: "TSQ-2",
    model: "MSTSQQUANTISPLUS",
    type: "Mass Spec Life Science",
    groups: "—",
    image: "tsq.png",
    coverage: "Under contract",
    coverageTone: "contract",
    userCount: 5,
  },
];

const DASHBOARD_QUICK_VIEW_INSTRUMENTS = [
  {
    serial: "1009996",
    name: "Vanquish&trade; Detector F",
    nickname: "Detector-2B",
    model: "VQF0000DET",
    type: "HPLC",
    groups: "Biotherapeutics Discovery...",
    image: "vanquish-detector.png",
    coverage: "Under contract",
    coverageTone: "contract",
    groupsAsLink: true,
    userCount: 3,
  },
  {
    serial: "1009999",
    name: "Vanquish&trade; Column",
    nickname: "Column-2B",
    model: "VQH000OVEN",
    type: "HPLC",
    groups: "Biotherapeutics Discovery...",
    image: "vanquish-column.png",
    coverage: "Contract expired",
    coverageTone: "expired",
    groupsAsLink: true,
    userCount: 3,
  },
  {
    serial: "1009998",
    name: "Vanquish&trade; Sampler",
    nickname: "Sampler-2B",
    model: "VQF00SAMPL",
    type: "HPLC",
    groups: "Biotherapeutics Discovery...",
    image: "vanquish-sampler.png",
    coverage: "Contract expired",
    coverageTone: "expired",
    groupsAsLink: true,
    userCount: 3,
  },
  {
    serial: "1009997",
    name: "Vanquish&trade; Binary Pump H",
    nickname: "Pump-2B",
    model: "VQF000PUMP",
    type: "HPLC",
    groups: "Biotherapeutics Discovery...",
    image: "vanquish-pump.png",
    coverage: "Contract expired",
    coverageTone: "expired",
    groupsAsLink: true,
    userCount: 3,
  },
];

const DASHBOARD_CLOSED_TICKETS = [
  { ticket: "446532405", closed: "30 Jan 2019", subject: "Need support for unknown instrument error", serial: "TSQ-Z-12346", model: "VQF0000DET", image: "tsq.png", highlighted: true, report: true, download: true },
  { ticket: "446532404", closed: "29 Feb 2019", subject: "Need support for unknown instrument error", serial: "TSQ-Z-12345", model: "VQH0000VEN", image: "tsq.png", highlighted: true, report: true, download: true },
  { ticket: "446532403", closed: "28 Mar 2019", subject: "Need support for unknown instrument error", serial: "1009997", model: "VQF00SAMPL", image: "vanquish-column.png", report: true },
  { ticket: "446532402", closed: "27 Apr 2019", subject: "Repair 0000123459 instrument parts", serial: "1009996", model: "VQF000PUMP", image: "vanquish-pump.png", system: true },
  { ticket: "446532401", closed: "26 May 2019", subject: "Repair 0000123459 instrument parts", serial: "1009999", model: "MSTSQQUANTISPLUS", image: "vanquish-pump.png", system: true },
  { ticket: "446532400", closed: "25 Jun 2019", subject: "Need support for unknown instrument error", serial: "TSQ-Z-12347", model: "MSTSQQUANTISPLUS", image: "tsq.png", report: true },
  { ticket: "446532399", closed: "24 Jul 2019", subject: "Need support for unknown instrument error", serial: "TSQ-Z-12348", model: "MSTSQQUANTISPLUS", image: "tsq.png", report: true, download: true },
  { ticket: "446532398", closed: "23 Aug 2019", subject: "Need support for unknown instrument error", serial: "SN98355W", model: "MSTSQQUANTISPLUS", image: "q-exactive.png" },
];

const DASHBOARD_ONSITE_VISITS = [
  { scheduled: "04 Mar 2024", ticket: "441582736", type: "PM (Contract)", subject: "Repair 0000123459 instrument parts", serial: "1009998", model: "VQF000PUMP", image: "vanquish-sampler.png", system: true, highlighted: true },
  { scheduled: "05 Mar 2024", ticket: "441582735", type: "Service Request", subject: "Repair 0000123459 instrument parts", serial: "1009997", model: "MSTSQQUANTISPLUS", image: "vanquish-pump.png", system: true, highlighted: true },
  { scheduled: "06 Mar 2024", ticket: "441582734", type: "Service Request", subject: "Need support for unknown instrument error", serial: "TSQ-Z-12345", model: "MSTSQQUANTISPLUS", image: "tsq.png", highlighted: true },
  { scheduled: "07 Mar 2024", ticket: "441582733", type: "PM (Contract)", subject: "Need support for unknown instrument error", serial: "TSQ-Z-12347", model: "MSTSQQUANTISPLUS", image: "tsq.png" },
  { scheduled: "08 Mar 2024", ticket: "441582732", type: "PM (Contract)", subject: "Need support for unknown instrument error", serial: "TSQ-Z-12348", model: "MSTSQQUANTISPLUS", image: "tsq.png", system: true },
];

function dashboardTableHeader(label) {
  return `<th>${label} ${DASHBOARD_SORT_ICON}</th>`;
}

function dashboardSerialCell(ticket) {
  const systemIcon = ticket.system ? `<img class="db-ticket-system-icon" src="${DASHBOARD_SYSTEM_ICON}" alt="" />` : "";
  return `<td class="db-ticket-system-cell">${systemIcon}</td><td class="db-ticket-serial"><span class="db-ticket-serial-content"><img class="db-ticket-thumb" src="assets/instruments/${ticket.image}" alt="" /><a href="#instrument-access">${ticket.serial}</a></span></td>`;
}

function dashboardReportCell(ticket) {
  if (!ticket.report && !ticket.download) return "<td></td>";
  const report = ticket.report ? '<button class="db-report-button" type="button">View report</button>' : "";
  const download = ticket.download ? `<button class="db-download-button" type="button" aria-label="Download report"><img src="${DASHBOARD_DOWNLOAD_ICON}" alt="" /></button>` : "";
  return `<td><div class="db-ticket-actions">${report}${download}</div></td>`;
}

function dashboardClosedTicketRow(ticket) {
  return `<tr${ticket.highlighted ? ' class="is-highlighted"' : ""}><td><span class="db-status db-status--closed">Closed</span></td><td><a href="#ticket-detail">${ticket.ticket}</a></td><td>${ticket.closed}</td><td>${ticket.subject}</td>${dashboardSerialCell(ticket)}<td>${ticket.model}</td>${dashboardReportCell(ticket)}</tr>`;
}

function renderDashboardClosedTicketTable() {
  return `<table class="db-table db-table--closed"><colgroup><col class="db-col-closed-status" /><col class="db-col-closed-ticket" /><col class="db-col-closed-date" /><col class="db-col-closed-subject" /><col class="db-col-system" /><col class="db-col-closed-serial" /><col class="db-col-closed-model" /><col class="db-col-closed-actions" /></colgroup><thead><tr>${dashboardTableHeader("Status")}${dashboardTableHeader("Ticket no.")}${dashboardTableHeader("Closed")}${dashboardTableHeader("Subject")}<th class="db-ticket-system-heading"></th>${dashboardTableHeader("Serial no.")}${dashboardTableHeader("Catalog no.")}<th>Actions</th></tr></thead><tbody>${DASHBOARD_CLOSED_TICKETS.map(dashboardClosedTicketRow).join("")}</tbody></table>`;
}

function dashboardVisitRow(visit) {
  return `<tr${visit.highlighted ? ' class="is-highlighted"' : ""}><td class="db-ticket-date"><span class="db-ticket-date-content"><img src="${DASHBOARD_VISIT_ICON}" alt="" />${visit.scheduled}</span></td><td><span class="db-status db-status--progress">In progress</span></td><td><a href="#ticket-detail">${visit.ticket}</a></td><td>${visit.type}</td><td>${visit.subject}</td>${dashboardSerialCell(visit)}<td>${visit.model}</td></tr>`;
}

function renderDashboardVisitsTable() {
  return `<table class="db-table db-table--visits"><colgroup><col class="db-col-visit-date" /><col class="db-col-visit-status" /><col class="db-col-visit-ticket" /><col class="db-col-visit-type" /><col class="db-col-visit-subject" /><col class="db-col-system" /><col class="db-col-visit-serial" /><col class="db-col-visit-model" /></colgroup><thead><tr>${dashboardTableHeader("Scheduled date")}${dashboardTableHeader("Status")}${dashboardTableHeader("Ticket no.")}${dashboardTableHeader("Ticket type")}${dashboardTableHeader("Subject")}<th class="db-ticket-system-heading"></th>${dashboardTableHeader("Serial no.")}${dashboardTableHeader("Catalog no.")}</tr></thead><tbody>${DASHBOARD_ONSITE_VISITS.map(dashboardVisitRow).join("")}</tbody></table>`;
}

function dashboardInstrumentCard(instrument) {
  const userCount = instrument.userCount ?? 3;
  const coverageToneClass = instrument.coverageTone ? ` db-coverage--${instrument.coverageTone}` : "";
  const groups = instrument.groupsAsLink ? `<span class="db-card__text-link">${instrument.groups}</span>` : instrument.groups;

  return `<article class="db-card">
    <header>
      <img class="db-card__product" src="assets/instruments/${instrument.image}" alt="" />
      <div>
        <small>Serial no.</small>
        <a href="#instrument-access">${instrument.serial}</a>
        <p>${instrument.name}</p>
      </div>
      <button class="db-card__star" type="button" aria-label="Favorite instrument"><img src="${DASHBOARD_CARD_ICONS.favorite}" alt="" /></button>
      <span class="db-card__users" aria-label="${userCount} users"><img src="${DASHBOARD_CARD_ICONS.users}" alt="" />${userCount}</span>
    </header>
    <dl>
      <dt>Nickname</dt><dd>${instrument.nickname}</dd>
      <dt>Catalog no.</dt><dd>${instrument.model}</dd>
      <dt>Type</dt><dd>${instrument.type}</dd>
      <dt>Groups</dt><dd>${groups}</dd>
    </dl>
    <span class="db-coverage${coverageToneClass}">${instrument.coverage}</span>
    <footer>
      <button type="button" data-route="request-support"><img src="${DASHBOARD_CARD_ICONS.support}" alt="" />Request support</button>
      <button type="button" aria-label="More options"><img class="db-card__more-icon" src="${DASHBOARD_CARD_ICONS.more}" alt="" /></button>
    </footer>
  </article>`;
}

function dashboardSystemFavoriteCard() {
  return `<div class="db-card-stack">
    <div class="db-card-stack__backs" aria-hidden="true">
      <span class="db-card-stack__back db-card-stack__back--last"></span>
      <span class="db-card-stack__back db-card-stack__back--second"></span>
    </div>
    <article class="db-card db-card--group">
      <header>
        <span>LC/MS</span>
        <button type="button" aria-label="Favorite group"><img src="${DASHBOARD_CARD_ICONS.favorite}" alt="" /></button>
        <img src="${DASHBOARD_CARD_ICONS.lock}" alt="" />
        <span class="db-card__users" aria-label="3 users"><img src="${DASHBOARD_CARD_ICONS.users}" alt="" />3</span>
        <a href="#instrument-access">Alpine</a>
      </header>
      <dl>
        <dt>Components</dt><dd>total components</dd>
        <dt>Groups</dt><dd><span class="db-card__text-link">Department of Medical...</span> <b>+3</b></dd>
        <dt>Tickets</dt><dd><span class="db-card__text-link">16 total support tickets</span></dd>
      </dl>
      <footer>
        <button type="button" data-open-system-quick-view aria-label="Expand group"><img src="${DASHBOARD_CARD_ICONS.expand}" alt="" /></button>
        <button type="button" aria-label="More options"><img class="db-card__more-icon" src="${DASHBOARD_CARD_ICONS.more}" alt="" /></button>
      </footer>
    </article>
  </div>`;
}

function renderDashboardFavoriteCards() {
  const target = app.querySelector("[data-dashboard-favorite-cards]");
  if (!target) return;
  const favoriteSystems = miCurrentSystems().filter((system) => miIsFavorite(`system:${system.id}`));
  const favoriteSystemComponents = new Set(favoriteSystems.flatMap((system) => system.components));
  const favoriteInstruments = miCurrentInstruments().filter((instrument) => miIsFavorite(`instrument:${instrument.serial}`) && !favoriteSystemComponents.has(instrument.serial) && !MI_REMOVED_INSTRUMENTS.has(instrument.serial));
  target.innerHTML = favoriteSystems.map(miCreatedSystemCardMarkup).join("") + favoriteInstruments.map((instrument) => miGridCardMarkup(instrument)).join("");
}

function dashboardSystemQuickViewContent() {
  return `<section class="system-quick-view" aria-label="Alpine system quick view">
    <header class="system-quick-view__hero">
      <div class="system-quick-view__meta">
        <img class="system-quick-view__favorite" src="${DASHBOARD_CARD_ICONS.favorite}" alt="" />
        <span>LC</span>
      </div>
      <h2>Alpine</h2>
    </header>
    <div class="system-quick-view__cards">
      ${DASHBOARD_QUICK_VIEW_INSTRUMENTS.map(dashboardInstrumentCard).join("")}
    </div>
  </section>`;
}

function createDashboardSystemQuickViewModal() {
  return window.PlatformModal?.mount('[data-modal-mount="system-quick-view-modal"]', {
    id: "system-quick-view-modal",
    title: "Create a system",
    size: "xl",
    className: "system-quick-view-modal",
    bodyClassName: "system-quick-view-modal__body",
    closeLabel: "Close system quick view",
    closeIcon: DASHBOARD_CARD_ICONS.close,
    content: dashboardSystemQuickViewContent(),
  });
}

function wireDashboard() {
  app.querySelector("[data-back-to-signin]")?.addEventListener("click", () => setRoute("signin"));
  app.querySelector("[data-dashboard-search]")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") setRoute("my-instruments");
  });
  renderDashboardFavoriteCards();
  app.querySelectorAll("[data-mi-system-quickview]").forEach((button) => button.addEventListener("click", () => {
    const system = miFindSystemById(button.dataset.miSystemQuickview);
    if (system) openMiSystemQuickview(system);
  }));
  app.querySelectorAll("[data-dashboard-favorite-cards] .mi-favorite").forEach((button) => button.addEventListener("click", () => {
    toggleMiFavorite(button);
    if (!miIsFavorite(button.dataset.miFavoriteKey)) button.closest(".mi-instrument-card")?.remove();
  }));
  wireMiActionMenus(app.querySelector("[data-dashboard-favorite-cards]"));
  const tableWrap = app.querySelector("[data-db-ticket-table]");
  const pagination = app.querySelector("[data-db-ticket-pagination]");
  const filter = app.querySelector("[data-db-ticket-filter]");
  const ticketCount = app.querySelector("[data-ticket-count]");
  const activeTableMarkup = tableWrap?.innerHTML || "";
  const ticketTables = {
    active: { count: "16 active tickets", markup: activeTableMarkup, showFilter: true, showPagination: true },
    closed: { count: "8 tickets closed within the last 30 days", markup: renderDashboardClosedTicketTable() },
    visits: { count: "5 upcoming on-site visits", markup: renderDashboardVisitsTable() },
  };
  const showTicketTable = (state) => {
    const table = ticketTables[state] || ticketTables.active;
    if (ticketCount) ticketCount.textContent = table.count;
    if (tableWrap) tableWrap.innerHTML = table.markup;
    if (filter) filter.hidden = !table.showFilter;
    if (pagination) pagination.hidden = !table.showPagination;
  };
  app.querySelectorAll(".db-tabs [role='tab']").forEach((tab) => {
    tab.addEventListener("click", () => {
      app.querySelectorAll(".db-tabs [role='tab']").forEach((candidate) => {
        const selected = candidate === tab;
        candidate.classList.toggle("is-active", selected);
        candidate.setAttribute("aria-selected", String(selected));
      });
      showTicketTable(tab.dataset.ticketState);
    });
  });
  let bannerIndex = 0;
  const updateBanner = () => {
    const banner = DASHBOARD_BANNERS[bannerIndex];
    const bannerArt = app.querySelector("[data-db-banner-art]");
    if (bannerArt) bannerArt.src = banner.image;
    const bannerTitle = app.querySelector("[data-db-banner-title]");
    if (bannerTitle) bannerTitle.textContent = banner.title;
    const bannerBody = app.querySelector("[data-db-banner-body]");
    if (bannerBody) bannerBody.textContent = banner.body;
    const bannerAction = app.querySelector("[data-db-banner-action]");
    if (bannerAction) bannerAction.textContent = banner.action;
    app.querySelectorAll(".db-banner .ai-banner__dots span").forEach((dot, index) => dot.classList.toggle("is-active", index === bannerIndex));
    app.querySelector(".db-banner .ai-banner__dots")?.setAttribute("aria-label", `Notification ${bannerIndex + 1} of ${DASHBOARD_BANNERS.length}`);
  };
  updateBanner();
  app.querySelector("[data-db-banner-prev]")?.addEventListener("click", () => { bannerIndex = (bannerIndex + DASHBOARD_BANNERS.length - 1) % DASHBOARD_BANNERS.length; updateBanner(); });
  app.querySelector("[data-db-banner-next]")?.addEventListener("click", () => { bannerIndex = (bannerIndex + 1) % DASHBOARD_BANNERS.length; updateBanner(); });
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
    hiddenItemIds: isInstallationsUnavailablePrototype() ? ["installations"] : [],
  });
}

function mountTopbarSc(options = {}) {
  window.TopbarSc?.mount(app.querySelector("[data-topbar-sc-mount]"), options);
}

function mountTopbarNotifications() {
  window.TopbarNotifications?.mount(app.querySelector("[data-topbar-notifications-mount]"));
}

function mountFooter(options = {}) {
  window.Footer?.mount(app.querySelector("[data-footer-mount]"), options);
}

const ZERO_STATE_CONTENT = {
  dashboard: {
    image: "assets/zero-states/dashboard.png",
    title: "Welcome to your Dashboard",
    body: "Services Central Dashboard will give you a concise view on recent and upcoming tickets, access to eLearning and applicable promotions, ordering of consumables, and more.",
  },
  instruments: {
    image: "assets/zero-states/instruments.png",
    title: "Welcome to your Instruments page",
    body: "In the Instruments page, you will be able to create groups or systems, add nicknames and notes, view service coverage status and manage instrument access.",
  },
  history: {
    image: "assets/zero-states/support-history.png",
    title: "Welcome to your support request history",
    body: "This page will show you current and closed support tickets for all the instruments added to your account",
  },
  request: {
    image: "assets/zero-states/request-support.png",
    title: "Welcome to Request support",
    body: "This page will allow you to request various services (such as repair, PM, compliance, calibration) and service plan quotes.",
  },
  contacts: {
    image: "assets/zero-states/service-plan.png",
    title: "Assign a service plan contact",
    body: "Tell us who to contact for any service plan questions or to renew your plan. Keeping your details current helps us provide timely notifications, important updates, and offers related to your instrument coverage.",
  },
};

function zeroStateMarkup(kind, { contactsAvailable = false } = {}) {
  const state = ZERO_STATE_CONTENT[kind];
  const actions = contactsAvailable
    ? `<div class="prototype-zero-state__actions prototype-zero-state__actions--stacked"><button class="mi-button" type="button" data-route="edit-spc">Assign myself as service plan contact for all</button><button class="mi-button" type="button" data-route="edit-spc">Assign others</button></div>`
    : `<div class="prototype-zero-state__actions"><button class="mi-button" type="button" data-route="add-instruments">Add instruments to get started</button></div>`;
  return `<section class="prototype-zero-panel prototype-zero-panel--${kind}" aria-labelledby="prototype-zero-${kind}-title"><div class="prototype-zero-state"><img class="prototype-zero-state__image" src="${state.image}" alt="" /><div class="prototype-zero-state__copy"><h2 id="prototype-zero-${kind}-title">${state.title}</h2><p>${state.body}</p></div>${actions}</div></section>`;
}

function applyUnmappedDashboard() {
  const main = app.querySelector(".db-main");
  const top = app.querySelector(".db-top");
  if (!main || !top) return;
  top.querySelector(".db-search")?.remove();
  top.querySelector(".db-promo")?.remove();
  app.querySelectorAll(".db-tickets, .db-favorites").forEach((section) => section.remove());
  top.after(document.createRange().createContextualFragment(zeroStateMarkup("dashboard")));
}

function applyUnmappedInstruments() {
  const main = app.querySelector(".mi-main");
  if (!main) return;
  app.querySelector(".mi-tabs")?.remove();
  app.querySelectorAll(".mi-content, .mi-secondary-content").forEach((section) => section.remove());
  main.append(document.createRange().createContextualFragment(zeroStateMarkup("instruments")));
}

function applyUnmappedSupportHistory() {
  const content = app.querySelector(".sh-content");
  if (content) content.replaceWith(document.createRange().createContextualFragment(zeroStateMarkup("history")));
}

function applyUnmappedRequestSupport() {
  const main = app.querySelector(".mi-main");
  if (!main) return;
  [...main.children].forEach((child) => {
    if (!child.classList.contains("mi-titlebar")) child.remove();
  });
  main.append(document.createRange().createContextualFragment(zeroStateMarkup("request")));
}

function applyServicePlanContactsZeroState({ contactsAvailable = false } = {}) {
  const main = app.querySelector(".splan-main");
  if (!main) return;
  main.replaceChildren();
  const heading = document.createElement("section");
  heading.className = "mi-titlebar splan-zero-titlebar";
  heading.innerHTML = `<div><h1>Service plan contacts</h1>${contactsAvailable ? "<p>50 out of 50 instruments without a service plan contact</p>" : ""}</div>`;
  main.append(heading, document.createRange().createContextualFragment(zeroStateMarkup("contacts", { contactsAvailable })));
}

function isSupportFlowTitlebarRoute(route) {
  return route.startsWith("open-support-ticket")
    || route.startsWith("request-pm")
    || route === "pm-request-summary"
    || route.startsWith("request-serviceplan")
    || route === "serviceplan-summary"
    || route.startsWith("request-qualification")
    || route === "qualification-summary"
    || route.startsWith("request-calibration")
    || route === "calibration-summary"
    || Boolean(TICKET_SUMMARIES[route]);
}

function mountNativePageChrome(activeRoute, { title, backRoute = "request-support" } = {}) {
  const stage = app.querySelector(".mi-stage");
  const shell = app.querySelector(".mi-shell");
  const legacyHeader = app.querySelector(".mi-header");
  const legacyFooter = app.querySelector(".mi-footer");
  const titlebar = app.querySelector(".iss-titlebar, .pm-titlebar, .ts-titlebar");

  if (titlebar && isSupportFlowTitlebarRoute(routeFromHash())) {
    titlebar.dataset.platformTitlebar = "";
  }

  if (!app.querySelector(".flow-toolbar") && stage) {
    const toolbar = document.createElement("div");
    toolbar.className = "flow-toolbar";
    toolbar.innerHTML = `<button type="button" data-route="${backRoute}">Back</button><strong>${title}</strong><div class="flow-toolbar__actions"><button type="button" data-route="dashboard">Dashboard</button><button type="button" data-open-flows>All flows</button></div>`;
    stage.before(toolbar);
  }

  if (shell) shell.classList.add("mi-shell--native-flow");

  if (legacyHeader && !app.querySelector("[data-topbar-sc-mount]")) {
    const topbarMount = document.createElement("div");
    topbarMount.dataset.topbarScMount = "";
    legacyHeader.replaceWith(topbarMount);
  }

  if (legacyFooter && !app.querySelector("[data-footer-mount]")) {
    const footerMount = document.createElement("div");
    footerMount.dataset.footerMount = "";
    legacyFooter.replaceWith(footerMount);
  }

  mountTopbarSc();
  mountPlatformSidebar(activeRoute);
  mountFooter();
}

function mountNativeFlowActionBar({ cancelRoute = "request-support", backRoute = "request-support", primaryDisabled = true } = {}) {
  const bar = window.PlatformActionBar?.mount(app.querySelector("[data-platform-action-bar-mount]"), {
    cancelRoute,
    backRoute,
    primaryDisabled,
  });
  bar?.classList.add("platform-actionbar--native-flow");
  return bar;
}

function mountTicketStepViewer(currentStep, options = {}) {
  window.TicketStepViewer?.mount(app.querySelector("[data-ticket-step-viewer]"), { currentStep, ...options });
}

function wireEditSpc() {
  const screen = app.querySelector(".screen--spc");
  const main = app.querySelector(".spc-main");
  const stepper = app.querySelector(".spc-stepper");
  const stepElements = [...app.querySelectorAll("[data-spc-step]")];
  const panels = [...app.querySelectorAll("[data-spc-panel]")];
  const summaryPage = app.querySelector("[data-spc-summary]");
  const cancelButton = app.querySelector("[data-spc-cancel]");
  const continueButton = app.querySelector("[data-spc-continue]");
  const backButton = app.querySelector("[data-spc-back]");
  const closeButton = app.querySelector("[data-spc-close]");
  const contactEmail = app.querySelector("[data-spc-contact-email]");
  const contactConfirmationNotice = app.querySelector("[data-spc-contact-confirmation-notice]");
  const selectedToggle = app.querySelector("[data-spc-selected-toggle]");
  const selectedToggleLabel = app.querySelector("[data-spc-selected-label]");
  const selectedPanel = app.querySelector("[data-spc-selected-panel]");
  const reviewToggle = app.querySelector("[data-spc-review-toggle]");
  const reviewToggleLabel = app.querySelector("[data-spc-review-label]");
  const reviewPanel = app.querySelector("[data-spc-review-panel]");
  const summaryToggle = app.querySelector("[data-spc-summary-toggle]");
  const summaryToggleLabel = app.querySelector("[data-spc-summary-label]");
  const summaryPanel = app.querySelector("[data-spc-summary-panel]");
  let currentStep = 1;

  const setStep = (step) => {
    currentStep = step;
    screen?.classList.toggle("is-step-two", step === 2);
    screen?.classList.remove("is-spc-summary");
    if (summaryPage) {
      summaryPage.hidden = true;
    }
    if (stepper) {
      stepper.hidden = false;
    }
    stepper?.setAttribute("data-spc-current-step", String(step));
    stepElements.forEach((element) => {
      const stepNumber = Number(element.dataset.spcStep);
      const isCurrent = stepNumber === step;
      const isComplete = stepNumber < step;
      const marker = element.querySelector(".spc-step__number");
      element.classList.toggle("is-current", isCurrent);
      element.classList.toggle("is-complete", isComplete);
      if (isCurrent) {
        element.setAttribute("aria-current", "step");
      } else {
        element.removeAttribute("aria-current");
      }
      if (marker) {
        marker.textContent = isComplete ? "" : String(stepNumber);
      }
    });
    panels.forEach((panel) => {
      panel.hidden = Number(panel.dataset.spcPanel) !== step;
    });
    if (backButton) {
      backButton.hidden = step === 1;
    }
    if (cancelButton) {
      cancelButton.hidden = false;
    }
    if (continueButton) {
      continueButton.hidden = false;
      continueButton.textContent = step === 3 ? "Confirm" : "Continue";
    }
    if (closeButton) {
      closeButton.hidden = true;
    }
    main?.scrollTo({ top: 0, behavior: "auto" });
  };

  const showSummary = () => {
    currentStep = 4;
    screen?.classList.remove("is-step-two");
    screen?.classList.add("is-spc-summary");
    if (stepper) {
      stepper.hidden = true;
    }
    panels.forEach((panel) => {
      panel.hidden = true;
    });
    if (summaryPage) {
      summaryPage.hidden = false;
    }
    if (cancelButton) {
      cancelButton.hidden = true;
    }
    if (backButton) {
      backButton.hidden = true;
    }
    if (continueButton) {
      continueButton.hidden = true;
    }
    if (closeButton) {
      closeButton.hidden = false;
    }
    main?.scrollTo({ top: 0, behavior: "auto" });
  };

  const isAssigningSomeoneElse = () => app.querySelector("[data-spc-contact-assignment][value='someone-else']")?.checked;

  const updateContactConfirmationNotice = () => {
    if (contactConfirmationNotice) {
      contactConfirmationNotice.hidden = !isAssigningSomeoneElse();
    }
  };

  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  app.querySelectorAll("[data-spc-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      app.querySelectorAll("[data-spc-filter]").forEach((filter) => filter.classList.remove("is-selected"));
      button.classList.add("is-selected");
    });
  });
  app.querySelectorAll("[data-spc-contact-assignment]").forEach((radio) => {
    radio.addEventListener("change", () => {
      if (!contactEmail || !radio.checked) return;
      if (radio.value === "myself") {
        contactEmail.value = "sebastien.martin@companyname.com";
        contactEmail.readOnly = true;
        contactEmail.removeAttribute("placeholder");
      } else {
        contactEmail.value = "";
        contactEmail.readOnly = false;
        contactEmail.placeholder = "name@companyname.com";
        contactEmail.focus();
      }
      updateContactConfirmationNotice();
    });
  });
  selectedToggle?.addEventListener("click", () => {
    const expanded = selectedToggle.getAttribute("aria-expanded") === "true";
    const nextExpanded = !expanded;
    const icon = selectedToggle.querySelector("img");
    selectedToggle.setAttribute("aria-expanded", String(nextExpanded));
    if (icon) {
      icon.src = `assets/icons/directions/chevron ${expanded ? "right" : "down"}/size=24px, style=mono.svg`;
    }
    if (selectedToggleLabel) {
      selectedToggleLabel.textContent = nextExpanded ? "Hide selected instrument(s)" : "Show selected instrument(s)";
    }
    if (selectedPanel) {
      selectedPanel.hidden = !nextExpanded;
    }
  });
  reviewToggle?.addEventListener("click", () => {
    const expanded = reviewToggle.getAttribute("aria-expanded") === "true";
    const nextExpanded = !expanded;
    const icon = reviewToggle.querySelector("img");
    reviewToggle.setAttribute("aria-expanded", String(nextExpanded));
    if (icon) {
      icon.src = `assets/icons/directions/chevron ${expanded ? "right" : "up"}/size=24px, style=mono.svg`;
    }
    if (reviewToggleLabel) {
      reviewToggleLabel.textContent = nextExpanded ? "Hide selected instrument(s)" : "Show selected instrument(s)";
    }
    if (reviewPanel) {
      reviewPanel.hidden = !nextExpanded;
    }
  });
  summaryToggle?.addEventListener("click", () => {
    const expanded = summaryToggle.getAttribute("aria-expanded") === "true";
    const nextExpanded = !expanded;
    const icon = summaryToggle.querySelector("img");
    summaryToggle.setAttribute("aria-expanded", String(nextExpanded));
    if (icon) {
      icon.src = `assets/icons/directions/chevron ${expanded ? "right" : "up"}/size=24px, style=mono.svg`;
    }
    if (summaryToggleLabel) {
      summaryToggleLabel.textContent = nextExpanded ? "Hide selected instrument(s)" : "Show selected instrument(s)";
    }
    if (summaryPanel) {
      summaryPanel.hidden = !nextExpanded;
    }
  });
  continueButton?.addEventListener("click", () => {
    if (currentStep === 1) {
      setStep(2);
      return;
    }
    if (currentStep === 2) {
      updateContactConfirmationNotice();
      setStep(3);
      return;
    }
    showSummary();
  });
  backButton?.addEventListener("click", () => setStep(Math.max(1, currentStep - 1)));
  setStep(1);
}

function renderEditSpc() {
  const template = document.querySelector("#edit-spc-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountTopbarSc();
  mountPlatformSidebar("edit-spc");
  mountFooter();
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
  { image: "tsq.png", serial: "TSQ-Z-12347", nickname: "TSQ-1", users: "4", group: "—", model: "MSTSQQUANTISPLUS", coverage: "Coverage expired", end: "29 Mar 2023", tickets: 2 },
  { image: "tsq.png", serial: "TSQ-Z-12348", nickname: "TSQ-2", users: "5", group: "—", model: "MSTSQQUANTISPLUS", coverage: "Under contract", end: "29 Mar 2025", tickets: 2 },
  { image: "tsq.png", serial: "TSQ-Z-12349", nickname: "TSQ-3", users: "2", group: "—", model: "MSTSQQUANTISPLUS", coverage: "Expiring soon", end: "29 Mar 2024", tickets: 0 },
  { image: "q-exactive.png", serial: "SN98355W", nickname: "QEXACTIVE_30", users: "4", group: "—", model: "QEXAC00001", coverage: "Under contract", end: "28 Apr 2025" },
  { image: "q-exactive.png", serial: "SN98356W", nickname: "QEXACTIVE_31", users: "2", group: "Global Research and Development", model: "QEXAC00001", coverage: "Under contract", end: "29 Mar 2025", locked: true },
  { image: "q-exactive.png", serial: "SN98358W", nickname: "QEXACTIVE_32", users: "4", group: "Department of Medical Affairs", model: "QEXAC00001", coverage: "Under contract", end: "29 Mar 2025", locked: true },
  { image: "q-exactive.png", serial: "SN98359W", nickname: "QEXACTIVE_33", users: "2", group: "Department of Medical Affairs", model: "QEXAC00001", coverage: "Under contract", end: "29 Mar 2025", locked: true },
  { image: "q-exactive.png", serial: "SN98360W", nickname: "—", users: "3", group: "—", model: "QEXAC00001", coverage: "Under contract", end: "28 Apr 2025", locked: true },
  { image: "q-exactive.png", serial: "SN98361W", nickname: "—", users: "3", group: "Global Research and Development", model: "QEXAC00001", coverage: "Under contract", end: "29 Mar 2025", locked: true },
  { image: "q-exactive.png", serial: "SN98362W", nickname: "—", users: "3", group: "Global Research and Development", model: "QEXAC00001", coverage: "Under contract", end: "29 Mar 2025", locked: true },
];

const LE_INSTRUMENTS = [
  { image: "le/tsx-40086.png", serial: "1115281234567121", nickname: "ULT Freezers", users: "3", group: "—", type: "ULT Freezers", model: "ULTXX000AV", coverage: "Under contract", end: "24 Dec 2026", tickets: 2 },
  { image: "le/tsx-40086.png", serial: "1115281234567127", nickname: "Freezer Room A", users: "2", group: "Global Research and Development", type: "ULT Freezers", model: "ULTXX000AV", coverage: "Under contract", end: "12 Mar 2027", tickets: 1, locked: true },
  { image: "le/tsx-40086.png", serial: "1115281234567134", nickname: "Vaccine Storage", users: "4", group: "—", type: "ULT Freezers", model: "ULTXX000AV", coverage: "Expiring soon", end: "29 Mar 2026", tickets: 0 },
  { image: "le/bios-16.png", serial: "BIOS16-847263", nickname: "Bioprocess Centrifuge", users: "3", group: "—", type: "Centrifuges", model: "BIOS16", coverage: "Under contract", end: "18 Jul 2027", tickets: 3 },
  { image: "le/bios-16.png", serial: "BIOS16-593814", nickname: "Centrifuge Lab 2", users: "2", group: "Clinical Operations", type: "Centrifuges", model: "BIOS16", coverage: "Coverage expired", end: "16 Nov 2025", tickets: 1 },
  { image: "le/bios-16.png", serial: "BIOS16-726405", nickname: "Harvest Centrifuge", users: "5", group: "—", type: "Centrifuges", model: "BIOS16", coverage: "Under contract", end: "22 Sep 2027", tickets: 2 },
  { image: "le/tsx-2330.png", serial: "TSX2330-481927", nickname: "Sample Freezer 01", users: "4", group: "—", type: "Lab Freezers", model: "TSX2330FA", coverage: "Under contract", end: "08 Jan 2027", tickets: 0 },
  { image: "le/tsx-2330.png", serial: "TSX2330-735186", nickname: "Research Freezer", users: "3", group: "Global Research and Development", type: "Lab Freezers", model: "TSX2330FA", coverage: "Expiring soon", end: "04 Apr 2026", tickets: 2 },
  { image: "le/tsx-2330.png", serial: "TSX2330-264809", nickname: "Archive Freezer", users: "2", group: "—", type: "Lab Freezers", model: "TSX2330FA", coverage: "Under contract", end: "30 Jun 2027", tickets: 1 },
  { image: "le/midi-co2-40l.png", serial: "MCO2-40L-638251", nickname: "Cell Culture 40L", users: "3", group: "—", type: "CO2 Incubators", model: "MIDI40", coverage: "Under contract", end: "15 May 2027", tickets: 1 },
  { image: "le/midi-co2-40l.png", serial: "MCO2-40L-914673", nickname: "Incubator Suite B", users: "4", group: "Clinical Operations", type: "CO2 Incubators", model: "MIDI40", coverage: "Under contract", end: "09 Aug 2027", tickets: 2, locked: true },
  { image: "le/midi-co2-40l.png", serial: "MCO2-40L-357824", nickname: "Culture Incubator", users: "2", group: "—", type: "CO2 Incubators", model: "MIDI40", coverage: "Coverage expired", end: "11 Oct 2025", tickets: 0 },
];

const MAIN_LE_INSTRUMENTS = [
  { image: "le/tsx-40086.png", serial: "1115281234567142", nickname: "ULT Freezer North", users: "3", group: "Global Research and Development", type: "ULT Freezers", model: "ULTXX000AV", coverage: "Under contract", end: "17 Feb 2027", tickets: 2 },
  { image: "le/bios-16.png", serial: "BIOS16-638490", nickname: "Bioprocess Suite", users: "4", group: "—", type: "Centrifuges", model: "BIOS16", coverage: "Under contract", end: "28 Jun 2027", tickets: 1 },
  { image: "le/tsx-2330.png", serial: "TSX2330-817304", nickname: "Clinical Freezer", users: "2", group: "Department of Medical Affairs", type: "Lab Freezers", model: "TSX2330FA", coverage: "Expiring soon", end: "14 Apr 2026", tickets: 0 },
  { image: "le/midi-co2-40l.png", serial: "MCO2-40L-482916", nickname: "Cell Culture Incubator", users: "3", group: "—", type: "CO2 Incubators", model: "MIDI40", coverage: "Under contract", end: "09 Sep 2027", tickets: 3 },
  { image: "le/tsx-40086.png", serial: "1115281234567158", nickname: "Long-term Storage", users: "5", group: "Safety Research Unit", type: "ULT Freezers", model: "ULTXX000AV", coverage: "Coverage expired", end: "19 Dec 2025", tickets: 1, locked: true },
];

const MAIN_INSTRUMENTS = [...MY_INSTRUMENTS, ...MAIN_LE_INSTRUMENTS];

function miCurrentInstruments() {
  if (isEuropeLePrototype()) return LE_INSTRUMENTS;
  return isMainPrototype() ? MAIN_INSTRUMENTS : MY_INSTRUMENTS;
}

const MI_USERS = [
  { email: "holly.hartman@company.com", instruments: [5, 6, 7] },
  { email: "sebastien.martin@company.com", instruments: [0, 4, 8, 11] },
  { email: "ines.mitchell@company.com", instruments: [1, 2, 9, 13, 14] },
  { email: "patty.jones@company.com", instruments: [3, 6, 10] },
  { email: "tamara.miller@company.com", instruments: [0, 2, 4, 8, 12, 14] },
].map((user) => ({ ...user, slug: user.email.split("@")[0].replaceAll(".", "-") }));

function isMiUserDetailRoute(route) {
  return /^user-detail-[a-z0-9-]+$/.test(route);
}

function isMiGroupDetailRoute(route) {
  return /^group-detail-\d+$/.test(route);
}

function isMiSystemDetailRoute(route) {
  return /^system-detail-[a-z0-9-]+$/.test(route);
}

function miInstrumentDetailRoute(serial) {
  return `instrument-detail-${serial}`;
}

function isMiInstrumentDetailRoute(route) {
  return /^instrument-detail-[A-Za-z0-9-]+$/.test(route);
}

const MI_OPTIONAL_COLUMNS = ["instrument-images", "nickname", "users", "groups", "type", "model", "coverage", "coverage-end", "added-date"];
const miVisibleColumns = new Set(MI_OPTIONAL_COLUMNS);
const SUPPORT_HISTORY_COLUMNS = [
  { key: "status", index: 1, label: "Status", width: 113, required: true },
  { key: "ticket", index: 2, label: "Ticket no.", width: 118, required: true },
  { key: "serial", index: 6, label: "Serial no.", width: 108, required: true },
  { key: "type", index: 3, label: "Ticket type", width: 120 },
  { key: "subject", index: 4, label: "Subject", width: 103 },
  { key: "model", index: 7, label: "Catalog no.", width: 118 },
  { key: "nickname", index: 8, label: "Nickname", width: 118 },
  { key: "groups", index: 9, label: "Groups", width: 113 },
  { key: "contact", index: 10, label: "Contact", width: 113 },
  { key: "created", index: 11, label: "Created date", width: 114 },
  { key: "closed", index: 12, label: "Closed date", width: 118 },
];
const SUPPORT_HISTORY_FIXED_COLUMNS = [
  { index: 0, width: 24 },
  { index: 5, width: 40 },
];
const supportHistoryVisibleColumns = new Set(SUPPORT_HISTORY_COLUMNS.map(({ key }) => key));
function instrumentRowMarkup(instrument) {
  const coverageClass = instrument.coverage === "Coverage expired" ? "mi-status--expired" : instrument.coverage === "Expiring soon" ? "mi-status--soon" : "";
  const instrumentRoute = miInstrumentDetailRoute(instrument.serial);
  return `<tr class="${instrument.pendingNew ? "is-new" : ""}" data-mi-row data-search="${instrument.serial} ${instrument.nickname} ${instrument.group} ${instrument.model}">
    <td><input type="checkbox" data-mi-checkbox aria-label="Select ${instrument.serial}" /></td>
    <td>${miFavoriteButton(instrument.serial, false, `instrument:${instrument.serial}`)}</td>
    <td></td>
    <td data-mi-table-column="instrument-images"><img class="mi-product" src="assets/instruments/${instrument.image}" alt="" /></td>
    <td data-mi-table-column="instrument-images">${miLockMarkup(instrument.locked)}</td>
    <td><button class="mi-link" type="button" data-route="${instrumentRoute}">${instrument.serial}</button></td>
    <td data-mi-table-column="nickname"><span class="mi-ellipsis">${instrument.nickname}</span></td>
    <td class="mi-users-cell" data-mi-table-column="users">${miUserCountMarkup(instrument.users, `instrument:${instrument.serial}`)}</td>
    <td data-mi-table-column="groups">${instrument.group === "—" ? '<span class="mi-ellipsis">—</span>' : `<button class="mi-link mi-ellipsis" type="button" data-mi-toast="Group opened">${instrument.group}</button>`}</td>
    <td data-mi-table-column="type"><span class="mi-ellipsis">${miInstrumentType(instrument)}</span></td>
    <td data-mi-table-column="model"><span class="mi-ellipsis">${instrument.model}</span></td>
    <td data-mi-table-column="coverage">${coverageClass ? `<span class="mi-status ${coverageClass}">${instrument.coverage}</span>` : instrument.coverage}</td>
    <td data-mi-table-column="coverage-end">${instrument.end}</td>
    <td data-mi-table-column="added-date">10 May 2022</td>
    <td>${miMoreButton(instrument.serial, "instrument", instrument.serial)}</td>
  </tr>`;
}

function miCreatedSystemRowsMarkup(system, expanded = true) {
  const key = `my-system-${system.id}`;
  const components = system.components.map((serial) => miCurrentInstruments().find((instrument) => instrument.serial === serial)).filter(Boolean);
  const searchable = components.map((instrument) => `${instrument.serial} ${instrument.nickname}`).join(" ");
  const parent = `<tr class="mi-system-row ${system.pendingNew ? "is-new" : ""}" data-mi-row data-search="System ${system.nickname} ${system.typeCode} ${searchable}">
    <td><input type="checkbox" data-mi-checkbox aria-label="Select ${system.nickname} system" /></td>
    <td>${miFavoriteButton(system.nickname, false, `system:${system.id}`)}</td>
    <td><button class="mi-row-chevron mi-system-toggle" type="button" data-mi-system-toggle="${key}" data-mi-system-label="${system.nickname}" aria-expanded="${expanded}" aria-label="${expanded ? "Collapse" : "Expand"} ${system.nickname} system components"><img src="assets/icons/directions/chevron down/size=16px, style=mono.svg" alt="" /></button></td>
    <td><img class="mi-system-mark" src="assets/icons/science/system/size=24px, style=mono.svg" alt="" /></td><td>${miLockMarkup(system.locked)}</td><td><button class="mi-link" type="button" data-route="system-detail-${system.id}">System</button></td><td>${system.nickname}</td><td class="mi-users-cell" data-mi-table-column="users">${miUserCountMarkup(miSystemUserCount(system), `system:${system.id}`)}</td><td>—</td><td>${system.typeCode}</td><td>—</td><td>—</td><td>—</td><td>17 Aug 2026</td><td>${miMoreButton(system.nickname, "system", system.id)}</td>
  </tr>`;
  const children = components.map((instrument, index) => `<tr class="mi-child-row ${index === components.length - 1 ? "mi-child-row--last" : ""} ${system.pendingNew ? "is-new" : ""}" data-mi-system-component="${key}" data-search="${instrument.serial} ${instrument.nickname} ${instrument.model}"${expanded ? "" : " hidden"}><td></td><td></td><td>${miBranchIcon}</td><td><img class="mi-product" src="assets/instruments/${instrument.image}" alt="" /></td><td></td><td><button class="mi-link" type="button" data-route="${miInstrumentDetailRoute(instrument.serial)}">${instrument.serial}</button></td><td>${instrument.nickname}</td><td class="mi-users-cell" data-mi-table-column="users"></td><td>${instrument.group}</td><td>${miInstrumentType(instrument)}</td><td>${instrument.model}</td><td>${instrument.coverage}</td><td>${instrument.end}</td><td>10 May 2022</td><td></td></tr>`).join("");
  return parent + children;
}

function miInstrumentType(instrument) {
  return instrument.type || (instrument.image.startsWith("vanquish") ? "HPLC" : "Mass Spec Life Science");
}

function miSystemUserCount(system) {
  return String(system.users ?? 3);
}

function miUserCountMarkup(count, accessKey = "") {
  return `<button class="mi-link mi-link--center mi-user-count" type="button" data-mi-user-count="${count}"${accessKey ? ` data-mi-user-access-key="${accessKey}"` : ""} data-mi-toast="Users opened">${count}</button>`;
}

const MI_TOOLTIP_USERS = [
  "my_name.lastname@company.com",
  "sebastien.martin@company.com",
  "holly.hartman@company.com",
  "ines.mitchell@company.com",
  "patty.jones@company.com",
];
let miUsersTooltip;
let miUsersTooltipTrigger;
let miUsersTooltipReposition;

function ensureMiUsersTooltip() {
  if (miUsersTooltip?.isConnected) return miUsersTooltip;
  miUsersTooltip = document.createElement("div");
  miUsersTooltip.className = "mi-users-tooltip";
  miUsersTooltip.id = "mi-users-count-tooltip";
  miUsersTooltip.setAttribute("role", "tooltip");
  miUsersTooltip.hidden = true;
  document.body.append(miUsersTooltip);
  return miUsersTooltip;
}

function positionMiUsersTooltip(trigger, tooltip) {
  const rect = trigger.getBoundingClientRect();
  const tooltipWidth = tooltip.offsetWidth;
  const viewportPadding = 8;
  const anchorCenter = rect.left + rect.width / 2;
  const left = Math.max(viewportPadding, Math.min(window.innerWidth - tooltipWidth - viewportPadding, anchorCenter - tooltipWidth / 2));
  const arrowLeft = Math.max(16, Math.min(tooltipWidth - 16, anchorCenter - left));
  tooltip.classList.remove("mi-users-tooltip--below");
  let top = rect.top - tooltip.offsetHeight - 8;
  if (top < viewportPadding) {
    tooltip.classList.add("mi-users-tooltip--below");
    top = rect.bottom + 8;
  }
  tooltip.style.left = `${Math.round(left)}px`;
  tooltip.style.top = `${Math.round(top)}px`;
  tooltip.style.setProperty("--mi-users-tooltip-arrow-left", `${Math.round(arrowLeft)}px`);
}

function showMiUsersTooltip(trigger) {
  hideMiUsersTooltip();
  const tooltip = ensureMiUsersTooltip();
  const requestedCount = Math.max(1, Number.parseInt(trigger.dataset.miUserCount, 10) || 1);
  const users = MI_TOOLTIP_USERS.slice(0, Math.min(requestedCount, MI_TOOLTIP_USERS.length));
  const accessTarget = miAccessTarget(trigger.dataset.miUserAccessKey);
  const restricted = Boolean(accessTarget?.locked);
  tooltip.innerHTML = `<strong>Current users</strong><div class="mi-users-tooltip__list">${users.map((user, index) => `<span><i>${(index === 0 ? miIsAdmin(accessTarget) : restricted && index === 1) ? '<img src="assets/icons/general/admin/size=16px, style=mono.svg" alt="Administrator" />' : ""}</i>${user}</span>`).join("")}</div>`;
  tooltip.hidden = false;
  miUsersTooltipTrigger = trigger;
  trigger.setAttribute("aria-describedby", tooltip.id);
  miUsersTooltipReposition = () => positionMiUsersTooltip(trigger, tooltip);
  positionMiUsersTooltip(trigger, tooltip);
  window.addEventListener("resize", miUsersTooltipReposition);
  window.addEventListener("scroll", miUsersTooltipReposition, true);
}

function hideMiUsersTooltip() {
  if (!miUsersTooltip) return;
  miUsersTooltip.hidden = true;
  miUsersTooltipTrigger?.removeAttribute("aria-describedby");
  miUsersTooltipTrigger = undefined;
  if (miUsersTooltipReposition) {
    window.removeEventListener("resize", miUsersTooltipReposition);
    window.removeEventListener("scroll", miUsersTooltipReposition, true);
    miUsersTooltipReposition = undefined;
  }
}

function wireMiUserCountTooltips(scope = app) {
  scope.querySelectorAll("[data-mi-user-count]").forEach((trigger) => {
    if (trigger.dataset.miUsersTooltipWired) return;
    trigger.dataset.miUsersTooltipWired = "true";
    trigger.addEventListener("mouseenter", () => showMiUsersTooltip(trigger));
    trigger.addEventListener("mouseleave", hideMiUsersTooltip);
    trigger.addEventListener("focus", () => showMiUsersTooltip(trigger));
    trigger.addEventListener("blur", hideMiUsersTooltip);
  });
}

function miSelectionRowMarkup(instrument, context) {
  const search = `${instrument.serial} ${instrument.nickname} ${instrument.model}`;
  if (context === "share") return `<tr data-mi-selection-row data-search="${search}"><td><input type="checkbox" aria-label="Select ${instrument.serial}" /></td><td>${instrument.serial}</td><td>${instrument.nickname}</td><td>${instrument.users}</td><td>${instrument.model}</td></tr>`;
  const coverageClass = instrument.coverage === "Coverage expired" ? "mi-status--expired" : instrument.coverage === "Expiring soon" ? "mi-status--soon" : "";
  return `<tr data-mi-selection-row data-search="${search} ${instrument.coverage}"><td><input type="checkbox" aria-label="Select ${instrument.serial}" /></td><td><img class="mi-dialog-product" src="assets/instruments/${instrument.image}" alt="" /></td><td>${instrument.serial}</td><td>${instrument.nickname}</td><td>${miInstrumentType(instrument)}</td><td>${instrument.model}</td><td>${coverageClass ? `<span class="mi-status ${coverageClass}">${instrument.coverage}</span>` : instrument.coverage}</td><td>${instrument.end}</td></tr>`;
}

function miCardGroupNames(memberKey, fallbackGroup = "—") {
  const names = MI_GROUPS.filter((group) => group.members?.includes(memberKey)).map((group) => group.name);
  if (fallbackGroup && fallbackGroup !== "—" && !names.includes(fallbackGroup)) names.push(fallbackGroup);
  return names;
}

function miCardGroupsMarkup(groups) {
  if (!groups.length) return "—";
  const firstGroup = MI_GROUPS.find((group) => group.name === groups[0]);
  const route = firstGroup ? ` data-route="group-detail-${firstGroup.id}"` : ' data-mi-toast="Group opened"';
  const additional = groups.length > 1 ? `<span class="mi-card-count">+${groups.length - 1}</span>` : "";
  return `<button type="button"${route}>${groups[0]}</button>${additional}`;
}

function miInstrumentTicketCount(instrument) {
  return Number(instrument.tickets ?? 0);
}

function miGridCardMarkup(instrument, { favoritable = true } = {}) {
  const coverageClass = instrument.coverage === "Coverage expired" ? "mi-status--expired" : instrument.coverage === "Expiring soon" ? "mi-status--soon" : "mi-status--contract";
  const instrumentRoute = miInstrumentDetailRoute(instrument.serial);
  const groups = miCardGroupNames(`instrument:${instrument.serial}`, instrument.group);
  const ticketCount = miInstrumentTicketCount(instrument);
  return `<article class="mi-instrument-card" data-mi-grid-card data-search="${instrument.serial} ${instrument.nickname} ${instrument.group} ${instrument.model}">
    <div class="mi-card-surface">
      <header class="mi-card-top mi-card-top--instrument">
        <div class="mi-card-icons">${favoritable ? miFavoriteButton(instrument.serial, false, `instrument:${instrument.serial}`) : ""}${favoritable ? miLockMarkup(instrument.locked) : ""}<button class="mi-card-users" type="button" data-mi-toast="Users opened" aria-label="${instrument.users} users"><img src="assets/icons/general/2 users/size=16px, style=mono.svg" alt="" /><span>${instrument.users}</span></button></div>
        <div class="mi-card-instrument-summary"><img src="assets/instruments/${instrument.image}" alt="" /><div><span>Serial no.</span><a class="mi-card-title" href="#${instrumentRoute}" data-route="${instrumentRoute}">${instrument.serial}</a><p>${miInstrumentType(instrument)}</p></div></div>
      </header>
      <dl class="mi-card-details mi-card-details--instrument"><div><dt>Nickname</dt><dd>${instrument.nickname}</dd></div><div><dt class="mi-card-catalog-label" title="Catalog no.">Catalog no.</dt><dd>${instrument.model}</dd></div><div><dt>Type</dt><dd>${miInstrumentType(instrument)}</dd></div><div><dt>Groups</dt><dd>${miCardGroupsMarkup(groups)}</dd></div><div><dt>Tickets</dt><dd><button type="button" data-mi-toast="Support tickets opened">${ticketCount} total support ticket${ticketCount === 1 ? "" : "s"}</button></dd></div></dl>
      <div class="mi-card-coverage"><span class="mi-status ${coverageClass}">${instrument.coverage}</span></div>
      <footer class="mi-card-footer mi-card-footer--instrument"><button class="mi-card-support" type="button" data-route="request-support"><img src="assets/icons/navigation/support/size=16px, style=bold.svg" alt="" />Request support</button><div><button class="mi-card-more" type="button" data-mi-action-menu-kind="instrument" data-mi-action-menu-id="${instrument.serial}" data-mi-action-menu-label="${instrument.serial}" aria-haspopup="menu" aria-expanded="false" aria-label="Actions for ${instrument.serial}"><img src="assets/icons/actions/more horizontal/size=24px, style=bold.svg" alt="" /></button></div></footer>
    </div>
  </article>`;
}

function miCreatedSystemCardMarkup(system) {
  const components = system.components.map((serial) => miCurrentInstruments().find((instrument) => instrument.serial === serial)).filter(Boolean);
  const searchable = components.map((instrument) => `${instrument.serial} ${instrument.nickname}`).join(" ");
  const groups = miCardGroupNames(`system:${system.id}`);
  const ticketCount = Number(system.tickets ?? (system.id === "alpine" ? 16 : 0));
  return `<article class="mi-instrument-card mi-system-card" data-mi-grid-card data-search="System ${system.nickname} ${system.typeCode} ${searchable}">
    <span class="mi-card-stack mi-card-stack--back" aria-hidden="true"></span><span class="mi-card-stack mi-card-stack--middle" aria-hidden="true"></span>
    <div class="mi-card-surface">
      <header class="mi-card-top"><span class="mi-card-badge">${system.typeCode}</span><div class="mi-card-icons">${miFavoriteButton(system.nickname, false, `system:${system.id}`)}${miLockMarkup(system.locked)}<button class="mi-card-users" type="button" data-mi-toast="Users opened" aria-label="${miSystemUserCount(system)} users"><img src="assets/icons/general/2 users/size=16px, style=mono.svg" alt="" /><span>${miSystemUserCount(system)}</span></button></div><button class="mi-card-title" type="button" data-route="system-detail-${system.id}">${system.nickname}</button></header>
      <dl class="mi-card-details"><div><dt>Components</dt><dd>${components.length} total components <img src="assets/icons/notifications/info/size=16px, style=bold.svg" alt="" /></dd></div><div><dt>Groups</dt><dd>${miCardGroupsMarkup(groups)}</dd></div><div><dt>Tickets</dt><dd><button type="button" data-mi-toast="Support tickets opened">${ticketCount} total support ticket${ticketCount === 1 ? "" : "s"}</button></dd></div></dl>
      <footer class="mi-card-footer"><span></span><div><button class="mi-card-expand" type="button" data-mi-system-quickview="${system.id}" aria-label="View all components in ${system.nickname}"><img src="assets/icons/tools/resize large/size=16px, style=bold.svg" alt="" /></button><i></i><button class="mi-card-more" type="button" data-mi-action-menu-kind="system" data-mi-action-menu-id="${system.id}" data-mi-action-menu-label="${system.nickname}" aria-haspopup="menu" aria-expanded="false" aria-label="Actions for ${system.nickname}"><img src="assets/icons/actions/more horizontal/size=24px, style=bold.svg" alt="" /></button></div></footer>
    </div>
  </article>`;
}

function openMiSystemQuickview(system) {
  const components = system.components.map((serial) => miCurrentInstruments().find((instrument) => instrument.serial === serial)).filter(Boolean);
  miSystemQuickviewDialog.querySelector("[data-mi-system-quickview-type]").textContent = system.typeCode;
  miSystemQuickviewDialog.querySelector("[data-mi-system-quickview-title]").textContent = system.nickname;
  miSystemQuickviewDialog.querySelector("[data-mi-system-quickview-grid]").innerHTML = components.map((instrument) => miGridCardMarkup(instrument, { favoritable: false })).join("");
  miSystemQuickviewDialog.querySelector("[data-mi-system-quickview-close]").onclick = () => miSystemQuickviewDialog.close();
  miSystemQuickviewDialog.onclick = (event) => {
    if (event.target !== miSystemQuickviewDialog) return;
    const rect = miSystemQuickviewDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) miSystemQuickviewDialog.close();
  };
  miSystemQuickviewDialog.querySelectorAll(".mi-card-title").forEach((link) => link.addEventListener("click", () => miSystemQuickviewDialog.close()));
  miSystemQuickviewDialog.querySelectorAll(".mi-favorite").forEach((button) => button.addEventListener("click", () => toggleMiFavorite(button)));
  miSystemQuickviewDialog.querySelectorAll("[data-mi-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.miToast)));
  wireRouteControls(miSystemQuickviewDialog);
  openMiDialog(miSystemQuickviewDialog);
}

function openMiDialog(dialog) {
  if (!dialog.open) dialog.showModal();
}

function wireMiDialogDismiss(dialog) {
  dialog.querySelectorAll("[data-mi-dialog-close]").forEach((button) => { button.onclick = () => dialog.close(); });
  dialog.onclick = (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  };
}

function wireMiSelectionDialog(dialog, context) {
  const rows = dialog.querySelector(`[data-mi-${context}-rows]`);
  rows.innerHTML = miCurrentInstruments().filter((instrument) => !MI_REMOVED_INSTRUMENTS.has(instrument.serial)).map((instrument) => miSelectionRowMarkup(instrument, context)).join("");
  const checkboxes = [...rows.querySelectorAll("input[type='checkbox']")];
  const confirm = dialog.querySelector(context === "share" ? "[data-mi-share-confirm]" : "[data-mi-coverage-next]");
  const email = dialog.querySelector("[data-mi-share-email]");
  const update = () => { confirm.disabled = !checkboxes.some((checkbox) => checkbox.checked) || (email ? email.value.trim() === "" : false); };
  checkboxes.forEach((checkbox) => { checkbox.onchange = update; });
  if (email) email.oninput = update;
  dialog.querySelector(`[data-mi-${context}-search]`).oninput = (event) => {
    const query = event.currentTarget.value.trim().toLowerCase();
    rows.querySelectorAll("[data-mi-selection-row]").forEach((row) => { row.hidden = query !== "" && !row.dataset.search.toLowerCase().includes(query); });
  };
  dialog.querySelector(`[data-mi-${context}-form]`).onsubmit = (event) => {
    event.preventDefault();
    if (confirm.disabled) return;
    dialog.close();
    showToast(context === "share" ? "Instrument access shared" : "Coverage quote request started");
  };
  wireMiDialogDismiss(dialog);
  update();
}

const MI_SYSTEM_TYPES = [
  ["LC", "Liquid Chromatography", "Includes: HPLC / UHPLC"],
  ["LCMS", "Liquid Chromatography / Mass Spectrometry", ""],
  ["GC", "Gas Chromatography", ""],
  ["GCMS", "Gas Chromatography / Mass Spectrometry", ""],
  ["IC", "Ion Chromatography", ""],
  ["ICMS", "Ion Chromatography / Mass Spectrometry", ""],
  ["IOMS", "Inorganic Mass Spectrometry", ""],
  ["TEA", "Trace Elemental Analysis", "Includes: ICP-MS, ICP-OES, AA"],
  ["Spectroscopy", "Includes: FT-IR, NIR, Raman, UV, UV/VIS", ""],
];

function miSystemTypeLabel([code, name, includes]) {
  return `<b>${code}</b> (${name})${includes ? ` (${includes})` : ""}`;
}

function miAvailableStandaloneInstruments() {
  const componentSerials = new Set(miCurrentSystems().flatMap((system) => system.components));
  return miCurrentInstruments().filter((instrument) => !componentSerials.has(instrument.serial) && !MI_REMOVED_INSTRUMENTS.has(instrument.serial));
}

function miBuilderInstrumentRow(instrument, value, context, extraCells = "") {
  return `<tr data-mi-builder-row data-search="${instrument.serial} ${instrument.nickname} ${instrument.model}"><td><input type="checkbox" value="${value}" data-mi-builder-choice aria-label="Select ${instrument.serial}" /></td>${extraCells}<td>${instrument.serial}</td><td>${instrument.nickname}</td><td>${miInstrumentType(instrument)}</td><td>${instrument.model}</td></tr>`;
}

let miEditingSystemId = null;

function resetMiSystemBuilder(system = null) {
  const form = miCreateSystemDialog.querySelector("[data-mi-system-form]");
  form.reset();
  miEditingSystemId = system?.id || null;
  const otherSystemComponents = new Set(miCurrentSystems().filter((candidate) => candidate.id !== system?.id).flatMap((candidate) => candidate.components));
  const available = system ? miCurrentInstruments().filter((instrument) => !otherSystemComponents.has(instrument.serial) && !MI_REMOVED_INSTRUMENTS.has(instrument.serial)) : miAvailableStandaloneInstruments();
  form.querySelector("[data-mi-system-rows]").innerHTML = available.map((instrument) => miBuilderInstrumentRow(instrument, instrument.serial, "system")).join("");
  form.querySelector("#mi-create-system-title").textContent = system ? "Edit system" : "Create a system";
  form.querySelector(".mi-builder__header p").textContent = system ? "Add or remove instrument components in this system. Changes will apply to all users." : "Create a system for your instruments that have several components and view them as one unit in the My Instruments tab. Systems are visible to all users.";
  form.querySelector("[data-mi-builder-close]").setAttribute("aria-label", system ? "Close edit system" : "Close create system");
  form.querySelector("[data-mi-system-submit]").textContent = system ? "Save changes" : "Create system";
  form.querySelector("[data-mi-system-name]").value = system?.nickname || "";
  form.querySelector("[data-mi-system-notes]").value = system?.notes || "";
  form.querySelector("[data-mi-system-type]").value = system?.typeCode || "";
  const currentType = system ? MI_SYSTEM_TYPES.find((type) => type[0] === system.typeCode) : null;
  form.querySelector("[data-mi-system-type-label]").innerHTML = currentType ? miSystemTypeLabel(currentType) : "Select system type";
  if (system) form.querySelectorAll("[data-mi-builder-choice]").forEach((checkbox) => { checkbox.checked = system.components.includes(checkbox.value); });
  form.querySelector("[data-mi-system-type-trigger]").setAttribute("aria-expanded", "false");
  form.querySelector("[data-mi-system-type-menu]").hidden = true;
  updateMiSystemBuilder();
}

function updateMiSystemBuilder() {
  const form = miCreateSystemDialog.querySelector("[data-mi-system-form]");
  const selected = [...form.querySelectorAll("[data-mi-builder-choice]:checked")];
  form.querySelector("[data-mi-system-name-count]").textContent = `${form.querySelector("[data-mi-system-name]").value.length} / 128`;
  form.querySelector("[data-mi-system-notes-count]").textContent = `${form.querySelector("[data-mi-system-notes]").value.length} / 150`;
  form.querySelector("[data-mi-system-summary]").hidden = selected.length === 0;
  form.querySelector("[data-mi-system-selected-count]").textContent = `${selected.length} instrument${selected.length === 1 ? "" : "s"} selected`;
  form.querySelector("[data-mi-system-select-all]").textContent = `Select all ${form.querySelectorAll("[data-mi-builder-choice]").length} instruments`;
  form.querySelector("[data-mi-system-submit]").disabled = form.querySelector("[data-mi-system-name]").value.trim() === "" || form.querySelector("[data-mi-system-type]").value === "" || selected.length < 2;
}

function resetMiGroupBuilder() {
  const form = miCreateGroupDialog.querySelector("[data-mi-group-form]");
  form.reset();
  const systemRows = miCurrentSystems().map((system) => {
    const key = `builder-system-${system.id}`;
    const parent = `<tr class="mi-builder-system-row" data-mi-builder-row data-search="System ${system.nickname} ${system.typeCode}"><td><input type="checkbox" value="system:${system.id}" data-mi-builder-choice aria-label="Select ${system.nickname} system" /></td><td><button class="mi-system-toggle" type="button" data-mi-builder-system-toggle="${key}" aria-expanded="true" aria-label="Collapse ${system.nickname} components">${miExpandIcon}</button></td><td>System</td><td>${system.nickname}</td><td>${system.typeCode}</td><td>—</td></tr>`;
    const children = system.components.map((serial) => miCurrentInstruments().find((instrument) => instrument.serial === serial)).filter((instrument) => instrument && !MI_REMOVED_INSTRUMENTS.has(instrument.serial)).map((instrument) => `<tr class="mi-builder-child-row" data-mi-builder-component="${key}" data-mi-builder-row data-search="${instrument.serial} ${instrument.nickname}"><td></td><td>${miBranchIcon}</td><td>${instrument.serial}</td><td>${instrument.nickname}</td><td>${miInstrumentType(instrument)}</td><td>${instrument.model}</td></tr>`).join("");
    return parent + children;
  }).join("");
  const instrumentRows = miAvailableStandaloneInstruments().map((instrument) => miBuilderInstrumentRow(instrument, `instrument:${instrument.serial}`, "group", "<td></td>")).join("");
  form.querySelector("[data-mi-group-rows]").innerHTML = systemRows + instrumentRows;
  updateMiGroupBuilder();
}

function updateMiGroupBuilder() {
  const form = miCreateGroupDialog.querySelector("[data-mi-group-form]");
  const selected = [...form.querySelectorAll("[data-mi-builder-choice]:checked")];
  form.querySelector("[data-mi-group-name-count]").textContent = `${form.querySelector("[data-mi-group-name]").value.length} / 128`;
  form.querySelector("[data-mi-group-description-count]").textContent = `${form.querySelector("[data-mi-group-description]").value.length} / 150`;
  form.querySelector("[data-mi-group-summary]").hidden = selected.length === 0;
  form.querySelector("[data-mi-group-selected-count]").textContent = `${selected.length} item${selected.length === 1 ? "" : "s"} selected`;
  form.querySelector("[data-mi-group-select-all]").textContent = `Select all ${form.querySelectorAll("[data-mi-builder-choice]").length} items`;
  form.querySelector("[data-mi-group-submit]").disabled = form.querySelector("[data-mi-group-name]").value.trim() === "";
}

function wireMiBuilderDialog(dialog, context) {
  const form = dialog.querySelector(`[data-mi-${context}-form]`);
  const update = context === "system" ? updateMiSystemBuilder : updateMiGroupBuilder;
  form.oninput = update;
  form.onchange = update;
  form.querySelectorAll("[data-mi-builder-close], [data-mi-builder-cancel]").forEach((button) => { button.onclick = () => dialog.close(); });
  dialog.onclick = (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  };
  form.querySelector(`[data-mi-${context}-search]`).oninput = (event) => {
    const query = event.currentTarget.value.trim().toLowerCase();
    form.querySelectorAll("[data-mi-builder-row]").forEach((row) => { row.hidden = query !== "" && !row.dataset.search.toLowerCase().includes(query); });
    update();
  };
  form.querySelector(`[data-mi-${context}-select-all]`).onclick = () => {
    form.querySelectorAll('[data-mi-builder-row]:not([hidden]) [data-mi-builder-choice]').forEach((checkbox) => { checkbox.checked = true; });
    update();
  };
  form.querySelector(`[data-mi-${context}-clear]`).onclick = () => {
    form.querySelectorAll("[data-mi-builder-choice]").forEach((checkbox) => { checkbox.checked = false; });
    update();
  };
}

function wireMiBuilderDialogs() {
  wireMiBuilderDialog(miCreateSystemDialog, "system");
  wireMiBuilderDialog(miCreateGroupDialog, "group");
  const typeMenu = miCreateSystemDialog.querySelector("[data-mi-system-type-menu]");
  typeMenu.innerHTML = MI_SYSTEM_TYPES.map((type) => `<button type="button" role="option" data-mi-system-type-option="${type[0]}">${miSystemTypeLabel(type)}</button>`).join("");
  miCreateSystemDialog.querySelector("[data-mi-system-type-trigger]").onclick = () => {
    const expanded = miCreateSystemDialog.querySelector("[data-mi-system-type-trigger]").getAttribute("aria-expanded") === "true";
    miCreateSystemDialog.querySelector("[data-mi-system-type-trigger]").setAttribute("aria-expanded", String(!expanded));
    typeMenu.hidden = expanded;
  };
  typeMenu.querySelectorAll("[data-mi-system-type-option]").forEach((option) => {
    option.onclick = () => {
      const type = MI_SYSTEM_TYPES.find((candidate) => candidate[0] === option.dataset.miSystemTypeOption);
      miCreateSystemDialog.querySelector("[data-mi-system-type]").value = type[0];
      miCreateSystemDialog.querySelector("[data-mi-system-type-label]").innerHTML = miSystemTypeLabel(type);
      miCreateSystemDialog.querySelector("[data-mi-system-type-trigger]").setAttribute("aria-expanded", "false");
      typeMenu.hidden = true;
      updateMiSystemBuilder();
    };
  });
  miCreateSystemDialog.querySelector("[data-mi-system-form]").onsubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.querySelector("[data-mi-system-submit]").disabled) return;
    const values = { nickname: form.querySelector("[data-mi-system-name]").value.trim(), notes: form.querySelector("[data-mi-system-notes]").value.trim(), typeCode: form.querySelector("[data-mi-system-type]").value, components: [...form.querySelectorAll("[data-mi-builder-choice]:checked")].map((checkbox) => checkbox.value) };
    values.components.forEach((serial) => miFavoritesStore().delete(`instrument:${serial}`));
    if (miEditingSystemId) Object.assign(miFindSystemById(miEditingSystemId), values);
    else MI_CREATED_SYSTEMS.push({ id: String(Date.now()), users: "3", locked: false, ...values });
    miCreateSystemDialog.close();
    const editedSystemId = miEditingSystemId;
    miEditingSystemId = null;
    setRoute(editedSystemId ? `system-detail-${editedSystemId}` : "my-instruments");
    showToast(editedSystemId ? "System updated" : "System created", { variant: "success" });
  };
  miCreateGroupDialog.querySelector("[data-mi-group-form]").onsubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.querySelector("[data-mi-group-submit]").disabled) return;
    const nextId = Math.max(...MI_GROUPS.map((group) => group.id)) + 1;
    const members = [...form.querySelectorAll("[data-mi-builder-choice]:checked")].map((checkbox) => checkbox.value);
    MI_GROUPS.unshift({ id: nextId, name: form.querySelector("[data-mi-group-name]").value.trim(), count: members.length, date: "17 Aug 2026", description: form.querySelector("[data-mi-group-description]").value.trim(), members });
    miCreateGroupDialog.close();
    setRoute("my-instruments");
    app.querySelector('[data-mi-tab="groups"]')?.click();
    showToast("Group created");
  };
  miCreateGroupDialog.querySelector("[data-mi-group-rows]").onclick = (event) => {
    const toggle = event.target.closest("[data-mi-builder-system-toggle]");
    if (!toggle) return;
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    toggle.querySelector("img").style.transform = expanded ? "rotate(-90deg)" : "";
    miCreateGroupDialog.querySelectorAll(`[data-mi-builder-component="${toggle.dataset.miBuilderSystemToggle}"]`).forEach((row) => { row.hidden = expanded; });
  };
}

function miBulkAccessAssets(mode) {
  const systems = miCurrentSystems();
  const componentSerials = new Set(systems.flatMap((system) => system.components));
  const matchesMode = (asset) => mode === "restrict" ? !asset.locked : miIsAdmin(asset);
  return [
    ...systems.filter(matchesMode).map((system) => ({ kind: "system", key: `system:${system.id}`, target: system })),
    ...miCurrentInstruments().filter((instrument) => !componentSerials.has(instrument.serial) && !MI_REMOVED_INSTRUMENTS.has(instrument.serial) && matchesMode(instrument)).map((instrument) => ({ kind: "instrument", key: `instrument:${instrument.serial}`, target: instrument })),
  ];
}

function miBulkAccessRowsMarkup(assets) {
  return assets.map(({ kind, key, target }) => {
    if (kind === "instrument") {
      const search = `${target.serial} ${target.nickname} ${target.model}`;
      return `<tr data-mi-bulk-row data-search="${search}"><td><input type="checkbox" value="${key}" data-mi-bulk-choice aria-label="Select ${target.serial}" /></td><td></td><td>${target.serial}</td><td>${target.nickname}</td><td class="mi-bulk-users">${target.users}</td><td>${target.model}</td></tr>`;
    }
    const rowKey = `bulk-system-${target.id}`;
    const components = target.components.map((serial) => miCurrentInstruments().find((instrument) => instrument.serial === serial)).filter(Boolean);
    const componentSearch = components.map((instrument) => `${instrument.serial} ${instrument.nickname} ${instrument.model}`).join(" ");
    const parent = `<tr class="mi-bulk-system-row" data-mi-bulk-row data-mi-bulk-parent="${rowKey}" data-search="System ${target.nickname} ${target.typeCode} ${componentSearch}"><td><input type="checkbox" value="${key}" data-mi-bulk-choice aria-label="Select ${target.nickname} system" /></td><td><button class="mi-system-toggle" type="button" data-mi-bulk-system-toggle="${rowKey}" aria-expanded="true" aria-label="Collapse ${target.nickname} components">${miExpandIcon}</button></td><td>System</td><td>${target.nickname}</td><td class="mi-bulk-users">${miSystemUserCount(target)}</td><td>—</td></tr>`;
    const children = components.map((instrument) => `<tr class="mi-bulk-child-row" data-mi-bulk-component="${rowKey}" data-search="${instrument.serial} ${instrument.nickname} ${instrument.model}"><td></td><td>${miBranchIcon}</td><td>${instrument.serial}</td><td>${instrument.nickname}</td><td></td><td>${instrument.model}</td></tr>`).join("");
    return parent + children;
  }).join("");
}

function openMiBulkAccessDialog(mode) {
  const assets = miBulkAccessAssets(mode);
  const rows = miBulkAccessDialog.querySelector("[data-mi-bulk-access-rows]");
  const search = miBulkAccessDialog.querySelector("[data-mi-bulk-access-search]");
  const selectAll = miBulkAccessDialog.querySelector("[data-mi-bulk-access-select-all]");
  const confirm = miBulkAccessDialog.querySelector("[data-mi-bulk-access-confirm]");
  const isRestrict = mode === "restrict";
  miBulkAccessDialog.dataset.mode = mode;
  miBulkAccessDialog.querySelector("[data-mi-bulk-access-title]").textContent = isRestrict ? "Restrict instrument access" : "Remove myself as Admin";
  miBulkAccessDialog.querySelector("[data-mi-bulk-access-description]").textContent = isRestrict
    ? "Select the instruments for which you'd like to control access. When any user attempts to add the selected instruments, a request will be sent to you for your approval."
    : "You will become a User of the selected instrument(s).";
  rows.innerHTML = miBulkAccessRowsMarkup(assets);
  search.value = "";
  selectAll.textContent = `Select all ${assets.length} instrument${assets.length === 1 ? "" : "s"}`;
  selectAll.disabled = assets.length === 0;
  confirm.disabled = true;

  const update = () => { confirm.disabled = !rows.querySelector("[data-mi-bulk-choice]:checked"); };
  rows.querySelectorAll("[data-mi-bulk-choice]").forEach((checkbox) => { checkbox.onchange = update; });
  rows.querySelectorAll("[data-mi-bulk-system-toggle]").forEach((toggle) => {
    toggle.onclick = () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.querySelector("img").style.transform = expanded ? "rotate(-90deg)" : "";
      rows.querySelectorAll(`[data-mi-bulk-component="${toggle.dataset.miBulkSystemToggle}"]`).forEach((row) => { row.hidden = expanded; });
    };
  });
  search.oninput = () => {
    const query = search.value.trim().toLowerCase();
    rows.querySelectorAll("[data-mi-bulk-row]").forEach((row) => {
      const systemKey = row.dataset.miBulkParent;
      const children = systemKey ? [...rows.querySelectorAll(`[data-mi-bulk-component="${systemKey}"]`)] : [];
      const parentMatches = row.dataset.search.toLowerCase().includes(query);
      const childMatches = children.some((child) => child.dataset.search.toLowerCase().includes(query));
      row.hidden = query !== "" && !parentMatches && !childMatches;
      children.forEach((child) => {
        const expanded = row.querySelector("[data-mi-bulk-system-toggle]")?.getAttribute("aria-expanded") === "true";
        child.hidden = !expanded || (query !== "" && !parentMatches && !child.dataset.search.toLowerCase().includes(query));
      });
    });
  };
  miAccessDialog.close();
  openMiDialog(miBulkAccessDialog);
}

function wireMiBulkAccessDialog() {
  wireMiDialogDismiss(miBulkAccessDialog);
  miBulkAccessDialog.querySelector("[data-mi-bulk-access-back]").onclick = () => { miBulkAccessDialog.close(); openMiDialog(miAccessDialog); };
  miBulkAccessDialog.querySelector("[data-mi-bulk-access-select-all]").onclick = () => {
    miBulkAccessDialog.querySelectorAll("[data-mi-bulk-row]:not([hidden]) [data-mi-bulk-choice]").forEach((checkbox) => { checkbox.checked = true; });
    miBulkAccessDialog.querySelector("[data-mi-bulk-access-confirm]").disabled = !miBulkAccessDialog.querySelector("[data-mi-bulk-choice]:checked");
  };
  miBulkAccessDialog.querySelector("[data-mi-bulk-access-form]").onsubmit = (event) => {
    event.preventDefault();
    const selected = [...miBulkAccessDialog.querySelectorAll("[data-mi-bulk-choice]:checked")];
    if (selected.length === 0) return;
    const restricted = miBulkAccessDialog.dataset.mode === "restrict";
    selected.forEach((checkbox) => {
      const target = miAccessTarget(checkbox.value);
      if (!target) return;
      if (restricted) {
        target.locked = true;
        target.admin = true;
      } else target.admin = false;
    });
    miBulkAccessDialog.close();
    render();
    showToast(restricted ? `Access restricted for ${selected.length} item${selected.length === 1 ? "" : "s"}` : `Admin role removed for ${selected.length} item${selected.length === 1 ? "" : "s"}`, { variant: "success" });
  };
}

function wireMyInstrumentActions() {
  wireMiDialogDismiss(miCreateDialog);
  wireMiDialogDismiss(miAccessDialog);
  wireMiBulkAccessDialog();
  wireMiSelectionDialog(miShareDialog, "share");
  wireMiSelectionDialog(miCoverageDialog, "coverage");

  const createButton = app.querySelector("[data-mi-create]");
  if (createButton) createButton.onclick = () => openMiDialog(miCreateDialog);
  const createGroupButton = app.querySelector("[data-mi-create-group-le]");
  if (createGroupButton) createGroupButton.onclick = () => { resetMiGroupBuilder(); openMiDialog(miCreateGroupDialog); };
  app.querySelector("[data-mi-share]").onclick = () => openMiDialog(miShareDialog);
  app.querySelector("[data-mi-access]").onclick = () => openMiDialog(miAccessDialog);
  app.querySelector("[data-mi-coverage]").onclick = () => openMiDialog(miCoverageDialog);
  wireMiBuilderDialogs();
  miCreateDialog.querySelector("[data-mi-create-system]").onclick = () => { miCreateDialog.close(); resetMiSystemBuilder(); openMiDialog(miCreateSystemDialog); };
  miCreateDialog.querySelector("[data-mi-create-group]").onclick = () => { miCreateDialog.close(); resetMiGroupBuilder(); openMiDialog(miCreateGroupDialog); };
  miAccessDialog.querySelector("[data-mi-access-share]").onclick = () => { miAccessDialog.close(); openMiDialog(miShareDialog); };
  miAccessDialog.querySelector("[data-mi-access-users]").onclick = () => { miAccessDialog.close(); app.querySelector('[data-mi-tab="users"]')?.click(); };
  miAccessDialog.querySelector("[data-mi-restrict-access]").onclick = () => openMiBulkAccessDialog("restrict");
  miAccessDialog.querySelector("[data-mi-stop-admin]").onclick = () => openMiBulkAccessDialog("admin");
  miShareDialog.querySelector("[data-mi-share-access]").onclick = () => { miShareDialog.close(); openMiDialog(miAccessDialog); };
  miShareDialog.querySelector("[data-mi-share-select-all]").onclick = () => {
    miShareDialog.querySelectorAll("[data-mi-share-rows] input[type='checkbox']").forEach((checkbox) => { checkbox.checked = true; checkbox.dispatchEvent(new Event("change")); });
  };
  miCoverageDialog.querySelector("[data-mi-coverage-dismiss]").onclick = () => { miCoverageDialog.close(); showToast("Coverage alert dismissed"); };
}

const MI_GROUPS = [
  ["HPLC 804 Sys.", 4, "10 May 2022"], ["LCMS Laboratory", 17, "6 Jan 2022"], ["Precision Medicine Research Unit", 9, "19 Feb 2022"], ["Biotherapeutics Discovery Research Unit", 11, "4 Mar 2022"],
  ["Safety Research Unit", 17, "10 May 2022"], ["Rare Disease Research Unit (RDRU)", 9, "6 Jan 2022"], ["Immunology and Autoimmunity", 32, "19 Feb 2022"], ["Global Research and Development", 32, "4 Mar 2022"],
  ["Dynamics and Metabolism Department", 20, "10 May 2022"], ["Department of Medical Affairs", 4, "6 Jan 2022"], ["Safety Research Unit", 20, "19 Feb 2022"], ["Dynamics and Metabolism Department", 33, "4 Mar 2022"],
  ["Safety Research Unit", 43, "10 May 2022"], ["Dynamics and Metabolism Department", 22, "6 Jan 2022"], ["Immunology and Autoimmunity", 94, "19 Feb 2022"], ["Molecule Therapeutics Discovery Unit", 42, "4 Mar 2022"],
  ["Dynamics and Metabolism Department", 14, "10 May 2022"], ["Department of Medical Affairs", 54, "6 Jan 2022"], ["Precision Medicine Research Unit", 51, "19 Feb 2022"], ["Rare Disease Research Unit (RDRU)", 13, "4 Mar 2022"],
].map(([name, count, date], id) => ({ id, name, count, date }));
MI_GROUPS[0].members = ["system:alpine", "instrument:TSQ-Z-12347", "instrument:SN98355W", "instrument:SN98356W"];
const MI_REFERENCE_SYSTEMS = [{ id: "alpine", nickname: "Alpine", notes: "", typeCode: "LCMS", users: "3", tickets: 16, locked: true, components: ["1009996", "1009999", "1009998", "1009997", "TSQ-Z-12346"] }];
const MI_MAIN_SYSTEMS = [
  { id: "borealis-lab", nickname: "Borealis Lab", notes: "Main analytical system", typeCode: "LCMS", users: "4", tickets: 7, locked: false, components: ["SN98355W", "SN98356W"] },
  { id: "cobalt-array", nickname: "Cobalt Array", notes: "Shared research system", typeCode: "MS", users: "3", tickets: 5, locked: true, components: ["SN98358W", "SN98359W", "SN98360W"] },
];
const MI_CREATED_SYSTEMS = [];
const MI_REMOVED_INSTRUMENTS = new Set();
const MI_FAVORITES = new Set(["system:alpine", "instrument:TSQ-Z-12347", "instrument:TSQ-Z-12348", "instrument:TSQ-Z-12349", "group:0", "group:1", "group:2", "group:9"]);
const MI_EUROPE_LE_FAVORITES = new Set([
  "instrument:1115281234567121",
  "instrument:BIOS16-847263",
  "instrument:TSX2330-481927",
  "instrument:MCO2-40L-638251",
  "group:10",
  "group:11",
  "group:12",
]);
function miFavoritesStore() {
  return isEuropeLePrototype() ? MI_EUROPE_LE_FAVORITES : MI_FAVORITES;
}
const MI_CURRENT_USER_EMAIL = "my_name.lastname@company.com";
const MI_USER_ROLES = new Map();
let miFavoritesView = "list";
let miGroupsView = "list";

function miCurrentSystems() {
  if (isEuropeLePrototype()) return [];
  return [...MI_REFERENCE_SYSTEMS, ...(isMainCmdExperience() ? MI_MAIN_SYSTEMS : []), ...MI_CREATED_SYSTEMS];
}

function miFindSystemById(id) {
  return miCurrentSystems().find((system) => system.id === id);
}

function miAccessTarget(accessKey) {
  const [kind, id] = String(accessKey || "").split(":");
  return kind === "system" ? miFindSystemById(id) : kind === "instrument" ? miCurrentInstruments().find((instrument) => instrument.serial === id) : undefined;
}

function miIsAdmin(target) {
  return target?.admin ?? Boolean(target?.locked);
}

function miRoleForAsset(accessKey, email, target = miAccessTarget(accessKey)) {
  if (!target?.locked) return "User";
  if (email === MI_CURRENT_USER_EMAIL) return miIsAdmin(target) ? "Admin" : "User";
  return MI_USER_ROLES.get(`${accessKey}|${email}`) || (email === "sebastien.martin@company.com" ? "Admin" : "User");
}

function miSetRoleForAsset(accessKey, email, role) {
  const target = miAccessTarget(accessKey);
  if (!target || !miIsAdmin(target)) return false;
  if (role === "Admin") target.locked = true;
  if (email === MI_CURRENT_USER_EMAIL) target.admin = role === "Admin";
  else MI_USER_ROLES.set(`${accessKey}|${email}`, role);
  return true;
}

function miLockMarkup(restricted, size = 16) {
  return restricted ? `<img class="mi-lock" src="assets/icons/actions/lock closed/size=${size}px, style=mono.svg" alt="Access controlled" />` : "";
}

function miRoleBadge(isAdmin, { accessKey = "", email = "", editable = false } = {}) {
  const role = isAdmin ? "Admin" : "User";
  if (!editable) return `<span class="mi-user-role${isAdmin ? " mi-user-role--admin" : ""}"><span>${role}</span></span>`;
  return `<button class="mi-user-role mi-user-role--editable${isAdmin ? " mi-user-role--admin" : ""}" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Change ${email} role, currently ${role}" data-mi-role-badge data-mi-role-access-key="${accessKey}" data-mi-role-email="${email}"><img src="assets/icons/directions/caret down/Down caret.svg" alt="" /><span>${role}</span></button>`;
}

let miRoleMenu;
let miRoleMenuTrigger;

function closeMiRoleMenu({ restoreFocus = false } = {}) {
  if (!miRoleMenu) return;
  const trigger = miRoleMenuTrigger;
  trigger?.setAttribute("aria-expanded", "false");
  miRoleMenu.remove();
  miRoleMenu = undefined;
  miRoleMenuTrigger = undefined;
  if (restoreFocus) trigger?.focus();
}

function positionMiRoleMenu(trigger, menu) {
  const rect = trigger.getBoundingClientRect();
  const width = 136;
  const left = Math.max(8, Math.min(window.innerWidth - width - 8, rect.left));
  menu.style.left = `${Math.round(left)}px`;
  menu.style.top = `${Math.round(rect.bottom + 4)}px`;
}

function openMiRoleMenu(trigger, onRoleChange) {
  closeMiRoleMenu();
  const accessKey = trigger.dataset.miRoleAccessKey;
  const email = trigger.dataset.miRoleEmail;
  const currentRole = miRoleForAsset(accessKey, email);
  const menu = document.createElement("div");
  menu.className = "mi-role-menu";
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-label", `Choose role for ${email}`);
  menu.innerHTML = ["User", "Admin"].map((role) => `<button type="button" role="menuitemradio" aria-checked="${role === currentRole}" data-mi-role-option="${role}"><span>${role}</span>${role === currentRole ? '<img src="assets/icons/actions/checkmark/size=16px, style=bold.svg" alt="Selected" />' : ""}</button>`).join("");
  document.body.append(menu);
  miRoleMenu = menu;
  miRoleMenuTrigger = trigger;
  trigger.setAttribute("aria-expanded", "true");
  positionMiRoleMenu(trigger, menu);
  menu.querySelectorAll("[data-mi-role-option]").forEach((option) => option.addEventListener("click", () => {
    const role = option.dataset.miRoleOption;
    if (!miSetRoleForAsset(accessKey, email, role)) return;
    closeMiRoleMenu();
    onRoleChange?.(role, email);
    showToast(`${email} is now ${role === "Admin" ? "an Admin" : "a User"}`, { variant: "success" });
  }));
  menu.addEventListener("keydown", (event) => {
    const options = [...menu.querySelectorAll("[data-mi-role-option]")];
    const index = options.indexOf(document.activeElement);
    if (event.key === "Escape") { closeMiRoleMenu({ restoreFocus: true }); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      options[(index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length].focus();
    }
  });
  menu.querySelector("[aria-checked='true']")?.focus();
}

function wireMiRoleSelectors(scope, onRoleChange) {
  scope.querySelectorAll("[data-mi-role-badge]").forEach((badge) => badge.addEventListener("click", (event) => {
    event.stopPropagation();
    if (miRoleMenuTrigger === badge) closeMiRoleMenu({ restoreFocus: true });
    else openMiRoleMenu(badge, onRoleChange);
  }));
}

document.addEventListener("click", (event) => {
  if (miRoleMenu && !event.target.closest(".mi-role-menu") && !event.target.closest("[data-mi-role-badge]")) closeMiRoleMenu();
});
window.addEventListener("resize", () => { if (miRoleMenu && miRoleMenuTrigger) positionMiRoleMenu(miRoleMenuTrigger, miRoleMenu); });
window.addEventListener("scroll", () => { if (miRoleMenu && miRoleMenuTrigger) positionMiRoleMenu(miRoleMenuTrigger, miRoleMenu); }, true);

function miRemoveSystem(system, removeComponents) {
  [MI_CREATED_SYSTEMS, MI_REFERENCE_SYSTEMS, MI_MAIN_SYSTEMS].forEach((systems) => {
    const index = systems.findIndex((candidate) => candidate.id === system.id);
    if (index !== -1) systems.splice(index, 1);
  });
  MI_GROUPS.forEach((group) => {
    if (!group.members) return;
    group.members = group.members.filter((member) => member !== `system:${system.id}`);
    group.count = group.members.length;
  });
  miFavoritesStore().delete(`system:${system.id}`);
  if (removeComponents) system.components.forEach((serial) => {
    MI_REMOVED_INSTRUMENTS.add(serial);
    miFavoritesStore().delete(`instrument:${serial}`);
  });
}

const MI_SUGGESTION_COMPONENT_BLUEPRINTS = [
  ["Detector", "VQF0000DET", "HPLC", "vanquish-detector.png"],
  ["Column", "VQH0000VEN", "HPLC", "vanquish-column.png"],
  ["Sampler", "VQF00SAMPL", "HPLC", "vanquish-sampler.png"],
  ["Pump", "VQF000PUMP", "HPLC", "vanquish-pump.png"],
  ["Quantis", "MSTSQQUANTISPLUS", "Mass Spec Life Science", "tsq.png"],
];

function miSuggestionComponents(prefix, systemName) {
  return MI_SUGGESTION_COMPONENT_BLUEPRINTS.map(([name, model, type, image], index) => ({ serial: `${prefix}-${String(41027 + index * 9713).padStart(5, "0")}`, nickname: `${systemName} ${name}`, model, type, image }));
}

const MI_SUGGESTION_SUPPORT_ITEMS = [
  { id: "support-horizon", kind: "system", systemId: "support-horizon-array", serial: "System", nickname: "Horizon Array", model: "—", type: "LCMS", image: "system", expanded: true, components: miSuggestionComponents("HRA", "Horizon") },
  ...["Aster Detector", "Beacon Column", "Cobalt Sampler", "Drift Pump", "Equinox LC", "Flare Quant", "Glacier Analyzer", "Harbor MS", "Indigo LC", "Juniper Pump", "Keystone Quant", "Lagoon Detector", "Mosaic Column", "Nucleus Sampler", "Opal LC", "Prairie Quant", "Quartz Analyzer", "Ridge MS"].map((nickname, index) => ({
    id: `support-${index + 1}`,
    kind: "instrument",
    serial: `SUP-${String(74021 + index * 613).padStart(5, "0")}`,
    nickname: index % 3 === 1 ? "" : nickname,
    model: index % 4 === 0 ? "VQF0000DET" : index % 4 === 1 ? "VQH0000VEN" : index % 4 === 2 ? "MSTSQQUANTISPLUS" : "QEXAC00001",
    type: index % 4 < 2 ? "HPLC" : "Mass Spec Life Science",
    image: index % 4 === 0 ? "vanquish-detector.png" : index % 4 === 1 ? "vanquish-column.png" : index % 4 === 2 ? "tsq.png" : "q-exactive.png",
  })),
];

const MI_SUGGESTION_RELATED_ITEMS = ["Celestial Flow", "Delta Arc", "Evergreen LC", "Fusion Peak", "Gemini Stream", "Helios Array"].map((nickname, index) => ({
  id: `related-${index + 1}`,
  kind: "system",
  systemId: `related-${nickname.toLowerCase().replaceAll(" ", "-")}`,
  serial: "System",
  nickname,
  model: "—",
  type: "LCMS",
  image: "system",
  users: String(2 + (index % 3)),
  created: `${10 + index} Jun 2026`,
  expanded: index < 2,
  components: miSuggestionComponents(`REL${index + 1}`, nickname.split(" ")[0]),
}));

const MI_SUGGESTION_INVITE_ITEMS = [
  { id: "invite-zenith", kind: "system", systemId: "invite-zenith-suite", serial: "System", nickname: "Zenith Suite", model: "—", type: "LCMS", image: "system", users: "2", expanded: true, components: miSuggestionComponents("ZNS", "Zenith") },
  ...["Apex Detector", "Boreal Column", "Cirrus Sampler", "Dawn Pump", "Eclipse LC", "Fjord Quant", "Garnet Analyzer", "Halo MS", "Iris LC", "Jade Pump", "Kinetic Quant", "Lotus Detector", "Meteor Column", "Nimbus Sampler", "Orbit LC", "Pulse Quant"].map((nickname, index) => ({
    id: `invite-${index + 1}`,
    kind: "instrument",
    serial: `INV-${String(52031 + index * 787).padStart(5, "0")}`,
    nickname: index % 4 === 0 ? "" : nickname,
    model: index % 4 === 0 ? "VQF0000DET" : index % 4 === 1 ? "VQH0000VEN" : index % 4 === 2 ? "MSTSQQUANTISPLUS" : "QEXAC00001",
    type: index % 4 < 2 ? "HPLC" : "Mass Spec Life Science",
    image: index % 4 === 0 ? "vanquish-detector.png" : index % 4 === 1 ? "vanquish-column.png" : index % 4 === 2 ? "tsq.png" : "q-exactive.png",
    users: "2",
  })),
];

const miSortIcon = '<img class="mi-sort" src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" />';
const miExpandIcon = '<span class="mi-row-chevron" aria-hidden="true"><img src="assets/icons/directions/chevron down/size=16px, style=mono.svg" alt="" /></span>';
const miBranchIcon = '<span class="mi-branch" aria-hidden="true"><img src="assets/icons/general/arrow/size=16px.svg" alt="" /></span>';
const miAddIcon = '<img class="mi-add-button__icon" src="assets/icons/actions/plus/size=16px, style=mono.svg" alt="" />';
const miPreviousIcon = '<img src="assets/icons/directions/chevron left/size=16px, style=mono.svg" alt="" />';
const miNextIcon = '<img src="assets/icons/directions/chevron right/size=16px, style=mono.svg" alt="" />';
const miSearchMarkup = (placeholder) => `<label class="mi-secondary-search"><span class="sr-only">${placeholder}</span><input type="search" data-mi-secondary-search placeholder="${placeholder}" /><img src="assets/icons/actions/search/size=16px, style=mono.svg" alt="" /></label>`;
const miViewToggleMarkup = (selectedView = "list") => `<div class="mi-view-toggle" aria-label="View"><button class="${selectedView === "grid" ? "is-selected" : ""}" type="button" data-mi-view="grid" aria-label="Grid view" aria-pressed="${selectedView === "grid"}"><img src="assets/icons/navigation/grid view/size=24px, style=mono.svg" alt="" /></button><button class="${selectedView === "list" ? "is-selected" : ""}" type="button" data-mi-view="list" aria-label="List view" aria-pressed="${selectedView === "list"}"><img src="assets/icons/text/list bulleted/size=24px, style=mono.svg" alt="" /></button></div>`;
const miTitleMarkup = (title, count, description, action = "") => `<div class="mi-secondary-heading"><div><h2>${title} <span>${count}</span></h2><p>${description}</p></div>${action}</div>`;
const miMoreButton = (label, kind = "", id = "") => `<button class="mi-more" type="button" ${kind ? `data-mi-action-menu-kind="${kind}" data-mi-action-menu-id="${id}" data-mi-action-menu-label="${label}" aria-haspopup="menu" aria-expanded="false"` : `data-mi-toast="${label} actions opened"`} aria-label="Actions for ${label}"><img src="assets/icons/actions/more horizontal/size=16px, style=bold.svg" alt="" /></button>`;

const MI_ACTION_MENU_ICONS = {
  details: "assets/icons/science/notepad/Size=24px, Style=Mono.svg",
  request: "assets/icons/navigation/support/size=24px, style=mono.svg",
  system: "assets/icons/science/new instrument/Size=24px, style=mono, type=system.svg",
  edit: "assets/icons/actions/edit alt/Size=24px, Style=Mono.svg",
  group: "assets/icons/science/2 instruments/size=24px, style=mono.svg",
  share: "assets/icons/actions/share/Size=24px, Style=Mono.svg",
  cart: "assets/icons/commerce/cart/Size=24px, Style=Mono.svg",
  restrict: "assets/icons/actions/lock closed/size=24px, style=mono.svg",
  unrestrict: "assets/icons/actions/lock open/size=24px, style=mono.svg",
  remove: "assets/icons/actions/bin/size=24px, style=mono.svg",
  dismantle: "assets/icons/science/system dismantle/size=24px, style=mono.svg",
};

let miActionPopover;
let miActionPopoverTrigger;
let miActionPopoverReposition;

function miActionMenuItem(action, label, icon, description = "") {
  return `<button class="mi-action-popover__item${description ? " mi-action-popover__item--described" : ""}" type="button" role="menuitem" data-mi-popover-action="${action}"><span class="mi-action-popover__icon"><img src="${icon}" alt="" /></span><span class="mi-action-popover__copy"><span>${label}</span>${description ? `<small>${description}</small>` : ""}</span></button>`;
}

function miInstrumentDetailActionPopoverMarkup(id) {
  const target = miCurrentInstruments().find((instrument) => instrument.serial === id);
  if (!target) return "";
  const restricted = Boolean(target.locked);
  const canManage = !restricted || miIsAdmin(target);
  const favoriteKey = `instrument:${id}`;
  const shareItem = canManage ? miActionMenuItem("share", "Share", MI_ACTION_MENU_ICONS.share) : "";
  const accessItem = canManage ? miActionMenuItem(restricted ? "unrestrict" : "restrict", restricted ? "Unrestrict access" : "Restrict access", restricted ? MI_ACTION_MENU_ICONS.unrestrict : MI_ACTION_MENU_ICONS.restrict) : "";
  return `${miActionMenuItem("add-group", "Add to group", MI_ACTION_MENU_ICONS.group)}${shareItem}${miActionMenuItem("favorite", miIsFavorite(favoriteKey) ? "Remove favorite" : "Favorite", miFavoriteIcon(miIsFavorite(favoriteKey), 24))}${accessItem}<div class="mi-action-popover__divider" role="separator"></div>${miActionMenuItem("remove-instrument", "Remove from account", MI_ACTION_MENU_ICONS.remove)}`;
}

function miActionPopoverMarkup(kind, id, context = "") {
  if (context === "detail" && kind === "instrument") return miInstrumentDetailActionPopoverMarkup(id);
  const isSystem = kind === "system";
  const isComponent = kind === "component";
  const target = isSystem ? miFindSystemById(id) : miCurrentInstruments().find((instrument) => instrument.serial === id);
  const restricted = Boolean(target?.locked);
  const favoriteKey = `${isSystem ? "system" : "instrument"}:${id}`;
  const favoriteItem = isComponent ? "" : miActionMenuItem("favorite", miIsFavorite(favoriteKey) ? "Remove favorite" : "Favorite", miFavoriteIcon(miIsFavorite(favoriteKey), 24));
  const shareItem = isComponent || (restricted && !miIsAdmin(target)) ? "" : miActionMenuItem("share", "Share", MI_ACTION_MENU_ICONS.share);
  const accessItem = isComponent || (restricted && !miIsAdmin(target)) ? "" : miActionMenuItem(restricted ? "unrestrict" : "restrict", restricted ? "Unrestrict access" : "Restrict access", restricted ? MI_ACTION_MENU_ICONS.unrestrict : MI_ACTION_MENU_ICONS.restrict);
  const commonStart = `${miActionMenuItem("view-details", "View details", MI_ACTION_MENU_ICONS.details)}${miActionMenuItem("start-request", "Start a request", MI_ACTION_MENU_ICONS.request)}`;
  if (isSystem) return `${commonStart}${miActionMenuItem("edit-system", "Edit system", MI_ACTION_MENU_ICONS.system)}${miActionMenuItem("edit-nickname", "Edit nickname", MI_ACTION_MENU_ICONS.edit)}${miActionMenuItem("add-group", "Add to group", MI_ACTION_MENU_ICONS.group)}${shareItem}${favoriteItem}${miActionMenuItem("order-consumables", "Order consumables", MI_ACTION_MENU_ICONS.cart)}${accessItem}<div class="mi-action-popover__divider" role="separator"></div>${miActionMenuItem("remove-system", "Remove system", MI_ACTION_MENU_ICONS.remove, "Remove system from my account only")}${miActionMenuItem("dismantle-system", "Dismantle system", MI_ACTION_MENU_ICONS.dismantle, "Dismantling configuration will apply to all users")}`;
  return `${commonStart}${miActionMenuItem("edit-nickname", "Edit nickname", MI_ACTION_MENU_ICONS.edit)}${miActionMenuItem("add-group", "Add to group", MI_ACTION_MENU_ICONS.group)}${shareItem}${favoriteItem}${accessItem}<div class="mi-action-popover__divider" role="separator"></div>${miActionMenuItem("remove-instrument", "Remove from account", MI_ACTION_MENU_ICONS.remove)}`;
}

function closeMiActionPopover({ restoreFocus = false } = {}) {
  if (!miActionPopover) return;
  const trigger = miActionPopoverTrigger;
  trigger?.setAttribute("aria-expanded", "false");
  miActionPopover.remove();
  miActionPopover = undefined;
  miActionPopoverTrigger = undefined;
  if (miActionPopoverReposition) {
    window.removeEventListener("resize", miActionPopoverReposition);
    window.removeEventListener("scroll", miActionPopoverReposition, true);
    miActionPopoverReposition = undefined;
  }
  if (restoreFocus) trigger?.focus();
}

function positionMiActionPopover(trigger, popover) {
  const rect = trigger.getBoundingClientRect();
  const icon = trigger.querySelector("img")?.getBoundingClientRect();
  const anchorCenter = icon ? icon.left + icon.width / 2 : rect.left + rect.width / 2;
  const menuWidth = 208;
  const detailMenu = popover.classList.contains("mi-action-popover--detail");
  const preferredLeft = detailMenu ? rect.right - menuWidth : anchorCenter - 186;
  const left = Math.max(8, Math.min(window.innerWidth - menuWidth - 8, preferredLeft));
  const arrowLeft = Math.max(7, Math.min(menuWidth - 21, anchorCenter - left - 7));
  const top = rect.bottom + (detailMenu ? 4 : 8);
  popover.style.left = `${Math.round(left)}px`;
  popover.style.top = `${Math.round(top)}px`;
  popover.style.setProperty("--mi-action-arrow-left", `${Math.round(arrowLeft)}px`);
  popover.style.maxHeight = `${Math.max(120, window.innerHeight - top - 8)}px`;
}

function handleMiActionPopoverAction(action, kind, id, label) {
  const activeTab = app.querySelector(".mi-tabs [role='tab'].is-active")?.dataset.miTab;
  const mainGridSelected = Boolean(app.querySelector('[data-mi-view="grid"].is-selected'));
  closeMiActionPopover();
  if (action === "view-details") {
    setRoute(kind === "system" ? `system-detail-${id}` : miInstrumentDetailRoute(id));
  } else if (action === "start-request") setRoute("request-support");
  else if (action === "order-consumables") setRoute("consumables");
  else if (action === "favorite") {
    const favoriteKey = `${kind === "system" ? "system" : "instrument"}:${id}`;
    const favoriteButton = app.querySelector(`.mi-favorite[data-mi-favorite-key="${favoriteKey}"]`);
    if (favoriteButton) favoriteButton.click();
    else app.querySelector("[data-id-favorite]")?.click();
  } else if (action === "remove-instrument" && kind !== "system") {
    if (!miRemoveInstrumentFromAccount(id)) return;
    const route = routeFromHash();
    if (isMiInstrumentDetailRoute(route) || route === "instrument-1009996") setRoute("my-instruments");
    else {
      render();
      if (route === "my-instruments" && activeTab && activeTab !== "instruments") app.querySelector(`[data-mi-tab="${activeTab}"]`)?.click();
      else if (route === "my-instruments" && mainGridSelected) app.querySelector('[data-mi-view="grid"]')?.click();
    }
    showToast(`${label} removed from account.`, { variant: "success" });
  } else if (action === "edit-system") {
    const system = miFindSystemById(id);
    if (system) {
      wireMiBuilderDialogs();
      resetMiSystemBuilder(system);
      openMiDialog(miCreateSystemDialog);
    }
  } else if (action === "edit-nickname" && kind === "system") {
    const system = miFindSystemById(id);
    if (system) openSystemEditDialog(system, "nickname");
  } else if ((action === "remove-system" || action === "dismantle-system") && kind === "system") {
    const system = miFindSystemById(id);
    if (system) openSystemConfirmationDialog(system, action === "remove-system" ? "remove" : "dismantle");
  } else if (action === "restrict" || action === "unrestrict") {
    const target = kind === "system" ? miFindSystemById(id) : miCurrentInstruments().find((instrument) => instrument.serial === id);
    if (!target) return;
    target.locked = action === "restrict";
    target.admin = action === "restrict";
    render();
    if (routeFromHash() === "my-instruments" && activeTab && activeTab !== "instruments") app.querySelector(`[data-mi-tab="${activeTab}"]`)?.click();
    else if (routeFromHash() === "my-instruments" && mainGridSelected) app.querySelector('[data-mi-view="grid"]')?.click();
    showToast(`${label} access ${target.locked ? "restricted" : "unrestricted"}`, { variant: "success" });
  } else {
    const messages = {
      "edit-nickname": `Edit nickname for ${label} opened`,
      "add-group": "Add to group opened",
      share: "Share opened",
      "remove-system": "Remove system selected",
      "dismantle-system": "Dismantle system selected",
    };
    showToast(messages[action] || `${label} action selected`);
  }
}

function miRemoveInstrumentFromAccount(serial) {
  const instrument = miCurrentInstruments().find((candidate) => candidate.serial === serial);
  if (!instrument || MI_REMOVED_INSTRUMENTS.has(serial)) return false;
  MI_REMOVED_INSTRUMENTS.add(serial);
  miFavoritesStore().delete(`instrument:${serial}`);
  [MI_REFERENCE_SYSTEMS, MI_MAIN_SYSTEMS, MI_CREATED_SYSTEMS].forEach((systems) => systems.forEach((system) => {
    system.components = system.components.filter((componentSerial) => componentSerial !== serial);
  }));
  MI_GROUPS.forEach((group) => {
    if (!group.members) return;
    group.members = group.members.filter((member) => member !== `instrument:${serial}`);
    group.count = group.members.length;
  });
  return true;
}

function openMiActionPopover(trigger, { focusFirst = false } = {}) {
  if (miActionPopoverTrigger === trigger) {
    closeMiActionPopover({ restoreFocus: true });
    return;
  }
  closeMiActionPopover();
  const { miActionMenuKind: kind, miActionMenuId: id, miActionMenuLabel: label, miActionMenuContext: context } = trigger.dataset;
  const popover = document.createElement("div");
  popover.className = `mi-action-popover mi-action-popover--${kind === "system" ? "system" : "instrument"}${context ? ` mi-action-popover--${context}` : ""}`;
  popover.setAttribute("role", "menu");
  popover.setAttribute("aria-label", `Actions for ${label}`);
  popover.innerHTML = `<span class="mi-action-popover__arrow" aria-hidden="true"></span><div class="mi-action-popover__surface">${miActionPopoverMarkup(kind, id, context)}</div>`;
  (trigger.closest("dialog[open]") || document.body).append(popover);
  miActionPopover = popover;
  miActionPopoverTrigger = trigger;
  trigger.setAttribute("aria-expanded", "true");
  miActionPopoverReposition = () => positionMiActionPopover(trigger, popover);
  positionMiActionPopover(trigger, popover);
  window.addEventListener("resize", miActionPopoverReposition);
  window.addEventListener("scroll", miActionPopoverReposition, true);
  popover.addEventListener("click", (event) => {
    const item = event.target.closest("[data-mi-popover-action]");
    if (item) handleMiActionPopoverAction(item.dataset.miPopoverAction, kind, id, label);
  });
  popover.addEventListener("keydown", (event) => {
    const items = [...popover.querySelectorAll("[role='menuitem']")];
    const current = items.indexOf(document.activeElement);
    if (event.key === "Escape") closeMiActionPopover({ restoreFocus: true });
    else if (event.key === "ArrowDown") { event.preventDefault(); items[(current + 1) % items.length]?.focus(); }
    else if (event.key === "ArrowUp") { event.preventDefault(); items[(current - 1 + items.length) % items.length]?.focus(); }
    else if (event.key === "Home") { event.preventDefault(); items[0]?.focus(); }
    else if (event.key === "End") { event.preventDefault(); items.at(-1)?.focus(); }
  });
  if (focusFirst) popover.querySelector("[role='menuitem']")?.focus();
}

function wireMiActionMenus(scope = app) {
  if (!scope) return;
  scope.querySelectorAll("[data-mi-action-menu-kind]").forEach((trigger) => trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    openMiActionPopover(trigger, { focusFirst: event.detail === 0 });
  }));
}

document.addEventListener("click", (event) => {
  if (miActionPopover && !event.target.closest(".mi-action-popover") && !event.target.closest("[data-mi-action-menu-kind]")) closeMiActionPopover();
});
const miFavoriteIcon = (pressed, size = 16) => `assets/icons/commerce/rating/Size=${size}px, Style=${pressed ? "Bold" : "Mono"}.svg`;
const miIsFavorite = (favoriteKey) => miFavoritesStore().has(favoriteKey);
const miFavoriteButton = (label, pressed = false, favoriteKey = "") => {
  const selected = favoriteKey ? miIsFavorite(favoriteKey) : pressed;
  return `<button class="mi-favorite mi-favorite--blue" type="button" data-mi-favorite-label="${label}"${favoriteKey ? ` data-mi-favorite-key="${favoriteKey}"` : ""} aria-label="${selected ? "Remove" : "Add"} ${label} ${selected ? "from" : "to"} favorites" aria-pressed="${selected}"><img src="${miFavoriteIcon(selected)}" alt="" /></button>`;
};

function syncMiFavoriteButton(button, pressed) {
  const label = button.dataset.miFavoriteLabel || "item";
  button.setAttribute("aria-pressed", String(pressed));
  button.setAttribute("aria-label", `${pressed ? "Remove" : "Add"} ${label} ${pressed ? "from" : "to"} favorites`);
  button.querySelector("img").src = miFavoriteIcon(pressed);
}

function toggleMiFavorite(button) {
  const favoriteKey = button.dataset.miFavoriteKey;
  const pressed = button.getAttribute("aria-pressed") !== "true";
  if (favoriteKey) {
    if (pressed) miFavoritesStore().add(favoriteKey);
    else miFavoritesStore().delete(favoriteKey);
    document.querySelectorAll("[data-mi-favorite-key]").forEach((candidate) => {
      if (candidate.dataset.miFavoriteKey === favoriteKey) syncMiFavoriteButton(candidate, pressed);
    });
    if (app.querySelector('[data-mi-tab="favorites"].is-active')) renderMyInstrumentsTab("favorites");
    return;
  }
  syncMiFavoriteButton(button, pressed);
}

function syncMiDetailFavorite(button, favoriteKey) {
  const pressed = miIsFavorite(favoriteKey);
  button.setAttribute("aria-pressed", String(pressed));
  button.querySelector("img").src = miFavoriteIcon(pressed, 24);
  button.querySelector("span").textContent = pressed ? "Remove from favorite" : "Add to favorite";
}

function toggleMiDetailFavorite(button, favoriteKey) {
  if (miIsFavorite(favoriteKey)) miFavoritesStore().delete(favoriteKey);
  else miFavoritesStore().add(favoriteKey);
  syncMiDetailFavorite(button, favoriteKey);
  document.querySelectorAll("[data-mi-favorite-key]").forEach((candidate) => {
    if (candidate.dataset.miFavoriteKey === favoriteKey) syncMiFavoriteButton(candidate, miIsFavorite(favoriteKey));
  });
}

function miUsersPanel() {
  return `<div class="mi-secondary-top">${miTitleMarkup("Users", 5, "Users who have instruments in common with you in Services Central.", '<button class="mi-button mi-secondary-share" type="button" data-mi-toast="Share users opened">Share</button>')}${miSearchMarkup("Search by user email")}</div>
    <div class="mi-secondary-table-wrap"><table class="mi-secondary-table mi-users-table"><thead><tr><th>Current users ${miSortIcon}</th><th></th></tr></thead><tbody>${MI_USERS.map((user, index) => `<tr data-mi-secondary-row data-search="${user.email}" class="${index === 1 ? "is-new" : ""}"><td><button class="mi-link" type="button" data-route="user-detail-${user.slug}">${user.email}</button></td><td>${index === 1 ? '<span class="mi-new-badge">New</span>' : ""}</td></tr>`).join("")}</tbody></table></div>`;
}

function miGroupTable(groups) {
  return `<div class="mi-secondary-table-wrap"><table class="mi-secondary-table mi-groups-table"><colgroup><col class="mi-group-favorite" /><col class="mi-group-icon" /><col /><col class="mi-group-count" /><col class="mi-group-date" /><col class="mi-group-actions" /></colgroup><thead><tr><th>Favorite ${miSortIcon}</th><th></th><th>Name ${miSortIcon}</th><th>Instruments ${miSortIcon}</th><th>Last modified ${miSortIcon}</th><th>Actions</th></tr></thead><tbody>${groups.map((group) => `<tr data-mi-secondary-row data-search="${group.name} ${group.count} ${group.date}"><td>${miFavoriteButton(group.name, false, `group:${group.id}`)}</td><td><img class="mi-group-mark" src="assets/icons/science/2 instruments/size=24px, style=mono.svg" alt="" /></td><td><button class="mi-link" type="button" data-route="group-detail-${group.id}">${group.name}</button></td><td>${group.count}</td><td>${group.date}</td><td>${miMoreButton(group.name)}</td></tr>`).join("")}</tbody></table></div>`;
}

function miGroupsPanel() {
  const visibleGroups = isEuropeLePrototype() ? MI_GROUPS.slice(Math.ceil(MI_GROUPS.length / 2)) : MI_GROUPS;
  return `<div class="mi-secondary-top">${miTitleMarkup("Groups", visibleGroups.length, "Groups are personal and not shared.", '<button class="mi-button mi-secondary-create" type="button" data-mi-create-group-direct>Create</button>')}<div class="mi-secondary-controls">${miSearchMarkup("Search by group name")}${miViewToggleMarkup(miGroupsView)}</div></div><div data-mi-groups-list ${miGroupsView === "list" ? "" : "hidden"}>${miGroupTable(visibleGroups)}</div><div class="mi-groups-grid-view" data-mi-groups-grid ${miGroupsView === "grid" ? "" : "hidden"}><div class="mi-favorite-group-grid mi-groups-card-grid">${visibleGroups.map(miFavoriteGroupCardMarkup).join("")}</div>${miPaginationMarkup(visibleGroups.length)}</div>`;
}

function miFavoritesInstrumentTable() {
  const favoriteSystems = miCurrentSystems().filter((system) => miIsFavorite(`system:${system.id}`));
  const favoriteSystemComponents = new Set(favoriteSystems.flatMap((system) => system.components));
  const favoriteInstruments = miCurrentInstruments().filter((instrument) => miIsFavorite(`instrument:${instrument.serial}`) && !favoriteSystemComponents.has(instrument.serial) && !MI_REMOVED_INSTRUMENTS.has(instrument.serial));
  const systemRows = favoriteSystems.map((system) => {
    const components = system.components.map((serial) => miCurrentInstruments().find((instrument) => instrument.serial === serial)).filter((instrument) => instrument && !MI_REMOVED_INSTRUMENTS.has(instrument.serial));
    const key = `favorite-system-${system.id}`;
    const groups = MI_GROUPS.filter((group) => group.members?.includes(`system:${system.id}`)).map((group) => group.name).join(", ") || "—";
    const parent = `<tr class="mi-system-row" data-mi-secondary-row data-search="System ${system.nickname} ${system.typeCode}"><td>${miFavoriteButton(system.nickname, false, `system:${system.id}`)}</td><td><button class="mi-row-chevron mi-system-toggle" type="button" data-mi-system-toggle="${key}" data-mi-system-label="${system.nickname}" aria-expanded="true" aria-label="Collapse ${system.nickname} system components"><img src="assets/icons/directions/chevron down/size=16px, style=mono.svg" alt="" /></button></td><td><span class="mi-asset-with-lock"><img class="mi-system-mark" src="assets/icons/science/system/size=24px, style=mono.svg" alt="" />${miLockMarkup(system.locked)}</span></td><td><button class="mi-link" type="button" data-route="system-detail-${system.id}">System</button></td><td>${system.nickname}</td><td class="mi-users-cell">${miUserCountMarkup(miSystemUserCount(system), `system:${system.id}`)}</td><td>${groups}</td><td>—</td><td>—</td><td>—</td><td>${miMoreButton(`System ${system.nickname}`, "system", system.id)}</td></tr>`;
    const children = components.map((instrument, index) => {
      const coverageClass = instrument.coverage === "Coverage expired" ? "mi-status--expired" : instrument.coverage === "Expiring soon" ? "mi-status--soon" : "";
      return `<tr class="mi-child-row ${index === components.length - 1 ? "mi-child-row--last" : ""}" data-mi-system-component="${key}" data-mi-secondary-row data-search="${instrument.serial} ${instrument.nickname} ${instrument.model}"><td></td><td>${miBranchIcon}</td><td><img class="mi-product" src="assets/instruments/${instrument.image}" alt="" /></td><td><button class="mi-link" type="button" data-route="${miInstrumentDetailRoute(instrument.serial)}">${instrument.serial}</button></td><td>${instrument.nickname}</td><td class="mi-users-cell"></td><td>${instrument.group}</td><td>${instrument.model}</td><td>${coverageClass ? `<span class="mi-status ${coverageClass}">${instrument.coverage}</span>` : instrument.coverage}</td><td>${instrument.end}</td><td>${miMoreButton(instrument.serial, "component", instrument.serial)}</td></tr>`;
    }).join("");
    return parent + children;
  }).join("");
  const instrumentRows = favoriteInstruments.map((instrument) => {
    const coverageClass = instrument.coverage === "Coverage expired" ? "mi-status--expired" : instrument.coverage === "Expiring soon" ? "mi-status--soon" : "";
    return `<tr data-mi-secondary-row data-search="${instrument.serial} ${instrument.nickname} ${instrument.model}"><td>${miFavoriteButton(instrument.serial, false, `instrument:${instrument.serial}`)}</td><td>${miLockMarkup(instrument.locked)}</td><td><img class="mi-product" src="assets/instruments/${instrument.image}" alt="" /></td><td><button class="mi-link" type="button" data-route="${miInstrumentDetailRoute(instrument.serial)}">${instrument.serial}</button></td><td>${instrument.nickname}</td><td class="mi-users-cell">${miUserCountMarkup(instrument.users, `instrument:${instrument.serial}`)}</td><td>${instrument.group}</td><td>${instrument.model}</td><td>${coverageClass ? `<span class="mi-status ${coverageClass}">${instrument.coverage}</span>` : instrument.coverage}</td><td>${instrument.end}</td><td>${miMoreButton(instrument.serial, "instrument", instrument.serial)}</td></tr>`;
  }).join("");
  return `<div class="mi-secondary-table-wrap"><table class="mi-secondary-table mi-favorites-table"><thead><tr><th>Favorite ${miSortIcon}</th><th></th><th></th><th>Serial number ${miSortIcon}</th><th>Nickname ${miSortIcon}</th><th class="mi-users-cell">Users ${miSortIcon}</th><th><button class="mi-header-select" type="button">Groups <img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button></th><th><button class="mi-header-select platform-table-catalog-filter" type="button"><span class="platform-table-catalog-filter__label" title="Catalog no.">Catalog no.</span><img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button></th><th><button class="mi-header-select" type="button">Coverage <img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button></th><th>Coverage end ${miSortIcon}</th><th>Actions</th></tr></thead><tbody>${systemRows}${instrumentRows}</tbody></table></div>`;
}

function miFavoriteGroupCardMarkup(group) {
  return `<article class="mi-group-card" data-mi-group-card data-search="${group.name} ${group.count}">
    <span class="mi-group-card__stack mi-group-card__stack--back" aria-hidden="true"></span>
    <span class="mi-group-card__stack mi-group-card__stack--middle" aria-hidden="true"></span>
    <div class="mi-group-card__surface">
      ${miFavoriteButton(group.name, false, `group:${group.id}`)}
      <button class="mi-group-card__title" type="button" data-route="group-detail-${group.id}">${group.name}</button>
      <span class="mi-group-card__count">${group.count} instruments</span>
      <button class="mi-group-card__more" type="button" data-mi-toast="${group.name} actions opened" aria-label="Actions for ${group.name}"><img src="assets/icons/actions/more horizontal/size=16px, style=bold.svg" alt="" /></button>
    </div>
  </article>`;
}

function miFavoritesGridMarkup(favoriteSystems, favoriteInstruments, favoriteGroups, favoriteInstrumentCount) {
  const instrumentCards = favoriteSystems.map(miCreatedSystemCardMarkup).join("") + favoriteInstruments.map((instrument) => miGridCardMarkup(instrument)).join("");
  return `<div class="mi-favorites-grid-view" data-mi-favorites-grid ${miFavoritesView === "grid" ? "" : "hidden"}>
    <section class="mi-favorites-section mi-favorites-grid-section"><h3>Instruments <span>${favoriteInstrumentCount}</span></h3><div class="mi-grid-cards mi-favorites-instrument-grid">${instrumentCards}</div></section>
    <section class="mi-favorites-section mi-favorites-grid-section"><h3>Groups <span>${favoriteGroups.length}</span></h3><div class="mi-favorite-group-grid">${favoriteGroups.map(miFavoriteGroupCardMarkup).join("")}</div></section>
  </div>`;
}

function miFavoritesPanel() {
  const favoriteSystems = miCurrentSystems().filter((system) => miIsFavorite(`system:${system.id}`));
  const favoriteSystemComponents = new Set(favoriteSystems.flatMap((system) => system.components));
  const favoriteInstruments = miCurrentInstruments().filter((instrument) => miIsFavorite(`instrument:${instrument.serial}`) && !favoriteSystemComponents.has(instrument.serial) && !MI_REMOVED_INSTRUMENTS.has(instrument.serial));
  const favoriteStandaloneCount = favoriteInstruments.length;
  const favoriteInstrumentCount = favoriteSystems.reduce((total, system) => total + 1 + system.components.filter((serial) => !MI_REMOVED_INSTRUMENTS.has(serial)).length, 0) + favoriteStandaloneCount;
  const favoriteGroups = MI_GROUPS.filter((group) => miIsFavorite(`group:${group.id}`));
  const favoriteCount = favoriteInstrumentCount + favoriteGroups.length;
  return `<div class="mi-secondary-top mi-favorites-top">${miTitleMarkup("Favorites", favoriteCount, "Favorites are personal to you and not visible to others.")}<div class="mi-secondary-controls">${miSearchMarkup("Search by instrument serial number, nickname, or group")}${miViewToggleMarkup(miFavoritesView)}</div></div><div data-mi-favorites-list ${miFavoritesView === "list" ? "" : "hidden"}><section class="mi-favorites-section"><h3>Instruments <span>${favoriteInstrumentCount}</span></h3>${miFavoritesInstrumentTable()}</section><section class="mi-favorites-section"><h3>Groups <span>${favoriteGroups.length}</span></h3>${miGroupTable(favoriteGroups)}</section></div>${miFavoritesGridMarkup(favoriteSystems, favoriteInstruments, favoriteGroups, favoriteInstrumentCount)}`;
}

function miSegmentedMarkup(items, selectedKey) {
  return `<div class="mi-segmented" role="group">${items.map(([key, label, hasAlert]) => `<button class="${key === selectedKey ? "is-selected" : ""}" type="button" data-mi-segment="${key}" aria-pressed="${key === selectedKey}">${hasAlert ? '<i aria-hidden="true"></i>' : ""}${label}</button>`).join("")}</div>`;
}

const MI_PENDING_SHARED_ITEMS = [
  { id: "shared-orion", kind: "system", systemId: "orion-vista", serial: "System", nickname: "Orion Vista", type: "LCMS", model: "—", sharedBy: "carl.wilson@company.com", expires: "14 Sep 2026", locked: true, components: [
    { serial: "OVD-48271", nickname: "IonGate Detector", type: "HPLC", model: "VQF0000DET", image: "vanquish-detector.png" },
    { serial: "OVC-73108", nickname: "Solstice Column", type: "HPLC", model: "VQH0000VEN", image: "vanquish-column.png" },
    { serial: "OVS-26549", nickname: "Arcadia Sampler", type: "HPLC", model: "VQF00SAMPL", image: "vanquish-sampler.png" },
    { serial: "OVP-90436", nickname: "Meridian Pump", type: "HPLC", model: "VQF000PUMP", image: "vanquish-pump.png" },
  ] },
  { id: "shared-nimbus", kind: "instrument", serial: "CRYO-78421", nickname: "Nimbus Freezer", type: "Mass Spec Life Science", model: "QEXAC00001", sharedBy: "sue.scott@company.com", expires: "03 Oct 2026", image: "q-exactive.png", locked: true },
  { id: "shared-aurora", kind: "instrument", serial: "MS-640238", nickname: "Aurora MS", type: "Mass Spec Life Science", model: "QEXAC00001", sharedBy: "ira.wilson@company.com", expires: "21 Oct 2026", image: "q-exactive.png", locked: true },
  { id: "shared-cascade", kind: "instrument", serial: "HPLC-51290", nickname: "Cascade LC", type: "HPLC", model: "VQH0000VEN", sharedBy: "oliver.taylor@company.com", expires: "08 Nov 2026", image: "vanquish-column.png" },
  { id: "shared-helix", kind: "instrument", serial: "ORB-93317", nickname: "Helix Analyzer", type: "Mass Spec Life Science", model: "QEXAC00001", sharedBy: "kim.mitchell@company.com", expires: "27 Nov 2026", image: "q-exactive.png" },
];

const MI_PENDING_AWAITING_ITEMS = [
  { id: "awaiting-atlas", kind: "system", nickname: "Atlas Prime", user: "carla.flores@company.com", type: "LCMS", model: "—", expires: "30 Sep 2026", expanded: false, components: [
    { serial: "ATP-18420", nickname: "Atlas Detector", type: "HPLC", model: "VQF0000DET", image: "vanquish-detector.png" },
    { serial: "ATP-39174", nickname: "Atlas Column", type: "HPLC", model: "VQH0000VEN", image: "vanquish-column.png" },
  ] },
  { id: "awaiting-nova", kind: "system", nickname: "Nova Stream", user: "sergio.sanchez@company.com", type: "LCMS", model: "—", expires: "12 Oct 2026", expanded: true, components: [
    { serial: "NVS-43018", nickname: "Nova Detector", type: "HPLC", model: "VQF0000DET", image: "vanquish-detector.png" },
    { serial: "NVS-77204", nickname: "Nova Column", type: "HPLC", model: "VQH000OVEN", image: "vanquish-column.png" },
    { serial: "NVS-61593", nickname: "Nova Sampler", type: "HPLC", model: "VQF00SAMPL", image: "vanquish-sampler.png" },
    { serial: "NVS-20847", nickname: "Nova Pump", type: "HPLC", model: "VQF000PUMP", image: "vanquish-pump.png" },
    { serial: "NVS-94631", nickname: "Nova Quantis", type: "Mass Spec Life Science", model: "MSTSQQUANTISPLUS", image: "tsq.png" },
  ] },
  { id: "awaiting-polaris", kind: "instrument", user: "tammy.hall@company.com", serial: "QNT-45821", nickname: "Polaris Quant", type: "Mass Spec Life Science", model: "MSTSQQUANTISPLUS", expires: "18 Oct 2026", image: "tsq.png" },
  { id: "awaiting-ember", kind: "instrument", user: "leo.mitchell@company.com", serial: "QNT-76309", nickname: "Ember Quant", type: "Mass Spec Life Science", model: "MSTSQQUANTISPLUS", expires: "22 Oct 2026", image: "tsq.png" },
  { id: "awaiting-vertex", kind: "instrument", user: "iris.thomas@company.com", serial: "QNT-29164", nickname: "Vertex Quant", type: "Mass Spec Life Science", model: "MSTSQQUANTISPLUS", expires: "04 Nov 2026", image: "tsq.png" },
  { id: "awaiting-lumen", kind: "instrument", user: "oliver.clark@company.com", serial: "QNT-83572", nickname: "Lumen Quant", type: "Mass Spec Life Science", model: "MSTSQQUANTISPLUS", expires: "19 Nov 2026", image: "tsq.png" },
];

const MI_PENDING_ACCESS_REQUEST_COUNT = 3;

function miPendingCount() {
  if (isEuropeLePrototype()) return 0;
  return MI_PENDING_SHARED_ITEMS.length + MI_PENDING_AWAITING_ITEMS.length + MI_PENDING_ACCESS_REQUEST_COUNT;
}

function miPendingSegments() {
  if (isEuropeLePrototype()) return [
    ["shared", "0 shared with me", false],
    ["awaiting", "0 awaiting my approval", false],
    ["access", "0 access requested", false],
  ];
  return [
    ["shared", `${MI_PENDING_SHARED_ITEMS.length} shared with me`, false],
    ["awaiting", `${MI_PENDING_AWAITING_ITEMS.length} awaiting my approval`, MI_PENDING_AWAITING_ITEMS.length > 0],
    ["access", `${MI_PENDING_ACCESS_REQUEST_COUNT} access requested`, MI_PENDING_ACCESS_REQUEST_COUNT > 0],
  ];
}

function miPendingActionBarMarkup(mode) {
  const shared = mode === "shared";
  return `<div class="mi-pending-actionbar" data-mi-pending-actionbar><div class="mi-pending-actionbar__buttons"><button type="button" data-mi-pending-bulk="${shared ? "ignore" : "deny"}" disabled>${shared ? "Ignore selected" : "Deny selected"}</button><button class="mi-pending-actionbar__primary" type="button" data-mi-pending-bulk="${shared ? "add" : "approve"}" disabled>${shared ? "Add selected to My Instruments" : "Approve selected"}</button></div></div>`;
}

function miZeroStateArtMarkup() {
  return `<div class="mi-pending-zero__art" aria-hidden="true">${Array.from({ length: 10 }, (_, index) => `<img class="mi-pending-zero__layer mi-pending-zero__layer--${index + 1}" src="assets/instruments/pending-empty-state/layer-${String(index + 1).padStart(2, "0")}.svg" alt="" />`).join("")}</div>`;
}

function miPendingZeroStateMarkup() {
  return `<section class="mi-pending-zero" aria-labelledby="mi-pending-zero-title">${miZeroStateArtMarkup()}<h3 id="mi-pending-zero-title">There are no instruments shared</h3><p>To view all of the instruments associated with your account please visit the My Instruments tab.</p><button type="button" data-mi-view-instruments>View My instruments</button></section>`;
}

function miPendingSharedPanel() {
  const rows = MI_PENDING_SHARED_ITEMS.map((item) => {
    const key = `pending-${item.id}`;
    const hierarchy = item.kind === "system" ? `<button class="mi-row-chevron mi-system-toggle" type="button" data-mi-system-toggle="${key}" data-mi-system-label="${item.nickname}" aria-expanded="true" aria-label="Collapse ${item.nickname} system components"><img src="assets/icons/directions/chevron down/size=16px, style=mono.svg" alt="" /></button>` : "";
    const image = item.kind === "system" ? '<img class="mi-system-mark" src="assets/icons/science/system/size=24px, style=mono.svg" alt="" />' : `<img class="mi-product" src="assets/instruments/${item.image}" alt="" />`;
    const parent = `<tr class="${item.kind === "system" ? "mi-system-row" : ""}" data-mi-secondary-row data-mi-pending-item-id="${item.id}" data-search="${item.serial} ${item.nickname} ${item.sharedBy}"><td><input type="checkbox" data-mi-pending-select value="${item.id}" aria-label="Select ${item.nickname}" /></td><td>${hierarchy}</td><td>${image}</td><td>${item.locked ? '<img class="mi-lock" src="assets/icons/actions/lock closed/size=16px, style=mono.svg" alt="Access controlled" />' : ""}</td><td>${item.serial}</td><td>${item.nickname}</td><td>${item.type}</td><td>${item.model}</td><td>${item.sharedBy}</td><td>${item.expires}</td><td><button class="mi-add-button" type="button" data-mi-pending-row-action="add" data-mi-pending-id="${item.id}">${miAddIcon}My Instruments</button></td><td><button class="mi-icon-action" type="button" data-mi-pending-row-action="ignore" data-mi-pending-id="${item.id}" aria-label="Ignore ${item.nickname}"><img src="assets/icons/actions/bin/size=16px, style=bold.svg" alt="" /></button></td></tr>`;
    if (item.kind !== "system") return parent;
    const children = item.components.map((component, index) => `<tr class="mi-child-row ${index === item.components.length - 1 ? "mi-child-row--last" : ""}" data-mi-system-component="${key}" data-mi-secondary-row data-search="${component.serial} ${component.nickname} ${item.sharedBy}"><td></td><td>${miBranchIcon}</td><td><img class="mi-product" src="assets/instruments/${component.image}" alt="" /></td><td></td><td>${component.serial}</td><td>${component.nickname}</td><td>${component.type}</td><td>${component.model}</td><td>${item.sharedBy}</td><td>${item.expires}</td><td></td><td></td></tr>`).join("");
    return parent + children;
  }).join("");
  const content = MI_PENDING_SHARED_ITEMS.length ? `<div class="mi-secondary-table-wrap"><table class="mi-secondary-table mi-pending-table"><thead><tr><th><input type="checkbox" data-mi-pending-select-all aria-label="Select all shared instruments and systems" /></th><th></th><th></th><th></th><th>Serial number ${miSortIcon}</th><th>Nickname ${miSortIcon}</th><th><button class="mi-header-select" type="button">Type <img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button></th><th><button class="mi-header-select platform-table-catalog-filter" type="button"><span class="platform-table-catalog-filter__label" title="Catalog no.">Catalog no.</span><img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button></th><th>Shared by ${miSortIcon}</th><th>Sharing expires ${miSortIcon}</th><th>Actions</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>${miPendingActionBarMarkup("shared")}` : miPendingZeroStateMarkup();
  return `<div class="mi-secondary-top mi-pending-top">${miTitleMarkup("Shared with me", MI_PENDING_SHARED_ITEMS.length, "Instruments and systems shared with you.", miSegmentedMarkup(miPendingSegments(), "shared"))}${miSearchMarkup("Search by instrument serial number, nickname or user")}</div>${content}`;
}

function miPendingAwaitingPanel() {
  const rows = MI_PENDING_AWAITING_ITEMS.map((item) => {
    const key = `pending-${item.id}`;
    const isSystem = item.kind === "system";
    const hierarchy = isSystem ? `<button class="mi-row-chevron mi-system-toggle" type="button" data-mi-system-toggle="${key}" data-mi-system-label="${item.nickname}" aria-expanded="${item.expanded}" aria-label="${item.expanded ? "Collapse" : "Expand"} ${item.nickname} system components"><img src="assets/icons/directions/chevron down/size=16px, style=mono.svg" alt="" /></button>` : "";
    const image = isSystem ? '<img class="mi-system-mark" src="assets/icons/science/system/size=24px, style=mono.svg" alt="" />' : `<img class="mi-product" src="assets/instruments/${item.image}" alt="" />`;
    const parent = `<tr class="${isSystem ? "mi-system-row" : ""}" data-mi-secondary-row data-mi-pending-item-id="${item.id}" data-search="${item.user} ${item.nickname} ${item.serial || "System"}"><td><input type="checkbox" data-mi-pending-select value="${item.id}" aria-label="Select ${item.nickname}" /></td><td>${item.user}</td><td>${hierarchy}</td><td>${image}</td><td>${item.nickname}</td><td>${item.serial || '<span class="mi-link">System</span>'}</td><td>${item.type}</td><td>${item.model}</td><td>${item.expires}</td><td><button class="mi-link" type="button" data-mi-pending-row-action="approve" data-mi-pending-id="${item.id}">Approve</button></td><td><button class="mi-link" type="button" data-mi-pending-row-action="deny" data-mi-pending-id="${item.id}">Deny</button></td></tr>`;
    if (!isSystem) return parent;
    const children = item.components.map((component, index) => `<tr class="mi-child-row ${index === item.components.length - 1 ? "mi-child-row--last" : ""}" data-mi-system-component="${key}" data-mi-secondary-row data-search="${item.user} ${component.nickname} ${component.serial}"${item.expanded ? "" : " hidden"}><td></td><td>${item.user}</td><td>${miBranchIcon}</td><td><img class="mi-product" src="assets/instruments/${component.image}" alt="" /></td><td>${component.nickname}</td><td>${component.serial}</td><td>${component.type}</td><td>${component.model}</td><td>${item.expires}</td><td></td><td></td></tr>`).join("");
    return parent + children;
  }).join("");
  const content = MI_PENDING_AWAITING_ITEMS.length ? `<div class="mi-secondary-table-wrap"><table class="mi-secondary-table mi-awaiting-table"><thead><tr><th><input type="checkbox" data-mi-pending-select-all aria-label="Select all users awaiting approval" /></th><th>User ${miSortIcon}</th><th></th><th></th><th>Nickname ${miSortIcon}</th><th>Serial number ${miSortIcon}</th><th>Type ${miSortIcon}</th><th>Catalog no. ${miSortIcon}</th><th>Request expires ${miSortIcon}</th><th></th><th></th></tr></thead><tbody>${rows}</tbody></table></div>${miPendingActionBarMarkup("awaiting")}` : "";
  return `<div class="mi-secondary-top mi-pending-top">${miTitleMarkup("Awaiting my approval", MI_PENDING_AWAITING_ITEMS.length, "Instrument access requests awaiting your approval. Requests expire after 30 days.", miSegmentedMarkup(miPendingSegments(), "awaiting"))}${miSearchMarkup("Search by instrument serial number, nickname or user")}</div>${content}`;
}

function miPendingAccessPanel() {
  const children = [["WD1009986", "Detector-2B", "VQF0000DET", "vanquish-detector.png"], ["WD1009989", "Column-2B", "VQH000OVEN", "vanquish-column.png"], ["WD1009988", "Sampler-2B", "VQF00SAMPL", "vanquish-sampler.png"], ["GG200008", "Pump-2B", "VQF000PUMP", "vanquish-pump.png"]].map((row, index) => `<tr class="mi-child-row ${index === 3 ? "mi-child-row--last" : ""}" data-mi-system-component="access-alpine" data-mi-secondary-row data-search="${row.join(" ")}"><td>${miBranchIcon}</td><td><img class="mi-product" src="assets/instruments/${row[3]}" alt="" /></td><td></td><td>${row[0]}</td><td>${row[1]}</td><td>${row[1]}</td><td>HPLC</td><td>${row[2]}</td><td></td><td class="mi-users-cell"></td></tr>`).join("");
  return `<div class="mi-secondary-top mi-pending-top">${miTitleMarkup("Access requested", MI_PENDING_ACCESS_REQUEST_COUNT, "Instrument access requests made by you. Requests expire after 30 days.", miSegmentedMarkup(miPendingSegments(), "access"))}${miSearchMarkup("Search by instrument serial number, nickname or user")}</div><div class="mi-secondary-table-wrap"><table class="mi-secondary-table mi-access-table"><thead><tr><th></th><th></th><th></th><th>Serial number ${miSortIcon}</th><th>Current nickname ${miSortIcon}</th><th>Entered nickname ${miSortIcon}</th><th>Type ${miSortIcon}</th><th>Catalog no. ${miSortIcon}</th><th>Status ${miSortIcon}</th><th class="mi-users-cell">Users ${miSortIcon}</th></tr></thead><tbody><tr data-mi-secondary-row data-search="888-1234 Freezer 1 Denied"><td></td><td><img class="mi-product" src="assets/instruments/q-exactive.png" alt="" /></td><td><img class="mi-lock" src="assets/icons/actions/lock closed/size=16px, style=mono.svg" alt="Access controlled" /></td><td>888-1234</td><td>–</td><td>Freezer 1</td><td>Mass Spec Life Science</td><td>MSTSQQUANTISPLUS</td><td>Denied</td><td class="mi-users-cell">${miUserCountMarkup(5)}</td></tr><tr data-mi-secondary-row data-search="889-1234 Freezer 2 Pending approval"><td></td><td><img class="mi-product" src="assets/instruments/q-exactive.png" alt="" /></td><td><img class="mi-lock" src="assets/icons/actions/lock closed/size=16px, style=mono.svg" alt="Access controlled" /></td><td>889-1234</td><td>Freezer 2</td><td>Freezer 2</td><td>Mass Spec Life Science</td><td>MSTSQQUANTISPLUS</td><td>Pending approval (expires in ## days)</td><td class="mi-users-cell">${miUserCountMarkup(5)}</td></tr><tr class="mi-system-row" data-mi-secondary-row data-search="System Alpine A"><td><button class="mi-row-chevron mi-system-toggle" type="button" data-mi-system-toggle="access-alpine" data-mi-system-label="Alpine A" aria-expanded="true" aria-label="Collapse Alpine A system components"><img src="assets/icons/directions/chevron down/size=16px, style=mono.svg" alt="" /></button></td><td><img class="mi-system-mark" src="assets/icons/science/system/size=24px, style=mono.svg" alt="" /></td><td><img class="mi-lock" src="assets/icons/actions/lock closed/size=16px, style=mono.svg" alt="Access controlled" /></td><td>System</td><td>Alpine A</td><td></td><td>LCMS</td><td>—</td><td>Pending approval (expires in ## days)</td><td class="mi-users-cell">${miUserCountMarkup(3)}</td></tr>${children}</tbody></table></div>`;
}

function miPendingPanel(state = "shared") {
  if (isEuropeLePrototype()) {
    const titles = { shared: "Shared with me", awaiting: "Awaiting my approval", access: "Access requested" };
    const descriptions = {
      shared: "Instruments shared with you.",
      awaiting: "Instrument access requests awaiting your approval. Requests expire after 30 days.",
      access: "Instrument access requests made by you. Requests expire after 30 days.",
    };
    return `<div class="mi-secondary-top mi-pending-top">${miTitleMarkup(titles[state], 0, descriptions[state], miSegmentedMarkup(miPendingSegments(), state))}${miSearchMarkup("Search by instrument serial number, nickname or user")}</div>${miPendingZeroStateMarkup()}`;
  }
  return state === "awaiting" ? miPendingAwaitingPanel() : state === "access" ? miPendingAccessPanel() : miPendingSharedPanel();
}

function miRemovePendingItems(items, ids) {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (ids.includes(items[index].id)) items.splice(index, 1);
  }
}

function miAddPendingSharedItems(ids) {
  const selected = MI_PENDING_SHARED_ITEMS.filter((item) => ids.includes(item.id));
  selected.forEach((item) => {
    if (item.kind === "system") {
      item.components.forEach((component) => {
        if (miCurrentInstruments().some((instrument) => instrument.serial === component.serial)) return;
        miCurrentInstruments().push({ ...component, users: "1", group: "—", coverage: "Under contract", end: item.expires, locked: item.locked, pendingNew: true });
      });
      if (!miFindSystemById(item.systemId)) MI_CREATED_SYSTEMS.push({ id: item.systemId, nickname: item.nickname, notes: "", typeCode: item.type, users: "1", locked: item.locked, admin: false, components: item.components.map((component) => component.serial), pendingNew: true });
      return;
    }
    if (miCurrentInstruments().some((instrument) => instrument.serial === item.serial)) return;
    miCurrentInstruments().push({ image: item.image, serial: item.serial, nickname: item.nickname, users: "1", group: "—", model: item.model, coverage: "Under contract", end: item.expires, locked: item.locked, pendingNew: true });
  });
  miRemovePendingItems(MI_PENDING_SHARED_ITEMS, ids);
  return selected.length;
}

function miRunPendingAction(action, ids) {
  if (!ids.length) return;
  let toastMessage = "";
  let segment = "shared";
  if (action === "add") {
    const count = miAddPendingSharedItems(ids);
    toastMessage = `${count} instrument${count === 1 ? "" : "s"} ${count === 1 ? "has" : "have"} been added to My Instruments.`;
  } else if (action === "ignore") miRemovePendingItems(MI_PENDING_SHARED_ITEMS, ids);
  else {
    segment = "awaiting";
    miRemovePendingItems(MI_PENDING_AWAITING_ITEMS, ids);
    toastMessage = `${ids.length} instrument(s) ${action === "approve" ? "approved" : "denied"}.`;
  }
  render();
  app.querySelector('[data-mi-tab="pending"]')?.click();
  if (segment !== "shared") app.querySelector(`[data-mi-segment="${segment}"]`)?.click();
  if (toastMessage) showToast(toastMessage, { title: "Success:", variant: "success" });
}

function wireMiPendingPanel(panel, segmentState = "shared") {
  const actionbar = panel.querySelector("[data-mi-pending-actionbar]");
  panel.classList.toggle("mi-secondary-content--has-actionbar", Boolean(actionbar));
  panel.querySelector("[data-mi-view-instruments]")?.addEventListener("click", () => app.querySelector('[data-mi-tab="instruments"]')?.click());
  if (!actionbar) return;
  const checkboxes = [...panel.querySelectorAll("[data-mi-pending-select]")];
  const selectAll = panel.querySelector("[data-mi-pending-select-all]");
  const actionButtons = [...actionbar.querySelectorAll("[data-mi-pending-bulk]")];
  const selectedIds = () => checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
  const sync = () => {
    const selected = selectedIds().length;
    actionButtons.forEach((button) => { button.disabled = selected === 0; });
    if (selectAll) {
      selectAll.checked = selected === checkboxes.length;
      selectAll.indeterminate = selected > 0 && selected < checkboxes.length;
    }
  };
  selectAll?.addEventListener("change", () => {
    checkboxes.forEach((checkbox) => { checkbox.checked = selectAll.checked; });
    sync();
  });
  checkboxes.forEach((checkbox) => checkbox.addEventListener("change", sync));
  actionButtons.forEach((button) => button.addEventListener("click", () => miRunPendingAction(button.dataset.miPendingBulk, selectedIds())));
  panel.querySelectorAll("[data-mi-pending-row-action]").forEach((button) => button.addEventListener("click", () => miRunPendingAction(button.dataset.miPendingRowAction, [button.dataset.miPendingId])));
  sync();
}

function miSuggestionItems(segment) {
  return segment === "related" ? MI_SUGGESTION_RELATED_ITEMS : segment === "invites" ? MI_SUGGESTION_INVITE_ITEMS : MI_SUGGESTION_SUPPORT_ITEMS;
}

function miSuggestionDisplayCount(items) {
  return items.reduce((count, item) => count + 1 + (item.components?.length || 0), 0);
}

function miSuggestionsCount() {
  if (isEuropeLePrototype()) return 0;
  return miSuggestionDisplayCount(MI_SUGGESTION_SUPPORT_ITEMS) + MI_SUGGESTION_RELATED_ITEMS.length + miSuggestionDisplayCount(MI_SUGGESTION_INVITE_ITEMS);
}

function syncMiTabCounts() {
  const pendingCount = app.querySelector("[data-mi-pending-count]");
  const suggestionsCount = app.querySelector("[data-mi-suggestions-count]");
  if (pendingCount) {
    const total = miPendingCount();
    pendingCount.textContent = String(total);
    pendingCount.hidden = total === 0;
  }
  if (suggestionsCount) {
    const total = miSuggestionsCount();
    suggestionsCount.textContent = String(total);
    suggestionsCount.hidden = total === 0;
  }
}

function miSuggestionSegments() {
  if (isEuropeLePrototype()) return [
    ["support", "0 from support history", false],
    ["related", "0 related systems", false],
    ["invites", "0 from installation invites", false],
  ];
  return [
    ["support", `${miSuggestionDisplayCount(MI_SUGGESTION_SUPPORT_ITEMS)} from support history`, false],
    ["related", `${MI_SUGGESTION_RELATED_ITEMS.length} related systems`, MI_SUGGESTION_RELATED_ITEMS.length > 0],
    ["invites", `${miSuggestionDisplayCount(MI_SUGGESTION_INVITE_ITEMS)} from installation invites`, MI_SUGGESTION_INVITE_ITEMS.length > 0],
  ];
}

function miSuggestionNicknameMarkup(item) {
  return item.nickname ? item.nickname : `<input class="mi-nickname-input" type="text" data-mi-suggestion-nickname="${item.id}" value="" placeholder="Example Asset ID or Instrument name" aria-label="Nickname for ${item.serial}" />`;
}

function miSuggestionActionBarMarkup(segment) {
  return `<div class="mi-pending-actionbar mi-suggestion-actionbar" data-mi-suggestion-actionbar><div class="mi-pending-actionbar__buttons"><button type="button" data-mi-suggestion-bulk="ignore" disabled>Ignore selected</button><button class="mi-pending-actionbar__primary" type="button" data-mi-suggestion-bulk="add" disabled>Add selected to My Instruments</button></div></div>`;
}

function miSuggestionIgnoreDialogMarkup() {
  return `<dialog class="mi-suggestion-ignore-dialog" data-mi-suggestion-ignore-dialog aria-labelledby="mi-suggestion-ignore-title" aria-describedby="mi-suggestion-ignore-copy"><form method="dialog"><header><h2 id="mi-suggestion-ignore-title" data-mi-suggestion-ignore-title>Ignore instrument(s)</h2><button type="button" data-mi-suggestion-ignore-close aria-label="Close"><img src="assets/icons/actions/close/size=24px, style=mono.svg" alt="" /></button></header><p id="mi-suggestion-ignore-copy">Are you sure you want to ignore? You can always add them manually on the "Add instruments" page.</p><footer><button type="button" data-mi-suggestion-ignore-close>No, close</button><button class="mi-suggestion-ignore-dialog__primary" type="button" data-mi-suggestion-ignore-confirm>Yes, ignore</button></footer></form></dialog>`;
}

function miSuggestionZeroStateMarkup(segment) {
  const copy = segment === "related"
    ? ["There are no related systems", "There are currently no related systems to review."]
    : segment === "invites"
      ? ["There are no installation invites", "There are currently no instruments from installation invites to review."]
      : ["There are no instruments from support history", "There are currently no instruments or systems from support history to review."];
  return `<section class="mi-pending-zero mi-suggestion-zero" aria-labelledby="mi-suggestion-zero-title">${miZeroStateArtMarkup()}<h3 id="mi-suggestion-zero-title">${copy[0]}</h3><p>${copy[1]}</p><button type="button" data-mi-view-instruments>View My instruments</button></section>`;
}

function miSuggestionCommonRows(items, segment) {
  const showUsers = segment === "invites";
  return items.map((item) => {
    const key = `suggestion-${segment}-${item.id}`;
    const isSystem = item.kind === "system";
    const hierarchy = isSystem ? `<button class="mi-row-chevron mi-system-toggle" type="button" data-mi-system-toggle="${key}" data-mi-system-label="${item.nickname || "Suggested system"}" aria-expanded="${item.expanded !== false}" aria-label="${item.expanded === false ? "Expand" : "Collapse"} ${item.nickname || "suggested"} system components"><img src="assets/icons/directions/chevron down/size=16px, style=mono.svg" alt="" /></button>` : "";
    const image = isSystem ? '<img class="mi-system-mark" src="assets/icons/science/system/size=24px, style=mono.svg" alt="" />' : `<img class="mi-product" src="assets/instruments/${item.image}" alt="" />`;
    const parent = `<tr class="${isSystem ? "mi-system-row" : ""}" data-mi-secondary-row data-mi-suggestion-item-id="${item.id}" data-search="${item.serial} ${item.nickname} ${item.model}"><td><input type="checkbox" data-mi-suggestion-select value="${item.id}" aria-label="Select ${item.nickname || item.serial}" /></td><td>${hierarchy}</td><td>${image}</td><td>${item.serial}</td><td>${miSuggestionNicknameMarkup(item)}</td>${showUsers ? `<td class="mi-users-cell">${miUserCountMarkup(item.users || 2)}</td>` : ""}<td>${item.model}</td><td>${item.type}</td><td><button class="mi-add-button" type="button" data-mi-suggestion-row-action="add" data-mi-suggestion-id="${item.id}">${miAddIcon}My Instruments</button></td><td><button class="mi-icon-action" type="button" data-mi-suggestion-row-action="ignore" data-mi-suggestion-id="${item.id}" aria-label="Ignore ${item.nickname || item.serial}"><img src="assets/icons/actions/bin/size=16px, style=bold.svg" alt="" /></button></td></tr>`;
    if (!isSystem) return parent;
    const children = item.components.map((component, index) => `<tr class="mi-child-row ${index === item.components.length - 1 ? "mi-child-row--last" : ""}" data-mi-system-component="${key}" data-mi-secondary-row data-search="${component.serial} ${component.nickname}"${item.expanded === false ? " hidden" : ""}><td></td><td>${miBranchIcon}</td><td><img class="mi-product" src="assets/instruments/${component.image}" alt="" /></td><td>${component.serial}</td><td>${component.nickname}</td>${showUsers ? '<td class="mi-users-cell"></td>' : ""}<td>${component.model}</td><td>${component.type}</td><td></td><td></td></tr>`).join("");
    return parent + children;
  }).join("");
}

function miSuggestionsSupportPanel() {
  const items = MI_SUGGESTION_SUPPORT_ITEMS;
  const content = items.length ? `<div class="mi-secondary-table-wrap"><table class="mi-secondary-table mi-suggestions-table"><thead><tr><th><input type="checkbox" data-mi-suggestion-select-all aria-label="Select all support history suggestions" /></th><th></th><th></th><th>Serial number ${miSortIcon}</th><th>Nickname</th><th><button class="mi-header-select platform-table-catalog-filter" type="button"><span class="platform-table-catalog-filter__label" title="Catalog no.">Catalog no.</span><img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button></th><th><button class="mi-header-select" type="button">Type <img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button></th><th>Actions</th><th></th></tr></thead><tbody>${miSuggestionCommonRows(items, "support")}</tbody></table></div>${miPaginationMarkup(miSuggestionDisplayCount(items))}${miSuggestionActionBarMarkup("support")}` : miSuggestionZeroStateMarkup("support");
  return `<div class="mi-secondary-top mi-suggestions-top">${miTitleMarkup("From support history", miSuggestionDisplayCount(items), "Instruments(s) and/or system(s) below have support history associated with your email address, but are not yet added to your account. &nbsp;Add if relevant to you, or ignore.", miSegmentedMarkup(miSuggestionSegments(), "support"))}${miSearchMarkup("Search by instrument serial number or nickname")}</div>${content}${miSuggestionIgnoreDialogMarkup()}`;
}

function miPaginationMarkup(total = 24) {
  return `<div class="mi-pagination"><span>Results per page</span><button class="mi-pagination__page-size" type="button">20<img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button><span>of&nbsp;&nbsp;${total}</span><nav aria-label="Pagination"><button type="button" disabled aria-label="Previous page">${miPreviousIcon}</button><button class="is-current" type="button" aria-current="page">1</button><button type="button">2</button><button type="button" aria-label="Next page">${miNextIcon}</button><span>Go to:</span><button type="button">#</button></nav></div>`;
}

function miSuggestionsRelatedPanel() {
  const items = MI_SUGGESTION_RELATED_ITEMS;
  const rows = items.map((item) => {
    const key = `suggestion-related-${item.id}`;
    const parent = `<tr class="mi-system-row" data-mi-secondary-row data-mi-suggestion-item-id="${item.id}" data-search="System ${item.nickname} ${item.type}"><td><input type="checkbox" data-mi-suggestion-select value="${item.id}" aria-label="Select ${item.nickname}" /></td><td><button class="mi-row-chevron mi-system-toggle" type="button" data-mi-system-toggle="${key}" data-mi-system-label="${item.nickname}" aria-expanded="${item.expanded}" aria-label="${item.expanded ? "Collapse" : "Expand"} ${item.nickname} system components"><img src="assets/icons/directions/chevron down/size=16px, style=mono.svg" alt="" /></button></td><td><img class="mi-system-mark" src="assets/icons/science/system/size=24px, style=mono.svg" alt="" /></td><td>System</td><td>${item.nickname}</td><td class="mi-users-cell">${miUserCountMarkup(item.users)}</td><td>${item.model}</td><td>${item.type}</td><td>${item.created}</td><td><button class="mi-add-button" type="button" data-mi-suggestion-row-action="add" data-mi-suggestion-id="${item.id}">${miAddIcon}My Instruments</button></td><td><button class="mi-icon-action" type="button" data-mi-suggestion-row-action="ignore" data-mi-suggestion-id="${item.id}" aria-label="Ignore ${item.nickname}"><img src="assets/icons/actions/bin/size=16px, style=bold.svg" alt="" /></button></td></tr>`;
    const children = item.components.map((component, index) => `<tr class="mi-child-row ${index === item.components.length - 1 ? "mi-child-row--last" : ""}" data-mi-system-component="${key}" data-mi-secondary-row data-search="${component.serial} ${component.nickname}"${item.expanded ? "" : " hidden"}><td></td><td>${miBranchIcon}</td><td><img class="mi-product" src="assets/instruments/${component.image}" alt="" /></td><td>${component.serial}</td><td>${component.nickname}</td><td class="mi-users-cell"></td><td>${component.model}</td><td>${component.type}</td><td></td><td></td><td></td></tr>`).join("");
    return parent + children;
  }).join("");
  const content = items.length ? `<div class="mi-secondary-table-wrap"><table class="mi-secondary-table mi-related-table"><thead><tr><th><input type="checkbox" data-mi-suggestion-select-all aria-label="Select all related systems" /></th><th></th><th></th><th>Serial number ${miSortIcon}</th><th>Nickname ${miSortIcon}</th><th class="mi-users-cell">Users ${miSortIcon}</th><th>Catalog no. ${miSortIcon}</th><th>Type ${miSortIcon}</th><th>Created date ${miSortIcon}</th><th>Actions</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>${miSuggestionActionBarMarkup("related")}` : miSuggestionZeroStateMarkup("related");
  return `<div class="mi-secondary-top mi-suggestions-top">${miTitleMarkup("Related systems", items.length, "System(s) below exist within Services Central, but are not added to your account. &nbsp;Add if relevant to you, or ignore. &nbsp;Hyperlinked items are already in your account.", miSegmentedMarkup(miSuggestionSegments(), "related"))}${miSearchMarkup("Search by instrument serial number or nickname")}</div>${content}${miSuggestionIgnoreDialogMarkup()}`;
}

function miSuggestionsInvitesPanel() {
  const items = MI_SUGGESTION_INVITE_ITEMS;
  const count = miSuggestionDisplayCount(items);
  const content = items.length ? `<button class="mi-select-all-link" type="button" data-mi-select-all-visible>Select all ${count} instruments</button><div class="mi-secondary-table-wrap mi-invites-table-wrap"><table class="mi-secondary-table mi-invites-table"><thead><tr><th><input type="checkbox" data-mi-suggestion-select-all aria-label="Select all installation invite suggestions" /></th><th></th><th></th><th>Serial number ${miSortIcon}</th><th>Nickname ${miSortIcon}</th><th class="mi-users-cell">Users ${miSortIcon}</th><th><button class="mi-header-select platform-table-catalog-filter" type="button"><span class="platform-table-catalog-filter__label" title="Catalog no.">Catalog no.</span><img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button></th><th><button class="mi-header-select" type="button">Type <img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button></th><th>Actions</th><th></th></tr></thead><tbody>${miSuggestionCommonRows(items, "invites")}</tbody></table></div>${miPaginationMarkup(count)}${miSuggestionActionBarMarkup("invites")}` : miSuggestionZeroStateMarkup("invites");
  return `<div class="mi-secondary-top mi-suggestions-top mi-invites-top">${miTitleMarkup("From installation invites", count, "The instrument(s) listed below were recently installed, and a member of your organization added you to the installation order while it was open.", miSegmentedMarkup(miSuggestionSegments(), "invites"))}</div>${content}${miSuggestionIgnoreDialogMarkup()}`;
}

function miSuggestionsPanel(state = "support") {
  if (isEuropeLePrototype()) {
    const titles = { support: "From support history", related: "Related systems", invites: "From installation invites" };
    const descriptions = {
      support: "Instruments below have support history associated with your email address, but are not yet added to your account.",
      related: "Systems below exist within Services Central, but are not added to your account.",
      invites: "Instruments listed below were recently installed and shared through an installation order.",
    };
    return `<div class="mi-secondary-top mi-suggestions-top">${miTitleMarkup(titles[state], 0, descriptions[state], miSegmentedMarkup(miSuggestionSegments(), state))}${miSearchMarkup("Search by instrument serial number or nickname")}</div>${miSuggestionZeroStateMarkup(state)}`;
  }
  return state === "related" ? miSuggestionsRelatedPanel() : state === "invites" ? miSuggestionsInvitesPanel() : miSuggestionsSupportPanel();
}

function miRemoveSuggestionItems(items, ids) {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (ids.includes(items[index].id)) items.splice(index, 1);
  }
}

function miAddSuggestionItems(segment, ids) {
  const items = miSuggestionItems(segment);
  const selected = items.filter((item) => ids.includes(item.id));
  selected.forEach((item) => {
    if (item.kind === "system") {
      item.components.forEach((component) => {
        if (miCurrentInstruments().some((instrument) => instrument.serial === component.serial)) return;
        miCurrentInstruments().push({ ...component, users: "1", group: "—", coverage: "Under contract", end: "30 Jun 2027", locked: false, pendingNew: true });
      });
      if (!miFindSystemById(item.systemId)) {
        MI_CREATED_SYSTEMS.push({
          id: item.systemId,
          nickname: item.nickname || "Suggested system",
          notes: "",
          typeCode: item.type,
          users: item.users || "1",
          locked: false,
          admin: false,
          components: item.components.map((component) => component.serial),
          pendingNew: true,
        });
      }
      return;
    }
    if (miCurrentInstruments().some((instrument) => instrument.serial === item.serial)) return;
    miCurrentInstruments().push({
      image: item.image,
      serial: item.serial,
      nickname: item.nickname || "—",
      users: item.users || "1",
      group: "—",
      model: item.model,
      coverage: "Under contract",
      end: "30 Jun 2027",
      locked: false,
      pendingNew: true,
    });
  });
  miRemoveSuggestionItems(items, ids);
  return selected.length;
}

function miRefreshSuggestions(segment) {
  render();
  app.querySelector('[data-mi-tab="suggestions"]')?.click();
  if (segment !== "support") app.querySelector(`[data-mi-segment="${segment}"]`)?.click();
}

function miRunSuggestionAction(segment, action, ids) {
  if (!ids.length) return;
  const objectLabel = segment === "related" ? "system(s)" : "instrument(s)";
  let count = ids.length;
  if (action === "add") count = miAddSuggestionItems(segment, ids);
  else miRemoveSuggestionItems(miSuggestionItems(segment), ids);
  miRefreshSuggestions(segment);
  showToast(`${count} ${objectLabel} ${action === "add" ? "added to My Instruments" : "ignored."}`, { title: "Success:", variant: "success" });
}

function wireMiSuggestionPanel(panel, segment = "support") {
  const actionbar = panel.querySelector("[data-mi-suggestion-actionbar]");
  const dialog = panel.querySelector("[data-mi-suggestion-ignore-dialog]");
  const items = miSuggestionItems(segment);
  let pendingIgnoreIds = [];
  panel.classList.toggle("mi-secondary-content--has-actionbar", Boolean(actionbar));
  panel.querySelector("[data-mi-view-instruments]")?.addEventListener("click", () => app.querySelector('[data-mi-tab="instruments"]')?.click());
  panel.querySelectorAll("[data-mi-suggestion-nickname]").forEach((input) => input.addEventListener("input", () => {
    const item = items.find((candidate) => candidate.id === input.dataset.miSuggestionNickname);
    if (item) item.nickname = input.value;
  }));

  const openIgnoreDialog = (ids) => {
    if (!ids.length || !dialog) return;
    pendingIgnoreIds = [...ids];
    dialog.querySelector("[data-mi-suggestion-ignore-title]").textContent = `Ignore ${ids.length} instrument(s)`;
    dialog.showModal();
    dialog.querySelector("[data-mi-suggestion-ignore-close]")?.focus();
  };
  dialog?.querySelectorAll("[data-mi-suggestion-ignore-close]").forEach((button) => button.addEventListener("click", () => dialog.close()));
  dialog?.querySelector("[data-mi-suggestion-ignore-confirm]")?.addEventListener("click", () => {
    dialog.close();
    miRunSuggestionAction(segment, "ignore", pendingIgnoreIds);
  });
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  panel.querySelectorAll("[data-mi-suggestion-row-action]").forEach((button) => button.addEventListener("click", () => {
    const ids = [button.dataset.miSuggestionId];
    const action = button.dataset.miSuggestionRowAction;
    if (action === "ignore" && segment !== "related") openIgnoreDialog(ids);
    else miRunSuggestionAction(segment, action, ids);
  }));
  if (!actionbar) return;

  const checkboxes = [...panel.querySelectorAll("[data-mi-suggestion-select]")];
  const selectAll = panel.querySelector("[data-mi-suggestion-select-all]");
  const actionButtons = [...actionbar.querySelectorAll("[data-mi-suggestion-bulk]")];
  const selectedIds = () => checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
  const sync = () => {
    const selected = selectedIds().length;
    actionButtons.forEach((button) => { button.disabled = selected === 0; });
    if (selectAll) {
      selectAll.checked = selected === checkboxes.length;
      selectAll.indeterminate = selected > 0 && selected < checkboxes.length;
    }
  };
  selectAll?.addEventListener("change", () => {
    checkboxes.forEach((checkbox) => { checkbox.checked = selectAll.checked; });
    sync();
  });
  checkboxes.forEach((checkbox) => checkbox.addEventListener("change", sync));
  actionButtons.forEach((button) => button.addEventListener("click", () => {
    const action = button.dataset.miSuggestionBulk;
    if (action === "ignore" && segment !== "related") openIgnoreDialog(selectedIds());
    else miRunSuggestionAction(segment, action, selectedIds());
  }));
  sync();
}

function wireMiTableSelection(table) {
  const selectAll = table?.querySelector("thead input[type='checkbox']");
  const rowCheckboxes = [...(table?.querySelectorAll("tbody input[type='checkbox']") || [])];
  if (!selectAll || rowCheckboxes.length === 0) return;
  const syncSelectAll = () => {
    const checkedCount = rowCheckboxes.filter((checkbox) => checkbox.checked).length;
    selectAll.checked = checkedCount === rowCheckboxes.length;
    selectAll.indeterminate = checkedCount > 0 && checkedCount < rowCheckboxes.length;
  };
  selectAll.addEventListener("change", () => {
    rowCheckboxes.forEach((checkbox) => { checkbox.checked = selectAll.checked; });
    syncSelectAll();
  });
  rowCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", syncSelectAll));
  syncSelectAll();
}

function renderMyInstrumentsTab(tabName, segmentState) {
  syncMiTabCounts();
  const instrumentsPanel = app.querySelector("[data-mi-instruments-panel]");
  const secondaryPanel = app.querySelector("[data-mi-secondary-panel]");
  const isInstruments = tabName === "instruments";
  instrumentsPanel.hidden = !isInstruments;
  secondaryPanel.hidden = isInstruments;
  if (isInstruments) return;
  const panels = { users: miUsersPanel, groups: miGroupsPanel, favorites: miFavoritesPanel, pending: miPendingPanel, suggestions: miSuggestionsPanel };
  secondaryPanel.innerHTML = panels[tabName](segmentState);
  secondaryPanel.classList.remove("mi-secondary-content--has-actionbar");
  secondaryPanel.setAttribute("aria-labelledby", `mi-${tabName}-tab`);
  secondaryPanel.querySelectorAll(".mi-secondary-table").forEach(wireMiTableSelection);
  secondaryPanel.querySelectorAll("[data-mi-system-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      const systemLabel = toggle.dataset.miSystemLabel || "System";
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.setAttribute("aria-label", `${expanded ? "Expand" : "Collapse"} ${systemLabel} system components`);
      secondaryPanel.querySelector("[data-mi-secondary-search]")?.dispatchEvent(new Event("input"));
    });
  });
  secondaryPanel.querySelector("[data-mi-secondary-search]")?.addEventListener("input", (event) => {
    const query = event.currentTarget.value.trim().toLowerCase();
    const collapsedSystems = new Set([...secondaryPanel.querySelectorAll('[data-mi-system-toggle][aria-expanded="false"]')].map((toggle) => toggle.dataset.miSystemToggle));
    secondaryPanel.querySelectorAll("[data-mi-secondary-row]").forEach((row) => {
      const hiddenBySearch = query !== "" && !row.dataset.search.toLowerCase().includes(query);
      row.hidden = hiddenBySearch || collapsedSystems.has(row.dataset.miSystemComponent);
    });
    secondaryPanel.querySelectorAll("[data-mi-grid-card], [data-mi-group-card]").forEach((card) => {
      card.hidden = query !== "" && !card.dataset.search.toLowerCase().includes(query);
    });
  });
  secondaryPanel.querySelectorAll(".mi-favorite").forEach((button) => button.addEventListener("click", () => toggleMiFavorite(button)));
  secondaryPanel.querySelectorAll(".mi-view-toggle button").forEach((button) => button.addEventListener("click", () => {
    button.parentElement.querySelectorAll("button").forEach((candidate) => {
      const selected = candidate === button;
      candidate.classList.toggle("is-selected", selected);
      candidate.setAttribute("aria-pressed", String(selected));
    });
    if (tabName === "favorites") {
      miFavoritesView = button.dataset.miView || "list";
      secondaryPanel.querySelector("[data-mi-favorites-list]").hidden = miFavoritesView === "grid";
      secondaryPanel.querySelector("[data-mi-favorites-grid]").hidden = miFavoritesView !== "grid";
    } else if (tabName === "groups") {
      miGroupsView = button.dataset.miView || "list";
      secondaryPanel.querySelector("[data-mi-groups-list]").hidden = miGroupsView === "grid";
      secondaryPanel.querySelector("[data-mi-groups-grid]").hidden = miGroupsView !== "grid";
    }
  }));
  secondaryPanel.querySelectorAll("[data-mi-system-quickview]").forEach((button) => button.addEventListener("click", () => {
    const system = miFindSystemById(button.dataset.miSystemQuickview);
    if (system) openMiSystemQuickview(system);
  }));
  secondaryPanel.querySelector("[data-mi-create-group-direct]")?.addEventListener("click", () => { resetMiGroupBuilder(); openMiDialog(miCreateGroupDialog); });
  secondaryPanel.querySelectorAll("[data-mi-segment]").forEach((button) => button.addEventListener("click", () => activateMyInstrumentsSegment(tabName, button.dataset.miSegment, { pushHistory: true })));
  if (tabName === "pending") wireMiPendingPanel(secondaryPanel, segmentState || "shared");
  if (tabName === "suggestions") wireMiSuggestionPanel(secondaryPanel, segmentState || "support");
  secondaryPanel.querySelector("[data-mi-select-all-visible]")?.addEventListener("click", () => {
    const selectAll = secondaryPanel.querySelector("thead input[type='checkbox']");
    if (!selectAll) return;
    selectAll.checked = true;
    selectAll.dispatchEvent(new Event("change"));
  });
  wireMiActionMenus(secondaryPanel);
  secondaryPanel.querySelectorAll("[data-mi-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.miToast)));
  wireRouteControls();
}

const MI_HISTORY_TABS = new Set(["instruments", "users", "groups", "favorites", "pending", "suggestions"]);
const MI_HISTORY_SEGMENTS = {
  pending: new Set(["shared", "awaiting", "access"]),
  suggestions: new Set(["support", "related", "invites"]),
};
const MI_DEFAULT_SEGMENTS = { pending: "shared", suggestions: "support" };

function miHistoryTab() {
  const tab = new URL(window.location.href).searchParams.get("instruments-tab") || "instruments";
  return MI_HISTORY_TABS.has(tab) ? tab : "instruments";
}

function miHistorySegment(tabName) {
  const fallback = MI_DEFAULT_SEGMENTS[tabName];
  if (!fallback) return undefined;
  const segment = new URL(window.location.href).searchParams.get("instruments-section") || fallback;
  return MI_HISTORY_SEGMENTS[tabName].has(segment) ? segment : fallback;
}

function activateMyInstrumentsSegment(tabName, segment, { pushHistory = false } = {}) {
  const validSegments = MI_HISTORY_SEGMENTS[tabName];
  if (!validSegments) return;
  const safeSegment = validSegments.has(segment) ? segment : MI_DEFAULT_SEGMENTS[tabName];
  renderMyInstrumentsTab(tabName, safeSegment);
  if (!pushHistory || miHistorySegment(tabName) === safeSegment) return;
  const nextUrl = new URL(window.location.href);
  if (safeSegment === MI_DEFAULT_SEGMENTS[tabName]) nextUrl.searchParams.delete("instruments-section");
  else nextUrl.searchParams.set("instruments-section", safeSegment);
  window.history.pushState({ fromRoute: "my-instruments", instrumentsTab: tabName, instrumentsSection: safeSegment }, "", nextUrl);
}

function activateMyInstrumentsTab(tabName, { pushHistory = false } = {}) {
  const safeTab = MI_HISTORY_TABS.has(tabName) ? tabName : "instruments";
  app.querySelectorAll(".mi-tabs [role='tab']").forEach((candidate) => {
    const selected = candidate.dataset.miTab === safeTab;
    candidate.classList.toggle("is-active", selected);
    candidate.setAttribute("aria-selected", String(selected));
  });
  renderMyInstrumentsTab(safeTab, miHistorySegment(safeTab));
  if (!pushHistory || miHistoryTab() === safeTab) return;
  const nextUrl = new URL(window.location.href);
  if (safeTab === "instruments") nextUrl.searchParams.delete("instruments-tab");
  else nextUrl.searchParams.set("instruments-tab", safeTab);
  nextUrl.searchParams.delete("instruments-section");
  window.history.pushState({ fromRoute: "my-instruments", instrumentsTab: safeTab }, "", nextUrl);
}

function syncMiColumnDialog() {
  if (miEditColumnsDialog.dataset.editColumnsContext === "support-history" || !miEditColumnsDialog.querySelector("[data-mi-column]")) {
    miEditColumnsDialog.querySelector("tbody").innerHTML = miEditColumnsDefaultRowsMarkup;
    delete miEditColumnsDialog.dataset.editColumnsContext;
  }
  miEditColumnsDialog.querySelectorAll("[data-mi-column]").forEach((checkbox) => {
    checkbox.checked = checkbox.disabled || miVisibleColumns.has(checkbox.dataset.miColumn);
  });
}

function applyMiColumnVisibility() {
  const table = app.querySelector(".mi-table");
  if (!table) return;
  table.querySelectorAll("[data-mi-table-column]").forEach((element) => {
    const visible = miVisibleColumns.has(element.dataset.miTableColumn);
    element.hidden = !visible;
    if (element.tagName === "COL") element.style.display = visible ? "" : "none";
  });
  table.style.width = "100%";
}

function wireMyInstruments() {
  syncMiTabCounts();
  const rowsContainer = app.querySelector("[data-mi-rows]");
  const systems = miCurrentSystems();
  const systemComponents = new Set(systems.flatMap((system) => system.components));
  const standaloneInstruments = miCurrentInstruments().filter((instrument) => !systemComponents.has(instrument.serial) && !MI_REMOVED_INSTRUMENTS.has(instrument.serial));
  const newStandaloneInstruments = standaloneInstruments.filter((instrument) => instrument.pendingNew);
  const existingStandaloneInstruments = standaloneInstruments.filter((instrument) => !instrument.pendingNew);
  const gridCards = app.querySelector("[data-mi-grid-cards]");
  if (isMainCmdExperience()) {
    const standardInstruments = existingStandaloneInstruments.filter((instrument) => !instrument.image.startsWith("le/"));
    const leInstruments = existingStandaloneInstruments.filter((instrument) => instrument.image.startsWith("le/"));
    const orderedAssets = newStandaloneInstruments.map((instrument) => ({ kind: "instrument", value: instrument }));
    const length = Math.max(standardInstruments.length, systems.length, leInstruments.length);
    for (let index = 0; index < length; index += 1) {
      if (standardInstruments[index]) orderedAssets.push({ kind: "instrument", value: standardInstruments[index] });
      if (systems[index]) orderedAssets.push({ kind: "system", value: systems[index] });
      if (leInstruments[index]) orderedAssets.push({ kind: "instrument", value: leInstruments[index] });
    }
    rowsContainer.innerHTML = orderedAssets.map(({ kind, value }) => kind === "system" ? miCreatedSystemRowsMarkup(value, false) : instrumentRowMarkup(value)).join("");
    gridCards.innerHTML = orderedAssets.map(({ kind, value }) => kind === "system" ? miCreatedSystemCardMarkup(value) : miGridCardMarkup(value)).join("");
  } else {
    rowsContainer.innerHTML = newStandaloneInstruments.map(instrumentRowMarkup).join("") + systems.map((system) => miCreatedSystemRowsMarkup(system)).join("") + existingStandaloneInstruments.map(instrumentRowMarkup).join("");
    gridCards.innerHTML = newStandaloneInstruments.map((instrument) => miGridCardMarkup(instrument)).join("") + systems.map(miCreatedSystemCardMarkup).join("") + existingStandaloneInstruments.map((instrument) => miGridCardMarkup(instrument)).join("");
  }
  const updateCount = () => {
    const visible = [...app.querySelectorAll("[data-mi-row]")].filter((row) => !row.hidden).length;
    app.querySelector("[data-mi-count]").textContent = String(visible);
  };
  updateCount();
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  app.querySelector("[data-mi-edit-columns]").addEventListener("click", () => {
    syncMiColumnDialog();
    miEditColumnsDialog.querySelector("[data-mi-column-search]").value = "";
    miEditColumnsDialog.querySelectorAll("[data-mi-column-row]").forEach((row) => { row.hidden = false; });
    miEditColumnsDialog.querySelector(".mi-edit-columns-modal__table-wrap").scrollTop = 0;
    miEditColumnsDialog.showModal();
    miEditColumnsDialog.querySelector("[data-mi-column-search]").focus({ preventScroll: true });
  });
  applyMiColumnVisibility();
  app.querySelector("[data-mi-search]").addEventListener("input", (event) => {
    const query = event.currentTarget.value.trim().toLowerCase();
    app.querySelectorAll("[data-mi-row]").forEach((row) => {
      row.hidden = query !== "" && !row.dataset.search.toLowerCase().includes(query);
    });
    const collapsedSystems = new Set([...app.querySelectorAll('[data-mi-system-toggle][aria-expanded="false"]')].map((toggle) => toggle.dataset.miSystemToggle));
    app.querySelectorAll("[data-mi-system-component]").forEach((row) => {
      const hiddenBySearch = query !== "" && !row.dataset.search.toLowerCase().includes(query);
      row.hidden = hiddenBySearch || collapsedSystems.has(row.dataset.miSystemComponent);
    });
    app.querySelectorAll("[data-mi-grid-card]").forEach((card) => {
      card.hidden = query !== "" && !card.dataset.search.toLowerCase().includes(query);
    });
    updateCount();
  });
  wireMiTableSelection(app.querySelector(".mi-table"));
  app.querySelectorAll("[data-mi-system-toggle]").forEach((toggle) => toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    toggle.setAttribute("aria-label", `${expanded ? "Expand" : "Collapse"} ${toggle.dataset.miSystemLabel} system components`);
    app.querySelector("[data-mi-search]").dispatchEvent(new Event("input"));
  }));
  app.querySelectorAll("[data-mi-system-quickview]").forEach((button) => button.addEventListener("click", () => {
    const system = miFindSystemById(button.dataset.miSystemQuickview);
    if (system) openMiSystemQuickview(system);
  }));
  app.querySelectorAll(".mi-favorite").forEach((button) => {
    button.addEventListener("click", () => toggleMiFavorite(button));
  });
  app.querySelectorAll(".mi-tabs [role='tab']").forEach((tab) => {
    tab.addEventListener("click", () => activateMyInstrumentsTab(tab.dataset.miTab, { pushHistory: true }));
  });
  app.querySelectorAll(".mi-view-toggle button").forEach((button) => {
    button.addEventListener("click", () => {
      app.querySelectorAll(".mi-view-toggle button").forEach((candidate) => candidate.classList.toggle("is-selected", candidate === button));
      const gridSelected = button.dataset.miView === "grid";
      app.querySelector(".mi-table-scroll").hidden = gridSelected;
      app.querySelector("[data-mi-grid-view]").hidden = !gridSelected;
    });
  });
  app.querySelectorAll(".mi-grid-filters button").forEach((button) => button.addEventListener("click", () => showToast(`${button.textContent.trim()} filter opened`)));
  wireMiActionMenus(app);
  wireMyInstrumentActions();
  app.querySelectorAll("[data-mi-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.miToast)));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  activateMyInstrumentsTab(miHistoryTab());
}

function renderMyInstruments() {
  const template = document.querySelector("#my-instruments-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountTopbarSc();
  mountPlatformSidebar("my-instruments");
  mountFooter();
  if (isEuropeLePrototype()) {
    const createControl = app.querySelector(".mi-create");
    if (createControl) {
      const createGroupButton = document.createElement("button");
      createGroupButton.type = "button";
      createGroupButton.className = "mi-button";
      createGroupButton.dataset.miCreateGroupLe = "";
      createGroupButton.textContent = "Create group";
      createControl.replaceWith(createGroupButton);
    }
  }
  if (shouldShowAccountEmptyState()) {
    applyUnmappedInstruments();
    window.PlatformSidebar?.wire(app);
    wireRouteControls();
  } else {
    wireMyInstruments();
  }
  document.title = "My instruments — Services Central";
}

function miUserDetailMarkup(user) {
  const instruments = user.instruments.map((index) => miCurrentInstruments()[index]).filter((instrument) => !MI_REMOVED_INSTRUMENTS.has(instrument.serial));
  const system = miCurrentSystems()[0];
  const systemKey = system ? `user-system-${system.id}` : "";
  const systemComponents = system ? system.components.map((serial) => miCurrentInstruments().find((instrument) => instrument.serial === serial)).filter((instrument) => instrument && !MI_REMOVED_INSTRUMENTS.has(instrument.serial)) : [];
  const systemGroups = system ? MI_GROUPS.filter((group) => group.members?.includes(`system:${system.id}`)).map((group) => group.name).join(", ") : "";
  const systemAccessKey = system ? `system:${system.id}` : "";
  const systemRole = system ? miRoleForAsset(systemAccessKey, user.email, system) : "User";
  const systemRow = system ? `<tr class="mi-system-row" data-mi-user-instrument data-search="System ${system.nickname} ${system.typeCode}">
    <td>${miRoleBadge(systemRole === "Admin", { accessKey: systemAccessKey, email: user.email, editable: miIsAdmin(system) })}</td>
    <td><button class="mi-row-chevron mi-system-toggle" type="button" data-mi-user-system-toggle="${systemKey}" aria-expanded="true" aria-label="Collapse ${system.nickname} system components"><img src="assets/icons/directions/chevron down/size=16px, style=mono.svg" alt="" /></button></td>
    <td><img class="mi-system-mark" src="assets/icons/science/system/size=24px, style=mono.svg" alt="" /></td><td>${miLockMarkup(system.locked)}</td>
    <td><button class="mi-link" type="button" data-route="system-detail-${system.id}">System</button></td><td>${system.nickname}</td><td>${systemGroups}</td>
    <td><button class="mi-icon-action" type="button" data-mi-remove-user-instrument data-mi-user-system-remove="${systemKey}" aria-label="Remove ${system.nickname}"><img src="assets/icons/actions/delete/size=16px, style=bold.svg" alt="" /></button></td>
  </tr>` : "";
  const systemChildren = systemComponents.map((instrument, index) => `<tr class="mi-child-row ${index === systemComponents.length - 1 ? "mi-child-row--last" : ""}" data-mi-user-system-component="${systemKey}" data-search="${instrument.serial} ${instrument.nickname}">
    <td></td><td>${miBranchIcon}</td><td><img class="mi-product" src="assets/instruments/${instrument.image}" alt="" /></td><td></td>
    <td><button class="mi-link" type="button" data-route="${miInstrumentDetailRoute(instrument.serial)}">${instrument.serial}</button></td><td>${instrument.nickname}</td><td>${instrument.group === "—" ? "" : instrument.group}</td><td></td>
  </tr>`).join("");
  const rows = instruments.map((instrument) => {
    const accessKey = `instrument:${instrument.serial}`;
    const role = miRoleForAsset(accessKey, user.email, instrument);
    return `<tr data-mi-user-instrument data-search="${instrument.serial} ${instrument.nickname}">
    <td>${miRoleBadge(role === "Admin", { accessKey, email: user.email, editable: miIsAdmin(instrument) })}</td>
    <td></td>
    <td><img class="mi-product" src="assets/instruments/${instrument.image}" alt="" /></td>
    <td>${miLockMarkup(instrument.locked)}</td>
    <td><button class="mi-link" type="button" data-route="${miInstrumentDetailRoute(instrument.serial)}">${instrument.serial}</button></td>
    <td>${instrument.nickname}</td>
    <td>${instrument.group === "—" ? "" : instrument.group}</td>
    <td><button class="mi-icon-action" type="button" data-mi-remove-user-instrument aria-label="Remove ${instrument.serial}"><img src="assets/icons/actions/delete/size=16px, style=bold.svg" alt="" /></button></td>
  </tr>`;
  }).join("");
  return `<div class="mi-user-detail">
    <header class="mi-user-detail__top">
      <div class="mi-user-detail__heading"><div class="mi-user-detail__title"><button type="button" data-mi-user-back>Users</button><img src="assets/icons/directions/caret right/right caret.svg" alt="" /><h2>${user.email}</h2><span data-mi-user-count>${instruments.length + (system ? 1 : 0)} instruments</span></div><p>Instruments that are common between you and ${user.email}</p></div>
      <div class="mi-user-detail__actions"><button class="mi-button mi-user-detail__more" type="button" data-mi-toast="More user actions opened">More actions<img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button><button class="mi-button" type="button" data-mi-toast="Share with ${user.email} opened">Share</button></div>
      ${miSearchMarkup("Search by instrument serial number or nickname")}
    </header>
    <div class="mi-secondary-table-wrap mi-user-detail__table-wrap"><table class="mi-secondary-table mi-user-detail__table"><thead><tr><th><span class="mi-user-role-header"><img src="assets/icons/notifications/info/size=16px, style=bold.svg" alt="" />User’s role</span> ${miSortIcon}</th><th></th><th></th><th></th><th>Serial number ${miSortIcon}</th><th>Nickname ${miSortIcon}</th><th></th><th>Remove</th></tr></thead><tbody>${systemRow}${systemChildren}${rows}</tbody></table></div>
  </div>`;
}

function renderMiUserDetail(route) {
  const slug = route.replace(/^user-detail-/, "");
  const user = MI_USERS.find((candidate) => candidate.slug === slug);
  if (!user) {
    setRoute("my-instruments");
    return;
  }
  const template = document.querySelector("#my-instruments-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountTopbarSc();
  mountPlatformSidebar("my-instruments");
  mountFooter();
  app.querySelector("[data-mi-instruments-panel]").hidden = true;
  const secondaryPanel = app.querySelector("[data-mi-secondary-panel]");
  secondaryPanel.hidden = false;
  secondaryPanel.setAttribute("aria-labelledby", "mi-users-tab");
  secondaryPanel.innerHTML = miUserDetailMarkup(user);
  app.querySelectorAll(".mi-tabs [role='tab']").forEach((tab) => {
    const selected = tab.dataset.miTab === "users";
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.addEventListener("click", () => {
      const targetTab = tab.dataset.miTab;
      setRoute("my-instruments");
      if (targetTab !== "instruments") app.querySelector(`[data-mi-tab="${targetTab}"]`)?.click();
    });
  });
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("my-instruments"));
  app.querySelector("[data-mi-user-back]").addEventListener("click", () => {
    setRoute("my-instruments");
    app.querySelector('[data-mi-tab="users"]')?.click();
  });
  app.querySelector("[data-mi-secondary-search]").addEventListener("input", (event) => {
    const query = event.currentTarget.value.trim().toLowerCase();
    const collapsedSystems = new Set([...app.querySelectorAll('[data-mi-user-system-toggle][aria-expanded="false"]')].map((toggle) => toggle.dataset.miUserSystemToggle));
    app.querySelectorAll("[data-mi-user-instrument]").forEach((row) => { row.hidden = query !== "" && !row.dataset.search.toLowerCase().includes(query); });
    app.querySelectorAll("[data-mi-user-system-component]").forEach((row) => { row.hidden = collapsedSystems.has(row.dataset.miUserSystemComponent) || (query !== "" && !row.dataset.search.toLowerCase().includes(query)); });
  });
  app.querySelectorAll("[data-mi-user-system-toggle]").forEach((toggle) => toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    toggle.setAttribute("aria-label", `${expanded ? "Expand" : "Collapse"} system components`);
    app.querySelector("[data-mi-secondary-search]").dispatchEvent(new Event("input"));
  }));
  app.querySelectorAll("[data-mi-remove-user-instrument]").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.miUserSystemRemove) app.querySelectorAll(`[data-mi-user-system-component="${button.dataset.miUserSystemRemove}"]`).forEach((row) => row.remove());
    button.closest("tr").remove();
    const count = app.querySelectorAll("[data-mi-user-instrument]").length;
    app.querySelector("[data-mi-user-count]").textContent = `${count} instrument${count === 1 ? "" : "s"}`;
    showToast("Instrument access removed");
  }));
  app.querySelectorAll("[data-mi-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.miToast)));
  wireMiRoleSelectors(secondaryPanel, () => renderMiUserDetail(routeFromHash()));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = `${user.email} — Services Central`;
}

function miGroupInstruments(group) {
  if (group.id === 0) return miCurrentInstruments().filter((instrument) => !MI_REMOVED_INSTRUMENTS.has(instrument.serial)).slice(0, 4);
  const size = 3 + (group.id % 5);
  const start = (group.id * 4) % miCurrentInstruments().length;
  return [...miCurrentInstruments().slice(start), ...miCurrentInstruments().slice(0, start)]
    .filter((instrument) => !MI_REMOVED_INSTRUMENTS.has(instrument.serial))
    .slice(0, size);
}

function miGroupDetailMarkup(group) {
  const instruments = miGroupInstruments(group);
  const instrumentRow = (instrument, extra = "", removable = true, favoritable = true) => `<tr ${extra} data-mi-group-instrument data-search="${instrument.serial} ${instrument.nickname} ${instrument.model}">
    <td>${favoritable ? miFavoriteButton(instrument.serial, false, `instrument:${instrument.serial}`) : ""}</td>
    <td>${favoritable ? "" : miBranchIcon}</td>
    <td><img class="mi-product" src="assets/instruments/${instrument.image}" alt="" /></td>
    <td>${favoritable ? miLockMarkup(instrument.locked) : ""}</td>
    <td><button class="mi-link" type="button" data-route="${miInstrumentDetailRoute(instrument.serial)}">${instrument.serial}</button></td>
    <td>${instrument.nickname}</td>
    <td class="mi-users-cell">${favoritable ? miUserCountMarkup(instrument.users, `instrument:${instrument.serial}`) : ""}</td>
    <td>${miInstrumentType(instrument)}</td>
    <td>${instrument.model}</td>
    <td>${removable ? `<button class="mi-icon-action" type="button" data-mi-remove-group-instrument aria-label="Remove ${instrument.serial} from ${group.name}"><img src="assets/icons/actions/delete/size=16px, style=bold.svg" alt="" /></button>` : ""}</td>
  </tr>`;
  const rows = group.members ? group.members.map((member) => {
    if (member.startsWith("instrument:")) {
      const instrument = miCurrentInstruments().find((candidate) => candidate.serial === member.replace("instrument:", ""));
      return instrument && !MI_REMOVED_INSTRUMENTS.has(instrument.serial) ? instrumentRow(instrument) : "";
    }
    const system = miFindSystemById(member.replace("system:", ""));
    if (!system) return "";
    const key = `group-system-${system.id}`;
    const components = system.components.map((serial) => miCurrentInstruments().find((candidate) => candidate.serial === serial)).filter((instrument) => instrument && !MI_REMOVED_INSTRUMENTS.has(instrument.serial));
    const parent = `<tr class="mi-system-row" data-mi-group-instrument data-search="System ${system.nickname} ${system.typeCode}"><td>${miFavoriteButton(system.nickname, false, `system:${system.id}`)}</td><td><button class="mi-row-chevron mi-system-toggle" type="button" data-mi-system-toggle="${key}" data-mi-system-label="${system.nickname}" aria-expanded="true" aria-label="Collapse ${system.nickname} system components"><img src="assets/icons/directions/chevron down/size=16px, style=mono.svg" alt="" /></button></td><td><img class="mi-system-mark" src="assets/icons/science/system/size=24px, style=mono.svg" alt="" /></td><td>${miLockMarkup(system.locked)}</td><td><button class="mi-link" type="button" data-route="system-detail-${system.id}">System</button></td><td>${system.nickname}</td><td class="mi-users-cell">${miUserCountMarkup(miSystemUserCount(system), `system:${system.id}`)}</td><td>${system.typeCode}</td><td>—</td><td><button class="mi-icon-action" type="button" data-mi-remove-group-instrument aria-label="Remove ${system.nickname} from ${group.name}"><img src="assets/icons/actions/delete/size=16px, style=bold.svg" alt="" /></button></td></tr>`;
    const children = components.map((instrument, index) => instrumentRow(instrument, `class="mi-child-row ${index === components.length - 1 ? "mi-child-row--last" : ""}" data-mi-system-component="${key}"`, false, false)).join("");
    return parent + children;
  }).join("") : instruments.map((instrument) => instrumentRow(instrument)).join("");
  const itemCount = group.members ? group.members.length : instruments.length;
  return `<div class="mi-group-detail">
    <header class="mi-group-detail__top">
      <div class="mi-group-detail__heading"><div class="mi-group-detail__title"><button type="button" data-mi-group-back>Groups</button><img src="assets/icons/directions/caret right/right caret.svg" alt="" /><h2>${group.name}</h2><span data-mi-group-count>${itemCount} items</span></div><p>${group.description || "Groups are personal and not shared."}</p></div>
      <div class="mi-group-detail__actions"><button class="mi-button mi-group-detail__more" type="button" data-mi-toast="More group actions opened">More actions<img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button><button class="mi-button" type="button" data-mi-toast="Edit ${group.name} opened">Edit group</button></div>
      ${miSearchMarkup("Search by instrument serial number or nickname")}
    </header>
    <div class="mi-secondary-table-wrap mi-group-detail__table-wrap"><table class="mi-secondary-table mi-group-detail__table"><thead><tr><th>Favorite ${miSortIcon}</th><th></th><th></th><th></th><th>Serial number ${miSortIcon}</th><th>Nickname ${miSortIcon}</th><th class="mi-users-cell">Users ${miSortIcon}</th><th>Type ${miSortIcon}</th><th>Catalog no. ${miSortIcon}</th><th>Remove</th></tr></thead><tbody>${rows}</tbody></table></div>
  </div>`;
}

function renderMiGroupDetail(route) {
  const groupId = Number(route.replace(/^group-detail-/, ""));
  const group = MI_GROUPS.find((candidate) => candidate.id === groupId);
  if (!group) {
    setRoute("my-instruments");
    return;
  }
  const template = document.querySelector("#my-instruments-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountTopbarSc();
  mountPlatformSidebar("my-instruments");
  mountFooter();
  app.querySelector("[data-mi-instruments-panel]").hidden = true;
  const secondaryPanel = app.querySelector("[data-mi-secondary-panel]");
  secondaryPanel.hidden = false;
  secondaryPanel.setAttribute("aria-labelledby", "mi-groups-tab");
  secondaryPanel.innerHTML = miGroupDetailMarkup(group);
  app.querySelectorAll(".mi-tabs [role='tab']").forEach((tab) => {
    const selected = tab.dataset.miTab === "groups";
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.addEventListener("click", () => {
      const targetTab = tab.dataset.miTab;
      setRoute("my-instruments");
      if (targetTab !== "instruments") app.querySelector(`[data-mi-tab="${targetTab}"]`)?.click();
    });
  });
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("my-instruments"));
  app.querySelector("[data-mi-group-back]").addEventListener("click", () => {
    setRoute("my-instruments");
    app.querySelector('[data-mi-tab="groups"]')?.click();
  });
  app.querySelector("[data-mi-secondary-search]").addEventListener("input", (event) => {
    const query = event.currentTarget.value.trim().toLowerCase();
    const collapsedSystems = new Set([...app.querySelectorAll('[data-mi-system-toggle][aria-expanded="false"]')].map((toggle) => toggle.dataset.miSystemToggle));
    app.querySelectorAll("[data-mi-group-instrument]").forEach((row) => {
      const hiddenBySearch = query !== "" && !row.dataset.search.toLowerCase().includes(query);
      row.hidden = hiddenBySearch || collapsedSystems.has(row.dataset.miSystemComponent);
    });
  });
  app.querySelectorAll("[data-mi-system-toggle]").forEach((toggle) => toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    toggle.setAttribute("aria-label", `${expanded ? "Expand" : "Collapse"} ${toggle.dataset.miSystemLabel} system components`);
    app.querySelector("[data-mi-secondary-search]").dispatchEvent(new Event("input"));
  }));
  app.querySelectorAll("[data-mi-remove-group-instrument]").forEach((button) => button.addEventListener("click", () => {
    const row = button.closest("tr");
    const systemKey = row.querySelector("[data-mi-system-toggle]")?.dataset.miSystemToggle;
    row.remove();
    if (systemKey) app.querySelectorAll(`[data-mi-system-component="${systemKey}"]`).forEach((child) => child.remove());
    const count = app.querySelectorAll("[data-mi-group-instrument]:not([data-mi-system-component])").length;
    app.querySelector("[data-mi-group-count]").textContent = `${count} item${count === 1 ? "" : "s"}`;
    showToast("Instrument removed from group");
  }));
  app.querySelectorAll(".mi-favorite").forEach((button) => button.addEventListener("click", () => toggleMiFavorite(button)));
  app.querySelectorAll("[data-mi-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.miToast)));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = `${group.name} — Services Central`;
}

const INSTRUMENT_1009996_TICKETS = [
  ["open", "Open", "5551726344", "Service Request", "18 Oct 2020", "---", "Won’t turn on", "Alma Malmbe"],
  ["progress", "In progress", "46521863", "Service Request", "18 Oct 2020", "---", "Repair 0000123459 instrument parts", "Alma Malmbe", true],
  ["progress", "In progress", "46927364", "PM (Contract)", "18 Oct 2020", "---", "Preventive Maintenance - 0012345L", "Alma Malmbe"],
  ["progress", "In progress", "46521888", "Inquiry", "18 Oct 2020", "---", "Repair 0000123459 instrument parts", "Alma Malmbe"],
  ["progress", "In progress", "46927364", "Service Request", "18 Oct 2020", "---", "Repair 0000123459 instrument parts", "Alma Malmbe"],
  ["progress", "In progress", "46719836", "Inquiry", "12 May 2020", "---", "Need support for unknown instrument…", "Alma Malmbe"],
  ["progress", "In progress", "46075402", "Inquiry", "12 May 2020", "---", "Need support for unknown instrument…", "Alma Malmbe"],
  ["progress", "In progress", "46917372", "Inquiry", "12 May 2020", "---", "Need support for unknown instrument…", "Alma Malmbe"],
  ["progress", "In progress", "46003524", "Depot Repair", "12 May 2020", "---", "Need support for unknown instrument…", "Tyler Durden"],
  ["closed", "Closed", "46195527", "PM (Contract)", "23 Jan 2019", "23 Jan 2019", "Preventive Maintenance 00000", "Tyler Durden"],
  ["testing", "Customer testing", "46939573", "Inquiry", "23 Jan 2019", "23 Jan 2019", "Need calibration", "Tyler Durden"],
  ["testing", "Customer not ready", "46074658", "Service Request", "23 Jan 2019", "23 Jan 2019", "Need calibration", "Tyler Durden"],
  ["closed", "Closed", "46884635", "Service Request", "23 Jan 2019", "23 Jan 2019", "Need calibration", "Tyler Durden"],
  ["closed", "Closed", "46626384", "Inquiry", "23 Jan 2019", "23 Jan 2019", "Need calibration", "Tyler Durden"],
  ["closed", "Closed", "46977462", "Tech Support", "23 Jan 2019", "23 Jan 2019", "Need calibration", "Tyler Durden"],
  ["closed", "Closed", "46118377", "PM (Contract)", "23 Jan 2019", "23 Jan 2019", "Need calibration", "Tyler Durden"],
  ["closed", "Closed", "46000283", "PM (Contract)", "23 Jan 2019", "23 Jan 2019", "Need calibration", "Tyler Durden"],
  ["closed", "Closed", "46993746", "Inquiry", "23 Jan 2019", "23 Jan 2019", "Need calibration", "Tyler Durden"],
  ["closed", "Closed", "46296730", "Inquiry", "23 Jan 2019", "23 Jan 2019", "Need calibration", "Tyler Durden"],
  ["closed", "Closed", "46434295", "Installation", "23 Jan 2019", "23 Jan 2019", "Need calibration", "Tyler Durden"],
];

function renderMiSystemDetail(route) {
  const systemId = route.replace(/^system-detail-/, "");
  const system = miFindSystemById(systemId);
  if (!system) {
    setRoute("my-instruments");
    return;
  }
  const systemFavoriteKey = `system:${system.id}`;
  const systemIsFavorite = miIsFavorite(systemFavoriteKey);
  const components = system.components.map((serial) => miCurrentInstruments().find((instrument) => instrument.serial === serial)).filter(Boolean);
  const systemGroups = MI_GROUPS.filter((group) => group.members?.includes(`system:${system.id}`));
  app.innerHTML = `<section class="screen screen--system-detail" aria-label="${system.nickname} system details">
    <div class="flow-toolbar"><button type="button" data-go-back>Back</button><strong>${system.nickname}</strong><div class="flow-toolbar__actions"><button type="button" data-route="dashboard">Dashboard</button><button type="button" data-open-flows>All flows</button></div></div>
    <div class="id-stage"><div class="mi-shell sd-shell">
      <div data-topbar-sc-mount></div><div data-platform-sidebar-mount></div>
      <main class="platform-page-body sd-main">
        <section class="sd-hero" data-platform-titlebar aria-label="System summary">
          <div class="sd-actions"><button type="button" data-route="consumables">Order consumables</button><div class="sd-action-menu-wrap"><button type="button" data-sd-more-actions aria-haspopup="menu" aria-expanded="false">More actions <img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button><div class="sd-action-menu" role="menu" data-sd-action-menu hidden>
            <button type="button" role="menuitem" data-sd-action="edit-system"><img src="assets/icons/science/system/size=24px, style=mono.svg" alt="" /><span>Edit system</span></button>
            <button type="button" role="menuitem" data-sd-action="edit-nickname"><img src="assets/icons/actions/edit/size=24px, style=mono.svg" alt="" /><span>Edit nickname</span></button>
            <button type="button" role="menuitem" data-sd-action="add-group"><img src="assets/icons/science/2 instruments/size=24px, style=mono.svg" alt="" /><span>Add to group</span></button>
            ${!system.locked || miIsAdmin(system) ? '<button type="button" role="menuitem" data-sd-action="share"><img src="assets/icons/actions/share/Size=24px, Style=Mono.svg" alt="" /><span>Share</span></button>' : ""}
            <button type="button" role="menuitem" data-sd-action="favorite"><img src="${miFavoriteIcon(systemIsFavorite, 24)}" alt="" /><span>${systemIsFavorite ? "Remove favorite" : "Favorite"}</span></button>
            ${!system.locked || miIsAdmin(system) ? `<button type="button" role="menuitem" data-sd-action="access"><img src="assets/icons/actions/lock ${system.locked ? "open" : "closed"}/size=24px, style=mono.svg" alt="" /><span>${system.locked ? "Unrestrict access" : "Restrict access"}</span></button>` : ""}
            <hr />
            <button class="sd-action-menu__destructive" type="button" role="menuitem" data-sd-action="remove"><img src="assets/icons/actions/bin/size=24px, style=mono.svg" alt="" /><span><b>Remove system</b><small>Remove system from my account only</small></span></button>
            <button class="sd-action-menu__destructive" type="button" role="menuitem" data-sd-action="dismantle"><img src="assets/icons/science/system dismantle/size=24px, style=mono.svg" alt="" /><span><b>Dismantle system</b><small>Dismantling configuration will apply to all users</small></span></button>
          </div></div><button class="sd-primary" type="button" data-route="request-support">Start a request</button></div>
          <div class="sd-summary"><h1><span data-sd-nickname>${system.nickname}</span><button type="button" data-sd-edit="nickname" aria-label="Edit system nickname"><img src="assets/icons/actions/edit/size=16px, style=mono.svg" alt="" /></button></h1><div class="sd-facts"><div><strong>System type <button type="button" data-sd-edit="type" aria-label="Edit system type"><img src="assets/icons/actions/edit/size=16px, style=mono.svg" alt="" /></button></strong><span data-sd-type>${system.typeCode}</span></div><div><strong>Groups</strong><span class="sd-system-groups">${systemGroups.length ? systemGroups.map((group) => `<button type="button" data-route="group-detail-${group.id}">${group.name}</button>`).join(", ") : "—"}</span></div><div><strong>Notes <button type="button" data-sd-edit="notes" aria-label="Edit system notes"><img src="assets/icons/actions/edit/size=16px, style=mono.svg" alt="" /></button></strong><span data-sd-notes>${system.notes || "—"}</span></div></div></div>
        </section>
        <nav class="sd-tabs" aria-label="System detail sections" role="tablist"><button class="is-active" type="button" role="tab" aria-selected="true" data-sd-tab="components">Components</button><button type="button" role="tab" aria-selected="false" data-sd-tab="support">Support history</button><button type="button" role="tab" aria-selected="false" data-sd-tab="coverage">Coverage</button><button type="button" role="tab" aria-selected="false" data-sd-tab="knowledge">Knowledge</button><button type="button" role="tab" aria-selected="false" data-sd-tab="users">Users</button><button type="button" role="tab" aria-selected="false" data-sd-tab="activity">Activity log <span>9</span></button><button class="sd-favorite" type="button" aria-pressed="${systemIsFavorite}" data-sd-favorite><img src="${miFavoriteIcon(systemIsFavorite, 24)}" alt="" /><span>${systemIsFavorite ? "Remove from favorite" : "Add to favorite"}</span></button></nav>
        <div class="sd-tab-content" role="tabpanel">${systemDetailTabMarkup("components", components, system)}</div>
      </main>
      <div data-footer-mount></div>
    </div></div><dialog class="mi-action-dialog sd-edit-dialog" data-sd-edit-dialog aria-labelledby="sd-edit-title"></dialog><dialog class="sd-confirm-dialog" data-sd-confirm-dialog aria-labelledby="sd-confirm-title" aria-describedby="sd-confirm-description"></dialog>
  </section>`;
  mountTopbarSc();
  mountPlatformSidebar("my-instruments");
  mountFooter();
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("my-instruments"));
  app.querySelector("[data-sd-favorite]").addEventListener("click", (event) => {
    toggleMiDetailFavorite(event.currentTarget, systemFavoriteKey);
    const menuFavorite = app.querySelector('[data-sd-action="favorite"]');
    menuFavorite.querySelector("img").src = miFavoriteIcon(miIsFavorite(systemFavoriteKey), 24);
    menuFavorite.querySelector("span").textContent = miIsFavorite(systemFavoriteKey) ? "Remove favorite" : "Favorite";
  });
  app.querySelectorAll("[data-sd-edit]").forEach((button) => button.addEventListener("click", () => openSystemEditDialog(system, button.dataset.sdEdit)));
  const moreActions = app.querySelector("[data-sd-more-actions]");
  const actionMenu = app.querySelector("[data-sd-action-menu]");
  const closeActionMenu = () => { moreActions.setAttribute("aria-expanded", "false"); actionMenu.hidden = true; };
  moreActions.addEventListener("click", (event) => {
    event.stopPropagation();
    const expanded = moreActions.getAttribute("aria-expanded") === "true";
    moreActions.setAttribute("aria-expanded", String(!expanded));
    actionMenu.hidden = expanded;
    if (!expanded) actionMenu.querySelector("[role='menuitem']")?.focus();
  });
  app.querySelector(".screen--system-detail").addEventListener("click", (event) => {
    if (!event.target.closest(".sd-action-menu-wrap")) closeActionMenu();
  });
  actionMenu.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeActionMenu(); moreActions.focus(); } });
  actionMenu.querySelectorAll("[data-sd-action]").forEach((button) => button.addEventListener("click", () => {
    const action = button.dataset.sdAction;
    closeActionMenu();
    if (action === "edit-system") {
      wireMiBuilderDialogs();
      resetMiSystemBuilder(system);
      openMiDialog(miCreateSystemDialog);
    } else if (action === "edit-nickname") openSystemEditDialog(system, "nickname");
    else if (action === "favorite") app.querySelector("[data-sd-favorite]").click();
    else if (action === "remove" || action === "dismantle") openSystemConfirmationDialog(system, action);
    else if (action === "access") {
      system.locked = !system.locked;
      system.admin = system.locked;
      render();
      showToast(`${system.nickname} access ${system.locked ? "restricted" : "unrestricted"}`, { variant: "success" });
    } else showToast(action === "add-group" ? "Add to group opened" : "Share system opened");
  }));
  const showSystemTab = (tab) => {
    app.querySelectorAll("[data-sd-tab]").forEach((button) => {
      const selected = button.dataset.sdTab === tab;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    app.querySelector(".sd-tab-content").innerHTML = systemDetailTabMarkup(tab, components, system);
    wireSystemTabContent(tab, system);
  };
  app.querySelectorAll("[data-sd-tab]").forEach((button) => button.addEventListener("click", () => showSystemTab(button.dataset.sdTab)));
  app.querySelectorAll(".mi-favorite").forEach((button) => button.addEventListener("click", () => toggleMiFavorite(button)));
  app.querySelectorAll("[data-mi-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.miToast)));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = `${system.nickname} — Services Central`;
}

function systemConfirmationMarkup(action) {
  const isRemove = action === "remove";
  const title = isRemove ? "Remove system from my account" : "Dismantle system configuration";
  const description = isRemove ? "This action will not impact other users of the system." : "By dismantling this system, its components will remain in your account as individual instruments. This change will be applied for all users of the system.";
  return `<form class="sd-confirm-modal" data-sd-confirm-form data-sd-confirm-action="${action}"><header><h2 id="sd-confirm-title">${title}</h2><button type="button" data-sd-confirm-close aria-label="Close ${title}"><img src="assets/icons/actions/close/size=24px, style=mono.svg" alt="" /></button></header><div class="sd-confirm-content"><p id="sd-confirm-description">${description}</p>${isRemove ? "" : '<button type="button" data-mi-toast="System users opened"><img src="assets/icons/general/2 users/size=16px, style=mono.svg" alt="" />3 users</button>'}</div><footer><button type="button" class="sd-confirm-cancel" data-sd-confirm-cancel>Cancel</button><button type="submit" class="sd-confirm-submit">Confirm</button></footer></form>`;
}

function openSystemConfirmationDialog(system, action) {
  const dialog = app.querySelector("[data-sd-confirm-dialog]") || document.querySelector("#mi-system-confirm-dialog");
  dialog.innerHTML = systemConfirmationMarkup(action);
  const close = () => dialog.close();
  dialog.querySelector("[data-sd-confirm-close]").onclick = close;
  dialog.querySelector("[data-sd-confirm-cancel]").onclick = close;
  dialog.onclick = (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
  };
  dialog.querySelectorAll("[data-mi-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.miToast)));
  dialog.querySelector("[data-sd-confirm-form]").onsubmit = (event) => {
    event.preventDefault();
    miRemoveSystem(system, action === "remove");
    close();
    setRoute("my-instruments");
    showToast(action === "remove" ? "System removed." : "System dismantled.", { title: "Success:", variant: "system-success" });
  };
  openMiDialog(dialog);
}

function systemEditDialogMarkup(system, field) {
  const isNickname = field === "nickname";
  const isNotes = field === "notes";
  const title = isNickname ? "Edit system nickname" : isNotes ? "Edit system notes" : "System type";
  const description = field === "type" ? "Choose the appropriate system type." : "Changes will apply to all users of the system.";
  let control = "";
  if (isNickname) control = `<label class="sd-edit-field"><span>Nickname <small data-sd-edit-count>${system.nickname.length} / 128</small></span><input type="text" maxlength="128" value="${system.nickname}" data-sd-edit-input autocomplete="off" /></label>`;
  if (isNotes) control = `<label class="sd-edit-field"><span>Notes <em>(Optional)</em><small data-sd-edit-count>${system.notes.length} / 150</small></span><textarea maxlength="150" data-sd-edit-input>${system.notes}</textarea></label>`;
  if (field === "type") {
    const current = MI_SYSTEM_TYPES.find((type) => type[0] === system.typeCode) || MI_SYSTEM_TYPES[0];
    control = `<div class="sd-edit-field sd-edit-type"><span>System type</span><input type="hidden" value="${current[0]}" data-sd-edit-input /><button type="button" class="sd-edit-type__trigger" data-sd-type-trigger aria-expanded="false"><span data-sd-type-label>${miSystemTypeLabel(current)}</span><img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button><div class="sd-edit-type__menu" role="listbox" data-sd-type-menu hidden>${MI_SYSTEM_TYPES.map((type) => `<button type="button" role="option" data-sd-type-option="${type[0]}" aria-selected="${type[0] === current[0]}">${miSystemTypeLabel(type)}</button>`).join("")}</div></div>`;
  }
  return `<form class="sd-edit-modal" data-sd-edit-form data-sd-edit-field="${field}"><header><div><h2 id="sd-edit-title">${title}</h2><p>${description}</p><button class="sd-edit-users" type="button" data-mi-toast="System users opened"><img src="assets/icons/general/2 users/size=16px, style=mono.svg" alt="" />3 users</button></div><button type="button" data-sd-edit-close aria-label="Close ${title}"><img src="assets/icons/actions/close/size=24px, style=mono.svg" alt="" /></button></header><div class="sd-edit-body">${control}</div><footer><button class="mi-dialog-button mi-dialog-button--secondary" type="button" data-sd-edit-cancel>Cancel</button><button class="mi-dialog-button mi-dialog-button--primary" type="submit" data-sd-edit-save disabled>Save</button></footer></form>`;
}

function openSystemEditDialog(system, field) {
  const dialog = app.querySelector("[data-sd-edit-dialog]") || document.querySelector("#mi-system-edit-dialog");
  dialog.innerHTML = systemEditDialogMarkup(system, field);
  const form = dialog.querySelector("[data-sd-edit-form]");
  const input = form.querySelector("[data-sd-edit-input]");
  const save = form.querySelector("[data-sd-edit-save]");
  const original = field === "nickname" ? system.nickname : field === "notes" ? system.notes : system.typeCode;
  const update = () => {
    const value = input.value;
    const count = form.querySelector("[data-sd-edit-count]");
    if (count) count.textContent = `${value.length} / ${field === "notes" ? 150 : 128}`;
    save.disabled = value === original || (field === "nickname" && value.trim() === "");
  };
  input.addEventListener("input", update);
  form.querySelector("[data-sd-edit-close]").onclick = () => dialog.close();
  form.querySelector("[data-sd-edit-cancel]").onclick = () => dialog.close();
  dialog.onclick = (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  };
  if (field === "type") {
    const trigger = form.querySelector("[data-sd-type-trigger]");
    const menu = form.querySelector("[data-sd-type-menu]");
    trigger.onclick = () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      menu.hidden = expanded;
    };
    menu.querySelectorAll("[data-sd-type-option]").forEach((option) => {
      option.onclick = () => {
        const type = MI_SYSTEM_TYPES.find((candidate) => candidate[0] === option.dataset.sdTypeOption);
        input.value = type[0];
        form.querySelector("[data-sd-type-label]").innerHTML = miSystemTypeLabel(type);
        menu.querySelectorAll("[role='option']").forEach((candidate) => candidate.setAttribute("aria-selected", String(candidate === option)));
        trigger.setAttribute("aria-expanded", "false");
        menu.hidden = true;
        update();
      };
    });
  }
  form.onsubmit = (event) => {
    event.preventDefault();
    if (save.disabled) return;
    if (field === "nickname") {
      system.nickname = input.value.trim();
      const detailNickname = app.querySelector("[data-sd-nickname]");
      const detailToolbarTitle = app.querySelector(".flow-toolbar > strong");
      if (detailNickname) detailNickname.textContent = system.nickname;
      if (detailToolbarTitle) detailToolbarTitle.textContent = system.nickname;
      syncFlowToolbarTitle();
      if (detailNickname) document.title = `${system.nickname} — Services Central`;
    } else if (field === "notes") {
      system.notes = input.value.trim();
      const detailNotes = app.querySelector("[data-sd-notes]");
      if (detailNotes) detailNotes.textContent = system.notes || "—";
    } else {
      system.typeCode = input.value;
      const detailType = app.querySelector("[data-sd-type]");
      if (detailType) detailType.textContent = system.typeCode;
    }
    dialog.close();
    if (!app.querySelector(".screen--system-detail")) setRoute(routeFromHash());
    showToast(`${field === "type" ? "System type" : `System ${field}`} updated`, { variant: "success" });
  };
  form.querySelectorAll("[data-mi-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.miToast)));
  update();
  openMiDialog(dialog);
  if (field !== "type") input.focus();
}

const SYSTEM_SUPPORT_ROWS = [
  ["Submitted", "submitted", "5551726344", "PM (Contract)", "18 Oct 2020", "---", "1009996", "VQF0000DET", "Won’t turn on", "Alma Malmberg"],
  ["Open", "open", "46521863", "Service Request", "18 Oct 2020", "---", "1009999", "VQH0000VEN", "Repair 0000123459 instrument parts", "Alma Malmberg"],
  ["Open", "open", "46927364", "Inquiry", "18 Oct 2020", "---", "1009998", "VQF00SAMPL", "Preventive Maintenance - 0012345L", "Alma Malmberg"],
  ["In progress", "progress", "465218988", "PM (Contract)", "18 Oct 2020", "---", "1009997", "VQF000PUMP", "Repair 0000123459 instrument parts", "Alma Malmberg"],
  ["In progress", "progress", "46927364", "Tech Support", "18 Oct 2020", "---", "TSQ-Z-12345", "MSTSQQUANTIS", "Repair 0000123459 instrument parts", "Alma Malmberg"],
  ["In progress", "progress", "46719836", "Inquiry", "12 May 2020", "---", "TSQ-Z-12346", "MSTSQQUANTIS", "Need support for unknown instrument", "Alma Malmberg"],
  ["In progress", "progress", "46075402", "Inquiry", "12 May 2020", "---", "TSQ-Z-12347", "MSTSQQUANTIS", "Need support for unknown instrument", "Alma Malmberg"],
  ["In progress", "progress", "46917372", "Inquiry", "12 May 2020", "---", "TSQ-Z-12348", "QEXAC00001", "Need support for unknown instrument", "Alma Malmberg"],
  ["In progress", "progress", "46003524", "Depot Repair", "12 May 2020", "---", "SN98355W", "QEXAC00001", "Need support for unknown instrument", "Tyler Durden"],
  ["Closed", "closed", "46195527", "Depot Repair", "23 Jan 2019", "23 Jan 2019", "SN98356W", "VQF0000DET", "Preventive Maintenance 00000", "Tyler Durden"],
  ["Closed", "closed", "46939573", "Inquiry", "23 Jan 2019", "23 Jan 2019", "1009996", "VQH0000VEN", "Need calibration", "Tyler Durden"],
  ["Closed", "closed", "46074658", "Tech Support", "23 Jan 2019", "23 Jan 2019", "1009999", "VQF00SAMPL", "Need calibration", "Tyler Durden"],
  ["Closed", "closed", "46884635", "Tech Support", "23 Jan 2019", "23 Jan 2019", "1009998", "VQF000PUMP", "Need calibration", "Tyler Durden"],
  ["Closed", "closed", "46626384", "Inquiry", "23 Jan 2019", "23 Jan 2019", "1009997", "MSTSQQUANTIS", "Need calibration", "Tyler Durden"],
  ["Closed", "closed", "46977462", "Tech Support", "23 Jan 2019", "23 Jan 2019", "TSQ-Z-12345", "MSTSQQUANTIS", "Need calibration", "Tyler Durden"],
  ["Closed", "closed", "46118377", "PM (Contract)", "23 Jan 2019", "23 Jan 2019", "TSQ-Z-12346", "MSTSQQUANTIS", "Need calibration", "Tyler Durden"],
  ["Closed", "closed", "46000283", "PM (Contract)", "23 Jan 2019", "23 Jan 2019", "TSQ-Z-12347", "VQF0000DET", "Need calibration", "Tyler Durden"],
  ["Closed", "closed", "46993746", "Inquiry", "23 Jan 2019", "23 Jan 2019", "TSQ-Z-12348", "VQH0000VEN", "Need calibration", "Tyler Durden"],
  ["Closed", "closed", "46296730", "Inquiry", "23 Jan 2019", "23 Jan 2019", "SN98355W", "VQF00SAMPL", "Need calibration", "Tyler Durden"],
  ["Closed", "closed", "46434295", "Installation", "23 Jan 2019", "23 Jan 2019", "SN98356W", "VQF000PUMP", "Need calibration", "Tyler Durden"],
];

const SYSTEM_MANUALS = [
  ["vanquish-detector.png", "4820.8401-EN - Rev. 2.1 - Vanquish Charged Aerosol Detectors Operating Manual"],
  ["vanquish-column.png", "4827.3201-EN - Rev 3.0 - Vanquish Column Compartments (VC-C10, VH-C10) Operating Manual"],
  ["vanquish-sampler.png", "4820.3601-EN - Rev. 4.0 - Vanquish UHPLC System Operating Manual"],
  ["vanquish-detector.png", "4828.5001-EN - Rev 4.0 - Vanquish Split Samplers Operating Manual"],
  ["vanquish-pump.png", "4820.4405-EN - Rev 4.0 - Vanquish Pumps C, F Operating Manual"],
  ["tsq.png", "80111-97047 - Rev A - TSQ Series II Mass Spectrometers Hardware Manual"],
];

function systemDetailSupportMarkup() {
  const sort = '<img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" />';
  const rows = SYSTEM_SUPPORT_ROWS.map(([status, tone, ticket, type, created, closed, serial, model, subject, contact], index) => `<tr><td>${index === 1 ? '<img src="assets/icons/general/ticket/size=24px, style=mono.svg" alt="Ticket" />' : ""}</td><td><span class="sd-ticket-status sd-ticket-status--${tone}">${status}</span></td><td><button type="button" data-mi-toast="Ticket ${ticket} opened">${ticket}</button></td><td>${type}</td><td>${created}</td><td>${closed}</td><td><button type="button" data-route="${miInstrumentDetailRoute(serial)}">${serial}</button></td><td title="${model}">${model}</td><td title="${subject}">${subject}</td><td>${contact}</td></tr>`).join("");
  return `<section class="sd-panel sd-support-panel" aria-labelledby="sd-support-title"><header><h2 id="sd-support-title">Components support history</h2><div class="sd-filters"><strong>Filter by:</strong><select aria-label="Ticket status"><option>Ticket status</option><option>Open</option><option>In progress</option><option>Closed</option></select><select aria-label="Ticket type"><option>Ticket type</option><option>Service Request</option><option>PM (Contract)</option></select><select aria-label="Ticket contact"><option>Ticket contact</option><option>Alma Malmberg</option><option>Tyler Durden</option></select></div></header><div class="sd-support-table"><table><colgroup><col class="sd-col-icon"><col class="sd-col-status"><col class="sd-col-ticket"><col class="sd-col-type"><col class="sd-col-date"><col class="sd-col-date"><col class="sd-col-serial"><col class="sd-col-model"><col class="sd-col-subject"><col class="sd-col-contact"></colgroup><thead><tr><th></th><th>Status ${sort}</th><th>Ticket no. ${sort}</th><th>Ticket type ${sort}</th><th>Created ${sort}</th><th>Closed ${sort}</th><th>Serial no. ${sort}</th><th>Catalog no. ${sort}</th><th>Subject ${sort}</th><th>Ticket contact ${sort}</th></tr></thead><tbody>${rows}</tbody></table></div>${systemPaginationMarkup()}</section>`;
}

function systemPaginationMarkup() {
  return `<div class="id-pagination sd-pagination"><div>Results per page <button type="button">20 <img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button> of <strong>267</strong></div><nav aria-label="Pagination"><button type="button" disabled aria-label="Previous page"><img src="assets/icons/directions/chevron left/size=16px, style=mono.svg" alt="" /></button><button class="is-current" type="button" aria-current="page">1</button><button type="button">2</button><button type="button">3</button><button type="button">4</button><span>…</span><button type="button">9</button><button type="button" aria-label="Next page"><img src="assets/icons/directions/chevron right/size=16px, style=mono.svg" alt="" /></button><label>Go to: <input type="text" inputmode="numeric" aria-label="Go to page" placeholder="#" /></label></nav></div>`;
}

function systemDetailCoverageMarkup(components) {
  const cards = components.slice(0, 2).map((instrument, index) => `<article class="sd-coverage-card"><header><h2>Instrument coverage</h2><span>Under contract</span></header><dl><div><dt>Service Plan Number</dt><dd>${index ? "MAN68668686868" : "MANIS3333333333"}</dd></div><div><dt>Service Plan Type</dt><dd>Essential Service Plan</dd></div><div><dt>Coverage Start</dt><dd>22 Jul 2020</dd></div><div><dt>Coverage End</dt><dd>22 Jul 2024</dd></div></dl><button type="button" data-mi-toast="Coverage instruments opened">›&nbsp; Show ${Math.min(3, components.length)} instrument(s)</button><footer><button type="button" data-mi-toast="Service plan details opened">›&nbsp; What’s included in the Essential Service Plan</button></footer></article>`).join("");
  return `<section class="sd-panel sd-coverage-panel"><div class="sd-coverage-list">${cards || '<p>No coverage information available.</p>'}</div><article class="sd-contact-card"><header><h2><img src="assets/icons/general/coverage contact/ size=24px, style=mono.svg" alt="" />Service plan contact</h2><button type="button" data-mi-toast="Edit contact opened">Edit contact</button></header><div class="sd-contact-row"><dl><div><dt>Name</dt><dd>Molly Hartman</dd></div><div><dt>Email</dt><dd>molly.hartman@company.com</dd></div></dl><button type="button" data-mi-toast="Contact instruments opened">›&nbsp; Show 3 instrument(s)</button></div><div class="sd-contact-row"><dl><div><dt>Name</dt><dd>Sebastien Martin</dd></div><div><dt>Email</dt><dd>sebastien.martin@company.com</dd></div></dl><button type="button" data-mi-toast="Contact instruments opened">›&nbsp; Show 1 instrument(s)</button></div><footer><button type="button" data-mi-toast="Unassigned instruments opened">›&nbsp; Show 2 instrument(s) with no service plan contact</button></footer></article></section>`;
}

function systemDetailKnowledgeMarkup(hasSearch = false) {
  const resultCards = Array.from({ length: 6 }, () => `<article class="sd-article-card"><div><button type="button" data-mi-toast="Knowledge article opened"><strong>Error 2022</strong> Vanquish detector F</button><p>Aenean facilisis porta nibh et vestibulum. Integer commodo, lectus eget lacinia aliquet, augue erat placerat massa, quis mattis ipsum diam sit...</p><b>120 views</b></div><span><img src="assets/icons/actions/link/Size=24px, Style=Mono.svg" alt="Copy link" /><img src="assets/icons/actions/copy/Size=24px, Style=Mono.svg" alt="Copy article" /></span></article>`).join("");
  const manuals = SYSTEM_MANUALS.map(([image, title]) => `<article class="sd-manual-card"><img src="assets/instruments/${image}" alt="" /><button type="button" data-mi-toast="Manual opened">${title}</button><span><img src="assets/icons/actions/link/Size=24px, Style=Mono.svg" alt="Copy link" /><img src="assets/icons/actions/copy/Size=24px, Style=Mono.svg" alt="Copy manual" /></span></article>`).join("");
  return `<section class="sd-knowledge"><div class="sd-knowledge-search"><div><h2>Expand your knowledge</h2><p>Search documents and topics related to your instrument or <button type="button" data-mi-toast="Knowledge base opened">browse knowledge base</button> to access more resources and articles.</p></div><label>Search<div><input type="search" value="${hasSearch ? "Error 202" : ""}" placeholder="Search knowledge articles" data-sd-knowledge-search /><img src="assets/icons/actions/search/size=16px, style=mono.svg" alt="" /></div></label></div>${hasSearch ? `<section class="sd-search-results"><h2>Top search results</h2><div>${resultCards}</div><button type="button" data-mi-toast="More results loaded">See more...</button></section>` : ""}<section class="sd-manuals"><h2>Manuals <span>6</span></h2><div>${manuals}</div></section><aside class="sd-appslab"><img src="assets/instruments/appslab-library.svg" alt="" /><strong>Find your Methods, eWorkflows and more</strong><p>The AppsLab Library of Analytical Applications is a fully searchable online, analytical method repository where you can find applications with detailed method information, chromatograms and related compound information.</p><button type="button" data-mi-toast="AppsLab library opened">Go to AppsLab library</button></aside></section>`;
}

function systemDetailUsersMarkup(target) {
  const accessKey = `system:${target.id}`;
  const users = [
    [MI_CURRENT_USER_EMAIL, "10 May 2024", ""],
    ["sebastien.martin@company.com", "10 May 2022", "sebastien-martin"],
    ["holly.hartman@company.com", "Invitation sent (expires in 5 days)", "holly-hartman"],
  ];
  return `<section class="sd-panel sd-users-panel"><header><div><h2>Instrument users <span>3</span></h2><p>Users who have added this instrument in Services Central.</p></div><button type="button" data-mi-toast="Share users opened">Share</button></header><table><thead><tr><th></th><th>Role</th><th>Current users</th><th>Added date</th><th>Remove</th></tr></thead><tbody>${users.map(([email, date, slug]) => { const role = miRoleForAsset(accessKey, email, target); return `<tr><td>${role === "Admin" ? '<img class="sd-admin-icon" src="assets/icons/general/admin/size=24px, style=mono.svg" alt="Administrator" />' : ""}</td><td>${miRoleBadge(role === "Admin", { accessKey, email, editable: miIsAdmin(target) })}</td><td>${slug ? `<button type="button" data-route="user-detail-${slug}">${email}</button>` : email}</td><td>${date}</td><td><button type="button" data-mi-toast="${email} removed" aria-label="Remove ${email}"><img src="assets/icons/actions/bin/size=16px, style=mono.svg" alt="" /></button></td></tr>`; }).join("")}</tbody></table></section>`;
}

function systemDetailActivityMarkup() {
  const rows = [
    ["10 Jun 2023", "Submitted instrument support request for 1009997 (Pump 2B)", "sebastien.martin@company.com", true],
    ["30 Jun 2023", "holly.hartman@company.com became the service plan contact for 1009987", "holly.hartman@company.com", true],
    ["30 Jun 2023", "holly.hartman@company.com became the service plan contact for 1009988", "holly.hartman@company.com", true],
    ["10 Jun 2023", "Nickname change for TSQ-Z-12346 from TSQZ to TSQ-0", "sebastien.martin@company.com", true],
    ["10 Jun 2023", "holly.hartman@company.com is no longer an Admin", "holly.hartman@company.com", true],
    ["28 Apr 2023", "holly.hartman@company.com became an Admin", "holly.hartman@company.com"],
    ["25 Apr 2023", "System is under access control", "holly.hartman@company.com"],
    ["25 Apr 2023", "Added 1009996 (Detector-2B)", "patty.jones@company.com"],
    ["18 Apr 2023", "System nickname change from Alpine 2B to Alpine", "sebastien.martin@company.com"],
    ["18 Mar 2023", "System Notes changed", "patty.jones@company.com"],
    ["18 Feb 2023", "System Nickname System A changed to System B", "ines.mitchell@company.com"],
    ["18 Feb 2023", "Nickname Detector-3B removed for 1009986", "sebastien.martin@company.com"],
    ["18 Feb 2023", "Nickname Detector-A changed for 1009986 to Detector-3B", "sebastien.martin@company.com"],
    ["18 Feb 2023", "Nickname Detector-A added for 1009986", "patty.jones@company.com"],
    ["18 Feb 2023", "Added 1009988 (Pump-3B)", "patty.jones@company.com"],
    ["18 Feb 2023", "Created system", "holly.hartman@company.com"],
  ];
  return `<section class="sd-panel sd-activity-panel"><header><h2>Activity log</h2><p>Activity related to this instrument by users within Services Central over prior 6 months.</p></header><table><thead><tr><th>Date</th><th></th><th>Action</th><th>Users</th></tr></thead><tbody>${rows.map(([date, action, user, fresh]) => `<tr class="${fresh ? "is-new" : ""}"><td>${date}</td><td>${fresh ? "<span>New</span>" : ""}</td><td>${action}</td><td>${user}</td></tr>`).join("")}</tbody></table></section>`;
}

function systemDetailTabMarkup(tab, components, system) {
  if (tab === "support") return systemDetailSupportMarkup();
  if (tab === "coverage") return systemDetailCoverageMarkup(components);
  if (tab === "knowledge") return systemDetailKnowledgeMarkup(false);
  if (tab === "users") return systemDetailUsersMarkup(system);
  if (tab === "activity") return systemDetailActivityMarkup();
  return `<section class="sd-components" aria-labelledby="sd-components-title"><h2 id="sd-components-title">Components <span>${components.length}</span></h2><div class="sd-components__grid">${components.map((instrument) => miGridCardMarkup(instrument, { favoritable: false })).join("")}</div></section>`;
}

function wireSystemTabContent(tab, system) {
  if (tab === "knowledge") {
    const input = app.querySelector("[data-sd-knowledge-search]");
    input?.addEventListener("change", () => {
      app.querySelector(".sd-tab-content").innerHTML = systemDetailKnowledgeMarkup(Boolean(input.value.trim()));
      wireSystemTabContent("knowledge", system);
    });
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        input.dispatchEvent(new Event("change"));
      }
    });
  }
  const content = app.querySelector(".sd-tab-content");
  if (tab === "users") wireMiRoleSelectors(content, (role, email) => {
    if (email === MI_CURRENT_USER_EMAIL) {
      renderMiSystemDetail(routeFromHash());
      app.querySelector('[data-sd-tab="users"]')?.click();
      return;
    }
    content.innerHTML = systemDetailUsersMarkup(system);
    wireSystemTabContent("users", system);
  });
  content.querySelectorAll("[data-mi-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.miToast)));
  wireRouteControls(content);
}

function instrument1009996TicketRows() {
  return INSTRUMENT_1009996_TICKETS.map(([tone, status, ticket, type, created, closed, subject, contact, hasIcon]) => `<tr>
    <td>${hasIcon ? '<img src="assets/icons/general/ticket/size=24px, style=mono.svg" alt="Ticket document" />' : ""}</td>
    <td><span class="id-status id-status--${tone}">${status}</span></td>
    <td><button type="button" data-route="ticket-detail">${ticket}</button></td>
    <td>${type}</td><td>${created}</td><td>${closed}</td><td title="${subject}">${subject}</td><td>${contact}</td>
  </tr>`).join("");
}

function instrumentCoverageStatusClass(instrument) {
  if (instrument.coverage === "Coverage expired") return "id-status--expired";
  if (instrument.coverage === "Expiring soon") return "id-status--testing";
  return "id-status--contract";
}

function instrumentCatalogName(instrument) {
  const names = {
    "vanquish-detector.png": "Vanquish™ Variable Wavelength Detector F",
    "vanquish-column.png": "Vanquish™ Column Compartment",
    "vanquish-sampler.png": "Vanquish™ Split Sampler",
    "vanquish-pump.png": "Vanquish™ Pump",
    "tsq.png": "TSQ™ Quantis Mass Spectrometer",
    "q-exactive.png": "Q Exactive™ Mass Spectrometer",
  };
  return names[instrument.image] || instrument.model;
}

function instrumentDetailCoverageMarkup(instrument) {
  const planNumber = `MAIN${instrument.serial.replace(/\D/g, "").slice(-6).padStart(6, "0")}`;
  return `<section class="id-coverage-tab">
    <aside class="id-coverage-promo"><div><h2>Get up to 20% off <strong>in service Plans</strong></h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</p><small>Promo expires 30 Jun 2024. Restrictions may apply.</small></div><button type="button" data-mi-toast="Request quote opened">Request quote</button></aside>
    <div class="id-coverage-grid">
      <article class="id-coverage-card">
        <header><h2>Instrument coverage</h2><span class="${instrumentCoverageStatusClass(instrument)}">${instrument.coverage}</span></header>
        <dl><div><dt>Service Plan Number</dt><dd>${planNumber}</dd></div><div><dt>Service Plan Type</dt><dd>Essential Service Plan</dd></div><div><dt>Coverage Start</dt><dd>22 Jul 2020</dd></div><div><dt>Coverage End</dt><dd>${instrument.end}</dd></div></dl>
        <div class="id-plan-details"><h3><img src="assets/icons/directions/chevron up/size=16px, style=mono.svg" alt="" />What's included in the Essential Service Plan</h3><ul><li>2 business day on-site response</li><li>Immediate Tech support <img src="assets/icons/notifications/info/size=16px, style=bold.svg" alt="" /></li><li>Annual preventive maintenance</li><li>Highest Priority parts/support/service</li><li>Unlimited Remote Diagnosis/Repair</li><li>On-site corrective maintenance fully covered</li></ul></div>
      </article>
      <article class="id-contact-card"><header><h2><img src="assets/icons/general/coverage contact/ size=24px, style=mono.svg" alt="" />Service plan contact</h2><button type="button" data-mi-toast="Edit contact opened"><img src="assets/icons/actions/edit/size=16px, style=mono.svg" alt="" />Edit contact</button></header><dl><div><dt>Name</dt><dd>Molly Hartman</dd></div><div><dt>Email</dt><dd>molly.hartman@company.com</dd></div></dl></article>
    </div>
  </section>`;
}

function instrumentDetailKnowledgeMarkup(instrument, hasSearch = false) {
  const resultCards = Array.from({ length: 6 }, () => `<article class="sd-article-card"><div><button type="button" data-mi-toast="Knowledge article opened"><strong>Error 2022</strong> Vanquish detector F</button><p>Aenean facilisis porta nibh et vestibulum. Integer commodo, lectus eget lacinia aliquet, augue erat placerat massa, quis mattis ipsum diam sit...</p><b>120 views</b></div><span><img src="assets/icons/actions/link/Size=24px, Style=Mono.svg" alt="Copy link" /><img src="assets/icons/actions/copy/Size=24px, Style=Mono.svg" alt="Copy article" /></span></article>`).join("");
  const manuals = [
    [instrument.image, `${instrument.model} - ${instrumentCatalogName(instrument)} Operating Manual`],
    [instrument.image.startsWith("vanquish") ? "vanquish-column.png" : instrument.image, `${miInstrumentType(instrument)} System Operating Manual`],
  ].map(([image, title]) => `<article class="sd-manual-card"><img src="assets/instruments/${image}" alt="" /><button type="button" data-mi-toast="Manual opened">${title}</button><span><img src="assets/icons/actions/link/Size=24px, Style=Mono.svg" alt="Copy link" /><img src="assets/icons/actions/copy/Size=24px, Style=Mono.svg" alt="Copy manual" /></span></article>`).join("");
  return `<section class="sd-knowledge id-knowledge-tab"><div class="sd-knowledge-search"><div><h2>Expand your knowledge</h2><p>Search documents and topics related to your instrument or <button type="button" data-id-browse-knowledge>browse knowledge base</button> to access more resources and articles.</p></div><label>Search<div><input type="search" value="${hasSearch ? "Error 202" : ""}" placeholder="Search knowledge articles" data-id-knowledge-search /><img src="assets/icons/actions/search/size=16px, style=mono.svg" alt="" /></div></label></div>${hasSearch ? `<section class="sd-search-results"><h2>Top search results</h2><div>${resultCards}</div><button type="button" data-mi-toast="More results loaded">See more...</button></section>` : ""}<section class="sd-manuals"><h2>Manuals <span>2</span></h2><div>${manuals}</div></section><aside class="sd-appslab"><img src="assets/instruments/appslab-library.svg" alt="" /><strong>Find your Methods, eWorkflows and more</strong><p>The AppsLab Library of Analytical Applications is a fully searchable online, analytical method repository where you can find applications with detailed method information, chromatograms and related compound information.</p><button type="button" data-mi-toast="AppsLab library opened">Go to AppsLab library</button></aside></section>`;
}

function instrumentDetailUsersMarkup(target) {
  const accessKey = `instrument:${target.serial}`;
  const allUsers = [
    [MI_CURRENT_USER_EMAIL, "10 May 2024", ""],
    ["sebastien.martin@company.com", "10 May 2022", "sebastien-martin"],
    ["holly.hartman@company.com", "Invitation sent (expires in 5 days)", "holly-hartman"],
    ["ines.mitchell@company.com", "10 May 2022", "ines-mitchell"],
    ["patty.jones@company.com", "10 May 2022", "patty-jones"],
  ];
  const count = Math.max(1, Math.min(allUsers.length, Number.parseInt(target?.users, 10) || 1));
  const users = allUsers.slice(0, count);
  return `<section class="sd-panel sd-users-panel id-users-panel"><header><div><h2>Instrument users <span>${count}</span></h2><p>Users who have added this instrument in Services Central.</p></div><button type="button" data-mi-toast="Share users opened">Share</button></header><table><thead><tr><th></th><th>Role ${miSortIcon}</th><th>Current users ${miSortIcon}</th><th>Added date ${miSortIcon}</th><th>Remove</th></tr></thead><tbody>${users.map(([email, date, slug]) => { const role = miRoleForAsset(accessKey, email, target); return `<tr><td>${role === "Admin" ? '<img class="sd-admin-icon" src="assets/icons/general/admin/size=24px, style=mono.svg" alt="Administrator" />' : ""}</td><td>${miRoleBadge(role === "Admin", { accessKey, email, editable: miIsAdmin(target) })}</td><td>${slug ? `<button type="button" data-route="user-detail-${slug}">${email}</button>` : email}</td><td>${date}</td><td><button type="button" data-mi-toast="${email} removed" aria-label="Remove ${email}"><img src="assets/icons/actions/bin/size=16px, style=mono.svg" alt="" /></button></td></tr>`; }).join("")}</tbody></table></section>`;
}

function instrumentDetailActivityMarkup(instrument) {
  const rows = [
    ["10 Jun 2024", "Submitted instrument support request", "holly.hartman@company.com", true],
    ["10 Jun 2023", "holly.hartman@company.com became the service plan contact.", "holly.hartman@company.com", true],
    ["25 May 2024", "my_name.lastname@company.com became an Admin", "sebastien.martin@company.com"],
    ["28 Apr 2024", "sebastien.martin@company.com became an Admin", "sebastien.martin@company.com"],
    ["25 Apr 2024", "Instrument is under access control", "sebastien.martin@company.com"],
    ["25 Apr 2024", "Notes changed", "ines.mitchell@company.com"],
    ["18 Apr 2024", `Nickname changed to ${instrument.nickname}`, "ines.mitchell@company.com"],
  ];
  return `<section class="sd-panel sd-activity-panel id-activity-panel"><header><h2>Activity log</h2><p>Activity related to this instrument by users within Services Central over prior 6 months.</p></header><table><thead><tr><th>Date ${miSortIcon}</th><th></th><th>Action ${miSortIcon}</th><th>Users ${miSortIcon}</th></tr></thead><tbody>${rows.map(([date, action, user, fresh]) => `<tr class="${fresh ? "is-new" : ""}"><td>${date}</td><td>${fresh ? "<span>New</span>" : ""}</td><td>${action}</td><td>${user}</td></tr>`).join("")}</tbody></table></section>`;
}

function instrumentDetailTabMarkup(tab, instrument) {
  if (tab === "coverage") return instrumentDetailCoverageMarkup(instrument);
  if (tab === "knowledge") return instrumentDetailKnowledgeMarkup(instrument, false);
  if (tab === "users") return instrumentDetailUsersMarkup(instrument);
  if (tab === "activity") return instrumentDetailActivityMarkup(instrument);
  return "";
}

function wireInstrumentDetailTabContent(tab, instrument) {
  const content = app.querySelector("[data-id-dynamic-tab]");
  if (tab === "knowledge") {
    const input = content.querySelector("[data-id-knowledge-search]");
    input?.addEventListener("change", () => {
      content.innerHTML = instrumentDetailKnowledgeMarkup(instrument, Boolean(input.value.trim()));
      wireInstrumentDetailTabContent("knowledge", instrument);
    });
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        input.dispatchEvent(new Event("change"));
      }
    });
    content.querySelector("[data-id-browse-knowledge]")?.addEventListener("click", () => window.open("https://knowledge1.thermofisher.com/", "_blank", "noopener"));
  }
  if (tab === "users") wireMiRoleSelectors(content, () => {
    content.innerHTML = instrumentDetailUsersMarkup(instrument);
    wireInstrumentDetailTabContent("users", instrument);
  });
  content.querySelectorAll("[data-mi-toast]").forEach((control) => control.addEventListener("click", () => showToast(control.dataset.miToast)));
  wireRouteControls(content);
}

function renderInstrumentDetail(serial) {
  const instrument = miCurrentInstruments().find((candidate) => candidate.serial === serial);
  if (!instrument || MI_REMOVED_INSTRUMENTS.has(instrument.serial)) {
    setRoute("my-instruments");
    return;
  }
  const displayName = instrument.nickname === "—" ? instrument.serial : instrument.nickname;
  const owningSystem = miCurrentSystems().find((system) => system.components.includes(instrument.serial));
  const instrumentFavoriteKey = `instrument:${instrument.serial}`;
  const instrumentIsFavorite = miIsFavorite(instrumentFavoriteKey);
  app.innerHTML = `<section class="screen screen--instrument-detail" aria-label="Instrument ${instrument.serial} details">
    <div class="flow-toolbar">
      <button type="button" data-go-back>Back</button>
      <strong>${displayName}</strong>
      <div class="flow-toolbar__actions"><button type="button" data-route="dashboard">Dashboard</button><button type="button" data-open-flows>All flows</button></div>
    </div>
    <div class="id-stage"><div class="mi-shell id-shell">
      <div data-topbar-sc-mount></div>
      <div data-platform-sidebar-mount></div>
      <main class="platform-page-body id-main">
        <section class="id-hero" data-platform-titlebar aria-label="Instrument summary">
          <div class="id-hero__actions">
            <div class="id-actions"><button class="id-more-actions" type="button" data-mi-action-menu-kind="instrument" data-mi-action-menu-id="${instrument.serial}" data-mi-action-menu-label="${instrument.serial}" data-mi-action-menu-context="detail" aria-haspopup="menu" aria-expanded="false">More actions <img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button></div>
            <button class="mi-button mi-button--primary" type="button" data-route="request-support">Start a request</button>
          </div>
          <div class="id-product"><img src="assets/instruments/${instrument.image}" alt="${instrumentCatalogName(instrument)}" /></div>
          <dl class="id-facts">
            <div><dt>Nickname <button type="button" data-id-toast="Edit nickname" aria-label="Edit nickname"><img src="assets/icons/actions/edit/size=16px, style=mono.svg" alt="" /></button></dt><dd>${instrument.nickname}</dd></div>
            <div><dt>Catalog no.</dt><dd>${instrument.model}</dd></div>
            <div><dt>Coverage</dt><dd><span class="id-status ${instrumentCoverageStatusClass(instrument)}">${instrument.coverage}</span></dd></div>
            <div class="id-fact--wide"><dt>Catalog Name</dt><dd>${instrumentCatalogName(instrument)}</dd></div>
            <div><dt>Serial Number</dt><dd>${instrument.serial}</dd></div>
            <div><dt>Type</dt><dd>${miInstrumentType(instrument)}</dd></div>
            <div><dt>Groups</dt><dd>${instrument.group === "—" ? "—" : `<button type="button" data-id-toast="${instrument.group} opened">${instrument.group}</button>`}</dd></div>
            <div class="id-fact--wide id-knowledge"><dt>Knowledge</dt><dd><button type="button" data-id-browse-knowledge-external><img src="assets/icons/actions/search/size=16px, style=mono.svg" alt="" />Browse for manuals and troubleshooting articles</button><button type="button" data-id-open-knowledge><img src="assets/icons/media/document/size=16px, style=mono.svg" alt="" />View operating manual</button><button type="button" data-id-open-knowledge><img src="assets/icons/media/document/size=16px, style=mono.svg" alt="" />View system operating manual</button></dd></div>
            ${isEuropeLePrototype() ? "" : `<div><dt>System</dt><dd>${owningSystem ? `<button type="button" data-route="system-detail-${owningSystem.id}">${owningSystem.nickname}</button>` : '<button type="button" data-id-toast="Create a system selected">Create a system</button>'}</dd></div>`}
            <div class="id-notes"><dt>Notes <button type="button" data-id-toast="Edit notes" aria-label="Edit notes"><img src="assets/icons/actions/edit/size=16px, style=mono.svg" alt="" /></button></dt><dd><button type="button" data-id-toast="Add instrument note selected">Add instrument note</button></dd></div>
          </dl>
        </section>

        <nav class="id-tabs" aria-label="Instrument detail sections" role="tablist">
          <button class="is-active" type="button" role="tab" aria-selected="true" data-id-tab="support">Support</button>
          <button type="button" role="tab" aria-selected="false" data-id-tab="coverage">Coverage</button>
          <button type="button" role="tab" aria-selected="false" data-id-tab="knowledge">Knowledge</button>
          <button type="button" role="tab" aria-selected="false" data-id-tab="users">Users</button>
          <button type="button" role="tab" aria-selected="false" data-id-tab="activity">Activity log <span>1</span></button>
          <button class="id-favorite" type="button" aria-pressed="${instrumentIsFavorite}" data-id-favorite><img src="${miFavoriteIcon(instrumentIsFavorite, 24)}" alt="" /><span>${instrumentIsFavorite ? "Remove from favorite" : "Add to favorite"}</span></button>
        </nav>

        <div class="id-dynamic-tab" role="tabpanel" data-id-dynamic-tab hidden></div>

        <aside class="id-pm" aria-labelledby="id-pm-title">
          <img class="id-pm__art" src="assets/instruments/preventive-maintenance.svg" alt="" />
          <div><h2 id="id-pm-title">Preventive Maintenance</h2><p>Thermo Fisher will schedule your next preventive maintenance on ticket <button type="button" data-route="ticket-detail">46927364</button>.<br />This information will be updated when the scheduling timeframe approaches.</p></div>
          <button class="id-secondary" type="button" data-route="request-support">Request PM Scheduling</button>
        </aside>

        <section class="id-support" aria-labelledby="id-support-title">
          <header><h1 id="id-support-title">Support history</h1><div class="id-filters"><strong>Filter by:</strong><label><span class="sr-only">Ticket status</span><select><option>Ticket status</option><option>Open</option><option>In progress</option><option>Closed</option></select></label><label><span class="sr-only">Ticket type</span><select><option>Ticket type</option><option>Service Request</option><option>PM (Contract)</option><option>Inquiry</option></select></label><label><span class="sr-only">Ticket contact</span><select><option>Ticket contact</option><option>Alma Malmbe</option><option>Tyler Durden</option></select></label></div></header>
          <div class="id-table-wrap"><table aria-label="Support history"><colgroup><col class="id-col-icon" /><col class="id-col-status" /><col class="id-col-ticket" /><col class="id-col-type" /><col class="id-col-created" /><col class="id-col-closed" /><col class="id-col-subject" /><col class="id-col-contact" /></colgroup><thead><tr><th></th><th>Status <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Ticket number <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Ticket type <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Created <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Closed <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Subject <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Ticket contact <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th></tr></thead><tbody>${instrument1009996TicketRows()}</tbody></table></div>
          <div class="id-pagination"><div>Results per page <button type="button">20 <img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button> of <strong>267</strong></div><nav aria-label="Support history pagination"><button type="button" disabled aria-label="Previous page"><img src="assets/icons/directions/chevron left/size=16px, style=mono.svg" alt="" /></button><button class="is-current" type="button" aria-current="page">1</button><button type="button">2</button><button type="button">3</button><button type="button">4</button><span>…</span><button type="button">9</button><button type="button" aria-label="Next page"><img src="assets/icons/directions/chevron right/size=16px, style=mono.svg" alt="" /></button><label>Go to: <input type="text" inputmode="numeric" aria-label="Go to page" placeholder="#" /></label></nav></div>
        </section>
      </main>
      <div data-footer-mount></div>
    </div></div>
  </section>`;
  mountTopbarSc();
  mountPlatformSidebar("my-instruments");
  mountFooter();
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("my-instruments"));
  app.querySelectorAll("[data-id-toast]").forEach((control) => control.addEventListener("click", () => showToast(control.dataset.idToast)));
  app.querySelector("[data-id-favorite]").addEventListener("click", (event) => toggleMiDetailFavorite(event.currentTarget, instrumentFavoriteKey));
  const showInstrumentTab = (tab) => {
    const showSupport = tab === "support";
    app.querySelectorAll(".id-tabs > button:not(.id-favorite)").forEach((candidate) => {
      const selected = candidate.dataset.idTab === tab;
      candidate.classList.toggle("is-active", selected);
      candidate.setAttribute("aria-selected", String(selected));
    });
    app.querySelector(".id-pm").hidden = !showSupport;
    app.querySelector(".id-support").hidden = !showSupport;
    const dynamicTab = app.querySelector("[data-id-dynamic-tab]");
    dynamicTab.hidden = showSupport;
    if (!showSupport) {
      dynamicTab.innerHTML = instrumentDetailTabMarkup(tab, instrument);
      wireInstrumentDetailTabContent(tab, instrument);
    }
  };
  app.querySelectorAll("[data-id-tab]").forEach((button) => button.addEventListener("click", () => showInstrumentTab(button.dataset.idTab)));
  app.querySelectorAll("[data-id-open-knowledge]").forEach((button) => button.addEventListener("click", () => {
    showInstrumentTab("knowledge");
  }));
  app.querySelector("[data-id-browse-knowledge-external]")?.addEventListener("click", () => window.open("https://knowledge1.thermofisher.com/", "_blank", "noopener"));
  wireMiActionMenus(app);
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = `${displayName} — Services Central`;
}

const ADD_INSTRUMENT_PROFILES = [
  { image: "vanquish-detector.png", model: "VQF0000DET", coverage: "Under contract", end: "24 Dec 2027" },
  { image: "vanquish-sampler.png", model: "VQF00SAMPL", coverage: "Under contract", end: "24 Dec 2027" },
  { image: "vanquish-pump.png", model: "VQF000PUMP", coverage: "Under contract", end: "29 Dec 2027" },
  { image: "q-exactive.png", model: "QEXAC00001", coverage: "Under contract", end: "28 Apr 2028" },
  { image: "tsq.png", model: "MSTSQQUANTISPLUS", coverage: "Under contract", end: "29 Mar 2028" },
];

const ADD_LE_INSTRUMENT_PROFILES = [
  { image: "le/tsx-40086.png", type: "ULT Freezers", model: "ULTXX000AV", coverage: "Under contract", end: "24 Dec 2027" },
  { image: "le/bios-16.png", type: "Centrifuges", model: "BIOS16", coverage: "Under contract", end: "18 Jul 2028" },
  { image: "le/tsx-2330.png", type: "Lab Freezers", model: "TSX2330FA", coverage: "Under contract", end: "08 Jan 2028" },
  { image: "le/midi-co2-40l.png", type: "CO2 Incubators", model: "MIDI40", coverage: "Under contract", end: "15 May 2028" },
];

function assignAddInstrumentProfiles(entries) {
  if (!entries.length) return [];
  const mainFlowStartsWithLe = aiStableHash(entries.map((entry) => entry.serial).join("|")) % 2 === 0;
  return entries.map((entry, index) => {
    let profiles = ADD_INSTRUMENT_PROFILES;
    if (isEuropeLePrototype()) profiles = ADD_LE_INSTRUMENT_PROFILES;
    else if (isMainPrototype()) {
      const useLeProfile = index % 2 === 0 ? mainFlowStartsWithLe : !mainFlowStartsWithLe;
      profiles = useLeProfile ? ADD_LE_INSTRUMENT_PROFILES : ADD_INSTRUMENT_PROFILES;
    }
    const profileIndex = aiStableHash(`${entry.serial}:${index}`) % profiles.length;
    return { ...profiles[profileIndex], ...entry };
  });
}

let addInstrumentDraft = [];
let bulkInstrumentDraft = [];
let addInstrumentSystemsDraft = [];

function aiEscapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

const AI_ANALYTICAL_INSTRUMENT_FAMILIES = [
  "Atomic absorption and optical emission spectroscopy",
  "Automated sample prep",
  "Discrete analyzers",
  "Liquid, gas and ion chromatography",
  "Mass spectrometry – includes LC-, GC-, ICP-, IC-, and inorganic MS",
  "Spectroscopy – FT-IR, NIR, Raman, UV/Vis, Micro UV, NMR",
];

const AI_LAB_EQUIPMENT_FAMILIES = [
  "Baths and circulators",
  "Biological Safety cabinets and hoods",
  "Centrifuges - benchtop, general purpose, high speed, ultra-speed, industrial",
  "Chillers",
  "Environmental chambers",
  "Freezers – Cryo systems (-196° to -130°C), Lab Freezers (-40° to -10°C), ULT Freezers (-80° to -40°C)",
  "Incubators - Dry Bath, CO2, Microbiological, Plant Growth, and Refrigerated",
  "Lab Ovens and Furnaces",
  "Refrigerators – Blood storage, Chromatography, Flammable materials, Refrigerator/freezer combinations, Standard laboratory, Vaccine/Pharmacy Storage",
  "Rockers and shakers",
  "SpeedVac Vacuum Concentrators",
  "Water purification – Ultra Pure, Pure, Reverse Osmosis, Water Distillation, and Cartridge",
];

function aiSupportedInstrumentCategory(title, families) {
  return `<section class="ai-supported-dialog__category"><h3>${title}</h3><ul>${families.map((family) => `<li>${family}</li>`).join("")}</ul></section>`;
}

function aiSupportedInstrumentModalMarkup() {
  let region = "Europe*";
  let trailingCopy = "from the following categories. Any instruments uploaded that are not supported will not be recognized by Services Central at this time.";
  let includeLabEquipment = true;
  let includeEuropeDisclaimer = true;
  if (isNorthAmericaCmdPrototype()) {
    region = "the United States and Canada";
    trailingCopy = "from the following instrument categories. Any uploaded instruments that are not supported will not be recognized by Services Central.";
    includeLabEquipment = false;
    includeEuropeDisclaimer = false;
  } else if (isKoreaCmdPrototype()) {
    region = "the South Korea";
    trailingCopy = "from the following instrument categories. Any uploaded instruments that are not supported will not be recognized by Services Central.";
    includeLabEquipment = false;
    includeEuropeDisclaimer = false;
  }
  return `<p>Services Central currently supports Thermo Fisher Scientific instruments and lab equipment installed on <strong>01 January 2010</strong> or later in <strong>${region}</strong> ${trailingCopy}</p>
    <div class="ai-supported-dialog__families">
      ${aiSupportedInstrumentCategory("Analytical Instruments", AI_ANALYTICAL_INSTRUMENT_FAMILIES)}
      ${includeLabEquipment ? aiSupportedInstrumentCategory("Lab Equipment", AI_LAB_EQUIPMENT_FAMILIES) : ""}
    </div>
    ${includeEuropeDisclaimer ? '<p class="ai-supported-dialog__disclaimer">* United Kingdom, Ireland, Norway, Finland, Sweden, Denmark, Iceland, Belgium, Netherlands, Luxembourg, Germany, Austria, Switzerland, France, Italy, Spain</p>' : ""}`;
}

function openAiSupportedInstrumentDialog() {
  const dialog = app.querySelector("[data-ai-supported-dialog]");
  if (!dialog) return;
  const content = dialog.querySelector("[data-ai-supported-content]");
  content.innerHTML = aiSupportedInstrumentModalMarkup();
  content.scrollTop = 0;
  if (!dialog.open) dialog.showModal();
  dialog.querySelector("#supported-dialog-title")?.focus();
}

function aiWorkbookCellValue(cell, sharedStrings) {
  if (!cell) return "";
  const type = cell.getAttribute("t");
  if (type === "inlineStr") return [...cell.querySelectorAll("t")].map((node) => node.textContent || "").join("");
  const raw = cell.querySelector("v")?.textContent || "";
  if (type === "s") return sharedStrings[Number(raw)] || "";
  return raw;
}

function aiNormalizeWorkbookPath(target) {
  const parts = target.replace(/^\//, "").split("/");
  const normalized = [];
  parts.forEach((part) => {
    if (part === "..") normalized.pop();
    else if (part && part !== ".") normalized.push(part);
  });
  return normalized.join("/");
}

async function parseBulkInstrumentWorkbook(file) {
  const errors = [];
  if (!file?.name.toLowerCase().endsWith(".xlsx")) return { valid: false, errors: ["Only .xlsx files are supported."] };
  try {
    const zip = await window.JSZip.loadAsync(file);
    const parser = new DOMParser();
    const parseXml = async (path) => {
      const entry = zip.file(path);
      if (!entry) throw new Error(`Missing workbook part: ${path}`);
      return parser.parseFromString(await entry.async("text"), "application/xml");
    };
    const sharedStrings = [];
    if (zip.file("xl/sharedStrings.xml")) {
      const sharedXml = await parseXml("xl/sharedStrings.xml");
      sharedXml.querySelectorAll("si").forEach((item) => sharedStrings.push([...item.querySelectorAll("t")].map((node) => node.textContent || "").join("")));
    }
    const workbookXml = await parseXml("xl/workbook.xml");
    const relationshipsXml = await parseXml("xl/_rels/workbook.xml.rels");
    const firstSheet = workbookXml.querySelector("sheet");
    const relationshipId = firstSheet?.getAttribute("r:id") || firstSheet?.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
    const relationship = [...relationshipsXml.querySelectorAll("Relationship")].find((item) => item.getAttribute("Id") === relationshipId);
    const relationshipTarget = relationship?.getAttribute("Target") || "";
    const sheetPath = relationship ? aiNormalizeWorkbookPath(relationshipTarget.startsWith("/") ? relationshipTarget : `xl/${relationshipTarget}`) : "xl/worksheets/sheet1.xml";
    const sheetXml = await parseXml(sheetPath);
    const values = new Map();
    sheetXml.querySelectorAll("c").forEach((cell) => values.set(cell.getAttribute("r"), aiWorkbookCellValue(cell, sharedStrings).trim()));
    const expectedHeaders = ["Item* (required)", "Serial Number* (required)", "Nickname (optional)"];
    expectedHeaders.forEach((header, index) => {
      const column = String.fromCharCode(65 + index);
      if (values.get(`${column}1`) !== header) errors.push(`Column ${column} must be titled “${header}”.`);
    });
    const numberingValid = Array.from({ length: 50 }, (_, index) => values.get(`A${index + 2}`) === String(index + 1)).every(Boolean);
    if (!numberingValid) errors.push("The first column must contain the item numbers 1 through 50 in order.");
    const entries = [];
    for (let row = 2; row <= 51; row += 1) {
      const serial = values.get(`B${row}`) || "";
      const nickname = values.get(`C${row}`) || "";
      if (nickname.length > 90) errors.push(`Item ${row - 1} has a nickname longer than 90 characters.`);
      if (!serial) continue;
      entries.push({ item: row - 1, serial, nickname, users: String((row % 3) + 1), group: "—", locked: false, pendingNew: true, selected: true });
    }
    const extraSerial = [...values.entries()].find(([reference, value]) => /^B(?:5[2-9]|[6-9]\d|\d{3,})$/.test(reference) && value);
    if (extraSerial) errors.push("The maximum amount of instruments per upload is 50.");
    if (!entries.length) errors.push("Add at least one serial number in the “Serial Number* (required)” column.");
    return { valid: errors.length === 0, errors, entries: assignAddInstrumentProfiles(entries) };
  } catch (error) {
    return { valid: false, errors: ["This file could not be read as a valid .xlsx workbook."] };
  }
}

function aiStableHash(value) {
  return [...String(value)].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 2166136261);
}

function aiBulkSectionCounts(total) {
  if (total === 22) return [10, 2, 4, 2, 2, 2];
  const weights = [0.4, 0.1, 0.1, 0.1, 0.1, 0.2];
  const raw = weights.map((weight) => total * weight);
  const counts = raw.map(Math.floor);
  let remaining = total - counts.reduce((sum, count) => sum + count, 0);
  raw.map((value, index) => ({ index, remainder: value - counts[index] })).sort((a, b) => b.remainder - a.remainder || a.index - b.index).forEach(({ index }) => {
    if (remaining > 0) { counts[index] += 1; remaining -= 1; }
  });
  return counts;
}

function assignBulkInstrumentSections(entries) {
  const sectionIds = ["ready", "nickname", "approval", "suggestions", "unrecognized", "unsupported"];
  const shuffled = entries.map((entry) => ({ ...entry }));
  let randomState = entries.reduce((seed, entry) => seed ^ aiStableHash(`${entry.serial}:${entry.nickname}:${entry.item}`), 0x9e3779b9) >>> 0;
  const nextRandom = () => {
    randomState = (randomState + 0x6d2b79f5) >>> 0;
    let value = randomState;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(nextRandom() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  const counts = aiBulkSectionCounts(shuffled.length);
  const nicknameCandidates = shuffled.filter((instrument) => instrument.nickname);
  const nicknameInstruments = nicknameCandidates.slice(0, counts[1]);
  const nicknameItems = new Set(nicknameInstruments.map((instrument) => instrument.item));
  const remaining = shuffled.filter((instrument) => !nicknameItems.has(instrument.item));
  const sectionInstruments = { nickname: nicknameInstruments };
  let cursor = 0;
  ["approval", "suggestions", "unrecognized", "unsupported"].forEach((id, offset) => {
    const count = counts[offset + 2];
    sectionInstruments[id] = remaining.slice(cursor, cursor + count);
    cursor += count;
  });
  sectionInstruments.ready = remaining.slice(cursor);
  return sectionIds.map((id) => ({
    id,
    instruments: (sectionInstruments[id] || []).map((instrument) => ({
      ...instrument,
      bulkSection: id,
      currentNickname: id === "nickname" ? `Registered ${instrument.item}` : instrument.nickname || "—",
      selected: ["ready", "nickname", "approval"].includes(id),
    })),
  }));
}

function aiBulkReviewTable(section, total) {
  if (!section.instruments.length) return "";
  const selectable = ["ready", "nickname", "approval"].includes(section.id);
  const titleMap = {
    ready: `${section.instruments.length} out of ${total} instrument(s) ready to add`,
    nickname: `${section.instruments.length} out of ${total} instrument(s) ready to add, but with a different nickname`,
    approval: `${section.instruments.length} out of ${total} instrument(s) need approval`,
    suggestions: `${section.instruments.length} instrument(s) with suggestions found`,
    unrecognized: `${section.instruments.length} instrument(s) not recognized`,
    unsupported: `${section.instruments.length} instrument(s) not supported`,
  };
  const descriptionMap = {
    ready: "Please review the recognized instrument(s) below. Continue to the next step to add the selected instruments.",
    nickname: "Instrument(s) below exist in Services Central but with a nickname that is different from what you entered. The current nickname will remain. Nicknames can be changed at any time.",
    approval: "Instrument(s) selected below require approval before they can be added to your account. An access request will be automatically sent if you continue.",
    suggestions: "Review the suggestion(s) and select the correct match or continue to the next step. Instrument(s) without a selected match will not be added to your account.",
    unrecognized: "Confirm serial number errors and search again, or continue to the next step to add any recognized instruments.",
    unsupported: 'Services Central currently supports <a href="#supported-instrument-families" data-ai-specific-families>specific instrument families</a> installed on 01 January 2010 or later in the United States, Canada, Europe and South Korea.',
  };
  const selectableColgroup = section.id === "ready"
    ? '<colgroup><col class="ai-bulk-col-check" /><col class="ai-bulk-col-item" /><col class="ai-bulk-col-image" /><col class="ai-bulk-col-serial" /><col class="ai-bulk-col-nickname-wide" /><col class="ai-bulk-col-type" /><col class="ai-bulk-col-catalog" /><col class="ai-bulk-col-users" /></colgroup>'
    : '<colgroup><col class="ai-bulk-col-check" /><col class="ai-bulk-col-item" /><col class="ai-bulk-col-image" /><col class="ai-bulk-col-serial" /><col class="ai-bulk-col-nickname" /><col class="ai-bulk-col-nickname" /><col class="ai-bulk-col-type" /><col class="ai-bulk-col-catalog" /><col class="ai-bulk-col-users" /></colgroup>';
  const statusColgroup = '<colgroup><col class="ai-bulk-col-status" /><col class="ai-bulk-col-item" /><col class="ai-bulk-col-status-serial" /><col class="ai-bulk-col-nickname-wide" /><col class="ai-bulk-col-status-action" /></colgroup>';
  const usersHeader = '<span class="ai-bulk-users-header"><img src="assets/icons/notifications/info/size=16px, style=bold.svg" alt="" />Users</span>';
  const header = selectable
    ? `<tr><th><input type="checkbox" data-ai-bulk-select-all="${section.id}" checked aria-label="Select all ${aiEscapeHtml(titleMap[section.id])}" /></th><th>Item</th><th></th><th>Serial number</th>${section.id === "ready" ? "<th>Nickname (optional)</th>" : "<th>Current nickname</th><th>Entered nickname</th>"}<th>Type</th><th>Catalog no.</th><th>${usersHeader}</th></tr>`
    : `<tr><th aria-label="Status"></th><th>Item</th><th>Serial number</th><th>Nickname</th><th>${section.id === "unsupported" ? "Notes" : "Actions"}</th></tr>`;
  const rows = section.instruments.map((instrument) => {
    const profileImage = `<img class="ai-instrument-image" src="assets/instruments/${instrument.image}" alt="" />`;
    if (selectable) {
      const currentNickname = instrument.currentNickname;
      const enteredNickname = instrument.nickname || "—";
      return `<tr><td><input type="checkbox" data-ai-bulk-review-select data-ai-bulk-id="${instrument.item}" checked aria-label="Select ${aiEscapeHtml(instrument.serial)}" /></td><td>${instrument.item}</td><td>${profileImage}</td><td>${aiEscapeHtml(instrument.serial)}</td>${section.id === "ready" ? `<td><input class="ai-bulk-review-nickname" type="text" value="${aiEscapeHtml(instrument.nickname)}" placeholder="Example Asset ID or Instrument name" data-ai-bulk-nickname="${instrument.item}" /></td>` : `<td>${aiEscapeHtml(currentNickname)}</td><td>${aiEscapeHtml(enteredNickname)}</td>`}<td>${miInstrumentType(instrument)}</td><td>${instrument.model}</td><td class="mi-users-cell">${miUserCountMarkup(instrument.users, `instrument:${instrument.serial}`)}</td></tr>`;
    }
    if (section.id === "suggestions") return `<tr><td class="ai-bulk-status-cell"><img class="ai-bulk-status-icon is-warning" src="assets/icons/notifications/warning/size=24px, style=bold.svg" alt="Warning" /></td><td>${instrument.item}</td><td><label class="ai-bulk-validation"><input class="ai-bulk-review-serial is-warning" value="${aiEscapeHtml(instrument.serial)}" aria-label="Serial number for item ${instrument.item}" /><small>Multiple records found.</small></label></td><td>${aiEscapeHtml(instrument.nickname || "—")}</td><td><button class="mi-button" type="button">Review suggestions</button></td></tr>`;
    if (section.id === "unrecognized") return `<tr><td class="ai-bulk-status-cell"><img class="ai-bulk-status-icon is-error" src="assets/icons/notifications/alert/size=24px, style=bold.svg" alt="Error" /></td><td>${instrument.item}</td><td><label class="ai-bulk-validation"><input class="ai-bulk-review-serial is-error" value="${aiEscapeHtml(instrument.serial)}" aria-label="Unrecognized serial number for item ${instrument.item}" /><small>Serial number not recognized</small></label></td><td>${aiEscapeHtml(instrument.nickname || "—")}</td><td><button class="mi-button" type="button" disabled>Search again</button></td></tr>`;
    return `<tr><td class="ai-bulk-status-cell"><img class="ai-bulk-status-icon is-unsupported" src="assets/icons/notifications/prohibited/size=24px, style=bold.svg" alt="Not supported" /></td><td>${instrument.item}</td><td>${aiEscapeHtml(instrument.serial)}</td><td>${aiEscapeHtml(instrument.nickname || "—")}</td><td>Instrument installed in a country currently not supported</td></tr>`;
  }).join("");
  const contentId = `ai-bulk-section-${section.id}`;
  const expanded = section.id !== "ready";
  const sectionAction = section.id === "suggestions" ? '<button class="ai-bulk-review-all" type="button">Review all suggestions</button>' : "";
  return `<section class="ai-bulk-review-section" data-ai-bulk-review-section="${section.id}"><div class="ai-bulk-review-section__header"><button class="ai-bulk-review-section__toggle" type="button" aria-expanded="${expanded}" aria-controls="${contentId}" aria-label="${expanded ? "Collapse" : "Expand"} ${aiEscapeHtml(titleMap[section.id])}"><img src="assets/icons/directions/chevron ${expanded ? "up" : "down"}/size=24px, style=mono.svg" alt="" /></button><span class="ai-bulk-review-section__copy"><strong>${titleMap[section.id]}</strong><small>${descriptionMap[section.id]}</small></span>${sectionAction}</div><div class="ai-bulk-review-section__content" id="${contentId}" ${expanded ? "" : "hidden"}><div class="ai-bulk-review-table-wrap"><table class="ai-bulk-review-table ai-bulk-review-table--${section.id}">${selectable ? selectableColgroup : statusColgroup}<thead>${header}</thead><tbody>${rows}</tbody></table></div></div></section>`;
}

function showBulkInstrumentReviewStep() {
  if (isUnmappedPrototypeUser()) {
    addInstrumentDraft = bulkInstrumentDraft.map((instrument, index) => ({
      ...instrument,
      item: instrument.item ?? index + 1,
      selected: true,
    }));
    showAddInstrumentStep(2);
    return;
  }
  const form = app.querySelector(".ai-form");
  const inputContent = form.querySelector(".ai-columns");
  const main = app.querySelector(".ai-main");
  const actionBar = app.querySelector("[data-platform-actionbar]");
  const actionBarLeading = actionBar.querySelector(".platform-actionbar__leading");
  const actionBarBack = actionBar.querySelector('[data-actionbar-action="back"]');
  const actionBarPrimary = actionBar.querySelector('[data-actionbar-action="primary"]');
  const sections = assignBulkInstrumentSections(bulkInstrumentDraft);
  const assigned = sections.flatMap((section) => section.instruments);
  bulkInstrumentDraft = assigned;
  form.querySelector("[data-ai-step-content]")?.remove();
  inputContent.hidden = true;
  actionBar.hidden = false;
  actionBarLeading.hidden = true;
  actionBarBack.hidden = false;
  actionBarPrimary.textContent = "Continue";
  main.classList.add("platform-page-body--has-actionbar");
  updateAddInstrumentStepper(2);
  main.scrollTop = 0;
  form.insertAdjacentHTML("beforeend", `<section class="ai-bulk-review" data-ai-step-content="2" aria-labelledby="ai-bulk-review-title"><h2 id="ai-bulk-review-title">Instrument(s) need review</h2><div class="ai-bulk-review-sections">${sections.map((section) => aiBulkReviewTable(section, assigned.length)).join("")}</div></section>`);
  const updateSelection = () => {
    const selectedItems = new Set([...form.querySelectorAll("[data-ai-bulk-review-select]:checked")].map((checkbox) => Number(checkbox.dataset.aiBulkId)));
    bulkInstrumentDraft.forEach((instrument) => { instrument.selected = selectedItems.has(instrument.item); });
    form.querySelectorAll("[data-ai-bulk-select-all]").forEach((selectAll) => {
      const section = selectAll.dataset.aiBulkSelectAll;
      const checkboxes = [...form.querySelectorAll(`[data-ai-bulk-review-section="${section}"] [data-ai-bulk-review-select]`)];
      const checked = checkboxes.filter((checkbox) => checkbox.checked).length;
      selectAll.checked = checked === checkboxes.length && checkboxes.length > 0;
      selectAll.indeterminate = checked > 0 && checked < checkboxes.length;
    });
    window.PlatformActionBar?.setPrimaryDisabled(actionBar, selectedItems.size === 0);
  };
  form.querySelectorAll("[data-ai-bulk-review-select]").forEach((checkbox) => checkbox.addEventListener("change", updateSelection));
  form.querySelectorAll("[data-ai-bulk-select-all]").forEach((selectAll) => selectAll.addEventListener("change", () => {
    form.querySelectorAll(`[data-ai-bulk-review-section="${selectAll.dataset.aiBulkSelectAll}"] [data-ai-bulk-review-select]`).forEach((checkbox) => { checkbox.checked = selectAll.checked; });
    updateSelection();
  }));
  form.querySelectorAll("[data-ai-bulk-nickname]").forEach((input) => input.addEventListener("input", () => {
    const instrument = bulkInstrumentDraft.find((candidate) => candidate.item === Number(input.dataset.aiBulkNickname));
    if (instrument) instrument.nickname = input.value;
  }));
  form.querySelectorAll(".ai-bulk-review-section__toggle").forEach((toggle) => toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    toggle.setAttribute("aria-label", `${expanded ? "Expand" : "Collapse"} ${toggle.closest(".ai-bulk-review-section__header").querySelector("strong").textContent}`);
    form.querySelector(`#${toggle.getAttribute("aria-controls")}`).hidden = expanded;
    toggle.querySelector("img").src = `assets/icons/directions/chevron ${expanded ? "down" : "up"}/size=24px, style=mono.svg`;
  }));
  form.querySelectorAll("[data-ai-specific-families]").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    openAiSupportedInstrumentDialog();
  }));
  updateSelection();
  actionBarBack.onclick = () => showAddInstrumentStep(1);
  actionBarPrimary.onclick = () => {
    if (!form.querySelector("[data-ai-bulk-review-select]:checked")) {
      window.PlatformActionBar?.setPrimaryDisabled(actionBar, true);
      return;
    }
    const approvalUsers = ["carla.flores@company.com", "sergio.sanchez@company.com", "tammy.hall@company.com", "oliver.clark@company.com"];
    const approvalBatch = bulkInstrumentDraft.filter((instrument) => instrument.bulkSection === "approval" && instrument.selected);
    const approvalUser = approvalUsers[aiStableHash(bulkInstrumentDraft.map((instrument) => instrument.serial).join("|")) % approvalUsers.length];
    approvalBatch.forEach((instrument) => {
      const id = `bulk-approval-${instrument.serial}`;
      if (MI_PENDING_AWAITING_ITEMS.some((item) => item.id === id)) return;
      MI_PENDING_AWAITING_ITEMS.unshift({
        id,
        kind: "instrument",
        user: approvalUser,
        serial: instrument.serial,
        nickname: instrument.nickname || "—",
        type: miInstrumentType(instrument),
        model: instrument.model,
        expires: "19 Sep 2026",
        image: instrument.image,
      });
    });
    addInstrumentDraft = bulkInstrumentDraft.map((instrument) => ({
      ...instrument,
      nickname: instrument.bulkSection === "nickname" ? instrument.currentNickname : instrument.nickname,
      reviewSelected: instrument.selected,
      selected: instrument.selected && ["ready", "nickname"].includes(instrument.bulkSection),
    }));
    aiPrepareAddedSystems();
    addInstrumentDraft.filter((instrument) => instrument.selected).forEach((instrument) => {
      const existing = miCurrentInstruments().find((candidate) => candidate.serial === instrument.serial);
      if (existing) Object.assign(existing, instrument, { nickname: instrument.nickname || "—", pendingNew: true });
      else miCurrentInstruments().push({ ...instrument, nickname: instrument.nickname || "—" });
    });
    showAddInstrumentStep(3);
  };
  wireMiUserCountTooltips(form);
}

function addInstrumentEntryRows(count = 1, entries = []) {
  const container = app.querySelector("[data-ai-rows]");
  const startIndex = container.children.length;
  const fragment = document.createDocumentFragment();
  for (let offset = 0; offset < count; offset += 1) {
    const rowNumber = startIndex + offset + 1;
    const entry = entries[offset] || {};
    const row = document.createElement("div");
    row.className = "ai-entry-row";
    row.innerHTML = `<label><span class="sr-only">Serial number ${rowNumber}</span><input type="text" data-ai-serial value="${aiEscapeHtml(entry.serial || "")}" autocomplete="off" /></label><label><span class="sr-only">Nickname ${rowNumber}</span><input type="text" data-ai-nickname value="${aiEscapeHtml(entry.nickname || "")}" placeholder="Example Asset ID or Instrument name" autocomplete="off" /></label><button type="button" data-ai-remove aria-label="Remove instrument row ${rowNumber}" ${entry.serial ? "" : "disabled"}><img src="assets/icons/actions/bin/size=24px, style=mono.svg" alt="" /></button>`;
    fragment.append(row);
  }
  container.append(fragment);
}

function updateAddInstrumentsContinueState() {
  const rows = [...app.querySelectorAll(".ai-entry-row")];
  rows.forEach((row) => {
    const hasSerial = row.querySelector("[data-ai-serial]").value.trim() !== "";
    row.querySelector("[data-ai-remove]").disabled = !hasSerial;
  });
  const hasSerial = rows.some((row) => row.querySelector("[data-ai-serial]").value.trim() !== "");
  const continueButton = app.querySelector("[data-ai-continue]");
  continueButton.disabled = !hasSerial;
}

function collectAddInstrumentDraft() {
  const seen = new Set();
  const entries = [...app.querySelectorAll(".ai-entry-row")].flatMap((row) => {
    const serial = row.querySelector("[data-ai-serial]").value.trim();
    if (!serial || seen.has(serial)) return [];
    seen.add(serial);
    const nickname = row.querySelector("[data-ai-nickname]").value.trim();
    return [{ serial, nickname, users: "1", group: "—", locked: false, pendingNew: true, selected: true }];
  });
  addInstrumentDraft = assignAddInstrumentProfiles(entries);
}

function aiPrepareAddedSystems() {
  const eligible = addInstrumentDraft.filter((instrument) => instrument.selected);
  addInstrumentSystemsDraft = [];
  if (!bulkInstrumentDraft.length || !eligible.length) return;
  const names = ["Alpine", "Vanquish Core", "Chromeleon Lab"];
  const systemCount = Math.min(3, Math.max(1, Math.ceil(eligible.length / 5)));
  const usedSerials = new Set(miCurrentInstruments().map((instrument) => instrument.serial));
  for (let index = 0; index < systemCount; index += 1) {
    const enteredComponents = eligible.slice(index * 2, (index * 2) + 2);
    const enteredComponent = enteredComponents[0];
    if (!enteredComponent) break;
    const systemId = `onboarding-system-${aiStableHash(`${enteredComponent.serial}:${index}`).toString(36)}`;
    enteredComponents.forEach((component) => { component.summarySystemId = systemId; });
    const components = enteredComponents.map((component) => ({ ...component, includedWithSystem: false }));
    for (let componentIndex = 0; components.length < 4; componentIndex += 1) {
      const profile = ADD_INSTRUMENT_PROFILES[(index + componentIndex + 1) % ADD_INSTRUMENT_PROFILES.length];
      let serial = `SYS-${String(index + 1).padStart(2, "0")}-${String(componentIndex + 1).padStart(2, "0")}-${enteredComponent.serial}`;
      while (usedSerials.has(serial)) serial = `${serial}-A`;
      usedSerials.add(serial);
      components.push({
        ...profile,
        item: null,
        serial,
        nickname: ["Column module", "Pump module", "Sampler module"][(index + componentIndex) % 3],
        users: "3",
        group: "—",
        locked: false,
        pendingNew: true,
        selected: true,
        includedWithSystem: true,
        summarySystemId: systemId,
      });
    }
    const system = {
      id: systemId,
      nickname: names[index],
      notes: "",
      typeCode: "HPLC",
      users: "3",
      locked: false,
      admin: false,
      pendingNew: true,
      components,
    };
    addInstrumentSystemsDraft.push(system);
    components.forEach((component) => {
      const existing = miCurrentInstruments().find((instrument) => instrument.serial === component.serial);
      if (existing) Object.assign(existing, component, { nickname: component.nickname || "—", pendingNew: true });
      else miCurrentInstruments().push({ ...component, nickname: component.nickname || "—" });
    });
    if (!miFindSystemById(systemId)) MI_CREATED_SYSTEMS.unshift({ ...system, components: components.map((component) => component.serial) });
  }
}

function aiSummaryNotAddedNote(instrument) {
  if (instrument.reviewSelected === false && ["ready", "nickname", "approval"].includes(instrument.bulkSection)) return "Instrument not selected in previous step";
  return ({
    approval: "Access request awaiting approval",
    suggestions: "Instrument suggestion requires review",
    unrecognized: "Instrument not found for your organization",
    unsupported: "Instrument installed in a country currently not supported",
  })[instrument.bulkSection] || "Instrument not selected in previous step";
}

function aiSummaryInstrumentTable(instruments) {
  return `<div class="ai-summary-table-wrap"><table class="ai-summary-table"><colgroup><col class="ai-summary-col-item" /><col class="ai-summary-col-image" /><col /><col /><col /><col /><col /><col /><col class="ai-summary-col-users" /></colgroup><thead><tr><th>Item</th><th></th><th>Serial number</th><th>Nickname</th><th>Type</th><th>Catalog no.</th><th>Coverage</th><th>Coverage end</th><th>Users</th></tr></thead><tbody>${instruments.map((instrument, index) => `<tr><td>${instrument.item ?? index + 1}</td><td><img class="ai-instrument-image" src="assets/instruments/${instrument.image}" alt="" /></td><td><button class="mi-link" type="button" data-route="${miInstrumentDetailRoute(instrument.serial)}">${aiEscapeHtml(instrument.serial)}</button></td><td>${instrument.nickname ? aiEscapeHtml(instrument.nickname) : "—"}</td><td>${miInstrumentType(instrument)}</td><td>${instrument.model}</td><td>${instrument.coverage}</td><td>${instrument.end}</td><td class="mi-users-cell">${miUserCountMarkup(instrument.users, `instrument:${instrument.serial}`)}</td></tr>`).join("")}</tbody></table></div>`;
}

function aiSummarySystemsMarkup() {
  if (!addInstrumentSystemsDraft.length) return "";
  const rows = addInstrumentSystemsDraft.map((system) => {
    const key = `ai-summary-system-${system.id}`;
    const parent = `<tr class="ai-summary-system-row"><td><button class="ai-summary-system-toggle" type="button" data-ai-summary-system-toggle="${key}" aria-expanded="true" aria-label="Collapse ${aiEscapeHtml(system.nickname)} components"><img src="assets/icons/directions/chevron up/size=16px, style=mono.svg" alt="" /></button></td><td></td><td><img class="ai-summary-system-icon" src="assets/icons/science/system/size=24px, style=mono.svg" alt="" /></td><td></td><td><button class="mi-link" type="button" data-route="system-detail-${system.id}">System</button></td><td>${aiEscapeHtml(system.nickname)}</td><td>${system.typeCode}</td><td>—</td><td>—</td><td>—</td><td class="mi-users-cell">${miUserCountMarkup(system.users, `system:${system.id}`)}</td></tr>`;
    const children = system.components.map((instrument) => `<tr class="ai-summary-system-component" data-ai-summary-system-component="${key}"><td>${instrument.includedWithSystem ? '<img class="ai-summary-auto-icon" src="assets/icons/science/new instrument/Size=24px, style=mono, type=Instrument.svg" alt="Automatically added with system" />' : ""}</td><td>${instrument.item ?? ""}</td><td>${miBranchIcon}</td><td><img class="ai-instrument-image" src="assets/instruments/${instrument.image}" alt="" /></td><td class="${instrument.includedWithSystem ? "is-auto-added" : ""}"><button class="mi-link" type="button" data-route="${miInstrumentDetailRoute(instrument.serial)}">${aiEscapeHtml(instrument.serial)}</button></td><td class="${instrument.includedWithSystem ? "is-auto-added" : ""}">${aiEscapeHtml(instrument.nickname || "—")}</td><td>${miInstrumentType(instrument)}</td><td>${instrument.model}</td><td>${instrument.coverage}</td><td>${instrument.end}</td><td></td></tr>`).join("");
    return parent + children;
  }).join("");
  return `<section class="ai-summary-section ai-summary-section--systems"><div class="ai-summary__description"><h2>System(s) found and added successfully</h2><p>Instrument(s) you entered exist within System(s) in Services Central. The entire System(s) have been added to your account.</p></div><div class="ai-summary-system-table-wrap"><table class="ai-summary-system-table"><colgroup><col class="ai-summary-system-col-status" /><col class="ai-summary-system-col-item" /><col class="ai-summary-system-col-branch" /><col class="ai-summary-system-col-image" /><col /><col class="ai-summary-system-col-nickname" /><col class="ai-summary-system-col-type" /><col class="ai-summary-system-col-model" /><col class="ai-summary-system-col-coverage" /><col class="ai-summary-system-col-end" /><col class="ai-summary-system-col-users" /></colgroup><thead><tr><th></th><th>Item</th><th></th><th></th><th>Serial number</th><th>Nickname</th><th>Type</th><th>Catalog no.</th><th>Coverage</th><th>Coverage end</th><th><span class="ai-bulk-users-header"><img src="assets/icons/notifications/info/size=16px, style=bold.svg" alt="" />Users</span></th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

function aiSummaryNotAddedMarkup(instruments, noteOverride = "") {
  if (!instruments.length) return "";
  return `<section class="ai-summary-section ai-summary-section--not-added"><h2>Instrument(s) not added</h2><div class="ai-summary-not-added-wrap"><table class="ai-summary-not-added"><colgroup><col class="ai-summary-not-added-item" /><col class="ai-summary-not-added-serial" /><col class="ai-summary-not-added-nickname" /><col /></colgroup><thead><tr><th>Item</th><th>Serial number</th><th>Nickname</th><th>Notes</th></tr></thead><tbody>${instruments.map((instrument, index) => `<tr><td>${instrument.item ?? index + 1}</td><td>${aiEscapeHtml(instrument.serial)}</td><td>${aiEscapeHtml(instrument.nickname || "")}</td><td>${aiEscapeHtml(noteOverride || aiSummaryNotAddedNote(instrument))}</td></tr>`).join("")}</tbody></table></div></section>`;
}

function aiUnmappedReviewMarkup() {
  return `<section class="ai-review ai-review--unmapped" data-ai-step-content="2" aria-label="Add instruments review">
    <div class="ai-account-warning" role="alert" data-ai-account-warning>
      <span class="ai-account-warning__accent" aria-hidden="true"></span>
      <span class="ai-account-warning__icon" aria-hidden="true"></span>
      <div class="ai-account-warning__copy">
        <strong>Unable to add instruments</strong>
        <p>An issue with your account needs to be resolved by our support team before you can add instruments. <button type="button" data-open-services-help data-help-source="Add instruments account warning">Please contact support.</button></p>
      </div>
    </div>
    <div>${aiSummaryNotAddedMarkup(addInstrumentDraft, "Account issue needs to be resolved by support")}</div>
  </section>`;
}

function addInstrumentStepMarkup(step) {
  const selected = addInstrumentDraft.filter((instrument) => instrument.selected);
  if (step === 2) {
    if (isUnmappedPrototypeUser()) return aiUnmappedReviewMarkup();
    return `<section class="ai-review" data-ai-step-content="2" aria-labelledby="ai-review-title">
      <header class="ai-review__intro"><button type="button" data-ai-review-toggle aria-expanded="true" aria-controls="ai-recognized-content"><img src="assets/icons/directions/chevron up/size=24px, style=mono.svg" alt="" /><h2 id="ai-review-title">All instrument(s) recognized</h2></button></header>
      <section class="ai-review__ready" id="ai-recognized-content">
        <div class="ai-review__ready-title"><div><h3><span data-ai-ready-count>${selected.length}</span> out of ${addInstrumentDraft.length} instrument(s) ready to add</h3><p>Please review the recognized instrument(s) below. Continue to the next step to add the selected instruments.</p></div></div>
        <div class="ai-review-table-wrap"><table class="ai-review-table"><colgroup><col class="ai-review-col-check" /><col class="ai-review-col-item" /><col class="ai-review-col-image" /><col class="ai-review-col-serial" /><col class="ai-review-col-nickname" /><col class="ai-review-col-type" /><col class="ai-review-col-model" /><col class="ai-review-col-users" /></colgroup><thead><tr><th><input type="checkbox" data-ai-review-select-all checked aria-label="Select all recognized instruments" /></th><th>Item</th><th></th><th>Serial number</th><th>Nickname (optional)</th><th>Type</th><th>Catalog no.</th><th>Users</th></tr></thead><tbody>${addInstrumentDraft.map((instrument, index) => `<tr data-ai-review-row="${index}"><td><input type="checkbox" data-ai-review-select ${instrument.selected ? "checked" : ""} aria-label="Select ${aiEscapeHtml(instrument.serial)}" /></td><td>${index + 1}</td><td><img class="ai-instrument-image" src="assets/instruments/${instrument.image}" alt="" /></td><td>${aiEscapeHtml(instrument.serial)}</td><td><input type="text" data-ai-review-nickname value="${aiEscapeHtml(instrument.nickname)}" placeholder="Example Asset ID or Instrument name" aria-label="Nickname for ${aiEscapeHtml(instrument.serial)}" /></td><td>${miInstrumentType(instrument)}</td><td>${instrument.model}</td><td>${miUserCountMarkup(instrument.users, `instrument:${instrument.serial}`)}</td></tr>`).join("")}</tbody></table></div>
      </section>
    </section>`;
  }
  const standaloneSelected = selected.filter((instrument) => !instrument.summarySystemId);
  const notAdded = addInstrumentDraft.filter((instrument) => !instrument.selected);
  const systemComponentCount = addInstrumentSystemsDraft.reduce((count, system) => count + system.components.length, 0);
  return `<section class="ai-summary" data-ai-step-content="3" aria-labelledby="ai-summary-title">
    <div class="ai-summary-cards">${addInstrumentSystemsDraft.length ? `<div class="ai-summary-card"><strong>${addInstrumentSystemsDraft.length}</strong><span><b>System(s) added</b><small>${systemComponentCount} components inside ${addInstrumentSystemsDraft.length} system${addInstrumentSystemsDraft.length === 1 ? "" : "s"}</small></span></div>` : ""}<div class="ai-summary-card"><strong>${standaloneSelected.length}</strong><span><b>Instrument(s) added</b><small>Go to <button type="button" data-route="my-instruments">My Instruments</button></small></span></div><div class="ai-summary-card"><strong>${notAdded.length}</strong><span><b>Instrument(s) not added</b><small>Get help</small></span></div></div>
    ${aiSummarySystemsMarkup()}
    ${standaloneSelected.length ? `<section class="ai-summary-section"><div class="ai-summary__description"><h2 id="ai-summary-title">Instrument(s) added successfully</h2><p>Click a serial number for instrument support details, or visit <button type="button" data-route="my-instruments">My Instruments</button> to view all within Services Central.</p></div>${aiSummaryInstrumentTable(standaloneSelected)}</section>` : ""}
    ${aiSummaryNotAddedMarkup(notAdded)}
  </section>`;
}

function updateAddInstrumentStepper(step) {
  app.querySelectorAll(".ai-stepper li").forEach((item, index) => {
    const itemStep = index + 1;
    item.classList.toggle("is-current", itemStep === step);
    item.classList.toggle("is-complete", itemStep < step);
    item.toggleAttribute("aria-current", itemStep === step);
    const marker = item.querySelector("span");
    if (itemStep < step) marker.innerHTML = '<img src="assets/icons/actions/checkmark/size=24px, style=mono.svg" alt="" />';
    else marker.textContent = String(itemStep);
  });
}

function showAddInstrumentStep(step) {
  const form = app.querySelector(".ai-form");
  const inputContent = form.querySelector(".ai-columns");
  const main = app.querySelector(".ai-main");
  const actionBar = app.querySelector("[data-platform-actionbar]");
  const actionBarLeading = actionBar.querySelector(".platform-actionbar__leading");
  const actionBarBack = actionBar.querySelector('[data-actionbar-action="back"]');
  const actionBarPrimary = actionBar.querySelector('[data-actionbar-action="primary"]');
  form.querySelector("[data-ai-step-content]")?.remove();
  inputContent.hidden = step !== 1;
  actionBar.hidden = step === 1;
  actionBarLeading.hidden = true;
  main.classList.toggle("platform-page-body--has-actionbar", step > 1);
  updateAddInstrumentStepper(step);
  app.querySelector(".platform-page-body").scrollTop = 0;
  if (step === 1) return;
  actionBarBack.hidden = step === 3;
  actionBarPrimary.textContent = step === 3 ? "Go to My instruments" : "Continue";
  actionBarPrimary.disabled = false;
  actionBarBack.onclick = () => showAddInstrumentStep(1);
  actionBarPrimary.onclick = step === 3 ? () => setRoute("my-instruments") : null;
  form.insertAdjacentHTML("beforeend", addInstrumentStepMarkup(step));
  if (step === 2) {
    if (isUnmappedPrototypeUser()) {
      addInstrumentDraft.forEach((instrument) => {
        instrument.selected = false;
        instrument.reviewSelected = false;
      });
      window.PlatformActionBar?.setPrimaryDisabled(actionBar, true);
      actionBarPrimary.onclick = null;
      wireServicesHelpTriggers(form);
      return;
    }
    const updateReview = () => {
      const checkboxes = [...form.querySelectorAll("[data-ai-review-select]")];
      const selectedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
      form.querySelector("[data-ai-ready-count]").textContent = String(selectedCount);
      form.querySelector("[data-ai-review-select-all]").checked = selectedCount === checkboxes.length;
      form.querySelector("[data-ai-review-select-all]").indeterminate = selectedCount > 0 && selectedCount < checkboxes.length;
      window.PlatformActionBar?.setPrimaryDisabled(actionBar, selectedCount === 0);
    };
    form.querySelectorAll("[data-ai-review-select]").forEach((checkbox, index) => checkbox.addEventListener("change", () => {
      addInstrumentDraft[index].selected = checkbox.checked;
      updateReview();
    }));
    form.querySelector("[data-ai-review-select-all]").addEventListener("change", (event) => {
      form.querySelectorAll("[data-ai-review-select]").forEach((checkbox, index) => {
        checkbox.checked = event.currentTarget.checked;
        addInstrumentDraft[index].selected = checkbox.checked;
      });
      updateReview();
    });
    form.querySelectorAll("[data-ai-review-nickname]").forEach((input, index) => input.addEventListener("input", () => { addInstrumentDraft[index].nickname = input.value; }));
    form.querySelector("[data-ai-review-toggle]").addEventListener("click", (event) => {
      const button = event.currentTarget;
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      form.querySelector("#ai-recognized-content").hidden = expanded;
      button.querySelector("img").src = `assets/icons/directions/chevron ${expanded ? "down" : "up"}/size=24px, style=mono.svg`;
    });
    actionBarPrimary.onclick = () => {
      if (!form.querySelector("[data-ai-review-select]:checked")) {
        window.PlatformActionBar?.setPrimaryDisabled(actionBar, true);
        return;
      }
      addInstrumentSystemsDraft = [];
      addInstrumentDraft.forEach((instrument) => { instrument.reviewSelected = instrument.selected; });
      addInstrumentDraft.filter((instrument) => instrument.selected).forEach((instrument) => {
        const existing = miCurrentInstruments().find((candidate) => candidate.serial === instrument.serial);
        if (existing) Object.assign(existing, instrument, { nickname: instrument.nickname || "—", pendingNew: true });
        else miCurrentInstruments().push({ ...instrument, nickname: instrument.nickname || "—" });
      });
      showAddInstrumentStep(3);
    };
    wireMiUserCountTooltips(form);
  } else {
    form.querySelectorAll("[data-ai-summary-system-toggle]").forEach((toggle) => toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      const key = toggle.dataset.aiSummarySystemToggle;
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.setAttribute("aria-label", `${expanded ? "Expand" : "Collapse"} system components`);
      toggle.querySelector("img").src = `assets/icons/directions/chevron ${expanded ? "down" : "up"}/size=16px, style=mono.svg`;
      form.querySelectorAll(`[data-ai-summary-system-component="${key}"]`).forEach((row) => { row.hidden = expanded; });
    }));
    wireMiUserCountTooltips(form);
    wireRouteControls(form);
  }
}

function wireAddInstruments() {
  addInstrumentEntryRows(5);
  const actionBar = window.PlatformActionBar?.mount(app.querySelector("[data-ai-actionbar-mount]"), { primaryDisabled: true });
  actionBar?.classList.add("platform-actionbar--native-flow", "ai-platform-actionbar");
  if (actionBar) actionBar.hidden = true;
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
  app.querySelector("[data-ai-continue]").addEventListener("click", () => {
    bulkInstrumentDraft = [];
    addInstrumentSystemsDraft = [];
    collectAddInstrumentDraft();
    showAddInstrumentStep(2);
  });

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
  const bulkFileInput = app.querySelector("[data-ai-file]");
  const bulkUploadArea = app.querySelector(".ai-bulk-upload");
  const bulkUploadInstructions = app.querySelector("[data-ai-bulk-upload-instructions]");
  const bulkUploadStatus = app.querySelector("[data-ai-bulk-upload-status]");
  const bulkFileRow = app.querySelector("[data-ai-bulk-file-row]");
  let bulkUploadRequest = 0;
  const resetBulkUpload = () => {
    bulkUploadRequest += 1;
    bulkInstrumentDraft = [];
    bulkFileInput.value = "";
    bulkUploadInstructions.hidden = false;
    bulkUploadStatus.hidden = true;
    bulkUploadStatus.className = "ai-bulk-upload__status";
    bulkUploadStatus.replaceChildren();
    bulkFileRow.hidden = true;
    bulkFileRow.className = "ai-bulk-file-row";
    bulkFileRow.replaceChildren();
  };
  const renderBulkProgress = (file, progress) => {
    bulkUploadInstructions.hidden = true;
    bulkUploadStatus.hidden = false;
    bulkUploadStatus.className = "ai-bulk-upload__status is-uploading";
    bulkUploadStatus.innerHTML = `<i class="ai-bulk-upload__progress" style="--ai-upload-progress:${progress}%"></i><div><p>Uploading files…</p><span><strong data-ai-upload-progress>${progress}</strong><small>%</small></span><button class="mi-button" type="button" data-ai-bulk-cancel>Cancel</button></div>`;
    bulkFileRow.hidden = false;
    bulkFileRow.className = "ai-bulk-file-row is-uploading";
    bulkFileRow.innerHTML = `<img src="assets/icons/media/document/size=24px, style=mono.svg" alt="" /><div><span>${aiEscapeHtml(file.name)}</span><i><b style="width:${progress}%"></b></i></div><small>${progress}%</small><button class="mi-button ai-continue" type="button" data-ai-bulk-continue disabled>Continue</button>`;
  };
  const renderBulkValid = (file, entries) => {
    bulkInstrumentDraft = entries;
    bulkUploadStatus.className = "ai-bulk-upload__status is-complete";
    bulkUploadStatus.innerHTML = `<img src="assets/icons/actions/cloud upload/Size=32px, Style=Mono.svg" alt="" /><h3>File upload complete</h3><p>Only one file may be uploaded at a time.<br />Click the button below to continue</p>`;
    const sizeMb = Math.max(0.1, file.size / 1000000).toFixed(file.size >= 1000000 ? 0 : 1);
    bulkFileRow.className = "ai-bulk-file-row is-valid";
    bulkFileRow.innerHTML = `<img src="assets/icons/media/document/size=24px, style=mono.svg" alt="" /><img class="ai-bulk-file-row__state" src="assets/icons/actions/checkmark/size=16px, style=mono.svg" alt="Valid file" /><span>${aiEscapeHtml(file.name)}</span><small>${sizeMb} mb</small><button class="mi-button" type="button" data-ai-bulk-remove>Remove file</button><button class="mi-button ai-continue" type="button" data-ai-bulk-continue>Continue</button>`;
  };
  const renderBulkError = (file, errors) => {
    bulkInstrumentDraft = [];
    bulkUploadStatus.className = "ai-bulk-upload__status is-error";
    bulkUploadStatus.innerHTML = `<img src="assets/icons/notifications/alert/size=16px, style=bold.svg" alt="" /><h3>File upload failed</h3><p>Correct the following issues and upload the file again:</p><ul>${errors.map((error) => `<li>${aiEscapeHtml(error)}</li>`).join("")}</ul>`;
    bulkFileRow.className = "ai-bulk-file-row is-error";
    bulkFileRow.innerHTML = `<img src="assets/icons/media/document/size=24px, style=mono.svg" alt="" /><img class="ai-bulk-file-row__state" src="assets/icons/notifications/alert/size=16px, style=mono.svg" alt="Invalid file" /><span>${aiEscapeHtml(file.name)}</span><small>Failed</small><button class="mi-button" type="button" data-ai-bulk-remove>Remove file</button><button class="mi-button ai-continue" type="button" data-ai-bulk-continue disabled>Continue</button>`;
  };
  const processBulkFile = async (file) => {
    if (!file) return;
    const request = ++bulkUploadRequest;
    let progress = 10;
    renderBulkProgress(file, progress);
    const progressTimer = window.setInterval(() => {
      progress = Math.min(90, progress + 8);
      const progressNumber = bulkUploadStatus.querySelector("[data-ai-upload-progress]");
      if (progressNumber) progressNumber.textContent = String(progress);
      bulkUploadStatus.querySelector(".ai-bulk-upload__progress")?.style.setProperty("--ai-upload-progress", `${progress}%`);
      const fileProgress = bulkFileRow.querySelector("i b");
      if (fileProgress) fileProgress.style.width = `${progress}%`;
      const filePercent = bulkFileRow.querySelector("small");
      if (filePercent) filePercent.textContent = `${progress}%`;
    }, 90);
    const [result] = await Promise.all([parseBulkInstrumentWorkbook(file), new Promise((resolve) => window.setTimeout(resolve, 720))]);
    window.clearInterval(progressTimer);
    if (request !== bulkUploadRequest) return;
    if (result.valid) renderBulkValid(file, result.entries);
    else renderBulkError(file, result.errors);
  };
  bulkFileInput.addEventListener("change", (event) => processBulkFile(event.currentTarget.files[0]));
  ["dragenter", "dragover"].forEach((type) => bulkUploadArea.addEventListener(type, (event) => {
    event.preventDefault();
    bulkUploadArea.classList.add("is-dragging");
  }));
  ["dragleave", "drop"].forEach((type) => bulkUploadArea.addEventListener(type, (event) => {
    event.preventDefault();
    bulkUploadArea.classList.remove("is-dragging");
  }));
  bulkUploadArea.addEventListener("drop", (event) => {
    processBulkFile(event.dataTransfer.files[0]);
  });
  const bulkPanel = app.querySelector(".ai-bulk-panel");
  bulkPanel.addEventListener("click", (event) => {
    if (event.target.closest("[data-ai-bulk-cancel], [data-ai-bulk-remove]")) resetBulkUpload();
    if (event.target.closest("[data-ai-bulk-continue]:not(:disabled)")) showBulkInstrumentReviewStep();
  });
  const bulkInstructionsDialog = app.querySelector("[data-ai-bulk-instructions-dialog]");
  app.querySelector("[data-ai-bulk-instructions]").addEventListener("click", () => {
    bulkInstructionsDialog.showModal();
    bulkInstructionsDialog.scrollTop = 0;
    bulkInstructionsDialog.querySelector("#ai-bulk-instructions-title").focus();
  });
  bulkInstructionsDialog.querySelectorAll("[data-ai-bulk-instructions-close]").forEach((button) => button.addEventListener("click", () => bulkInstructionsDialog.close()));

  let bannerIndex = 0;
  const updateBannerDots = () => {
    app.querySelectorAll(".ai-banner__dots span").forEach((dot, index) => dot.classList.toggle("is-active", index === bannerIndex));
    app.querySelector(".ai-banner__dots").setAttribute("aria-label", `Suggestion ${bannerIndex + 1} of 3`);
  };
  app.querySelector("[data-ai-banner-prev]").addEventListener("click", () => { bannerIndex = (bannerIndex + 2) % 3; updateBannerDots(); });
  app.querySelector("[data-ai-banner-next]").addEventListener("click", () => { bannerIndex = (bannerIndex + 1) % 3; updateBannerDots(); });

  const supportedDialog = app.querySelector("[data-ai-supported-dialog]");
  app.querySelectorAll("[data-ai-supported]").forEach((button) => button.addEventListener("click", openAiSupportedInstrumentDialog));
  app.querySelectorAll("[data-ai-supported-close]").forEach((button) => button.addEventListener("click", () => supportedDialog.close()));
  supportedDialog.addEventListener("click", (event) => { if (event.target === supportedDialog) supportedDialog.close(); });
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderAddInstruments() {
  const template = document.querySelector("#add-instruments-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountTopbarSc();
  mountPlatformSidebar("add-instruments");
  mountFooter();
  wireAddInstruments();
  document.title = "Add instruments — Services Central";
}

const SUPPORT_HISTORY_TICKETS = [
  { status: "Open", ticket: "5551726344", type: "Tech Support", subject: "Won’t turn on", serial: "1009996", model: "VQF0000DET", nickname: "Detector-2B", group: "HPLC 2B...", contact: "Alma Duncan", created: "18 Oct 2020", closed: "---", systemNames: ["Alpine", "Sasha"] },
  { status: "In progress", ticket: "46521863", type: "Service Request", subject: "Repair 0000123459", serial: "1009999", model: "VQH0000VEN", nickname: "Column-2B", group: "HPLC 2B...", contact: "Alma Duncan", created: "18 Oct 2020", closed: "---", icon: "quote" },
  { status: "In progress", ticket: "46927364", type: "PM (Contract)", subject: "Preventive maintenance", serial: "1009998", model: "VQF00SAMPL", nickname: "Sampler-2B", group: "HPLC 2B...", contact: "Alma Duncan", created: "18 Oct 2020", closed: "---", icon: "support", systemNames: ["Alpine", "Sasha"] },
  { status: "In progress", ticket: "465218988", type: "Inquiry", subject: "Repair instrument", serial: "1009997", model: "VQF000PUMP", nickname: "Pump-2B", group: "HPLC 2B...", contact: "Alma Duncan", created: "18 Oct 2020", closed: "---" },
  { status: "In progress", ticket: "46927364", type: "Tech Support", subject: "Repair instrument", serial: "8044421", model: "ULT3R0PDET", nickname: "Pump-RD", group: "Biotherapeutics...", contact: "Alma Duncan", created: "18 Oct 2020", closed: "---" },
  { status: "In progress", ticket: "46719836", type: "Inquiry", subject: "Need support for error", serial: "8044422", model: "ULT3S0MISC", nickname: "Misc-RD", group: "Biotherapeutics...", contact: "Alma Duncan", created: "12 May 2020", closed: "---" },
  { status: "In progress", ticket: "46075402", type: "Inquiry", subject: "Need support for error", serial: "8044423", model: "ULT3S00DET", nickname: "Detector-RD", group: "Biotherapeutics...", contact: "Alma Duncan", created: "12 May 2020", closed: "---" },
  { status: "In progress", ticket: "46917372", type: "Inquiry", subject: "Need support for error", serial: "8044424", model: "ULT3SSA000", nickname: "Sampler-RD", group: "Biotherapeutics...", contact: "Alma Duncan", created: "12 May 2020", closed: "---" },
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

function applySupportHistoryColumnVisibility() {
  const table = app.querySelector(".sh-table");
  if (!table) return;
  const visibleColumns = SUPPORT_HISTORY_COLUMNS.filter(({ key }) => supportHistoryVisibleColumns.has(key));
  const activeColumns = [...SUPPORT_HISTORY_FIXED_COLUMNS, ...visibleColumns];
  const totalWidth = activeColumns.reduce((sum, column) => sum + column.width, 0);
  const applyColumn = (column, visible) => {
    const columnIndex = column.index + 1;
    const width = visible ? `${(column.width / totalWidth) * 100}%` : "0";
    table.querySelector(`col:nth-child(${columnIndex})`).style.display = visible ? "" : "none";
    table.querySelector(`col:nth-child(${columnIndex})`).style.width = width;
    table.querySelectorAll(`tr > :nth-child(${columnIndex})`).forEach((cell) => { cell.hidden = !visible; });
  };
  SUPPORT_HISTORY_FIXED_COLUMNS.forEach((column) => applyColumn(column, true));
  SUPPORT_HISTORY_COLUMNS.forEach((column) => {
    const visible = supportHistoryVisibleColumns.has(column.key);
    applyColumn(column, visible);
  });
}

function openSupportHistoryColumnDialog() {
  const tableBody = miEditColumnsDialog.querySelector("tbody");
  miEditColumnsDialog.dataset.editColumnsContext = "support-history";
  miEditColumnsDialog.querySelector("[data-mi-edit-columns-title]")?.replaceChildren("Edit columns");
  miEditColumnsDialog.querySelector("[data-mi-column-search]").value = "";
  tableBody.innerHTML = SUPPORT_HISTORY_COLUMNS.map(({ key, label, required }) => `<tr data-sh-column-row data-search="${label.toLowerCase()}"><td>${label}</td><td><input type="checkbox" data-sh-edit-column="${key}" aria-label="${required ? `${label} is always displayed` : `Display ${label}` }"${supportHistoryVisibleColumns.has(key) ? " checked" : ""}${required ? " checked disabled" : ""} /></td></tr>`).join("");
  miEditColumnsDialog.querySelector(".mi-edit-columns-modal__table-wrap").scrollTop = 0;
  miEditColumnsDialog.showModal();
  miEditColumnsDialog.querySelector("[data-mi-column-search]").focus({ preventScroll: true });
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
    { key: "model", label: "Catalog no." },
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
    applySupportHistoryColumnVisibility();
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
  app.querySelector("[data-sh-edit-columns]").addEventListener("click", openSupportHistoryColumnDialog);
  app.querySelectorAll("[data-sh-menu]").forEach((button) => button.addEventListener("click", () => showToast(`${button.dataset.shMenu} filter opened`)));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderSupportHistory() {
  const template = document.querySelector("#support-history-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountTopbarSc();
  mountPlatformSidebar("support-history");
  mountFooter();
  if (shouldShowAccountEmptyState()) {
    applyUnmappedSupportHistory();
    window.PlatformSidebar?.wire(app);
    wireRouteControls();
  } else {
    wireSupportHistory();
  }
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
    problem: historyTicket.problem || "",
    errors: historyTicket.errors || "",
    changes: historyTicket.changes || "",
    phone: historyTicket.phone || "",
    email: historyTicket.email || "",
    submitted: historyTicket.submitted === true,
    selectedFromHistory: true,
  } : baseTicket;
  const isTechSupport = ticket.isTechSupport === true;
  const titleMeta = `<p class="ts-titlebar__metadata"><span class="ts-ticket-meta__number"><strong>Ticket number:</strong> ${ticket.ticket}</span><span class="ts-ticket-meta__type"><strong>Ticket type:</strong> ${ticket.type}</span></p>`;
  const ticketContact = ticket.selectedFromHistory ? ticket.contact : "Molly Hartman";
  const ticketPhone = ticket.selectedFromHistory ? ticket.phone || "---" : "123-456-7890";
  const ticketEmail = ticket.selectedFromHistory ? ticket.email || "---" : "molly.hartman@thermofisher.com";
  const ticketCreated = ticket.selectedFromHistory ? ticket.created : "26 April 2023";
  const ticketClosed = ticket.state === "Closed" ? ticket.closed : "---";
  const submittedNotice = ticket.submitted
    ? `<img src="assets/icons/notifications/success/size=24px, style=bold.svg" alt="" /><p><strong>Request submitted:</strong> A representative will respond to your request as soon as possible.<br />When processing is complete your ticket will be updated with the appropriate status.</p>`
    : "";
  const techContent = `<article class="ts-card ts-card--tech"><h2>Ticket contact information</h2><dl class="ts-contact"><div><dt>Name</dt><dd>${ticketContact}</dd></div><div><dt>Phone number</dt><dd>123-456-7890</dd></div><div><dt>Email</dt><dd>molly.hartman@thermofisher.com</dd></div></dl><h2>Support request details</h2><dl class="ts-tech-details"><div><dt>Request subject</dt><dd>${ticket.subject}</dd></div><div><dt>Problem</dt><dd>I urgently need comprehensive technical support to resolve an unknown instrument error that has occurred.</dd></div><div><dt>Error codes</dt><dd>No</dd></div><div><dt>Recent changes to the instrument or environment</dt><dd>We disassembled the system to clean it and now it won’t turn on.</dd></div><div><dt>Created date</dt><dd>${ticketCreated}</dd></div><div><dt>Closed date</dt><dd>${ticketClosed}</dd></div></dl><section class="ts-submitted"><h3>Submitted by</h3><dl><div><dt>Name</dt><dd>${ticketContact}</dd></div><div><dt>Email</dt><dd>molly.hartman@thermofisher.com</dd></div></dl></section></article><article class="ts-card ts-instrument ts-instrument--tech"><img src="assets/instruments/vanquish-detector.png" alt="Vanquish variable wavelength detector" /><dl><div><dt>Serial number</dt><dd class="ts-link">${ticket.serial}</dd></div><div><dt>Catalog no.</dt><dd>${ticket.model}</dd></div><div><dt>Type</dt><dd>HPLC</dd></div><div><dt>Catalog name</dt><dd>Vanquish™ Variable Wavelength Detector F</dd></div><div><dt>Nickname</dt><dd>${ticket.nickname}</dd></div><div><dt>Groups</dt><dd>${ticket.group || "HPLC 2B Sys., Global Research and Development..."}</dd></div><div><dt>Notes</dt><dd>Vanquish HPLC System, Lab 2B</dd></div><div><dt>Manuals</dt><dd class="ts-link">View operating manual<br />View system operating manual</dd></div></dl></article>`;
  const contactMarkup = `<h2>Ticket contact information</h2><dl class="ts-contact"><div><dt>Name</dt><dd>${ticketContact}</dd></div><div><dt>Phone number</dt><dd>123-456-7890</dd></div><div><dt>Email</dt><dd>molly.hartman@thermofisher.com</dd></div></dl>`;
  const requestMarkup = `<h2>Support request details</h2><dl class="ts-standard-details"><div><dt>Request subject</dt><dd>${ticket.selectedFromHistory ? ticket.subject : "Need support"}</dd></div><div><dt>Additional details</dt><dd>We disassembled the system to clean it and now it won’t turn on.</dd></div><div><dt>Created date</dt><dd>${ticketCreated}</dd></div><div><dt>Closed date</dt><dd>${ticketClosed}</dd></div></dl><section class="ts-submitted"><h3>Submitted by</h3><dl><div><dt>Name</dt><dd>${ticketContact}</dd></div><div><dt>Email</dt><dd>molly.hartman@thermofisher.com</dd></div></dl></section>`;
  const instrumentMarkup = `<article class="ts-card ts-instrument ts-instrument--standard"><img src="assets/instruments/vanquish-detector.png" alt="Vanquish variable wavelength detector" /><dl><div><dt>Serial number</dt><dd class="ts-link">${ticket.serial}</dd></div><div><dt>Catalog no.</dt><dd>${ticket.model}</dd></div><div><dt>Type</dt><dd>HPLC</dd></div><div><dt>Catalog name</dt><dd>Vanquish™ Variable Wavelength Detector F</dd></div><div><dt>Nickname</dt><dd>${ticket.nickname}</dd></div><div><dt>Groups</dt><dd>${ticket.group || "HPLC 2B Sys., Global Research and Development..."}</dd></div><div><dt>Notes</dt><dd>Vanquish HPLC System, Lab 2B</dd></div><div><dt>Manuals</dt><dd class="ts-link">View operating manual<br />View system operating manual</dd></div></dl></article>`;
  const quoteContent = `<article class="ts-card ts-card--standard ts-card--quote">${contactMarkup}<div class="ts-summary-split"><section>${requestMarkup}</section><section class="ts-quotes"><header><h2>Quote(s)</h2><span>Prices are subject to change</span></header><article class="ts-quote"><img src="assets/icons/general/quote/size=24px, style=mono.svg" alt="" /><div><span><b>Quote:</b> <span class="ts-quote__number">17171847</span></span><span><b>Created:</b> 11 Apr 2023</span><span><b>Total:</b> $10,285</span></div><div class="ts-quote__actions"><button class="mi-button" type="button">View quote</button><button class="mi-button" type="button">Place order</button></div></article></section></div><section class="ts-service ts-service--quote"><h3>Service details</h3><dl class="ts-service-details"><div><dt>Scheduled start date</dt><dd>Monday, 30 Apr 2023</dd></div></dl></section></article>${instrumentMarkup}`;
  const preventiveContent = `<article class="ts-card ts-card--standard ts-card--preventive">${contactMarkup}${requestMarkup}<section class="ts-service ts-service--preventive"><h3>Service details</h3><dl class="ts-service-details"><div><dt>Scheduled start date</dt><dd>Monday, 12 May 2023</dd></div></dl></section></article>${instrumentMarkup}`;
  const closedRequestMarkup = `<h2>Support request details</h2><dl class="ts-standard-details"><div><dt>Request subject</dt><dd>${ticket.selectedFromHistory ? ticket.subject : "Won’t turn on"}</dd></div><div><dt>Additional details</dt><dd>We disassembled the system to clean it and now it won’t turn on.</dd></div><div><dt>Created date</dt><dd>${ticket.selectedFromHistory ? ticket.created : "26 April 2023"}</dd></div><div><dt>Closed date</dt><dd>${ticket.selectedFromHistory ? ticket.closed : "1 May 2023"}</dd></div></dl><section class="ts-submitted"><h3>Submitted by</h3><dl><div><dt>Name</dt><dd>${ticketContact}</dd></div><div><dt>Email</dt><dd>molly.hartman@thermofisher.com</dd></div></dl></section>`;
  const closedContent = `<article class="ts-card ts-card--standard ts-card--closed">${contactMarkup}${closedRequestMarkup}<section class="ts-service ts-service--closed"><h3>Service details</h3><div class="ts-service--closed__body"><div class="ts-service--closed__details"><dl><div><dt>Arrival date</dt><dd>12 Mar 2023</dd></div><div><dt>Completion date</dt><dd>12 Mar 2023</dd></div><div><dt>Type of service</dt><dd>Preventive maintenance</dd></div></dl><dl class="ts-service-description"><div><dt>Service description</dt><dd>Cras gravida nibh enim, sit amet molestie nisi congue id. Proin rhoncus consectetur arcu, in lobortis magna. Donec purus ipsum, dignissim non maximus nec, rhoncus accumsan erat. Proin consectetur tincidunt mi eget cursus. Sed facilisis at risus imperdiet.</dd></div></dl></div><article class="ts-service-report"><div><strong>View service report</strong><p>Available here until dd mmm yyyy.<br />After this date, contact support.</p></div><button type="button" aria-label="Download service report"><img src="assets/icons/actions/download/Size=24px, Style=Mono, Color=Blue.svg" alt="" /></button></article></div></section></article>${instrumentMarkup}`;
  const defaultContent = ticket.summaryKind === "quote" ? quoteContent : ticket.summaryKind === "preventive" ? preventiveContent : closedContent;
  const scheduledStartDate = ticket.summaryKind === "quote" || ticket.summaryKind === "preventive" ? ticket.created : "—";
  const titleDate = `<div class="ts-title-date"><span>Scheduled start date</span><time>${scheduledStartDate}</time></div>`;
  app.innerHTML = `<section class="screen screen--ticket-summary"><div class="mi-stage"><div class="mi-shell ts-shell ${route === "tech-support-summary" ? "ts-shell--tech" : "ts-shell--standard"}">
    <header class="mi-header"><div class="mi-header__left"><button class="mi-icon-button" type="button" aria-label="Open menu"><img src="assets/icons/navigation/hamburger/size=24px, style=mono.svg" alt="" /></button><img class="mi-brand" src="assets/instruments/thermo-fisher-mark.png" alt="Thermo Fisher Scientific" /><span class="mi-header__label">Connect Platform</span><strong class="mi-header__product">Services Central</strong></div><div class="mi-header__right"><button class="mi-icon-button mi-notifications" type="button" aria-label="Notifications"><img src="assets/icons/notifications/bell/size=24px, style=mono.svg" alt="" /><span>2</span></button><button class="mi-icon-button" type="button" aria-label="User profile"><img src="assets/icons/users/profile/size=24px, style=mono.svg" alt="" /></button></div></header>
    <div data-platform-sidebar-mount></div><main class="mi-main ts-main"><section class="ts-titlebar"><div class="ts-titlebar__details"><h1>${ticket.title}</h1><span class="ts-state ts-state--${ticket.state.toLowerCase().replaceAll(" ", "-")}" data-platform-go-top-anchor>${ticket.state}</span>${titleMeta}</div>${titleDate}</section><section class="ts-content">${isTechSupport ? techContent : defaultContent}</section></main><footer class="mi-footer"><span>© 2025 - Thermo Fisher Scientific</span><i></i><a href="#privacy">Privacy policy</a><a href="#terms">Terms of use</a></footer></div></div></section>`;
  if (submittedNotice) {
    const notice = document.createElement("section");
    notice.className = "ts-notice ts-notice--submitted";
    notice.innerHTML = submittedNotice;
    app.querySelector(".ts-content").prepend(notice);
    const [subject, problem, errors, changes] = app.querySelectorAll(".ts-tech-details dd");
    if (subject) subject.textContent = ticket.subject;
    if (problem) problem.textContent = ticket.problem || "—";
    if (errors) errors.textContent = ticket.errors || "—";
    if (changes) changes.textContent = ticket.changes || "—";
    const contactDetails = app.querySelectorAll(".ts-contact dd");
    if (contactDetails[1]) contactDetails[1].textContent = ticketPhone;
    if (contactDetails[2]) contactDetails[2].textContent = ticketEmail;
  }
  mountNativePageChrome("support-history", { title: ticket.title, backRoute: "support-history" });
  const summaryCloseRoute = ticket.submitted ? "request-support" : "support-history";
  const closeBar = window.PlatformActionBar?.create({ closeOnly: true, closeRoute: summaryCloseRoute });
  closeBar?.classList.add("platform-actionbar--native-flow", "platform-actionbar--submitted-summary");
  const action = closeBar?.querySelector('[data-actionbar-action="close"], [data-actionbar-action="cancel"]');
  if (closeBar && action) {
    const closeButton = action.cloneNode(true);
    closeButton.textContent = "Close";
    closeButton.className = "platform-actionbar__button platform-actionbar__button--secondary";
    closeButton.dataset.actionbarAction = "close";
    closeButton.dataset.route = summaryCloseRoute;
    const trailing = document.createElement("div");
    trailing.className = "platform-actionbar__trailing";
    trailing.append(closeButton);
    closeBar.replaceChildren(trailing);
  }
  app.querySelector("[data-footer-mount]")?.before(closeBar);
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
  mountNativePageChrome("request-support", { title: "Request support", backRoute: "dashboard" });
  if (isEuropeLePrototype()) app.querySelector('[data-route="installation-support"]')?.closest(".rs-request")?.remove();
  if (isNorthAmericaCmdPrototype() || isKoreaCmdPrototype()) app.querySelector('[data-route="request-calibration"]')?.closest(".rs-request")?.remove();
  if (shouldShowAccountEmptyState()) applyUnmappedRequestSupport();
  wireRequestSupport();
  document.title = "Request support — Services Central";
}

function wireInstrumentSupportSelection() {
  const continueButton = app.querySelector('[data-actionbar-action="primary"]');
  const search = app.querySelector("[data-iss-search]");
  const systemToggle = app.querySelector("[data-iss-system-toggle]");
  const systemRow = app.querySelector(".iss-system");
  const systemRows = [...app.querySelectorAll("[data-iss-row]")];
  const hasSystem = Boolean(systemToggle && systemRow);
  const collapsibleSystemRows = hasSystem ? systemRows.slice(0, 5) : [];
  let systemExpanded = true;
  systemRows.forEach((row) => {
    if (hasSystem && collapsibleSystemRows.includes(row)) row.classList.add("iss-system-child");
    row.querySelectorAll('img[src="assets/icons/actions/return/Size=16px, Style=Mono.svg"]').forEach((icon) => {
      icon.src = "assets/icons/actions/system-return/Size=16px, Style=Mono.svg";
    });
    const cells = row.cells;
    if (!row.dataset.group) row.dataset.group = cells[5]?.textContent.trim() || "—";
    if (!row.dataset.type) row.dataset.type = cells[6]?.textContent.trim() || "—";
    if (!row.dataset.model) row.dataset.model = cells[7]?.textContent.trim() || "—";
    if (!row.dataset.coverage) row.dataset.coverage = cells[8]?.textContent.trim() || "—";
  });
  (hasSystem ? systemRows.slice(5) : []).forEach((row) => {
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
    ["group", "Groups"], ["type", "Type"], ["model", "Catalog no."], ["coverage", "Coverage"],
  ];
  const appliedFilters = app.querySelector("[data-iss-applied-filters]");
  const appliedBadges = app.querySelector("[data-iss-applied-badges]");
  const clearFiltersButton = app.querySelector("[data-iss-clear-filters]");
  const tableFilters = filterConfig.map(([key, label]) => {
    const controlHost = app.querySelector(`[data-iss-filter-host="${key}"]`);
    const host = document.createElement("div");
    appliedBadges.append(host);
    const options = [...new Set(systemRows.map((row) => row.dataset[key]).filter((value) => value && value !== "—"))];
    return { key, filter: new window.MultiSelectFilter(host, { label, options: options.length ? options : ["—"], controlHost, menuStyle: "figma-column" }) };
  });
  const updateAppliedFilters = () => {
    const hasFilters = tableFilters.some(({ filter }) => filter.values.length);
    appliedFilters.hidden = !hasFilters;
    clearFiltersButton.hidden = !hasFilters;
  };
  const filterRows = () => {
    const query = search.value.trim().toLowerCase();
    let visibleSystemInstrument = false;
    systemRows.forEach((row) => {
      const matchesSearch = !query || row.dataset.search.includes(query);
      const matchesFilters = tableFilters.every(({ key, filter }) => !filter.values.length || filter.values.includes(row.dataset[key]));
      row.hidden = (!systemExpanded && collapsibleSystemRows.includes(row)) || !matchesSearch || !matchesFilters;
      if (collapsibleSystemRows.includes(row) && !row.hidden) visibleSystemInstrument = true;
    });
    if (systemRow) systemRow.hidden = Boolean(query) && !visibleSystemInstrument;
  };
  systemToggle?.addEventListener("click", () => {
    systemExpanded = !systemExpanded;
    systemToggle.setAttribute("aria-expanded", String(systemExpanded));
    systemToggle.setAttribute("aria-label", `${systemExpanded ? "Collapse" : "Expand"} system`);
    systemToggle.querySelector("img").style.transform = systemExpanded ? "" : "rotate(-90deg)";
    filterRows();
  });
  tableFilters.forEach(({ filter }) => filter.host.addEventListener("multiselect-filter-change", () => {
    filterRows();
    updateAppliedFilters();
  }));
  clearFiltersButton.addEventListener("click", () => {
    tableFilters.forEach(({ filter }) => filter.clear());
    updateAppliedFilters();
  });
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
  updateAppliedFilters();
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
      openSupportTicketDraft.instrument = selectedOpenSupportTicketInstrument;
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
  mountNativePageChrome("request-support", { title: "Open a support ticket", backRoute: "request-support" });
  if (isEuropeLePrototype()) {
    app.querySelector(".iss-system")?.remove();
    const body = app.querySelector(".iss-table tbody");
    body.innerHTML = miCurrentInstruments().filter((instrument) => !MI_REMOVED_INSTRUMENTS.has(instrument.serial)).map((instrument) => {
      const coverage = instrument.coverage === "Coverage expired" ? `<span class="iss-status iss-status--expired">${instrument.coverage}</span>` : instrument.coverage === "Expiring soon" ? `<span class="iss-status iss-status--soon">${instrument.coverage}</span>` : instrument.coverage;
      return `<tr data-iss-row data-search="${instrument.serial.toLowerCase()} ${instrument.nickname.toLowerCase()}" data-group="${instrument.group}" data-type="${miInstrumentType(instrument)}" data-model="${instrument.model}" data-coverage="${instrument.coverage}"><td><input type="radio" name="instrument" data-iss-instrument aria-label="Select ${instrument.serial} ${instrument.nickname}" /></td><td></td><td><img src="assets/instruments/${instrument.image}" alt="" /></td><td><button type="button" data-route="${miInstrumentDetailRoute(instrument.serial)}">${instrument.serial}</button></td><td>${instrument.nickname}</td><td>${instrument.group}</td><td>${miInstrumentType(instrument)}</td><td>${instrument.model}</td><td>${coverage}</td></tr>`;
    }).join("");
    const total = app.querySelector(".iss-results-total");
    if (total) total.textContent = String(miCurrentInstruments().length);
  }
  mountTicketStepViewer(1);
  mountNativeFlowActionBar();
  wireInstrumentSupportSelection();
  document.title = "Open a support ticket — Services Central";
}

function wireOpenSupportTicketDetails() {
  const fields = [...app.querySelectorAll("[data-isd-field]")];
  const continueButton = app.querySelector('[data-actionbar-action="primary"]');
  const detailsCard = app.querySelector(".isd-card");
  const uploadRequirements = app.querySelector(".isd-upload__requirements");
  const filledFiles = app.querySelector(".isd-filled-files");
  const uploadInput = app.querySelector("[data-isd-upload] input");
  const filesRoot = app.querySelector("[data-isd-files]");
  let uploadedFiles = openSupportTicketDraft.files;
  const previewUrls = new WeakMap();
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
    fields.forEach((field) => { openSupportTicketDraft.request[field.dataset.isdField] = field.value; });
    continueButton.disabled = !isComplete;
    detailsCard.classList.toggle("is-filled", isComplete);
    uploadRequirements.hidden = uploadedFiles.length > 0;
    filledFiles.hidden = uploadedFiles.length === 0;
  };
  fields.forEach((field) => { field.value = openSupportTicketDraft.request[field.dataset.isdField] || ""; });
  fields.forEach((field) => field.addEventListener("input", () => updateForm()));
  const renderUploadedFiles = () => {
    filesRoot.replaceChildren(...uploadedFiles.map((file, index) => {
      const item = document.createElement("article");
      const isPreviewable = file.type.startsWith("image/");
      const previewUrl = isPreviewable && (previewUrls.get(file) || URL.createObjectURL(file));
      if (previewUrl) previewUrls.set(file, previewUrl);
      item.className = isPreviewable ? "isd-file--preview" : "isd-file--document";
      const previewFrame = document.createElement("div");
      previewFrame.className = "isd-file__preview-frame";
      const preview = document.createElement("img");
      if (isPreviewable) {
        preview.className = "isd-file__preview";
        preview.src = previewUrl;
        preview.alt = `Preview of ${file.name}`;
      } else {
        preview.className = "isd-file__type-icon";
        preview.src = file.name.toLowerCase().endsWith(".csv")
          ? "assets/icons/documents/CSV/Size=32px, Style=Bold.svg"
          : "assets/icons/media/document/size=32px, style=mono.svg";
        preview.alt = "";
      }
      previewFrame.append(preview);
      const metadata = document.createElement("div");
      metadata.className = "isd-file__meta";
      const filename = document.createElement("span");
      filename.textContent = file.name;
      filename.title = file.name;
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.setAttribute("aria-label", `Remove ${file.name}`);
      const removeIcon = document.createElement("img");
      removeIcon.src = "assets/icons/actions/bin/size=16px, style=mono.svg";
      removeIcon.alt = "";
      removeButton.append(removeIcon);
      metadata.append(filename, removeButton);
      const size = document.createElement("small");
      size.textContent = `${Math.max(1, Math.ceil(file.size / 1024 / 1024))}mb`;
      item.append(previewFrame, metadata, size);
      removeButton.addEventListener("click", () => {
        const url = previewUrls.get(file);
        if (url) URL.revokeObjectURL(url);
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
    const nextFiles = [...uploadInput.files];
    uploadedFiles = [...uploadedFiles, ...nextFiles].slice(0, 5);
    openSupportTicketDraft.files = uploadedFiles;
    uploadInput.value = "";
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
  continueButton.addEventListener("click", () => setRoute("open-support-ticket-contact"));
  updateForm({ updateCounts: false });
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderOpenSupportTicketDetails() {
  const template = document.querySelector("#open-support-ticket-details-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountNativePageChrome("request-support", { title: "Open a support ticket", backRoute: "open-support-ticket" });
  mountTicketStepViewer(2);
  mountNativeFlowActionBar({ backRoute: "open-support-ticket" });
  wireOpenSupportTicketDetails();
  document.title = "Open a support ticket — add request details";
}

function wireOpenSupportTicketContact() {
  const fields = [...app.querySelectorAll("[data-ost-contact-field]")];
  const continueButton = app.querySelector('[data-actionbar-action="primary"]');
  const contactDefaults = { firstName: "Molly", lastName: "Hartman" };
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isFieldValid = (field) => {
    const value = field.value.trim();
    if (!value) return false;
    if (field.dataset.ostContactField === "phone") return /^\d+$/.test(value);
    if (field.dataset.ostContactField === "email") return emailPattern.test(value);
    return true;
  };
  const update = () => {
    fields.forEach((field) => { openSupportTicketDraft.contact[field.dataset.ostContactField] = field.value; });
    continueButton.disabled = !fields.every(isFieldValid);
  };
  fields.forEach((field) => {
    field.value = openSupportTicketDraft.contact[field.dataset.ostContactField] || contactDefaults[field.dataset.ostContactField] || "";
    field.addEventListener("input", () => {
      if (field.dataset.ostContactField === "phone") field.value = field.value.replace(/\D/g, "");
      update();
    });
  });
  continueButton.addEventListener("click", () => setRoute("open-support-ticket-review"));
  update();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderOpenSupportTicketContact() {
  const template = document.querySelector("#open-support-ticket-contact-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountNativePageChrome("request-support", { title: "Open a support ticket", backRoute: "open-support-ticket-details" });
  mountTicketStepViewer(3);
  mountNativeFlowActionBar({ backRoute: "open-support-ticket-details" });
  wireOpenSupportTicketContact();
  document.title = "Open a support ticket — contact information";
}

function renderOpenSupportTicketReview() {
  const template = document.querySelector("#open-support-ticket-review-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountNativePageChrome("request-support", { title: "Open a support ticket", backRoute: "open-support-ticket-contact" });
  mountTicketStepViewer(4);
  const bar = mountNativeFlowActionBar({ backRoute: "open-support-ticket-contact", primaryDisabled: false });
  bar.querySelector('[data-actionbar-action="primary"]').textContent = "Submit";
  const instrument = openSupportTicketDraft.instrument || {};
  const { request = {}, contact = {} } = openSupportTicketDraft;
  app.querySelector("[data-ost-review-subject]").textContent = request.subject || "—";
  app.querySelector("[data-ost-review-problem]").textContent = request.problem || "—";
  app.querySelector("[data-ost-review-errors]").textContent = request.errors || "—";
  app.querySelector("[data-ost-review-changes]").textContent = request.changes || "—";
  const filesSection = app.querySelector(".ost-review-files");
  const filesToggle = app.querySelector("[data-ost-review-files-toggle]");
  const filesList = app.querySelector("[data-ost-review-files-list]");
  const attachedFiles = openSupportTicketDraft.files;
  filesSection.hidden = attachedFiles.length === 0;
  app.querySelector("[data-ost-review-files]").textContent = `${attachedFiles.length} attached file${attachedFiles.length === 1 ? "" : "s"}`;
  filesToggle.setAttribute("aria-expanded", "true");
  filesToggle.querySelector("img").src = "assets/icons/directions/chevron up/size=16px, style=mono.svg";
  filesList.className = "ost-review-files__grid isd-files";
  filesList.hidden = false;
  filesList.replaceChildren(...attachedFiles.map((file) => {
    const item = document.createElement("li");
    const card = document.createElement("article");
    const previewFrame = document.createElement("div");
    previewFrame.className = "ost-review-file__preview-frame";
    const preview = document.createElement("img");
    if (file.type.startsWith("image/")) {
      preview.className = "ost-review-file--preview";
      preview.src = URL.createObjectURL(file);
      preview.alt = `Preview of ${file.name}`;
    } else {
      preview.className = "ost-review-file__type-icon";
      preview.src = file.name.toLowerCase().endsWith(".csv")
        ? "assets/icons/documents/CSV/Size=32px, Style=Bold.svg"
        : "assets/icons/media/document/size=32px, style=mono.svg";
      preview.alt = "";
    }
    previewFrame.append(preview);
    const filename = document.createElement("span");
    filename.textContent = file.name;
    filename.title = file.name;
    const size = document.createElement("small");
    size.textContent = `${Math.max(1, Math.ceil(file.size / 1024 / 1024))}mb`;
    card.append(previewFrame, filename, size);
    item.append(card);
    return item;
  }));
  filesToggle.addEventListener("click", () => {
    const expanded = filesToggle.getAttribute("aria-expanded") === "true";
    filesToggle.setAttribute("aria-expanded", String(!expanded));
    filesList.hidden = expanded;
    filesToggle.querySelector("img").src = expanded
      ? "assets/icons/directions/chevron right/size=16px, style=mono.svg"
      : "assets/icons/directions/chevron up/size=16px, style=mono.svg";
  });
  app.querySelector("[data-ost-review-instrument-image]").src = instrument.image || "assets/instruments/vanquish-detector.png";
  app.querySelector("[data-ost-review-serial]").textContent = instrument.serial || "—";
  app.querySelector("[data-ost-review-model]").textContent = instrument.model || "—";
  app.querySelector("[data-ost-review-type]").textContent = instrument.type || "—";
  app.querySelector("[data-ost-review-nickname]").textContent = instrument.nickname || "—";
  app.querySelector("[data-ost-review-name]").textContent = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || "—";
  app.querySelector("[data-ost-review-phone]").textContent = contact.phone || "—";
  app.querySelector("[data-ost-review-email]").textContent = contact.email || "—";
  bar.querySelector('[data-actionbar-action="primary"]').addEventListener("click", () => {
    const submittedOn = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
    setRoute("tech-support-summary", {
      title: request.subject || "Support request",
      ticket: "Pending",
      status: "Submitted",
      type: "Tech Support",
      subject: request.subject || "—",
      problem: request.problem || "",
      errors: request.errors || "",
      changes: request.changes || "",
      serial: instrument.serial || "—",
      model: instrument.model || "—",
      nickname: instrument.nickname || "—",
      contact: [contact.firstName, contact.lastName].filter(Boolean).join(" ") || "—",
      phone: contact.phone || "—",
      email: contact.email || "—",
      created: submittedOn,
      closed: "---",
      submitted: true,
    });
  });
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = "Open a support ticket — review and submit";
}

function preparePmStepOne() {
  const selectAll = app.querySelector(".pm-select-all");
  selectAll.outerHTML = '<button class="pm-select-all qualification-select-all" type="button" data-pm-select-all aria-pressed="false">Select all 240 instruments</button>';
  const applied = document.createElement("div");
  applied.className = "sh-applied-filters iss-applied-filters";
  applied.dataset.pmAppliedFilters = "";
  applied.hidden = true;
  applied.innerHTML = '<div class="iss-applied-filters__badges" data-pm-applied-badges></div><button class="sh-clear-filters" type="button" data-pm-clear-filters hidden>Clear filter(s)</button>';
  app.querySelector("[data-pm-select-all]").after(applied);

  const tableWrap = app.querySelector(".pm-table-wrap");
  tableWrap.className = "iss-table-wrap pm-selection-table-wrap";
  const table = tableWrap.querySelector(".pm-table");
  table.className = "iss-table pm-selection-table";
  const systemRow = table.querySelector(".pm-system");
  systemRow.className = "iss-system pm-system";
  table.tHead.rows[0].cells[0].innerHTML = '<input type="checkbox" data-pm-select-all-table aria-label="Select all instruments" />';
  systemRow.cells[1].innerHTML = '<button class="iss-system-toggle" type="button" data-pm-system-toggle aria-expanded="true" aria-label="Collapse system"><img src="assets/icons/directions/chevron down/size=16px, style=mono.svg" alt="" /></button>';
  systemRow.cells[2].innerHTML = '<img src="assets/icons/general/in systems/size=24px, style=mono.svg" alt="" />';
  [["group", "Groups"], ["type", "Type"], ["model", "Catalog no."], ["coverage", "Coverage"]].forEach(([key, label], index) => {
    table.tHead.rows[0].cells[index + 5].innerHTML = `<div data-pm-filter-host="${key}" aria-label="${label} filter"></div>`;
  });

  const pagination = app.querySelector(".pm-pagination");
  pagination.className = "iss-pagination pm-pagination";
  const pageSize = pagination.querySelector(".pm-page-size");
  pageSize.className = "iss-page-size";
  pageSize.dataset.pmPageSize = "";
  pageSize.setAttribute("aria-expanded", "false");
  const pageSizeControl = document.createElement("span");
  pageSizeControl.className = "iss-page-size-control";
  pageSize.replaceWith(pageSizeControl);
  pageSizeControl.append(pageSize);
  const pageSizeMenu = document.createElement("div");
  pageSizeMenu.className = "iss-page-size-menu";
  pageSizeMenu.dataset.pmPageSizeMenu = "";
  pageSizeMenu.hidden = true;
  pageSizeMenu.innerHTML = [10, 20, 30, 40, 50].map((value) => `<button type="button" data-pm-page-size-option="${value}" aria-selected="${value === 20}">${value}</button>`).join("");
  pageSizeControl.append(pageSizeMenu);
  pagination.querySelector("strong").className = "iss-results-total";
  pagination.querySelectorAll(".pm-page-arrow").forEach((button) => { button.className = "iss-page-arrow"; });
  pagination.querySelectorAll(".pm-page-number").forEach((button) => { button.className = button.classList.contains("is-current") ? "iss-page-number is-current" : "iss-page-number"; });
  pagination.querySelector("span:last-of-type").className = "iss-go-to";
}

function populatePmStatusTables() {
  if (!pmRequestDraft.instruments.length) return;
  const selected = new Map(pmRequestDraft.instruments.map((instrument) => [instrument.serial, instrument]));
  const image = (instrument) => instrument?.image || "assets/instruments/tsq.png";
  const directRow = (serial, details) => {
    const instrument = selected.get(serial);
    if (!instrument) return "";
    const checkbox = details.selectable ? `<input type="checkbox" checked data-pm-status-instruments="${serial}" aria-label="Select ${serial}" />` : "";
    return `<tr><td>${checkbox}</td><td>${details.date}</td><td><img src="${image(instrument)}" alt="" /></td><td><a href="#instrument-detail-${serial}">${serial}</a></td><td>${instrument.nickname}</td>${details.tail}</tr>`;
  };
  const systemRows = (group, details) => {
    const instruments = group.serials.map((serial) => selected.get(serial)).filter(Boolean);
    if (!instruments.length) return "";
    const checkbox = details.selectable ? `<input type="checkbox" checked data-pm-status-instruments="${instruments.map((instrument) => instrument.serial).join(",")}" aria-label="Select ${group.nickname}" />` : "";
    const parent = `<tr><td>${checkbox}</td><td>${group.date}</td><td class="pm-status-system"><button class="pm-status-system-toggle" type="button" data-pm-status-system-toggle="${group.id}" aria-expanded="false" aria-label="Expand ${group.nickname}"><img src="assets/icons/directions/chevron right/size=24px, style=mono.svg" alt="" /></button><img src="assets/icons/general/in systems/size=24px, style=mono.svg" alt="" /></td><td><a href="#system">System</a></td><td>${group.nickname}</td>${details.systemTail || ""}</tr>`;
    const children = instruments.map((instrument) => `<tr data-pm-status-child="${group.id}" hidden><td></td><td></td><td><img src="${image(instrument)}" alt="" /></td><td><a href="#instrument-detail-${instrument.serial}">${instrument.serial}</a></td><td>${instrument.nickname}</td>${details.childTail || ""}</tr>`).join("");
    return parent + children;
  };
  const tables = [
    {
      label: "Confirmed PM dates", selectable: false,
      direct: ["TSQ-Z-12347", "SN98359W"],
      directDetails: { date: "30 Apr 2024", tail: "<td>tamara.miller@company.com</td>" },
      groups: [
        { id: "confirmed-one", date: "02 May 2024", nickname: "Name 07", serials: ["1009996"] },
        { id: "confirmed-multiple", date: "Multiple", nickname: "Name 08", serials: ["1009999", "1009998"] },
      ],
      systemDetails: { selectable: false, systemTail: "<td>neil.wright@company.com</td>", childTail: "<td></td>" },
    },
    {
      label: "Request PM scheduling instruments", selectable: true,
      direct: ["TSQ-Z-12349", "SN98358W"],
      directDetails: { selectable: true, date: "Contact us", tail: "<td><span class=\"pm-status pm-status--contract\">Under contract</span></td><td><span class=\"pm-status pm-status--open\">Open</span></td>" },
      groups: [{ id: "scheduling-one", date: "Contact us", nickname: "Name 01", serials: ["TSQ-Z-12346"] }],
      systemDetails: { selectable: true, systemTail: "<td></td><td></td>", childTail: "<td></td><td></td>" },
    },
    {
      label: "Request PM instruments", selectable: true,
      direct: ["SN98359W"],
      directDetails: { selectable: true, date: "Request a quote", tail: "<td><span class=\"pm-status pm-status--neutral\">Expired</span></td><td>18 Dec 2023</td>" },
      groups: [{ id: "request-one", date: "Request a quote", nickname: "Name 03", serials: ["1009997"] }],
      systemDetails: { selectable: true, systemTail: "<td></td><td></td>", childTail: "<td></td><td></td>" },
    },
  ];
  tables.forEach((definition) => {
    const table = app.querySelector(`table[aria-label="${definition.label}"]`);
    const body = table?.tBodies[0];
    if (!body) return;
    body.innerHTML = definition.direct.map((serial) => directRow(serial, definition.directDetails)).join("") + definition.groups.map((group) => systemRows(group, definition.systemDetails)).join("");
  });
}

function collectPmStatusInstruments(tableLabel) {
  const table = app.querySelector(`table[aria-label="${tableLabel}"]`);
  const serials = [...new Set([...table?.querySelectorAll('tbody input[data-pm-status-instruments]:checked') || []]
    .flatMap((checkbox) => checkbox.dataset.pmStatusInstruments.split(","))
    .filter(Boolean))];
  return serials.map((serial) => pmRequestDraft.instruments.find((instrument) => instrument.serial === serial)).filter(Boolean);
}

function wireRequestPm() {
  const continueButton = app.querySelector('[data-actionbar-action="primary"]');
  const search = app.querySelector("[data-pm-search]");
  const selectAll = app.querySelector("[data-pm-select-all]");
  const tableSelectAll = app.querySelector("[data-pm-select-all-table]");
  const systemRow = app.querySelector(".pm-system");
  const systemToggle = app.querySelector("[data-pm-system-toggle]");
  const systemCheckbox = app.querySelector("[data-pm-system]");
  const rows = [...app.querySelectorAll("[data-pm-row]")];
  const collapsibleRows = rows.slice(0, 5);
  let expanded = true;

  rows.forEach((row) => {
    const cells = row.cells;
    row.classList.add("iss-system-child");
    row.dataset.group = cells[5]?.textContent.trim() || "—";
    row.dataset.type = cells[6]?.textContent.trim() || "—";
    row.dataset.model = cells[7]?.textContent.trim() || "—";
    row.dataset.coverage = cells[8]?.textContent.trim() || "—";
    row.querySelectorAll('img[src="assets/icons/actions/return/Size=16px, Style=Mono.svg"]').forEach((icon) => {
      icon.src = "assets/icons/actions/system-return/Size=16px, Style=Mono.svg";
    });
  });
  const appliedFilters = app.querySelector("[data-pm-applied-filters]");
  const appliedBadges = app.querySelector("[data-pm-applied-badges]");
  const clearFiltersButton = app.querySelector("[data-pm-clear-filters]");
  const filters = [["group", "Groups"], ["type", "Type"], ["model", "Catalog no."], ["coverage", "Coverage"]].map(([key, label]) => {
    const controlHost = app.querySelector(`[data-pm-filter-host="${key}"]`);
    const host = document.createElement("div");
    appliedBadges.append(host);
    const options = [...new Set(rows.map((row) => row.dataset[key]).filter((value) => value && value !== "—"))];
    return { key, filter: new window.MultiSelectFilter(host, { label, options: options.length ? options : ["—"], controlHost, menuStyle: "figma-column" }) };
  });
  const updateAppliedFilters = () => {
    const hasFilters = filters.some(({ filter }) => filter.values.length);
    appliedFilters.hidden = !hasFilters;
    clearFiltersButton.hidden = !hasFilters;
  };
  const updateSelection = () => {
    const selected = rows.filter((row) => row.querySelector("[data-pm-instrument]").checked);
    const selectedSystemRows = collapsibleRows.filter((row) => row.querySelector("[data-pm-instrument]").checked);
    systemCheckbox.checked = selectedSystemRows.length === collapsibleRows.length;
    systemCheckbox.indeterminate = selectedSystemRows.length > 0 && selectedSystemRows.length < collapsibleRows.length;
    tableSelectAll.checked = selected.length === rows.length;
    tableSelectAll.indeterminate = selected.length > 0 && selected.length < rows.length;
    selectAll.setAttribute("aria-pressed", String(tableSelectAll.checked));
    continueButton.disabled = selected.length === 0;
  };
  const filterRows = () => {
    const query = search.value.trim().toLowerCase();
    let visibleSystemInstrument = false;
    rows.forEach((row) => {
      const matchesSearch = !query || row.dataset.search.includes(query);
      const matchesFilters = filters.every(({ key, filter }) => !filter.values.length || filter.values.includes(row.dataset[key]));
      row.hidden = (!expanded && collapsibleRows.includes(row)) || !matchesSearch || !matchesFilters;
      if (collapsibleRows.includes(row) && !row.hidden) visibleSystemInstrument = true;
    });
    systemRow.hidden = Boolean(query) && !visibleSystemInstrument;
  };
  const setAllRows = (checked) => { rows.forEach((row) => { row.querySelector("[data-pm-instrument]").checked = checked; }); updateSelection(); };
  const setAllSystemRows = (checked) => { collapsibleRows.forEach((row) => { row.querySelector("[data-pm-instrument]").checked = checked; }); updateSelection(); };

  search.addEventListener("input", filterRows);
  selectAll.addEventListener("click", () => setAllRows(!tableSelectAll.checked));
  tableSelectAll.addEventListener("change", () => setAllRows(tableSelectAll.checked));
  systemCheckbox.addEventListener("change", () => setAllSystemRows(systemCheckbox.checked));
  rows.forEach((row) => row.querySelector("[data-pm-instrument]").addEventListener("change", updateSelection));
  systemToggle.addEventListener("click", () => {
    expanded = !expanded;
    systemToggle.setAttribute("aria-expanded", String(expanded));
    systemToggle.setAttribute("aria-label", `${expanded ? "Collapse" : "Expand"} system`);
    systemToggle.querySelector("img").style.transform = expanded ? "" : "rotate(-90deg)";
    filterRows();
  });
  filters.forEach(({ filter }) => filter.host.addEventListener("multiselect-filter-change", () => { filterRows(); updateAppliedFilters(); }));
  clearFiltersButton.addEventListener("click", () => { filters.forEach(({ filter }) => filter.clear()); updateAppliedFilters(); });

  const pageSizeButton = app.querySelector("[data-pm-page-size]");
  const pageSizeMenu = app.querySelector("[data-pm-page-size-menu]");
  const closePageSizeMenu = () => { pageSizeMenu.hidden = true; pageSizeButton.setAttribute("aria-expanded", "false"); };
  pageSizeButton.addEventListener("click", () => { pageSizeMenu.hidden = !pageSizeMenu.hidden; pageSizeButton.setAttribute("aria-expanded", String(!pageSizeMenu.hidden)); });
  pageSizeMenu.querySelectorAll("[data-pm-page-size-option]").forEach((option) => option.addEventListener("click", () => {
    const caret = pageSizeButton.querySelector("img");
    pageSizeButton.replaceChildren(document.createTextNode(`${option.dataset.pmPageSizeOption} `), caret);
    pageSizeMenu.querySelectorAll("[data-pm-page-size-option]").forEach((item) => item.setAttribute("aria-selected", String(item === option)));
    closePageSizeMenu();
  }));
  document.addEventListener("mousedown", (event) => { if (!event.target.closest(".iss-page-size-control")) closePageSizeMenu(); });
  continueButton.addEventListener("click", () => {
    pmRequestDraft.instruments = rows.filter((row) => row.querySelector("[data-pm-instrument]").checked).map((row) => ({
      serial: row.cells[3].textContent.trim(),
      nickname: row.cells[4].textContent.trim(),
      image: row.cells[2].querySelector("img")?.getAttribute("src") || "",
    }));
    if (pmRequestDraft.instruments.length === 1 && pmRequestDraft.instruments[0].serial === "TSQ-Z-12347") {
      setRoute("request-pm-direct-review");
      return;
    }
    setRoute("request-pm-status");
  });
  const promo = app.querySelector(".pm-promo");
  const promotions = [
    { title: "Save 35% on your next reversed phase column", message: "Save now on your next C18, phenyl or other reversed phase column.", detail: "Promo expires 29 Mar 2024. Applicable for online orders on analytical columns." },
    { title: "Keep your instruments ready for what’s next", message: "Request planned maintenance to help keep your lab running smoothly.", detail: "Talk with a Thermo Fisher representative about scheduling options." },
  ];
  if (promo) {
    const promoCopy = promo.querySelector("[data-pm-promo-copy]");
    let promoIndex = Number(promo.dataset.pmPromoIndex || 0);
    const renderPromotion = () => {
      const current = promotions[promoIndex];
      promo.dataset.pmPromoIndex = String(promoIndex);
      promo.setAttribute("aria-label", `Promotion ${promoIndex + 1} of ${promotions.length}`);
      promoCopy.innerHTML = `<h2>${current.title}</h2><p><strong>${current.message}</strong></p><small>${current.detail}</small>`;
    };
    promo.querySelectorAll("[data-pm-promo]").forEach((button) => button.addEventListener("click", () => {
      promoIndex = button.dataset.pmPromo === "next" ? (promoIndex + 1) % promotions.length : (promoIndex - 1 + promotions.length) % promotions.length;
      renderPromotion();
    }));
    renderPromotion();
  }
  const directReviewTrigger = app.querySelector("[data-pm-direct-review-trigger]");
  directReviewTrigger?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    setRoute("request-pm-direct-review");
  }, { capture: true });
  app.querySelectorAll("[data-pm-instrument-link]:not([data-pm-direct-review-trigger])").forEach((button) => button.addEventListener("click", () => {
    showToast("Instrument details opened");
  }));
  updateSelection();
  filterRows();
  updateAppliedFilters();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestPm() {
  const template = document.querySelector("#request-pm-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  const legacySteps = app.querySelector(".pm-steps");
  const stepMount = document.createElement("div");
  stepMount.dataset.ticketStepViewer = "";
  legacySteps.replaceWith(stepMount);
  mountTicketStepViewer(1, {
    labels: ["Select instrument(s)", "View PM status", "Add request details", "Confirm contact information", "Review and submit"],
    ariaLabel: "PM scheduling request progress",
    firstStepProgress: "calc(20% - 18px)",
  });
  preparePmStepOne();
  mountNativePageChrome("request-support", { title: "Request PM scheduling", backRoute: "request-support" });
  mountNativeFlowActionBar();
  wireRequestPm();
  document.title = "Request PM scheduling — Services Central";
}

function renderRequestPmDirectReview() {
  const template = document.querySelector("#pm-direct-review-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountNativePageChrome("request-support", { title: "Request PM scheduling", backRoute: "request-pm" });
  mountTicketStepViewer(2, {
    labels: ["Select instrument(s)", "Review"],
    ariaLabel: "PM scheduled instrument review",
    firstStepProgress: "calc(100% - 36px)",
  });
  const currentStep = app.querySelector(".iss-steps li.is-current > span:first-child");
  currentStep?.replaceChildren(Object.assign(document.createElement("img"), {
    src: "assets/icons/actions/checkmark/size=24px, style=mono.svg",
    alt: "",
  }));
  const closeBar = window.PlatformActionBar?.mount(app.querySelector("[data-platform-action-bar-mount]"), { cancelRoute: "request-support", backRoute: "request-pm", primaryLabel: "Close", primaryRoute: "request-support" });
  closeBar?.classList.add("platform-actionbar--native-flow", "platform-actionbar--pm-direct-review");
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = "Request PM scheduling — confirmed PM review";
}

function createPmStatusTermsDialog() {
  return window.PlatformModal?.mount('[data-modal-mount="pm-status-terms"]', {
    id: "pm-status-terms-dialog",
    title: "Terms and conditions",
    description: "Promotion:Save 35% on your next reversed phase column",
    width: 862,
    className: "pm-status-terms-modal",
    closeIcon: "assets/icons/actions/close/size=24px, style=mono.svg",
    content: '<section class="pm-status-terms__panel"><h3>Title 1</h3><ul><li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ornare lectus in nunc aliquam, id tincidunt ex suscipit. Sed eget ullamcorper nisi, et accumsan mi. Nunc in ultricies purus. Aliquam aliquam nisl dolor, vitae dictum arcu accumsan pellentesque. Aenean a faucibus ante. Aenean rutrum libero vitae urna tristique, eget elementum justo eleifend. Fusce quis elit egestas, tincidunt mauris tincidunt, ultrices sem. Integer lobortis, neque lacinia luctus tincidunt, eros purus dictum eros, placerat sodales est turpis quis sem.</li><li>Vestibulum nec ex elit. Vestibulum venenatis dictum rhoncus. Nam leo tellus, placerat nec scelerisque non, maximus sit amet massa. Vivamus sagittis tortor ut lacus aliquam bibendum. Donec quis tempus odio, eget commodo elit. Fusce vel tristique ligula. Nulla purus libero, viverra eu maximus interdum, commodo nec eros. Praesent volutpat mi nec neque interdum accumsan.</li><li>Praesent non venenatis ligula, at suscipit purus. Aliquam pulvinar nunc non neque dapibus ultrices. Sed feugiat, risus a eleifend lacinia, lorem risus laoreet neque, in malesuada odio ipsum id sem. Pellentesque pellentesque facilisis mauris nec mollis.</li></ul></section>',
  });
}

function wirePmStatusPromotion() {
  const termsDialog = createPmStatusTermsDialog();
  app.querySelector("[data-pm-status-terms]")?.addEventListener("click", () => {
    window.PlatformModal?.open(termsDialog);
  });
}

function wireRequestPmStatus() {
  wirePmStatusPromotion();
  app.querySelectorAll(".pm-status-section table").forEach((table) => {
    const imageHeader = table.querySelector("thead th:nth-child(3)");
    if (imageHeader) imageHeader.before(document.createElement("th"));
    table.querySelectorAll("tbody tr").forEach((row) => {
      if (!row.querySelector(".pm-status-system")) {
        const treeCell = document.createElement("td");
        treeCell.className = "pm-status-tree";
        row.cells[2].before(treeCell);
      }
    });
  });
  app.querySelectorAll(".pm-status-system").forEach((cell) => {
    const treeCell = document.createElement("td");
    treeCell.className = "pm-status-tree";
    treeCell.append(cell.querySelector("[data-pm-status-system-toggle]") || cell.querySelector("img:first-child"));
    cell.before(treeCell);
  });
  app.querySelectorAll(".pm-status-system img").forEach((icon) => {
    icon.src = "assets/icons/general/in systems/size=24px, style=mono.svg";
  });
  app.querySelectorAll("[data-pm-status-section] table").forEach((table) => {
    const headerCheckbox = table.tHead?.querySelector('input[type="checkbox"]');
    const rowCheckboxes = [...table.tBodies[0]?.querySelectorAll('input[type="checkbox"]') || []];
    if (!headerCheckbox || !rowCheckboxes.length) return;

    table.classList.add("pm-status-table--selectable");
    const syncCheckboxes = () => {
      const selected = rowCheckboxes.filter((checkbox) => checkbox.checked).length;
      headerCheckbox.checked = selected === rowCheckboxes.length;
      headerCheckbox.indeterminate = selected > 0 && selected < rowCheckboxes.length;
    };
    headerCheckbox.addEventListener("change", () => {
      rowCheckboxes.forEach((checkbox) => { checkbox.checked = headerCheckbox.checked; });
      syncCheckboxes();
    });
    rowCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", syncCheckboxes));
    syncCheckboxes();
  });
  app.querySelectorAll("[data-pm-status-system-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.pmStatusSystemToggle;
      const expanded = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(expanded));
      button.setAttribute("aria-label", `${expanded ? "Collapse" : "Expand"} system instruments`);
      button.querySelector("img").src = `assets/icons/directions/chevron ${expanded ? "down" : "right"}/size=24px, style=mono.svg`;
      app.querySelectorAll(`[data-pm-status-child="${id}"]`).forEach((row) => { row.hidden = !expanded; });
    });
  });
  app.querySelectorAll("[data-pm-status-toggle]").forEach((button) => {
    const icon = button.querySelector("img");
    icon.src = "assets/icons/directions/chevron up/size=24px, style=mono.svg";
    button.addEventListener("click", () => {
      const section = button.closest("[data-pm-status-section]");
      const table = section.querySelector("table");
      const expanded = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(expanded));
      icon.src = `assets/icons/directions/chevron ${expanded ? "up" : "down"}/size=24px, style=mono.svg`;
      table.hidden = !expanded;
    });
  });
  app.querySelector('[data-actionbar-action="primary"]')?.addEventListener("click", () => {
    pmRequestDraft.schedulingInstruments = collectPmStatusInstruments("Request PM scheduling instruments");
    pmRequestDraft.requestInstruments = collectPmStatusInstruments("Request PM instruments");
    setRoute("request-pm-details");
  });
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestPmStatus() {
  const template = document.querySelector("#request-pm-status-template");
  app.replaceChildren(template.content.cloneNode(true));
  populatePmStatusTables();
  mountTicketStepViewer(2, {
    labels: ["Select instrument(s)", "View PM status", "Add request details", "Confirm contact information", "Review and submit"],
    ariaLabel: "PM scheduling request progress",
  });
  mountNativePageChrome("request-support", { title: "Request PM scheduling", backRoute: "request-pm" });
  mountNativeFlowActionBar({ backRoute: "request-pm", primaryDisabled: false });
  wireRequestPmStatus();
  document.title = "View PM status — Services Central";
}

function renderPmDetailsSelectedInstruments(host, key) {
  const table = document.createElement("table");
  table.className = "pm-details-selected-table";
  table.innerHTML = '<thead><tr><th>Serial number</th><th>Nickname</th></tr></thead>';
  const body = document.createElement("tbody");
  (pmRequestDraft[`${key}Instruments`] || []).forEach((instrument) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${instrument.serial}</td><td>${instrument.nickname}</td>`;
    body.append(row);
  });
  table.append(body);
  host.replaceChildren(table);
}

function wireRequestPmDetails() {
  wirePmStatusPromotion();
  const primary = app.querySelector('[data-actionbar-action="primary"]');
  const fields = [...app.querySelectorAll("[data-pm-details-field]")];
  const draftKeys = { scheduling: "schedulingDetails", request: "requestDetails" };
  fields.forEach((field) => {
    const key = field.dataset.pmDetailsField;
    const count = app.querySelector(`[data-pm-details-count="${key}"]`);
    field.value = pmRequestDraft[draftKeys[key]];
    const update = () => {
      pmRequestDraft[draftKeys[key]] = field.value;
      count.textContent = `${field.value.length} / 500`;
      primary.disabled = !fields.every((input) => input.value.trim());
    };
    field.addEventListener("input", update);
    update();
  });
  app.querySelectorAll("[data-pm-details-selected-toggle]").forEach((toggle) => {
    const key = toggle.dataset.pmDetailsSelectedToggle;
    const panel = app.querySelector(`[data-pm-details-selected-panel="${key}"]`);
    renderPmDetailsSelectedInstruments(panel, key);
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.querySelector("img").src = `assets/icons/directions/chevron ${expanded ? "down" : "right"}/size=24px, style=mono.svg`;
      panel.hidden = !expanded;
    });
  });
  primary.addEventListener("click", () => setRoute("request-pm-contact"));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestPmDetails() {
  const template = document.querySelector("#request-pm-details-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountNativePageChrome("request-support", { title: "Request PM scheduling", backRoute: "request-pm-status" });
  mountTicketStepViewer(3, {
    labels: ["Select instrument(s)", "View PM status", "Add request details", "Confirm contact information", "Review and submit"],
    ariaLabel: "PM scheduling request progress",
  });
  mountNativeFlowActionBar({ backRoute: "request-pm-status" });
  wireRequestPmDetails();
  document.title = "Request PM scheduling — add request details";
}

function wireRequestPmContact() {
  const defaultPmContact = {
    firstName: "Molly",
    lastName: "Hartman",
    phone: "555-555-5555",
    email: "molly.hartman@thermofisher.com",
    country: "USA",
    state: "California",
    city: "Carlsbad",
    postalCode: "93047",
  };
  const fields = [...app.querySelectorAll("[data-pm-contact-field]")];
  const requiredFields = fields.filter((field) => field.required);
  const primary = app.querySelector('[data-actionbar-action="primary"]');
  const country = fields.find((field) => field.dataset.pmContactField === "country");
  const state = fields.find((field) => field.dataset.pmContactField === "state");
  const update = () => {
    fields.forEach((field) => { pmRequestDraft.contact[field.dataset.pmContactField] = field.value; });
    primary.disabled = !requiredFields.every((field) => field.validity.valid && field.value.trim());
  };
  country.replaceChildren(...CALIBRATION_SUPPORTED_COUNTRIES.map((value) => new Option(value, value)));
  let stateDropdown;
  const updatePmStates = () => {
    const options = country.value === "USA" ? CALIBRATION_US_STATES : country.value === "Canada" ? CALIBRATION_CANADIAN_PROVINCES : ["Not applicable"];
    const previous = pmRequestDraft.contact.state || state.value;
    state.replaceChildren(...options.map((value) => new Option(value, value)));
    state.value = options.includes(previous) ? previous : options.includes(defaultPmContact.state) ? defaultPmContact.state : options[0];
    stateDropdown?.refresh();
    update();
  };
  fields.forEach((field) => {
    field.value = pmRequestDraft.contact[field.dataset.pmContactField]
      || defaultPmContact[field.dataset.pmContactField]
      || field.value;
    field.addEventListener("input", () => {
      if (field.dataset.pmContactField === "phone") field.value = field.value.replace(/[^0-9 -]/g, "");
      update();
    });
    field.addEventListener("change", update);
  });
  country.addEventListener("change", updatePmStates);
  updatePmStates();
  new KomodoSingleSelect(country);
  stateDropdown = new KomodoSingleSelect(state);
  primary.addEventListener("click", () => setRoute("request-pm-review"));
  update();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestPmContact() {
  const template = document.querySelector("#request-pm-contact-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountNativePageChrome("request-support", { title: "Request PM scheduling", backRoute: "request-pm-details" });
  mountTicketStepViewer(4, {
    labels: ["Select instrument(s)", "View PM status", "Add request details", "Confirm contact information", "Review and submit"],
    ariaLabel: "PM scheduling request progress",
  });
  mountNativeFlowActionBar({ backRoute: "request-pm-details" });
  wireRequestPmContact();
  document.title = "Request PM scheduling — confirm contact information";
}

function wirePmReviewDisclosure(toggle, panel, key) {
  renderPmDetailsSelectedInstruments(panel, key);
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.querySelector("img").src = `assets/icons/directions/chevron ${expanded ? "down" : "right"}/size=24px, style=mono.svg`;
    panel.hidden = !expanded;
  });
}

function renderRequestPmReview() {
  const template = document.querySelector("#request-pm-review-template");
  app.replaceChildren(template.content.cloneNode(true));
  wirePmStatusPromotion();
  mountNativePageChrome("request-support", { title: "Request PM scheduling", backRoute: "request-pm-contact" });
  mountTicketStepViewer(5, {
    labels: ["Select instrument(s)", "View PM status", "Add request details", "Confirm contact information", "Review and submit"],
    ariaLabel: "PM scheduling request progress",
  });
  const actionBar = mountNativeFlowActionBar({ backRoute: "request-pm-contact", primaryDisabled: false });
  actionBar.querySelector('[data-actionbar-action="primary"]').textContent = "Submit";
  const contact = pmRequestDraft.contact;
  const serviceAddress = [
    [contact.serviceAddress, contact.additionalAddress].filter(Boolean).join(", "),
    [contact.city, contact.state, contact.country, contact.postalCode ? `CP: ${contact.postalCode}` : ""].filter(Boolean).join(", "),
  ].filter(Boolean).join("\n") || "—";
  app.querySelector("[data-pm-review-scheduling-details]").textContent = pmRequestDraft.schedulingDetails || "—";
  app.querySelector("[data-pm-review-request-details]").textContent = pmRequestDraft.requestDetails || "—";
  app.querySelector("[data-pm-review-name]").textContent = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || "—";
  ["phone", "email", "company"].forEach((key) => {
    app.querySelector(`[data-pm-review-contact="${key}"]`).textContent = contact[key] || "—";
  });
  app.querySelector("[data-pm-review-service-address]").textContent = serviceAddress;
  ["scheduling", "request"].forEach((key) => {
    wirePmReviewDisclosure(
      app.querySelector(`[data-pm-review-selected-toggle="${key}"]`),
      app.querySelector(`[data-pm-review-selected-panel="${key}"]`),
      key,
    );
  });
  actionBar.querySelector('[data-actionbar-action="primary"]').addEventListener("click", () => setRoute("pm-request-summary"));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = "Request PM scheduling — review and submit";
}

function renderPmRequestSummary() {
  const template = document.querySelector("#pm-request-summary-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountNativePageChrome("request-support", { title: "Request PM scheduling", backRoute: "request-support" });
  const contact = pmRequestDraft.contact;
  const serviceAddress = [
    [contact.serviceAddress, contact.additionalAddress].filter(Boolean).join(", "),
    [contact.city, contact.state, contact.country, contact.postalCode ? `CP: ${contact.postalCode}` : ""].filter(Boolean).join(", "),
  ].filter(Boolean).join("\n") || "—";
  app.querySelector("[data-pm-summary-scheduling-details]").textContent = pmRequestDraft.schedulingDetails || "—";
  app.querySelector("[data-pm-summary-request-details]").textContent = pmRequestDraft.requestDetails || "—";
  app.querySelector("[data-pm-summary-name]").textContent = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || "—";
  ["phone", "email", "company"].forEach((key) => {
    app.querySelector(`[data-pm-summary-contact="${key}"]`).textContent = contact[key] || "—";
  });
  app.querySelector("[data-pm-summary-service-address]").textContent = serviceAddress;
  ["scheduling", "request"].forEach((key) => {
    wirePmReviewDisclosure(
      app.querySelector(`[data-pm-summary-selected-toggle="${key}"]`),
      app.querySelector(`[data-pm-summary-selected-panel="${key}"]`),
      key,
    );
  });
  const closeBar = window.PlatformActionBar?.mount(app.querySelector("[data-platform-action-bar-mount]"), { closeOnly: true, closeRoute: "request-support" });
  closeBar?.classList.add("platform-actionbar--native-flow", "platform-actionbar--submitted-summary");
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = "Request PM scheduling — submitted";
}

function wireRequestServicePlan() {
  const continueButton = app.querySelector('[data-actionbar-action="primary"]');
  const search = app.querySelector("[data-sp-search]");
  const selectAll = app.querySelector("[data-serviceplan-select-all]");
  const tableSelectAll = app.querySelector("[data-serviceplan-select-all-table]");
  const systemRow = app.querySelector(".serviceplan-system");
  const systemToggle = app.querySelector("[data-serviceplan-system-toggle]");
  const system = app.querySelector("[data-sp-system]");
  const rows = [...app.querySelectorAll("[data-sp-row]")];
  const instruments = [...app.querySelectorAll("[data-sp-instrument]")];
  const collapsibleRows = rows.slice(0, 5);
  let expanded = true;

  rows.forEach((row) => {
    const cells = row.cells;
    row.classList.add("iss-system-child");
    row.dataset.group = cells[5].textContent.trim() || "—";
    row.dataset.type = cells[6].textContent.trim() || "—";
    row.dataset.model = cells[7].textContent.trim() || "—";
    row.dataset.coverage = cells[8].textContent.trim() || "—";
    row.querySelectorAll('img[src="assets/icons/actions/return/Size=16px, Style=Mono.svg"]').forEach((icon) => {
      icon.src = "assets/icons/actions/system-return/Size=16px, Style=Mono.svg";
    });
  });
  rows.slice(5).forEach((row) => {
    const image = row.cells[2]?.querySelector("img");
    if (!image) return;
    image.classList.add("iss-indent-instrument");
    row.cells[1].replaceChildren(image);
  });

  const updateSelection = () => {
    const selected = instruments.filter((input) => input.checked).length;
    const selectedSystemRows = collapsibleRows.filter((row) => row.querySelector("[data-sp-instrument]").checked);
    system.checked = selectedSystemRows.length === collapsibleRows.length;
    system.indeterminate = selectedSystemRows.length > 0 && selectedSystemRows.length < collapsibleRows.length;
    tableSelectAll.checked = selected === instruments.length;
    tableSelectAll.indeterminate = selected > 0 && selected < instruments.length;
    selectAll.setAttribute("aria-pressed", String(tableSelectAll.checked));
    continueButton.disabled = selected === 0;
  };

  const setAll = (checked) => {
    instruments.forEach((input) => { input.checked = checked; });
    updateSelection();
  };

  const setAllSystemRows = (checked) => {
    collapsibleRows.forEach((row) => { row.querySelector("[data-sp-instrument]").checked = checked; });
    updateSelection();
  };
  system.addEventListener("change", () => setAllSystemRows(system.checked));
  selectAll.addEventListener("click", () => setAll(!tableSelectAll.checked));
  tableSelectAll.addEventListener("change", () => setAll(tableSelectAll.checked));
  instruments.forEach((input) => input.addEventListener("change", updateSelection));
  const appliedFilters = app.querySelector("[data-serviceplan-applied-filters]");
  const appliedBadges = app.querySelector("[data-serviceplan-applied-badges]");
  const clearFilters = app.querySelector("[data-serviceplan-clear-filters]");
  const filters = [["group", "Groups"], ["type", "Type"], ["model", "Catalog no."], ["coverage", "Coverage"]].map(([key, label]) => {
    const host = document.createElement("div");
    appliedBadges.append(host);
    const controlHost = app.querySelector(`[data-serviceplan-filter-host="${key}"]`);
    const options = [...new Set(rows.map((row) => row.dataset[key]).filter((value) => value && value !== "—"))];
    return { key, filter: new window.MultiSelectFilter(host, { label, options: options.length ? options : ["—"], controlHost, menuStyle: "figma-column" }) };
  });
  const filterRows = () => {
    const query = search.value.trim().toLowerCase();
    let visibleSystemInstrument = false;
    rows.forEach((row) => {
      const matchesFilters = filters.every(({ key, filter }) => !filter.values.length || filter.values.includes(row.dataset[key]));
      row.hidden = (!expanded && collapsibleRows.includes(row)) || (Boolean(query) && !row.dataset.search.includes(query)) || !matchesFilters;
      if (collapsibleRows.includes(row) && !row.hidden) visibleSystemInstrument = true;
    });
    systemRow.hidden = Boolean(query) && !visibleSystemInstrument;
  };
  const updateAppliedFilters = () => {
    const active = filters.some(({ filter }) => filter.values.length);
    appliedFilters.hidden = !active;
    clearFilters.hidden = !active;
  };
  filters.forEach(({ filter }) => filter.host.addEventListener("multiselect-filter-change", () => { filterRows(); updateAppliedFilters(); }));
  clearFilters.addEventListener("click", () => { filters.forEach(({ filter }) => filter.clear()); updateAppliedFilters(); });
  search.addEventListener("input", () => {
    filterRows();
  });
  systemToggle.addEventListener("click", () => {
    expanded = !expanded;
    systemToggle.setAttribute("aria-expanded", String(expanded));
    systemToggle.setAttribute("aria-label", `${expanded ? "Collapse" : "Expand"} system`);
    systemToggle.querySelector("img").style.transform = expanded ? "" : "rotate(-90deg)";
    filterRows();
  });
  const pageSizeButton = app.querySelector("[data-serviceplan-page-size]");
  const pageSizeMenu = app.querySelector("[data-serviceplan-page-size-menu]");
  const closePageSizeMenu = () => { pageSizeMenu.hidden = true; pageSizeButton.setAttribute("aria-expanded", "false"); };
  pageSizeButton.addEventListener("click", () => {
    pageSizeMenu.hidden = !pageSizeMenu.hidden;
    pageSizeButton.setAttribute("aria-expanded", String(!pageSizeMenu.hidden));
  });
  pageSizeMenu.querySelectorAll("[data-serviceplan-page-size-option]").forEach((option) => option.addEventListener("click", () => {
    const caret = pageSizeButton.querySelector("img");
    pageSizeButton.replaceChildren(document.createTextNode(`${option.dataset.serviceplanPageSizeOption} `), caret);
    pageSizeMenu.querySelectorAll("[data-serviceplan-page-size-option]").forEach((item) => item.setAttribute("aria-selected", String(item === option)));
    closePageSizeMenu();
  }));
  document.addEventListener("mousedown", (event) => { if (!event.target.closest(".iss-page-size-control")) closePageSizeMenu(); });
  continueButton.addEventListener("click", () => {
    servicePlanRequestDraft.instruments = rows.filter((row) => row.querySelector("[data-sp-instrument]")?.checked).map((row) => {
      const cells = row.cells;
      return {
        serial: cells[3]?.textContent.trim() || "—",
        nickname: cells[4]?.textContent.trim() || "—",
        image: cells[2]?.querySelector("img")?.getAttribute("src") || "assets/instruments/tsq.png",
        system: collapsibleRows.includes(row),
      };
    });
    setRoute("request-serviceplan-details");
  });
  app.querySelectorAll("[data-sp-instrument-link]").forEach((button) => {
    button.addEventListener("click", () => showToast("Instrument details opened"));
  });
  updateSelection();
  filterRows();
  updateAppliedFilters();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function prepareServicePlanStepOne() {
  const selectAll = app.querySelector(".pm-select-all");
  selectAll.outerHTML = '<button class="pm-select-all qualification-select-all" type="button" data-serviceplan-select-all aria-pressed="false">Select all 240 instruments</button>';
  const applied = document.createElement("div");
  applied.className = "sh-applied-filters iss-applied-filters";
  applied.dataset.serviceplanAppliedFilters = "";
  applied.hidden = true;
  applied.innerHTML = '<div class="iss-applied-filters__badges" data-serviceplan-applied-badges></div><button class="sh-clear-filters" type="button" data-serviceplan-clear-filters hidden>Clear filter(s)</button>';
  app.querySelector("[data-serviceplan-select-all]").after(applied);
  const tableWrap = app.querySelector(".pm-table-wrap");
  tableWrap.className = "iss-table-wrap serviceplan-table-wrap";
  const table = tableWrap.querySelector(".pm-table");
  table.className = "iss-table serviceplan-table";
  const systemRow = table.querySelector(".pm-system");
  systemRow.className = "iss-system serviceplan-system";
  table.tHead.rows[0].cells[0].innerHTML = '<input type="checkbox" data-serviceplan-select-all-table aria-label="Select all instruments" />';
  systemRow.cells[1].innerHTML = '<button class="iss-system-toggle" type="button" data-serviceplan-system-toggle aria-expanded="true" aria-label="Collapse system"><img src="assets/icons/directions/chevron down/size=16px, style=mono.svg" alt="" /></button>';
  systemRow.cells[2].innerHTML = '<img src="assets/icons/general/in systems/size=24px, style=mono.svg" alt="" />';
  [["group", "Groups"], ["type", "Type"], ["model", "Catalog no."], ["coverage", "Coverage"]].forEach(([key, label], index) => {
    table.tHead.rows[0].cells[index + 5].innerHTML = `<div data-serviceplan-filter-host="${key}" aria-label="${label} filter"></div>`;
  });
  const pagination = app.querySelector(".pm-pagination");
  pagination.className = "iss-pagination serviceplan-pagination";
  const pageSize = pagination.querySelector(".pm-page-size");
  pageSize.className = "iss-page-size";
  pageSize.dataset.serviceplanPageSize = "";
  pageSize.setAttribute("aria-expanded", "false");
  const pageSizeControl = document.createElement("span");
  pageSizeControl.className = "iss-page-size-control";
  pageSize.replaceWith(pageSizeControl);
  pageSizeControl.append(pageSize);
  const pageSizeMenu = document.createElement("div");
  pageSizeMenu.className = "iss-page-size-menu";
  pageSizeMenu.dataset.serviceplanPageSizeMenu = "";
  pageSizeMenu.hidden = true;
  pageSizeMenu.innerHTML = [10, 20, 30, 40, 50].map((value) => `<button type="button" data-serviceplan-page-size-option="${value}" aria-selected="${value === 20}">${value}</button>`).join("");
  pageSizeControl.append(pageSizeMenu);
  pagination.querySelectorAll(".pm-page-arrow").forEach((button) => { button.className = "iss-page-arrow"; });
  pagination.querySelectorAll(".pm-page-number").forEach((button) => { button.className = button.classList.contains("is-current") ? "iss-page-number is-current" : "iss-page-number"; });
  pagination.querySelector("strong").textContent = "267";
  pagination.querySelector("strong").className = "iss-results-total";
  pagination.querySelector("span:last-of-type").className = "iss-go-to";
}

function renderRequestServicePlan() {
  const template = document.querySelector("#request-serviceplan-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountNativePageChrome("request-support", { title: "Request a service plan quote", backRoute: "request-support" });
  const legacySteps = app.querySelector(".sp-steps");
  const stepMount = document.createElement("div");
  stepMount.dataset.ticketStepViewer = "";
  legacySteps.replaceWith(stepMount);
  mountTicketStepViewer(1, { labels: ["Select instrument", "Add request details", "Confirm contact information", "Review and submit"], ariaLabel: "Service plan quote request progress" });
  prepareServicePlanStepOne();
  mountNativeFlowActionBar();
  wireRequestServicePlan();
  document.title = "Request a service plan quote — Services Central";
}

function renderServicePlanSelectedInstruments(host) {
  const table = document.createElement("table");
  table.className = "qualification-selected-table";
  table.innerHTML = '<colgroup><col class="qualification-selected-table__image" /><col /><col /></colgroup><thead><tr><th></th><th>Serial number</th><th>Nickname</th></tr></thead>';
  const body = document.createElement("tbody");
  servicePlanRequestDraft.instruments.forEach((instrument) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td><img src="${instrument.image}" alt="" /></td><td>${instrument.serial}</td><td>${instrument.nickname}</td>`;
    body.append(row);
  });
  table.append(body);
  host.replaceChildren(table);
}

function mountServicePlanFlowTemplate(templateId, screenClass, currentStep, backRoute, primaryDisabled = true) {
  const template = document.querySelector(templateId);
  app.replaceChildren(template.content.cloneNode(true));
  const screen = app.querySelector(".screen");
  screen.classList.add(screenClass);
  screen.setAttribute("aria-label", `Request a service plan quote: step ${currentStep}`);
  app.querySelector(".iss-titlebar h1").textContent = "Request a service plan quote";
  mountNativePageChrome("request-support", { title: "Request a service plan quote", backRoute });
  mountTicketStepViewer(currentStep, { labels: ["Select instrument", "Add request details", "Confirm contact information", "Review and submit"], ariaLabel: "Service plan quote request progress" });
  return mountNativeFlowActionBar({ backRoute, primaryDisabled });
}

function wireServicePlanDetails() {
  const textarea = app.querySelector("[data-qualification-details]");
  const primary = app.querySelector('[data-actionbar-action="primary"]');
  const selectedPanel = app.querySelector("[data-qualification-selected-panel]");
  const requestDetailsCard = app.querySelector(".qualification-flow-card");
  requestDetailsCard.querySelector("header p").textContent = "Please provide any additional details you would like to share with us to help us process your request.";
  textarea.placeholder = "Provide additional details about your service plan request.";
  const needs = document.createElement("article");
  needs.className = "service-plan-coverage-needs";
  needs.innerHTML = `<header><h2>Service coverage needs</h2><p>Please answer the question(s) below to identify the service coverage needed.</p></header>
    <div class="service-plan-coverage-needs__options">
      <fieldset><legend>How significant is a day of downtime for your business?<b>*</b></legend><div class="service-plan-coverage-needs__choices">
        <label><input type="radio" name="serviceplan-downtime" value="Minor" data-serviceplan-downtime />Minor</label>
        <label><input type="radio" name="serviceplan-downtime" value="Moderate" data-serviceplan-downtime />Moderate</label>
        <label><input type="radio" name="serviceplan-downtime" value="Severe" data-serviceplan-downtime />Severe</label>
      </div></fieldset>
      <fieldset><legend>What else is important for your staff?</legend><div class="service-plan-coverage-needs__choices service-plan-coverage-needs__choices--priorities">
        ${["Software / firmware updates", "Preventive Maintenance", "Same day, remote technical support", "Calibration services", "Corrective Maintenance / Repair", "Factory training onsite"].map((value) => `<label><input type="checkbox" value="${value}" data-serviceplan-priority />${value}</label>`).join("")}
      </div></fieldset>
    </div>`;
  requestDetailsCard.after(needs);
  const downtimeChoices = [...needs.querySelectorAll("[data-serviceplan-downtime]")];
  const priorityChoices = [...needs.querySelectorAll("[data-serviceplan-priority]")];
  downtimeChoices.find((input) => input.value === servicePlanRequestDraft.coverageNeeds.downtime)?.setAttribute("checked", "");
  priorityChoices.filter((input) => servicePlanRequestDraft.coverageNeeds.priorities.includes(input.value)).forEach((input) => input.setAttribute("checked", ""));
  renderServicePlanSelectedInstruments(selectedPanel);
  wireQualificationInstrumentDisclosure(app.querySelector("[data-qualification-selected-toggle]"), selectedPanel);
  textarea.value = servicePlanRequestDraft.additionalDetails;
  const update = () => {
    servicePlanRequestDraft.additionalDetails = textarea.value;
    servicePlanRequestDraft.coverageNeeds.downtime = downtimeChoices.find((input) => input.checked)?.value || "";
    servicePlanRequestDraft.coverageNeeds.priorities = priorityChoices.filter((input) => input.checked).map((input) => input.value);
    primary.disabled = !servicePlanRequestDraft.additionalDetails.trim() || !servicePlanRequestDraft.coverageNeeds.downtime;
  };
  textarea.addEventListener("input", update);
  [...downtimeChoices, ...priorityChoices].forEach((input) => input.addEventListener("change", update));
  primary.addEventListener("click", () => setRoute("request-serviceplan-contact"));
  update();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestServicePlanDetails() {
  mountServicePlanFlowTemplate("#request-qualification-details-template", "screen--request-serviceplan-details", 2, "request-serviceplan");
  wireServicePlanDetails();
  document.title = "Request a service plan quote — add request details";
}

function wireServicePlanContact() {
  const defaults = { firstName: "Molly", lastName: "Hartman", phone: "123-456-7890", email: "molly.hartman@thermofisher.com", company: "Thermo Fisher", serviceAddress: "123 Blueberry Lane", country: "USA", state: "California", city: "Carlsbad", postalCode: "93047" };
  const fields = [...app.querySelectorAll("[data-qualification-contact-field]")];
  const primary = app.querySelector('[data-actionbar-action="primary"]');
  const country = fields.find((field) => field.dataset.qualificationContactField === "country");
  const state = fields.find((field) => field.dataset.qualificationContactField === "state");
  const update = () => {
    fields.forEach((field) => { servicePlanRequestDraft.contact[field.dataset.qualificationContactField] = field.value; });
    primary.disabled = !fields.filter((field) => field.required).every((field) => field.validity.valid && field.value.trim());
  };
  country.replaceChildren(...CALIBRATION_SUPPORTED_COUNTRIES.map((value) => new Option(value, value)));
  let countryDropdown;
  let stateDropdown;
  const updateStates = () => {
    const options = country.value === "USA" ? CALIBRATION_US_STATES : country.value === "Canada" ? CALIBRATION_CANADIAN_PROVINCES : ["Not applicable"];
    const previous = servicePlanRequestDraft.contact.state || state.value;
    state.replaceChildren(...options.map((value) => new Option(value, value)));
    state.value = options.includes(previous) ? previous : options.includes(defaults.state) ? defaults.state : options[0];
    stateDropdown?.refresh();
    update();
  };
  fields.forEach((field) => {
    const key = field.dataset.qualificationContactField;
    const value = servicePlanRequestDraft.contact[key] || defaults[key] || field.value;
    field.defaultValue = value;
    field.value = value;
    field.addEventListener("input", () => { if (field.dataset.qualificationContactField === "phone") field.value = field.value.replace(/[^0-9 -]/g, ""); update(); });
    field.addEventListener("change", update);
  });
  country.addEventListener("change", updateStates);
  updateStates();
  countryDropdown = new KomodoSingleSelect(country);
  stateDropdown = new KomodoSingleSelect(state);
  stateDropdown.refresh();
  primary.addEventListener("click", () => setRoute("request-serviceplan-review"));
  update();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestServicePlanContact() {
  mountServicePlanFlowTemplate("#request-qualification-contact-template", "screen--request-serviceplan-contact", 3, "request-serviceplan-details");
  wireServicePlanContact();
  document.title = "Request a service plan quote — confirm contact information";
}

function servicePlanServiceAddress() {
  const contact = servicePlanRequestDraft.contact;
  return [[contact.serviceAddress, contact.additionalAddress].filter(Boolean).join(", "), [contact.city, contact.state, contact.country, contact.postalCode ? `CP: ${contact.postalCode}` : ""].filter(Boolean).join(", ")].filter(Boolean).join("\n") || "—";
}

function fillServicePlanReview(scope, prefix) {
  const contact = servicePlanRequestDraft.contact;
  scope.querySelector(`[data-${prefix}-details]`).textContent = servicePlanRequestDraft.additionalDetails || "—";
  scope.querySelector(`[data-${prefix}-name]`).textContent = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || "—";
  scope.querySelector(`[data-${prefix}-service-address]`).textContent = servicePlanServiceAddress();
  Object.entries({ phone: contact.phone || "—", email: contact.email || "—", company: contact.company || "—" }).forEach(([key, value]) => {
    const output = scope.querySelector(`[data-${prefix}-contact="${key}"]`);
    if (output) output.textContent = value;
  });
}

function insertServicePlanCoverageNeeds(scope, prefix) {
  const contactCard = scope.querySelector(".qualification-review-card + .qualification-review-card") || scope.querySelector(".qualification-summary-card + .qualification-summary-card");
  const needsCard = document.createElement("article");
  needsCard.className = "qualification-flow-card qualification-review-card service-plan-review-needs";
  needsCard.innerHTML = `<h2>Service coverage needs</h2><dl class="qualification-review-details service-plan-review-needs__details"><div><dt>Significant downtime</dt><dd data-${prefix}-downtime></dd></div><div><dt>Other important things</dt><dd data-${prefix}-priorities></dd></div></dl>`;
  needsCard.querySelector(`[data-${prefix}-downtime]`).textContent = servicePlanRequestDraft.coverageNeeds.downtime || "—";
  needsCard.querySelector(`[data-${prefix}-priorities]`).textContent = servicePlanRequestDraft.coverageNeeds.priorities.join("\n") || "—";
  contactCard.before(needsCard);
}

function renderRequestServicePlanReview() {
  const actionBar = mountServicePlanFlowTemplate("#request-qualification-review-template", "screen--request-serviceplan-review", 4, "request-serviceplan-contact", false);
  actionBar.querySelector('[data-actionbar-action="primary"]').textContent = "Submit";
  fillServicePlanReview(app, "qualification-review");
  insertServicePlanCoverageNeeds(app, "serviceplan-review");
  const selectedPanel = app.querySelector("[data-qualification-selected-panel]");
  renderServicePlanSelectedInstruments(selectedPanel);
  wireQualificationInstrumentDisclosure(app.querySelector("[data-qualification-selected-toggle]"), selectedPanel);
  actionBar.querySelector('[data-actionbar-action="primary"]').addEventListener("click", () => setRoute("serviceplan-summary"));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = "Request a service plan quote — review and submit";
}

function renderServicePlanSummary() {
  const template = document.querySelector("#qualification-summary-template");
  app.replaceChildren(template.content.cloneNode(true));
  const screen = app.querySelector(".screen");
  screen.classList.add("screen--serviceplan-summary");
  screen.setAttribute("aria-label", "Request a service plan quote: submitted summary");
  app.querySelector(".iss-titlebar h1").textContent = "Request a service plan quote";
  mountNativePageChrome("request-support", { title: "Request a service plan quote", backRoute: "request-support" });
  const submittedNotice = app.querySelector(".ts-notice--submitted");
  const contactNote = document.createElement("section");
  contactNote.className = "serviceplan-summary-contact-note";
  contactNote.setAttribute("data-serviceplan-summary-contact-note", "");
  contactNote.setAttribute("role", "status");
  contactNote.innerHTML = `<img src="assets/icons/notifications/info/size=24px, style=bold.svg" alt="" /><div><p><strong>Note:</strong> The information provided in this request did not change your <a href="#service-plan-contacts" data-route="service-plan-contacts">service plan contacts</a> in Services Central.</p><button class="mi-button mi-button--secondary" type="button" data-route="service-plan-contacts">Review service plan contacts</button></div>`;
  submittedNotice.after(contactNote);
  fillServicePlanReview(app, "qualification-summary");
  insertServicePlanCoverageNeeds(app, "serviceplan-summary");
  const selectedPanel = app.querySelector("[data-qualification-selected-panel]");
  renderServicePlanSelectedInstruments(selectedPanel);
  wireQualificationInstrumentDisclosure(app.querySelector("[data-qualification-selected-toggle]"), selectedPanel);
  const closeBar = window.PlatformActionBar?.mount(app.querySelector("[data-platform-action-bar-mount]"), { closeOnly: true, closeRoute: "request-support" });
  closeBar?.classList.add("platform-actionbar--native-flow", "platform-actionbar--submitted-summary");
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = "Request a service plan quote — submitted";
}

function wireRequestQualification() {
  const continueButton = app.querySelector('[data-actionbar-action="primary"]');
  const search = app.querySelector("[data-sp-search]");
  const selectAll = app.querySelector("[data-qualification-select-all]");
  const tableSelectAll = app.querySelector("[data-qualification-select-all-table]");
  const systemRow = app.querySelector(".iss-system");
  const systemToggle = app.querySelector("[data-qualification-system-toggle]");
  const systemCheckbox = app.querySelector("[data-sp-system]");
  const rows = [...app.querySelectorAll("[data-sp-row]")];
  const collapsibleRows = rows.slice(0, 5);
  let expanded = true;

  rows.forEach((row) => {
    const cells = row.cells;
    row.classList.add("iss-system-child");
    row.dataset.group = cells[5]?.textContent.trim() || "—";
    row.dataset.type = cells[6]?.textContent.trim() || "—";
    row.dataset.model = cells[7]?.textContent.trim() || "—";
    row.dataset.coverage = cells[8]?.textContent.trim() || "—";
    row.querySelectorAll('img[src="assets/icons/actions/return/Size=16px, Style=Mono.svg"]').forEach((icon) => {
      icon.src = "assets/icons/actions/system-return/Size=16px, Style=Mono.svg";
    });
  });
  rows.slice(5).forEach((row) => {
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
  let tooltipIndex = 0;
  rows.forEach((row) => {
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
      const id = `qualification-overflow-tooltip-${++tooltipIndex}`;
      tooltip.className = "iss-overflow-tooltip";
      tooltip.id = id;
      tooltip.setAttribute("role", "tooltip");
      tooltip.hidden = true;
      tooltip.textContent = fullEllipsisText.get(value) || value;
      trigger.classList.add("iss-overflow");
      trigger.setAttribute("aria-describedby", id);
      trigger.append(tooltip);
      trigger.addEventListener("pointerenter", () => setSupportHistoryTooltip(trigger, true));
      trigger.addEventListener("pointerleave", () => setSupportHistoryTooltip(trigger, false));
      trigger.addEventListener("focus", () => setSupportHistoryTooltip(trigger, true));
      trigger.addEventListener("blur", () => setSupportHistoryTooltip(trigger, false));
      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setSupportHistoryTooltip(trigger, false);
      });
    });
  });

  const appliedFilters = app.querySelector("[data-qualification-applied-filters]");
  const appliedBadges = app.querySelector("[data-qualification-applied-badges]");
  const clearFiltersButton = app.querySelector("[data-qualification-clear-filters]");
  const filters = [["group", "Groups"], ["type", "Type"], ["model", "Catalog no."], ["coverage", "Coverage"]].map(([key, label]) => {
    const controlHost = app.querySelector(`[data-qualification-filter-host="${key}"]`);
    const host = document.createElement("div");
    appliedBadges.append(host);
    const options = [...new Set(rows.map((row) => row.dataset[key]).filter((value) => value && value !== "—"))];
    return { key, filter: new window.MultiSelectFilter(host, { label, options: options.length ? options : ["—"], controlHost, menuStyle: "figma-column" }) };
  });
  const updateAppliedFilters = () => {
    const hasFilters = filters.some(({ filter }) => filter.values.length);
    appliedFilters.hidden = !hasFilters;
    clearFiltersButton.hidden = !hasFilters;
  };

  const updateSelection = () => {
    const selected = rows.filter((row) => row.querySelector("[data-sp-instrument]").checked);
    const selectedSystemRows = collapsibleRows.filter((row) => row.querySelector("[data-sp-instrument]").checked);
    systemCheckbox.checked = selectedSystemRows.length === collapsibleRows.length;
    systemCheckbox.indeterminate = selectedSystemRows.length > 0 && selectedSystemRows.length < collapsibleRows.length;
    tableSelectAll.checked = selected.length === rows.length;
    tableSelectAll.indeterminate = selected.length > 0 && selected.length < rows.length;
    selectAll.setAttribute("aria-pressed", String(tableSelectAll.checked));
    continueButton.disabled = selected.length === 0;
  };
  const filterRows = () => {
    const query = search.value.trim().toLowerCase();
    let visibleSystemInstrument = false;
    rows.forEach((row) => {
      const matchesSearch = !query || row.dataset.search.includes(query);
      const matchesFilters = filters.every(({ key, filter }) => !filter.values.length || filter.values.includes(row.dataset[key]));
      row.hidden = (!expanded && collapsibleRows.includes(row)) || !matchesSearch || !matchesFilters;
      if (collapsibleRows.includes(row) && !row.hidden) visibleSystemInstrument = true;
    });
    systemRow.hidden = Boolean(query) && !visibleSystemInstrument;
  };
  const setAllRows = (checked) => {
    rows.forEach((row) => { row.querySelector("[data-sp-instrument]").checked = checked; });
    updateSelection();
  };

  const setAllSystemRows = (checked) => {
    collapsibleRows.forEach((row) => { row.querySelector("[data-sp-instrument]").checked = checked; });
    updateSelection();
  };

  search.addEventListener("input", filterRows);
  selectAll.addEventListener("click", () => setAllRows(!tableSelectAll.checked));
  tableSelectAll.addEventListener("change", () => setAllRows(tableSelectAll.checked));
  systemCheckbox.addEventListener("change", () => setAllSystemRows(systemCheckbox.checked));
  rows.forEach((row) => row.querySelector("[data-sp-instrument]").addEventListener("change", updateSelection));
  systemToggle.addEventListener("click", () => {
    expanded = !expanded;
    systemToggle.setAttribute("aria-expanded", String(expanded));
    systemToggle.setAttribute("aria-label", `${expanded ? "Collapse" : "Expand"} system`);
    systemToggle.querySelector("img").style.transform = expanded ? "" : "rotate(-90deg)";
    filterRows();
  });
  filters.forEach(({ filter }) => filter.host.addEventListener("multiselect-filter-change", () => {
    filterRows();
    updateAppliedFilters();
  }));
  clearFiltersButton.addEventListener("click", () => {
    filters.forEach(({ filter }) => filter.clear());
    updateAppliedFilters();
  });

  const pageSizeButton = app.querySelector("[data-qualification-page-size]");
  const pageSizeMenu = app.querySelector("[data-qualification-page-size-menu]");
  const closePageSizeMenu = () => {
    pageSizeMenu.hidden = true;
    pageSizeButton.setAttribute("aria-expanded", "false");
  };
  pageSizeButton.addEventListener("click", () => {
    pageSizeMenu.hidden = !pageSizeMenu.hidden;
    pageSizeButton.setAttribute("aria-expanded", String(!pageSizeMenu.hidden));
  });
  pageSizeMenu.querySelectorAll("[data-qualification-page-size-option]").forEach((option) => option.addEventListener("click", () => {
    const caret = pageSizeButton.querySelector("img");
    pageSizeButton.replaceChildren(document.createTextNode(`${option.dataset.qualificationPageSizeOption} `), caret);
    pageSizeMenu.querySelectorAll("[data-qualification-page-size-option]").forEach((item) => item.setAttribute("aria-selected", String(item === option)));
    closePageSizeMenu();
  }));
  document.addEventListener("mousedown", (event) => {
    if (!event.target.closest(".iss-page-size-control")) closePageSizeMenu();
  });
  continueButton.addEventListener("click", () => {
    qualificationRequestDraft.instruments = rows.filter((row) => row.querySelector("[data-sp-instrument]")?.checked).map((row) => ({
      serial: row.cells[3]?.textContent.trim() || "—",
      nickname: row.cells[4]?.textContent.trim() || "—",
      type: row.dataset.type || "—",
      model: row.dataset.model || "—",
      coverage: row.dataset.coverage || "—",
      image: row.cells[2]?.querySelector("img")?.getAttribute("src") || "",
      system: collapsibleRows.includes(row),
    }));
    setRoute("request-qualification-details");
  });
  app.querySelectorAll("[data-sp-instrument-link]").forEach((button) => button.addEventListener("click", () => showToast("Instrument details opened")));
  updateSelection();
  filterRows();
  updateAppliedFilters();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestQualification() {
  const template = document.querySelector("#request-serviceplan-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  const section = app.querySelector(".screen--request-serviceplan");
  section.classList.replace("screen--request-serviceplan", "screen--request-qualification");
  section.setAttribute("aria-label", "Request qualification service");
  app.querySelector(".pm-titlebar h1").textContent = "Request qualification service";
  const legacySteps = app.querySelector(".sp-steps");
  const stepViewerHost = document.createElement("div");
  stepViewerHost.dataset.ticketStepViewer = "";
  legacySteps.replaceWith(stepViewerHost);
  mountTicketStepViewer(1, {
    labels: ["Select instrument(s)", "Add request details", "Confirm contact information", "Review and submit"],
    ariaLabel: "Qualification service request progress",
  });
  app.querySelector("#sp-description").textContent = "Request a quote for a compliance service such as Installation Qualification (IQ), Operational Qualification (OQ), Requalification (RQ), or Temperature mapping.";
  const selectAll = app.querySelector(".pm-select-all");
  selectAll.outerHTML = '<button class="pm-select-all qualification-select-all" type="button" data-qualification-select-all aria-pressed="false">Select all 267 instruments</button>';
  const qualificationAppliedFilters = document.createElement("div");
  qualificationAppliedFilters.className = "sh-applied-filters iss-applied-filters";
  qualificationAppliedFilters.dataset.qualificationAppliedFilters = "";
  qualificationAppliedFilters.setAttribute("aria-label", "Instrument filters");
  qualificationAppliedFilters.hidden = true;
  qualificationAppliedFilters.innerHTML = '<div class="iss-applied-filters__badges" data-qualification-applied-badges></div><button class="sh-clear-filters" type="button" data-qualification-clear-filters hidden>Clear filter(s)</button>';
  app.querySelector("[data-qualification-select-all]").after(qualificationAppliedFilters);
  const tableWrap = app.querySelector(".pm-table-wrap");
  tableWrap.className = "iss-table-wrap qualification-table-wrap";
  const table = tableWrap.querySelector(".pm-table");
  table.className = "iss-table qualification-table";
  const systemRow = table.querySelector(".pm-system");
  systemRow.className = "iss-system qualification-system";
  const systemCell = systemRow.cells[1];
  table.tHead.rows[0].cells[0].innerHTML = '<input type="checkbox" data-qualification-select-all-table aria-label="Select all instruments" />';
  systemCell.innerHTML = '<button class="iss-system-toggle" type="button" data-qualification-system-toggle aria-expanded="true" aria-label="Collapse system"><img src="assets/icons/directions/chevron down/size=16px, style=mono.svg" alt="" /></button>';
  systemRow.cells[2].innerHTML = '<img src="assets/icons/general/in systems/size=24px, style=mono.svg" alt="" />';
  [["group", "Groups"], ["type", "Type"], ["model", "Catalog no."], ["coverage", "Coverage"]].forEach(([key, label], index) => {
    table.tHead.rows[0].cells[index + 5].innerHTML = `<div data-qualification-filter-host="${key}" aria-label="${label} filter"></div>`;
  });
  const pagination = app.querySelector(".pm-pagination");
  pagination.className = "iss-pagination qualification-pagination";
  const pageSize = pagination.querySelector(".pm-page-size");
  pageSize.className = "iss-page-size";
  pageSize.dataset.qualificationPageSize = "";
  pageSize.setAttribute("aria-expanded", "false");
  const pageSizeControl = document.createElement("span");
  pageSizeControl.className = "iss-page-size-control";
  pageSize.replaceWith(pageSizeControl);
  pageSizeControl.append(pageSize);
  const pageSizeMenu = document.createElement("div");
  pageSizeMenu.className = "iss-page-size-menu";
  pageSizeMenu.dataset.qualificationPageSizeMenu = "";
  pageSizeMenu.hidden = true;
  pageSizeMenu.innerHTML = [10, 20, 30, 40, 50].map((value) => `<button type="button" data-qualification-page-size-option="${value}" aria-selected="${value === 20}">${value}</button>`).join("");
  pageSizeControl.append(pageSizeMenu);
  pagination.querySelector("strong").textContent = "267";
  pagination.querySelector("strong").className = "iss-results-total";
  pagination.querySelectorAll(".pm-page-arrow").forEach((button) => { button.className = "iss-page-arrow"; });
  pagination.querySelectorAll(".pm-page-number").forEach((button) => { button.className = `${button.classList.contains("is-current") ? "iss-page-number is-current" : "iss-page-number"}`; });
  pagination.querySelector("span:last-of-type").className = "iss-go-to";
  mountNativePageChrome("request-support", { title: "Request qualification service", backRoute: "request-support" });
  mountNativeFlowActionBar();
  wireRequestQualification();
  document.title = "Request qualification service — Services Central";
}

function renderQualificationSelectedInstruments(host) {
  const table = document.createElement("table");
  table.className = "qualification-selected-table";
  table.innerHTML = "<colgroup><col class=\"qualification-selected-table__image\" /><col /><col /></colgroup><thead><tr><th></th><th>Serial number</th><th>Nickname</th></tr></thead>";
  const body = document.createElement("tbody");
  qualificationRequestDraft.instruments.forEach((instrument) => {
    const row = document.createElement("tr");
    const imageCell = document.createElement("td");
    const image = document.createElement("img");
    image.src = instrument.image || "assets/instruments/vanquish-detector.png";
    image.alt = "";
    imageCell.append(image);
    const serial = document.createElement("td");
    serial.textContent = instrument.serial || "—";
    const nickname = document.createElement("td");
    nickname.textContent = instrument.nickname || "—";
    row.append(imageCell, serial, nickname);
    body.append(row);
  });
  if (qualificationRequestDraft.instruments.some((instrument) => instrument.system)) {
    const systemRow = document.createElement("tr");
    const systemIconCell = document.createElement("td");
    const systemIcon = document.createElement("img");
    systemIcon.className = "qualification-selected-table__system-icon";
    systemIcon.src = "assets/icons/science/2 instruments/size=24px, style=mono.svg";
    systemIcon.alt = "";
    systemIconCell.append(systemIcon);
    const systemSerial = document.createElement("td");
    systemSerial.textContent = "System";
    const systemNickname = document.createElement("td");
    systemNickname.textContent = "Apline";
    systemRow.append(systemIconCell, systemSerial, systemNickname);
    body.append(systemRow);
  }
  table.append(body);
  host.replaceChildren(table);
}

function wireQualificationInstrumentDisclosure(toggle, panel) {
  const update = () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    panel.hidden = !expanded;
    toggle.querySelector("span").textContent = expanded ? "Hide selected instrument(s)" : "Show selected instrument(s)";
    toggle.querySelector("img").src = expanded ? "assets/icons/directions/chevron up/size=16px, style=mono.svg" : "assets/icons/directions/chevron down/size=16px, style=mono.svg";
  };
  toggle.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", String(toggle.getAttribute("aria-expanded") !== "true"));
    update();
  });
  update();
}

function wireRequestQualificationDetails() {
  const textarea = app.querySelector("[data-qualification-details]");
  const primary = app.querySelector('[data-actionbar-action="primary"]');
  const selectedPanel = app.querySelector("[data-qualification-selected-panel]");
  renderQualificationSelectedInstruments(selectedPanel);
  wireQualificationInstrumentDisclosure(app.querySelector("[data-qualification-selected-toggle]"), selectedPanel);
  const update = () => {
    qualificationRequestDraft.additionalDetails = textarea.value;
    primary.disabled = !textarea.value.trim();
  };
  textarea.value = qualificationRequestDraft.additionalDetails;
  textarea.addEventListener("input", update);
  primary.addEventListener("click", () => setRoute("request-qualification-contact"));
  update();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestQualificationDetails() {
  const template = document.querySelector("#request-qualification-details-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountNativePageChrome("request-support", { title: "Request qualification service", backRoute: "request-qualification" });
  mountTicketStepViewer(2, { labels: ["Select instrument(s)", "Add request details", "Confirm contact information", "Review and submit"], ariaLabel: "Qualification service request progress" });
  mountNativeFlowActionBar({ backRoute: "request-qualification" });
  wireRequestQualificationDetails();
  document.title = "Request qualification service — add request details";
}

function wireRequestQualificationContact() {
  const defaultQualificationContact = {
    firstName: "Molly",
    lastName: "Hartman",
    phone: "555-555-5555",
    email: "molly.hartman@thermofisher.com",
    country: "USA",
    state: "California",
    city: "Carlsbad",
    postalCode: "93047",
  };
  const fields = [...app.querySelectorAll("[data-qualification-contact-field]")];
  const requiredFields = fields.filter((field) => field.required);
  const primary = app.querySelector('[data-actionbar-action="primary"]');
  const country = fields.find((field) => field.dataset.qualificationContactField === "country");
  const state = fields.find((field) => field.dataset.qualificationContactField === "state");
  const update = () => {
    fields.forEach((field) => { qualificationRequestDraft.contact[field.dataset.qualificationContactField] = field.value; });
    primary.disabled = !requiredFields.every((field) => field.validity.valid && field.value.trim());
  };
  country.replaceChildren(...CALIBRATION_SUPPORTED_COUNTRIES.map((value) => new Option(value, value)));
  let stateDropdown;
  const updateQualificationStates = () => {
    const options = country.value === "USA" ? CALIBRATION_US_STATES : country.value === "Canada" ? CALIBRATION_CANADIAN_PROVINCES : ["Not applicable"];
    const previous = qualificationRequestDraft.contact.state || state.value;
    state.replaceChildren(...options.map((value) => new Option(value, value)));
    state.value = options.includes(previous) ? previous : options.includes(defaultQualificationContact.state) ? defaultQualificationContact.state : options[0];
    stateDropdown?.refresh();
    update();
  };
  fields.forEach((field) => {
    field.value = qualificationRequestDraft.contact[field.dataset.qualificationContactField]
      || defaultQualificationContact[field.dataset.qualificationContactField]
      || field.value;
    field.addEventListener("input", () => {
      if (field.dataset.qualificationContactField === "phone") field.value = field.value.replace(/[^0-9 -]/g, "");
      update();
    });
    field.addEventListener("change", update);
  });
  country.addEventListener("change", updateQualificationStates);
  updateQualificationStates();
  new KomodoSingleSelect(country);
  stateDropdown = new KomodoSingleSelect(state);
  primary.addEventListener("click", () => setRoute("request-qualification-review"));
  update();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestQualificationContact() {
  const template = document.querySelector("#request-qualification-contact-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountNativePageChrome("request-support", { title: "Request qualification service", backRoute: "request-qualification-details" });
  mountTicketStepViewer(3, { labels: ["Select instrument(s)", "Add request details", "Confirm contact information", "Review and submit"], ariaLabel: "Qualification service request progress" });
  mountNativeFlowActionBar({ backRoute: "request-qualification-details" });
  wireRequestQualificationContact();
  document.title = "Request qualification service — confirm contact information";
}

function renderRequestQualificationReview() {
  const template = document.querySelector("#request-qualification-review-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountNativePageChrome("request-support", { title: "Request qualification service", backRoute: "request-qualification-contact" });
  mountTicketStepViewer(4, { labels: ["Select instrument(s)", "Add request details", "Confirm contact information", "Review and submit"], ariaLabel: "Qualification service request progress" });
  const actionBar = mountNativeFlowActionBar({ backRoute: "request-qualification-contact", primaryDisabled: false });
  actionBar.querySelector('[data-actionbar-action="primary"]').textContent = "Submit";
  const contact = qualificationRequestDraft.contact;
  const formatQualificationServiceAddress = () => {
    const street = [contact.serviceAddress, contact.additionalAddress].filter(Boolean).join(", ");
    const locality = [contact.city, contact.state, contact.country, contact.postalCode ? `CP: ${contact.postalCode}` : ""].filter(Boolean).join(", ");
    return [street, locality].filter(Boolean).join("\n") || "—";
  };
  app.querySelector("[data-qualification-review-details]").textContent = qualificationRequestDraft.additionalDetails || "—";
  app.querySelector("[data-qualification-review-name]").textContent = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || "—";
  ["phone", "email", "company"].forEach((key) => {
    const output = app.querySelector(`[data-qualification-review-contact="${key}"]`);
    if (output) output.textContent = contact[key] || "—";
  });
  app.querySelector("[data-qualification-review-service-address]").textContent = formatQualificationServiceAddress();
  const selectedPanel = app.querySelector("[data-qualification-selected-panel]");
  renderQualificationSelectedInstruments(selectedPanel);
  wireQualificationInstrumentDisclosure(app.querySelector("[data-qualification-selected-toggle]"), selectedPanel);
  actionBar.querySelector('[data-actionbar-action="primary"]').addEventListener("click", () => setRoute("qualification-summary"));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = "Request qualification service — review and submit";
}

function renderQualificationSummary() {
  const template = document.querySelector("#qualification-summary-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountNativePageChrome("request-support", { title: "Request qualification service", backRoute: "request-support" });
  const contact = qualificationRequestDraft.contact;
  const serviceAddress = [
    [contact.serviceAddress, contact.additionalAddress].filter(Boolean).join(", "),
    [contact.city, contact.state, contact.country, contact.postalCode ? `CP: ${contact.postalCode}` : ""].filter(Boolean).join(", "),
  ].filter(Boolean).join("\n") || "—";
  app.querySelector("[data-qualification-summary-details]").textContent = qualificationRequestDraft.additionalDetails || "—";
  app.querySelector("[data-qualification-summary-name]").textContent = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || "—";
  app.querySelector("[data-qualification-summary-service-address]").textContent = serviceAddress;
  const contactValues = {
    phone: contact.phone || "—",
    email: contact.email || "—",
    company: contact.company || "—",
  };
  Object.entries(contactValues).forEach(([key, value]) => {
    app.querySelector(`[data-qualification-summary-contact="${key}"]`).textContent = value;
  });
  const selectedPanel = app.querySelector("[data-qualification-selected-panel]");
  renderQualificationSelectedInstruments(selectedPanel);
  wireQualificationInstrumentDisclosure(app.querySelector("[data-qualification-selected-toggle]"), selectedPanel);
  const closeBar = window.PlatformActionBar?.mount(app.querySelector("[data-platform-action-bar-mount]"), { closeOnly: true, closeRoute: "request-support" });
  closeBar?.classList.add("platform-actionbar--native-flow", "platform-actionbar--submitted-summary");
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = "Request qualification service — submitted";
}

function wireRequestCalibration() {
  const continueButton = app.querySelector('[data-actionbar-action="primary"]');
  const search = app.querySelector("[data-cal-search]");
  const selectAll = app.querySelector("[data-calibration-select-all]");
  const tableSelectAll = app.querySelector("[data-calibration-select-all-table]");
  const instruments = [...app.querySelectorAll("[data-cal-instrument]")];
  const updateSelection = () => {
    const selected = instruments.filter((input) => input.checked).length;
    tableSelectAll.checked = selected > 0 && selected === instruments.length;
    tableSelectAll.indeterminate = selected > 0 && selected < instruments.length;
    selectAll.setAttribute("aria-pressed", String(tableSelectAll.checked));
    continueButton.disabled = selected === 0;
  };
  selectAll.addEventListener("click", () => {
    const checked = !tableSelectAll.checked;
    instruments.forEach((input) => { input.checked = checked; });
    updateSelection();
  });
  tableSelectAll.addEventListener("change", () => {
    instruments.forEach((input) => { input.checked = tableSelectAll.checked; });
    updateSelection();
  });
  instruments.forEach((input) => input.addEventListener("change", updateSelection));
  const rows = [...app.querySelectorAll("[data-cal-row]")];
  const appliedFilters = app.querySelector("[data-calibration-applied-filters]");
  const appliedBadges = app.querySelector("[data-calibration-applied-badges]");
  const clearFilters = app.querySelector("[data-calibration-clear-filters]");
  rows.forEach((row) => {
    const cells = row.cells;
    row.dataset.group = cells[4].textContent.trim() || "—";
    row.dataset.type = cells[5].textContent.trim() || "—";
    row.dataset.model = cells[6].textContent.trim() || "—";
    row.dataset.coverage = cells[7].textContent.trim() || "—";
  });
  const filters = [["group", "Groups"], ["type", "Type"], ["model", "Catalog no."], ["coverage", "Coverage"]].map(([key, label]) => {
    const host = document.createElement("div");
    appliedBadges.append(host);
    const controlHost = app.querySelector(`[data-calibration-filter-host="${key}"]`);
    const options = [...new Set(rows.map((row) => row.dataset[key]).filter((value) => value && value !== "—"))];
    return { key, filter: new window.MultiSelectFilter(host, { label, options: options.length ? options : ["—"], controlHost, menuStyle: "figma-column" }) };
  });
  const filterRows = () => {
    const query = search.value.trim().toLowerCase();
    rows.forEach((row) => {
      const matchesFilters = filters.every(({ key, filter }) => !filter.values.length || filter.values.includes(row.dataset[key]));
      row.hidden = (Boolean(query) && !row.dataset.search.includes(query)) || !matchesFilters;
    });
  };
  const updateAppliedFilters = () => {
    const active = filters.some(({ filter }) => filter.values.length);
    appliedFilters.hidden = !active;
    clearFilters.hidden = !active;
  };
  filters.forEach(({ filter }) => filter.host.addEventListener("multiselect-filter-change", () => { filterRows(); updateAppliedFilters(); }));
  clearFilters.addEventListener("click", () => { filters.forEach(({ filter }) => filter.clear()); updateAppliedFilters(); });
  search.addEventListener("input", () => {
    filterRows();
  });
  const pageSizeButton = app.querySelector("[data-calibration-page-size]");
  const pageSizeMenu = app.querySelector("[data-calibration-page-size-menu]");
  const closePageSizeMenu = () => {
    pageSizeMenu.hidden = true;
    pageSizeButton.setAttribute("aria-expanded", "false");
  };
  pageSizeButton.addEventListener("click", () => {
    pageSizeMenu.hidden = !pageSizeMenu.hidden;
    pageSizeButton.setAttribute("aria-expanded", String(!pageSizeMenu.hidden));
  });
  pageSizeMenu.querySelectorAll("[data-calibration-page-size-option]").forEach((option) => option.addEventListener("click", () => {
    const caret = pageSizeButton.querySelector("img");
    pageSizeButton.replaceChildren(document.createTextNode(`${option.dataset.calibrationPageSizeOption} `), caret);
    pageSizeMenu.querySelectorAll("[data-calibration-page-size-option]").forEach((item) => item.setAttribute("aria-selected", String(item === option)));
    closePageSizeMenu();
  }));
  document.addEventListener("mousedown", (event) => {
    if (!event.target.closest(".iss-page-size-control")) closePageSizeMenu();
  });
  continueButton.addEventListener("click", () => {
    calibrationRequestDraft.instruments = instruments.filter((input) => input.checked).map((input) => {
      const cells = input.closest("tr").cells;
      return { serial: cells[2].textContent.trim(), nickname: cells[3].textContent.trim(), image: "assets/instruments/vanquish-detector.png" };
    });
    setRoute("request-calibration-details");
  });
  app.querySelectorAll("[data-cal-filter], [data-cal-instrument-link]").forEach((button) => button.addEventListener("click", () => showToast("Instrument details opened")));
  updateSelection();
  filterRows();
  updateAppliedFilters();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function prepareCalibrationStepOne() {
  const selectAll = app.querySelector(".pm-select-all");
  selectAll.outerHTML = '<button class="pm-select-all qualification-select-all" type="button" data-calibration-select-all aria-pressed="false">Select all 30 instruments</button>';
  const applied = document.createElement("div");
  applied.className = "sh-applied-filters iss-applied-filters";
  applied.dataset.calibrationAppliedFilters = "";
  applied.hidden = true;
  applied.innerHTML = '<div class="iss-applied-filters__badges" data-calibration-applied-badges></div><button class="sh-clear-filters" type="button" data-calibration-clear-filters hidden>Clear filter(s)</button>';
  app.querySelector("[data-calibration-select-all]").after(applied);
  const tableWrap = app.querySelector(".cal-table-wrap");
  tableWrap.className = "iss-table-wrap calibration-table-wrap";
  const table = tableWrap.querySelector(".cal-table");
  table.className = "iss-table calibration-table";
  const columns = table.querySelector("colgroup");
  columns.replaceChildren(...["iss-col-radio", "iss-col-image", "iss-col-serial", "iss-col-nickname", "iss-col-groups", "iss-col-type", "iss-col-model", "iss-col-coverage"].map((className) => {
    const column = document.createElement("col");
    column.className = className;
    return column;
  }));
  table.tHead.rows[0].insertCell(1).innerHTML = '<span class="sr-only">Instrument image</span>';
  [...table.tBodies[0].rows].forEach((row) => {
    const imageCell = row.insertCell(1);
    imageCell.innerHTML = '<img data-calibration-instrument-image src="assets/instruments/vanquish-detector.png" alt="" />';
  });
  table.tHead.rows[0].cells[0].innerHTML = '<input type="checkbox" data-calibration-select-all-table aria-label="Select all instruments" />';
  [["group", "Groups"], ["type", "Type"], ["model", "Catalog no."], ["coverage", "Coverage"]].forEach(([key, label], index) => {
    table.tHead.rows[0].cells[index + 4].innerHTML = `<div data-calibration-filter-host="${key}" aria-label="${label} filter"></div>`;
  });
  const pagination = app.querySelector(".pm-pagination");
  pagination.className = "iss-pagination calibration-pagination";
  const pageSize = pagination.querySelector(".pm-page-size");
  pageSize.className = "iss-page-size";
  pageSize.dataset.calibrationPageSize = "";
  pageSize.setAttribute("aria-expanded", "false");
  const pageSizeControl = document.createElement("span");
  pageSizeControl.className = "iss-page-size-control";
  pageSize.replaceWith(pageSizeControl);
  pageSizeControl.append(pageSize);
  const pageSizeMenu = document.createElement("div");
  pageSizeMenu.className = "iss-page-size-menu";
  pageSizeMenu.dataset.calibrationPageSizeMenu = "";
  pageSizeMenu.hidden = true;
  pageSizeMenu.innerHTML = [10, 20, 30, 40, 50].map((value) => `<button type="button" data-calibration-page-size-option="${value}" aria-selected="${value === 20}">${value}</button>`).join("");
  pageSizeControl.append(pageSizeMenu);
  pagination.querySelectorAll(".pm-page-arrow").forEach((button) => { button.className = "iss-page-arrow"; });
  pagination.querySelectorAll(".pm-page-number").forEach((button) => { button.className = button.classList.contains("is-current") ? "iss-page-number is-current" : "iss-page-number"; });
  pagination.querySelector("strong").className = "iss-results-total";
  pagination.querySelector("span:last-of-type").className = "iss-go-to";
}

function renderRequestCalibration() {
  const template = document.querySelector("#request-calibration-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountNativePageChrome("request-support", { title: "Request a calibration service", backRoute: "request-support" });
  const legacySteps = app.querySelector(".cal-steps");
  const stepMount = document.createElement("div");
  stepMount.dataset.ticketStepViewer = "";
  legacySteps.replaceWith(stepMount);
  mountTicketStepViewer(1, { labels: ["Select instrument(s)", "Add request details", "Confirm contact information", "Review and submit"], ariaLabel: "Calibration service request progress" });
  prepareCalibrationStepOne();
  mountNativeFlowActionBar();
  wireRequestCalibration();
  document.title = "Request a calibration service — Services Central";
}

function renderCalibrationSelectedInstruments(host) {
  const table = document.createElement("table");
  table.className = "qualification-selected-table";
  table.innerHTML = '<colgroup><col class="qualification-selected-table__image" /><col /><col /></colgroup><thead><tr><th></th><th>Serial number</th><th>Nickname</th></tr></thead>';
  const body = document.createElement("tbody");
  calibrationRequestDraft.instruments.forEach((instrument) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td><img src="${instrument.image}" alt="" /></td><td>${instrument.serial}</td><td>${instrument.nickname}</td>`;
    body.append(row);
  });
  table.append(body);
  host.replaceChildren(table);
}

function mountCalibrationFlowTemplate(templateId, screenClass, currentStep, backRoute, primaryDisabled = true) {
  const template = document.querySelector(templateId);
  app.replaceChildren(template.content.cloneNode(true));
  const screen = app.querySelector(".screen");
  screen.classList.add(screenClass);
  screen.setAttribute("aria-label", `Request a calibration service: step ${currentStep}`);
  app.querySelector(".iss-titlebar h1").textContent = "Request a calibration service";
  mountNativePageChrome("request-support", { title: "Request a calibration service", backRoute });
  mountTicketStepViewer(currentStep, { labels: ["Select instrument(s)", "Add request details", "Confirm contact information", "Review and submit"], ariaLabel: "Calibration service request progress" });
  return mountNativeFlowActionBar({ backRoute, primaryDisabled });
}

function wireCalibrationDetails() {
  const textarea = app.querySelector("[data-qualification-details]");
  const primary = app.querySelector('[data-actionbar-action="primary"]');
  const selectedPanel = app.querySelector("[data-qualification-selected-panel]");
  const requestDetailsCard = app.querySelector(".qualification-flow-card");
  app.querySelector(".qualification-flow-card header p").textContent = "Please provide any additional details you would like to share with us about your calibration request.";
  textarea.placeholder = "Provide additional details about your calibration service request.";
  const needs = document.createElement("article");
  needs.className = "calibration-service-needs";
  needs.innerHTML = `<header><h2>Calibration service needs</h2><p>Please answer the question(s) below to identify the calibration service needed.</p></header>
    <div class="calibration-service-needs__options">
      <fieldset><legend>What is your calibration service level?<b>*</b></legend><div class="calibration-service-needs__choices">
        <label><input type="radio" name="calibration-service-level" value="ISO 17025 - certification with uncertainties" data-calibration-service-level />ISO 17025 - certification with uncertainties</label>
        <label><input type="radio" name="calibration-service-level" value="ISO 9001 - certification with pass/fail" data-calibration-service-level />ISO 9001 - certification with pass/fail</label>
        <label><input type="radio" name="calibration-service-level" value="Unknown" data-calibration-service-level />Unknown</label>
      </div></fieldset>
      <fieldset><legend>What is your desired calibration interval?<b>*</b></legend><div class="calibration-service-needs__choices calibration-service-needs__choices--interval">
        <label><input type="radio" name="calibration-interval" value="3 months" data-calibration-interval />3 months</label>
        <label><input type="radio" name="calibration-interval" value="No interval" data-calibration-interval />No interval</label>
        <label><input type="radio" name="calibration-interval" value="6 months" data-calibration-interval />6 months</label>
        <label><input type="radio" name="calibration-interval" value="Unknown" data-calibration-interval />Unknown</label>
        <label><input type="radio" name="calibration-interval" value="12 months" data-calibration-interval />12 months</label>
      </div></fieldset>
    </div>`;
  requestDetailsCard.after(needs);
  const serviceLevels = [...needs.querySelectorAll("[data-calibration-service-level]")];
  const intervals = [...needs.querySelectorAll("[data-calibration-interval]")];
  serviceLevels.find((input) => input.value === calibrationRequestDraft.serviceNeeds.level)?.setAttribute("checked", "");
  intervals.find((input) => input.value === calibrationRequestDraft.serviceNeeds.interval)?.setAttribute("checked", "");
  renderCalibrationSelectedInstruments(selectedPanel);
  wireQualificationInstrumentDisclosure(app.querySelector("[data-qualification-selected-toggle]"), selectedPanel);
  textarea.value = calibrationRequestDraft.additionalDetails;
  const update = () => {
    calibrationRequestDraft.additionalDetails = textarea.value;
    calibrationRequestDraft.serviceNeeds.level = serviceLevels.find((input) => input.checked)?.value || "";
    calibrationRequestDraft.serviceNeeds.interval = intervals.find((input) => input.checked)?.value || "";
    primary.disabled = !textarea.value.trim() || !calibrationRequestDraft.serviceNeeds.level || !calibrationRequestDraft.serviceNeeds.interval;
  };
  textarea.addEventListener("input", update);
  [...serviceLevels, ...intervals].forEach((input) => input.addEventListener("change", update));
  primary.addEventListener("click", () => setRoute("request-calibration-contact"));
  update();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestCalibrationDetails() {
  mountCalibrationFlowTemplate("#request-qualification-details-template", "screen--request-calibration-details", 2, "request-calibration");
  wireCalibrationDetails();
  document.title = "Request a calibration service — add request details";
}

class KomodoSingleSelect {
  constructor(select) {
    this.select = select;
    this.host = document.createElement("div");
    this.host.className = "komodo-single-select";
    this.button = document.createElement("button");
    this.button.className = "komodo-single-select__trigger";
    this.button.type = "button";
    this.button.setAttribute("aria-haspopup", "listbox");
    this.button.setAttribute("aria-expanded", "false");
    this.menu = document.createElement("div");
    this.menu.className = "komodo-single-select__menu";
    this.menu.setAttribute("role", "listbox");
    this.menu.hidden = true;
    select.classList.add("komodo-single-select__native");
    select.after(this.host);
    this.host.append(this.button, this.menu);
    this.button.addEventListener("click", () => this.setOpen(this.menu.hidden));
    this.button.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        this.setOpen(true);
        const options = this.menu.querySelectorAll("button");
        options[event.key === "ArrowDown" ? 0 : options.length - 1]?.focus();
      }
    });
    this.menu.addEventListener("keydown", (event) => {
      const options = [...this.menu.querySelectorAll("button")];
      const current = options.indexOf(document.activeElement);
      if (event.key === "Escape") { this.setOpen(false); this.button.focus(); }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        options[(current + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length]?.focus();
      }
    });
    this.select.addEventListener("change", () => this.refresh());
    document.addEventListener("click", (event) => { if (!this.host.contains(event.target)) this.setOpen(false); });
    this.refresh();
  }

  refresh() {
    const selected = this.select.options[this.select.selectedIndex];
    this.button.replaceChildren(document.createTextNode(selected?.textContent || "Please select"), Object.assign(document.createElement("img"), { src: "assets/icons/directions/caret down/Down caret.svg", alt: "" }));
    this.menu.replaceChildren(...[...this.select.options].map((option) => {
      const choice = document.createElement("button");
      choice.type = "button";
      choice.setAttribute("role", "option");
      choice.setAttribute("aria-selected", String(option.selected));
      choice.append(document.createTextNode(option.textContent));
      choice.addEventListener("click", () => {
        this.select.value = option.value;
        this.select.dispatchEvent(new Event("change", { bubbles: true }));
        this.setOpen(false);
        this.button.focus();
      });
      return choice;
    }));
  }

  setOpen(open) {
    this.menu.hidden = !open;
    this.button.setAttribute("aria-expanded", String(open));
  }
}

function wireCalibrationContact() {
  const defaults = { firstName: "Molly", lastName: "Hartman", phone: "555-555-5555", email: "molly.hartman@thermofisher.com", country: "USA", state: "California", city: "Carlsbad", postalCode: "93047" };
  const fields = [...app.querySelectorAll("[data-qualification-contact-field]")];
  const primary = app.querySelector('[data-actionbar-action="primary"]');
  const country = fields.find((field) => field.dataset.qualificationContactField === "country");
  const state = fields.find((field) => field.dataset.qualificationContactField === "state");
  const update = () => {
    fields.forEach((field) => { calibrationRequestDraft.contact[field.dataset.qualificationContactField] = field.value; });
    primary.disabled = !fields.filter((field) => field.required).every((field) => field.validity.valid && field.value.trim());
  };
  country.replaceChildren(...CALIBRATION_SUPPORTED_COUNTRIES.map((value) => new Option(value, value)));
  let countryDropdown;
  let stateDropdown;
  const updateStates = () => {
    const options = country.value === "USA" ? CALIBRATION_US_STATES : country.value === "Canada" ? CALIBRATION_CANADIAN_PROVINCES : ["Not applicable"];
    const previous = calibrationRequestDraft.contact.state || state.value;
    state.replaceChildren(...options.map((value) => new Option(value, value)));
    state.value = options.includes(previous) ? previous : options.includes(defaults.state) ? defaults.state : options[0];
    stateDropdown?.refresh();
    update();
  };
  fields.forEach((field) => {
    field.value = calibrationRequestDraft.contact[field.dataset.qualificationContactField] || defaults[field.dataset.qualificationContactField] || field.value;
    field.addEventListener("input", () => { if (field.dataset.qualificationContactField === "phone") field.value = field.value.replace(/[^0-9 -]/g, ""); update(); });
    field.addEventListener("change", update);
  });
  country.addEventListener("change", updateStates);
  updateStates();
  countryDropdown = new KomodoSingleSelect(country);
  stateDropdown = new KomodoSingleSelect(state);
  stateDropdown.refresh();
  primary.addEventListener("click", () => setRoute("request-calibration-review"));
  update();
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderRequestCalibrationContact() {
  mountCalibrationFlowTemplate("#request-qualification-contact-template", "screen--request-calibration-contact", 3, "request-calibration-details");
  wireCalibrationContact();
  document.title = "Request a calibration service — confirm contact information";
}

function calibrationServiceAddress() {
  const contact = calibrationRequestDraft.contact;
  return [[contact.serviceAddress, contact.additionalAddress].filter(Boolean).join(", "), [contact.city, contact.state, contact.country, contact.postalCode ? `CP: ${contact.postalCode}` : ""].filter(Boolean).join(", ")].filter(Boolean).join("\n") || "—";
}

function fillCalibrationReview(scope, prefix) {
  const contact = calibrationRequestDraft.contact;
  scope.querySelector(`[data-${prefix}-details]`).textContent = calibrationRequestDraft.additionalDetails || "—";
  scope.querySelector(`[data-${prefix}-name]`).textContent = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || "—";
  scope.querySelector(`[data-${prefix}-service-address]`).textContent = calibrationServiceAddress();
  const values = { phone: contact.phone || "—", email: contact.email || "—", company: contact.company || "—" };
  Object.entries(values).forEach(([key, value]) => {
    const output = scope.querySelector(`[data-${prefix}-contact="${key}"]`);
    if (output) output.textContent = value;
  });
}

function insertCalibrationReviewServiceNeeds(scope) {
  const contactCard = scope.querySelector(".qualification-review-card + .qualification-review-card");
  const needsCard = document.createElement("article");
  needsCard.className = "qualification-flow-card qualification-review-card calibration-review-service-needs";
  needsCard.innerHTML = `<h2>Calibration service needs</h2><dl class="qualification-review-details calibration-review-details--needs"><div><dt>Calibration service level</dt><dd data-calibration-review-service-level></dd></div><div><dt>Calibration interval</dt><dd data-calibration-review-interval></dd></div></dl>`;
  needsCard.querySelector("[data-calibration-review-service-level]").textContent = calibrationRequestDraft.serviceNeeds.level || "—";
  needsCard.querySelector("[data-calibration-review-interval]").textContent = calibrationRequestDraft.serviceNeeds.interval || "—";
  contactCard.before(needsCard);
}

function insertCalibrationSummaryServiceNeeds(scope) {
  const contactCard = scope.querySelector(".qualification-summary-card + .qualification-summary-card");
  const needsCard = document.createElement("article");
  needsCard.className = "qualification-flow-card qualification-summary-card calibration-review-service-needs";
  needsCard.innerHTML = `<h2>Calibration service needs</h2><dl class="qualification-review-details calibration-review-details--needs"><div><dt>Calibration service level</dt><dd data-calibration-summary-service-level></dd></div><div><dt>Calibration interval</dt><dd data-calibration-summary-interval></dd></div></dl>`;
  needsCard.querySelector("[data-calibration-summary-service-level]").textContent = calibrationRequestDraft.serviceNeeds.level || "—";
  needsCard.querySelector("[data-calibration-summary-interval]").textContent = calibrationRequestDraft.serviceNeeds.interval || "—";
  contactCard.before(needsCard);
}

function renderRequestCalibrationReview() {
  const actionBar = mountCalibrationFlowTemplate("#request-qualification-review-template", "screen--request-calibration-review", 4, "request-calibration-contact", false);
  actionBar.querySelector('[data-actionbar-action="primary"]').textContent = "Submit";
  fillCalibrationReview(app, "qualification-review");
  insertCalibrationReviewServiceNeeds(app);
  const selectedPanel = app.querySelector("[data-qualification-selected-panel]");
  renderCalibrationSelectedInstruments(selectedPanel);
  wireQualificationInstrumentDisclosure(app.querySelector("[data-qualification-selected-toggle]"), selectedPanel);
  actionBar.querySelector('[data-actionbar-action="primary"]').addEventListener("click", () => setRoute("calibration-summary"));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = "Request a calibration service — review and submit";
}

function renderCalibrationSummary() {
  const template = document.querySelector("#qualification-summary-template");
  app.replaceChildren(template.content.cloneNode(true));
  app.querySelector(".screen").classList.add("screen--calibration-summary");
  app.querySelector(".iss-titlebar h1").textContent = "Request calibration service";
  mountNativePageChrome("request-support", { title: "Request calibration service", backRoute: "request-support" });
  fillCalibrationReview(app, "qualification-summary");
  insertCalibrationSummaryServiceNeeds(app);
  const selectedPanel = app.querySelector("[data-qualification-selected-panel]");
  renderCalibrationSelectedInstruments(selectedPanel);
  wireQualificationInstrumentDisclosure(app.querySelector("[data-qualification-selected-toggle]"), selectedPanel);
  const closeBar = window.PlatformActionBar?.mount(app.querySelector("[data-platform-action-bar-mount]"), { closeOnly: true, closeRoute: "request-support" });
  closeBar?.classList.add("platform-actionbar--native-flow", "platform-actionbar--submitted-summary");
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = "Request a calibration service — submitted";
}

function wireRequestInstallation() {
  const service = app.querySelector("[data-installation-service]");
  const type = app.querySelector("[data-installation-type]");
  const details = app.querySelector("[data-installation-details]");
  const continueButton = app.querySelector('[data-actionbar-action="primary"]');
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
  mountNativePageChrome("request-support", { title: "Installation support", backRoute: "request-support" });
  mountNativeFlowActionBar();
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
  app.querySelectorAll("[data-splan-select-all]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const group = event.currentTarget.closest("[data-splan-group]");
      const checks = [...(group || app).querySelectorAll("[data-splan-check]")];
      const select = checks.some((check) => !check.checked);
      const total = event.currentTarget.dataset.splanSelectTotal || checks.length;
      checks.forEach((check) => { check.checked = select; });
      event.currentTarget.textContent = select ? "Clear selection" : `Select all ${total} instruments`;
    });
  });
  app.querySelectorAll("[data-splan-action]").forEach((button) => {
    button.addEventListener("click", () => showToast(`${button.dataset.splanAction} selected`));
  });
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function applyServicePlanApprovalState() {
  const top = app.querySelector(".splan-top");
  const contactGrid = app.querySelector(".splan-contact-grid");
  if (!top || !contactGrid) return;
  contactGrid.querySelectorAll(".splan-card").forEach((card, index) => {
    if (index > 0) card.remove();
  });
  const banner = document.createElement("section");
  banner.className = "splan-approval-banner";
  banner.setAttribute("aria-labelledby", "splan-approval-banner-title");
  banner.innerHTML = `<div class="splan-approval-banner__content"><img src="assets/service-plan/contact-confirmation.svg" alt="" /><div><h2 id="splan-approval-banner-title">Confirm you are the service plan contact</h2><p>Your colleague recommended you as the service plan contact for certain instrument(s). Please click the button to review and confirm.<br />If you become the service plan contact, you will receive communications regarding your service plan updates and renewals.</p></div></div><button type="button" data-service-plan-review>Review and confirm</button>`;
  top.after(banner);
}

function closeServicePlanApprovalDialogs() {
  if (servicePlanApprovalDialog?.open) servicePlanApprovalDialog.close();
  if (servicePlanDeclineDialog?.open) servicePlanDeclineDialog.close();
}

function resolveServicePlanApproval({ accepted = false } = {}) {
  servicePlanApprovalPending = false;
  servicePlanApprovalAcceptedNotice = accepted;
  closeServicePlanApprovalDialogs();
  renderServicePlanContacts();
  if (accepted) showToast("You are now the service plan contact.", { title: "Success:", variant: "success", duration: 5000 });
}

function applyServicePlanApprovalSuccessState() {
  const content = app.querySelector(".splan-content");
  if (!content) return;
  const notice = document.createElement("section");
  notice.className = "splan-approval-success";
  notice.setAttribute("role", "status");
  notice.innerHTML = `<div class="splan-approval-success__content"><img src="assets/icons/notifications/info/size=24px, style=bold.svg" alt="" /><p><strong>Note:</strong> XX instrument(s) added to My Instruments. In addition to service plan notifications, you will receive automated Services Central notifications for the instrument(s). <button type="button" data-route="notifications">Manage automated notifications</button><img src="assets/icons/navigation/bell settings/size=24px, style=mono.svg" alt="" /></p></div><button type="button" data-service-plan-success-close aria-label="Close notification"><img src="assets/icons/actions/close/size=24px, style=mono.svg" alt="" /></button>`;
  content.prepend(notice);
}

function wireServicePlanApprovalSuccessState() {
  app.querySelector("[data-service-plan-success-close]")?.addEventListener("click", () => {
    servicePlanApprovalAcceptedNotice = false;
    app.querySelector(".splan-approval-success")?.remove();
  });
}

function wireServicePlanApprovalState() {
  if (!servicePlanApprovalPending || !servicePlanApprovalDialog || !servicePlanDeclineDialog) return;
  const openApproval = () => {
    if (servicePlanDeclineDialog.open) servicePlanDeclineDialog.close();
    if (!servicePlanApprovalDialog.open) servicePlanApprovalDialog.showModal();
  };
  app.querySelector("[data-service-plan-review]")?.addEventListener("click", openApproval);
  servicePlanApprovalDialog.querySelectorAll("[data-service-plan-approval-close]").forEach((button) => button.onclick = () => servicePlanApprovalDialog.close());
  servicePlanApprovalDialog.querySelector("[data-service-plan-accept]").onclick = () => resolveServicePlanApproval({ accepted: true });
  servicePlanApprovalDialog.querySelector("[data-service-plan-decline]").onclick = () => {
    servicePlanApprovalDialog.close();
    servicePlanDeclineDialog.showModal();
  };
  servicePlanDeclineDialog.querySelectorAll("[data-service-plan-decline-cancel]").forEach((button) => button.onclick = () => {
    servicePlanDeclineDialog.close();
    openApproval();
  });
  servicePlanDeclineDialog.querySelector("[data-service-plan-decline-confirm]").onclick = () => resolveServicePlanApproval();
  if (!servicePlanApprovalPromptShown) {
    servicePlanApprovalPromptShown = true;
    openApproval();
  }
}

function renderServicePlanContacts() {
  const template = document.querySelector("#service-plan-contacts-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountTopbarSc();
  mountPlatformSidebar("service-plan-contacts");
  mountFooter();
  if (shouldShowAccountEmptyState()) applyServicePlanContactsZeroState();
  else if (new URL(window.location.href).searchParams.get("contacts") === "empty") applyServicePlanContactsZeroState({ contactsAvailable: true });
  else if (servicePlanApprovalPending) applyServicePlanApprovalState();
  else if (servicePlanApprovalAcceptedNotice) applyServicePlanApprovalSuccessState();
  wireServicePlanContacts();
  wireServicePlanApprovalState();
  wireServicePlanApprovalSuccessState();
  document.title = "Service plan contacts — Services Central";
}

function wireContactPage() {
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("service-plan-contacts"));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderContactPage() {
  const template = document.querySelector("#contact-page-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountTopbarSc();
  mountPlatformSidebar("service-plan-contacts");
  mountFooter();
  wireContactPage();
  document.title = "Sebastien Martin — Service plan contacts";
}

function createConsumablesSupportPortalPreference() {
  const label = document.createElement("label");
  label.className = "consumables-support-modal__check";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.dataset.consumablesSupportPortalDontShow = "";

  const text = document.createElement("span");
  text.textContent = "Don't show this again";

  label.append(checkbox, text);
  return label;
}

function createConsumablesSupportPortalDialog() {
  const dialog = window.PlatformModal?.mount('[data-modal-mount="launching-consumables-support-portal"]', {
    id: "launching-consumables-support-portal",
    title: "Launching Consumables Support Portal",
    description: "The consumables support portal is separate from Services Central with separate login credentials. A new page will be launched where you will be required to login.",
    size: "sm",
    className: "consumables-support-modal",
    bodyClassName: "consumables-support-modal__body",
    footerClassName: "consumables-support-modal__footer",
    closeButton: false,
    closeOnBackdrop: false,
    actions: [
      {
        label: "Got it",
        variant: "primary",
        action: "launch-consumables-support-portal",
      },
    ],
  });

  if (!dialog) return undefined;

  dialog.querySelector(".modal__footer")?.prepend(createConsumablesSupportPortalPreference());
  dialog.addEventListener("cancel", (event) => event.preventDefault());
  dialog.addEventListener("modal:action", (event) => {
    if (event.detail.action !== "launch-consumables-support-portal") return;
    window.PlatformModal.close(dialog);
    window.open(CONSUMABLES_SUPPORT_PORTAL_IMAGE, "_blank", "noopener,noreferrer");
  });

  return dialog;
}

function wireConsumables(consumablesSupportPortalDialog) {
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  app.querySelectorAll("[data-open-consumables-support-portal]").forEach((button) => {
    button.addEventListener("click", () => window.PlatformModal?.open(consumablesSupportPortalDialog));
  });
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
}

function renderConsumables() {
  const template = document.querySelector("#consumables-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  if (isEuropeLePrototype()) {
    app.querySelector(".screen--consumables")?.classList.add("cons--europe-le");
    app.querySelector(".cons-columns")?.remove();
  }
  mountTopbarSc();
  mountPlatformSidebar("consumables");
  mountFooter();
  const consumablesSupportPortalDialog = createConsumablesSupportPortalDialog();
  wireConsumables(consumablesSupportPortalDialog);
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
  mountTopbarNotifications();
  mountFooter();
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

const NO_CHECKLIST_ORDER_NUMBER = "4827316059";
const NO_CHECKLIST_ORDER_ITEM_INDEXES = [0, 2, 4, 6];
const NO_CHECKLIST_ORDER_ITEMS = NO_CHECKLIST_ORDER_ITEM_INDEXES.map((index) => INSTALLATION_ITEMS[index]);
const NO_CHECKLIST_ORDER_SCHEDULE_DETAILS = [
  { date: "18 Aug 2025", engineer: "Charles MacDonald" },
  { date: "18 Aug 2025", engineer: "Charles MacDonald" },
  { date: "20 Aug 2025", engineer: "Wade Wilson" },
  { date: "20 Aug 2025", engineer: "Wade Wilson" },
];

const INSTALLATION_SCHEDULE_DETAILS = {
  0: { date: "18 Aug 2025", engineer: "Charles MacDonald" },
  1: { date: "18 Aug 2025", engineer: "Charles MacDonald" },
  6: { date: "20 Aug 2025", engineer: "Wade Wilson" },
  9: { date: "20 Aug 2025", engineer: "Wade Wilson" },
};

const WHITE_GLOVE_ORDERS = [
  { number: "1901126245", orderedDate: "26 Jun 2025" },
];

function getWhiteGloveItemStatus(orderNumber, status, index) {
  if (!Object.hasOwn(INSTALLATION_SCHEDULE_DETAILS, index) || status === "default") return "—";
  return status === "scheduled" ? "Install scheduled" : "Install complete";
}

function createWhiteGloveItemRow(orderNumber, status, itemData, index) {
  const [item, qty, image, catalog, name] = itemData;
  const itemStatus = getWhiteGloveItemStatus(orderNumber, status, index);
  const schedule = itemStatus === "Install scheduled" || itemStatus === "Install complete"
    ? INSTALLATION_SCHEDULE_DETAILS[index]
    : null;
  const row = document.createElement("tr");
  row.innerHTML = `<td>${item}</td><td>${qty}</td><td><img src="assets/instruments/${image}" alt="" /></td><td>${catalog}</td><td title="${name}">${name}</td><td class="ins-status-cell" data-wg-item-status></td><td>${schedule?.date || "—"}</td><td>${schedule?.engineer || "—"}</td><td><button class="ins-view" type="button" data-wg-shell-index="${index}" data-wg-order-number="${orderNumber}" aria-label="View details for item ${item}, ${name}">View</button></td>`;
  const statusCell = row.querySelector("[data-wg-item-status]");
  if (itemStatus === "—") statusCell.textContent = "—";
  else statusCell.append(createInstallationItemStatus(itemStatus, index, `white-glove-${orderNumber}`));
  return row;
}

function renderWhiteGloveOrderState(order) {
  const orderNumber = order.dataset.wgOrderNumber;
  const state = whiteGloveOrderStates.get(orderNumber);
  const expanded = Boolean(state?.expanded);
  const status = state?.status || "default";
  order.classList.toggle("is-expanded", expanded);
  order.querySelector("[data-wg-toggle]").setAttribute("aria-expanded", String(expanded));
  order.querySelectorAll("[data-wg-expanded]").forEach((element) => { element.hidden = !expanded; });

  const note = order.querySelector("[data-wg-note]");
  const completeNotice = order.querySelector("[data-wg-complete]");
  note.hidden = status === "complete";
  completeNotice.hidden = status !== "complete";
  const statusButton = order.querySelector("[data-open-installation-status-scenarios]");
  statusButton.setAttribute("aria-label", `Status: ${status === "default" ? "not scheduled" : status}. Open status change modal`);

  const body = order.querySelector("[data-wg-items]");
  body.replaceChildren(...INSTALLATION_ITEMS.map((item, index) => createWhiteGloveItemRow(orderNumber, status, item, index)));
  order.querySelectorAll("[data-wg-shell-index]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.wgShellIndex);
    selectedInstallationShellContext = {
      index,
      orderNumber,
      status: getWhiteGloveItemStatus(orderNumber, status, index),
    };
    setRoute(`installation-shell-${index}`);
  }));
}

function createWhiteGloveOrder({ number, orderedDate }) {
  const order = document.createElement("article");
  const additionalItemsMarkup = `
        <button class="ins-additional" type="button" data-wg-additional-toggle aria-expanded="false" aria-controls="white-glove-additional-${number}"><img src="assets/icons/directions/chevron right/size=24px, style=mono.svg" alt="" /><span>Additional item(s) on your order</span><img src="assets/icons/notifications/info/size=16px, style=bold.svg" alt="" /></button>
        <div class="ins-additional-items" id="white-glove-additional-${number}" data-wg-additional-panel hidden><table><colgroup><col class="ins-col-item" /><col class="ins-col-qty" /><col class="ins-col-image" /><col class="ins-col-catalog" /><col class="ins-col-name" /><col class="ins-col-status" /><col class="ins-col-date" /><col class="ins-col-engineer" /><col class="ins-col-action" /></colgroup><tbody data-wg-additional-items></tbody></table></div>`;
  order.className = "ins-order ins-order--white-glove";
  order.dataset.wgOrderNumber = number;
  order.innerHTML = `
    <div class="wg-order-hero">
      <div class="wg-order-waves" aria-hidden="true"></div>
      <header class="wg-order-head">
        <button class="ins-order-toggle" type="button" data-wg-toggle aria-expanded="false" aria-controls="white-glove-details-${number}"><img class="ins-chevron" src="assets/icons/directions/chevron right/size=24px, style=mono.svg" alt="" /><span><strong>Order no.</strong> ${number}</span></button>
        <span class="wg-premium" data-white-glove-tooltip tabindex="0" aria-label="White Glove order"><img src="assets/icons/general/premium/size=24px, style=bold.svg" alt="" /></span>
        <button class="mi-button ins-activity" type="button" data-open-installation-activity data-order-number="${number}">Activity log</button>
      </header>
      <div class="wg-order-summary" data-wg-expanded hidden>
        <div class="ins-summary-box"><img src="assets/icons/features/calendar/size=16px, style=bold.svg" alt="" /><div><strong>Ordered date</strong><span>${orderedDate}</span></div></div>
        <div class="ins-summary-box ins-summary-box--users"><img src="assets/icons/users/profile/size=16px, style=bold.svg" alt="" /><div><strong>Order user(s) <img class="wg-inline-info" src="assets/icons/notifications/info/size=16px, style=bold.svg" alt="" /></strong><span>alexander.constantine@company...</span></div><em>+4</em></div>
        <div class="ins-summary-box ins-summary-box--support"><img src="assets/icons/general/premium/size=16px, style=mono.svg" alt="" /><div><strong>White glove support</strong><span>support_team_na@thermofisher.com</span></div><a href="mailto:support_team_na@thermofisher.com" aria-label="Email White Glove support"><img src="assets/icons/features/email/Size=16px, Style=Mono.svg" alt="" /></a></div>
      </div>
    </div>
    <div class="wg-order-body" id="white-glove-details-${number}" data-wg-expanded hidden>
      <aside class="wg-order-notice" data-wg-note><img src="assets/icons/notifications/info/size=24px, style=bold.svg" alt="" /><p><strong>Note:</strong> As this is a white glove order, our dedicated team will reach out to you directly. If you prefer, you’re also welcome to contact them using the information provided above.</p></aside>
      <aside class="ins-installation-complete-notice wg-order-complete" data-wg-complete hidden><img src="assets/icons/notifications/info/size=24px, style=bold.svg" alt="" /><div><strong>Installation complete</strong><p>Your installation is complete and the supported instrument(s)/system(s) will be available in the “My instruments” page of Services Central. Please note the order will disappear from the installation page upon your next login.</p><button class="mi-button" type="button" data-route="my-instruments">Go to My Instruments</button></div></aside>
      <div class="ins-items wg-order-items">
        <table><colgroup><col class="ins-col-item" /><col class="ins-col-qty" /><col class="ins-col-image" /><col class="ins-col-catalog" /><col class="ins-col-name" /><col class="ins-col-status" /><col class="ins-col-date" /><col class="ins-col-engineer" /><col class="ins-col-action" /></colgroup><thead><tr><th>Item <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Qty</th><th></th><th>Catalog no. <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Catalog name <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th><button type="button" data-open-installation-status-scenarios data-status-order="${number}" aria-haspopup="dialog">Status <img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button></th><th>Scheduled date <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Engineer assigned <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Action</th></tr></thead><tbody data-wg-items></tbody></table>
        ${additionalItemsMarkup}
      </div>
    </div>`;

  const additionalRows = order.querySelector("[data-wg-additional-items]");
  if (additionalRows) {
    ADDITIONAL_INSTALLATION_ITEMS.forEach(([item, qty, catalog, name]) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${item}</td><td>${qty}</td><td><span class="ins-no-image"><img src="assets/icons/media/image/size=16px, style=mono.svg" alt="" /></span></td><td>${catalog}</td><td title="${name}">${name}</td><td>—</td><td>—</td><td>—</td><td></td>`;
      additionalRows.append(row);
    });
  }
  order.querySelector("[data-wg-toggle]").addEventListener("click", () => {
    const state = whiteGloveOrderStates.get(number);
    state.expanded = !state.expanded;
    renderWhiteGloveOrderState(order);
  });
  order.querySelector("[data-wg-additional-toggle]")?.addEventListener("click", (event) => {
    const expanded = event.currentTarget.getAttribute("aria-expanded") !== "true";
    event.currentTarget.setAttribute("aria-expanded", String(expanded));
    event.currentTarget.classList.toggle("is-expanded", expanded);
    order.querySelector("[data-wg-additional-panel]").hidden = !expanded;
  });
  renderWhiteGloveOrderState(order);
  return order;
}

function renderWhiteGloveOrders() {
  const orders = app.querySelector(".ins-orders");
  WHITE_GLOVE_ORDERS.forEach((order) => orders.append(createWhiteGloveOrder(order)));
}

function areInstallationStepsComplete() {
  return preferredDeliveryDatesSubmitted
    && deliveryChecklistSubmitted
    && submittedPreInstallChecklists.length === PREINSTALL_CHECKLISTS.length;
}

function getInstallationItemStatus(index) {
  const allStepsComplete = preferredDeliveryDatesSubmitted
    && deliveryChecklistSubmitted
    && submittedPreInstallChecklists.length === PREINSTALL_CHECKLISTS.length;
  if (allStepsComplete) {
    const isApplicable = Object.hasOwn(INSTALLATION_SCHEDULE_DETAILS, index);
    if (!isApplicable || installationStatusScenario === "in-progress") return "—";
    if (installationStatusScenario === "some-scheduled") return "Install scheduled";
    if (installationStatusScenario === "some-installed") return index < 2 ? "Install complete" : "Install scheduled";
    if (installationStatusScenario === "all-installed") return "Install complete";
  }
  return preferredDeliveryDatesSubmitted ? "Awaiting checklist(s)" : "Awaiting action(s)";
}

function getInstallationItemSchedule(index) {
  const status = getInstallationItemStatus(index);
  return status === "Install scheduled" || status === "Install complete"
    ? INSTALLATION_SCHEDULE_DETAILS[index]
    : null;
}

function getInstallationShellType(catalogName) {
  return /astral/i.test(catalogName) ? "Mass spectrometry" : "HPLC";
}

function getInstallationShellIndex(route) {
  const index = Number(route.replace("installation-shell-", ""));
  return Number.isInteger(index) && INSTALLATION_ITEMS[index] ? index : 0;
}

function renderInstallationShellSupport(status) {
  const emptyState = app.querySelector("[data-shell-support-empty]");
  const tableWrap = app.querySelector("[data-shell-support-table]");
  const hasInstallationTicket = status === "—" || status === "Install scheduled" || status === "Install complete";
  emptyState.hidden = hasInstallationTicket;
  tableWrap.hidden = !hasInstallationTicket;
  if (!hasInstallationTicket) return;

  const scheduled = status === "Install scheduled";
  const complete = status === "Install complete";
  const ticketStatus = scheduled ? "In progress" : complete ? "Closed" : "Open";
  const ticketStatusClass = scheduled ? "shell-ticket-status--progress" : complete ? "shell-ticket-status--closed" : "shell-ticket-status--open";
  const ticketIcon = scheduled
    ? '<img class="shell-ticket-icon" src="assets/installations/support-history-installation.svg" alt="" />'
    : "";
  const sortIcon = '<img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" />';
  tableWrap.innerHTML = `
    <table class="${scheduled ? "is-scheduled" : ""}" aria-label="Installation support history">
      <colgroup>
        <col class="shell-ticket-col-spacer" />
        <col class="shell-ticket-col-status" />
        <col class="shell-ticket-col-number" />
        <col class="${scheduled ? "shell-ticket-col-type-scheduled" : "shell-ticket-col-type"}" />
        <col class="shell-ticket-col-created" />
        ${scheduled ? '<col class="shell-ticket-col-scheduled" />' : ""}
        <col class="shell-ticket-col-closed" />
        <col class="${scheduled ? "shell-ticket-col-subject-scheduled" : "shell-ticket-col-subject"}" />
        <col class="${scheduled ? "shell-ticket-col-contact-scheduled" : "shell-ticket-col-contact"}" />
      </colgroup>
      <thead><tr><th></th><th>Status ${sortIcon}</th><th>Ticket no. ${sortIcon}</th><th>Ticket type ${sortIcon}</th><th>Created ${sortIcon}</th>${scheduled ? `<th>Scheduled ${sortIcon}</th>` : ""}<th>Closed ${sortIcon}</th><th>Subject ${sortIcon}</th><th>Ticket contact ${sortIcon}</th></tr></thead>
      <tbody><tr><td>${ticketIcon}</td><td><span class="${ticketStatusClass}">${ticketStatus}</span></td><td><button type="button" data-route="ticket-detail">5551726344</button></td><td>Installation</td><td>18 May 2025</td>${scheduled ? "<td>09 Jul 2025</td>" : ""}<td>${complete ? "12 Jul 2025" : "---"}</td><td title="Lorem ipsum dolor sit amet, consectetur adipiscing elit.">Lorem ipsum dolor sit amet, consectetur adipiscing eli...</td><td>Alma Malmbe</td></tr></tbody>
    </table>`;
}

function renderInstallationShellDetail(route) {
  const index = getInstallationShellIndex(route);
  const [item, , image, catalog, name] = INSTALLATION_ITEMS[index];
  const shellContext = selectedInstallationShellContext?.index === index ? selectedInstallationShellContext : null;
  const status = shellContext?.status || getInstallationItemStatus(index);
  const template = document.querySelector("#installation-shell-detail-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountTopbarSc();
  mountFooter();
  mountPlatformSidebar("installations");
  app.querySelector("[data-shell-flow-title]").textContent = `Shell item ${item}`;
  const shellImage = app.querySelector("[data-shell-image]");
  shellImage.src = `assets/instruments/${image}`;
  shellImage.alt = name;
  app.querySelector("[data-shell-manual-image]").src = `assets/instruments/${image}`;
  app.querySelector("[data-shell-catalog]").textContent = catalog;
  app.querySelector("[data-shell-name]").textContent = name;
  app.querySelector("[data-shell-order]").textContent = shellContext?.orderNumber || "9012611245";
  app.querySelector("[data-shell-type]").textContent = getInstallationShellType(name);
  const statusBadge = app.querySelector("[data-shell-status]");
  statusBadge.textContent = status;
  statusBadge.classList.toggle("shell-detail-status--plain", status === "—");
  statusBadge.classList.toggle("shell-detail-status--scheduled", status === "Install scheduled");
  statusBadge.classList.toggle("shell-detail-status--complete", status === "Install complete");
  statusBadge.classList.toggle("shell-detail-status--cancelled", status === "Cancelled");
  renderInstallationShellSupport(status);
  app.querySelector("[data-shell-manual-title]").textContent = `${catalog} - ${name} Operating Manual`;
  app.querySelectorAll("[data-go-back], [data-shell-back]").forEach((button) => button.addEventListener("click", () => setRoute(shellContext?.returnRoute || (shellContext?.orderNumber === "7659430547" ? "installations-progress" : "installations-expanded"))));
  app.querySelector(".shell-detail-search input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") event.preventDefault();
  });
  app.querySelectorAll('a[href^="#shell-"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      app.querySelector(link.getAttribute("href"))?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  app.querySelectorAll("[data-shell-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const showSupport = tab.dataset.shellTab === "support";
      app.querySelectorAll("[data-shell-tab]").forEach((candidate) => {
        const selected = candidate === tab;
        candidate.classList.toggle("is-active", selected);
        candidate.setAttribute("aria-selected", String(selected));
      });
      app.querySelectorAll("[data-shell-knowledge-panel]").forEach((panel) => { panel.hidden = showSupport; });
      app.querySelector("[data-shell-support-panel]").hidden = !showSupport;
    });
  });
  app.querySelectorAll(".shell-detail-manual button").forEach((button) => button.addEventListener("click", () => {
    showToast("Manual link copied", { title: "Success:", variant: "success" });
  }));
  window.PlatformSidebar?.wire(app);
  wireRouteControls();
  document.title = `${name} — Installation shell — Services Central`;
}

const ADDITIONAL_INSTALLATION_ITEMS = [
  ["19", "2", "6079.4230", "FLOW CELL STD BIO, 8UL, VF/C-D5X"],
  ["20", "2", "17126-032130", "Accucore™ C18 HPLC Columns"],
  ["12", "2", "7200.0300", "Enterprise client"],
  ["15", "1", "704-030000", "3h Chromeleon remote Training 1-4 pers"],
  ["16", "2", "701-057465", "Unity ext warranty"],
];

function replaceInstallationOrderRoute(route, title) {
  const nextUrl = new URL(window.location.href);
  nextUrl.hash = `#${route}`;
  window.history.replaceState({}, "", nextUrl);
  document.title = title;
  syncFlowToolbarTitle();
}

function setInstallationExpanded(expanded, { userInitiated = false, updateStatus = true } = {}) {
  const order = app.querySelector("[data-ins-order]");
  const toggle = app.querySelector("[data-ins-toggle]");
  if (!order || !toggle) return;
  if (userInitiated) installationOrderCollapsedByUser = !expanded;
  order.classList.toggle("is-expanded", expanded);
  toggle.setAttribute("aria-expanded", String(expanded));
  app.querySelectorAll("[data-ins-expanded]").forEach((element) => { element.hidden = !expanded; });
  const route = expanded ? "installations-expanded" : "installations";
  replaceInstallationOrderRoute(route, expanded ? "Installations — order 9012611245 — Services Central" : "Installations — Services Central");
  if (updateStatus) updateInstallationOrderStatus();
}

function setAdditionalInstallationItemsExpanded(expanded) {
  const toggle = app.querySelector("[data-ins-additional-toggle]");
  const panel = app.querySelector("[data-ins-additional-panel]");
  if (!toggle || !panel) return;
  toggle.classList.toggle("is-expanded", expanded);
  toggle.setAttribute("aria-expanded", String(expanded));
  panel.hidden = !expanded;
}

function isProgressPreInstallComplete() {
  return submittedProgressPreInstallChecklists.length === PROGRESS_PREINSTALL_CHECKLISTS.length;
}

function createProgressPreInstallCardMarkup() {
  if (isProgressPreInstallComplete()) {
    return `<div class="ins-action-card__head"><img class="ins-complete" src="assets/icons/notifications/success/size=24px, style=bold.svg" alt="" /><span>Step 3</span><img class="ins-checklist-icon" src="assets/icons/installation/preinstall checklist/size=32px, style=mono.svg" alt="" /></div><h3>Pre-install checklist(s) submitted</h3><p>Thank you! Your checklist(s) have been received.</p><button class="mi-button ins-small-button" type="button" data-open-progress-preinstall-details>View details</button>`;
  }
  return `<div class="ins-action-card__head"><img class="ins-alert" src="assets/icons/notifications/alert/size=24px, style=bold.svg" alt="" /><span>Step 3</span><img class="ins-checklist-icon" src="assets/icons/installation/preinstall checklist/size=32px, style=mono.svg" alt="" /></div><h3>Upload your pre-install checklist(s)<br /><span>(${PROGRESS_PREINSTALL_CHECKLISTS.length - submittedProgressPreInstallChecklists.length} of ${PROGRESS_PREINSTALL_CHECKLISTS.length} remaining)</span></h3><p>Your completed checklist(s) help us verify site readiness and avoid delaying your installation.</p><div class="ins-card-actions"><button class="mi-button ins-small-button" type="button" data-open-progress-preinstall-upload>Upload</button><div class="ins-template-dropdown"><button class="mi-button ins-small-button ins-download" type="button" data-preinstall-template-toggle aria-haspopup="menu" aria-expanded="false" aria-controls="progress-preinstall-template-menu">Download template(s) <img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button><div class="ins-template-menu" id="progress-preinstall-template-menu" role="menu" data-preinstall-template-menu hidden><button type="button" role="menuitem">Download all</button><button type="button" role="menuitem">HPLC template long name</button><button type="button" role="menuitem">Mass spec template long name</button><button type="button" role="menuitem">Third template long name</button></div></div></div><div class="ins-checklist-availability"><span class="ins-checklist-availability__trigger" tabindex="0" aria-describedby="progress-checklist-availability-tooltip"><img src="assets/icons/notifications/prohibited/size=16px, style=bold.svg" alt="" /><span class="ins-checklist-availability__tooltip" id="progress-checklist-availability-tooltip" role="tooltip">We’ve notified our team. If we need any additional documentation, we will contact you. No further action needed at this time.</span></span><span>Certain PDFs may not be available to download.</span></div>`;
}

function wireProgressPreInstallCard(order) {
  order.querySelector("[data-open-progress-preinstall-upload]")?.addEventListener("click", openProgressPreInstallChecklistUploadModal);
  order.querySelector("[data-open-progress-preinstall-details]")?.addEventListener("click", openCompletedProgressPreInstallChecklistModal);
  wirePreInstallTemplateDropdown(order);
}

function getProgressOrderItemStatus(index) {
  if (index === 4) return "Cancelled";
  const checklistComplete = isProgressPreInstallComplete();
  const baseStatus = checklistComplete ? "—" : "Awaiting checklist(s)";
  if (!Object.hasOwn(INSTALLATION_SCHEDULE_DETAILS, index) || progressInstallationStatusScenario === "in-progress") return baseStatus;
  if (progressInstallationStatusScenario === "some-scheduled") return "Install scheduled";
  if (progressInstallationStatusScenario === "some-installed") return index < 2 ? "Install complete" : "Install scheduled";
  if (progressInstallationStatusScenario === "all-installed") return "Install complete";
  return baseStatus;
}

function updateProgressOrderCompletionState() {
  const order = app.querySelector(".ins-order--progress");
  if (!order) return;
  const complete = isProgressPreInstallComplete();
  const installationComplete = progressInstallationStatusScenario === "all-installed";
  order.classList.toggle("is-steps-complete", complete);
  const status = order.querySelector("[data-progress-order-status]");
  status.className = `ins-badge ${complete ? "ins-badge--success" : "ins-badge--danger"}`;
  status.innerHTML = complete
    ? '<img src="assets/icons/actions/checkmark/size=16px, style=bold.svg" alt="" />In progress'
    : '<img src="assets/icons/notifications/alert/size=16px, style=bold.svg" alt="" />Action(s) required';
  status.hidden = installationComplete;
  order.querySelector("[data-progress-order-modified]").hidden = installationComplete;
  const card = order.querySelector("[data-progress-preinstall-card]");
  card.classList.toggle("is-complete", complete);
  card.innerHTML = createProgressPreInstallCardMarkup();
  order.querySelectorAll("[data-progress-item-status]").forEach((cell) => {
    const index = Number(cell.dataset.progressItemIndex);
    const itemStatus = getProgressOrderItemStatus(index);
    const schedule = itemStatus === "Install scheduled" || itemStatus === "Install complete" ? INSTALLATION_SCHEDULE_DETAILS[index] : null;
    const row = cell.closest("tr");
    row.querySelector("[data-progress-item-date]").textContent = schedule?.date || "—";
    row.querySelector("[data-progress-item-engineer]").textContent = schedule?.engineer || "—";
    cell.replaceChildren();
    if (itemStatus === "—") cell.textContent = "—";
    else cell.append(createInstallationItemStatus(itemStatus, index, "progress-7659430547"));
  });
  wireProgressPreInstallCard(order);
}

function setProgressOrderExpanded(order, expanded) {
  order.classList.toggle("is-expanded", expanded);
  order.querySelector("[data-progress-order-toggle]").setAttribute("aria-expanded", String(expanded));
  order.querySelectorAll("[data-progress-expanded]").forEach((element) => { element.hidden = !expanded; });
  replaceInstallationOrderRoute(
    expanded ? "installations-progress" : "installations",
    expanded ? "Installations — order 7659430547 — Services Central" : "Installations — Services Central",
  );
}

function renderProgressStandardOrder(expanded) {
  const order = app.querySelector(".ins-order--secondary");
  if (!order) return;
  const progressComplete = isProgressPreInstallComplete();
  order.className = `ins-order ins-order--primary ins-order--progress${progressComplete ? " is-steps-complete" : ""}${expanded ? " is-expanded" : ""}`;
  order.innerHTML = `
    <header class="ins-order-head">
      <button class="ins-order-toggle" type="button" data-progress-order-toggle aria-expanded="${expanded}" aria-controls="installation-progress-details"><img class="ins-chevron" src="assets/icons/directions/chevron right/size=24px, style=mono.svg" alt="" /><span><strong>Order no.</strong> 7659430547 (Partially available)</span></button>
      <span class="ins-badge ${progressComplete ? "ins-badge--success" : "ins-badge--danger"}" data-progress-order-status>${progressComplete ? '<img src="assets/icons/actions/checkmark/size=16px, style=bold.svg" alt="" />In progress' : '<img src="assets/icons/notifications/alert/size=16px, style=bold.svg" alt="" />Action(s) required'}</span>
      <span class="ins-badge ins-badge--modified" data-progress-order-modified><img src="assets/icons/notifications/info/size=16px, style=bold.svg" alt="" />Order modified</span>
      <button class="mi-button ins-activity" type="button" data-open-installation-activity data-order-number="7659430547">Activity log</button>
    </header>
    <div class="ins-expanded-summary" data-progress-expanded ${expanded ? "" : "hidden"}>
      <div class="ins-summary-box"><img src="assets/icons/features/calendar/size=16px, style=bold.svg" alt="" /><div><strong>Order date</strong><span>26 Jun 2025</span></div></div>
      <div class="ins-summary-box ins-summary-box--users"></div>
    </div>
    <div class="ins-action-cards" id="installation-progress-details">
      <article class="ins-action-card is-complete">${createCompletedDeliveryDatesCardMarkup("7659430547")}</article>
      <article class="ins-action-card is-complete"><div class="ins-action-card__head"><img class="ins-complete" src="assets/icons/notifications/success/size=24px, style=bold.svg" alt="" /><span>Step 2</span><img class="ins-checklist-icon" src="assets/icons/installation/del checklist/size=32px, style=mono.svg" alt="" /></div><h3>Delivery checklist submitted</h3><p>Thank you! Your checklist has been received.</p><button class="mi-button ins-small-button" type="button" data-open-delivery-checklist-details>View details</button></article>
      <article class="ins-action-card${progressComplete ? " is-complete" : ""}" data-progress-preinstall-card>${createProgressPreInstallCardMarkup()}</article>
    </div>
    <div class="ins-items" data-progress-expanded ${expanded ? "" : "hidden"}>
      <table><colgroup><col class="ins-col-item" /><col class="ins-col-qty" /><col class="ins-col-image" /><col class="ins-col-catalog" /><col class="ins-col-checklist-availability" /><col class="ins-col-name" /><col class="ins-col-status" /><col class="ins-col-date" /><col class="ins-col-engineer" /><col class="ins-col-action" /></colgroup><thead><tr><th>Item <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Qty</th><th></th><th>Catalog no. <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th></th><th>Catalog name <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th><button type="button" data-open-installation-status-scenarios data-status-order="7659430547" aria-haspopup="dialog">Status <img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button></th><th>Scheduled date <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Engineer assigned <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Action</th></tr></thead><tbody data-progress-items></tbody></table>
    </div>`;

  const items = order.querySelector("[data-progress-items]");
  INSTALLATION_ITEMS.forEach(([item, qty, image, catalog, name], index) => {
    const row = document.createElement("tr");
    const noChecklistIndicator = index < 3
      ? `<span class="ins-no-checklist" tabindex="0" aria-label="No checklist available" aria-describedby="progress-no-checklist-tooltip-${index}"><img src="assets/icons/general/no document/size=24px, style=mono.svg" alt="" /><span class="ins-no-checklist__tooltip" id="progress-no-checklist-tooltip-${index}" role="tooltip">We’ve notified our team. If we need any additional documentation, we will contact you. No further action needed at this time.</span></span>`
      : "";
    row.innerHTML = `<td>${item}</td><td>${qty}</td><td><img src="assets/instruments/${image}" alt="" /></td><td>${catalog}</td><td class="ins-no-checklist-cell">${noChecklistIndicator}</td><td title="${name}">${name}</td><td class="ins-status-cell" data-progress-item-status data-progress-item-index="${index}"></td><td data-progress-item-date>—</td><td data-progress-item-engineer>—</td><td><button class="ins-view" type="button" data-progress-shell-index="${index}" aria-label="View details for item ${item}, ${name}"${index === 4 ? " disabled" : ""}>View</button></td>`;
    const statusCell = row.querySelector("[data-progress-item-status]");
    const itemStatus = getProgressOrderItemStatus(index);
    if (itemStatus === "—") statusCell.textContent = "—";
    else statusCell.append(createInstallationItemStatus(itemStatus, index, "progress-7659430547"));
    items.append(row);
  });
  order.querySelector("[data-progress-order-toggle]").addEventListener("click", (event) => {
    setProgressOrderExpanded(order, event.currentTarget.getAttribute("aria-expanded") !== "true");
  });
  wireProgressPreInstallCard(order);
  order.querySelectorAll("[data-progress-shell-index]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.progressShellIndex);
    selectedInstallationShellContext = {
      index,
      orderNumber: "7659430547",
      status: getProgressOrderItemStatus(index),
      returnRoute: "installations-progress",
    };
    setRoute(`installation-shell-${index}`);
  }));
  updateProgressOrderCompletionState();
}

function getNoChecklistOrderItemStatus(index) {
  const scenario = noChecklistOrderState.statusScenario;
  if (scenario === "some-scheduled") return "Install scheduled";
  if (scenario === "some-installed") return index < 2 ? "Install complete" : "Install scheduled";
  if (scenario === "all-installed") return "Install complete";
  return "—";
}

function createNoChecklistStepCardMarkup() {
  if (noChecklistOrderState.step3Complete) {
    return `<div class="ins-action-card__head"><img class="ins-complete" src="assets/icons/notifications/success/size=24px, style=bold.svg" alt="" /><span>Step 3</span><img class="ins-checklist-icon" src="assets/icons/general/no document/size=32px, style=mono.svg" alt="" /></div><h3>Pre-install checklist(s) completed</h3><p>All applicable items have been scheduled for installation.</p>`;
  }
  return `<div class="ins-action-card__head"><img class="ins-alert" src="assets/icons/notifications/warning/size=24px, style=bold.svg" alt="" /><span>Step 3</span><img class="ins-checklist-icon" src="assets/icons/general/no document/size=32px, style=mono.svg" alt="" /></div><h3>Pre-install checklist(s)</h3><p>PDFs are not available to download. We’ve notified our team. If we need any additional documentation, we will contact you. No further action needed at this time.</p>`;
}

function setNoChecklistOrderExpanded(order, expanded) {
  noChecklistOrderState.expanded = expanded;
  order.classList.toggle("is-expanded", expanded);
  order.querySelector("[data-no-checklist-toggle]").setAttribute("aria-expanded", String(expanded));
  order.querySelectorAll("[data-no-checklist-expanded]").forEach((element) => { element.hidden = !expanded; });
  replaceInstallationOrderRoute(
    expanded ? "installations-no-checklist" : "installations",
    expanded ? `Installations — order ${NO_CHECKLIST_ORDER_NUMBER} — Services Central` : "Installations — Services Central",
  );
}

function renderNoChecklistOrderState(order) {
  const expanded = noChecklistOrderState.expanded;
  const installationComplete = noChecklistOrderState.statusScenario === "all-installed";
  order.classList.toggle("is-expanded", expanded);
  order.classList.toggle("is-steps-complete", noChecklistOrderState.step3Complete);
  order.querySelector("[data-no-checklist-toggle]").setAttribute("aria-expanded", String(expanded));
  order.querySelectorAll("[data-no-checklist-expanded]").forEach((element) => { element.hidden = !expanded; });
  const card = order.querySelector("[data-no-checklist-step-card]");
  card.className = `ins-action-card ins-action-card--no-checklist${noChecklistOrderState.step3Complete ? " is-complete" : ""}`;
  card.innerHTML = createNoChecklistStepCardMarkup();
  order.querySelector("[data-no-checklist-order-status]").hidden = installationComplete;
  order.querySelectorAll("[data-no-checklist-item-status]").forEach((cell) => {
    const index = Number(cell.dataset.noChecklistItemIndex);
    const itemStatus = getNoChecklistOrderItemStatus(index);
    const schedule = itemStatus === "Install scheduled" || itemStatus === "Install complete" ? NO_CHECKLIST_ORDER_SCHEDULE_DETAILS[index] : null;
    const row = cell.closest("tr");
    row.querySelector("[data-no-checklist-item-date]").textContent = schedule?.date || "—";
    row.querySelector("[data-no-checklist-item-engineer]").textContent = schedule?.engineer || "—";
    cell.replaceChildren();
    if (itemStatus === "—") cell.textContent = "—";
    else cell.append(createInstallationItemStatus(itemStatus, index, `no-checklist-${NO_CHECKLIST_ORDER_NUMBER}`));
  });
}

function createNoChecklistOrder(expanded = false) {
  noChecklistOrderState.expanded = expanded;
  const order = document.createElement("article");
  order.className = "ins-order ins-order--primary ins-order--no-checklist";
  order.dataset.noChecklistOrder = NO_CHECKLIST_ORDER_NUMBER;
  order.innerHTML = `
    <header class="ins-order-head">
      <button class="ins-order-toggle" type="button" data-no-checklist-toggle aria-expanded="${expanded}" aria-controls="no-checklist-order-details"><img class="ins-chevron" src="assets/icons/directions/chevron right/size=24px, style=mono.svg" alt="" /><span><strong>Order no.</strong> ${NO_CHECKLIST_ORDER_NUMBER} (Not available)</span></button>
      <span class="ins-badge ins-badge--success" data-no-checklist-order-status><img src="assets/icons/actions/checkmark/size=16px, style=bold.svg" alt="" />In progress</span>
      <button class="mi-button ins-activity" type="button" data-open-installation-activity data-order-number="${NO_CHECKLIST_ORDER_NUMBER}">Activity log</button>
    </header>
    <div class="ins-expanded-summary" data-no-checklist-expanded ${expanded ? "" : "hidden"}>
      <div class="ins-summary-box"><img src="assets/icons/features/calendar/size=16px, style=bold.svg" alt="" /><div><strong>Order date</strong><span>30 Jun 2025</span></div></div>
      <div class="ins-summary-box ins-summary-box--users"></div>
    </div>
    <div class="ins-action-cards" id="no-checklist-order-details">
      <article class="ins-action-card is-complete">${createCompletedDeliveryDatesCardMarkup(NO_CHECKLIST_ORDER_NUMBER)}</article>
      <article class="ins-action-card is-complete"><div class="ins-action-card__head"><img class="ins-complete" src="assets/icons/notifications/success/size=24px, style=bold.svg" alt="" /><span>Step 2</span><img class="ins-checklist-icon" src="assets/icons/installation/del checklist/size=32px, style=mono.svg" alt="" /></div><h3>Delivery checklist submitted</h3><p>Thank you! Your checklist has been received.</p><button class="mi-button ins-small-button" type="button" data-open-delivery-checklist-details>View details</button></article>
      <article class="ins-action-card ins-action-card--no-checklist" data-no-checklist-step-card>${createNoChecklistStepCardMarkup()}</article>
    </div>
    <div class="ins-items" data-no-checklist-expanded ${expanded ? "" : "hidden"}>
      <table><colgroup><col class="ins-col-item" /><col class="ins-col-qty" /><col class="ins-col-image" /><col class="ins-col-catalog" /><col class="ins-col-checklist-availability" /><col class="ins-col-name" /><col class="ins-col-status" /><col class="ins-col-date" /><col class="ins-col-engineer" /><col class="ins-col-action" /></colgroup><thead><tr><th>Item <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Qty</th><th></th><th>Catalog no. <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th></th><th>Catalog name <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th><button type="button" data-open-installation-status-scenarios data-status-order="${NO_CHECKLIST_ORDER_NUMBER}" aria-haspopup="dialog">Status <img src="assets/icons/directions/caret down/Down caret.svg" alt="" /></button></th><th>Scheduled date <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Engineer assigned <img src="assets/icons/actions/arrows/Size=16px, Style=Mono.svg" alt="" /></th><th>Action</th></tr></thead><tbody data-no-checklist-items></tbody></table>
    </div>`;

  const body = order.querySelector("[data-no-checklist-items]");
  NO_CHECKLIST_ORDER_ITEMS.forEach(([item, qty, image, catalog, name], index) => {
    const sourceIndex = NO_CHECKLIST_ORDER_ITEM_INDEXES[index];
    const row = document.createElement("tr");
    const tooltipId = `no-checklist-order-tooltip-${index}`;
    const noChecklistIndicator = `<span class="ins-no-checklist" tabindex="0" aria-label="No checklist available" aria-describedby="${tooltipId}"><img src="assets/icons/general/no document/size=24px, style=mono.svg" alt="" /><span class="ins-no-checklist__tooltip" id="${tooltipId}" role="tooltip">We’ve notified our team. If we need any additional documentation, we will contact you. No further action needed at this time.</span></span>`;
    row.innerHTML = `<td>${item}</td><td>${qty}</td><td><img src="assets/instruments/${image}" alt="" /></td><td>${catalog}</td><td class="ins-no-checklist-cell">${noChecklistIndicator}</td><td title="${name}">${name}</td><td class="ins-status-cell" data-no-checklist-item-status data-no-checklist-item-index="${index}"></td><td data-no-checklist-item-date>—</td><td data-no-checklist-item-engineer>—</td><td><button class="ins-view" type="button" data-no-checklist-shell-index="${sourceIndex}" aria-label="View details for item ${item}, ${name}">View</button></td>`;
    body.append(row);
  });
  order.querySelector("[data-no-checklist-toggle]").addEventListener("click", (event) => {
    setNoChecklistOrderExpanded(order, event.currentTarget.getAttribute("aria-expanded") !== "true");
  });
  order.querySelectorAll("[data-no-checklist-shell-index]").forEach((button) => button.addEventListener("click", () => {
    const index = Number(button.dataset.noChecklistShellIndex);
    const localIndex = NO_CHECKLIST_ORDER_ITEM_INDEXES.indexOf(index);
    selectedInstallationShellContext = {
      index,
      orderNumber: NO_CHECKLIST_ORDER_NUMBER,
      status: getNoChecklistOrderItemStatus(localIndex),
      returnRoute: "installations-no-checklist",
    };
    setRoute(`installation-shell-${index}`);
  }));
  renderNoChecklistOrderState(order);
  return order;
}

function renderNoChecklistOrder(expanded = false) {
  app.querySelector(".ins-orders")?.append(createNoChecklistOrder(expanded));
}

function wireInstallations(expanded = false, progressExpanded = false, noChecklistExpanded = false) {
  const tbody = app.querySelector("[data-ins-items]");
  INSTALLATION_ITEMS.forEach(([item, qty, image, catalog, name], index) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item}</td><td>${qty}</td><td><img src="assets/instruments/${image}" alt="" /></td><td>${catalog}</td><td title="${name}">${name}</td><td class="ins-status-cell" data-ins-item-status data-ins-item-index="${index}"></td><td data-ins-item-date>—</td><td data-ins-item-engineer>—</td><td><button class="ins-view" type="button" data-ins-shell-index="${index}" aria-label="View details for item ${item}, ${name}">View</button></td>`;
    row.querySelector("[data-ins-item-status]").append(createInstallationItemStatus(getInstallationItemStatus(index), index));
    tbody.append(row);
  });
  const additionalTbody = app.querySelector("[data-ins-additional-items]");
  ADDITIONAL_INSTALLATION_ITEMS.forEach(([item, qty, catalog, name]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item}</td><td>${qty}</td><td><span class="ins-no-image"><img src="assets/icons/media/image/size=16px, style=mono.svg" alt="" /></span></td><td>${catalog}</td><td title="${name}">${name}</td><td>—</td><td>—</td><td>—</td><td></td>`;
    additionalTbody.append(row);
  });
  setInstallationExpanded(expanded);
  setAdditionalInstallationItemsExpanded(false);
  setPreferredDeliveryDatesComplete(preferredDeliveryDatesSubmitted);
  setPreferredDeliveryDatesPaused(deliveryReminderPauseDays);
  setDeliveryChecklistComplete(deliveryChecklistSubmitted);
  setPreInstallChecklistComplete(submittedPreInstallChecklists.length === PREINSTALL_CHECKLISTS.length);
  updatePreInstallChecklistCardCount();
  renderProgressStandardOrder(progressExpanded);
  renderNoChecklistOrder(noChecklistExpanded);
  if (progressExpanded) {
    setInstallationExpanded(false, { updateStatus: false });
    window.history.replaceState({}, "", "#installations-progress");
    document.title = "Installations — order 7659430547 — Services Central";
  } else if (noChecklistExpanded) {
    setInstallationExpanded(false, { updateStatus: false });
    window.history.replaceState({}, "", "#installations-no-checklist");
    document.title = `Installations — order ${NO_CHECKLIST_ORDER_NUMBER} — Services Central`;
  }
  app.querySelector("[data-ins-toggle]").addEventListener("click", (event) => setInstallationExpanded(event.currentTarget.getAttribute("aria-expanded") !== "true", { userInitiated: true }));
  app.querySelector("[data-ins-additional-toggle]").addEventListener("click", (event) => setAdditionalInstallationItemsExpanded(event.currentTarget.getAttribute("aria-expanded") !== "true"));
  app.querySelectorAll("[data-ins-shell-index]").forEach((button) => button.addEventListener("click", () => {
    selectedInstallationShellContext = null;
    setRoute(`installation-shell-${button.dataset.insShellIndex}`);
  }));
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("dashboard"));
  wireAddUserOrderTriggers(app);
  wirePreferredDeliveryDatesTriggers(app);
  wireDeliveryChecklistUploadTriggers(app);
  wireDeliveryChecklistDetailsTriggers(app);
  wirePreInstallChecklistUploadTriggers(app);
  wirePreInstallTemplateDropdown(app);
  wireDeliveryDatesPauseTriggers(app);
  renderWhiteGloveOrders();
  normalizeOrderUsersCards(app);
  wireOrderEmailTooltips(app);
  wireOrderUsersTooltips(app);
  wireAdditionalItemsTooltips(app);
  wireWhiteGloveTooltips(app);
  wireInstallationActivityTriggers(app);
  wireInstallationStatusScenarioTrigger(app);
  wireRouteControls();
}

function renderInstallations(expanded = false, progressExpanded = false, noChecklistExpanded = false) {
  const template = document.querySelector("#installations-native-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountTopbarSc();
  mountFooter();
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
  wireInstallations(expanded, progressExpanded, noChecklistExpanded);
  if (!installationPendingShownForVisit) {
    installationPendingShownForVisit = true;
    if (installationWelcomeFromEmail) {
      installationWelcomeFromEmail = false;
      installationWelcomeDialog.showModal();
    } else {
      refreshInstallationPendingContent();
      installationPendingDialog.showModal();
    }
  }
}

function renderInstallationFaqs() {
  const template = document.querySelector("#installation-faqs-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountTopbarSc();
  mountPlatformSidebar("installations");
  mountFooter();
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute("installations"));
  app.querySelectorAll("[data-ins-action]").forEach((button) => button.addEventListener("click", () => showToast(`${button.dataset.insAction} selected`)));
  wireAddUserOrderTriggers(app);
  wireRouteControls();
  document.title = "Frequently asked questions — Services Central";
}

function renderInstallationSupport() {
  const template = document.querySelector("#installation-support-template");
  app.replaceChildren(template.content.cloneNode(true));
  mountTopbarSc();
  mountPlatformSidebar("request-support");
  mountFooter();
  window.PlatformSidebar?.wire(app);
  const actionBar = window.PlatformActionBar?.mount(app.querySelector("[data-platform-action-bar-mount]"), {
    auxiliaryLabel: "Go to request menu page",
    primaryDisabled: true,
  });
  const form = app.querySelector("[data-installation-support-form]");
  const main = app.querySelector(".isup-main");
  const screen = app.querySelector(".screen--installation-support");
  const stepper = app.querySelector(".isup-steps");
  const submitted = app.querySelector("[data-isup-submitted]");
  const submittedCards = app.querySelector("[data-isup-submitted-cards]");
  const fields = [...app.querySelectorAll("[data-isup-required]")];
  const contactFields = [...app.querySelectorAll("[data-isup-contact-required]")];
  const details = app.querySelector("[data-isup-details]");
  const count = app.querySelector("[data-isup-count]");
  const cancelButton = actionBar.querySelector('[data-actionbar-action="cancel"]');
  const auxiliaryButton = actionBar.querySelector('[data-actionbar-action="auxiliary"]');
  const backButton = actionBar.querySelector('[data-actionbar-action="back"]');
  const continueButton = actionBar.querySelector('[data-actionbar-action="primary"]');
  const leadingActions = actionBar.querySelector(".platform-actionbar__leading");
  const stepPanels = [...app.querySelectorAll("[data-isup-step-panel]")];
  const stepIndicators = [...app.querySelectorAll("[data-isup-step-indicator]")];
  let currentStep = 1;
  let supportSubheaderFrame = 0;
  const updateSupportSubheader = () => {
    if (supportSubheaderFrame) return;
    supportSubheaderFrame = window.requestAnimationFrame(() => {
      supportSubheaderFrame = 0;
      screen.classList.toggle("is-subheader-compact", main.scrollTop > 0);
    });
  };
  main.addEventListener("scroll", updateSupportSubheader, { passive: true });
  const updateSupportScrollClearance = () => {
    const activeContent = currentStep === 4 ? submitted : form;
    const contentBottom = activeContent.offsetTop + activeContent.offsetHeight;
    const requiredClearance = actionBar.offsetHeight + 40;
    main.style.setProperty("--isup-scroll-content-height", `${contentBottom + requiredClearance}px`);
  };
  const orderSelect = app.querySelector("[data-isup-order]");
  const orderValue = app.querySelector("[data-isup-order-value]");
  const orderMenu = app.querySelector("[data-isup-order-menu]");
  const orderOptions = [...app.querySelectorAll("[data-isup-order-option]")];
  const missingOrder = app.querySelector("[data-isup-order-missing]");
  const topicSelect = app.querySelector("[data-isup-topic]");
  const topicValue = app.querySelector("[data-isup-topic-value]");
  const topicMenu = app.querySelector("[data-isup-topic-menu]");
  const topicOptions = [...app.querySelectorAll("[data-isup-topic-option]")];
  const setOrderMenuOpen = (open) => {
    orderMenu.hidden = !open;
    orderSelect.setAttribute("aria-expanded", String(open));
  };
  const setTopicMenuOpen = (open) => {
    topicMenu.hidden = !open;
    topicSelect.setAttribute("aria-expanded", String(open));
  };
  const updateOrderSelection = () => {
    const selectedOrders = orderOptions.filter((option) => option.checked);
    if (missingOrder.checked) {
      orderSelect.value = missingOrder.value;
      orderValue.textContent = "I don’t see my installation order";
    } else if (selectedOrders.length === 1) {
      orderSelect.value = selectedOrders[0].value;
      orderValue.textContent = `Order no. ${selectedOrders[0].value}`;
    } else if (selectedOrders.length > 1) {
      orderSelect.value = selectedOrders.map((option) => option.value).join(",");
      orderValue.textContent = `Order no. ${selectedOrders[0].value} (+${selectedOrders.length - 1})`;
    } else {
      orderSelect.value = "";
      orderValue.textContent = "Please select order(s)";
    }
  };
  const updateFormState = () => {
    count.textContent = `${details.value.length} / 500`;
    continueButton.disabled = currentStep === 1
      ? fields.some((field) => !field.value.trim())
      : contactFields.some((field) => !field.checkValidity());
  };
  const updateReview = () => {
    const selectedOrders = orderOptions.filter((option) => option.checked).map((option) => `Order no. ${option.value}`);
    if (missingOrder.checked) selectedOrders.push("I don’t see my installation order");
    const orders = app.querySelector("[data-isup-review-orders]");
    orders.replaceChildren(...selectedOrders.map((order) => {
      const value = document.createElement("span");
      value.textContent = order;
      return value;
    }));
    app.querySelector("[data-isup-review-topic]").textContent = topicSelect.value;
    app.querySelector("[data-isup-review-details]").textContent = details.value;
    const contactValue = (name) => app.querySelector(`[data-isup-contact-field="${name}"]`).value.trim();
    app.querySelector("[data-isup-review-name]").textContent = `${contactValue("firstName")} ${contactValue("lastName")}`;
    app.querySelector("[data-isup-review-phone]").textContent = contactValue("phone");
    app.querySelector("[data-isup-review-email]").textContent = contactValue("email");
  };
  const setStep = (step) => {
    currentStep = step;
    main.scrollTop = 0;
    updateSupportSubheader();
    screen.classList.remove("is-submitted");
    submitted.hidden = true;
    stepper.hidden = false;
    form.hidden = false;
    leadingActions.hidden = false;
    backButton.textContent = "Back";
    continueButton.hidden = false;
    form.classList.toggle("is-step-two", step === 2);
    form.classList.toggle("is-step-three", step === 3);
    stepPanels.forEach((panel) => { panel.hidden = Number(panel.dataset.isupStepPanel) !== step; });
    stepIndicators.forEach((indicator) => {
      const indicatorStep = Number(indicator.dataset.isupStepIndicator);
      indicator.classList.toggle("is-current", indicatorStep === step);
      indicator.classList.toggle("is-complete", indicatorStep < step);
      if (indicatorStep === step) indicator.setAttribute("aria-current", "step");
      else indicator.removeAttribute("aria-current");
      const marker = indicator.querySelector("span");
      if (indicatorStep < step) {
        marker.innerHTML = '<img src="assets/icons/actions/checkmark/size=24px, style=mono.svg" alt="" />';
      } else {
        marker.textContent = String(indicatorStep);
      }
    });
    auxiliaryButton.hidden = step !== 3;
    continueButton.textContent = step === 3 ? "Submit" : "Continue";
    if (step === 3) updateReview();
    updateFormState();
    updateSupportScrollClearance();
  };
  const showSubmittedSummary = () => {
    currentStep = 4;
    recordInstallationActivity("Submitted installation support request");
    main.scrollTop = 0;
    updateSupportSubheader();
    updateReview();
    const cloneSummaryCard = (selector, label) => {
      const clone = app.querySelector(selector).cloneNode(true);
      clone.removeAttribute("aria-labelledby");
      clone.setAttribute("aria-label", label);
      clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
      return clone;
    };
    submittedCards.replaceChildren(
      cloneSummaryCard(".isup-review-card--request", "Request details"),
      cloneSummaryCard(".isup-review-card--contact", "Contact information"),
    );
    screen.classList.add("is-submitted");
    form.hidden = true;
    stepper.hidden = true;
    submitted.hidden = false;
    leadingActions.hidden = true;
    continueButton.hidden = true;
    backButton.textContent = "Close";
    updateSupportScrollClearance();
  };
  orderSelect.addEventListener("click", () => {
    setTopicMenuOpen(false);
    setOrderMenuOpen(orderSelect.getAttribute("aria-expanded") !== "true");
  });
  orderOptions.forEach((option) => option.addEventListener("change", () => {
    if (option.checked) missingOrder.checked = false;
    updateOrderSelection();
    updateFormState();
  }));
  missingOrder.addEventListener("change", () => {
    if (missingOrder.checked) orderOptions.forEach((option) => { option.checked = false; });
    updateOrderSelection();
    updateFormState();
  });
  topicSelect.addEventListener("click", () => {
    setOrderMenuOpen(false);
    setTopicMenuOpen(topicSelect.getAttribute("aria-expanded") !== "true");
  });
  topicOptions.forEach((option) => option.addEventListener("click", () => {
    topicSelect.value = option.dataset.isupTopicOption;
    topicSelect.classList.add("has-selection");
    topicValue.textContent = option.dataset.isupTopicOption;
    topicOptions.forEach((candidate) => candidate.setAttribute("aria-selected", String(candidate === option)));
    setTopicMenuOpen(false);
    updateFormState();
  }));
  app.querySelector(".screen--installation-support").addEventListener("click", (event) => {
    if (!event.target.closest(".isup-field--order")) setOrderMenuOpen(false);
    if (!event.target.closest(".isup-field--topic")) setTopicMenuOpen(false);
  });
  app.querySelector(".screen--installation-support").addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOrderMenuOpen(false);
      setTopicMenuOpen(false);
    }
  });
  fields.forEach((field) => field.addEventListener("input", updateFormState));
  contactFields.forEach((field) => field.addEventListener("input", updateFormState));
  cancelButton.addEventListener("click", () => setRoute(installationSupportReturnRoute));
  auxiliaryButton.addEventListener("click", () => setRoute("request-support"));
  backButton.addEventListener("click", () => {
    if (currentStep === 4) setRoute(installationSupportReturnRoute);
    else if (currentStep === 3) setStep(2);
    else if (currentStep === 2) setStep(1);
    else setRoute(installationSupportReturnRoute);
  });
  continueButton.addEventListener("click", () => {
    if (currentStep === 1 && !continueButton.disabled) setStep(2);
    else if (currentStep === 2 && !continueButton.disabled) setStep(3);
    else if (currentStep === 3) showSubmittedSummary();
  });
  app.querySelector("[data-isup-close-notice]").addEventListener("click", () => {
    app.querySelector("[data-isup-submitted-notice]").hidden = true;
    updateSupportScrollClearance();
  });
  app.querySelector("[data-go-back]").addEventListener("click", () => setRoute(installationSupportReturnRoute));
  wireRouteControls();
  setStep(1);
  document.title = "Installation support — Services Central";
}

function renderFlow(route) {
  const screen = ROUTES[route];
  const template = document.querySelector("#flow-template");
  app.replaceChildren(template.content.cloneNode(true));
  const section = app.querySelector(".screen--flow");
  const stage = app.querySelector(".flow-stage");
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
  if (screen.emailSkin) {
    stage.classList.add("flow-stage--email-client");
    canvas.classList.add("flow-canvas--fixed-email");
    canvas.style.setProperty("--email-height", `${screen.height}px`);
    const emailSkin = document.createElement("section");
    emailSkin.className = "flow-email-skin";
    emailSkin.setAttribute("aria-label", "Email notification viewer");
    emailSkin.innerHTML = `<header class="flow-email-skin__toolbar"><strong>Inbox</strong><span>${aiEscapeHtml(screen.emailLabel || "Email notification")}</span></header>
      <div class="flow-email-skin__message-header">
        <div><strong>${aiEscapeHtml(screen.emailSubject || screen.title)}</strong><span>${aiEscapeHtml(screen.emailSender || "Thermo Fisher Scientific <notifications@thermofisher.com>")}</span></div>
        <time datetime="2026-08-21T09:41:00">${aiEscapeHtml(screen.emailTime || "Today, 9:41 AM")}</time>
      </div>
      <div class="flow-email-skin__viewport"></div>`;
    canvas.before(emailSkin);
    emailSkin.querySelector(".flow-email-skin__viewport").append(canvas);
  }
  addScreenSpecificHotspots(canvas, route, screen);
  if (route === "installation-order") canvas.querySelector(".flow-cta")?.setAttribute("data-installation-email-entry", "");
  if (route === "service-plan-approval") canvas.querySelector(".flow-cta")?.setAttribute("data-service-plan-email-entry", "");
  wireRouteControls();
  document.title = `${screen.title} — Services Central`;
}

function render() {
  disconnectEditSpcCanvas();
  document.querySelector(".wg-premium-tooltip")?.classList.remove("is-visible");
  let route = routeFromHash();
  if (route === "education" && isKoreaCmdPrototype()) {
    const nextUrl = new URL(window.location.href);
    nextUrl.hash = "#korea-education";
    window.history.replaceState({ regionalRoute: "korea-education" }, "", nextUrl);
    route = "korea-education";
  }
  if (isUnmappedPrototypeUser() && (isInstallationsSectionRoute(route) || route === "installation-support")) {
    const nextUrl = new URL(window.location.href);
    nextUrl.hash = "#dashboard";
    window.history.replaceState({ unavailableRoute: route }, "", nextUrl);
    route = "dashboard";
  }
  const isInstallationsPage = route === "installations" || route === "installations-expanded" || route === "installations-progress" || route === "installations-no-checklist";
  const isInstallationsSection = isInstallationsPage || route === "installation-faqs" || route === "installation-support" || isInstallationShellDetailRoute(route);
  if (!isInstallationsSection) installationPendingShownForVisit = false;
  if (addUserOrderDialog.open) addUserOrderDialog.close();
  if (preferredDeliveryDatesDialog.open && !isInstallationsPage) preferredDeliveryDatesDialog.close();
  if (installationWelcomeDialog.open && !isInstallationsPage) installationWelcomeDialog.close();
  if (servicePlanApprovalDialog.open && route !== "service-plan-contacts") servicePlanApprovalDialog.close();
  if (servicePlanDeclineDialog.open && route !== "service-plan-contacts") servicePlanDeclineDialog.close();
  if (deliveryChecklistUploadDialog.open && !isInstallationsPage) deliveryChecklistUploadDialog.close();
  if (deliveryChecklistConfirmationDialog.open && !isInstallationsPage) deliveryChecklistConfirmationDialog.close();
  if (deliveryDatesConfirmationDialog.open && !isInstallationsPage) deliveryDatesConfirmationDialog.close();
  if (deliveryDatesPauseDialog.open && !isInstallationsPage) deliveryDatesPauseDialog.close();
  if (installationActivityDialog.open && !isInstallationsPage) installationActivityDialog.close();
  if (installationStatusScenariosDialog.open && !isInstallationsPage) installationStatusScenariosDialog.close();
  if (installationPendingDialog.open && !isInstallationsPage) installationPendingDialog.close();
  if (route === "signin") {
    const template = document.querySelector("#sign-in-template");
    app.replaceChildren(template.content.cloneNode(true));
    document.title = "Services Central Sign In";
    wireSignIn();
  } else if (route === "dashboard") {
    const template = document.querySelector("#dashboard-native-template");
    app.replaceChildren(template.content.cloneNode(true));
    mountTopbarSc();
    mountPlatformSidebar("dashboard");
    mountFooter();
    if (shouldShowAccountEmptyState()) applyUnmappedDashboard();
    document.title = "Services Central Dashboard";
    wireDashboard();
  } else if (route === "edit-spc") {
    renderEditSpc();
  } else if (route === "my-instruments") {
    renderMyInstruments();
  } else if (isMiUserDetailRoute(route)) {
    renderMiUserDetail(route);
  } else if (isMiGroupDetailRoute(route)) {
    renderMiGroupDetail(route);
  } else if (isMiSystemDetailRoute(route)) {
    renderMiSystemDetail(route);
  } else if (route === "instrument-1009996") {
    renderInstrumentDetail("1009996");
  } else if (isMiInstrumentDetailRoute(route)) {
    renderInstrumentDetail(route.replace(/^instrument-detail-/, ""));
  } else if (route === "add-instruments") {
    renderAddInstruments();
  } else if (isInstallationsPage) {
    renderInstallations(route === "installations-expanded", route === "installations-progress", route === "installations-no-checklist");
  } else if (route === "installation-faqs") {
    renderInstallationFaqs();
  } else if (route === "installation-support") {
    renderInstallationSupport();
  } else if (isInstallationShellDetailRoute(route)) {
    renderInstallationShellDetail(route);
  } else if (route === "support-history") {
    renderSupportHistory();
  } else if (TICKET_SUMMARIES[route]) {
    renderTicketSummary(route);
  } else if (route === "request-support") {
    renderRequestSupport();
  } else if (route === "request-pm") {
    renderRequestPm();
  } else if (route === "request-pm-direct-review") {
    renderRequestPmDirectReview();
  } else if (route === "request-pm-status") {
    renderRequestPmStatus();
  } else if (route === "request-pm-details") {
    renderRequestPmDetails();
  } else if (route === "request-pm-contact") {
    renderRequestPmContact();
  } else if (route === "request-pm-review") {
    renderRequestPmReview();
  } else if (route === "pm-request-summary") {
    renderPmRequestSummary();
  } else if (route === "request-serviceplan") {
    renderRequestServicePlan();
  } else if (route === "request-serviceplan-details") {
    renderRequestServicePlanDetails();
  } else if (route === "request-serviceplan-contact") {
    renderRequestServicePlanContact();
  } else if (route === "request-serviceplan-review") {
    renderRequestServicePlanReview();
  } else if (route === "serviceplan-summary") {
    renderServicePlanSummary();
  } else if (route === "request-qualification") {
    renderRequestQualification();
  } else if (route === "request-qualification-details") {
    renderRequestQualificationDetails();
  } else if (route === "request-qualification-contact") {
    renderRequestQualificationContact();
  } else if (route === "request-qualification-review") {
    renderRequestQualificationReview();
  } else if (route === "qualification-summary") {
    renderQualificationSummary();
  } else if (route === "request-calibration") {
    renderRequestCalibration();
  } else if (route === "request-calibration-details") {
    renderRequestCalibrationDetails();
  } else if (route === "request-calibration-contact") {
    renderRequestCalibrationContact();
  } else if (route === "request-calibration-review") {
    renderRequestCalibrationReview();
  } else if (route === "calibration-summary") {
    renderCalibrationSummary();
  } else if (route === "request-installation") {
    renderRequestInstallation();
  } else if (route === "open-support-ticket") {
    renderOpenSupportTicket();
  } else if (route === "open-support-ticket-details") {
    renderOpenSupportTicketDetails();
  } else if (route === "open-support-ticket-contact") {
    renderOpenSupportTicketContact();
  } else if (route === "open-support-ticket-review") {
    renderOpenSupportTicketReview();
  } else if (route === "service-plan-contacts") {
    renderServicePlanContacts();
  } else if (route === "contact-page") {
    renderContactPage();
  } else if (route === "consumables") {
    renderConsumables();
  } else if (route === "notifications") {
    renderNotifications();
  } else {
    renderFlow(route);
  }
  syncFlowToolbarTitle();
  window.PlatformTitlebar?.wire(app);
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

FLOW_MENU.forEach(({ label, mode, route, region, placeholder }) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "flow-link";
  button.textContent = label;
  button.addEventListener("click", () => {
    if (placeholder) return;
    flowsDialog.close();
    if (region) startPrototypeRegionalFlow(region, route);
    else if (route) startPrototypeRouteFlow(route);
    else startPrototypeFlow(mode);
  });
  flowsGrid.append(button);
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => helpDialog.close());
});
miEditColumnsDialog.querySelectorAll("[data-mi-edit-columns-close], [data-mi-edit-columns-cancel]").forEach((button) => button.addEventListener("click", () => {
  if (miEditColumnsDialog.dataset.editColumnsContext === "support-history") {
    delete miEditColumnsDialog.dataset.editColumnsContext;
  } else {
    syncMiColumnDialog();
  }
  miEditColumnsDialog.close();
}));
miEditColumnsDialog.querySelector("[data-mi-column-search]").addEventListener("input", (event) => {
  const query = event.currentTarget.value.trim().toLowerCase();
  const rowSelector = miEditColumnsDialog.dataset.editColumnsContext === "support-history" ? "[data-sh-column-row]" : "[data-mi-column-row]";
  miEditColumnsDialog.querySelectorAll(rowSelector).forEach((row) => { row.hidden = query !== "" && !row.dataset.search.includes(query); });
});
miEditColumnsDialog.querySelector("[data-mi-edit-columns-form]").addEventListener("submit", () => {
  if (miEditColumnsDialog.dataset.editColumnsContext === "support-history") {
    supportHistoryVisibleColumns.clear();
    miEditColumnsDialog.querySelectorAll("[data-sh-edit-column]:checked").forEach((checkbox) => supportHistoryVisibleColumns.add(checkbox.dataset.shEditColumn));
    applySupportHistoryColumnVisibility();
    delete miEditColumnsDialog.dataset.editColumnsContext;
    showToast("Column preferences updated");
    return;
  }
  miVisibleColumns.clear();
  miEditColumnsDialog.querySelectorAll("[data-mi-column]:not(:disabled):checked").forEach((checkbox) => miVisibleColumns.add(checkbox.dataset.miColumn));
  applyMiColumnVisibility();
  showToast("Column preferences updated");
});
miEditColumnsDialog.addEventListener("click", (event) => {
  if (event.target === miEditColumnsDialog) {
    if (miEditColumnsDialog.dataset.editColumnsContext === "support-history") {
      delete miEditColumnsDialog.dataset.editColumnsContext;
    } else {
      syncMiColumnDialog();
    }
    miEditColumnsDialog.close();
  }
});
document.querySelector("[data-close-flows]").addEventListener("click", () => flowsDialog.close());
document.querySelectorAll("[data-installation-pending-close], [data-installation-pending-continue]").forEach((button) => button.addEventListener("click", () => installationPendingDialog.close()));
installationWelcomeDialog.querySelectorAll("[data-installation-welcome-close], [data-installation-welcome-continue]").forEach((button) => button.addEventListener("click", () => installationWelcomeDialog.close()));
document.querySelector("[data-close-services-help]").addEventListener("click", closeServicesHelpModal);
installationStatusScenariosDialog.querySelector("[data-close-installation-status-scenarios]").addEventListener("click", () => installationStatusScenariosDialog.close());
installationStatusScenariosDialog.querySelectorAll("[data-installation-status-scenario]").forEach((option) => {
  option.addEventListener("click", () => applyInstallationStatusScenario(option.dataset.installationStatusScenario));
});
installationStatusScenariosDialog.addEventListener("click", (event) => {
  if (event.target === installationStatusScenariosDialog) installationStatusScenariosDialog.close();
});
installationActivityDialog.querySelector("[data-close-installation-activity]").addEventListener("click", () => installationActivityDialog.close());
installationActivityDialog.addEventListener("click", (event) => {
  if (event.target === installationActivityDialog) installationActivityDialog.close();
});
addUserOrderDialog.querySelectorAll("[data-add-user-close]").forEach((button) => button.addEventListener("click", () => addUserOrderDialog.close()));
preferredDeliveryDatesDialog.querySelectorAll("[data-close-delivery-dates]").forEach((button) => button.addEventListener("click", () => preferredDeliveryDatesDialog.close()));
preferredDeliveryDatesDialog.querySelector("[data-cannot-provide-delivery-dates]").addEventListener("click", () => {
  preferredDeliveryDatesDialog.close();
  openDeliveryDatesPauseModal();
});
preferredDeliveryDatesDialog.querySelectorAll("[data-delivery-date-required]").forEach((field) => field.addEventListener("input", updatePreferredDeliveryDatesState));
preferredDeliveryDatesDialog.querySelectorAll("[data-clear-delivery-date]").forEach((button) => button.addEventListener("click", () => {
  const dateField = button.closest(".preferred-delivery-date-field").querySelector("[data-delivery-date-required]");
  dateField.value = "";
  dateField.focus();
  updatePreferredDeliveryDatesState();
}));
preferredDeliveryDatesDialog.querySelector("[data-delivery-dates-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  if (preferredDeliveryDatesDialog.querySelector("[data-submit-delivery-dates]").disabled) return;
  preferredDeliveryDatesDialog.close();
  openDeliveryDatesConfirmationModal();
});
deliveryDatesConfirmationDialog.querySelector("[data-close-delivery-dates-confirmation]").addEventListener("click", () => deliveryDatesConfirmationDialog.close());
deliveryDatesConfirmationDialog.querySelector("[data-edit-delivery-dates]").addEventListener("click", () => {
  deliveryDatesConfirmationDialog.close();
  preferredDeliveryDatesDialog.showModal();
  preferredDeliveryDatesDialog.querySelector("[data-delivery-dates-form]").focus({ preventScroll: true });
});
deliveryDatesConfirmationDialog.querySelector("[data-delivery-dates-confirmation-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const [earliestField, latestField] = preferredDeliveryDatesDialog.querySelectorAll("[data-delivery-date-required]");
  preferredDeliveryDateValues = {
    earliest: formatInstallationActivityDeliveryDate(earliestField.value),
    latest: formatInstallationActivityDeliveryDate(latestField.value),
  };
  preferredDeliveryDatesSubmitted = true;
  deliveryReminderPauseDays = "";
  recordInstallationActivity("Submitted ", "earliest delivery date", `: ${preferredDeliveryDateValues.earliest}`);
  recordInstallationActivity("Submitted ", "latest delivery date", `: ${preferredDeliveryDateValues.latest}`);
  deliveryDatesConfirmationDialog.close();
  setPreferredDeliveryDatesComplete(true);
});
deliveryChecklistUploadDialog.querySelectorAll("[data-close-delivery-checklist-upload]").forEach((button) => button.addEventListener("click", () => deliveryChecklistUploadDialog.close()));
deliveryChecklistUploadDialog.querySelector("[data-delivery-checklist-file]").addEventListener("change", (event) => {
  handleDeliveryChecklistFile(event.currentTarget.files[0]);
  event.currentTarget.blur();
});
deliveryChecklistUploadDialog.querySelector("[data-remove-delivery-checklist-file]").addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  window.clearTimeout(deliveryChecklistUploadTimer);
  deliveryChecklistUploadDialog.querySelector("[data-delivery-checklist-file]").value = "";
  setDeliveryChecklistUploadState("empty");
});
deliveryChecklistUploadDialog.querySelector("[data-cancel-delivery-checklist-upload]").addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  window.clearTimeout(deliveryChecklistUploadTimer);
  deliveryChecklistUploadDialog.querySelector("[data-delivery-checklist-file]").value = "";
  setDeliveryChecklistUploadState("empty");
});
const deliveryChecklistDropzone = deliveryChecklistUploadDialog.querySelector("[data-delivery-checklist-dropzone]");
deliveryChecklistDropzone.addEventListener("dragover", (event) => { event.preventDefault(); deliveryChecklistDropzone.classList.add("is-dragging"); });
deliveryChecklistDropzone.addEventListener("dragleave", () => deliveryChecklistDropzone.classList.remove("is-dragging"));
deliveryChecklistDropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  deliveryChecklistDropzone.classList.remove("is-dragging");
  handleDeliveryChecklistFile(event.dataTransfer.files[0]);
});
deliveryChecklistUploadDialog.querySelector("[data-delivery-checklist-upload-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  if (deliveryChecklistUploadDialog.querySelector("[data-submit-delivery-checklist]").disabled) return;
  deliveryChecklistUploadDialog.close();
  checklistConfirmationContext = "delivery";
  deliveryChecklistConfirmationDialog.showModal();
  deliveryChecklistConfirmationDialog.querySelector("[data-delivery-checklist-confirmation-form]").focus({ preventScroll: true });
});
deliveryChecklistConfirmationDialog.querySelectorAll("[data-close-delivery-checklist-confirmation]").forEach((button) => button.addEventListener("click", () => deliveryChecklistConfirmationDialog.close()));
deliveryChecklistConfirmationDialog.querySelector("[data-delivery-checklist-confirmation-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  deliveryChecklistConfirmationDialog.close();
  if (checklistConfirmationContext === "delivery") {
    deliveryChecklistSubmitted = true;
    recordInstallationActivity("Submitted Delivery checklist");
    setDeliveryChecklistComplete(true);
    showToast("Delivery checklist successfully submitted.", { title: "Success:", variant: "checklist" });
  } else if (checklistConfirmationContext === "preinstall") {
    pendingPreInstallChecklists.forEach((checklist) => {
      if (!submittedPreInstallChecklists.some((submitted) => submitted.id === checklist.id)) {
        submittedPreInstallChecklists.push({ ...checklist, submittedBy: DEFAULT_INSTALLATION_USER_EMAIL });
        recordInstallationActivity("Submitted Pre-installation checklist for ", checklist.name);
      }
    });
    preInstallChecklistsUploaded = submittedPreInstallChecklists.length;
    pendingPreInstallChecklists = [];
    updatePreInstallChecklistCardCount();
    setPreInstallChecklistComplete(preInstallChecklistsUploaded === PREINSTALL_CHECKLISTS.length);
    showToast("Pre-install checklist(s) successfully submitted.", { title: "Success:", variant: "preinstall-checklist" });
  } else if (checklistConfirmationContext === "preinstall-progress") {
    pendingPreInstallChecklists.forEach((checklist) => {
      if (!submittedProgressPreInstallChecklists.some((submitted) => submitted.id === checklist.id)) {
        submittedProgressPreInstallChecklists.push({ ...checklist, submittedBy: DEFAULT_INSTALLATION_USER_EMAIL });
        recordInstallationActivity("Submitted Pre-installation checklist for ", checklist.name, "", "7659430547");
      }
    });
    pendingPreInstallChecklists = [];
    updateProgressOrderCompletionState();
    showToast("Pre-install checklist(s) successfully submitted.", { title: "Success:", variant: "preinstall-checklist" });
  }
  checklistConfirmationContext = "";
});
preInstallChecklistUploadDialog.querySelectorAll("[data-close-preinstall-checklist-upload]").forEach((button) => button.addEventListener("click", () => preInstallChecklistUploadDialog.close()));
preInstallChecklistUploadDialog.querySelectorAll("[data-preinstall-uploader]").forEach((uploader) => {
  const fileInput = uploader.querySelector("[data-preinstall-file]");
  fileInput.addEventListener("change", (event) => {
    handlePreInstallChecklistFile(uploader, event.currentTarget.files[0]);
    event.currentTarget.blur();
  });
  uploader.querySelector("[data-remove-preinstall-file]").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetPreInstallChecklistUploader(uploader);
  });
  uploader.querySelector("[data-cancel-preinstall-upload]").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetPreInstallChecklistUploader(uploader);
  });
  uploader.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (draggedPreInstallUploader) {
      if (uploader !== draggedPreInstallUploader) uploader.classList.add("is-reorder-target");
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    } else {
      uploader.classList.add("is-dragging");
    }
  });
  uploader.addEventListener("dragleave", () => uploader.classList.remove("is-dragging", "is-reorder-target"));
  uploader.addEventListener("drop", (event) => {
    event.preventDefault();
    uploader.classList.remove("is-dragging", "is-reorder-target");
    if (draggedPreInstallUploader) {
      const source = draggedPreInstallUploader;
      swapPreInstallUploaderAssignments(source, uploader);
      clearPreInstallReorderState();
      return;
    }
    handlePreInstallChecklistFile(uploader, event.dataTransfer.files[0]);
  });
  uploader.addEventListener("dragstart", (event) => {
    const handle = event.target.closest("[data-preinstall-drag-handle]");
    if (!handle || uploader.dataset.state !== "uploaded") {
      event.preventDefault();
      return;
    }
    draggedPreInstallUploader = uploader;
    uploader.classList.add("is-reordering");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", getPreInstallUploadedFileName(uploader));
    const preview = document.createElement("div");
    preview.className = "preinstall-upload-drag-preview";
    preview.innerHTML = `<img src="assets/icons/actions/drag & drop/Size=24px, Style=Mono.svg" alt="" /><i></i><img src="assets/icons/notifications/success/size=16px, style=bold.svg" alt="" /><span>${getPreInstallUploadedFileName(uploader)}</span>`;
    document.body.append(preview);
    event.dataTransfer.setDragImage(preview, 28, 20);
    window.setTimeout(() => preview.remove(), 0);
  });
  uploader.addEventListener("dragend", clearPreInstallReorderState);
  uploader.addEventListener("keydown", (event) => {
    const handle = event.target.closest("[data-preinstall-drag-handle]");
    if (!handle || !["ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    const row = uploader.closest(".preinstall-checklist-upload-table__row");
    const sibling = event.key === "ArrowUp" ? row.previousElementSibling : row.nextElementSibling;
    const target = sibling?.querySelector("[data-preinstall-uploader]");
    if (target) swapPreInstallUploaderAssignments(uploader, target);
  });
});
preInstallChecklistUploadDialog.querySelector("[data-preinstall-checklist-upload-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  if (preInstallChecklistUploadDialog.querySelector("[data-submit-preinstall-checklists]").disabled) return;
  const uploadRows = Array.from(preInstallChecklistUploadDialog.querySelectorAll(".preinstall-checklist-upload-table__row"));
  const availableChecklists = preInstallChecklistOrderContext === "7659430547" ? PROGRESS_PREINSTALL_CHECKLISTS : PREINSTALL_CHECKLISTS;
  pendingPreInstallChecklists = uploadRows.flatMap((row, index) => row.querySelector("[data-preinstall-uploader]").dataset.state === "uploaded" && availableChecklists[index] ? [availableChecklists[index]] : []);
  preInstallChecklistUploadDialog.close();
  checklistConfirmationContext = preInstallChecklistOrderContext === "7659430547" ? "preinstall-progress" : "preinstall";
  deliveryChecklistConfirmationDialog.showModal();
  deliveryChecklistConfirmationDialog.querySelector("[data-delivery-checklist-confirmation-form]").focus({ preventScroll: true });
});
preInstallChecklistUploadDialog.querySelector("[data-preinstall-submitted-toggle]").addEventListener("click", (event) => setPreInstallSubmittedExpanded(event.currentTarget.getAttribute("aria-expanded") !== "true"));
const preInstallInstrumentsTooltip = preInstallChecklistUploadDialog.querySelector("[data-preinstall-instruments-tooltip]");
preInstallInstrumentsTooltip.addEventListener("mouseenter", () => window.clearTimeout(preInstallTooltipCloseTimer));
preInstallInstrumentsTooltip.addEventListener("mouseleave", schedulePreInstallInstrumentsTooltipClose);
preInstallInstrumentsTooltip.querySelector("[data-close-preinstall-instruments-tooltip]").addEventListener("click", closePreInstallInstrumentsTooltip);
preInstallChecklistUploadDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !preInstallInstrumentsTooltip.hidden) {
    event.preventDefault();
    closePreInstallInstrumentsTooltip();
  }
});
deliveryChecklistDetailsDialog.querySelectorAll("[data-close-delivery-checklist-details]").forEach((button) => button.addEventListener("click", () => deliveryChecklistDetailsDialog.close()));
deliveryDatesPauseDialog.querySelectorAll("[data-close-delivery-pause]").forEach((button) => button.addEventListener("click", () => deliveryDatesPauseDialog.close()));
deliveryDatesPauseDialog.querySelectorAll("[data-delivery-pause-reason]").forEach((radio) => radio.addEventListener("change", updateDeliveryPauseConfirmState));
deliveryDatesPauseDialog.querySelectorAll("[data-delivery-pause-details]").forEach((field) => field.addEventListener("input", updateDeliveryPauseConfirmState));
deliveryDatesPauseDialog.querySelectorAll("[data-delivery-pause-days]").forEach((button) => button.addEventListener("click", () => setDeliveryPauseDays(button.dataset.deliveryPauseDays)));
deliveryDatesPauseDialog.querySelector("[data-delivery-pause-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  if (deliveryDatesPauseDialog.querySelector("[data-confirm-delivery-pause]").disabled) return;
  const selectedPause = deliveryDatesPauseDialog.querySelector("[data-delivery-pause-days][aria-pressed=\"true\"]").dataset.deliveryPauseDays;
  deliveryReminderPauseDays = selectedPause;
  recordInstallationActivity(`Paused Preferred delivery date submission for ${selectedPause} days`);
  deliveryDatesPauseDialog.close();
  setPreferredDeliveryDatesPaused(selectedPause);
  showToast(`${selectedPause} days snooze confirmed.`, { title: "Success:", variant: "success" });
});
addUserOrderDialog.querySelector("[data-add-user-email]").addEventListener("click", (event) => {
  if (![...addUserOrderDialog.querySelectorAll("[data-add-user-recipient]")].some((checkbox) => checkbox.checked)) event.currentTarget.value = DEFAULT_RECIPIENT_QUERY;
  addUserOrderDialog.querySelector("[data-add-user-query]").textContent = event.currentTarget.value || DEFAULT_RECIPIENT_QUERY;
  setAddUserRecipientDropdownOpen(true);
});
addUserOrderDialog.querySelector("[data-add-user-email]").addEventListener("input", (event) => {
  addUserOrderDialog.querySelector("[data-add-user-query]").textContent = event.currentTarget.value || DEFAULT_RECIPIENT_QUERY;
});
addUserOrderDialog.querySelector("[data-add-user-email-close]").addEventListener("click", (event) => {
  event.stopPropagation();
  clearAddUserRecipients({ keepDropdownOpen: true });
});
addUserOrderDialog.querySelector("[data-add-user-clear-recipients]").addEventListener("click", () => clearAddUserRecipients({ keepDropdownOpen: true }));
addUserOrderDialog.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => checkbox.addEventListener("change", updateAddUserOrderConfirmState));
addUserOrderDialog.querySelector("[data-add-user-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  if (addUserOrderDialog.querySelector("[data-add-user-confirm]").disabled) return;
  addUserOrderDialog.close();
  showToast("Email notification sent to User(s).", { title: "Success:", variant: "success", duration: 6000 });
});
addUserOrderDialog.querySelectorAll("[data-add-user-users]").forEach((button) => button.addEventListener("click", () => showToast(`${button.dataset.addUserUsers} users on this order`)));
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
installationPendingDialog.addEventListener("click", (event) => {
  if (event.target === installationPendingDialog) {
    installationPendingDialog.close();
    return;
  }
  const instrumentsLink = event.target.closest("[data-installation-pending-instruments]");
  if (instrumentsLink) {
    installationPendingDialog.close();
    setRoute("my-instruments");
    return;
  }
  const contactSupportLink = event.target.closest("[data-installation-pending-contact-support]");
  if (contactSupportLink) {
    installationPendingDialog.close();
    openServicesHelpModal(contactSupportLink);
  }
});
installationWelcomeDialog.addEventListener("click", (event) => {
  if (event.target === installationWelcomeDialog) installationWelcomeDialog.close();
});
addUserOrderDialog.addEventListener("click", (event) => {
  if (event.target === addUserOrderDialog) {
    addUserOrderDialog.close();
    return;
  }
  if (!event.target.closest(".add-user-order-modal__email")) setAddUserRecipientDropdownOpen(false);
});
preferredDeliveryDatesDialog.addEventListener("click", (event) => {
  if (event.target === preferredDeliveryDatesDialog) preferredDeliveryDatesDialog.close();
});
deliveryDatesConfirmationDialog.addEventListener("click", (event) => {
  if (event.target === deliveryDatesConfirmationDialog) deliveryDatesConfirmationDialog.close();
});
deliveryChecklistUploadDialog.addEventListener("click", (event) => {
  if (event.target === deliveryChecklistUploadDialog) deliveryChecklistUploadDialog.close();
});
deliveryChecklistConfirmationDialog.addEventListener("click", (event) => {
  if (event.target === deliveryChecklistConfirmationDialog) deliveryChecklistConfirmationDialog.close();
});
deliveryDatesPauseDialog.addEventListener("click", (event) => {
  if (event.target === deliveryDatesPauseDialog) deliveryDatesPauseDialog.close();
});
servicesHelpDialog.addEventListener("click", (event) => {
  if (event.target === servicesHelpDialog) closeServicesHelpModal();
});
window.addEventListener("popstate", render);
window.addEventListener("hashchange", render);
render();
