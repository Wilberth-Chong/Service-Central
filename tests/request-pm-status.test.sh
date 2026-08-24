#!/usr/bin/env bash
set -euo pipefail

# Regression: completing PM instrument selection must open a dedicated
# View PM status step with its five-step progress state and three grouped
# PM-status tables.
pm_status_template=$(sed -n '/<template id="request-pm-status-template">/,/<\/template>/p' index.html)

rg -Fq 'aria-label="View PM status"' <<<"$pm_status_template"
rg -Fq 'Confirmed PM date(s)' <<<"$pm_status_template"
rg -Fq 'Request PM scheduling' <<<"$pm_status_template"
rg -Fq 'Request PM(s)' <<<"$pm_status_template"
rg -Fq 'Promotions applicable for this request type:' <<<"$pm_status_template"
rg -Fq 'data-pm-status-terms' <<<"$pm_status_template"
rg -Fq 'tamara.miller@company.com' <<<"$pm_status_template"
pm_status_wire=$(sed -n '/function wireRequestPmStatus()/,/function renderRequestPmStatus()/p' app.js)
rg -Fq 'assets/icons/general/in systems/size=24px, style=mono.svg' <<<"$pm_status_wire"
rg -Fq 'assets/icons/directions/chevron up/size=24px, style=mono.svg' <<<"$pm_status_wire"
rg -Fq 'chevron ${expanded ? "up" : "down"}/size=24px, style=mono.svg' <<<"$pm_status_wire"
rg -Fq 'if (!row.querySelector(".pm-status-system"))' <<<"$pm_status_wire"
rg -Fq 'pm-status-table--selectable' <<<"$pm_status_wire"
rg -Fq 'headerCheckbox.indeterminate = selected > 0 && selected < rowCheckboxes.length' <<<"$pm_status_wire"
rg -Fq 'data-pm-status-system-toggle' <<<"$pm_status_wire"
rg -Fq 'data-pm-status-terms' <<<"$pm_status_wire"
rg -Fq 'Terms and conditions' <<<"$pm_status_wire"
rg -Fq 'Promotion:Save 35% on your next reversed phase column' <<<"$pm_status_wire"
rg -Fq 'pm-status-terms__panel' <<<"$pm_status_wire"
rg -Fq 'pmRequestDraft.instruments' app.js

pm_flow=$(sed -n '/function wireRequestPm()/,/function wireRequestServicePlan()/p' app.js)
rg -Fq 'setRoute("request-pm-status")' <<<"$pm_flow"

pm_status_render=$(sed -n '/function renderRequestPmStatus()/,/function wireRequestServicePlan()/p' app.js)
rg -Fq 'mountTicketStepViewer(2, {' <<<"$pm_status_render"
rg -Fq 'labels: ["Select instrument(s)", "View PM status", "Add request details", "Confirm contact information", "Review and submit"]' <<<"$pm_status_render"

render_switch=$(sed -n '/function render()/,/window.addEventListener("hashchange"/p' app.js)
rg -Fq 'route === "request-pm-status"' <<<"$render_switch"

pm_details_template=$(sed -n '/<template id="request-pm-details-template">/,/<\/template>/p' index.html)
rg -Fq 'Scheduling request details' <<<"$pm_details_template"
rg -Fq 'PM request details' <<<"$pm_details_template"
rg -Fq 'data-pm-details-field="scheduling"' <<<"$pm_details_template"
rg -Fq 'data-pm-details-field="request"' <<<"$pm_details_template"

pm_details_flow=$(sed -n '/function wireRequestPmStatus()/,/function wireRequestServicePlan()/p' app.js)
rg -Fq 'setRoute("request-pm-details")' <<<"$pm_details_flow"
rg -Fq 'function renderRequestPmDetails()' <<<"$pm_details_flow"

# The Step 2 Continue route must be accepted by the router rather than falling
# through to the sign-in screen.
rg -Fq '"request-pm-details": { title: "Request PM scheduling — add request details"' app.js
